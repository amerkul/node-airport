import { NextFunction, Request, Response } from "express";
import CustomError from "../exception/custom-error";

export function errorMiddleware(error: CustomError, request: Request, response: Response, next: NextFunction) {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    response.status(status).send({status, message,});
}
