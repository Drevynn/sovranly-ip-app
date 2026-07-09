'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ListTodo, 
  CheckSquare, 
  Square,
  Shield,
  FileText,
  Calendar,
  Send,
  Milestone,
  Check,
  Zap,
  RefreshCw,
  Terminal,
  CircleAlert
} from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
  category: 'Legal' | 'Smart Contracts' | 'Security' | 'Marketing' | 'Assets' | 'Other';
  dueDate?: string;
}

const DEFAULT_LAUNCH_TASKS: Task[] = [
  {
    id: 'launch-1',
    text: 'Audit Zero-Trust session validation and Firebase Auth envelope boundaries',
    completed: true,
    priority: 'High',
    category: 'Security'
  },
  {
    id: 'launch-2',
    text: 'Deploy main registry smart contracts on Ethereum and layer-2 networks',
    completed: false,
    priority: 'High',
    category: 'Smart Contracts'
  },
  {
    id: 'launch-3',
    text: 'Register copyright signatures and legal framework compacts with counsel',
    completed: false,
    priority: 'High',
    category: 'Legal'
  },
  {
    id: 'launch-4',
    text: 'Verify high-fidelity digital assets loading and layout transition performance',
    completed: true,
    priority: 'Medium',
    category: 'Assets'
  },
  {
    id: 'launch-5',
    text: 'Launch marketing preview and issue on-chain Genesis membership invitations',
    completed: false,
    priority: 'Medium',
    category: 'Marketing'
  },
  {
    id: 'launch-6',
    text: 'Setup primary server endpoints, cache invalidation, and reverse proxy routes',
    completed: false,
    priority: 'Medium',
    category: 'Other'
  }
];

