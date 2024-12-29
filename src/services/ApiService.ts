import axios from 'axios';
import type { ReactNode } from 'react';

// Define interfaces directly here
export interface Category {
  id: number;
  title: string;
}

export interface Hadeeth {
  title: ReactNode;
  id: number;
  text: string;
}

// URL of the Hadeeth API
const BASE_URL = 'https://hadeethenc.com/api/v1';

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get(`${BASE_URL}/categories/list/?language=en`);
  return response.data;
};

export const fetchRootCategories = async (): Promise<Category[]> => {
  const response = await axios.get(`${BASE_URL}/categories/roots/?language=en`);
  return response.data;
};

export const fetchHadeeths = async (categoryId: number, language: string = 'en'): Promise<Hadeeth[]> => {
  const response = await axios.get(`${BASE_URL}/hadeeths/list/?language=${language}&category_id=${categoryId}&page=1&per_page=20`);
  return response.data.data;  // Assuming the API response includes 'data' as the list of Hadeeths
};

export const fetchHadeethDetails = async (hadeethId: number, language: string): Promise<Hadeeth> => {
  const response = await axios.get(`${BASE_URL}/hadeeths/one/?language=${language}&id=${hadeethId}`);
  return response.data;
};
