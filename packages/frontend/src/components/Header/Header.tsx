import { Box, Button, Flex, Image, Link, Stack } from "@chakra-ui/react";
import React from "react";
import { BiMap } from "react-icons/bi";
import { GrThreeDEffects } from "react-icons/gr";
import { useRecoilState } from "recoil";

import { mapState } from "../../store/viewer";
import { ConnectWalletWrapper } from "../ConnectWalletWrapper";
import { Wallet } from "../Wallet";

export interface HeaderProps {
  position?: "absolute";
  top?: "0";
}

export const Header: React.FC<HeaderProps> = ({ position, top }) => {
  const [mapMode, setMapState] = useRecoilState(mapState);

  return (
    <Box p="4" as="header" w="full" position={position} top={top} zIndex="10">
      <Flex justify="space-between" align="center">
        <Link href="/">
          <Image src="/img/brands/logo.png" h="10" alt="logo" />
        </Link>
        <Stack direction={"row"}>
          <ConnectWalletWrapper mode="icon">
            <Wallet />
          </ConnectWalletWrapper>
          <Button
            rounded="md"
            onClick={() => {
              setMapState(mapMode === "2d" ? "3d" : "2d");
            }}
          >
            {mapMode === "2d" && <GrThreeDEffects />}
            {mapMode === "3d" && <BiMap />}
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
};
