import React from 'react';
import { Button } from '@/components/custom/button';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  itemName: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ open, onClose, onDelete, itemName }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <p>Are you sure you want to delete {itemName}? This action cannot be undone.</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
