import { z } from "zod";


export const createEventZodSchema = z.object({
  body: z.object({
    title: z
      .string({ message: "Title is required" })
      .trim()
      .min(1, "Title cannot be empty"),
    description: z
      .string({ message: "Description is required" })
      .trim()
      .min(1, "Description cannot be empty"),
    category: z
      .string({ message: "Category is required" })
      .trim()
      .min(1, "Category cannot be empty"),
    date: z
      .string({ message: "Date is required" })
      .trim()
      .refine((val) => !Number.isNaN(Date.parse(val)), {
        message: "Date must be a valid ISO date string",
      }),
    location: z
      .string({ message: "Location is required" })
      .trim()
      .min(1, "Location cannot be empty"),
    total_seats: z
      .coerce.number({ message: "Total seats must be a number" })
      .int("Total seats must be an integer")
      .positive("Total seats must be greater than 0"),
    price: z
      .coerce.number({ message: "Price must be a number" })
      .min(0, "Price cannot be negative"),
  }),
});


export const updateEventZodSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Event ID must be a valid positive integer"),
  }),
  body: z
    .object({
      title: z.string().trim().min(1, "Title cannot be empty").optional(),
      description: z.string().trim().min(1, "Description cannot be empty").optional(),
      category: z.string().trim().min(1, "Category cannot be empty").optional(),
      date: z
        .string()
        .trim()
        .refine((val) => !Number.isNaN(Date.parse(val)), {
          message: "Date must be a valid ISO date string",
        })
        .optional(),
      location: z.string().trim().min(1, "Location cannot be empty").optional(),
      total_seats: z
        .coerce.number({ message: "Total seats must be a number" })
        .int("Total seats must be an integer")
        .positive("Total seats must be greater than 0")
        .optional(),
      price: z
        .coerce.number({ message: "Price must be a number" })
        .min(0, "Price cannot be negative")
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
});


export const eventIdParamZodSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Event ID must be a valid positive integer"),
  }),
});