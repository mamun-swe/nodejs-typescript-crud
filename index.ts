import express, { Express, Request, Response } from "express"
import { BodyParser } from "body-parser"
import { Mongoose } from "mongoose"

import dotenv from "dotenv"

dotenv.config()

const app: Express = express()

const port = process.env.PORT

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server')
});

app.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`)
})