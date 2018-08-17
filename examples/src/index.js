const Vast = require('../../lib/index')
const vast = new Vast();

vast.add(new Vast.Circle(10, 0, 0))

const render = () => {
    requestAnimationFrame(render);
    vast.camera.x++;
}

render();

document.body.appendChild(vast.view);