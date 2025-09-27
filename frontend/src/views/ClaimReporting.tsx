import {
    Camera,
    Upload,
    MapPin,
    Smartphone,
  } from 'lucide-react';
  
  interface ClaimReportingProps {
    setCurrentView: (view: string) => void;
    claimForm: any; // create a specific type for this form later
    setClaimForm: (form: any) => void;
  }
  
  export const ClaimReporting = ({ setCurrentView, claimForm, setClaimForm }: ClaimReportingProps) => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type of Incident
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
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
                <p className="text-xs text-gray-500">Photos will be cryptographically watermarked for authentication</p>
                <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Launch SecureCam
                </button>
              </div>
            </div>
  
            {/* Police Report */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Police OB/Abstract
              </label>
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