export default function LaunchPlanner() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputText, setInputText] = useState('');
  const [inputPriority, setInputPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [inputCategory, setInputCategory] = useState<'Legal' | 'Smart Contracts' | 'Security' | 'Marketing' | 'Assets' | 'Other'>('Other');
  
  // Launch Target: July 4th, 2026 Local time
  const launchTargetDateStr = '2026-07-04T00:00:00';
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false
  });

  // Launch Simulation State
  const [simulationStep, setSimulationStep] = useState<number | null>(null);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Initialize and load from local storage
  useEffect(() => {
    const savedTasks = localStorage.getItem('sov_launch_tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        setTasks(DEFAULT_LAUNCH_TASKS);
      }
    } else {
      setTasks(DEFAULT_LAUNCH_TASKS);
    }
  }, []);

  // Update Countdown
  useEffect(() => {
    const targetTime = new Date(launchTargetDateStr).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isOver: false });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll logs to bottom during simulation
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [simulationLogs, simulationStep]);

  // Persist tasks helper
  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem('sov_launch_tasks', JSON.stringify(updatedTasks));
  };

  // Add Task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      text: inputText.trim(),
      completed: false,
      priority: inputPriority,
      category: inputCategory
    };

    const newTasks = [newTask, ...tasks];
    saveTasks(newTasks);
    setInputText('');
    setInputPriority('Medium');
    setInputCategory('Other');
  };

  // Toggle Task Completion
  const handleToggleTask = (id: string) => {
    const newTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks(newTasks);
  };

  // Delete Task
  const handleDeleteTask = (id: string) => {
    const newTasks = tasks.filter(task => task.id !== id);
    saveTasks(newTasks);
  };

  // Clear completed tasks
  const handleClearCompleted = () => {
    const newTasks = tasks.filter(task => !task.completed);
    saveTasks(newTasks);
  };

  // Calculate Progress Percentages
  const totalTasks = tasks.length;
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  // Run Simulated Launch Sequence
  const handleSimulateLaunch = () => {
    if (simulationStep !== null) return; // Already running

    setSimulationStep(0);
    setSimulationLogs(['[INIT] Initiating Sovranly IP Genesis Launch Sequence...']);

    const steps = [
      { delay: 1000, log: '[INFO] Establishing Zero Trust session security tunnels...' },
      { delay: 2000, log: '[SUCCESS] Cryptographic handshake confirmed. Secure peer networks active.' },
      { delay: 3500, log: '[INFO] Connecting to decentralized smart contract compiler...' },
      { delay: 5000, log: '[SUCCESS] Contracts compiled successfully. Gas estimations valid.' },
      { delay: 6500, log: '[DEPLOY] Transmitting smart contract payloads to mainnet registers...' },
      { delay: 8500, log: '[SUCCESS] Contract deployed at block #19482019. TX: 0x4f3e...b2c1' },
      { delay: 10000, log: '[INFO] Initializing genesis creator licensing profiles...' },
      { delay: 11500, log: '[INFO] Propagating decentralized asset index maps across worldwide shards...' },
      { delay: 13000, log: '[SUCCESS] Sovereign IP mainnet is fully synchronized and public!' },
      { delay: 14500, log: '[LAUNCH] Congratulations! Sovranly IP is now live! July 4th, 2026 deployment validated.' }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setSimulationLogs(prev => [...prev, step.log]);
        setSimulationStep(index + 1);
      }, step.delay);
    });
  };

  const resetSimulation = () => {
    setSimulationStep(null);
    setSimulationLogs([]);
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'High': return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'Medium': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      default: return 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Security': return <Shield className="w-3 h-3 text-red-400" />;
      case 'Smart Contracts': return <Zap className="w-3 h-3 text-violet-400" />;
      case 'Legal': return <FileText className="w-3 h-3 text-emerald-400" />;
      case 'Marketing': return <Send className="w-3 h-3 text-amber-400" />;
      case 'Assets': return <Sparkles className="w-3 h-3 text-cyan-400" />;
      default: return <Milestone className="w-3 h-3 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 font-sans text-left">
      
      {/* Title Segment */}
      <div className="border-b border-zinc-900 pb-4">
        <h2 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-2">
          <Rocket className="w-5 h-5 text-cyan-400" />
          Sovereign Launch Console
        </h2>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">Prepare, coordinate, and checklist milestones for the mainnet launch on July 4th, 2026</p>
      </div>

      {/* Countdown Card and Progress Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Countdown Ticker Box */}
        <div className="lg:col-span-8 bg-zinc-950 border border-zinc-900 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-black flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 animate-pulse" /> Launch Countdown Ticker
            </span>
            <h3 className="text-sm font-bold text-zinc-400">Target Launch Date: July 4th, 2026 (00:00 UTC)</h3>
          </div>

          {/* Large Countdown display */}
          <div className="grid grid-cols-4 gap-4 my-8 max-w-xl">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Min', value: timeLeft.minutes },
              { label: 'Sec', value: timeLeft.seconds }
            ].map((unit, i) => (
              <div key={i} className="bg-zinc-900/40 border border-zinc-900/80 rounded-2xl p-4 text-center">
                <span className="block text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">{unit.value.toString().padStart(2, '0')}</span>
                <span className="block text-[9px] uppercase font-mono text-zinc-500 mt-1 font-bold">{unit.label}</span>
              </div>
            ))}
          </div>

          {/* Launch Status Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-900">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${timeLeft.isOver ? 'bg-emerald-500' : 'bg-cyan-500 animate-pulse'}`} />
              <p className="text-xs text-zinc-500 font-mono">
                {timeLeft.isOver ? 'Launch target has elapsed!' : 'Countdown synchronized with global atomic network clock.'}
              </p>
            </div>

            <button
              onClick={handleSimulateLaunch}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Rocket className="w-4 h-4" />
              Simulate Launch Deployment
            </button>
          </div>
        </div>

        {/* Progress & Stats Cards */}
        <div className="lg:col-span-4 bg-zinc-950 border border-zinc-900 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-500 via-violet-500 to-cyan-500" />
          
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase font-black tracking-wider text-white flex items-center gap-1.5">
              <ListTodo className="w-4 h-4 text-cyan-400" /> Pre-Launch Preparedness
            </h3>
            
            {/* Progress Bar Circle-like representation or large block */}
            <div className="py-6 text-center space-y-2">
              <span className="block text-6xl font-black text-white tracking-tight font-mono">
                {completionPercentage}%
              </span>
              <span className="inline-flex items-center gap-1 bg-zinc-900 px-3 py-1 rounded-full text-[10px] font-mono text-zinc-400 font-bold">
                {completedTasksCount} of {totalTasks} milestones finalized
              </span>
            </div>
          </div>

          {/* Horizontal Progress bar */}
          <div className="space-y-3">
            <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-violet-500 h-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
              <span>Genesis Audit</span>
              <span>Launch Ready</span>
            </div>
          </div>
        </div>

      </div>

      {/* Simulator Overlay/Logs */}
      {simulationStep !== null && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-xl space-y-4 relative overflow-hidden"
        >
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {simulationStep < 11 ? (
              <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Compiling Node Payload
              </div>
            ) : (
              <button 
                onClick={resetSimulation}
                className="text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-wider font-extrabold font-mono border border-zinc-850 px-3 py-1 rounded-lg hover:bg-zinc-900"
              >
                Clear Console
              </button>
            )}
          </div>

          <h3 className="text-xs font-mono uppercase font-black tracking-wider text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            Mainnet Simulator Output Stream
          </h3>

          <div 
            ref={logContainerRef}
            className="bg-[#040406] border border-zinc-900 rounded-2xl p-4 h-48 overflow-y-auto font-mono text-xs text-zinc-400 space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800"
          >
            {simulationLogs.map((log, idx) => (
              <div key={idx} className={`${log.startsWith('[SUCCESS]') ? 'text-emerald-400' : log.startsWith('[DEPLOY]') ? 'text-violet-400 animate-pulse' : log.startsWith('[LAUNCH]') ? 'text-cyan-400 font-bold bg-cyan-950/20 p-2 rounded-lg' : 'text-zinc-400'}`}>
                {log}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Main Task List & Form section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Create Task Form */}
        <div className="lg:col-span-4 bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-xl space-y-5">
          <h3 className="text-xs font-mono uppercase font-black tracking-wider text-white border-b border-zinc-900 pb-2">
            Register Launch Milestone
          </h3>

          <form onSubmit={handleAddTask} className="space-y-4 text-left">
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">Milestone Description</label>
              <textarea 
                required
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g. Conduct second-round smart contract security review..."
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none placeholder:text-zinc-650"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">Milestone Category</label>
              <select 
                value={inputCategory}
                onChange={(e: any) => setInputCategory(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Security">Security Audit</option>
                <option value="Smart Contracts">Smart Contracts</option>
                <option value="Legal">Legal & Contracts</option>
                <option value="Marketing">Marketing & Launch</option>
                <option value="Assets">Media & Assets</option>
                <option value="Other">Other / Misc</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">Deployment Priority</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Low', 'Medium', 'High'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setInputPriority(p)}
                    className={`py-2 text-[11px] font-mono font-bold rounded-xl border transition-all ${
                      inputPriority === p 
                        ? p === 'High' ? 'bg-red-950/40 border-red-500/50 text-red-400'
                          : p === 'Medium' ? 'bg-amber-950/40 border-amber-500/50 text-amber-400'
                          : 'bg-cyan-950/40 border-cyan-500/50 text-cyan-400'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-zinc-900 hover:bg-cyan-950/30 hover:border-cyan-500/30 text-white font-mono font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl border border-zinc-800 hover:text-cyan-400 transition-all flex items-center justify-center gap-1.5 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Expose Milestone
            </button>
          </form>
        </div>

        {/* Right Side: Active Task Milestones Checklist */}
        <div className="lg:col-span-8 bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-cyan-400" />
                Active Milestones Ledger
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">Sovereign launch milestones required for July 4th, 2026 deployment</p>
            </div>

            {tasks.some(t => t.completed) && (
              <button
                onClick={handleClearCompleted}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 font-mono text-[10px] font-bold transition-all flex items-center gap-1.5 self-start"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Prune Finalized
              </button>
            )}
          </div>

          {/* Checklist Area */}
          {tasks.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-pulse" />
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Ledger Cleared</h4>
              <p className="text-zinc-500 text-xs max-w-sm mx-auto leading-relaxed">
                All pre-launch milestones have been validated or cleared! Ready to submit decentralized payload parameters.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {tasks.map((task) => (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`group p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                      task.completed 
                        ? 'bg-zinc-950/40 border-zinc-950 text-zinc-500' 
                        : 'bg-[#09090b] border-zinc-900 hover:border-zinc-800 text-zinc-100'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      {/* Custom styled checkbox */}
                      <button 
                        onClick={() => handleToggleTask(task.id)}
                        className={`mt-0.5 p-1 rounded-lg transition-colors focus:outline-none flex-shrink-0 ${
                          task.completed 
                            ? 'text-emerald-400 hover:text-emerald-350' 
                            : 'text-zinc-650 hover:text-white'
                        }`}
                      >
                        {task.completed ? (
                          <CheckSquare className="w-5 h-5" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <p className={`text-xs leading-relaxed break-words font-sans ${task.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                          {task.text}
                        </p>
                        
                        {/* Meta Tags */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-zinc-900 border border-zinc-850 rounded-lg text-[9px] font-mono text-zinc-400 font-semibold">
                            {getCategoryIcon(task.category)}
                            {task.category}
                          </span>

                          <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold border ${getPriorityColor(task.priority)}`}>
                            {task.priority} Priority
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 text-zinc-650 hover:text-red-400 rounded-lg hover:bg-zinc-900 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                      title="Prune milestone"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
