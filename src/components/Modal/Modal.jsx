import { useEffect } from 'react';
import { Backdrop, Button, ModalContent } from './Modal.styled';
import { IoMdCloseCircleOutline } from 'react-icons/io';

export const Modal = ({ children, onModalClose }) => {
  useEffect(() => {
    const onEscClick = event => {
      if (event.code !== 'Escape') {
        return;
      }
      onModalClose();
    };

    window.addEventListener('keydown', onEscClick);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onEscClick);
      document.body.style.overflow = 'auto';
    };
  }, [onModalClose]);

  const onBackdropClick = event => {
    if (event.target !== event.currentTarget) {
      return;
    }
    onModalClose();
  };

  return (
    <Backdrop onClick={onBackdropClick}>
      <ModalContent>{children}</ModalContent>
      <Button type="button" onClick={onModalClose}>
        <IoMdCloseCircleOutline size={30} />
      </Button>
    </Backdrop>
  );
};
