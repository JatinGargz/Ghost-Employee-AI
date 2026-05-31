import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  UserX, 
  Activity, 
  FileText, 
  Github, 
  Slack,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { Employee } from '../types/coral';

interface EmployeeTableProps {
  employees: Employee[];
  onAnalyzeEmployee: (employee: Employee) => void;
  selectedEmployeeId?: string;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({ 
  employees, 
  onAnalyzeEmployee,
  selectedEmployeeId 
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#111827] backdrop-blur-md">
      {/* Header Banner */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Corporate Digital Footprint Registry</h3>
          <p className="text-xs text-slate-500 mt-1">Cross-referencing active payroll accounts against indexed developer activity databases</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Real-time Sync Active</span>
        </div>
      </div>

      {/* Table Shell */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/60 bg-slate-950/20 text-slate-500 text-[11px] font-bold uppercase tracking-wider font-mono">
              <th className="px-6 py-3.5">Employee Name</th>
              <th className="px-6 py-3.5">System Role</th>
              <th className="px-6 py-3.5">Compliance Status</th>
              <th className="px-6 py-3.5 text-center">Payroll Index</th>
              <th className="px-6 py-3.5 text-right">Footprint score</th>
              <th className="px-6 py-3.5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-sm">
            {employees.map((emp) => {
              const isAnomaly = emp.status === 'Anomaly';
              const isSelected = selectedEmployeeId === emp.id;

              return (
                <motion.tr
                  key={emp.id}
                  whileHover={{ backgroundColor: "rgba(30, 41, 59, 0.2)" }}
                  className={`transition-colors leading-relaxed ${
                    isAnomaly ? 'bg-red-500/5 hover:bg-red-500/10' : ''
                  } ${isSelected ? 'bg-slate-800/40 border-l border-l-cyan-400' : ''}`}
                >
                  {/* Name */}
                  <td className="px-6 py-4.5 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className={`relative flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs uppercase ${
                        isAnomaly ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-slate-800 text-cyan-300 border border-slate-700/60'
                      }`}>
                        {emp.name.split(' ').map(n => n[0]).join('')}
                        {!isAnomaly && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-slate-900 rounded-full" />}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200">{emp.name}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{emp.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4.5 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-3.5 h-3.5 text-slate-600" />
                      <div>
                        <div className="text-slate-300 font-medium">{emp.role}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest text-[9px] font-bold mt-0.5">{emp.department}</div>
                      </div>
                    </div>
                  </td>

                  {/* Compliance Status */}
                  <td className="px-6 py-4.5 whitespace-nowrap">
                    {isAnomaly ? (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-950/40 text-red-400 border border-red-900/50 shadow-[0_0_10px_rgba(239,68,68,0.05)] animate-pulse">
                        <AlertTriangle className="w-3 h-3" />
                        <span>CRITICAL ANOMALY</span>
                      </span>
                    ) : emp.status === 'Needs Review' ? (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/40 text-amber-400 border border-amber-900/50">
                        <UserX className="w-3 h-3" />
                        <span>NEEDS REVIEW</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-900/50">
                        <ShieldCheck className="w-3 h-3" />
                        <span>VERIFIED IDENTITY</span>
                      </span>
                    )}
                  </td>

                  {/* Payroll Status */}
                  <td className="px-6 py-4.5 whitespace-nowrap text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold ${
                      emp.payrollStatus === 'Active' 
                        ? 'bg-slate-800 text-slate-300 border border-slate-700/50' 
                        : emp.payrollStatus === 'Flagged'
                        ? 'bg-red-950/30 text-red-300 border border-red-500/30'
                        : 'bg-slate-900 text-slate-500'
                    }`}>
                      {emp.payrollStatus}
                    </span>
                  </td>

                  {/* Digital Footprint Score */}
                  <td className="px-6 py-4.5 whitespace-nowrap text-right">
                    <div className="inline-flex flex-col items-end">
                      <span className={`font-mono text-sm font-bold ${
                        isAnomaly ? 'text-red-400' : emp.digitalScore > 90 ? 'text-cyan-400' : 'text-purple-400'
                      }`}>
                        {emp.digitalScore}%
                      </span>
                      {/* Bar indicator */}
                      <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden mt-1.5">
                        <div 
                          className={`h-full rounded-full ${
                            isAnomaly ? 'bg-red-500' : emp.digitalScore > 90 ? 'bg-cyan-400' : 'bg-purple-500'
                          }`} 
                          style={{ width: `${emp.digitalScore}%` }} 
                        />
                      </div>
                    </div>
                  </td>

                  {/* Action Button */}
                  <td className="px-6 py-4.5 whitespace-nowrap text-center">
                    <button
                      onClick={() => onAnalyzeEmployee(emp)}
                      className={`inline-flex items-center justify-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        isAnomaly 
                          ? 'bg-red-950/40 hover:bg-red-500 text-red-200 hover:text-white border-red-900/60 hover:border-red-500 shadow-md shadow-red-950/20' 
                          : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border-slate-700/60 hover:border-cyan-500/40'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{isAnomaly ? 'Compliance Audit' : 'Audit Logs'}</span>
                      <ChevronRight className="w-3 h-3 opacity-60" />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
