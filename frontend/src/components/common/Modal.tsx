import React from 'react';
import { createPortal } from 'react-dom';

const s_modal: React.CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#FFF',
  padding: '50px',
  zIndex: 1000,
  maxHeight: '60%',
  overflow: 'scroll',
  overflowX: 'hidden',
};
const s_overlay: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  zIndex: 1000,
};

export const Modal = ({ children, isOpen }) => {
  if (!isOpen) return <></>;
  return createPortal(
    <>
      <div style={s_overlay}></div>
      <div style={s_modal}>{children}</div>
    </>,
    document.getElementById('root')
  );
};
