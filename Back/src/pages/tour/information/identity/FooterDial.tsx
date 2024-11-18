import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/custom/button";
import { Label } from "@radix-ui/react-label";

import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useState, useEffect } from "react";
import http from "@/utils/http";
import { ImageUrl } from "@/utils/ImageUrl";

interface FooterData {
    title: string;
    description: string;
    address: string;
    social: string;
    image: string | null;
}

export function FooterDial() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [isOpen, setIsOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        address: "",
        social: "",
        image: null as File | null,
    });

    const { data: headerData, isLoading: isFetching, error: fetchError } = useQuery<FooterData>({
        queryKey: ["footer", 2],
        queryFn: async () => {
            const res = await http.get("/tour/footer/2");
            return res.data;
        },
        enabled: isOpen,
    });

    useEffect(() => {
        if (headerData) {
            setFormData({
                title: headerData.title || "",
                description: headerData.description || "",
                address: headerData.address || "",
                social: headerData.social || "",
                image: headerData.image ? null : null,
            });
            setPreviewImage(headerData.image ? ImageUrl + headerData.image : null);
        }
    }, [headerData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value, files } = e.target as HTMLInputElement;
        setFormData(prevData => ({
            ...prevData,
            [id]: files ? files[0] : value,
        }));
        if (id === "image" && files && files.length > 0) {
            setPreviewImage(URL.createObjectURL(files[0]));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prevData => ({ ...prevData, image: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            address: "",
            social: "",
            image: null,
        });
        setPreviewImage(null);
    };

    const { mutate, status } = useMutation({
        mutationFn: async (newItem: FormData) => {
            return http.post("/tour/footer/2", newItem, {
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

            queryClient.invalidateQueries({ queryKey: ["footer"] });
            setIsOpen(false);
            resetForm();
            navigate("/identity-tour");
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

        if (!formData.image) {
            toast({
                title: "Error",
                description: "Please select an image.",
                variant: "destructive",
                duration: 3000,
            });
            return;
        }

        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("address", formData.address);
        data.append("social", formData.social);
        if (formData.image) {
            data.append("image", formData.image);
        }

        mutate(data);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setIsOpen(true)}>
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Footer</DialogTitle>
                    <DialogDescription>
                        {isFetching ? "Loading data..." : "Make changes to your footer here."}
                    </DialogDescription>
                </DialogHeader>
                {fetchError && <p className="text-red-500">Failed to load data.</p>}
                <form onSubmit={handleSubmit}>
                    <div className="gap-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="title">Title:</Label>
                            <Input
                                type="text"
                                placeholder="Best Thai Deal"
                                id="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="description">Description:</Label>
                            <Input
                                id="description"
                                placeholder="Description here"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="address">Address:</Label>
                            <Input
                                id="address"
                                placeholder="Address here"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="social">Social:</Label>
                            <Input
                                id="social"
                                placeholder="Social link here"
                                value={formData.social}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <div className="my-4 text-center">
                                {previewImage ? (
                                    <img
                                        className="w-20 h-20 rounded-full"
                                        src={previewImage}
                                        alt="Preview"
                                    />
                                ) : (
                                    <div className="w-36 h-36 flex items-center justify-center rounded-full bg-gray-200">
                                        No image
                                    </div>
                                )}
                            </div>
                            <label htmlFor="updateImage" className="flex justify-center">
                                <div className="inline-flex cursor-pointer gap-2 items-center justify-center rounded-md text-white px-3 py-2 bg-primary text-sm">
                                    Update Image
                                </div>
                                <input
                                    id="updateImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
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

export default FooterDial;
