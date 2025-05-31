
import React, { useState, useCallback, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { Upload, X, User } from 'lucide-react';
import { Button } from './button';

interface ProfilePictureUploadProps {
  onFileSelect: (file: File | null) => void;
  error?: string;
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ onFileSelect, error }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      return 'Only PNG and JPEG files are allowed';
    }
    
    // Check file size (10MB = 10 * 1024 * 1024 bytes)
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB';
    }
    
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      onFileSelect(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      onFileSelect(file);
    };
    reader.readAsDataURL(file);
  }, [onFileSelect]);

  const [{ isOver }, drop] = useDrop({
    accept: NativeTypes.FILE,
    drop: (item: { files: File[] }) => {
      if (item.files && item.files[0]) {
        handleFile(item.files[0]);
      }
    },
    hover: () => setIsDragging(true),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onFileSelect(null);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Profile Picture</label>
      <div
        ref={drop}
        onClick={handleClick}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          isOver || isDragging
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400'
        } ${error ? 'border-destructive' : ''}`}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={() => setIsDragging(false)}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileInput}
        />
        
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Profile preview"
              className="w-24 h-24 rounded-full object-cover mx-auto"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={removeFile}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <User className="w-12 h-12 mx-auto text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">
                Drag and drop your profile picture here, or click to browse files
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG or JPEG, max 10MB
              </p>
            </div>
            <Upload className="w-6 h-6 mx-auto text-gray-400" />
          </div>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
