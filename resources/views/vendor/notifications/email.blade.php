<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>RiderX</title>
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            background: #f8f9fa; 
            font-family: 'Poppins', Arial, sans-serif; 
            line-height: 1.6; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
        }
        .header { 
            background: #1a202c; 
            padding: 2.5rem 2rem; 
            text-align: center; 
            color: white; 
            border-bottom: 4px solid #dc2626; 
        }
        .content { 
            padding: 2.5rem; 
            color: #2d3748; 
            text-align: center; 
        }
        .button { 
            display: inline-block; 
            background: #dc2626; 
            color: white; 
            padding: 14px 32px; 
            text-decoration: none; 
            border-radius: 0; 
            font-weight: 700; 
            text-transform: uppercase; 
            letter-spacing: 0.5px; 
            font-size: 0.95rem; 
            transition: background 0.3s ease; 
        }
        .button:hover {
            background: #b91c1c;
        }
        .footer { 
            background: #1a202c; 
            padding: 2rem; 
            text-align: center; 
            color: #a0aec0; 
            border-top: 1px solid #2d3748; 
        }
        .security-note {
            background: #fff5f5;
            border-left: 4px solid #dc2626;
            padding: 1rem 1.5rem;
            margin: 1.5rem 0;
            text-align: left;
        }
        .divider {
            height: 1px;
            background: #e2e8f0;
            margin: 2rem 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- RiderX Header -->
        <div class="header" style="background: #1a202c; padding: 2.5rem 2rem; text-align: center; border-bottom: 4px solid #dc2626;">
            <h1 style="margin: 0; font-size: 2.5rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #dc2626; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                RIDERX
            </h1>
        </div>

        <!-- Email Content -->
        <div class="content">
            <!-- Greeting -->
            <h2 style="color: #1a202c; margin: 0 0 1.5rem 0; padding: 2.5rem 2rem; font-size: 1.5rem; font-weight: 600; letter-spacing: 0.5px;">
                Hello Rider!
            </h2>

            <!-- Intro Lines -->
            @foreach ($introLines as $line)
            <p style="margin: 0 0 1rem 0; font-size: 1rem; color: #4a5568; padding-left: 2rem ; line-height: 1.6; letter-spacing: 0.3px;">
                {{ $line }}
            </p>
            @endforeach

            <!-- Action Button -->
            @isset($actionText)
            <div style="margin: 2.5rem 0;">
                <a href="{{ $actionUrl }}" class="button" style="color: white; text-decoration: none; letter-spacing: 1px;">
                    {{ $actionText }}
                </a>
            </div>
            @endisset

            <!-- Security Note for Password Reset -->
            @if(str_contains($actionText ?? '', 'Reset Password'))
            <div class="security-note">
                <strong style="color: #dc2626; display: block; margin-bottom: 0.5rem; letter-spacing: 0.3px;">🔒 Security Notice</strong>
                <p style="margin: 0; font-size: 0.9rem; color: #742a2a; letter-spacing: 0.2px; line-height: 1.5;">
                    This link will expire in <strong>60 minutes</strong> for your protection. 
                    If you didn't request this change, your account remains secure.
                </p>
            </div>
            @endif

            <!-- Divider -->
            <div class="divider"></div>

            <!-- Salutation -->
            <p style="margin: 2rem 0 1rem 0; font-size: 1rem; color: #2d3748; letter-spacing: 0.3px;">
                <strong>Ride Safe,</strong><br>
                <span style="color: #dc2626; font-weight: 700; letter-spacing: 0.5px;">RiderX Team</span>
            </p>
        </div>

        <!-- RiderX Footer -->
        <div class="footer">
            <p style="margin: 0 0 1rem 0; font-size: 1rem; font-weight: 600; color: #e2e8f0; letter-spacing: 1px;">
                RIDERX MARKETPLACE
            </p>
            <p style="margin: 0 0 1rem 0; font-size: 0.9rem; letter-spacing: 0.5px;">
                Helmets • Jackets • Pants • Boots • Gloves
            </p>
            <div style="margin: 1rem 0;">
                <a href="#" style="color: #e53e3e; text-decoration: none; margin: 0 0.75rem; font-size: 0.85rem; letter-spacing: 0.2px;">Contact Support</a> • 
                <a href="#" style="color: #e53e3e; text-decoration: none; margin: 0 0.75rem; font-size: 0.85rem; letter-spacing: 0.2px;">Order</a> • 
                <a href="#" style="color: #e53e3e; text-decoration: none; margin: 0 0.75rem; font-size: 0.85rem; letter-spacing: 0.2px;">FAQ</a>
            </div>
            <p style="margin: 1rem 0 0 0; font-size: 0.8rem; color: #718096; letter-spacing: 0.2px;">
                &copy; {{ date('Y') }} RiderX. All rights reserved.<br>
                123 Motorcycle Lane, Rider City | jhoncristopherpotestas@gmail.com
            </p>
        </div>
    </div>
</body>
</html>