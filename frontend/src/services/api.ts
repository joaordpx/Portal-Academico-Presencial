const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

/** Falha HTTP da API — `status` permite distinguir "não encontrado" (404) de erro real */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      // Content-Type só com corpo: num GET ele forçaria um preflight CORS (OPTIONS) a cada requisição
      ...(options?.body ? { "Content-Type": "application/json" } : {}),
      Accept: "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(response.status, `Erro na requisição (${response.status}): ${endpoint}`);
  }

  // 204 No Content (ex.: registro de estatísticas) não tem corpo para ler
  if (response.status === 204) return undefined as T;

  return response.json();
}
