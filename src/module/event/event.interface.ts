export interface ICreateEventPayload {
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  total_seats: number;
  price: number;
}

export interface IUpdateEventPayload {
  title?: string;
  description?: string;
  category?: string;
  date?: string;
  location?: string;
  total_seats?: number;
  price?: number;
}

export interface IEventQuery {
  search?: string;
}

export interface IEventOrganizer {
  id: number;
  name: string;
  email: string;
}

export interface IEvent {
  id: number;
  title: string;
  description: string;
  category: string;
  date: Date;
  location: string;
  total_seats: number;
  available_seats: number;
  price: string | number;
  organizer_id: number;
  created_at: Date;
  updated_at: Date;
  organizer?: IEventOrganizer;
}