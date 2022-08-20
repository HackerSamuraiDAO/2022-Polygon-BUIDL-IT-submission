import { useRecoilState } from "recoil";

import { consoleState, consoleVisible } from "./consoleState";

export const useConsole = () => {
  const [, setConsoleState] = useRecoilState(consoleState);
  const [isVisible, setConsoleVisible] = useRecoilState(consoleVisible);

  const _console = {
    log: (...logs: any[]) => {
      setConsoleState({ mode: "log", logs });
      console.log(...logs);
    },
    error: (...logs: any[]) => {
      setConsoleState({ mode: "error", logs });
      console.error(...logs);
    },
  };

  const onOpen = () => {
    setConsoleVisible(true);
  };

  const onClose = () => {
    setConsoleVisible(false);
  };

  const onToggle = () => {
    setConsoleVisible(!isVisible);
  };
  return { console: _console, onOpen, onClose, onToggle };
};
