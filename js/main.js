/**
 * Main Logic for Dhaka College Science Club
 * Handles Mobile Menu, Accordions, and Supabase Data Sync.
 */

// 1. Supabase Configuration (Using shared config)
const SUPABASE_URL = 'https://kspvcganucjolmrdpudb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzcHZjZ2FudWNqb2xtcmRwdWRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NjExNTAsImV4cCI6MjA4MjMzNzE1MH0.ktKtq9y9nX16lSxtqF9H4vdDIWNm1lLzaBosc3RlSyc';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Real-time subscriptions
let realtimeChannels = [];

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

    // Set up real-time listeners if on pages with dynamic content
    setupPageSpecificRealtime();
    setupBroadcastListener();
});

// Listen for updates from other tabs/windows
function setupBroadcastListener() {
    if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('dcsc-updates');
        channel.onmessage = (event) => {
            if (event.data.type === 'update') {
                console.log('Received update from another tab:', event.data.table);
                // Reload the specific table data
                switch (event.data.table) {
                    case 'members':
                        if (typeof loadExecutiveMembers === 'function') {
                            loadExecutiveMembers();
                        }
                        break;
                    case 'blogs':
                        if (typeof loadBlogs === 'function') {
                            loadBlogs();
                        }
                        break;
                    case 'events':
                        if (typeof loadEvents === 'function') {
                            loadEvents();
                        }
                        break;
                }
            }
        };
    }
}

// Setup real-time subscriptions based on current page
function setupPageSpecificRealtime() {
    const currentPath = window.location.pathname;

    // Clear existing subscriptions
    realtimeChannels.forEach(channel => {
        supabaseClient.removeChannel(channel);
    });
    realtimeChannels = [];

    // Page-specific real-time subscriptions
    if (currentPath.includes('executive.html') || currentPath.includes('index.html')) {
        subscribeToMembers();
    }

    if (currentPath.includes('blog.html') || currentPath.includes('index.html')) {
        subscribeToBlogs();
    }

    if (currentPath.includes('events.html') || currentPath.includes('index.html')) {
        subscribeToEvents();
    }
}

// Real-time subscription functions
function subscribeToMembers() {
    const channel = supabaseClient
        .channel('members-realtime')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'members' },
            (payload) => {
                console.log('Members table updated:', payload);
                // Reload members if the loader function exists
                if (typeof loadExecutiveMembers === 'function') {
                    loadExecutiveMembers();
                }
            }
        )
        .subscribe();
    realtimeChannels.push(channel);
}

function subscribeToBlogs() {
    const channel = supabaseClient
        .channel('blogs-realtime')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'blogs' },
            (payload) => {
                console.log('Blogs table updated:', payload);
                // Reload blogs if the function exists
                if (typeof loadBlogs === 'function') {
                    loadBlogs();
                }
            }
        )
        .subscribe();
    realtimeChannels.push(channel);
}

function subscribeToEvents() {
    const channel = supabaseClient
        .channel('events-realtime')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'events' },
            (payload) => {
                console.log('Events table updated:', payload);
                // Reload events if the function exists
                if (typeof loadEvents === 'function') {
                    loadEvents();
                }
            }
        )
        .subscribe();
    realtimeChannels.push(channel);
}

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