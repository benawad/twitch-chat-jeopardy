import React, { HTMLProps } from "react";
import { useField } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputProps,
} from "@chakra-ui/core";

export const InputField = ({
  label,
  ...props
}: { label: string; name: string } & InputProps) => {
  const [field, meta, helpers] = useField(props);
  return (
    <FormControl isInvalid={!!meta.error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...field} {...props} />
      <FormErrorMessage>{meta.error && meta.error}</FormErrorMessage>
    </FormControl>
  );
};
