import { Box, BoxProps, Flex, Icon } from "@chakra-ui/react";
import React from "react";
import { AiOutlineCamera } from "react-icons/ai";

export const ModeChangeIcon: React.FC<BoxProps> = ({ ...props }) => {
  return (
    <Flex
      border="4px"
      borderColor="gray.200"
      rounded="full"
      cursor="pointer"
      justify={"center"}
      align="center"
      {...props}
    >
      <Icon as={AiOutlineCamera} color="gray.200" w="60%" h="60%" />
    </Flex>
  );
};
