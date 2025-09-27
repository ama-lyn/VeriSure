const express = require('express');
const cors = require('cors');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ======================= MOCK DATABASE =======================
// (All your database arrays: users, policies, claims, etc., go here)
// Users Database
let users = [
  {
    id: 1,
    name: 'James Mwangi',
    email: 'james@example.com',
    phone: '+254712345678',
    idNumber: '12345678',
    trustScore: 92,
    status: 'active',
    createdAt: '2024-01-15',
    policies: [1, 2],
    claims: [1],
    mpesaStatements: [],
    biometricVerified: true
  },
  {
    id: 2,
    name: 'Mary Wanjiku',
    email: 'mary@example.com',
    phone: '+254723456789',
    idNumber: '87654321',
    trustScore: 78,
    status: 'active',
    createdAt: '2024-02-10',
    policies: [3],
    claims: [],
    mpesaStatements: [],
    biometricVerified: true
  }
];

// Policies Database
let policies = [
  {
    id: 1,
    userId: 1,
    type: 'motor',
    asset: 'KDA 332T',
    value: 350000,
    premium: 12500,
    status: 'active',
    coverage: 'comprehensive',
    startDate: '2024-01-20',
    endDate: '2025-01-19',
    vehicleDetails: {
      make: 'Toyota',
      model: 'Corolla',
      year: 2018,
      engineNo: 'ENG123456',
      chassisNo: 'CHASSIS789',
      mileage: 45000,
      dashCam: true
    }
  },
  {
    id: 2,
    userId: 1,
    type: 'health',
    asset: 'Personal Health',
    value: 1000000,
    premium: 8400,
    status: 'active',
    coverage: 'family',
    startDate: '2024-01-20',
    endDate: '2025-01-19'
  }
];

// Claims Database
let claims = [
  {
    id: 'CLM-2024-001',
    userId: 1,
    policyId: 1,
    type: 'motor',
    status: 'in_progress',
    fraudScore: 15, // Lower = less suspicious
    trustScoreAtSubmission: 92,
    submissionDate: '2024-09-20',
    description: 'Minor collision on Jogoo Road',
    location: 'Jogoo Road, Nairobi',
    incidentType: 'motor_accident',
    obNumber: 'OB 456/2024',
    stage: 'garage_repair',
    progress: 75,
    garage: {
      id: 1,
      name: 'Maxwell Garage',
      phone: '+254711223344',
      location: 'Industrial Area'
    },
    estimatedDays: 14,
    daysPassed: 10,
    courtesyCar: {
      eligible: true,
      requested: false,
      approved: false,
      carDetails: null
    },
    timeline: [
      { stage: 'claim_submitted', status: 'completed', date: '2024-09-20', message: 'Claim submitted successfully' },
      { stage: 'documents_verified', status: 'completed', date: '2024-09-21', message: 'All documents verified and approved' },
      { stage: 'garage_matching', status: 'completed', date: '2024-09-22', message: 'Maxwell Garage selected for repairs' },
      { stage: 'garage_accepted', status: 'completed', date: '2024-09-23', message: 'Maxwell Garage accepted repair job' },
      { stage: 'car_collected', status: 'completed', date: '2024-09-24', message: 'Vehicle collected by Maxwell Garage' },
      { stage: 'repair_in_progress', status: 'active', date: '2024-09-25', message: 'Repairs are currently in progress - 75% complete' },
      { stage: 'repair_complete', status: 'pending', date: null, message: 'Waiting for repairs to complete' },
      { stage: 'ready_collection', status: 'pending', date: null, message: 'Vehicle ready for collection' }
    ],
    evidence: {
      photos: [],
      videos: [],
      documents: [],
      watermarked: true,
      aiVerified: true
    }
  }
];

