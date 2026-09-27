export interface ChecklistItem {
  id: number;
  texto: string;
  ordem: number;
  ativo: boolean;
}

export interface ChecklistResponse {
  current_page: number;
  data: ChecklistItem[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

const API_URL = 'http://127.0.0.1:8000/api';

export const getChecklist = async (
  page = 1,
  perPage = 10
): Promise<ChecklistResponse> => {
  const response = await fetch(
    `${API_URL}/manual-do-calouro/checklist?page=${page}&per_page=${perPage}`
  );

  if (!response.ok) {
    throw new Error('Não foi possível carregar o checklist.');
  }

  return response.json();
};