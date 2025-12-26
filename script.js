AOS.init({ duration: 1000, once: true });

// Initialize Swiper Gallery
const gallerySwiper = new Swiper('.wedding-gallery', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.wedding-gallery .swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.wedding-gallery .swiper-button-next',
        prevEl: '.wedding-gallery .swiper-button-prev',
    },
    effect: 'fade',
    fadeEffect: {
        crossFade: true,
    },
    responsive: {
        640: {
            slidesPerView: 1,
        },
    },
});

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
            // Switch body background to main wedding background after opening
            document.body.style.background = "url('img/wedding-bg.png') center/cover fixed no-repeat";
            // reveal music control
            const m = document.getElementById('musicToggle');
            if (m) m.style.display = 'block';
            updateMusicButton();
            AOS.refresh(); // PENTING: Refresh animasi AOS selepas elemen muncul
        }, 100);
    }, 600);
}

// Countdown Logic — separate boxes for days/hours/minutes/seconds (target: 31 May 2026 11:00)
const targetDate = new Date('2026-05-31T11:00:00').getTime();
function updateCountdown(){
    const now = Date.now();
    const gap = targetDate - now;
    const el = document.getElementById('countdown-timer');
    if (!el) return;
    if (gap > 0) {
        const d = Math.floor(gap / 86400000);
        const h = Math.floor((gap % 86400000) / 3600000);
        const m = Math.floor((gap % 3600000) / 60000);
        const s = Math.floor((gap % 60000) / 1000);
        el.innerHTML = `
            <div class="countdown-grid">
                <div class="countdown-item"><div class="countdown-value">${d}</div><div class="countdown-label">Hari</div></div>
                <div class="countdown-item"><div class="countdown-value">${String(h).padStart(2,'0')}</div><div class="countdown-label">Jam</div></div>
                <div class="countdown-item"><div class="countdown-value">${String(m).padStart(2,'0')}</div><div class="countdown-label">Minit</div></div>
                <div class="countdown-item"><div class="countdown-value">${String(s).padStart(2,'0')}</div><div class="countdown-label">Saat</div></div>
            </div>`;
    } else {
        el.innerHTML = `<p class="countdown-pill">Selamat Pengantin Baru!</p>`;
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

    function formatDate(d){
        return d.toISOString().replace(/-|:|\.\d{3}/g,'');
    }

    // Month mapping (Malay -> month index)
    const monthMap = {
        'januari':0,'februari':1,'mac':2,'mac':2,'april':3,'mei':4,'jun':5,'julai':6,'ogos':7,'september':8,'oktober':9,'november':10,'disember':11
    };

    // helper: parse a date-block entry
    function parseDateBlock(block){
        const titleEl = block.querySelector('.date-title');
        const timeEl = block.querySelector('.date-time');
        if(!titleEl || !timeEl) return null;
        // title text like: "30 Mei 2026 (Sabtu)"
        const titleText = titleEl.textContent.replace(/\(.*\)/,'').trim();
        const parts = titleText.split(/\s+/);
        const day = parseInt(parts[0],10);
        const monthName = (parts[1] || '').toLowerCase();
        const year = parseInt(parts[2] || new Date().getFullYear(),10);
        const month = monthMap[monthName] !== undefined ? monthMap[monthName] : (new Date().getMonth());

        // time text like: "08:00 Malam — 12:00 Malam"
        let timeText = timeEl.textContent.trim();
        timeText = timeText.replace(/–|—/g,'-');
        const [startStr, endStr] = timeText.split('-').map(s=>s.trim());

        function parseTimePart(tp){
            // tp e.g. "08:00 Malam" or "11:00 Pagi"
            const tokens = tp.split(/\s+/);
            let timePart = tokens[0];
            let period = (tokens.slice(1).join(' ')||'').toLowerCase();
            const [hhStr, mmStr] = timePart.split(':');
            let hh = parseInt(hhStr,10)||0;
            const mm = parseInt(mmStr,10)||0;
            if(period.includes('malam') || period.includes('petang') || period.includes('sore')){
                if(hh < 12) hh += 12;
            }
            if(period.includes('pagi')){
                if(hh === 12) hh = 0;
            }
            return {hh, mm};
        }

        const startT = parseTimePart(startStr || '09:00');
        const endT = parseTimePart(endStr || '11:00');

        const startDate = new Date(year, month, day, startT.hh, startT.mm);
        const endDate = new Date(year, month, day, endT.hh, endT.mm);
        // if end <= start, add 2 hours
        if(endDate <= startDate) endDate.setHours(endDate.getHours()+2);

        return {startDate, endDate, summary: titleText};
    }

    // collect date-blocks
    const blocks = Array.from(document.querySelectorAll('.butiran-grid .date-block'));
    const events = blocks.map(parseDateBlock).filter(Boolean);
    if(events.length === 0){
        alert('Tiada maklumat tarikh ditemui.');
        return;
    }

    const icsLines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//WanaJahid//EN'];
    events.forEach(ev => {
        icsLines.push('BEGIN:VEVENT');
        icsLines.push(`UID:${Date.now()}-${Math.random().toString(36).slice(2)}@wanajahid`);
        icsLines.push(`DTSTAMP:${formatDate(new Date())}`);
        icsLines.push(`DTSTART:${formatDate(ev.startDate)}`);
        icsLines.push(`DTEND:${formatDate(ev.endDate)}`);
        icsLines.push(`SUMMARY:Walimatulurus Wana & Jahid - ${ev.summary}`);
        icsLines.push('LOCATION:Lot 3897 Jalan Lombong Perak 2, Kampong Lombong Seksyen 29, 40460 Shah Alam, Selangor');
        icsLines.push('DESCRIPTION:Kami menjemput anda ke majlis perkahwinan kami.');
        icsLines.push('END:VEVENT');
    });
    icsLines.push('END:VCALENDAR');

    const ics = icsLines.join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Wana-Jahid-Majlis.ics';
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
const scriptURL = 'https://script.google.com/macros/s/AKfycbwsnn7OBwLnXB8W5s3hqHcY2odMoLNw8hN0dfvbqEyaR0wfXKpF1tNKY4GEjt9seUpp/exec';
const SECRET_TOKEN = 'wanajahidwedding2026';
const form = document.getElementById('rsvp-form');
form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.innerHTML = "Menghantar...";
    btn.disabled = true;

    // Submit to Apps Script using a hidden iframe (avoids CORS preflight for POST)
    const iframeName = 'rsvp_target_iframe';
    let iframe = document.getElementById(iframeName);
    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.name = iframeName;
        iframe.id = iframeName;
        document.body.appendChild(iframe);
    }

    // Ensure token input exists
    let tokenInput = form.querySelector('input[name="token"]');
    if (!tokenInput) {
        tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = 'token';
        form.appendChild(tokenInput);
    }
    tokenInput.value = SECRET_TOKEN;

    // Configure form to post to Apps Script in background
    form.action = scriptURL;
    form.method = 'POST';
    form.target = iframeName;

    // Fire-and-forget submit (response is handled by Apps Script server)
    form.submit();
    console.log('📤 RSVP submitted to Apps Script');

    // UI feedback
    showToast('RSVP dihantar!');
    document.getElementById('success-msg').textContent = 'Terima kasih! RSVP dihantar. 🎉';
    document.getElementById('success-msg').style.display = 'block';
    createConfetti();

    // reset button and form fields
    btn.innerHTML = "HANTAR RSVP";
    btn.disabled = false;
    form.reset();
    
    // Refresh guestbook from server after submission
    setTimeout(() => {
        console.log('🔄 Fetching updated guestbook from Google Sheet...');
        if (typeof fetchRemoteGuestbook === 'function') fetchRemoteGuestbook();
    }, 1000);
});

