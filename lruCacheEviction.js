class LRUCache {

    // Step 1: Initialize the cache with the capacity
    constructor(capacity) {
        this.capacity = capacity; // Capacity of the cache
        this.cache = new Map(); // Cache
    }


    // Step 2: Get the value for a given key
    get(key) {

        // Step 2.1: If the key is not present in the cache, return -1
        if(!this.cache.has(key)) {
            return -1
        }

        // Step 2.2: If the key is present in the cache, get the value and move it to the most recent position
        // to move it to the most recent position, we delete the key and set it again so that it is added to the end of the cache
        const value = this.cache.get(key)
        this.cache.delete(key)
        this.cache.set(key, value)

        return value
    }

    // Step 3: Put the value for a given key
    put(key, value) {

        // Step 3.1: If the key is present in the cache, delete the key
        if(this.cache.has(key)) {
            this.cache.delete(key)
        }

        // Step 3.2: Set the key and value in the cache
        this.cache.set(key, value)

        // Step 3.3: If the cache size exceeds the capacity, remove the least recently used key
        if(this.cache.size > this.capacity) {
            const oldestKey = this.cache.keys().next().value // Get the first key in the cache which is the least recently used key
            this.cache.delete(oldestKey) // Delete the least recently used key
        }
    }
}


const lruCache = new LRUCache(3); // Capacity of 3

lruCache.put(1, 'A');   // Cache: {1: 'A'}
lruCache.put(2, 'B');   // Cache: {1: 'A', 2: 'B'}
lruCache.put(3, 'C');   // Cache: {1: 'A', 2: 'B', 3: 'C'}
lruCache.get(1);        // Returns 'A' and moves it to the most recent position
lruCache.put(4, 'D');   // Cache exceeds capacity; removes least recently used (key 2), Cache: {3: 'C', 1: 'A', 4: 'D'}

console.log(lruCache.get(2)); // Returns -1 (2 was evicted)
console.log(lruCache.get(3)); // Returns 'C'