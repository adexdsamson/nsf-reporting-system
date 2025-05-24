import dagre from 'dagre';
import { Node, Edge } from 'react-flow-renderer';

const nodeWidth = 180;
const nodeHeight = 40;

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: 'LR' | 'TB' = 'LR'
): { nodes: Node[]; edges: Edge[] } => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 60,   // Increase node separation for more space
    ranksep: 80,   // Increase rank separation for more vertical/horizontal space
    marginx: 40,   // Add horizontal margin
    marginy: 40,   // Add vertical margin
    align: 'UL',   // Try to align nodes in a less rigid way
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node, i) => {
  const nodeWithPosition = dagreGraph.node(node.id);

  // Go crazy: add a wave, spiral, and random jitter for a dynamic effect!
  const wave = Math.sin(i * 1.2) * 60; // Sine wave offset
  const spiral = i * 12; // Spiral outwards
  const jitterX = (Math.random() - 0.5) * 40; // Random jitter X
  const jitterY = (Math.random() - 0.5) * 40; // Random jitter Y

  node.position = {
    x:
      direction === 'LR'
        ? nodeWithPosition.x - nodeWidth / 2 + wave + spiral + jitterX
        : nodeWithPosition.x - nodeWidth / 2 + wave + jitterX,
    y:
      direction === 'LR'
        ? nodeWithPosition.y - nodeHeight / 2 + wave + jitterY
        : nodeWithPosition.y - nodeHeight / 2 + wave + spiral + jitterY,
  };
  node.sourcePosition = direction === 'LR' ? 'right' : 'bottom';
  node.targetPosition = direction === 'LR' ? 'left' : 'top';
});

  return { nodes, edges };
};