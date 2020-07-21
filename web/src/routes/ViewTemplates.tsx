import React from "react";
import { Wrapper } from "../components/Wrapper";
import { Heading, Flex, Button, List, ListItem } from "@chakra-ui/core";
import { Link } from "react-router-dom";
import {
  useTemplatesQuery,
  useStartGameMutation,
  useRemoveTemplateMutation,
} from "../generated/graphql";

interface ViewTemplatesProps {}

export const ViewTemplates: React.FC<ViewTemplatesProps> = ({}) => {
  const [{ data }] = useTemplatesQuery();
  const [
    { fetching: removeFetching },
    removeTemplate,
  ] = useRemoveTemplateMutation();
  return (
    <Wrapper>
      <Flex justify="space-between" align="center">
        <Heading>Templates</Heading>
        <Link to="/templates/add">
          <Button variantColor="pink">Add Template</Button>
        </Link>
      </Flex>
      <List styleType="disc" spacing={3} mt={8}>
        {data?.templates.map((t) => {
          return (
            <ListItem key={t.id}>
              {t.title}
              <Link to={`/game/${t.id}`}>
                <Button ml={4} variantColor="teal" variant="link">
                  start game
                </Button>
              </Link>
              <Button
                ml={4}
                isLoading={removeFetching}
                onClick={() => removeTemplate({ templateId: t.id })}
                variantColor="red"
                variant="link"
              >
                remove
              </Button>
            </ListItem>
          );
        })}
      </List>
    </Wrapper>
  );
};
