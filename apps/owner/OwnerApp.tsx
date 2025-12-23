import React, { useState, useEffect } from 'react';
import { 
  Crown, TrendingUp, DollarSign, Users, AlertTriangle, Shield, Zap,
  BarChart3, PieChart, Activity, Clock, MapPin, Eye, Camera, Radio,
  Settings, Bell, Power, Lock, Unlock, Send, MessageSquare, FileText,
  Download, Upload, CheckCircle, XCircle, Target, Flame, Award, Star,
  Percent, TrendingDown, Calendar, Phone, Mail, Briefcase, Building,
  Package, Truck, ShoppingBag, CreditCard, Wallet, Receipt, Calculator,
  ClipboardList, UserCheck, UserX, UserPlus, Filter, Search, RefreshCw,
  ChevronRight, ChevronUp, ChevronDown, MoreVertical, Maximize2, Minimize2,
  GitBranch, Layers, Database, Server, Cpu, HardDrive, Wifi, Signal,
  Volume2, Mic, Headphones, Music, Coffee, Gamepad2, Home, Navigation,
  Flag, Bookmark, Archive, Trash2, Edit, Save, X, Check, Plus, Minus,
  AlertCircle, Info, HelpCircle, ExternalLink, Copy, Share2, Printer,
  Monitor, Tv, Tablet, Smartphone, Watch, Globe, Compass, Map
} from 'lucide-react';

