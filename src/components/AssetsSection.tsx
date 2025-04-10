import { useRef, useState, useEffect } from "react";
import { Section, AssetType } from "../types/assets";
import { useAssets } from "../context/AssetsContext";
import AddIcon from "@material-symbols/svg-400/outlined/add_circle.svg";
import DeleteIcon from "@material-symbols/svg-400/outlined/delete.svg";
import AudioIcon from "@material-symbols/svg-400/outlined/music_note.svg";
import ImageIcon from "@material-symbols/svg-400/outlined/image.svg";
import VideoIcon from "@material-symbols/svg-400/outlined/movie.svg";
import QuestionIcon from "@material-symbols/svg-400/outlined/question_mark.svg";

export const AssetsSection: React.FC<{
  section: Section;
  onDrop: (e: React.DragEvent, section: Section) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>, section: Section) => void;
  selectedAssets: Set<string>;
  onSelectAsset: (assetId: string) => void;
  isMultiSelect: boolean;
}> = ({ section, onDrop, onUpload, selectedAssets, onSelectAsset }) => {
  const { assets, deleteAsset } = useAssets();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [, setIsFileBeingDragged] = useState(false);
  const [filter, setFilter] = useState<"all" | AssetType>("all");

  const sectionAssets = assets.filter((asset) => asset.section === section && (filter === "all" || asset.type === filter));

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    setIsFileBeingDragged(false);
    onDrop(e, section);
  };

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.types.includes("Files")) {
        setIsFileBeingDragged(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (!e.relatedTarget || !(e.relatedTarget instanceof Node) || !document.body.contains(e.relatedTarget)) {
        setIsFileBeingDragged(false);
      }
    };

    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("drop", () => setIsFileBeingDragged(false));

    return () => {
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("drop", () => setIsFileBeingDragged(false));
    };
  }, []);

  const getExtension = (fileName: string) => {
    return fileName.split(".")[1];
  };

  const getExtensionIcon = (fileName: string) => {
    const extension = fileName.split(".")[1];

    switch (extension) {
      case "jpg":
        return ImageIcon;
      case "png":
        return ImageIcon;
      case "mp4":
        return VideoIcon;
      case "mp3":
        return AudioIcon;
      default:
        return QuestionIcon;
    }
  };

  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-md p-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold mb-4 capitalize">{section} Section</h2>
        <select className="rounded-lg cursor-pointer" value={filter} onChange={(e) => setFilter(e.target.value as "all" | AssetType)}>
          <option value="all">All</option>
          <option value="image">Images</option>
          <option value="audio">Audios</option>
          <option value="video">Videos</option>
        </select>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-4 items-start">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 w-40 h-35 flex flex-col items-center justify-center transition-colors cursor-pointer ${isDraggingOver ? "border-blue-500 bg-blue-900" : "border-gray-600 bg-gray-700"}`}
          >
            <img src={AddIcon} alt="Add" className="filter invert" />
            <input ref={fileInputRef} type="file" className="hidden" multiple accept="image/*,audio/*,video/*" onChange={(e) => e.target.files && onUpload(e, section)} />
          </div>

          {sectionAssets.map((asset) => (
            <div
              key={asset.id}
              className={`relative group bg-gray-600 w-44 p-2 rounded-sm cursor-grab ${selectedAssets.has(asset.id) ? "border-2 border-blue-500" : ""}`}
              draggable
              onClick={() => onSelectAsset(asset.id)}
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", asset.id);
              }}
            >
              <div className="aspect-video w-40 rounded-lg overflow-hidden bg-gray-100 border">
                {asset.type === "image" && <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />}
                {asset.type === "video" && <video src={asset.url} className="w-full h-full object-cover" />}
                {asset.type === "audio" && <audio src={asset.url} className="w-full mt-8" />}
              </div>
              <button onClick={() => deleteAsset(asset.id)} className="absolute top-1 right-1 p-1 bg-red-400 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity w-7">
                <img src={DeleteIcon} className="w-5" alt="Delete" />
              </button>

              <p className="mt-2 flex p-1 justify-center text-sm text-white truncate bg-gray-400 text-center rounded-sm">
                <img className="w-5 mr-2" src={getExtensionIcon(asset.name)} />
                {getExtension(asset.name)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
