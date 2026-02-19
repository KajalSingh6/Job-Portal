import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup } from '../ui/radio-group';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { USER_API_END_POINT } from '@/utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import store from '@/redux/store';
import { Loader2 } from 'lucide-react';


const Login = () => {

    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });

    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onChangeHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));

            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate('/');
                toast.success(res.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);

        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(()=>{
        if (user) {
            navigate("/");
        }
    },[user, navigate]);

   return (
  <div className="flex items-center justify-center px-4 max-w-7xl mx-auto">
    <form
      onSubmit={onSubmitHandler}
      className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 my-10 border border-gray-200 rounded-md p-4 sm:p-6"
    >
      <h1 className="text-center font-bold text-xl mb-5">Login</h1>

      <div className="mb-4">
        <Label>Email</Label>
        <Input
          type="email"
          name="email"
          value={input.email}
          onChange={onChangeHandler}
          placeholder="Enter your email..."
          required
        />
      </div>

      <div className="mb-4">
        <Label>Password</Label>
        <Input
          type="password"
          name="password"
          value={input.password}
          onChange={onChangeHandler}
          placeholder="Enter your password..."
          required
        />
      </div>

      {/* Role */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 my-5">
        <RadioGroup className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              name="role"
              value="student"
              checked={input.role === "student"}
              onChange={onChangeHandler}
            className="cursor-pointer shadow-none focus:ring-0 focus:ring-offset-0 focus:outline-none border-none scale-130"

            />
            <Label>Student</Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="radio"
              name="role"
              value="recruiter"
              checked={input.role === "recruiter"}
              onChange={onChangeHandler}
            className="cursor-pointer shadow-none focus:ring-0 focus:ring-offset-0 focus:outline-none border-none scale-130"

            />
            <Label>Recruiter</Label>
          </div>
        </RadioGroup>
      </div>

      {loading ? (
        <Button className="w-full my-4">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </Button>
      ) : (
        <Button type="submit" className="mt-4 w-full my-4 cursor-pointer">
          Login
        </Button>
      )}

      <p className="text-center sm:text-left">
        I don't have any account?{" "}
        <Link to="/signup" className="text-blue-600">
          Signup
        </Link>
      </p>
    </form>
  </div>
);
}

export default Login;
