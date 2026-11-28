import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { bookingService } from "./booking.service";


const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    
    const userId = req.user!.id;
    const booking = await bookingService.createBooking(userId, req.body);

    // Step 4: Return 201 Created response
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    
    next(error);
  }
};


const getMyBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    
    const userId = req.user!.id;
    const bookings = await bookingService.getMyBookings(userId);

    
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  } catch (error) {
    
    next(error);
  }
};


const cancelBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    
    const bookingId = Number(req.params.id);
    const userId = req.user!.id;
    const updatedBooking = await bookingService.cancelBooking(bookingId, userId);

    
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Booking cancelled successfully",
      data: updatedBooking,
    });
  } catch (error) {
    
    next(error);
  }
};

export const bookingController = {
  createBooking,
  getMyBookings,
  cancelBooking,
};