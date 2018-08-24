const Vast = require('../../lib/index')
const vast = new Vast();

const circle = new Vast.Circle(10);
const circle2 = new Vast.Circle(20);
const rectangle = new Vast.Rectangle(100, 100);
const spiral = new Vast.Path();

spiral.color = '#888';
circle.color = 'rgba(200, 80, 80, 1)';
circle2.color = 'rgba(70, 160, 230, 0.8)'

vast.add(circle)
vast.add(circle2)
vast.add(spiral)

let time = 0;

const render = () => {
    requestAnimationFrame(render);
    time++;
    circle.position.x = Math.cos(time/10) * 40;
    circle.position.y = Math.sin(time/10) * 40;
    circle2.position.x = Math.sin(time/20) * 100;
    circle2.position.y = Math.cos(time/20) * 20;
    spiral.addPoint({ x: Math.sin(time/30) * time, y: Math.cos(time/30) * time})
}

// Drawing
let drawingPath = null;
window.addEventListener('mousedown', e => {
    drawingPath = new Vast.Path([{x: vast.__deCalcX(e.offsetX), y: vast.__deCalcY(e.offsetY)}]);
    drawingPath.smooth = true;
    vast.add(drawingPath)
})
window.addEventListener('mousemove', e => {
    if (drawingPath && !e.altKey) {
        drawingPath.addPoint({x: vast.__deCalcX(e.offsetX), y: vast.__deCalcY(e.offsetY)})
    }
})
window.addEventListener('mouseup', () => {
    drawingPath = null;
})

render();

document.body.appendChild(vast.view);