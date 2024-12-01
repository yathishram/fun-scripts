//Core logic is to push the max to the last

function bubbleSort(nums) {
    let n = nums.length

    if(nums === 0 | nums === 1) {
        return nums
    }

    // Step 1: Loop through until n becomes 1
    while(n !== 1) {
        //Let's loop through start to n
        for(let i=0;i<=n;i++) {
            if(nums[i] > nums[i+1]) {
                // Swap
                [nums[i], nums[i+1]] = [nums[i+1], nums[i]]
            }
        }
        n--
    }


    return nums
}

const data = [7, 4, 1, 5, 3]

console.log(bubbleSort(data))