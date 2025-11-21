import React, { useState } from 'react';
import { ListingData, ComparisonItem } from '../types';
import { ImageUploader } from './ImageUploader';
import { generateDescription, optimizeTitle } from '../services/geminiService';
import { Sparkles, Trash2, Plus, Loader2 } from 'lucide-react';
import { ACCOUNTS } from '../constants';

interface EditorProps {
  data: ListingData;
  onChange: (newData: ListingData) => void;
}

export const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isOptimizingTitle, setIsOptimizingTitle] = useState(false);

  const updateField = <K extends keyof ListingData>(field: K, value: ListingData[K]) => {
    onChange({ ...data, [field]: value });
  };

  const handleGenerateDescription = async () => {
    if(!data.title) return;
    setIsGeneratingDesc(true);
    const desc = await generateDescription(data.title, data.specifications.join(', '));
    updateField('description', desc);
    setIsGeneratingDesc(false);
  };

  const handleOptimizeTitle = async () => {
    if(!data.title) return;
    setIsOptimizingTitle(true);
    const newTitle = await optimizeTitle(data.title);
    updateField('title', newTitle);
    setIsOptimizingTitle(false);
  };

  // Main Images Handlers
  const handleMainImageChange = (index: number, val: string) => {
    const newImages = [...data.mainImages];
    newImages[index] = { ...newImages[index], url: val };
    updateField('mainImages', newImages);
  };

  const handleMainImageAltChange = (index: number, val: string) => {
    const newImages = [...data.mainImages];
    newImages[index] = { ...newImages[index], alt: val };
    updateField('mainImages', newImages);
  };

  const addMainImage = () => {
    updateField('mainImages', [...data.mainImages, { url: '', alt: '' }]);
  };

  const removeMainImage = (index: number) => {
    updateField('mainImages', data.mainImages.filter((_, i) => i !== index));
  };

  // Comparison Items Handlers
  const handleCompChange = (index: number, field: keyof ComparisonItem, val: string) => {
    const newItems = [...data.comparisonItems];
    newItems[index] = { ...newItems[index], [field]: val };
    updateField('comparisonItems', newItems);
  };

  // String Array Handlers (Specs, etc)
  const handleArrayChange = (field: 'specifications' | 'packageIncludes' | 'aboutItems', index: number, val: string) => {
    const newArr = [...data[field]];
    newArr[index] = val;
    updateField(field, newArr);
  };

  const addArrayItem = (field: 'specifications' | 'packageIncludes' | 'aboutItems') => {
     updateField(field, [...data[field], '']);
  };

  const removeArrayItem = (field: 'specifications' | 'packageIncludes' | 'aboutItems', index: number) => {
     updateField(field, data[field].filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 space-y-6 pb-20 bg-gray-900">
        
        {/* Section: Basic Info */}
        <section className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-3 flex items-center gap-2">
                <span className="text-blue-400">●</span> Basic Information
            </h3>
            
            {/* Account Selector */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    <span className="flex items-center gap-2">
                        <span className="text-blue-400">●</span>
                        Account Selection
                        <span className="text-xs text-gray-500 font-normal">(Internal use only)</span>
                    </span>
                </label>
                <div className="relative">
                    <select 
                        value={data.accountId} 
                        onChange={(e) => updateField('accountId', e.target.value)}
                        className="w-full appearance-none border border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 rounded-lg px-4 py-3 pr-10 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer hover:border-blue-600 transition-all"
                    >
                        {ACCOUNTS.map(account => (
                            <option key={account.id} value={account.id} className="bg-gray-800">
                                {account.name} (ID: {account.id})
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-blue-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                        </svg>
                    </div>
                </div>
                <p className="mt-2 text-xs text-gray-500 italic flex items-center gap-1">
                    <span className="text-blue-400">ℹ️</span> This is for internal tracking only and will not appear in the eBay listing
                </p>
            </div>
            
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Product Title</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={data.title} 
                        onChange={(e) => updateField('title', e.target.value)}
                        className="flex-1 border border-gray-700 bg-gray-900 text-gray-100 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-600"
                        placeholder="Enter product title"
                    />
                    <button 
                        onClick={handleOptimizeTitle}
                        disabled={isOptimizingTitle}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg text-sm hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 shadow-lg"
                    >
                        {isOptimizingTitle ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>}
                        Optimize
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <div className="relative">
                    <textarea 
                        value={data.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        rows={4}
                        className="w-full border border-gray-700 bg-gray-900 text-gray-100 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-600"
                        placeholder="Enter product description"
                    />
                    <button 
                        onClick={handleGenerateDescription}
                        disabled={isGeneratingDesc}
                        className="absolute bottom-3 right-3 text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-lg"
                    >
                        {isGeneratingDesc ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                        AI Write
                    </button>
                </div>
            </div>
        </section>

        {/* Section: Main Images */}
        <section className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700">
             <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-3 flex items-center gap-2">
                 <span className="text-green-400">●</span> Main Images
             </h3>
             <div className="grid grid-cols-1 gap-4">
                 {data.mainImages.map((img, idx) => (
                     <ImageUploader 
                        key={idx} 
                        value={img.url} 
                        altText={img.alt}
                        label={`Image ${idx + 1}`}
                        onChange={(val) => handleMainImageChange(idx, val)} 
                        onAltTextChange={(val) => handleMainImageAltChange(idx, val)}
                        onRemove={() => removeMainImage(idx)}
                    />
                 ))}
                 <button onClick={addMainImage} className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-700 rounded-xl text-gray-400 hover:bg-gray-800 hover:border-blue-500 hover:text-blue-400 transition-all">
                     <Plus size={16} /> Add Image
                 </button>
             </div>
        </section>

        {/* Section: Comparison Table */}
        <section className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-3 flex items-center gap-2">
                <span className="text-purple-400">●</span> Comparison Table
            </h3>
            <div className="space-y-4">
                {data.comparisonItems.map((item, idx) => (
                    <div key={item.id} className="border border-gray-700 rounded-lg p-4 bg-gray-900">
                        <div className="flex justify-between items-center mb-3">
                             <h4 className="text-sm font-bold text-gray-300">Item {idx + 1}</h4>
                        </div>
                        <ImageUploader 
                            value={item.image} 
                            altText={item.imageAlt}
                            onChange={(val) => handleCompChange(idx, 'image', val)} 
                            onAltTextChange={(val) => handleCompChange(idx, 'imageAlt', val)}
                            label="Product Image" 
                        />
                        
                        <div className="grid grid-cols-2 gap-2 mt-3">
                            <input type="text" placeholder="Title" className="border border-gray-700 bg-gray-800 text-gray-100 p-2.5 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-600" value={item.title} onChange={(e) => handleCompChange(idx, 'title', e.target.value)} />
                            <input type="text" placeholder="Price (e.g. £10)" className="border border-gray-700 bg-gray-800 text-gray-100 p-2.5 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-600" value={item.price} onChange={(e) => handleCompChange(idx, 'price', e.target.value)} />
                            <input type="text" placeholder="Material" className="border border-gray-700 bg-gray-800 text-gray-100 p-2.5 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-600" value={item.material} onChange={(e) => handleCompChange(idx, 'material', e.target.value)} />
                            <input type="text" placeholder="Base (e.g. E27)" className="border border-gray-700 bg-gray-800 text-gray-100 p-2.5 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-600" value={item.base} onChange={(e) => handleCompChange(idx, 'base', e.target.value)} />
                            <input type="text" placeholder="eBay Link URL" className="border border-gray-700 bg-gray-800 text-gray-100 p-2.5 rounded-lg text-xs col-span-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-600" value={item.link} onChange={(e) => handleCompChange(idx, 'link', e.target.value)} />
                        </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Section: Details Lists */}
        <section className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-3">Product Details</h3>
            
            {/* Specs */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Specifications (Bullet Points)</label>
                {data.specifications.map((spec, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                        <input className="flex-1 border border-gray-700 bg-gray-900 text-gray-100 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-600" value={spec} onChange={(e) => handleArrayChange('specifications', idx, e.target.value)} placeholder="e.g. Color: Blue"/>
                        <button onClick={() => removeArrayItem('specifications', idx)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                    </div>
                ))}
                <button onClick={() => addArrayItem('specifications')} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"><Plus size={12}/> Add Spec</button>
            </div>

             {/* About Items */}
             <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">About This Item (Features)</label>
                {data.aboutItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                        <textarea rows={2} className="flex-1 border border-gray-700 bg-gray-900 text-gray-100 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-600" value={item} onChange={(e) => handleArrayChange('aboutItems', idx, e.target.value)} placeholder="e.g. Feature Name: Description"/>
                        <button onClick={() => removeArrayItem('aboutItems', idx)} className="text-red-400 hover:text-red-600 self-center"><Trash2 size={16}/></button>
                    </div>
                ))}
                 <button onClick={() => addArrayItem('aboutItems')} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"><Plus size={12}/> Add Feature</button>
            </div>
        </section>

        {/* Section: Branding */}
        <section className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-3">Store Branding</h3>
            <ImageUploader 
                value={data.logoUrl} 
                altText={data.logoAlt}
                onChange={(val) => updateField('logoUrl', val)} 
                onAltTextChange={(val) => updateField('logoAlt', val)}
                label="Store Logo" 
            />
            <div className="mt-2">
                <label className="text-xs font-semibold text-gray-400 uppercase">eBay Store URL</label>
                <input type="text" className="w-full border border-gray-700 bg-gray-900 text-gray-100 rounded p-2 text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-600" value={data.ebayStoreUrl} onChange={(e) => updateField('ebayStoreUrl', e.target.value)} placeholder="https://www.ebay.co.uk/str/..." />
            </div>
             <div className="mt-4">
                <label className="text-xs font-semibold text-gray-400 uppercase">About Us Text</label>
                <textarea className="w-full border border-gray-700 bg-gray-900 text-gray-100 rounded p-2 text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-600" rows={3} value={data.aboutUs} onChange={(e) => updateField('aboutUs', e.target.value)} placeholder="Enter store description..." />
            </div>
        </section>

    </div>
  );
};
