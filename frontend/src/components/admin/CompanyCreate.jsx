import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setSingleCompany } from '@/redux/companySlice';

const CompanyCreate = () => {

    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState("");
    const dispatch = useDispatch();

    const registerNewCompany = async () => {
        try {
            const res = await axios.post(
                `${COMPANY_API_END_POINT}/register`,
                { companyName },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res.data.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
        }
    };

    return (
        <div className="px-4">
            <div className="max-w-4xl mx-auto my-10">
                
                {/* Heading */}
                <div className="mb-8">
                    <h1 className="text-xl sm:text-2xl font-bold">
                        Your Company Name
                    </h1>
                    <p className="text-gray-500 text-sm sm:text-base mt-1">
                        What would you like to give your company name? You can change this later.
                    </p>
                </div>

                {/* Input */}
                <div>
                    <Label>Company Name</Label>
                    <Input
                        type="text"
                        placeholder="JobHunt, Microsoft etc."
                        className="my-2 w-full"
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => navigate('/admin/companies')}
                    >
                        Cancel
                    </Button>

                    <Button
                        className="w-full sm:w-auto"
                        onClick={registerNewCompany}
                        disabled={!companyName.trim()}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CompanyCreate;
