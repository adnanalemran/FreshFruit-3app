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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/custom/button";
import { Label } from "@radix-ui/react-label";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";

interface UpdateItemProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateItem({ id, isOpen, onClose }: UpdateItemProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    ratings: "",
    review: "",
    platform: "",
    status: "",
  });

  const { data: LoadData, isLoading: isFetching, error: fetchError } = useQuery({
    queryKey: ["review", id],
    queryFn: async () => {
      const res = await http.get(`/portfolio/review/${id}`);
      return res.data;
    },
    enabled: isOpen,
  });

  useEffect(() => {
    if (LoadData) {
      setFormData({
        name: LoadData.data?.name || "",
        ratings: LoadData.data?.ratings || "",
        status: LoadData.data?.status || "",
        platform: LoadData.data?.platform || "",
        review: LoadData.data?.review || "",
      });
    }
  }, [LoadData, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target as HTMLInputElement;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      ratings: "",
      review: "",
      platform: "",
      status: "",
    });
  };

  const { mutate, status } = useMutation({
    mutationFn: async (updatedItem: FormData) => {
      return http.post(`/portfolio/review/${id}`, updatedItem, {
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

      queryClient.invalidateQueries({ queryKey: ["review"] });

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

    const data = new FormData();
    data.append("name", formData.name);
    data.append("ratings", formData.ratings);  // Ensure field name matches the backend
    data.append("review", formData.review);
    data.append("platform", formData.platform);
    data.append("status", formData.status);

    mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        {/* Add a button or trigger here if needed */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Edit Data</DialogTitle>
          <DialogDescription>
            {isFetching ? "Loading data..." : "Make changes to the item here."}
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
                <Label htmlFor="ratings">Ratings:</Label>
                <Input
                  id="ratings"
                  placeholder="ex. 5"
                  value={formData.ratings}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid w-full items-center gap-1.5 col-span-2 row-span-3">
                <Label htmlFor="review">Review:</Label>
                <Input
                  id="review"
                  placeholder="ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                  value={formData.review}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid w-full items-center gap-1.5 col-span-2 row-span-3">
                <Label htmlFor="platform">Platform:</Label>
                <Input
                  id="platform"
                  placeholder="ex. Ectomere"
                  value={formData.platform}
                  onChange={handleInputChange}
                  required
                />
              </div>
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
