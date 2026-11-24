
import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        mobileNumber: {
            type: String,
            required: true,
            trim: true,
        },

        employeeId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        designation: {
            type: String,
            required: true,
            trim: true,
        },

        joiningDate: {
            type: Date,
            required: true,
        },

        password: {
            type: String,
            required: true,
            select: false,
        },
    },
    { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
