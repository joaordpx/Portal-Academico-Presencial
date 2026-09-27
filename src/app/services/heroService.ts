export interface HeroImage {
  id: number;
  imagem: string;
  alt: string;
}

export interface HeroResponse {
  success: boolean;
  hero: HeroImage | null;
}

const API_URL = 'http://127.0.0.1:8000/api';

export const getHeroImage = async (): Promise<HeroResponse> => {
  const response = await fetch(
    `${API_URL}/manual-do-calouro/hero`
  );

  if (!response.ok) {
    throw new Error('Não foi possível carregar a imagem do Hero.');
  }

  return response.json();
};