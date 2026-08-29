"use client";

import React, { useState } from "react";
import { uploadAsset, deleteAsset } from "@/lib/supabase";
import { MoreVertical, Download, Trash2, Upload, File as FileIcon, ExternalLink, Image as ImageIcon, Film } from "lucide-react";

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

  const fileName = value ? value.split("/").pop() || "asset" : "";
  const isVideo = type === "video" || !!value.match(/\.(mp4|webm|mov|ogg)$/i);

  return (
    <div className="relative">
      {value ? (
        <div className="flex flex-col gap-3 bg-slate-950 border border-slate-800 rounded-2xl p-3 text-white">
          <div className="flex items-center justify-between gap-3">
            {/* Visual Thumbnail Preview */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group shrink-0"
                title="Click to view full media"
              >
                {isVideo ? (
                  <div className="w-14 h-14 rounded-xl border border-slate-800 bg-black overflow-hidden relative flex items-center justify-center">
                    <video
                      src={value}
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
                      src={value}
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
                <span className="text-[10px] text-slate-500 block truncate mt-0.5" title={value}>
                  {value}
                </span>
              </div>
            </div>

            {/* Menu Options Button */}
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
      ) : (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl p-4 cursor-pointer hover:border-accent/40 bg-slate-950/40 hover:bg-slate-950/60 transition group">
          <Upload size={20} className="text-slate-500 group-hover:text-accent transition mb-2" />
          <span className="text-xs font-bold text-slate-400 group-hover:text-white transition uppercase tracking-wider">
            {uploading ? "Uploading..." : "Upload File"}
          </span>
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}
