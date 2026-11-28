import { Router } from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { USER_ROLE } from "../../types";
import { bookingController } from "./booking.controller";
import {
  bookingIdParamZodSchema,
  createBookingZodSchema,
} from "./booking.validation";


const router = Router();


router.post(
  "/",
  auth(USER_ROLE.attendee, USER_ROLE.organizer),
  validateRequest(createBookingZodSchema),
  bookingController.createBooking
);

router.get(
  "/",
  auth(USER_ROLE.attendee, USER_ROLE.organizer),
  bookingController.getMyBookings
);

router.patch(
  "/:id/cancel",
  auth(USER_ROLE.attendee, USER_ROLE.organizer),
  validateRequest(bookingIdParamZodSchema),
  bookingController.cancelBooking
);


export const bookingRoutes = router;