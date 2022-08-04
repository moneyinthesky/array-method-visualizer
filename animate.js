import { waitingAsyncEventListener } from './async-events.js'

export function prepareMove(element, x, y, startX) {
    element.attr({ style: `--moveX: ${x}px; --moveY: ${y}px; --startX: ${startX}px` });
}

export function updateElementText(element, mapFunction, elementSize) {
    let tSpan = element.children()[1].children();
    let currentValue = tSpan.text()[0];

    transformTextNode(element.children()[1], String(mapFunction(currentValue)), elementSize);
}

export function updateElementIndex(element, newIndex, elementSize) {
    transformTextNode(element.children()[2], String(newIndex), elementSize);
}

export function updateElementColor(element, newColor) {
    let container = element.children()[0];
    container.fill(newColor);
}

export async function triggerAnimation(node, animationClass, keyframe) {
    node.attr({ class: animationClass });
    let event = await waitingAsyncEventListener(
        'animationend', 
        event => SVG(event.target) === node && event.animationName === keyframe
    );
    return event;
}

export function convertArrayElementToValue(node) {
    let y = node.children()[1].children()[0].attr().y;
    node.children()[1].children()[0].attr({
        y: y + 15
    });
}

function transformTextNode(node, newValue, elementSize) {
    node.children()[0].text(newValue);

    let x = node.children()[0].attr().relativeX;
    let xPosition = (elementSize - (newValue.length * 9.6)) / 2;
    node.children()[0].attr({
        x: x + xPosition
    });
}
