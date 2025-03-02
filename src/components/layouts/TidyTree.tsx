import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useResizeObserver } from "usehooks-ts";
import { format } from "date-fns";

type TidyTreeProps = {
  data: any;
  width?: number;
  height?: number;
};

export const TidyTree = ({ data }: TidyTreeProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dimensions = useResizeObserver<HTMLDivElement>({ ref: wrapperRef });

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const width = dimensions?.width ?? 928;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Create the root hierarchy
    const root = d3.hierarchy(data);
    const dx = 10;
    const dy = width / (root.height + 1);

    // Create a tree layout
    const tree = d3.tree().nodeSize([dx, dy]);

    // Sort and apply the layout
    root.sort((a, b) => d3.ascending(a.data.name, b.data.name));
    tree(root);

    // Compute the layout extent
    let x0 = Infinity;
    let x1 = -x0;
    root.each((d: any) => {
      if (d.x > x1) x1 = d.x;
      if (d.x < x0) x0 = d.x;
    });

    // Compute adjusted height
    const height = x1 - x0 + dx * 2;

    // Create the SVG container
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", dimensions?.height ?? height)
      .attr("viewBox", [-dy / 3, x0 - dx, width, dimensions?.height ?? height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;")
      .attr("class", "bg-slate-900 rounded-lg");

    // Add zoom functionality
    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 4]) // Set the zoom scale limits
      .on("zoom", (event) => {
        g.attr("transform", event.transform); // Apply the zoom transformation
      });

    svg.call(zoom as any);

    // Create a group for zoom transformations
    const g = svg.append("g");

    // Create links
    g
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll()
      .data(root.links())
      .join("path")
      .attr(
        "d",
        d3
          .linkHorizontal()
          .x((d: any) => d.y)
          .y((d: any) => d.x) as any
      );

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

    // Create nodes
    const node = g
      .append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .selectAll()
      .data(root.descendants())
      .join("g")
      .attr("transform", (d: any) => `translate(${d.y},${d.x})`);

    // Add circles to nodes
    node
      .append("circle")
      .attr("fill", (d: any) => (d.children ? "#555" : "#999"))
      .attr("r", 2.5)
      .on("mouseover", function (_, d) {
        const transaction = d.data.transaction;
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

    // Add text labels
    node
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", (d: any) => (d.children ? -6 : 6))
      .attr("text-anchor", (d: any) => (d.children ? "end" : "start"))
      .text((d: any) => d.data.name)
      .attr("fill", "white")
      .attr("paint-order", "stroke");

    // Add dragging behavior
    node.call(
      d3
        .drag()
        .on("start", (event, d: any) => {
          event.sourceEvent.stopPropagation();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d: any) => {
          d.fx = event.y;
          d.fy = event.x;
          d3.select(event.sourceEvent.target.parentNode).attr(
            "transform",
            `translate(${d.y},${d.x})`
          );
        })
        .on("end", (_, d: any) => {
          d.fx = null;
          d.fy = null;
        }) as any
    );
  }, [data, dimensions]);

  return (
    <div ref={wrapperRef} className="w-full h-full">
      <svg ref={svgRef} />
    </div>
  );
};
