import { Request, Response } from "express";
import CustomError from "../exception/custom-error";

export function errorMiddleware(error: CustomError, request: Request, response: Response) {
    const code = error.code;
    const message = error.message;
    response.status(code).send({code, message,});
}
