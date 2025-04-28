import axios from 'axios';
import { AuthResponse, Event, LoginCredentials, RegisterCredentials, User } from '../types';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },
};

export const eventService = {
  createEvent: async (eventData: Omit<Event, '_id' | 'creator' | 'participants'>): Promise<Event> => {
    const response = await api.post<Event>('/events', eventData);
    return response.data;
  },

  getEvents: async (): Promise<Event[]> => {
    const response = await api.get<Event[]>('/events');
    return response.data;
  },

  registerForEvent: async (eventId: string): Promise<Event> => {
    const response = await api.post<Event>(`/events/${eventId}/register`);
    return response.data;
  },

  cancelRegistration: async (eventId: string): Promise<Event> => {
    const response = await api.delete<Event>(`/events/${eventId}/register`);
    return response.data;
  },

  getMyEvents: async (): Promise<Event[]> => {
    const response = await api.get<Event[]>('/events/my-events');
    return response.data;
  },
}; 