import { Box } from "@chakra-ui/react";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { isIntervalOn, locationState, mapState } from "../../store/viewer";

export interface MapProps {
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

export const InternalMap: React.FC<MapProps> = ({ lat, lng, tokens }) => {
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
    if (!map || !lat || !lng) {
      return;
    }

    map.setCenter({ lat, lng });
  }, [map, lat, lng]);

  React.useEffect(() => {
    if (!map || tokens.length === 0) {
      return;
    }
    for (const token of tokens) {
      new google.maps.Marker({
        position: { lat: token.location.lat, lng: token.location.lng },
        map,
      });
    }
  }, [map, tokens]);

  return <Box ref={ref} w="100wh" h="100vh"></Box>;
};

export const Map: React.FC<MapProps> = ({ lat, lng, tokens }) => {
  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <>loading</>;
      case Status.FAILURE:
        return <>failure</>;
      case Status.SUCCESS:
        return <InternalMap tokens={tokens} lat={lat} lng={lng} />;
    }
  };

  return <Wrapper apiKey={"AIzaSyAjoE50sTKo2lQv1UeWWHGJueWP70sXBhU"} render={render} />;
};
