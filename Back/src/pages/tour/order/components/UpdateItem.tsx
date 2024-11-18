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
    title: "",
    description: "",
    url: "",
    status: "",
    image: null as File | string | null,
  });
  const [fileError, setFileError] = useState<string | null>(null);

  // Fetching existing slider data
  const { data: LoadData, isLoading: isFetching, error: fetchError } = useQuery({
    queryKey: ["slider", id],
    queryFn: async () => {
      const res = await http.get(`/portfolio/slider/${id}`);
      return res.data;
    },
    enabled: isOpen,
  });

  // Set form data with fetched data
  useEffect(() => {
    if (LoadData) {
      setFormData({
        title: LoadData.data?.title || "",
        url: LoadData.data?.url || "",
        status: LoadData.data?.status || "",
        description: LoadData.data?.description || "",
        image: LoadData.data?.image || null,
      });
      setPreviewImage(LoadData.data?.image ? ImageUrl + LoadData.data.image : null);
    }
  }, [LoadData, isOpen]);

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
      title: "",
      url: "",
      description: "",
      status: "",
      image: null,
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
  const { mutate, status } = useMutation({
    mutationFn: async (updatedItem: FormData) => {
      return http.post(`/portfolio/slider/${id}`, updatedItem, {
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

      queryClient.invalidateQueries({ queryKey: ["slider"] });

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
    data.append("url", formData.url);
    data.append("status", formData.status);

    if (typeof formData.image === "object") {
      data.append("image", formData.image);
    }

    mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild />
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
                <Input
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
               
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="url">URL:</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={handleInputChange}
                    />
              </div>
            </div>

            <div className="w-full lg:w-2/6">
              <div className="my-4.5 w-full text-center">
                {previewImage ? (
                  <img className="h-36 rounded-xl" src={previewImage} alt="Profile" />
                ) : (
                  <div className="flex items-center justify-center w-36 h-36 rounded-full bg-gray-200">
                    No image
                  </div>
                )}
              </div>
              <label htmlFor="updateImage" className="w-full flex flex-col justify-center items-center mt-4">
                <p className="text-sm py-2 lg:px-4">
                  Note: Image must be jpg, jpeg, png, gif, bmp format and maximum size: 10 MB
                </p>
                <div className="inline-flex cursor-pointer items-center justify-center rounded-md gap-2 px-3 py-2 text-sm bg-slate-300">
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
            </div>
          </div>
          {fileError && <p className="text-red-500">{fileError}</p>}
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
