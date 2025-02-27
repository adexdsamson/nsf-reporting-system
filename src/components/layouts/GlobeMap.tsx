import { useEffect, useRef, useState } from "react";
import Globe from "globe.gl";
import { Feature, Properties, WorldMapTypes } from "./GeoMap";
import { useResizeObserver } from "usehooks-ts";

interface Bank {
  name: string;
  address: string;
  code: string;
  coordinates: [number, number];
  type: "commercial" | "microfinance" | "fintech";
  parentBank?: string;
  isBranch?: boolean;
}

interface Transaction {
  id: string;
  source: [number, number];
  target: [number, number];
}

const getBankColor = (bank: Bank, selectedBank: Bank | null) => {
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

  if (selectedBank && selectedBank.code !== bankCode && selectedBank.parentBank !== bankCode) {
    return `${baseColor}40`;
  }

  return baseColor;
};

type GlobeMapProps = {
  data: WorldMapTypes;
  property: keyof Properties;
  defaultCountry?: Feature;
  transactions?: Transaction[];
  banks?: Bank[];
};

export const GlobeMap = ({
  data,
  property,
  defaultCountry,
  transactions = [],
  banks = [],
}: GlobeMapProps) => {
  const globeRef = useRef<HTMLDivElement>(null);
  const [selectedCountry, setSelectedCountry] = useState<Feature | null>(
    defaultCountry ?? null
  );
  const [hoveredBank, setHoveredBank] = useState<Bank | null>(null);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const dimensions = useResizeObserver<HTMLDivElement>({ ref: globeRef });
  const globeInstance = useRef<any>(null);

  useEffect(() => {
    if (!globeRef.current) return;

    // Initialize globe
    const globe = Globe()(globeRef.current)
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-dark.jpg")
      .backgroundColor("#1a1d2d")
      .lineHoverPrecision(0.1);

    globeInstance.current = globe;

    // Set initial view
    globe
      .pointOfView({
        lat: 9.082,
        lng: 8.6753,
        altitude: 2.5
      }, 1000);

    // Add countries
    globe
      .polygonsData(data.features)
      .polygonCapColor((feature: Feature) => 
        feature.properties.name === "Nigeria" ? "#4a90e2" : "#1a1d2d"
      )
      .polygonSideColor(() => "rgba(0,0,0,0.15)")
      .polygonStrokeColor(() => "#111")
      .polygonAltitude(0.01)
      .onPolygonClick((feature: Feature) => {
        setSelectedCountry(selectedCountry === feature ? null : feature);
      });

    // Add bank points
    globe
      .pointsData(banks)
      .pointColor((bank: Bank) => getBankColor(bank, selectedBank))
      .pointAltitude(0.02)
      .pointRadius((bank: Bank) => bank.isBranch ? 0.4 : 0.6)
      .pointsMerge(true)
      .pointLabel((bank: Bank) => `
        <div class="p-2 bg-black bg-opacity-80 rounded-lg text-white text-sm">
          <div class="font-bold">${bank.name}</div>
          <div>${bank.code} - ${bank.address}</div>
        </div>
      `)
      .onPointHover((bank: Bank | null) => {
        setHoveredBank(bank);
        if (globeInstance.current) {
          globeInstance.current
            .pointRadius((d: Bank) => 
              d === bank ? (d.isBranch ? 0.6 : 0.8) : (d.isBranch ? 0.4 : 0.6)
            );
        }
      })
      .onPointClick((bank: Bank) => {
        setSelectedBank(selectedBank?.code === bank.code ? null : bank);
      });

    // Handle transactions
    const transactionArcs = transactions.map(({ source, target, id }) => ({
      startLat: source[1],
      startLng: source[0],
      endLat: target[1],
      endLng: target[0],
      id
    }));

    globe
      .arcsData(transactionArcs)
      .arcColor((arc: any) => {
        const sourceBank = banks.find(
          (b) => b.coordinates[0] === arc.startLng && b.coordinates[1] === arc.startLat
        );
        return getBankColor(sourceBank || { type: "commercial" } as Bank, selectedBank);
      })
      .arcAltitude((arc: any) => {
        const isInternational = Math.abs(arc.startLat) > 15;
        return isInternational ? 0.4 : 0.2;
      })
      .arcStroke((arc: any) => {
        const isInternational = Math.abs(arc.startLat) > 15;
        return isInternational ? 1 : 0.5;
      })
      .arcDashLength(0.5)
      .arcDashGap(0.2)
      .arcDashAnimateTime((arc: any) => {
        const isInternational = Math.abs(arc.startLat) > 15;
        return isInternational ? 3000 : 1000;
      });

    // Cleanup
    return () => {
      if (globeInstance.current) {
        globeInstance.current = null;
      }
    };
  }, []);

  // Update data when props change
  useEffect(() => {
    if (!globeInstance.current) return;

    const globe = globeInstance.current;

    // Update transactions
    const transactionArcs = transactions.map(({ source, target, id }) => ({
      startLat: source[1],
      startLng: source[0],
      endLat: target[1],
      endLng: target[0],
      id
    }));

    globe.arcsData(transactionArcs);

    // Update bank points
    globe
      .pointsData(banks)
      .pointColor((bank: Bank) => getBankColor(bank, selectedBank));

  }, [transactions, banks, selectedBank]);

  // Handle resize
  useEffect(() => {
    if (!globeInstance.current || !dimensions) return;

    const { width = 0, height = 0 } = dimensions;
    globeInstance.current.width(width).height(height);
  }, [dimensions]);

  return (
    <div ref={globeRef} className="w-full h-full">
      {hoveredBank && (
        <div
          className="absolute bg-black bg-opacity-80 text-white p-4 rounded-lg"
          style={{
            left: dimensions?.width ? dimensions.width / 2 : 0,
            bottom: 20,
            transform: "translateX(-50%)"
          }}
        >
          <div className="font-bold text-lg">{hoveredBank.name}</div>
          <div>{hoveredBank.code} - {hoveredBank.address}</div>
        </div>
      )}
    </div>
  );
};