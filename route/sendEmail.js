import express from "express";
import Admin from "../model/Admin.js";
import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

dotenv.config();

console.log("api key", process.env.ff)

const router = express.Router();

// Brevo setup
const client = SibApiV3Sdk.ApiClient.instance;

client.authentications["api-key"].apiKey = process.env.ff;


const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ error: "Subject and message are required." });
    }

    const admins = await Admin.find({}, "email").lean();

    if (!admins.length) {
      return res.status(404).json({ error: "No admin accounts found." });
    }

    const recipients = admins.map((admin) => ({
      email: admin.email,
    }));

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>New Contact Message</title>
</head>

<body style="margin:0;padding:0;background:#fde7f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  
  <!-- Outer Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#fbc2eb,#a6c1ee);padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,0.15);overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#ff5fa2,#ff86c8);padding:30px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;letter-spacing:0.5px;">
                 New Contact Message
              </h1>
              <p style="margin-top:8px;color:#ffe6f3;font-size:14px;">
                WODDI Platform Notification
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:30px;color:#333333;font-size:15px;line-height:1.6;">

              <!-- Name -->
              <p>
                <strong>
                   Name:
                </strong><br/>
                ${name || "Anonymous"}
              </p>

              <!-- Email -->
              <p>
                <strong>
                   Email:
                </strong><br/>
                ${email || "N/A"}
              </p>

              <!-- Phone -->
              <p>
                <strong>
                   Phone:
                </strong><br/>
                ${phone || "N/A"}
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #f0cce0;margin:25px 0;" />

              <!-- Message -->
              <p style="margin-bottom:10px;">
                <strong> Message</strong>
              </p>

              <div style="background:#fff0f7;border-left:5px solid #ff5fa2;padding:18px;border-radius:10px;color:#444;">
                ${message}
              </div>

            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:30px;">
              <a href="https://woddi.org/admin"
                 style="background:linear-gradient(135deg,#ff5fa2,#ff86c8);
                        color:#ffffff;
                        text-decoration:none;
                        padding:14px 28px;
                        font-size:14px;
                        border-radius:30px;
                        display:inline-block;
                        box-shadow:0 8px 20px rgba(255,95,162,0.4);">
                Open Admin Dashboard →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fafafa;padding:18px;text-align:center;font-size:12px;color:#999;">
              This message was sent securely from the WODDI contact system.<br/>
              © ${new Date().getFullYear()} WODDI Network
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;


    const emailData = {
      sender: {
        email: "liblissz3@gmail.com",
        name: "WODDI Notifications",
      },
      to: recipients,
      subject,
      htmlContent,
    };

    await emailApi.sendTransacEmail(emailData);

    res.status(200).json({
      success: true,
      message: `Email sent to ${admins.length} admin(s).`,
    });
  } catch (error) {
    console.error("Brevo error:", error?.response?.body || error);
    res.status(500).json({ error: "Email service error" });
  }
});

export default router;
