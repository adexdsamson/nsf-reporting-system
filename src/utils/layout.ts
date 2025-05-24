import dagre from 'dagre';
import { Node, Edge } from 'react-flow-renderer';

const nodeWidth = 220;   // Increased width for more spacing
const nodeHeight = 60;   // Increased height for more spacing

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: 'LR' | 'TB' = 'LR'
): { nodes: Node[]; edges: Edge[] } => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 140,   // Increased node separation
    ranksep: 160,   // Increased rank separation
    marginx: 80,    // Increased horizontal margin
    marginy: 80,    // Increased vertical margin
    align: 'UL',
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

    // Reduce the "crazy" offsets for less overlap, but keep some dynamic effect
    const wave = Math.sin(i * 1.2) * 40;
    const spiral = i * 20;
    const jitterX = (Math.random() - 0.5) * 20;
    const jitterY = (Math.random() - 0.5) * 20;

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
    node.draggable = true;
  });

  return { nodes, edges };
};