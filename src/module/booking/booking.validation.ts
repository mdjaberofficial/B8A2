import { z } from "zod";


export const createBookingZodSchema = z.object({
  body: z.object({
    event_id: z
      .coerce.number({ message: "Event ID must be a number" })
      .int("Event ID must be an integer")
      .positive("Event ID must be a positive integer"),
    tickets_booked: z
      .coerce.number({ message: "Tickets booked must be a number" })
      .int("Tickets booked must be an integer")
      .positive("Tickets booked must be greater than 0"),
  }),
});


export const bookingIdParamZodSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Booking ID must be a valid positive integer"),
  }),
});