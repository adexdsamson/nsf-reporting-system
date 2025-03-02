import { useSpring } from "react-spring";
import createGlobe, { COBEOptions } from "cobe";
import { useCallback, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0, // Longitude of Lagos
  theta: 0.113, // Adjusted for latitude of Lagos
  dark: 1,
  diffuse: 0.0,
  mapSamples: 16000,
  mapBrightness: 6.0,
  baseColor: [1, 1, 1],
  markerColor: [251 / 255, 100 / 255, 21 / 255],
  glowColor: [0, 0, 0],
  markers: [],
};

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string;
  config?: Partial<COBEOptions>;
}) {
  let phi = 0;
  let width = 0;
  const focusRef = useRef([0, 0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  const [{ r }, api] = useSpring(() => ({
    r: 0,
    config: {
      mass: 1,
      tension: 280,
      friction: 40,
      precision: 0.001,
    },
  }));

  const drawArc = (
    ctx: CanvasRenderingContext2D,
    from: number[],
    to: number[],
    color: string
  ) => {
    ctx.beginPath();
    ctx.moveTo(from[0], from[1]);
    ctx.lineTo(to[0], to[1]);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const onRender = useCallback(
    (state: Record<string, any>) => {
      // const canvas = canvasRef.current;
      // // if (!canvas) return;

      // const ctx = canvas.getContext("2d");
      // // if (!ctx) return;

      // ctx.clearRect(0, 0, canvas.width, canvas.height);

      // // Draw lines between markers
      // const markers = config.markers || [];
      // for (let i = 0; i < markers.length - 1; i++) {
      //   const from = markers[i].location;
      //   const to = markers[i + 1].location;
      //   drawArc(ctx, from, to, "orange");
      // }

      // state.phi = r.get();
      state.phi = phi;
      phi += 0.005
      state.width = width * 2;
      state.height = width * 2;
    },
    [r]
  );

  const onResize = useCallback(() => {
    if (canvasRef.current) {
      width = canvasRef.current.offsetWidth;
    }
  }, [canvasRef.current, width]);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      ...GLOBE_CONFIG,
      ...config,
      width: width * 2,
      height: width * 2,
      onRender,
    });

    setTimeout(() => (canvasRef.current!.style.opacity = "1"));
    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [onResize, onRender]);

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]",
        className
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current =
            e.clientX - pointerInteractionMovement.current;
          if (canvasRef.current && canvasRef.current.style) {
            canvasRef.current.style.cursor = "grabbing";
          }
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = "grab";
          }
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = "grab";
          }
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            api.start({
              r: delta / 200,
            });
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            api.start({
              r: delta / 100,
            });
          }
        }}
      />
    </div>
  );
}
