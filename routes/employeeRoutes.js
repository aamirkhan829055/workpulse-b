import express from "express";
import {
    registerEmployee,
    getEmployees,
    deleteEmployee,
    viewEmployee,
} from "../controllers/employeeController.js";
import { editEmployee } from "../controllers/editEmployeeController.js";

const router = express.Router();

// Register Employee
router.post("/register", registerEmployee);

// Get All Employees
router.get("/get-all", getEmployees);

// Edit Employee (supports both /edit/:id and /:id)
router.put("/edit/:id", editEmployee);
router.put("/:id", editEmployee);

// Delete Employee (supports both /delete/:id and /:id)
router.delete("/delete/:id", deleteEmployee);
router.delete("/:id", deleteEmployee);

// View Single Employee
router.get("/view/:id", viewEmployee);

export default router;
