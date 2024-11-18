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

export function HeaderDial() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [isOpen, setIsOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        hotlineNo: "",
        image: null as File | string | null,
    });

    const { data: LoadData, isLoading: isFetching, error: fetchError } = useQuery({
        queryKey: ["header", 1],
        queryFn: async () => {
            const res = await http.get("/tour/header/1");
            return res.data;
        },
        enabled: isOpen,
    });

    useEffect(() => {
        if (LoadData) {
            setFormData({
                name: LoadData.data?.name || "",
                hotlineNo: LoadData.data?.hotlineNo || "",
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
            setPreviewImage(URL.createObjectURL(files[0]));
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            hotlineNo: "",
            image: null,
        });
        setPreviewImage(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const { mutate, status } = useMutation({
        mutationFn: async (newItem: FormData) => {
            return http.post("/tour/header/1", newItem, {
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

            queryClient.invalidateQueries({ queryKey: ["header"] });

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
            toast({
                title: "Error",
                description: "Please select a file.",
                variant: "destructive",
                duration: 3000,
            });
            return;
        }

        const data = new FormData();
        data.append("name", formData.name);
        data.append("hotlineNo", formData.hotlineNo);

        // Append image if new image is selected
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
                                <Label htmlFor="name">Name:</Label>
                                <Input
                                    type="text"
                                    placeholder="Best Thai Deal"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="grid w-full items-center gap-1.5 col-span-2 row-span-3">
                                <Label htmlFor="hotlineNo">Hotline No:</Label>
                                <Input
                                    id="hotlineNo"
                                    placeholder="ex. +8105465"
                                    value={formData.hotlineNo}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4.5  w-full lg:w-2/6">
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
                            <label htmlFor="updateImage" className="w-full flex flex-col  justify-center  items-center mt-4">
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

export default HeaderDial;
