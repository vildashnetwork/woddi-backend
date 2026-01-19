// import fetch from "node-fetch";
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";


import "./auth/passport.js";


//routes 
import content from "./route/Content.js"
import donation from "./route/Donation.js"
import user from "./route/User.js"
import program from "./route/Program.js"
import updates from "./route/updates.js"
import mediagelary from "./route/MediaGallery.js"
import testimonial from "./route/Testimonial.js"
import admin from "./route/Admin.js"
import subcribe from "./route/Subscriber.js"
import email from "./route/sendEmail.js"

import applicationRoutes from "./route/application.routes.js";


dotenv.config();
const app = express();



// const URL = "https://wiciki-media-backend.onrender.com/ping";
// function scheduleRandomPing() {
//     const minutes = Math.floor(Math.random() * 11) + 5; // every 5–15 mins
//     cron.schedule(`*/${minutes} * * * *`, async () => {
//         try {
//             await fetch(URL);
//             console.log("pinged");
//         } catch (e) {
//             console.error("ping failed", e.message);
//         }
//     });
// }
// scheduleRandomPing();

// --- core settings ---
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = "http://localhost:8080";
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;
const isProd = process.env.NODE_ENV === "production";

// trust proxy for Render/Heroku
if (isProd) app.set("trust proxy", 1);

// --- middleware ---
app.use(helmet());
app.use(morgan(":method :url :status :response-time ms - :res[content-length]"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());




const allowedOrigins = [
    "https://woddi.onrender.com",
    "http://localhost:8080",
    FRONTEND_URL,
    "http://localhost:8081",
    "http://localhost:8082",
    "https://woddi-dashboard.onrender.com",

];


app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) callback(null, true);
            else callback(new Error("Not allowed by CORS"));
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    })
);

// --- session + passport ---
app.use(
    session({
        secret: process.env.SESSION_SECRET || "change-me",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "lax" : "none",
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

// --- routes ---
app.use("/api/admin", admin)
app.use("/api/content", content)
app.use("/api/donation", donation)
app.use("/api/user", user)
app.use("/api/program", program)
app.use("/api/updates", updates)
app.use("/api/mediagelary", mediagelary)
app.use("/api/subscribe", subcribe)
app.use("/api/applications", applicationRoutes);
app.use("/api/testimonial", testimonial)
app.use("/api/email", email)
app.get("/", (req, res) => res.send("Hello, World!"));


const COOKIE_NAME = "token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

// ===================================================
// ✅ GOOGLE OAUTH (WEB + DESKTOP)
// ===================================================

const FRONTEND = "http://localhost:5173";
const DESKTOP_LOCALHOST_CALLBACK = "http://127.0.0.1:3100/auth";

// helper to detect desktop flow
function isDesktopFlow(req) {
    return (
        (req.query && req.query.state === "desktop") ||
        (req.session && req.session.oauthState === "desktop")
    );
}

// web OAuth start
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// desktop OAuth start (set session flag)
app.get("/auth/google/desktop", (req, res, next) => {
    if (req.session) req.session.oauthState = "desktop";
    passport.authenticate("google", {
        scope: ["profile", "email"],
        state: "desktop",
    })(req, res, next);
});

// single callback for both web + desktop
app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: `${FRONTEND}/login-failed` }),
    (req, res) => {
        try {
            if (!req.user) {
                console.error("No user found on req in callback");
                return res.redirect(`${FRONTEND}/login-failed`);
            }

            const token = jwt.sign(
                { id: req.user._id, email: req.user.email },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            const desktop = isDesktopFlow(req);

            if (!desktop) {
                // --- Web flow ---
                res.cookie(COOKIE_NAME, token, {
                    httpOnly: true,
                    secure: isProd,
                    sameSite: isProd ? "none" : "lax",
                    maxAge: COOKIE_MAX_AGE,
                });
                return res.redirect(`${FRONTEND}/auth?token=${encodeURIComponent(token)}`);
            }

            // --- Desktop flow ---
            const redirectUrl = `${DESKTOP_LOCALHOST_CALLBACK}?token=${encodeURIComponent(token)}`;
            console.log("🔗 Redirecting desktop OAuth callback to:", redirectUrl);
            return res.redirect(redirectUrl);
        } catch (err) {
            console.error("Error in google callback:", err);
            return res.redirect(`${FRONTEND}/login-failed`);
        }
    }
);

// logout
app.get("/auth/logout", (req, res, next) => {
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "lax" : "none",
    });
    req.logout(err => {
        if (err) return next(err);
        return res.redirect(FRONTEND_URL);
    });
});

// ===================================================
// ✅ DATABASE + SERVER START
// ===================================================

const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Database connected");
    } catch (error) {
        console.error("❌ Mongo connect error:", error);
        process.exit(1);
    }
};

connectdb().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on ${BACKEND_URL}`));
});
