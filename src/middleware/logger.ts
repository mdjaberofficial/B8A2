import { NextFunction, Request, Response } from "express";
import fs from "fs";

const logger = (req: Request, res: Response, next: NextFunction): void => {
  const log = `\nMethod: ${req.method} | URL: ${req.originalUrl} | Time: ${new Date().toISOString()}\n`;
  fs.appendFile("logger.txt", log, (error) => {
    if (error) {
      console.error("Logger error:", error);
    }
  });


  next();
};

export default logger;