const LanternOwnerApp = () => {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [showBroadcastPanel, setShowBroadcastPanel] = useState(false);
  const [showOverridePanel, setShowOverridePanel] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);

  // Real-time empire data
  const [empireData, setEmpireData] = useState({
    revenue_today: 8247.50,
    revenue_week: 54839.25,
    revenue_month: 234567.80,
    revenue_year: 1456789.50,
    profit_margin: 32.4,
    occupancy_current: 78,
    occupancy_avg_week: 71,
    total_customers_today: 247,
    total_customers_week: 1893,
    staff_on_duty: 12,
    staff_total: 28,
    equipment_health: 94,
    customer_satisfaction: 96.2,
    pending_approvals: 7,
    active_incidents: 2,
    cash_flow_status: 'excellent',
    burn_rate: 12847.50,
    runway_months: 24
  });

  // Revenue breakdown with trends
  const [revenueStreams] = useState([
    { category: 'Gaming Stations', today: 3250.00, week: 21847.50, trend: '+15.2%', margin: 68 },
    { category: 'Karaoke Rooms', today: 2890.00, week: 18234.75, trend: '+8.7%', margin: 71 },
    { category: 'Food & Beverage', today: 1807.50, week: 11456.25, trend: '+12.4%', margin: 42 },
    { category: 'Merchandise', today: 300.00, week: 3300.75, trend: '+22.1%', margin: 55 }
  ]);

  // Staff performance overview
  const [staffOverview] = useState([
    { department: 'Gaming Tech', count: 8, avg_performance: 94.2, labor_cost: 2847.50, efficiency: 'excellent' },
    { department: 'Food Service', count: 6, avg_performance: 91.8, labor_cost: 2145.00, efficiency: 'good' },
    { department: 'Management', count: 4, avg_performance: 96.5, labor_cost: 4200.00, efficiency: 'excellent' },
    { department: 'Security', count: 3, avg_performance: 98.1, labor_cost: 1950.00, efficiency: 'excellent' },
    { department: 'Maintenance', count: 7, avg_performance: 89.7, labor_cost: 2680.00, efficiency: 'good' }
  ]);

  // Equipment performance
  const [equipmentMetrics] = useState({
    gaming_stations: { utilization: 86, revenue_per_hour: 24.50, maintenance_due: 3, status: 'excellent' },
    karaoke_rooms: { utilization: 72, revenue_per_hour: 45.00, maintenance_due: 1, status: 'good' },
    pos_systems: { uptime: 99.8, transaction_speed: 1.2, errors_today: 2, status: 'excellent' },
    kitchen_equipment: { efficiency: 91, orders_per_hour: 38, downtime_today: 0, status: 'excellent' }
  });

  // Customer analytics
  const [customerMetrics] = useState({
    new_customers_today: 89,
    returning_customers_today: 158,
    avg_spend_per_customer: 33.40,
    lifetime_value_avg: 847.50,
    retention_rate: 76.8,
    nps_score: 72,
    demographics: {
      age_18_24: 62,
      age_25_34: 28,
      age_35_plus: 10
    }
  });

  // Pending approvals
  const [pendingApprovals] = useState([
    { id: 1, type: 'Time Off Request', employee: 'Sarah Chen', department: 'Management', priority: 'medium', time: '2 hours ago' },
    { id: 2, type: 'Equipment Purchase', amount: 2500.00, department: 'Gaming Tech', priority: 'high', time: '4 hours ago' },
    { id: 3, type: 'Vendor Contract', vendor: 'Ramen Supplier Co', amount: 5000.00, priority: 'high', time: '1 day ago' },
    { id: 4, type: 'Marketing Campaign', budget: 3500.00, department: 'Marketing', priority: 'medium', time: '2 days ago' }
  ]);

  // Active incidents
  const [activeIncidents] = useState([
    { id: 1, type: 'Equipment', severity: 'medium', description: 'Printer 3 low on paper', location: 'Gaming Floor', time: '15 mins ago', status: 'in_progress' },
    { id: 2, type: 'Customer', severity: 'low', description: 'Billing dispute - Table 12', location: 'Food Area', time: '45 mins ago', status: 'pending' }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEmpireData(prev => ({
        ...prev,
        revenue_today: prev.revenue_today + (Math.random() * 50),
        occupancy_current: Math.max(30, Math.min(95, prev.occupancy_current + (Math.random() - 0.5) * 8)),
        total_customers_today: prev.total_customers_today + Math.floor(Math.random() * 2)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const screenTransition = (screen) => {
    setCurrentScreen(screen);
    if (navigator.vibrate) navigator.vibrate(10);
  };

  // MAIN DASHBOARD - Information Overload
  const DashboardScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black relative overflow-hidden">
      {/* Platinum accents background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-400 rounded-full mix-blend-screen filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-300 rounded-full mix-blend-screen filter blur-xl opacity-10 animate-pulse animation-delay-3000"></div>
        <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-slate-500 rounded-full mix-blend-screen filter blur-xl opacity-5 animate-pulse animation-delay-1500"></div>
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
            {Array.from({length: 144}).map((_, i) => (
              <div key={i} className="border border-slate-400/20"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Imperial Header */}
        <div className="bg-black/80 backdrop-blur-xl border-b border-slate-400/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-200 via-slate-400 to-slate-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-slate-400/25">
                <Crown className="w-8 h-8 text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent font-['Orbitron']">
                  EMPIRE COMMAND
                </h1>
                <p className="text-slate-400 font-['Rajdhani']">Owner Override Access • All Systems</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={() => setShowBroadcastPanel(true)} className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-xl font-bold hover:scale-105 transition-all shadow-lg flex items-center space-x-2">
                <Radio className="w-4 h-4" />
                <span className="font-['Rajdhani']">BROADCAST</span>
              </button>
              <button onClick={() => setShowOverridePanel(true)} className="bg-gradient-to-r from-slate-600 to-slate-800 text-white px-4 py-2 rounded-xl font-bold hover:scale-105 transition-all shadow-lg flex items-center space-x-2 border border-slate-400/20">
                <Shield className="w-4 h-4" />
                <span className="font-['Rajdhani']">OVERRIDE</span>
              </button>
              <button className="relative w-12 h-12 bg-slate-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center border border-slate-400/20 hover:bg-slate-700/50 transition-all">
                <Bell className="w-6 h-6 text-slate-300" />
                {empireData.pending_approvals > 0 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{empireData.pending_approvals}</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Critical Metrics Strip */}
          <div className="grid grid-cols-6 gap-3">
            {[
              { label: 'Today', value: `$${empireData.revenue_today.toFixed(2)}`, icon: DollarSign, trend: '+12.5%', color: 'from-emerald-400 to-green-500' },
              { label: 'This Week', value: `$${empireData.revenue_week.toLocaleString()}`, icon: TrendingUp, trend: '+8.2%', color: 'from-blue-400 to-cyan-500' },
              { label: 'Margin', value: `${empireData.profit_margin}%`, icon: Percent, trend: '+2.1%', color: 'from-purple-400 to-pink-500' },
              { label: 'Occupancy', value: `${Math.round(empireData.occupancy_current)}%`, icon: Users, trend: 'Peak', color: 'from-orange-400 to-red-500' },
              { label: 'Staff', value: `${empireData.staff_on_duty}/${empireData.staff_total}`, icon: UserCheck, trend: 'Optimal', color: 'from-teal-400 to-cyan-500' },
              { label: 'Satisfaction', value: `${empireData.customer_satisfaction}%`, icon: Star, trend: '+1.4%', color: 'from-yellow-400 to-orange-500' }
            ].map((metric, index) => (
              <button key={index} className="bg-black/40 backdrop-blur-lg rounded-2xl p-4 border border-slate-400/10 hover:border-slate-400/30 transition-all shadow-xl hover:scale-105 active:scale-95 text-left">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 bg-gradient-to-r ${metric.color} rounded-lg flex items-center justify-center`}>
                    <metric.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-emerald-400 text-xs font-bold font-['Rajdhani']">{metric.trend}</span>
                </div>
                <div className="text-2xl font-bold text-white font-['Orbitron'] mb-1">{metric.value}</div>
                <div className="text-slate-400 text-xs font-['Rajdhani']">{metric.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid - MAXIMUM INFORMATION */}
        <div className="p-6 grid grid-cols-3 gap-4">
          
          {/* Revenue Streams - Detailed */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-5 border border-slate-400/10 shadow-2xl col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-200 font-['Orbitron'] flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-slate-400" />
                Revenue Streams Analysis
              </h2>
              <div className="flex items-center space-x-2 text-xs">
                <button className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-lg font-['Rajdhani']">Day</button>
                <button className="px-3 py-1 bg-slate-800/50 text-slate-400 rounded-lg font-['Rajdhani']">Week</button>
                <button className="px-3 py-1 bg-slate-800/50 text-slate-400 rounded-lg font-['Rajdhani']">Month</button>
              </div>
            </div>
            <div className="space-y-3">
              {revenueStreams.map((stream, index) => (
                <div key={index} className="bg-slate-900/50 rounded-xl p-4 border border-slate-400/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-200 font-bold font-['Rajdhani']">{stream.category}</span>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-emerald-400 font-bold font-['Rajdhani']">{stream.trend}</span>
                          <span className="text-slate-400 font-['Rajdhani']">Margin: {stream.margin}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <span className="text-slate-400 font-['Rajdhani']">Today: </span>
                          <span className="text-white font-bold font-['Orbitron']">${stream.today.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-['Rajdhani']">Week: </span>
                          <span className="text-white font-bold font-['Orbitron']">${stream.week.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-slate-400 to-slate-600 h-2 rounded-full transition-all duration-1000"
                      style={{width: `${(stream.today / empireData.revenue_today) * 100}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Analytics */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-5 border border-slate-400/10 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-200 font-['Orbitron'] flex items-center mb-4">
              <Users className="w-5 h-5 mr-2 text-slate-400" />
              Customer Intel
            </h2>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-400/5">
                <div className="text-slate-400 text-xs mb-1 font-['Rajdhani']">Today's Traffic</div>
                <div className="text-3xl font-bold text-white font-['Orbitron'] mb-1">{empireData.total_customers_today}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-['Rajdhani']">New: {customerMetrics.new_customers_today}</span>
                  <span className="text-blue-400 font-['Rajdhani']">Returning: {customerMetrics.returning_customers_today}</span>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-400/5">
                <div className="text-slate-400 text-xs mb-1 font-['Rajdhani']">Avg Spend</div>
                <div className="text-2xl font-bold text-white font-['Orbitron']">${customerMetrics.avg_spend_per_customer}</div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-400/5">
                <div className="text-slate-400 text-xs mb-1 font-['Rajdhani']">Lifetime Value</div>
                <div className="text-2xl font-bold text-white font-['Orbitron']">${customerMetrics.lifetime_value_avg}</div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-400/5">
                <div className="text-slate-400 text-xs mb-2 font-['Rajdhani']">Demographics</div>
                <div className="space-y-2">
                  {Object.entries(customerMetrics.demographics).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-slate-300 text-xs font-['Rajdhani']">{key.replace('age_', '').replace('_', '-')}</span>
                      <span className="text-white text-sm font-bold font-['Rajdhani']">{value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-400/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-xs font-['Rajdhani']">Retention Rate</span>
                  <span className="text-emerald-400 text-lg font-bold font-['Orbitron']">{customerMetrics.retention_rate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-['Rajdhani']">NPS Score</span>
                  <span className="text-blue-400 text-lg font-bold font-['Orbitron']">{customerMetrics.nps_score}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Staff Department Overview */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-5 border border-slate-400/10 shadow-2xl col-span-2">
            <h2 className="text-xl font-bold text-slate-200 font-['Orbitron'] flex items-center mb-4">
              <UserCheck className="w-5 h-5 mr-2 text-slate-400" />
              Staff Department Performance
            </h2>
            <div className="space-y-3">
              {staffOverview.map((dept, index) => (
                <div key={index} className="bg-slate-900/50 rounded-xl p-4 border border-slate-400/5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-slate-200 font-bold font-['Rajdhani']">{dept.department}</div>
                      <div className="text-slate-400 text-sm font-['Rajdhani']">{dept.count} employees</div>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        dept.efficiency === 'excellent' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                        dept.efficiency === 'good' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }`}>
                        {dept.efficiency.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-slate-400 text-xs font-['Rajdhani']">Performance</div>
                      <div className="text-white font-bold font-['Orbitron']">{dept.avg_performance}%</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-xs font-['Rajdhani']">Labor Cost/Day</div>
                      <div className="text-white font-bold font-['Orbitron']">${dept.labor_cost}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-xs font-['Rajdhani']">Per Employee</div>
                      <div className="text-white font-bold font-['Orbitron']">${(dept.labor_cost / dept.count).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment Performance */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-5 border border-slate-400/10 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-200 font-['Orbitron'] flex items-center mb-4">
              <Monitor className="w-5 h-5 mr-2 text-slate-400" />
              Equipment ROI
            </h2>
            <div className="space-y-3">
              {Object.entries(equipmentMetrics).map(([key, metrics], index) => (
                <div key={index} className="bg-slate-900/50 rounded-xl p-4 border border-slate-400/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-200 font-bold text-sm font-['Rajdhani']">
                      {key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${
                      metrics.status === 'excellent' ? 'bg-emerald-400' :
                      metrics.status === 'good' ? 'bg-blue-400' : 'bg-yellow-400'
                    } animate-pulse`}></div>
                  </div>
                  <div className="space-y-1 text-xs">
                    {Object.entries(metrics).filter(([k]) => k !== 'status').map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between">
                        <span className="text-slate-400 font-['Rajdhani']">
                          {k.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}:
                        </span>
                        <span className="text-white font-bold font-['Rajdhani']">
                          {typeof v === 'number' ? (k.includes('revenue') || k.includes('cost') ? `$${v.toFixed(2)}` : 
                           k.includes('rate') || k.includes('utilization') || k.includes('efficiency') || k.includes('uptime') ? `${v}%` : v) : v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-5 border border-slate-400/10 shadow-2xl col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-200 font-['Orbitron'] flex items-center">
                <ClipboardList className="w-5 h-5 mr-2 text-slate-400" />
                Pending Your Approval
              </h2>
              <span className="text-orange-400 text-sm font-bold font-['Rajdhani']">{empireData.pending_approvals} items</span>
            </div>
            <div className="space-y-3">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="bg-slate-900/50 rounded-xl p-4 border border-slate-400/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-slate-200 font-bold font-['Rajdhani']">{approval.type}</span>
                        <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                          approval.priority === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {approval.priority.toUpperCase()}
                        </div>
                      </div>
                      <div className="text-slate-400 text-sm font-['Rajdhani']">
                        {approval.employee && `${approval.employee} • `}
                        {approval.department && `${approval.department} • `}
                        {approval.vendor && `${approval.vendor} • `}
                        {approval.amount && `$${approval.amount.toLocaleString()} • `}
                        {approval.budget && `$${approval.budget.toLocaleString()} • `}
                        {approval.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-2 rounded-lg hover:scale-105 transition-all text-sm font-['Rajdhani']">
                      APPROVE
                    </button>
                    <button className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-2 rounded-lg hover:scale-105 transition-all text-sm font-['Rajdhani']">
                      DENY
                    </button>
                    <button className="px-4 bg-slate-700/50 text-slate-300 font-bold py-2 rounded-lg hover:bg-slate-700 transition-all text-sm">
                      INFO
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Incidents */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-5 border border-slate-400/10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-200 font-['Orbitron'] flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-400" />
                Active Incidents
              </h2>
              <span className="text-orange-400 text-sm font-bold font-['Rajdhani']">{empireData.active_incidents}</span>
            </div>
            <div className="space-y-3">
              {activeIncidents.map((incident) => (
                <div key={incident.id} className="bg-slate-900/50 rounded-xl p-4 border border-slate-400/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                      incident.severity === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      incident.severity === 'medium' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {incident.severity.toUpperCase()}
                    </div>
                    <span className="text-slate-400 text-xs font-['Rajdhani']">{incident.time}</span>
                  </div>
                  <div className="text-slate-200 font-bold text-sm mb-1 font-['Rajdhani']">{incident.description}</div>
                  <div className="text-slate-400 text-xs mb-3 font-['Rajdhani']">{incident.location}</div>
                  <button className="w-full bg-gradient-to-r from-slate-600 to-slate-800 text-white font-bold py-2 rounded-lg hover:scale-105 transition-all text-sm font-['Rajdhani']">
                    VIEW DETAILS
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Health */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-5 border border-slate-400/10 shadow-2xl col-span-3">
            <h2 className="text-xl font-bold text-slate-200 font-['Orbitron'] flex items-center mb-4">
              <DollarSign className="w-5 h-5 mr-2 text-slate-400" />
              Financial Health Dashboard
            </h2>
            <div className="grid grid-cols-5 gap-4">
              {[
                { label: 'Revenue (Year)', value: `$${empireData.revenue_year.toLocaleString()}`, sublabel: 'Annual run rate', color: 'from-emerald-400 to-green-500' },
                { label: 'Profit Margin', value: `${empireData.profit_margin}%`, sublabel: 'Industry avg: 22%', color: 'from-blue-400 to-cyan-500' },
                { label: 'Monthly Burn', value: `$${empireData.burn_rate.toLocaleString()}`, sublabel: 'Operating expenses', color: 'from-orange-400 to-red-500' },
                { label: 'Cash Runway', value: `${empireData.runway_months} mo`, sublabel: 'At current burn rate', color: 'from-purple-400 to-pink-500' },
                { label: 'Cash Flow', value: empireData.cash_flow_status, sublabel: 'Positive for 6 months', color: 'from-teal-400 to-cyan-500' }
              ].map((metric, index) => (
                <div key={index} className="bg-slate-900/50 rounded-xl p-4 border border-slate-400/5">
                  <div className={`w-full h-1 bg-gradient-to-r ${metric.color} rounded-full mb-3`}></div>
                  <div className="text-slate-400 text-xs mb-1 font-['Rajdhani']">{metric.label}</div>
                  <div className="text-2xl font-bold text-white font-['Orbitron'] mb-1">{metric.value}</div>
                  <div className="text-slate-500 text-xs font-['Rajdhani']">{metric.sublabel}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  // Emergency Broadcast Panel
  const BroadcastPanel = () => {
    if (!showBroadcastPanel) return null;

    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-red-900 to-black rounded-3xl max-w-2xl w-full border border-red-500/30 shadow-2xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center animate-pulse">
                  <Radio className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white font-['Orbitron']">EMERGENCY BROADCAST</h2>
                  <p className="text-red-300 text-sm font-['Rajdhani']">Send instant alerts to staff</p>
                </div>
              </div>
              <button onClick={() => setShowBroadcastPanel(false)} className="text-white/70 hover:text-white text-3xl">×</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm mb-2 block font-['Rajdhani']">Select Recipients</label>
                <div className="grid grid-cols-2 gap-3">
                  {['All Staff', 'Management Only', 'Gaming Tech', 'Food Service', 'Security', 'Custom Select'].map((option) => (
                    <button key={option} className="bg-slate-800/50 hover:bg-slate-700/50 text-white px-4 py-3 rounded-xl border border-slate-400/20 transition-all font-['Rajdhani']">
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 text-sm mb-2 block font-['Rajdhani']">Priority Level</label>
                <div className="grid grid-cols-3 gap-3">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-bold transition-all font-['Rajdhani']">
                    CRITICAL
                  </button>
                  <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-xl font-bold transition-all font-['Rajdhani']">
                    URGENT
                  </button>
                  <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-xl font-bold transition-all font-['Rajdhani']">
                    NORMAL
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-300 text-sm mb-2 block font-['Rajdhani']">Message</label>
                <textarea 
                  className="w-full bg-slate-900/50 border border-slate-400/20 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 h-32 font-['Rajdhani']"
                  placeholder="Type your broadcast message..."
                ></textarea>
              </div>

              <button className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-4 rounded-xl hover:scale-105 transition-all shadow-lg text-lg font-['Orbitron']">
                SEND BROADCAST NOW
              </button>

              <div className="text-center text-red-300 text-sm font-['Rajdhani']">
                All broadcasts are logged and timestamped for compliance
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Override Panel
  const OverridePanel = () => {
    if (!showOverridePanel) return null;

    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-slate-900 to-black rounded-3xl max-w-3xl w-full border border-slate-400/30 shadow-2xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 bg-gradient-to-r from-slate-400 to-slate-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-7 h-7 text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent font-['Orbitron']">OWNER OVERRIDE CONTROLS</h2>
                  <p className="text-slate-400 text-sm font-['Rajdhani']">Master access to all systems</p>
                </div>
              </div>
              <button onClick={() => setShowOverridePanel(false)} className="text-white/70 hover:text-white text-3xl">×</button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Clock, label: 'Clock Staff In/Out', color: 'from-emerald-500 to-green-600' },
                { icon: DollarSign, label: 'Comp Customer', color: 'from-blue-500 to-cyan-600' },
                { icon: XCircle, label: 'Void Transaction', color: 'from-red-500 to-orange-600' },
                { icon: Lock, label: 'Lock Down Venue', color: 'from-purple-500 to-pink-600' },
                { icon: Power, label: 'Emergency Shutdown', color: 'from-orange-500 to-red-600' },
                { icon: Camera, label: 'View All Cameras', color: 'from-teal-500 to-cyan-600' },
                { icon: Unlock, label: 'Unlock All Doors', color: 'from-lime-500 to-green-600' },
                { icon: Volume2, label: 'PA System Control', color: 'from-yellow-500 to-orange-600' },
                { icon: Settings, label: 'System Admin', color: 'from-slate-500 to-slate-700' }
              ].map((control, index) => (
                <button key={index} className={`bg-gradient-to-r ${control.color} text-white p-6 rounded-2xl hover:scale-105 transition-all shadow-lg flex flex-col items-center justify-center space-y-3`}>
                  <control.icon className="w-8 h-8" />
                  <span className="font-bold text-center text-sm font-['Rajdhani']">{control.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <div className="text-yellow-400 font-bold mb-1 font-['Rajdhani']">Override Access Warning</div>
                  <div className="text-yellow-300/80 text-sm font-['Rajdhani']">
                    All override actions are logged with timestamp, reason, and require owner authentication. These logs are permanent and cannot be deleted for legal compliance.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative bg-black min-h-screen">
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      <style jsx>{`
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animation-delay-1500 { animation-delay: 1.5s; }
        .animation-delay-3000 { animation-delay: 3s; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <DashboardScreen />
      <BroadcastPanel />
      <OverridePanel />
    </div>
  );
};

export default LanternOwnerApp;