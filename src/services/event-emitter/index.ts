import { EventEmitter } from "events";

// Initialization
const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(50);
// Export the module
export default eventEmitter;
