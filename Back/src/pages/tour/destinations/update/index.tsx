import { Layout } from '@/components/custom/layout';
import { Search } from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdOutlineFileUpload } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/custom/button";
import { Label } from "@radix-ui/react-label";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { ImageUrl } from "@/utils/ImageUrl";
import { Textarea } from '@/components/ui/textarea';
import ImageHandel from './ImageHandel';

const DestinationUpdate = () => {
    const navigate = useNavigate()
    const { id } = useParams();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        id: id,
        title: "",
        description: "",
        description2: "",
        inbox_files: [],
        image: null as File | string | null,
    });
    const [fileError, setFileError] = useState<string | null>(null);

    // Fetching existing destination data
    const { data: LoadData, isLoading, error: fetchError } = useQuery({
        queryKey: ["destinationItem", id],
        queryFn: async () => {
            const res = await http.get(`/tour/destinations/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    // Set form data with fetched data
    useEffect(() => {
        if (LoadData) {
            setFormData({
                id: LoadData.data?.id || "",
                title: LoadData.data?.title || "",
                description: LoadData.data?.description || "",
                description2: LoadData.data?.description2 || "",
                image: LoadData.data?.image || null,
                inbox_files: LoadData.data?.inbox_files || [],
            });
            setPreviewImage(LoadData.data?.image ? ImageUrl + LoadData.data.image : null);
        }
    }, [LoadData]);

    // Handle input change
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

    // Reset the form after submission
    const resetForm = () => {
        setFormData({
            id: id,
            title: "",
            description: "",
            description2: "",
            image: null,
            inbox_files: [],
        });
        setPreviewImage(null);
        setFileError(null);
    };

    // Image validation and change handler
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setFileError("Image size exceeds 10MB.");
                return;
            }
            setFormData({ ...formData, image: file });
            setPreviewImage(URL.createObjectURL(file));
            setFileError(null);
        }
    };

    // Submit mutation
    const { mutate } = useMutation({
        mutationFn: async (updatedItem: FormData) => {
            return http.post(`/tour/destinations/${id}`, updatedItem, {
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

            queryClient.invalidateQueries({ queryKey: ["destination"] });
            resetForm();
            navigate("/destinations");
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

    // Form submit handler
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.image) {
            setFileError("Please select a file.");
            return;
        }

        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("description2", formData.description2);

        if (typeof formData.image === "object") {
            data.append("image", formData.image);
        }

        mutate(data);
    };

    return (
        <Layout>
            <Layout.Header sticky className="shadow-sm">
                <div className="container mx-auto flex items-center justify-between px-4">
                    <Search />
                    <div className='ml-auto flex items-center space-x-4'>
                        <ThemeSwitch />
                        <UserNav />
                    </div>
                </div>
            </Layout.Header>

            <Layout.Body className="container mx-auto py-6 px-4">
                {fetchError && <p className="text-red-500">Failed to load data.</p>}
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className='mb-6 flex items-center justify-between'>
                                <div>
                                    <h1 className='text-2xl font-bold tracking-tight'>
                                        Destination Update
                                    </h1>
                                    <p className='text-muted-foreground'>
                                        Manage destinations for tours and packages
                                    </p>
                                </div>

                                <div className='w-full lg:w-1/2 flex justify-end'>
                                    <Button type="submit" disabled={isLoading} className="w-full lg:w-auto">
                                        {isLoading ? "Processing..." : "Save"}
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-3">
                                <div className="space-y-4 lg:col-span-2">
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="title">Title:</Label>
                                        <Input
                                            type="text"
                                            id="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="description">Description:</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={8}
                                        />
                                    </div>

                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="description2">Additional Description:</Label>
                                        <Textarea
                                            id="description2"
                                            value={formData.description2}
                                            onChange={handleInputChange}
                                            rows={8}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <div>Image:</div>
                                    <div className="mt-2 overflow-hidden rounded-xl border border-gray-300">
                                        {previewImage ? (
                                            <img className="object-cover w-full h-full" src={previewImage} alt="Preview" />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
                                                No image
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-sm py-3 text-center">
                                        Note: Image must be jpg, jpeg, png, gif, bmp format and maximum size: 10 MB
                                    </div>
                                    <label htmlFor="updateImage" className="flex flex-col items-center cursor-pointer">
                                        <div className="inline-flex cursor-pointer items-center justify-center rounded-md gap-2 px-3 py-2 text-sm  bg-slate-300  dark:bg-slate-800 ">
                                            <MdOutlineFileUpload /> Update Image
                                        </div>
                                        <input
                                            id="updateImage"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                    {fileError && <p className="text-red-500 mt-2">{fileError}</p>}
                                </div>
                            </div>
                        </form>
                        <ImageHandel destination_id={formData?.id as string}  />
                    </>
                )}
            </Layout.Body>
        </Layout>
    );
};

export default DestinationUpdate;
