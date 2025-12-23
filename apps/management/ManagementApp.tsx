import React, { useState, useEffect } from ‘react’;
import {
Users, TrendingUp, Trophy, Star, DollarSign, Clock,
Crown, Gift, Target, Zap, Activity, AlertCircle,
ChevronUp, ChevronDown, Eye, Settings, BarChart3,
PieChart, LineChart, Award, Medal, Heart, UserPlus,
Coins, Sparkles, Calendar, MapPin, Shield, Flame,
Bell, Wifi, WifiOff, Monitor, Server, Database,
Layers, Globe, Lock, Key, Search, Filter
} from ‘lucide-react’;

const IntegratedDashboard = () => {
const [activeTab, setActiveTab] = useState(‘overview’);
const [timeRange, setTimeRange] = useState(‘today’);
const [isAnimating, setIsAnimating] = useState(false);

const [realTimeData, setRealTimeData] = useState({
// Current system metrics
occupancy: {
current: 267,
capacity: 500,
percentage: 53.4,
trend: ‘increasing’,
zones: {
gaming_area: { current: 89, max: 150, vip_reserved: 12, trend: ‘stable’ },
dining_zone: { current: 124, max: 200, vip_reserved: 8, trend: ‘increasing’ },
social_lounge: { current: 54, max: 100, vip_reserved: 15, trend: ‘decreasing’ },
vip_lounge: { current: 23, max: 50, diamond_only: 5, trend: ‘increasing’ }
}
},

```
// Dynamic pricing data
pricing: {
  demand_level: 'high',
  current_multiplier: 1.3,
  time_multiplier: 1.2,
  surge_active: false,
  revenue_boost: 892.33,
  prices: {
    pod: { base: 89.99, current: 140.39, savings_vip: { silver: 14.04, gold: 28.08, platinum: 42.12, diamond: 70.20 } },
    rideshare_fee: { base: 15.00, current: 19.50, savings_vip: { silver: 1.95, gold: 3.90, platinum: 5.85, diamond: 9.75 } },
    vip_lounge: { base: 25.00, current: 32.50, savings_vip: { silver: 3.25, gold: 6.50, platinum: 9.75, diamond: 16.25 } }
  }
},

// VIP tier distribution
vip_distribution: {
  standard: { count: 189, percentage: 70.8, revenue_contribution: 45.2, trend: -2.3 },
  silver: { count: 52, percentage: 19.5, revenue_contribution: 28.1, trend: 5.7 },
  gold: { count: 18, percentage: 6.7, revenue_contribution: 16.3, trend: 12.4 },
  platinum: { count: 6, percentage: 2.2, revenue_contribution: 7.8, trend: 23.1 },
  diamond: { count: 2, percentage: 0.8, revenue_contribution: 2.6, trend: 15.8 }
},

// Age tier breakdown
age_distribution: {
  under_18: { count: 23, percentage: 8.6, avg_spend: 34.50, guardian_approvals: 12, satisfaction: 94 },
  '18_to_20': { count: 89, percentage: 33.3, avg_spend: 67.25, curfew_warnings: 3, satisfaction: 87 },
  over_21: { count: 155, percentage: 58.1, avg_spend: 125.80, bar_revenue: 1847.50, satisfaction: 91 }
},

// System health
system_health: {
  overall_status: 'excellent',
  uptime: '99.97%',
  response_time: 127,
  error_rate: 0.2,
  cpu_usage: 34.2,
  memory_usage: 67.8,
  database_performance: 'optimal',
  redis_performance: 'excellent'
},

// Loyalty & rewards activity
loyalty: {
  points_awarded_today: 45780,
  points_redeemed_today: 12340,
  active_challenges: 4,
  challenge_completions: 23,
  achievements_earned: 8,
  engagement_rate: 78.3,
  top_earners: [
    { name: 'Alex M.', points: 2340, tier: 'gold', streak: 5, avatar: '👨‍💼' },
    { name: 'Sarah K.', points: 1890, tier: 'silver', streak: 12, avatar: '👩‍🦰' },
    { name: 'Mike R.', points: 1650, tier: 'platinum', streak: 8, avatar: '👨‍🦱' }
  ]
},

// Social features
social: {
  friend_requests_today: 15,
  group_sessions_active: 8,
  social_challenges_completed: 12,
  referrals_today: 6,
  viral_coefficient: 1.34,
  trending_achievements: ['Social Butterfly', 'Night Owl', 'Transport Master']
},

// Revenue analytics
revenue: {
  total_today: 8934.50,
  target_today: 8500.00,
  growth_rate: 15.3,
  breakdown: {
    transport: { amount: 4567.80, percentage: 51.1, growth: 12.4 },
    food_beverage: { amount: 2890.35, percentage: 32.4, growth: 18.7 },
    vip_services: { amount: 1234.90, percentage: 13.8, growth: 25.3 },
    merchandise: { amount: 241.45, percentage: 2.7, growth: -5.2 }
  },
  vip_premium: 2347.60,
  loyalty_discounts: -456.78,
  dynamic_pricing_boost: 892.33
}
```

});

// Enhanced animations and real-time updates
useEffect(() => {
const interval = setInterval(() => {
setRealTimeData(prev => ({
…prev,
occupancy: {
…prev.occupancy,
current: Math.max(100, Math.min(490, prev.occupancy.current + Math.floor(Math.random() * 8) - 4)),
percentage: ((prev.occupancy.current + Math.floor(Math.random() * 8) - 4) / prev.occupancy.capacity) * 100
},
pricing: {
…prev.pricing,
demand_level: prev.occupancy.percentage > 85 ? ‘surge’ :
prev.occupancy.percentage > 70 ? ‘peak’ :
prev.occupancy.percentage > 50 ? ‘high’ : ‘normal’
},
loyalty: {
…prev.loyalty,
points_awarded_today: prev.loyalty.points_awarded_today + Math.floor(Math.random() * 50),
challenge_completions: prev.loyalty.challenge_completions + (Math.random() > 0.95 ? 1 : 0)
},
revenue: {
…prev.revenue,
total_today: prev.revenue.total_today + (Math.random() * 50)
}
}));
}, 5000);

```
return () => clearInterval(interval);
```

}, []);

const tabTransition = (newTab) => {
setIsAnimating(true);
setTimeout(() => {
setActiveTab(newTab);
setIsAnimating(false);
}, 150);
};

const OverviewTab = () => (
<div className="space-y-8">
{/* Hero Metrics Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
<MetricCard
title=“Live Occupancy”
value={`${realTimeData.occupancy.current}/${realTimeData.occupancy.capacity}`}
subtitle={`${realTimeData.occupancy.percentage.toFixed(1)}% capacity`}
icon={Users}
gradient=“from-blue-500 to-cyan-500”
trend={realTimeData.occupancy.trend}
sparkline={[45, 52, 48, 61, 58, 67, 53]}
/>
<MetricCard
title=“Revenue Performance”
value={`$${realTimeData.revenue.total_today.toLocaleString()}`}
subtitle={`+${realTimeData.revenue.growth_rate}% vs target`}
icon={DollarSign}
gradient=“from-emerald-500 to-green-500”
trend=“increasing”
sparkline={[3200, 4100, 5300, 6800, 7200, 8100, 8934]}
/>
<MetricCard
title=“Dynamic Pricing”
value={`+$${realTimeData.pricing.revenue_boost.toFixed(0)}`}
subtitle={`${realTimeData.pricing.demand_level} demand (${realTimeData.pricing.current_multiplier}x)`}
icon={TrendingUp}
gradient=“from-purple-500 to-pink-500”
trend={realTimeData.pricing.demand_level === ‘surge’ ? ‘surge’ : ‘increasing’}
sparkline={[400, 520, 680, 750, 820, 890, 892]}
/>
<MetricCard
title=“VIP Revenue”
value={`$${realTimeData.revenue.vip_premium.toLocaleString()}`}
subtitle=“Premium tier contributions”
icon={Crown}
gradient=“from-amber-500 to-yellow-500”
trend=“increasing”
sparkline={[1200, 1450, 1680, 1890, 2100, 2250, 2347]}
/>
</div>

```
  {/* Age Demographics & System Health */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <DemographicsCard data={realTimeData.age_distribution} />
    <SystemHealthCard data={realTimeData.system_health} />
  </div>

  {/* Zone Status & Dynamic Pricing */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <ZoneOccupancyCard zones={realTimeData.occupancy.zones} />
    <LivePricingCard pricing={realTimeData.pricing} />
    <VIPDistributionCard distribution={realTimeData.vip_distribution} />
  </div>
</div>
```

);

const LoyaltyTab = () => (
<div className="space-y-8">
{/* Loyalty Overview Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
<MetricCard
title=“Points Awarded”
value={realTimeData.loyalty.points_awarded_today.toLocaleString()}
subtitle=“Today’s total”
icon={Coins}
gradient=“from-yellow-500 to-orange-500”
trend=“increasing”
sparkline={[25000, 31000, 37000, 41000, 43000, 45000, 45780]}
/>
<MetricCard
title=“Engagement Rate”
value={`${realTimeData.loyalty.engagement_rate}%`}
subtitle=“Active participation”
icon={Heart}
gradient=“from-pink-500 to-rose-500”
trend=“increasing”
sparkline={[65, 70, 72, 75, 76, 77, 78]}
/>
<MetricCard
title=“Challenge Completions”
value={realTimeData.loyalty.challenge_completions}
subtitle=“Today’s achievements”
icon={Target}
gradient=“from-green-500 to-emerald-500”
trend=“increasing”
sparkline={[8, 12, 16, 18, 20, 22, 23]}
/>
<MetricCard
title=“Social Virality”
value={`${realTimeData.social.viral_coefficient}x`}
subtitle=“Referral multiplier”
icon={UserPlus}
gradient=“from-blue-500 to-indigo-500”
trend=“increasing”
sparkline={[1.1, 1.15, 1.22, 1.28, 1.31, 1.33, 1.34]}
/>
</div>

```
  {/* Top Performers & Trending */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <TopEarnersCard earners={realTimeData.loyalty.top_earners} />
    <TrendingAchievementsCard achievements={realTimeData.social.trending_achievements} />
  </div>

  {/* Loyalty Analytics */}
  <LoyaltyAnalyticsCard loyalty={realTimeData.loyalty} />
</div>
```

);

const SocialTab = () => (
<div className="space-y-8">
{/* Social Metrics */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
<MetricCard
title="Friend Connections"
value={realTimeData.social.friend_requests_today}
subtitle="New today"
icon={UserPlus}
gradient="from-blue-500 to-cyan-500"
trend="increasing"
/>
<MetricCard
title="Group Sessions"
value={realTimeData.social.group_sessions_active}
subtitle="Currently active"
icon={Users}
gradient="from-green-500 to-teal-500"
trend="stable"
/>
<MetricCard
title="Social Challenges"
value={realTimeData.social.social_challenges_completed}
subtitle="Completed today"
icon={Heart}
gradient="from-pink-500 to-rose-500"
trend="increasing"
/>
<MetricCard
title=“Viral Growth”
value={`${realTimeData.social.viral_coefficient}x`}
subtitle=“Referral multiplier”
icon={Sparkles}
gradient=“from-purple-500 to-indigo-500”
trend=“increasing”
/>
</div>

```
  <SocialActivityFeed />
  <SocialLeaderboards />
</div>
```

);

// Enhanced component definitions
const MetricCard = ({ title, value, subtitle, icon: Icon, gradient, trend, sparkline }) => (
<div className={`relative overflow-hidden bg-gradient-to-r ${gradient} rounded-3xl p-6 shadow-2xl hover:scale-105 transition-all duration-300 group`}>
{/* Animated background pattern */}
<div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
<div className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>

```
  <div className="relative z-10">
    <div className="flex items-center justify-between mb-4">
      <Icon className="w-8 h-8 text-white/90 group-hover:scale-110 transition-transform duration-300" />
      {trend && <TrendIndicator trend={trend} />}
    </div>
    
    <div className="space-y-2">
      <div className="text-3xl font-bold text-white group-hover:scale-105 transition-transform duration-300">
        {value}
      </div>
      <div className="text-white/80 text-sm font-medium">{subtitle}</div>
      <div className="text-white/70 text-sm">{title}</div>
    </div>

    {sparkline && (
      <div className="mt-4">
        <MiniSparkline data={sparkline} />
      </div>
    )}
  </div>
</div>
```

);

const TrendIndicator = ({ trend }) => {
const getTrendConfig = () => {
switch(trend) {
case ‘increasing’:
return { icon: ChevronUp, color: ‘text-emerald-300’, bg: ‘bg-emerald-500/20’ };
case ‘decreasing’:
return { icon: ChevronDown, color: ‘text-red-300’, bg: ‘bg-red-500/20’ };
case ‘surge’:
return { icon: Zap, color: ‘text-yellow-300’, bg: ‘bg-yellow-500/20’ };
default:
return { icon: Zap, color: ‘text-white/60’, bg: ‘bg-white/10’ };
}
};

```
const { icon: TrendIcon, color, bg } = getTrendConfig();

return (
  <div className={`${bg} ${color} p-2 rounded-full backdrop-blur-sm`}>
    <TrendIcon className="w-4 h-4" />
  </div>
);
```

};

const MiniSparkline = ({ data }) => (
<div className="flex items-end space-x-1 h-8">
{data.map((value, index) => {
const max = Math.max(…data);
const height = (value / max) * 100;
return (
<div
key={index}
className=“bg-white/40 rounded-sm flex-1 transition-all duration-300 hover:bg-white/60”
style={{ height: `${height}%` }}
></div>
);
})}
</div>
);

const DemographicsCard = ({ data }) => (
<div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl">
<div className="flex items-center justify-between mb-8">
<h3 className="text-2xl font-bold text-white flex items-center">
<Users className="w-7 h-7 mr-3 text-blue-400" />
Age Demographics
</h3>
<select
value={timeRange}
onChange={(e) => setTimeRange(e.target.value)}
className=“bg-white/10 backdrop-blur-sm text-white rounded-2xl px-4 py-2 text-sm border border-white/20 focus:border-white/40 transition-colors”
>
<option value="today">Today</option>
<option value="week">This Week</option>
<option value="month">This Month</option>
</select>
</div>

```
  <div className="space-y-6">
    {Object.entries(data).map(([tier, info]) => (
      <div key={tier} className="group">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${
                tier === 'under_18' ? 'bg-orange-400' :
                tier === '18_to_20' ? 'bg-blue-400' : 'bg-emerald-400'
              } group-hover:scale-125 transition-transform duration-300`}></div>
              <span className="font-semibold text-white text-lg capitalize">
                {tier.replace('_', '-')} ({info.count})
              </span>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 font-bold text-lg">${info.avg_spend}</div>
              <div className="text-white/60 text-sm">avg spend</div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  tier === 'under_18' ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                  tier === '18_to_20' ? 'bg-gradient-to-r from-blue-400 to-blue-500' : 
                  'bg-gradient-to-r from-emerald-400 to-emerald-500'
                }`}
                style={{ width: `${info.percentage}%` }}
              >
                <div className="w-full h-full bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/5 rounded-xl p-3">
              <div className="text-white/80 mb-1">
                {tier === 'under_18' && `${info.guardian_approvals} guardian approvals`}
                {tier === '18_to_20' && `${info.curfew_warnings} curfew warnings`}
                {tier === 'over_21' && `$${info.bar_revenue.toLocaleString()} bar revenue`}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <div className="text-emerald-400 font-bold">{info.satisfaction}%</div>
              <div className="text-white/60 text-xs">satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
```

);

const SystemHealthCard = ({ data }) => (
<div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl">
<div className="flex items-center justify-between mb-8">
<h3 className="text-2xl font-bold text-white flex items-center">
<Server className="w-7 h-7 mr-3 text-emerald-400" />
System Health
</h3>
<div className={`px-4 py-2 rounded-full text-sm font-medium ${ data.overall_status === 'excellent' ? 'bg-emerald-500/20 text-emerald-400' : data.overall_status === 'good' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400' }`}>
{data.overall_status.toUpperCase()}
</div>
</div>

```
  <div className="grid grid-cols-2 gap-6 mb-8">
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
      <div className="text-3xl font-bold text-emerald-400 mb-2">{data.uptime}</div>
      <div className="text-white/70 text-sm">System Uptime</div>
    </div>
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
      <div className="text-3xl font-bold text-blue-400 mb-2">{data.response_time}ms</div>
      <div className="text-white/70 text-sm">Avg Response</div>
    </div>
  </div>

  <div className="space-y-4">
    {[
      { label: 'CPU Usage', value: data.cpu_usage, max: 100, color: 'blue' },
      { label: 'Memory Usage', value: data.memory_usage, max: 100, color: 'purple' },
      { label: 'Error Rate', value: data.error_rate, max: 5, color: 'red' }
    ].map((metric, index) => (
      <div key={index} className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/80">{metric.label}</span>
          <span className={`font-bold ${
            metric.color === 'blue' ? 'text-blue-400' :
            metric.color === 'purple' ? 'text-purple-400' : 'text-red-400'
          }`}>
            {metric.value}{metric.label === 'Error Rate' ? '%' : metric.label.includes('Usage') ? '%' : ''}
          </span>
        </div>
        <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${
              metric.color === 'blue' ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
              metric.color === 'purple' ? 'bg-gradient-to-r from-purple-400 to-purple-500' :
              'bg-gradient-to-r from-red-400 to-red-500'
            }`}
            style={{ width: `${(metric.value / metric.max) * 100}%` }}
          >
            <div className="w-full h-full bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
```

);

const ZoneOccupancyCard = ({ zones }) => (
<div className="lg:col-span-2 bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl">
<h3 className="text-2xl font-bold text-white mb-8 flex items-center">
<MapPin className="w-7 h-7 mr-3 text-emerald-400" />
Live Zone Status
</h3>

```
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {Object.entries(zones).map(([zone, data]) => {
      const occupancyPercent = (data.current / data.max) * 100;
      const vipPercent = (data.vip_reserved / data.current) * 100;
      
      return (
        <div key={zone} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-white text-lg capitalize group-hover:text-emerald-400 transition-colors">
              {zone.replace('_', ' ')}
            </h4>
            <div className="flex items-center space-x-2">
              <span className="text-white/80 text-sm">{data.current}/{data.max}</span>
              <TrendIndicator trend={data.trend} />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">General Occupancy</span>
              <span className="text-blue-400 font-bold">{occupancyPercent.toFixed(0)}%</span>
            </div>
            <div className="relative">
              <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-blue-500 h-full rounded-full transition-all duration-700 relative"
                  style={{ width: `${occupancyPercent}%` }}
                >
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-purple-500 h-full rounded-full absolute top-0 left-0"
                    style={{ width: `${vipPercent}%` }}
                  ></div>
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-purple-300 flex items-center">
                <Crown className="w-3 h-3 mr-1" />
                {data.vip_reserved} VIP reserved
              </span>
              {zone === 'vip_lounge' && (
                <span className="text-blue-300 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {data.diamond_only} Diamond only
                </span>
              )}
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>
```

);

const LivePricingCard = ({ pricing }) => (
<div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl">
<h3 className="text-2xl font-bold text-white mb-8 flex items-center">
<DollarSign className="w-7 h-7 mr-3 text-emerald-400" />
Dynamic Pricing
</h3>

```
  <div className={`p-6 rounded-2xl border-l-4 mb-6 transition-all duration-300 ${
    pricing.demand_level === 'surge' ? 'border-red-500 bg-red-500/10' :
    pricing.demand_level === 'peak' ? 'border-orange-500 bg-orange-500/10' :
    pricing.demand_level === 'high' ? 'border-yellow-500 bg-yellow-500/10' :
    'border-green-500 bg-green-500/10'
  }`}>
    <div className="flex items-center justify-between mb-3">
      <span className="font-bold text-white">Demand Level</span>
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
        pricing.demand_level === 'surge' ? 'bg-red-500 text-white' :
        pricing.demand_level === 'peak' ? 'bg-orange-500 text-white' :
        pricing.demand_level === 'high' ? 'bg-yellow-500 text-black' :
        'bg-green-500 text-black'
      }`}>
        {pricing.demand_level}
      </span>
    </div>
    <div className="text-sm text-white/70">
      {pricing.current_multiplier}x base price • +${pricing.revenue_boost.toFixed(0)} revenue boost
    </div>
  </div>

  <div className="space-y-4">
    {Object.entries(pricing.prices).map(([service, price]) => (
      <div key={service} className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-white capitalize">
            {service.replace('_', ' ')}
          </span>
          <div className="text-right">
            <div className="text-emerald-400 font-bold text-xl">${price.current}</div>
            <div className="text-white/60 text-sm line-through">${price.base}</div>
          </div>
        </div>
        
        <div className="text-xs text-white/60">
          VIP Savings: 
          <span className="text-amber-400 ml-2 font-medium">
            Gold -${price.savings_vip.gold.toFixed(2)}
          </span>
          <span className="text-blue-400 ml-2 font-medium">
            Diamond -${price.savings_vip.diamond.toFixed(2)}
          </span>
        </div>
      </div>
    ))}
  </div>
</div>
```

);

const VIPDistributionCard = ({ distribution }) => (
<div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl">
<h3 className="text-2xl font-bold text-white mb-8 flex items-center">
<Crown className="w-7 h-7 mr-3 text-amber-400" />
VIP Tiers
</h3>

```
  <div className="space-y-4">
    {Object.entries(distribution).map(([tier, data]) => {
      const tierColors = {
        standard: { bg: 'bg-gray-500', text: 'text-gray-400', gradient: 'from-gray-400 to-gray-500' },
        silver: { bg: 'bg-gray-400', text: 'text-gray-300', gradient: 'from-gray-300 to-gray-400' },
        gold: { bg: 'bg-amber-500', text: 'text-amber-400', gradient: 'from-amber-400 to-amber-500' },
        platinum: { bg: 'bg-purple-500', text: 'text-purple-400', gradient: 'from-purple-400 to-purple-500' },
        diamond: { bg: 'bg-blue-400', text: 'text-blue-400', gradient: 'from-blue-400 to-cyan-400' }
      };
      
      return (
        <div key={tier} className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-4 h-4 rounded-full ${tierColors[tier].bg} group-hover:scale-125 transition-transform duration-300`}></div>
              <div>
                <span className="font-semibold text-white capitalize text-lg">{tier}</span>
                <span className="text-white/60 text-sm ml-2">({data.count} members)</span>
              </div>
            </div>
            <div className="text-right flex items-center space-x-4">
              <div>
                <div className="text-emerald-400 font-bold text-lg">{data.revenue_contribution.toFixed(1)}%</div>
                <div className="text-white/60 text-xs">revenue</div>
              </div>
              <div className={`flex items-center space-x-1 ${data.trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {data.trend > 0 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span className="text-sm font-medium">{Math.abs(data.trend).toFixed(1)}%</span>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${tierColors[tier].gradient} rounded-full transition-all duration-700`}
                style={{ width: `${data.percentage}%` }}
              >
                <div className="w-full h-full bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>
```

);

// Additional enhanced components for other tabs would go here…
const TopEarnersCard = ({ earners }) => (
<div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl">
<h3 className="text-2xl font-bold text-white mb-8 flex items-center">
<Medal className="w-7 h-7 mr-3 text-amber-400" />
Top Point Earners
</h3>

```
  <div className="space-y-4">
    {earners.map((user, index) => (
      <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
              index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black' :
              index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-black' :
              index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white' :
              'bg-white/10 text-white'
            } group-hover:scale-110 transition-transform duration-300`}>
              {index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}
            </div>
            <div>
              <div className="font-bold text-white text-lg">{user.name}</div>
              <div className="text-white/60 text-sm capitalize flex items-center space-x-2">
                <span>{user.tier} member</span>
                <span>•</span>
                <span className="flex items-center">
                  <Flame className="w-3 h-3 mr-1" />
                  {user.streak} day streak
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-amber-400 font-bold text-xl">{user.points.toLocaleString()}</div>
            <div className="text-white/60 text-sm">points</div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
```

);

const TrendingAchievementsCard = ({ achievements }) => (
<div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl">
<h3 className="text-2xl font-bold text-white mb-8 flex items-center">
<Flame className="w-7 h-7 mr-3 text-red-400" />
Trending Achievements
</h3>

```
  <div className="space-y-4">
    {achievements.map((achievement, index) => (
      <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Trophy className="w-8 h-8 text-amber-400 group-hover:scale-110 transition-transform duration-300" />
            <div>
              <div className="font-bold text-white text-lg">{achievement}</div>
              <div className="text-white/60 text-sm">Popular achievement this week</div>
            </div>
          </div>
          <ChevronUp className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
        </div>
      </div>
    ))}
  </div>
</div>
```

);

const LoyaltyAnalyticsCard = ({ loyalty }) => (
<div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl">
<h3 className="text-2xl font-bold text-white mb-8 flex items-center">
<BarChart3 className="w-7 h-7 mr-3 text-blue-400" />
Loyalty Program Analytics
</h3>

```
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center">
      <div className="text-3xl font-bold text-amber-400 mb-2">{loyalty.engagement_rate}%</div>
      <div className="text-white/70 text-sm">Engagement Rate</div>
    </div>
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center">
      <div className="text-3xl font-bold text-emerald-400 mb-2">{loyalty.active_challenges}</div>
      <div className="text-white/70 text-sm">Active Challenges</div>
    </div>
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center">
      <div className="text-3xl font-bold text-purple-400 mb-2">{loyalty.achievements_earned}</div>
      <div className="text-white/70 text-sm">Achievements Today</div>
    </div>
  </div>
</div>
```

);

const SocialActivityFeed = () => (
<div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl">
<h3 className="text-2xl font-bold text-white mb-8 flex items-center">
<Activity className="w-7 h-7 mr-3 text-emerald-400" />
Live Social Activity
</h3>

```
  <div className="space-y-4">
    {[
      { user: 'Alex M.', action: 'unlocked Social Butterfly achievement', time: '2 min ago', type: 'achievement', avatar: '👨‍💼' },
      { user: 'Party Squad', action: 'completed Big Spenders group challenge', time: '5 min ago', type: 'challenge', avatar: '🎉' },
      { user: 'Sarah K.', action: 'referred new friend Jamie L.', time: '8 min ago', type: 'referral', avatar: '👩‍🦰' },
      { user: 'Mike R.', action: 'reached Platinum VIP status', time: '12 min ago', type: 'tier', avatar: '👨‍🦱' }
    ].map((activity, index) => (
      <div key={index} className="flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
        <div className="text-2xl">{activity.avatar}</div>
        <div className={`w-2 h-2 rounded-full ${
          activity.type === 'achievement' ? 'bg-amber-400' :
          activity.type === 'challenge' ? 'bg-emerald-400' :
          activity.type === 'referral' ? 'bg-blue-400' : 'bg-purple-400'
        } animate-pulse`}></div>
        <div className="flex-1">
          <div className="text-white">
            <span className="font-bold">{activity.user}</span> {activity.action}
          </div>
          <div className="text-white/60 text-sm">{activity.time}</div>
        </div>
      </div>
    ))}
  </div>
</div>
```

);

const SocialLeaderboards = () => (
<div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl">
<h3 className="text-2xl font-bold text-white mb-8 flex items-center">
<BarChart3 className="w-7 h-7 mr-3 text-blue-400" />
Social Leaderboards
</h3>

```
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <h4 className="font-bold text-white mb-4">Weekly Points Leaders</h4>
      <div className="space-y-3">
        {[
          { name: 'Alex M.', points: 4250, badge: '🥇' },
          { name: 'Sarah K.', points: 3890, badge: '🥈' },
          { name: 'Mike R.', points: 3650, badge: '🥉' }
        ].map((leader, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-colors">
            <span className="text-white flex items-center">
              <span className="text-2xl mr-3">{leader.badge}</span>
              {leader.name}
            </span>
            <span className="text-amber-400 font-bold">{leader.points.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>

    <div>
      <h4 className="font-bold text-white mb-4">Social Butterflies</h4>
      <div className="space-y-3">
        {[
          { name: 'Emma T.', connections: 23, badge: '🦋' },
          { name: 'Jake P.', connections: 19, badge: '🦋' },
          { name: 'Lisa M.', connections: 17, badge: '🦋' }
        ].map((social, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-colors">
            <span className="text-white flex items-center">
              <span className="text-2xl mr-3">{social.badge}</span>
              {social.name}
            </span>
            <span className="text-pink-400 font-bold">{social.connections} friends</span>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
```

);

const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
<button
onClick={() => onClick(id)}
className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${ active  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'  : 'text-white/70 hover:text-white hover:bg-white/10' }`}
>
<Icon className="w-5 h-5" />
<span>{label}</span>
</button>
);

return (
<div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 relative overflow-hidden">
{/* Animated background elements */}
<div className="absolute inset-0 overflow-hidden">
<div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
<div className="absolute top-40 left-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
</div>

```
  <div className="relative z-10 p-8">
    <div className="max-w-7xl mx-auto">
      {/* Premium Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Last Light Command Center
            </h1>
            <p className="text-xl text-white/70">
              Advanced Analytics • VIP Management • Dynamic Intelligence
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-emerald-400 mb-2">
              ${realTimeData.revenue.total_today.toLocaleString()}
            </div>
            <div className="text-white/70 text-lg">Today's Revenue</div>
            <div className="flex items-center justify-end space-x-2 mt-2">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 font-semibold">Live Updates</span>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="flex space-x-2 bg-white/5 backdrop-blur-lg p-2 rounded-3xl border border-white/10">
          <TabButton 
            id="overview" 
            label="System Overview" 
            icon={Monitor} 
            active={activeTab === 'overview'} 
            onClick={tabTransition} 
          />
          <TabButton 
            id="loyalty" 
            label="Loyalty & Rewards" 
            icon={Trophy} 
            active={activeTab === 'loyalty'} 
            onClick={tabTransition} 
          />
          <TabButton 
            id="social" 
            label="Social Intelligence" 
            icon={Heart} 
            active={activeTab === 'social'} 
            onClick={tabTransition} 
          />
        </div>
      </div>

      {/* Tab Content with Transition */}
      <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'loyalty' && <LoyaltyTab />}
        {activeTab === 'social' && <SocialTab />}
      </div>

      {/* Enhanced Status Bar */}
      <div className="mt-12 bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-white/90 font-semibold">All Systems Operational</span>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-white/70">VIP Engine: <span className="text-amber-400 font-semibold">Active</span></span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-white/70">Dynamic Pricing: <span className="text-purple-400 font-semibold uppercase">
                {realTimeData.pricing.demand_level}
              </span></span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-pink-400" />
              <span className="text-white/70">Social Features: <span className="text-pink-400 font-semibold">Engaged</span></span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white/70">
              Response Time: <span className="text-emerald-400 font-semibold">{realTimeData.system_health.response_time}ms</span>
            </span>
            <span className="text-white/70">
              Uptime: <span className="text-blue-400 font-semibold">{realTimeData.system_health.uptime}</span>
            </span>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Enhanced CSS for animations */}
  <style jsx>{`
    .animate-blob {
      animation: blob 7s infinite;
    }
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    .animation-delay-4000 {
      animation-delay: 4s;
    }
    @keyframes blob {
      0% {
        transform: translate(0px, 0px) scale(1);
      }
      33% {
        transform: translate(30px, -50px) scale(1.1);
      }
      66% {
        transform: translate(-20px, 20px) scale(0.9);
      }
      100% {
        transform: translate(0px, 0px) scale(1);
      }
    }
  `}</style>
</div>
```

);
};

export default IntegratedDashboard;