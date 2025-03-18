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
import { useEffect, useState } from 'react';
import { Product } from 'shared/entities/product';
import { File as FileEntity } from 'shared/entities/file';
import { Quote } from 'shared/entities/quote';
import { useQuoteRequest } from 'shared/hooks';
import { Flex } from '..';
import { Field, Formik } from 'formik';
import { formatPrice, validateEmail, validateEmpty } from 'shared';
import styled from '@emotion/styled';
import { MdCheckCircle } from 'react-icons/md';
import { ColorSelector } from './ColorSelector';

const _grey0 = 'brand.grey.1';
const _backgroundColor = 'rgba(0, 0, 0, .6)';
const _backdropFilter = 'saturate(180%) blur(6px)';
const _formErrorMessageFontSize = '.7rem';

const _productSale = 'brand.productDetail.sale';

const FormLabel = styled(FormLabelChalkra)`
  font-size: 0.875rem;
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

const FormControlInput = ({ disabled, id, label, type = 'text', errors, touched, validate }: FormControlInputProps) => (
  <FormControl isInvalid={Boolean(errors[id] && touched[id])}>
    <Flex flexDir="column">
      <FormLabel htmlFor="name" size="sm">
        {label}
      </FormLabel>
      <Field as={Input} id={id} name={id} disabled={disabled} type={type} variant="outline" validate={validate} />
    </Flex>
    <FormErrorMessage fontSize={_formErrorMessageFontSize}>{errors[id] as string}</FormErrorMessage>
  </FormControl>
);

export const ModalQuote = ({ isOpen, product, onClose }: ModalQuoteProps) => {
  const [attachment, setAttachment] = useState<FileEntity>();
  const [attachmentError, setAttachmentError] = useState<string>();
  const [quoteValues, setQuoteValues] = useState<Quote>();
  const { isLoading, data: isSuccess, error } = useQuoteRequest(quoteValues);

  const [selectedColor, setSelectedColor] = useState<string>('');

  useEffect(() => {
    if (product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product.colors]);

  useEffect(() => {
    if (error) console.log(error);
  }, [error]);

  const handleSubmit = (values: Record<string, any>) => {
    if (isLoading) return;

    const body = {
      ...values,
      color: selectedColor,
      product: product.id,
      user_id: '-1',
      attachment: attachment?.name ?? '',
    };

    setQuoteValues(body as Quote);
  };

  return (
    <Modal isOpen={isOpen} size="lg" onClose={onClose} isCentered={isSuccess}>
      <ModalOverlay bg={_backgroundColor} backdropFilter={_backdropFilter} />
      <ModalContent>
        {!isSuccess && <ModalHeader>Solicitud de Financiación</ModalHeader>}
        {!isSuccess && <ModalCloseButton />}
        <ModalBody>
          <Flex flexDir="column" gap="2rem">
            {isSuccess ? (
              <Flex textAlign="center" flexDir="column" justifyContent="center" alignItems="center" h="12rem">
                <Icon as={MdCheckCircle} color="green.500" w="3rem" h="3rem"></Icon>
                <Text w="80%" fontSize="1.375rem" fontWeight="medium" lineHeight="2rem" pb="0.25rem" pt="0.75rem">
                  La solicitud fue enviada correctamente.
                </Text>
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

                    {!isLoading && product.discount ? (
                      <Flex alignItems="baseline" gap="0.5rem">
                        <Text fontSize="1.375rem" fontWeight="semibold">
                          <small>U$S</small> {formatPrice(product.price - (product.price * product.discount) / 100)}
                        </Text>
                        <Text as="s" fontSize="1rem" color={_productSale}>
                          U$S {product.price}
                        </Text>
                      </Flex>
                    ) : (
                      <Text fontSize="1.25rem">
                        <small>U$S</small> {product.price}
                      </Text>
                    )}
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

                <Formik
                  initialValues={{
                    user_name: '',
                    user_last_name: '',
                    user_phone: '',
                    user_email: '',
                    preferred_branch: 'MVD',
                    comments: '',
                    attachment: '',
                    color: selectedColor,
                  }}
                  validateOnBlur={false}
                  onSubmit={handleSubmit}
                >
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

                        {product.colors && product.colors.length > 0 && (
                          <ColorSelector
                            colors={product.colors}
                            selectedColor={selectedColor}
                            onSelect={setSelectedColor}
                            isSelect
                          />
                        )}

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
                          Enviar solicitud
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
