import { Box, Button, Center, Flex, HStack, Image, Link, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { ethers } from "ethers";
import React from "react";
import { Camera } from "react-camera-pro";
import { useSigner } from "wagmi";

import RakugakiArtifact from "../../../../contracts/artifacts/contracts/Rakugaki.sol/Rakugaki.json";
import networks from "../../../../contracts/networks.json";
import config from "../../../config.json";
// import { add, file, metadata } from "../../lib/ipfs";
import { file, metadata } from "../../lib/ipfs";
import { sleep } from "../../lib/utils/sleep";
import { ConnectWalletWrapper } from "../ConnectWalletWrapper";
import { useLogger } from "../Logger";
import { Modal } from "../Modal";
import { Map } from "./Map";
import { ModeChangeIcon } from "./ModeChangeIcon";
import { Model } from "./Model";
import { TakePhotoIcon } from "./TakePhotoIcon";

export type MainMode = "map" | "photo";
export type ModalMode = "photoPreview" | "modelPreview" | "completed";

export const Main: React.FC = () => {
  const { logger, onOpen: onLoggerOpen, onClose: onLoggerClose } = useLogger();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [mainMode, setMainMode] = React.useState<MainMode>("map");
  const [modalMode, setModalMode] = React.useState<ModalMode>("photoPreview");
  const [isLoading, setIsLoading] = React.useState(false);

  const [image, setImage] = React.useState("");
  const camera = React.useRef<{ takePhoto: () => string }>(null);
  const [lat, setLat] = React.useState<number>();
  const [lng, setLng] = React.useState<number>();

  const [tokenId, setTokenId] = React.useState("");

  const [model, setModel] = React.useState("");

  const photoModeInitialMessage = "photo mode selected. you can take graffiti to covert to NFT.";

  const { data: signer } = useSigner();

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition((geo) => {
      setLat(geo.coords.latitude);
      setLng(geo.coords.longitude);
    });
  }, []);

  const clear = () => {
    setIsLoading(false);
    setImage("");
    setModalMode("photoPreview");
    onClose();
    onLoggerClose();
    logger.log(photoModeInitialMessage);
  };

  const backToInitialMode = () => {
    logger.log(config.app.defaultLog);
    setMainMode("map");
  };
  const mainModeChange = () => {
    logger.log(photoModeInitialMessage);
    setMainMode("photo");
  };

  const takePhoto = () => {
    if (!camera.current) {
      return;
    }
    onLoggerOpen();
    const image = camera.current.takePhoto();
    setImage(image);
    logger.log("phote is taken. you can create 3d model or retake.");
    onOpen();
  };

  const retake = () => {
    clear();
  };

  const photoToModel = async () => {
    setIsLoading(true);
    logger.log("creating 3d models now. it takes some time...");
    await sleep(3000);
    setIsLoading(false);
    logger.log("3d model created. you can create NFT or retake.");
    setModalMode("modelPreview");
  };

  const modelToNFT = async () => {
    const network = networks.rinkeby;
    if (!signer || !network || !lat || !lng) {
      return;
    }

    setIsLoading(true);
    logger.log("creating NFT now. it takes some time...");
    //TODO: update
    const imageFile = file(image, "nft.png", "image/png");
    console.log(imageFile);
    const modelURI = await file(model, "nft.gltf", "model/gltf+json");
    console.log(modelURI);
    const tokenURI = await metadata("rakugaki", "rakugaki", imageFile, modelURI, lat, lng);
    const contract = new ethers.Contract(network.contracts.rakugaki, RakugakiArtifact.abi, signer);
    const address = await signer.getAddress();
    console.log(address, tokenURI);
    const tx = await contract.mint(address, tokenURI);
    const receipt = await tx.wait();
    console.log(receipt);
    const tokenId = receipt.events[0].args.tokenId.toString();
    console.log(tokenId);
    setTokenId(tokenId);
    setIsLoading(false);
    logger.log("NFT created. you can view it in map viewer or opensea.");
    setModalMode("completed");
  };

  const viewInMap = async () => {
    clear();
    logger.log("You can view created NFT in map viewer.");
    setMainMode("map");
  };

  return (
    <Box minHeight={"100vh"} w={"full"} position="relative">
      {mainMode === "map" && <Map lat={lat} lng={lng} />}
      {mainMode === "photo" && <Camera ref={camera} errorMessages={{}} facingMode="environment" />}
      <Box bottom="8" position="absolute" w="full">
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
                shadow="md"
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
            <Image
              height="400px"
              src={image}
              fallbackSrc="/img/placeholders/400x400.png"
              alt="preview"
              objectFit={"contain"}
            />
          )}
          {modalMode === "modelPreview" && (
            <Center height="400px">
              <Model image={image} setModel={setModel} />
            </Center>
          )}
          {modalMode === "completed" && (
            <Stack height={"400px"} spacing="8" px="4">
              <Text align={"center"} fontSize="xl" fontWeight={"bold"}>
                Congratulations!
              </Text>
              <Text align={"center"} fontSize="xs">
                Your graffiti is converted to NFT, you can view it in Opensea and use it in your favorite metaverse.
              </Text>
              <Center height="240px">
                <Model image={image} />
              </Center>
            </Stack>
          )}

          <HStack justify={"space-between"} spacing="4">
            {modalMode !== "completed" ? (
              <Button
                w="full"
                rounded={config.styles.button.rounded}
                size={config.styles.button.size}
                fontSize={config.styles.button.fontSize}
                color={config.styles.text.color.primary}
                shadow="md"
                onClick={retake}
              >
                Retake
              </Button>
            ) : (
              <Button
                w="full"
                rounded={config.styles.button.rounded}
                size={config.styles.button.size}
                fontSize={config.styles.button.fontSize}
                color={config.styles.text.color.primary}
                shadow="md"
                onClick={viewInMap}
              >
                View in Map
              </Button>
            )}

            {modalMode === "photoPreview" && (
              <Button
                w="full"
                rounded={config.styles.button.rounded}
                size={config.styles.button.size}
                fontSize={config.styles.button.fontSize}
                color={config.styles.text.color.primary}
                onClick={photoToModel}
                isLoading={isLoading}
                shadow="md"
              >
                Convert to 3d model
              </Button>
            )}
            {modalMode === "modelPreview" && (
              <ConnectWalletWrapper w="full">
                <Button
                  w="full"
                  rounded={config.styles.button.rounded}
                  size={config.styles.button.size}
                  fontSize={config.styles.button.fontSize}
                  color={config.styles.text.color.primary}
                  onClick={modelToNFT}
                  isLoading={isLoading}
                  shadow="md"
                >
                  Convert to NFT
                </Button>
              </ConnectWalletWrapper>
            )}
            {modalMode === "completed" && (
              <Button
                as={Link}
                w="full"
                rounded={config.styles.button.rounded}
                size={config.styles.button.size}
                fontSize={config.styles.button.fontSize}
                color={config.styles.text.color.primary}
                href={`https://testnets.opensea.io/assets/rinkeby/${networks.rinkeby.contracts.rakugaki}/${tokenId}`}
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                View in Opensea
              </Button>
            )}
          </HStack>
        </Stack>
      </Modal>
    </Box>
  );
};
