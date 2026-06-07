import React from 'react';
import { Code, Sparkles, Loader } from 'lucide-react';

export default function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-[#005E63]/20 blur-xl rounded-full" />
        <div className="relative bg-white p-6 rounded-3xl shadow-sm border border-[#005E63]/10">
          <Code className="w-12 h-12 text-[#6FB6B3]" />
        </div>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#005E63] font-display mb-4">
        {title || "Coming Soon"}
      </h1>
      
      <p className="text-lg text-[#2F3437]/70 max-w-xl mb-8 leading-relaxed">
        Development is currently in progress. We're working hard to bring you this feature, and it will be implemented very soon!
      </p>

      <div className="flex items-center space-x-2 text-sm font-semibold text-[#005E63] bg-[#BFE3DE]/30 px-4 py-2 rounded-full border border-[#005E63]/10">
        <Loader className="w-4 h-4 animate-spin" />
        <span>Status: Building</span>
      </div>
    </div>
  );
}
