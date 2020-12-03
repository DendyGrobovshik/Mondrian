"use strict";

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

function roundMultiple(number, roundRate) {
    return (Math.round(number / roundRate) * roundRate);
}

class Palette {
    constructor(colors, distribution) {
        this.colors = colors;
        this.distribution = distribution;
        this.strokeColor = "#000000";
    }

    getRandomColor() {
        let sum = 0;
        for (const value of this.distribution) {
            sum += value;
        }
        let index = randomInteger(0, sum - 1);
        let pointer = 0;
        while (index > this.distribution[pointer]) {
            index -= this.distribution[pointer];
            pointer++;
        }
        return this.colors[pointer];
    }
}

// Somewhat similar to bauhaus
const palette = new Palette(
    ["#ffffff", "#000000", "#be1e2d", "#ffde17", "#21409a"],
    [19, 1, 6, 6, 6]);

let hyps = {
    saveColorChance: 30,
    stopChance: 20,
    minDepth: 2,
    maxDepth: 5,
    elongationCoefficient: 4,
    roundRate: 1,
    marginRate: 4,
    strokeSize: 10
}


class Square {
    constructor(x, y, xLength, yLength, color, depth = 0) {
        this.x = x;
        this.y = y;
        this.xLength = xLength;
        this.yLength = yLength;
        this.color = color;
        this.depth = depth;

        this.isLeaf = true;
        this.children = [];
    }

    getNewColor() {
        let newColor;
        if (randomInteger(0, 100) < hyps.saveColorChance && this.color !== undefined) {
            newColor = this.color;
        } else {
            newColor = palette.getRandomColor();
        }
        return newColor;
    }

    createFragmentation(type = "HORIZONTAL") {
        // Stop criteria
        if (this.depth > hyps.maxDepth
            || this.xLength * hyps.elongationCoefficient < this.yLength
            || this.yLength * hyps.elongationCoefficient < this.xLength
            || (this.depth > hyps.minDepth && randomInteger(0, 100) < hyps.stopChance)) {
            return;
        }
        // Split current rectangle into 2
        this.split(type, this.getNewColor(), this.getNewColor());
        // Recursive call
        let newType = type === "HORIZONTAL" ? "VERTICAL" : "HORIZONTAL";
        for (const child of this.children) {
            child.createFragmentation(newType);
        }
    }

    split(type, color1, color2) {
        this.isLeaf = false;
        let xMiddle = this.x;
        let yMiddle = this.y;
        let xEnd = this.xLength;
        let yEnd = this.yLength;
        // Define boundary points
        if (type === "HORIZONTAL") {
            const minSpace = this.yLength / hyps.marginRate;
            yMiddle = randomInteger(this.y + minSpace, this.y + this.yLength - minSpace);
            yMiddle = roundMultiple(yMiddle, hyps.roundRate);
            yEnd = yMiddle;
        } else if (type === "VERTICAL") {
            const minSpace = this.xLength / hyps.marginRate;
            xMiddle = randomInteger(this.x + minSpace, this.x + this.xLength - minSpace);
            xMiddle = roundMultiple(xMiddle, hyps.roundRate);
            xEnd = xMiddle;
        }
        // Creating children
        this.children.push(new Square(
            this.x
            , this.y
            , xEnd
            , yEnd
            , color1, this.depth + 1));

        this.children.push(new Square(
            xMiddle
            , yMiddle
            , this.x + this.xLength - xMiddle,
            this.y + this.yLength - yMiddle,
            color2, this.depth + 1));
    }

    getElements() {
        if (this.isLeaf) {
            return [{
                x: this.x,
                y: this.y,
                width: this.xLength,
                height: this.yLength,
                fill: this.color,
                stroke: palette.strokeColor,
                "stroke-width": hyps.strokeSize
            }];
        } else {
            let result = [];
            for (let child of this.children) {
                result.push(child.getElements());
            }
            return result.flat();
        }
    }
}