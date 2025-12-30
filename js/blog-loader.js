/**
 * Blog Loader for Dhaka College Science Club
 * Fetches and displays blog data from Supabase Cloud.
 */

// Supabase Configuration
const SUPABASE_URL = 'https://kspvcganucjolmrdpudb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzcHZjZ2FudWNqb2xtcmRwdWRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NjExNTAsImV4cCI6MjA4MjMzNzE1MH0.ktKtq9y9nX16lSxtqF9H4vdDIWNm1lLzaBosc3RlSycL_';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
    loadBlogs();
});

async function loadBlogs() {
    const blogContainer = document.querySelector('.card-grid');
    if (!blogContainer) return;

    // Show loading state
    blogContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Loading blogs...</p>';

    try {
        // Fetch blogs from Supabase
        const { data: blogs, error } = await supabaseClient
            .from('blogs')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;

        // Clear container after fetching
        blogContainer.innerHTML = '';

        if (!blogs || blogs.length === 0) {
            blogContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No blog posts found.</p>';
            return;
        }

        // Render blog posts
        blogs.forEach(blog => {
            const blogCard = document.createElement('div');
            blogCard.className = 'card';

            const imageHtml = blog.image_url
                ? `<img src="${blog.image_url}" alt="${blog.title}" style="width: 100%; height: 200px; object-fit: cover;">`
                : '<div class="card-image">Blog Image</div>';

            const contentPreview = blog.content
                ? blog.content.substring(0, 150) + (blog.content.length > 150 ? '...' : '')
                : 'No content available';

            blogCard.innerHTML = `
                ${imageHtml}
                <div class="card-content">
                    <h3>${blog.title}</h3>
                    <p>${contentPreview}</p>
                    <div class="card-meta">
                        <span>By ${blog.author || 'Unknown'}</span>
                        <span>${new Date(blog.date).toLocaleDateString()}</span>
                    </div>
                </div>
            `;

            blogContainer.appendChild(blogCard);
        });

    } catch (err) {
        console.error('Error loading blogs:', err.message);
        blogContainer.innerHTML = '<p style="color: red; text-align: center;">Failed to load blog data.</p>';
    }
}
