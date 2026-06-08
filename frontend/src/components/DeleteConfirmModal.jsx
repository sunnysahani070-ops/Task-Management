import React, { useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, taskName }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Task?">
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-full bg-red-50 mx-auto flex items-center justify-center mb-5 border border-red-100 shadow-sm">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-sm text-gray-500 mb-8">
          Are you sure you want to delete <span className="font-semibold text-gray-800">"{taskName}"</span>? This action cannot be undone.
        </p>
        <div className="flex justify-center space-x-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={isDeleting}
            fullWidth
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
