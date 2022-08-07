import { ArrayElementBuilder } from './svg-oop.js';
import { configBuilder } from './../config.js';

let array = ["apple", "orange", "banana"];
let config = configBuilder(array);

let svg = SVG().id('visualization').addTo('#container').size(config.frameWidth, config.totalFrameHeight);
svg.add(new ArrayElementBuilder(svg, config).draw('blah', 0));