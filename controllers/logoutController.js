
import crypto from "crypto";
import jwt from "jsonwebtoken";
import LogoutToken from "../models/LogoutToken.js";

export const logoutUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("➡️ [Logout Request] Authorization Header:", authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is required",
            });
        }

        const token = authHeader.split(" ")[1]?.trim();
        console.log("➡️ [Logout Request] Extracted Token:", token);

        if (!token || token === "{{token}}" || token === "undefined" || token === "null") {
            return res.status(400).json({
                success: false,
                message: "Valid token is missing. Please login first to generate a token.",
            });
        }

        const decoded = jwt.decode(token);

        if (!decoded) {
            return res.status(400).json({
                success: false,
                message: "Invalid token format",
            });
        }

        const expiresAt = decoded.exp
            ? new Date(decoded.exp * 1000)
            : new Date(Date.now() + 24 * 60 * 60 * 1000);

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        await LogoutToken.findOneAndUpdate(
            { token: hashedToken },
            {
                token: hashedToken,
                expiresAt,
            },
            { upsert: true, new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Logout successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
