import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Sparkles, Terminal, Cpu, Database } from 'lucide-react';

interface SearchPanelProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  statusText?: string;
}

const SEARCH_EXAMPLES = [
  "Who knows Kubernetes?",
  "Who can fix deployment issues?",
  "Who understands authentication?",
  "Who knows React?",
  "Who should review Terraform code?"
];

export const SearchPanel: React.FC<SearchPanelProps> = ({
  onSearch,
  isSearching,
  statusText = ""
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isSearching) {
      onSearch(query.trim());
    }
  };

  const handleExampleClick = (example: string) => {
    if (!isSearching) {
      setQuery(example);
      onSearch(example);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-[#111827] backdrop-blur-xl p-6 shadow-xl shadow-black/20">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center space-x-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <span>Coral Knowledge Index Router</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Query corporate developer artifacts to rank capability, verify credentials, and locate verified structural authorities.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative mt-4">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type technology, topic, or code problem (e.g. Kubernetes, Auth, React...)"
            disabled={isSearching}
            className="w-full bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 focus:border-cyan-500 text-sm text-slate-100 placeholder-slate-500 rounded-xl pl-12 pr-28 py-3.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-mono shadow-inner"
          />
          {/* Action Button */}
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute right-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-slate-950 font-bold rounded-lg text-xs tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSearching ? "Searching..." : "Index Trace"}</span>
          </button>
        </div>
      </form>

      {/* RAG Status log */}
      {isSearching && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800/80 font-mono text-xs text-cyan-400 flex items-center space-x-2 shadow-inner"
        >
          <Terminal className="w-4 h-4 text-violet-400 animate-spin" />
          <span className="text-slate-400">CORAL SYSTEM: </span>
          <span className="text-slate-200">{statusText || "Retrieving relevant traces..."}</span>
        </motion.div>
      )}

      {/* Examples Checklist */}
      <div className="mt-5 pt-4 border-t border-slate-800/40">
        <div className="text-[11px] font-bold font-mono tracking-wider text-slate-500 uppercase mb-2">
          Demo Suggestion Prompts
        </div>
        <div className="flex flex-wrap gap-2">
          {SEARCH_EXAMPLES.map((example) => (
            <motion.button
              key={example}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExampleClick(example)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-950 hover:bg-slate-850 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            >
              {example}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};
