import { Box, ButtonGroup, IconButton, Stack, Text } from "@chakra-ui/react";
import React from "react";

import config from "../../../config.json";
import { LinkKey } from "../../types/confg";
import { icons } from "./data";

export interface FooterProps {
  position?: "absolute";
  bottom?: "0";
}

export const Footer: React.FC<FooterProps> = ({ position, bottom }) => {
  return (
    <Box p="4" as="footer" position={position} w="full" bottom={bottom} zIndex="1401">
      <Stack justify="space-between" direction="row" align="center">
        <Text fontSize="xs" color={config.styles.text.color.secondary}>
          {config.app.description}
        </Text>
        <ButtonGroup variant={"ghost"}>
          {Object.entries(config.links).map(([key, link]) => (
            <IconButton
              key={key}
              as="a"
              href={link.uri}
              target="_blank"
              aria-label={key}
              icon={icons[key as LinkKey]}
            />
          ))}
        </ButtonGroup>
      </Stack>
    </Box>
  );
};
