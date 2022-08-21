import { Box } from "@chakra-ui/react";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import React from "react";

export interface MapProps {
  lat?: number;
  lng?: number;
}

export const InternalMap: React.FC<MapProps> = ({ lat, lng }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [map, setMap] = React.useState<google.maps.Map>();

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
    new google.maps.Marker({
      position: { lat, lng },
      map,
    });
    map.setCenter({ lat, lng });
  }, [map, lat, lng]);

  return (
    <Box ref={ref} w="100wh" h="100vh">
      aaa
    </Box>
  );
};

export const Map: React.FC<MapProps> = ({ lat, lng }) => {
  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <>loading</>;
      case Status.FAILURE:
        return <>failure</>;
      case Status.SUCCESS:
        return <InternalMap lat={lat} lng={lng} />;
    }
  };

  return <Wrapper apiKey={"AIzaSyAjoE50sTKo2lQv1UeWWHGJueWP70sXBhU"} render={render} />;
};
