import Category from '../entities/category';

const list = async (): Promise<Category[]> => {
  const res = await fetch('http://localhost:3001/category');
  return res.ok ? Promise.resolve(await res.json()) : Promise.reject();
};

export { list };
