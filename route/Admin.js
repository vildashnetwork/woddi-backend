import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import decodeTokenFromReq from "./decode.js";
import Admin from "../model/Admin.js"
import SibApiV3Sdk from "sib-api-v3-sdk";

dotenv.config();

console.log("admin api", process.env.ff)

const router = express.Router();
const SALT_ROUNDS = 10;




// Brevo setup
const client = SibApiV3Sdk.ApiClient.instance;

client.authentications["api-key"].apiKey = process.env.ff;


const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "15d" }
    );
};


const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


// router.post("/register", async (req, res) => {
//     try {
//         // extract fields and normalize interest to an array of strings
//         let { name, email, password, profile } = req.body;

//         // {
//         //   "apikey": "BETwjrTGdrFHdH1nlpttiwx3qsP0j_2OzMD-8IwaWAxMToE1"
//         // }


//         if (!name || !email || !password) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         // Validate email format
//         if (!validateEmail(email)) {
//             return res.status(400).json({ message: "Invalid email format" });
//         }



//         // Check if email exists
//         if (await Admin.findOne({ email })) {
//             return res.status(409).json({ message: "Email already exists" });
//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

//         const newUser = new Admin({
//             name,
//             email,
//             password: hashedPassword,
//             profile: profile || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
//         });



//         const savedUser = await newUser.save();

//         const token = generateToken(savedUser);



//         const htmlContent = `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8" />
//   <title>New Contact Message</title>
// </head>

// <body style="margin:0;padding:0;background:#fde7f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">

//   <!-- Outer Wrapper -->
//   <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#fbc2eb,#a6c1ee);padding:40px 0;">
//     <tr>
//       <td align="center">

//         <!-- Card -->
//         <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,0.15);overflow:hidden;">

//           <!-- Header -->
//           <tr>
//             <td style="background:linear-gradient(135deg,#ff5fa2,#ff86c8);padding:30px;text-align:center;">
//               <h1 style="margin:0;color:#ffffff;font-size:28px;letter-spacing:0.5px;">
//                 You Are Now And Admin
//               </h1>
//               <p style="margin-top:8px;color:#ffe6f3;font-size:14px;">
//                 WODDI Platform Notification
//               </p>
//             </td>
//           </tr>

//           <!-- Content -->
//           <tr>
//             <td style="padding:30px;color:#333333;font-size:15px;line-height:1.6;">

//               <!-- Name -->
//               <p>
//                 <strong>
//                  Your User  Name:
//                 </strong><br/>
//                 ${name.split("&")[0]}
//               </p>

//               <p>
//                 <strong>
//                  Your Position In The Organization:
//                 </strong><br/>
//                 ${name.split("&")[1]}
//               </p>

//               <!-- Email -->
//               <p>
//                 <strong>
//                 Your   Email:
//                 </strong><br/>
//                 ${email}
//               </p>



//               <!-- Divider -->
//               <hr style="border:none;border-top:1px solid #f0cce0;margin:25px 0;" />

//               <!-- Message -->
//               <p style="margin-bottom:10px;">
//                 <strong> Your Profile</strong>
//               </p>

//               <div style="background:#fff0f7;border-left:5px solid #ff5fa2;padding:18px;border-radius:10px;color:#444;">
//                <img style="height: 100px; width: 100px;" src=${profile} alt=${name}/>



//               </div>

//             </td>
//           </tr>

//           <!-- CTA -->
//           <tr>
//             <td align="center" style="padding:30px;">
//               <a href="https://woddi.org/admin"
//                  style="background:linear-gradient(135deg,#ff5fa2,#ff86c8);
//                         color:#ffffff;
//                         text-decoration:none;
//                         padding:14px 28px;
//                         font-size:14px;
//                         border-radius:30px;
//                         display:inline-block;
//                         box-shadow:0 8px 20px rgba(255,95,162,0.4);">
//                 Open Admin Dashboard →
//               </a>
//             </td>
//           </tr>

//           <!-- Footer -->
//           <tr>
//             <td style="background:#fafafa;padding:18px;text-align:center;font-size:12px;color:#999;">
//               This message was sent securely from the WODDI Admin system.<br/>
//               © ${new Date().getFullYear()} WODDI Network
//             </td>
//           </tr>

//         </table>

//       </td>
//     </tr>
//   </table>

// </body>
// </html>
// `;

//         const emailData = {
//             sender: {
//                 email: "liblissz3@gmail.com",
//                 name: "WODDI Notifications",
//             },
//             to: [
//                 {
//                     email: email,
//                     name: name || "User",
//                 },
//             ],
//             subject: "Welcome to WODDI - You are now an Admin",
//             htmlContent,
//         };

