const Vast = require('../../lib/index')
const vast = new Vast();

const circle = new Vast.Circle(10);
const circle2 = new Vast.Circle(20);
const rectangle = new Vast.Rectangle(100, 100);
const spiral = new Vast.Path();
const mainText = new Vast.Text('');
const secondText = new Vast.Text('');

secondText.position.y = 50;
secondText.size = 20;
secondText.color = 'rgba(0, 50, 80)'

const text1 = 'This is an example for Vast!';
for (let i = 0; i < text1.length; i++) {
    setTimeout(() => {
        mainText.text += text1[i]
    }, i * 50)
}

const text2 = 'Use holding [alt] button to drag the paper and read rest of the text: Vast is a package which designed to hold drawable objects in an infinite board, you can draw, throw stuff and do everything the fuck you want.'
for (let i = 0; i < text2.length; i++) {
    setTimeout(() => {
        secondText.text += text2[i]
    }, i * 50 + 3000)
}

spiral.color = '#AAA';
circle.color = 'rgba(200, 80, 80, 1)';
circle2.color = 'rgba(70, 160, 230, 0.8)'

vast.add(circle)
vast.add(circle2)
vast.add(spiral)
vast.add(mainText)
vast.add(secondText)

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
        console.log(drawingPath.export())
    }
})
window.addEventListener('mouseup', () => {
    drawingPath = null;
})

render();

document.body.appendChild(vast.view);