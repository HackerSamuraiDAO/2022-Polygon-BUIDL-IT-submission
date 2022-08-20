import { Box, Button } from "@chakra-ui/react";
import React from "react";
import { useAccount, useDisconnect } from "wagmi";

import config from "../../../config.json";
import { truncate } from "../../lib/utils/truncate";

export const Wallet: React.FC = () => {
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  return (
    <Box>
      <Button
        width="full"
        rounded={config.styles.button.rounded}
        size={config.styles.button.size}
        fontSize={config.styles.button.fontSize}
        color={config.styles.text.color.primary}
        onClick={() => disconnect()}
      >
        {truncate(address, 6, 6)}
      </Button>
    </Box>
  );
};
