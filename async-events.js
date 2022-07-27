export async function waitingAsyncEventListener(eventName, predicate) {
    let event;
    do {
        event = await asyncEventListener(eventName);
        setTimeout(() => {}, 10);
    } while(!predicate(event))
    return event;
}

export async function asyncEventListener(eventName) {
    return new Promise(function(resolve) { 
        addEventListener(eventName, (event) => {
            resolve(event);
        });
    });
}
