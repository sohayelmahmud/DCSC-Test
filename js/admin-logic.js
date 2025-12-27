/**
 * Admin Logic for Dhaka College Science Club CMS
 * Handles Cloud CRUD operations using Supabase.
 */

// 1. Supabase Configuration
const SUPABASE_URL = 'https://kspvcganucjolmrdpudb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-C1y_mIZSLQbRvLe0ZUxgA_EOBO7DL_';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const CMS = {
    // --- Generic Helpers for Database Operations ---

    /**
     * Fetch all records from a specific table
     * @param {string} table - Name of the database table
     */
    get: async (table) => {
        try {
            const { data, error } = await supabase
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
     * Create or Update a record in a table
     * @param {string} table - Name of the database table
     * @param {Object} formData - Data object to be saved
     */
    save: async (table, formData) => {
        try {
            let result;
            if (formData.id) {
                // If ID exists, perform an Update operation
                result = await supabase
                    .from(table)
                    .update(formData)
                    .eq('id', formData.id);
            } else {
                // If no ID, perform an Insert operation
                result = await supabase
                    .from(table)
                    .insert([formData]);
            }

            if (result.error) throw result.error;
            alert("Success! Data synchronized with cloud database.");
            return true;
        } catch (err) {
            alert("Operation failed: " + err.message);
            return false;
        }
    },

    /**
     * Delete a record from a table
     * @param {string} table - Name of the database table
     * @param {string|number} id - Unique ID of the record
     */
    delete: async (table, id) => {
        if (!confirm('Are you sure you want to delete this record permanently?')) return;
        try {
            const { error } = await supabase
                .from(table)
                .delete()
                .eq('id', id);

            if (error) throw error;
            alert("Record deleted successfully.");
            location.reload(); // Refresh to update the UI
        } catch (err) {
            alert("Delete failed: " + err.message);
        }
    },

    // --- Dashboard Analytics ---
    updateDashboardStats: async () => {
        const events = await CMS.get('events');
        const blogs = await CMS.get('blogs');
        const members = await CMS.get('members');

        const eventCountEl = document.getElementById('stat-events');
        const blogCountEl = document.getElementById('stat-blogs');
        const memberCountEl = document.getElementById('stat-members');

        if (eventCountEl) eventCountEl.textContent = events.length;
        if (blogCountEl) blogCountEl.textContent = blogs.length;
        if (memberCountEl) memberCountEl.textContent = members.length;
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

    /**
     * Approve a moderator by moving data from pending to approved table
     */
    approveMod: async (id, email, name) => {
        const success = await CMS.save('approved_mods', { email, name });
        if (success) {
            // Delete from pending table after successful approval
            await supabase.from('pending_mods').delete().eq('id', id);
            CMS.loadModerators();
        }
    },

    /**
     * Handle user logout and session cleanup
     */
    logout: () => {
        localStorage.removeItem('dcsc_auth_session');
        window.location.href = 'login.html';
    }
};

// --- Execution & Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // Initial UI synchronization
    CMS.updateDashboardStats();

    // Check if current page is the Moderator Management page
    if (document.getElementById('pendingModsTable')) {
        CMS.loadModerators();
    }
});