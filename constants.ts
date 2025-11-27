import { ArtStyle } from "./types";

export const STYLE_CONFIGS: Record<ArtStyle, { label: string; color: string; icon: string }> = {
  [ArtStyle.KIDCORE]: { label: "Kidcore", color: "bg-pink-400", icon: "fa-child" },
  [ArtStyle.LISA_FRANK]: { label: "Lisa Frank", color: "bg-purple-500", icon: "fa-heart" },
  [ArtStyle.VAN_GOGH]: { label: "Van Gogh", color: "bg-blue-600", icon: "fa-palette" },
  [ArtStyle.FURRY]: { label: "Furry", color: "bg-orange-400", icon: "fa-paw" },
  [ArtStyle.PORTRAIT]: { label: "Portrait", color: "bg-amber-700", icon: "fa-user" },
  [ArtStyle.CARTOON]: { label: "Cartoon", color: "bg-red-500", icon: "fa-tv" },
  [ArtStyle.TEX_AVERY]: { label: "Tex Avery", color: "bg-yellow-500", icon: "fa-poo" }, // using a fun icon
  [ArtStyle.MARKER]: { label: "Marker", color: "bg-green-500", icon: "fa-pen-fancy" },
  [ArtStyle.CRAYON]: { label: "Crayon", color: "bg-orange-500", icon: "fa-crayon" },
  [ArtStyle.SQUID_GAME]: { label: "Squid Game", color: "bg-teal-600", icon: "fa-square" },
  [ArtStyle.CLAYMATION]: { label: "Claymation", color: "bg-amber-600", icon: "fa-shapes" },
  [ArtStyle.PLAY_DOH]: { label: "Play-Doh", color: "bg-yellow-400", icon: "fa-hand-rock" },
  [ArtStyle.VIDEO_GAME]: { label: "Video Game", color: "bg-indigo-600", icon: "fa-gamepad" },
  [ArtStyle.FORTNITE]: { label: "Fortnite", color: "bg-blue-500", icon: "fa-bus" },
  [ArtStyle.VAPORWAVE]: { label: "Vaporwave", color: "bg-fuchsia-500", icon: "fa-wave-square" },
  [ArtStyle.PIXEL_ART]: { label: "Pixel Art", color: "bg-indigo-400", icon: "fa-border-all" },
};
