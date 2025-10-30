# 🧪 Toaster Notifications - Testing Guide

## Server Status
- ✅ Backend: http://localhost:3000
- ✅ Frontend: http://localhost:5000
- ✅ Database: MongoDB Atlas Connected

## Test Credentials

### Admin Account
```
Email: admin@example.com
Password: ChangeMe123!
```

### BA Account (Already Approved)
```
Email: ba@example.com
Password: BA123456!
```

---

## Test Cases

### 1. Login Page - Error Notifications

#### Test 1.1: Invalid Credentials
1. Go to http://localhost:5000/login.html
2. Enter: `admin@example.com` / `wrongpassword`
3. Click Login
4. **Expected**: ❌ Red error toast: "Invalid email/username or password. Please try again."

#### Test 1.2: Pending BA Account
1. Go to http://localhost:5000/login.html
2. Create a new BA account (see Test 3.1)
3. Try to login with that email before admin approval
4. **Expected**: ❌ Red error toast: "Your account is pending admin approval..."

#### Test 1.3: Successful Login
1. Go to http://localhost:5000/login.html
2. Enter: `admin@example.com` / `ChangeMe123!`
3. Click Login
4. **Expected**: ✅ Green success toast: "Login successful! Redirecting..."
5. **Expected**: Redirects to admin-dashboard.html

---

### 2. Business Associate Registration - Error Notifications

#### Test 2.1: Duplicate Email Registration
1. Go to http://localhost:5000/business_associate.html
2. Scroll to "Join Now" button
3. Click "Join Now"
4. Fill form with:
   - Email: `ba@example.com` (already exists)
   - Password: `Test123456`
   - First Name: Test
   - Last Name: User
   - Phone: 9876543210
   - Expertise: Vastu Consultation
   - Experience: 5
   - Bio: Test bio
   - Login Type: Email
5. Click Submit
6. **Expected**: ❌ Red error toast: "This email is already registered. Please use a different email address."

#### Test 2.2: Successful BA Registration
1. Go to http://localhost:5000/business_associate.html
2. Click "Join Now"
3. Fill form with:
   - Email: `newba@example.com` (unique)
   - Password: `NewBA123456`
   - First Name: Rajesh
   - Last Name: Kumar
   - Phone: 9876543210
   - Expertise: Vastu Consultation
   - Experience: 5
   - Bio: Experienced Vastu consultant
   - Login Type: Email
4. Click Submit
5. **Expected**: ✅ Green success toast: "Application submitted successfully! Your application is now pending admin approval."
6. **Expected**: Form closes and resets

#### Test 2.3: Profile Creation Failure Recovery
1. If profile creation fails (network error)
2. **Expected**: ❌ Red error toast with recovery tip
3. **Expected**: User can retry with same email

---

### 3. Admin Dashboard - Action Notifications

#### Test 3.1: BA Approval
1. Login as admin: `admin@example.com` / `ChangeMe123!`
2. Go to Admin Dashboard
3. Find pending BA in "Pending BA Approvals" section
4. Click "Approve" button
5. **Expected**: ✅ Green success toast: "BA approved successfully"
6. **Expected**: Table refreshes automatically

#### Test 3.2: BA Rejection
1. Login as admin
2. Go to Admin Dashboard
3. Find pending BA in "Pending BA Approvals" section
4. Click "Reject" button
5. **Expected**: ✅ Green success toast: "BA rejected successfully"
6. **Expected**: Table refreshes automatically

#### Test 3.3: Withdrawal Approval
1. Login as admin
2. Go to Admin Dashboard
3. Find pending withdrawal in "Pending Withdrawals" section
4. Click "Approve" button
5. **Expected**: ✅ Green success toast: "Withdrawal approved successfully"
6. **Expected**: Table refreshes automatically

#### Test 3.4: Withdrawal Rejection
1. Login as admin
2. Go to Admin Dashboard
3. Find pending withdrawal in "Pending Withdrawals" section
4. Click "Reject" button
5. **Expected**: ✅ Green success toast: "Withdrawal rejected successfully"
6. **Expected**: Table refreshes automatically

---

### 4. BA Dashboard - Action Notifications

#### Test 4.1: Withdrawal Request - Valid Amount
1. Login as BA: `ba@example.com` / `BA123456!`
2. Go to BA Dashboard
3. Click "Request Withdrawal" button
4. Enter amount: `5000`
5. Click OK
6. **Expected**: ✅ Green success toast: "Withdrawal request submitted successfully"
7. **Expected**: Withdrawal history updates

#### Test 4.2: Withdrawal Request - Invalid Amount
1. Login as BA
2. Go to BA Dashboard
3. Click "Request Withdrawal" button
4. Enter: `abc` (invalid)
5. Click OK
6. **Expected**: ⚠️ Orange warning toast: "Please enter a valid amount"

#### Test 4.3: Withdrawal Request - Cancel
1. Login as BA
2. Go to BA Dashboard
3. Click "Request Withdrawal" button
4. Click Cancel
5. **Expected**: No toast notification (expected behavior)

---

### 5. Toast Features Testing

#### Test 5.1: Auto-Dismiss
1. Trigger any success notification
2. **Expected**: Toast appears
3. **Expected**: Progress bar animates
4. **Expected**: Toast auto-dismisses after 4-5 seconds

#### Test 5.2: Manual Close
1. Trigger any notification
2. Click the "×" button on the toast
3. **Expected**: Toast slides out smoothly
4. **Expected**: Disappears immediately

#### Test 5.3: Multiple Toasts
1. Trigger multiple notifications quickly
2. **Expected**: Toasts stack vertically
3. **Expected**: Each has its own progress bar
4. **Expected**: Each can be closed independently

#### Test 5.4: Mobile Responsiveness
1. Open browser DevTools (F12)
2. Toggle device toolbar (mobile view)
3. Trigger a notification
4. **Expected**: Toast appears on left side
5. **Expected**: Toast width adapts to screen
6. **Expected**: Text wraps properly

---

### 6. Error Recovery Testing

#### Test 6.1: Network Error During Registration
1. Open DevTools (F12)
2. Go to Network tab
3. Check "Offline" to simulate network error
4. Try to register a new BA
5. **Expected**: ❌ Red error toast: "Network error. Please check your connection and try again."

#### Test 6.2: Server Error Handling
1. Backend is running normally
2. Trigger any action
3. **Expected**: Appropriate success/error toast
4. **Expected**: No browser alerts

---

## Toast Notification Types

### ✅ Success (Green)
- Duration: 4 seconds
- Icon: ✓
- Used for: Successful operations

### ❌ Error (Red)
- Duration: 5 seconds
- Icon: ✕
- Used for: Failed operations

### ⚠️ Warning (Orange)
- Duration: 4 seconds
- Icon: ⚠
- Used for: Validation warnings

### ℹ️ Info (Blue)
- Duration: 4 seconds
- Icon: ℹ
- Used for: Informational messages

---

## Verification Checklist

- [ ] All alert() calls replaced with toaster
- [ ] All confirm() calls replaced with toaster
- [ ] All prompt() calls replaced with toaster
- [ ] Error messages are user-friendly
- [ ] Success messages are clear
- [ ] Toasts auto-dismiss correctly
- [ ] Manual close button works
- [ ] Multiple toasts stack properly
- [ ] Mobile layout is responsive
- [ ] No console errors
- [ ] Network errors handled gracefully
- [ ] All pages have toaster.js loaded

---

## Browser Console
- Open DevTools (F12)
- Go to Console tab
- **Expected**: No errors or warnings related to toaster
- **Expected**: Smooth operation without JavaScript errors

---

**Status**: ✅ Ready for Testing

