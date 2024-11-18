/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Link, useNavigate } from 'react-router-dom';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

export default function Destinations() {
    const [fileList, setFileList] = useState<{ imageFile: File | null; id: number }[]>([{ imageFile: null, id: 1 }]);
    const [planList, setPlanList] = useState([{ id: 1, planTitle: "", planDescription: "" }]);
    const [selectedDestination, setSelectedDestination] = useState<number | null>(null);

    const [mainImage, setMainImage] = useState<File | null>(null);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [data, setData] = useState({
        title: "",
        price: "0",
        day: "",
        age: "",
        parson: "",
        description: "",
        subtitle: "",
        departure: "",
        departureTime: "",
        returnTime: "",
        Included: ""
    });
    const [errors, setErrors] = useState({
        title: false,
        price: false,
        day: false,
        age: false,
        parson: false,
        description: false,
        subtitle: false,
        departure: false,
        departureTime: false,
        returnTime: false,
        Included: false
    });

    const validateFields = () => {
        const newErrors = {
            title: data.title === "",
            price: data.price === "",
            day: data.day === "",
            age: data.age === "",
            parson: data.parson === "",
            description: data.description === "",
            subtitle: data.subtitle === "",
            departure: data.departure === "",
            departureTime: data.departureTime === "",
            returnTime: data.returnTime === "",
            Included: data.Included === ""
        };

        setErrors(newErrors);

        return !Object.values(newErrors).includes(true);
    };


    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const { data: destinations = [] } = useQuery({
        queryKey: ["destinations"],
        queryFn: async () => {
            const res = await http.get("/tour/destinations/active");
            return res.data.data;
        },
    });

    const handleAddInputTourPlan = () => {
        const newId = planList.length > 0 ? planList[planList.length - 1].id + 1 : 1;
        setPlanList([...planList, { id: newId, planTitle: "", planDescription: "" }]);
    };

    const handleRemoveInputPlan = (id: number) => {
        const updatedPlanList = planList.filter((item) => item.id !== id);
        setPlanList(updatedPlanList);
    };

    const handleAddInput = () => {
        const newId = fileList.length > 0 ? fileList[fileList.length - 1].id + 1 : 1;
        setFileList([...fileList, { imageFile: null, id: newId }]);
    };

    const handleRemoveInput = (id: number) => {
        const updatedFileList = fileList.filter((item) => item.id !== id);
        setFileList(updatedFileList);
    };

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const { files } = e.target;
        const updatedList = [...fileList];
        updatedList[index].imageFile = files ? files[0] : null;
        setFileList(updatedList);
    };

    const handleMainImageInput = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        setMainImage(files ? files[0] : null);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const handlePlanChange = (id: number, field: string, value: string) => {
        setPlanList((prevPlanList) =>
            prevPlanList.map((plan) =>
                plan.id === id ? { ...plan, [field]: value } : plan
            )
        );
    };

    const handleSubmit = async () => {

        if (!validateFields()) {
            toast({
                title: "Error",
                description: "Please fill in all required fields.",
                duration: 3000,
            });
            return;
        }


        setLoading(true);
        const filesToUpload = fileList.filter((item) => item.imageFile !== null);
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("price", data.price);
        formData.append("description", data.description);
        formData.append("subtitle", data.subtitle);
        formData.append("departure", data.departure);
        formData.append("day", data.day);
        formData.append("age", data.age);
        formData.append("parson", data.parson);
        formData.append("departureTime", data.departureTime);
        formData.append("returnTime", data.returnTime);
        formData.append("Included", data.Included);
        formData.append("tourPlans", JSON.stringify(planList));
        if (selectedDestination) {
            formData.append("destination", selectedDestination.toString());
        }
        if (mainImage) {
            formData.append("image", mainImage);
        }
        filesToUpload.forEach((item) => {
            if (item.imageFile) {
                formData.append("images[]", item.imageFile);
            }
        });
        try {
            const response = await http.post("/tour/package", formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const successMessage = response.data?.message || 'Package added successfully!';
            toast({
                title: 'Success',
                description: successMessage,
                duration: 3000,

            });
            queryClient.invalidateQueries({ queryKey: ['packages'] });
            navigate('/package-tour');
        } catch (err: any) {
            console.error('Upload failed', err);

            // Show error message from API if available
            const errorMessage = err.response?.data?.message || 'Failed to add package. Please try again later.';

            toast({
                title: 'Error',
                description: errorMessage,
                duration: 3000,

            });
        } finally {
            setLoading(false);
        }
    };


    const {
        data: currency_symbol,
    } = useQuery({
        queryKey: ['currency_symbol'],
        queryFn: async () => {
            const res = await http.get('/currency')
            return res?.data?.data.currency_symbol
        },
    })

    console.log('currency', currency_symbol)

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
                <div className='mb-6'>
                    <div className='w-full flex justify-between items-center'>
                        <div>
                            <h1 className='text-2xl font-bold tracking-tight'>Add Packages</h1>
                            <p className='text-muted-foreground'>Create a new package for your space</p>
                        </div>

                        <Button
                            onClick={handleSubmit}
                            type="submit" disabled={loading}>
                            {loading ? 'Processing...' : 'Submit'}
                        </Button>
                    </div>

                    <div className="mx-auto mt-12 mb-2 rounded-md">
                        <div className="flex flex-col w-full lg:flex-row lg:gap-6">
                            <div className="sm:col-span-6 mb-4  w-full">
                                <label htmlFor="title">Title:  * </label>
                                <div className="mt-2">
                                    <Input

                                        type="text"
                                        name="title"
                                        value={data.title}
                                        onChange={handleChange}
                                        id="title"
                                        autoComplete="off"
                                        placeholder='ex.Beijing'
                                    />
                                    {errors.title && <p className="text-red-500">This field is required</p>}
                                </div>
                            </div>
                            <div className="sm:col-span-6 mb-4 lg:w-1/2 w-full hidden">
                                <label htmlFor="price">Price: {currency_symbol}*</label>
                                <div className="mt-2">
                                    <Input
                                        type="number"
                                        name="price"
                                        value={data.price}
                                        onChange={handleChange}
                                        id="price"
                                        autoComplete="off"
                                        placeholder='ex.1000'
                                    />
                                    {errors.price && <p className="text-red-500">This field is required</p>}
                                </div>
                            </div>
                        </div>
                        <div className="sm:col-span-6 mb-4">
                            <label htmlFor="subtitle">Subtitle: *</label>
                            <div className="mt-2">
                                <Input
                                    type="text"
                                    name="subtitle"
                                    value={data.subtitle}
                                    onChange={handleChange}
                                    id="subtitle"
                                    autoComplete="off"
                                    placeholder='Been there recently?'
                                />
                                {errors.subtitle && <p className="text-red-500">This field is required</p>}
                            </div>
                        </div>
                        <div className="sm:col-span-6 mb-4">
                            <label htmlFor="description">Description: *</label>
                            <div className="mt-2">
                                <Textarea
                                    rows={4}
                                    name="description"
                                    value={data.description}
                                    onChange={handleChange}
                                    id="description"
                                    autoComplete="off"
                                    placeholder='Provide a detailed description of the package, including highlights and unique features.'
                                ></Textarea>
                                {errors.description && <p className="text-red-500">This field is required</p>}
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-4 grid-cols-2 gap-2">
                            <div className="sm:col-span-1 mb-4">
                                <label htmlFor="destination">Destination: *</label>
                                <div className="mt-2">
                                    <Select onValueChange={(value: string) => setSelectedDestination(Number(value))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a Place" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {destinations.length > 0 ? (
                                                    destinations.map((destination: { id: number, title: string }) => (
                                                        <SelectItem key={destination.id} value={destination.id.toString()}>
                                                            {destination.title}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <Link to='/destinations/create'>Add new</Link>
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                </div>
                            </div>
                            <div className="sm:col-span-1 mb-4">
                                <label htmlFor="day"  >
                                    Day: *
                                </label>
                                <div className="mt-2">
                                    <Input
                                        placeholder='ex.2'
                                        type="number"
                                        name="day"
                                        value={data.day}
                                        onChange={handleChange}
                                        id="day"
                                        autoComplete="off"
                                    />
                                    {errors.day && <p className="text-red-500">This field is required</p>}
                                </div>
                            </div>
                            <div className="sm:col-span-1 mb-4">
                                <label htmlFor="parson"  >
                                    Parson :
                                </label>
                                <div className="mt-2">
                                    <Input
                                        placeholder='ex.2'
                                        type="number"
                                        name="parson"
                                        value={data.parson}
                                        onChange={handleChange}
                                        id="parson"
                                        autoComplete="off"

                                    />
                                    {errors.parson && <p className="text-red-500">This field is required</p>}
                                </div>
                            </div>
                            <div className="sm:col-span-1 mb-4">
                                <label htmlFor="age"  >
                                    Minimum age:
                                </label>
                                <div className="mt-2">
                                    <Input
                                        type="number"
                                        name="age"
                                        value={data.age}
                                        onChange={handleChange}
                                        id="age"
                                        autoComplete="off"
                                        placeholder='ex.18'
                                    />
                                    {errors.age && <p className="text-red-500">This field is required</p>}
                                </div>
                            </div>

                            <div className="sm:col-span-1 mb-4">
                                <label htmlFor="departure">Departure:</label>
                                <div className="mt-2">
                                    <Input
                                        type="text"
                                        name="departure"
                                        value={data.departure}
                                        onChange={handleChange}
                                        id="departure"
                                        autoComplete="off"
                                        placeholder='ex. Main Street, Taiwan'
                                    />
                                    {errors.departure && <p className="text-red-500">This field is required</p>}
                                </div>
                            </div>
                            <div className="sm:col-span-1 mb-4">
                                <label htmlFor="departureTime">Departure Time:</label>
                                <div className="mt-2">
                                    <Input
                                        placeholder='ex.Please arrive by 9:15 AM  '
                                        type="text"
                                        name="departureTime"
                                        value={data.departureTime}
                                        onChange={handleChange}
                                        id="departureTime"
                                        autoComplete="off"
                                    />
                                    {errors.departureTime && <p className="text-red-500">This field is required</p>}
                                </div>
                            </div>
                            <div className="sm:col-span-1 mb-4">
                                <label htmlFor="returnTime">Return Time:</label>
                                <div className="mt-2">
                                    <Input
                                        placeholder='ex. Approximately 8:30 PM.'
                                        type="text"
                                        name="returnTime"
                                        value={data.returnTime}
                                        onChange={handleChange}
                                        id="returnTime"
                                        autoComplete="off"
                                    />
                                    {errors.returnTime && <p className="text-red-500">This field is required</p>}
                                </div>
                            </div>
                            <div className="sm:col-span-1 mb-4">
                                <label htmlFor="Included"  >
                                    Included:
                                </label>
                                <div className="mt-2">
                                    <Input
                                        placeholder='ex. Transportation, Tour Guide'
                                        type="text"
                                        name="Included"
                                        value={data.Included}
                                        onChange={handleChange}
                                        id="Included"
                                        autoComplete="off"
                                    />
                                    {errors.Included && <p className="text-red-500">This field is required</p>}
                                </div>
                            </div>
                        </div>

                        {/* Tour Plan */}
                        <div className="sm:col-span-6 mb-4">
                            <label htmlFor="tourPlan">Tour Plan:</label>
                            {planList.map((plan) => (
                                <div key={plan.id} className="flex gap-2 items-center mb-2">
                                    <Textarea
                                        required
                                        rows={2}
                                        placeholder="ex. Day 1: Visit the Great Wall of China"
                                        value={plan.planTitle}
                                        onChange={(e) => handlePlanChange(plan.id, "planTitle", e.target.value)}
                                        className="flex-1"
                                    />
                                    <Textarea
                                        required
                                        rows={2}
                                        placeholder=" ex. Visit the Great Wall of China, one of the Seven Wonders of the World."
                                        value={plan.planDescription}
                                        onChange={(e) => handlePlanChange(plan.id, "planDescription", e.target.value)}
                                        className="flex-1"
                                    />
                                    {planList.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleRemoveInputPlan(plan.id)}
                                        >
                                            <FiMinus />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={handleAddInputTourPlan}>
                                <FiPlus className="mr-2" /> Add more plans
                            </Button>
                        </div>



                        <div className="sm:col-span-6 mb-4">
                            <label htmlFor="image">Main Image:*</label>
                            <div className="mt-2">
                                <Input
                                    type="file"
                                    name="image"
                                    required
                                    onChange={handleMainImageInput}
                                    id="image"
                                />
                            </div>
                        </div>
                        <label htmlFor="images">Images:*</label>
                        {fileList.map((file, index) => (
                            <div className="flex items-center gap-2 mb-4" key={file.id}>
                                <Input
                                    type="file"
                                    name="images[]"
                                    required
                                    onChange={(e) => handleFileInput(e, index)}
                                />
                                {fileList.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"

                                        onClick={() => handleRemoveInput(file.id)}
                                    >
                                        <FiMinus />
                                    </Button>
                                )}
                            </div>
                        ))}

                        <div className="sm:col-span-6 mb-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAddInput}
                            >
                                <FiPlus className="mr-2" /> Add more images
                            </Button>
                        </div>
                    </div>
                </div>
            </Layout.Body>
        </Layout>
    );
}
