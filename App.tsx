import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_DATA } from './constants';
import { ListingData, TabView } from './types';
import { idbGet, idbSet } from './utils/idb';
import { Editor } from './components/Editor';
import { generateEbayHTML } from './utils/htmlGenerator';
import { Layout, Eye, Code, Copy, Check } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<ListingData>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<TabView>(TabView.EDITOR);
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
    const [hydrated, setHydrated] = useState(false);

    // Load saved data once on mount. Prefer IndexedDB if it exists (keeps large uploads safe),
    // otherwise fall back to localStorage. This avoids a stale localStorage entry overwriting
    // newer data stored in IndexedDB (which can happen when localStorage.setItem previously failed).
    useEffect(() => {
        (async () => {
            try {
                const idbVal = await idbGet('listingData');
                if (idbVal) {
                    const parsed = idbVal as ListingData;
                    const merged: ListingData = {
                        ...INITIAL_DATA,
                        ...parsed,
                        mainImages: parsed.mainImages && parsed.mainImages.length ? parsed.mainImages : INITIAL_DATA.mainImages,
                        comparisonItems: parsed.comparisonItems && parsed.comparisonItems.length ? parsed.comparisonItems : INITIAL_DATA.comparisonItems,
                        comparisonRows: parsed.comparisonRows || INITIAL_DATA.comparisonRows,
                        comparisonDescription: parsed.comparisonDescription || INITIAL_DATA.comparisonDescription,
                        comparisonBrandBar: parsed.comparisonBrandBar || INITIAL_DATA.comparisonBrandBar,
                        specifications: parsed.specifications || INITIAL_DATA.specifications,
                        packageIncludes: parsed.packageIncludes || INITIAL_DATA.packageIncludes,
                        aboutItems: parsed.aboutItems || INITIAL_DATA.aboutItems,
                        shippingInfo: parsed.shippingInfo || INITIAL_DATA.shippingInfo,
                        featureImages: parsed.featureImages || INITIAL_DATA.featureImages || [],
                    };
                    setData(merged);
                    setHydrated(true);
                    return;
                }
            } catch (er) {
                // ignore and fall back to localStorage
            }

            try {
                const raw = localStorage.getItem('listingData');
                if (raw) {
                    const parsed = JSON.parse(raw) as ListingData;
                    const merged: ListingData = {
                        ...INITIAL_DATA,
                        ...parsed,
                        mainImages: parsed.mainImages && parsed.mainImages.length ? parsed.mainImages : INITIAL_DATA.mainImages,
                        comparisonItems: parsed.comparisonItems && parsed.comparisonItems.length ? parsed.comparisonItems : INITIAL_DATA.comparisonItems,
                        comparisonRows: parsed.comparisonRows || INITIAL_DATA.comparisonRows,
                        comparisonDescription: parsed.comparisonDescription || INITIAL_DATA.comparisonDescription,
                        comparisonBrandBar: parsed.comparisonBrandBar || INITIAL_DATA.comparisonBrandBar,
                        specifications: parsed.specifications || INITIAL_DATA.specifications,
                        packageIncludes: parsed.packageIncludes || INITIAL_DATA.packageIncludes,
                        aboutItems: parsed.aboutItems || INITIAL_DATA.aboutItems,
                        shippingInfo: parsed.shippingInfo || INITIAL_DATA.shippingInfo,
                        featureImages: parsed.featureImages || INITIAL_DATA.featureImages || [],
                    };
                    setData(merged);
                    setHydrated(true);
                }
            } catch (e) {
                // if parsing localStorage fails, just keep INITIAL_DATA
                // still mark hydrated so persistence can begin
                setHydrated(true);
            }
        })();
    }, []);

    // Generate HTML and update preview iframe whenever `data` or `activeTab` changes
    useEffect(() => {
        const html = generateEbayHTML(data);
        setGeneratedHtml(html);

        // Update preview iframe
        if (iframeRef.current) {
             const doc = iframeRef.current.contentDocument;
             if (doc) {
                     doc.open();
                     doc.write(html);
                     doc.close();
             }
        }

        // Don't persist until we've hydrated from storage to avoid overwriting
        // a previously-saved listing with the INITIAL_DATA defaults.
        if (!hydrated) return;

        // Persist data: try localStorage first (fast), but always update IndexedDB asynchronously
        try {
            localStorage.setItem('listingData', JSON.stringify(data));
        } catch (e) {
            // localStorage failed (likely quota); continue to IDB write
        }

        (async () => {
            try {
                await idbSet('listingData', data);
            } catch (er) {
                console.error('Failed to persist listing data to IndexedDB', er);
            }
        })();
    }, [data, activeTab]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

    return (
        <div style={{ fontFamily: 'Verdana, sans-serif' }}>
        <div className="flex flex-col h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between flex-shrink-0 shadow-lg z-10">
        <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-2 rounded-xl shadow-lg">
                <Layout size={22} />
            </div>
            <div>
                <h1 className="text-xl font-bold text-white leading-tight">eBay Template Builder</h1>
                <p className="text-xs text-gray-400">Create professional listings in minutes</p>
            </div>
        </div>
        
        <div className="flex bg-gray-800 p-1 rounded-lg border border-gray-700">
            <button 
                onClick={() => setActiveTab(TabView.EDITOR)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === TabView.EDITOR ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'}`}
            >
                Editor
            </button>
            <button 
                 onClick={() => setActiveTab(TabView.PREVIEW)}
                 className={`hidden md:block px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === TabView.PREVIEW ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'}`}
            >
                Preview
            </button>
            <button 
                 onClick={() => setActiveTab(TabView.CODE)}
                 className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === TabView.CODE ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'}`}
            >
                HTML Code
            </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Left Panel - Editor (Always visible on Desktop, hidden if Preview/Code active on Mobile) */}
        <div className={`flex-1 md:flex-[0.4] lg:flex-[0.35] overflow-y-auto border-r border-gray-800 bg-gray-900 custom-scrollbar ${activeTab !== TabView.EDITOR ? 'hidden md:block' : ''}`}>
            <Editor data={data} onChange={setData} />
        </div>

        {/* Right Panel - Preview/Code */}
        <div className={`flex-1 md:flex-[0.6] lg:flex-[0.65] bg-gray-950 flex flex-col relative ${activeTab === TabView.EDITOR ? 'hidden md:flex' : 'flex'}`}>
            
            {/* Tabs for Right Panel content (Desktop only - allows toggling what's shown on the right) */}
            <div className="hidden md:flex border-b border-gray-800 px-4 py-2 justify-end gap-2 bg-gray-900/50">
                <button 
                    onClick={() => setActiveTab(TabView.PREVIEW)}
                    className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium border ${activeTab === TabView.PREVIEW ? 'bg-blue-600 text-white border-blue-500' : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600'}`}
                >
                    <Eye size={14} /> Visual Preview
                </button>
                <button 
                    onClick={() => setActiveTab(TabView.CODE)}
                    className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium border ${activeTab === TabView.CODE ? 'bg-blue-600 text-white border-blue-500' : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600'}`}
                >
                    <Code size={14} /> Source Code
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative bg-gray-950 overflow-hidden">
                {/* Preview Mode */}
                <div className={`absolute inset-0 w-full h-full flex flex-col ${activeTab === TabView.CODE ? 'z-0 opacity-0 pointer-events-none' : 'z-10 opacity-100'}`}>
                    <iframe 
                        ref={iframeRef}
                        title="Preview"
                        className="w-full h-full border-none bg-white"
                    />
                </div>

                {/* Code Mode */}
                <div className={`absolute inset-0 w-full h-full flex flex-col bg-gray-950 ${activeTab === TabView.CODE ? 'z-20 opacity-100' : 'z-0 opacity-0 pointer-events-none'}`}>
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
                        <span className="text-xs text-gray-400 font-mono">index.html</span>
                        <button 
                            onClick={handleCopy}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${copied ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'}`}
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied!' : 'Copy HTML'}
                        </button>
                    </div>
                    <textarea 
                        readOnly
                        value={generatedHtml}
                        className="flex-1 w-full p-4 font-mono text-xs text-gray-300 bg-gray-950 outline-none resize-none"
                    />
                </div>
            </div>
        </div>

      </main>
    </div>
    </div>
  );
}