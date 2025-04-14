import React, { useState, useRef, useEffect } from "react";
import { Card, Popconfirm, Tooltip, Typography } from "antd";
import {
  FaArrowsAlt,
  FaExpandArrowsAlt,
  FaTrash,
  FaProjectDiagram,
} from "react-icons/fa";
import { useBlocksStore } from "../store/useBlocksStore";
import { motion, useAnimation } from "framer-motion";

const { Text } = Typography;

const DEFAULT_NODE_COLORS = [
  "#6366F1", // Indigo
  "#EC4899", // Pink
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#3B82F6", // Blue
];

const NetworkDiagram: React.FC<NetworkDiagramProps> = ({
  data,
  movable = false,
  blockId,
}) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [transform, setTransform] = useState({
    x: 0,
    y: 0,
    width: 300,
    height: 300,
    rotate: 0,
    scale: 1,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const startTransform = useRef({ ...transform });
  const startPos = useRef({ x: 0, y: 0 });
  const controls = useAnimation();
  const { removeBlock } = useBlocksStore();

  // Initialize nodes with positions and styles
  useEffect(() => {
    const centerX = transform.width / 2;
    const centerY = transform.height / 2;
    const radius = Math.min(transform.width, transform.height) * 0.35;

    const newNodes = data.nodes.map((node, index) => {
      const angle = (index * (2 * Math.PI)) / data.nodes.length;
      return {
        ...node,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        size: node.size || 50,
        color:
          node.color || DEFAULT_NODE_COLORS[index % DEFAULT_NODE_COLORS.length],
      };
    });

    const newEdges = data.edges.map((edge) => ({
      ...edge,
      weight: edge.weight || 1,
      color: edge.color || "rgba(107, 114, 128, 0.4)",
    }));

    setNodes(newNodes);
    setEdges(newEdges);

    // Animation sequence
    controls.start("visible");
  }, [data, transform.width, transform.height]);

  // Mouse event handlers
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
      e.stopPropagation();
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

      const newWidth = Math.max(
        300,
        Math.min(1000, startTransform.current.width + dx * 2)
      );
      const newHeight = Math.max(
        300,
        Math.min(1000, startTransform.current.height + dy * 2)
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

  // Add event listeners
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

  // Render nodes with modern design
  const renderNodes = () => {
    return nodes.map((node, index) => {
      const isHovered = hoveredNode === node.id;
      const glowEffect = isHovered
        ? `drop-shadow(0 0 12px ${node.color}66)`
        : "none";
      const scale = isHovered ? 1.1 : 1;

      return (
        <motion.g
          key={`node-${node.id}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={controls}
          variants={{
            visible: {
              opacity: 1,
              scale: 1,
              transition: {
                delay: index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 15,
              },
            },
          }}
          whileHover={{ scale: 1.1 }}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
        >
          {/* Glow effect */}
          <circle
            cx={node.x}
            cy={node.y}
            r={node.size! * 1.2}
            fill={node.color}
            opacity={isHovered ? 0.2 : 0}
            style={{ transition: "opacity 0.3s ease" }}
          />

          {/* Main node with subtle gradient */}
          <defs>
            <radialGradient
              id={`node-gradient-${node.id}`}
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <stop offset="0%" stopColor={node.color} />
              <stop offset="100%" stopColor={`${node.color}cc`} />
            </radialGradient>
          </defs>

          <motion.circle
            cx={node.x}
            cy={node.y}
            r={node.size}
            fill={`url(#node-gradient-${node.id})`}
            stroke="#fff"
            strokeWidth="3"
            style={{ filter: glowEffect }}
            animate={{ scale }}
            transition={{ type: "spring", stiffness: 500 }}
          />

          {/* Node icon */}
          <text
            x={node.x}
            y={node.y}
            fill="#fff"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={node.size! * 0.4}
            fontWeight="bold"
            style={{ pointerEvents: "none" }}
          >
            {node.label
              .split(" ")
              .map((word) => word[0])
              .join("")}
          </text>

          {/* Node label with subtle shadow */}
          <motion.text
            x={node.x}
            y={node.y! + node.size! + 20}
            textAnchor="middle"
            fontSize={14}
            fontWeight="600"
            fill="#374151"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.05 }}
            style={{
              filter: "drop-shadow(0 1px 1px rgba(255,255,255,0.7))",
            }}
          >
            {node.label}
          </motion.text>
        </motion.g>
      );
    });
  };

  // Render edges with modern design
  const renderEdges = () => {
    return edges.map((edge, index) => {
      const fromNode = nodes.find((n) => n.id === edge.from);
      const toNode = nodes.find((n) => n.id === edge.to);

      if (
        !fromNode ||
        !toNode ||
        !fromNode.x ||
        !fromNode.y ||
        !toNode.x ||
        !toNode.y
      ) {
        return null;
      }

      // Calculate edge path with slight curve
      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;
      const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
      const curveOffset = 30;
      const ctrlX = midX + curveOffset * Math.cos(angle + Math.PI / 2);
      const ctrlY = midY + curveOffset * Math.sin(angle + Math.PI / 2);

      const pathData = `M ${fromNode.x} ${fromNode.y} Q ${ctrlX} ${ctrlY} ${toNode.x} ${toNode.y}`;

      const isHovered = hoveredNode === edge.from || hoveredNode === edge.to;
      const strokeWidth = isHovered ? 3 * edge.weight! : 2 * edge.weight!;
      const opacity = isHovered ? 1 : 0.7;

      return (
        <motion.path
          key={`edge-${index}`}
          d={pathData}
          fill="none"
          stroke={edge.color}
          strokeWidth={strokeWidth}
          strokeDasharray="0"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity,
            transition: {
              duration: 0.8,
              delay: index * 0.05,
              type: "spring",
              stiffness: 100,
            },
          }}
          style={{
            strokeLinecap: "round",
            transition: "stroke-width 0.3s ease, opacity 0.3s ease",
          }}
        />
      );
    });
  };

  const handleRemove = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (blockId) {
      removeBlock(blockId);
    }
  };

  // Responsive design adjustments
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && !movable) {
        const containerWidth = containerRef.current.clientWidth;
        const newSize = Math.min(600, containerWidth * 0.9);
        setTransform((prev) => ({
          ...prev,
          width: newSize,
          height: newSize,
        }));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [movable]);

  return (
    <motion.div
      style={{
        position: movable ? "absolute" : "relative",
        left: movable ? `${transform.x}px` : "auto",
        top: movable ? `${transform.y}px` : "auto",
        width: movable ? `${transform.width}px` : "100%",
        height: movable ? `${transform.height}px` : "auto",
        transform: `rotate(${transform.rotate}deg) scale(${transform.scale})`,
        transformOrigin: "center center",
        cursor: isDragging ? "grabbing" : movable ? "grab" : "default",
        userSelect: "none",
        touchAction: "none",
        zIndex: isDragging || isResizing || isRotating ? 100 : "auto",
        margin: movable ? "0" : "0 auto",
      }}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, type: "spring" }}
      whileHover={{
        boxShadow: movable
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          : "none",
      }}
    >
      <Card
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaProjectDiagram className="text-indigo-500" />
              <Text strong className="text-gray-700 dark:text-gray-200">
                Network Diagram
              </Text>
            </div>
          </div>
        }
        className="h-full shadow-sm hover:shadow-md transition-shadow duration-300 dark:bg-gray-800"
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          background: "linear-gradient(to bottom right, #f9fafb, #f3f4f6)",
        }}
      >
        <div className="flex flex-col md:flex-row gap-4 h-full">
          <div className={`h-full flex items-center justify-center relative`}>
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              viewBox={`0 0 ${transform.width} ${transform.height}`}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              {renderEdges()}
              {renderNodes()}
            </svg>
          </div>
        </div>

        {movable && (
          <div
            className={`absolute bottom-4 right-4 flex gap-2 transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-20 hover:opacity-100"
            }`}
          >
            {/* Move handle */}
            <Tooltip title="Drag to move" placement="left">
              <motion.div
                className="control-handle cursor-move p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setIsDragging(true);
                  startPos.current = { x: e.clientX, y: e.clientY };
                  startTransform.current = { ...transform };
                }}
              >
                <FaArrowsAlt className="text-gray-600 dark:text-gray-300 text-sm" />
              </motion.div>
            </Tooltip>

            {/* Resize handle */}
            <Tooltip title="Resize" placement="left">
              <motion.div
                className="control-handle cursor-nwse-resize p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setIsResizing(true);
                  startPos.current = { x: e.clientX, y: e.clientY };
                  startTransform.current = { ...transform };
                }}
              >
                <FaExpandArrowsAlt className="text-gray-600 dark:text-gray-300 text-sm" />
              </motion.div>
            </Tooltip>

            {/* Delete button */}
            <Tooltip title="Delete" placement="left">
              <Popconfirm
                title="Are you sure to delete this diagram?"
                onConfirm={handleRemove}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <motion.div
                  className="control-handle cursor-pointer p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:bg-red-50 dark:hover:bg-red-900/20"
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

export default NetworkDiagram;
