import { Box, BoxProps, Flex, Icon } from "@chakra-ui/react";
import React from "react";
import { AiFillCamera } from "react-icons/ai";

export const ModeChangeIcon: React.FC<BoxProps> = ({ ...props }) => {
  return (
    <Flex
      border="2px"
      borderColor="gray.400"
      rounded="full"
      cursor="pointer"
      justify={"center"}
      align="center"
      shadow="md"
      backgroundColor={"white"}
      {...props}
    >
      <Icon as={AiFillCamera} color="gray.400" w="75%" h="75%" />
    </Flex>
  );
};
