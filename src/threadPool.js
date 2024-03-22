import { Worker } from 'worker_threads';

export class ThreadPool {
  constructor(size, path) {
    this.size = size;
    this.workers = [];
    this.tasks = [];
    this.shuttingDown = false;

    for (let i = 0; i < size; i++) {
      this.workers.push(new Worker(path));
    }
  }

  execute(task, callback) {
    if (this.shuttingDown) {
        callback(new Error('ThreadPool is shutting down'));
        return;
    }
    if (this.workers.length === 0) {
      this.tasks.push({ task, callback });
    } else {
      const worker = this.workers.pop();
      worker.once('message', (result) => {
        callback(result);
        this.workers.push(worker);
        if (this.tasks.length > 0) {
          const { task, callback } = this.tasks.shift();
          this.execute(task, callback);
        }
      });
      worker.postMessage(task);
    }
  }

  submit(task) {
    return new Promise((resolve, reject) => {
      if (this.shuttingDown) {
        reject(new Error('ThreadPool is shutting down'));
        return;
      }

      if (this.workers.length === 0) {
        this.tasks.push({ task, resolve, reject });
      } else {
        const worker = this.workers.pop();
        const handleMessage = (result) => {
            worker.removeListener('message', handleMessage);
            resolve(result);
            this.workers.push(worker);
            if (this.tasks.length > 0) {
                const { task, resolve, reject } = this.tasks.shift();
                this.submit(task).then(resolve).catch(reject);
            }
        };
        worker.on('message', handleMessage);
        worker.postMessage(task);
      }
    });
  }

  async shutdown() {
    if (this.shuttingDown) {
      return Promise.resolve();
    }

    this.shuttingDown = true;
    const terminationPromises = this.workers.map(worker => new Promise((resolve, reject) => {
      worker.once('exit', () => resolve());
      worker.terminate();
    }));
    return Promise.all(terminationPromises).then(() => {
      this.workers = [];
    });
  }
}