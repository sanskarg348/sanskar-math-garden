const BACKGROUND_COLOUR = '#000000'
const LINE_COLOR = '#FFFFFF'
const LINE_WIDTH = 15;

var currentX = 0;
var currentY = 0;
var previousX = 0;
var previousY = 0;
var canvas;
var context;


function prepareCanvas() {
    // console.log('Preparing Canvas');
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');

    context.fillStyle = BACKGROUND_COLOUR;
    context.fillRect(0,0,canvas.clientWidth, canvas.clientHeight)

    context.strokeStyle = LINE_COLOR;
    context.lineWidth = LINE_WIDTH;
    context.lineJoin = 'round'

    document.addEventListener('mousedown', function (event) {
        canvas.addEventListener('mousemove', onPaint, false);
        // console.log('mouse pressed');
        currentX = event.clientX - canvas.offsetLeft;
        currentY = event.clientY - canvas.offsetTop;
    }, false);
    document.addEventListener('mouseup', function (event) {
        canvas.removeEventListener('mousemove', onPaint, false);
        // console.log('Mouse Released');
    }, false);
    
    document.addEventListener('mousemove', function (event) {
        previousX = currentX; 
        currentX = event.clientX - canvas.offsetLeft;

        previousY = currentY;
        currentY = event.clientY - canvas.offsetTop;
    }, false);

    var onPaint = function () {
        context.beginPath();
        context.moveTo(previousX, previousY);
        context.lineTo(currentX, currentY);
        context.closePath();
        context.stroke();
    };
    canvas.addEventListener('mouseleave', function () {
        canvas.removeEventListener('mousemove', onPaint, false);
    });


    canvas.addEventListener('touchstart', function (event) {
        canvas.addEventListener('touchmove', onPaint, false);
        // console.log('touch pressed');
        currentX = event.touches[0].clientX - canvas.offsetLeft;
        currentY = event.touches[0].clientY - canvas.offsetTop;
    }, false);
    canvas.addEventListener('touchcancel', function (event) {
        canvas.removeEventListener('touchmove', onPaint, false);
        // console.log('touch Released');
    }, false);
    
    canvas.addEventListener('touchmove', function (event) {
        previousX = currentX; 
        currentX = event.touches[0].clientX - canvas.offsetLeft;

        previousY = currentY;
        currentY = event.touches[0].clientY - canvas.offsetTop;
    }, false);

    canvas.addEventListener('touchend', function () {
        canvas.removeEventListener('touchmove', onPaint, false);
    });



};

function clearCanvas() {
    currentX = 0;
    currentY = 0;
    previousX = 0;
    previousY = 0;
    // console.log('bantai');
    context.fillRect(0,0, canvas.clientWidth, canvas.clientHeight);
}