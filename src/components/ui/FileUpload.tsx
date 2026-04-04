'use client';

import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, File as FileIcon, Image } from 'lucide-react';

interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onChange: (files: File[]) => void;
  preview?: boolean;
  className?: string;
}

export default function FileUpload({
  label,
  accept,
  multiple = false,
  maxSize = 10,
  onChange,
  preview = true,
  className = '',
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const processFiles = useCallback(
    (newFiles: FileList | File[]) => {
      setError('');
      const fileArray = Array.from(newFiles);
      const valid: File[] = [];
      const previewUrls: string[] = [];

      for (const file of fileArray) {
        if (file.size > maxSize * 1024 * 1024) {
          setError(`Le fichier "${file.name}" dépasse ${maxSize}Mo`);
          continue;
        }
        valid.push(file);
        if (preview && file.type.startsWith('image/')) {
          previewUrls.push(URL.createObjectURL(file));
        }
      }

      const result = multiple ? [...files, ...valid] : valid.slice(0, 1);
      const resultPreviews = multiple ? [...previews, ...previewUrls] : previewUrls.slice(0, 1);

      setFiles(result);
      setPreviews(resultPreviews);
      onChange(result);
    },
    [files, previews, maxSize, multiple, onChange, preview]
  );

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    if (previews[index]) URL.revokeObjectURL(previews[index]);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
    onChange(newFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
  };

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>}

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`
          relative flex flex-col items-center justify-center gap-2 p-6
          border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${dragOver ? 'border-primary-500 bg-primary-50' : 'border-border hover:border-primary-300 hover:bg-gray-50'}
        `}
      >
        <Upload size={24} className="text-muted" />
        <p className="text-sm text-muted text-center">
          <span className="text-primary-600 font-medium">Cliquer pour choisir</span> ou glisser-déposer
        </p>
        <p className="text-xs text-gray-400">Max {maxSize}Mo{accept ? ` — ${accept}` : ''}</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && processFiles(e.target.files)}
        />
      </div>

      {error && <p className="mt-1 text-xs text-danger">{error}</p>}

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
              {previews[i] ? (
                <img src={previews[i]} alt="" className="w-10 h-10 rounded object-cover" />
              ) : file.type.startsWith('image/') ? (
                <Image size={16} className="text-muted" />
              ) : (
                <FileIcon size={16} className="text-muted" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted">{(file.size / 1024).toFixed(0)} Ko</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="p-1 rounded hover:bg-gray-200 text-muted transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
