import React, { useState } from 'react';
import { Newspaper, ChevronRight, Clock, ArrowRight, Zap, Cloud, Shield, Cpu, BookOpen } from 'lucide-react';

const sampleNews = [
  {
    id: 1,
    title: "WWDC 2026: Apple Intelligence & Tim Cook's Final Keynote",
    excerpt: "Apple’s Worldwide Developers Conference kicks off tomorrow. Expect a major Siri overhaul powered by a custom Gemini model and the announcement of iOS 27.",
    category: "Apple",
    date: "June 7, 2026",
    readTime: "4 min read",
    icon: <Cpu className="w-5 h-5" />,
    featured: true,
    url: "https://www.macrumors.com"
  },
  {
    id: 2,
    title: "ChatGPT Reaches 1 Billion Monthly Active Users",
    excerpt: "Marking a massive milestone in global AI adoption, OpenAI's ChatGPT has officially crossed one billion MAUs amid discussions of government equity stakes in AI leaders.",
    category: "Artificial Intelligence",
    date: "June 7, 2026",
    readTime: "3 min read",
    icon: <Zap className="w-5 h-5" />,
    featured: false,
    url: "https://techcrunch.com/category/artificial-intelligence/"
  },
  {
    id: 3,
    title: "2026 World Cup Deploys Advanced Security Tech",
    excerpt: "With the World Cup kicking off next week, host cities are rolling out $875 million in security tech, including robot dogs and net-shooting hunter drones.",
    category: "Tech & Society",
    date: "June 6, 2026",
    readTime: "5 min read",
    icon: <Shield className="w-5 h-5" />,
    featured: false,
    url: "https://www.wired.com"
  },
  {
    id: 4,
    title: "Intel Ramps Up 18A as AMD Surges in Data Centers",
    excerpt: "Intel focuses on scaling its 18A technology and Xeon 6 Plus, while AMD projects massive year-over-year revenue growth in its data-center CPU business.",
    category: "Hardware",
    date: "June 6, 2026",
    readTime: "4 min read",
    icon: <Cpu className="w-5 h-5" />,
    featured: false,
    url: "https://www.tomshardware.com"
  },
  {
    id: 5,
    title: "SpaceX Starship Completes First Commercial Payload Delivery",
    excerpt: "In a historic milestone for space exploration, SpaceX successfully deployed an entire constellation of next-gen communication satellites in a single Starship launch.",
    category: "Space Tech",
    date: "June 5, 2026",
    readTime: "6 min read",
    icon: <Zap className="w-5 h-5" />,
    featured: false,
    url: "https://www.space.com"
  }
];

export default function Newsbot() {
  const featuredArticle = sampleNews.find(news => news.featured);
  const otherArticles = sampleNews.filter(news => !news.featured);

  return (
    <div className="bg-[#F7F3EB]/30 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-extrabold text-2xl sm:text-3xl text-[#111414] mb-2 font-display">
            Curated Tech News
          </h1>
          <p className="font-medium text-[#2F3437]/90 max-w-xl text-xs sm:text-sm">
            Stay ahead of the curve. Explore the latest updates, deep dives, and breakthroughs across the tech industry, selected by your AI Newsbot.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Featured Article - Spans 2 columns on large screens */}
          <a href={featuredArticle.url} target="_blank" rel="noopener noreferrer" className="lg:col-span-2 relative bg-white border border-[#005E63]/10 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col justify-end min-h-[400px] block cursor-pointer">
            {/* Background Decoration */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[var(--accent-mint)] rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none"></div>
            
            <div className="relative z-10 flex-1 flex flex-col justify-between">
              <div className="flex items-center space-x-3 mb-6">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[var(--accent-mint)] text-[var(--primary-teal)] text-xs font-bold uppercase tracking-wider rounded-full">
                  {featuredArticle.icon}
                  <span>{featuredArticle.category}</span>
                </span>
                <span className="text-sm font-semibold text-[var(--color-text-main)]/50 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {featuredArticle.readTime}
                </span>
              </div>
              
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2F3437] leading-tight mb-4 group-hover:text-[var(--primary-teal)] transition-colors">
                  {featuredArticle.title}
                </h2>
                <p className="text-lg text-[var(--color-text-main)]/80 mb-8 max-w-2xl leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm font-bold text-[var(--color-text-main)]/50">{featuredArticle.date}</span>
                  <div className="flex items-center space-x-2 bg-[var(--primary-teal)] text-white px-5 py-2.5 rounded-full font-semibold text-sm group-hover:bg-[var(--primary-teal-hover)] transition-colors shadow-sm">
                    <BookOpen className="w-4 h-4" />
                    <span>Read Full Story</span>
                  </div>
                </div>
              </div>
            </div>
          </a>

          {/* Regular Articles Stack */}
          <div className="flex flex-col gap-6">
            {otherArticles.slice(0, 2).map((article) => (
              <a href={article.url} target="_blank" rel="noopener noreferrer" key={article.id} className="bg-white border border-[#005E63]/10 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full relative overflow-hidden block cursor-pointer">
                <div className="absolute right-0 top-0 w-32 h-32 bg-[#F7F3EB] rounded-full blur-2xl opacity-60 pointer-events-none -mr-10 -mt-10"></div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 bg-[#F0F7F6] text-[var(--primary-teal)] text-[10px] font-bold uppercase tracking-wide rounded-md">
                    {article.category}
                  </span>
                  <span className="text-xs font-semibold text-[var(--color-text-main)]/40">{article.readTime}</span>
                </div>
                
                <h3 className="text-lg font-extrabold text-[#2F3437] leading-snug mb-2 group-hover:text-[var(--primary-teal)] transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-[var(--color-text-main)]/70 mb-6 line-clamp-2 flex-1">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs font-bold text-[var(--color-text-main)]/50">{article.date}</span>
                  <div className="text-[var(--primary-teal)] p-2 rounded-full group-hover:bg-[var(--accent-mint)] transition-colors">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
            ))}
          </div>

        </div>

        {/* Bottom Row Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {otherArticles.slice(2).map((article) => (
            <a href={article.url} target="_blank" rel="noopener noreferrer" key={article.id} className="bg-white border border-[#005E63]/10 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col sm:flex-row gap-6 relative overflow-hidden block cursor-pointer">
              <div className="flex-1 flex flex-col">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 bg-[#F0F7F6] text-[var(--primary-teal)] text-[10px] font-bold uppercase tracking-wide rounded-md">
                    {article.category}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-[#2F3437] leading-tight mb-2 group-hover:text-[var(--primary-teal)] transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-[var(--color-text-main)]/70 mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs font-bold text-[var(--color-text-main)]/50 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {article.readTime} • {article.date}
                  </span>
                  <div className="text-[var(--primary-teal)] text-sm font-bold flex items-center group-hover:underline">
                    Read <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}
