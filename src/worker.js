import { parentPort, workerData } from 'worker_threads';

const { array, start, end } = workerData;

if (array[start] > array[end]) {
    const temp = array[start];
    array[start] = array[end];
    array[end] = temp;
}

parentPort.postMessage('done');