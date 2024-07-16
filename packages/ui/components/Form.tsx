import {
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Flex,
  IconButton,
  Textarea,
  Select,
} from '@chakra-ui/react';
import { Field, Formik } from 'formik';
import { FC } from 'react';
import { MdDelete } from 'react-icons/md';

export type FormSchema = {
  id: string;
  type: string;
  disabled?: boolean;
  label: string;
  attr?: string;
  defaultValue: any;
  validate?: (value: string) => undefined | string;
};

type SelectOption = { id: number | string; name: string };

type FromProps = {
  isLoading: boolean;
  schema: FormSchema[];
  data?: Record<string, any>;
  selectors: Record<string, SelectOption[]>;
  onSubmit: (values: Record<string, any>) => void;
  onDelete?: () => void;
};

const initFromSchema = (schema: FormSchema[]): Record<string, any> => {
  let initialValues: Record<string, any> = {};
  schema.forEach(({ id, defaultValue }) => (initialValues[id] = defaultValue));
  return initialValues;
};

export const Form: FC<FromProps> = ({ isLoading, schema, data, selectors, onSubmit, onDelete }) => {
  const isAdd = !data;
  return (
    <Formik initialValues={data || initFromSchema(schema)} onSubmit={onSubmit}>
      {({ values, errors, touched, handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Flex direction="column" p="2rem 1rem" gap=".5rem">
            {schema.map(({ id, type, label, validate }, i) => (
              <FormControl key={i} isInvalid={Boolean(errors[id] && touched[id])}>
                <Flex direction={type === 'checkbox' ? 'row' : 'column'}>
                  <FormLabel htmlFor={id} mt={type === 'checkbox' ? '0.5rem' : 0}>
                    {label}
                  </FormLabel>
                  {type === 'select' ? (
                    <Field as={Select} id={id} type={type} disabled={isLoading} variant="filled" value={values[id]}>
                      {selectors[id].map(({ id, name }, i) => (
                        <option key={i} value={id}>
                          {name}
                        </option>
                      ))}
                    </Field>
                  ) : (
                    <Field
                      as={type === 'checkbox' ? undefined : type === 'textarea' ? Textarea : Input}
                      id={id}
                      name={id}
                      disabled={isLoading}
                      type={type}
                      variant="filled"
                      height={type === 'textarea' ? '12rem' : undefined}
                      validate={validate}
                    />
                  )}
                </Flex>
                <FormErrorMessage fontSize=".7rem">{errors[id] as string}</FormErrorMessage>
              </FormControl>
            ))}
            <Flex gap="1rem">
              {onDelete && (
                <IconButton disabled={isLoading} icon={<MdDelete />} aria-label="" variant="ghost" onClick={onDelete} />
              )}
              {/* <Button
                disabled={isLoading}
                isLoading={isLoading}
                type="submit"
                colorScheme="secondary"
                bg="red.800"
                color="white"
                width="full"
                _hover={{ opacity: 0.8 }}
              >
                Cancelar
              </Button> */}
              <Button
                disabled={isLoading}
                isLoading={isLoading}
                type="submit"
                colorScheme="primary"
                bg="lightgrey"
                width="full"
                _hover={{ opacity: 0.8 }}
              >
                {isAdd ? 'Agregar' : 'Modificar'}
              </Button>
            </Flex>
          </Flex>
        </form>
      )}
    </Formik>
  );
};
