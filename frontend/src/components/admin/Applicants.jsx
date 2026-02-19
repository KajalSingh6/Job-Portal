import React, { useEffect } from 'react';
import ApplicantsTable from './ApplicantsTable';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import store from '@/redux/store';

const Applicants = () => {

  const params = useParams();
  const dispatch = useDispatch();
  const { applicants } = useSelector(store => store.application);

  useEffect(() => {
    const fetchAllApplicants = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, {
          withCredentials: true
        });
        dispatch(setAllApplicants(res.data.job));

      } catch (error) {
        console.log(error);
      }
    }
    fetchAllApplicants();
  }, [params.id, dispatch]);
  return (
    <div>
      <div className='max-w-7xl mx-auto'>
        <h1>Applicants {applicants?.applications?.length || 0 }</h1>
        <ApplicantsTable />
      </div>
    </div>
  )
}

export default Applicants;
