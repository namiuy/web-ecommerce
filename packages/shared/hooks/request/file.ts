import { bff } from '../../env';
import { File as EntityFile } from '../../entities/file';
import { post } from '../../utils/fetcher';

export const attachmentUpload = (path: string, file: File): Promise<EntityFile> => {
  const body = new FormData();
  body.append('upload', file);
  return post<EntityFile>(`${bff.url}/files/${path}/upload`, {
    body,
    headers: {},
  });
};
