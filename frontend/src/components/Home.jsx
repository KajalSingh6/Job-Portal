import React, { useEffect } from 'react';
import HeroSection from './HeroSection';
import CategoryCarousel from './CategoryCarousel';
import LatestJobs from './LatestJobs';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { useSelector } from 'react-redux';
import store from '@/redux/store';
import { useNavigate } from 'react-router-dom';


const Home = () => {

  useGetAllJobs();
  const navigate = useNavigate();

  const { user } = useSelector(store => store.auth);

  // safe redirect
  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, [user, navigate]);

  return (
    <div className="w-full">
      
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8">
        <HeroSection />
      </section>

      {/* Categories */}
      <section className="mt-8 px-4 sm:px-6 lg:px-8">
        <CategoryCarousel />
      </section>

      {/* Latest Jobs */}
      <section className="mt-10 px-4 sm:px-6 lg:px-8">
        <LatestJobs />
      </section>

    </div>
  );
};

export default Home;
