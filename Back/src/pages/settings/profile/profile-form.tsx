import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Single import statement
import http from '@/utils/http';
import useAuth from '@/hooks/useAuth';
import { MdOutlineFileUpload } from 'react-icons/md';
import { Button } from '@/components/custom/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { ImageUrl } from '@/utils/ImageUrl';

export default function ProfileForm() {
  const { user, setToken, setUser, storeUser } = useAuth();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    gender: user?.gender || 'Male',
    dob: user?.dob || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    image: user?.image || null,
  });

  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || '',
        gender: user?.gender || 'Male',
        dob: user?.dob || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        image: user?.image || null,
      });
      setPreviewImage(user?.image ? `${ImageUrl}${user.image}` : null);
    }
  }, [user]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image file selection and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFileError('Image size exceeds 10MB.');
        return;
      }
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
      setFileError(null);
    }
  };

  // Submit mutation for updating user profile
  interface UpdateUserResponse {
    token: string;
    user: {
      name: string;
      gender: string;
      dob: string;
      email: string;
      phone: string;
      address: string;
      image: string | null;
    };
  }
  const queryClient = useQueryClient();
  const { mutate } = useMutation<UpdateUserResponse, unknown, FormData>({
    mutationFn: async (updatedItem) => {
      const response = await http.post<UpdateUserResponse>(`/update-user`, updatedItem, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
     
    },
    onSuccess: (response) => {
       queryClient.invalidateQueries({ queryKey: ['getUserInfo'] });
      const { token, user } = response;
      if (token && user) {
        setToken?.(token);
        setUser?.(user);
        storeUser?.(user);
      }

      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'There was an error updating the profile.',
        duration: 3000,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('gender', formData.gender);
    data.append('dob', formData.dob);
    data.append('phone', formData.phone);
    data.append('email', formData.email);
    data.append('address', formData.address);

    if (formData.image && typeof formData.image === 'object') {
      data.append('image', formData.image);
    }
    mutate(data);
  };

  return (
    <div>
      <div className='w-full overflow-hidden rounded-lg  '>
        <form onSubmit={handleSubmit} className='flex flex-col    w-full'>
          <div className='mb-4 flex flex-col items-center lg:mb-0'>
            <div className='mb-4 h-32 w-32 overflow-hidden rounded-full border border-gray-300'>
              {previewImage ? (
                <img className='h-full w-full object-cover' src={previewImage} alt='Profile Preview' />
              ) : (
                <div className='flex h-full w-full items-center justify-center bg-gray-200 text-gray-500'>
                  No image
                </div>
              )}
            </div>
            <label htmlFor='updateImage' className='cursor-pointer'>
              <div className='inline-flex items-center justify-center gap-2 rounded-md bg-neutral-500 px-4 py-2 text-sm text-white transition hover:bg-blue-400'>
                <MdOutlineFileUpload /> Update Image
              </div>
              <input id='updateImage' type='file' accept='image/*' onChange={handleImageChange} className='hidden' />
            </label>
            {fileError && <p className='mt-2 text-red-500'>{fileError}</p>}
          </div>
          <div className='flex flex-col'>
            <div className='col-span-2 row-span-3 mt-2 grid w-full items-center gap-1.5'>
              <Label htmlFor='name'>Name: </Label>
              <Input type='text' name='name' value={formData.name} onChange={handleChange} required />
            </div>

            <div className='col-span-2 row-span-3 mt-2 grid w-full items-center gap-1.5'>
              <Label htmlFor='dob'>Date Of Birth</Label>
              <Input type='date' name='dob' value={formData.dob} onChange={handleChange} required />
            </div>

            <div className='col-span-2 row-span-3 mt-2 grid w-full items-center gap-1.5'>
              <Label htmlFor='email'>Email:</Label>
              <Input type='email' name='email' value={formData.email} onChange={handleChange} required />
            </div>

            <div className='col-span-2 row-span-3 mt-2 grid w-full items-center gap-1.5'>
              <Label htmlFor='phone'>Phone No:</Label>
              <Input type='tel' name='phone' value={formData.phone} onChange={handleChange} required />
            </div>

            <div className='col-span-2 row-span-3 mt-2 grid w-full items-center gap-1.5'>
              <Label htmlFor='address'>Address:</Label>
              <Input id='address' name='address' placeholder='ex. 10' value={formData.address} onChange={handleChange} required />
            </div>

            <Button className='mt-4' type='submit'>
              Update Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
