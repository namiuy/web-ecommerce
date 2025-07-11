export type File = {
  name: string;
  originalname: string;
  buffer?: Buffer;
  mimetype: string;
  path: string;
  extension?: string;
  url?: string;
};
