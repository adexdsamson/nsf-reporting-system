import { forwardRef, useEffect, useRef, useState } from "react";
import {
  select,
  geoPath,
  geoMercator,
  min,
  max,
  scaleLinear,
  easeLinear,
} from "d3";
import { useResizeObserver } from "usehooks-ts";

export interface WorldMapTypes {
  type: string;
  features: Feature[];
}

export interface Feature {
  type: string;
  properties: Properties;
  geometry: Geometry;
}

export interface Geometry {
  type: string;
  coordinates: Array<Array<Array<number[] | number>>>;
}

export enum GeometryType {
  MultiPolygon = "MultiPolygon",
  Polygon = "Polygon",
}

export interface Properties {
  scalerank: number;
  featurecla: string;
  labelrank: number;
  sovereignt: string;
  sov_a3: string;
  adm0_dif: number;
  level: number;
  type: string;
  admin: string;
  adm0_a3: string;
  geou_dif: number;
  geounit: string;
  gu_a3: string;
  su_dif: number;
  subunit: string;
  su_a3: string;
  brk_diff: number;
  name: string;
  name_long: string;
  brk_a3: string;
  brk_name: string;
  brk_group: null;
  abbrev: string;
  postal: string;
  formal_en: null | string;
  formal_fr: null | string;
  note_adm0: null | string;
  note_brk: null | string;
  name_sort: string;
  name_alt: null | string;
  mapcolor7: number;
  mapcolor8: number;
  mapcolor9: number;
  mapcolor13: number;
  pop_est: number;
  gdp_md_est: number;
  pop_year: number;
  lastcensus: number;
  gdp_year: number;
  economy: string;
  income_grp: string;
  wikipedia: number;
  fips_10: null;
  iso_a2: string;
  iso_a3: string;
  iso_n3: string;
  un_a3: string;
  wb_a2: string;
  wb_a3: string;
  woe_id: number;
  adm0_a3_is: string;
  adm0_a3_us: string;
  adm0_a3_un: number;
  adm0_a3_wb: number;
  continent: Continent;
  region_un: Continent;
  subregion: string;
  region_wb: string;
  name_len: number;
  long_len: number;
  abbrev_len: number;
  tiny: number;
  homepart: number;
  filename: string;
}

export enum Continent {
  Africa = "Africa",
  Americas = "Americas",
  Asia = "Asia",
  Europe = "Europe",
  NorthAmerica = "North America",
  Oceania = "Oceania",
  SouthAmerica = "South America",
}

interface Transaction {
  id: string;
  source: [number, number]; // [longitude, latitude]
  target: [number, number]; // [longitude, latitude]
}

interface Bank {
  name: string;
  address: string;
  code: string;
  coordinates: [number, number];
  type: "commercial" | "microfinance" | "fintech";
  parentBank?: string; // Code of the parent bank for branches
  isBranch?: boolean;
}

const getBankColor = (bank: Bank, selectedBank: Bank | null) => {
  // Generate a unique color for each parent bank
  const bankColors: { [key: string]: string } = {
    FBN: "#4a90e2",
    ACB: "#2ecc71",
    ZNB: "#9b59b6",
    UBA: "#e74c3c",
    GTB: "#f1c40f",
    UBN: "#1abc9c",
    FDB: "#e67e22",
    STB: "#95a5a6",
    ECB: "#34495e",
    SIB: "#16a085",
    PLB: "#d35400",
    WEM: "#8e44ad",
    HSBC: "#c0392b",
    JPM: "#7f8c8d",
    DB: "#2980b9",
    BOC: "#27ae60",
    SB: "#f39c12",
    ENBD: "#2c3e50"
  };

  const bankCode = bank.parentBank || bank.code;
  const baseColor = bankColors[bankCode] || "#4a90e2";

  // If there's a selected bank, dim other banks
  if (selectedBank && selectedBank.code !== bankCode && selectedBank.parentBank !== bankCode) {
    return `${baseColor}40`; // Add 40 for 25% opacity
  }

  return baseColor;
};

