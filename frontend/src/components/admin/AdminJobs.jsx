import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import AdminJobsTable from './AdminJobsTable';
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs';
import { useDispatch } from 'react-redux';
import { setSearchJobByText } from '@/redux/jobSlice';

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  return (
    <div className="max-w-6xl mx-auto my-8 px-4">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 my-5">
        
        {/* Search */}
        <Input
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Filter by name, role"
          className="w-full sm:w-72"
        />

        {/* Button */}
        <Button
          className="w-full sm:w-auto"
          onClick={() => navigate('/admin/jobs/create')}
        >
          New Jobs
        </Button>
      </div>

      {/* Table */}
      <AdminJobsTable />
    </div>
  );
};

export default AdminJobs;
