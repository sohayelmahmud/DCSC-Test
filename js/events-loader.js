/**
 * Events Loader for Dhaka College Science Club
 * Fetches and displays event data from Supabase Cloud.
 */

// Supabase Configuration
const SUPABASE_URL = 'https://kspvcganucjolmrdpudb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-C1y_mIZSLQbRvLe0ZUxgA_EOBO7DL_';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
});

async function loadEvents() {
    const eventsContainer = document.querySelector('.card-grid');
    if (!eventsContainer) return;

    // Show loading state
    eventsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Loading events...</p>';

    try {
        // Fetch events from Supabase
        const { data: events, error } = await supabaseClient
            .from('events')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;

        // Clear container after fetching
        eventsContainer.innerHTML = '';

        if (!events || events.length === 0) {
            eventsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No events found.</p>';
            return;
        }

        // Render events
        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'card';

            const imageHtml = event.image_url
                ? `<img src="${event.image_url}" alt="${event.title}" style="width: 100%; height: 200px; object-fit: cover;">`
                : '<div class="card-image">Event Image</div>';

            const descriptionPreview = event.description
                ? event.description.substring(0, 150) + (event.description.length > 150 ? '...' : '')
                : 'No description available';

            eventCard.innerHTML = `
                ${imageHtml}
                <div class="card-content">
                    <h3>${event.title}</h3>
                    <p>${descriptionPreview}</p>
                    <div class="card-meta">
                        <span>📅 ${new Date(event.date).toLocaleDateString()}</span>
                        <span>📍 ${event.location || 'TBD'}</span>
                    </div>
                </div>
            `;

            eventsContainer.appendChild(eventCard);
        });

    } catch (err) {
        console.error('Error loading events:', err.message);
        eventsContainer.innerHTML = '<p style="color: red; text-align: center;">Failed to load event data.</p>';
    }
}
