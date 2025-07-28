gsap.registerPlugin(ScrollTrigger);

let typed5 = new Typed("#typed5", {
  strings: ["I'm Haseeb"],
  typeSpeed: 50,
  backSpeed: 20,
  cursorChar: "_",
  shuffle: true,
  smartBackspace: false,
});

gsap.to(".shape--center-right", {
  scrollTrigger: {
    trigger: ".shape--center-right",
    scrub: 1,
    start: "top 50%",
    end: "center top",
  },
  transform: "translateY(-400px)",
});

gsap.to(".shape--center", {
  scrollTrigger: {
    trigger: ".shape--center",
    scrub: 1,
    start: "top 10%",
    end: "center top",
  },
  transform: "translateY(-100px)",
});

gsap.to(".shape--bottom-main", {
  scrollTrigger: {
    trigger: ".shape--bottom-main",
    scrub: 1,
    start: "top 60%",
    end: "center top",
  },
  opacity: 0,
  y: -200,
});

window.addEventListener("scroll", function () {
  var navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Tooltip for portfolio links
(function() {
  let tooltip;
  let tooltipLabel;
  let tooltipTech;
  let activeLink = null;

  function showTooltip(e) {
    const link = e.currentTarget;
    const text = link.getAttribute('data-tooltip');
    if (!text) return;
    // If the text is just a filename or single word, show only that
    let label = '';
    let tech = text;
    if (text.startsWith('Developed in:')) {
      label = 'Developed in:';
      tech = text.replace(/^Developed in:\s*/i, '');
    }
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'custom-tooltip';
      tooltipLabel = document.createElement('span');
      tooltipLabel.className = 'tooltip-label';
      tooltipTech = document.createElement('span');
      tooltipTech.className = 'tooltip-tech';
      tooltip.appendChild(tooltipLabel);
      tooltip.appendChild(tooltipTech);
      document.body.appendChild(tooltip);
    }
    tooltipLabel.textContent = label;
    tooltipTech.textContent = tech;
    tooltip.classList.add('active');
    activeLink = link;
    positionTooltip(e);
  }

  function hideTooltip() {
    if (tooltip) {
      tooltip.classList.remove('active');
      activeLink = null;
    }
  }

  function positionTooltip(e) {
    if (!tooltip || !activeLink) return;
    const rect = activeLink.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;
    // Center tooltip above the link, follow mouse X
    const tooltipRect = tooltip.getBoundingClientRect();
    let left = e.clientX - tooltipRect.width / 2;
    // Clamp to viewport
    left = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 8));
    let top = rect.top + scrollY - tooltipRect.height - 12;
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
  }

  document.querySelectorAll('a[data-tooltip]').forEach(link => {
    link.addEventListener('mouseenter', showTooltip);
    link.addEventListener('mousemove', positionTooltip);
    link.addEventListener('mouseleave', hideTooltip);
    link.addEventListener('blur', hideTooltip);
  });

  // Also support span[data-tooltip] for fun projects
  document.querySelectorAll('span[data-tooltip]').forEach(link => {
    link.addEventListener('mouseenter', showTooltip);
    link.addEventListener('mousemove', positionTooltip);
    link.addEventListener('mouseleave', hideTooltip);
    link.addEventListener('blur', hideTooltip);
  });
})();

