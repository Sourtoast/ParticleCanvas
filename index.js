const canvasElement = document.querySelector("#particles")
const ctx = canvasElement.getContext("2d")
const parentStyles = getComputedStyle(canvasElement.parentElement)

const {backgroundColor, color: foregroundColor} = parentStyles

function resizeCanvasToMatchParent() {
    canvasElement.width = canvasElement.parentElement.clientWidth
    canvasElement.height = canvasElement.parentElement.clientHeight
}

resizeCanvasToMatchParent()

function drawParticle() {
    ctx.beginPath()
    ctx.arc(canvasElement.width / 2, canvasElement.height / 2, 2, 0, Math.PI * 2)
    ctx.fillStyle = foregroundColor
    console.log(foregroundColor)
    ctx.fill()
    ctx.closePath()
}

drawParticle()