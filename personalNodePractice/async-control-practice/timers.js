// Asynchronous Task scheduling and event loop execution demo
// Visualize how Node.js Event loop schedules and executes 
// synchronous code first, followed by asynchronous callbacks (like timers)

console.log(`1. Start of program (Synchronous)`);

// Use setTimeout to schedule a function to run LATER (after 2000 miliseconds)(2s)
setTimeout(() => {
    // 3. callback function 
    console.log(`3. Timer expired (Asynchronous callback executed).`);
}, 2000);


setTimeout(() => {
    // 4. callback function also runs later 
    console.log(`4. Zero-delay timer runs (Asynchronous, but queued)`);
}, 0)

// 2. this runs immediately after the timers are registered 
console.log(`2. Program continues running (non-blocking).`);


