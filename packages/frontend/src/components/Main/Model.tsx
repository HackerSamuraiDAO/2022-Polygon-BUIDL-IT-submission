import { Box, IconButton } from "@chakra-ui/react";
// import { saveAs } from "file-saver";
import React from "react";
// import { AiOutlineDownload } from "react-icons/ai";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";

import { sleep } from "../../lib/utils/sleep";

export interface ModelProps {
  image: string;
  size?: number;
  setModel?: (model: string) => void;
}

export const Model: React.FC<ModelProps> = ({ image, size = 300, setModel }) => {
  const scene = React.useMemo(() => {
    return new THREE.Scene();
  }, []);

  //TODO: better management
  React.useEffect(() => {
    if (!setModel) {
      return;
    }
    sleep(100).then(() => {
      const exporter = new GLTFExporter();
      exporter.parse(
        scene,
        (gltfJson) => {
          const jsonString = JSON.stringify(gltfJson);
          setModel(jsonString);
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }, [setModel, scene]);

  React.useEffect(() => {
    const canvas = document.getElementById("canvas");
    if (!canvas) {
      return;
    }

    const sizes = {
      width: size,
      height: size,
    };
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas || undefined,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    const boxGeometry = new THREE.BoxGeometry(3, 3, 0.1);
    const boxTexture = new THREE.TextureLoader().load(image);
    const boxMaterial = new THREE.MeshBasicMaterial({
      map: boxTexture,
    });

    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.z = -5;
    box.rotation.set(10, 10, 10);
    scene.add(box);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.2);
    pointLight.position.set(1, 2, 3);
    scene.add(pointLight);

    // TODO: have exported
    const clock = new THREE.Clock();
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      box.rotation.x = elapsedTime;
      box.rotation.y = elapsedTime;
      window.requestAnimationFrame(tick);
      renderer.render(scene, camera);
    };
    tick();
  }, [setModel, image, scene]);

  return (
    <Box>
      <canvas id="canvas" />
    </Box>
  );
};
