import { Box, Center, Container, Fade, Flex, Image, Stack, useDisclosure } from "@chakra-ui/react";
import React from "react";

import config from "../../../config.json";
import { sleep } from "../../lib/utils/sleep";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { Logger } from "../Logger";

export interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const [mode, setMode] = React.useState<"intro" | "app">("intro");

  const position = config.app.layout === "dynamic" ? "absolute" : undefined;
  const headerTop = config.app.layout === "dynamic" ? "0" : undefined;
  const footerBottom = config.app.layout === "dynamic" ? "0" : undefined;

  React.useEffect(() => {
    sleep(4000).then(() => {
      onClose();
      sleep(500).then(() => {
        setMode("app");
      });
    });
  }, [onClose]);

  return (
    <Box position="relative">
      <Flex minHeight={"100vh"} direction={"column"}>
        {mode === "intro" && (
          <Center height="100vh">
            <Fade in={isOpen}>
              <Image src="/img/brands/anime.gif" objectFit={"contain"} maxW="xs" alt="anime" />
            </Fade>
          </Center>
        )}
        {mode === "app" && (
          <Center height="100vh">
            <Header position={position} top={headerTop} />
            {children}
            {/* <Logger position={position} /> */}
            {/* <Footer position={position} bottom={footerBottom} /> */}
          </Center>
        )}
      </Flex>
    </Box>
  );
};
