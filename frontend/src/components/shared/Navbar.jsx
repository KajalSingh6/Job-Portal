import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { Button } from '../ui/button';
import { LogOut, Menu, User2, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import store from '@/redux/store';
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';

const Navbar = () => {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(`${USER_API_END_POINT}/logout`, {}, {
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setUser(null));
        setOpen(false);
        navigate('/login');
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <h1 className="text-2xl font-bold">
          Job<span className="text-[#f83002]">Portal</span>
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          <ul className="flex gap-6 font-medium">
            {user && user.role === 'recruiter' ? (
              <>
                <li><Link to="/admin/companies">Companies</Link></li>
                <li><Link to="/admin/jobs">Jobs</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/jobs">Jobs</Link></li>
                <li><Link to="/browse">Browse</Link></li>
              </>
            )}
          </ul>

          {!user ? (
            <div className="flex gap-2">
              <Link to="/login"><Button variant="outline">Login</Button></Link>
              <Link to="/signup"><Button className="bg-[#6A38C2]">Signup</Button></Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="w-10 h-10 cursor-pointer rounded-full overflow-hidden">
                  <AvatarImage src={user?.profile?.profilePhoto} />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4 bg-white rounded shadow">
                <div className="flex gap-3 mb-3">
                  <Avatar className="w-10 h-10 rounded-full overflow-hidden">
                    <AvatarImage src={user?.profile?.profilePhoto} />
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{user.fullName}</h4>
                    <p className="text-sm text-gray-500">{user?.profile?.bio}</p>
                  </div>
                </div>

                {user.role === 'student' && (
                  <Link to="/profile" className="flex items-center gap-2 text-sm mb-2">
                    <User2 size={18} /> View Profile
                  </Link>
                )}

                <button
                  onClick={logoutHandler}
                  className="flex items-center gap-2 text-sm text-red-600"
                >
                  <LogOut size={18} /> Logout
                </button>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white px-4 pb-4 space-y-3">
          <ul className="flex flex-col gap-3 font-medium">
            {user && user.role === 'recruiter' ? (
              <>
                <Link to="/admin/companies" onClick={() => setOpen(false)}>Companies</Link>
                <Link to="/admin/jobs" onClick={() => setOpen(false)}>Jobs</Link>
              </>
            ) : (
              <>
                <Link to="/" onClick={() => setOpen(false)}>Home</Link>
                <Link to="/jobs" onClick={() => setOpen(false)}>Jobs</Link>
                <Link to="/browse" onClick={() => setOpen(false)}>Browse</Link>
              </>
            )}
          </ul>

          {!user ? (
            <div className="flex gap-2">
              <Link to="/login"><Button variant="outline" className="w-full">Login</Button></Link>
              <Link to="/signup"><Button className="w-full bg-[#6A38C2]">Signup</Button></Link>
            </div>
          ) : (
            <Button onClick={logoutHandler} variant="outline" className="w-full">
              Logout
            </Button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
