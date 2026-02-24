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
    <div className="flex flex-col gap-3 mb-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
      {label && <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">{label}</label>}
      
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0 group">
           {value ? (
               <div className="relative h-24 w-24 border border-gray-700 rounded-lg overflow-hidden bg-gray-800 hover:border-blue-500 transition-colors">
                   <img src={value} alt="Preview" className="h-full w-full object-contain" />
                   <button 
                     onClick={() => onChange('')}
                     className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded transition-colors"
                   >
                       <X size={12} />
                   </button>
               </div>
           ) : (
            <div className="flex items-center justify-center h-24 w-24 border-2 border-dashed border-gray-700 rounded-lg text-gray-500 bg-gray-800/50 hover:border-blue-500 transition-colors">
                <span className="text-xs text-center px-1">No Image</span>
            </div>
           )}
        </div>

        <div className="flex-1 flex flex-col gap-2">
            {/* URL Input with Label */}
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 flex items-center gap-1">
                    <span className="text-blue-400">●</span> URL
                </label>
                <div className="flex items-center border border-gray-700 rounded-lg px-3 py-2 bg-gray-800 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                    <LinkIcon size={14} className="text-gray-500 mr-2" />
                    <input 
                        type="text" 
                        placeholder="https://example.com/image.jpg"
                        className="text-sm w-full outline-none bg-transparent text-gray-100 placeholder-gray-600"
                        value={value.startsWith('data:') ? '' : value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                </div>
            </div>

            {/* File Upload Button */}
            <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 px-3 rounded-lg border border-gray-700 hover:border-blue-500 transition-all"
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

            {/* Alt Text Input with Label */}
            {onAltTextChange && (
              <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 flex items-center gap-1">
                      <span className="text-green-400">●</span> Alt Text
                  </label>
                  <div className="flex items-center border border-gray-700 rounded-lg px-3 py-2 bg-gray-800 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 transition-all">
                      <input 
                          type="text" 
                          placeholder="Add Alt Text"
                          className="text-sm w-full outline-none bg-transparent text-gray-100 placeholder-gray-600"
                          value={altText}
                          onChange={(e) => onAltTextChange(e.target.value)}
                      />
                  </div>
              </div>
            )}
        </div>
        {onRemove && (
             <button onClick={onRemove} className="text-red-400 hover:text-red-300 p-2 hover:bg-gray-800 rounded-lg transition-colors">
                 <X size={16} />
             </button>
        )}
      </div>
    </div>
  );
};