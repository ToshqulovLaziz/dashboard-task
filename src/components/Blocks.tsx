import { FiPlus } from "react-icons/fi";
import { useModalStore } from "../store/useModalStore";

const Blocks = () => {
  const { openModal } = useModalStore();
  return (
    <div className="space-y-6">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <button onClick={openModal} className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
          <FiPlus className="text-lg" />
          <span>Add New Block</span>
        </button>
      </div>
    </div>
  );
};

export default Blocks;
