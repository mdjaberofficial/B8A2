import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import AppError from "../utils/AppError";


const validateRequest = (schema: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const parsed = await schema.safeParseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });


    if (!parsed.success) {
      const formattedErrors = parsed.error.issues.map((issue) => {
        const lastSegment = issue.path[issue.path.length - 1];
        const field =
          typeof lastSegment === "string" || typeof lastSegment === "number"
            ? lastSegment
            : issue.path.join(".");

        return {
          field,
          message: issue.message,
        };
      });

      next(new AppError(400, "Validation Error", formattedErrors));
      return;
    }


    if (
      typeof parsed.data === "object" &&
      parsed.data !== null &&
      "body" in parsed.data &&
      parsed.data.body !== undefined
    ) {
      req.body = parsed.data.body;
    }


    next();
  };
};

export default validateRequest;