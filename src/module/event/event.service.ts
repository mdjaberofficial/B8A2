import { pool } from "../../db";
import AppError from "../../utils/AppError";
import {
  ICreateEventPayload,
  IEvent,
  IEventQuery,
  IUpdateEventPayload,
} from "./event.interface";


const createEvent = async (
  organizerId: number,
  payload: ICreateEventPayload
): Promise<IEvent> => {

  const result = await pool.query(
    `
    INSERT INTO events (
      title,
      description,
      category,
      date,
      location,
      total_seats,
      available_seats,
      price,
      organizer_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING
      id,
      title,
      description,
      category,
      date,
      location,
      total_seats,
      available_seats,
      price,
      organizer_id,
      created_at,
      updated_at
    `,
    [
      payload.title.trim(),
      payload.description.trim(),
      payload.category.trim(),
      payload.date,
      payload.location.trim(),
      payload.total_seats,
      payload.total_seats,
      payload.price,
      organizerId,
    ]
  );

  return result.rows[0] as IEvent;
};


const getAllEvents = async (query: IEventQuery): Promise<IEvent[]> => {
  const search = query.search?.trim();

  
  if (search) {
    const result = await pool.query(
      `
      SELECT
        id,
        title,
        description,
        category,
        date,
        location,
        total_seats,
        available_seats,
        price,
        organizer_id,
        created_at,
        updated_at
      FROM events
      WHERE title ILIKE $1 OR description ILIKE $1
      ORDER BY created_at DESC, id DESC
      `,
      [`%${search}%`]
    );

    return result.rows as IEvent[];
  }

 
  const result = await pool.query(
    `
    SELECT
      id,
      title,
      description,
      category,
      date,
      location,
      total_seats,
      available_seats,
      price,
      organizer_id,
      created_at,
      updated_at
    FROM events
    ORDER BY created_at DESC, id DESC
    `
  );

  return result.rows as IEvent[];
};


const getEventById = async (eventId: number): Promise<IEvent> => {
  const result = await pool.query(
    `
    SELECT
      e.id,
      e.title,
      e.description,
      e.category,
      e.date,
      e.location,
      e.total_seats,
      e.available_seats,
      e.price,
      e.organizer_id,
      e.created_at,
      e.updated_at,
      json_build_object(
        'id', u.id,
        'name', u.name,
        'email', u.email
      ) AS organizer
    FROM events e
    INNER JOIN users u ON u.id = e.organizer_id
    WHERE e.id = $1
    `,
    [eventId]
  );

  if (result.rowCount === 0 || !result.rows[0]) {
    throw new AppError(404, "Event not found");
  }

  return result.rows[0] as IEvent;
};


const updateEvent = async (
  eventId: number,
  userId: number,
  payload: IUpdateEventPayload
): Promise<IEvent> => {
  
  const existingResult = await pool.query(
    `
    SELECT
      id,
      total_seats,
      available_seats,
      organizer_id
    FROM events
    WHERE id = $1
    `,
    [eventId]
  );

  if (existingResult.rowCount === 0 || !existingResult.rows[0]) {
    throw new AppError(404, "Event not found");
  }

  const currentEvent = existingResult.rows[0] as {
    id: number;
    total_seats: number;
    available_seats: number;
    organizer_id: number;
  };

  
  if (currentEvent.organizer_id !== userId) {
    throw new AppError(403, "Forbidden! You can only update your own events");
  }

  
  let nextAvailableSeats: number | undefined;
  if (payload.total_seats !== undefined) {
    const confirmedSold = currentEvent.total_seats - currentEvent.available_seats;
    const recalculatedAvailableSeats = payload.total_seats - confirmedSold;

    if (recalculatedAvailableSeats < 0) {
      throw new AppError(
        400,
        "Cannot reduce total_seats below already confirmed ticket bookings"
      );
    }

    nextAvailableSeats = recalculatedAvailableSeats;
  }

  
  const setClauses: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (payload.title !== undefined) {
    setClauses.push(`title = $${paramIndex++}`);
    values.push(payload.title.trim());
  }

  if (payload.description !== undefined) {
    setClauses.push(`description = $${paramIndex++}`);
    values.push(payload.description.trim());
  }

  if (payload.category !== undefined) {
    setClauses.push(`category = $${paramIndex++}`);
    values.push(payload.category.trim());
  }

  if (payload.date !== undefined) {
    setClauses.push(`date = $${paramIndex++}`);
    values.push(payload.date);
  }

  if (payload.location !== undefined) {
    setClauses.push(`location = $${paramIndex++}`);
    values.push(payload.location.trim());
  }

  if (payload.total_seats !== undefined && nextAvailableSeats !== undefined) {
    setClauses.push(`total_seats = $${paramIndex++}`);
    values.push(payload.total_seats);

    setClauses.push(`available_seats = $${paramIndex++}`);
    values.push(nextAvailableSeats);
  }

  if (payload.price !== undefined) {
    setClauses.push(`price = $${paramIndex++}`);
    values.push(payload.price);
  }

  setClauses.push(`updated_at = NOW()`);

  values.push(eventId);
  const idParam = paramIndex;

  
  const updatedResult = await pool.query(
    `
    UPDATE events
    SET ${setClauses.join(", ")}
    WHERE id = $${idParam}
    RETURNING
      id,
      title,
      description,
      category,
      date,
      location,
      total_seats,
      available_seats,
      price,
      organizer_id,
      created_at,
      updated_at
    `,
    values
  );

  return updatedResult.rows[0] as IEvent;
};


const deleteEvent = async (eventId: number, userId: number): Promise<null> => {
  
  const existingResult = await pool.query(
    `
    SELECT id, organizer_id
    FROM events
    WHERE id = $1
    `,
    [eventId]
  );

  if (existingResult.rowCount === 0 || !existingResult.rows[0]) {
    throw new AppError(404, "Event not found");
  }

  const event = existingResult.rows[0] as {
    id: number;
    organizer_id: number;
  };

  
  if (event.organizer_id !== userId) {
    throw new AppError(403, "Forbidden! You can only delete your own events");
  }

 
  const confirmedBookingsResult = await pool.query(
    `
    SELECT id
    FROM bookings
    WHERE event_id = $1 AND status = 'confirmed'
    LIMIT 1
    `,
    [eventId]
  );

  if (confirmedBookingsResult.rowCount && confirmedBookingsResult.rowCount > 0) {
    throw new AppError(
      400,
      "Cannot delete event with active confirmed bookings"
    );
  }

  
  await pool.query(
    `
    DELETE FROM events
    WHERE id = $1
    `,
    [eventId]
  );

  return null;
};

export const eventService = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};