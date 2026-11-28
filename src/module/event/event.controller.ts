import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { eventService } from "./event.service";


const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    
    const organizerId = req.user!.id;
    const event = await eventService.createEvent(organizerId, req.body);

    // Step 4: Return 201 Created response
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    
    next(error);
  }
};


const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;
    const events = await eventService.getAllEvents({ search });

    
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Events retrieved successfully",
      data: events,
    });
  } catch (error) {
    
    next(error);
  }
};


const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
   
    const eventId = Number(req.params.id);
    const event = await eventService.getEventById(eventId);


    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Event retrieved successfully",
      data: event,
    });
  } catch (error) {
    
    next(error);
  }
};


const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    
    const eventId = Number(req.params.id);
    const userId = req.user!.id;
    const updatedEvent = await eventService.updateEvent(eventId, userId, req.body);

    
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    
    next(error);
  }
};


const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    
    const eventId = Number(req.params.id);
    const userId = req.user!.id;
    await eventService.deleteEvent(eventId, userId);

    
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Event deleted successfully",
      data: null,
    });
  } catch (error) {
    
    next(error);
  }
};

export const eventController = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};