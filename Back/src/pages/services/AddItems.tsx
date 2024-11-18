import React, { useState } from 'react';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/custom/button';
import { Label } from '@radix-ui/react-label';
import { useToast } from '@/components/ui/use-toast';
import { IoMdAddCircleOutline } from "react-icons/io";
import { useMutation, useQueryClient } from '@tanstack/react-query';

import http from '@/utils/http';

const AddItems = () => {
    const { toast } = useToast();

    const queryClient = useQueryClient();


    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        Title: '',
        Description: '',
        url: '',
        status: 'Active',
        Image: null,
    });
    const [fileError, setFileError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value, files } = e.target as HTMLInputElement;
        setFormData((prevData) => ({
            ...prevData,
            [id]: files ? files[0] : value,
        }));
        if (id === 'Image' && files && files.length > 0) {
            setFileError(null);
        }
    };

    const resetForm = () => {
        setFormData({
            Title: '',
            Description: '',
            url: '',
            status: 'Active',
            Image: null,
        });
        setFileError(null);
    };

    const { mutate, status } = useMutation({
        mutationFn: async (newItem: FormData) => {
            return http.post('/portfolio/service', newItem, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        },
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Item added successfully!',
                duration: 3000,
            });

            queryClient.invalidateQueries({ queryKey: ['service'] });

            setIsOpen(false);
            resetForm();

        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'There was an error adding the item.',
                variant: 'destructive',
                duration: 3000,
            });
        },
    });

    const isLoading = status === 'pending';

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.Title || !formData.Description || !formData.url) {
            toast({
                title: 'Validation Error',
                description: 'Please fill out all required fields.',
                variant: 'destructive',
                duration: 3000,
            });
            return;
        }

        if (!formData.Image) {
            setFileError('Please select a file.');
            return;
        } else {
            setFileError(null);
        }

        const data = new FormData();
        data.append('Title', formData.Title);
        data.append('Description', formData.Description);
        data.append('url', formData.url);
        data.append('Status', formData.status);
        if (formData.Image) {
            data.append('Image', formData.Image);
        }

        mutate(data);
    };

    return (
        <div>
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger>
                    <Button variant="outline" onClick={() => setIsOpen(true)}>
                        <div className='flex gap-2 items-center justify-center'>
                            <IoMdAddCircleOutline className='text-lg' /> ADD NEW
                        </div>
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <form onSubmit={handleSubmit}>
                        <DrawerHeader>
                            <DrawerTitle>Add a New Service </DrawerTitle>
                            <DrawerDescription>
                                <div className='grid lg:grid-cols-2 grid-rows-c gap-4'>
                                    <div className='grid w-full items-center gap-1.5 lg:col-span-1 col-span-2'>
                                        <Label htmlFor="Title">Title:</Label>
                                        <Input
                                            type="text"
                                            placeholder="E-commerce"
                                            id='Title'
                                            value={formData.Title}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className='grid w-full items-center gap-1.5 col-span-2 row-span-3'>
                                        <Label htmlFor="Description">Description:</Label>
                                        <Input
                                            id='Description'
                                            placeholder="ex. Thai  Best E-com service  For You "
                                            value={formData.Description}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className='grid w-full items-center gap-1.5'>
                                        <Label htmlFor="url">URL Link:</Label>
                                        <Input
                                            type="url"
                                            placeholder="ex. https://bestthaideal.com/"
                                            id='url'
                                            value={formData.url}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="Image">Background Picture <span className='text-[10px]
                                        '>   (Max size: 10MB, recommended dimensions: 1100x734 and format: .webp)</span> </Label>
                                        <Input
                                            id="Image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleInputChange}
                                            required
                                        />
                                        {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
                                    </div>
                                </div>
                            </DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save'}
                            </Button>
                            <DrawerClose>
                                <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default AddItems;
