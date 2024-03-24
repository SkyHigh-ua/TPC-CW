export function testSequential(array) {
    for (let i = 0; i < array.length-1; i++) {
        if(array[i] > array[i+1]) return false;
    }
    return true;
}

export function testParallel(array1, array2) {
    if (array1.length !== array2.length) {
        return false;
    }
    
    for (let i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }
    
    return true;
}