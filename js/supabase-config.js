/**
 * Shared Supabase Configuration
 * Centralized configuration for all DCSC project files
 */

// Supabase Configuration
const SUPABASE_CONFIG = {
    URL: 'https://kspvcganucjolmrdpudb.supabase.co',
    ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzcHZjZ2FudWNqb2xtcmRwdWRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NjExNTAsImV4cCI6MjA4MjMzNzE1MH0.ktKtq9y9nX16lSxtqF9H4vdDIWNm1lLzaBosc3RlSyc'
};

// Create and export Supabase client
const supabaseClient = supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SUPABASE_CONFIG, supabaseClient };
}
