import { useRecoilState } from "recoil";

import { consoleState, consoleVisible } from "./loggerState";

export const useLogger = () => {
  const [, setLoggerState] = useRecoilState(consoleState);
  const [isVisible, setLoggerVisible] = useRecoilState(consoleVisible);

  const logger = {
    log: (...logs: any[]) => {
      setLoggerState({ mode: "log", logs });
      console.log(...logs);
    },
    error: (...logs: any[]) => {
      setLoggerState({ mode: "error", logs });
      console.error(...logs);
    },
  };

  const onOpen = () => {
    setLoggerVisible(true);
  };

  const onClose = () => {
    setLoggerVisible(false);
  };

  const onToggle = () => {
    setLoggerVisible(!isVisible);
  };
  return { logger, onOpen, onClose, onToggle };
};
