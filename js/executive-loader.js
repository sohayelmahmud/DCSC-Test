/**
 * Executive Loader for Dhaka College Science Club
 * Fetches and displays member data from Supabase Cloud.
 */

// 1. Supabase Configuration (Ensure these match your other files)
const SUPABASE_URL = 'https://kspvcganucjolmrdpudb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzcHZjZ2FudWNqb2xtcmRwdWRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NjExNTAsImV4cCI6MjA4MjMzNzE1MH0.ktKtq9y9nX16lSxtqF9H4vdDIWNm1lLzaBosc3RlSyc';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
    loadExecutiveMembers();
    // Set up real-time subscription
    setupRealtimeSubscription();
});

// Real-time subscription for members table
function setupRealtimeSubscription() {
    const channel = supabaseClient
        .channel('members-changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'members' },
            (payload) => {
                console.log('Real-time update received:', payload);
                // Reload members when any change occurs
                loadExecutiveMembers();
            }
        )
        .subscribe();
}

async function loadExecutiveMembers() {
    // Group containers defined in your HTML
    const containers = {
        '2025-26(Current)': document.getElementById('members-2025-26(Current)'),
        '2024-25': document.getElementById('members-2024-25'),
        '2023-24': document.getElementById('members-2023-24'),
        '2022-23': document.getElementById('members-2022-23')
    };

    // Show loading state in containers
    Object.values(containers).forEach(container => {
        if (container) container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Loading members...</p>';
    });

    try {
        // 2. Fetch members from Supabase 'members' table
        const { data: members, error } = await supabaseClient
            .from('members')
            .select('*');

        if (error) throw error;

        // Clear containers after fetching
        Object.values(containers).forEach(container => {
            if (container) container.innerHTML = '';
        });

        if (!members || members.length === 0) {
            if (containers['2025-26(Current)']) {
                containers['2025-26(Current)'].innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No members found.</p>';
            }
            return;
        }

        // 3. Sort: Priority to Hierarchy (Ascending), then Name
        members.sort((a, b) => {
            const h1 = parseInt(a.hierarchy || 99);
            const h2 = parseInt(b.hierarchy || 99);
            if (h1 !== h2) return h1 - h2;
            return a.name.localeCompare(b.name);
        });

        // 4. Render Members to their respective batch containers
        members.forEach(member => {
            const batch = member.batch || '2025-26(Current)';
            const container = containers[batch];

            if (container) {
                const card = document.createElement('div');
                card.className = 'member-card';

                const role = member.role || 'Member';

                // Handle Profile Image or Avatar Placeholder
                let imageSrc = member.image_url; // Ensure column name is 'image_url' in Supabase
                if (!imageSrc) {
                    imageSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0D8ABC&color=fff&size=500`;
                }

                card.innerHTML = `
                    <div class="member-image-container">
                        <img src="${imageSrc}" alt="${member.name}" loading="lazy">
                    </div>
                    <div class="member-overlay">
                        <p class="member-role">${role}</p>
                        <h3 class="member-name">${member.name}</h3>
                        ${member.roll ? `<p class="member-roll">Roll: ${member.roll}</p>` : ''}
                    </div>
                `;

                container.appendChild(card);
            }
        });

    } catch (err) {
        console.error('Error loading members:', err.message);
        Object.values(containers).forEach(container => {
            if (container) container.innerHTML = '<p style="color: red; text-align: center;">Failed to load data.</p>';
        });
    }
}