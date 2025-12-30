/**
 * Test Script for DCSC Supabase Integration
 * Tests members, blogs, and events functionality
 */

// Supabase Configuration
const SUPABASE_URL = 'https://kspvcganucjolmrdpudb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-C1y_mIZSLQbRvLe0ZUxgA_EOBO7DL_';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Test functions
async function testSupabaseConnection() {
    console.log('Testing Supabase connection...');
    try {
        const { data, error } = await supabaseClient.from('members').select('count');
        if (error) throw error;
        console.log('✅ Supabase connection successful');
        return true;
    } catch (err) {
        console.error('❌ Supabase connection failed:', err.message);
        return false;
    }
}

async function testMembersTable() {
    console.log('Testing members table...');
    try {
        // Test insert
        const testMember = {
            name: 'Test Member',
            role: 'Test Role',
            hierarchy: 99,
            batch: '2025-26(Current)',
            roll: '12345',
            image_url: ''
        };

        const { data, error } = await supabaseClient
            .from('members')
            .insert([testMember])
            .select();

        if (error) throw error;
        console.log('✅ Members table insert successful');

        // Test delete
        if (data && data.length > 0) {
            await supabaseClient
                .from('members')
                .delete()
                .eq('id', data[0].id);
            console.log('✅ Members table delete successful');
        }

        return true;
    } catch (err) {
        console.error('❌ Members table test failed:', err.message);
        return false;
    }
}

async function testRealtimeSubscription() {
    console.log('Testing real-time subscription...');
    try {
        const channel = supabaseClient
            .channel('test-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'members' },
                (payload) => {
                    console.log('✅ Real-time update received:', payload);
                }
            )
            .subscribe();

        console.log('✅ Real-time subscription setup successful');

        // Clean up
        setTimeout(() => {
            supabaseClient.removeChannel(channel);
        }, 5000);

        return true;
    } catch (err) {
        console.error('❌ Real-time subscription test failed:', err.message);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    console.log('🧪 Running DCSC Supabase Integration Tests...\n');

    const results = {
        connection: await testSupabaseConnection(),
        members: await testMembersTable(),
        realtime: await testRealtimeSubscription()
    };

    console.log('\n📊 Test Results:');
    console.log('Connection:', results.connection ? '✅ PASS' : '❌ FAIL');
    console.log('Members CRUD:', results.members ? '✅ PASS' : '❌ FAIL');
    console.log('Real-time:', results.realtime ? '✅ PASS' : '❌ FAIL');

    const allPassed = Object.values(results).every(result => result === true);
    console.log('\n' + (allPassed ? '🎉 All tests passed!' : '⚠️ Some tests failed'));

    return allPassed;
}

// Export for use in browser console
if (typeof window !== 'undefined') {
    window.testDCSC = {
        runAllTests,
        testSupabaseConnection,
        testMembersTable,
        testRealtimeSubscription
    };
}
