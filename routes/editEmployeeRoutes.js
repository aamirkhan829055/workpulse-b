import express from "express";
import { editEmployee } from "../controllers/editEmployeeController.js";

const router = express.Router();

router.put("/:id", editEmployee);

export default router; 