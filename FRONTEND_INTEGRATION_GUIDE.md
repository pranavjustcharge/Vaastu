# Frontend Integration Guide - Vaidik Vastu

## 🎯 Overview

This guide explains how to integrate the existing frontend (HTML/CSS/JS) with the backend API.

---

## 📍 Current Frontend Structure

### Pages:
- `index.html` - Main landing page with services
- `business_associate.html` - BA program information
- `services.html` - Service details
- `elite_services.html` - Elite services
- `contact.html` - Contact form
- `script.js` - Calendar and booking logic

### Services Offered:
1. **Business Vastu Consultation** - `BUSINESS_VASTU`
2. **Residential Vastu Healing** - `RESIDENTIAL_VASTU`
3. **Sidha Energy Healing Sessions** - `HEALING_SESSION`
4. **Land Energy Diagnosis** - `LAND_ENERGY`

---

## 🔗 API Integration Points

### 1. Booking Form Integration

**Current Form** (index.html, lines 316-345):
```html
<form id="contactForm">
  <input type="text" id="name" name="name" required>
  <input type="text" id="phone" name="phone" required>
  <input type="email" id="email" name="email" required>
  <textarea id="issue" name="issue" required></textarea>
  <input type="date" id="date" name="date" required>
  <input type="text" id="couponCode" placeholder="Enter coupon code">
  <button type="submit">Submit</button>
</form>
```

**Integration Steps**:

1. **Add service type field**:
```html
<select id="serviceType" name="serviceType" required>
  <option value="">Select Service</option>
  <option value="BUSINESS_VASTU">Business Vastu Consultation</option>
  <option value="RESIDENTIAL_VASTU">Residential Vastu Healing</option>
  <option value="HEALING_SESSION">Healing Session</option>
  <option value="LAND_ENERGY">Land Energy Diagnosis</option>
</select>
```

2. **Add time slot field**:
```html
<select id="preferredTime" name="preferredTime" required>
  <option value="">Select Time</option>
  <option value="09:00 AM">09:00 AM</option>
  <option value="10:00 AM">10:00 AM</option>
  <!-- ... more slots ... -->
</select>
```

3. **Update form submission** (modify script.js):
```javascript
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const bookingData = {
    clientName: document.getElementById('name').value,
    clientEmail: document.getElementById('email').value,
    clientPhone: document.getElementById('phone').value,
    serviceType: document.getElementById('serviceType').value,
    description: document.getElementById('issue').value,
    preferredDate: document.getElementById('date').value,
    preferredTime: document.getElementById('preferredTime').value,
    referralCode: new URLSearchParams(window.location.search).get('ref'),
    couponCode: document.getElementById('couponCode').value
  };

  try {
    const response = await fetch('http://localhost:3000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });

    const result = await response.json();
    
    if (result.success) {
      alert('Booking confirmed! We will contact you soon.');
      document.getElementById('contactForm').reset();
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    alert('Booking failed: ' + error.message);
  }
});
```

---

## 👥 BA Panel Integration

### BA Dashboard Page (New)

Create `ba-dashboard.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>BA Dashboard - Vaidik Vastu</title>
  <link rel="stylesheet" href="assets/css/bootstrap.css">
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <div class="ba-dashboard">
    <!-- Sidebar -->
    <aside class="sidebar">
      <ul>
        <li><a href="#dashboard">Dashboard</a></li>
        <li><a href="#referrals">My Referrals</a></li>
        <li><a href="#coupons">Coupons</a></li>
        <li><a href="#withdrawals">Withdrawal Requests</a></li>
        <li><a href="#profile">Profile</a></li>
        <li><a href="#logout">Logout</a></li>
      </ul>
    </aside>

    <!-- Main Content -->
    <main class="ba-content">
      <section id="dashboard">
        <h2>Dashboard</h2>
        <div class="metrics">
          <div class="metric-card">
            <h3>Total Earnings</h3>
            <p id="totalEarnings">₹0</p>
          </div>
          <div class="metric-card">
            <h3>Pending Withdrawal</h3>
            <p id="pendingEarnings">₹0</p>
          </div>
          <div class="metric-card">
            <h3>Approved Withdrawal</h3>
            <p id="approvedEarnings">₹0</p>
          </div>
          <div class="metric-card">
            <h3>Active Coupons</h3>
            <p id="activeCoupons">0</p>
          </div>
        </div>
      </section>

      <section id="referrals">
        <h2>My Referrals</h2>
        <div class="referral-info">
          <p>Your Referral Code: <strong id="referralCode">-</strong></p>
          <p>Referral Link: <input type="text" id="referralLink" readonly></p>
          <button onclick="copyReferralLink()">Copy Link</button>
        </div>
        <table id="referralsTable">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Service</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </section>

      <section id="withdrawals">
        <h2>Withdrawal Requests</h2>
        <form id="withdrawalForm">
          <input type="number" id="withdrawalAmount" placeholder="Amount" required>
          <button type="submit">Request Withdrawal</button>
        </form>
        <table id="withdrawalsTable">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </section>
    </main>
  </div>

  <script src="assets/js/ba-dashboard.js"></script>
</body>
</html>
```

