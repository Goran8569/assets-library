import React, { createContext, useContext, useState, useEffect } from "react";
import { Asset, Section } from "../types/assets";

interface AssetsContextType {
  assets: Asset[];
  addAsset: (asset: Asset) => void;
  deleteAsset: (id: string) => void;
  moveAsset: (id: string, targetSection: Section) => void;
}

const AssetsContext = createContext<AssetsContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAssets = () => {
  const context = useContext(AssetsContext);
  if (!context) {
    throw new Error("useAssets must be used within an AssetsProvider");
  }
  return context;
};

export const AssetsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>(() => {
    const savedAssets = localStorage.getItem("assets");
    return savedAssets ? JSON.parse(savedAssets) : [];
  });

  useEffect(() => {
    localStorage.setItem("assets", JSON.stringify(assets));
  }, [assets]);

  const addAsset = (asset: Asset) => {
    setAssets((prev) => [...prev, asset]);
  };

  const deleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((asset) => asset.id !== id));
  };

  const moveAsset = (id: string, targetSection: Section) => {
    setAssets((prev) => prev.map((asset) => (asset.id === id ? { ...asset, section: targetSection } : asset)));
  };

  return <AssetsContext.Provider value={{ assets, addAsset, deleteAsset, moveAsset }}>{children}</AssetsContext.Provider>;
};
