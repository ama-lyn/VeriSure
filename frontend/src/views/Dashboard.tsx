import type { ElementType } from 'react';
import {
  Shield,
  AlertTriangle,
  Car,
  Home,
  Briefcase,
  Plus,
  Bell,
  Settings,
  ChevronRight,
  Star,
  Zap,
  Menu,
} from 'lucide-react';

// Define types right where they are used or in a central types file
type IconType = 'motor' | 'health' | 'business' | 'home';

interface DashboardProps {
  user: any; // You can define a more specific User type later
  setCurrentView: (view: string) => void;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export const Dashboard = ({ user, setCurrentView, setIsSidebarOpen }: DashboardProps) => (
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
                    {user.claims.map((claim: any) => (
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
                    {user.policies.map((policy: any) => {
                        const icons: Record<IconType, ElementType> = {
                            motor: Car,
                            health: Shield,
                            business: Briefcase,
                            home: Home,
                        };
                        const Icon = icons[policy.type as IconType];

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