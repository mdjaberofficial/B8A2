export type BookingStatus = "confirmed" | "cancelled";

export interface ICreateBookingPayload {
  event_id: number;
  tickets_booked: number;
}

export interface IBookingEventSummary {
  id: number;
  title: string;
  category: string;
  date: Date;
  location: string;
  price: string | number;
}

export interface IBooking {
  id: number;
  event_id: number;
  attendee_id: number;
  tickets_booked: number;
  total_price: string | number;
  status: BookingStatus;
  created_at: Date;
  updated_at: Date;
  event?: IBookingEventSummary;
}