// Garages Database
let garages = [
  {
    id: 1,
    name: 'Maxwell Garage',
    phone: '+254711223344',
    email: 'maxwell@garage.com',
    location: 'Industrial Area, Nairobi',
    coordinates: { lat: -1.3192, lng: 36.8441 },
    rating: 4.5,
    specializations: ['bodywork', 'mechanical', 'electrical'],
    verified: true,
    capacity: 15,
    currentJobs: 8
  },
  {
    id: 2,
    name: 'City Auto Works',
    phone: '+254722334455',
    email: 'city@autoworks.com',
    location: 'Westlands, Nairobi',
    coordinates: { lat: -1.2676, lng: 36.8108 },
    rating: 4.2,
    specializations: ['mechanical', 'electrical'],
    verified: true,
    capacity: 20,
    currentJobs: 12
  }
];

// Image Database for Fraud Detection (stores hashes)
let imageDatabase = [
  {
    hash: 'abc123def456',
    description: 'Stock photo of car accident',
    reportedBy: 'fraud_detection_ai',
    flagged: true,
    dateAdded: '2024-01-01'
  },
  {
    hash: 'xyz789uvw012',
    description: 'Legitimate accident photo',
    reportedBy: 'user_1',
    flagged: false,
    dateAdded: '2024-09-20'
  }
];

// Impact Sensor Data
let impactSensorData = [
  {
    id: 1,
    userId: 1,
    vehicleId: 'KDA 332T',
    location: { lat: -1.2921, lng: 36.8219, address: 'Jogoo Road, Nairobi' },
    impactLevel: 7.5, // Scale of 1-10
    timestamp: '2024-09-20T14:30:00Z',
    status: 'resolved',
    autoResponseSent: true,
    emergencyContacted: false
  }
];

// ======================= UTILITY FUNCTIONS =======================
// (All your utility functions: generateWatermark, calculateTrustScore, etc., go here)
// Generate cryptographic watermark for images
function generateWatermark(imageData, metadata) {
  const watermarkData = {
    timestamp: new Date().toISOString(),
    gps: metadata.gps || null,
    deviceId: metadata.deviceId || 'unknown',
    userId: metadata.userId
  };
  
  const hash = crypto.createHash('sha256')
    .update(JSON.stringify(watermarkData))
    .digest('hex');
    
  return {
    ...watermarkData,
    signature: hash,
    verified: true
  };
}

// Verify image watermark
function verifyWatermark(watermark) {
  if (!watermark || !watermark.signature) {
    return { valid: false, reason: 'No watermark found' };
  }
  
  // Check if image hash exists in fraud database
  const suspiciousImage = imageDatabase.find(img => 
    img.hash === watermark.signature && img.flagged
  );
  
  if (suspiciousImage) {
    return { valid: false, reason: 'Image flagged as potentially fraudulent' };
  }
  
  return { valid: true, reason: 'Watermark verified' };
}

// Calculate dynamic trust score
function calculateTrustScore(user, mpesaData = []) {
  let score = 50; // Base score
  
  // Historical claims factor
  const userClaims = claims.filter(c => c.userId === user.id);
  const approvedClaims = userClaims.filter(c => c.status === 'approved' || c.status === 'paid');
  
  if (userClaims.length === 0) {
    score += 10; // No claims bonus
  } else {
    const approvalRate = approvedClaims.length / userClaims.length;
    score += approvalRate * 20;
  }
  
  // M-Pesa transaction analysis
  if (mpesaData.length > 0) {
    const avgTransaction = mpesaData.reduce((sum, t) => sum + t.amount, 0) / mpesaData.length;
    const regularPayments = mpesaData.filter(t => t.type === 'regular').length;
    
    score += Math.min(avgTransaction / 1000, 15); // Transaction volume bonus
    score += Math.min(regularPayments, 10); // Regular payment bonus
  }
  
  // Verification bonuses
  if (user.biometricVerified) score += 10;
  if (user.idVerified) score += 5;
  
  return Math.min(Math.round(score), 100);
}

