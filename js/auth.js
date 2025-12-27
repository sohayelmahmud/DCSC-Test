/**
 * Authentication Logic for Dhaka College Science Club
 * Handles User Login, Session Check, and Logout via Supabase.
 */

// 1. Configuration
// Variable name change to avoid conflict with library
const SUPABASE_URL = 'https://kspvcganucjolmrdpudb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-C1y_mIZSLQbRvLe0ZUxgA_EOBO7DL_';
const supabaseDB = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const AUTH = {
    /**
     * Handle user login
     * @param {string} email
     * @param {string} password
     */
    login: async (email, password) => {
        try {
            const { data, error } = await supabaseDB.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) throw error;

            // Save session and redirect to dashboard
            alert("Login Successful!");
            window.location.href = 'dashboard.html';
        } catch (err) {
            alert("Login Failed: " + err.message);
        }
    },

    /**
     * Check if user is currently logged in
     * Call this at the top of every protected page (like dashboard.html)
     */
    checkSession: async () => {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            // If no session, kick user back to login page
            window.location.href = 'login.html';
        }
        return session;
    },

    /**
     * Sign out the user
     */
    logout: async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            window.location.href = 'login.html';
        }
    }
};

// --- Auto-protecting Pages ---
document.addEventListener('DOMContentLoaded', () => {
    // If we are on any page except login.html, check for session
    if (!window.location.pathname.includes('login.html')) {
        AUTH.checkSession();
    }
});