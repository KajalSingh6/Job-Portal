const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4
        grid grid-cols-1
        sm:grid-cols-2
        md:grid-cols-4
        gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">JobHunt</h2>
          <p className="text-sm leading-relaxed">
            Find your dream job and connect with top companies across the world.
          </p>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">About Us</li>
            <li className="hover:text-white cursor-pointer">Careers</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
            <li className="hover:text-white cursor-pointer">Blog</li>
          </ul>
        </div>

        {/* Job Seekers */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Job Seekers</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Find Jobs</li>
            <li className="hover:text-white cursor-pointer">Upload Resume</li>
            <li className="hover:text-white cursor-pointer">Job Alerts</li>
            <li className="hover:text-white cursor-pointer">Resources</li>
          </ul>
        </div>

        {/* Recruiters */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Recruiters</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Post a Job</li>
            <li className="hover:text-white cursor-pointer">Search Resumes</li>
            <li className="hover:text-white cursor-pointer">Dashboard</li>
            <li className="hover:text-white cursor-pointer">Pricing</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-5 text-center text-xs sm:text-sm text-gray-400">
        © {new Date().getFullYear()} JobHunt — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
