import { Box, BoxProps, Flex } from "@chakra-ui/react";
import React from "react";

export const TakePhotoIcon: React.FC<BoxProps> = ({ ...props }) => {
  return (
    <Flex
      border="4px"
      borderColor="gray.400"
      rounded="full"
      cursor="pointer"
      justify={"center"}
      align="center"
      shadow="md"
      backgroundColor={"white"}
      {...props}
    >
      <Box backgroundColor={"gray.400"} w="90%" h="90%" rounded="full" />
    </Flex>
  );
};
