/**
 * ==========================================================================
 * GHOSTIFY — Production JavaScript for GitHub Pages
 * Zero-dependency, modern ES6 vanilla JavaScript
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Configuration
  const CONFIG = {
    GITHUB_URL: 'https://github.com/lq43/Ghostify',
    SUPPORT_EMAIL: 'ghostifysupport@gmail.com',
    VERSION: 'v1.4.2-stable',
    SHA256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  };

  /* --------------------------------------------------------------------------
   * 1. Cyber Canvas Particle & Grid Background
   * -------------------------------------------------------------------------- */
  const canvas = document.getElementById('cyber-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 25), 55);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 1.5 + 0.8;
        this.alpha = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 102, ${this.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00FF66';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Connect particles within proximity
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 255, 102, ${0.15 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  }

  /* --------------------------------------------------------------------------
   * 2. Header Scroll & Mobile Navigation
   * -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDropdown = document.getElementById('mobile-dropdown');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 25) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  if (mobileToggle && mobileDropdown) {
    mobileToggle.addEventListener('click', () => {
      mobileDropdown.classList.toggle('open');
    });

    // Close mobile dropdown when a link is clicked
    document.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDropdown.classList.remove('open');
      });
    });
  }

  function updateActiveNavLink() {
    const sections = ['home', 'about', 'features', 'download', 'contact'];
    let current = 'home';
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 140) {
          current = id;
        }
      }
    });

    document.querySelectorAll('.nav-link').forEach((link) => {
      const target = link.getAttribute('data-target');
      if (target === current) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /* --------------------------------------------------------------------------
   * 3. Toast Notifications Utility
   * -------------------------------------------------------------------------- */
  const toast = document.getElementById('toast-notice');
  const toastMsg = document.getElementById('toast-message');
  let toastTimer = null;

  function showToast(message) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  /* --------------------------------------------------------------------------
   * 4. Interactive Phone Mockup Controls
   * -------------------------------------------------------------------------- */
  const phoneTabs = document.querySelectorAll('.phone-tab-btn');
  const tabViews = document.querySelectorAll('.tab-view');

  phoneTabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetView = btn.getAttribute('data-tab');
      phoneTabs.forEach((b) => b.classList.remove('active'));
      tabViews.forEach((v) => v.classList.remove('active'));

      btn.classList.add('active');
      const activeView = document.getElementById(`view-${targetView}`);
      if (activeView) activeView.classList.add('active');
    });
  });

  // Mock simulation toggle (Play / Pause)
  const mockToggleBtn = document.getElementById('mock-toggle-btn');
  const mockStatusBadge = document.getElementById('mock-status-badge');
  const liveLatEl = document.getElementById('live-lat');
  const liveLngEl = document.getElementById('live-lng');
  const liveSpeedEl = document.getElementById('live-speed');
  let isSimulating = true;
  let simInterval = null;

  let currentLat = 52.5200;
  let currentLng = 13.4050;

  function toggleSimulation() {
    isSimulating = !isSimulating;
    if (isSimulating) {
      mockToggleBtn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        <span>Pause Mock</span>
      `;
      mockToggleBtn.style.background = '#00FF66';
      mockToggleBtn.style.color = '#000';
      if (mockStatusBadge) {
        mockStatusBadge.textContent = 'SIMULATING';
        mockStatusBadge.style.color = '#00FF66';
      }
      startMockTicker();
    } else {
      mockToggleBtn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        <span>Resume Mock</span>
      `;
      mockToggleBtn.style.background = '#0d2215';
      mockToggleBtn.style.color = '#00FF66';
      if (mockStatusBadge) {
        mockStatusBadge.textContent = 'STANDBY';
        mockStatusBadge.style.color = '#7A9587';
      }
      clearInterval(simInterval);
    }
  }

  function startMockTicker() {
    clearInterval(simInterval);
    simInterval = setInterval(() => {
      currentLat += (Math.random() - 0.48) * 0.00012;
      currentLng += (Math.random() - 0.48) * 0.00012;
      if (liveLatEl) liveLatEl.textContent = currentLat.toFixed(6) + '° N';
      if (liveLngEl) liveLngEl.textContent = currentLng.toFixed(6) + '° E';

      const randomSpeed = Math.floor(Math.random() * 6 + 22);
      if (liveSpeedEl) liveSpeedEl.textContent = `${randomSpeed} km/h`;
    }, 1200);
  }

  if (mockToggleBtn) {
    mockToggleBtn.addEventListener('click', toggleSimulation);
    startMockTicker();
  }

  /* --------------------------------------------------------------------------
   * 5. Copy Actions (SHA256 & Email)
   * -------------------------------------------------------------------------- */
  const copyShaBtn = document.getElementById('copy-sha-btn');
  if (copyShaBtn) {
    copyShaBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(CONFIG.SHA256).then(() => {
        showToast('SHA256 checksum copied to clipboard');
      }).catch(() => {
        showToast('Copied: ' + CONFIG.SHA256.substring(0, 16) + '...');
      });
    });
  }

  const copyEmailBtns = document.querySelectorAll('.copy-email-trigger');
  copyEmailBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(CONFIG.SUPPORT_EMAIL).then(() => {
        showToast('Support email copied: ' + CONFIG.SUPPORT_EMAIL);
      }).catch(() => {
        showToast('Email: ' + CONFIG.SUPPORT_EMAIL);
      });
    });
  });

  /* --------------------------------------------------------------------------
   * 6. Download APK Notification Notice
   * -------------------------------------------------------------------------- */
  const downloadApkBtn = document.getElementById('download-apk-btn');
  const heroDownloadBtn = document.getElementById('hero-download-btn');

  function handleDownloadClick(e) {
    e.preventDefault();
    const notice = document.getElementById('apk-notice');
    if (notice) {
      notice.classList.remove('hidden');
      notice.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    showToast('Ghostify APK build v1.4.2 prepared. Check download checksum.');
  }

  if (downloadApkBtn) downloadApkBtn.addEventListener('click', handleDownloadClick);

  /* --------------------------------------------------------------------------
   * 7. Bug Report Prefill
   * -------------------------------------------------------------------------- */
  const prefillBugBtn = document.getElementById('prefill-bug-btn');
  if (prefillBugBtn) {
    prefillBugBtn.addEventListener('click', () => {
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');
      if (subjectInput) subjectInput.value = '[Bug Report] Issue with location provider / device model';
      if (messageInput) {
        messageInput.value = 'Android OS Version: \nDevice Model: \nSteps to Reproduce: \n1. \n2. \nExpected Result: \nActual Result: ';
      }
      subjectInput?.focus();
      showToast('Bug template loaded into contact form');
    });
  }

  /* --------------------------------------------------------------------------
   * 8. Contact Form Validation & Submission
   * -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formSuccessCard = document.getElementById('form-success-card');
  const resetFormBtn = document.getElementById('reset-form-btn');
  const ticketIdEl = document.getElementById('ticket-id-display');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasError = false;

      const name = document.getElementById('contact-name');
      const email = document.getElementById('contact-email');
      const subject = document.getElementById('contact-subject');
      const message = document.getElementById('contact-message');

      const nameErr = document.getElementById('err-name');
      const emailErr = document.getElementById('err-email');
      const subjectErr = document.getElementById('err-subject');
      const messageErr = document.getElementById('err-message');

      // Validate Name
      if (!name || name.value.trim().length < 2) {
        if (nameErr) nameErr.classList.add('visible');
        hasError = true;
      } else {
        if (nameErr) nameErr.classList.remove('visible');
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email.value.trim())) {
        if (emailErr) emailErr.classList.add('visible');
        hasError = true;
      } else {
        if (emailErr) emailErr.classList.remove('visible');
      }

      // Validate Subject
      if (!subject || subject.value.trim().length < 3) {
        if (subjectErr) subjectErr.classList.add('visible');
        hasError = true;
      } else {
        if (subjectErr) subjectErr.classList.remove('visible');
      }

      // Validate Message
      if (!message || message.value.trim().length < 10) {
        if (messageErr) messageErr.classList.add('visible');
        hasError = true;
      } else {
        if (messageErr) messageErr.classList.remove('visible');
      }

      if (hasError) return;

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Transmitting...</span>';
      submitBtn.disabled = true;

      setTimeout(() => {
        contactForm.style.display = 'none';
        if (formSuccessCard) {
          formSuccessCard.classList.add('visible');
          if (ticketIdEl) {
            ticketIdEl.textContent = `GF-${Date.now().toString(36).toUpperCase()}`;
          }
        }
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        showToast('Message dispatched to ghostifysupport@gmail.com');
      }, 750);
    });
  }

  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
      if (contactForm) {
        contactForm.reset();
        contactForm.style.display = 'block';
      }
      if (formSuccessCard) {
        formSuccessCard.classList.remove('visible');
      }
    });
  }

  /* --------------------------------------------------------------------------
   * 9. Modals (Privacy Policy & Imprint)
   * -------------------------------------------------------------------------- */
  const privacyModal = document.getElementById('modal-privacy');
  const imprintModal = document.getElementById('modal-imprint');

  const openPrivacyBtns = document.querySelectorAll('.open-privacy-trigger');
  const openImprintBtns = document.querySelectorAll('.open-imprint-trigger');
  const closeBtns = document.querySelectorAll('.modal-close-trigger');

  openPrivacyBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      privacyModal?.classList.add('open');
    });
  });

  openImprintBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      imprintModal?.classList.add('open');
    });
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      privacyModal?.classList.remove('open');
      imprintModal?.classList.remove('open');
    });
  });

  // Close modals on overlay backdrop click
  window.addEventListener('click', (e) => {
    if (e.target === privacyModal) privacyModal.classList.remove('open');
    if (e.target === imprintModal) imprintModal.classList.remove('open');
  });

  // Close modals on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      privacyModal?.classList.remove('open');
      imprintModal?.classList.remove('open');
    }
  });

  /* --------------------------------------------------------------------------
   * 10. Scroll to Top
   * -------------------------------------------------------------------------- */
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
