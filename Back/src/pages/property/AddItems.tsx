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
        description: '',

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
            description: '',
            status: 'Active',
            image: null,
        });
        setFileError(null);
    };

    const { mutate, status } = useMutation({
        mutationFn: async (newItem: FormData) => {
            return http.post('/portfolio/property', newItem, {
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

            queryClient.invalidateQueries({ queryKey: ['property'] });

            setIsOpen(false);
            resetForm();
            navigate('/property');
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



        if (!formData.image) {
            setFileError('Please select a file.');
            return;
        } else {
            setFileError(null);
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);

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
                                <div className='grid     gap-4'>
                                    <div className='grid w-full items-center gap-1.5   '>
                                        <Label htmlFor="title">Title:</Label>
                                        <Input
                                            type="text"
                                            placeholder="Discover the possibilities
"
                                            id='title'
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className='grid w-full items-center gap-1.5   row-span-3'>
                                        <Label htmlFor="description">Description:</Label>
                                        <Input
                                            id='description'
                                            placeholder="ex. 	
With nearly half a million attractions, hotels & more, you're sure to find joy.
."
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="image">  Picture <span className='text-[10px]
                                        '>   (Max size: 10MB, recommended format: .svg)</span> </Label>
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
        </div>
    );
};

export default AddItems;
