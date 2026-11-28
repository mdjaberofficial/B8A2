import { pool } from "../../db";
import AppError from "../../utils/AppError";
import { IBooking, ICreateBookingPayload } from "./booking.interface";


const createBooking = async (
  attendeeId: number,
  payload: ICreateBookingPayload
): Promise<IBooking> => {

  const client = await pool.connect();

  try {
    
    await client.query("BEGIN");

    
    const eventResult = await client.query(
      `
      SELECT
        id,
        date,
        available_seats,
        price,
        organizer_id
      FROM events
      WHERE id = $1
      FOR UPDATE
      `,
      [payload.event_id]
    );

    if (eventResult.rowCount === 0 || !eventResult.rows[0]) {
      throw new AppError(404, "Event not found");
    }

    const event = eventResult.rows[0] as {
      id: number;
      date: Date | string;
      available_seats: number;
      price: string | number;
      organizer_id: number;
    };

  
    if (event.organizer_id === attendeeId) {
      throw new AppError(403, "Forbidden! Organizers cannot book their own event");
    }

 
    const eventDate = new Date(event.date);
    if (Number.isNaN(eventDate.getTime()) || eventDate.getTime() <= Date.now()) {
      throw new AppError(400, "Cannot book tickets for a past or already started event");
    }


    if (event.available_seats < payload.tickets_booked) {
      throw new AppError(400, "Not enough available seats for this event");
    }


    const unitPrice = Number(event.price);
    const totalPrice = Number((unitPrice * payload.tickets_booked).toFixed(2));


    await client.query(
      `
      UPDATE events
      SET
        available_seats = available_seats - $1,
        updated_at = NOW()
      WHERE id = $2
      `,
      [payload.tickets_booked, event.id]
    );

    const bookingResult = await client.query(
      `
      INSERT INTO bookings (
        event_id,
        attendee_id,
        tickets_booked,
        total_price,
        status
      )
      VALUES ($1, $2, $3, $4, 'confirmed')
      RETURNING
        id,
        event_id,
        attendee_id,
        tickets_booked,
        total_price,
        status,
        created_at,
        updated_at
      `,
      [event.id, attendeeId, payload.tickets_booked, totalPrice]
    );


    await client.query("COMMIT");

    return bookingResult.rows[0] as IBooking;
  } catch (error) {
  
    await client.query("ROLLBACK");
    throw error;
  } finally {

    client.release();
  }
};


const getMyBookings = async (userId: number): Promise<IBooking[]> => {
  const result = await pool.query(
    `
    SELECT
      b.id,
      b.event_id,
      b.attendee_id,
      b.tickets_booked,
      b.total_price,
      b.status,
      b.created_at,
      b.updated_at,
      json_build_object(
        'id', e.id,
        'title', e.title,
        'category', e.category,
        'date', e.date,
        'location', e.location,
        'price', e.price
      ) AS event
    FROM bookings b
    INNER JOIN events e ON e.id = b.event_id
    WHERE b.attendee_id = $1
    ORDER BY b.created_at DESC, b.id DESC
    `,
    [userId]
  );

  return result.rows as IBooking[];
};


const cancelBooking = async (bookingId: number, userId: number): Promise<IBooking> => {
  
  const client = await pool.connect();

  try {
    
    await client.query("BEGIN");

   
    const bookingResult = await client.query(
      `
      SELECT
        b.id,
        b.event_id,
        b.attendee_id,
        b.tickets_booked,
        b.total_price,
        b.status,
        b.created_at,
        b.updated_at,
        e.date AS event_date
      FROM bookings b
      INNER JOIN events e ON e.id = b.event_id
      WHERE b.id = $1
      FOR UPDATE OF b
      `,
      [bookingId]
    );

    if (bookingResult.rowCount === 0 || !bookingResult.rows[0]) {
      throw new AppError(404, "Booking not found");
    }

    const bookingRow = bookingResult.rows[0] as IBooking & {
      event_date: Date | string;
    };

    
    if (bookingRow.attendee_id !== userId) {
      throw new AppError(403, "Forbidden! You can only cancel your own bookings");
    }

    
    if (bookingRow.status === "cancelled") {
      throw new AppError(409, "Booking is already cancelled");
    }

    
    const eventDate = new Date(bookingRow.event_date);
    if (Number.isNaN(eventDate.getTime()) || eventDate.getTime() <= Date.now()) {
      throw new AppError(400, "Cannot cancel a booking after the event date has passed");
    }

   
    await client.query(
      `
      UPDATE events
      SET
        available_seats = available_seats + $1,
        updated_at = NOW()
      WHERE id = $2
      `,
      [bookingRow.tickets_booked, bookingRow.event_id]
    );

    
    const updatedBookingResult = await client.query(
      `
      UPDATE bookings
      SET
        status = 'cancelled',
        updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        event_id,
        attendee_id,
        tickets_booked,
        total_price,
        status,
        created_at,
        updated_at
      `,
      [bookingId]
    );

    
    await client.query("COMMIT");

    return updatedBookingResult.rows[0] as IBooking;
  } catch (error) {
    
    await client.query("ROLLBACK");
    throw error;
  } finally {
    
    client.release();
  }
};

export const bookingService = {
  createBooking,
  getMyBookings,
  cancelBooking,
};