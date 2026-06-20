import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Search, 
  Activity, 
  Users, 
  EyeOff, 
  ShieldAlert, 
  Info, 
  X, 
  Sparkles,
  Terminal,
  RefreshCw,
  Github,
  Mail,
  Network
} from 'lucide-react';

import { Metrics } from './Metrics';
import { SearchPanel } from './SearchPanel';
import { ExpertCard } from './ExpertCard';
import { EvidenceTimeline } from './EvidenceTimeline';
import { EmployeeTable } from './EmployeeTable';

import { coralService } from '../services/coralService';
import { geminiService } from '../services/geminiService';
import { HARDCODED_EMPLOYEES, HARDCODED_ACTIVITIES } from '../utils/expertScoring';
import { Employee, Activity as TypeActivity, SearchResult, DashboardMetricsData } from '../types/coral';

export const Dashboard: React.FC = () => {
  // Application states
  const [employees, setEmployees] = useState<Employee[]>(HARDCODED_EMPLOYEES);
  const [activities, setActivities] = useState<TypeActivity[]>(HARDCODED_ACTIVITIES);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [statusText, setStatusText] = useState("");

  // Audit modal state
  const [selectedAuditEmployee, setSelectedAuditEmployee] = useState<Employee | null>(null);
  const [isGeneratingAudit, setIsGeneratingAudit] = useState(false);
  const [auditReport, setAuditReport] = useState("");

  // Initial dashboard metrics
  const metrics: DashboardMetricsData = {
    employeesAudited: HARDCODED_EMPLOYEES.length,
    ghostEmployees: HARDCODED_EMPLOYEES.filter(e => e.status === 'Anomaly').length,
    expertsIdentified: 4, // Sarah (Sec), Marcus (Kube), Elena (React), Apoorva (AI)
    documentsIndexed: HARDCODED_ACTIVITIES.length
  };

  // Perform expert retrieval & Gemini insight synthesis
  const handleExpertSearch = async (query: string) => {
    setIsSearching(true);
    setSearchQuery(query);
    
    // Step 1: Coral layer retrieves evidence
    setStatusText("[Coral Layer] Querying index systems...");
    await new Promise(r => setTimeout(r, 650));
    
    setStatusText("[Coral Layer] Ranking document matches...");
    const coralResult = await coralService.query(query);
    await new Promise(r => setTimeout(r, 600));

    // Step 2: Gemini RAG synthesizes final insight
    setStatusText("[Gemini AI] Grounding evidence, synthesizing expert rationale...");
    const insight = await geminiService.generateExpertInsight(
      query,
      coralResult.topExpert,
      coralResult.evidence,
      coralResult.coralDocuments
    );

    setSearchResult({
      ...coralResult,
      reasoning: insight
    });
    
    setIsSearching(false);
    setStatusText("");
  };

  // Generate compliance audit report for a selected employee
  const handleAnalyzeEmployee = async (employee: Employee) => {
    setSelectedAuditEmployee(employee);
    setIsGeneratingAudit(true);
    setAuditReport("");

    // Invoke Gemini Service for custom compliance analysis
    try {
      let report = "";
      if (employee.status === 'Anomaly') {
        report = await geminiService.generateAnomalyReport(employee);
      } else {
        report = `### Verified Footprint Summary: ${employee.name}
**Security Profile**: VERIFIED IDENTITY (ACTIVE STATUS)
**Digital Score**: ${employee.digitalScore}%
**Total Indexed Artifacts**: ${activities.filter(a => a.employeeId === employee.id).length} documents.

**Compliance Assessment**:
- Continuous authentic authentication signatures matching standard workspace profiles.
- Highly correlated git commits, slack updates, and task updates.
- Fully aligned payroll disbursements with structural organizational contributions.

**System Guidance**:
Identity corresponds perfectly with assigned title: **${employee.role}**. No manual action required.`;
      }
      setAuditReport(report);
    } catch (err) {
      setAuditReport(`### System Error
Failed to generate audit parameters. Please verify your VITE_GEMINI_API_KEY settings.`);
    } finally {
      setIsGeneratingAudit(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 flex font-sans transition-all selection:bg-cyan-500/30 selection:text-white">
      {/* Sidebar Rail */}
      <div className="w-16 border-r border-slate-800 hidden md:flex flex-col items-center py-6 gap-8 bg-[#0F172A] shrink-0">
        <div className="w-10 h-10 bg-gradient-to-br from-[#06B6D4] to-[#8B5CF6] rounded-xl flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white/30 rounded-full"></div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="p-2 text-[#06B6D4] bg-[#06B6D4]/10 rounded-lg cursor-pointer">
            <EyeOff className="w-5 h-5" />
          </div>
          <div className="p-2 text-slate-500 hover:text-slate-200 rounded-lg cursor-pointer transition-colors" onClick={() => handleExpertSearch("Who knows Kubernetes?")}>
            <Search className="w-5 h-5" />
          </div>
          <div className="p-2 text-slate-500 hover:text-slate-200 rounded-lg cursor-pointer transition-colors">
            <Activity className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-auto mb-2 text-slate-500">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-300 border border-slate-700/30">AJ</div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navigation Frame */}
        <header className="sticky top-0 z-40 bg-[#0F172A]/85 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-violet-500 p-[1px] flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <div className="w-full h-full rounded-xl bg-[#0F172A] flex items-center justify-center">
                <EyeOff className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-extrabold tracking-tight text-white font-sans sm:text-xl">
                  Ghost Employee AI
                </h1>
                <span className="text-[10px] bg-red-500/10 text-red-040 px-2 py-0.5 rounded-full border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.05)]">
                  Corporate Compliance Radar
                </span>
              </div>
              <p className="text-xs text-slate-555 font-medium">Platform Architects: Apoorva Jha, Siddhi, Jatin, Shambhavi</p>
            </div>
          </div>

          {/* Coral Status Panel */}
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-slate-450">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Coral Knowledge Layer: Sim-Hydrated</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-slate-450">
              <span className="h-2 w-2 rounded-full bg-[#8B5CF6] animate-pulse" />
              <span>RAG Model: Gemini-3.5-flash</span>
            </div>
          </div>
        </header>

        {/* Main Container Grid */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Banner Announcement */}
          <div className="bg-[#1E293B]/40 border border-slate-800 rounded-xl p-5 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-3xl pointer-events-none" />
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-lg bg-cyan-950/50 border border-cyan-800/30 text-cyan-400 mt-1 sm:mt-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-200">Retrieval-Augmented Architecture Grounding</h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  This hackathon demo leverages **Coral** as knowledge retrieval layer matching commits, messages, and tasks, alongside **Gemini AI** to formulate authoritative reasoning summaries. Verify active anomalies or execute deep expert queries.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono font-bold tracking-wider text-emerald-400 uppercase">Demo Live & Protected</span>
            </div>
          </div>

        {/* Dynamic Metrics Numbers */}
        <Metrics metrics={metrics} />

        {/* Middle row: Search & RAG insights + Footprints Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Split - Search & Experts (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <SearchPanel 
              onSearch={handleExpertSearch} 
              isSearching={isSearching} 
              statusText={statusText} 
            />

            <AnimatePresence mode="wait">
              {searchResult && (
                <ExpertCard 
                  expert={searchResult.topExpert} 
                  confidenceScore={searchResult.confidenceScore} 
                  reasoning={searchResult.reasoning} 
                  evidence={searchResult.evidence} 
                  isSearching={isSearching} 
                />
              )}
            </AnimatePresence>
          </div>

          {/* Right Split - Evidence foot timelines (5 Cols) */}
          <div className="lg:col-span-5 h-full">
            <EvidenceTimeline 
              activities={isSearching ? [] : (searchResult?.evidence || activities)} 
              topExpertId={searchResult?.topExpert?.id} 
              title={searchResult?.topExpert ? `${searchResult.topExpert.name}'s Footprints` : undefined}
              subtitle={searchResult?.topExpert ? `Direct Coral records supporting expert assessment` : undefined}
            />
          </div>

        </div>

        {/* Bottom Section - Full Corporate Footprint Registry */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Organizational Compliance Registry</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Audit individual scores to inspect ghost anomalies or verify structural systems tenure.</p>
            </div>
          </div>

          <EmployeeTable 
            employees={employees} 
            onAnalyzeEmployee={handleAnalyzeEmployee} 
            selectedEmployeeId={selectedAuditEmployee?.id}
          />
        </div>

      </main>

      {/* Team Footer Bar */}
      <footer className="mt-auto h-16 sm:h-12 border-t border-slate-800 bg-slate-900/40 flex flex-col sm:flex-row items-center px-8 justify-between text-[10px] text-slate-500 gap-2 sm:gap-0 py-3 sm:py-0">
        <div className="flex gap-4">
          <span>System: <span className="text-[#06B6D4] font-semibold">Gemini-3.5-flash</span></span>
          <span className="opacity-30">|</span>
          <span>Kernel: <span className="text-[#8B5CF6] font-semibold">Coral-1.4.2</span></span>
        </div>
        <div className="flex gap-3 uppercase font-bold tracking-widest text-[9px]">
          <span>Apoorva Jha</span>
          <span className="opacity-20 flex sm:inline">|</span>
          <span>Siddhi</span>
          <span className="opacity-20 flex sm:inline">|</span>
          <span>Jatin</span>
          <span className="opacity-20 flex sm:inline">|</span>
          <span>Shambhavi</span>
        </div>
      </footer>

      </div> {/* End Main Workspace */}

      {/* RAG & Compliance Modal */}
      <AnimatePresence>
        {selectedAuditEmployee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAuditEmployee(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`relative w-full max-w-2xl bg-slate-900 rounded-2xl border ${
                selectedAuditEmployee.status === 'Anomaly' ? 'border-red-500/40' : 'border-slate-800'
              } shadow-2xl p-6 overflow-hidden`}
            >
              
              {/* Decorative side badge */}
              {selectedAuditEmployee.status === 'Anomaly' && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-2xl pointer-events-none" />
              )}

              {/* Close Button */}
              <button 
                onClick={() => setSelectedAuditEmployee(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800/80 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="flex items-start space-x-3 pb-4 border-b border-slate-800">
                <div className={`p-2.5 rounded-xl ${
                  selectedAuditEmployee.status === 'Anomaly' ? 'bg-red-950/50 text-red-400 border border-red-500/30' : 'bg-slate-950 text-cyan-400 border border-slate-800'
                }`}>
                  {selectedAuditEmployee.status === 'Anomaly' ? (
                    <ShieldAlert className="w-5 h-5 animate-pulse" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-violet-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
                    <span>Identity Audit: {selectedAuditEmployee.name}</span>
                    {selectedAuditEmployee.status === 'Anomaly' && (
                      <span className="text-[10px] font-mono bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20 animate-pulse">Critical Anomaly</span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 uppercase tracking-widest text-[9px] font-mono mt-0.5">{selectedAuditEmployee.role} • {selectedAuditEmployee.department}</p>
                </div>
              </div>

              {/* Body */}
              <div className="py-5 overflow-y-auto max-h-[400px] pr-2 mt-2 custom-scrollbar">
                {isGeneratingAudit ? (
                  <div className="space-y-4 py-6 text-center text-slate-400 font-mono text-xs">
                    <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin mx-auto mb-2" />
                    <span>Engaging AI forensics & scanning registry archives...</span>
                  </div>
                ) : (
                  <div className="prose prose-invert prose-xs text-slate-300">
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60 mb-4 text-xs font-mono grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500 block uppercase font-bold text-[9px] tracking-wide">Digital Score</span>
                        <span className={`text-sm font-bold ${selectedAuditEmployee.status === 'Anomaly' ? 'text-red-400' : 'text-cyan-400'}`}>
                          {selectedAuditEmployee.digitalScore}% footprint trace mapping
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block uppercase font-bold text-[9px] tracking-wide">Payroll Indicator</span>
                        <span className="text-slate-200 text-sm font-bold">{selectedAuditEmployee.payrollStatus} billing status</span>
                      </div>
                    </div>
                    
                    {/* Render generated markdown */}
                    {auditReport ? (
                      <div className="space-y-3.5 text-sm leading-relaxed text-slate-300">
                        {auditReport.split('\n').map((line, idx) => {
                          const trimLine = line.trim();
                          if (trimLine.startsWith('###')) {
                            return <h4 key={idx} className="text-sm font-bold uppercase tracking-wider text-cyan-400 mt-4 mb-2 font-mono flex items-center">{trimLine.replace('###', '').trim()}</h4>;
                          }
                          if (trimLine.startsWith('**') && trimLine.endsWith('**')) {
                            return <p key={idx} className="font-semibold text-white mt-2">{trimLine.replace(/\*\*/g, '')}</p>;
                          }
                          if (trimLine.startsWith('*') || trimLine.startsWith('-')) {
                            return <li key={idx} className="list-inside list-disc pl-3 mt-1 ml-2 text-slate-300">{trimLine.replace(/^[\*\-]\s*/, '')}</li>;
                          }
                          if (trimLine.startsWith('1.') || trimLine.startsWith('2.') || trimLine.startsWith('3.')) {
                            return (
                              <div key={idx} className="flex items-start space-x-2 pl-2 text-slate-300 mt-1">
                                <span className="font-mono text-cyan-500 font-bold">{trimLine.slice(0, 3)}</span>
                                <span>{trimLine.slice(3).trim()}</span>
                              </div>
                            );
                          }
                          if (trimLine === '') return <div key={idx} className="h-1.5" />;
                          return <p key={idx}>{line}</p>;
                        })}
                      </div>
                    ) : (
                      <p className="text-slate-500">No report metrics compiled.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedAuditEmployee(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                >
                  Close Report
                </button>
                {selectedAuditEmployee.status === 'Anomaly' && (
                  <button
                    type="button"
                    onClick={() => alert(`IT Alert generated! Suspicious credentials suspended on enterprise network indexes.`)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/10 transition-all cursor-pointer"
                  >
                    Hold Payroll & Credentials
                  </button>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
