// Google Apps Script URL for guestbook (if using Google Forms backend)
// Leave empty if using Firebase only
const scriptURL = ''; // Set to your Google Apps Script URL if needed

AOS.init({ duration: 1000, once: true });

// Gallery auto-slide and thumbnail function
let currentImageIndex = 0;
let autoSlideInterval;
const autoSlideDuration = 5000; // 5 seconds

function changeMainImage(imageSrc, index = null) {
    document.getElementById('mainGalleryImage').src = imageSrc;
    
    // Update active thumbnail
    const thumbs = document.querySelectorAll('.gallery-thumb');
    thumbs.forEach((thumb, i) => {
        thumb.classList.remove('active');
        if (thumb.src === new URL(imageSrc, window.location).href || i === index) {
            thumb.classList.add('active');
            currentImageIndex = i;
        }
    });
    
    // Reset auto-slide timer
    resetAutoSlide();
}

function autoSlideNext() {
    const thumbs = document.querySelectorAll('.gallery-thumb');
    currentImageIndex = (currentImageIndex + 1) % thumbs.length;
    const nextThumb = thumbs[currentImageIndex];
    changeMainImage(nextThumb.src, currentImageIndex);
}

function startAutoSlide() {
    autoSlideInterval = setInterval(autoSlideNext, autoSlideDuration);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// Start auto-slide on page load
document.addEventListener('DOMContentLoaded', () => {
    startAutoSlide();
    
    // Pause auto-slide on thumbnail hover/click
    const thumbs = document.querySelectorAll('.gallery-thumb');
    thumbs.forEach(thumb => {
        thumb.addEventListener('click', resetAutoSlide);
        thumb.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        thumb.addEventListener('mouseleave', startAutoSlide);
    });
});

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
            document.body.style.background = "url('img/wedding-bg.PNG') center/cover fixed no-repeat";
            // reveal music control
            const m = document.getElementById('musicToggle');
            if (m) m.style.display = 'block';
            updateMusicButton();
            AOS.refresh(); // PENTING: Refresh animasi AOS selepas elemen muncul
        }, 100);
    }, 600);
}

// Countdown Logic — Flip Clock Style (target: 31 May 2026 11:00)
const targetDate = new Date('2026-05-31T11:00:00').getTime();
let lastValues = { days: -1, hours: -1, minutes: -1, seconds: -1 };

function updateCountdown(){
    const now = Date.now();
    const gap = targetDate - now;
    
    if (gap > 0) {
        const days = Math.floor(gap / 86400000);
        const hours = Math.floor((gap % 86400000) / 3600000);
        const minutes = Math.floor((gap % 3600000) / 60000);
        const seconds = Math.floor((gap % 60000) / 1000);
        
        // Only update the values that have changed
        if (days !== lastValues.days) {
            updateFlipValue('[data-unit="days"] .flip-value', days);
            lastValues.days = days;
        }
        if (hours !== lastValues.hours) {
            updateFlipValue('[data-unit="hours"] .flip-value', String(hours).padStart(2, '0'));
            lastValues.hours = hours;
        }
        if (minutes !== lastValues.minutes) {
            updateFlipValue('[data-unit="minutes"] .flip-value', String(minutes).padStart(2, '0'));
            lastValues.minutes = minutes;
        }
        if (seconds !== lastValues.seconds) {
            updateFlipValue('[data-unit="seconds"] .flip-value', String(seconds).padStart(2, '0'));
            lastValues.seconds = seconds;
        }
    } else {
        // Wedding day reached
        const timerEl = document.getElementById('countdown-timer');
        if (timerEl) {
            timerEl.innerHTML = '<p class="countdown-pill" style="text-align: center; margin: 20px 0;">Selamat Pengantin Baru! 💍</p>';
        }
    }
}

function updateFlipValue(selector, newValue) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    const oldValue = element.textContent;
    if (oldValue === newValue) return;
    
    // Trigger flip animation
    element.classList.remove('flip');
    void element.offsetWidth; // Trigger reflow
    element.classList.add('flip');
    
    // Update value after flip animation starts
    setTimeout(() => {
        element.textContent = newValue;
    }, 300);
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
    console.log('generateICS called');
    // Guard against missing event (inline onclick may not always provide `event`)
    if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
    } else if (window.event) {
        // Older IE-style event
        window.event.returnValue = false;
    }

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
        // title text like: "📅30 Mei 2026 (Sabtu)" — remove emoji/special chars and brackets
        const titleText = titleEl.textContent.replace(/[📅🕒]/g,'').replace(/\(.*\)/,'').trim();
        const parts = titleText.split(/\s+/).filter(Boolean);
        // Extract day (first numeric part), handle emoji prefix
        const dayStr = parts[0] ? parts[0].replace(/\D/g, '') : '';
        const day = dayStr ? parseInt(dayStr, 10) : NaN;
        const monthName = (parts[1] || '').toLowerCase();
        const year = parseInt(parts[2] || new Date().getFullYear(),10);
        const month = monthMap[monthName] !== undefined ? monthMap[monthName] : (new Date().getMonth());
        // Validate parsed values
        if(isNaN(day) || isNaN(month) || isNaN(year) || day < 1 || day > 31 || month < 0 || month > 11){
            console.warn('Invalid date parsed:', {day, monthName, month, year, titleText});
            return null;
        }

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
        
        // Check for invalid dates
        if(isNaN(startDate.getTime()) || isNaN(endDate.getTime())){
            console.warn('Invalid date created:', {startDate, endDate, year, month, day});
            return null;
        }
        
        // if end <= start, add 2 hours
        if(endDate <= startDate) endDate.setHours(endDate.getHours()+2);

        return {startDate, endDate, summary: titleText};
    }

    // collect date-blocks
    const blocks = Array.from(document.querySelectorAll('.butiran-grid .date-block'));
    const events = blocks.map(parseDateBlock).filter(Boolean);
    console.log('generateICS: found date-blocks=', blocks.length, 'parsed events=', events.length);
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