// --- Guestbook rendering (server-backed via JSONP) ---
function escapeHtml(str){
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
}

function renderGuestbook(){
    const listEl = document.getElementById('guestbook-list');
    const emptyEl = document.getElementById('guestbook-empty');
    if (!listEl) return;
    
    // Get data from window variable set by JSONP, or empty array
    const items = (window.guestbookData || []).slice().reverse(); // newest first
    listEl.innerHTML = '';
    if (items.length === 0) {
        emptyEl.style.display = 'block';
        updateAttendanceStats();
        return;
    }
    emptyEl.style.display = 'none';
    items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'guestbook-entry';
        const hadir = escapeHtml(item.kehadiran || '—');
        const ucapan = escapeHtml(item.ucapan || '');
        li.innerHTML = `
            <div style="margin-bottom:8px; color:#333; font-size:0.95rem; line-height:1.6;">${ucapan || '<em style="color:#999;">Tiada ucapan</em>'}</div>
            <div style="font-size:0.85rem; color:#666;">Kehadiran: <strong>${hadir}</strong></div>`;
        listEl.appendChild(li);
    });
    updateAttendanceStats();
}

// Initial render on load
document.addEventListener('DOMContentLoaded', () => {
    renderGuestbook();
});

// Listen to storage events so other tabs/devices update the guestbook live
window.addEventListener('storage', (e) => {
    if (e.key === 'rsvps') renderGuestbook();
});

