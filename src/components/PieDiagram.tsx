import React, { useState, useRef, useEffect } from "react";
import { Card, Image, Popconfirm, Tooltip } from "antd";
import { FaArrowsAlt, FaExpandArrowsAlt, FaTrash } from "react-icons/fa";
import { FiPieChart } from "react-icons/fi";
import { useBlocksStore } from "../store/useBlocksStore";
import { motion } from "framer-motion";

interface PieDataItem {
  name: string;
  value: number;
  color?: string;
}


const DEFAULT_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#6366F1",
  "#D946EF",
];

const PieDiagram: React.FC<PieDiagramProps> = ({
  data,
  movable = false,
  blockId,
}) => {
  const [chartData, setChartData] = useState<PieDataItem[]>([]);
  const [transform, setTransform] = useState({
    x: 0,
    y: 0,
    width: 320,
    height: 320,
    rotate: 0,
    scale: 1,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const startTransform = useRef({ ...transform });
  const startPos = useRef({ x: 0, y: 0 });
  const { removeBlock } = useBlocksStore();

  // Initialize chart data
  useEffect(() => {
    const colors = data.colors || DEFAULT_COLORS;
    const newChartData = data.labels.map((label, index) => ({
      name: label,
      value: data.data[index],
      color: colors[index % colors.length],
    }));
    setChartData(newChartData);
  }, [data]);

  // Calculate total value for percentage calculations
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  // Mouse event handlers for movable functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!movable) return;

    const target = e.target as HTMLElement;
    const isControl = target.closest(".control-handle");

    if (
      !isControl &&
      (target === containerRef.current || target.closest(".ant-card"))
    ) {
      setIsDragging(true);
      startPos.current = { x: e.clientX, y: e.clientY };
      startTransform.current = { ...transform };
      if (e) {
        e.stopPropagation();
      }
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;

      setTransform({
        ...transform,
        x: startTransform.current.x + dx,
        y: startTransform.current.y + dy,
      });
    } else if (isResizing) {
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;

      // Proportional scaling based on mouse movement
      const newWidth = Math.max(
        200,
        Math.min(800, startTransform.current.width + dx)
      );
      const newHeight = Math.max(
        200,
        Math.min(800, startTransform.current.height + dy)
      );

      setTransform({
        ...transform,
        width: newWidth,
        height: newHeight,
      });
    } else if (isRotating) {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle =
          Math.atan2(e.clientY - centerY, e.clientX - centerX) *
            (180 / Math.PI) +
          90;

        setTransform({
          ...transform,
          rotate: angle,
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
  };

  // Add event listeners for movement
  useEffect(() => {
    if (isDragging || isResizing || isRotating) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, isRotating]);

  // Render the pie chart segments with animations
  const renderPieSegments = () => {
    let startAngle = 0;
    const viewBoxSize = Math.min(transform.width, transform.height);
    const centerX = viewBoxSize / 2;
    const centerY = viewBoxSize / 2;
    const radius = Math.min(centerX, centerY) * 0.9;
    const innerRadius = radius * 0.6; // For donut chart effect

    return chartData.map((item, index) => {
      const angle = (item.value / totalValue) * 360;
      const endAngle = startAngle + angle;

      // Calculate path for pie segment
      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);

      const outerX1 = centerX + radius * Math.cos(startRad);
      const outerY1 = centerY + radius * Math.sin(startRad);
      const outerX2 = centerX + radius * Math.cos(endRad);
      const outerY2 = centerY + radius * Math.sin(endRad);

      const innerX1 = centerX + innerRadius * Math.cos(startRad);
      const innerY1 = centerY + innerRadius * Math.sin(startRad);
      const innerX2 = centerX + innerRadius * Math.cos(endRad);
      const innerY2 = centerY + innerRadius * Math.sin(endRad);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${outerX1} ${outerY1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${outerX2} ${outerY2}`,
        `L ${innerX2} ${innerY2}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerX1} ${innerY1}`,
        "Z",
      ].join(" ");

      startAngle = endAngle;

      return (
        <motion.path
          key={`segment-${index}`}
          d={pathData}
          fill={item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
          stroke="#fff"
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{
            strokeWidth: 4,
            filter: "drop-shadow(0 0 8px rgba(0,0,0,0.3))",
            transition: { duration: 0.2 },
          }}
        />
      );
    });
  };

  // Render labels with animations
  const renderLabels = () => {
    let startAngle = 0;
    const viewBoxSize = Math.min(transform.width, transform.height);
    const centerX = viewBoxSize / 2;
    const centerY = viewBoxSize / 2;
    const radius = Math.min(centerX, centerY) * 0.9;
    const labelRadius = radius * 0.75;

    return chartData.map((item, index) => {
      const angle = (item.value / totalValue) * 360;
      const midAngle = startAngle + angle / 2;
      startAngle += angle;

      const rad = (midAngle - 90) * (Math.PI / 180);
      const x = centerX + labelRadius * Math.cos(rad);
      const y = centerY + labelRadius * Math.sin(rad);

      const percent = (item.value / totalValue) * 100;
      const labelText = `${percent.toFixed(1)}%`;

      // Dynamic font size based on viewBox size
      const fontSize = Math.max(10, viewBoxSize * 0.045);

      return (
        <motion.text
          key={`label-${index}`}
          x={x}
          y={y}
          fill="#fff"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={fontSize}
          fontWeight="bold"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
        >
          {labelText}
        </motion.text>
      );
    });
  };

  // Render legend
  const renderLegend = () => {
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {chartData.map((item, index) => (
          <motion.div
            key={`legend-${index}`}
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{
                backgroundColor:
                  item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
              }}
            />
            <span className="text-sm font-medium text-gray-700">
              {item.name}
            </span>
          </motion.div>
        ))}
      </div>
    );
  };

  const handleRemove = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (blockId) {
      removeBlock(blockId);
    }
  };

  return (
    <motion.div
      style={{
        position: movable ? "absolute" : "relative",
        left: `${transform.x}px`,
        top: `${transform.y}px`,
        width: movable ? `${transform.width}px` : "100%", // Harakatlanmaydigan holatda 100%
        height: movable ? `${transform.height}px` : "auto", // Harakatlanmaydigan holatda auto
        transform: `rotate(${transform.rotate}deg) scale(${transform.scale})`,
        transformOrigin: "center center",
        cursor: isDragging ? "grabbing" : movable ? "grab" : "default",
        userSelect: "none",
        touchAction: "none",
        zIndex: isDragging || isResizing || isRotating ? 100 : "auto",
      }}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        boxShadow: movable
          ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          : "none",
      }}
    >
      <Card
        title={
          <div className="flex items-center">
            <FiPieChart className="mr-2 text-blue-500" />
            <span className="font-semibold text-gray-800">
              {"Pie Diagram"}
            </span>
          </div>
        }
        className="h-full shadow-sm hover:shadow-md transition-shadow duration-300"
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
        }}
        headStyle={{
          borderBottom: "1px solid #f3f4f6",
          padding: "12px 16px",
        }}
        bodyStyle={{
          padding: data.image ? "16px" : "24px",
          height: "calc(100% - 57px)",
        }}
      >
        <div className="flex flex-col md:flex-row gap-4 h-full">
          {data.image && (
            <div className="w-full md:w-1/3 flex justify-center items-center p-2 bg-gray-50 rounded-lg">
              <Image
                src={data.image}
                alt="Chart reference"
                className="rounded-lg object-contain"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>
          )}

          <div
            className={`${
              data.image ? "w-full md:w-2/3" : "w-full"
            } h-full flex flex-col items-center justify-center`}
          >
            <svg
              ref={svgRef}
              width="100%"
              height={data.image ? "80%" : "90%"}
              viewBox={`0 0 ${Math.min(
                transform.width,
                transform.height
              )} ${Math.min(transform.width, transform.height)}`}
              preserveAspectRatio="xMidYMid meet"
            >
              {renderPieSegments()}
              {renderLabels()}
            </svg>
            {renderLegend()}
          </div>
        </div>

        {movable && (
          <div
            className={`absolute bottom-0 right-0 flex gap-2 transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-20 hover:opacity-100"
            }`}
          >
            {/* Move handle */}
            <Tooltip title="Drag to move" placement="left">
              <motion.div
                className="control-handle cursor-move p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setIsDragging(true);
                  startPos.current = { x: e.clientX, y: e.clientY };
                  startTransform.current = { ...transform };
                }}
              >
                <FaArrowsAlt className="text-gray-600 text-sm" />
              </motion.div>
            </Tooltip>

            {/* Resize handle */}
            <Tooltip title="Resize" placement="left">
              <motion.div
                className="control-handle cursor-nwse-resize p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setIsResizing(true);
                  startPos.current = { x: e.clientX, y: e.clientY };
                  startTransform.current = { ...transform };
                }}
              >
                <FaExpandArrowsAlt className="text-gray-600 text-sm" />
              </motion.div>
            </Tooltip>

            {/* Delete button */}
            <Tooltip title="Delete" placement="left">
              <Popconfirm
                title="Are you sure to delete this chart?"
                onConfirm={handleRemove}
                okText="Yes"
                cancelText="No"
              >
                <motion.div
                  className="control-handle cursor-pointer p-2 rounded-full bg-white shadow-md hover:bg-red-50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaTrash className="text-red-500 text-sm" />
                </motion.div>
              </Popconfirm>
            </Tooltip>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default PieDiagram;
