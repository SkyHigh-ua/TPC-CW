export function bubbleSort(array) {
    const length = array.length;
    let isSwapped = false;
    for (let i = 0; i < length; i++) {
        isSwapped = false;
        for (let j = 0; j < length - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                const temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
                isSwapped = true;
            }
        }
        if (!isSwapped) {
            break;
        }
    }
    return array;
}
