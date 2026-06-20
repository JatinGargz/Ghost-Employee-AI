import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Users, EyeOff, Award, FileText } from 'lucide-react';
import { DashboardMetricsData } from '../types/coral';

interface MetricsProps {
  metrics: DashboardMetricsData;
}

const MetricCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  highlight?: boolean;
}> = ({ title, value, icon, color, highlight }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000; // 1s animation
    const increment = Math.ceil(value / 30);
    const intervalTime = duration / 30;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCurrentValue(value);
        clearInterval(timer);
      } else {
        setCurrentValue(start);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className={`relative p-5 rounded-xl border border-slate-800 bg-[#1E293B]/40 backdrop-blur-xl ${
        highlight ? 'ring-1 ring-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'shadow-lg shadow-black/20'
      }`}
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {currentValue}
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10 border border-slate-800/80`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center space-x-2 text-xs text-slate-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Coral database synchronized</span>
      </div>
    </motion.div>
  );
};

export const Metrics: React.FC<MetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Employees Audited"
        value={metrics.employeesAudited}
        icon={<Users className="w-5 h-5 text-cyan-400" />}
        color="bg-cyan-500"
      />
      <MetricCard
        title="Ghost Anomalies"
        value={metrics.ghostEmployees}
        icon={<EyeOff className="w-5 h-5 text-red-400 animate-pulse" />}
        color="bg-red-500"
        highlight={true}
      />
      <MetricCard
        title="Experts Identified"
        value={metrics.expertsIdentified}
        icon={<Award className="w-5 h-5 text-violet-400" />}
        color="bg-violet-500"
      />
      <MetricCard
        title="Documents Indexed"
        value={metrics.documentsIndexed}
        icon={<FileText className="w-5 h-5 text-purple-400" />}
        color="bg-purple-500"
      />
    </div>
  );
};