// Fraud detection using Graph Neural Network simulation
function detectFraudNetworks(claimData) {
  const suspiciousPatterns = [];
  
  // Check for duplicate locations
  const sameLocationClaims = claims.filter(c => 
    c.location === claimData.location && 
    c.id !== claimData.id &&
    new Date(c.submissionDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
  );
  
  if (sameLocationClaims.length >= 3) {
    suspiciousPatterns.push({
      type: 'location_cluster',
      severity: 'high',
      description: `Multiple claims from same location in past 30 days`,
      relatedClaims: sameLocationClaims.map(c => c.id)
    });
  }
  
  // Check for garage clustering
  const garage = claimData.garage;
  if (garage) {
    const garageClaims = claims.filter(c => 
      c.garage && c.garage.id === garage.id &&
      new Date(c.submissionDate) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
    );
    
    if (garageClaims.length >= 10) {
      suspiciousPatterns.push({
        type: 'garage_cluster',
        severity: 'medium',
        description: `High volume of claims to ${garage.name} in past 90 days`,
        relatedClaims: garageClaims.map(c => c.id)
      });
    }
  }
  
  return {
    fraudScore: suspiciousPatterns.reduce((score, pattern) => 
      score + (pattern.severity === 'high' ? 30 : pattern.severity === 'medium' ? 15 : 5), 0
    ),
    patterns: suspiciousPatterns
  };
}

// ======================= API ROUTES =======================
// (All your API routes go here)
// Authentication Routes
app.post('/api/auth/login', (req, res) => {
  const { phone, password } = req.body;
  
  const user = users.find(u => u.phone === phone);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // In real app, verify password with bcrypt
  const token = jwt.sign({ userId: user.id }, 'secret_key', { expiresIn: '24h' });
  
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      trustScore: user.trustScore,
      status: user.status
    }
  });
});

// User Routes
app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const userPolicies = policies.filter(p => p.userId === userId);
  const userClaims = claims.filter(c => c.userId === userId);
  
  res.json({
    ...user,
    policies: userPolicies,
    claims: userClaims
  });
});

