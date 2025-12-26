document.addEventListener('DOMContentLoaded', () => {
    loadExecutiveMembers();
});

function loadExecutiveMembers() {
    const members = getCMSData('members');

    // Default placeholder SVG
    const defaultIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path fill="currentColor"
                d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4" />
        </svg>
    `;

    // Group containers
    const containers = {
        '2025-26(Current)': document.getElementById('members-2025-26(Current)'),
        '2024-25': document.getElementById('members-2024-25'),
        '2023-24': document.getElementById('members-2023-24'),
        '2022-23': document.getElementById('members-2022-23')
    };

    // Clear loading messages
    Object.values(containers).forEach(container => {
        if (container) container.innerHTML = '';
    });

    if (members.length === 0) {
        if (containers['2025-26(Current)']) {
            containers['2025-26(Current)'].innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No members found. Please add them from Dashboard.</p>';
        }
        return;
    }

    // Sort: Priority to Hierarchy (Ascending), then Name
    members.sort((a, b) => {
        const h1 = parseInt(a.hierarchy || 99);
        const h2 = parseInt(b.hierarchy || 99);
        if (h1 !== h2) return h1 - h2;
        return a.name.localeCompare(b.name);
    });

    members.forEach(member => {
        const batch = member.batch || '2025-26(Current)'; // Default batch
        const container = containers[batch];

        if (container) {
            const card = document.createElement('div');
            card.className = 'member-card';

            const role = member.role || 'Member';

            // Image handling (same as before)
            let imageSrc = member.image;
            if (!imageSrc) {
                imageSrc = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(member.name) + '&background=0D8ABC&color=fff&size=500';
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
}
