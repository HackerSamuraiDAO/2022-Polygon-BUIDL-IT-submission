import { Box, Container, Flex, Stack } from "@chakra-ui/react";
import React from "react";

import config from "../../../config.json";
import { Console } from "../Console";
import { Footer } from "../Footer";
import { Header } from "../Header";

export interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const position = config.app.layout === "dynamic" ? "absolute" : undefined;
  const headerTop = config.app.layout === "dynamic" ? "0" : undefined;
  const footerBottom = config.app.layout === "dynamic" ? "0" : undefined;

  return (
    <Box backgroundColor={config.styles.background.color.layout} position="relative">
      <Flex minHeight={"100vh"} direction={"column"}>
        <Header position={position} top={headerTop} />
        {children}
        <Console position={position} />
        <Footer position={position} bottom={footerBottom} />
      </Flex>
    </Box>
  );
};
