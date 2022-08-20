import { Icon } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

import config from "../../../config.json";

export const icons = {
  github: <Icon as={FaGithub} size="1.25rem" color={config.styles.text.color.secondary} />,
};
