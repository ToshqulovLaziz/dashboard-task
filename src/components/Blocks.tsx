import { FiPlus } from "react-icons/fi";
import { useModalStore } from "../store/useModalStore";
import { useBlocksStore } from "../store/useBlocksStore";
import PieDiagram from "./PieDiagram";
import NetworkDiagram from "./NetworkDiagram";
import { useMemo, useState } from "react";

type BlockData =
  | {
      id: string;
      type: "pie";
      hasImage: boolean;
      data: PieDiagramDataWithImage;
    }
  | {
      id: string;
      type: "networkDiagram";
      hasImage: boolean;
      data: NetworkDiagramData;
    };

const Blocks = () => {
  const { openModal } = useModalStore();
  const { blocks } = useBlocksStore() as { blocks: BlockData[] };
  const [viewMode] = useState<"grid" | "list">("grid");

  // Calculate the optimal number of columns based on screen size
  const columnCount = useMemo(() => {
    if (typeof window === "undefined") return 3;

    const screenWidth = window.innerWidth;
    if (viewMode === "list") return 1;
    if (screenWidth < 640) return 1; // Mobile
    if (screenWidth < 1024) return 2; // Tablet
    return 3; // Desktop
  }, [viewMode]);

  const renderBlock = (block: BlockData) => {
    switch (block.type) {
      case "pie":
        return (
          <PieDiagram data={block.data} movable={true} blockId={block.id} />
        );
      case "networkDiagram":
        return (
          <NetworkDiagram data={block.data} movable={true} blockId={block.id} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 mx-auto px-2 sm:px-4 w-full max-w-[1800px]">
      {/* Header with title, view toggle and add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Add button */}
          <button
            onClick={openModal}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg transition-colors flex-1 sm:flex-none justify-center"
          >
            <FiPlus className="text-lg" />
            <span className="hidden sm:inline">Add New Block</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Blocks grid/list with responsive layout */}
      <div
        className={`gap-4 sm:gap-6 w-full ${
          viewMode === "grid" ? "grid" : "space-y-4"
        }`}
        style={{
          gridTemplateColumns:
            viewMode === "grid"
              ? `repeat(auto-fill, minmax(${
                  columnCount === 1
                    ? "100%"
                    : columnCount === 2
                    ? "calc(50% - 12px)"
                    : "calc(33.33% - 16px)"
                }, 1fr))`
              : undefined,
        }}
      >
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`block-item p-4 sm:p-6 rounded-xl relative ${
              viewMode === "list" ? "flex items-start gap-4" : ""
            }`}
          >
            {renderBlock(block)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blocks;
