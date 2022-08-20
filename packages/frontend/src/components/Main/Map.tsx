import { Box } from "@chakra-ui/react";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import React from "react";

export const InternalMap: React.FC<{}> = () => {
  const ref = React.useRef<HTMLDivElement>(null);
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
      new window.google.maps.Map(ref.current, defaultProps);
    }
  }, [ref]);
  return (
    <Box ref={ref} w="100wh" h="100vh">
      aaa
    </Box>
  );
};

export const Map: React.FC<{}> = () => {
  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <>loading</>;
      case Status.FAILURE:
        return <>failure</>;
      case Status.SUCCESS:
        return <InternalMap />;
    }
  };

  return <Wrapper apiKey={"AIzaSyAjoE50sTKo2lQv1UeWWHGJueWP70sXBhU"} render={render} />;
};
