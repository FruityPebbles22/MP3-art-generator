export enum ArtStyle {
  KIDCORE = "Kidcore Aesthetic",
  LISA_FRANK = "Lisa Frank Style",
  VAN_GOGH = "Van Gogh Impressionism",
  FURRY = "Furry Art Style",
  PORTRAIT = "Classical Portrait",
  CARTOON = "Saturday Morning Cartoon",
  TEX_AVERY = "Tex Avery Cartoon Style",
  MARKER = "Marker Art",
  CRAYON = "Crayon Drawing",
  SQUID_GAME = "Squid Game Aesthetic",
  CLAYMATION = "Claymation",
  PLAY_DOH = "Play-Doh Sculpture",
  VIDEO_GAME = "Retro Video Game",
  FORTNITE = "Fortnite Skin Style",
  VAPORWAVE = "Vaporwave",
  PIXEL_ART = "Pixel Art",
}

export interface GeneratedSlide {
  id: string;
  imageUrl: string;
  prompt: string;
}

export interface GenerationStatus {
  step: 'idle' | 'analyzing' | 'generating_images' | 'ready';
  progress: number;
  total: number;
  message: string;
}
