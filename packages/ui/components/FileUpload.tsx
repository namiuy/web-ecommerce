/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useEffect, ChangeEvent, DragEvent } from 'react';
import { Button, ButtonProps, Icon } from '@chakra-ui/react';
import { Box } from '..';
import { upload } from 'shared';
import { File as FileEntity } from 'shared/entities/file';
import { HiOutlineUpload } from 'react-icons/hi';

type FileUploadProps = {
  disabled?: boolean;
  path: string;
  fileName?: string;
  onSuccess: (result?: FileEntity) => void;
};

export const FileUpload = ({
  disabled,
  path,
  fileName,
  children,
  onSuccess,
  ...buttonProps
}: FileUploadProps & ButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (file) {
      setIsLoading(true);
      upload(path, file, fileName)
        .then(data => {
          onSuccess(data);
        })
        .catch(error => {
          console.error('Error al cargar la imagen:', error);
          setError(error.message);
        })
        .finally(() => setIsLoading(false));
    }
  }, [file, path]);

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files?.length) {
      const file = event.dataTransfer.files[0];
      setFile(file);
    }
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target?.files?.length) {
      const file = event.target?.files && event.target.files[0];
      if (file) {
        setFile(file);
      }
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*, .pdf"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />
      <Button
        w="100%"
        border={dragging ? '1px dashed' : '1px solid'}
        cursor="pointer"
        {...buttonProps}
        isLoading={isLoading}
        disabled={disabled}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleFileButtonClick}
      >
        <Icon as={HiOutlineUpload} boxSize="1.5rem" />
      </Button>
      {error && (
        <Box color="red" fontSize=".8rem">
          {error}
        </Box>
      )}
    </>
  );
};
