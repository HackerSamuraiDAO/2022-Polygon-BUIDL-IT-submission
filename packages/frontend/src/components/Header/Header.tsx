import { Box, Flex, Image, Link } from "@chakra-ui/react";
import React from "react";

import { ConnectWalletWrapper } from "../ConnectWalletWrapper";
import { Wallet } from "../Wallet";

export interface HeaderProps {
  position?: "absolute";
  top?: "0";
}

export const Header: React.FC<HeaderProps> = ({ position, top }) => {
  return (
    <Box p="4" as="header" w="full" position={position} top={top} zIndex="10">
      <Flex justify="space-between" align="center">
        <Link href="/">
          <Image src="/img/brands/logo.png" h="10" alt="logo" />
        </Link>
        <ConnectWalletWrapper mode="icon">
          <Wallet />
        </ConnectWalletWrapper>
      </Flex>
    </Box>
  );
};
