"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const student_route_1 = require("./student.route");
exports.router = (0, express_1.Router)();
exports.router.use("/student", student_route_1.studentRouter);
