import express, { Application, NextFunction, Request, Response } from "express";
import globalErrorHandler from "./middleware/globalErrorHandler";
import logger from "./middleware/logger";

import { authRoutes } from "./module/auth/auth.route";
import { bookingRoutes } from "./module/booking/booking.route";
import { eventRoutes } from "./module/event/event.route";

import sendResponse from "./utils/sendResponse";

const app: Application = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);


app.get("/", (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "EventHive API is running!",
    data: null,
  });
});


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/bookings", bookingRoutes);


app.use((req: Request, res: Response, next: NextFunction) => {
  sendResponse(res, {
    statusCode: 404,
    success: false,
    message: "Route not found",
    errors: [
      {
        field: "path",
        message: `Cannot ${req.method} ${req.originalUrl}`,
      },
    ],
  });
});


app.use(globalErrorHandler);

export default app;