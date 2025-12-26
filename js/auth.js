/**
 * Auth Logic for Dhaka College Science Club
 * Handles login, logout, and session verification using localStorage.
 */

const AUTH_KEY = 'dcsc_auth_session';
const ADMIN_CREDENTIALS = {
    email: 'admin.dcsc@gmail.com',
    password: 'admin123'
};

const Auth = {
    /**
     * Attempt to log in with email and password
     * @param {string} email
     * @param {string} password
     * @returns {object} { success: boolean, message: string }
     */
    login: (email, password) => {
        // 1. Check Super Admin
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            const session = {
                user: 'Super Admin',
                email: email,
                role: 'admin',
                loginTime: new Date().toISOString()
            };
            localStorage.setItem(AUTH_KEY, JSON.stringify(session));
            return { success: true, message: 'Login successful' };
        }

        // 2. Check Approved Moderators
        const approvedMods = JSON.parse(localStorage.getItem('approved_mods') || '[]');
        const mod = approvedMods.find(m => m.email === email && m.password === password);

        if (mod) {
            const session = {
                user: mod.name,
                email: mod.email,
                role: 'moderator',
                loginTime: new Date().toISOString()
            };
            localStorage.setItem(AUTH_KEY, JSON.stringify(session));
            return { success: true, message: 'Login successful' };
        }

        // 3. Check Pending Moderators (to give specific error)
        const pendingMods = JSON.parse(localStorage.getItem('pending_mods') || '[]');
        const pending = pendingMods.find(m => m.email === email && m.password === password);

        if (pending) {
            return { success: false, message: 'Account is pending approval by Admin.' };
        }

        return { success: false, message: 'Invalid email or password' };
    },

    register: (name, email, password) => {
        const approvedMods = JSON.parse(localStorage.getItem('approved_mods') || '[]');
        const pendingMods = JSON.parse(localStorage.getItem('pending_mods') || '[]');

        if (email === ADMIN_CREDENTIALS.email ||
            approvedMods.some(m => m.email === email) ||
            pendingMods.some(m => m.email === email)) {
            return { success: false, message: 'Email already exists!' };
        }

        pendingMods.push({
            name,
            email,
            password, // In a real app, hash this!
            timestamp: new Date().toISOString()
        });

        localStorage.setItem('pending_mods', JSON.stringify(pendingMods));
        return { success: true, message: 'Registration successful! Please wait for Admin approval.' };
    },

    /**
     * Check if user is authenticated.
     * If not, redirect to login page (unless already on login page).
     */
    checkAuth: () => {
        const session = localStorage.getItem(AUTH_KEY);
        const currentPage = window.location.pathname.split('/').pop();

        if (session) {
            // User is logged in
            if (currentPage === 'login.html') {
                window.location.href = 'dashboard.html';
            }
        } else {
            // User is NOT logged in
            if (currentPage !== 'login.html' && currentPage.includes('dashboard')) {
                window.location.href = 'login.html';
            }
        }
    },

    /**
     * Log out the current user
     */
    logout: () => {
        localStorage.removeItem(AUTH_KEY);
        window.location.href = 'login.html';
    },

    /**
     * Get current user info
     */
    getUser: () => {
        const session = localStorage.getItem(AUTH_KEY);
        return session ? JSON.parse(session) : null;
    }
};

// Auto-check auth on load
document.addEventListener('DOMContentLoaded', () => {
    Auth.checkAuth();
});
