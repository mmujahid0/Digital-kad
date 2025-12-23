AOS.init({ duration: 1000, once: true });

// Enhanced Flower Petal Animation with varieties
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let petals = [];

function createPetals() {
    for (let i = 0; i < 35; i++) {
        petals.push({ 
            x: Math.random() * canvas.width, 
            y: Math.random() * canvas.height, 
            r: Math.random() * 5 + 2, 
            d: Math.random() * 1, 
            a: Math.random() * 4,
            opacity: Math.random() * 0.5 + 0.3,
            speed: Math.random() * 0.5 + 0.5
        });
    }
}

function drawPetals() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => { 
        ctx.fillStyle = `rgba(255, 182, 193, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
        ctx.fill();
    });
    updatePetals();
}

function updatePetals() {
    petals.forEach(p => { 
        p.y += Math.cos(p.d) * p.speed + 0.5 + p.r / 2; 
        p.x += Math.sin(p.a) * 1.5; 
        if (p.y > canvas.height) { 
            p.y = -10; 
            p.x = Math.random() * canvas.width; 
        } 
    });
}

setInterval(drawPetals, 35);
createPetals();

// Handle window resize for canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Music toggle control
const musicToggle = document.getElementById('musicToggle');
function updateMusicButton() {
    const audio = document.getElementById('myAudio');
    if (!musicToggle) return;
    musicToggle.textContent = audio && !audio.paused ? '🔊' : '🔈';
}

function toggleAudio() {
    const audio = document.getElementById('myAudio');
    if (!audio) return;
    if (audio.paused) {
        audio.play().catch(() => {});
    } else {
        audio.pause();
    }
    updateMusicButton();
}

if (musicToggle) musicToggle.addEventListener('click', toggleAudio);

// FUNGSI UTAMA BUKA JEMPUTAN
function mulaMajlis() {
    const audio = document.getElementById("myAudio");
    audio.play().catch(e => console.log("Audio blocked"));

    // Buka lock scroll
    document.body.classList.remove('modal-open');

    // Slide overlay ke atas
    const overlay = document.getElementById("overlay");
    overlay.style.transform = "translateY(-100%)";

    // Paparkan kandungan utama
    const mainContent = document.getElementById("main-content");
    setTimeout(() => {
        mainContent.style.display = "block";
        setTimeout(() => {
            mainContent.style.opacity = "1";
            overlay.style.display = "none";
            // reveal music control
            const m = document.getElementById('musicToggle');
            if (m) m.style.display = 'block';
            updateMusicButton();
            AOS.refresh(); // PENTING: Refresh animasi AOS selepas elemen muncul
        }, 100);
    }, 600);
}

// Countdown Logic
const targetDate = new Date("July 12, 2025 11:00:00").getTime();
function updateCountdown(){
    const now = new Date().getTime();
    const gap = targetDate - now;
    if (gap > 0) {
        const d = Math.floor(gap / (86400000));
        const h = Math.floor((gap % 86400000) / 3600000);
        const m = Math.floor((gap % 3600000) / 60000);
        const s = Math.floor((gap % 60000) / 1000);
        document.getElementById("countdown-timer").innerHTML = `
            <p class="countdown-pill">
                <span>${d}</span> Hari &nbsp; <span>${h}</span> Jam &nbsp; <span>${m}</span> Minit &nbsp; <span>${s}</span> Saat
            </p>`;
    } else {
        document.getElementById("countdown-timer").innerHTML = `<p class="countdown-pill">Selamat Pengantin Baru!</p>`;
    }
}
updateCountdown();
setInterval(updateCountdown, 1000);

function toggleGift() {
    const info = document.getElementById("gift-info");
    info.style.display = info.style.display === "none" ? "block" : "none";
}

// Toast helper
function showToast(message, timeout = 2200){
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = message;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('visible'), 20);
    setTimeout(() => { t.classList.remove('visible'); setTimeout(()=>t.remove(),300); }, timeout);
}

// Copy bank account to clipboard with feedback
const copyBtn = document.getElementById('copyBank');
if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        const acc = document.getElementById('bank-acc');
        if (!acc) return;
        const text = acc.textContent.trim();
        navigator.clipboard.writeText(text).then(() => {
            showToast('Nombor akaun disalin');
        }).catch(() => alert('Gagal menyalin'));
    });
}

// Generate simple ICS file for Add to Calendar
function generateICS(e) {
    e.preventDefault();
    const start = new Date('2025-07-12T11:00:00');
    const end = new Date('2025-07-12T16:00:00');
    function formatDate(d){
        return d.toISOString().replace(/-|:|\.\d{3}/g,'');
    }
    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//WanaJahidWedding//EN',
        'BEGIN:VEVENT',
        `UID:${Date.now()}@wanajahid`,
        `DTSTAMP:${formatDate(new Date())}`,
        `DTSTART:${formatDate(start)}`,
        `DTEND:${formatDate(end)}`,
        'SUMMARY:Walimatulurus Wana & Jahid',
        'LOCATION:Dewan Banquet Putrajaya, Presint 3',
        'DESCRIPTION:Kami menjemput anda ke majlis perkahwinan kami.',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Wana-Jahid-Wedding.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

// Keyboard accessibility: toggle audio with Enter/Space when focused; 'm' shortcut when not typing
if (musicToggle) {
    musicToggle.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleAudio(); }
    });
}
document.addEventListener('keydown', e => {
    const active = document.activeElement;
    const typing = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT');
    if (typing) return;
    if (e.key.toLowerCase() === 'm') toggleAudio();
});

// WhatsApp Share functionality
const shareBtn = document.getElementById('shareBtn');
if (shareBtn) {
    shareBtn.addEventListener('click', () => {
        const text = encodeURIComponent('Saya diundang ke Walimatulurus Wana & Jahid! 💍 Sabtu, 12 Julai 2025 di Dewan Banquet Putrajaya. Datang bersama saya! ');
        const url = window.location.href;
        const waURL = `https://wa.me/?text=${text}${encodeURIComponent(url)}`;
        window.open(waURL, '_blank');
    });
}

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
let isDarkMode = localStorage.getItem('darkMode') === 'true';

