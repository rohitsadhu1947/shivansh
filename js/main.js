/* ========================================
   ShivAnsh Events - Premium Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- Header Scroll ----------
    const header = document.getElementById('header');
    const onScroll = () => header.classList.toggle('scrolled', scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ---------- Mobile Nav ----------
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        menu.classList.toggle('open');
    });

    menu.querySelectorAll('.nav__link').forEach(link =>
        link.addEventListener('click', () => {
            toggle.classList.remove('open');
            menu.classList.remove('open');
        })
    );

    // ---------- Smooth Scroll ----------
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---------- Scroll Reveal ----------
    const reveals = document.querySelectorAll('.reveal-el');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => revealObserver.observe(el));

    // ---------- Counter Animation ----------
    const counters = document.querySelectorAll('.ribbon__number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target, parseInt(entry.target.dataset.count));
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    function animateCount(el, target) {
        const dur = 2000;
        const start = performance.now();
        (function tick(now) {
            const p = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(ease * target);
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target;
        })(start);
    }

    // ---------- Form (Formspree Integration) ----------
    const form = document.getElementById('inquiryForm');
    const success = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            form.querySelectorAll('.form__input').forEach(el => el.classList.remove('error'));

            // Client-side validation
            let valid = true;
            const fields = ['name', 'phone', 'email', 'eventType', 'message'];
            fields.forEach(id => {
                const el = document.getElementById(id);
                if (!el.value.trim()) { el.classList.add('error'); valid = false; }
            });

            const email = document.getElementById('email');
            if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                email.classList.add('error');
                valid = false;
            }

            if (!valid) return;

            // Show loading
            submitBtn.querySelector('.btn__text').textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Submit to Formspree
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    form.style.display = 'none';
                    success.style.display = 'block';
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (err) {
                // Fallback: open WhatsApp with form data
                const data = new FormData(form);
                const eventSelect = document.getElementById('eventType');
                const eventLabel = eventSelect.options[eventSelect.selectedIndex].text;
                const msg = encodeURIComponent(
                    `Hi ShivAnsh Events!\n\nName: ${data.get('name')}\nPhone: ${data.get('phone')}\nEmail: ${data.get('email')}\nEvent: ${eventLabel}\nDate: ${data.get('eventDate') || 'TBD'}\n\n${data.get('message')}`
                );
                window.open(`https://wa.me/919810009082?text=${msg}`, '_blank');
                form.style.display = 'none';
                success.style.display = 'block';
            }
        });
    }

    window.resetForm = function () {
        form.reset();
        form.style.display = 'block';
        success.style.display = 'none';
        submitBtn.querySelector('.btn__text').textContent = 'Send Inquiry';
        submitBtn.disabled = false;
    };
});
