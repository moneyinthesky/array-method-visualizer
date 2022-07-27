import { configBuilder } from './config.js'
import { waitingAsyncEventListener } from './async-events.js'
import { ArrayDrawer } from './array-drawer.js'

let array = ['apple', 'orange', 'banana'];
let mapFunction = value => value.toUpperCase();
let filterFunction = value => value.length === 6;

const config = configBuilder(array);

drawPanel(1);
runAnimation('map', 1);

drawPanel(2);
runAnimation('filter', 2);

function drawPanel(id) {
    let draw = SVG().addTo('body').size(config.frameWidth, config.frameHeight).attr({ style: 'margin-bottom: 10px'});
    let drawer = new ArrayDrawer(draw, config);

    let frameGroup = draw.group().id(`frame${id}`);
    frameGroup.add(draw.rect(config.frameWidth, config.frameHeight).fill(config.backgroundColor).attr({ rx: 10 }));
    frameGroup.add(drawer.buildArrayGroup(array, `movingArray${id}`, 0));
    frameGroup.add(drawer.buildArrayGroup(array, `staticArray${id}`));
}

async function runAnimation(mode, id) {
    let movingArray = SVG(document.getElementById(`movingArray${id}`));
    let filteredElements = 0;
    for(let [index, element] of movingArray.children().entries()) {
        prepareMove(element, config.halfwayPosition, 0, 0);
        await triggerAnimation(element, 'animateHalfway', 'halfway');

        if(mode === 'map') {
            updateElementColor(element, config.mappedArrayColor);
            updateElementText(element);

            prepareMove(element, config.endPosition, 0, config.halfwayPosition);
            await triggerAnimation(element, 'animateMap', 'map');
        } else if(mode === 'filter') {
            let tSpan = element.children()[1].children();
            let currentValue = tSpan.text()[0];
            if(filterFunction(currentValue)) {
                updateElementColor(element, config.mappedArrayColor);
                updateElementIndex(element, filteredElements);

                prepareMove(element, config.endPosition, -((index - filteredElements) * (config.elementSize + config.elementSpacing)), config.halfwayPosition);
                await triggerAnimation(element, 'animateMap', 'map');
                filteredElements++;
            } else {
                updateElementColor(element, config.filteredOutColor);
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
    let event = await waitingAsyncEventListener(
        'animationend', 
        event => SVG(event.target) === node && event.animationName === keyframe
    );
    return event;
}

function transformTextNode(node, newValue) {
    node.children()[0].text(newValue);

    let x = node.children()[0].attr().relativeX;
    let xPosition = (config.elementSize - (newValue.length * 9.6)) / 2;
    node.children()[0].attr({
        x: x + xPosition
    });
}