function applyDarkMode() {
    if (isDarkMode) {
        document.documentElement.style.setProperty('--cream', '#1a1a1a');
        document.documentElement.style.setProperty('--ivory', '#242424');
        document.documentElement.style.setProperty('--dark', '#e0e0e0');
        document.documentElement.style.setProperty('--light-accent', '#444');
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    } else {
        document.documentElement.style.setProperty('--cream', '#FBF8F3');
        document.documentElement.style.setProperty('--ivory', '#F5F1EB');
        document.documentElement.style.setProperty('--dark', '#2C2C2C');
        document.documentElement.style.setProperty('--light-accent', '#E8DCC8');
        document.body.classList.remove('dark-mode');
        darkModeToggle.textContent = '🌙';
    }
}

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        localStorage.setItem('darkMode', isDarkMode);
        applyDarkMode();
    });
}

applyDarkMode();

// Confetti Animation
function createConfetti() {
    const container = document.getElementById('confetti-container');
    const confettiPieces = 50;
    for (let i = 0; i < confettiPieces; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = ['#D4AF8E', '#C9A876', '#FFE8D6', '#fff'][Math.floor(Math.random() * 4)];
        confetti.style.animationDelay = Math.random() * 0.3 + 's';
        container.appendChild(confetti);
    }
    setTimeout(() => container.innerHTML = '', 3000);
}

// Back to Top button behavior (footer)
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Floating Action Buttons: Contact, Location, Directions, Gallery

const fabRSVP = document.getElementById('fabRSVP');
const fabContact = document.getElementById('fabContact');
const fabLocation = document.getElementById('fabLocation');
const fabGallery = document.getElementById('fabGallery');

if (fabRSVP) {
    fabRSVP.addEventListener('click', () => {
        const rsvp = document.getElementById('rsvp-form');
        if (rsvp) {
            rsvp.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const first = rsvp.querySelector('input, select, textarea, button');
            if (first) first.focus();
        }
    });
}

if (fabContact) {
    fabContact.addEventListener('click', () => {
        const contact = document.getElementById('contact-section');
        if (contact) {
            contact.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const first = contact.querySelector('a, button, input');
            if (first) first.focus();
        } else {
            window.open('https://wa.me/60112345678?text=Assalamualaikum', '_blank');
        }
    });
}

if (fabLocation) {
    fabLocation.addEventListener('click', () => {
        const loc = document.getElementById('location-section');
        if (loc) {
            loc.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            window.open('LINK_MAPS', '_blank');
        }
    });
}

// 'Arah' (directions) FAB removed — use Location (Google Maps) or Waze links in the location section.

if (fabGallery) {
    fabGallery.addEventListener('click', () => {
        const gallery = document.querySelector('.gallery-grid');
        if (gallery) gallery.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

// RSVP Form
const scriptURL = 'PASTE_URL_WEB_APP_GOOGLE_SCRIPT_ANDA';
const form = document.getElementById('rsvp-form');
form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.innerHTML = "Menghantar...";
    btn.disabled = true;
    // If scriptURL is not configured, fallback to localStorage
    if (scriptURL === 'PASTE_URL_WEB_APP_GOOGLE_SCRIPT_ANDA') {
        const data = Object.fromEntries(new FormData(form).entries());
        const existing = JSON.parse(localStorage.getItem('rsvps') || '[]');
        existing.push({ ...data, created: new Date().toISOString() });
        localStorage.setItem('rsvps', JSON.stringify(existing));
        form.reset();
        showToast('RSVP disimpan secara tempatan');
        document.getElementById('success-msg').textContent = 'Terima kasih! RSVP disimpan. 🎉';
        document.getElementById('success-msg').style.display = 'block';
        createConfetti();
        return;
    }

    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => {
        form.style.display = 'none';
        document.getElementById('success-msg').style.display = 'block';
        createConfetti();
    })
    .catch(error => {
        alert('Ralat!');
        btn.innerHTML = "HANTAR RSVP";
        btn.disabled = false;
    });
});