import { ArrowLeft, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div>
      <nav className="bg-white fixed w-full z-20 top-0 start-0 border-gray-200">
        <div className="max-w-screen-xl flex justify-between items-center mx-auto px-1  pr-4 pt-3">
          <button className="p-2 rounded-full hover:bg-gray-200 focus:outline-none">
            <ArrowLeft size={24} onClick={()=>{navigate(-1)}}/>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200 focus:outline-none">
            <Bell size={24} />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;