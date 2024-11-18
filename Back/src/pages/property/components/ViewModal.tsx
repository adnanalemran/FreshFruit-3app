// components/reused/table/ViewModal.tsx
import React from 'react';
import { Button } from '@/components/custom/button';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ImageUrl } from '@/utils/ImageUrl';

interface ViewModalProps {
  open: boolean;
  onClose: () => void;
  itemDetails: any;
}

const ViewModal: React.FC<ViewModalProps> = ({ open, onClose, itemDetails }) => {
  const imageUrl = `${ImageUrl}${itemDetails.image}`;
  console.log('imageUrl', imageUrl);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6 space-y-6">
        <DialogTitle className="text-xl font-semibold ">Item Details</DialogTitle>
        <div className="space-y-4   flex flex-col ">
          <div className='   '>
            <div>
              <h3 className="text-sm font-medium ">Title : {itemDetails.title ? itemDetails.title : "No Title"}</h3>
            </div>
            <div>
              <h3 className="text-sm font-medium ">Description :{itemDetails.description ? itemDetails.description : "No description"}</h3>
            </div>
            <div>
              <h3 className="text-sm font-medium">Status :   {itemDetails.status ? itemDetails.status : "No status"}</h3>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Slider Image</h3>
            {itemDetails.image ? (
              <img src={imageUrl} alt="item image" className="w-full max-w-xs h-auto rounded-md shadow-lg" />
            ) : (
              <p className="text-sm text-gray-400">No image available</p>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewModal;