type GeoMapProps = {
  data: WorldMapTypes;
  property: keyof Properties;
  defaultCountry?: Feature;
  transactions?: Transaction[];
  banks?: Bank[];
}

export const GeoMap = ({
  data,
  property,
  defaultCountry,
  transactions = [],
  banks = [],
}: GeoMapProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedCountry, setSelectedCountry] = useState<Feature | null>(
    defaultCountry ?? null
  );
  const [hoveredBank, setHoveredBank] = useState<Bank | null>(null);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const dimensions = useResizeObserver<HTMLDivElement>({ ref });
  const animationFrameRef = useRef<number>();

  const generateArcPath = (
    source: [number, number],
    target: [number, number],
    projection: any
  ) => {
    const [sx, sy] = projection(source) || [0, 0];
    const [tx, ty] = projection(target) || [0, 0];
    const mx = (sx + tx) / 2;

    // Calculate the distance between points in screen coordinates
    const distance = Math.sqrt(Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2));

    // Scale the arc height based on the distance, with a minimum and maximum
    const heightScale = Math.min(Math.max(distance * 0.2, 30), 200);

    // Calculate the midpoint with dynamic height scaling
    const my = (sy + ty) / 2 - heightScale;

    // Use quadratic Bezier curve for smooth arc
    return `M ${sx} ${sy} Q ${mx} ${my} ${tx} ${ty}`;
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const svg = select(svgRef.current);

    const minProp = min(
      data.features,
      (feature) => feature.properties?.[property as keyof Properties]
    );
    const maxProp = max(
      data.features,
      (feature) => feature?.properties?.[property as any]
    );
    
    const colorScale = scaleLinear()
      .domain([minProp, maxProp] as any)
      .range(["#1a1d2d", "#4a90e2"] as any);

    // use resized dimensions
    // but fall back to getBoundingClientRect, if no dimensions yet.
    const { width = 0, height = 0 } =
      dimensions || ref.current?.getBoundingClientRect?.();

    // projects geo-coordinates on a 2D plane
    const projection = geoMercator()
      .fitSize([width, height], (selectedCountry ?? data) as any)
      .precision(100);

    // takes geojson data,
    // transforms that into the d attribute of a path element
    const pathGenerator = geoPath().projection(projection);

    // render each country
    svg
      .selectAll(".country")
      .data(data.features)
      .join("path")
      .on("click", (_, feature) => {
        setSelectedCountry(selectedCountry === feature ? null : feature);
      })
      .attr("class", "country")
      .transition()
      .attr("fill", (feature) =>
        feature.properties['name'] === 'Nigeria' ? "#4a90e2" : "#1a1d2d"
      )
      .attr("d", (feature) => pathGenerator(feature as any));


    // render transaction arcs with independent transitions
    svg
      .selectAll(".transaction")
      .data(transactions, (d: Transaction) => d.id)
      .join(
        (enter) =>
          enter
            .append("path")
            .attr("class", "transaction")
            .attr("fill", "none")
            .attr("stroke", (d) => {
              const sourceBank = banks.find(
                (b) =>
                  b.coordinates[0] === d.source[0] &&
                  b.coordinates[1] === d.source[1]
              );
              return getBankColor(sourceBank?.type || "commercial");
            })
            .attr("stroke-width", 1.5)
            .attr("d", (d) => generateArcPath(d.source, d.target, projection))
            .style("filter", "url(#glow)")
            .each(function () {
              const length = (this as SVGPathElement).getTotalLength();
              const node = select(this);
              node
                .attr("stroke-dasharray", `${length} ${length}`)
                .attr("stroke-dashoffset", length)
                .transition()
                .duration((d) => {
                  // Calculate if it's an international transaction based on coordinates
                  const sourceLat = d.source[1];
                  const isInternational = Math.abs(sourceLat) > 15; // Rough latitude check for Nigeria's borders
                  return isInternational ? 3000 : 500; // Slower for international, normal for domestic
                })
                .ease(easeLinear)
                .attr("stroke-dashoffset", 0)
                .transition()
                .duration((d) => {
                  const sourceLat = d.source[1];
                  const isInternational = Math.abs(sourceLat) > 15;
                  return isInternational ? 1600 : 800; // Slower fade-out for international transactions
                })
                .ease(easeLinear)
                .attr("stroke-dashoffset", -length)
                .attrTween("stroke-opacity", () => (t) => 1 - t) // Gradually fade out
                .on("end", function () {
                  node.remove();
                });
            }),
        (update) => update,
        (exit) => exit.remove()
      );

    // Add glow filter
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow");
    filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "2")
      .attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // render bank nodes with pulsing effect
    const bankNodes = svg
      .selectAll(".bank-node-group")
      .data(banks)
      .join("g")
      .attr("class", "bank-node-group")
      .attr(
        "transform",
        (d) =>
          `translate(${projection(d.coordinates)?.[0] || 0},${
            projection(d.coordinates)?.[1] || 0
          })`
      );

    // Outer glow circle
    bankNodes
      .selectAll(".bank-node-pulse")
      .data((d) => [d])
      .join("circle")
      .attr("class", "bank-node-pulse")
      .attr("r", 6)
      .attr("fill", "none")
      .attr("stroke", "#FF5533")
      .attr("stroke-width", 2)
      .attr("opacity", 0.6)
      .style("filter", "url(#glow)")
      .transition()
      .duration(1500)
      .attr("r", 12)
      .attr("opacity", 0)
      .ease(easeLinear)
      .on("end", function () {
        animationFrameRef.current = requestAnimationFrame(() => {
          select(this)
            .attr("r", 6)
            .attr("opacity", 0.6)
            .transition()
            .duration(1500)
            .attr("r", 12)
            .attr("opacity", 0)
            .ease(easeLinear)
            .on("end", function () {
              select(this).remove();
            });
        });
      });

    // Main bank node
    bankNodes
      .selectAll(".bank-node")
      .data((d) => [d])
      .join("circle")
      .attr("class", "bank-node")
      .attr("r", (d) => d.isBranch ? 4 : 6)
      .attr("fill", (d) => getBankColor(d, selectedBank))
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", (event, bank) => {
        // setHoveredBank(bank);
        select(event.target).transition().duration(200).attr("r", (d: Bank) => d.isBranch ? 6 : 8);
      })
      .on("mouseout", (event) => {
        // setHoveredBank(null);
        select(event.target).transition().duration(200).attr("r", (d: Bank) => d.isBranch ? 4 : 6);
      })
      .on("click", (_, bank) => {
        setSelectedBank(selectedBank?.code === bank.code ? null : bank);
      });

    // render enhanced bank tooltips
    const tooltips = svg
      .selectAll(".bank-tooltip-group")
      .data(hoveredBank ? [hoveredBank] : [])
      .join("g")
      .attr("class", "bank-tooltip-group")
      .attr(
        "transform",
        (d) =>
          `translate(${(projection(d.coordinates)?.[0] || 0) + 15},${
            (projection(d.coordinates)?.[1] || 0) - 15
          })`
      );

    tooltips
      .selectAll(".bank-tooltip-bg")
      .data((d) => [d])
      .join("rect")
      .attr("class", "bank-tooltip-bg")
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("fill", "rgba(0, 0, 0, 0.8)")
      .attr("width", (d) => `${d.name.length * 8 + 40}px`)
      .attr("height", "50px");

    tooltips
      .selectAll(".bank-tooltip-text")
      .data((d) => [d])
      .join("text")
      .attr("class", "bank-tooltip-text")
      .attr("x", 10)
      .attr("y", 20)
      .attr("fill", "white")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text((d) => d.name)
      .append("tspan")
      .attr("x", 10)
      .attr("dy", 20)
      .attr("font-weight", "normal")
      .text((d) => `${d.code} - ${d.address}`);
  }, [
    data,
    property,
    dimensions,
    selectedCountry,
    banks,
    hoveredBank,
    selectedBank,
    transactions,
  ]);

  return (
    <div ref={ref} className="w-full h-full">
      <svg ref={svgRef}></svg>
    </div>
  );
};
