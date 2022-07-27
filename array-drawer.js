export class ArrayDrawer {
    constructor(draw, config) {
        this.draw = draw;
        this.config = config;
    }

    buildArrayGroup(array, id, opacity = 1) {
        let arrayGroup = this.draw.group().id(id);
        array.forEach((element, index) => {
            let xPosition = this.config.bezelWidth;
            let yPosition = this.config.bezelWidth + (index * (this.config.elementSize + this.config.elementSpacing));
            arrayGroup.add(this.buildArrayElement(element, String(index), xPosition, yPosition, opacity));
        });
        return arrayGroup;
    }
    
    buildArrayElement(value, index, x, y, opacity = 1) {
        let group = this.draw.group().id(`element${index}`).opacity(opacity).attr({ style: `--order: ${index}`});
        let container = this.draw.rect(this.config.elementSize, this.config.elementSize).id('container').fill(this.config.arrayColor).attr({ x, y, rx: 10, stroke: 'black' });
        group.add(container);
        
        group.add(this.buildText(value, `value${index}`, x, y + 40));
        group.add(this.buildText(index, `index${index}`, x, y + 85));
        group.add(this.draw.line(x, y + 65, x + this.config.elementSize, y + 65).stroke('black'));
        return group;
    }
    
    buildText(value, id, x, y) {
        let xPosition = (this.config.elementSize - (String(value).length * 9.6)) / 2;
        let textElement = this.draw.text(add => add.tspan(value).attr({ x: x + xPosition, y, relativeX: x }));
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
}