import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import type { Product, Routine, Log } from '../services/api';

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

  const getRoutineWithSteps = useCallback(async (routineId: string) => {
    try {
      return await apiService.getRoutineSteps(routineId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch routine steps');
      return [];
    }
  }, []);

  const calculateStreak = useCallback(() => {
    if (logs.length === 0) return 0;

    const uniqueDates = Array.from(new Set(logs.map(l => l.date))).sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
      return 0;
    }

    let streak = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const current = new Date(uniqueDates[i]);
      const next = new Date(uniqueDates[i + 1]);
      const diff = (current.getTime() - next.getTime()) / (1000 * 3600 * 24);

      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [logs]);

  return {
    products,
    routines,
    logs,
    loading,
    error,
    addProduct,
    addLog,
    getRoutineWithSteps,
    calculateStreak,
    refresh: fetchData
  };
};
