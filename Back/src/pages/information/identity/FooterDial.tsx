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
import { useNavigate } from "react-router-dom";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useState, useEffect } from "react";
import http from "@/utils/http";
import { ImageUrl } from "@/utils/ImageUrl";

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
        image: null as File | string | null,
    });
    const [fileError, setFileError] = useState<string | null>(null);

    const { data: LoadData, isLoading: isFetching, error: fetchError } = useQuery({
        queryKey: ["footer", 1],
        queryFn: async () => {
            const res = await http.get("/tour/footer/1");
            return res.data;
        },
        enabled: isOpen,
    });

    useEffect(() => {
        if (LoadData) {
            setFormData({
                title: LoadData.data?.title || "",
                description: LoadData.data?.description || "",
                address: LoadData.data?.address || "",
                social: LoadData.data?.social || "",
                image: LoadData.data?.image || null,
            });
            setPreviewImage(LoadData.data?.image ? ImageUrl + LoadData.data.image : null);
        }
    }, [LoadData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value, files } = e.target as HTMLInputElement;
        setFormData((prevData) => ({
            ...prevData,
            [id]: files ? files[0] : value,
        }));
        if (id === "image" && files && files.length > 0) {
            setFileError(null);
            setPreviewImage(URL.createObjectURL(files[0]));
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
        setFileError(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreviewImage(URL.createObjectURL(file));
            setFileError(null);
        }
    };

    const { mutate, status } = useMutation({
        mutationFn: async (newItem: FormData) => {
            return http.post("/tour/footer/1", newItem, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Item added successfully!",
                duration: 3000,
            });

            queryClient.invalidateQueries({ queryKey: ["footer"] });

            setIsOpen(false);
            resetForm();
            navigate("/identity");
        },
        onError: () => {
            toast({
                title: "Error",
                description: "There was an error adding the item.",
                variant: "destructive",
                duration: 3000,
            });
        },
    });

    const isLoading = status === "pending";

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.image) {
            setFileError("Please select a file.");
            return;
        } else {
            setFileError(null);
        }

        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("address", formData.address);
        data.append("social", formData.social);
        
        if (typeof formData.image === "object") {
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
            <DialogContent className="sm:max-w-6xl ">
                <DialogHeader>
                    <DialogTitle>Edit Footer</DialogTitle>
                    <DialogDescription>
                        {isFetching ? "Loading data..." : "Make changes to the footer here."}
                    </DialogDescription>
                </DialogHeader>
                {fetchError && <p className="text-red-500">Failed to load data.</p>}
                <form onSubmit={handleSubmit}>
                    <div className="gap-4 flex flex-col lg:flex-row justify-center items-center">
                        <div className="gap-4 w-full lg:w-4/6">
                            <div className="grid w-full items-center gap-1.5 lg:col-span-1 col-span-2">
                                <Label htmlFor="title">Title:</Label>
                                <Input
                                    type="text"
                                    placeholder="Best thai deal"
                                    id="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="grid w-full items-center gap-1.5 col-span-2 row-span-3">
                                <Label htmlFor="description">Description:</Label>
                                <Input
                                    id="description"
                                    placeholder="ex. 10"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="grid w-full items-center gap-1.5 col-span-2 row-span-3">
                                <Label htmlFor="address">Address:</Label>
                                <Input
                                    id="address"
                                    placeholder="ex. 10"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="grid w-full items-center gap-1.5 col-span-2 row-span-3">
                                <Label htmlFor="social">Social:</Label>
                                <Input
                                    id="social"
                                    placeholder="ex. 10"
                                    value={formData.social}
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
                                            alt="Profile"
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

export default FooterDial;
