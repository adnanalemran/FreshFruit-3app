import { Layout } from '@/components/custom/layout';
import { Search } from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';
import { ChangeEvent, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import http from '@/utils/http';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export default function Destinations() {
    const [fileList, setFileList] = useState<{ imageFile: File | null; id: number }[]>([{ imageFile: null, id: 1 }]);
    const [mainImage, setMainImage] = useState<File | null>(null);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [data, setData] = useState({
        title: "",
        description: "",
        description2: "",
    });
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // Handles the removal of a file input
    const handleRemoveInput = (id: number) => {
        const updatedList = fileList.filter((item) => item.id !== id);
        setFileList(updatedList);
    };

    // Adds a new file input
    const handleAddInput = () => {
        const newId = fileList.length > 0 ? fileList[fileList.length - 1].id + 1 : 1;
        setFileList([...fileList, { imageFile: null, id: newId }]);
    };

    // Handles file input change for multiple images
    const handleFileInput = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const { files } = e.target;
        const updatedList = [...fileList];
        updatedList[index].imageFile = files ? files[0] : null;
        setFileList(updatedList);
    };

    // Handles file input change for main image
    const handleMainImageInput = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        setMainImage(files ? files[0] : null);
    };

    // Handles changes in text input fields
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    // Handles form submission
    const handleSubmit = async () => {
        setLoading(true);
        const filesToUpload = fileList.filter((item) => item.imageFile !== null);
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("description2", data.description2);
        if (mainImage) {
            formData.append("image", mainImage);
        }
        filesToUpload.forEach((item) => {
            if (item.imageFile) {
                formData.append("images[]", item.imageFile);
            }
        });
        try {
            await http.post("/tour/destinations", formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast({
                title: 'Success',
                description: '  added successfully!',
                duration: 3000,
            });

            queryClient.invalidateQueries({ queryKey: ['destinations'] });

            navigate('/destinations');
        } catch (err) {
            console.error('Upload failed', err);
        } finally {
            setLoading(false);
        }
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
                <div className='mb-6  '>
                    <div>
                        <h1 className='text-2xl font-bold tracking-tight'>Add Destinations</h1>
                        <p className='text-muted-foreground'>Create a new destination for your space</p>
                    </div>

                    <div className="  mx-auto mt-12 mb-2   rounded-md    ">
                        <div className="sm:col-span-6 mb-4">
                            <label htmlFor="title" className="block ps-1 text-sm font-medium leading-6">
                                Title
                            </label>
                            <div className="mt-2">
                                <Input
                                    type="text"
                                    name="title"
                                    value={data.title}
                                    onChange={handleChange}
                                    id="title"
                                    autoComplete="off"
                                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset   focus:ring-2 focus:ring-inset focus: sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-6 mb-4">
                            <label htmlFor="description" className="block ps-1 text-sm font-medium leading-6">
                                Description
                            </label>
                            <div className="mt-2">
                                <Textarea
                                    rows={4}
                                    name="description"
                                    value={data.description}
                                    onChange={handleChange}
                                    id="description"
                                    autoComplete="off"
                                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset   focus:ring-2 focus:ring-inset focus: sm:text-sm sm:leading-6"
                                ></Textarea>
                            </div>
                        </div>

                        <div className="sm:col-span-6 mb-4">
                            <label htmlFor="description2" className="block ps-1 text-sm font-medium leading-6">
                                Additional Description
                            </label>
                            <div className="mt-2">
                                <Textarea
                                    rows={4}
                                    name="description2"
                                    value={data.description2}
                                    onChange={handleChange}
                                    id="description2"
                                    autoComplete="off"
                                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset   focus:ring-2 focus:ring-inset focus: sm:text-sm sm:leading-6"
                                ></Textarea>
                            </div>
                        </div>

                        <div className="sm:col-span-6 mb-4">
                            <label htmlFor="mainImage" className="block ps-1 text-sm font-medium leading-6">
                                Main Image
                            </label>
                            <div className="mt-2">
                                <input
                                    type="file"
                                    name="mainImage"
                                    onChange={handleMainImageInput}
                                    accept="image/*"
                                    id="mainImage"
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-[#1d1d1d] hover:file:bg-violet-100 ps-1 outline-none rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset   focus:ring-2 focus:ring-inset focus: sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        {fileList.map((item, i) => (
                            <div key={item.id} className="sm:col-span-6 mb-4">
                                <div className="grid grid-cols-12 gap-x-4 gap-y-4">
                                    <div className="col-span-6">
                                        <label htmlFor={`file-${item.id}`} className="block ps-1 text-sm font-medium leading-6">
                                            Additional Image
                                        </label>
                                        <div className="mt-2 grid grid-cols-12">
                                            <div className="col-span-10">
                                                <Input
                                                    type="file"
                                                    name="imageFile"
                                                    onChange={(e) => handleFileInput(e, i)}
                                                    accept="image/*"
                                                    id={`file-${item.id}`}
                                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-0.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-[#1d1d1d] hover:file:bg-violet-100 ps-1 outline-none rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset   focus:ring-2 focus:ring-inset focus: sm:text-sm sm:leading-6 "
                                                />
                                            </div>
                                            <div className="col-span-2 flex items-center">
                                                {fileList.length - 1 === i && (
                                                    <FiPlus
                                                        style={{ fontSize: "20px" }}
                                                        onClick={handleAddInput}
                                                        className="ms-1 cursor-pointer text-slate-700"
                                                    />
                                                )}
                                                {fileList.length > 1 && (
                                                    <FiMinus
                                                        style={{ fontSize: "20px" }}
                                                        onClick={() => handleRemoveInput(item.id)}
                                                        className="ms-3 cursor-pointer text-slate-700"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className='w-full flex justify-end '>
                            <Button
                                onClick={handleSubmit}
                                type="submit" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit'}
                            </Button>
                        </div>

                    </div>
                </div>
            </Layout.Body>
        </Layout>
    );
}
