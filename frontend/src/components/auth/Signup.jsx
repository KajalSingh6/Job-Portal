import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import store from "@/redux/store";
import { setLoading } from "@/redux/authSlice";

const Signup = () => {
  const [input, setInput] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    file: "",
  });

  const { loading, user } = useSelector(store => store.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onChangeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const onFileChange = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.role) {
      toast.error("Please select role (Student or Recruiter)");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("phone", input.phone);
    formData.append("password", input.password);
    formData.append("role", input.role);

    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));

      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center px-4 max-w-7xl mx-auto">
      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 my-10 border border-gray-200 rounded-md p-4 sm:p-6"
      >
        <h1 className="text-center font-bold text-xl mb-5">Signup</h1>

        <div className="mb-3">
          <Label>Full Name</Label>
          <Input
            name="fullName"
            placeholder="Enter name..."
            value={input.fullName}
            onChange={onChangeHandler}
            required
          />
        </div>

        <div className="mb-3">
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            placeholder="Enter email..."
            value={input.email}
            onChange={onChangeHandler}
            required
          />
        </div>

        <div className="mb-3">
          <Label>Phone</Label>
          <Input
            type="number"
            name="phone"
            placeholder="Enter phone..."
            value={input.phone}
            onChange={onChangeHandler}
            required
          />
        </div>

        <div className="mb-3">
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Enter password..."
            value={input.password}
            onChange={onChangeHandler}
            required
          />
        </div>

        {/* Role + Profile */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 my-4">
          <RadioGroup className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Input
                type="radio"
                name="role"
                value="student"
                checked={input.role === "student"}
                onChange={onChangeHandler}
                className="cursor-pointer shadow-none focus:ring-0 focus:ring-offset-0 focus:outline-none border-none scale-130"

              />
              <Label>Student</Label>
            </div>

            <div className="flex items-center gap-2">
              <Input
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

          <div className="flex items-center gap-2">
            <Label>Profile</Label>
            <Input type="file" accept="image/*" onChange={onFileChange} />
          </div>
        </div>

        {loading ? (
          <Button className="w-full my-4">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit" className="w-full mt-4">
            Signup
          </Button>
        )}

        <p className="mt-3 text-center sm:text-left">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );

};

export default Signup;
