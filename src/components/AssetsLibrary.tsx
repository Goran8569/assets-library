import React from "react";
import { useAssets } from "../context/AssetsContext";
import { Asset, AssetType, Section } from "../types/assets";
import { AssetsSection } from "./AssetsSection";
import PhotoLibraryIcon from "@material-symbols/svg-400/outlined/photo_library.svg";

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const AssetsLibrary = () => {
  const { addAsset, moveAsset } = useAssets();

  const handleDrop = async (e: React.DragEvent, targetSection: Section) => {
    e.preventDefault();

    const assetId = e.dataTransfer?.getData?.("text/plain");
    if (assetId) {
      moveAsset(assetId, targetSection);
      return;
    }

    const files = e.dataTransfer?.files;

    if (!files?.length) return;

    for (const file of Array.from(files)) {
      const type = file.type.split("/")[0] as AssetType;
      if (!["image", "audio", "video"].includes(type)) continue;

      const dataUrl = await fileToDataUrl(file);

      const newAsset: Asset = {
        id: crypto.randomUUID(),
        type,
        url: dataUrl,
        name: file.name,
        createdAt: new Date(),
        section: targetSection,
      };
      addAsset(newAsset);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetSection: Section) => {
    e.preventDefault();

    const files = e.target?.files;
    if (!files?.length) return;

    for (const file of Array.from(files)) {
      const type = file.type.split("/")[0] as AssetType;
      if (!["image", "audio", "video"].includes(type)) continue;

      const dataUrl = await fileToDataUrl(file);

      const newAsset: Asset = {
        id: crypto.randomUUID(),
        type,
        url: dataUrl,
        name: file.name,
        createdAt: new Date(),
        section: targetSection,
      };
      addAsset(newAsset);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-start items-center mb-6">
        <img src={PhotoLibraryIcon} />
        <h1 className="text-2xl font-bold ml-2">Assets</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <AssetsSection section="source" onDrop={handleDrop} onUpload={handleUpload} />
        <AssetsSection section="target" onDrop={handleDrop} onUpload={handleUpload} />
      </div>
    </div>
  );
};

export default AssetsLibrary;
