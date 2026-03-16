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

// Tooltip only for Resume to Download — shows filename on hover
(function() {
  let tooltip = null;
  let activeLink = null;

  function showTooltip(e) {
    const link = e.currentTarget;
    const text = link.getAttribute('data-tooltip');
    if (!text) return;
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'custom-tooltip';
      const tooltipLabel = document.createElement('span');
      tooltipLabel.className = 'tooltip-label';
      const tooltipTech = document.createElement('span');
      tooltipTech.className = 'tooltip-tech';
      tooltip.appendChild(tooltipLabel);
      tooltip.appendChild(tooltipTech);
      document.body.appendChild(tooltip);
    }
    tooltip.querySelector('.tooltip-label').textContent = '';
    tooltip.querySelector('.tooltip-tech').textContent = text;
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
    const tooltipRect = tooltip.getBoundingClientRect();
    let left = e.clientX - tooltipRect.width / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 8));
    const top = rect.top + scrollY - tooltipRect.height - 12;
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
  }

  // Only attach tooltip on desktop (resume link inside .for-desktop)
  document.querySelectorAll('.for-desktop a.resume-download-btn').forEach(link => {
    link.addEventListener('mouseenter', showTooltip);
    link.addEventListener('mousemove', positionTooltip);
    link.addEventListener('mouseleave', hideTooltip);
    link.addEventListener('blur', hideTooltip);
  });
})();

// Work experience: keeps "since" dates (e.g. Present) in sync — no tooltip, no duration
(function() {
  let backgroundIntervalId = null;

  function parseDate(str) {
    if (/present/i.test(str)) return new Date();
    
    if (/\d{2}\/\d{4}/.test(str)) {
      const [m, y] = str.split('/').map(Number);
      if (m < 1 || m > 12 || y < 1900 || y > 2100) {
        return null;
      }
      return new Date(y, m - 1, 1);
    }
    
    if (/^[A-Za-z]{3,9} \d{4}$/.test(str)) {
      const date = new Date(str + ' 01');
      if (isNaN(date.getTime()) || date.getFullYear() < 1900 || date.getFullYear() > 2100) {
        return null;
      }
      return date;
    }
    
    if (/^\d{4}$/.test(str)) {
      const y = Number(str);
      if (y < 1900 || y > 2100) {
        return null;
      }
      return new Date(y, 0, 1);
    }
    
    return null;
  }

  function updateSinceDisplay(el) {
    const range = el.getAttribute('data-since');
    if (!range) return;
    const [start, end] = range.split('-').map(s => s.trim());
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

  function initializeSinceUpdates() {
    updateAllSinceDisplays();
    backgroundIntervalId = setInterval(updateAllSinceDisplays, 30000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSinceUpdates);
  } else {
    initializeSinceUpdates();
  }
})();