// Fetch live guestbook from Google Sheet via Apps Script using JSONP (works cross-origin)
function fetchRemoteGuestbook(){
    // Use dynamic JSONP callback to avoid CORS issues
    const cbName = 'wanajahid_guestbook_cb_' + Date.now();
    window[cbName] = function(rows){
        try {
            if (!Array.isArray(rows)) {
                console.warn('Invalid guestbook JSONP response');
                return;
            }
            // Store data globally for rendering
            window.guestbookData = rows;
            console.log('✅ Guestbook data fetched successfully. Total entries:', rows.length);
            renderGuestbook();
        } finally {
            // cleanup
            const s = document.getElementById(cbName);
            if (s) s.remove();
            try { delete window[cbName]; } catch(e) { window[cbName] = null; }
        }
    };
    const script = document.createElement('script');
    script.id = cbName;
    script.src = scriptURL + '?action=list&callback=' + cbName;
    script.async = true;
    script.onerror = function(err){
        console.error('❌ JSONP guestbook load failed', err);
        const s = document.getElementById(cbName);
        if (s) s.remove();
        try { delete window[cbName]; } catch(e) { window[cbName] = null; }
    };
    document.body.appendChild(script);
}



// Merge remote rows into local storage and mark as synced
function mergeRemoteEntries(rows){
    if (!Array.isArray(rows)) return;
    // No longer needed - data comes directly from JSONP
}

// Poll remote guestbook periodically
let guestbookPollInterval = null;
function startGuestbookPolling(intervalMs = 20000){
    if (guestbookPollInterval) clearInterval(guestbookPollInterval);
    guestbookPollInterval = setInterval(() => {
        fetchRemoteGuestbook();
    }, intervalMs);
}

// When JSONP callback runs, it will call our cb which merges and updates lastSyncTime
// Modify window callback handler creation inside fetchRemoteGuestbook to set lastSyncTime and merge

// Load guestbook on page load
window.addEventListener('load', () => { 
    if (typeof fetchRemoteGuestbook === 'function') fetchRemoteGuestbook(); 
    // start polling for live updates
    startGuestbookPolling(20000);
});



// Sync pending local entries to Apps Script by submitting hidden forms to avoid CORS
async function syncPendingEntries(){
    // No longer needed - all data comes directly from Google Sheet
}

// Contact-card click/keyboard handler: clicking the card initiates phone call (tel:), WA links still work.
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.contact-card').forEach(card => {
        // Click on card initiates call
        card.addEventListener('click', (e) => {
            // If clicked element is a link (e.g., WhatsApp), let that handle it
            const target = e.target.closest('a');
            if (target) return;
            const tel = card.dataset.tel;
            if (tel) window.location.href = 'tel:' + tel;
        });

        // Keyboard accessibility
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const tel = card.dataset.tel;
                if (tel) window.location.href = 'tel:' + tel;
            }
        });

        // Prevent WA link clicks from bubbling to the card
        card.querySelectorAll('a').forEach(a => a.addEventListener('click', (ev) => ev.stopPropagation()));
    });
});

// QR Code Modal Functions
function openQRModal() {
    const modal = document.getElementById('qrModal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeQRModal() {
    const modal = document.getElementById('qrModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = 'auto';
    }
}

// QR Modal Event Listeners - Close on ESC key or outside click
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('qrModal');
    const modalContent = document.querySelector('.qr-modal-content');

    // Close on ESC key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal && modal.classList.contains('open')) {
            closeQRModal();
        }
    });

    // Close on outside click
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeQRModal();
            }
        });
    }
});

// Download QR image
function downloadQR() {
    const img = document.getElementById('qrImage');
    if (!img) return;
    const src = img.src;
    // Try fetching the image blob and trigger download
    fetch(src)
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            // Use filename from src or fallback
            const filename = src.split('/').pop().split('?')[0] || 'qr-bank.png';
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        })
        .catch(err => {
            // Fallback: open image in new tab for user to save
            window.open(src, '_blank');
        });
}