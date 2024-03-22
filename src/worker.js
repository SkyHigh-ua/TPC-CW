import { parentPort, workerData } from 'worker_threads';


parentPort.on('message', (task) => {
    const { array, start, end } = task;
    let swapped = false;
    
    for (let i = start; i < end; i++) {
        if (array[i] > array[i + 1]) {
            [array[i], array[i + 1]] = [array[i + 1], array[i]];
            swapped = true;
        }
    }
    
    parentPort.postMessage(swapped);
})