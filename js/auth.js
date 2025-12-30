// auth.js
const SB_URL = 'https://kspvcganucjolmrdpudb.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzcHZjZ2FudWNqb2xtcmRwdWRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NjExNTAsImV4cCI6MjA4MjMzNzE1MH0.ktKtq9y9nX16lSxtqF9H4vdDIWNm1lLzaBosc3RlSyc';

// ভেরিয়েবল নাম clientDB রাখা হয়েছে যেন conflict না হয়
const clientDB = supabase.createClient(SB_URL, SB_KEY);

const AUTH = {
    login: async (email, password) => {
        try {
            const { data, error } = await clientDB.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) throw error;
            window.location.href = 'dashboard.html';
        } catch (err) {
            console.error("Login Error:", err.message);
            throw err;
        }
    },

    // auth.js এর ভেতর
    checkSession: async () => {
        try {
            const { data: { session }, error } = await clientDB.auth.getSession();
            if (error) throw error;

            const isLoginPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('moderator.html');

            // যদি সেশন না থাকে এবং ইউজার লগইন পেজেও না থাকে, তবেই লগইন পেজে পাঠাও
            if (!session && !isLoginPage) {
                window.location.href = 'login.html';
            }
            return session;
        } catch (err) {
            return null;
        }
    }
};

// অটো চেক রান করা
document.addEventListener('DOMContentLoaded', async () => {
    const session = await AUTH.checkSession();
    const isLoginPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('moderator.html');

    if (!session && !isLoginPage) {
        window.location.href = 'login.html';
    }
});