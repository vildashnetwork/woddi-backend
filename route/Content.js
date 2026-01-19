import Content from '../model/Content.js';
import express from "express";
const router = express.Router();
import dotenv from "dotenv";
import Subscriber from "../model/Subscribe.js";
import SibApiV3Sdk from "sib-api-v3-sdk";

dotenv.config();

console.log("content api", process.env.ff)

// Brevo setup
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.ff;
const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// POST new content and send email notification
router.post("/", async (req, res) => {
    try {
        const newContent = new Content(req.body);
        const savedContent = await newContent.save();

        // Fetch all admin emails
        const admins = await Subscriber.find({}, "email").lean();

        if (!admins.length) {
            return res.status(404).json({ error: "No admin accounts found." });
        }

        const recipients = admins.map(admin => ({ email: admin.email }));

        // Subject of the email
        const subject = `Latest News: ${newContent.title}`;

        // HTML email content
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#fde7f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#fbc2eb,#a6c1ee);padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,0.15);overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#ff5fa2,#ff86c8);padding:30px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;letter-spacing:0.5px;">
                Latest News on WODDI
              </h1>
              <p style="margin-top:8px;color:#ffe6f3;font-size:14px;">
                WODDI Platform Notification
              </p>
            </td>
          </tr>

          <!-- Image -->
          <tr>
            <td align="center" style="padding:20px;">
              <img style="height:100px;width:100px;border-radius:50%;" src="${newContent?.imageUrl}" alt="${newContent?.title}" />
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:30px;color:#333333;font-size:15px;line-height:1.6;">
              <p><strong>Title:</strong><br/>${newContent?.title || "Untitled"}</p>
              <hr style="border:none;border-top:1px solid #f0cce0;margin:25px 0;" />
              <p style="margin-bottom:10px;"><strong>Message</strong></p>
              <div style="background:#fff0f7;border-left:5px solid #ff5fa2;padding:18px;border-radius:10px;color:#444;">
                ${newContent?.body || "No message content."}
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
                Open The News →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fafafa;padding:18px;text-align:center;font-size:12px;color:#999;">
              This message was sent securely from the WODDI News system.<br/>
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

        // Prepare email
        const emailData = {
            sender: { email: "liblissz3@gmail.com", name: "WODDI Notifications" },
            to: recipients,
            subject,
            htmlContent,
            textContent: `Hello, check out the latest news: ${newContent.title}`
        };

        // Send email
        await emailApi.sendTransacEmail(emailData);
        console.log(`Email sent to ${admins.length} admin(s)`);

        // Respond with saved content
        res.status(201).json({
            success: true,
            message: `Email sent to ${admins.length} admin(s)`,
            content: savedContent
        });

    } catch (err) {
        console.error("Content creation/email error:", err?.response?.body || err);
        res.status(500).json({ error: "Internal server error" });
    }
});

//get all content
router.get("/", async (req, res) => {
    try {
        const contents = await Content.find().sort({ createdAt: -1 });
        res.status(200).json(contents);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get content by id
router.get("/:id", async (req, res) => {
    try {
        const content = await Content.findById(req.params.id);
        res.status(200).json(content);
    } catch (err) {
        res.status(500).json(err);
    }
});

//update content by id
router.put("/:id", async (req, res) => {
    try {
        const updatedContent = await Content.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedContent);
    } catch (err) {
        res.status(500).json(err);
    }
});

//delete content by id
router.delete("/:id", async (req, res) => {
    try {
        await Content.findByIdAndDelete(req.params.id);
        res.status(200).json("Content has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;