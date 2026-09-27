import { useCallback, useEffect, useState } from 'react';
import {
  ChecklistItem,
  getChecklist,
} from '../services/checklistService';

interface UseChecklistReturn {
  tarefas: ChecklistItem[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  lastPage: number;
  total: number;
  carregarPagina: (page: number) => Promise<void>;
}

export const useChecklist = (
  perPage = 10
): UseChecklistReturn => {
  const [tarefas, setTarefas] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const carregarPagina = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        setError(null);

        const response = await getChecklist(page, perPage);

        setTarefas(response.data);
        setCurrentPage(response.current_page);
        setLastPage(response.last_page);
        setTotal(response.total);
      } catch (err) {
        console.error('Erro ao carregar checklist:', err);

        setError(
          'Não foi possível carregar o checklist.'
        );
      } finally {
        setLoading(false);
      }
    },
    [perPage]
  );

  useEffect(() => {
    carregarPagina(1);
  }, [carregarPagina]);

  return {
    tarefas,
    loading,
    error,
    currentPage,
    lastPage,
    total,
    carregarPagina,
  };
};