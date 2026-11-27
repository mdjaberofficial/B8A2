import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
  connectionString: config.connection_string,
});

export const initDB = async (): Promise<void> => {
  try {
    // users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'attendee' CHECK (role IN ('attendee', 'organizer')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // events table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        date TIMESTAMPTZ NOT NULL,
        location VARCHAR(255) NOT NULL,
        total_seats INT NOT NULL CHECK (total_seats > 0),
        available_seats INT NOT NULL CHECK (available_seats >= 0),
        price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
        organizer_id INT NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create bookings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        attendee_id INT NOT NULL REFERENCES users(id),
        tickets_booked INT NOT NULL CHECK (tickets_booked > 0),
        total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
        status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);


    console.log("Database Connected & Tables Verified!!");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};