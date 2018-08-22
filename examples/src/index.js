const Vast = require('../../lib/index')
const vast = new Vast();

const circle = new Vast.Circle(10, 0, 0);
const rectangle = new Vast.Rectangle(100, 100);
const path = new Vast.Path([{x: 0, y: 0}, {x: 4, y: 4}, {x: 6, y: 6}]);

vast.add(circle)
// vast.add(rectangle)
vast.add(path)

const render = () => {
    requestAnimationFrame(render);
    writeInHelper();
    circle.position.x++;
    circle.position.y++;
    // vast.camera.x++;
    // vast.camera.y++;
}

let drawingPath = null;
window.addEventListener('mousedown', e => {
    drawingPath = new Vast.Path([{x: vast.__deCalcX(e.offsetX), y: vast.__deCalcY(e.offsetY)}]);
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

const helper = document.querySelector('.helper');
const writeInHelper = () => {
    helper.innerHTML = `camera: ${ JSON.stringify(vast.camera) }, circle: ${ JSON.stringify(circle.position) }`;
}

render();

document.body.appendChild(vast.view);