//         await emailApi.sendTransacEmail(emailData);

//         res.status(201).json({
//             message: "Registration successful and email sent to user",
//             token,
//             newUser
//         });




//     } catch (err) {
//         console.error("Registration error:", err);
//         console.error("Brevo error:", error?.response?.body || error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });



router.post("/register", async (req, res) => {
    try {
        const { name, email, password, profile } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Check if email already exists
        if (await Admin.findOne({ email })) {
            return res.status(409).json({ message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Create new admin user
        const newUser = new Admin({
            name,
            email,
            password: hashedPassword,
            profile:
                profile ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                    name
                )}`,
        });

        const savedUser = await newUser.save();

        const token = generateToken(savedUser);

        // HTML email content
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Welcome to WODDI</title>
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
                You Are Now An Admin
              </h1>
              <p style="margin-top:8px;color:#ffe6f3;font-size:14px;">
                WODDI Platform Notification
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:30px;color:#333333;font-size:15px;line-height:1.6;">

              <p><strong>Your User Name:</strong><br/>${name.split("&")[0]}</p>
              <p><strong>Your Position In The Organization:</strong><br/>${name.split("&")[1] || "Admin"}</p>
              <p><strong>Your Email:</strong><br/>${email}</p>
              <p><strong>Your Password:</strong><br/>${password}</p>

              <hr style="border:none;border-top:1px solid #f0cce0;margin:25px 0;" />

              <p style="margin-bottom:10px;"><strong>Your Profile</strong></p>
              <div style="background:#fff0f7;border-left:5px solid #ff5fa2;padding:18px;border-radius:10px;color:#444;text-align:center;">
                <img style="height:100px;width:100px;border-radius:50%;" src="${profile ||
            newUser.profile}" alt="${name}" />
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
              This message was sent securely from the WODDI Admin system.<br/>
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
            sender: { email: "liblissz3@gmail.com", name: "WODDI Notifications" },
            to: [{ email, name: name || "User" }],
            subject: "Welcome to WODDI - You are now an Admin",
            htmlContent,
            textContent: `Hello ${name.split("&")[0]}, you are now an admin on WODDI. Your email is ${email}.`,
        };

        try {
            await emailApi.sendTransacEmail(emailData);
            console.log("Email sent successfully to:", email);
        } catch (err) {
            console.error("Brevo send error:", err?.response?.body || err);
        }

        res.status(201).json({
            message: "Registration successful and email sent to user",
            token,
            newUser,
        });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


const sanitizeUser = (user) => {
    const obj = user.toObject();
    delete obj.password;
    return obj;
};

//login as owner
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email or phone number and password are required",
            });
        }


        const user = await Admin.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user?.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user);

        res.status(200).json({
            message: "Login successful",
            token,
            user: sanitizeUser(user),
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});




router.get("/decode/token/admin", async (req, res) => {
    try {
        // call decode helper with the full request so it can check body, headers or cookies
        const result = decodeTokenFromReq(req);

        if (!result || !result.ok) {
            return res.status(result && result.status ? result.status : 401).json({ message: result && result.message ? result.message : "Failed to decode token" });
        }


        //find the owner by id from payload
        const owner = await Admin.findById(result.payload.id);
        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }


        return res.status(200).json({ res: owner });


    } catch (error) {
        console.error("Token decode error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



router.put("/edit/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            email,
            profile,
        } = req.body;

        const updatedUser = await Admin.findByIdAndUpdate(
            id,
            {
                $set: {
                    name,
                    email,
                    profile,
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});



router.get("/all", async (req, res) => {
    try {
        const owners = await Admin.find({});
        res.status(200).json({ owners });
    }
    catch (error) {
        console.error("Fetch all owners error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.get("/one/:id", async (req, res) => {
    try {
        const { id } = req.params
        const owners = await Admin.findById(id);
        res.status(200).json({ owners });
    }
    catch (error) {
        console.error("Fetch all owners error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


//delete user by Id

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAdmin = await Admin.findByIdAndDelete(id);

        if (!deletedAdmin) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("Delete admin error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


//update admin settings
router.put("/settings/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { settings } = req.body;
        const updatedAdmin = await Admin.findByIdAndUpdate(
            id,
            { $set: { settings } },
            { new: true }
        );
        if (!updatedAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.status(200).json({
            message: "Settings updated successfully",
            settings: updatedAdmin.settings
        });
    } catch (error) {
        console.error("Update settings error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router