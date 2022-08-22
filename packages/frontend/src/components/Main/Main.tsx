import { Box, Button, Center, Flex, HStack, Image, Link, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import axios from "axios";
import { ethers } from "ethers";
import React from "react";
import { Camera } from "react-camera-pro";
import { useRecoilValue } from "recoil";
import { useNetwork, useSigner } from "wagmi";

import RakugakiArtifact from "../../../../contracts/artifacts/contracts/Rakugaki.sol/Rakugaki.json";
import networks from "../../../../contracts/networks.json";
import config from "../../../config.json";
import { axiosConfig } from "../../lib/axios";
import { network } from "../../lib/env";
import { file, metadata } from "../../lib/ipfs";
import { sleep } from "../../lib/utils/sleep";
import { currentLocationState, locationState, mapState } from "../../store/viewer";
import { ConnectWalletWrapper } from "../ConnectWalletWrapper";
import { useLogger } from "../Logger";
import { Modal } from "../Modal";
import { ThreeMap } from "./3DMap";
import { Map } from "./Map";
import { ModeChangeIcon } from "./ModeChangeIcon";
import { Model } from "./Model";
import { TakePhotoIcon } from "./TakePhotoIcon";

export type MainMode = "map" | "photo";
export type ModalMode = "photoPreview" | "modelPreview" | "completed";

const countDecimals = function (value: number) {
  if (Math.floor(value) === value) return 0;
  return value.toString().split(".")[1].length || 0;
};

export const Main: React.FC = () => {
  const mapMode = useRecoilValue(mapState);
  const threeLocation = useRecoilValue(locationState);
  const { logger, onOpen: onLoggerOpen, onClose: onLoggerClose } = useLogger();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [mainMode, setMainMode] = React.useState<MainMode>("map");
  const [modalMode, setModalMode] = React.useState<ModalMode>("photoPreview");
  const [nftMinted, setNFTMinted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [image, setImage] = React.useState("");
  const camera = React.useRef<{ takePhoto: () => string }>(null);

  const currentLocation = useRecoilValue(currentLocationState);

  const [tokenId, setTokenId] = React.useState("");

  const [model, setModel] = React.useState("");

  const [tokens, setTokens] = React.useState([]);
  const photoModeInitialMessage = "photo mode selected. you can take graffiti to covert to NFT.";

  const { data: signer } = useSigner();

  const { chain } = useNetwork();

  // const { initMap } = use3dMap();

  const clear = () => {
    setIsLoading(false);
    setNFTMinted(false);
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

  const mainModeChange = async () => {
    if (!currentLocation.lat || !currentLocation.lng) {
      alert("please enable location. this app requires your location.");
      return;
    }
    setIsLoading(true);
    logger.log(photoModeInitialMessage);
    setMainMode("photo");
    setIsLoading(false);
  };

  const takePhoto = () => {
    if (!camera.current) {
      return;
    }
    onLoggerOpen();
    try {
      const image = camera.current.takePhoto();
      setImage(image);
      setMainMode("map");
      logger.log("phote is taken. you can create 3d model or retake.");
      onOpen();
    } catch (e: any) {
      console.error(e);
    }
  };

  const retake = () => {
    clear();
    // setMainMode("map");
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
    if (!chain || !signer || !network || !currentLocation.lat || !currentLocation.lng) {
      return;
    }
    if (Number(chain.network) !== networks[network].chainId) {
      alert(`please connect ${networks[network].name.toLowerCase()} network`);
      return;
    }
    setIsLoading(true);
    logger.log("creating NFT now. it takes some time...");
    //TODO: update
    const imageFile = file(image, "nft.png", "image/png");
    console.log(imageFile);
    const modelFile = await file(model, "nft.gltf", "model/gltf+json");
    console.log(modelFile);
    const {
      uri: tokenURI,
      imageURI,
      modelURI,
    } = await metadata("rakugaki", "rakugaki", imageFile, modelFile, currentLocation.lat, currentLocation.lng);

    console.log(tokenURI);

    const { chainId, rpc, contracts } = networks[network];
    const { rakugaki } = contracts;

    // console.log(tokenURI, chainId, rpc, rakugaki);
    // const { data } = await axios.post(
    //   `${process.env.NEXT_PUBLIC_FUNCTIONS_BASE_URI}/sign`,
    //   {
    //     tokenURI,
    //     chainId,
    //     rpc,
    //     rakugaki,
    //   },
    //   axiosConfig
    // );
    // console.log(data);

    const contract = new ethers.Contract(networks[network].contracts.rakugaki, RakugakiArtifact.abi, signer);
    const address = await signer.getAddress();

    const to = address;

    const lat = currentLocation.lat;
    const latDecimalLength = countDecimals(lat);
    const latNum = lat * 10 ** latDecimalLength;
    const latFormatted = Math.floor(latNum).toString();

    const lng = currentLocation.lng;
    const lngDecimalLength = countDecimals(lng);
    const lngNum = lng * 10 ** lngDecimalLength;
    const lngFormatted = Math.floor(lngNum).toString();

    console.log(lng, lngDecimalLength, lngNum, lngFormatted);
    const location = {
      lat: latFormatted.toString(),
      latDecimalLength,
      lng: lngFormatted.toString(),
      lngDecimalLength,
    };

    console.log(to, location, modelURI, tokenURI);
    const tx = await contract.mint(to, location, imageURI, modelURI, tokenURI);
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
    axios.get(`${process.env.NEXT_PUBLIC_FUNCTIONS_BASE_URI}/get?tokenId=${tokenId}`).then(({ data }) => {
      if (tokens.length === 0) {
        setTokens(data);
      }
      setTokens(tokens.concat(data));
    });
    setMainMode("map");
  };

  React.useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_FUNCTIONS_BASE_URI}/get`).then(({ data }) => {
      // console.log(data);
      setTokens(data);
    });
    // .catch((e) => {
    //   console.error(e.message);
    // });
  }, []);

  const onClickTokenOn2d = (tokenId: string) => {
    setModalMode("modelPreview");
    const token = tokens.find((token: any) => {
      return ethers.BigNumber.from(token.tokenId).toString() === tokenId;
    }) as any;

    const url = token.imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");

    setNFTMinted(true);
    setTokenId(tokenId);
    setImage(url);
    onOpen();
  };

  return (
    <Box minHeight={"100vh"} w={"full"} position="relative">
      {mainMode === "map" && (
        <>
          {mapMode === "2d" && (
            <Map
              onClickToken={onClickTokenOn2d}
              tokens={tokens}
              cLat={currentLocation.lat}
              cLng={currentLocation.lng}
              lat={threeLocation.lat}
              lng={threeLocation.lng}
            />
          )}
          {mapMode === "3d" && (
            <ThreeMap onClickToken={onClickTokenOn2d} tokens={tokens} lat={threeLocation.lat} lng={threeLocation.lng} />
          )}
        </>
      )}
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
        header={
          modalMode === "photoPreview"
            ? "Photo Preview"
            : modalMode === "modelPreview"
            ? nftMinted
              ? "NFT Preview"
              : "Model Preview"
            : "　"
        }
      >
        <Stack spacing="4">
          {modalMode === "photoPreview" && (
            <Image
              height="400px"
              src={image}
              fallbackSrc="/img/placeholders/400x400.png"
              alt="preview"
              objectFit={"cover"}
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
                Back
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
                Make 3d model
              </Button>
            )}
            {modalMode === "modelPreview" && (
              <>
                {!nftMinted && (
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
                      Mint NFT
                    </Button>
                  </ConnectWalletWrapper>
                )}
                {nftMinted && (
                  <Button
                    as={Link}
                    w="full"
                    rounded={config.styles.button.rounded}
                    size={config.styles.button.size}
                    fontSize={config.styles.button.fontSize}
                    color={config.styles.text.color.primary}
                    href={`https://testnets.opensea.io/assets/${network}/${networks[network].contracts.rakugaki}/${tokenId}`}
                    target="_blank"
                    style={{ textDecoration: "none" }}
                  >
                    View in Opensea
                  </Button>
                )}
              </>
            )}
            {modalMode === "completed" && (
              <Button
                as={Link}
                w="full"
                rounded={config.styles.button.rounded}
                size={config.styles.button.size}
                fontSize={config.styles.button.fontSize}
                color={config.styles.text.color.primary}
                href={`https://testnets.opensea.io/assets/${network}/${networks[network].contracts.rakugaki}/${tokenId}`}
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
