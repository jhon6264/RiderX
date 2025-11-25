<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Models\Order;
use App\Models\Payment;
use App\Models\ProductVariant;

class PaymentController extends Controller
{
    /**
     * Generate QR code data for GCash payment AND create payment record
     */
    public function generateQR(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,id',
            'gcash_number' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $order = Order::with('user')->find($request->order_id);
            
            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found'
                ], 404);
            }

            // Check if payment already exists, if not create one
            $payment = Payment::where('order_id', $request->order_id)->first();
            
            if (!$payment) {
                $reference_number = 'RIDERX-' . $order->id . '-' . time();
                
                // Get available QR codes (1 and 2 for now)
                $availableQRCodes = [1, 2];
                $qr_number = $availableQRCodes[array_rand($availableQRCodes)];
                
                $payment = Payment::create([
                    'order_id' => $order->id,
                    'amount_paid' => $order->total_amount,
                    'status' => 'pending',
                    'reference_number' => $reference_number,
                    'gcash_number' => $request->gcash_number,
                    'qr_number' => $qr_number,
                    'notes' => 'Waiting for GCash payment verification'
                ]);
            }

            return response()->json([
                'success' => true,
                'qr_number' => $payment->qr_number,
                'reference' => $payment->reference_number,
                'payment_id' => $payment->id,
                'instructions' => 'Send exact amount to GCash number with reference: ' . $payment->reference_number
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate QR: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get another QR code for the same payment
     */
    public function getAnotherQR(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'payment_id' => 'required|exists:payments,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $payment = Payment::find($request->payment_id);
            
            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not found'
                ], 404);
            }

            // Get available QR codes and exclude current one
            $availableQRCodes = [1, 2];
            $currentQR = $payment->qr_number;
            
            // Remove current QR code from available options
            $availableQRCodes = array_filter($availableQRCodes, function($qr) use ($currentQR) {
                return $qr != $currentQR;
            });
            
            if (empty($availableQRCodes)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No other QR codes available'
                ], 400);
            }

            // Select random QR from remaining options
            $new_qr_number = $availableQRCodes[array_rand($availableQRCodes)];
            
            // Update payment with new QR code
            $payment->update([
                'qr_number' => $new_qr_number
            ]);

            return response()->json([
                'success' => true,
                'qr_number' => $new_qr_number,
                'message' => 'New QR code assigned'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get another QR: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload payment screenshot
     */
    public function uploadScreenshot(Request $request)
{
    $validator = Validator::make($request->all(), [
        'payment_id' => 'required|exists:payments,id',
        'screenshot' => 'required|image|mimes:jpg,jpeg,png,gif,webp|max:5120'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $validator->errors()
        ], 422);
    }

    try {
        $payment = Payment::find($request->payment_id);
        
        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found'
            ], 404);
        }

        // Store the screenshot in public directory
        if ($request->hasFile('screenshot')) {
            $file = $request->file('screenshot');
            $filename = 'payment_' . $payment->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            
            // Move file to public/uploads/payment-screenshots/
            $file->move(public_path('uploads/payment-screenshots'), $filename);
            
            // Update payment with screenshot path
            $payment->update([
                'screenshot_path' => $filename
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Screenshot uploaded successfully',
                'screenshot_path' => $filename
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No screenshot file provided'
        ], 400);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to upload screenshot: ' . $e->getMessage()
        ], 500);
    }
}

    /**
     * Check payment status
     */
    public function getPaymentStatus($order_id)
    {
        try {
            $payment = Payment::with('order')->where('order_id', $order_id)->first();
            
            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not found for this order'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'payment' => $payment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get payment status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Manual payment verification (for manual admin checking)
     */
    public function verifyPayment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'payment_id' => 'required|exists:payments,id',
            'actual_amount_received' => 'required|numeric|min:0',
            'verified_by' => 'required|string',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $payment = Payment::with('order')->find($request->payment_id);
            
            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not found'
                ], 404);
            }

            // Check if amount matches exactly
            $expected_amount = $payment->order->total_amount;
            $actual_amount = $request->actual_amount_received;
            
            $status = 'verified';
            $verification_notes = $request->notes;

            if ($actual_amount != $expected_amount) {
                $status = 'failed';
                $verification_notes = "Amount mismatch. Expected: ₱{$expected_amount}, Received: ₱{$actual_amount}. " . $request->notes;
            }

            // Update payment status
            $payment->update([
                'status' => $status,
                'amount_paid' => $actual_amount,
                'verified_by' => $request->verified_by,
                'verified_at' => now(),
                'notes' => $verification_notes
            ]);

            // If payment verified, update order status to 'to_ship'
            if ($status === 'verified') {
                $payment->order->update(['status' => 'to_ship']);
            }

            return response()->json([
                'success' => true,
                'message' => 'Payment verification completed',
                'payment_id' => $payment->id,
                'order_id' => $payment->order_id,
                'expected_amount' => $expected_amount,
                'actual_amount_received' => $actual_amount,
                'status' => $status,
                'order_status_updated' => ($status === 'verified') ? 'to_ship' : 'pending'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to verify payment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payments pending verification
     */
    public function getPendingVerifications()
    {
        try {
            $pending_payments = Payment::with('order.user')
                                ->where('status', 'pending')
                                ->orderBy('created_at', 'desc')
                                ->get();

            return response()->json([
                'success' => true,
                'pending_payments' => $pending_payments,
                'count' => $pending_payments->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get pending verifications: ' . $e->getMessage()
            ], 500);
        }
    }
}