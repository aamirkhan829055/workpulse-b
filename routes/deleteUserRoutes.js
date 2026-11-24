
import express from "express";
import { deleteEmployee } from "../controllers/deleteEmployeeController.js";

const router = express.Router();

router.delete("/:id", deleteEmployee);

export default router;
