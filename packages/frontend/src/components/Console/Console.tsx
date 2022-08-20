import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useRecoilValue } from "recoil";

import config from "../../../config.json";
import { consoleState } from "./consoleState";

export interface ConsoleProps {
  position?: "absolute";
  top?: "14";
  right?: "0";
  m?: "1";
  w?: "xs";
}

export const Console: React.FC<ConsoleProps> = ({ position, top, right, m, w }) => {
  const { mode, logs } = useRecoilValue(consoleState);

  return (
    <Box
      shadow="base"
      borderRadius="md"
      p="4"
      backgroundColor={"gray.800"}
      opacity="75%"
      zIndex="1401"
      position={position}
      top={top}
      right={right}
      w={w}
      m={m}
    >
      <Text color="blue.400" fontSize="xs">
        {`${config.app.name} > `}
        {logs.map((log, i) => {
          return (
            <Text key={`console-${i}`} color={mode === "log" ? "white" : "red.400"} fontSize="xs" as="span" m="0.5">
              {log}
            </Text>
          );
        })}
      </Text>
    </Box>
  );
};
