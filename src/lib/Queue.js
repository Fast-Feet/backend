import Queue from "bull";
import jobs from "../app/jobs";
import redisConfig from "../config/redis";

const queues = Object.values(jobs).map(job => ({
  name: job.key,
  handle: job.handle,
  bull: new Queue(job.key, redisConfig),
}));

export default {
  queues,
  add(name, data) {
    const queue = this.queues.find(q => q.name === name);
    return queue.bull.add(data);
  },
  process() {
    this.queues.forEach(q => q.bull.process(q.handle));
  },
};
