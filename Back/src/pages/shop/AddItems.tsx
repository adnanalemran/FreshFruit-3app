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
import { useNavigate } from 'react-router-dom';
import { IoMdAddCircleOutline } from "react-icons/io";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import http from '@/utils/http';

const AddItems = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        discount: '',
        url: '',
        status: 'Active',
        image: null,
    });
    const [fileError, setFileError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value, files } = e.target as HTMLInputElement;
        setFormData((prevData) => ({
            ...prevData,
            [id]: files ? files[0] : value,
        }));
        if (id === 'image' && files && files.length > 0) {
            setFileError(null);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            discount: '',
            url: '',
            status: 'Active',
            image: null,
        });
        setFileError(null);
    };

    const { mutate, status } = useMutation({
        mutationFn: async (newItem: FormData) => {
            return http.post('/portfolio/shop', newItem, {
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

            queryClient.invalidateQueries({ queryKey: ['shop'] });

            setIsOpen(false);
            resetForm();
            navigate('/shop');
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

        if (!formData.title || !formData.discount || !formData.url) {
            toast({
                title: 'Validation Error',
                description: 'Please fill out all required fields.',
                variant: 'destructive',
                duration: 3000,
            });
            return;
        }

        if (!formData.image) {
            setFileError('Please select a file.');
            return;
        } else {
            setFileError(null);
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('discount', formData.discount);
        data.append('url', formData.url);
        data.append('status', formData.status);
        if (formData.image) {
            data.append('image', formData.image);
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
                            <DrawerTitle>Add a New Item</DrawerTitle>
                            <DrawerDescription>
                                <div className='grid lg:grid-cols-2 grid-rows-c gap-4'>
                                    <div className='grid w-full items-center gap-1.5  col-span-2'>
                                        <Label htmlFor="title">Title:</Label>
                                        <Input
                                            type="text"
                                            placeholder="E-commerce"
                                            id='title'
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className='grid w-full items-center gap-1.5 col-span-2 row-span-3'>
                                        <Label htmlFor="discount">Discount:</Label>
                                        <Input
                                            id='discount'
                                            placeholder="ex. 10"
                                            value={formData.discount}
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



                                        <Label htmlFor="image">Background Picture<span className='text-[10px] '>   (Max size: 10MB, recommended dimensions: 1100x734 and format: .webp)</span> </Label>
                                        <Input
                                            id="image"
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
                                {isLoading ? 'Submitting...' : 'Submit'}
                            </Button>
                            <DrawerClose>
                                <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>
        </div >
    );
};

export default AddItems;
