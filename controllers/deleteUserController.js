import mongoose from "mongoose";
import Employee from "../models/Employee.js";

// DELETE: Delete Employee (supports MongoDB _id and employeeId)
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

export default deleteEmployee;
