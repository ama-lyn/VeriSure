import {
    Camera,
    Car,
    Home,
    Briefcase,
    FileText,
  } from 'lucide-react';
  
  interface OnboardingFlowProps {
    setCurrentView: (view: string) => void;
    onboardingStep: number;
    setOnboardingStep: (step: number) => void;
  }
  
  export const OnboardingFlow = ({ setCurrentView, onboardingStep, setOnboardingStep }: OnboardingFlowProps) => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {/* A simple back arrow */}
            ←
          </button>
          <h1 className="text-xl font-bold">New Insurance Policy</h1>
        </div>
  
        {/* Progress Indicator */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map(step => (
              <div key={step} className="flex-1">
                <div className={`h-2 rounded-full ${step <= onboardingStep ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
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
                { type: 'Business', icon: Briefcase, color: 'orange' }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    className={`p-4 border-2 border-gray-200 hover:border-${item.color}-500 rounded-xl text-center group transition-colors`}
                    onClick={() => setOnboardingStep(2)}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-${item.color}-500`} />
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Take a Photo
                </label>
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