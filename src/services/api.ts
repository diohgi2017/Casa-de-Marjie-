const API_BASE_URL = 'http://localhost:3001/api';

export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  brand: string;
  name: string;
  category: string;
  ingredients: string;
  expiry_date: string;
  created_at: string;
}

export interface Routine {
  id: string;
  user_id: string;
  name: string;
  time_of_day: string;
  created_at: string;
}

export interface RoutineStep {
  id: string;
  routine_id: string;
  product_id: string;
  step_order: number;
  instructions: string;
  brand?: string;
  product_name?: string;
  category?: string;
}

export interface Log {
  id: string;
  user_id: string;
  routine_id: string;
  date: string;
  completion_status: string;
  notes: string;
  photo_url: string;
  created_at: string;
}

export const apiService = {
  // Users
  getUser: async (id: string): Promise<User | null> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  // Products
  getProducts: async (userId: string): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  addProduct: async (product: Omit<Product, 'created_at'>): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Failed to add product');
  },

  // Routines
  getRoutines: async (userId: string): Promise<Routine[]> => {
    const response = await fetch(`${API_BASE_URL}/routines/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch routines');
    return response.json();
  },

  getRoutineSteps: async (routineId: string): Promise<RoutineStep[]> => {
    const response = await fetch(`${API_BASE_URL}/routines/${routineId}/steps`);
    if (!response.ok) throw new Error('Failed to fetch routine steps');
    return response.json();
  },

  // Logs
  getLogs: async (userId: string): Promise<Log[]> => {
    const response = await fetch(`${API_BASE_URL}/logs/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch logs');
    return response.json();
  },

  addLog: async (log: Omit<Log, 'created_at'>): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log),
    });
    if (!response.ok) throw new Error('Failed to record log');
  },
};
