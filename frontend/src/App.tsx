import { useState } from 'react';
import type { ElementType } from 'react';
import {
  Camera,
  Upload,
  MapPin,
  Shield,
  AlertTriangle,
  Car,
  Home,
  Briefcase,
  Smartphone,
  FileText,
  Plus,
  Bell,
  Settings,
  ChevronRight,
  Star,
  Zap,
  LayoutDashboard,
  Menu,
  X,
  User,
  LogOut,
  FileBadge,
} from 'lucide-react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper function to merge Tailwind classes safely
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define a specific type for the policy types to ensure type safety.
type IconType = 'motor' | 'health' | 'business' | 'home';

const InsuranceApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [user] = useState({
    name: 'James Mwangi',
    phone: '+254712345678',
    trustScore: 92,
    policies: [
      {
        id: 1,
        type: 'motor' as IconType,
        asset: 'KDA 332T',
        value: 350000,
        premium: 12500,
        status: 'active',
        coverage: 'comprehensive',
      },
      {
        id: 2,
        type: 'health' as IconType,
        asset: 'Personal Health',
        value: 1000000,
        premium: 8400,
        status: 'active',
        coverage: 'family',
      },
    ],
    claims: [
      {
        id: 'CLM-2024-001',
        type: 'motor',
        status: 'in_progress',
        date: '2024-09-20',
        description: 'Minor collision on Jogoo Road',
        stage: 'garage_repair',
        progress: 75,
      },
    ],
  });

  const [onboardingStep, setOnboardingStep] = useState(1);
  const [claimForm, setClaimForm] = useState({
    incidentType: '',
    location: '',
    description: '',
    images: [],
    obNumber: '',
    involved: [],
  });

  const Sidebar = () => (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out md:translate-x-0',
        {
          'translate-x-0': isSidebarOpen,
          '-translate-x-full': !isSidebarOpen,
        }
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between px-4">
          <a href="#" className="text-xl font-bold text-gray-900">
            InsureApp
          </a>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 space-y-2 px-4">
          <a
            href="#"
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </a>
          <a
            href="#"
            onClick={() => setCurrentView('claim')}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 "
          >
            <FileBadge className="h-4 w-4" />
            Report a Claim
          </a>
          <a
            href="#"
            onClick={() => setCurrentView('onboarding')}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 "
          >
            <Plus className="h-4 w-4" />
            New Policy
          </a>
        </nav>
        <div className="mt-auto p-4">
          <div className="border-t pt-4">
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 "
            >
              <User className="h-4 w-4" />
              Profile
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 "
            >
              <LogOut className="h-4 w-4" />
              Logout
            </a>
          </div>
        </div>
      </div>
    </aside>
  );

  const Dashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-green-600">Trust Score: {user.trustScore}</span>
                  </div>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="text-sm text-gray-500">Premium Member</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setCurrentView('claim')}
            className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-xl flex items-center gap-3 transition-colors"
          >
            <AlertTriangle className="w-6 h-6" />
            <span className="font-semibold">Report Claim</span>
          </button>
          <button
            onClick={() => setCurrentView('onboarding')}
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl flex items-center gap-3 transition-colors"
          >
            <Plus className="w-6 h-6" />
            <span className="font-semibold">New Policy</span>
          </button>
        </div>

        {/* Current Claims */}
        {user.claims.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Active Claims</h2>
            {user.claims.map((claim) => (
              <div key={claim.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{claim.id}</h3>
                    <p className="text-sm text-gray-600">{claim.description}</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    {claim.stage.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{claim.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${claim.progress}%` }}
                    ></div>
                  </div>
                </div>

                <button className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  Track Progress <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Insurance Policies */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Your Policies</h2>
          <div className="space-y-3">
            {user.policies.map((policy) => {
              const icons: Record<IconType, ElementType> = {
                motor: Car,
                health: Shield,
                business: Briefcase,
                home: Home,
              };
              const Icon = icons[policy.type];

              return (
                <div key={policy.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize">{policy.type}</h3>
                        <p className="text-sm text-gray-600">{policy.asset}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="mt-3 pt-3 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Value</p>
                      <p className="font-semibold">KSH {policy.value.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Premium</p>
                      <p className="font-semibold">KSH {policy.premium.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* IoT Sensor Status */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Impact Sensor</h3>
              <p className="text-sm opacity-90">KDA 332T - Active</p>
            </div>
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
            <span className="text-sm">Connected & Monitoring</span>
          </div>
        </div>
      </div>
    </div>
  );

  const ClaimReporting = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4 flex items-center gap-3">
          <button onClick={() => setCurrentView('dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
            ←
          </button>
          <h1 className="text-xl font-bold">Report a Claim</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="space-y-6">
            {/* Incident Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type of Incident</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={claimForm.incidentType}
                onChange={(e) => setClaimForm({ ...claimForm, incidentType: e.target.value })}
              >
                <option value="">Select incident type</option>
                <option value="motor_accident">Motor Accident</option>
                <option value="fire">Fire Damage</option>
                <option value="flood">Flood Damage</option>
                <option value="theft">Theft</option>
                <option value="vandalism">Vandalism</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter location or address"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={claimForm.location}
                  onChange={(e) => setClaimForm({ ...claimForm, location: e.target.value })}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                placeholder="Describe what happened"
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={claimForm.description}
                onChange={(e) => setClaimForm({ ...claimForm, description: e.target.value })}
              />
            </div>

            {/* SecureCam Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evidence (SecureCam Required)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Use SecureCam to capture evidence</p>
                <p className="text-xs text-gray-500">
                  Photos will be cryptographically watermarked for authentication
                </p>
                <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Launch SecureCam
                </button>
              </div>
            </div>

            {/* Police Report */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Police OB/Abstract</label>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="OB Number (e.g., OB 123/2024)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="mx-auto w-6 h-6 text-gray-400 mb-1" />
                  <p className="text-sm text-gray-600">Upload Police Report</p>
                  <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Choose File
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-semibold">
              Submit Claim
            </button>
          </div>
        </div>

        {/* USSD Alternative */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">No smartphone?</h3>
              <p className="text-sm text-blue-700">Dial *713# from any phone to report a claim</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const OnboardingFlow = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4 flex items-center gap-3">
          <button onClick={() => setCurrentView('dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
            ←
          </button>
          <h1 className="text-xl font-bold">New Insurance Policy</h1>
        </div>

        {/* Progress Indicator */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex-1">
                <div
                  className={`h-2 rounded-full ${step <= onboardingStep ? 'bg-blue-500' : 'bg-gray-200'}`}
                ></div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">Step {onboardingStep} of 5</p>
        </div>
      </div>

      <div className="px-4 py-6">
        {onboardingStep === 1 && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">What would you like to insure?</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { type: 'Motor Vehicle', icon: Car, color: 'blue' },
                { type: 'Motorbike', icon: Car, color: 'green' },
                { type: 'House', icon: Home, color: 'purple' },
                { type: 'Business', icon: Briefcase, color: 'orange' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    className={`p-4 border-2 border-gray-200 hover:border-${item.color}-500 rounded-xl text-center group transition-colors`}
                    onClick={() => setOnboardingStep(2)}
                  >
                    <Icon
                      className={`w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-${item.color}-500`}
                    />
                    <p className="font-medium">{item.type}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {onboardingStep === 2 && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Personal Details</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="ID Number / Passport"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Take a Photo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Capture Photo
                  </button>
                </div>
              </div>
            </div>

            <button
              className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold"
              onClick={() => setOnboardingStep(3)}
            >
              Continue
            </button>
          </div>
        )}

        {onboardingStep === 3 && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Trust Score Assessment</h2>
            <div className="text-center">
              {/* FIX: Removed the stray '.' that was causing an 'Identifier Expected' error */}
              <div className="bg-blue-50 rounded-full p-8 w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-16 h-16 text-blue-500" />
              </div>
              <p className="text-gray-600 mb-4">
                Upload your M-Pesa statements (last 3-6 months) for dynamic trust scoring
              </p>
              <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-semibold">
                Upload M-Pesa Statements
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Secure processing - data is encrypted and not stored
              </p>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
              <p className="text-center text-gray-600 mt-2">Processing your trust score...</p>
            </div>

            <button
              className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold"
              onClick={() => setOnboardingStep(4)}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'claim':
        return <ClaimReporting />;
      case 'onboarding':
        return <OnboardingFlow />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 md:ml-64">{renderCurrentView()}</main>
    </div>
  );
};

export default InsuranceApp;