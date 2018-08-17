const Vast = require('../../lib/index')
const vast = new Vast();

const circle = new Vast.Circle(10, 0, 0);
circle.color = 'red'
vast.add(circle)

const render = () => {
    requestAnimationFrame(render);
    circle.x++;
}

render();

document.body.appendChild(vast.view);