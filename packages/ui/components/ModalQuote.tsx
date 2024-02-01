import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel as FormLabelChalkra,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Image,
  Box,
  Grid,
  GridItem,
  Text,
  Select,
  Textarea,
  Icon,
  Progress,
} from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { Product } from 'shared/entities/product';
import { FileUpload } from './FileUpload';
import { File as FileEntity } from 'shared/entities/file';
import { Quote } from 'shared/entities/quote';
import { useQuoteRequest } from 'shared/hooks';
import { Flex } from '..';
import { Field, Formik } from 'formik';
import { validateEmail, validateEmpty } from 'shared';
import styled from '@emotion/styled';
import { MdCheckCircle } from 'react-icons/md';

const _grey0 = 'brand.grey.1';
const _backgroundColor = 'rgba(0, 0, 0, .6)';
const _backdropFilter = 'saturate(180%) blur(6px)';
const _formErrorMessageFontSize = '.7rem';

const FormLabel = styled(FormLabelChalkra)`
  font-size: 0.75rem;
`;

type ModalQuoteProps = {
  isOpen: boolean;
  product: Product;
  onClose: () => void;
};

type FormControlInputProps = {
  disabled: boolean;
  id: string;
  label: string;
  type?: string;
  errors: Record<string, any>;
  touched: Record<string, any>;
  validate?: (value: string) => string | undefined;
};

const FormControlInput: FC<FormControlInputProps> = ({
  disabled,
  id,
  label,
  type = 'text',
  errors,
  touched,
  validate,
}) => (
  <FormControl isInvalid={Boolean(errors[id] && touched[id])}>
    <Flex flexDir="column">
      <FormLabel htmlFor="name" size="xs">
        {label}
      </FormLabel>
      <Field as={Input} id={id} name={id} disabled={disabled} type={type} variant="outline" validate={validate} />
    </Flex>
    <FormErrorMessage fontSize={_formErrorMessageFontSize}>{errors[id] as string}</FormErrorMessage>
  </FormControl>
);

export const ModalQuote: FC<ModalQuoteProps> = ({ isOpen, product, onClose }) => {
  const [attachment, setAttachment] = useState<FileEntity>();
  const [attachmentError, setAttachmentError] = useState<string>();
  const [requestBody, setRequestBody] = useState<Quote>();
  const { isLoading, data: isSuccess, error } = useQuoteRequest(requestBody);

  const initialValues = {
    user_name: '',
    user_last_name: '',
    user_phone: '',
    user_email: '',
    preferred_branch: 'MVD',
    comments: '',
    attachment: '',
  };

  useEffect(() => {
    if (error) console.log(error);
  }, [error]);

  const handleSubmit = (values: Record<string, any>) => {
    if (isLoading) return;

    const body = {
      ...values,
      product: product.id,
      user_id: '-1',
      attachment: attachment?.name ?? '',
    };

    setRequestBody(body as Quote);
  };

  return (
    <Modal isOpen={isOpen} size="lg" onClose={onClose}>
      <ModalOverlay bg={_backgroundColor} backdropFilter={_backdropFilter} />
      <ModalContent>
        <ModalHeader>Solicitud de Financiación</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Flex flexDir="column" gap="2rem" pb="2rem">
            {isSuccess ? (
              <Flex flexDir="column" gap="1rem" textAlign="center">
                <Icon w="4rem" h="4rem" as={MdCheckCircle} margin="auto" color="green.400" />
                La solicitud fue enviada correctamente.
                <Button mt="1rem" variant="link" onClick={onClose}>
                  Volver
                </Button>
              </Flex>
            ) : (
              <>
                <Grid templateColumns="auto 1fr" gap="1rem">
                  <GridItem>
                    <Image
                      maxH="6rem"
                      alt={product?.name}
                      src={product?.image_url}
                      fit="contain"
                      fallback={<Box w="100%" bg={_grey0} />}
                    />
                  </GridItem>
                  <GridItem>
                    <Text fontWeight="extrabold" fontSize="1.25rem">
                      {product.name}
                    </Text>

                    <Text fontSize="0.75rem">
                      <small>Cod</small> {product.id}
                    </Text>

                    <Text fontSize="1.25rem">
                      <small>U$S</small> {product.price}
                    </Text>
                  </GridItem>
                </Grid>

                <div>
                  <FormLabel>Requisitos</FormLabel>
                  <Text fontSize="0.875rem">
                    Presentar cédula vigente, últimos 3 recibos de sueldo, constancia de domicilio y no estar en el
                    Clearing.
                    <br />
                    Residencia legal: 6 meses de antigüedad laboral.
                  </Text>
                </div>

                <Formik initialValues={initialValues} validateOnBlur={false} onSubmit={handleSubmit}>
                  {({ values, errors, touched, handleSubmit: hsf }) => (
                    <form onSubmit={hsf}>
                      <Flex direction="column" gap="1rem">
                        <FormControlInput
                          disabled={isLoading}
                          id="user_name"
                          label="Nombre"
                          errors={errors}
                          touched={touched}
                          validate={validateEmpty}
                        />

                        <FormControlInput
                          disabled={isLoading}
                          id="user_last_name"
                          label="Apellido"
                          errors={errors}
                          touched={touched}
                          validate={validateEmpty}
                        />

                        <FormControlInput
                          disabled={isLoading}
                          id="user_email"
                          label="Email"
                          errors={errors}
                          touched={touched}
                          validate={validateEmail}
                        />

                        <FormControlInput
                          disabled={isLoading}
                          id="user_phone"
                          label="Teléfono"
                          errors={errors}
                          touched={touched}
                          validate={validateEmpty}
                        />

                        <FormControl>
                          <Flex flexDir="column">
                            <FormLabel htmlFor="preferred_branch">Sucursal de preferencia</FormLabel>
                            <Field
                              as={Select}
                              disabled={isLoading}
                              name="preferred_branch"
                              value={values.preferred_branch}
                            >
                              <option value="MVD">Montevideo</option>
                              <option value="LPS">Las Piedras</option>
                            </Field>
                          </Flex>
                        </FormControl>

                        <FormControl>
                          <FormLabel>Comentarios</FormLabel>
                          <Field as={Textarea} disabled={isLoading} name="comments" value={values.comments} />
                        </FormControl>

                        {/* <FormControl isInvalid={Boolean(attachmentError)}>
                          <FormLabel>Adjuntar ultimo recibo de sueldo</FormLabel>
                          <FileUpload disabled={isLoading} path="attachments" onSuccess={setAttachment} />
                          <FormErrorMessage fontSize={_formErrorMessageFontSize}>{attachmentError}</FormErrorMessage>
                        </FormControl> */}

                        <Progress
                          h={isLoading ? '4px' : '1px'}
                          m="1rem 0"
                          size="xs"
                          isIndeterminate={isLoading}
                          colorScheme="black"
                        />

                        <Button
                          disabled={isLoading}
                          type="submit"
                          colorScheme="primary"
                          width="full"
                          size="lg"
                          _hover={{ opacity: 0.8 }}
                        >
                          Enviar solicitar
                        </Button>

                        <FormControl isInvalid={Boolean(error)}>
                          <FormErrorMessage fontSize={_formErrorMessageFontSize}>
                            Ha ocurrido un error, por favor intente en unos minutos.
                          </FormErrorMessage>
                        </FormControl>
                      </Flex>
                    </form>
                  )}
                </Formik>
              </>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
