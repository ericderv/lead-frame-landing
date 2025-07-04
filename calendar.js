const calendarRoot = document.getElementById('calendar-root');

const today = new Date();
let selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
const maxYear = today.getFullYear() + 2;
const minYear = today.getFullYear();

function renderCalendar(month, year) {
  calendarRoot.innerHTML = '';
  // Header
  const header = document.createElement('div');
  header.className = 'calendar-header';
  const prev = document.createElement('span');
  prev.className = 'calendar-arrow';
  prev.innerHTML = '&#8592;';
  prev.onclick = () => {
    if (month === 0 && year === minYear) return;
    if (month === 0) {
      renderCalendar(11, year - 1);
    } else {
      renderCalendar(month - 1, year);
    }
    updateBookingInfo();
  };
  if (month === 0 && year === minYear) prev.style.opacity = 0.3;
  const next = document.createElement('span');
  next.className = 'calendar-arrow';
  next.innerHTML = '&#8594;';
  next.onclick = () => {
    if (month === 11 && year === maxYear) return;
    if (month === 11) {
      renderCalendar(0, year + 1);
    } else {
      renderCalendar(month + 1, year);
    }
    updateBookingInfo();
  };
  if (month === 11 && year === maxYear) next.style.opacity = 0.3;
  const monthName = document.createElement('span');
  monthName.className = 'calendar-month';
  monthName.textContent = `${getMonthName(month)} ${year}`;
  header.appendChild(prev);
  header.appendChild(monthName);
  header.appendChild(next);
  calendarRoot.appendChild(header);

  // Days
  const days = document.createElement('div');
  days.className = 'calendar-days';
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
    const s = document.createElement('span');
    s.textContent = d;
    days.appendChild(s);
  });
  calendarRoot.appendChild(days);

  // Dates
  const dates = document.createElement('div');
  dates.className = 'calendar-dates';
  const firstDay = new Date(year, month, 1).getDay();
  const numDays = new Date(year, month + 1, 0).getDate();
  // Fill blanks
  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement('span');
    blank.className = 'calendar-date disabled';
    blank.innerHTML = '&nbsp;';
    dates.appendChild(blank);
  }
  for (let d = 1; d <= numDays; d++) {
    const dateObj = new Date(year, month, d);
    const dateSpan = document.createElement('span');
    dateSpan.className = 'calendar-date';
    dateSpan.textContent = d;
    if (dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
      dateSpan.classList.add('disabled');
    } else {
      dateSpan.onclick = () => {
        selectedDate = dateObj;
        renderCalendar(month, year);
        updateBookingInfo();
      };
      if (
        selectedDate.getDate() === d &&
        selectedDate.getMonth() === month &&
        selectedDate.getFullYear() === year
      ) {
        dateSpan.classList.add('selected');
      }
    }
    dates.appendChild(dateSpan);
  }
  calendarRoot.appendChild(dates);
}

function getMonthName(m) {
  return [
    'January','February','March','April','May','June','July','August','September','October','November','December'
  ][m];
}

function updateBookingInfo() {
  // Update the date display
  const dateDisplay = document.querySelector('.info-item .calendar-date-display');
  if (dateDisplay) {
    dateDisplay.textContent = formatDate(selectedDate, getSelectedTimeZone());
  }
  // Update the time zone display
  const tzDisplay = document.querySelector('.info-item .timezone-display');
  if (tzDisplay) {
    tzDisplay.textContent = formatTimeZone(getSelectedTimeZone(), selectedDate);
  }
}

function getSelectedTimeZone() {
  const tzSel = document.getElementById('timezone-select');
  return tzSel ? tzSel.value : Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function formatDate(date, timeZone) {
  // Format: Thu, Jul 3, 2025
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: timeZone
  });
}

function formatTimeZone(tz, date) {
  // Format: America/Vancouver (PDT)
  try {
    const dtf = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' });
    const parts = dtf.formatToParts(date);
    const abbr = parts.find(p => p.type === 'timeZoneName')?.value || '';
    return `${tz} (${abbr})`;
  } catch {
    return tz;
  }
}

renderCalendar(currentMonth, currentYear);

// Time zone selector logic
const timezoneSelect = document.getElementById('timezone-select');
if (timezoneSelect) {
  // List of IANA time zones (shortened for brevity, but you can use a full list)
  const timezones = [
    'Pacific/Midway','America/Adak','America/Anchorage','America/Los_Angeles','America/Denver','America/Chicago','America/New_York','America/Caracas','America/Sao_Paulo','Atlantic/Azores','Europe/London','Europe/Berlin','Europe/Istanbul','Europe/Moscow','Asia/Dubai','Asia/Karachi','Asia/Kolkata','Asia/Bangkok','Asia/Hong_Kong','Asia/Tokyo','Australia/Sydney','Pacific/Auckland'
  ];
  // Try to get user's time zone
  let userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (!timezones.includes(userTz)) timezones.unshift(userTz);
  // Populate dropdown
  timezones.forEach(tz => {
    const opt = document.createElement('option');
    opt.value = tz;
    opt.textContent = tz;
    if (tz === userTz) opt.selected = true;
    timezoneSelect.appendChild(opt);
  });
  timezoneSelect.addEventListener('change', () => {
    updateBookingInfo();
  });
}

// Initial update
window.addEventListener('DOMContentLoaded', updateBookingInfo);
setTimeout(updateBookingInfo, 100); // In case DOM is not ready 