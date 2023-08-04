import { FC, useRef, useState, useEffect, ChangeEvent, DragEvent } from 'react';
import { MdDelete } from 'react-icons/md';
import { Button, Icon } from '@chakra-ui/react';

type Result = {
  path: string;
  originalname: string;
};

export const FileUpload: FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Result>();
  const [error, setError] = useState<string>();
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (file) {
      const formData = new FormData();
      formData.append('upload', file);
      setIsLoading(true);
      fetch('http://localhost:3001/files/attachments/upload', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => setResult(data))
        .catch(error => {
          console.error('Error al cargar la imagen:', error);
          setError(error.message);
        })
        .finally(() => setIsLoading(false));
    }
  }, [file]);

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
        as="div"
        isLoading={isLoading}
        w="12rem"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleFileButtonClick}
        border={dragging ? '1px dashed' : '1px solid'}
      >
        Subir archivo
      </Button>
    </>
  );
};
