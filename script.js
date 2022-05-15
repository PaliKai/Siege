let Canvas = document.getElementById('Canvas');
Canvas.width = 1000 //Canvas.offsetWidth
Canvas.height = 1000 //Canvas.offsetHeight
let canvas = Canvas.getContext('2d');

canvas.textBaseline = 'middle';
canvas.textAlign = "center"

let mouseX = Canvas.width/2, mouseY = Canvas.height/2
onmousemove = function(e){mouseX=e.clientX;mouseY=e.clientY}

let num = document.querySelector('#sliderContainer input').value
document.querySelector('#sliderContainer p#count').innerHTML = `(${num})`
let r = 0;
let speed = 0;

function angle() {
    return 2*Math.PI/num
}

const normDecel = 0.1
var decel = normDecel
const maxSpeed = 100

const pos = {x:Canvas.width/2,y:Canvas.width/2}
const radius = Canvas.width*(0.5*7/8)

document.querySelector('.checkboxContainer input').checked = localStorage.getItem("borders") === 'true'

var borders = document.querySelector('.checkboxContainer input').checked

var names = []

//Canvas.style.width = pos.x*2 + "px"
//Canvas.style.height = pos.y*2 + "px"

let current
function draw() {

    //   canvas.fillStyle = `rgb(100, 100, 100)`;
    //   canvas.fillRect(0, 0, Canvas.width, Canvas.height);
    render()
    
    if (speed > 0) {
        speed-=decel
    } else {
        speed = 0
        decideWinner()
        return
    }
  
    r+=Math.PI*speed/600
    if (r > Math.PI*2) {
        r-=Math.PI*2
    }
    
    current = window.requestAnimationFrame(draw)
}

function spin() {
    //r = 0
    decel = normDecel
    ran = Math.random()*20+30
    if (speed + ran < maxSpeed) {
        speed += ran
    } else {
        speed = maxSpeed
    }
    window.cancelAnimationFrame(current)
    window.requestAnimationFrame(draw)


}

function stop() {
    decel = 8
}

//window.onresize = render

render()

function render() {
    canvas.fillStyle = "rgb(30 36 42)"
    canvas.ellipse(pos.x,pos.y,radius*13/12,radius*13/12,0,0,2*Math.PI)
    canvas.fill()

    canvas.lineWidth = 2/num

    for (let i = 0; i < num; i++) {
        canvas.beginPath()
    
        canvas.fillStyle = `hsl(${i*(angle()*180/Math.PI)}, 100%, 50%)`;
        if (borders) {
            canvas.lineWidth = 48/num
            canvas.strokeStyle = "black"
        } else {
            canvas.strokeStyle = `hsl(${i*(angle()*180/Math.PI)}, 100%, 50%)`;
        }
    
        canvas.moveTo(pos.x,pos.y)
        
        start = r-Math.PI/2 + i*angle()
        
        canvas.arc(pos.x,pos.y, radius, start, start+angle());
    
        canvas.closePath()
        canvas.fill()
        canvas.stroke()
        canvas.translate(pos.x,pos.y)
        let a = start+angle()/2
        let mov = radius/2

        
        if (a < 0) {
            a+=2*Math.PI
        }  if (a > 2*Math.PI) {
            a-=2*Math.PI
        }
        
        if (a > Math.PI/2 && a < Math.PI*3/2) {
            a = Math.PI+a
            mov*=-1
        }
        canvas.rotate(a);

        let fontSize = (20+angle()*25)*(Canvas.height/372)
        canvas.font = fontSize + 'px Arial';

        let lengths = names.map(x => canvas.measureText(x).width)

        let max = Math.max(...lengths)

        if (max > radius*7/8) {
            fontSize = fontSize*((radius*7/8)/max)
        }
        canvas.font = fontSize + 'px Arial';

        if (textShouldBeBlack((i*angle())*180/Math.PI)) {
            canvas.fillStyle = 'rgb(0 0 0)'
        } else {
            canvas.fillStyle = 'rgb(255 255 255)'
        }
        //let txt = Math.round(i*(angle*180/Math.PI))
        let txt = i+1
        if (names.length-1 >= i && names[i] != null) {
            txt = names[i]
        }
        canvas.fillText(txt, mov, 0)

        canvas.setTransform(1, 0, 0, 1, 0, 0);
    }

    canvas.lineWidth = 48/num
    canvas.beginPath()
    //canvas.fillStyle = `rgb(0,0,0)`;
    canvas.fillStyle = `rgb(255 255 255)`;
    canvas.strokeStyle = `rgb(0 0 0)`;
    canvas.moveTo(pos.x,pos.y-radius*(15/16))
    canvas.lineTo(pos.x-radius/16,pos.y-radius*(17/16))
    canvas.lineTo(pos.x+radius/16,pos.y-radius*(17/16))
    canvas.closePath()
    canvas.stroke()
    canvas.fill()
}

function reset() {
    window.cancelAnimationFrame(current)
    r = 0
    speed = 0
    decel = normDecel
    render()
    document.getElementById('Spin').style.color = "rgb(0 0 0)"
    document.getElementById('Spin').style.backgroundColor = "rgb(252 190 36)"
}

function decideWinner() {
    let deg = roundToNearest((-r*180/Math.PI)+360-(180/num), 360/num)
    // canvas.fillStyle = `hsl(${deg}, 100%, 50%)`
    // canvas.fillRect(0, 0, 30, 30);
    document.getElementById('Spin').style.backgroundColor = `hsl(${deg}, 100%, 50%)`

    let e = document.getElementById('Spin').style.backgroundColor
    values = e.substring(4,e.length-1).split(" ").map(function(item) {return parseFloat(item)});
    //console.log(values)
    // if (textShouldBeBlack(values[0],values[1],values[2])) {
    if (textShouldBeBlack(deg)) {
        document.getElementById('Spin').style.color = "rgb(0 0 0)"
    } else {
        document.getElementById('Spin').style.color = "rgb(255 255 255)"
    }
}

function textShouldBeBlack(h) {
    return h > 30 && h < 210
}

// function textShouldBeBlack(r,g,b) {
//     return ((r*0.299 + g*0.587 + b*0.114) > 150)
// }


function roundToNearest(num, round) {
    mod = num%round
    if (mod < round/2) {
  	    return num-mod
    }
    return num-mod+round
}

function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function setBorders(value) {
    borders = value
    render()
    localStorage.setItem("borders", borders)
}

sliderChanged(num)

function sliderChanged(value) {
    num = value
    render()
    document.querySelector('#sliderContainer p#count').innerHTML = `(${num})`

    let nodes = document.querySelector('div#Input ol').childNodes
    let oldLen = nodes.length

    if (value > oldLen) {
        for (let i = 0; i < value-oldLen; i++) {
            var li = document.createElement("li");
            var inp = document.createElement("input");
            inp.type = "text"
            inp.placeholder = "Value"
            inp.onchange = updateNames
            // <li><input type="text" placeholder="Value"></li>
            li.appendChild(inp);
            document.querySelector('div#Input ol').appendChild(li);
        }
    } else {
        for (let i = 0; i < oldLen-value; i++) {
            let node = nodes[i]
            document.querySelector('div#Input ol').removeChild(node)
        }
    }
}

function updateNames() {
    let nodes = document.querySelector('div#Input ol').childNodes
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i].querySelector("input")
        names[i] = (node.value ? node.value : null)
    }

    render()
}

function resetNames() {
    names = []

    render()
}