app.post('/api/users', (req, res) => {
  const { name, email, phone, idNumber } = req.body;
  
  // Check if user already exists
  if (users.find(u => u.phone === phone || u.idNumber === idNumber)) {
    return res.status(409).json({ error: 'User already exists' });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email,
    phone,
    idNumber,
    trustScore: 50, // Initial score
    status: 'pending_verification',
    createdAt: new Date().toISOString().split('T')[0],
    policies: [],
    claims: [],
    mpesaStatements: [],
    biometricVerified: false
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// Trust Score Routes
app.post('/api/trust-score/calculate', upload.single('mpesaStatements'), (req, res) => {
  const { userId } = req.body;
  const user = users.find(u => u.id === parseInt(userId));
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Simulate M-Pesa data processing
  const mockMpesaData = [
    { amount: 5000, type: 'regular', date: '2024-09-01' },
    { amount: 12000, type: 'regular', date: '2024-08-15' },
    { amount: 3000, type: 'regular', date: '2024-08-01' }
  ];
  
  const trustScore = calculateTrustScore(user, mockMpesaData);
  
  // Update user trust score
  user.trustScore = trustScore;
  
  // Generate recommendations based on trust score
  const recommendations = [];
  if (trustScore >= 85) {
    recommendations.push({
      package: 'Comprehensive Motor',
      premium: 15000,
      discount: 10,
      features: ['Full coverage', 'Courtesy car', 'Windscreen cover', '24/7 support']
    });
  }
  if (trustScore >= 60) {
    recommendations.push({
      package: 'Third Party Plus',
      premium: 8500,
      discount: 5,
      features: ['Third party cover', 'Fire & theft', 'Basic support']
    });
  }
  recommendations.push({
    package: 'Micro Insurance',
    premium: 3200,
    discount: 0,
    features: ['Basic third party', 'Affordable premiums', 'Mobile payments']
  });
  
  res.json({
    trustScore,
    analysis: {
      transactionHistory: trustScore >= 70 ? 'Excellent' : trustScore >= 50 ? 'Good' : 'Fair',
      paymentReliability: trustScore >= 80 ? 'High' : trustScore >= 60 ? 'Medium' : 'Low',
      riskAssessment: trustScore >= 75 ? 'Low Risk' : trustScore >= 50 ? 'Medium Risk' : 'High Risk'
    },
    recommendations
  });
});

// Claims Routes
app.get('/api/claims/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userClaims = claims.filter(c => c.userId === userId);
  res.json(userClaims);
});

app.get('/api/claims/:claimId', (req, res) => {
  const claim = claims.find(c => c.id === req.params.claimId);
  if (!claim) {
    return res.status(404).json({ error: 'Claim not found' });
  }
  res.json(claim);
});

app.post('/api/claims', upload.array('evidence'), (req, res) => {
  const {
    userId,
    policyId,
    incidentType,
    location,
    description,
    obNumber
  } = req.body;
  
  const user = users.find(u => u.id === parseInt(userId));
  const policy = policies.find(p => p.id === parseInt(policyId));
  
  if (!user || !policy) {
    return res.status(400).json({ error: 'Invalid user or policy' });
  }
  
  // Generate claim ID
  const claimId = `CLM-${new Date().getFullYear()}-${String(claims.length + 1).padStart(3, '0')}`;
  
  // Process evidence files
  const evidence = {
    photos: [],
    videos: [],
    documents: [],
    watermarked: true,
    aiVerified: true
  };
  
  if (req.files) {
    req.files.forEach(file => {
      const watermark = generateWatermark(file.buffer, {
        userId: parseInt(userId),
        gps: { lat: -1.2921, lng: 36.8219 },
        deviceId: 'device_123'
      });
      
      const verification = verifyWatermark(watermark);
      
      evidence.photos.push({
        filename: file.originalname,
        size: file.size,
        watermark,
        verified: verification.valid
      });
    });
  }
  
  const newClaim = {
    id: claimId,
    userId: parseInt(userId),
    policyId: parseInt(policyId),
    type: policy.type,
    status: 'submitted',
    fraudScore: 0,
    trustScoreAtSubmission: user.trustScore,
    submissionDate: new Date().toISOString().split('T')[0],
    description,
    location,
    incidentType,
    obNumber,
    stage: 'document_verification',
    progress: 10,
    timeline: [
      {
        stage: 'claim_submitted',
        status: 'completed',
        date: new Date().toISOString().split('T')[0],
        message: 'Claim submitted successfully'
      },
      {
        stage: 'document_verification',
        status: 'active',
        date: new Date().toISOString().split('T')[0],
        message: 'Verifying submitted documents'
      }
    ],
    evidence
  };
  
  // Run fraud detection
  const fraudAnalysis = detectFraudNetworks(newClaim);
  newClaim.fraudScore = fraudAnalysis.fraudScore;
  
  // Determine processing lane based on trust score and fraud score
  let lane = 'amber'; // default
  const combinedScore = user.trustScore - fraudAnalysis.fraudScore;
  
  if (combinedScore >= 90) {
    lane = 'green';
    newClaim.status = 'fast_track';
  } else if (combinedScore < 50) {
    lane = 'red';
    newClaim.status = 'under_investigation';
  }
  
  newClaim.processingLane = lane;
  
  claims.push(newClaim);
  
  res.status(201).json({
    claim: newClaim,
    fraudAnalysis: {
      score: fraudAnalysis.fraudScore,
      patterns: fraudAnalysis.patterns,
      lane
    }
  });
});

app.put('/api/claims/:claimId/courtesy-car', (req, res) => {
  const claim = claims.find(c => c.id === req.params.claimId);
  if (!claim) {
    return res.status(404).json({ error: 'Claim not found' });
  }
  
  if (claim.courtesyCar.eligible) {
    claim.courtesyCar.requested = true;
    claim.courtesyCar.approved = true; // Auto-approve for demo
    claim.courtesyCar.carDetails = {
      make: 'Toyota',
      model: 'Vitz',
      plateNumber: 'KCX 123Y',
      pickupLocation: claim.garage.name
    };
    
    // Add to timeline
    claim.timeline.push({
      stage: 'courtesy_car_approved',
      status: 'completed',
      date: new Date().toISOString().split('T')[0],
      message: 'Courtesy car approved and ready for collection'
    });
  }
  
  res.json(claim);
});

// Vehicle Assessment Routes
app.post('/api/vehicle-assessment', upload.array('assessmentFiles'), (req, res) => {
  const {
    userId,
    plateNumber,
    mileage,
    gearModes,
    dashCam
  } = req.body;
  
  const assessmentData = {
    id: Date.now(),
    userId: parseInt(userId),
    plateNumber,
    mileage: parseInt(mileage),
    gearModes: JSON.parse(gearModes),
    dashCam: dashCam === 'true',
    photos: [],
    videos: [],
    status: 'completed',
    assessedValue: Math.floor(Math.random() * 500000) + 200000, // Mock valuation
    condition: 'good',
    createdAt: new Date().toISOString()
  };
  
  // Process uploaded files
  if (req.files) {
    req.files.forEach(file => {
      if (file.mimetype.startsWith('image/')) {
        assessmentData.photos.push({
          type: file.fieldname,
          filename: file.originalname,
          size: file.size
        });
      } else if (file.mimetype.startsWith('video/')) {
        assessmentData.videos.push({
          type: file.fieldname,
          filename: file.originalname,
          size: file.size
        });
      }
    });
  }
  
  res.json({
    assessment: assessmentData,
    valuation: {
      estimatedValue: assessmentData.assessedValue,
      condition: assessmentData.condition,
      depreciationFactor: 0.85,
      marketComparison: 'Above average'
    }
  });
});

// Impact Sensor Routes
app.get('/api/impact-sensors/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userImpacts = impactSensorData.filter(i => i.userId === userId);
  res.json(userImpacts);
});

app.post('/api/impact-sensors/alert', (req, res) => {
  const {
    userId,
    vehicleId,
    location,
    impactLevel
  } = req.body;
  
  const impact = {
    id: impactSensorData.length + 1,
    userId: parseInt(userId),
    vehicleId,
    location,
    impactLevel: parseFloat(impactLevel),
    timestamp: new Date().toISOString(),
    status: 'active',
    autoResponseSent: false,
    emergencyContacted: false
  };
  
  // Auto-trigger emergency response for high impact
  if (impact.impactLevel >= 8.0) {
    impact.emergencyContacted = true;
    impact.autoResponseSent = true;
    
    // Simulate emergency response
    setTimeout(() => {
      console.log(`Emergency services contacted for ${vehicleId} at ${location.address}`);
    }, 1000);
  }
  
  impactSensorData.push(impact);
  
  res.json({
    impact,
    emergencyResponse: {
      triggered: impact.emergencyContacted,
      services: impact.emergencyContacted ? ['ambulance', 'police', 'tow_truck'] : [],
      eta: impact.emergencyContacted ? '15 minutes' : null
    }
  });
});

// USSD Simulation Route
app.post('/api/ussd', (req, res) => {
  const { phoneNumber, input } = req.body;
  let response = '';
  
  if (!input || input === '*713#') {
    response = `CON Welcome to SecureAssure Insurance
1. Report new claim
2. Check claim status
3. Make payment
4. Customer support
5. Exit`;
  } else if (input === '*713*1#') {
    response = `CON Report New Claim
1. Motor accident
2. Fire damage  
3. Theft
4. Other
0. Back`;
  } else if (input === '*713*1*1#') {
    response = `CON Motor Accident Claim
Enter location:`;
  } else if (input.includes('*713*1*1*')) {
    const location = input.split('*').pop();
    response = `CON Claim submitted successfully!
Reference: CLM-${Date.now()}
Agent will contact you within 30 minutes.
Thank you.`;
  } else {
    response = `END Invalid option. Please try again.`;
  }
  
  res.json({ response });
});

// Analytics Routes (for insurance dashboard)
app.get('/api/analytics/overview', (req, res) => {
  const totalClaims = claims.length;
  const pendingClaims = claims.filter(c => c.status === 'in_progress' || c.status === 'submitted').length;
  const approvedClaims = claims.filter(c => c.status === 'approved' || c.status === 'paid').length;
  const fraudulentClaims = claims.filter(c => c.fraudScore > 50).length;
  
  const avgTrustScore = users.reduce((sum, u) => sum + u.trustScore, 0) / users.length;
  
  res.json({
    claims: {
      total: totalClaims,
      pending: pendingClaims,
      approved: approvedClaims,
      fraudulent: fraudulentClaims,
      approvalRate: totalClaims > 0 ? (approvedClaims / totalClaims * 100).toFixed(1) : 0
    },
    users: {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      averageTrustScore: avgTrustScore.toFixed(1)
    },
    policies: {
      total: policies.length,
      active: policies.filter(p => p.status === 'active').length,
      motor: policies.filter(p => p.type === 'motor').length,
      health: policies.filter(p => p.type === 'health').length
    }
  });
});

// Garage Management Routes
app.get('/api/garages', (req, res) => {
  res.json(garages);
});

app.get('/api/garages/:id', (req, res) => {
  const garage = garages.find(g => g.id === parseInt(req.params.id));
  if (!garage) {
    return res.status(404).json({ error: 'Garage not found' });
  }
  
  const garageClaims = claims.filter(c => c.garage && c.garage.id === garage.id);
  
  res.json({
    ...garage,
    claims: garageClaims,
    workload: (garage.currentJobs / garage.capacity * 100).toFixed(1)
  });
});

app.post('/api/garages/:garageId/accept-job/:claimId', (req, res) => {
  const garageId = parseInt(req.params.garageId);
  const claimId = req.params.claimId;
  
  const garage = garages.find(g => g.id === garageId);
  const claim = claims.find(c => c.id === claimId);
  
  if (!garage || !claim) {
    return res.status(404).json({ error: 'Garage or claim not found' });
  }
  
  // Update claim status
  claim.garage = {
    id: garage.id,
    name: garage.name,
    phone: garage.phone,
    location: garage.location
  };
  claim.stage = 'garage_accepted';
  claim.progress = 25;
  
  // Add to timeline
  claim.timeline.push({
    stage: 'garage_accepted',
    status: 'completed',
    date: new Date().toISOString().split('T')[0],
    message: `${garage.name} accepted repair job`
  });
  
  // Update garage workload
  garage.currentJobs += 1;
  
  res.json({ 
    success: true, 
    claim,
    garage: {
      ...garage,
      workload: (garage.currentJobs / garage.capacity * 100).toFixed(1)
    }
  });
});

// Fraud Detection Routes
app.get('/api/fraud/image-database', (req, res) => {
  res.json(imageDatabase);
});

app.post('/api/fraud/check-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image provided' });
  }
  
  // Generate hash for uploaded image
  const imageHash = crypto.createHash('md5').update(req.file.buffer).digest('hex');
  
  // Check against fraud database
  const suspiciousImage = imageDatabase.find(img => img.hash === imageHash);
  
  if (suspiciousImage) {
    return res.json({
      fraudulent: true,
      reason: suspiciousImage.description,
      confidence: 0.95,
      action: 'Flag for manual review'
    });
  }
  
  // Add to database as legitimate if not found
  imageDatabase.push({
    hash: imageHash,
    description: 'User submitted image',
    reportedBy: `user_${req.body.userId || 'unknown'}`,
    flagged: false,
    dateAdded: new Date().toISOString().split('T')[0]
  });
  
  res.json({
    fraudulent: false,
    confidence: 0.98,
    action: 'Accept'
  });
});

