import { Box } from "@chakra-ui/react";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { ethers } from "ethers";
import React from "react";
import { AmbientLight, DirectionalLight, Matrix4, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export interface MapProps {
  onClickToken: (tokenId: string) => void;
  lat: number;
  lng: number;
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

export const InternalMap: React.FC<MapProps> = ({ onClickToken, lat, lng, tokens }) => {
  // const ref = React.useRef<HTMLDivElement>(null);

  const [map, setMap] = React.useState<google.maps.Map>();
  // const [scene, setScene] = React.useState<any>();
  const [renderer, setRenderer] = React.useState<any>();
  // const [camera, setCamera] = React.useState<any>();
  // const [loader, setLoader] = React.useState<any>();

  const mapOptions = {
    tilt: 0,
    heading: 0,
    zoom: 18,
    center: {
      lat,
      lng,
    },
    mapId: "f505bd029047b70",
    disableDefaultUI: true,
    gestureHandling: "none",
    keyboardShortcuts: false,
  };

  function initMap(): void {
    const mapDiv = document.getElementById("map") as HTMLElement;
    const map = new google.maps.Map(mapDiv, mapOptions);
    // const webglOverlayView = new google.maps.WebGLOverlayView();
    // webglOverlayView.setMap(map);
    setMap(map);
    initWebglOverlayView(map);
  }

  function initWebglOverlayView(map: google.maps.Map): void {
    const webglOverlayView = new google.maps.WebGLOverlayView();
    const scene = new Scene();
    const camera = new PerspectiveCamera();
    const loader = new GLTFLoader();
    webglOverlayView.onAdd = () => {
      // const scene = new Scene();
      // setScene(scene);

      //
      // setCamera(camera);

      const ambientLight = new AmbientLight(0xffffff, 0.75); // Soft white light.
      scene.add(ambientLight);

      const directionalLight = new DirectionalLight(0xffffff, 0.25);
      directionalLight.position.set(0.5, -1, 0.5);
      scene.add(directionalLight);

      // Load the model.
      // const loader = new GLTFLoader();
      // setLoader(loader);
      const source = "https://raw.githubusercontent.com/googlemaps/js-samples/main/assets/pin.gltf";
      loader.load(source, (gltf) => {
        gltf.scene.scale.set(10, 10, 10);
        gltf.scene.rotation.x = Math.PI; // Rotations are in radians.
        scene.add(gltf.scene);
      });
    };

    webglOverlayView.onContextRestored = ({ gl }) => {
      // Create the js renderer, using the
      // maps's WebGL rendering context.
      const renderer = new WebGLRenderer({
        canvas: gl.canvas,
        context: gl,
        ...gl.getContextAttributes(),
      });
      setRenderer(renderer);
      renderer.autoClear = false;

      // Wait to move the camera until the 3D model loads.

      loader.manager.onLoad = () => {
        renderer.setAnimationLoop(() => {
          webglOverlayView.requestRedraw();
          const { tilt, heading, zoom } = mapOptions;
          map.moveCamera({ tilt, heading, zoom });

          // Rotate the map 360 degrees.
          if (mapOptions.tilt < 67.5) {
            mapOptions.tilt += 0.5;
          } else if (mapOptions.heading <= 360) {
            mapOptions.heading += 0.2;
            mapOptions.zoom -= 0.0005;
          } else {
            renderer.setAnimationLoop(null);
          }
        });
      };
    };

    webglOverlayView.onDraw = ({ gl, transformer }): void => {
      const latLngAltitudeLiteral: google.maps.LatLngAltitudeLiteral = {
        lat: mapOptions.center.lat,
        lng: mapOptions.center.lng,
        altitude: 100,
      };

      // Update camera matrix to ensure the model is georeferenced correctly on the map.
      const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
      camera.projectionMatrix = new Matrix4().fromArray(matrix);

      webglOverlayView.requestRedraw();
      if (renderer) {
        renderer.render(scene, camera);

        // Sometimes it is necessary to reset the GL state.
        renderer.resetState();
      }
    };
    webglOverlayView.setMap(map);
  }

  React.useEffect(() => {
    initMap();
  }, []);

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

  return <Box id={"map"} w="100wh" h="100vh" />;
};

export const ThreeMap: React.FC<MapProps> = ({ onClickToken, lat, lng, tokens }) => {
  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <>loading</>;
      case Status.FAILURE:
        return <>failure</>;
      case Status.SUCCESS:
        return <InternalMap onClickToken={onClickToken} tokens={tokens} lat={lat} lng={lng} />;
    }
  };

  return <Wrapper apiKey={"AIzaSyAjoE50sTKo2lQv1UeWWHGJueWP70sXBhU"} render={render} />;
};
