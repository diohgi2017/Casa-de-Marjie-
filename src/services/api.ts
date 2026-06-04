import { mockUser, mockProducts, mockRoutines, mockRoutineSteps, mockLogs } from '../data/mockData';

const API_BASE_URL = 'http://localhost:3001/api';

// Helper to determine if we should use mock data (e.g. if the backend is unreachable)
const isDemoMode = () => {
  // In a real Vercel deployment, localhost:3001 won't be reachable.
  // We can also check a window variable or env var if needed.
  return true; // Defaulting to check for failures, but we can use this to force it.
};

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
  image_url?: string;
  affiliate_url?: string;
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
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    } catch (error) {
      console.warn('API Error, falling back to Demo Mode:', error);
      return id === mockUser.id ? mockUser : null;
    }
  },

  // Products
  getProducts: async (userId: string): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    } catch (error) {
      console.warn('API Error, falling back to Demo Mode:', error);
      return mockProducts;
    }
  },

  addProduct: async (product: Omit<Product, 'created_at'>): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error('Failed to add product');
    } catch (error) {
      console.warn('API Error (Add Product), simulation only in Demo Mode:', error);
      // In Demo Mode we just succeed silently
      return;
    }
  },

  // Routines
  getRoutines: async (userId: string): Promise<Routine[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/routines/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch routines');
      return response.json();
    } catch (error) {
      console.warn('API Error, falling back to Demo Mode:', error);
      return mockRoutines;
    }
  },

  getRoutineSteps: async (routineId: string): Promise<RoutineStep[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/routines/${routineId}/steps`);
      if (!response.ok) throw new Error('Failed to fetch routine steps');
      return response.json();
    } catch (error) {
      console.warn('API Error, falling back to Demo Mode:', error);
      return mockRoutineSteps[routineId] || [];
    }
  },

  // Logs
  getLogs: async (userId: string): Promise<Log[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/logs/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch logs');
      return response.json();
    } catch (error) {
      console.warn('API Error, falling back to Demo Mode:', error);
      return mockLogs;
    }
  },

  addLog: async (log: Omit<Log, 'created_at'>): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });
      if (!response.ok) throw new Error('Failed to record log');
    } catch (error) {
      console.warn('API Error (Add Log), simulation only in Demo Mode:', error);
      // In Demo Mode we just succeed silently
      return;
    }
  },
};
