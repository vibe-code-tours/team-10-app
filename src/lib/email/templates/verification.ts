export function getVerificationEmailHtml(
  confirmUrl: string,
  fullName?: string,
): string {
  const greetingName = fullName ? `, ${fullName}` : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Email - Yoe Yar Zay</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f9;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e7eb;
    }
    .email-header {
      background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
      padding: 36px 32px;
      text-align: center;
    }
    .brand-title {
      color: #ffffff;
      font-size: 26px;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.5px;
      display: inline-block;
    }
    .email-body {
      padding: 40px 32px;
      color: #374151;
    }
    .greeting {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .message-text {
      font-size: 15px;
      line-height: 1.7;
      color: #4b5563;
      margin-bottom: 28px;
    }
    .btn-container {
      text-align: center;
      margin: 32px 0;
    }
    .verify-btn {
      display: inline-block;
      background-color: #007bff;
      color: #ffffff !important;
      font-size: 15px;
      font-weight: 700;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 30px;
      box-shadow: 0 4px 12px rgba(0, 123, 255, 0.25);
    }
    .subtext {
      font-size: 13px;
      color: #6b7280;
      line-height: 1.6;
      border-top: 1px solid #f3f4f6;
      padding-top: 24px;
      margin-top: 32px;
    }
    .link-alt {
      color: #007bff;
      word-break: break-all;
    }
    .email-footer {
      background-color: #f9fafb;
      padding: 24px 32px;
      text-align: center;
      border-top: 1px solid #f3f4f6;
    }
    .footer-text {
      font-size: 12px;
      color: #9ca3af;
      margin: 4px 0;
    }
    .footer-link {
      color: #6b7280;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1 class="brand-title">🛍️ Yoe Yar Zay</h1>
    </div>
    
    <div class="email-body">
      <h2 class="greeting">Welcome to Yoe Yar Zay${greetingName}!</h2>
      <p class="message-text">
        Thank you for signing up for Yoe Yar Zay! Please click the button below to verify your email address and activate your account.
      </p>
      
      <div class="btn-container">
        <a href="${confirmUrl}" class="verify-btn" target="_blank">Verify Email Address</a>
      </div>

      <p class="message-text">
        If you did not create an account with Yoe Yar Zay, you can safely ignore this email.
      </p>
      
      <div class="subtext">
        If the button above does not work, copy and paste the following URL into your browser:<br>
        <a href="${confirmUrl}" class="link-alt">${confirmUrl}</a>
      </div>
    </div>
    
    <div class="email-footer">
      <p class="footer-text">© ${new Date().getFullYear()} Yoe Yar Zay. All rights reserved.</p>
      <p class="footer-text">Need assistance? Contact us at <a href="mailto:support@yoeyarzay.com" class="footer-link">support@yoeyarzay.com</a></p>
    </div>
  </div>
</body>
</html>`;
}
