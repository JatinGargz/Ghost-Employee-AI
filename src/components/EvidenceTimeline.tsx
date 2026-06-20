import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Github, 
  MessageSquare, 
  CheckSquare, 
  FileText, 
  BookOpen, 
  Filter, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Activity, ActivityType } from '../types/coral';

interface EvidenceTimelineProps {
  activities: Activity[];
  topExpertId?: string;
  title?: string;
  subtitle?: string;
}

const SOURCE_CONFIG = {
  github: {
    icon: <Github className="w-4 h-4 text-slate-100" />,
    bg: 'bg-slate-800',
    border: 'border-slate-700/60',
    text: 'text-slate-300',
    label: 'GitHub Commit'
  },
  slack: {
    icon: <MessageSquare className="w-4 h-4 text-pink-400" />,
    bg: 'bg-pink-950/20',
    border: 'border-pink-900/40',
    text: 'text-pink-300',
    label: 'Slack Message'
  },
  jira: {
    icon: <CheckSquare className="w-4 h-4 text-blue-400" />,
    bg: 'bg-blue-950/20',
    border: 'border-blue-900/40',
    text: 'text-blue-300',
    label: 'Jira Issue'
  },
  notion: {
    icon: <FileText className="w-4 h-4 text-amber-400" />,
    bg: 'bg-amber-950/20',
    border: 'border-amber-900/40',
    text: 'text-amber-300',
    label: 'Notion Page'
  },
  documentation: {
    icon: <BookOpen className="w-4 h-4 text-emerald-400" />,
    bg: 'bg-emerald-950/20',
    border: 'border-emerald-900/40',
    text: 'text-emerald-300',
    label: 'Technical Doc'
  }
};

export const EvidenceTimeline: React.FC<EvidenceTimelineProps> = ({ 
  activities,
  topExpertId,
  title = "Unified Organizational Ephemeral Footprints",
  subtitle = "Granular timeline of indexed cloud traces, synced and parsed via Coral"
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredActivities = activities.filter(act => {
    // 1. Filter by employee if topExpertId is provided
    if (topExpertId && act.employeeId !== topExpertId) return false;
    // 2. Filter by activity source type
    if (selectedType !== 'all' && act.type !== selectedType) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full rounded-xl border border-slate-800 bg-[#111827] backdrop-blur-md p-6">
      {/* Title & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800/80 gap-4 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">{title}</h3>
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center flex-wrap gap-1.5 self-start md:self-auto bg-slate-950/50 p-1.5 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedType === 'all' 
                ? 'bg-slate-800 text-white border border-slate-700/60' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Traces
          </button>
          
          {(Object.keys(SOURCE_CONFIG) as ActivityType[]).map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center space-x-1 ${
                selectedType === type
                  ? 'bg-slate-800 text-white border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
              }`}
            >
              <span className="scale-90">{SOURCE_CONFIG[type].icon}</span>
              <span className="capitalize">{type}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Elements */}
      <div className="flex-1 overflow-y-auto max-h-[500px] pr-2 space-y-4 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredActivities.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center text-slate-500"
            >
              <AlertCircle className="w-8 h-8 text-slate-700 mb-3" />
              <p className="text-sm font-medium">No system traces found for source filters.</p>
              <p className="text-xs text-slate-600 mt-1">Try toggling to "All Traces" or change queries.</p>
            </motion.div>
          ) : (
            filteredActivities.map((act, index) => {
              const cfg = SOURCE_CONFIG[act.type];
              const dateStr = new Date(act.timestamp).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <motion.div
                  key={act.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  className="group relative flex items-start pl-6 pb-2 last:pb-0"
                >
                  {/* Vertical connect line */}
                  {index < filteredActivities.length - 1 && (
                    <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-gradient-to-b from-slate-800 to-slate-900/20 group-hover:from-slate-700 transition-colors" />
                  )}

                  {/* Bullet Indicator */}
                  <div className={`absolute left-0 top-1.5 flex items-center justify-center w-5.5 h-5.5 rounded-full border ${cfg.border} ${cfg.bg} shadow-md`}>
                    {cfg.icon}
                  </div>

                  {/* Card Content */}
                  <div className="flex-1 bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 ml-2 group-hover:border-slate-700/60 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-bold font-mono tracking-wider uppercase px-2 py-0.5 rounded-md ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                          {cfg.label}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">{act.employeeName}</span>
                      </div>
                      <div className="flex items-center text-[10px] text-slate-500 font-mono">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{dateStr}</span>
                      </div>
                    </div>
                    
                    <h4 className="text-sm font-semibold text-slate-200 leading-snug group-hover:text-cyan-300 transition-colors">
                      {act.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {act.description}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
