export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your JalSakhi Account</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f0fdf4; margin: 0; padding: 0; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f0fdf4; padding-bottom: 40px; }
        .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; color: #1f2937; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.025em; }
        .content { padding: 40px 30px; line-height: 1.6; }
        .content h2 { color: #065f46; margin-top: 0; font-size: 20px; }
        .otp-container { background-color: #ecfdf5; border: 2px dashed #10b981; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
        .otp-code { font-size: 42px; font-weight: 800; color: #047857; letter-spacing: 8px; margin: 0; font-family: Monaco, Consolas, monospace; }
        .footer { background-color: #f9fafb; padding: 30px; text-align: center; font-size: 14px; color: #6b7280; }
        .btn { display: inline-block; padding: 14px 28px; background-color: #10b981; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="wrapper">
        <center>
            <table class="main" width="100%">
                <tr>
                    <td class="header">
                        <img src="cid:logo" alt="JalSakhi Logo" style="width: 80px; height: 80px; margin-bottom: 12px; border-radius: 16px;">
                        <h1>JalSakhi 💧</h1>
                    </td>
                </tr>
                <tr>
                    <td class="content">
                        <h2>Welcome to the Future of Farming!</h2>
                        <p>Hello,</p>
                        <p>Thank you for joining <strong>JalSakhi</strong>. To get started with managing your water resources efficiently, please verify your email address: <span style="color: #10b981; font-weight: 600;">{{email}}</span></p>
                        <div class="otp-container">
                            <p style="margin-bottom: 10px; font-weight: 600; color: #065f46; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Your Verification Code</p>
                            <h1 class="otp-code">{{otp}}</h1>
                        </div>
                        <p>This code is valid for <strong>24 hours</strong>. If you didn't request this, please ignore this email.</p>
                        <p>Best regards,<br><strong>Team JalSakhi</strong></p>
                    </td>
                </tr>
                <tr>
                    <td class="footer">
                        <p>© 2026 JalSakhi. Empowering Villages, Saving Water.</p>
                        <p>Made with ❤️ for Indian Farmers</p>
                    </td>
                </tr>
            </table>
        </center>
    </div>
</body>
</html>
`;

export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your JalSakhi Password</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fffbeb; margin: 0; padding: 0; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #fffbeb; padding-bottom: 40px; }
        .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; color: #1f2937; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 30px; line-height: 1.6; }
        .content h2 { color: #92400e; margin-top: 0; font-size: 20px; }
        .otp-container { background-color: #fff7ed; border: 2px dashed #f59e0b; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
        .otp-code { font-size: 42px; font-weight: 800; color: #c2410c; letter-spacing: 8px; margin: 0; font-family: Monaco, Consolas, monospace; }
        .footer { background-color: #f9fafb; padding: 30px; text-align: center; font-size: 14px; color: #6b7280; }
    </style>
</head>
<body>
    <div class="wrapper">
        <center>
            <table class="main" width="100%">
                <tr>
                    <td class="header">
                        <img src="cid:logo" alt="JalSakhi Logo" style="width: 80px; height: 80px; margin-bottom: 12px; border-radius: 16px;">
                        <h1>JalSakhi Security 🛡️</h1>
                    </td>
                </tr>
                <tr>
                    <td class="content">
                        <h2>Password Reset Request</h2>
                        <p>We received a request to reset the password for your JalSakhi account attached to: <span style="color: #d97706; font-weight: 600;">{{email}}</span></p>
                        <div class="otp-container">
                            <p style="margin-bottom: 10px; font-weight: 600; color: #92400e; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Your Reset Code</p>
                            <h1 class="otp-code">{{otp}}</h1>
                        </div>
                        <p>This code is only valid for the next <strong>15 minutes</strong>. If you didn't authorize this password reset, please contact support immediately or change your password if you suspect unauthorized access.</p>
                        <p>Securely yours,<br><strong>Team JalSakhi</strong></p>
                    </td>
                </tr>
                <tr>
                    <td class="footer">
                        <p>© 2026 JalSakhi. Empowering Villages, Saving Water.</p>
                        <p>Security is our top priority 🌾</p>
                    </td>
                </tr>
            </table>
        </center>
    </div>
</body>
</html>
`;


