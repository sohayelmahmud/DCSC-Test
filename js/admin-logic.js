/**
 * Admin Logic for Dhaka College Science Club CMS
 * Handles CRUD operations using localStorage.
 */

const STORAGE_KEYS = {
    MEMBERS: 'dcsc_members',
    BLOGS: 'dcsc_blogs',
    EVENTS: 'dcsc_events'
};

// Initial Data Seeding (Optional - helpful for first run)
function seedData() {
    if (!localStorage.getItem(STORAGE_KEYS.MEMBERS)) {
        localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BLOGS)) {
        localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify([]));
    }
}

const CMS = {
    // --- Generic Helpers ---
    get: (key) => {
        return JSON.parse(localStorage.getItem(key) || '[]');
    },

    save: (key, data) => {
        const items = CMS.get(key);
        // If data has an ID, update existing. Else add new.
        if (data.id) {
            const index = items.findIndex(item => item.id == data.id);
            if (index !== -1) {
                items[index] = data;
            } else {
                items.push(data); // Fallback
            }
        } else {
            data.id = Date.now().toString(); // Simple ID generation
            items.push(data);
        }
        localStorage.setItem(key, JSON.stringify(items));
        return true;
    },

    delete: (key, id) => {
        let items = CMS.get(key);
        items = items.filter(item => item.id != id);
        localStorage.setItem(key, JSON.stringify(items));
    },

    // --- Stats ---
    getStats: () => {
        return {
            events: CMS.get(STORAGE_KEYS.EVENTS).length
        };
    },

    updateDashboardStats: () => {
        const stats = CMS.getStats();
        // Ensure these elements exist in dashboard.html
        const eventCount = document.getElementById('stat-events');

        if (eventCount) eventCount.textContent = stats.events;
    },

    logout: () => {
        localStorage.removeItem('dcsc_auth_session');
        window.location.href = 'login.html';
    },

    // --- Moderator Management ---
    loadModerators: () => {
        const pending = JSON.parse(localStorage.getItem('pending_mods') || '[]');
        const approved = JSON.parse(localStorage.getItem('approved_mods') || '[]');

        const pendingTable = document.getElementById('pendingModsTable');
        const approvedTable = document.getElementById('approvedModsTable');

        if (pendingTable) {
            pendingTable.innerHTML = pending.map(mod => `
                <tr>
                    <td>${mod.name}</td>
                    <td>${mod.email}</td>
                    <td>
                        <button class="btn-action edit" onclick="CMS.approveMod('${mod.email}')">Approve</button>
                        <button class="btn-action delete" onclick="CMS.rejectMod('${mod.email}')">Reject</button>
                    </td>
                </tr>
            `).join('');
            if (pending.length === 0) pendingTable.innerHTML = '<tr><td colspan="3">No pending requests.</td></tr>';
        }

        if (approvedTable) {
            approvedTable.innerHTML = approved.map(mod => `
                <tr>
                    <td>${mod.name}</td>
                    <td>${mod.email}</td>
                    <td>
                        <button class="btn-action delete" onclick="CMS.removeMod('${mod.email}')">Remove</button>
                    </td>
                </tr>
            `).join('');
            if (approved.length === 0) approvedTable.innerHTML = '<tr><td colspan="3">No approved moderators.</td></tr>';
        }
    },

    approveMod: (email) => {
        const pending = JSON.parse(localStorage.getItem('pending_mods') || '[]');
        const approved = JSON.parse(localStorage.getItem('approved_mods') || '[]');

        const modIndex = pending.findIndex(m => m.email === email);
        if (modIndex > -1) {
            const mod = pending.splice(modIndex, 1)[0];
            approved.push(mod);
            localStorage.setItem('pending_mods', JSON.stringify(pending));
            localStorage.setItem('approved_mods', JSON.stringify(approved));
            alert(`Approved ${mod.name}`);
            CMS.loadModerators();
        }
    },

    rejectMod: (email) => {
        if (!confirm('Are you sure you want to reject this request?')) return;
        let pending = JSON.parse(localStorage.getItem('pending_mods') || '[]');
        pending = pending.filter(m => m.email !== email);
        localStorage.setItem('pending_mods', JSON.stringify(pending));
        CMS.loadModerators();
    },

    removeMod: (email) => {
        if (!confirm('Are you sure you want to remove this moderator?')) return;
        let approved = JSON.parse(localStorage.getItem('approved_mods') || '[]');
        approved = approved.filter(m => m.email !== email);
        localStorage.setItem('approved_mods', JSON.stringify(approved));
        CMS.loadModerators();
    }
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    seedData();
    CMS.updateDashboardStats();
});

// --- Public Function for Frontend Sync (export if using modules, otherwise global) ---
// This function can be copied to main.js or just referenced if this script is loaded.
function getCMSData(type) {
    // type: 'members', 'blogs', 'events'
    const key = STORAGE_KEYS[type.toUpperCase()];
    return key ? CMS.get(key) : [];
}
