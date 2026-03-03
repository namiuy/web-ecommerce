import { ICategoryRepository, Category, Result, createSuccessResult, isSuccess } from '@namiuy/bff-core';

// Use case factory (functional approach)
export const createListCategoriesUseCase = (repository: ICategoryRepository) => {
  return async (): Promise<Result<Category[]>> => {
    const result = await repository.list();

    if (!isSuccess(result)) {
      return result;
    }

    // Transform flat array into hierarchical structure
    const categories = result.data;
    const parentCategories: Category[] = [];
    const childrenMap = new Map<string, Category[]>();

    // First pass: separate parents and children
    categories.forEach(category => {
      if (!category.id.includes('.')) {
        // Parent category (no dot in ID)
        parentCategories.push({ ...category });
      } else {
        // Child category (has dot in ID, e.g., "10.05")
        const parentId = category.id.split('.')[0];
        if (!childrenMap.has(parentId)) {
          childrenMap.set(parentId, []);
        }
        childrenMap.get(parentId)!.push(category);
      }
    });

    // Second pass: attach children to their parents
    const hierarchicalCategories = parentCategories.map(parent => {
      const children = childrenMap.get(parent.id);
      if (children && children.length > 0) {
        return { ...parent, sub_categories: children };
      }
      return parent;
    });

    return createSuccessResult(hierarchicalCategories);
  };
};

export type ListCategoriesUseCase = ReturnType<typeof createListCategoriesUseCase>;
