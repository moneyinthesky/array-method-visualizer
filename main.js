import { configBuilder } from './config.js'
import { waitingAsyncEventListener } from './async-events.js'
import { ArrayDrawer } from './array-drawer.js'

let array = ['apple', 'orange', 'banana'];
let mapFunction = value => value.toUpperCase();
let filterFunction = value => value.startsWith('o');

const config = configBuilder(array);

drawPanel(1, mapFunction);
runAnimation('map', 1);

// drawPanel(2, filterFunction);
// runAnimation('filter', 2);

function drawPanel(id, methodFunction) {
    let draw = SVG().addTo('body').size(config.frameWidth, config.totalFrameHeight).attr({ style: 'margin-bottom: 10px'});
    let drawer = new ArrayDrawer(draw, config);

    let frameGroup = draw.group().id(`frame${id}`);
    frameGroup.add(draw.rect(config.frameWidth, config.totalFrameHeight).fill(config.backgroundColor).attr({ rx: 10 }));

    frameGroup.add(draw.rect(config.arrayPanelWidth, config.totalFrameHeight).fill('#4DD0E1').attr({ x: 0, y: 0, rx: 10, stroke: '#0097A7', 'fill-opacity': 0.25 }));
    frameGroup.add(buildText(draw, 'Original Array', config.arrayPanelWidth, config.infoFrameHeight, 0, config.totalFrameHeight - config.infoFrameHeight));
    frameGroup.add(drawer.buildArrayGroup(array, `staticArray${id}`));
    
    frameGroup.add(draw.rect(config.arrayPanelWidth, config.totalFrameHeight).fill('#81C784').attr({ x: config.frameWidth - config.arrayPanelWidth, y: 0, rx: 10, stroke: '#388E3C', 'fill-opacity': 0.25 }));
    frameGroup.add(buildText(draw, 'New Array', config.arrayPanelWidth, config.infoFrameHeight, config.frameWidth - config.arrayPanelWidth, config.totalFrameHeight - config.infoFrameHeight));
    frameGroup.add(drawer.buildArrayGroup(array, `movingArray${id}`, 0));

    frameGroup.add(draw.line(0, config.arrayFrameHeight, config.frameWidth, config.arrayFrameHeight).stroke({ width: 2, color: '#455A64' }));

    frameGroup.add(draw.rect(config.infoBoxWidth, config.infoBoxHeight).fill('#FFF176').attr({ x: config.arrayPanelWidth + config.bezelWidth, y: config.arrayFrameHeight + config.bezelWidth, rx: 10, stroke: 'black', 'fill-opacity': 0.5 }));
    frameGroup.add(buildFunctionText(draw, methodFunction, config.infoBoxWidth, config.infoBoxHeight, config.arrayPanelWidth + config.bezelWidth, config.arrayFrameHeight + config.bezelWidth));
}

function buildText(draw, value, containingWidth, containingHeight, xOffset, yOffset) {
    return draw.text(value)
        .font({ family: 'Helvetica', size: 18 })
        .attr({ 
            x: containingWidth / 2 + xOffset, 
            y: containingHeight / 2 + yOffset,
            'text-anchor': 'middle',
            'dominant-baseline': 'middle'
        });
}

function buildFunctionText(draw, value, containingWidth, containingHeight, xOffset, yOffset) {
    let valueToShow = JSON.stringify(value, (key, val) => val + '');
    valueToShow = valueToShow.slice(1, valueToShow.length - 1);
    return draw.text(add => add.tspan(valueToShow).attr({ x: containingWidth / 2 + xOffset, y: containingHeight / 2 + yOffset }))
        .fill('black')
        .attr({ 
            style: 'white-space: pre', 
            'font-family': 'Courier New', 
            'font-size': 16, 
            'font-weight': 'bold', 
            'letter-spacing': '0em',
            'text-anchor': 'middle',
            'dominant-baseline': 'middle'
        });
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
