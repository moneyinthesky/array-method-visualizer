export function updateElementText(element, mapFunction) {
    let tSpan = element.children()[1].children();
    let currentValue = tSpan.text()[0].trim();

    transformTextNode(element.children()[1], String(mapFunction(currentValue)));
}

export function updateElementIndex(element, newIndex) {
    transformTextNode(element.children()[2], String(newIndex));
}

export function updateElementColor(element, newColor) {
    let container = element.children()[0];
    container.fill(newColor);
}

export function convertArrayElementToValue(element) {
    element.children()[3].remove();
    element.children()[2].remove();

    let currentHeight = element.children()[0].attr('height');
    element.children()[0].animate(500, 250, 'now').attr({
        height: currentHeight * 0.65
    });
}

export function convertArrayIndexToValue(element) {
    element.children()[3].remove();
    element.children()[1].remove();

    let rect = element.children()[0];
    let currentHeight = rect.attr('height');
    let currentY = rect.attr('y');
    rect.animate(500, 250, 'now').attr({
        height: currentHeight * 0.35,
        y: currentY + (currentHeight * 0.65)
    });
}

function transformTextNode(node, newValue) {
    node.children()[0].text(newValue);
}
