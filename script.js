attackers = null
defenders = null

var currentlyDefending = false

var label = document.getElementById("Label")
var portrait = document.getElementById("Portrait")
var icon = document.getElementById("Icon")

var label2 = document.getElementById("Label2")
var portrait2 = document.getElementById("Portrait2")
var icon2 = document.getElementById("Icon2")

var divider = document.getElementById("BlueSide")

var scroll = 0

fetch('./ops.json')
    .then((response) => response.json())
    .then(json => loadOps(json));

function toggleTeam() {
    var audio = new Audio("Sounds/SwitchTeams.wav");
    audio.volume = 0.2;
    audio.play();
    currentlyDefending = divider.classList.toggle("defending")

    scroll = 0
    scrollVel = 0
    setScroll(0)
    document.getElementById("Operator").style.setProperty("--Mod", 0)
    loadDefault()
}


function loadOps(json) {
    attackers = json.attackers
    defenders = json.defenders

    loadDefault()
}

function loadDefault() {
    let list = attackers;
    if (currentlyDefending) {
        list = defenders;
    }
    operator = list[0]
    // console.log(operator.name)
    loadOperator1(operator)

    operator = list[1]
    loadOperator2(operator)
}

function randomOp() {
    let list = attackers;
    if (currentlyDefending) {
        list = defenders;
    }
    opIndex = Math.floor(Math.random()*list.length)
    return list[opIndex]
}

function loadOperator1(op) {
    // console.log(op.name)
    
    label.innerText = op.name.toUpperCase()
    portrait.style.backgroundImage = `url('${op.picture}')`
    icon.style.backgroundImage = `url('${op.icon}')`

}

function loadOperator2(op) {
    // console.log(op.name)
    
    label2.innerText = op.name.toUpperCase()
    portrait2.style.backgroundImage = `url('${op.picture}')`
    icon2.style.backgroundImage = `url('${op.icon}')`

}

function getScroll() {
    return parseInt(getComputedStyle(document.getElementById("Frame")).getPropertyValue("--Offset").replace("px", ""))
}

function setScroll(scroll) {
    document.getElementById("Frame").style.setProperty("--Offset", scroll + "px")
}

var scrollVel = 0
const scrollDeccel = 2;

function roll() {
    if (scrollVel == 0) {
        scrollVel = 300+Math.random()*200

        window.requestAnimationFrame(rolling);
    }
}

function rolling() {
    if (scrollVel > Math.abs(300-scroll%300)/10) {
        if (scroll >= -300 && scroll-scrollVel/10 < -300) {
            loadOperator1(randomOp())
            var audio = new Audio("Sounds/click.wav");
            audio.volume = 0.2;
            audio.play()
        }

        if (scroll >= -600 && scroll-scrollVel/10 < -600) {
            loadOperator2(randomOp())
            var audio = new Audio("Sounds/click.wav");
            audio.volume = 0.2;
            audio.play()
        }

        scroll-=scrollVel/10
        scrollVel -= scrollDeccel;

        scroll = scroll % 600


        document.getElementById("Operator").style.setProperty("--Mod", (scroll < -300 ? 1 : 0))

        setScroll(scroll)

        window.requestAnimationFrame(rolling);

    } else {
        console.log("Scroll Complete")
        window.requestAnimationFrame(center);
    }
}

function center() {
    if (Math.abs(scroll % 300) > 0) {
        if (Math.abs(scroll % 300) < Math.abs(scrollVel/10)) {
            scrollVel = 0
            result()
        } else {
            scroll -= scrollVel/10
            setScroll(scroll)
            window.requestAnimationFrame(center);
        }
    } else {
        scrollVel = 0
        result()
    }
}

function result() {
    var audio = new Audio("Sounds/c4.wav");
    audio.volume = 0.2;
    audio.play();
}

// window.requestAnimationFrame(roll);