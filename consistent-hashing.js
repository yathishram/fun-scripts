const crypto = require('crypto');
const murmurhash = require('murmurhash3js')


class ConsistentHashing {

    // Step 1: Constructor to initialise
    constructor(replicas = 3) {
        this.replicas = replicas; // Number of replicas vNodes
        this.ring = new Map() // Hash ring
        this.nodes = new Set() // Nodes
    }

    // Step 2: Hash function to hash the key. We are using murmurhash3
    hash(key) {
        return murmurhash.x86.hash32(key)
    }


    // Step 3: Add node to the ring
    addNode(node) {
        // Step 3.1: Add node to the nodes set
        this.nodes.add(node)
        // Step 3.2: Add replicas to the ring and set the node for each replica by hashing the vNode key
        for(let i=0; i< this.replicas; i++) {
            const vNodeKey = `${node}-${i}`
            this.ring.set(this.hash(vNodeKey), node)
        }
        // Step 3.3: Sort the ring
        this._sortRing()
    }

    // Step 4: Remove node from the ring
    removeNode(node) {
        // Step 4.1: Remove node from the nodes set
        this.nodes.delete(node);
        // Step 4.2: Remove replicas from the ring by hashing the vNode key
        for(let i=0; i<this.replicas; i++) {
            const vNodeKey = `${node}-${i}`
            this.ring.delete(this.hash(vNodeKey))
        }

        // Step 4.3: Sort the ring
        this._sortRing()
    }

    // Step 5: Sort the ring
    // We use this function for easier lookup of the node for a given key which is in sorted order always
    _sortRing() {
        this.sortedKeys = Array.from(this.ring.keys()).sort()
    }

    // Step 6: Get the node for a given key
    getNode(key) {
        // Step 6.1: Hash the key
        const hashKey = this.hash(key)

        // Step 6.2: Iterate over the sorted keys and return the node for the first key which is greater than or equal to the hash of the key
        for(let sortedKey of this.sortedKeys) {
            if(hashKey <= sortedKey) {
                return this.ring.get(sortedKey)
            }
        }

        // Step 6.3: If the hash of the key is greater than all the keys in the ring, return the first node
        return this.ring.get(this.sortedKeys[0])
    }
}


const ch = new ConsistentHashing(3);

ch.addNode('db-node-1');
ch.addNode('db-node-2');
ch.addNode('db-node-3');

const keys = ['user1', 'user2', 'user3', 'user4', 'user5'];
keys.forEach(key => {
  console.log(`Key: ${key} stored in ${ch.getNode(key)}`);
});


console.log('\nRemoving db-node-2');
ch.removeNode('db-node-2');
keys.forEach(key => {
  console.log(`Key: ${key} now stored in ${ch.getNode(key)}`);
});

console.log('\nAdding db-node-4');
ch.addNode('db-node-4');
keys.forEach(key => {
  console.log(`Key: ${key} now stored in ${ch.getNode(key)}`);
});