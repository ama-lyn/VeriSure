import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './views/Dashboard';
import { ClaimReporting } from './views/ClaimReporting';
import { OnboardingFlow } from './views/Onboardingflow';

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [onboardingStep, setOnboardingStep] = useState(1);
  const [claimForm, setClaimForm] = useState({
    incidentType: '',
    location: '',
    description: '',
    images: [],
    obNumber: '',
    involved: [],
  });

  const [user] = useState({
    name: 'James Mwangi',
    phone: '+254712345678',
    trustScore: 92,
    policies: [
      {
        id: 1,
        type: 'motor',
        asset: 'KDA 332T',
        value: 350000,
        premium: 12500,
        status: 'active',
        coverage: 'comprehensive',
      },
      {
        id: 2,
        type: 'health',
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

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} setCurrentView={setCurrentView} setIsSidebarOpen={setIsSidebarOpen} />;
      case 'claim':
        return <ClaimReporting setCurrentView={setCurrentView} claimForm={claimForm} setClaimForm={setClaimForm} />;
      case 'onboarding':
        return <OnboardingFlow setCurrentView={setCurrentView} onboardingStep={onboardingStep} setOnboardingStep={setOnboardingStep} />;
      default:
        return <Dashboard user={user} setCurrentView={setCurrentView} setIsSidebarOpen={setIsSidebarOpen} />;
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        setCurrentView={setCurrentView} 
      />
      <main className="flex-1 md:ml-64">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default App;