app.get('/api/fraud/network-analysis/:claimId', (req, res) => {
  const claim = claims.find(c => c.id === req.params.claimId);
  if (!claim) {
    return res.status(404).json({ error: 'Claim not found' });
  }
  
  const fraudAnalysis = detectFraudNetworks(claim);
  
  // Generate network graph data
  const networkNodes = [
    { id: claim.id, type: 'claim', label: claim.id, suspicious: fraudAnalysis.fraudScore > 30 }
  ];
  
  const networkEdges = [];
  
  // Add related claims as nodes
  fraudAnalysis.patterns.forEach(pattern => {
    pattern.relatedClaims.forEach(relatedClaimId => {
      const relatedClaim = claims.find(c => c.id === relatedClaimId);
      if (relatedClaim) {
        networkNodes.push({
          id: relatedClaim.id,
          type: 'claim',
          label: relatedClaim.id,
          suspicious: true
        });
        
        networkEdges.push({
          from: claim.id,
          to: relatedClaim.id,
          type: pattern.type,
          weight: pattern.severity === 'high' ? 3 : pattern.severity === 'medium' ? 2 : 1
        });
      }
    });
  });
  
  res.json({
    fraudScore: fraudAnalysis.fraudScore,
    patterns: fraudAnalysis.patterns,
    networkGraph: {
      nodes: networkNodes,
      edges: networkEdges
    },
    recommendation: fraudAnalysis.fraudScore > 50 ? 'Investigate immediately' : 
                   fraudAnalysis.fraudScore > 25 ? 'Monitor closely' : 'Process normally'
  });
});

