
import { Request, Response, NextFunction } from "express"
import { Validators } from "../validators"
import { isValidMongooseId } from "../middleware/mongooseId.middleware"
import { paginateQueryParams, paginate } from "../helpers/pagination.helper"
import Student from "../models/student.model"

/* List of items */
export const Index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit, page } = paginateQueryParams(req.query)

        const totalItems = await Student.countDocuments()
        const results = await Student.find()
            .sort({ _id: -1 })
            .skip((page * limit) - limit)
            .limit(limit)
            .exec()

        res.status(200).json({
            status: true,
            data: results,
            pagination: paginate({ page, limit, total_items: totalItems })
        })
    } catch (error: any) {
        if (error) {
            console.log(error)
            next(error)
        }
    }
}

/* Show specific item */
export const Show = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params

        await isValidMongooseId(id)
        const result = await Student.findById(id)

        res.status(200).json({
            status: true,
            data: result
        })
    } catch (error: any) {
        if (error) {
            console.log(error)
            next(error)
        }
    }
}

/* Store an item */
export const Store = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let uniqueErrors: any = {}
        const {
            student_id,
            name,
            email,
            phone,
            department,
            address,
            city,
            country
        } = req.body

        /* Check validation */
        const validate = await Validators.Student.Store(req.body)
        if (!validate.isValid) {
            return res.status(422).json({
                status: false,
                errors: validate.errors
            })
        }

        /* Check unique student ID */
        const isIdAvailable = await Student.findOne({ student_id })
        if (isIdAvailable) {
            uniqueErrors.student_id = "Student ID already used."
        }

        /* Check student email */
        const isEmailAvailable = await Student.findOne({ email })
        if (isEmailAvailable) {
            uniqueErrors.email = "E-mail already used."
        }

        /* Check student phone */
        const isPhoneAvailable = await Student.findOne({ phone })
        if (isPhoneAvailable) {
            uniqueErrors.phone = "Phone already used."
        }

        if (Object.keys(uniqueErrors).length > 0) {
            return res.status(409).json({
                status: false,
                errors: uniqueErrors
            })
        }

        const newStudent = new Student({
            student_id,
            name,
            email,
            phone,
            department,
            address,
            city,
            country
        })

        await newStudent.save()

        res.status(201).json({
            status: true,
            message: "Successfully student created."
        })
    } catch (error: any) {
        if (error) {
            console.log(error)
            next(error)
        }
    }
}

/* Update an item */
export const Update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let uniqueErrors: any = {}
        const { id } = req.params
        const {
            name,
            email,
            phone,
            department,
            address,
            city,
            country
        } = req.body

        await isValidMongooseId(id)

        /* Check validation */
        const validate = await Validators.Student.Update(req.body)
        if (!validate.isValid) {
            return res.status(422).json({
                status: false,
                errors: validate.errors
            })
        }

        /* Account available */
        const isAvailableAccount = await Student.findById(id)
        if (!isAvailableAccount) {
            return res.status(404).json({
                status: false,
                errors: { message: "Account not available." }
            })
        }

        /* Check student email */
        const isEmailAvailable = await Student.findOne({
            $and: [
                { _id: { $ne: id } },
                { email }
            ]
        })

        if (isEmailAvailable) {
            uniqueErrors.email = "E-mail already used."
        }

        /* Check student phone */
        const isPhoneAvailable = await Student.findOne({
            $and: [
                { _id: { $ne: id } },
                { phone }
            ]
        })

        if (isPhoneAvailable) {
            uniqueErrors.phone = "Phone already used."
        }

        if (Object.keys(uniqueErrors).length > 0) {
            return res.status(409).json({
                status: false,
                errors: uniqueErrors
            })
        }

        await Student.findByIdAndUpdate(
            id,
            {
                $set: {
                    name,
                    email,
                    phone,
                    department,
                    address,
                    city,
                    country
                }
            }
        )

        res.status(201).json({
            status: true,
            message: "Successfully student updated."
        })
    } catch (error: any) {
        if (error) {
            console.log(error)
            next(error)
        }
    }
}

/* Destroy an item */
export const Destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params

        await isValidMongooseId(id)

        const isAvailable = await Student.findById(id)
        if (!isAvailable) {
            return res.status(404).json({
                status: false,
                errors: { message: "Student not found." }
            })
        }

        await Student.findByIdAndDelete(id)

        res.status(200).json({
            status: true,
            message: "Successfully student deleted."
        })
    } catch (error: any) {
        if (error) {
            console.log(error)
            next(error)
        }
    }
}