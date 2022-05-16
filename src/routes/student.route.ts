
import express from "express"
import * as StudentController from "../controllers/student.controller"

export const studentRouter = express.Router()

studentRouter.get("/", StudentController.Index)
studentRouter.get("/:id", StudentController.Show)
studentRouter.post("/", StudentController.Store)
studentRouter.put("/:id", StudentController.Update)
studentRouter.delete("/:id", StudentController.Destroy)
