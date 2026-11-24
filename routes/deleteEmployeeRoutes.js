import express from "express";
import { deleteEmployee } from "../controllers/employeeController.js";

const router = express.Router();

router.delete("/:id", deleteEmployee);

export default router;
