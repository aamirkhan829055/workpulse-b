
import mongoose from "mongoose";
import Employee from "../models/Employee.js";
import bcrypt from "bcryptjs";

// POST: Register Employee
export const registerEmployee = async (req, res) => {
    try {
        const {
            fullName,
            email,
            mobileNumber,
            employeeId,
            designation,
            joiningDate,
            password,
            confirmPassword,
        } = req.body;

        if (
            !fullName ||
            !email ||
            !mobileNumber ||
            !employeeId ||
            !designation ||
            !joiningDate ||
            !password ||
            !confirmPassword
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password does not match",
            });
        }

        const existingEmployee = await Employee.findOne({
            $or: [
                { email: email.toLowerCase() },
                { employeeId },
            ],
        });

        if (existingEmployee) {
            return res.status(409).json({
                success: false,
                message: "Employee already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const employee = await Employee.create({
            fullName,
            email: email.toLowerCase(),
            mobileNumber,
            employeeId,
            designation,
            joiningDate,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: "Employee registered successfully",
            data: {
                id: employee._id,
                fullName: employee.fullName,
                email: employee.email,
                mobileNumber: employee.mobileNumber,
                employeeId: employee.employeeId,
                designation: employee.designation,
                joiningDate: employee.joiningDate,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET: Get All Employees
export const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find()
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Employees fetched successfully",
            totalEmployees: employees.length,
            data: employees,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// DELETE: Delete Employee (by MongoDB _id or employeeId)
export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        let deletedEmployee = null;

        if (mongoose.Types.ObjectId.isValid(id)) {
            deletedEmployee = await Employee.findByIdAndDelete(id);
        }

        if (!deletedEmployee) {
            deletedEmployee = await Employee.findOneAndDelete({ employeeId: id });
        }

        if (!deletedEmployee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Employee deleted successfully",
            data: deletedEmployee,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET: View Single Employee Details (by MongoDB _id or employeeId)
export const viewEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        let employee = null;

        if (mongoose.Types.ObjectId.isValid(id)) {
            employee = await Employee.findById(id).select("-password");
        }

        if (!employee) {
            employee = await Employee.findOne({ employeeId: id }).select("-password");
        }

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });

        }

        return res.status(200).json({
            success: true,
            message: "Employee details fetched successfully",
            data: {
                id: employee._id,
                fullName: employee.fullName,
                email: employee.email,
                mobileNumber: employee.mobileNumber,
                employeeId: employee.employeeId,
                designation: employee.designation,
                joiningDate: employee.joiningDate
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export { editEmployee } from "./editEmployeeController.js";


