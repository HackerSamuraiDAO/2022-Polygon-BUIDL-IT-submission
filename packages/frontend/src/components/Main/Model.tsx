import { Box, IconButton } from "@chakra-ui/react";
import { saveAs } from "file-saver";
import React from "react";
import { AiOutlineDownload } from "react-icons/ai";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";

export interface ModelProps {
  image: string;
}

export const Model: React.FC<ModelProps> = ({ image }) => {
  const scene = React.useMemo(() => {
    return new THREE.Scene();
  }, []);

  const download = () => {
    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      function (gltfJson) {
        console.log(gltfJson);
        const jsonString = JSON.stringify(gltfJson);
        console.log(jsonString);
        const blob = new Blob([jsonString], { type: "application/json" });
        saveAs(blob, "exported.gltf");
        console.log("Download requested");
      },
      () => {}
    );
  };

  React.useEffect(() => {
    const canvas = document.getElementById("canvas");
    if (!canvas) {
      return;
    }

    const sizes = {
      width: 400,
      height: 400,
    };
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas || undefined,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    const boxGeometry = new THREE.BoxGeometry(4, 4, 0.1);
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
  }, [image, scene]);

  return (
    <Box position="relative">
      <IconButton
        onClick={download}
        position="absolute"
        aria-label="download"
        right="0"
        icon={<AiOutlineDownload />}
        size="sm"
      />
      <canvas id="canvas" />
    </Box>
  );
};
