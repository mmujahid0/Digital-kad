// Firebase RSVP Module - Handles all RSVP operations with real-time updates
// This replaces the Google Apps Script backend with Firebase Realtime Database

class FirebaseRSVP {
    constructor() {
        this.db = firebase.database();
        this.rsvpsRef = this.db.ref('rsvps');
        this.listeners = [];
        this.initializeListeners();
    }

    // Initialize real-time listeners for live updates
    initializeListeners() {
        // Listen for all RSVP changes in real-time
        this.rsvpsRef.on('value', (snapshot) => {
            const data = snapshot.val();
            const rsvpArray = data ? Object.entries(data).map(([id, value]) => ({
                id,
                ...value
            })) : [];
            
            // Store in window for compatibility with existing code
            window.guestbookData = rsvpArray;
            
            // Render guestbook and update stats
            if (typeof renderGuestbook === 'function') {
                renderGuestbook();
            }
            if (typeof updateAttendanceStats === 'function') {
                updateAttendanceStats();
            }
        });

        // Listen for new child additions (just added)
        this.rsvpsRef.on('child_added', (snapshot) => {
            const newRsvp = snapshot.val();
            console.log('🎉 New RSVP received:', newRsvp.nama);
            
            // Optional: Show a toast notification
            if (typeof showToast === 'function') {
                showToast(`${newRsvp.nama} telah RSVP!`);
            }
        });
    }

    // Submit new RSVP
    async submitRSVP(formData) {
        try {
            const timestamp = Date.now();
            const rsvpData = {
                nama: formData.nama,
                kehadiran: formData.kehadiran,
                jumlah: parseInt(formData.jumlah) || 0,
                ucapan: formData.ucapan || '',
                timestamp: timestamp,
                userAgent: navigator.userAgent.substring(0, 100) // for analytics
            };

            // Use a unique ID based on name + timestamp to avoid duplicates
            const rsvpId = this.generateRSVPId(formData.nama);
            
            // Write to database
            await this.rsvpsRef.child(rsvpId).set(rsvpData);
            
            console.log('✅ RSVP submitted:', formData.nama);
            return { success: true, id: rsvpId };
        } catch (error) {
            console.error('❌ Error submitting RSVP:', error);
            throw error;
        }
    }

    // Generate unique ID (uses name + small random to avoid exact duplicates)
    generateRSVPId(nama) {
        const sanitized = nama.toLowerCase().replace(/\s+/g, '_');
        const timestamp = Date.now().toString().slice(-6);
        return `${sanitized}_${timestamp}`;
    }

    // Get all RSVPs
    async getAllRSVPs() {
        try {
            const snapshot = await this.rsvpsRef.once('value');
            const data = snapshot.val();
            return data ? Object.entries(data).map(([id, value]) => ({ id, ...value })) : [];
        } catch (error) {
            console.error('❌ Error fetching RSVPs:', error);
            return [];
        }
    }

    // Get attendance summary
    async getAttendanceSummary() {
        try {
            const rsvps = await this.getAllRSVPs();
            const summary = {
                totalHadir: 0,
                totalTidakHadir: 0,
                totalPax: 0,
                totalRSVP: rsvps.length
            };

            rsvps.forEach(rsvp => {
                if (rsvp.kehadiran === 'Hadir') {
                    summary.totalHadir++;
                    summary.totalPax += parseInt(rsvp.jumlah) || 1;
                } else if (rsvp.kehadiran === 'Tidak Hadir') {
                    summary.totalTidakHadir++;
                }
            });

            return summary;
        } catch (error) {
            console.error('❌ Error getting attendance summary:', error);
            return null;
        }
    }

    // Delete an RSVP (useful for admin panel)
    async deleteRSVP(rsvpId) {
        try {
            await this.rsvpsRef.child(rsvpId).remove();
            console.log('✅ RSVP deleted:', rsvpId);
            return true;
        } catch (error) {
            console.error('❌ Error deleting RSVP:', error);
            return false;
        }
    }

    // Update an RSVP
    async updateRSVP(rsvpId, updates) {
        try {
            await this.rsvpsRef.child(rsvpId).update(updates);
            console.log('✅ RSVP updated:', rsvpId);
            return true;
        } catch (error) {
            console.error('❌ Error updating RSVP:', error);
            return false;
        }
    }

    // Offline support - Firebase handles this automatically
    // Enable offline persistence (call this once)
    enableOfflinePersistence() {
        firebase.database().ref().keepSynced(true);
    }
}

// Initialize Firebase RSVP manager globally
// Defer initialization until after Firebase is ready
let firebaseRsvp = null;

function initializeFirebaseRSVP() {
    if (!firebaseRsvp) {
        // Check if Firebase is available
        if (typeof firebase === 'undefined') {
            console.error('❌ Firebase SDK not loaded. Please ensure firebase-app-compat.js is loaded first.');
            return null;
        }
        
        firebaseRsvp = new FirebaseRSVP();
        // Enable offline support
        firebaseRsvp.enableOfflinePersistence();
        console.log('✅ Firebase RSVP module initialized');
    }
    return firebaseRsvp;
}

// Initialize when page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (!firebaseRsvp && typeof firebase !== 'undefined') {
                initializeFirebaseRSVP();
            }
        }, 500);
    });
} else {
    // Page already loaded
    setTimeout(() => {
        if (!firebaseRsvp && typeof firebase !== 'undefined') {
            initializeFirebaseRSVP();
        }
    }, 500);
}

console.log('✅ Firebase RSVP module loaded');
