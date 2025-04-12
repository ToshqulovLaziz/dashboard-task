import SideBar from "./SideBar";
import Blocks from "./Blocks";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#30313a] flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#171821] h-screen sticky top-0 shadow-xl">
        <SideBar />
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        <Blocks />
      </div>
    </div>
  );
};

export default Dashboard;
