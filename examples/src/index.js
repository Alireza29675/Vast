const Vast = require('../../lib/index')
const vast = new Vast();

const circle = new Vast.Circle(10, 0, 0);
const rectangle = new Vast.Rectangle(100, 100);
vast.add(circle)
vast.add(rectangle)

const render = () => {
    requestAnimationFrame(render);
    writeInHelper();
    circle.position.x++;
}

const helper = document.querySelector('.helper');
const writeInHelper = () => {
    helper.innerHTML = `camera: ${ JSON.stringify(vast.camera) }, circle: ${ JSON.stringify(circle.position) }`;
}

render();

document.body.appendChild(vast.view);