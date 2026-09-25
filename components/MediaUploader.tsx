"use client";

import React, { useState, useEffect } from "react";
import { uploadAsset, deleteAsset, listAssets, StorageAsset } from "@/lib/supabase";
import { 
  MoreVertical, 
  Download, 
  Trash2, 
  Upload, 
  ExternalLink, 
  Image as ImageIcon, 
  Film, 
  FolderOpen, 
  X, 
  Check, 
  Play, 
  RefreshCw,
  Search
} from "lucide-react";

type MediaUploaderProps = {
  value: string;
  onChange: (newValue: string) => void;
  accept?: string;
  type?: "image" | "video" | "all";
};

export default function MediaUploader({ value, onChange, accept = "image/*", type = "image" }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryAssets, setLibraryAssets] = useState<StorageAsset[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const targetInput = e.target;
    setUploading(true);
    setUploadProgress(0);
    setImageError(false);
    try {
      const url = await uploadAsset(file, (percent) => setUploadProgress(percent));
      onChange(url);
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(`Upload Failed: ${err.message || "Could not upload file to Supabase storage."}\n\nTip: You can use direct local video paths (e.g. /main.mp4) or quick preset buttons below.`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (targetInput) targetInput.value = "";
    }
  };

  const handleUnattach = () => {
    onChange("");
    setMenuOpen(false);
    setImageError(false);
  };

  const openLibrary = async () => {
    setLibraryOpen(true);
    setLoadingLibrary(true);
    setSearchQuery("");
    try {
      const data = await listAssets();
      setLibraryAssets(data);
    } catch (err) {
      console.error("Error loading library assets:", err);
    } finally {
      setLoadingLibrary(false);
    }
  };

  const mediaUrl = typeof value === "string" ? value.trim() : (value && typeof value === "object" && "src" in (value as any) ? String((value as any).src || "").trim() : "");
  const fileName = mediaUrl ? mediaUrl.split("/").pop() || "asset" : "";
  const isVideo = type === "video" || (type !== "image" && !!mediaUrl.split('?')[0].match(/\.(mp4|webm|mov|ogg|m4v|m3u8)$/i));

  const filteredLibrary = libraryAssets.filter((item) => {
    const matchesType = type === "video" ? item.is_video : type === "image" ? !item.is_video : true;
    const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesType && matchesSearch;
  });

  return (
    <div className="relative">
      {mediaUrl ? (
        <div className="flex flex-col gap-3 bg-slate-950 border border-slate-800 rounded-2xl p-3 text-white">
          <div className="flex items-center justify-between gap-3">
            {/* Visual Thumbnail Preview */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <a
                href={mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group shrink-0"
                title="Click to view full media"
              >
                {isVideo ? (
                  <div className="w-14 h-14 rounded-xl border border-slate-800 bg-black overflow-hidden relative flex items-center justify-center">
                    <video
                      key={mediaUrl}
                      src={mediaUrl}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition">
                      <Film size={18} className="text-white" />
                    </div>
                  </div>
                ) : imageError ? (
                  <div className="w-14 h-14 rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-center text-slate-500 shrink-0">
                    <ImageIcon size={20} />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl border border-slate-800 bg-slate-900 overflow-hidden relative group shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      key={mediaUrl}
                      src={mediaUrl}
                      alt="Uploaded media preview"
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                      onError={() => setImageError(true)}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <ExternalLink size={14} className="text-white" />
                    </div>
                  </div>
                )}
              </a>

              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-white block truncate" title={fileName}>
                  {fileName}
                </span>
                <span className="text-[10px] text-slate-500 block truncate mt-0.5" title={mediaUrl}>
                  {mediaUrl}
                </span>
              </div>
            </div>

            {/* Menu Options & Change Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={openLibrary}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-[11px] font-bold uppercase transition flex items-center gap-1.5"
                title="Replace from Media Assets Library"
              >
                <FolderOpen size={13} />
                Library
              </button>

              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-white transition border border-slate-800/60"
                >
                  <MoreVertical size={16} />
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 mt-1 w-40 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-50 text-xs">
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 transition"
                        onClick={() => setMenuOpen(false)}
                      >
                        <ExternalLink size={12} />
                        Full Preview
                      </a>
                      <a
                        href={value}
                        download
                        className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 transition"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Download size={12} />
                        Download
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          const newUrl = prompt("Edit Media URL:", value);
                          if (newUrl !== null) {
                            onChange(newUrl);
                          }
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 transition text-left"
                      >
                        <ExternalLink size={12} />
                        Edit URL
                      </button>
                      <button
                        type="button"
                        onClick={handleUnattach}
                        className="w-full flex items-center gap-2 px-3 py-2 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition text-left"
                        title="Unattach media from this field without deleting the file from storage"
                      >
                        <X size={12} />
                        Unattach Media
                      </button>
                      {mediaUrl && (mediaUrl.includes("/storage/v1/object/public/") || mediaUrl.includes("supabase.co") || mediaUrl.includes("/assets/")) && (
                        <button
                          type="button"
                          onClick={async () => {
                            if (confirm("Are you sure you want to permanently delete this asset file from storage?")) {
                              setUploading(true);
                              await deleteAsset(mediaUrl);
                              onChange("");
                              setUploading(false);
                              setMenuOpen(false);
                            }
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition text-left font-semibold"
                          title="Permanently delete this file from Supabase storage"
                        >
                          <Trash2 size={12} />
                          Delete File from Storage
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* File Upload Trigger */}
            <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl p-4 cursor-pointer hover:border-accent/40 bg-slate-950/40 hover:bg-slate-950/60 transition group">
              {uploading ? (
                <div className="flex flex-col items-center gap-1">
                  <RefreshCw size={20} className="text-amber-400 animate-spin mb-1" />
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Uploading... {uploadProgress > 0 ? `${uploadProgress}%` : ''}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setUploading(false);
                      setUploadProgress(0);
                    }}
                    className="text-[10px] text-red-400 underline hover:text-red-300 mt-1"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={20} className="text-slate-500 group-hover:text-accent transition mb-2" />
                  <span className="text-xs font-bold text-slate-400 group-hover:text-white transition uppercase tracking-wider">
                    Upload New File
                  </span>
                </>
              )}
              <input
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>

            {/* Library Picker Trigger */}
            <button
              type="button"
              onClick={openLibrary}
              className="flex-1 flex flex-col items-center justify-center border border-slate-800 rounded-2xl p-4 hover:border-accent/40 bg-slate-900/60 hover:bg-slate-900 transition group"
            >
              <FolderOpen size={20} className="text-accent/80 group-hover:text-accent transition mb-2" />
              <span className="text-xs font-bold text-slate-300 group-hover:text-white transition uppercase tracking-wider">
                Choose from Library
              </span>
            </button>
          </div>

          <div className="space-y-1.5">
            <input
              type="text"
              placeholder={type === "video" ? "Or paste video URL (e.g. /main.mp4 or https://...)" : "Or paste image URL (e.g. /Water-Park.jpg)"}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-accent"
            />
            {type === "video" && (
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Presets:</span>
                <button
                  type="button"
                  onClick={() => onChange("/main.mp4")}
                  className="text-[10px] px-2 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-amber-400 font-medium transition"
                >
                  Use /main.mp4
                </button>
                <button
                  type="button"
                  onClick={() => onChange("/hero.mp4")}
                  className="text-[10px] px-2 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 font-medium transition"
                >
                  Use /hero.mp4
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Asset Library Picker Modal Overlay */}
      {libraryOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <FolderOpen className="text-accent" size={20} />
                  Media Assets Library ({type.toUpperCase()})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click to select an asset for this field. (To permanently delete files from storage, manage them on the Media Assets page).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search library..."
                    className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-accent w-44"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setLibraryOpen(false)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition shrink-0"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {loadingLibrary ? (
                <div className="py-20 flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent border-r-2" />
                </div>
              ) : filteredLibrary.length === 0 ? (
                <div className="py-16 text-center text-slate-500 space-y-2">
                  <FolderOpen size={36} className="mx-auto text-slate-700" />
                  <p className="text-sm font-semibold">No {type} assets found in library.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredLibrary.map((item) => {
                    const isSelected = mediaUrl === item.url;

                    return (
                      <div
                        key={item.url}
                        onClick={() => {
                          onChange(item.url);
                          setLibraryOpen(false);
                        }}
                        className={`relative aspect-square rounded-2xl overflow-hidden border cursor-pointer group transition ${
                          isSelected ? "border-accent ring-2 ring-accent/40" : "border-slate-800 hover:border-slate-600"
                        }`}
                      >
                        {item.is_video ? (
                          <div className="w-full h-full relative bg-slate-950">
                            <video
                              key={item.url}
                              src={item.url}
                              className="w-full h-full object-cover"
                              muted
                              preload="metadata"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition flex items-center justify-center">
                              <Play size={20} className="text-white fill-white/80" />
                            </div>
                          </div>
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={item.url}
                            src={item.url}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        )}

                        {isSelected && (
                          <div className="absolute top-2 left-2 bg-accent text-black p-1 rounded-full shadow z-10">
                            <Check size={14} />
                          </div>
                        )}

                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2">
                          <p className="text-[10px] font-bold text-white truncate">{item.name}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
