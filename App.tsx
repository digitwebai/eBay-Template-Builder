import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_DATA } from './constants';
import { ListingData, TabView } from './types';
import { Editor } from './components/Editor';
import { generateEbayHTML } from './utils/htmlGenerator';
import { Layout, Eye, Code, Copy, Check } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<ListingData>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<TabView>(TabView.EDITOR);
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
  }, [data, activeTab]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <Layout size={20} />
            </div>
            <div>
                <h1 className="text-lg font-bold text-gray-800 leading-tight">eBay Template Builder</h1>
                <p className="text-xs text-gray-500">Create professional listings in minutes</p>
            </div>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
                onClick={() => setActiveTab(TabView.EDITOR)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === TabView.EDITOR ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
                Editor
            </button>
            <button 
                 onClick={() => setActiveTab(TabView.PREVIEW)}
                 className={`hidden md:block px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === TabView.PREVIEW ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
                Preview
            </button>
            <button 
                 onClick={() => setActiveTab(TabView.CODE)}
                 className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === TabView.CODE ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
                HTML Code
            </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Left Panel - Editor (Always visible on Desktop, hidden if Preview/Code active on Mobile) */}
        <div className={`flex-1 md:flex-[0.4] lg:flex-[0.35] overflow-y-auto border-r border-gray-200 bg-gray-50 custom-scrollbar ${activeTab !== TabView.EDITOR ? 'hidden md:block' : ''}`}>
            <Editor data={data} onChange={setData} />
        </div>

        {/* Right Panel - Preview/Code */}
        <div className={`flex-1 md:flex-[0.6] lg:flex-[0.65] bg-white flex flex-col relative ${activeTab === TabView.EDITOR ? 'hidden md:flex' : 'flex'}`}>
            
            {/* Tabs for Right Panel content (Desktop only - allows toggling what's shown on the right) */}
            <div className="hidden md:flex border-b border-gray-200 px-4 py-2 justify-end gap-2 bg-gray-50/50">
                <button 
                    onClick={() => setActiveTab(TabView.PREVIEW)}
                    className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium border ${activeTab === TabView.PREVIEW ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-gray-600 border-gray-200'}`}
                >
                    <Eye size={14} /> Visual Preview
                </button>
                <button 
                    onClick={() => setActiveTab(TabView.CODE)}
                    className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium border ${activeTab === TabView.CODE ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-gray-600 border-gray-200'}`}
                >
                    <Code size={14} /> Source Code
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative bg-gray-100 overflow-hidden">
                {/* Preview Mode */}
                <div className={`absolute inset-0 w-full h-full flex flex-col ${activeTab === TabView.CODE ? 'z-0 opacity-0 pointer-events-none' : 'z-10 opacity-100'}`}>
                     <div className="bg-yellow-100 text-yellow-800 text-xs px-4 py-2 text-center border-b border-yellow-200">
                        <strong>Note:</strong> Images uploaded via file selection are converted to Base64 for preview. For the final eBay listing, ensure you use hosted URLs (https://...) if eBay blocks large code blocks.
                    </div>
                    <iframe 
                        ref={iframeRef}
                        title="Preview"
                        className="w-full h-full border-none bg-white"
                    />
                </div>

                {/* Code Mode */}
                <div className={`absolute inset-0 w-full h-full flex flex-col bg-gray-900 ${activeTab === TabView.CODE ? 'z-20 opacity-100' : 'z-0 opacity-0 pointer-events-none'}`}>
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                        <span className="text-xs text-gray-400 font-mono">index.html</span>
                        <button 
                            onClick={handleCopy}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${copied ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied!' : 'Copy HTML'}
                        </button>
                    </div>
                    <textarea 
                        readOnly
                        value={generatedHtml}
                        className="flex-1 w-full p-4 font-mono text-xs text-gray-300 bg-gray-900 outline-none resize-none"
                    />
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}