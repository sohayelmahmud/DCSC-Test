document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const closeMenu = document.querySelector('.close-menu');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Accordion Logic
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

// --- Frontend Data Sync Helper ---
/**
 * Fetches CMS data from localStorage.
 * @param {string} type - 'members', 'blogs', 'events'
 * @returns {Array} - Array of objects
 */
function getCMSData(type) {
    const STORAGE_KEYS = {
        MEMBERS: 'dcsc_members',
        BLOGS: 'dcsc_blogs',
        EVENTS: 'dcsc_events'
    };
    const key = STORAGE_KEYS[type.toUpperCase()];
    return key ? JSON.parse(localStorage.getItem(key) || '[]') : [];
}
