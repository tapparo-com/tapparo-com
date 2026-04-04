import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tapparo",
    short_name: "Tapparo",
    description: "Focacceria & Daybar",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F4F2",
    theme_color: "#E84F2F",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
