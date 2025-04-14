import { 
  FiHome, 
  FiPieChart, 
  FiSettings, 
  FiUsers, 
  FiFileText, 
  FiLogOut,
  FiChevronDown,
  FiChevronRight
} from 'react-icons/fi';
import { AiOutlineRocket } from 'react-icons/ai';
import { BsLightningCharge } from 'react-icons/bs';
import { useState } from 'react';

type SidebarItemProps = {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  hasSubmenu?: boolean;
  onItemClick?: () => void;
};

const SideBar = ({ onItemClick }: { onItemClick?: () => void }) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const userName = sessionStorage.getItem('userDashName') || '';
  
  const toggleSubmenu = (text: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [text]: !prev[text]
    }));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Logo/Sidebar Header - hidden on mobile since we have mobile header */}
      <div className="p-6 items-center justify-center hidden md:flex">
        <AiOutlineRocket className="text-2xl text-purple-500" />
        <span className="ml-2 text-xl font-semibold text-white">Dashboard</span>
      </div>

      <div className="px-6 pb-4 pt-2 text-white">
          Welcome, <span className="text-purple-400 font-medium">{userName}</span>
        </div>
      
      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 px-2 md:px-4">
        <SidebarItem icon={<FiHome />} text="Home" onItemClick={onItemClick} />
        <SidebarItem 
          icon={<FiPieChart />} 
          text="Analytics" 
          active
        />
        <SidebarItem icon={<BsLightningCharge />} text="Activity" onItemClick={onItemClick} />
        <SidebarItem 
          icon={<FiUsers />} 
          text="Team" 
          hasSubmenu
          onItemClick={() => {
            onItemClick?.();
            toggleSubmenu('Team');
          }}
        />
        {expandedItems['Team'] && (
          <div className="ml-8 space-y-1 mt-1">
            <SidebarItem icon={<FiUsers />} text="Members" onItemClick={onItemClick} />
            <SidebarItem icon={<FiFileText />} text="Roles" onItemClick={onItemClick} />
          </div>
        )}
        <SidebarItem icon={<FiFileText />} text="Reports" onItemClick={onItemClick} />
        <SidebarItem icon={<FiSettings />} text="Settings" onItemClick={onItemClick} />
      </nav>
      
      {/* Bottom Logout */}
      <div className="p-4 border-t border-gray-700">
        <SidebarItem icon={<FiLogOut />} text="Logout" onItemClick={onItemClick} />
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, active = false, hasSubmenu = false, onItemClick }: SidebarItemProps) => {
  return (
    <div 
      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
        active ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
      onClick={onItemClick}
    >
      <div className="flex items-center">
        <span className="text-lg">{icon}</span>
        <span className="ml-3 font-medium">{text}</span>
      </div>
      {hasSubmenu && (
        <span className="text-sm">
          {active ? <FiChevronDown /> : <FiChevronRight />}
        </span>
      )}
    </div>
  );
};

export default SideBar;