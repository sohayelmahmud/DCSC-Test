/**
 * Admin Logic for Dhaka College Science Club CMS
 * Handles Cloud CRUD operations using Supabase.
 */

// 1. Supabase Configuration - Variable renamed to clientDB to avoid conflict
const SB_URL = 'https://kspvcganucjolmrdpudb.supabase.co';
const SB_KEY = 'sb_publishable_-C1y_mIZSLQbRvLe0ZUxgA_EOBO7DL_';
const clientDB = supabase.createClient(SB_URL, SB_KEY);

const CMS = {
    // --- Generic Helpers for Database Operations ---

    /**
     * Fetch all records from a specific table
     */
    get: async (table) => {
        try {
            const { data, error } = await clientDB
                .from(table)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (err) {
            console.error(`Error fetching ${table}:`, err.message);
            return [];
        }
    },

    /**
     * Create or Update a record (using upsert for reliability)
     */
    save: async (table, formData) => {
        try {
            // Remove empty ID if it exists to let Supabase generate one
            if (!formData.id) delete formData.id;

            const { data, error } = await clientDB
                .from(table)
                .upsert([formData]); // upsert handles both insert and update

            if (error) throw error;
            alert("Success! Cloud database updated.");
            return true;
        } catch (err) {
            console.error("Save error:", err.message);
            alert("Operation failed: " + err.message);
            return false;
        }
    },

    /**
     * Delete a record from a table
     */
    delete: async (table, id) => {
        if (!confirm('Are you sure you want to delete this record permanently?')) return;
        try {
            const { error } = await clientDB
                .from(table)
                .delete()
                .eq('id', id);

            if (error) throw error;
            alert("Record deleted successfully.");
            location.reload();
        } catch (err) {
            alert("Delete failed: " + err.message);
        }
    },

    // --- Dashboard Analytics ---
    updateDashboardStats: async () => {
        try {
            const events = await CMS.get('events');
            const blogs = await CMS.get('blogs');
            const members = await CMS.get('members');

            const eventCountEl = document.getElementById('stat-events');
            const blogCountEl = document.getElementById('stat-blogs');
            const memberCountEl = document.getElementById('stat-members');

            if (eventCountEl) eventCountEl.textContent = events.length;
            if (blogCountEl) blogCountEl.textContent = blogs.length;
            if (memberCountEl) memberCountEl.textContent = members.length;
        } catch (e) {
            console.log("Stats update failed");
        }
    },

    // --- Moderator Management Logic ---
    loadModerators: async () => {
        const pending = await CMS.get('pending_mods');
        const approved = await CMS.get('approved_mods');

        const pendingTable = document.getElementById('pendingModsTable');
        const approvedTable = document.getElementById('approvedModsTable');

        if (pendingTable) {
            pendingTable.innerHTML = pending.length ? pending.map(mod => `
                <tr>
                    <td>${mod.name}</td>
                    <td>${mod.email}</td>
                    <td>
                        <button class="btn-action edit" onclick="CMS.approveMod('${mod.id}', '${mod.email}', '${mod.name}')">Approve</button>
                        <button class="btn-action delete" onclick="CMS.delete('pending_mods', '${mod.id}')">Reject</button>
                    </td>
                </tr>
            `).join('') : '<tr><td colspan="3">No pending moderator requests.</td></tr>';
        }

        if (approvedTable) {
            approvedTable.innerHTML = approved.length ? approved.map(mod => `
                <tr>
                    <td>${mod.name}</td>
                    <td>${mod.email}</td>
                    <td>
                        <button class="btn-action delete" onclick="CMS.delete('approved_mods', '${mod.id}')">Remove Access</button>
                    </td>
                </tr>
            `).join('') : '<tr><td colspan="3">No approved moderators listed.</td></tr>';
        }
    },

    approveMod: async (id, email, name) => {
        const success = await CMS.save('approved_mods', { email, name });
        if (success) {
            await clientDB.from('pending_mods').delete().eq('id', id);
            CMS.loadModerators();
        }
    },

    logout: async () => {
        await clientDB.auth.signOut();
        window.location.href = 'login.html';
    }
};

// --- Execution ---
document.addEventListener('DOMContentLoaded', () => {
    CMS.updateDashboardStats();
    if (document.getElementById('pendingModsTable')) {
        CMS.loadModerators();
    }
});