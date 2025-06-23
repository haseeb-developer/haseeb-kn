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

document.addEventListener('DOMContentLoaded', function() {
  // Light/Dark mode toggle
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const LIGHT_CLASS = 'light-mode';

  // Set initial mode from localStorage
  if (localStorage.getItem('theme') === 'light') {
    body.classList.add(LIGHT_CLASS);
    themeToggle.textContent = '☀️';
  }

  themeToggle.addEventListener('click', function() {
    body.classList.toggle(LIGHT_CLASS);
    const isLight = body.classList.contains(LIGHT_CLASS);
    themeToggle.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });

  // Prepare for future enhancements (scroll reveal, etc.)
});
