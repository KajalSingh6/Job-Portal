import React from 'react';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';


const LatestJobCards = ({job}) => {

const navigate = useNavigate();

  return (
    <div onClick={()=> navigate(`/description/${job._id}`)}  className='p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer'>
      <div>
        <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
        <p className='text-sm text-gray-500'>India</p>
      </div>
      <div>
        <h1 className='font-bold text-lg my-2'>{job.title}</h1>
        <p className='text-gray-600 text-sm'>{job.description}</p>
      </div>
      <div className='flex items-center gap-2 mt-4'>
        <Badge variant="ghost" className={"font-bold text-blue-700"}>{job.position} Positions</Badge>
        <Badge variant="ghost" className={"font-bold text-red-500"}>{job.jobType}</Badge>
        <Badge variant="ghost" className={"font-bold text-purple-700"}>{job.salary}LPA</Badge>
      </div>
    </div>
  )
}

export default LatestJobCards;
