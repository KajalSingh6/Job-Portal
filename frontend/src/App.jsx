import React from 'react'
import Navbar from './components/shared/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './components/auth/Signup';
import Home from './components/Home';
import Login from './components/auth/Login';
import Jobs from './components/Jobs';
import Browse from './components/Browse';
import Footer from './components/shared/Footer';
import Profile from './components/Profile';
import JobDescription from './components/JobDescription';
import Companies from './components/admin/Companies';
import CompanyCreate from './components/admin/CompanyCreate';
import CompanySetup from './components/admin/CompanySetup';
import AdminJobs from './components/admin/AdminJobs';
import PostJob from './components/admin/PostJob';
import Applicants from './components/admin/Applicants';
import ProtectedRoute from './components/admin/ProtectedRoute';


const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <BrowserRouter>
        <Navbar />

        <div className="flex-grow">
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/jobs' element={<Jobs />}></Route>
            <Route path='/description/:id' element={<JobDescription />}></Route>
            <Route path='/browse' element={<Browse />}></Route>
            <Route path='/profile' element={<Profile />}></Route>
            <Route path='/signup' element={<Signup />}></Route>
            <Route path='/login' element={<Login />}></Route>

            <Route path='/admin/companies' element={<ProtectedRoute><Companies /></ProtectedRoute>}></Route>
            <Route path='/admin/companies/create' element={<ProtectedRoute><CompanyCreate /></ProtectedRoute>}></Route>
            <Route path='/admin/companies/:id' element={<ProtectedRoute><CompanySetup /></ProtectedRoute>}></Route>
            <Route path='/admin/jobs' element={<ProtectedRoute><AdminJobs /></ProtectedRoute>}></Route>
            <Route path='/admin/jobs/create' element={<ProtectedRoute><PostJob /></ProtectedRoute>}></Route>
            <Route path='/admin/jobs/:id/applicants' element={<ProtectedRoute><Applicants /></ProtectedRoute>}></Route>
            <Route path='/admin/jobs/:id' element={<ProtectedRoute><PostJob /></ProtectedRoute>}></Route>

          </Routes>
        </div>

        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App;
