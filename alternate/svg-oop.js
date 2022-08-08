export class ArrayElementBuilder {
    constructor(svg, size, color, borderColor) {
        this.svg = svg;
        this.size = size;
        this.color = color;
        this.borderColor = borderColor;

        this.dividerPosition = 0.65;
    }

    draw(value, index) {
        let node = this.svg.nested().id(`element${index}`).size(this.size, this.size);
        node.add(this.svg.rect('100%', '100%')
            .id('container')
            .fill(this.color)
            .attr({ rx: 10, stroke: this.borderColor })
        );

        node.add(new TextBuilder(this.svg, this.size)
            .codeStyle()
            .centered(this.size, this.size * this.dividerPosition)
            .draw(value)
        );

        node.add(new TextBuilder(this.svg, this.size)
            .codeStyle()
            .centered(this.size, this.size * (1 - this.dividerPosition), 0, this.size * this.dividerPosition)
            .draw(index)
        );
        
        node.add(this.svg.line(
            0, 
            this.size * this.dividerPosition,
            this.size, 
            this.size * this.dividerPosition).stroke(this.borderColor)
        );

        return node;
    }
}

export class TextBuilder {
    constructor(svg, size) {
        this.svg = svg;
        this.size = size;
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
            'font-size': this.size / 6, 
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
