import React from "react";

import Modal from "react-modal";
Modal.setAppElement("#__next");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    borderRadius: "12px",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
type Props = {
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
  children: React.ReactNode;
};

const CustomModal = ({ modalOpen, setModalOpen, children }: Props) => {
  return (
    <Modal
      isOpen={modalOpen}
      onRequestClose={() => setModalOpen(false)}
      style={customStyles}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
