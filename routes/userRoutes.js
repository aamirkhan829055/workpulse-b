import express from "express";
import { registerUser } from "../controllers/userController.js";
import { deleteEmployee } from "../controllers/employeeController.js";

const router = express.Router();

// REGISTER API
router.post("/register", registerUser);

// DELETE USER / EMPLOYEE
router.delete("/delete/:id", deleteEmployee);
router.delete("/:id", deleteEmployee);

export default router;
