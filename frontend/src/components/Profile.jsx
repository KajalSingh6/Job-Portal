import React, { useState } from 'react'
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import store from '@/redux/store';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const isResume = true;
  const { user } = useSelector(store => store.auth);

  return (
    <div className="px-2 sm:px-5 py-5">
      {/* Profile Info Card */}
      <div className='relative max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-5 sm:p-8'>
        {/* Edit Button */}
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className="absolute top-3 right-3 sm:top-5 sm:right-5"
        >
          <Pen />
        </Button>

        {/* Profile Info */}
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start'>
          <Avatar className="h-24 w-24 flex-shrink-0">
            <AvatarImage src={user?.profile?.profilePhoto || "https://th.bing.com/th/id/OIP.r0P3gp7nM5_9bdKYiULzMAHaHa?w=184&h=184&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"} alt="profile" />
          </Avatar>

          {/* Name + Bio */}
          <div className='text-center sm:text-left flex-1'>
            <h1 className='font-medium text-xl truncate'>{user?.fullName}</h1>
            <p className='text-sm sm:text-base mt-1'>{user?.profile?.bio || "No bio available"}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className='my-5 flex flex-col sm:flex-row sm:gap-10 gap-2 justify-center sm:justify-start'>
          <div className='flex gap-2 items-center'>
            <Mail />
            <span className='truncate'>{user?.email}</span>
          </div>
          <div className='flex gap-2 items-center'>
            <Contact />
            <span>{user?.phone || "NA"}</span>
          </div>
        </div>

        {/* Skills */}
        <div className='my-5'>
          <h1 className='font-semibold mb-2'>Skills</h1>
          <div className='flex flex-wrap gap-1 justify-center sm:justify-start'>
            {user?.profile?.skills?.length > 0 ? user.profile.skills.map((item, index) => <Badge key={index}>{item}</Badge>) : <span>NA</span>}
          </div>
        </div>

        {/* Resume */}
        <div className='grid w-full max-w-sm items-start gap-1.5 mx-auto sm:mx-0'>
          <Label className="text-md font-bold">Resume</Label>

          {user?.profile?.resume ? (
            <a
              href={user.profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline cursor-pointer truncate"
            >
              {user.profile.resumeOriginalName || "View Resume"}
            </a>
          ) : (
            <span>NA</span>
          )}
        </div>
      </div>

      {/* Applied Jobs Table */}
      <div className='max-w-4xl mx-auto bg-white rounded-2xl p-3 sm:p-5 overflow-x-auto'>
        <h1 className='text-lg font-bold mb-3'>Applied Jobs</h1>
        <AppliedJobTable />
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  )
}

export default Profile;
