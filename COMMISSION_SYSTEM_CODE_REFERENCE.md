# 📚 Commission System - Code Reference Guide

---

## 📁 File Locations

### Backend Files

| File | Purpose | Lines |
|------|---------|-------|
| `src/services/commissionService.ts` | Commission logic | 1-147 |
| `src/controllers/commissionController.ts` | API handlers | 1-42 |
| `src/routes/commission.ts` | Commission routes | 1-30 |
| `src/controllers/adminController.ts` | Admin handlers | 23-39 |
| `src/routes/admin.ts` | Admin routes | 23-33 |
| `src/services/bookingService.ts` | Booking logic | 242-265 |
| `src/services/baService.ts` | BA logic | 47-203 |
| `prisma/schema.prisma` | Database schema | 128-165 |
| `src/config/env.ts` | Configuration | 46-52 |

### Frontend Files

| File | Purpose | Lines |
|------|---------|-------|
| `admin-dashboard.html` | Admin UI | 241-643 |
| `ba-dashboard.html` | BA UI | 164-514 |
| `assets/js/config.js` | Frontend config | 97-130 |

---

## 🔍 Key Code Sections

### 1. Commission Service - Get Settings
**File**: `src/services/commissionService.ts` (lines 17-34)

```typescript
async getSettings(): Promise<CommissionSettings> {
  const db = getDB() as any;
  let settings = await db.collection('commissionsettings').findOne({});
  
  if (!settings) {
    settings = {
      commissionType: 'FIXED',
      commissionValue: 25000,
      gstPercentage: 18,
      excludeGSTFromBase: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  return settings;
}
```

### 2. Commission Calculation
**File**: `src/services/commissionService.ts` (lines 92-121)

```typescript
async calculateCommission(transactionAmount: number, settings?: CommissionSettings) {
  if (!settings) {
    settings = await this.getSettings();
  }

  let commission = 0;
  if (settings.commissionType === 'PERCENTAGE') {
    commission = (transactionAmount * settings.commissionValue) / 100;
  } else {
    commission = settings.commissionValue;
  }

  let gst = 0;
  if (!settings.excludeGSTFromBase) {
    gst = (commission * settings.gstPercentage) / 100;
  }

  const totalCommission = commission + gst;
  return {
    baseCommission: commission,
    gst,
    totalCommission,
    commissionType: settings.commissionType,
    commissionValue: settings.commissionValue,
    gstPercentage: settings.gstPercentage,
  };
}
```

### 3. Get Commission Info
**File**: `src/services/commissionService.ts` (lines 126-143)

```typescript
async getCommissionInfo() {
  const settings = await this.getSettings();
  
  let description = '';
  if (settings.commissionType === 'PERCENTAGE') {
    description = `${settings.commissionValue}% of booking value`;
  } else {
    description = `₹${settings.commissionValue.toLocaleString('en-IN')} per successful referral`;
  }

  return {
    commissionType: settings.commissionType,
    commissionValue: settings.commissionValue,
    description,
    gstPercentage: settings.gstPercentage,
    excludeGSTFromBase: settings.excludeGSTFromBase,
  };
}
```

### 4. Update Commission Settings
**File**: `src/controllers/commissionController.ts` (lines 10-35)

```typescript
export const updateCommissionSettings = asyncHandler(async (req: Request, res: Response) => {
  const { commissionType, commissionValue, gstPercentage, excludeGSTFromBase } = req.body;

  if (
    commissionType === undefined &&
    commissionValue === undefined &&
    gstPercentage === undefined &&
    excludeGSTFromBase === undefined
  ) {
    res.status(400).json({ error: 'At least one field must be provided for update' });
    return;
  }

  const settings = await commissionService.updateSettings({
    commissionType,
    commissionValue,
    gstPercentage,
    excludeGSTFromBase,
  });

  res.status(200).json({ 
    data: settings,
    message: 'Commission settings updated successfully'
  });
});
```

### 5. Referral Transaction Creation
**File**: `src/services/bookingService.ts` (lines 242-265)

