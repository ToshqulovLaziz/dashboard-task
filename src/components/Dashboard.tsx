
import SideBar from "./SideBar";
import Blocks from "./Blocks";
import { FiMenu, FiX } from "react-icons/fi";
import { AiOutlineRocket } from "react-icons/ai";
import { useState } from "react";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#30313a] flex flex-col md:flex-row">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#171821]">
        <div className="flex items-center">
          <AiOutlineRocket className="text-2xl text-purple-500" />
          <span className="ml-2 text-xl font-semibold text-white">Dashboard</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-400 hover:text-white"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-64 bg-[#171821] md:h-screen sticky top-0 shadow-xl z-10`}>
        <SideBar onItemClick={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <Blocks />
      </div>
    </div>
  );
};

export default Dashboard;