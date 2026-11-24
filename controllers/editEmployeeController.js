import mongoose from "mongoose";
import Employee from "../models/Employee.js";

export const editEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        // Only allow valid fields to be updated
        const {
            fullName,
            email,
            mobileNumber,
            employeeId,
            designation,
            joiningDate,
        } = req.body;

        const updatedData = {};
        if (fullName !== undefined) updatedData.fullName = fullName;
        if (email !== undefined) updatedData.email = email.toLowerCase().trim();
        if (mobileNumber !== undefined) updatedData.mobileNumber = mobileNumber;
        if (employeeId !== undefined) updatedData.employeeId = employeeId;
        if (designation !== undefined) updatedData.designation = designation;
        if (joiningDate !== undefined) updatedData.joiningDate = joiningDate;

        if (Object.keys(updatedData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide employee details to update",
            });
        }

        let updatedEmployee = null;

        // 1. Try finding by MongoDB _id if it's a valid 24-character ObjectId
        if (mongoose.Types.ObjectId.isValid(id)) {
            updatedEmployee = await Employee.findByIdAndUpdate(
                id,
                { $set: updatedData },
                {
                    new: true,
                    runValidators: true,
                }
            );
        }

        // 2. If not found by _id, try finding by custom employeeId (e.g. "875" or "EMP001")
        if (!updatedEmployee) {
            updatedEmployee = await Employee.findOneAndUpdate(
                { employeeId: id },
                { $set: updatedData },
                {
                    new: true,
                    runValidators: true,
                }
            );
        }

        if (!updatedEmployee) {
            return res.status(404).json({
                success: false,
                message: `Employee not found with ID: ${id}`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            data: updatedEmployee,
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email or Employee ID already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export default editEmployee;