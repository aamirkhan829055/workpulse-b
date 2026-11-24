import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER USER API
export const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            mobileNumber,
            password,
            confirmPassword,
        } = req.body;


        // CHECK REQUIRED FIELDS
        if (
            !name ||
            !email ||
            !mobileNumber ||
            !password ||
            !confirmPassword
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // CHECK PASSWORD
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }

        // CHECK EMAIL
        const existingEmail = await User.findOne({
            email: email.toLowerCase(),
        });

        if (existingEmail) {
            return res.status(409).json({
                success: false,
                message: "Email already exists",
            });
        }

        // CHECK MOBILE NUMBER
        const existingMobile = await User.findOne({
            mobileNumber,
        });

        if (existingMobile) {
            return res.status(409).json({
                success: false,
                message: "Mobile number already exists",
            });
        }

        // PASSWORD HASH
        const hashedPassword = await bcrypt.hash(password, 10);

        // CREATE USER
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            mobileNumber,
            password: hashedPassword,
        });

        // GENERATE JWT TOKEN
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );

        // SUCCESS RESPONSE
        return res.status(201).json({
            success: true,
            message: "Registration successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobileNumber: user.mobileNumber,
            },
        });

    } catch (error) {
        console.error("Register Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};