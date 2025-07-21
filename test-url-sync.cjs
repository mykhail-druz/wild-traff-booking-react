// Test script to verify URL synchronization functionality
// This script will start the development server and test URL parameter handling

const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Testing URL synchronization functionality...\n');

// Test URLs to verify
const testUrls = [
  'http://localhost:5173/',
  'http://localhost:5173/?type=meeting-room',
  'http://localhost:5173/?type=equipment&sortBy=capacity&sortOrder=desc',
  'http://localhost:5173/?search=проектор&showOnlyAvailable=true',
  'http://localhost:5173/?type=workspace&search=робоче&sortBy=availability&sortOrder=desc&showOnlyAvailable=true'
];

console.log('📋 Test URLs that should work after implementation:');
testUrls.forEach((url, index) => {
  console.log(`${index + 1}. ${url}`);
});

console.log('\n🚀 Starting development server...');
console.log('Please manually test the following scenarios:');
console.log('1. Open the application in browser');
console.log('2. Apply different filters and check if URL updates');
console.log('3. Copy URL and open in new tab - filters should persist');
console.log('4. Test all filter combinations (type, search, sorting, availability)');
console.log('5. Share URLs with different filter combinations');

console.log('\n✅ Expected behavior:');
console.log('- URL should update when filters change');
console.log('- Filters should persist when page is refreshed');
console.log('- Shared URLs should maintain filter state');
console.log('- Default values should not appear in URL');

// Start the development server
const devServer = spawn('npm', ['run', 'dev'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true
});

devServer.on('error', (error) => {
  console.error('❌ Error starting development server:', error);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Stopping development server...');
  devServer.kill();
  process.exit(0);
});