export type Role = "attendee" | "organizer";

// Step 2: Define role constants
export const USER_ROLE = {
  attendee: "attendee",
  organizer: "organizer",
} as const;