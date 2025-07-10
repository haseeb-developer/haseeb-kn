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

// === Premium Divine Cursor ===
(function() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let dotX = mouseX, dotY = mouseY;
  let ringX = mouseX, ringY = mouseY;
  let isHover = false;
  let isClick = false;

  // Smooth trailing for dot and ring
  function animate() {
    dotX += (mouseX - dotX) * 0.32;
    dotY += (mouseY - dotY) * 0.32;
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    dot.style.transform = `translate(${dotX - 5}px, ${dotY - 5}px)`;
    ring.style.transform = `translate(${ringX - 22}px, ${ringY - 22}px)`;
    requestAnimationFrame(animate);
  }
  animate();

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Hover effect on interactive elements
  const hoverables = document.querySelectorAll('a, button, .social-links, .resume-download-btn, input, textarea, select');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('cursor-hover');
      ring.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('cursor-hover');
      ring.classList.remove('cursor-hover');
    });
  });

  // Hide on touch devices
  window.addEventListener('touchstart', () => {
    dot.style.display = 'none';
    ring.style.display = 'none';
  }, { once: true });
})();