// Blockchain Integration (Simulated)
app.post('/api/blockchain/verify-identity', (req, res) => {
  const { userId, biometricData, documentHash } = req.body;
  
  const user = users.find(u => u.id === parseInt(userId));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Simulate blockchain verification
  const blockchainRecord = {
    blockNumber: Math.floor(Math.random() * 1000000),
    transactionHash: crypto.createHash('sha256').update(`${userId}-${Date.now()}`).digest('hex'),
    timestamp: new Date().toISOString(),
    verified: true,
    biometricMatch: 0.98,
    documentAuthenticity: 0.96
  };
  
  // Update user verification status
  user.biometricVerified = true;
  user.idVerified = true;
  user.blockchainRecord = blockchainRecord;
  
  // Recalculate trust score with verification bonus
  user.trustScore = calculateTrustScore(user);
  
  res.json({
    verified: true,
    blockchainRecord,
    updatedTrustScore: user.trustScore,
    verificationLevel: 'Gold'
  });
});

// Payment Integration Routes
app.post('/api/payments/mpesa', (req, res) => {
  const { amount, phoneNumber, accountReference } = req.body;
  
  // Simulate M-Pesa STK push
  const transactionId = `MP${Date.now()}`;
  
  setTimeout(() => {
    // Simulate successful payment after 5 seconds
    res.json({
      success: true,
      transactionId,
      amount,
      phoneNumber,
      status: 'completed',
      receipt: `${transactionId}_MPESA`,
      timestamp: new Date().toISOString()
    });
  }, 1000);
});

