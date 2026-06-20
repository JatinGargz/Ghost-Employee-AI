import React from 'react';
import { motion } from 'motion/react';
import { 
  Award, 
  Sparkles, 
  Github, 
  Slack, 
  CheckSquare, 
  FileText, 
  Cpu,
  BookmarkCheck,
  TrendingUp
} from 'lucide-react';
import { Employee, Activity } from '../types/coral';

interface ExpertCardProps {
  expert: Employee | null;
  confidenceScore: number;
  reasoning: string;
  evidence: Activity[];
  isSearching: boolean;
}

const renderCustomMarkdown = (text: string) => {
  if (!text) return null;
  
  // Custom simple line-based markdown interpreter to bypass react-markdown dependency compiling headaches.
  const lines = text.split('\n');
  return (
    <div className="space-y-3.5 text-sm leading-relaxed text-slate-300">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('###')) {
          return (
            <h4 key={idx} className="text-sm font-bold uppercase tracking-wider text-cyan-400 mt-5 mb-2 flex items-center space-x-1.5 font-mono">
              <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-ping" />
              <span>{trimmed.replace('###', '').trim()}</span>
            </h4>
          );
        }
        if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
          return <p key={idx} className="font-semibold text-white mt-2">{trimmed.replace(/\*\*/g, '')}</p>;
        }
        if (trimmed.startsWith('*')) {
          return (
            <li key={idx} className="list-inside list-disc pl-3 text-slate-300 ml-2 mt-1">
              {trimmed.replace(/^\*\s*/, '')}
            </li>
          );
        }
        if (trimmed.startsWith('1.') || trimmed.startsWith('2.') || trimmed.startsWith('3.')) {
          return (
            <div key={idx} className="flex items-start space-x-2 pl-2 text-slate-300 mt-1.5">
              <span className="font-mono text-cyan-500 font-bold">{trimmed.slice(0, 3)}</span>
              <span>{trimmed.slice(3).trim()}</span>
            </div>
          );
        }
        if (trimmed === '') {
          return <div key={idx} className="h-2" />;
        }
        
        // Inline bold replacer inside general line
        const parts = line.split('**');
        if (parts.length > 2) {
          return (
            <p key={idx}>
              {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-white font-bold">{p}</strong> : p)}
            </p>
          );
        }
        
        return <p key={idx}>{line}</p>;
      })}
    </div>
  );
};

export const ExpertCard: React.FC<ExpertCardProps> = ({
  expert,
  confidenceScore,
  reasoning,
  evidence,
  isSearching
}) => {
  if (isSearching) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-6 animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-slate-800" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-800 rounded w-1/3" />
            <div className="h-3 bg-slate-800 rounded w-1/2" />
          </div>
          <div className="w-16 h-8 bg-slate-800 rounded" />
        </div>
        <div className="h-2 bg-slate-800 rounded w-full" />
        <div className="space-y-3">
          <div className="h-3 bg-slate-800 rounded w-5/6" />
          <div className="h-3 bg-slate-800 rounded w-4/5" />
          <div className="h-3 bg-slate-800 rounded w-3/4" />
        </div>
        <div className="border-t border-slate-800 pt-4 flex space-x-2">
          <div className="w-16 h-6 bg-slate-800 rounded" />
          <div className="w-16 h-6 bg-slate-800 rounded" />
        </div>
      </div>
    );
  }

  if (!expert) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative rounded-2xl border border-slate-800 bg-[#111827] backdrop-blur-xl overflow-hidden p-6 shadow-2xl shadow-cyan-950/5"
    >
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-violet-600/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-cyan-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800/60 gap-4 mb-5">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-500 p-[1px] shadow-lg shadow-cyan-500/10">
            <div className="flex items-center justify-center w-full h-full rounded-xl bg-slate-950 font-black text-cyan-400 text-sm">
              {expert.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">Top Matched Expert</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">{expert.name}</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{expert.role} • <span className="font-semibold text-violet-400">{expert.department}</span></p>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="flex flex-col items-start sm:items-end">
          <div className="flex items-center space-x-1 bg-slate-950/80 border border-slate-800/80 px-3 py-1.5 rounded-lg">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs text-slate-400 font-mono">Expert Score:</span>
            <span className="text-xs font-bold text-white font-mono">{confidenceScore}%</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono tracking-wide uppercase">Coral Relevance Metrics</p>
        </div>
      </div>

      {/* Progress Bar Gauge */}
      <div className="mb-6 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-mono font-semibold uppercase tracking-wider">Expert Confidence Index</span>
          <span className="text-slate-300 font-mono font-bold">{confidenceScore}% match density</span>
        </div>
        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${confidenceScore}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-purple-500" 
          />
        </div>
      </div>

      {/* AI reasoning text */}
      <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-800/60 shadow-inner mb-6">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-400 tracking-wider uppercase mb-3 border-b border-slate-900 pb-2">
          <Cpu className="w-3.5 h-3.5 text-violet-400" />
          <span>Gemini AI RAG Synthesis Rationale</span>
        </div>
        {renderCustomMarkdown(reasoning)}
      </div>

      {/* Trace Proof Counts */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold font-mono tracking-wider text-slate-500 uppercase mb-3">
          <BookmarkCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Extracted Traces Supporting Competence ({evidence.length})</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {['github', 'slack', 'jira', 'notion'].map(src => {
            const count = evidence.filter(e => e.type === src).length;
            if (count === 0) return null;
            return (
              <div key={src} className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900 border border-slate-800/60 font-mono text-xs text-slate-400 capitalize">
                <span className="flex items-center space-x-1.5">
                  {src === 'github' && <Github className="w-3.5 h-3.5 text-slate-200" />}
                  {src === 'slack' && <Slack className="w-3.5 h-3.5 text-pink-400" />}
                  {src === 'jira' && <CheckSquare className="w-3.5 h-3.5 text-blue-400" />}
                  {src === 'notion' && <FileText className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{src}</span>
                </span>
                <span className="font-bold text-slate-100">{count} trace{count > 1 ? 's' : ''}</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
