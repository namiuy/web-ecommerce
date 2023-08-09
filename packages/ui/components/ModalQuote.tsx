import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { FC, useState } from 'react';
import { Product } from 'shared/entities/product';
import { FileUpload } from './FileUpload';
import { File as FileEntity } from 'shared/entities/file';
import { Flex } from '..';
import { Field, Formik } from 'formik';
import { validateEmpty } from 'shared';

const _backgroundColor = 'rgba(0, 0, 0, .6)';
const _backdropFilter = 'saturate(180%) blur(6px)';
const _formErrorMessageFontSize = '.7rem';

type ModalQuoteProps = {
  isOpen: boolean;
  product: Product;
  onClose: () => void;
};

type FormControlInputProps = {
  disabled: boolean;
  id: string;
  label: string;
  errors: Record<string, any>;
  touched: Record<string, any>;
  validate: (value: string) => string | undefined;
};

const FormControlInput: FC<FormControlInputProps> = ({ disabled, id, label, errors, touched, validate }) => (
  <FormControl isInvalid={Boolean(errors[id] && touched[id])}>
    <Flex flexDir="column">
      <FormLabel htmlFor="name">{label}</FormLabel>
      <Field as={Input} id={id} name={id} disabled={disabled} type="text" variant="filled" validate={validate} />
    </Flex>
    <FormErrorMessage fontSize={_formErrorMessageFontSize}>{errors[id] as string}</FormErrorMessage>
  </FormControl>
);

export const ModalQuote: FC<ModalQuoteProps> = ({ isOpen, product, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [attachment, setAttachment] = useState<FileEntity>();
  const [attachmentError, setAttachmentError] = useState<string>();

  const initialValues = {
    name: '',
    last_name: '',
    phone: '',
    email: '',
    branch: '',
    comments: '',
    attachment_url: '',
  };

  const handleSubmit = () => {
    if (!attachment) {
      setAttachmentError('Debe subir un recibo');
      return;
    }

    //   const body = {
    //      product: product.id,
    //     user_id: '-1',
    //     user_name: name,
    //     user_last_name: last_name,
    //     user_phone: phone,
    //     user_email: email,
    //     preferred_branch: branch,
    //     comments,
    //     attachment_url: '/'
    // };
  };

  return (
    <Modal isOpen={isOpen} size="5xl" onClose={onClose}>
      <ModalOverlay bg={_backgroundColor} backdropFilter={_backdropFilter} />
      <ModalContent>
        <ModalHeader>Solicitud de Financiación</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ values, errors, touched, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Flex direction="column" p="2rem 1rem" gap=".5rem">
                  <FormControlInput
                    disabled={isLoading}
                    id="name"
                    label="Nombre"
                    errors={errors}
                    touched={touched}
                    validate={validateEmpty}
                  />

                  <FormControlInput
                    disabled={isLoading}
                    id="last_name"
                    label="Apellido"
                    errors={errors}
                    touched={touched}
                    validate={validateEmpty}
                  />

                  <FormControl isInvalid={Boolean(attachmentError)}>
                    <FileUpload path="attachments" onSuccess={setAttachment} />
                    <FormErrorMessage fontSize={_formErrorMessageFontSize}>{attachmentError}</FormErrorMessage>
                  </FormControl>

                  <Button
                    disabled={isLoading}
                    isLoading={isLoading}
                    type="submit"
                    colorScheme="primary"
                    width="full"
                    _hover={{ opacity: 0.8 }}
                  >
                    Solicitar
                  </Button>
                </Flex>
              </form>
            )}
          </Formik>

          <br />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