### BA Dashboard JavaScript (New)

Create `assets/js/ba-dashboard.js`:

```javascript
const API_BASE = 'http://localhost:3000/api';
let accessToken = localStorage.getItem('accessToken');

// Load dashboard on page load
document.addEventListener('DOMContentLoaded', async () => {
  if (!accessToken) {
    window.location.href = 'login.html';
    return;
  }
  
  await loadDashboard();
  await loadBookings();
});

async function loadDashboard() {
  try {
    const response = await fetch(`${API_BASE}/ba/dashboard`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    const result = await response.json();
    
    if (result.success) {
      document.getElementById('totalEarnings').textContent = 
        '₹' + result.data.profile.totalEarnings;
      document.getElementById('pendingEarnings').textContent = 
        '₹' + result.data.profile.pendingEarnings;
      document.getElementById('approvedEarnings').textContent = 
        '₹' + result.data.profile.approvedEarnings;
      document.getElementById('referralCode').textContent = 
        result.data.referralCode;
      document.getElementById('referralLink').value = 
        result.data.referralLink;
    }
  } catch (error) {
    console.error('Failed to load dashboard:', error);
  }
}

async function loadBookings() {
  try {
    const response = await fetch(`${API_BASE}/bookings/ba/my-bookings`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    const result = await response.json();
    
    if (result.success) {
      const tbody = document.querySelector('#referralsTable tbody');
      tbody.innerHTML = result.data.map(booking => `
        <tr>
          <td>${booking.clientName}</td>
          <td>${booking.serviceType}</td>
          <td>${new Date(booking.preferredDate).toLocaleDateString()}</td>
          <td>${booking.status}</td>
        </tr>
      `).join('');
    }
  } catch (error) {
    console.error('Failed to load bookings:', error);
  }
}

function copyReferralLink() {
  const link = document.getElementById('referralLink');
  link.select();
  document.execCommand('copy');
  alert('Referral link copied!');
}

// Withdrawal form submission
document.getElementById('withdrawalForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const amount = document.getElementById('withdrawalAmount').value;
  
  try {
    const response = await fetch(`${API_BASE}/ba/withdrawals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ amount: parseFloat(amount) })
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('Withdrawal request submitted!');
      document.getElementById('withdrawalForm').reset();
      await loadDashboard();
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    alert('Failed to submit withdrawal: ' + error.message);
  }
});
```

---

## 🔑 Authentication Integration

### Login Page (New)

Create `login.html` with form that calls:

```javascript
async function login(email, password) {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const result = await response.json();
  
  if (result.success) {
    localStorage.setItem('accessToken', result.data.accessToken);
    localStorage.setItem('refreshToken', result.data.refreshToken);
    localStorage.setItem('userRole', result.data.user.role);
    
    if (result.data.user.role === 'BA') {
      window.location.href = 'ba-dashboard.html';
    } else {
      window.location.href = 'admin-dashboard.html';
    }
  }
}
```

---

## 🛠️ Environment Configuration

Update API base URL in frontend:

```javascript
// For development
const API_BASE = 'http://localhost:3000/api';

// For production
// const API_BASE = 'https://api.vaidikvaastu.com/api';
```

---

## 📋 Checklist

- [ ] Add service type dropdown to booking form
- [ ] Add time slot selection
- [ ] Integrate booking form submission with API
- [ ] Create BA login page
- [ ] Create BA dashboard page
- [ ] Create admin dashboard page
- [ ] Add referral link copy functionality
- [ ] Add withdrawal request form
- [ ] Add authentication token management
- [ ] Test all API integrations
- [ ] Add error handling and validation
- [ ] Add loading states and spinners
- [ ] Test with real backend

---

## 🚀 Next Steps

1. Update `script.js` with API integration
2. Create `login.html` for authentication
3. Create `ba-dashboard.html` for BA panel
4. Create `admin-dashboard.html` for admin panel
5. Test all endpoints with Postman
6. Deploy backend and update API URLs

