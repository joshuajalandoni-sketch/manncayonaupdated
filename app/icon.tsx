import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Monogram mark — gesso black ground, canvas letterform. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#14130f",
          color: "#f5f1e8",
          fontSize: 15,
          letterSpacing: "0.02em",
        }}
      >
        MC
      </div>
    ),
    size
  );
}
