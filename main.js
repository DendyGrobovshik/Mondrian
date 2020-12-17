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

function setPalette() {
    let color1 = document.getElementById("color1").value;
    let color2 = document.getElementById("color2").value;
    let color3 = document.getElementById("color3").value;
    let color4 = document.getElementById("color4").value;
    let color5 = document.getElementById("color5").value;

    let distribution1 = parseInt(document.getElementById("distribution1").value);
    let distribution2 = parseInt(document.getElementById("distribution2").value);
    let distribution3 = parseInt(document.getElementById("distribution3").value);
    let distribution4 = parseInt(document.getElementById("distribution4").value);
    let distribution5 = parseInt(document.getElementById("distribution5").value);

    palette.colors = [color1, color2, color3, color4, color5];
    palette.distribution = [distribution1, distribution2, distribution3, distribution4, distribution5];
}

function setHyperparameters() {
    let saveColor = parseInt(document.getElementById("save-color-input").value);
    let stopChance = parseInt(document.getElementById("stop-input").value);
    let minDepth = parseInt(document.getElementById("min-depth-input").value);
    let maxDepth = parseInt(document.getElementById("max-depth-input").value);
    let elongationCoefficient = parseInt(document.getElementById("elongation-input").value);
    let roundRate = parseInt(document.getElementById("round-rate-input").value);
    let marginRate = parseInt(document.getElementById("margin-rate-input").value);

    hyps.saveColorChance = saveColor;
    hyps.stopChance = stopChance;
    hyps.minDepth = minDepth;
    hyps.maxDepth = maxDepth;
    hyps.elongationCoefficient = elongationCoefficient;
    hyps.roundRate = roundRate;
    hyps.marginRate = marginRate;
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