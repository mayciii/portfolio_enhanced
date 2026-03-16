/* ══════════════════════════════════════════════════════
   PORTFOLIO — script.js
   Enhanced: skill bars, cert animations, form validation,
             active nav, tilt, parallax, cursor glow
   ══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ─── JS READY FLAG (enables CSS reveal hiding) ─── */
    document.body.classList.add('js-ready');

    /* ─── HERO: always visible on load ─── */
    document.querySelectorAll('.hero.reveal').forEach(el => el.classList.add('visible'));

    /* ══════════════════════════════════════
       TYPING ANIMATION
       ══════════════════════════════════════ */
    const typingEl = document.querySelector('.typing');
    if (typingEl) {
        const fullText = typingEl.textContent.trim();
        typingEl.textContent = '';
        let i = 0;
        const type = () => {
            if (i < fullText.length) {
                typingEl.textContent += fullText.charAt(i++);
                setTimeout(type, 75 + Math.random() * 45);
            }
        };
        setTimeout(type, 700);
    }

    /* ══════════════════════════════════════
       INTERSECTION OBSERVER — REVEAL
       ══════════════════════════════════════ */
    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ══════════════════════════════════════
       STAGGER CHILDREN (skills, projects, certs)
       ══════════════════════════════════════ */
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const children = entry.target.querySelectorAll(
                '.skill-card, .project-card, .cert-card'
            );
            children.forEach((child, i) => {
                child.style.opacity = '0';
                child.style.transform = 'translateY(28px)';
                setTimeout(() => {
                    child.style.transition = `opacity 520ms cubic-bezier(.25,.46,.45,.94) ${i * 70}ms, transform 520ms cubic-bezier(.25,.46,.45,.94) ${i * 70}ms`;
                    child.style.opacity = '1';
                    child.style.transform = 'none';
                }, 60);
            });
            staggerObserver.unobserve(entry.target);
        });
    }, { threshold: 0.04 });

    document.querySelectorAll('.skills-grid, .projects-grid, .certificates-grid')
        .forEach(g => staggerObserver.observe(g));

    /* ══════════════════════════════════════
       SKILL BAR ANIMATION
       Animate width when bars enter viewport
       ══════════════════════════════════════ */
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.querySelectorAll('.skill-bar-fill').forEach((bar, i) => {
                const targetWidth = bar.style.getPropertyValue('--level') || '0%';
                // Reset to 0, then animate to target after a small delay
                bar.style.setProperty('--level', '0%');
                setTimeout(() => {
                    bar.style.transition = `width 1.1s cubic-bezier(.25,.46,.45,.94) ${i * 80}ms`;
                    bar.style.setProperty('--level', targetWidth);
                }, 100 + i * 80);
            });
            barObserver.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.skills-grid').forEach(g => barObserver.observe(g));

    /* ══════════════════════════════════════
       STICKY NAVBAR SHRINK
       ══════════════════════════════════════ */
    const navbar = document.querySelector('.navbar');
    const handleScroll = () => {
        if (!navbar) return;
        navbar.classList.toggle('shrink', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    /* ══════════════════════════════════════
       SMOOTH SCROLL + MOBILE NAV CLOSE
       ══════════════════════════════════════ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Close mobile nav if open
            const navMenu = document.getElementById('navMenu');
            const toggle  = document.querySelector('.nav-toggle');
            if (navMenu?.classList.contains('open')) {
                navMenu.classList.remove('open');
                toggle?.setAttribute('aria-expanded', 'false');
            }
        });
    });

    /* ══════════════════════════════════════
       MOBILE NAV TOGGLE
       ══════════════════════════════════════ */
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu   = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!navbar?.contains(e.target) && navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ══════════════════════════════════════
       ACTIVE NAV LINK ON SCROLL
       ══════════════════════════════════════ */
    const sections = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-menu a');
    const activeLinkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(a => a.classList.remove('active'));
                const link = document.querySelector(`.nav-menu a[href="#${entry.target.id}"]`);
                if (link) link.classList.add('active');
            }
        });
    }, { threshold: 0.35 });
    sections.forEach(s => activeLinkObserver.observe(s));

    /* ══════════════════════════════════════
       SKILL CARD 3D TILT
       ══════════════════════════════════════ */
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width  - 0.5;
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
            card.style.transform = `perspective(420px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateY(-5px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    /* ══════════════════════════════════════
       PROJECT CARD PARALLAX MEDIA
       ══════════════════════════════════════ */
    document.querySelectorAll('.project-card').forEach(card => {
        const media = card.querySelector('.project-media');
        if (!media) return;
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top)  / rect.height;
            media.style.backgroundPosition = `${x * 20}% ${y * 20}%`;
        });
        card.addEventListener('mouseleave', () => {
            media.style.backgroundPosition = '';
        });
    });

    /* ══════════════════════════════════════
       CERTIFICATE CARD TILT
       ══════════════════════════════════════ */
    document.querySelectorAll('.cert-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width  - 0.5;
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
            card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    /* ══════════════════════════════════════
       CONTACT FORM — Validation + Submit
       ══════════════════════════════════════ */
    const contactForm = document.getElementById('contactForm');

    function showFieldError(fieldName, message) {
        const el = contactForm.querySelector(`.form-error[data-field="${fieldName}"]`);
        if (el) el.textContent = message;
    }
    function clearErrors() {
        contactForm.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    }
    function validateForm(payload) {
        let valid = true;
        clearErrors();
        if (!payload.name || payload.name.length < 2) {
            showFieldError('name', 'Please enter your name (at least 2 characters).');
            valid = false;
        }
        const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!payload.email || !emailRx.test(payload.email)) {
            showFieldError('email', 'Please enter a valid email address.');
            valid = false;
        }
        if (!payload.message || payload.message.length < 10) {
            showFieldError('message', 'Message must be at least 10 characters.');
            valid = false;
        }
        return valid;
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const formData = new FormData(this);
            const payload = {
                name:    (formData.get('name')    || '').trim(),
                email:   (formData.get('email')   || '').trim(),
                subject: (formData.get('subject') || '').trim(),
                message: (formData.get('message') || '').trim(),
            };

            if (!validateForm(payload)) return;

            const originalHTML = btn.innerHTML;
            btn.innerHTML = 'Sending… <span class="btn-arrow">⟳</span>';
            btn.disabled  = true;

            try {
                const res    = await fetch('/api/contact', {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify(payload),
                });
                const result = await res.json();

                if (res.ok && result.success) {
                    const userNameEl = document.getElementById('userName');
                    if (userNameEl) userNameEl.textContent = payload.name;
                    document.getElementById('successModal')?.classList.add('active');
                    this.reset();
                    clearErrors();
                } else {
                    // Show server-side field errors if present
                    if (result.errors) {
                        Object.entries(result.errors).forEach(([field, msg]) => showFieldError(field, msg));
                    } else {
                        alert(result.error || 'Failed to send message. Please try again.');
                    }
                }
            } catch (err) {
                console.error(err);
                alert('Network error. Please check your connection and try again.');
            } finally {
                btn.innerHTML = originalHTML;
                btn.disabled  = false;
            }
        });

        // Live clear errors on input
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                const fieldName = input.name;
                const errorEl   = contactForm.querySelector(`.form-error[data-field="${fieldName}"]`);
                if (errorEl) errorEl.textContent = '';
            });
        });
    }

    /* ══════════════════════════════════════
       MODAL — close handlers
       ══════════════════════════════════════ */
    const modal = document.getElementById('successModal');
    if (modal) {
        const hide = () => {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
        };
        document.getElementById('modalClose')?.addEventListener('click', hide);
        document.getElementById('modalOk')?.addEventListener('click', hide);
        modal.addEventListener('click', (e) => { if (e.target === modal) hide(); });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) hide();
        });
    }

    /* ══════════════════════════════════════
       CURSOR GLOW (desktop / pointer devices only)
       ══════════════════════════════════════ */
    if (window.matchMedia('(pointer: fine)').matches) {
        const glow = document.createElement('div');
        glow.style.cssText = `
            position: fixed;
            width: 340px; height: 340px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(108,99,255,0.065) 0%, transparent 70%);
            pointer-events: none;
            z-index: 0;
            transform: translate(-50%, -50%);
            transition: left 130ms linear, top 130ms linear;
            will-change: left, top;
        `;
        document.body.appendChild(glow);
        window.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top  = e.clientY + 'px';
        }, { passive: true });
    }

});
