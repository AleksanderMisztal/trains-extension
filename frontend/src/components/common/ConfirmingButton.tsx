import React, { useState } from 'react';
import { Modal } from './Modal';

export const ConfirmingButton = ({ children, action, warning }) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <Modal isOpen={modalOpen}>
        {warning}
        <button
          onClick={(e) => {
            e.preventDefault();
            setModalOpen(false);
          }}
        >
          Cancel
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setModalOpen(false);
            action(e);
          }}
        >
          Confirm
        </button>
      </Modal>
      <button
        onClick={(e) => {
          e.preventDefault();
          setModalOpen(true);
        }}
      >
        {children}
      </button>
    </>
  );
};
