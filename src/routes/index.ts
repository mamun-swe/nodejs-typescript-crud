import { Router } from "express"
import { studentRouter } from './student.route'

export const router: Router = Router()

router.use("/student", studentRouter)