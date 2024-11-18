import DeleteModal from '@/components/reused/table/DeleteModal';
import { useToast } from '@/components/ui/use-toast';
import http from "@/utils/http";
import { ImageUrl } from "@/utils/ImageUrl";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from "react";
import { MdAddCircleOutline } from "react-icons/md";
import { TiDelete } from "react-icons/ti";

interface ImageHandelProps {
    destination_id: string;
}

const ImageHandel = ({ destination_id }: ImageHandelProps) => {
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    console.log(selectedFile);

    const { data: LoadData, isLoading, isError } = useQuery({
        queryKey: ["imageItem", destination_id],
        queryFn: async () => {
            const res = await http.get(`/tour/images/${destination_id}`);
            return res.data.data;
        },
    });

    const queryClient = useQueryClient();
    const { toast } = useToast();

    // Mutation for deleting an image
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await http.delete(`/tour/images/${id}`);
        },
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Deleted successfully.',
            });
            queryClient.invalidateQueries({ queryKey: ['imageItem', destination_id] });
            setDeleteModalOpen(false);
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'Failed to delete image.',
                variant: 'destructive',
            });
        },
    });

    // Mutation for uploading an image
    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            toast({
                title: 'Image Uploading...',
                description: 'Image uploading, please wait a moment.',
            });

            const formData = new FormData();
            formData.append('destination_id', destination_id); // Append destination ID
            formData.append('image', file); // Append selected image
            await http.post('/tour/images', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        },
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Image uploaded successfully.',
            });
            queryClient.invalidateQueries({ queryKey: ['imageItem', destination_id] });
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'Failed to upload image.',
                variant: 'destructive',
            });
        },
    });

    // Handle image deletion
    const handleDelete = () => {
        if (selectedImageId) {
            deleteMutation.mutate(selectedImageId);
        }
    };

    // Handle file selection for upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            uploadMutation.mutate(file); // Trigger upload immediately
        }
    };

    const openDeleteModal = (id: string) => {
        setSelectedImageId(id);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setSelectedImageId(null);
        setDeleteModalOpen(false);
    };
 
    return (
        <div>
            <h3 className="pt-8">Details Image: </h3>
            <p className="text-xs text-gray-500 mt-2">Hint: Optimal image size is 600 x 809 pixels. and max-size:10MB</p>
            <div className="mt-4 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-0">
             
                {isLoading ? (
                    <p>Loading...</p>
                ) : isError ? (
                    <p>Error loading images</p>
                ) : Array.isArray(LoadData) && LoadData.length > 0 ? (
                    LoadData.map((file) => (
                        <div key={file.id} className="relative">
                            <div className="my-3 mx-3">
                                <img
                                    src={`${ImageUrl}external_image/${file.file_name}`}
                                    alt="Best Thai deal image"
                                    className="w-full rounded-lg"
                                />
                            </div>
                            <div
                                onClick={() => openDeleteModal(file.id)}
                                className="absolute top-0 right-0 cursor-pointer"
                            >
                                <TiDelete className="text-3xl text-red-500 hover:text-red-700" />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No Images</p>
                )}
                <label htmlFor="file-upload" className="cursor-pointer flex w-full min-h-32 rounded-lg border justify-center items-center text-gray-700 hover:text-gray-900 m-4">
                    <MdAddCircleOutline className="text-6xl" />
                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </label>
            </div>

            {/* Delete Modal */}
            <DeleteModal
                open={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onDelete={handleDelete}
                itemName="Image"   
            />
        </div>
    );
};

export default ImageHandel;
