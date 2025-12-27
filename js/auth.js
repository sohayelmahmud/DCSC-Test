// auth.js
const SB_URL = 'https://kspvcganucjolmrdpudb.supabase.co';
const SB_KEY = 'sb_publishable_-C1y_mIZSLQbRvLe0ZUxgA_EOBO7DL_';

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

    checkSession: async () => {
        try {
            const { data: { session }, error } = await clientDB.auth.getSession();
            if (error) throw error;
            return session;
        } catch (err) {
            console.error("Session Error:", err);
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