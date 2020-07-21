import React from "react";
import { Formik, Form } from "formik";
import { Button, Box } from "@chakra-ui/core";
import { InputField } from "../form-fields/InputField";
import { useAdminLoginMutation } from "../generated/graphql";
import { useHistory } from "react-router-dom";

interface AdminLoginProps {}

export const AdminLogin: React.FC<AdminLoginProps> = ({}) => {
  const history = useHistory();
  const [, adminLogin] = useAdminLoginMutation();
  return (
    <Box w="100%" maxW="400px" m="auto" mt={8}>
      <Formik
        initialValues={{ password: "", username: "" }}
        onSubmit={async (input, { setErrors }) => {
          const result = await adminLogin({ input });
          if (result.data?.adminLogin) {
            history.push("/");
          } else if (!result.error) {
            setErrors({ password: "invalid login" });
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField label="Username" name="username" />
            <InputField
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
            />
            <Button
              mt={4}
              variantColor="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};
