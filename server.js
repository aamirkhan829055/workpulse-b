
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import deleteEmployeeRoutes from "./routes/deleteEmployeeRoutes.js";
import editEmployeeRoutes from "./routes/editEmployeeRoutes.js";
import logoutRoutes from "./routes/logoutRoutes.js";
dotenv.config();

const app = express();

// ALLOWED ORIGINS (Support localhost:3000, localhost:3001, live frontend, vercel domains)
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://workpulse-f.vercel.app",
    process.env.FRONTEND_URL,
].filter(Boolean);

// MIDDLEWARE
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (
            allowedOrigins.includes(origin) ||
            /^http:\/\/localhost:\d+$/.test(origin) ||
            /\.vercel\.app$/.test(origin)
        ) {
            return callback(null, true);
        }

        return callback(new Error("Blocked by CORS: " + origin));
    },
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// DATABASE CONNECTION MIDDLEWARE (Ensures DB is connected before any route runs - essential for Vercel/Serverless)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: error.message,
        });
    }
});

// HOME ROUTE
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Backend server is running!",
    });
});

// USER ROUTES
app.use("/api/users", userRoutes);
app.use("/api/users", loginRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/employees/delete", deleteEmployeeRoutes);
app.use("/api/employees/edit", editEmployeeRoutes);
app.use("/api/users", logoutRoutes);

// SERVER START
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
