import { Box } from "@chakra-ui/react";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { ethers } from "ethers";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { isIntervalOn, locationState, mapState } from "../../store/viewer";

export interface MapProps {
  onClickToken: (tokenId: string) => void;
  cLat?: number;
  cLng?: number;
  lat?: number;
  lng?: number;
  tokens: {
    tokenId: string;
    holder: string;
    location: {
      lat: number;
      lng: number;
    };
    modelURI: string;
    tokenURI: string;
  }[];
}

export const InternalMap: React.FC<MapProps> = ({ onClickToken, cLat, cLng, lat, lng, tokens }) => {
  const [_isIntervalOn, setIsIntervalOn] = useRecoilState(isIntervalOn);
  const [, setLocation] = useRecoilState(locationState);
  const ref = React.useRef<HTMLDivElement>(null);

  const [map, setMap] = React.useState<google.maps.Map>();

  React.useEffect(() => {
    const call = setInterval(() => {
      if (!map) {
        return;
      }
      const center = map?.getCenter();
      if (!center) {
        return;
      }
      const lat = center.lat();
      const lng = center.lng();
      setLocation({ lat, lng });
      setIsIntervalOn(true);
    }, 500);
    return () => clearInterval(call);
  }, [map, _isIntervalOn, setIsIntervalOn, setLocation]);

  React.useEffect(() => {
    const defaultProps = {
      center: {
        lat: 35.65925011569792,
        lng: 139.70066309372865,
      },
      zoom: 15,
      disableDefaultUI: true,
    };
    if (ref.current) {
      const map = new window.google.maps.Map(ref.current, defaultProps);
      setMap(map);
    }
  }, [ref]);

  React.useEffect(() => {
    console.log(map, cLat, cLng);
    if (!map || !cLat || !cLng) {
      return;
    }

    /*
     * @dev no current position
     */
    // new google.maps.Marker({
    //   position: { lat: cLat, lng: cLng },
    //   map,
    // });
    map.setCenter({ lat: cLat, lng: cLng });
  }, [map, cLat, cLng]);

  React.useEffect(() => {
    if (!map || tokens.length === 0) {
      return;
    }
    for (const token of tokens) {
      const marker = new google.maps.Marker({
        position: { lat: token.location.lat, lng: token.location.lng },
        icon: "/img/brands/pin.png",
        map,
      });
      marker.addListener("click", () => {
        const tokenId = ethers.BigNumber.from(token.tokenId).toString();
        onClickToken(tokenId);
      });
    }
  }, [map, tokens]);

  return <Box ref={ref} w="100wh" h="100vh"></Box>;
};

export const Map: React.FC<MapProps> = ({ onClickToken, cLat, cLng, lat, lng, tokens }) => {
  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <>loading</>;
      case Status.FAILURE:
        return <>failure</>;
      case Status.SUCCESS:
        return <InternalMap onClickToken={onClickToken} cLat={cLat} cLng={cLng} tokens={tokens} lat={lat} lng={lng} />;
    }
  };

  return <Wrapper apiKey={"AIzaSyAjoE50sTKo2lQv1UeWWHGJueWP70sXBhU"} render={render} />;
};
