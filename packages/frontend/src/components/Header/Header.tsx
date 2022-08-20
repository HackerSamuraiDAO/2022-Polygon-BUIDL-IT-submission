import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

import config from "../../../config.json";
import { ConnectWalletWrapper } from "../ConnectWalletWrapper";
import { Wallet } from "../Wallet";

export interface HeaderProps {
  position?: "absolute";
  top?: "0";
}

export const Header: React.FC<HeaderProps> = ({ position, top }) => {
  return (
    <Box py="2" px="4" as="header" w="full" position={position} backgroundColor={"white"} top={top} zIndex="1401">
      <Flex justify="space-between" align="center">
        <Text fontWeight={"bold"} color={config.styles.text.color}>
          {config.app.name}
        </Text>
        <ConnectWalletWrapper>
          <Wallet />
        </ConnectWalletWrapper>
      </Flex>
    </Box>
  );
};
