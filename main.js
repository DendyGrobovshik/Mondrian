"use strict";

window.onload = function () {
    render();
    // Render button listener
    let renderButton = document.getElementById("render");
    renderButton.addEventListener("mousedown", render, false);
    // Save svg image button listener
    let saveButton = document.getElementById("save");
    saveButton.addEventListener("mousedown", saveSvg, false);
}

window.onresize = function (event) {
    render();
};

function getNode(attributes) {
    let node = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    for (let attribute in attributes) {
        node.setAttribute(attribute, attributes[attribute]);
    }
    return node
}

function getIntegerByIdOrSetDefault(id, defaultValue = 0) {
    let value = document.getElementById(id).value;
    if (/^[0-9]+$/.test(value)) {
        return parseInt(value);
    } else {
        document.getElementById(id).value = defaultValue;
        return defaultValue;
    }
}

function getColorAndDistributionById(id) {
    const color = document.getElementById("color" + id.toString()).value;
    let distribution = getIntegerByIdOrSetDefault("distribution" + id.toString());
    return [color, distribution];
}

function setPalette() {
    let [color1, distribution1] = getColorAndDistributionById(1);
    let [color2, distribution2] = getColorAndDistributionById(2);
    let [color3, distribution3] = getColorAndDistributionById(3);
    let [color4, distribution4] = getColorAndDistributionById(4);
    let [color5, distribution5] = getColorAndDistributionById(5);

    palette.colors = [color1, color2, color3, color4, color5];
    palette.distribution = [distribution1, distribution2, distribution3, distribution4, distribution5];
}

function setHyperparameters() {
    hyps.saveColorChance = getIntegerByIdOrSetDefault("save-color-input");
    hyps.stopChance = getIntegerByIdOrSetDefault("stop-input");
    hyps.minDepth = getIntegerByIdOrSetDefault("min-depth-input");
    hyps.maxDepth = getIntegerByIdOrSetDefault("max-depth-input");
    hyps.elongationCoefficient = getIntegerByIdOrSetDefault("elongation-input");
    hyps.roundRate = getIntegerByIdOrSetDefault("round-rate-input", 1);
    hyps.marginRate = getIntegerByIdOrSetDefault("margin-rate-input", 1);
}

function render() {
    let svg = document.getElementById("svg");
    // Clear canvas
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }
    // Setting palette and hyperparameters
    setPalette();
    setHyperparameters();
    // Setting width based on screen size
    let width = document.documentElement.clientWidth;
    width = width < 500 ? width : 500;
    svg.style.width = String(width);
    svg.style.height = String(width);
    svg.setAttribute("width", String(width));
    svg.setAttribute("height", String(width));
    // Creating new fragmentation
    let square = new Square(0, 0, width, width);
    square.createFragmentation();
    // Setting new tags into svg
    let elements = square.getElements();
    for (let element of elements) {
        let newOne = getNode(element);
        svg.appendChild(newOne);
    }
}

function saveSvg() {
    let svg = document.getElementById("svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    let svgData = svg.outerHTML;
    let preface = '<?xml version="1.0" standalone="no"?>\r\n';
    let svgBlob = new Blob([preface, svgData], {type: "image/svg+xml;charset=utf-8"});
    let svgUrl = URL.createObjectURL(svgBlob);
    let downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "Mondrian art";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}