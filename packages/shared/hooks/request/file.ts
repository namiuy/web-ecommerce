import { File as EntityFile } from '../../entities/file';
import { post } from '../../utils/fetcher';

const getFileExtension = (name: string) => name?.split('.').pop();

export const upload = (path: string, file: File, name?: string): Promise<EntityFile> => {
  const body = new FormData();
  body.append('upload', file, name ? `${name}.${getFileExtension(file.name)}` : undefined);
  return post<EntityFile>(`/api/files/${path}/upload`, {
    body,
    headers: {},
  });
};

type UploadResponse = { url: string };
type UploadRequest = { file: EntityFile; path?: string; keepOriginalName?: boolean };
type UploadResult = { data: UploadResponse | null; error: string | null };

export const uploadFile = async ({
  file,
  path = 'products',
  keepOriginalName = false,
}: UploadRequest): Promise<UploadResult> => {
  const formData = new FormData();
  const blob = new Blob([file.buffer!], { type: file.mimetype });

  formData.append('upload', blob, file.originalname);
  formData.append('keepOriginalName', keepOriginalName ? 'true' : 'false');

  try {
    // Include auth token if available (prefer fresh Firebase token)
    const headers: Record<string, string> = {};
    try {
      const { getCurrentUserToken } = await import('../../services/firebase');
      const freshToken = await getCurrentUserToken();
      if (freshToken) {
        headers['Authorization'] = `Bearer ${freshToken}`;
      } else {
        const lscache = (await import('lscache')).default;
        const cachedToken = lscache.get('firebase_token');
        if (cachedToken) headers['Authorization'] = `Bearer ${cachedToken}`;
      }
    } catch {}

    const res = await fetch(`/api/files/${path}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      return { data: null, error: `HTTP ${res.status}: ${errText}` };
    }

    const raw = await res.json();
    if (typeof raw === 'object' && raw?.url) {
      return { data: raw, error: null };
    }

    return { data: null, error: 'Respuesta inválida del servidor' };
  } catch (err: any) {
    return { data: null, error: err.message || 'Error desconocido' };
  }
};
