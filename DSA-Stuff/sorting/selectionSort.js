// Core logic is `Select minimum and Swap` 

function selectionSort(dataArr) {
    const length = dataArr.length

    if(length === 0 || length === 1) {
        return dataArr
    }

    // Step 1: Loop from 0 to length-2 position
    for(let i=0;i<=length-2;i++) {
        // Step 2 we need to find the min value in the sub array from i pos to the last
        let min = i
        for(let j=i;j<=length-1;j++) {
            if(dataArr[j] < dataArr[min]) {
                min = j
            }
        }

        // Once we have the min value position, let's swap with ith location
        [dataArr[i], dataArr[min]] = [dataArr[min], dataArr[i]]
    }

    return dataArr
}

const data = [7, 4, 1, 5, 3]

console.log(selectionSort(data))

