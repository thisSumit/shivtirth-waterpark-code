"use client";

import React, { useState, useEffect, useMemo } from "react";
import { listAssets, deleteAsset, uploadAsset, StorageAsset } from "@/lib/supabase";
import { 
  FolderOpen, 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink, 
  Search, 
  Filter, 
  Image as ImageIcon, 
  Video, 
  RefreshCw,
  Play
} from "lucide-react";

export default function AdminAssetsPage() {
  const [assets, setAssets] = useState<StorageAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "image" | "video">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fetchAssetsList = async () => {
    setLoading(true);
    try {
      const data = await listAssets();
      setAssets(data);
    } catch (err) {
      console.error("Error fetching assets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssetsList();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        await uploadAsset(files[i]);
      }
      await fetchAssetsList();
      alert("Media uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload media. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteMedia = async (asset: StorageAsset) => {
    if (!confirm(`Are you sure you want to permanently delete "${asset.name}" from storage?`)) return;

    setLoading(true);
    try {
      const success = await deleteAsset(asset.url);
      if (success) {
        setAssets((prev) => prev.filter((item) => item.url !== asset.url));
      } else {
        alert("Failed to delete asset from storage.");
      }
    } catch (err) {
      console.error("Error deleting asset:", err);
      alert("Failed to delete asset.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filteredAssets = useMemo(() => {
    return assets.filter((item) => {
      const matchesType =
        filterType === "all"
          ? true
          : filterType === "video"
          ? item.is_video
          : !item.is_video;

      const matchesSearch =
        !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase().trim());

      return matchesType && matchesSearch;
    });
  }, [assets, filterType, searchQuery]);

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return "Unknown size";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const imageCount = useMemo(() => assets.filter((a) => !a.is_video).length, [assets]);
  const videoCount = useMemo(() => assets.filter((a) => a.is_video).length, [assets]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-wide flex items-center gap-3">
            <FolderOpen className="text-accent" size={32} />
            Media Assets Library
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse, manage, filter, reuse, and delete all uploaded images and video files stored in Supabase.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAssetsList}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold text-xs uppercase py-3 px-4 rounded-xl transition shrink-0"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <label className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-black font-black uppercase text-xs py-3 px-5 rounded-xl cursor-pointer shadow-lg transition tracking-wider shrink-0">
            <Upload size={16} />
            {uploading ? "Uploading..." : "Upload New Media"}
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 w-full md:w-auto">
          <button
            onClick={() => setFilterType("all")}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
              filterType === "all"
                ? "bg-accent text-black font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All ({assets.length})
          </button>
          <button
            onClick={() => setFilterType("image")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
              filterType === "image"
                ? "bg-accent text-black font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ImageIcon size={14} /> Images ({imageCount})
          </button>
          <button
            onClick={() => setFilterType("video")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
              filterType === "video"
                ? "bg-accent text-black font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Video size={14} /> Videos ({videoCount})
          </button>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by file name..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Media Grid Display */}
      {loading ? (
        <div className="py-24 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-accent border-r-2"></div>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center">
          <FolderOpen size={48} className="mx-auto mb-3 text-slate-600" />
          <p className="text-base font-bold text-white uppercase tracking-wide">No Media Assets Found</p>
          <p className="text-xs text-slate-400 mt-1">
            {searchQuery
              ? `No file matching "${searchQuery}"`
              : "Upload images or video clips using the button above."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredAssets.map((asset) => (
            <div
              key={asset.url}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group transition"
            >
              <div>
                {/* Media Preview Box */}
                <div className="relative aspect-video bg-slate-950 overflow-hidden flex items-center justify-center border-b border-slate-800/80">
                  {asset.is_video ? (
                    <div className="w-full h-full relative group">
                      <video
                        src={asset.url}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                        onMouseOver={(e) => (e.currentTarget as HTMLVideoElement).play()}
                        onMouseOut={(e) => (e.currentTarget as HTMLVideoElement).pause()}
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition pointer-events-none">
                        <Play size={24} className="text-white fill-white/80" />
                      </div>
                      <span className="absolute top-2 left-2 bg-blue-500/90 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded-md flex items-center gap-1 z-10 shadow">
                        <Video size={10} /> VIDEO
                      </span>
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = "none";
                        }}
                      />
                      <span className="absolute top-2 left-2 bg-emerald-500/90 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                        <ImageIcon size={10} /> IMAGE
                      </span>
                    </div>
                  )}
                </div>

                {/* Info Area */}
                <div className="p-3.5 space-y-1">
                  <p className="text-xs font-bold text-white truncate" title={asset.name}>
                    {asset.name}
                  </p>
                  <p className="text-[10px] font-mono text-slate-500">
                    {formatFileSize(asset.size)}
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-3 bg-slate-950/60 border-t border-slate-800/60 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopyUrl(asset.url)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold uppercase rounded-lg transition"
                  title="Copy direct file URL"
                >
                  {copiedUrl === asset.url ? (
                    <>
                      <Check size={12} className="text-green-400" />
                      <span className="text-green-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <a
                  href={asset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition shrink-0"
                  title="Open full view"
                >
                  <ExternalLink size={13} />
                </a>

                <button
                  onClick={() => handleDeleteMedia(asset)}
                  className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition shrink-0"
                  title="Delete Media File"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
