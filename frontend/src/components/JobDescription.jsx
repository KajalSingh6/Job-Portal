import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';

const JobDescription = () => {
  const { singleJob } = useSelector(store => store.job);
  const { user } = useSelector(store => store.auth);

  const [isApplied, setIsApplied] = useState(false);

  const { id: jobId } = useParams();
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);
        dispatch(
          setSingleJob({
            ...singleJob,
            applications: [...singleJob.applications, user?._id],
          })
        );
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (app) =>
                app.applicant?._id === user?._id ||
                app.applicant === user?._id
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, user?._id, dispatch]);

  return (
    <div className="max-w-7xl mx-auto my-8 px-4">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-bold text-lg sm:text-xl">
            {singleJob?.title}
          </h1>

          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline" className="text-blue-700">
              {singleJob?.position} Positions
            </Badge>
            <Badge variant="outline" className="text-red-500">
              {singleJob?.jobType}
            </Badge>
            <Badge variant="outline" className="text-purple-600">
              {singleJob?.salary} LPA
            </Badge>
          </div>
        </div>

        {/* Apply Button */}
        <Button
          onClick={applyJobHandler}
          disabled={isApplied}
          className={`w-full lg:w-auto rounded-lg ${
            isApplied
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-800'
          }`}
        >
          {isApplied ? 'Already Applied' : 'Apply Now'}
        </Button>
      </div>

      {/* Description */}
      <h1 className="border-b-2 border-b-gray-300 font-medium py-4 mt-6">
        Job Description
      </h1>

      <div className="my-4 space-y-2 text-sm sm:text-base">
        <p><b>Role:</b> {singleJob?.title}</p>
        <p><b>Location:</b> {singleJob?.location}</p>
        <p><b>Description:</b> {singleJob?.description}</p>
        <p><b>Experience:</b> {singleJob?.experienceLevel} yrs</p>
        <p><b>Salary:</b> {singleJob?.salary} LPA</p>
        <p><b>Total Applicants:</b> {singleJob?.applications?.length}</p>
        <p>
          <b>Posted Date:</b>{' '}
          {singleJob?.createdAt
            ? new Date(singleJob.createdAt).toLocaleDateString()
            : 'N/A'}
        </p>
      </div>
    </div>
  );
};

export default JobDescription;
