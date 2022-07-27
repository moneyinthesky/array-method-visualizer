let config = {
    frameWidth: 800,
    bezelWidth: 25,
    elementSize: 100,
    elementSpacing: 10,

    backgroundColor: '#90A4AE',
    arrayColor: '#4DD0E1',
    mappedArrayColor: '#81C784',
    filteredOutColor: '#E57373',
};

export const configBuilder = array => {
    config.frameHeight = (config.bezelWidth * 2) + (array.length * config.elementSize) + ((array.length - 1) * config.elementSpacing);
    config.endPosition = config.frameWidth - config.elementSize - (config.bezelWidth * 2);
    config.halfwayPosition = ((config.endPosition - config.bezelWidth) / 2);

    return config;
};