app.post('/api/payments/card', (req, res) => {
  const { amount, cardNumber, expiryDate, cvv } = req.body;
  
  // Basic card validation (for demo purposes)
  if (!cardNumber || cardNumber.length < 16) {
    return res.status(400).json({ error: 'Invalid card number' });
  }
  
  const transactionId = `CARD${Date.now()}`;
  
  res.json({
    success: true,
    transactionId,
    amount,
    maskedCard: `****-****-****-${cardNumber.slice(-4)}`,
    status: 'completed',
    authCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
    timestamp: new Date().toISOString()
  });
});

// Emergency Response Routes
app.post('/api/emergency/dispatch', (req, res) => {
  const { impactId, services } = req.body;
  
  const impact = impactSensorData.find(i => i.id === parseInt(impactId));
  if (!impact) {
    return res.status(404).json({ error: 'Impact event not found' });
  }
  
  const emergencyResponse = {
    dispatchId: `EMRG${Date.now()}`,
    impactId: impact.id,
    location: impact.location,
    services: services || ['ambulance', 'police', 'tow_truck'],
    status: 'dispatched',
    estimatedArrival: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
    responders: [
      { type: 'ambulance', unit: 'AMB-001', eta: '12 minutes' },
      { type: 'police', unit: 'POL-456', eta: '8 minutes' },
      { type: 'tow_truck', unit: 'TOW-789', eta: '20 minutes' }
    ]
  };
  
  impact.emergencyResponse = emergencyResponse;
  impact.status = 'emergency_dispatched';
  
  res.json(emergencyResponse);
});

