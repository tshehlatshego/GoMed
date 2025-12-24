import { useState } from "react";
import { Upload, X } from "lucide-react";

export default function AddPicture() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    // TODO: Add Firebase upload or backend API call here
    console.log("Uploading file:", selectedFile.name);
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-brand-500/30 bg-brand-600/90 p-8 shadow-lg shadow-brand-900/20">
        <h1 className="mb-6 text-2xl font-bold text-white">Upload Picture</h1>

        {!selectedFile ? (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand-400/50 bg-brand-700/50 p-8 transition hover:border-brand-300/70 hover:bg-brand-700/70">
            <Upload className="mb-3 h-10 w-10 text-brand-300" />
            <span className="text-center text-sm font-medium text-white">
              Click to select a picture
            </span>
            <span className="mt-1 text-xs text-slate-300">
              or drag and drop
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        ) : (
          <div className="space-y-4">
            {preview && (
              <div className="overflow-hidden rounded-lg">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-48 w-full object-cover"
                />
              </div>
            )}
            <div className="flex items-center justify-between rounded-lg bg-brand-700/50 p-3">
              <div className="flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-300">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={handleRemoveFile}
                className="ml-2 rounded-md p-1 text-slate-300 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={handleUpload}
              className="w-full rounded-xl border border-brand-400/30 bg-brand-500/80 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-900/20 transition hover:-translate-y-0.5 hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Upload Picture
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
