import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

const Main = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 50px;
  z-index: 1000;
  max-height: 60%;
  overflow: scroll;
  overflow-x: hidden;
`;
const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
`;

export const Modal = ({ children, isOpen }) => {
  if (!isOpen) return <></>;
  return createPortal(
    <>
      <Background />
      <Main>{children}</Main>
    </>,
    document.getElementById('modal')
  );
};
