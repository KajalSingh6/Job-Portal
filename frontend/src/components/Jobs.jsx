import React, { useEffect, useState } from 'react';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector } from 'react-redux';
import store from '@/redux/store';
import { motion } from 'framer-motion';

const Jobs = () => {

    const { allJobs, searchQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState([]);


    useEffect(() => {
        if (!Array.isArray(allJobs)) {
            setFilterJobs([]);
            return;
        }

        let filtered = allJobs;

        if (searchQuery && typeof searchQuery === "object" && searchQuery.Location) {
            filtered = filtered.filter((job) =>
                job.location?.toLowerCase().includes(searchQuery.Location.toLowerCase())
            );
        }

        // Industry / Title
        if (searchQuery && typeof searchQuery === "object" && searchQuery.Industry) {
            filtered = filtered.filter((job) =>
                job.title?.toLowerCase().includes(searchQuery.Industry.toLowerCase())
            );
        }

        // Salary filter (proper range based)
        if (searchQuery && typeof searchQuery === "object" && searchQuery.Salary) {
            filtered = filtered.filter((job) => {
                const salary = Number(job.salary); // e.g. 12, 45

                if (searchQuery.Salary === "0-40K") {
                    return salary < 1; // below 1 LPA
                }

                if (searchQuery.Salary === "42-1lakh") {
                    return salary >= 1 && salary < 2; // around 1 LPA
                }

                if (searchQuery.Salary === "1lakh to 5lakh") {
                    return salary >= 1 && salary <= 5; // 1 to 5 LPA
                }

                // future option example: "10+ LPA"
                if (searchQuery.Salary === "10+ LPA") {
                    return salary >= 10;
                }

                return true;
            });
        }


        setFilterJobs(filtered);
    }, [allJobs, searchQuery]);


    return (
        <div className="px-4">
            <div className="max-w-7xl mx-auto mt-5">

                {/* Mobile: column | Desktop: row */}
                <div className="flex flex-col lg:flex-row gap-5">

                    {/* Filter section */}
                    <div className="w-full lg:w-[22%]">
                        <FilterCard />
                    </div>

                    {/* Jobs section */}
                    {filterJobs.length === 0 ? (
                        <span className="text-center text-gray-500 mt-10">
                            Job not found
                        </span>
                    ) : (
                        <div className="flex-1 lg:h-[80vh] lg:overflow-y-auto pb-5">

                            {/* Responsive grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filterJobs.map((job) => (
                                    <motion.div
                                        key={job?._id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Job job={job} />
                                    </motion.div>
                                ))}
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Jobs;
