import React from 'react';
import { ModalInstance } from '../../types';
import { ModalItem } from './ModalItem';
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog';
import { AlertDialog } from '../Alert/AlertDialog';

export interface ModalContainerProps {
  modals: ModalInstance[];
}

export const ModalContainer: React.FC<ModalContainerProps> = ({ modals }) => {
  if (modals.length === 0) return null;

  return (
    <>
      {modals.map((m) => {
        let modalContent: React.ReactNode;

        if (m.type === 'custom') {
          modalContent = m.content;
        } else if (m.onConfirm || m.type === 'question' || m.type === 'danger') {
          // If the modal has a confirm handler, or is explicitly question/danger,
          // it requires user confirmation choices (Confirm / Cancel).
          modalContent = <ConfirmDialog modal={m} />;
        } else {
          // Otherwise, it is an informational alert dialog with an OK/Close button.
          modalContent = <AlertDialog modal={m} />;
        }

        return (
          <ModalItem key={m.id} modal={m}>
            {modalContent}
          </ModalItem>
        );
      })}
    </>
  );
};
