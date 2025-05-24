import dagre from 'dagre';
import { Node, Edge, Position } from 'react-flow-renderer';

const nodeWidth = 220;
const nodeHeight = 60;

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: 'LR' | 'TB' = 'LR'
): { nodes: Node[]; edges: Edge[] } => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 140,
    ranksep: 160,
    marginx: 80,
    marginy: 80,
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
    node.sourcePosition = direction === 'LR' ? Position.Right : Position.Bottom;
    node.targetPosition = direction === 'LR' ? Position.Left : Position.Top;
    node.draggable = true;
  });

  return { nodes, edges };
};