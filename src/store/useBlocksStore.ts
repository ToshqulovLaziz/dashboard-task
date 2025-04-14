import { create } from "zustand";

export const useBlocksStore = create<BlocksStore>((set) => ({
  blocks: [],
  addBlock: (newBlock) =>
    set((state) => ({ blocks: [...state.blocks, newBlock] })),
  removeBlock: (id) =>
    set((state) => ({
      blocks: state.blocks.filter((block) => block.id !== id),
    })),
}));
