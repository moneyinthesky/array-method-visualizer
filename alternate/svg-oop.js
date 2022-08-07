export class ArrayElementBuilder {
    constructor(svg, config) {
        this.svg = svg;
        this.config = config;

        this.draw();
    }

    draw(value, index) {
        let node = this.svg.nested().id(`element${index}`).size(this.config.elementSize, this.config.elementSize);
        node.add(this.svg.rect('100%', '100%')
            .id('container')
            .fill(this.config.arrayColor)
            .attr({ rx: 10, stroke: 'black' })
        );

        node.add(new TextBuilder(this.svg, this.config)
            .codeStyle()
            .centered(this.config.elementSize, this.config.elementSize * 0.65)
            .draw(value)
        );

        node.add(new TextBuilder(this.svg, this.config)
            .codeStyle()
            .centered(this.config.elementSize, this.config.elementSize * 0.35, 0, this.config.elementSize * 0.65)
            .draw(index)
        );
        
        
        // let linePosition = y + (this.config.elementSize * 0.65);
        // node.add(this.svg.line(x, linePosition, x + this.config.elementSize, linePosition).stroke('black'));
        return node;
    }
}

export class TextBuilder {
    constructor(svg, config) {
        this.svg = svg;
        this.config = config;
        this.attributes = {};
    }

    centered(containingWidth, containingHeight, xOffset, yOffset) {
        Object.assign(this.attributes, {
            'text-anchor': 'middle',
            'dominant-baseline': 'middle',
            x: containingWidth / 2 + (xOffset ? xOffset : 0),
            y: containingHeight / 2 + (yOffset ? yOffset : 0)
        });
        return this;
    }

    codeStyle() {
        Object.assign(this.attributes, {
            style: 'white-space: pre', 
            'font-family': 'Courier New', 
            'font-size': this.config.elementFontSize, 
            'font-weight': 'bold', 
            'letter-spacing': '0em',
        });
        return this;
    }

    draw(text) {
        return this.svg.text(text)
            .fill('black')
            .attr(this.attributes);
    }
}
