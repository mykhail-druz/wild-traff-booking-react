// Simple test to verify BookingForm imports work
const fs = require('fs');
const path = require('path');

// Read the BookingForm file
const bookingFormPath = path.join(__dirname, 'src', 'components', 'Booking', 'BookingForm.jsx');
const content = fs.readFileSync(bookingFormPath, 'utf8');

// Check if the problematic import is gone
const hasOldImport = content.includes('HiExclamationTriangle');
const hasNewImport = content.includes('HiExclamationCircle');

console.log('=== BookingForm Import Test ===');
console.log('File path:', bookingFormPath);
console.log('Contains HiExclamationTriangle:', hasOldImport);
console.log('Contains HiExclamationCircle:', hasNewImport);

if (!hasOldImport && hasNewImport) {
    console.log('✅ SUCCESS: Import has been fixed correctly');
    console.log('The /bookings page should now load without the import error');
} else {
    console.log('❌ ISSUE: Import fix may not be complete');
    if (hasOldImport) console.log('- Still contains old import');
    if (!hasNewImport) console.log('- Missing new import');
}

// Check usage in JSX
const hasOldUsage = content.includes('<HiExclamationTriangle');
const hasNewUsage = content.includes('<HiExclamationCircle');

console.log('\n=== JSX Usage Test ===');
console.log('Contains <HiExclamationTriangle:', hasOldUsage);
console.log('Contains <HiExclamationCircle:', hasNewUsage);

if (!hasOldUsage && hasNewUsage) {
    console.log('✅ SUCCESS: JSX usage has been fixed correctly');
} else {
    console.log('❌ ISSUE: JSX usage fix may not be complete');
}

console.log('\n=== Overall Result ===');
if (!hasOldImport && hasNewImport && !hasOldUsage && hasNewUsage) {
    console.log('✅ ALL TESTS PASSED: The import error should be resolved');
} else {
    console.log('❌ SOME TESTS FAILED: There may still be issues');
}