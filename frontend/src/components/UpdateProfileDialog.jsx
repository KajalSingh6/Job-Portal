import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import store from '@/redux/store';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const UpdateProfileDialog = ({ open, setOpen }) => {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
    file: user?.profile?.resume || null
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("phone", input.phone);
    formData.append("bio", input.bio);
    formData.append("skills", JSON.stringify(input.skills.split(",").map(s => s.trim())));
    if (input.file) formData.append("file", input.file);

    try {
      setLoading(true);
      const res = await axios.put(`${USER_API_END_POINT}/profile/update`, formData, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }

    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>
            Update your personal information and resume here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submitHandler}>
          <div className="grid gap-4 py-4">

            {/* Name */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label className="sm:text-right" htmlFor="name">Name</Label>
              <Input type="text" id="name" name="fullName" value={input.fullName} onChange={changeEventHandler} className="col-span-1 sm:col-span-3" />
            </div>

            {/* Email */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label className="sm:text-right" htmlFor="email">Email</Label>
              <Input type="email" id="email" name="email" value={input.email} onChange={changeEventHandler} className="col-span-1 sm:col-span-3" />
            </div>

            {/* Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label className="sm:text-right" htmlFor="phone">Phone</Label>
              <Input type="text" id="phone" name="phone" value={input.phone} onChange={changeEventHandler} className="col-span-1 sm:col-span-3" />
            </div>

            {/* Bio */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
              <Label className="sm:text-right mt-2 sm:mt-0" htmlFor="bio">Bio</Label>
              <Input type="text" id="bio" name="bio" value={input.bio} onChange={changeEventHandler} className="col-span-1 sm:col-span-3" />
            </div>

            {/* Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
              <Label className="sm:text-right mt-2 sm:mt-0" htmlFor="skills">Skills</Label>
              <Input type="text" id="skills" name="skills" value={input.skills} onChange={changeEventHandler} placeholder="HTML, CSS, JS" className="col-span-1 sm:col-span-3" />
            </div>

            {/* Resume */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label className="sm:text-right" htmlFor="file">Resume</Label>
              <Input type="file" accept="application/pdf" id="file" name="file" onChange={changeFileHandler} className="col-span-1 sm:col-span-3" />
            </div>

          </div>

          <DialogFooter>
            {loading
              ? <Button className="w-full my-4"><Loader2 className='mr-2 h-4 w-4 animate-spin' />Please wait</Button>
              : <Button type="submit" className="w-full my-4 cursor-pointer">Update</Button>
            }
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
