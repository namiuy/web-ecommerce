import { bff } from '../../env';
import { File as EntityFile } from '../../entities/file';
import { post } from '../../utils/fetcher';

const getFileExtension = (name: string) => name?.split('.').pop();

export const upload = (path: string, file: File, name?: string): Promise<EntityFile> => {
  const body = new FormData();
  body.append('upload', file, name ? `${name}.${getFileExtension(file.name)}` : undefined);
  return post<EntityFile>(`${bff.url}/files/${path}/upload`, {
    body,
    headers: {},
  });
};
