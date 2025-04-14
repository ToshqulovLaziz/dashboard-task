export const networkDiagramData = {
  type: "network",
  nodes: [
    { id: "HR", label: "Human Resources" },
    { id: "Sales", label: "Sales" },
    { id: "Tech", label: "Technology" },
    { id: "Finance", label: "Finance" },
  ],
  edges: [
    { from: "HR", to: "Sales" },
    { from: "Tech", to: "Sales" },
    { from: "Tech", to: "Finance" },
    { from: "HR", to: "Tech" },
  ],
  description:
    "Network diagram showing departments and their interconnections.",
};
export const pieDiagramDataWithImage = {
  type: "pie",
  labels: ["Apple", "Banana", "Orange"],
  data: [50, 30, 20],
  image: "https://example.com/fruit-image.jpg", 
  description: "Fruit distribution in the market.",
};