// Tooltip for since-duration (work experience) - dynamic duration calculation
(function() {
  let tooltip;
  let tooltipLabel;
  let tooltipTech;
  let activeSince = null;
  let intervalId = null;
  let backgroundIntervalId = null;

  function parseDate(str) {
    // Accepts MM/YYYY or Mon YYYY or YYYY
    if (/present/i.test(str)) return new Date();
    
    if (/\d{2}\/\d{4}/.test(str)) {
      // MM/YYYY
      const [m, y] = str.split('/').map(Number);
      // Validate month (1-12) and year (reasonable range)
      if (m < 1 || m > 12 || y < 1900 || y > 2100) {
        return null; // Invalid date
      }
      return new Date(y, m - 1, 1);
    }
    
    if (/^[A-Za-z]{3,9} \d{4}$/.test(str)) {
      // e.g. Jan 2025
      const date = new Date(str + ' 01');
      // Check if the date is valid
      if (isNaN(date.getTime()) || date.getFullYear() < 1900 || date.getFullYear() > 2100) {
        return null; // Invalid date
      }
      return date;
    }
    
    if (/^\d{4}$/.test(str)) {
      // e.g. 2023
      const y = Number(str);
      if (y < 1900 || y > 2100) {
        return null; // Invalid year
      }
      return new Date(y, 0, 1);
    }
    
    return null;
  }

  function calculateDuration(startStr, endStr) {
    const start = parseDate(startStr.trim());
    // Always use the current moment for 'Present' to ensure real-time accuracy
    const end = /present/i.test(endStr.trim()) ? new Date() : parseDate(endStr.trim());
    if (!start || !end) return null;
    
    // Calculate the difference in milliseconds for precise calculation
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate years, months, and days more accurately
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    
    // Adjust for negative days
    if (days < 0) {
      months--;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }
    
    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }
    
    // Build the result string
    let result = [];
    if (years > 0) result.push(`${years} year${years > 1 ? 's' : ''}`);
    if (months > 0) result.push(`${months} month${months > 1 ? 's' : ''}`);
    if (days > 0) result.push(`${days} day${days > 1 ? 's' : ''}`);
    if (result.length === 0) result.push('0 days');
    
    return result.join(' ');
  }

  function updateSinceDisplay(el) {
    const range = el.getAttribute('data-since');
    if (!range) return;
    const [start, end] = range.split('-').map(s => s.trim());
    // Only update the display if it's not already showing the correct format
    const currentText = el.textContent.trim();
    const expectedText = `'${start} - ${end}'`;
    if (currentText !== expectedText) {
      el.textContent = expectedText;
    }
  }

  function updateAllSinceDisplays() {
    document.querySelectorAll('.since-duration').forEach(el => {
      const range = el.getAttribute('data-since');
      if (range && /present/i.test(range)) {
        updateSinceDisplay(el);
      }
    });
  }

  function showSinceTooltip(e) {
    const el = e.currentTarget;
    const range = el.getAttribute('data-since');
    if (!range) return;
    const [start, end] = range.split('-').map(s => s.trim());
    
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'custom-tooltip';
      tooltipLabel = document.createElement('span');
      tooltipLabel.className = 'tooltip-label';
      tooltipTech = document.createElement('span');
      tooltipTech.className = 'tooltip-tech';
      tooltip.appendChild(tooltipLabel);
      tooltip.appendChild(tooltipTech);
      document.body.appendChild(tooltip);
    }
    
    tooltipLabel.textContent = 'Duration:';
    
    function updateTooltip() {
      const duration = calculateDuration(start, end);
      if (duration === null) {
        tooltipTech.textContent = 'ERROR: Invalid date format';
      } else {
        tooltipTech.textContent = duration;
      }
    }
    
    updateTooltip();
    tooltip.classList.add('active');
    activeSince = el;
    positionTooltip(e);
    
    // If 'Present', update every second for a live ticking effect
    if (/present/i.test(end)) {
      intervalId = setInterval(updateTooltip, 1000); // update every second
    }
    
    el.classList.add('highlight-since');
  }

  function hideSinceTooltip() {
    if (tooltip) {
      tooltip.classList.remove('active');
      activeSince && activeSince.classList.remove('highlight-since');
      activeSince = null;
    }
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function positionTooltip(e) {
    if (!tooltip || !activeSince) return;
    const rect = activeSince.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;
    const tooltipRect = tooltip.getBoundingClientRect();
    let left = e.clientX - tooltipRect.width / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 8));
    let top = rect.top + scrollY - tooltipRect.height - 12;
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
  }

  // Initialize and start background updates for 'Present' dates
  function initializeSinceUpdates() {
    // Update all 'Present' displays immediately
    updateAllSinceDisplays();
    
    // Set up background interval to update 'Present' displays every 30 seconds
    backgroundIntervalId = setInterval(updateAllSinceDisplays, 30000); // update every 30 seconds
  }

  document.querySelectorAll('.since-duration').forEach(el => {
    el.addEventListener('mouseenter', showSinceTooltip);
    el.addEventListener('mousemove', positionTooltip);
    el.addEventListener('mouseleave', hideSinceTooltip);
    el.addEventListener('blur', hideSinceTooltip);
  });

  // Start the background updates when the page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSinceUpdates);
  } else {
    initializeSinceUpdates();
  }
})();
