attackers = null
defenders = null

var currentlyDefending = false

var label = document.getElementById("Label");
var portrait = document.getElementById("Portrait");
var icon = document.getElementById("Icon");

var label2 = document.getElementById("Label2");
var portrait2 = document.getElementById("Portrait2");
var icon2 = document.getElementById("Icon2");

var divider = document.getElementById("BlueSide");

var volumeDiv = document.getElementById("Volume");
var volumeSVG = document.querySelector("#Volume > svg");
var volumeSVGPath = document.querySelector("#Volume > svg > path");
var volume = 100;
var muted = false;
const operatorVolumeModifier = .005;
const clickVolumeModifier = .002;
var volumePaths = [
    "m 21.48,17.98 c 0,-1.77 -1.02,-3.29 -2.5,-4.03 v 2.21 l 2.45,2.45 c .03,-0.2 .05,-0.41 .05,-0.63 z m 2.5,0 c 0,.94 -0.2,1.82 -0.54,2.64 l 1.51,1.51 c .66,-1.24 1.03,-2.65 1.03,-4.15 0,-4.28 -2.99,-7.86 -7,-8.76 v 2.05 c 2.89,.86 5,3.54 5,6.71 z M 9.25,8.98 l -1.27,1.26 4.72,4.73 H 7.98 v 6 H 11.98 l 5,5 v -6.73 l 4.25,4.25 c -0.67,.52 -1.42,.93 -2.25,1.18 v 2.06 c 1.38,-0.31 2.63,-0.95 3.69,-1.81 l 2.04,2.05 1.27,-1.27 -9,-9 -7.72,-7.72 z m 7.72,.99 -2.09,2.08 2.09,2.09 V 9.98 z",
    "M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z",
    "M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z"
]

var scroll = 0;

var Op1 = "", Op2 = "";

fetch('./ops.json')
    .then((response) => response.json())
    .then(json => loadOps(json));

function toggleTeam() {
    if (!muted) {
        var audio = new Audio("Sounds/SwitchTeams.wav");
        audio.volume = volume*clickVolumeModifier;
        audio.play();
    }
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

    Op1 = op.name;

}

function loadOperator2(op) {
    // console.log(op.name)
    
    label2.innerText = op.name.toUpperCase()
    portrait2.style.backgroundImage = `url('${op.picture}')`
    icon2.style.backgroundImage = `url('${op.icon}')`

    Op2 = op.name;
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
    if (currentAudio != null) {
        currentAudio.pause()
        currentAudio = null;
    }
    if (scrollVel == 0) {
        scrollVel = 300+Math.random()*200

        window.requestAnimationFrame(rolling);
    }
}

function rolling() {
    if (scrollVel > Math.abs(300-scroll%300)/10) {
        if (scroll >= -300 && scroll-scrollVel/10 < -300) {
            loadOperator1(randomOp())
            if (!muted) {
                var audio = new Audio("Sounds/click.wav");
                audio.volume = volume*clickVolumeModifier;
                audio.play();
            }
        }

        if (scroll >= -600 && scroll-scrollVel/10 < -600) {
            loadOperator2(randomOp())
            if (!muted) {
                var audio = new Audio("Sounds/click.wav");
                audio.volume = volume*clickVolumeModifier;
                audio.play();
            }
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

var currentAudio = null;

function result() {
    let opName = Op1
    if (scroll > -450) {
        opName = Op2
    }
    if (!muted) {
        if (currentlyDefending) {
            currentAudio = new Audio(`Sounds/Defenders/${opName}.wav`);
            currentAudio.volume = volume*operatorVolumeModifier;
            currentAudio.play();
        } else {
            currentAudio = new Audio(`Sounds/Attackers/${opName}.wav`);
            currentAudio.volume = volume*operatorVolumeModifier;
            currentAudio.play();
        }
    }
}

window.addEventListener("click", (event) => {
    if (!volumeDiv.contains(event.target)) {
        volumeDiv.classList.remove("focus");
    }
});

function volumeChange(element) {
    volumeDiv.classList.add("focus");
    volume = element.value;
    muted = false;
    if (currentAudio) {
        currentAudio.volume = volume*operatorVolumeModifier;
    }

    updateSVG();
}

function mute(event) {
    muted = !muted;
    if (muted && currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }

    updateSVG();
}
volumeSVG.addEventListener("click", mute)

function updateSVG() {
    if (muted || volume == 0) {
        volumeSVGPath.setAttribute("d", volumePaths[0])
    } else {
        if (volume < 50) {
            volumeSVGPath.setAttribute("d", volumePaths[1])
        } else {
            volumeSVGPath.setAttribute("d", volumePaths[2])
        }
    }
}