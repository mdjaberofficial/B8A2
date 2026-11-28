import { Router } from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { USER_ROLE } from "../../types";
import { eventController } from "./event.controller";
import {
  createEventZodSchema,
  eventIdParamZodSchema,
  updateEventZodSchema,
} from "./event.validation";


const router = Router();


router.get("/", eventController.getAllEvents);
router.get(
  "/:id",
  validateRequest(eventIdParamZodSchema),
  eventController.getEventById
);


router.post(
  "/",
  auth(USER_ROLE.organizer),
  validateRequest(createEventZodSchema),
  eventController.createEvent
);

router.patch(
  "/:id",
  auth(USER_ROLE.organizer),
  validateRequest(updateEventZodSchema),
  eventController.updateEvent
);

router.delete(
  "/:id",
  auth(USER_ROLE.organizer),
  validateRequest(eventIdParamZodSchema),
  eventController.deleteEvent
);


export const eventRoutes = router;