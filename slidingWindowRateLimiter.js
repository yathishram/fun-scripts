
import moment from 'moment'

const configStore = {
    'key1' : { // Making 5req/second
        timeWindowSec: 1,
        capacity: 5
    }
}

const requestsStore = {
    'key1' : {
        // Map of number of requests served for the key per second
        // 1733069260 : 10
        // 1733069261 : 12
        // 1733069262 : 10
        //....
    }
}

async function getRateLimitConfig(key) {
    value = configStore[key]

    // Ideally we'll be getting the data from cache by fetching data from data store
    // Here we are assuming it to be in local constants

    return value
}


async function getCurrentWindow(key, startTime) {
    // Step 1: get the requests for the key from the requests store
    const requestsData = requestsStore[key]

    // Step 2: If no data for the key, we can assume it's a fresh start and no reqs were processed
    if(!requestsData) {
        return 0
    }

    //step 3: 
    // We'll get the requests for the key greater than the startTime and count the number of the req processed so far.
    // At same time we can delete the reqs which are held in the store before the startTimestamp to reduce memory footprint
    const totalReqsServed = 0
    for(const [timestamp, count] of Object.entries(requestsData)) {
        if(timestamp > startTime) {
            totalReqsServed += count
        } else {
            delete requestsData[timestamp]
        }
    }

    return totalReqsServed
}


async function registerReq(key, timestamp) {
    requestsStore[key][timestamp] += 1
}


// Put everything together

async function isAllowed(key) {

    startTimeStamp = moment().unix()

    // Step 1: Get the rate limit config for the key
    rateLimitConfig = await getRateLimitConfig(key)

    // Step 2: Get the current window requests served for the key
    currentWindowReqs = await getCurrentWindow(key, startTimeStamp - rateLimitConfig.timeWindowSec)

    // Step 3: Check if the current window requests are greater than the capacity
    // If yes, return false
    if(currentWindowReqs >= rateLimitConfig.capacity) {
        return false
    }

    // Step 4: Register the request
    await registerReq(key, startTimeStamp)
    return true
}