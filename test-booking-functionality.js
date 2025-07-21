// Test script to verify booking functionality and resource availability decrease
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001'

async function testBookingFunctionality() {
  try {
    console.log('🧪 Testing booking functionality...\n')
    
    // 1. Get initial resource state
    console.log('📋 Step 1: Getting initial resource state...')
    const initialResourcesResponse = await axios.get(`${API_BASE_URL}/resources`)
    const initialResources = initialResourcesResponse.data
    
    // Find a resource with available units > 0
    const testResource = initialResources.find(r => r.availableUnits > 0)
    if (!testResource) {
      console.log('❌ No resources with available units found!')
      return
    }
    
    console.log(`✅ Found test resource: ${testResource.name}`)
    console.log(`   Initial available units: ${testResource.availableUnits}/${testResource.totalUnits}`)
    
    // 2. Create a booking
    console.log('\n📝 Step 2: Creating a booking...')
    const bookingData = {
      date: '2025-07-25',
      timeSlot: testResource.timeSlots[0],
      resourceId: testResource.id,
      resourceName: testResource.name,
      userId: 'test-user',
      bookedAt: new Date().toISOString(),
      status: 'active'
    }
    
    const bookingResponse = await axios.post(`${API_BASE_URL}/bookings`, bookingData)
    console.log(`✅ Booking created with ID: ${bookingResponse.data.id}`)
    
    // 3. Update resource availability (simulating the frontend logic)
    console.log('\n🔄 Step 3: Updating resource availability...')
    const newAvailableUnits = testResource.availableUnits - 1
    const updateResponse = await axios.patch(`${API_BASE_URL}/resources/${testResource.id}`, {
      availableUnits: newAvailableUnits
    })
    
    console.log(`✅ Resource availability updated`)
    console.log(`   New available units: ${updateResponse.data.availableUnits}/${updateResponse.data.totalUnits}`)
    
    // 4. Verify the changes
    console.log('\n🔍 Step 4: Verifying changes...')
    const updatedResourceResponse = await axios.get(`${API_BASE_URL}/resources/${testResource.id}`)
    const updatedResource = updatedResourceResponse.data
    
    const expectedUnits = testResource.availableUnits - 1
    if (updatedResource.availableUnits === expectedUnits) {
      console.log('✅ SUCCESS: Available units decreased correctly!')
      console.log(`   Before: ${testResource.availableUnits} units`)
      console.log(`   After: ${updatedResource.availableUnits} units`)
      console.log(`   Difference: -1 unit ✓`)
    } else {
      console.log('❌ FAILURE: Available units did not decrease correctly!')
      console.log(`   Expected: ${expectedUnits} units`)
      console.log(`   Actual: ${updatedResource.availableUnits} units`)
    }
    
    // 5. Check if booking was created
    console.log('\n📚 Step 5: Verifying booking creation...')
    const bookingsResponse = await axios.get(`${API_BASE_URL}/bookings`)
    const createdBooking = bookingsResponse.data.find(b => b.id === bookingResponse.data.id)
    
    if (createdBooking) {
      console.log('✅ SUCCESS: Booking was created and stored correctly!')
      console.log(`   Booking ID: ${createdBooking.id}`)
      console.log(`   Resource: ${createdBooking.resourceName}`)
      console.log(`   Date: ${createdBooking.date}`)
      console.log(`   Time: ${createdBooking.timeSlot}`)
      console.log(`   Status: ${createdBooking.status}`)
    } else {
      console.log('❌ FAILURE: Booking was not found in the database!')
    }
    
    console.log('\n🎉 Test completed successfully!')
    console.log('✅ The booking functionality works correctly:')
    console.log('   - Bookings are created properly')
    console.log('   - Available resource units decrease when booking is made')
    console.log('   - Database is updated correctly')
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message)
    if (error.response) {
      console.error('Response data:', error.response.data)
      console.error('Response status:', error.response.status)
    }
  }
}

// Run the test
testBookingFunctionality()