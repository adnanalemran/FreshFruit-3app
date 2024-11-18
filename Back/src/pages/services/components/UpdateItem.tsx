import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { MdOutlineFileUpload } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/custom/button";
import { Label } from "@radix-ui/react-label";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { ImageUrl } from "@/utils/ImageUrl";

interface UpdateItemProps {
    id: string;
    isOpen: boolean;
    onClose: () => void;
}

export function UpdateItem({ id, isOpen, onClose }: UpdateItemProps) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        Title: "",
        Description: "",
        url: "",
        Status: "",
        Image: null as File | string | null,
    });
    const [fileError, setFileError] = useState<string | null>(null);

    const { data: LoadData, isLoading: isFetching, error: fetchError } = useQuery({
        queryKey: ["service", id],
        queryFn: async () => {
            const res = await http.get(`/portfolio/service/${id}`);
            return res.data;
        },
        enabled: isOpen,
    });

    useEffect(() => {
        if (LoadData) {
            setFormData({
                Title: LoadData.data?.Title || "",
                url: LoadData.data?.url || "",
                Status: LoadData.data?.Status || "",
                Description: LoadData.data?.Description || "",
                Image: LoadData.data?.Image || null,
            });
            setPreviewImage(LoadData.data?.Image ? ImageUrl + LoadData.data.Image : null);
        }
    }, [LoadData, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value, files } = e.target as HTMLInputElement;
        setFormData((prevData) => ({
            ...prevData,
            [id]: files ? files[0] : value,
        }));
        if (id === "Image" && files && files.length > 0) {
            setFileError(null);
            setPreviewImage(URL.createObjectURL(files[0]));
        }
    };

    const resetForm = () => {
        setFormData({
            Title: "",
            url: "",
            Description: "",
            Status: "",
            Image: null,
        });
        setPreviewImage(null);
        setFileError(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, Image: file });
            setPreviewImage(URL.createObjectURL(file));
            setFileError(null);
        }
    };

    const { mutate, status } = useMutation({
        mutationFn: async (updatedItem: FormData) => {
            return http.post(`/portfolio/service/${id}`, updatedItem, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Item updated successfully!",
                duration: 3000,
            });

            queryClient.invalidateQueries({ queryKey: ["service"] });

            onClose();
            resetForm();
        },
        onError: () => {
            toast({
                title: "Error",
                description: "There was an error updating the item.",
                variant: "destructive",
                duration: 3000,
            });
        },
    });

    const isLoading = status === "pending";

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.Image) {
            setFileError("Please select a file.");
            return;
        } else {
            setFileError(null);
        }

        const data = new FormData();
        data.append("Title", formData.Title);
        data.append("Description", formData.Description);
        data.append("url", formData.url);
        data.append("Status", formData.Status);

        // Append image if new image is selected
        if (typeof formData.Image === "object") {
            data.append("Image", formData.Image);
        }

        mutate(data);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTrigger asChild></DialogTrigger>
            <DialogContent className="sm:max-w-6xl">
                <DialogHeader>
                    <DialogTitle>Edit Data</DialogTitle>
                    <DialogDescription>
                        {isFetching ? "Loading data..." : "Make changes to the slider item here."}
                    </DialogDescription>
                </DialogHeader>
                {fetchError && <p className="text-red-500">Failed to load data.</p>}
                <form onSubmit={handleSubmit}>
                    <div className="gap-4 flex flex-col lg:flex-row justify-center items-center">
                        <div className="gap-4 w-full lg:w-4/6">
                            <div className="grid w-full items-center gap-1.5 lg:col-span-1 col-span-2">
                                <Label htmlFor="Title">Title:</Label>
                                <Input
                                    type="text"
                                    placeholder="Best Thai Deal"
                                    id="Title"
                                    value={formData.Title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="grid w-full items-center gap-1.5 col-span-2 row-span-3">
                                <Label htmlFor="Description">Description:</Label>
                                <Input
                                    id="Description"
                                    placeholder="ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                                    value={formData.Description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="grid w-full items-center gap-1.5 col-span-2 row-span-3">
                                <Label htmlFor="url">URL:</Label>
                                <Input
                                    id="url"
                                    placeholder="ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                                    value={formData.url}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4.5 w-full lg:w-2/6">
                            <div className="my-4.5 w-full text-center">
                                {previewImage ? (
                                    <div className="relative inline-block">
                                        <img
                                            className="h-36 rounded-xl"
                                            src={previewImage}
                                            alt="Preview"
                                        />
                                    </div>
                                ) : (
                                    <div className="relative inline-block">
                                        <div className="flex items-center justify-center w-36 h-36 rounded-full bg-gray-200">
                                            No image
                                        </div>
                                    </div>
                                )}
                            </div>
                            <label htmlFor="updateImage" className="w-full flex flex-col justify-center items-center mt-4">
                                <p className="text-sm py-2 lg:px-4">
                                    Note: Image must be jpg, jpeg, png, gif, bmp format and maximum size: 10 MB
                                </p>
                                <div>
                                    <div className="inline-flex cursor-pointer items-center justify-center rounded-md gap-2 px-3 py-2 text-sm bg-slate-300 dark:text-black">
                                        <MdOutlineFileUpload /> Update Image
                                    </div>
                                    <input
                                        id="updateImage"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </div>
                            </label>
                            {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
                        </div>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Submitting..." : "Submit"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateItem;
