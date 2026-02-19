import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import CompaniesTable from './CompaniesTable';
import { useNavigate } from 'react-router-dom';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import { useDispatch } from 'react-redux';
import { setSearchCompanyByText } from '@/redux/companySlice';

const Companies = () => {
    useGetAllCompanies();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [input, setInput] = useState("");

    useEffect(() => {
        dispatch(setSearchCompanyByText(input));
    }, [input, dispatch]);

    return (
        <div className="max-w-6xl mx-auto my-8 px-4">
            
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 my-5">
                
                {/* Search */}
                <Input
                    className="w-full sm:w-64"
                    placeholder="Filter by name"
                    onChange={(e) => setInput(e.target.value)}
                />

                {/* Button */}
                <Button
                    className="w-full sm:w-auto"
                    onClick={() => navigate('/admin/companies/create')}
                >
                    New Company
                </Button>
            </div>

            {/* Table */}
            <CompaniesTable />
        </div>
    );
};

export default Companies;
