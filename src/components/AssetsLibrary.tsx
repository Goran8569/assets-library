import React, { useState } from "react";
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

  const [selectedSourceAssets, setSelectedSourceAssets] = useState<Set<string>>(new Set());
  const [selectedTargetAsset, setSelectedTargetAsset] = useState<string | null>(null);

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

  const handleSelectSourceAsset = (assetId: string) => {
    setSelectedSourceAssets((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(assetId)) {
        newSelected.delete(assetId);
      } else {
        newSelected.add(assetId);
      }
      return newSelected;
    });
  };

  const handleSelectTargetAsset = (assetId: string) => {
    setSelectedTargetAsset(assetId === selectedTargetAsset ? null : assetId);
  };

  const handleSave = () => {
    setSelectedSourceAssets(new Set());
    setSelectedTargetAsset(null);
  };

  const handleCancel = () => {
    setSelectedSourceAssets(new Set());
    setSelectedTargetAsset(null);
  };

  return (
    <div className="p-6 max-w mx-auto bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex justify-start items-center">
          <img src={PhotoLibraryIcon} className=" filter invert" />
          <h1 className="text-2xl font-bold ml-2">Assets</h1>
        </div>
        {selectedSourceAssets?.size > 0 && selectedTargetAsset && (
          <div className="mt-4 flex gap-4">
            <button onClick={handleCancel} className="px-4 py-2 text-gray-300 border border-gray-500 rounded cursor-pointer">
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer">
              Save
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <AssetsSection section="source" onDrop={handleDrop} onUpload={handleUpload} selectedAssets={selectedSourceAssets} onSelectAsset={handleSelectSourceAsset} isMultiSelect={true} />

        <AssetsSection section="target" onDrop={handleDrop} onUpload={handleUpload} selectedAssets={selectedTargetAsset ? new Set([selectedTargetAsset]) : new Set()} onSelectAsset={handleSelectTargetAsset} isMultiSelect={false} />
      </div>
    </div>
  );
};

export default AssetsLibrary;
