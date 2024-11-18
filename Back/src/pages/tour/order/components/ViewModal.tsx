
import { Button } from '@/components/custom/button';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ImageUrl } from '@/utils/ImageUrl';

interface ItemDetails {
  title: string;
  description: string;
  image: string;
  // Add more properties if needed
}

interface ViewModalProps<TData extends ItemDetails> {
  open: boolean;
  onClose: () => void;
  itemDetails: TData;
}

const ViewModal = <TData extends ItemDetails>({ open, onClose, itemDetails }: ViewModalProps<TData>) => {
  const imageUrl = `${ImageUrl}${itemDetails.image}`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg lg:max-w-full p-6 space-y-6">
        <DialogTitle className="text-xl font-semibold">Item Details</DialogTitle>
        <div className="space-y-4 flex flex-col">
          <div>
            <h3 className="text-sm font-medium">
              Title: {itemDetails.title || "No Title"}
            </h3>
          </div>
          <div>
            <h3 className="text-sm font-medium">
              Description: {itemDetails.description || "No description"}
            </h3>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Image</h3>
            {itemDetails.image ? (
              <img
                src={imageUrl}
                alt={itemDetails.title || "Item image"}
                className="w-full max-w-xs h-auto rounded-md shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'fallback-image-url'; // Optional fallback image
                }}
              />
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
