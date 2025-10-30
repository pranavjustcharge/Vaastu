# Frontend Integration Guide

## 🔗 Connecting Your Frontend to the Backend

This guide explains how to integrate your existing Vastu website frontend with the BA Dashboard backend.

---

## 🚀 Backend Setup

First, ensure the backend is running:

```bash
# Option 1: Docker
docker-compose up -d

# Option 2: Local
npm install
npm run migrate:dev
npm run seed
npm run dev
```

Backend will be available at: `http://localhost:3000`

---

## 📡 API Base URL

Configure your frontend to use:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

For production:
```javascript
const API_BASE_URL = 'https://api.yourdomain.com/api';
```

---

## 🔐 Authentication Flow

### 1. Register BA
```javascript
async function registerBA(email, password, firstName, lastName) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, firstName, lastName })
  });
  return response.json();
}
```

### 2. Login
```javascript
async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  
  // Store tokens
  localStorage.setItem('token', data.token);
  localStorage.setItem('refreshToken', data.refreshToken);
  
  return data;
}
```

### 3. Authenticated Requests
```javascript
async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (response.status === 401) {
    // Token expired, try refresh
    await refreshToken();
    return fetchWithAuth(endpoint, options);
  }
  
  return response.json();
}
```

### 4. Refresh Token
```javascript
async function refreshToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
  
  return data;
}
```

---

## 📊 BA Dashboard Integration

### Get BA Profile
```javascript
async function getBAProfile() {
  return fetchWithAuth('/ba/profile');
}
```

### Update BA Profile
```javascript
async function updateBAProfile(profileData) {
  return fetchWithAuth('/ba/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
}
```

### Get Referral Stats
```javascript
async function getReferralStats() {
  return fetchWithAuth('/ba/referrals');
}
```

### Get Withdrawal History
```javascript
async function getWithdrawalHistory(limit = 10, offset = 0) {
  return fetchWithAuth(`/ba/withdrawals?limit=${limit}&offset=${offset}`);
}
```

### Request Withdrawal
```javascript
async function requestWithdrawal(amount) {
  return fetchWithAuth('/ba/withdrawals', {
    method: 'POST',
    body: JSON.stringify({ amount })
  });
}
```

### Get Assigned Coupons
```javascript
async function getAssignedCoupons() {
  return fetchWithAuth('/ba/coupons');
}
```

---

## 👨‍💼 Admin Dashboard Integration

### Get Pending BAs
```javascript
async function getPendingBAs() {
  return fetchWithAuth('/admin/bas/pending');
}
```

### Approve BA
```javascript
async function approveBA(baId) {
  return fetchWithAuth(`/admin/bas/${baId}/approve`, {
    method: 'POST'
  });
}
```

### Set Commission
```javascript
async function setCommission(commissionType, commissionValue, baId = null) {
  return fetchWithAuth('/admin/commission', {
    method: 'POST',
    body: JSON.stringify({ commissionType, commissionValue, baId })
  });
}
```

### Create Coupon
```javascript
async function createCoupon(code, discountPercentage, options = {}) {
  return fetchWithAuth('/admin/coupons', {
    method: 'POST',
    body: JSON.stringify({
      code,
      discountPercentage,
      ...options
    })
  });
}
```

### Get Pending Withdrawals
```javascript
async function getPendingWithdrawals() {
  return fetchWithAuth('/admin/withdrawals/pending');
}
```

### Approve Withdrawal
```javascript
async function approveWithdrawal(withdrawalId, adminNotes = '') {
  return fetchWithAuth(`/admin/withdrawals/${withdrawalId}/approve`, {
    method: 'POST',
    body: JSON.stringify({ adminNotes })
  });
}
```

### Get Dashboard Stats
```javascript
async function getDashboardStats() {
  return fetchWithAuth('/admin/dashboard/stats');
}
```

---

## 🛠️ React Integration Example

### Setup API Service
```javascript
// services/api.js
export const api = {
  auth: {
    register: (data) => fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    
    login: (email, password) => fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(r => r.json()),
  },
  
  ba: {
    getProfile: () => fetchWithAuth('/ba/profile'),
    updateProfile: (data) => fetchWithAuth('/ba/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    getReferrals: () => fetchWithAuth('/ba/referrals'),
    getWithdrawals: (limit, offset) => 
      fetchWithAuth(`/ba/withdrawals?limit=${limit}&offset=${offset}`),
    requestWithdrawal: (amount) => fetchWithAuth('/ba/withdrawals', {
      method: 'POST',
      body: JSON.stringify({ amount })
    }),
  },
  
  admin: {
    getPendingBAs: () => fetchWithAuth('/admin/bas/pending'),
    approveBA: (baId) => fetchWithAuth(`/admin/bas/${baId}/approve`, {
      method: 'POST'
    }),
    getDashboardStats: () => fetchWithAuth('/admin/dashboard/stats'),
  }
};
```

### Use in Components
```javascript
// components/BADashboard.jsx
import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function BADashboard() {
  const [profile, setProfile] = useState(null);
  const [referrals, setReferrals] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profileData, referralData] = await Promise.all([
          api.ba.getProfile(),
          api.ba.getReferrals()
        ]);
        setProfile(profileData);
        setReferrals(referralData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div>Total Earnings: ${referrals?.totalEarnings}</div>
      <div>Referrals: {referrals?.totalReferrals}</div>
    </div>
  );
}
```

---

## 🔄 CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000`
- `http://localhost:5173` (Vite default)

To add your frontend URL, update `.env`:
```
CORS_ORIGIN=http://localhost:3000,http://localhost:5173,https://yourdomain.com
```

---

## 🧪 Testing Integration

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "ChangeMe123!"
  }'
```

### Test Protected Endpoint
```bash
curl http://localhost:3000/api/admin/dashboard/stats \
  -H "Authorization: Bearer <token>"
```

---

## 📋 Integration Checklist

- [ ] Backend running on `http://localhost:3000`
- [ ] Frontend configured with correct API base URL
- [ ] Authentication flow implemented
- [ ] Token storage (localStorage/sessionStorage)
- [ ] Token refresh mechanism
- [ ] Error handling for 401 responses
- [ ] CORS configured correctly
- [ ] All API endpoints tested
- [ ] Loading states implemented
- [ ] Error messages displayed to users

---

## 🚀 Deployment

### Backend Deployment
```bash
docker-compose up -d
```

### Frontend Environment
```javascript
// .env.production
VITE_API_URL=https://api.yourdomain.com/api
```

### Update CORS
Update backend `.env`:
```
CORS_ORIGIN=https://yourdomain.com
```

---

## 📞 Troubleshooting

### CORS Error
- Check `CORS_ORIGIN` in backend `.env`
- Ensure frontend URL is included
- Restart backend after changes

### 401 Unauthorized
- Token may be expired
- Implement token refresh
- Check token storage

### 404 Not Found
- Verify API endpoint path
- Check backend is running
- Review API documentation

### Connection Refused
- Ensure backend is running
- Check port 3000 is available
- Verify API base URL

---

## 📚 Resources

- Backend API: `http://localhost:3000/health`
- API Documentation: `API_DOCUMENTATION.md`
- Backend README: `README.md`
- Quick Start: `QUICKSTART.md`

Happy integrating! 🎉

