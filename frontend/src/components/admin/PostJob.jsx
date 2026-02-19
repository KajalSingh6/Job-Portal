import React, { useEffect, useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';



const PostJob = () => {
  useGetAllCompanies();
  const { id } = useParams(); // edit ke time id milegi
  const navigate = useNavigate();
  const { companies } = useSelector(store => store.company);

  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experienceLevel: "",
    position: 0,
    companyId: ""
  });

  const [loading, setLoading] = useState(false);

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Edit mode me single job fetch
  const fetchSingleJob = async (jobId) => {
    try {
      const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        const job = res.data.job;
        setInput({
          title: job.title || "",
          description: job.description || "",
          requirements: Array.isArray(job.requirements) ? job.requirements.join(", ") : "",
          salary: job.salary || "",
          location: job.location || "",
          jobType: job.jobType || "",
          experienceLevel: job.experienceLevel || "",
          position: job.position || 0,
          companyId: job.company?._id || ""
        });
      }
    } catch (error) {
      console.log("Fetch single job error:", error);
      toast.error("Failed to load job data");
    }
  };

  useEffect(() => {
    if (id) {
      fetchSingleJob(id);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: input.title,
      description: input.description,
      requirements: input.requirements.split(',').map(r => r.trim()).filter(Boolean),
      salary: Number(input.salary),
      location: input.location,
      jobType: input.jobType,
      experienceLevel: Number(input.experienceLevel),
      position: Number(input.position),
    };

    if (input.companyId) {
      payload.company = input.companyId;
    }


    try {
      setLoading(true);

      const res = id
        ? await axios.put(`${JOB_API_END_POINT}/update/${id}`, payload, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        })
        : await axios.post(`${JOB_API_END_POINT}/post`, payload, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        });

      if (res.data.success) {
        toast.success(res.data.message || (id ? "Job updated" : "Job created"));
        navigate('/admin/jobs');
      }
    } catch (error) {
      console.log( error.message);
      toast.error(error.response?.data?.message || "Validation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4">
      <div className="flex justify-center my-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl p-6 sm:p-8 border rounded-lg shadow bg-white"
        >
          <h1 className="text-xl font-bold mb-6 text-center">
            {id ? "Edit Job" : "Post New Job"}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Title</Label>
              <Input name="title" value={input.title} onChange={changeHandler} />
            </div>

            <div>
              <Label>Description</Label>
              <Input name="description" value={input.description} onChange={changeHandler} />
            </div>

            <div>
              <Label>Requirements (comma separated)</Label>
              <Input name="requirements" value={input.requirements} onChange={changeHandler} />
            </div>

            <div>
              <Label>Salary</Label>
              <Input type="number" name="salary" value={input.salary} onChange={changeHandler} />
            </div>

            <div>
              <Label>Location</Label>
              <Input name="location" value={input.location} onChange={changeHandler} />
            </div>

            <div>
              <Label>Job Type</Label>
              <Input name="jobType" value={input.jobType} onChange={changeHandler} />
            </div>

            <div>
              <Label>Experience Level</Label>
              <Input type="number" name="experienceLevel" value={input.experienceLevel} onChange={changeHandler} />
            </div>

            <div>
              <Label>No. of Positions</Label>
              <Input type="number" min={1} name="position" value={input.position} onChange={changeHandler} />
            </div>

            {companies.length > 0 && (
              <div className="sm:col-span-2">
                <Label>Company</Label>
                <Select
                  value={input.companyId}
                  onValueChange={(value) => setInput({ ...input, companyId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map(company => (
                        <SelectItem key={company._id} value={company._id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="mt-6">
            {loading ? (
              <Button disabled className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                {id ? "Update Job" : "Post New Job"}
              </Button>
            )}
          </div>

          {companies.length === 0 && (
            <p className="text-xs text-red-600 font-bold text-center mt-4">
              Please register a company before posting a job
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
