import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useResizeObserver } from "usehooks-ts";
import { TransactionData } from "@/types";
import { format } from "date-fns";

interface ForceGraphProps {
  data: {
    nodes: Array<{
      id: string;
      label: string;
      group?: number; // Assuming group is part of the data for color coding
      data: TransactionData;
    }>;
    links: Array<{
      source: string;
      target: string;
      value?: number; // Assuming value is part of the data for link width
    }>;
  };
}

export const ForceGraph = ({ data }: ForceGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dimensions = useResizeObserver<HTMLDivElement>({ ref: wrapperRef });

  useEffect(() => {
    if (!dimensions) return;

    const width = dimensions?.width ?? 928;
    const height = dimensions?.height ?? 600;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const links = data?.links?.map?.((d) => ({ ...d })) ?? [];
    const nodes = data?.nodes?.map?.((d) => ({ ...d })) ?? [];

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    svg.selectAll("*").remove();

    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    const g = svg.append("g");

    const link = g
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value || 1));

    const tooltip = d3
      .select(wrapperRef.current)
      .append("div")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("border-radius", "3px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    const node = g
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("g")
      .attr("class", "node");

    node
      .append("circle")
      .attr("r", 5)
      .attr("fill", (d) => color(d.group?.toString() || "0"));

    node
      .append("circle")
      .attr("fill", (d: any) => (d.children ? "#555" : "#999"))
      .attr("r", 2.5)
      .on("mouseover", function (_, d) {
        const transaction = d?.data;
        console.log({ ds: transaction, });
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(
            `
          <strong>Bank Name:</strong> ${transaction?.bank_name}<br/>
          <strong>Timestamp:</strong> ${format(
            transaction?.timestamp,
            "do MMMM yyyy hh:mm aaa"
          )}<br/>
          <strong>Account Number:</strong> ${transaction?.sender_account_number}
        `
          )
          // .style("left", `${d.y + 10}px`)
          // .style("top", `${d.x}px`);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    node
      .append("text")
      .text((d) => d.label)
      .attr("x", 8)
      .attr("y", 3)
      .attr("font-size", "10px")
      .attr("class", "text-black font-thin");

    const simulation = d3
      .forceSimulation<any>(nodes)
      .force(
        "link",
        d3.forceLink(links).id((d: any) => d.id)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);

    (node as any).call(
      d3
        .drag<SVGGElement, { id: string; label: string; group?: number }>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

    function ticked() {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    }

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  }, [data, dimensions]);

  return (
    <div ref={wrapperRef} className="w-full h-full rounded-lg overflow-hidden">
      <svg ref={svgRef}></svg>
    </div>
  );
};
