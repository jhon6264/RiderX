<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verify Your Email - RiderX</title>
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
        .verification-link {
            background: #f7fafc;
            padding: 1rem;
            border: 1px solid #e2e8f0;
            word-break: break-all;
            font-size: 0.8rem;
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
            <h2 style="color: #1a202c; margin-bottom: 1rem;">Verify Your Email Address</h2>
            
            <p>Hello Rider,</p>
            
            <p>Welcome to <strong>RiderX</strong> - Your ultimate destination for motorcycle gear, parts, and accessories!</p>
            
            <p>To complete your registration and start exploring our marketplace, please verify your email address by clicking the button below:</p>

            <div style="text-align: center;">
                <a href="{{ $verificationUrl }}" class="button">Verify Email Address</a>
            </div>

            <p style="font-size: 0.9rem; color: #718096;">
                Or copy and paste this link in your browser:
            </p>
            
            <div class="verification-link">
                {{ $verificationUrl }}
            </div>

            <p><strong>What's next?</strong></p>
            <ul style="color: #4a5568;">
                <li>Browse our premium motorcycle collection</li>
                <li>Explore riding gear and accessories</li>
                <li>Join our rider community</li>
                <li>Get exclusive member deals</li>
            </ul>

            <p>If you did not create an account with RiderX, please ignore this email.</p>

            <p>Ride Safe,<br>
            <strong>The RiderX Team</strong></p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>&copy; {{ date('Y') }} RiderX. All rights reserved.</p>
            <p style="margin: 0.5rem 0; font-size: 0.8rem;">
                Motorcycle Gear • Parts • Accessories
            </p>
            <p style="margin: 0.5rem 0; font-size: 0.8rem;">
                <a href="#" style="color: #e53e3e; text-decoration: none;">Contact Support</a> • 
                <a href="#" style="color: #e53e3e; text-decoration: none;">Privacy Policy</a> • 
                <a href="#" style="color: #e53e3e; text-decoration: none;">Terms of Service</a>
            </p>
        </div>
    </div>
</body>
</html>