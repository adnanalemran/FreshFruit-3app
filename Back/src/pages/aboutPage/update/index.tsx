import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/custom/button';
import { Layout } from '@/components/custom/layout';
import { Search } from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UserNav } from '@/components/user-nav';
import JoditEditor from 'jodit-react';
import { FaRegSave } from 'react-icons/fa';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import http from '@/utils/http';

interface FormDataState {
    title: string;
    description: string;
    status: string;
    canvas: string;
}

interface LoadDataResponse {
    data: {
        id: string;
        title: string;
        description: string;
        status: string;
        canvas: string;
    };
}

export default function UpdateAboutPage() {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [editorData, setEditorData] = useState<string>('');
    const editor = useRef(null);

    const [formData, setFormData] = useState<FormDataState>({
        title: '',
        description: '',
        status: 'Active',
        canvas: '',
    });

    // Fetching existing destination data
    const { data: LoadData } = useQuery<LoadDataResponse>({
        queryKey: ["destinationItem", id],
        queryFn: async () => {
            const res = await http.get(`/portfolio/about-page/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    // Set form data with fetched data
    useEffect(() => {
        if (LoadData) {
            setFormData({
                title: LoadData.data.title || "",
                description: LoadData.data.description || "",
                status: LoadData.data.status || "",
                canvas: LoadData.data.canvas || " ",
            });
            setEditorData(LoadData.data.canvas || '');
        }
    }, [LoadData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const { mutate, status } = useMutation({
        mutationKey: ['aboutPages', id],
        mutationFn: async (updatedItem: FormData) => {
            return http.post(`/portfolio/about-page/${id}`, updatedItem, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        },
        onSuccess: () => {
            toast({ title: 'Success', description: 'Item updated successfully!', duration: 3000 });
            queryClient.invalidateQueries({ queryKey: ['aboutPages'] });
            navigate('/about-page');
        },
        onError: () => {
            toast({ title: 'Error', description: 'Failed to update item.', variant: 'destructive', duration: 3000 });
        },
    });

    const isSubmitting = status === 'pending';

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('status', formData.status);
        data.append('canvas', editorData);
        mutate(data);
    };

    const editorConfig = {
        readonly: false,
        toolbar: true,
        spellcheck: true,
        language: 'en',
        toolbarButtonSize: 'small' as const,
        toolbarAdaptive: false,
        showCharsCounter: true,
        showWordsCounter: true,
        showXPathInStatusbar: false,
        askBeforePasteHTML: true,
        askBeforePasteFromWord: true,
        uploader: { insertImageAsBase64URI: true },
        height: 500,
    };

    return (
        <Layout>
            <Layout.Header sticky className="shadow-sm">
                <div className="container mx-auto flex items-center justify-between px-4">
                    <Search />
                    <div className="ml-auto flex items-center space-x-4">
                        <ThemeSwitch />
                        <UserNav />
                    </div>
                </div>
            </Layout.Header>

            <Layout.Body className="container mx-auto py-6 px-4">
                <section className="body-font">
                    <div className="container px-5 mx-auto">
                        <div className="flex flex-col text-center">
                            <h1 className="text-3xl font-medium title-font mb-4 tracking-widest w-full mx-auto border-b-2 py-4">
                                Update About Page
                            </h1>
                            <form onSubmit={handleSubmit}>
                                <h1 className="text-2xl font-medium title-font mb-4 tracking-widest lg:w-1/3 w-full mx-auto">
                                    Page Title:
                                    <Input id="title" className="mt-2" value={formData.title} onChange={handleInputChange} />
                                </h1>

                                <p className="lg:w-2/3 w-full mx-auto leading-relaxed text-base">
                                    Page Description:
                                    <Textarea id="description" className="mt-2" value={formData.description} onChange={handleInputChange} />
                                </p>

                                <div className="mt-3">
                                    <p className="text-xl py-4">Page Content :</p>
                                    <JoditEditor
                                        config={editorConfig}
                                        ref={editor}
                                        value={editorData}
                                        onBlur={(newData) => setEditorData(newData)}
                                    />
                                </div>

                                <div className="relative pb-6 mt-4 flex justify-end">
                                    <Button type="submit" disabled={isSubmitting} className="absolute gap-2">
                                        <FaRegSave /> Update
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </Layout.Body>
        </Layout>
    );
}
