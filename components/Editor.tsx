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

    // Batch multiple field updates into a single onChange to avoid
    // clobbering one update with another when calling updateField
    // multiple times in quick succession.
    const updateMultiple = (patch: Partial<ListingData>) => {
        onChange({ ...data, ...patch } as ListingData);
    };

    const handleGenerateDescription = async () => {
        if (!data.title) return;
        setIsGeneratingDesc(true);
        const desc = await generateDescription(data.title, data.specifications.join(', '));
        updateField('description', desc);
        setIsGeneratingDesc(false);
    };

    const handleOptimizeTitle = async () => {
        if (!data.title) return;
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

    const handleMainImageLinkChange = (index: number, val: string) => {
        const newImages = [...data.mainImages];
        newImages[index] = { ...newImages[index], link: val };
        updateField('mainImages', newImages);
    };

    const handleMainImageTitleChange = (index: number, val: string) => {
        const newImages = [...data.mainImages];
        newImages[index] = { ...newImages[index], title: val };
        updateField('mainImages', newImages);
    };

    const handleMainImageDetailsChange = (index: number, val: string) => {
        const newImages = [...data.mainImages];
        newImages[index] = { ...newImages[index], details: val };
        updateField('mainImages', newImages);
    };

    const handleMainImageBulletChange = (index: number, bulletIndex: number, val: string) => {
        const newImages = [...data.mainImages];
        const existing = newImages[index].bullets ? [...newImages[index].bullets!] : [];
        existing[bulletIndex] = val;
        newImages[index] = { ...newImages[index], bullets: existing };
        updateField('mainImages', newImages);
    };

    const addMainImageBullet = (index: number) => {
        const newImages = [...data.mainImages];
        const existing = newImages[index].bullets ? [...newImages[index].bullets!] : [];
        existing.push('');
        newImages[index] = { ...newImages[index], bullets: existing };
        updateField('mainImages', newImages);
    };

    const removeMainImageBullet = (index: number, bIndex: number) => {
        const newImages = [...data.mainImages];
        const existing = newImages[index].bullets ? newImages[index].bullets!.filter((_, i) => i !== bIndex) : [];
        newImages[index] = { ...newImages[index], bullets: existing };
        updateField('mainImages', newImages);
    };

    const addMainImage = () => {
        updateField('mainImages', [...data.mainImages, { url: '', alt: '', link: '', title: '', details: '', bullets: [] }]);
    };

    // Feature Images (4-up) Handlers — separate section for the 4-image block
    const handleFeatureImageChange = (index: number, val: string) => {
        const newImages = [...(data.featureImages || [])];
        newImages[index] = { ...newImages[index], url: val } as any;
        updateField('featureImages' as any, newImages as any);
    };

    const handleFeatureImageAltChange = (index: number, val: string) => {
        const newImages = [...(data.featureImages || [])];
        newImages[index] = { ...newImages[index], alt: val } as any;
        updateField('featureImages' as any, newImages as any);
    };

    const handleFeatureImageLinkChange = (index: number, val: string) => {
        const newImages = [...(data.featureImages || [])];
        newImages[index] = { ...newImages[index], link: val } as any;
        updateField('featureImages' as any, newImages as any);
    };

    const handleFeatureImageTitleChange = (index: number, val: string) => {
        const newImages = [...(data.featureImages || [])];
        newImages[index] = { ...newImages[index], title: val } as any;
        updateField('featureImages' as any, newImages as any);
    };

    const handleFeatureImageDetailsChange = (index: number, val: string) => {
        const newImages = [...(data.featureImages || [])];
        newImages[index] = { ...newImages[index], details: val } as any;
        updateField('featureImages' as any, newImages as any);
    };

    const addFeatureImage = () => {
        const existing = data.featureImages || [];
        updateField('featureImages' as any, [...existing, { url: '', alt: '', link: '', title: '', details: '', bullets: [] }]);
    };

    const removeFeatureImage = (index: number) => {
        const existing = data.featureImages || [];
        updateField('featureImages' as any, existing.filter((_, i) => i !== index) as any);
    };

    const removeMainImage = (index: number) => {
        updateField('mainImages', data.mainImages.filter((_, i) => i !== index));
    };

    // Comparison Items Handlers - each product gets its own isolated update
    const handleCompChange = (index: number, field: string, val: string) => {
        // Create a completely fresh copy of the items array
        const newItems = data.comparisonItems.map((item, idx) => {
            // Only update the item at the target index
            if (idx === index) {
                return {
                    ...item,
                    [field]: val
                };
            }
            // Return all other items unchanged
            return item;
        });
        console.log(`Updated item[${index}].${field} = "${val}"`, newItems[index]);
        updateField('comparisonItems', newItems);
    };

    // Default comparison rows helper
    const DEFAULT_COMPARISON_ROWS = [
        { label: 'Price', key: 'price' },
        { label: 'Material', key: 'material' },
        { label: 'Light Source', key: 'lightSource' },
        { label: 'Base', key: 'base' },
    ];

    // Always return comparisonRows from data; use defaults only for initialization
    const getRows = () => {
        if (data.comparisonRows && data.comparisonRows.length > 0) {
            return data.comparisonRows;
        }
        // If no custom rows, return defaults (but don't mutate them)
        return DEFAULT_COMPARISON_ROWS;
    };

    // Add a new comparison row and initialize field on all items
    const addComparisonRow = (label = 'New Row') => {
        console.log('addComparisonRow called');
        // Get current rows (either custom or defaults)
        const currentRows = getRows();
        const baseRows = currentRows.slice();
        const newRows = [...baseRows];

        // generate unique key
        let keyNum = 1;
        let newKey = `customRow${keyNum}`;
        while (newRows.some(r => r.key === newKey)) {
            keyNum++;
            newKey = `customRow${keyNum}`;
        }

        newRows.push({ label, key: newKey });

        // initialize on all items
        const newItems = data.comparisonItems.map(it => ({ ...it, [newKey]: '' }));

        console.log('Adding row:', { label, key: newKey }, 'New rows:', newRows);
        updateMultiple({ comparisonRows: newRows, comparisonItems: newItems });
    };

    // Remove a comparison row by its key and delete that field from all items
    const removeComparisonRow = (keyToRemove: string) => {
        console.log('Removing row:', keyToRemove);
        // Ensure we always work with the actual data.comparisonRows
        let currentRows = getRows();

        // If we're using defaults, initialize comparisonRows with them first
        if (!data.comparisonRows || data.comparisonRows.length === 0) {
            currentRows = DEFAULT_COMPARISON_ROWS.slice();
        }

        const newRows = currentRows.filter(r => r.key !== keyToRemove);

        // Only remove the field from items, preserve all other data including comparisonItems array
        const newItems = data.comparisonItems.map(it => {
            const copy: any = { ...it };
            // Only delete the specific field, keep all other properties
            if (keyToRemove in copy) {
                delete copy[keyToRemove];
            }
            return copy;
        });

        console.log('New rows after removal:', newRows);
        console.log('Items count after removal:', newItems.length);
        // Ensure we preserve comparisonItems - only update comparisonRows
        // If newRows is empty, set to empty array (not undefined) to clear custom rows
        updateMultiple({ 
            comparisonRows: newRows,
            comparisonItems: newItems 
        });
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
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
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
                            onChange={(e) => {
                                if (e.target.value.length <= 79) {
                                    updateField("title", e.target.value);
                                }
                            }}
                        />
                        <button
                            onClick={handleOptimizeTitle}
                            disabled={isOptimizingTitle}
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg text-sm hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 shadow-lg"
                        >
                            {isOptimizingTitle ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
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
            <section className="g-gray-800 p-5 roundbed-xl shadow-lg border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-3 flex items-center gap-2">
                    <span className="text-green-400">●</span> Main Images
                </h3>
                <div className="grid grid-cols-1 gap-4">
                    {data.mainImages.map((img, idx) => (
                        <div key={idx} className="space-y-3">
                            <div className="g-gray-800 p-5 roundbed-xl shadow-lg border border-gray-700">
                                <ImageUploader
                                    value={img.url}
                                    altText={img.alt}
                                    label={`Image ${idx + 1}`}
                                    onChange={(val) => handleMainImageChange(idx, val)}
                                    onAltTextChange={(val) => handleMainImageAltChange(idx, val)}
                                    onRemove={() => removeMainImage(idx)}
                                />

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="mt-3 grid grid-cols-1 gap-2">

                                        <div>
                                            <label className="text-gray-300 text-sm">eBay Link</label>
                                            <input
                                                type="text"
                                                value={img.link || ""}
                                                className="w-full mt-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white outline-none focus:border-blue-500"
                                                onChange={(e) => handleMainImageLinkChange(idx, e.target.value)}
                                                placeholder="Enter eBay product link"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button onClick={addMainImage} className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-700 rounded-xl text-gray-400 hover:bg-gray-800 hover:border-blue-500 hover:text-blue-400 transition-all">
                        <Plus size={16} /> Add Image
                    </button>
                </div>
            </section>

            {/* Feature Images section */}

            <section className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-3 flex items-center gap-2">
                    <span className="text-purple-400">●</span> Feature Images (4-up)
                </h3>
                <div className="space-y-4">
                    {(data.featureImages || []).map((img, idx) => (
                        <div key={idx} className="border border-gray-700 rounded-lg p-4 bg-gray-900">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-sm font-bold text-gray-300">Feature {idx + 1}</h4>
                                <button onClick={() => removeFeatureImage(idx)} className="text-red-400 text-xs">Remove</button>
                            </div>
                            <ImageUploader
                                value={img.url}
                                altText={img.alt}
                                onChange={(val) => handleFeatureImageChange(idx, val)}
                                onAltTextChange={(val) => handleFeatureImageAltChange(idx, val)}
                                label="Feature Image"
                            />

                            <div className="grid grid-cols-2 gap-2 mt-3">
                                <input type="text" placeholder="Title" className="border border-gray-700 bg-gray-800 text-gray-100 p-2.5 rounded-lg text-xs" value={img.title || ''} onChange={(e) => handleFeatureImageTitleChange(idx, e.target.value)} />
                                <input type="text" placeholder="eBay Link URL" className="border border-gray-700 bg-gray-800 text-gray-100 p-2.5 rounded-lg text-xs col-span-2" value={img.link || ''} onChange={(e) => handleFeatureImageLinkChange(idx, e.target.value)} />
                                <textarea placeholder="Details" rows={2} className="col-span-2 border border-gray-700 bg-gray-800 text-gray-100 p-2.5 rounded-lg text-xs" value={img.details || ''} onChange={(e) => handleFeatureImageDetailsChange(idx, e.target.value)} />
                            </div>
                        </div>
                    ))}
                    <div>
                        <button onClick={addFeatureImage} className="flex items-center gap-2 w-full justify-center py-3 border-2 border-dashed border-gray-700 rounded-xl text-gray-400 hover:bg-gray-800 hover:border-blue-500 hover:text-blue-400 transition-all">
                            <Plus size={20} />Add Feature Image
                        </button>
                    </div>

                </div>
            </section>

            {/* Section: Comparison Table */}
            <section className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-3 flex items-center gap-2">
                    <span className="text-purple-400">●</span> Comparison Table
                </h3>

                {/* Comparison Section Header Settings */}
                <div className="mb-6 p-3 sm:p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <h4 className="text-sm font-bold text-gray-300 mb-3">Comparison Section Header</h4>

                    <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-400 mb-2">Description Text</label>
                        <textarea
                            value={data.comparisonDescription || ''}
                            onChange={(e) => updateField('comparisonDescription', e.target.value)}
                            rows={3}
                            className="w-full border border-gray-700 bg-gray-800 text-gray-100 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-600 "
                            placeholder="Enter description text that appears above the comparison table..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-2">Brand Bar Text</label>
                        <input
                            type="text"
                            value={data.comparisonBrandBar || ''}
                            onChange={(e) => updateField('comparisonBrandBar', e.target.value)}
                            className="w-full border border-gray-700 bg-gray-800 text-gray-100 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-600"
                            placeholder="Enter brand name for black bar (e.g., LEDSONE)"
                        />
                    </div>
                </div>

                {/* Comparison Rows Template (manage labels/keys) */}
                <div className="mb-6 p-3 sm:p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <h4 className="text-sm font-bold text-gray-300 mb-2 sm:mb-3">Table Row Labels</h4>
                    <p className="text-xs text-gray-500 mb-3 sm:mb-4">Edit labels and keys for the comparison table. Keys must be unique.</p>

                    <div className="space-y-2 sm:space-y-2">
                        {getRows().map((row, rIdx) => (
                            <div key={`row-template-${row.key}`} className="flex flex-col sm:flex-row gap-2 sm:gap-2 items-stretch sm:items-center bg-gray-800 p-2 sm:p-2.5 rounded-lg border border-gray-700">
                                <input
                                    type="text"
                                    placeholder="Label"
                                    className="flex-1 w-full border border-gray-700 bg-gray-900 text-gray-100 p-2 sm:p-2.5 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    value={row.label}
                                    onChange={(e) => {
                                        const currentRows = getRows();
                                        const updated = currentRows.slice();
                                        updated[rIdx] = { ...row, label: e.target.value };
                                        updateField('comparisonRows', updated);
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder="field_key"
                                    className="w-full sm:w-36 md:w-40 border border-gray-700 bg-gray-900 text-gray-100 p-2 sm:p-2.5 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    value={row.key}
                                    onChange={(e) => {
                                        const desiredRaw = e.target.value || '';
                                        const desired = desiredRaw.trim().replace(/\s+/g, '_');
                                        const currentRows = getRows();
                                        const existing = currentRows.slice();

                                        // ensure uniqueness
                                        let newKey = desired || 'custom';
                                        let suffix = 1;
                                        while (existing.some((r, i) => r.key === newKey && i !== rIdx)) {
                                            newKey = `${desired || 'custom'}${suffix}`;
                                            suffix++;
                                        }

                                        const oldKey = row.key;
                                        existing[rIdx] = { ...row, key: newKey };

                                        // migrate values from oldKey -> newKey across items
                                        const migratedItems = data.comparisonItems.map(it => {
                                            const copy: any = { ...it };
                                            if (oldKey !== newKey && oldKey in copy) {
                                                copy[newKey] = copy[oldKey];
                                                delete copy[oldKey];
                                            }
                                            return copy;
                                        });

                                        updateField('comparisonRows', existing);
                                        updateField('comparisonItems', migratedItems);
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeComparisonRow(row.key)}
                                    className="text-red-500 hover:text-red-400 active:text-red-600 p-2 sm:p-1.5 rounded-lg transition-colors flex items-center justify-center sm:justify-start min-w-[44px] sm:min-w-0 touch-manipulation"
                                    aria-label="Delete row"
                                >
                                    <Trash2 size={18} className="sm:w-4 sm:h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            addComparisonRow();
                        }}
                        className="mt-3 sm:mt-4 text-xs sm:text-sm text-blue-400 hover:text-blue-300 active:text-blue-200 flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-lg border border-blue-500/30 hover:border-blue-400/50 transition-colors touch-manipulation"
                    >
                        <Plus size={14} className="sm:w-3 sm:h-3" /> Add Row
                    </button>
                </div>

                {/* Comparison Items */}
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
                                <input type="text" placeholder="eBay Link URL" className="border border-gray-700 bg-gray-800 text-gray-100 p-2.5 rounded-lg text-xs col-span-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-600" value={item.link || ''} onChange={(e) => handleCompChange(idx, 'link', e.target.value)} />

                                {/* Dynamic row fields based on comparisonRows */}
                                {getRows().map((row) => (
                                    <input
                                        key={row.key}
                                        type="text"
                                        placeholder={row.label}
                                        className="border border-gray-700 bg-gray-800 text-gray-100 p-2.5 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-600"
                                        value={item[row.key] || ''}
                                        onChange={(e) => handleCompChange(idx, row.key, e.target.value)}
                                    />
                                ))}
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
                            <input className="flex-1 border border-gray-700 bg-gray-900 text-gray-100 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-600" value={spec} onChange={(e) => handleArrayChange('specifications', idx, e.target.value)} placeholder="e.g. Color: Blue" />
                            <button onClick={() => removeArrayItem('specifications', idx)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                        </div>
                    ))}
                    <button onClick={() => addArrayItem('specifications')} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"><Plus size={12} /> Add Spec</button>
                </div>

                {/* About Items */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">About This Item (Features)</label>
                    {data.aboutItems.map((item, idx) => (
                        <div key={idx} className="flex gap-2 mb-2">
                            <textarea rows={2} className="flex-1 border border-gray-700 bg-gray-900 text-gray-100 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-600" value={item} onChange={(e) => handleArrayChange('aboutItems', idx, e.target.value)} placeholder="e.g. Feature Name: Description" />
                            <button onClick={() => removeArrayItem('aboutItems', idx)} className="text-red-400 hover:text-red-600 self-center"><Trash2 size={16} /></button>
                        </div>
                    ))}
                    <button onClick={() => addArrayItem('aboutItems')} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"><Plus size={12} /> Add Feature</button>
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