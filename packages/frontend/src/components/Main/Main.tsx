import { Box, Button, Flex, HStack, Image, Link, Stack, Text, useDisclosure } from "@chakra-ui/react";
import React from "react";

import config from "../../../config.json";
import { sleep } from "../../lib/utils/sleep";
import { ConnectWalletWrapper } from "../ConnectWalletWrapper";
import { useConsole } from "../Console";
import { Modal } from "../Modal";
import { ModeChangeIcon } from "./ModeChangeIcon";
import { TakePhotoIcon } from "./TakePhotoIcon";

export type MainMode = "map" | "photo";
export type ModalMode = "photoPreview" | "modelPreview" | "completed";

export const Main: React.FC = () => {
  const { console } = useConsole();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [mainMode, setMainMode] = React.useState<MainMode>("map");
  const [modalMode, setModalMode] = React.useState<ModalMode>("photoPreview");
  const [isLoading, setIsLoading] = React.useState(false);
  const [image, setImage] = React.useState("");

  const photoModeInitialMessage = "photo mode selected. you can take graffiti to covert to NFT.";

  const clear = () => {
    setIsLoading(false);
    setImage("");
    setModalMode("photoPreview");
    onClose();
    console.log(photoModeInitialMessage);
  };

  const backToInitialMode = () => {
    console.log(config.app.defaultLog);
    setMainMode("map");
  };

  const mainModeChange = () => {
    console.log(photoModeInitialMessage);
    setMainMode("photo");
  };

  const takePhoto = () => {
    console.log("phote is taken. you can create 3d model or retake.");
    setImage("set image here");
    onOpen();
  };

  const retake = () => {
    clear();
  };

  const photoToModel = async () => {
    setIsLoading(true);
    console.log("creating 3d models now. it takes some time...");
    await sleep(3000);
    setIsLoading(false);
    console.log("3d model created. you can create NFT or retake.");
    setModalMode("modelPreview");
  };

  const modelToNFT = async () => {
    setIsLoading(true);
    console.log("creating NFT now. it takes some time...");
    await sleep(3000);
    setIsLoading(false);
    console.log("NFT created. you can view it in map viewer or opensea.");
    setModalMode("completed");
  };

  const viewInMap = async () => {
    clear();
    console.log("You can view created NFT in map viewer.");
    setMainMode("map");
  };

  return (
    <Box backgroundColor={"black"} minHeight={"100vh"} w={"full"} position="relative">
      <Box bottom="16" position="absolute" w="full">
        <Flex justify={"center"} position="relative">
          <Flex position="absolute" left="12" color="white" h="full" align="center">
            {mainMode === "photo" && (
              <Button
                py="4"
                px="4"
                rounded={config.styles.button.rounded}
                size={"xs"}
                fontSize={"xs"}
                color={config.styles.text.color.primary}
                opacity="80%"
                onClick={backToInitialMode}
              >
                Cancel
              </Button>
            )}
          </Flex>
          <Box>
            {mainMode === "map" ? (
              <ModeChangeIcon h="16" w="16" onClick={mainModeChange} />
            ) : (
              <TakePhotoIcon h="16" w="16" onClick={takePhoto} />
            )}
          </Box>
          <Box></Box>
        </Flex>
      </Box>
      <Modal
        isOpen={isOpen}
        onClose={retake}
        header={modalMode === "photoPreview" ? "Photo Preview" : modalMode === "modelPreview" ? "Model Preview" : "　"}
      >
        <Stack spacing="4">
          {modalMode === "photoPreview" && (
            <Image height={"400px"} src={image} fallbackSrc="/img/placeholders/400x400.png" alt="preview" />
          )}
          {modalMode === "modelPreview" && (
            <Box className="sketchfab-embed-wrapper" w="full">
              <iframe
                width="100%"
                height="400px"
                title="Trapped (animated)"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; fullscreen; xr-spatial-tracking"
                xr-spatial-tracking
                execution-while-out-of-viewport
                execution-while-not-rendered
                web-share
                src="https://sketchfab.com/models/26009ae82e8c4211978de4e4d892f5e7/embed"
              ></iframe>
            </Box>
          )}
          {modalMode === "completed" && (
            <Stack height={"400px"} spacing="8" px="4">
              <Text align={"center"} fontSize="xl" fontWeight={"bold"}>
                Congratulations!
              </Text>
              <Text align={"center"} fontSize="xs">
                Your graffiti is converted to NFT, you can view it in Opensea and use it in your favorite metaverse.
              </Text>
              <Image height={"240px"} src={image} fallbackSrc="/img/placeholders/400x400.png" alt="preview" />
            </Stack>
          )}

          <HStack justify={"space-between"} spacing="4">
            {modalMode !== "completed" ? (
              <Button
                w="full"
                variant={config.styles.button.variant}
                rounded={config.styles.button.rounded}
                size={config.styles.button.size}
                fontSize={config.styles.button.fontSize}
                color={config.styles.text.color.primary}
                onClick={retake}
              >
                Retake
              </Button>
            ) : (
              <Button
                w="full"
                variant={config.styles.button.variant}
                rounded={config.styles.button.rounded}
                size={config.styles.button.size}
                fontSize={config.styles.button.fontSize}
                color={config.styles.text.color.primary}
                onClick={viewInMap}
              >
                View in Map
              </Button>
            )}

            <ConnectWalletWrapper w="full">
              {modalMode === "photoPreview" && (
                <Button
                  w="full"
                  variant={config.styles.button.variant}
                  rounded={config.styles.button.rounded}
                  size={config.styles.button.size}
                  fontSize={config.styles.button.fontSize}
                  color={config.styles.text.color.primary}
                  onClick={photoToModel}
                  isLoading={isLoading}
                >
                  Convert to 3d model
                </Button>
              )}
              {modalMode === "modelPreview" && (
                <Button
                  w="full"
                  variant={config.styles.button.variant}
                  rounded={config.styles.button.rounded}
                  size={config.styles.button.size}
                  fontSize={config.styles.button.fontSize}
                  color={config.styles.text.color.primary}
                  onClick={modelToNFT}
                  isLoading={isLoading}
                >
                  Convert to NFT
                </Button>
              )}
              {modalMode === "completed" && (
                <Button
                  as={Link}
                  w="full"
                  variant={config.styles.button.variant}
                  rounded={config.styles.button.rounded}
                  size={config.styles.button.size}
                  fontSize={config.styles.button.fontSize}
                  color={config.styles.text.color.primary}
                  href="https://opensea.com"
                  target="_blank"
                  style={{ textDecoration: "none" }}
                >
                  View in Opensea
                </Button>
              )}
            </ConnectWalletWrapper>
          </HStack>
        </Stack>
      </Modal>
    </Box>
  );
};
