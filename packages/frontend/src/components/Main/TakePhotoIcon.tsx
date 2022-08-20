import { Box, BoxProps, Flex } from "@chakra-ui/react";
import React from "react";

export const TakePhotoIcon: React.FC<BoxProps> = ({ ...props }) => {
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
      <Box backgroundColor={"gray.200"} w="90%" h="90%" rounded="full" />
    </Flex>
  );
};
