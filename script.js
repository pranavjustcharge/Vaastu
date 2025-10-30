// API Configuration - Use config.js for dynamic URL
let API_BASE_URL = null;

// Initialize API URL from config
function initializeAPI() {
    if (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.API_BASE_URL) {
        API_BASE_URL = APP_CONFIG.API_BASE_URL;
        console.log('✅ API_BASE_URL initialized:', API_BASE_URL);
    } else {
        console.error('❌ APP_CONFIG not loaded yet');
        setTimeout(initializeAPI, 100);
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAPI);
} else {
    initializeAPI();
}

let authToken = localStorage.getItem('authToken');

const datesContainer = document.getElementById("dates");
const slotsContainer = document.getElementById("slots");
const selectedDateText = document.getElementById("selected-date");
const bookBtn = document.getElementById("bookBtn");

let selectedDate = null;
let selectedSlot = null;

// Check if user is logged in
function checkAuth() {
  if (!authToken) {
    window.location.href = '/login.html';
  }
}

// Logout function
function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.href = '/login.html';
}

// Generate November 2024 calendar
function generateCalendar() {
  const year = 2024;
  const month = 10; // November (0-indexed)
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  datesContainer.innerHTML = "";

  // Empty slots before 1st
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    datesContainer.appendChild(empty);
  }

  // Dates
  for (let day = 1; day <= totalDays; day++) {
    const date = document.createElement("div");
    date.textContent = day;
    date.addEventListener("click", () => selectDate(day, month, year, date));
    datesContainer.appendChild(date);
  }
}

function selectDate(day, month, year, dateElement) {
  // Clear previous selection
  document.querySelectorAll(".dates div").forEach(d => d.classList.remove("selected"));
  dateElement.classList.add("selected");

  selectedDate = `${day} November 2024`;
  selectedDateText.textContent = `Selected: ${selectedDate}`;
  selectedSlot = null;

  loadSlots();
  checkBookingReady();
}

// Load slots when date is selected
function loadSlots() {
  slotsContainer.innerHTML = "";

  const slots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM"
  ];

  slots.forEach(time => {
    const slot = document.createElement("div");
    slot.classList.add("slot");
    slot.textContent = time;

    slot.addEventListener("click", () => {
      document.querySelectorAll(".slot").forEach(s => s.classList.remove("selected"));
      slot.classList.add("selected");
      selectedSlot = time;
      checkBookingReady();
    });

    slotsContainer.appendChild(slot);
  });
}

// Enable button only when both date & slot are chosen
function checkBookingReady() {
  bookBtn.disabled = !(selectedDate && selectedSlot);
}

// Button action - Create booking via API
bookBtn.addEventListener("click", async () => {
  if (!selectedDate || !selectedSlot) {
    alert('Please select both date and time');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        serviceType: 'BUSINESS_VASTU',
        clientName: 'Client Name',
        clientEmail: 'client@example.com',
        clientPhone: '+919876543210',
        bookingDate: new Date(selectedDate).toISOString(),
        bookingTime: selectedSlot,
        notes: 'Booking from website'
      })
    });

    if (!response.ok) {
      throw new Error('Booking failed');
    }

    const data = await response.json();
    alert(`✅ Session booked successfully!\nBooking ID: ${data.data._id}`);

    // Reset form
    selectedDate = null;
    selectedSlot = null;
    generateCalendar();
  } catch (error) {
    alert(`❌ Booking failed: ${error.message}`);
  }
});

// Initialize
checkAuth();
generateCalendar();
