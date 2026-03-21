import { User, City, BaseTeam, Member, Event, Payment, FinancialEntity, FinancialLaunch, EventSale } from '../types';

const API_URL = '/api';

export const api = {
  login: async (username: string): Promise<User> => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    if (!response.ok) throw new Error('Falha no login');
    return response.json();
  },

  getCities: async (): Promise<City[]> => {
    const response = await fetch(`${API_URL}/cities`);
    return response.json();
  },

  createCity: async (city: Partial<City>): Promise<City> => {
    const response = await fetch(`${API_URL}/cities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(city),
    });
    return response.json();
  },

  updateCity: async (id: string, city: Partial<City>): Promise<City> => {
    const response = await fetch(`${API_URL}/cities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(city),
    });
    return response.json();
  },

  deleteCity: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/cities/${id}`, { method: 'DELETE' });
  },

  getTeams: async (): Promise<BaseTeam[]> => {
    const response = await fetch(`${API_URL}/teams`);
    return response.json();
  },

  getTeam: async (id: string): Promise<BaseTeam & { members: Member[] }> => {
    const response = await fetch(`${API_URL}/teams/${id}`);
    return response.json();
  },
  
  createTeam: async (team: Partial<BaseTeam>): Promise<BaseTeam> => {
    const response = await fetch(`${API_URL}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(team),
    });
    return response.json();
  },

  updateTeam: async (id: string, team: Partial<BaseTeam>): Promise<BaseTeam> => {
    const response = await fetch(`${API_URL}/teams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(team),
    });
    return response.json();
  },

  deleteTeam: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/teams/${id}`, { method: 'DELETE' });
  },

  getMembers: async (): Promise<Member[]> => {
    const response = await fetch(`${API_URL}/members`);
    return response.json();
  },

  getMember: async (id: string): Promise<Member> => {
    const response = await fetch(`${API_URL}/members/${id}`);
    return response.json();
  },

  createMember: async (member: Partial<Member>): Promise<Member> => {
    const response = await fetch(`${API_URL}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member),
    });
    return response.json();
  },

  updateMember: async (id: string, member: Partial<Member>): Promise<Member> => {
    const response = await fetch(`${API_URL}/members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member),
    });
    return response.json();
  },

  deleteMember: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/members/${id}`, { method: 'DELETE' });
  },

  getEvents: async (): Promise<Event[]> => {
    const response = await fetch(`${API_URL}/events`);
    return response.json();
  },

  createEvent: async (event: Partial<Event>): Promise<Event> => {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    return response.json();
  },

  updateEvent: async (id: string, event: Partial<Event>): Promise<Event> => {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    return response.json();
  },

  deleteEvent: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/events/${id}`, { method: 'DELETE' });
  },

  getUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}/users`);
    return response.json();
  },

  createUser: async (user: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return response.json();
  },

  getPayments: async (): Promise<Payment[]> => {
    const response = await fetch(`${API_URL}/payments`);
    return response.json();
  },

  createPayment: async (payment: Partial<Payment>): Promise<Payment> => {
    const response = await fetch(`${API_URL}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payment),
    });
    return response.json();
  },

  getEventSales: async (): Promise<EventSale[]> => {
    const response = await fetch(`${API_URL}/event-sales`);
    return response.json();
  },

  createEventSale: async (sale: Partial<EventSale>): Promise<EventSale> => {
    const response = await fetch(`${API_URL}/event-sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sale),
    });
    return response.json();
  },

  getFinancialEntities: async (): Promise<FinancialEntity[]> => {
    const response = await fetch(`${API_URL}/financial-entities`);
    return response.json();
  },

  createFinancialEntity: async (entity: Partial<FinancialEntity>): Promise<FinancialEntity> => {
    const response = await fetch(`${API_URL}/financial-entities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entity),
    });
    return response.json();
  },

  getFinancialLaunches: async (entityId: string): Promise<FinancialLaunch[]> => {
    const response = await fetch(`${API_URL}/financial-launches/${entityId}`);
    return response.json();
  },

  createFinancialLaunch: async (launch: Partial<FinancialLaunch>): Promise<FinancialLaunch> => {
    const response = await fetch(`${API_URL}/financial-launches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(launch),
    });
    return response.json();
  },
};
