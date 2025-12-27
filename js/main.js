/**
 * Main Logic for Dhaka College Science Club
 * Handles Mobile Menu, Accordions, and Supabase Data Sync.
 */

// 1. Supabase Configuration (Consistent with your other files)
const SUPABASE_URL = 'https://kspvcganucjolmrdpudb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-C1y_mIZSLQbRvLe0ZUxgA_EOBO7DL_';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // --- Accordion Logic ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const isActive = accordionItem.classList.contains('active');

            // Close all other items
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });

            // If it wasn't active before, make it active
            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });
});

// --- Frontend Data Sync Helper (Async Version) ---
/**
 * Fetches CMS data from Supabase Cloud Database.
 * @param {string} type - 'members', 'blogs', 'events'
 * @returns {Promise<Array>} - Promise resolving to an array of objects
 */
async function getCMSData(type) {
    try {
        const { data, error } = await supabaseClient
            .from(type.toLowerCase()) // Automatically matches table name
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error(`Error fetching ${type}:`, err.message);
        return [];
    }
}