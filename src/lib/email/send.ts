import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: "ShopMM <noreply@shopmm.com>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Email send error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error("Email send exception:", err);
    return { success: false, error: "Failed to send email" };
  }
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(
  email: string,
  orderNumber: string,
  storeName: string,
  total: number,
) {
  return sendEmail({
    to: email,
    subject: `Order Confirmation - ${orderNumber}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #111; font-size: 24px; margin: 0; letter-spacing: -0.5px;">ShopMM</h1>
        </div>
        <div style="background: #f8f9fe; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 16px; font-size: 18px;">အော်ဒါအတည်ပြုပြီးပါပြီ</h2>
          <p style="color: #6b7280; line-height: 1.7;">
            သင့်အော်ဒါကို လက်ခံရရှိပါပြီ။ ဆိုင်မှအတည်ပြုပြီးသည်နှင့် အကြောင်းကြားပါမည်။
          </p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Order Number</td>
              <td style="padding: 8px 0; font-weight: 700; text-align: right;">${orderNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">ဆိုင်</td>
              <td style="padding: 8px 0; text-align: right;">${storeName}</td>
            </tr>
            <tr style="border-top: 1px solid #e2e4f0;">
              <td style="padding: 12px 0; font-weight: 700;">စုစုပေါင်း</td>
              <td style="padding: 12px 0; font-weight: 700; color: #111; text-align: right; font-size: 18px;">
                ${total.toLocaleString()} Ks
              </td>
            </tr>
          </table>
        </div>
        <p style="text-align: center; color: #9ca3af; font-size: 14px;">
          © ${new Date().getFullYear()} ShopMM. All rights reserved.
        </p>
      </div>
    `,
  });
}
