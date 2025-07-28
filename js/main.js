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

// Tooltip system (shared for both types)
(function() {
  let tooltip = null;
  let tooltipLabel = null;
  let tooltipTech = null;
  let activeElement = null;
  let intervalId = null;

  function ensureTooltip() {
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
  }

  // --- Portfolio Tooltip ---
  function showTooltip(e) {
    const link = e.currentTarget;
    const text = link.getAttribute('data-tooltip');
    if (!text) return;
    let label = '';
    let tech = text;
    if (text.startsWith('Developed in:')) {
      label = 'Developed in:';
      tech = text.replace(/^Developed in:\s*/i, '');
    }
    ensureTooltip();
    tooltipLabel.textContent = label;
    tooltipTech.textContent = tech;
    tooltip.classList.add('active');
    activeElement = link;
    positionTooltip(e, link);
  }

  function hideTooltip() {
    if (tooltip) {
      tooltip.classList.remove('active');
      activeElement = null;
    }
  }

  function positionTooltip(e, el) {
    if (!tooltip || !el) return;
    // Make tooltip visible but hidden to measure size
    tooltip.style.visibility = 'hidden';
    tooltip.style.display = 'block';
    const tooltipRect = tooltip.getBoundingClientRect();
    tooltip.style.visibility = '';
    tooltip.style.display = '';
    const rect = el.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    let left = e.clientX - tooltipRect.width / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 8));
    let top = rect.top + scrollY - tooltipRect.height - 12;
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
  }

  document.querySelectorAll('a[data-tooltip], span[data-tooltip]').forEach(link => {
    link.addEventListener('mouseenter', showTooltip);
    link.addEventListener('mousemove', function(e) { positionTooltip(e, link); });
    link.addEventListener('mouseleave', hideTooltip);
    link.addEventListener('blur', hideTooltip);
  });

  // --- Since-duration Tooltip ---
  function parseDate(str) {
    if (/present/i.test(str)) return new Date();
    if (/\d{2}\/\d{4}/.test(str)) {
      const [m, y] = str.split('/').map(Number);
      if (m < 1 || m > 12) return null;
      return new Date(y, m - 1, 1);
    }
    if (/^[A-Za-z]{3,9} \d{4}$/.test(str)) {
      return new Date(str + ' 01');
    }
    if (/^\d{4}$/.test(str)) {
      return new Date(Number(str), 0, 1);
    }
    return null;
  }

  function calculateDuration(startStr, endStr) {
    const start = parseDate(startStr.trim());
    const end = /present/i.test(endStr.trim()) ? new Date() : parseDate(endStr.trim());
    if (!start || !end) return null;
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    if (days < 0) {
      months--;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    let result = [];
    if (years > 0) result.push(`${years} year${years > 1 ? 's' : ''}`);
    if (months > 0) result.push(`${months} month${months > 1 ? 's' : ''}`);
    if (days > 0) result.push(`${days} day${days > 1 ? 's' : ''}`);
    if (result.length === 0) result.push('0 days');
    return result.join(' ');
  }

  function showSinceTooltip(e) {
    const el = e.currentTarget;
    const range = el.getAttribute('data-since');
    if (!range) return;
    const [start, end] = range.split('-').map(s => s.trim());
    ensureTooltip();
    tooltipLabel.textContent = 'Duration:';
    function updateTooltip() {
      const duration = calculateDuration(start, end);
      tooltipTech.textContent = duration === null ? 'ERROR! Please check the date format.' : duration;
    }
    updateTooltip();
    tooltip.classList.add('active');
    activeElement = el;
    positionTooltip(e, el);
    if (/present/i.test(end)) {
      intervalId = setInterval(updateTooltip, 1000);
    }
    el.classList.add('highlight-since');
  }

  function hideSinceTooltip() {
    if (tooltip) {
      tooltip.classList.remove('active');
      activeElement && activeElement.classList.remove('highlight-since');
      activeElement = null;
    }
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  document.querySelectorAll('.since-duration').forEach(el => {
    el.addEventListener('mouseenter', showSinceTooltip);
    el.addEventListener('mousemove', function(e) { positionTooltip(e, el); });
    el.addEventListener('mouseleave', hideSinceTooltip);
    el.addEventListener('blur', hideSinceTooltip);
  });
})();
