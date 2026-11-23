document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', open);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        nav.classList.remove('open'); toggle.classList.remove('open');
    }));

    // Testimonials slider
    const track = document.getElementById('sliderTrack');
    const slides = [...track.children];
    const dots = document.getElementById('dots');
    let current = 0, timer;

    slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.setAttribute('aria-label', 'Slide ' + (i + 1));
        b.addEventListener('click', () => { go(i); restart(); });
        dots.appendChild(b);
    });

    function go(i) {
        current = (i + slides.length) % slides.length;
        const n = slides.length;
        const step = slides[0].offsetWidth + 40;
        track.style.height = Math.max(...slides.map(s => s.scrollHeight)) + 'px';
        slides.forEach((el, idx) => {
            // relative position wrapped so active is centre, others sit left/right
            let d = ((idx - current) % n + n) % n;
            if (d > n / 2) d -= n;
            el.style.transform = `translateX(${d * step}px)`;
            el.style.visibility = Math.abs(d) > 1 ? 'hidden' : 'visible';
            el.classList.toggle('active', d === 0);
        });
        [...dots.children].forEach((d, n) => d.classList.toggle('active', n === current));
    }
    function restart() { clearInterval(timer); timer = setInterval(() => go(current + 1), 5000); }
    window.addEventListener('resize', () => go(current));
    go(0); restart();

    // Form validation
    const form = document.getElementById('callbackForm');
    const msg = document.getElementById('formMsg');
    form.addEventListener('submit', e => {
        e.preventDefault();
        let valid = true;
        form.querySelectorAll('input[required]').forEach(inp => {
            const ok = inp.type === 'checkbox' ? inp.checked
                : inp.type === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value)
                : inp.value.trim() !== '';
            inp.closest('.field')?.classList.toggle('error', !ok);
            if (!ok) valid = false;
        });
        msg.className = 'form-msg ' + (valid ? 'ok' : 'err');
        msg.textContent = valid ? 'Thank you! We will get back to you shortly.' : 'Please fill all required fields and accept consent.';
        if (valid) form.reset();
    });
});

