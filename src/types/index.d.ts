interface ModalStore {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}
interface PieDiagramDataWithImage {
  type: "pie";
  description: string;
  labels: string[];
  data: number[];
  image: string;
}

interface BlockData {
  id: string;
  type: "pie" | "networkDiagram";
  hasImage: boolean;
  data: PieDiagramDataWithImage | NetworkDiagramData;
}

interface BlocksStore {
  blocks: BlockData[];
  addBlock: (newBlock: BlockData) => void;
  removeBlock: (id: string) => void;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}
interface PieDiagramProps {
  data: {
    labels: string[];
    data: number[];
    description?: string;
    image?: string;
    colors?: string[];
  };
  movable?: boolean;
  blockId?: string;
}

interface Node {
  id: string;
  label: string;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
  icon?: string;
}

interface Edge {
  from: string;
  to: string;
  weight?: number;
  color?: string;
}

interface NetworkDiagramProps {
  data: {
    nodes: Node[] ;  
    edges: Edge[];
    description?: string;
  };
  movable?: boolean;
  blockId?: string;
}
interface NetworkDiagramData {
  type: "networkDiagram";
  description: string;
  nodes: Node[];
  edges: Edge[];
}
interface UserNamePromptProps {
  onSubmit: (name: string) => void;
}