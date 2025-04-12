import { FiHome, FiPieChart, FiSettings, FiUsers, FiFileText, FiLogOut } from 'react-icons/fi';
import { AiOutlineRocket } from 'react-icons/ai';
import { BsLightningCharge } from 'react-icons/bs';

const SideBar = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Logo/Sidebar Header */}
      <div className="p-6 mb-8 flex items-center justify-center">
        <AiOutlineRocket className="text-2xl text-purple-500" />
        <span className="ml-2 text-xl font-semibold text-white hidden lg:inline">Dashboard</span>
      </div>
      
      {/* Navigation Items */}
      <nav className="flex-1 space-y-2 px-4">
        <SidebarItem icon={<FiHome />} text="Home" />
        <SidebarItem icon={<FiPieChart />} text="Analytics" active/>
        <SidebarItem icon={<BsLightningCharge />} text="Activity" />
        <SidebarItem icon={<FiUsers />} text="Team" />
        <SidebarItem icon={<FiFileText />} text="Reports" />
        <SidebarItem icon={<FiSettings />} text="Settings" />
      </nav>
      
      {/* Bottom Logout */}
      <div className="p-4 border-t border-gray-700">
        <SidebarItem icon={<FiLogOut />} text="Logout" />
      </div>
    </div>
  );
};

// Reusable sidebar item component
interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}

const SidebarItem = ({ icon, text, active = false }: SidebarItemProps) => {
  return (
    <div className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
      <span className="text-lg">{icon}</span>
      <span className="ml-3 font-medium">{text}</span>
    </div>
  );
};

export default SideBar;