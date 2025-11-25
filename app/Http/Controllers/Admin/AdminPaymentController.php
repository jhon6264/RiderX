<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class AdminPaymentController extends Controller
{
    /**
     * Get all payments for the "All Payments" tab
     */
    public function getAllPayments()
    {
        try {
            $payments = Payment::with(['order.user', 'order.items.variant.product'])
                                ->orderBy('created_at', 'desc')
                                ->get();

            return response()->json([
                'success' => true,
                'payments' => $payments
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch all payments: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get pending payments for verification
     */
    public function getPendingPayments()
    {
        try {
            $pendingPayments = Payment::with(['order.user', 'order.items.variant.product'])
                                ->where('status', 'pending')
                                ->orderBy('created_at', 'desc')
                                ->get();

            return response()->json([
                'success' => true,
                'payments' => $pendingPayments
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch pending payments: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get approved payments
     */
    public function getApprovedPayments()
    {
        try {
            $approvedPayments = Payment::with(['order.user', 'order.items.variant.product'])
                                ->where('status', 'verified')
                                ->orderBy('verified_at', 'desc')
                                ->get();

            return response()->json([
                'success' => true,
                'payments' => $approvedPayments
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch approved payments: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify a payment manually
     */
    public function verifyPayment(Request $request)
    {
        $request->validate([
            'payment_id' => 'required|exists:payments,id',
            'actual_amount_received' => 'required|numeric|min:0',
            'notes' => 'nullable|string'
        ]);

        try {
            DB::beginTransaction();

            $payment = Payment::with('order')->find($request->payment_id);
            
            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not found'
                ], 404);
            }

            $expectedAmount = $payment->order->total_amount;
            $actualAmount = $request->actual_amount_received;

            // Determine status based on amount match
            if ($actualAmount == $expectedAmount) {
                $status = 'verified';
                $notes = $request->notes ?: 'Payment verified successfully';
                
                // Update order status to 'to_ship'
                $payment->order->update(['status' => 'to_ship']);
            } else {
                $status = 'failed';
                $notes = "Amount mismatch. Expected: ₱{$expectedAmount}, Received: ₱{$actualAmount}. " . $request->notes;
                
                // Update order status to 'pending' (waiting for correct payment)
                $payment->order->update(['status' => 'pending']);
            }

            // Update payment
            $payment->update([
                'status' => $status,
                'amount_paid' => $actualAmount,
                'verified_by' => Auth::user()->name,
                'verified_at' => now(),
                'notes' => $notes
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payment verification completed',
                'payment' => $payment->load('order.user'),
                'order_updated' => $status === 'verified'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to verify payment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reject a payment
     */
    public function rejectPayment(Request $request)
    {
        $request->validate([
            'payment_id' => 'required|exists:payments,id',
            'rejection_reason' => 'required|string'
        ]);

        try {
            DB::beginTransaction();

            $payment = Payment::with('order')->find($request->payment_id);
            
            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not found'
                ], 404);
            }

            // Update payment status to rejected
            $payment->update([
                'status' => 'rejected',
                'verified_by' => Auth::user()->name,
                'verified_at' => now(),
                'notes' => 'Payment rejected: ' . $request->rejection_reason
            ]);

            // Update order status to pending (waiting for new payment)
            $payment->order->update(['status' => 'pending']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payment rejected successfully',
                'payment' => $payment->load('order.user')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject payment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payment statistics
     */
    public function getPaymentStats()
    {
        try {
            $stats = [
                'pending_count' => Payment::where('status', 'pending')->count(),
                'verified_count' => Payment::where('status', 'verified')->count(),
                'rejected_count' => Payment::where('status', 'rejected')->count(),
                'failed_count' => Payment::where('status', 'failed')->count(),
                'verified_today' => Payment::where('status', 'verified')
                                    ->whereDate('verified_at', today())
                                    ->count(),
                'total_verified' => Payment::where('status', 'verified')->count(),
                'total_failed' => Payment::where('status', 'failed')->count()
            ];

            return response()->json([
                'success' => true,
                'stats' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch payment stats: ' . $e->getMessage()
            ], 500);
        }
    }
}