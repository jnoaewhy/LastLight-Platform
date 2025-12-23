import React, { useState, useEffect } from ‘react’;
import {
Home, User, Trophy, Users, Star, Gift, DollarSign, Clock,
Crown, Zap, Bell, Settings, QrCode, CreditCard, MapPin,
Car, Bed, Coffee, Heart, Target, Award, Coins, Sparkles,
Camera, Phone, Shield, AlertTriangle, CheckCircle, Plus,
Minus, Eye, EyeOff, Navigation, Calendar, Flame, Medal,
UserPlus, MessageSquare, Share2, TrendingUp, BarChart3,
ChevronRight, Play, Pause, Volume2, WifiOff, Wifi
} from ‘lucide-react’;

const PatronMobileApp = () => {
const [currentScreen, setCurrentScreen] = useState(‘home’);
const [isAnimating, setIsAnimating] = useState(false);
const [userData, setUserData] = useState({
name: ‘Alex M.’,
age: 23,
age_tier: ‘over_21’,
vip_tier: ‘gold’,
session_active: true,
session_id: ‘sess_4A7B8C9D’,
points: 8750,
spending_balance: 67.50,
spending_limit: 200.00,
daily_spending: 45.30,
friends: 12,
groups: 3,
referrals: 4,
entry_time: ‘7:32 PM’,
zone: ‘Gaming Area’,
transport: ‘pod’,
wristband_active: true,
achievements_earned: 8,
active_challenges: 2,
challenge_streak: 5
});

const [notifications, setNotifications] = useState([
{
id: 1,
type: ‘achievement’,
title: ‘Achievement Unlocked! 🏆’,
message: ‘Social Butterfly completed - 300 points earned!’,
time: ‘2 min ago’,
gradient: ‘from-yellow-400 to-orange-500’,
icon: Trophy
},
{
id: 2,
type: ‘social’,
title: ‘Friend Request ✨’,
message: ‘Jamie L. wants to connect and explore together’,
time: ‘15 min ago’,
gradient: ‘from-pink-400 to-purple-500’,
icon: UserPlus
},
{
id: 3,
type: ‘vip’,
title: ‘Exclusive VIP Offer 💎’,
message: ‘Gold member pricing: Save $23.60 on pod upgrade’,
time: ‘28 min ago’,
gradient: ‘from-purple-400 to-blue-500’,
icon: Crown
}
]);

const [realTimeData, setRealTimeData] = useState({
venue_occupancy: 67,
demand_level: ‘high’,
friends_online: 4,
current_pricing: {
pod: { base: 89.99, current: 117.99, vip_price: 94.39, savings: 23.60 },
rideshare: { base: 15.00, current: 19.50, vip_price: 15.60, savings: 3.90 },
vip_lounge: { base: 25.00, current: 32.50, vip_price: 26.00, savings: 6.50 }
},
active_challenges: [
{
id: 1,
name: ‘Night Owl’,
description: ‘Stay past midnight to unlock exclusive rewards’,
progress: 75,
reward: ‘200 points + Night Owl badge’,
expires_in: ‘2h 15m’,
color: ‘from-indigo-500 to-purple-600’
},
{
id: 2,
name: ‘Social Explorer’,
description: ‘Visit 3 different zones with friends’,
progress: 67,
reward: ‘150 points + Zone Master badge’,
expires_in: ‘5h 30m’,
color: ‘from-emerald-500 to-blue-600’
}
],
zones: [
{ name: ‘Gaming Area’, occupancy: 78, vibe: ‘Electric’, color: ‘from-purple-500 to-pink-500’ },
{ name: ‘Social Lounge’, occupancy: 45, vibe: ‘Chill’, color: ‘from-blue-500 to-cyan-500’ },
{ name: ‘VIP Zone’, occupancy: 89, vibe: ‘Exclusive’, color: ‘from-amber-500 to-orange-500’ }
]
});

// Enhanced animations and transitions
const screenTransition = (newScreen) => {
setIsAnimating(true);
setTimeout(() => {
setCurrentScreen(newScreen);
setIsAnimating(false);
}, 150);
};

// Simulate real-time updates with smooth animations
useEffect(() => {
const interval = setInterval(() => {
setRealTimeData(prev => ({
…prev,
venue_occupancy: Math.max(30, Math.min(95, prev.venue_occupancy + Math.floor(Math.random() * 6) - 3)),
friends_online: Math.max(0, Math.min(8, prev.friends_online + Math.floor(Math.random() * 3) - 1)),
demand_level: prev.venue_occupancy > 80 ? ‘surge’ : prev.venue_occupancy > 65 ? ‘high’ : ‘normal’
}));
}, 8000);

```
return () => clearInterval(interval);
```

}, []);

const HomeScreen = () => (
<div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen relative overflow-hidden">
{/* Animated background elements */}
<div className="absolute inset-0 overflow-hidden">
<div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
<div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
</div>

```
  {/* Header with premium glassmorphism */}
  <div className="relative z-10 bg-white/10 backdrop-blur-lg border-b border-white/20 p-6 pb-8">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back, {userData.name}!</h1>
          <p className="text-white/70 capitalize flex items-center space-x-2">
            <span className="px-3 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full text-sm font-medium border border-amber-500/30">
              {userData.vip_tier} Member
            </span>
            <span className="text-white/50">•</span>
            <span>{userData.age_tier.replace('_', '-')}</span>
          </p>
        </div>
      </div>
      <div className="relative">
        <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all duration-300">
          <Bell className="w-6 h-6 text-white" />
          {notifications.length > 0 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xs font-bold">{notifications.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
    
    {/* Enhanced Session Status */}
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-xl shadow-black/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-4 h-4 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
          </div>
          <span className="text-white font-semibold text-lg">Session Active</span>
          <span className="px-2 py-1 bg-emerald-500/20 rounded-lg text-emerald-300 text-xs font-medium">
            {Math.floor((Date.now() - new Date().setHours(19, 32)) / 60000)} min
          </span>
        </div>
        <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
          <QrCode className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm mb-1">{userData.zone} • Entered {userData.entry_time}</p>
          <p className="text-white/60 text-xs">Session ID: {userData.session_id}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <span className="text-blue-300 text-sm font-medium">{userData.transport} reserved</span>
        </div>
      </div>
    </div>
  </div>

  {/* Enhanced Quick Stats */}
  <div className="relative z-10 px-6 -mt-4 mb-8">
    <div className="grid grid-cols-3 gap-4">
      {[
        { 
          icon: Coins, 
          value: userData.points.toLocaleString(), 
          label: 'Points',
          color: 'from-amber-400 to-yellow-500',
          glow: 'shadow-amber-500/25'
        },
        { 
          icon: DollarSign, 
          value: `$${userData.spending_balance}`, 
          label: 'Balance',
          color: 'from-emerald-400 to-green-500',
          glow: 'shadow-emerald-500/25'
        },
        { 
          icon: Users, 
          value: realTimeData.friends_online, 
          label: 'Friends Online',
          color: 'from-blue-400 to-cyan-500',
          glow: 'shadow-blue-500/25'
        }
      ].map((stat, index) => (
        <div key={index} className={`bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 shadow-xl ${stat.glow} hover:scale-105 transition-transform duration-300`}>
          <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
            <stat.icon className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
          <div className="text-white/60 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>

  {/* Premium Live Challenges */}
  {realTimeData.active_challenges.length > 0 && (
    <div className="relative z-10 px-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Target className="w-6 h-6 mr-2 text-emerald-400" />
          Live Challenges
        </h2>
        <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/70 text-sm border border-white/20">
          {realTimeData.active_challenges.length} active
        </span>
      </div>
      <div className="space-y-4">
        {realTimeData.active_challenges.map((challenge, index) => (
          <div key={challenge.id} className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${challenge.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{challenge.name}</h3>
                  <p className="text-white/70 text-sm">{challenge.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-emerald-400 font-bold text-sm">{challenge.reward.split(' +')[0]}</div>
                <div className="text-white/60 text-xs">{challenge.expires_in} left</div>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm text-white/80 mb-2">
                <span>{challenge.progress}% complete</span>
                <span className="text-emerald-400 font-medium">{challenge.reward.split(' +')[1] || 'bonus reward'}</span>
              </div>
              <div className="relative">
                <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${challenge.color} rounded-full transition-all duration-700 relative`}
                    style={{ width: `${challenge.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* Premium Dynamic Pricing Alert */}
  <div className="relative z-10 px-6 mb-8">
    <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 backdrop-blur-lg border border-purple-500/30 rounded-3xl p-6 shadow-xl shadow-purple-500/25">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">VIP Pricing Active</h3>
            <p className="text-purple-200 text-sm">Gold member exclusive discounts</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-purple-300 font-bold">Save up to 20%</div>
          <div className="text-purple-200 text-sm">{realTimeData.venue_occupancy}% capacity</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {[
          { name: 'Private Pod', current: realTimeData.current_pricing.pod.vip_price, original: realTimeData.current_pricing.pod.current, icon: Bed },
          { name: 'VIP Lounge', current: realTimeData.current_pricing.vip_lounge.vip_price, original: realTimeData.current_pricing.vip_lounge.current, icon: Crown }
        ].map((item, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center">
            <item.icon className="w-6 h-6 text-purple-300 mx-auto mb-2" />
            <div className="text-white font-bold text-lg">${item.current}</div>
            <div className="text-purple-300 text-sm line-through">${item.original}</div>
            <div className="text-purple-200 text-xs mt-1">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Enhanced Quick Actions */}
  <div className="relative z-10 px-6 pb-6">
    <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
    <div className="grid grid-cols-2 gap-4">
      {[
        { 
          id: 'transport', 
          icon: Car, 
          title: 'Smart Transport', 
          subtitle: `${userData.transport} reserved`, 
          color: 'from-blue-500 to-cyan-500',
          glow: 'shadow-blue-500/25'
        },
        { 
          id: 'social', 
          icon: Heart, 
          title: 'Social Hub', 
          subtitle: `${realTimeData.friends_online} friends online`, 
          color: 'from-pink-500 to-rose-500',
          glow: 'shadow-pink-500/25'
        },
        { 
          id: 'rewards', 
          icon: Gift, 
          title: 'Rewards Store', 
          subtitle: `${userData.points.toLocaleString()} points`, 
          color: 'from-amber-500 to-yellow-500',
          glow: 'shadow-amber-500/25'
        },
        { 
          id: 'spending', 
          icon: CreditCard, 
          title: 'Smart Wallet', 
          subtitle: `$${userData.spending_balance} balance`, 
          color: 'from-emerald-500 to-green-500',
          glow: 'shadow-emerald-500/25'
        }
      ].map((action) => (
        <button 
          key={action.id}
          onClick={() => screenTransition(action.id)}
          className={`bg-gradient-to-r ${action.color} rounded-3xl p-6 shadow-xl ${action.glow} hover:scale-105 transition-all duration-300 group`}
        >
          <action.icon className="w-8 h-8 text-white mb-3 group-hover:scale-110 transition-transform duration-300" />
          <div className="text-left">
            <div className="text-white font-bold text-lg mb-1">{action.title}</div>
            <div className="text-white/80 text-sm">{action.subtitle}</div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/60 ml-auto -mr-1 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
        </button>
      ))}
    </div>
  </div>
</div>
```

);

const RewardsScreen = () => (
<div className="bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900 min-h-screen relative overflow-hidden">
{/* Animated background */}
<div className="absolute inset-0 overflow-hidden">
<div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
</div>

```
  {/* Premium Header */}
  <div className="relative z-10 bg-white/10 backdrop-blur-lg border-b border-white/20 p-6">
    <div className="flex items-center space-x-4 mb-6">
      <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
        <Trophy className="w-8 h-8 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white">Rewards & Achievements</h1>
        <p className="text-white/70">{userData.points.toLocaleString()} points available</p>
      </div>
    </div>

    {/* Enhanced Points & Tier Progress */}
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-3xl font-bold text-white mb-1">{userData.points.toLocaleString()}</div>
          <div className="text-white/70">Total Points Earned</div>
        </div>
        <div className="text-right">
          <div className={`text-xl font-bold mb-1 ${
            userData.vip_tier === 'gold' ? 'text-amber-400' : 
            userData.vip_tier === 'platinum' ? 'text-purple-400' :
            userData.vip_tier === 'diamond' ? 'text-blue-400' : 'text-gray-400'
          } capitalize`}>
            {userData.vip_tier}
          </div>
          <div className="text-white/70 text-sm">Current Tier</div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-white/80 mb-2">
          <span>Progress to Platinum</span>
          <span className="font-bold">75%</span>
        </div>
        <div className="relative">
          <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-purple-500 rounded-full transition-all duration-1000" style={{ width: '75%' }}>
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-sm text-white/60">5 more visits or $500 more spending needed for Platinum</p>
    </div>
  </div>

  {/* Premium Available Rewards */}
  <div className="relative z-10 px-6 py-6">
    <h2 className="text-xl font-bold text-white mb-6 flex items-center">
      <Gift className="w-6 h-6 mr-3 text-amber-400" />
      Exclusive Rewards
    </h2>
    <div className="space-y-4">
      {[
        {
          name: 'Premium Pod Hour',
          description: 'Luxury private pod with premium amenities',
          cost: 2000,
          value: '$89.99',
          available: userData.points >= 2000,
          popular: true,
          gradient: 'from-blue-500 to-purple-600',
          icon: Bed
        },
        {
          name: 'Gourmet Food Credit',
          description: 'Premium dining credit for signature dishes',
          cost: 1500,
          value: '$25.00',
          available: userData.points >= 1500,
          popular: true,
          gradient: 'from-emerald-500 to-green-600',
          icon: Coffee
        },
        {
          name: 'VIP Lounge Experience',
          description: 'Full day access with concierge service',
          cost: 3000,
          value: '$50.00',
          available: userData.points >= 3000,
          popular: false,
          gradient: 'from-purple-500 to-pink-600',
          icon: Crown
        },
        {
          name: 'Friend Pass',
          description: 'Bring your best friend for free',
          cost: 1000,
          value: '$25.00',
          available: userData.points >= 1000,
          popular: true,
          gradient: 'from-pink-500 to-rose-600',
          icon: Heart
        }
      ].map((reward, index) => (
        <div 
          key={index} 
          className={`relative overflow-hidden rounded-3xl border transition-all duration-300 hover:scale-102 ${
            reward.available 
              ? 'bg-white/10 backdrop-blur-lg border-white/20 shadow-xl hover:shadow-2xl' 
              : 'bg-black/20 backdrop-blur-sm border-white/10'
          }`}
        >
          {reward.popular && (
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
                <Sparkles className="w-3 h-3 text-white" />
                <span className="text-white text-xs font-bold">Popular</span>
              </div>
            </div>
          )}
          
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-14 h-14 bg-gradient-to-r ${reward.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                <reward.icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-lg mb-1 ${reward.available ? 'text-white' : 'text-white/50'}`}>
                  {reward.name}
                </h3>
                <p className={`text-sm ${reward.available ? 'text-white/70' : 'text-white/40'}`}>
                  {reward.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 ${reward.available ? '' : 'opacity-50'}`}>
                  <Coins className="w-5 h-5 text-amber-400" />
                  <span className={`font-bold text-lg ${reward.available ? 'text-amber-400' : 'text-amber-400/50'}`}>
                    {reward.cost.toLocaleString()}
                  </span>
                </div>
                <span className={`text-sm ${reward.available ? 'text-emerald-400' : 'text-emerald-400/50'}`}>
                  {reward.value} value
                </span>
              </div>
              <button 
                disabled={!reward.available}
                className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
                  reward.available 
                    ? `bg-gradient-to-r ${reward.gradient} text-white hover:scale-105 shadow-lg` 
                    : 'bg-white/10 text-white/50 cursor-not-allowed'
                }`}
              >
                {reward.available ? 'Redeem Now' : 'Insufficient Points'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Enhanced Recent Achievements */}
  <div className="relative z-10 px-6 pb-6">
    <h2 className="text-xl font-bold text-white mb-6 flex items-center">
      <Award className="w-6 h-6 mr-3 text-yellow-400" />
      Recent Achievements
    </h2>
    <div className="space-y-4">
      {[
        { name: 'Social Butterfly', points: 300, earned: '2 hours ago', emoji: '🦋', color: 'from-pink-500 to-purple-600' },
        { name: 'Big Spender Elite', points: 1000, earned: '1 day ago', emoji: '💸', color: 'from-emerald-500 to-blue-600' },
        { name: 'Night Owl Master', points: 250, earned: '3 days ago', emoji: '🦉', color: 'from-indigo-500 to-purple-600' }
      ].map((achievement, index) => (
        <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-xl flex items-center justify-between group hover:bg-white/15 transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${achievement.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <span className="text-xl">{achievement.emoji}</span>
            </div>
            <div>
              <div className="font-bold text-white">{achievement.name}</div>
              <div className="text-white/60 text-sm">Earned {achievement.earned}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Coins className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-bold text-lg">+{achievement.points}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
```

);

// Enhanced Bottom Navigation with glassmorphism
const BottomNavigation = () => (
<div className="fixed bottom-0 left-0 right-0 z-50">
<div className="bg-white/10 backdrop-blur-lg border-t border-white/20 px-6 py-2 shadow-2xl">
<div className="flex justify-around max-w-sm mx-auto">
{[
{ id: ‘home’, icon: Home, label: ‘Home’, color: ‘text-purple-400’ },
{ id: ‘rewards’, icon: Trophy, label: ‘Rewards’, color: ‘text-amber-400’ },
{ id: ‘social’, icon: Users, label: ‘Social’, color: ‘text-pink-400’ },
{ id: ‘spending’, icon: CreditCard, label: ‘Wallet’, color: ‘text-emerald-400’ },
{ id: ‘transport’, icon: Car, label: ‘Transport’, color: ‘text-blue-400’ }
].map(({ id, icon: Icon, label, color }) => (
<button
key={id}
onClick={() => screenTransition(id)}
className={`flex flex-col items-center py-3 px-3 rounded-2xl transition-all duration-300 group ${ currentScreen === id  ? `${color} bg-white/20 backdrop-blur-sm`  : 'text-white/60 hover:text-white/80 hover:bg-white/10' }`}
>
<Icon className={`w-6 h-6 mb-1 transition-transform duration-300 ${ currentScreen === id ? 'scale-110' : 'group-hover:scale-105' }`} />
<span className="text-xs font-medium">{label}</span>
{currentScreen === id && (
<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-current rounded-full"></div>
)}
</button>
))}
</div>
</div>
</div>
);

// Screen transition wrapper
const ScreenWrapper = ({ children }) => (
<div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
{children}
</div>
);

const renderCurrentScreen = () => {
const screens = {
‘home’: <HomeScreen />,
‘rewards’: <RewardsScreen />,
‘social’: <div className="bg-gradient-to-br from-slate-900 via-pink-900 to-slate-900 min-h-screen p-6"><h1 className="text-2xl font-bold text-white">Social Hub - Coming Soon</h1></div>,
‘spending’: <div className="bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 min-h-screen p-6"><h1 className="text-2xl font-bold text-white">Smart Wallet - Coming Soon</h1></div>,
‘transport’: <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 min-h-screen p-6"><h1 className="text-2xl font-bold text-white">Transport Hub - Coming Soon</h1></div>
};

```
return screens[currentScreen] || screens['home'];
```

};

return (
<div className="max-w-sm mx-auto bg-slate-900 min-h-screen pb-20 relative overflow-hidden">
<ScreenWrapper>
{renderCurrentScreen()}
</ScreenWrapper>
<BottomNavigation />

```
  {/* Custom styles for animations */}
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
    .hover\\:scale-102:hover {
      transform: scale(1.02);
    }
  `}</style>
</div>
```

);
};

export default PatronMobileApp;