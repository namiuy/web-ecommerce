import { useState, useRef, useCallback } from 'react';
import { Box, Text, Heading, Image, SimpleGrid, Flex, Button, useToast, Spinner, Icon } from '@chakra-ui/react';
import { uploadFile } from 'shared';
import { Buffer } from 'buffer';
import { AddIcon, CheckIcon } from '@chakra-ui/icons';
import { Photo } from 'shared/entities/photo';

export const PhotosUpload = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingPhotoIndex, setUploadingPhotoIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        if (e.target) {
          setPhotos(prev => [
            ...prev,
            {
              id: `${Date.now()}-${Math.random()}`,
              name: file.name,
              url: e.target!.result as string,
              mimetype: file.type,
              uploaded: false,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const openFileDialog = () => inputRef.current?.click();

  const handleCancel = () => {
    setPhotos([]);
    setIsUploading(false);
    setUploadingPhotoIndex(null);
  };

  const handleConfirm = async () => {
    setIsUploading(true);

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      try {
        setUploadingPhotoIndex(i);
        const blob = await fetch(photo.url).then(r => r.blob());
        const arrayBuffer = await blob.arrayBuffer();
        const [name, extension] = splitNameAndExtension(photo.name);

        const backendFile = {
          name,
          originalname: photo.name,
          buffer: Buffer.from(arrayBuffer),
          mimetype: photo.mimetype,
          extension,
          path: 'products',
        };

        const { data, error } = await uploadFile({ file: backendFile });

        if (error) throw new Error(error);
        if (!data?.url) throw new Error('La respuesta no contiene una URL válida');

        setPhotos(prev => prev.map((p, idx) => (idx === i ? { ...p, uploaded: true } : p)));
      } catch (err: any) {
        toast({
          title: 'Error al subir',
          description: err.message || 'Error desconocido',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }

    setUploadingPhotoIndex(null);
    setIsUploading(false);

    toast({
      title: 'Subida completa',
      description: 'Todas las imágenes fueron subidas correctamente.',
      status: 'success',
      duration: 4000,
      isClosable: true,
    });

    setPhotos([]);
  };

  const splitNameAndExtension = (filename: string): [string, string] => {
    const parts = filename.split('.');
    if (parts.length < 2) return [filename, ''];
    const ext = parts.pop()!;
    return [parts.join('.'), ext];
  };

  return (
    <Box
      flex="1"
      onClick={photos.length === 0 ? openFileDialog : undefined}
      {...(photos.length === 0
        ? {
            border: '2px dashed',
            borderColor: 'gray.300',
            borderRadius: 'xl',
            cursor: 'pointer',
            bg: 'gray.50',
            minH: '400px',
            textAlign: 'center' as const,
            p: 6,
            w: '100%',
          }
        : {})}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg"
        multiple
        style={{ display: 'none' }}
        onChange={e => handleFiles(e.target.files)}
      />

      {photos.length === 0 ? (
        <Box
          h="100%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          onDrop={e => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          onDragOver={e => e.preventDefault()}
        >
          <Heading size="md">Arrastrá tus fotos aquí</Heading>
          <Text fontSize="sm" color="gray.500" mt={2}>
            O hacé clic en cualquier parte del área para seleccionarlas
          </Text>
        </Box>
      ) : (
        <>
          <Box
            minH="36rem"
            maxH="36rem"
            overflowY="auto"
            pr={2}
            onDrop={e => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
            onDragOver={e => e.preventDefault()}
          >
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
              {photos.map((photo, index) => (
                <Flex
                  key={photo.id}
                  direction="column"
                  borderWidth="1px"
                  borderRadius="md"
                  boxShadow="sm"
                  overflow="hidden"
                  bg="white"
                  role="group"
                  position="relative"
                  minH="17rem"
                >
                  {uploadingPhotoIndex === index && (
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      w="100%"
                      h="100%"
                      bg="rgba(255,255,255,0.8)"
                      zIndex="2"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Spinner size="md" color="blue.500" />
                    </Box>
                  )}

                  {photo.uploaded && (
                    <Box
                      position="absolute"
                      top="0.5rem"
                      left="0.5rem"
                      zIndex={3}
                      bg="green.500"
                      color="white"
                      px={2}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="bold"
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <CheckIcon boxSize={3} />
                      Subida
                    </Box>
                  )}

                  <Button
                    size="xs"
                    colorScheme="red"
                    position="absolute"
                    top="0.5rem"
                    right="0.5rem"
                    zIndex={3}
                    display="none"
                    _groupHover={{ display: 'inline-flex' }}
                    onClick={() => setPhotos(prev => prev.filter(p => p.id !== photo.id))}
                    isDisabled={isUploading}
                  >
                    ✕
                  </Button>

                  <Box flex="1" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
                    <Image src={photo.url} alt="preview" objectFit="contain" maxH="15rem" maxW="100%" />
                  </Box>

                  <Box bg="gray.100" px={2} py={1}>
                    <Text fontSize="sm" color="gray.700" textAlign="center" isTruncated title={photo.name}>
                      {photo.name}
                    </Text>
                  </Box>
                </Flex>
              ))}
              <Flex
                direction="column"
                borderWidth="2px"
                borderStyle="dashed"
                borderColor="gray.300"
                borderRadius="md"
                boxShadow="sm"
                overflow="hidden"
                bg="gray.50"
                justify="center"
                align="center"
                cursor="pointer"
                minH="17rem"
                onClick={!isUploading ? openFileDialog : undefined}
              >
                <Icon as={AddIcon} boxSize={8} color="gray.400" />
              </Flex>
            </SimpleGrid>
          </Box>

          <Flex justify="space-between" align="center" gap={4} mt={6}>
            <Text fontSize="sm" color="gray.500">
              Podés seguir arrastrando o seleccionando imágenes
            </Text>

            <Flex gap={4}>
              <Button variant="ghost" colorScheme="gray" onClick={handleCancel} isDisabled={isUploading}>
                Cancelar
              </Button>
              <Button colorScheme="blue" onClick={handleConfirm} isLoading={isUploading}>
                Confirmar
              </Button>
            </Flex>
          </Flex>
        </>
      )}
    </Box>
  );
};
