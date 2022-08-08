import { ArrayElementBuilder } from './svg-oop.js';
import { configBuilder } from './../config.js';

let array = ["apple", "orange", "banana"];
let config = configBuilder(array);

let svg = SVG().id('visualization').addTo('#container').size(config.frameWidth, config.totalFrameHeight);

new ArrayElementBuilder(svg, config.elementSize, config.arrayColor, '#00838F').draw('blah', 0);