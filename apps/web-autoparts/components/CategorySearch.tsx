import { useState, useEffect, useMemo, useRef, FC } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  Spinner,
  Tag,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { SearchIcon, ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import { useCategoryList, useCategoryById, useBrandsByCategory, useModelsByBrandAndCategory } from 'shared';
import type { Category } from 'shared/entities/category';
import { useSessionCache, generateCacheKey } from '../hooks/useSessionCache';

interface CategorySearchProps {
  onSearch: (categoryId: string) => void;
  loading: boolean;
}

// Subcomponent: Filter Tag
interface FilterTagProps {
  label: string;
  value: string;
  onRemove: () => void;
}

const FilterTag: FC<FilterTagProps> = ({ label, value, onRemove }) => (
  <VStack align="flex-start" spacing={2} w="full">
    <Text fontSize="xs" fontWeight="bold">
      {label}
    </Text>
    <Tag
      size="md"
      borderRadius="md"
      variant="solid"
      colorScheme="blue"
      bg="blue.500"
      color="white"
    >
      <TagLabel fontSize="sm" flex="1" isTruncated>
        {value}
      </TagLabel>
      <TagCloseButton onClick={onRemove} />
    </Tag>
  </VStack>
);

// Subcomponent: List Item Button
interface ListItemButtonProps {
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const ListItemButton: FC<ListItemButtonProps> = ({ isSelected, onClick, children }) => (
  <Button
    variant="ghost"
    justifyContent="space-between"
    borderRadius={0}
    px={4}
    py={4}
    h="auto"
    fontWeight="normal"
    bg={isSelected ? 'blue.50' : 'transparent'}
    borderLeft={isSelected ? '4px solid' : 'none'}
    borderBottom="1px solid"
    borderColor={isSelected ? 'blue.500' : 'gray.100'}
    _hover={{ bg: 'blue.50' }}
    onClick={onClick}
  >
    <Text fontSize="md" textAlign="left" flex="1" color={isSelected ? 'blue.700' : 'gray.700'} isTruncated>
      {children}
    </Text>
    <ChevronRightIcon color="gray.400" boxSize={5} />
  </Button>
);

// Subcomponent: Empty State
interface EmptyStateProps {
  message: string;
}

const EmptyState: FC<EmptyStateProps> = ({ message }) => (
  <Text fontSize="sm" color="gray.500" py={8} textAlign="center">
    {message}
  </Text>
);

// Subcomponent: Loading State
const LoadingState: FC = () => (
  <Box py={8} textAlign="center">
    <Spinner size="md" color="gray.500" />
  </Box>
);

export const CategorySearch = ({ onSearch, loading }: CategorySearchProps) => {
  const router = useRouter();
  const { data: categories, isLoading: loadingCategories } = useCategoryList();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<Category | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const filterInputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const isRestoringRef = useRef(false);
  const hasRestoredRef = useRef(false);

  const hasSubCategories = selectedCategory?.sub_categories && selectedCategory.sub_categories.length > 0;

  // Only fetch category by ID if category has NO subcategories (to get the real name)
  const shouldFetchCategoryById = selectedCategory && !hasSubCategories;
  const { data: categoryById, isLoading: loadingCategoryById } = useCategoryById(
    shouldFetchCategoryById ? selectedCategory.id : ''
  );

  // Determine which category name to use for loading brands
  const activeCategoryName = useMemo(() => {
    if (selectedSubCategory) return selectedSubCategory.name;
    if (selectedCategory && !hasSubCategories && categoryById) return categoryById.name;
    return '';
  }, [selectedCategory, selectedSubCategory, hasSubCategories, categoryById]);

  // Determine which category ID to use for caching (more reliable than name)
  const activeCategoryId = useMemo(() => {
    if (selectedSubCategory) return selectedSubCategory.id;
    if (selectedCategory && !hasSubCategories) return selectedCategory.id;
    return '';
  }, [selectedCategory, selectedSubCategory, hasSubCategories]);

  // Load brands based on active category name
  const { data: brands, isLoading: loadingBrands } = useBrandsByCategory(activeCategoryName);

  // Load models based on active category name and selected brand
  const { data: models, isLoading: loadingModels } = useModelsByBrandAndCategory(
    activeCategoryName,
    selectedBrand
  );

  // Cache brands and models in sessionStorage using category ID (not name)
  const brandsCacheKey = activeCategoryId ? generateCacheKey.brands(activeCategoryId) : '';
  const modelsCacheKey = activeCategoryId && selectedBrand
    ? generateCacheKey.models(activeCategoryId, selectedBrand)
    : '';

  const { getCachedData: getCachedBrands } = useSessionCache(brandsCacheKey, brands, !!activeCategoryId);
  const { getCachedData: getCachedModels } = useSessionCache(modelsCacheKey, models, !!activeCategoryId && !!selectedBrand);

  // Determine current step and list to show
  const currentStep = useMemo(() => {
    if (selectedBrand) return 'model';
    if (activeCategoryName) return 'brand';
    if (selectedCategory && hasSubCategories) return 'subcategory';
    if (selectedCategory && !hasSubCategories) return 'brand';
    return 'category';
  }, [selectedCategory, hasSubCategories, activeCategoryName, selectedBrand]);

  // Filtered lists based on current step
  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    if (!filterValue.trim()) return categories;
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [categories, filterValue]);

  const filteredSubCategories = useMemo(() => {
    if (!selectedCategory?.sub_categories) return [];
    if (!filterValue.trim()) return selectedCategory.sub_categories;
    return selectedCategory.sub_categories.filter((subCat) =>
      subCat.name.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [selectedCategory, filterValue]);

  const filteredBrands = useMemo(() => {
    if (!brands) return [];
    if (!filterValue.trim()) return brands;
    return brands.filter((brand) =>
      brand.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [brands, filterValue]);

  const filteredModels = useMemo(() => {
    if (!models) return [];
    if (!filterValue.trim()) return models;
    return models.filter((model) =>
      model.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [models, filterValue]);

  // Restore state from URL on mount
  useEffect(() => {
    if (!router.isReady || !categories || isInitialized || hasRestoredRef.current) return;

    isRestoringRef.current = true;
    hasRestoredRef.current = true;

    const { catId, subCatId, brand } = router.query;
    let categoryIdForBrands = '';

    // Step 1: Restore category
    if (catId && typeof catId === 'string') {
      const category = categories.find(cat => cat.id === catId);
      if (category) {
        setSelectedCategory(category);

        // Step 2: Restore subcategory (if category has subcategories)
        const hasSubCategories = category.sub_categories && category.sub_categories.length > 0;

        if (subCatId && typeof subCatId === 'string' && hasSubCategories) {
          const subCategory = category.sub_categories!.find(sub => sub.id === subCatId);
          if (subCategory) {
            setSelectedSubCategory(subCategory);
            categoryIdForBrands = subCategory.id;
          }
        }

        // If no subcategories or didn't restore a subcategory, use the category ID
        if (!categoryIdForBrands && !hasSubCategories) {
          categoryIdForBrands = category.id;
        }
      }
    }

    // Step 3: Restore brand (try from loaded data or sessionStorage)
    if (brand && typeof brand === 'string') {
      // First, try from currently loaded brands
      if (brands && brands.includes(brand)) {
        setSelectedBrand(brand);
      }
      // Otherwise, try from sessionStorage using the category ID
      else if (categoryIdForBrands) {
        const cacheKey = generateCacheKey.brands(categoryIdForBrands);
        const cachedData = sessionStorage.getItem(cacheKey);

        if (cachedData) {
          try {
            const cachedBrands = JSON.parse(cachedData);
            if (Array.isArray(cachedBrands) && cachedBrands.includes(brand)) {
              setSelectedBrand(brand);
            }
          } catch (e) {
            console.warn('Failed to parse brands from sessionStorage:', e);
          }
        }
      }
    }

    setIsInitialized(true);
  }, [router.isReady, categories, brands, isInitialized]);

  // Mark restoration as complete AFTER state has been updated
  useEffect(() => {
    if (!isInitialized || !isRestoringRef.current) return;

    const timer = requestAnimationFrame(() => {
      isRestoringRef.current = false;
    });

    return () => cancelAnimationFrame(timer);
  }, [isInitialized, selectedCategory, selectedSubCategory, selectedBrand]);

  // Generate scroll key based on current step and selections
  // Save scroll for subcategory, brand and model lists (not main category list)
  const scrollKey = useMemo(() => {
    if (currentStep === 'model' && activeCategoryId && selectedBrand) {
      return `scroll-model-${activeCategoryId}-${selectedBrand}`;
    }
    if (currentStep === 'brand' && activeCategoryId) {
      return `scroll-brand-${activeCategoryId}`;
    }
    if (currentStep === 'subcategory' && selectedCategory) {
      return `scroll-subcategory-${selectedCategory.id}`;
    }
    return ''; // Don't save scroll for main category list
  }, [currentStep, activeCategoryId, selectedBrand, selectedCategory]);

  // Save scroll position when scrolling (for subcategory, brand and model lists)
  useEffect(() => {
    const container = listContainerRef.current;
    if (!container || !scrollKey) return; // Skip if no scrollKey (main category list)

    const handleScroll = () => {
      sessionStorage.setItem(scrollKey, container.scrollTop.toString());
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [scrollKey]);

  // Restore scroll position after data loads (for subcategory, brand and model lists)
  useEffect(() => {
    if (!isInitialized || !scrollKey) return; // Skip if no scrollKey (main category list)

    const container = listContainerRef.current;
    if (!container) return;

    // For model list, wait longer to ensure all items are rendered
    const delay = currentStep === 'model' ? 200 : 50;

    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        const savedScroll = sessionStorage.getItem(scrollKey);

        if (savedScroll) {
          container.scrollTop = parseInt(savedScroll, 10);
        }
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [currentStep, activeCategoryId, selectedBrand, isInitialized, brands, models, scrollKey]);

  // Update URL when selections change (without reloading)
  useEffect(() => {
    if (!isInitialized || isRestoringRef.current) return;

    const query: Record<string, string> = {};

    // Always preserve mode parameter as 'category'
    query.mode = 'category';

    // Add current selections (but not model since we redirect on model selection)
    if (selectedCategory) {
      query.catId = selectedCategory.id;
    }
    if (selectedSubCategory) {
      query.subCatId = selectedSubCategory.id;
    }
    if (selectedBrand) {
      query.brand = selectedBrand;
    }

    // Update URL without reload
    router.replace({ pathname: router.pathname, query }, undefined, { shallow: true });
  }, [selectedCategory, selectedSubCategory, selectedBrand, isInitialized]);

  // Reset filter when step changes
  useEffect(() => {
    setFilterValue('');
  }, [currentStep]);

  // Redirect to results page when model is selected
  useEffect(() => {
    if (selectedModel && activeCategoryName && selectedBrand) {
      const queryParams = new URLSearchParams({
        cn: activeCategoryName,
        bn: selectedBrand,
        mn: selectedModel,
      });
      router.push(`/productos?${queryParams.toString()}`);
    }
  }, [selectedModel, activeCategoryName, selectedBrand]);

  const handleCategorySelect = (category: Category) => {
    // Clear scroll for the previous category's subcategory/brand/model lists
    if (selectedCategory) {
      sessionStorage.removeItem(`scroll-subcategory-${selectedCategory.id}`);
      if (activeCategoryId) {
        sessionStorage.removeItem(`scroll-brand-${activeCategoryId}`);
        if (selectedBrand) {
          sessionStorage.removeItem(`scroll-model-${activeCategoryId}-${selectedBrand}`);
        }
      }
    }

    // Reset scroll to top when selecting new category (going forward)
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
    }

    setSelectedCategory(category);
    // Reset dependent selections (only if not restoring from URL)
    if (isInitialized && !isRestoringRef.current) {
      setSelectedSubCategory(null);
      setSelectedBrand('');
      setSelectedModel('');
    }
  };

  const handleSubCategorySelect = (subCategory: Category) => {
    // Clear scroll for the previous subcategory's brand/model lists
    if (selectedSubCategory && activeCategoryId) {
      sessionStorage.removeItem(`scroll-brand-${activeCategoryId}`);
      if (selectedBrand) {
        sessionStorage.removeItem(`scroll-model-${activeCategoryId}-${selectedBrand}`);
      }
    }

    // Reset scroll to top when selecting new subcategory (going forward)
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
    }

    setSelectedSubCategory(subCategory);
    // Reset dependent selections (only if not restoring from URL)
    if (isInitialized && !isRestoringRef.current) {
      setSelectedBrand('');
      setSelectedModel('');
    }
  };

  const handleBrandSelect = (brand: string) => {
    // Clear scroll for the previous brand's model list
    if (selectedBrand && activeCategoryId) {
      const oldScrollKey = `scroll-model-${activeCategoryId}-${selectedBrand}`;
      sessionStorage.removeItem(oldScrollKey);
    }

    // Reset scroll to top when selecting new brand (going forward)
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
    }

    setSelectedBrand(brand);
    // Reset dependent selections (only if not restoring from URL)
    if (isInitialized && !isRestoringRef.current) {
      setSelectedModel('');
    }
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    // Auto-redirect happens via useEffect
  };

  const handleRemoveCategory = () => {
    // Clear subcategory scroll only (going backwards, clean current step)
    if (selectedCategory) {
      sessionStorage.removeItem(`scroll-subcategory-${selectedCategory.id}`);
    }

    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedBrand('');
    setSelectedModel('');
  };

  const handleRemoveSubCategory = () => {
    // Clear brand scroll only (going backwards, clean current step)
    if (activeCategoryId) {
      sessionStorage.removeItem(`scroll-brand-${activeCategoryId}`);
    }

    setSelectedSubCategory(null);
    setSelectedBrand('');
    setSelectedModel('');
  };

  const handleRemoveBrand = () => {
    // Clear model scroll only (going backwards, clean current step)
    if (activeCategoryId && selectedBrand) {
      sessionStorage.removeItem(`scroll-model-${activeCategoryId}-${selectedBrand}`);
    }

    setSelectedBrand('');
    setSelectedModel('');
  };

  const handleClear = () => {
    // Clear all scroll positions
    if (selectedCategory) {
      sessionStorage.removeItem(`scroll-subcategory-${selectedCategory.id}`);
    }
    if (activeCategoryId) {
      sessionStorage.removeItem(`scroll-brand-${activeCategoryId}`);
      if (selectedBrand) {
        sessionStorage.removeItem(`scroll-model-${activeCategoryId}-${selectedBrand}`);
      }
    }

    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedBrand('');
    setSelectedModel('');
  };

  const handleBackNavigation = () => {
    // Remove the last selected filter going backwards and clear corresponding scroll
    if (selectedModel) {
      setSelectedModel('');
    } else if (selectedBrand) {
      // Clear model scroll when going back from brand
      if (activeCategoryId && selectedBrand) {
        sessionStorage.removeItem(`scroll-model-${activeCategoryId}-${selectedBrand}`);
      }
      setSelectedBrand('');
    } else if (selectedSubCategory) {
      // Clear brand scroll when going back from subcategory
      if (activeCategoryId) {
        sessionStorage.removeItem(`scroll-brand-${activeCategoryId}`);
      }
      setSelectedSubCategory(null);
    } else if (selectedCategory) {
      // Clear subcategory/brand/model scroll when going back from category
      sessionStorage.removeItem(`scroll-subcategory-${selectedCategory.id}`);
      if (activeCategoryId) {
        sessionStorage.removeItem(`scroll-brand-${activeCategoryId}`);
        if (selectedBrand) {
          sessionStorage.removeItem(`scroll-model-${activeCategoryId}-${selectedBrand}`);
        }
      }
      setSelectedCategory(null);
    }
  };

  return (
    <Box w="full">
      <VStack spacing={6} align="stretch">
        {/* Main Layout: Filters Left + List Right */}
        <HStack spacing={4} align="flex-start">
          {/* Left Sidebar - Selected Filters (Amazon Style) */}
          {(selectedCategory || selectedSubCategory || selectedBrand) && (
            <Box
              w={{ base: '100%', md: '180px' }}
              minW="180px"
              p={4}
              display={{ base: 'none', md: 'block' }}
            >
              <VStack spacing={4} align="flex-start">
                {selectedCategory && (
                  <FilterTag
                    label="Categoría"
                    value={selectedCategory.name}
                    onRemove={handleRemoveCategory}
                  />
                )}
                {selectedSubCategory && (
                  <FilterTag
                    label="Sub categoría"
                    value={selectedSubCategory.name}
                    onRemove={handleRemoveSubCategory}
                  />
                )}
                {selectedBrand && (
                  <FilterTag
                    label="Marca"
                    value={selectedBrand}
                    onRemove={handleRemoveBrand}
                  />
                )}
              </VStack>
            </Box>
          )}

          {/* Right Side - Sequential List Display */}
          <Box
            flex="1"
            border="1px solid"
           borderColor="gray.200"
            borderRadius="lg"
            overflow="hidden"
            bg="white"
            boxShadow='0 10px 30px -10px rgba(0, 0, 0, 0.15)'
          >
          {/* Filter Input */}
          <Box px={4} pt={4} pb={3} borderBottom="1px solid"borderColor="gray.200" >
            <Box position="relative" mb={3}>
              {/* Back button for mobile - positioned absolutely */}
              {(selectedCategory || selectedSubCategory || selectedBrand || selectedModel) && (
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<ChevronLeftIcon />}
                  onClick={handleBackNavigation}
                  display={{ base: 'flex', md: 'none' }}
                  color="blue.600"
                  position="absolute"
                  left={0}
                  top="50%"
                  transform="translateY(-50%)"
                  px={0}
                >
                  Atrás
                </Button>
              )}
              <Text fontWeight="bold" fontSize="md" color="blue.800" textAlign={{ base: 'center', md: 'left' }}>
                {currentStep === 'category' && 'Categoría'}
                {currentStep === 'subcategory' && 'Sub categoría'}
                {currentStep === 'brand' && 'Marca'}
                {currentStep === 'model' && 'Modelo'}
              </Text>
            </Box>
            <InputGroup size="md">
              <InputRightElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputRightElement>
              <Input
                ref={filterInputRef}
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                borderRadius="md"
                bg="white"
                borderColor="gray.200"
                placeholder="Filtrar"
                _focus={{
                  borderColor: 'blue.400',
                  boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)'
                }}
                isDisabled={
                  (currentStep === 'category' && loadingCategories) ||
                  (currentStep === 'brand' && loadingBrands) ||
                  (currentStep === 'model' && loadingModels)
                }
              />
            </InputGroup>
          </Box>

          {/* List Content */}
          <VStack
            ref={listContainerRef}
            align="stretch"
            spacing={0}
            minH={{ base: "calc(100vh - 288px)", lg: "calc(100vh - 388px)" }}
            maxH={{ base: "calc(100vh - 288px)", lg: "calc(100vh - 388px)" }}
            overflowY="auto"
            bg="white"
          >
            {/* Category List */}
            {currentStep === 'category' && (
              <>
                {loadingCategories ? (
                  <LoadingState />
                ) : filteredCategories.length === 0 ? (
                  <EmptyState message="No se encontraron categorías" />
                ) : (
                  filteredCategories.map((category) => (
                    <ListItemButton
                      key={category.id}
                      isSelected={selectedCategory?.id === category.id}
                      onClick={() => handleCategorySelect(category)}
                    >
                      {category.name}
                    </ListItemButton>
                  ))
                )}
              </>
            )}

            {/* Subcategory List */}
            {currentStep === 'subcategory' && (
              <>
                {filteredSubCategories.length === 0 ? (
                  <EmptyState message="No se encontraron subcategorías" />
                ) : (
                  filteredSubCategories.map((subCategory) => (
                    <ListItemButton
                      key={subCategory.id}
                      isSelected={selectedSubCategory?.id === subCategory.id}
                      onClick={() => handleSubCategorySelect(subCategory)}
                    >
                      {subCategory.name}
                    </ListItemButton>
                  ))
                )}
              </>
            )}

            {/* Brand List */}
            {currentStep === 'brand' && (
              <>
                {(loadingBrands || !brands) ? (
                  <LoadingState />
                ) : filteredBrands.length === 0 ? (
                  <EmptyState message="No hay marcas disponibles" />
                ) : (
                  filteredBrands.map((brand, index) => (
                    <ListItemButton
                      key={`${brand}-${index}`}
                      isSelected={selectedBrand === brand}
                      onClick={() => handleBrandSelect(brand)}
                    >
                      {brand}
                    </ListItemButton>
                  ))
                )}
              </>
            )}

            {/* Model List */}
            {currentStep === 'model' && (
              <>
                {(loadingModels || !models) ? (
                  <LoadingState />
                ) : filteredModels.length === 0 ? (
                  <EmptyState message="No hay modelos disponibles" />
                ) : (
                  filteredModels.map((model, index) => (
                    <ListItemButton
                      key={`${model}-${index}`}
                      isSelected={selectedModel === model}
                      onClick={() => handleModelSelect(model)}
                    >
                      {model}
                    </ListItemButton>
                  ))
                )}
              </>
            )}
          </VStack>
        </Box>
        </HStack>
      </VStack>
    </Box>
  );
};
