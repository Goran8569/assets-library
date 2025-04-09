export type AssetType = "image" | "audio" | "video";
export type Section = "source" | "target";

export interface Asset {
  id: string;
  type: AssetType;
  url: string;
  name: string;
  createdAt: Date;
  section: Section;
}
