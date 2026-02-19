import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import store from '@/redux/store';
import useGetCompanyById from '@/hooks/useGetCompanyById';

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null
  });

  const { singleCompany } = useSelector(store => store.company);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(input).forEach(key => {
      if (input[key]) formData.append(key, input[key]);
    });

    try {
      setLoading(true);
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setInput({
      name: singleCompany?.name || "",
      description: singleCompany?.description || "",
      website: singleCompany?.website || "",
      location: singleCompany?.location || "",
      file: null
    });
  }, [singleCompany]);

  return (
    <div className="px-4">
      <div className="max-w-2xl mx-auto my-10 bg-white p-6 rounded-lg shadow">
        <form onSubmit={submitHandler}>
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <Button
              type="button"
              onClick={() => navigate('/admin/companies')}
              variant="outline"
              className="flex items-center gap-2 w-fit"
            >
              <ArrowLeft size={18} />
              Back
            </Button>
            <h1 className="font-bold text-xl">Company Setup</h1>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Company Name</Label>
              <Input name="name" value={input.name} onChange={changeHandler} />
            </div>

            <div>
              <Label>Description</Label>
              <Input name="description" value={input.description} onChange={changeHandler} />
            </div>

            <div>
              <Label>Website</Label>
              <Input name="website" value={input.website} onChange={changeHandler} />
            </div>

            <div>
              <Label>Location</Label>
              <Input name="location" value={input.location} onChange={changeHandler} />
            </div>

            <div className="sm:col-span-2">
              <Label>Company Logo</Label>
              <Input type="file" accept="image/*" onChange={changeFileHandler} />
            </div>
          </div>

          {/* Button */}
          <div className="mt-6">
            {loading ? (
              <Button disabled className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                Update Company
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;
