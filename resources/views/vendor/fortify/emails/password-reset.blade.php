<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Reset Your Password - RiderX</title>
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            background: #f8f9fa; 
            font-family: 'Poppins', Arial, sans-serif; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
        }
        .header { 
            background: #1a202c; 
            padding: 2rem; 
            text-align: center; 
            color: white; 
        }
        .header h1 { 
            margin: 0; 
            font-size: 1.8rem; 
            font-weight: 700; 
            text-transform: uppercase; 
            letter-spacing: 1px; 
        }
        .content { 
            padding: 2rem; 
            color: #2d3748; 
        }
        .button { 
            display: inline-block; 
            background: #dc2626; 
            color: white !important; 
            padding: 1rem 2rem; 
            text-decoration: none; 
            border-radius: 0; 
            font-weight: 700; 
            text-transform: uppercase; 
            letter-spacing: 0.5px; 
            margin: 1.5rem 0; 
        }
        .footer { 
            background: #1a202c; 
            padding: 1.5rem; 
            text-align: center; 
            color: #a0aec0; 
            font-size: 0.9rem; 
        }
        .reset-link {
            background: #f7fafc;
            padding: 1rem;
            border: 1px solid #e2e8f0;
            word-break: break-all;
            font-size: 0.8rem;
            margin: 1rem 0;
        }
        .security-note {
            background: #fff5f5;
            border: 1px solid #fed7d7;
            padding: 1rem;
            border-radius: 0;
            margin: 1rem 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>RiderX</h1>
            <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Motorcycle Marketplace</p>
        </div>

        <!-- Content -->
        <div class="content">
            <h2 style="color: #1a202c; margin-bottom: 1rem;">Reset Your Password</h2>
            
            <p>Hello Rider,</p>
            
            <p>You are receiving this email because we received a password reset request for your RiderX account.</p>

            <div style="text-align: center;">
                <a href="{{ $url }}" class="button">Reset Password</a>
            </div>

            <div class="security-note">
                <strong>⚠️ Security Notice:</strong>
                <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">
                    This password reset link will expire in <strong>60 minutes</strong> for your security.
                </p>
            </div>

            <p style="font-size: 0.9rem; color: #718096;">
                Or copy and paste this link in your browser:
            </p>
            
            <div class="reset-link">
                {{ $url }}
            </div>

            <p><strong>Didn't request this change?</strong></p>
            <p>If you did not request a password reset, please ignore this email. Your account remains secure.</p>

            <p>Need help? Contact our support team for immediate assistance.</p>

            <p>Ride Safe,<br>
            <strong>The RiderX Security Team</strong></p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>&copy; {{ date('Y') }} RiderX. All rights reserved.</p>
            <p style="margin: 0.5rem 0; font-size: 0.8rem;">
                Protecting Your Riding Experience
            </p>
            <p style="margin: 0.5rem 0; font-size: 0.8rem;">
                <a href="#" style="color: #e53e3e; text-decoration: none;">Contact Support</a> • 
                <a href="#" style="color: #e53e3e; text-decoration: none;">Security Tips</a> • 
                <a href="#" style="color: #e53e3e; text-decoration: none;">Privacy Policy</a>
            </p>
        </div>
    </div>
</body>
</html>