// Notification Routes
app.post('/api/notifications/send', (req, res) => {
  const { userId, message, type, priority } = req.body;
  
  const notification = {
    id: `NOTIF${Date.now()}`,
    userId: parseInt(userId),
    message,
    type: type || 'info', // info, warning, success, error
    priority: priority || 'normal', // low, normal, high, urgent
    timestamp: new Date().toISOString(),
    read: false,
    channel: 'app' // app, sms, email
  };
  
  // In real implementation, this would integrate with push notification services
  console.log(`Sending notification to user ${userId}: ${message}`);
  
  res.json({ success: true, notification });
});

// File Upload Routes
app.post('/api/upload/secure-cam', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image provided' });
  }
  
  const { userId, gps } = req.body;
  
  // Generate cryptographic watermark
  const watermark = generateWatermark(req.file.buffer, {
    userId: parseInt(userId),
    gps: gps ? JSON.parse(gps) : null,
    deviceId: req.headers['user-agent'] || 'unknown'
  });
  
  // Verify watermark integrity
  const verification = verifyWatermark(watermark);
  
  const uploadResult = {
    filename: `secure_${Date.now()}_${req.file.originalname}`,
    size: req.file.size,
    watermark,
    verification,
    uploadTime: new Date().toISOString(),
    securityLevel: verification.valid ? 'high' : 'compromised'
  };
  
  res.json(uploadResult);
});

// Health Check Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      blockchain: 'operational',
      ai_services: 'online',
      payment_gateway: 'active',
      emergency_dispatch: 'ready'
    },
    version: '1.0.0'
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    users: users.length,
    policies: policies.length,
    claims: claims.length,
    garages: garages.length,
    impactEvents: impactSensorData.length,
    fraudDetections: imageDatabase.filter(img => img.flagged).length
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`
   Insurance Backend Server Running!
   Port: ${PORT}
   Local: http://localhost:${PORT}
   API Docs: http://localhost:${PORT}/api/status

   Mock Data Loaded:
   • Users: ${users.length}
   • Policies: ${policies.length} 
   • Claims: ${claims.length}
   • Garages: ${garages.length}
   • Impact Events: ${impactSensorData.length}

   Available Endpoints:
   • POST /api/auth/login
   • GET  /api/users/:id
   • POST /api/trust-score/calculate
   • POST /api/claims
   • GET  /api/claims/:claimId
   • POST /api/vehicle-assessment
   • POST /api/impact-sensors/alert
   • POST /api/ussd
   • GET  /api/analytics/overview
   • POST /api/fraud/check-image
   • POST /api/blockchain/verify-identity
   • POST /api/payments/mpesa
   • POST /api/emergency/dispatch
  `);
});

module.exports = app;