import "dotenv/config";
import Queue from "./lib/Queue";

Queue.process();
console.log(`Processing queue(s) ${Queue.queues.map(q => q.name).join(", ")}`);
