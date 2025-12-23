import React, { useState, useEffect } from 'react';
import { 
  Bell, AlertTriangle, CheckCircle, XCircle, Clock, Users, 
  DollarSign, Wifi, WifiOff, Shield, Phone, MessageSquare,
  Search, Settings, Power, Zap, Car, Bed, Coffee, QrCode,
  CreditCard, UserCheck, AlertCircle, Navigation, Home,
  RefreshCw, Eye, EyeOff, Lock, Unlock, Edit, Save
} from 'lucide-react';

const StaffMobileApp = () => {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [staffInfo, setStaffInfo] = useState({
    name: 'Sarah Mitchell',
    role: 'Floor Manager',
    shift: 'Night Shift',
    badge_id: 'FM-001',
    authenticated: true
  });
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'critical',
      title: 'Payment Failure - Customer Inside',
      message: 'Session #4A7B: Payment failed for pod reservation. Customer has active wristband.',
      session_id: '4A7B',
      time: '2 min ago',
      requires_action: true,
      location: 'Main Bar Area'
    },
    {
      id: 2,
      type: 'high',
      title: 'Hardware Issue',
      message: 'Exit RFID reader offline at main entrance',
      time: '5 min ago',
      requires_action: true,
      location: 'Main Exit'
    },
    {
      id: 3,
      type: 'medium',
      title: 'Physical Recovery Request',
      message: 'Customer needs help at charger station',
      time: '8 min ago',
      requires_action: false,
      location: 'Recovery Station 1'
    }
  ]);

  const [systemStatus, setSystemStatus] = useState({
    overall_status: 'operational',
    wifi_status: 'connected',
    payment_system: 'operational',
    hardware_health: 87,
    current_occupancy: 267,
    capacity: 500,
    critical_issues: 1,
    pending_actions: 3
  });

  const [activeSession, setActiveSession] = useState(null);
  const [showSessionDetails, setShowSessionDetails] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        current_occupancy: prev.current_occupancy + Math.floor(Math.random() * 4) - 2,
        hardware_health: Math.max(70, prev.hardware_health + Math.floor(Math.random() * 6) - 3)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const DashboardScreen = () => (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">Last Light Staff</h1>
            <p className="text-sm text-gray-400">{staffInfo.name} • {staffInfo.role}</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="w-6 h-6 text-white" />
              {notifications.filter(n => n.requires_action).length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              )}
            </div>
            <div className={`w-3 h-3 rounded-full ${
              systemStatus.overall_status === 'operational' ? 'bg-green-400' : 'bg-red-400'
            }`}></div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Occupancy</p>
                <p className="text-2xl font-bold text-white">{systemStatus.current_occupancy}</p>
                <p className="text-xs text-gray-500">/{systemStatus.capacity} capacity</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">System Health</p>
                <p className="text-2xl font-bold text-green-400">{systemStatus.hardware_health}%</p>
                <p className="text-xs text-gray-500">All systems</p>
              </div>
              <Shield className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        {systemStatus.critical_issues > 0 && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <div>
                <p className="text-red-400 font-medium">
                  {systemStatus.critical_issues} Critical Issue{systemStatus.critical_issues > 1 ? 's' : ''}
                </p>
                <p className="text-sm text-gray-300">Immediate attention required</p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Notifications */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Recent Alerts</h3>
          <div className="space-y-3">
            {notifications.slice(0, 3).map(notification => (
              <div 
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-3 rounded-lg cursor-pointer ${
                  notification.type === 'critical' ? 'bg-red-900/20 border border-red-500' :
                  notification.type === 'high' ? 'bg-yellow-900/20 border border-yellow-500' :
                  'bg-blue-900/20 border border-blue-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${
                      notification.type === 'critical' ? 'text-red-400' :
                      notification.type === 'high' ? 'text-yellow-400' :
                      'text-blue-400'
                    }`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-300 mt-1">{notification.message}</p>
                    <div className="flex items-center mt-2">
                      <Clock className="w-3 h-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-400">{notification.time}</span>
                      {notification.location && (
                        <>
                          <span className="text-gray-400 mx-2">•</span>
                          <span className="text-xs text-gray-400">{notification.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {notification.requires_action && (
                    <div className="ml-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setCurrentScreen('scanner')}
            className="bg-purple-600 hover:bg-purple-700 p-4 rounded-lg transition-colors"
          >
            <QrCode className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Scan Session</p>
          </button>
          
          <button 
            onClick={() => setCurrentScreen('emergency')}
            className="bg-red-600 hover:bg-red-700 p-4 rounded-lg transition-colors"
          >
            <Power className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Emergency</p>
          </button>
          
          <button 
            onClick={() => setCurrentScreen('payments')}
            className="bg-green-600 hover:bg-green-700 p-4 rounded-lg transition-colors"
          >
            <CreditCard className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Payments</p>
          </button>
          
          <button 
            onClick={() => setCurrentScreen('hardware')}
            className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg transition-colors"
          >
            <Settings className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Hardware</p>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
        <div className="grid grid-cols-4 py-2">
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className={`p-3 text-center ${currentScreen === 'dashboard' ? 'text-blue-400' : 'text-gray-400'}`}
          >
            <Home className="w-5 h-5 mx-auto mb-1" />
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('alerts')}
            className={`p-3 text-center relative ${currentScreen === 'alerts' ? 'text-blue-400' : 'text-gray-400'}`}
          >
            <Bell className="w-5 h-5 mx-auto mb-1" />
            <span className="text-xs">Alerts</span>
            {notifications.filter(n => n.requires_action).length > 0 && (
              <div className="absolute top-2 right-3 w-2 h-2 bg-red-500 rounded-full"></div>
            )}
          </button>
          <button 
            onClick={() => setCurrentScreen('sessions')}
            className={`p-3 text-center ${currentScreen === 'sessions' ? 'text-blue-400' : 'text-gray-400'}`}
          >
            <Users className="w-5 h-5 mx-auto mb-1" />
            <span className="text-xs">Sessions</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('profile')}
            className={`p-3 text-center ${currentScreen === 'profile' ? 'text-blue-400' : 'text-gray-400'}`}
          >
            <UserCheck className="w-5 h-5 mx-auto mb-1" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );

  const PaymentResolutionScreen = ({ notification }) => (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-4 shadow-lg">
        <div className="flex items-center">
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className="mr-3 p-1"
          >
            <Navigation className="w-5 h-5 text-white transform rotate-180" />
          </button>
          <div>
            <h1 className="text-lg font-bold">Payment Resolution</h1>
            <p className="text-sm text-gray-400">Session #{notification?.session_id}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Alert Details */}
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-2 mt-0.5" />
            <div>
              <p className="text-red-400 font-medium">{notification?.title}</p>
              <p className="text-sm text-gray-300 mt-1">{notification?.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                Location: {notification?.location} • {notification?.time}
              </p>
            </div>
          </div>
        </div>

        {/* Session Details */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Session Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Session ID:</span>
              <span className="text-white font-mono">4A7B-8C9D</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Transport Method:</span>
              <span className="text-white">Pod Hotel</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Amount:</span>
              <span className="text-white">$62.99</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className="text-red-400">Payment Failed</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Entry Status:</span>
              <span className="text-green-400">Inside Venue ⚠️</span>
            </div>
          </div>
        </div>

        {/* Resolution Actions */}
        <div className="space-y-3">
          <button className="w-full bg-green-600 hover:bg-green-700 p-4 rounded-lg text-left transition-colors">
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Process Manual Payment</p>
                <p className="text-sm text-gray-300">Cash, different card, or alternative method</p>
              </div>
            </div>
          </button>

          <button className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-lg text-left transition-colors">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Comp Session</p>
                <p className="text-sm text-gray-300">House covers the cost</p>
              </div>
            </div>
          </button>

          <button className="w-full bg-yellow-600 hover:bg-yellow-700 p-4 rounded-lg text-left transition-colors">
            <div className="flex items-center">
              <RefreshCw className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Change Transport Method</p>
                <p className="text-sm text-gray-300">Switch to rideshare or DD</p>
              </div>
            </div>
          </button>

          <button className="w-full bg-red-600 hover:bg-red-700 p-4 rounded-lg text-left transition-colors">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Refund & Exit</p>
                <p className="text-sm text-gray-300">Process refund and escort out</p>
              </div>
            </div>
          </button>
        </div>

        {/* Contact Customer */}
        <div className="mt-6 bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Contact Customer</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-purple-600 hover:bg-purple-700 p-3 rounded-lg flex items-center justify-center transition-colors">
              <MessageSquare className="w-4 h-4 mr-2" />
              <span>Send SMS</span>
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 p-3 rounded-lg flex items-center justify-center transition-colors">
              <Phone className="w-4 h-4 mr-2" />
              <span>Call</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const SessionScannerScreen = () => {
    const [scanMode, setScanMode] = useState('camera'); // 'camera' or 'manual'
    const [manualInput, setManualInput] = useState('');
    const [scanResult, setScanResult] = useState(null);

    const handleScan = () => {
      // Simulate scanning
      const mockSession = {
        session_id: 'ABC123',
        status: 'active',
        transport: 'pod',
        entry_time: '11:47 PM',
        wristband_id: 'WB-4567',
        payment_status: 'completed'
      };
      setScanResult(mockSession);
    };

    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="bg-gray-800 p-4 shadow-lg">
          <div className="flex items-center">
            <button 
              onClick={() => setCurrentScreen('dashboard')}
              className="mr-3 p-1"
            >
              <Navigation className="w-5 h-5 text-white transform rotate-180" />
            </button>
            <h1 className="text-lg font-bold">Session Scanner</h1>
          </div>
        </div>

        <div className="p-4">
          {/* Scan Mode Toggle */}
          <div className="flex bg-gray-800 rounded-lg p-1 mb-6">
            <button 
              onClick={() => setScanMode('camera')}
              className={`flex-1 p-3 rounded-lg transition-colors ${
                scanMode === 'camera' ? 'bg-blue-600' : 'bg-transparent'
              }`}
            >
              <QrCode className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm">Camera Scan</span>
            </button>
            <button 
              onClick={() => setScanMode('manual')}
              className={`flex-1 p-3 rounded-lg transition-colors ${
                scanMode === 'manual' ? 'bg-blue-600' : 'bg-transparent'
              }`}
            >
              <Edit className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm">Manual Entry</span>
            </button>
          </div>

          {scanMode === 'camera' ? (
            <div className="mb-6">
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <QrCode className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-400 mb-4">Position wristband or QR code in view</p>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 mb-4">
                  <div className="w-full h-32 bg-gray-700 rounded flex items-center justify-center">
                    <span className="text-gray-500">Camera Feed</span>
                  </div>
                </div>
                <button 
                  onClick={handleScan}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
                >
                  Scan Now
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Enter Session ID or Wristband ID
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="ABC123 or WB-4567"
                  className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <button 
                  onClick={handleScan}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Scan Result */}
          {scanResult && (
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Session Found</h3>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  scanResult.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  scanResult.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {scanResult.status.toUpperCase()}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Session ID:</span>
                  <span className="text-white font-mono">{scanResult.session_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Transport:</span>
                  <span className="text-white capitalize">{scanResult.transport}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Entry Time:</span>
                  <span className="text-white">{scanResult.entry_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment:</span>
                  <span className={scanResult.payment_status === 'completed' ? 'text-green-400' : 'text-red-400'}>
                    {scanResult.payment_status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg text-sm transition-colors">
                  View Details
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 p-2 rounded-lg text-sm transition-colors">
                  Override Session
                </button>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-3">
            <button className="w-full bg-green-600 hover:bg-green-700 p-4 rounded-lg text-left transition-colors">
              <div className="flex items-center">
                <Unlock className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">Manual Door Unlock</p>
                  <p className="text-sm text-gray-300">Emergency exit access</p>
                </div>
              </div>
            </button>

            <button className="w-full bg-yellow-600 hover:bg-yellow-700 p-4 rounded-lg text-left transition-colors">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">New Wristband</p>
                  <p className="text-sm text-gray-300">Issue replacement wristband</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const EmergencyControlScreen = () => (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-4 shadow-lg">
        <div className="flex items-center">
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className="mr-3 p-1"
          >
            <Navigation className="w-5 h-5 text-white transform rotate-180" />
          </button>
          <h1 className="text-lg font-bold text-red-400">Emergency Controls</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
            <p className="text-red-400 font-medium">Use only in emergency situations</p>
          </div>
        </div>

        <div className="space-y-4">
          <button className="w-full bg-red-600 hover:bg-red-700 p-6 rounded-lg text-left transition-colors">
            <div className="flex items-center">
              <Power className="w-6 h-6 mr-3" />
              <div>
                <p className="text-lg font-bold">UNLOCK ALL DOORS</p>
                <p className="text-sm text-red-200">Emergency evacuation - unlocks every exit</p>
              </div>
            </div>
          </button>

          <button className="w-full bg-orange-600 hover:bg-orange-700 p-4 rounded-lg text-left transition-colors">
            <div className="flex items-center">
              <WifiOff className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Enable Offline Mode</p>
                <p className="text-sm text-orange-200">Switch to local operation</p>
              </div>
            </div>
          </button>

          <button className="w-full bg-purple-600 hover:bg-purple-700 p-4 rounded-lg text-left transition-colors">
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Lockdown Mode</p>
                <p className="text-sm text-purple-200">Secure all entrances</p>
              </div>
            </div>
          </button>

          <button className="w-full bg-yellow-600 hover:bg-yellow-700 p-4 rounded-lg text-left transition-colors">
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Call Emergency Services</p>
                <p className="text-sm text-yellow-200">Direct line to dispatch</p>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-8 bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Emergency Contacts</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Security Team</span>
              <button className="text-blue-400">Call</button>
            </div>
            <div className="flex justify-between items-center">
              <span>Venue Manager</span>
              <button className="text-blue-400">Call</button>
            </div>
            <div className="flex justify-between items-center">
              <span>Tech Support</span>
              <button className="text-blue-400">Call</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const handleNotificationClick = (notification) => {
    if (notification.type === 'critical' && notification.title.includes('Payment')) {
      setCurrentScreen('payment-resolution');
    }
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'scanner':
        return <SessionScannerScreen />;
      case 'emergency':
        return <EmergencyControlScreen />;
      case 'payment-resolution':
        return <PaymentResolutionScreen notification={notifications[0]} />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-gray-900 min-h-screen">
      {renderCurrentScreen()}
    </div>
  );
};

export default StaffMobileApp;