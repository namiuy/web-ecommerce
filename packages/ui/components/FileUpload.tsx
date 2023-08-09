import { FC, useRef, useState, useEffect, ChangeEvent, DragEvent } from 'react';
import { MdDelete } from 'react-icons/md';
import { Button, Icon } from '@chakra-ui/react';
import { Box } from '..';
import { attachmentUpload } from 'shared';
import { File as FileEntity } from 'shared/entities/file';

type FileUploadProps = {
  path: string;
  onSuccess: (result?: FileEntity) => void;
};

export const FileUpload: FC<FileUploadProps> = ({ path, onSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FileEntity>();
  const [error, setError] = useState<string>();
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (file) {
      setIsLoading(true);
      attachmentUpload(path, file)
        .then(data => {
          setResult(data);
          onSuccess(data);
        })
        .catch(error => {
          console.error('Error al cargar la imagen:', error);
          setError(error.message);
        })
        .finally(() => setIsLoading(false));
    }
  }, [file, onSuccess, path]);

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

  const clear = () => {
    setFile(undefined);
    setResult(undefined);
    onSuccess(undefined);
  };

  return result ? (
    <Button
      w="12rem"
      overflow="hidden"
      whiteSpace="nowrap"
      display="block"
      textOverflow="ellipsis"
      leftIcon={<Icon transform="translateY(3px)" as={MdDelete} />}
      onClick={clear}
    >
      {result.originalname}
    </Button>
  ) : (
    <>
      <input ref={fileInputRef} type="file" onChange={handleFileInputChange} style={{ display: 'none' }} />
      <Button
        isLoading={isLoading}
        w="12rem"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleFileButtonClick}
        border={dragging ? '1px dashed' : '1px solid'}
        cursor="pointer"
      >
        Subir archivo
      </Button>
      {error && (
        <Box color="red" fontSize=".8rem">
          {error}
        </Box>
      )}
    </>
  );
};
