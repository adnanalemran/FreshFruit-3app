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
        name: '',
        rating: '',
        platform: '',
        review: '',
        status: 'Active',
    });
    const [, setFileError] = useState<string | null>(null);

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
            name: '',
            rating: '',
            platform: '',
            review: '',
            status: 'Active',

        });
        setFileError(null);
    };

    const { mutate, status } = useMutation({
        mutationFn: async (newItem: FormData) => {
            return http.post('/portfolio/review', newItem, {
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

            queryClient.invalidateQueries({ queryKey: ['review'] });

            setIsOpen(false);
            resetForm();
            navigate('/review');
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
        const data = new FormData();
        data.append('name', formData.name);
        data.append('rating', formData.rating);
        data.append('platform', formData.platform);
        data.append('status', formData.status);
        data.append('review', formData.review);


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
                                <div className='grid lg:grid-cols-1 grid-rows-c gap-4'>
                                    <div className='grid w-full items-center gap-1.5   '>
                                        <Label htmlFor="name">Name:</Label>
                                        <Input
                                            type="text"
                                            placeholder="ex .Mr, Adnan"
                                            id='name'
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className='grid w-full items-center gap-1.5  '>
                                        <Label htmlFor="discount">rating:</Label>
                                        <Input
                                            type='number'
                                            id='rating'
                                            placeholder="ex. 5"
                                            value={formData.rating}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className='grid w-full items-center gap-1.5  '>
                                        <Label htmlFor="platform">platform:</Label>
                                        <Input
                                            type='text'
                                            id='platform'
                                            placeholder="ex. E commerce"
                                            value={formData.platform}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className='grid w-full items-center gap-1.5  '>
                                        <Label htmlFor="review">review:</Label>
                                        <Input
                                            type='text'
                                            id='review'
                                            placeholder="ex. Short review of the product"
                                            value={formData.review}
                                            onChange={handleInputChange}
                                            required
                                        />
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
        </div>
    );
};

export default AddItems;
