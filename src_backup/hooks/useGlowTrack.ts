import { useState, useEffect, useCallback } from 'react';
import { apiService, Product, Routine, Log, RoutineStep } from '../services/api';

export const useGlowTrack = (userId: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [p, r, l] = await Promise.all([
        apiService.getProducts(userId),
        apiService.getRoutines(userId),
        apiService.getLogs(userId),
      ]);
      setProducts(p);
      setRoutines(r);
      setLogs(l);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId, fetchData]);

  const addProduct = async (product: Omit<Product, 'id' | 'user_id' | 'created_at'>) => {
    const id = crypto.randomUUID();
    try {
      await apiService.addProduct({ ...product, id, user_id: userId });
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
    }
  };

  const addLog = async (routineId: string, status: string, notes: string = '', photoUrl: string = '') => {
    const id = crypto.randomUUID();
    const date = new Date().toISOString().split('T')[0];
    try {
      await apiService.addLog({
        id,
        user_id: userId,
        routine_id: routineId,
        date,
        completion_status: status,
        notes,
        photo_url: photoUrl
      });
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record log');
    }
  };

  const getRoutineWithSteps = async (routineId: string) => {
    try {
      return await apiService.getRoutineSteps(routineId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch routine steps');
      return [];
    }
  };

  return {
    products,
    routines,
    logs,
    loading,
    error,
    addProduct,
    addLog,
    getRoutineWithSteps,
    refresh: fetchData
  };
};
