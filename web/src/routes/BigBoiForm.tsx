import React, { Fragment } from "react";
import { Wrapper } from "../components/Wrapper";
import { Form, Formik, FieldArray } from "formik";
import { InputField } from "../form-fields/InputField";
import { Heading, Button, Box } from "@chakra-ui/core";

interface AddTemplateProps {}

const pointValues = ["100", "200", "300", "400", "500"];

const sections = Array.from(Array(5), () => ({
  name: "",
  questions: pointValues.map((pointValue) => ({
    pointValue,
    text: "",
    answers: Array.from(Array(3), () => ({ text: "", correct: false })),
  })),
}));

export const AddTemplate: React.FC<AddTemplateProps> = ({}) => {
  return (
    <Wrapper>
      <Heading mb={8}>New Template</Heading>
      <Formik
        initialValues={{
          title: "",
          sections,
        }}
        onSubmit={() => {}}
      >
        {({ values }) => {
          return (
            <Form>
              <InputField label="Title" name="title" />
              {values.sections.map((section, i) => (
                <Box
                  mt={6}
                  maxW="sm"
                  p={4}
                  borderWidth="1px"
                  rounded="lg"
                  overflow="hidden"
                  key={i}
                >
                  <InputField
                    name={`sections.${i}.name`}
                    label="section name"
                  />
                  {section.questions.map((question, k) => (
                    <Box ml={8} mt={2} key={k}>
                      <InputField
                        name={`sections.${i}.questions.${k}.text`}
                        label={`question ` + question.pointValue}
                      />
                      {question.answers.map((answer, j) => (
                        <Box ml={8} mt={2} key={j}>
                          <InputField
                            name={`sections.${i}.questions.${k}.answers.${j}.text`}
                            label={"answer " + (j + 1)}
                          />
                        </Box>
                      ))}
                    </Box>
                  ))}
                </Box>
              ))}
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
};