```typescript
// Calculate commission using commissionService
const baseAmount = booking.serviceAmount || 1000;
const commissionDetails = await commissionService.calculateCommission(baseAmount, settings);

// Create referral transaction
await db.collection('referraltransactions').insertOne({
  _id: uuidv4(),
  referrerId: booking.referrerId,
  referralCode: booking.referralCode || '',
  customerEmail: booking.clientEmail,
  baseAmount: baseAmount,
  baseCommission: commissionDetails.baseCommission,
  gstAmount: commissionDetails.gst,
  totalCommissionAmount: commissionDetails.totalCommission,
  commissionType: settings.commissionType,
  commissionValue: settings.commissionValue,
  gstPercentage: settings.gstPercentage,
  excludeGSTFromBase: settings.excludeGSTFromBase,
  status: 'COMPLETED',
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

### 6. Admin Dashboard - Load Commission
**File**: `admin-dashboard.html` (lines 541-561)

```javascript
async function loadCommissionSettings() {
  try {
    const response = await fetch(`${API_BASE_URL}/commission/settings`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const result = await response.json();
    const settings = result.data;

    document.getElementById('commissionType').value = settings.commissionType;
    document.getElementById('commissionValue').value = settings.commissionValue;
    document.getElementById('gstPercentage').value = settings.gstPercentage;
    document.getElementById('excludeGSTFromBase').checked = settings.excludeGSTFromBase;

    updateCommissionTypeDisplay();
    displayCommissionInfo(settings);
  } catch (error) {
    console.error('Error loading commission settings:', error);
    toaster.error('Failed to load commission settings');
  }
}
```

### 7. Admin Dashboard - Update Commission
**File**: `admin-dashboard.html` (lines 598-638)

```javascript
async function updateCommissionSettings(event) {
  event.preventDefault();

  const commissionType = document.getElementById('commissionType').value;
  const commissionValue = parseFloat(document.getElementById('commissionValue').value);
  const gstPercentage = parseFloat(document.getElementById('gstPercentage').value);
  const excludeGSTFromBase = document.getElementById('excludeGSTFromBase').checked;

  if (!commissionType || isNaN(commissionValue)) {
    toaster.error('Please fill in all required fields');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/commission/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        commissionType,
        commissionValue,
        gstPercentage,
        excludeGSTFromBase
      })
    });

    const result = await response.json();

    if (response.ok) {
      toaster.success('Commission settings updated successfully');
      displayCommissionInfo(result.data);
    } else {
      toaster.error(result.error || 'Failed to update commission settings');
    }
  } catch (error) {
    console.error('Error updating commission settings:', error);
    toaster.error('Network error. Please try again.');
  }
}
```

### 8. BA Dashboard - Load Commission Info
**File**: `ba-dashboard.html` (lines 270-295)

```javascript
async function loadCommissionInfo() {
  try {
    const response = await fetch(`${API_BASE_URL}/commission/info`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const result = await response.json();
    const data = result.data;

    let commissionText = '';
    if (data.commissionType === 'PERCENTAGE') {
      commissionText = `You earn <strong>${data.commissionValue}%</strong> of the booking value for each successful referral.`;
    } else {
      commissionText = `You earn <strong>₹${data.commissionValue.toLocaleString('en-IN')}</strong> for each successful referral.`;
    }

    const gstInfo = data.excludeGSTFromBase
      ? `GST (${data.gstPercentage}%) is calculated on top of your commission.`
      : `GST (${data.gstPercentage}%) is included in your commission.`;

    document.getElementById('commissionInfo').innerHTML =
      `${commissionText}<br><small style="color: #666; margin-top: 8px; display: block;">${gstInfo}</small>`;
  } catch (error) {
    console.error('Error loading commission info:', error);
    document.getElementById('commissionInfo').textContent = 'Unable to load commission details';
  }
}
```

### 9. BA Dashboard - Load Earnings
**File**: `ba-dashboard.html` (lines 253-267)

```javascript
async function loadStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/ba/profile`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await response.json();
    const profile = data.data;
    
    document.getElementById('totalEarnings').textContent = `₹${profile.totalEarnings || 0}`;
    document.getElementById('approvedEarnings').textContent = `₹${profile.approvedEarnings || 0}`;
    document.getElementById('kycStatus').textContent = profile.kycStatus || 'PENDING';
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}
```

---

## 🔗 API Routes

**File**: `src/routes/commission.ts`

```typescript
// Public endpoint
router.get('/info', commissionController.getCommissionInfo);

// Admin endpoints
router.use(authMiddleware, adminOnly);
router.get('/settings', commissionController.getCommissionSettings);
router.put('/settings', [...validation], commissionController.updateCommissionSettings);
```

**File**: `src/routes/admin.ts`

```typescript
router.post('/commission-settings', [...validation], adminController.setCommission);
router.get('/commission-settings', adminController.getCommissionSettings);
```

---

## 🗄️ Database Schema

**File**: `prisma/schema.prisma` (lines 128-165)

```prisma
model CommissionSetting {
  id                String    @id @default(cuid()) @map("_id")
  baId              String?
  commissionType    String
  commissionValue   Float
  isActive          Boolean   @default(true)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  @@unique([baId])
}

model ReferralTransaction {
  id                String    @id @default(cuid()) @map("_id")
  referrerId        String
  referrer          User      @relation("referrer", fields: [referrerId], references: [id], onDelete: Cascade)
  referralCode      String
  customerEmail     String
  commissionAmount  Float
  commissionType    String
  commissionValue   Float
  status            String    @default("PENDING")
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  @@index([referrerId])
  @@index([referralCode])
  @@index([status])
}
```


