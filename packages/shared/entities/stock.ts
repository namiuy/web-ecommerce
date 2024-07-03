type Branch = {
  code: string;
  quant: number;
};

export type Stock = {
  availability: 'AV' | 'CO' | 'NO';
  branches: Branch[];
};
