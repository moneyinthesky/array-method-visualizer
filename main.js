let mode = 'filter'
let array = ['apple', 'orange', 'banana'];
let mapFunction = value => value.toUpperCase();
let filterFunction = value => value.startsWith('o');

// ===== configuration =====
const FRAME_WIDTH = 800;
const BEZEL_WIDTH = 25;
const ELEMENT_SIZE = 100;
const ELEMENT_SPACING = 10;

const BACKGROUND_COLOR = '#90A4AE';
const ARRAY_COLOR = '#4DD0E1';
const MAPPED_ARRAY_COLOR = '#81C784';
const FILTERED_OUT_COLOR = '#E57373';

const FRAME_HEIGHT = (BEZEL_WIDTH * 2) + (array.length * ELEMENT_SIZE) + ((array.length - 1) * ELEMENT_SPACING);
const END_POSITION = FRAME_WIDTH - ELEMENT_SIZE - (BEZEL_WIDTH * 2);
const HALFWAY_POSITION = (END_POSITION - BEZEL_WIDTH) / 2;
// ===== configuration =====

let draw = SVG().addTo('body').size(FRAME_WIDTH, FRAME_HEIGHT).fill("none");
draw.rect(FRAME_WIDTH, FRAME_HEIGHT).attr({ fill: '#1E1E1E' });

let frameGroup = draw.group().id('frame');
frameGroup.add(draw.rect(FRAME_WIDTH, FRAME_HEIGHT).fill(BACKGROUND_COLOR));
let movingArray = buildArrayGroup(array, 'movingArray', 0);
frameGroup.add(movingArray);
frameGroup.add(buildArrayGroup(array, 'staticArray'));

runAnimation();

async function runAnimation() {
    let filteredElements = 0;
    for(let [index, element] of movingArray.children().entries()) {
        prepareMove(element, HALFWAY_POSITION, 0, 0);
        await triggerAnimation(element, 'animateHalfway', 'halfway');

        if(mode === 'map') {
            updateElementColor(element, MAPPED_ARRAY_COLOR);
            updateElementText(element);
    
            prepareMove(element, END_POSITION, 0, HALFWAY_POSITION);
            await triggerAnimation(element, 'animateMap', 'map');
        } else if(mode === 'filter') {
            let tSpan = element.children()[1].children();
            let currentValue = tSpan.text()[0];
            if(filterFunction(currentValue)) {
                updateElementColor(element, MAPPED_ARRAY_COLOR);
                updateElementIndex(element, filteredElements);
    
                prepareMove(element, END_POSITION, -((index - filteredElements) * (ELEMENT_SIZE + ELEMENT_SPACING)), HALFWAY_POSITION);
                await triggerAnimation(element, 'animateMap', 'map');
                
                filteredElements++;
            } else {
                updateElementColor(element, FILTERED_OUT_COLOR);
            }
        }
    }
}

function prepareMove(element, x, y, startX) {
    element.attr({ style: `--moveX: ${x}px; --moveY: ${y}px; --startX: ${startX}px` });
}

function updateElementText(element) {
    let tSpan = element.children()[1].children();
    let currentValue = tSpan.text()[0];

    transformTextNode(element.children()[1], String(mapFunction(currentValue)));
}

function updateElementIndex(element, newIndex) {
    transformTextNode(element.children()[2], String(newIndex));
}

function updateElementColor(element, newColor) {
    let container = element.children()[0];
    container.fill(newColor);
}

async function triggerAnimation(node, animationClass, keyframe) {
    node.attr({ class: animationClass });
    return await waitingAsyncEventListener(
        'animationend', 
        event => SVG(event.target) === node && event.animationName === keyframe
    );
}

async function waitingAsyncEventListener(eventName, predicate) {
    let event;
    do {
        event = await asyncEventListener(eventName);
        setTimeout(() => {}, 10);
    } while(!predicate(event))
    return event;
}

async function asyncEventListener(eventName) {
    return new Promise(function(resolve) { 
        addEventListener(eventName, (event) => {
            resolve(event);
        });
    });
}

function buildArrayGroup(array, id, opacity = 1) {
    let arrayGroup = draw.group().id(id);
    array.forEach((element, index) => {
        let xPosition = BEZEL_WIDTH;
        let yPosition = BEZEL_WIDTH + (index * (ELEMENT_SIZE + ELEMENT_SPACING));
        arrayGroup.add(buildArrayElement(element, String(index), xPosition, yPosition, opacity));
    });
    return arrayGroup;
}

function buildArrayElement(value, index, x, y, opacity = 1) {
    let group = draw.group().id(`element${index}`).opacity(opacity).attr({ style: `--order: ${index}`});
    let container = draw.rect(ELEMENT_SIZE, ELEMENT_SIZE).id('container').fill(ARRAY_COLOR).attr({ x, y, rx: 10, stroke: 'black' });
    group.add(container);
    
    group.add(buildText(value, `value${index}`, x, y + 40));
    group.add(buildText(index, `index${index}`, x, y + 85));
    group.add(draw.line(x, y + 65, x + ELEMENT_SIZE, y + 65).stroke('black'));
    return group;
}

function buildText(value, id, x, y) {
    let xPosition = (ELEMENT_SIZE - (value.length * 9.6)) / 2;
    let textElement = draw.text(add => add.tspan(value).attr({ x: x + xPosition, y, relativeX: x }));
    textElement.id(id)
        .fill('black')
        .attr({ 
            style: 'white-space: pre', 
            'font-family': 'Courier New', 
            'font-size': 16, 
            'font-weight': 'bold', 
            'letter-spacing': '0em'
        });
    return textElement;
}

function transformTextNode(node, newValue) {
    node.children()[0].text(newValue);

    let x = node.children()[0].attr().relativeX;
    let xPosition = (ELEMENT_SIZE - (newValue.length * 9.6)) / 2;
    node.children()[0].attr({
        x: x + xPosition
    });
}
