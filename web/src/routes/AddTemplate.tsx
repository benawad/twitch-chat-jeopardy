import { Button, Heading, Textarea } from "@chakra-ui/core";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Wrapper } from "../components/Wrapper";
import { useCreateTemplateMutation } from "../generated/graphql";

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
  const [{ fetching }, createTemplate] = useCreateTemplateMutation();
  const [text, setText] = useState("");
  const history = useHistory();
  return (
    <Wrapper>
      <Heading mb={8}>New Template</Heading>
      <Textarea value={text} onChange={(e: any) => setText(e.target.value)} />
      <Button
        mt={8}
        isLoading={fetching}
        variantColor="teal"
        onClick={() => {
          createTemplate({ data: text }).then(() => {
            history.push("/templates");
          });
        }}
      >
        save
      </Button>
    </Wrapper>
  );
};
