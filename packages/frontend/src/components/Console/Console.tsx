import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useRecoilValue } from "recoil";

import config from "../../../config.json";
import { consoleState, consoleVisible } from "./consoleState";

export interface ConsoleProps {
  position?: "absolute";
}

export const Console: React.FC<ConsoleProps> = ({ position }) => {
  const { mode, logs } = useRecoilValue(consoleState);
  const isVisible = useRecoilValue(consoleVisible);

  return (
    <>
      {isVisible && (
        <Box
          shadow="base"
          borderRadius="md"
          p="4"
          backgroundColor={"gray.800"}
          opacity="90%"
          zIndex="1401"
          position={position}
          top={"0"}
          right={"0"}
          w={"xs"}
          m={"2"}
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
      )}
    </>
  );
};
