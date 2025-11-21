import React, { useRef } from 'react';
import { Upload, Link as LinkIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (val: string) => void;
  altText?: string;
  onAltTextChange?: (val: string) => void;
  label?: string;
  onRemove?: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  value, 
  onChange, 
  altText = '', 
  onAltTextChange, 
  label, 
  onRemove 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-4">
      {label && <label className="text-xs font-semibold text-gray-600 uppercase">{label}</label>}
      
      <div className="flex items-start gap-2">
        <div className="relative flex-1 group">
           {value ? (
               <div className="relative h-24 w-24 border rounded overflow-hidden bg-white">
                   <img src={value} alt="Preview" className="h-full w-full object-contain" />
                   <button 
                     onClick={() => onChange('')}
                     className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl"
                   >
                       <X size={12} />
                   </button>
               </div>
           ) : (
            <div className="flex items-center justify-center h-24 w-24 border-2 border-dashed border-gray-300 rounded text-gray-400 bg-gray-50">
                <span className="text-xs text-center px-1">No Image</span>
            </div>
           )}
        </div>

        <div className="flex-1 flex flex-col gap-2">
            {/* URL Input */}
            <div className="flex items-center border border-gray-300 rounded px-2 py-1 bg-white focus-within:ring-2 focus-within:ring-blue-500">
                <LinkIcon size={14} className="text-gray-400 mr-2" />
                <input 
                    type="text" 
                    placeholder="Paste Image URL..."
                    className="text-sm w-full outline-none bg-transparent text-gray-900 placeholder-gray-400"
                    value={value.startsWith('data:') ? '' : value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>

            {/* File Upload */}
            <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 px-2 rounded border border-gray-200 transition-colors"
            >
                <Upload size={14} />
                <span>Upload File (Base64)</span>
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
            />

            {/* Alt Text Input */}
            {onAltTextChange && (
              <div className="flex items-center border border-gray-300 rounded px-2 py-1 bg-white focus-within:ring-2 focus-within:ring-blue-500">
                  <input 
                      type="text" 
                      placeholder="Add Alt Text"
                      className="text-sm w-full outline-none bg-transparent text-gray-900 placeholder-gray-400"
                      value={altText}
                      onChange={(e) => onAltTextChange(e.target.value)}
                  />
              </div>
            )}
        </div>
        {onRemove && (
             <button onClick={onRemove} className="text-red-500 hover:text-red-700 p-1">
                 <X size={16} />
             </button>
        )}
      </div>
    </div>
  );
};
