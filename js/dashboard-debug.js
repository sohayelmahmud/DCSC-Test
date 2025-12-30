/**
 * Dashboard Debug Script
 * Helps identify form submission issues
 */

// Debug function to check if everything is loaded
function debugDashboard() {
    console.log('=== DASHBOARD DEBUG ===');

    // Check if CMS object exists
    console.log('CMS object:', typeof CMS !== 'undefined' ? '✅ Found' : '❌ Not found');
    if (typeof CMS !== 'undefined') {
        console.log('CMS.save function:', typeof CMS.save === 'function' ? '✅ Found' : '❌ Not found');
    }

    // Check if form exists
    const form = document.getElementById('cmsForm');
    console.log('cmsForm element:', form ? '✅ Found' : '❌ Not found');

    if (form) {
        // Check form fields
        const typeField = document.getElementById('current-type');
        const idField = document.getElementById('edit-id');
        console.log('current-type field:', typeField ? '✅ Found' : '❌ Not found');
        console.log('edit-id field:', idField ? '✅ Found' : '❌ Not found');

        // Check if form has submit listener
        const listeners = getEventListeners ? getEventListeners(form) : 'Not available';
        console.log('Form event listeners:', listeners);
    }

    // Check Supabase client
    console.log('Supabase client:', typeof supabaseClient !== 'undefined' ? '✅ Found' : '❌ Not found');

    console.log('=== END DEBUG ===');
}

// Test form submission manually
function testFormSubmission() {
    console.log('=== TESTING FORM SUBMISSION ===');

    const form = document.getElementById('cmsForm');
    if (!form) {
        console.error('Form not found!');
        return;
    }

    // Set test values
    document.getElementById('current-type').value = 'members';
    document.getElementById('edit-id').value = '';

    // Create test form data
    const testEvent = new Event('submit', { bubbles: true, cancelable: true });
    console.log('Triggering form submission...');
    form.dispatchEvent(testEvent);
}

// Check form fields
function checkFormFields() {
    console.log('=== CHECKING FORM FIELDS ===');

    const inputs = document.querySelectorAll('#form-fields input, #form-fields textarea, #form-fields select');
    console.log('Found', inputs.length, 'form fields:');

    inputs.forEach((input, index) => {
        console.log(`${index + 1}. Name: "${input.name}", Type: "${input.type}", Value: "${input.value}"`);
    });

    console.log('=== END FIELD CHECK ===');
}

// Make functions available globally
window.debugDashboard = debugDashboard;
window.testFormSubmission = testFormSubmission;
window.checkFormFields = checkFormFields;

// Auto-run debug on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(debugDashboard, 2000);
});