// Ensure `generateICS` is available on the global scope for inline `onclick` handlers
if (typeof window !== 'undefined') window.generateICS = generateICS;

// Extract event data for calendar links
// Event details: 31 Mei 2026 (May 31, 2026), 11:00 AM to 5:00 PM
function getEventData(){
    // Hardcoded event details to ensure consistency
    const startDate = new Date(2026, 4, 31, 11, 0); // May 31, 2026, 11:00 AM (month is 0-indexed)
    const endDate = new Date(2026, 4, 31, 17, 0);   // May 31, 2026, 5:00 PM
    
    if(isNaN(startDate.getTime()) || isNaN(endDate.getTime())){
        console.error('Invalid event date');
        return null;
    }
    
    return {
        title: 'Walimatulurus Wana & Jahid',
        startDate,
        endDate,
        location: 'Lot 3897 Jalan Lombong Perak 2, Kampong Lombong Seksyen 29, 40460 Shah Alam, Selangor',
        description: 'Kami menjemput anda ke majlis perkahwinan kami.'
    };
}

// Calendar modal functions
function openCalendarModal(e){
    if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
    }
    const modal = document.getElementById('calendarModal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeCalendarModal(){
    const modal = document.getElementById('calendarModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = 'auto';
    }
}

// Add to Google Calendar
function addToGoogleCalendar(){
    const data = getEventData();
    if(!data){
        alert('Maklumat tarikh tidak dijumpai');
        return;
    }
    const startDate = data.startDate.toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z';
    const endDate = data.endDate.toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z';
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(data.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(data.description)}&location=${encodeURIComponent(data.location)}`;
    window.open(url, '_blank');
    closeCalendarModal();
}

// Add to Apple Calendar (downloads ICS)
function addToAppleCalendar(){
    downloadICS();
}

// Download ICS file
function downloadICS(){
    const data = getEventData();
    if(!data){
        alert('Maklumat tarikh tidak dijumpai');
        return;
    }
    
    function formatDate(d){
        return d.toISOString().replace(/-|:|\.\d{3}/g,'');
    }
    
    const icsLines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//WanaJahid//EN'];
    icsLines.push('BEGIN:VEVENT');
    icsLines.push(`UID:${Date.now()}-${Math.random().toString(36).slice(2)}@wanajahid`);
    icsLines.push(`DTSTAMP:${formatDate(new Date())}`);
    icsLines.push(`DTSTART:${formatDate(data.startDate)}`);
    icsLines.push(`DTEND:${formatDate(data.endDate)}`);
    icsLines.push(`SUMMARY:${data.title}`);
    icsLines.push(`LOCATION:${data.location}`);
    icsLines.push(`DESCRIPTION:${data.description}`);
    icsLines.push('END:VEVENT');
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
    closeCalendarModal();
}

// Close modal on ESC or outside click
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('calendarModal');
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal && modal.classList.contains('open')) {
            closeCalendarModal();
        }
    });
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeCalendarModal();
            }
        });
    }
});

if (typeof window !== 'undefined') {
    window.openCalendarModal = openCalendarModal;
    window.closeCalendarModal = closeCalendarModal;
    window.addToGoogleCalendar = addToGoogleCalendar;
    window.addToAppleCalendar = addToAppleCalendar;
    window.downloadICS = downloadICS;
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
        const text = encodeURIComponent('Saya diundang ke Walimatulurus Wana & Jahid! 💍 Ahad, 31 Mei 2026 di Lot 3897 Jalan Lombong Perak 2, Kampung Lombong Seksyen 29 40460 Shah Alam, Selangor.');
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
        const gallery = document.getElementById('gallery-section');
        if (gallery) {
            gallery.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// RSVP Form - Firebase Implementation
const form = document.getElementById('rsvp-form');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        btn.innerHTML = "Menghantar...";
        btn.disabled = true;

        try {
            // Ensure Firebase RSVP is initialized
            if (!firebaseRsvp && typeof initializeFirebaseRSVP === 'function') {
                initializeFirebaseRSVP();
                // Wait a moment for initialization
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            if (!firebaseRsvp) {
                throw new Error('Firebase belum sedia. Sila muat semula halaman.');
            }

            // Get form data
            const formData = {
                nama: form.querySelector('input[name="nama"]').value,
                kehadiran: form.querySelector('select[name="kehadiran"]').value,
                jumlah: form.querySelector('select[name="jumlah"]').value || '0',
                ucapan: form.querySelector('textarea[name="ucapan"]').value
            };

            // Validate
            if (!formData.nama || !formData.kehadiran) {
                showToast('Sila isi nama dan status kehadiran');
                btn.innerHTML = "HANTAR RSVP";
                btn.disabled = false;
                return;
            }

            // Submit to Firebase
            const result = await firebaseRsvp.submitRSVP(formData);

            if (result.success) {
                // Show success message
                showToast('RSVP dihantar!');
                document.getElementById('success-msg').textContent = 'Terima kasih! RSVP dihantar. 🎉';
                document.getElementById('success-msg').style.display = 'block';
                createConfetti();

                // Reset form
                form.reset();
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Ralat: ' + error.message);
        } finally {
            btn.innerHTML = "HANTAR RSVP";
            btn.disabled = false;
        }
    });
}

// --- Guestbook rendering (server-backed via JSONP) ---
function escapeHtml(str){
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
}

// Update attendance counts
function updateAttendanceStats(){
    const items = window.guestbookData || [];
    const countHadir = items.filter(item => item.kehadiran === 'Hadir').length;
    const countTidakHadir = items.filter(item => item.kehadiran === 'Tidak Hadir').length;
    
    const hEl = document.getElementById('countHadir');
    const tEl = document.getElementById('countTidakHadir');
    if(hEl) hEl.textContent = countHadir;
    if(tEl) tEl.textContent = countTidakHadir;
}

function renderGuestbook(){
    const sliderEl = document.getElementById('guestbook-slider');
    const emptyEl = document.getElementById('guestbook-empty');
    const dotsEl = document.getElementById('guestbook-dots');
    if (!sliderEl) return;
    
    // Get data from window variable set by JSONP, or empty array
    const items = (window.guestbookData || []).slice().reverse(); // newest first
    sliderEl.innerHTML = '';
    dotsEl.innerHTML = '';
    
    if (items.length === 0) {
        emptyEl.style.display = 'block';
        document.getElementById('guestbook-slider-container').style.display = 'none';
        updateAttendanceStats();
        return;
    }
    
    document.getElementById('guestbook-slider-container').style.display = 'block';
    emptyEl.style.display = 'none';
    
    // Create slides
    items.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.className = 'guestbook-slide';
        if (index === 0) slide.classList.add('active');
        
        const nama = escapeHtml(item.nama || '—');
        const hadir = escapeHtml(item.kehadiran || '—');
        const ucapan = escapeHtml(item.ucapan || '');
        const timestamp = item.timestamp ? new Date(item.timestamp).toLocaleDateString('ms-MY', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) : '';
        
        slide.innerHTML = `
            <div class="guestbook-slide-content">
                <div class="guestbook-name">${nama}</div>
                ${timestamp ? `<div class="guestbook-timestamp">${timestamp}</div>` : ''}
                <div class="guestbook-status">
                    <span class="guestbook-badge ${hadir === 'Hadir' ? 'badge-hadir' : 'badge-tidak-hadir'}">${hadir}</span>
                </div>
                <div class="guestbook-message">"${ucapan || 'Tiada ucapan'}"</div>
            </div>`;
        sliderEl.appendChild(slide);
        
        // Create dot
        const dot = document.createElement('button');
        dot.className = 'guestbook-dot';
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('data-slide', index);
        dot.setAttribute('aria-label', `Go to message ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsEl.appendChild(dot);
    });
    
    // Setup slider navigation
    setupSliderNavigation(items.length);
    updateAttendanceStats();
}

// Slider navigation
let currentSlide = 0;
let totalSlides = 0;
let touchStartX = 0;
let touchEndX = 0;

function setupSliderNavigation(total) {
    totalSlides = total;
    const prevBtn = document.getElementById('guestbook-prev');
    const nextBtn = document.getElementById('guestbook-next');
    const sliderContainer = document.getElementById('guestbook-slider-container');
    
    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    
    // Add touch/swipe functionality
    if (sliderContainer) {
        sliderContainer.addEventListener('touchstart', handleTouchStart, false);
        sliderContainer.addEventListener('touchend', handleTouchEnd, false);
    }
}

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50; // minimum distance for swipe
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swiped left - go to next slide
            goToSlide(currentSlide + 1);
        } else {
            // Swiped right - go to previous slide
            goToSlide(currentSlide - 1);
        }
    }
}

function goToSlide(index) {
    if (totalSlides === 0) return;
    
    // Wrap around
    currentSlide = (index + totalSlides) % totalSlides;
    
    const slides = document.querySelectorAll('.guestbook-slide');
    const dots = document.querySelectorAll('.guestbook-dot');
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (slides[currentSlide]) slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
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
