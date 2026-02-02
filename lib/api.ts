import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { Note } from '../types/note';
import { notFound } from 'next/navigation';


const API_BASE = 'https://notehub-public.goit.study/api/notes';

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: API_BASE,
  headers: { Authorization: `Bearer ${token}` },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  totalPages: number;
  notes: Note[];
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = '',
  tag = '',
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response: AxiosResponse<FetchNotesResponse> = await api.get('', {
    params: { page, perPage, search, ...(tag ? { tag } : {}), },
  });
  return response.data;
};

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: string;
}

export const createNote = async (payload: CreateNoteParams): Promise<Note> => {
  const response: AxiosResponse<Note> = await api.post('', payload);
  return response.data;
};


export const deleteNote = async (id: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await api.delete(`/${id}`);
  return response.data;
};

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await fetch(`${API_BASE}/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  if (!res.ok && res.status === 404) {
    notFound();
  }
  if (!res.ok) {
    throw new Error("Failed to fetch note");
  }

  return res.json();
}