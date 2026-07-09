interface OgMarkProps {
  size: number;
}

export function OgMark({ size }: OgMarkProps) {
  const r = (pct: number) => Math.round(size * pct * 100) / 100;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: r(0.25),
        background: "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)",
        position: "relative",
        display: "flex",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: r(0.2),
          left: r(0.175),
          width: r(0.65),
          height: r(0.163),
          borderRadius: r(0.075),
          background: "white",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: r(0.2),
          left: r(0.4),
          width: r(0.2),
          height: r(0.6125),
          borderRadius: r(0.075),
          background: "white",
        }}
      />
    </div>
  );
}
