import styled from "@emotion/styled";
import { useState } from "react";

const DesignDebugGrid = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to right, rgb(255 0 0 / 20%) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(255 0 0 / 20%) 1px, transparent 1px);
  background-size: 16px 16px;
  background-position: -1px -1px;
  z-index: 999;
`;

const ButtonToggle = styled.button`
  position: fixed;
  bottom: 0;
  right: 0;
  font-size: 0.8rem;
  opacity: 0.5;
  z-index: 9999;
`;

export const DesignDebug = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      {visible && <DesignDebugGrid />}
      <ButtonToggle onClick={() => setVisible(!visible)}>
        {visible ? "HIDE" : "SHOW"}
      </ButtonToggle>
    </>
  );
};
