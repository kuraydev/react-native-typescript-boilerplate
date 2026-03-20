<img alt="React Native Typescript Boilerplate" src="../assets/logo.png" width="1050"/>

# 🎃 Event Emitter Usage

You can emit and listen the specific events with `EventEmitter.emit` and `EventEmitter.on` methods. For more usages and documentation: 
### [Events Documentation](https://github.com/browserify/events)

### Event Emit

```jsx
import EventEmitter from "@services/event-emitter";

// Second parameter can be anything; object, string, boolean, etc...
EventEmitter.emit("MESSAGE_RECEIVED", "Event emitter message, this can be object or anything")
```

### Event Listener

```jsx
import EventEmitter from "@services/event-emitter";

// Second parameter can be anything; object, string, boolean, etc...
EventEmitter.on("MESSAGE_RECEIVED", (message: string) => {
  console.log("Event Emitter Data: ", message)
});
```

