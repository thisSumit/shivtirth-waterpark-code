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
  type?: "image" | "video";
};

export default function MediaUploader({ value, onChange, accept = "image/*", type = "image" }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
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
    setUploading(true);
    setImageError(false);
    try {
      const url = await uploadAsset(file);
      onChange(url);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload file. Check if public storage bucket 'assets' exists in Supabase.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this file from storage?")) return;
    const oldUrl = value;
    onChange("");
    setMenuOpen(false);
    setImageError(false);
    if (oldUrl && oldUrl.startsWith("http")) {
      await deleteAsset(oldUrl);
    }
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

  const handleDeleteLibraryAsset = async (e: React.MouseEvent, asset: StorageAsset) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to permanently delete "${asset.name}" from Supabase storage?`)) return;

    setDeletingUrl(asset.url);
    try {
      const success = await deleteAsset(asset.url);
      if (success) {
        setLibraryAssets((prev) => prev.filter((item) => item.url !== asset.url));
        if (value === asset.url) {
          onChange("");
        }
      } else {
        alert("Failed to delete asset from Supabase storage.");
      }
    } catch (err) {
      console.error("Error deleting asset:", err);
      alert("Failed to delete asset.");
    } finally {
      setDeletingUrl(null);
    }
  };

  const mediaUrl = typeof value === "string" ? value.trim() : (value && typeof value === "object" && "src" in (value as any) ? String((value as any).src || "").trim() : "");
  const fileName = mediaUrl ? mediaUrl.split("/").pop() || "asset" : "";
  const isVideo = type === "video" || !!mediaUrl.match(/\.(mp4|webm|mov|ogg)$/i);

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
                    <div className="absolute right-0 mt-1 w-36 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-50 text-xs">
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
                        onClick={handleDelete}
                        className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition text-left"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          {/* File Upload Trigger */}
          <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl p-4 cursor-pointer hover:border-accent/40 bg-slate-950/40 hover:bg-slate-950/60 transition group">
            <Upload size={20} className="text-slate-500 group-hover:text-accent transition mb-2" />
            <span className="text-xs font-bold text-slate-400 group-hover:text-white transition uppercase tracking-wider">
              {uploading ? "Uploading..." : "Upload New File"}
            </span>
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
                  Click to select an asset, or hover to delete unused media directly from Supabase.
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
                    const isDeleting = deletingUrl === item.url;

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

                        {/* Delete asset directly from library modal */}
                        <button
                          type="button"
                          onClick={(e) => handleDeleteLibraryAsset(e, item)}
                          disabled={isDeleting}
                          title="Delete from Supabase Storage"
                          className="absolute top-2 right-2 p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg shadow opacity-0 group-hover:opacity-100 transition z-10 disabled:opacity-50"
                        >
                          {isDeleting ? (
                            <RefreshCw size={12} className="animate-spin" />
                          ) : (
                            <Trash2 size={12} />
                          )}
                        </button>

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
