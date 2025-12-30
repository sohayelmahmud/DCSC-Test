/**
 * Shared Supabase Configuration
 * Centralized configuration for all DCSC project files
 */

// Supabase Configuration
const SUPABASE_CONFIG = {
    URL: 'https://kspvcganucjolmrdpudb.supabase.co',
    ANON_KEY: 'sb_publishable_-C1y_mIZSLQbRvLe0ZUxgA_EOBO7DL_'
};

// Create and export Supabase client
const supabaseClient = supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SUPABASE_CONFIG, supabaseClient };
}
