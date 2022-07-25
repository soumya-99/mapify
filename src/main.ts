import M from "materialize-css";
import "@lottiefiles/lottie-player";
import "materialize-css/dist/css/materialize.min.css";
import "./css/material-icons.css";
import "./css/style.css";
import { easterEgg, materialBlue, materialColorful, materialGreen, materialPurple, materialRed, materialTeal, materialYellow, switchTheme } from "./api/theme";
//import { bfsManager, colorImagePixels, compareColorValues, findVertexAtCoordinate } from "./api/algorithm";
import { set_box_dimensions, set_maxX, findVertexAtCoordinate, findCoordinateOfVertex, hexToRgb } from "./api/utils";
import { set_context, colorImagePixels, reDrawSrcDest, reDrawStops, set_universalSources, set_universalDests,
    set_copyOfWaypoints } from "./api/utils";

// buttons
const srcButton = document.getElementById("source") as HTMLAnchorElement
const destButton = document.getElementById("dest") as HTMLAnchorElement
const showPathButton = document.getElementById("sp") as HTMLAnchorElement
const resetButton = document.getElementById("reset") as HTMLAnchorElement
const fullScreenButton = document.getElementById("fullscreen") as HTMLAnchorElement
const downloadButton = document.getElementById("download") as HTMLAnchorElement

// image related
let img = document.getElementById("map-image") as HTMLImageElement
let inputImage = document.getElementById("input-map") as HTMLInputElement
let customImageInput: HTMLImageElement
let customInputEnabled = false

// set up the canvas
let canvas = document.getElementById("canvas") as HTMLCanvasElement
canvas.width = img.width
canvas.height = img.height
let context = canvas.getContext("2d") as CanvasRenderingContext2D

// algo related
let sourceSet = false, //flags for source and dest button
	destSet = false
let srcButtonOn = false, //state of buttons
	destButtonOn = false
let isReset = true //for realtime updation of pathSize
//used as a flag if in reset state or not
let source: number
let destination: number
let universalSources: number[] = new Array() //stores values until map is reloaded or changes
let universalDests: number[] = new Array()
let univarsalWaypoints: number[] = new Array()
let waypoints: number[] = new Array() //array for multiple stops or way points
let materialYouPathColor = "ff0000"

let box_dimensions = 2 //segment dimension
let maxX = canvas.width / box_dimensions //image loading needs to be done before this
let maxY = canvas.height / box_dimensions //cause accessing the canvas element here
let vertex = maxX * maxY //maximum possible number of veritces

const clickAudio = new Audio(
	"./src/sounds/mixkit-cool-interface-click-tone-2568.wav"
)
const errAudio = new Audio("./src/sounds/mixkit-click-error-1110.wav")

if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("/mapify-map-app/serviceWorker.js", {
			scope: "/mapify-map-app/",
		})
	})
}

inputImage.addEventListener("change", (e) => {
	//loading of user given images
	var reader = new FileReader()
	reader.onload = (event) => {
		var image = new Image()
		image.onload = () => {
			canvas.width = image.width
			canvas.height = image.height

			//change the segment dimension according to the image resolution
			if (
				(image.width > 2000 && image.width < 3000) ||
				(image.height > 2000 && image.height < 3000)
			)
				box_dimensions = 4
			else if (
				(image.width > 3000 && image.width < 5000) ||
				(image.height > 3000 && image.height < 5000)
			)
				box_dimensions = 6
			else box_dimensions = 2

			maxX = Math.trunc(canvas.width / box_dimensions)
			maxY = Math.trunc(canvas.height / box_dimensions)
			vertex = maxX * maxY
			context.drawImage(image, 0, 0, image.width, image.height)
		}
		resetStates()
		customInputEnabled = true
		universalPaths = new Array() //universalPaths is to be cleared separately for swap map button

		image.src = (event.target as FileReader).result as string
		console.log(image.src)
		customImageInput = image //storing the source of custom image
	}
	reader.readAsDataURL(((e.target as HTMLInputElement).files as FileList)[0])
})

const drawMap = () => {
	context.clearRect(0, 0, canvas.width, canvas.height)
	context.drawImage(img, 0, 0, img.width, img.height)
}

window.onload = () => {
	//loading image for the first time
	drawMap()
	localStorage.dark === "true"
		? (document.getElementById("switch-dark") as HTMLInputElement).click()
		: switchTheme()
	if (localStorage.length === 0) {
		materialColorfulBtn.click()
	}
}

//this is called everytime mouse is clicked
function pick(event: MouseEvent) {
	var rect = canvas.getBoundingClientRect() // get the canvas' bounding rectangle
	let mx = event.clientX - rect.left // get the mouse's x coordinate
	let my = event.clientY - rect.top // get the mouse's y coordinate
	if (compareColorValues(mx, my, materialYouPathColor) === false) {
		return //don't let add src or dest outside paths
	}

	//passing context to utils
	set_context(context)

	let hotCell = findVertexAtCoordinate(mx, my)

	if (destSet === false && destButtonOn === true) {
		M.toast({
			html: "<i class='material-icons left'>edit_location</i>Now you can add intermediate STOPS! Click on the map to add them.",
			classes: "rounded pink",
			displayLength: 2500,
		})
		destination = hotCell
		universalDests.push(destination)
		colorImagePixels(mx, my, 6, 0, 255, 0)
		destSet = true
		destButtonOn = false
		isReset = false
		return
	}
	if (sourceSet === false && srcButtonOn === true) {
		source = hotCell
		universalSources.push(source)
		colorImagePixels(mx, my, 6, 0, 0, 255)
		sourceSet = true
		srcButtonOn = false
		isReset = false
		return
	}

	if (sourceSet && destSet) {
		colorImagePixels(mx, my, 6, 255, 0, 0)
		waypoints.push(hotCell)
		univarsalWaypoints.push(hotCell)
	}
}

//////////////////////////////////

const mapSelectElement = document.getElementById("mapSelect") as HTMLSelectElement
function swapMap() {
	//invoke when swap map button pressed
	isReset = true //set reset (for realtime pathSize updation)

	let newImage = document.getElementById("mapSelect") as HTMLSelectElement
	img.src = newImage.value
	canvas.width = img.width
	canvas.height = img.height
	box_dimensions = 2 //reset segment size to 2 for built-in maps
	maxX = Math.trunc(canvas.width / box_dimensions)
	maxY = Math.trunc(canvas.height / box_dimensions)
	vertex = maxX * maxY

	img.onload = () => {
		context.drawImage(img, 0, 0, img.width, img.height)
	}
	customInputEnabled = false
	resetStates()
	universalPaths = new Array() //These are to be cleared separately for swap map button
	universalSources = new Array()
	universalDests = new Array()
	univarsalWaypoints = new Array()
}

mapSelectElement.onchange = () => {
	swapMap()
}

resetButton.onclick = () => {
	clickAudio.play()
	if (confirm("Are you sure? Do you really want to clear the map?")) {
		isReset = true
		// let img = document.getElementById("map-image")
		let tempCustomImage = document.getElementById("map-image") as HTMLImageElement
		let newImage = document.getElementById("mapSelect") as HTMLSelectElement

		if (customInputEnabled === true) {
			//if there is a custom image
			//not affecting img and creating new local variables
			tempCustomImage.src = customImageInput.src
			canvas.width = customImageInput.width
			canvas.height = customImageInput.height
			tempCustomImage.onload = () => {
				context.drawImage(
					tempCustomImage,
					0,
					0,
					customImageInput.width,
					customImageInput.height
				)
			}
		} else {
			img.src = newImage.value
			canvas.width = img.width
			canvas.height = img.height
			img.onload = () => {
				context.drawImage(img, 0, 0, img.width, img.height)
			}
		}

		resetStates()
		universalPaths = new Array() //These are to be cleared separately for reset map button
		universalSources = new Array()
		universalDests = new Array()
		univarsalWaypoints = new Array()
		M.toast({
			html: "<i class='material-icons left'>refresh</i>Map cleared successfully!",
			classes: "rounded green",
			displayLength: 1500,
		})
	} else {
		M.toast({
			html: "<i class='material-icons left'>error</i>Reset cancelled.",
			classes: "rounded red",
			displayLength: 1500,
		})
	}
}

function resetStates() {
	//passing data to utils.ts
	set_box_dimensions(box_dimensions)
	set_maxX(maxX)

	predFromSource.clear()
	predFromDest.clear()
	sourceQueue = new Array()
	destQueue = new Array()
	sourceVisited = new Array(vertex).fill(false)
	destVisited = new Array(vertex).fill(false)
	waypoints = new Array()

	sourceSet = false
	destSet = false
	srcButtonOn = false
	destButtonOn = false
	srcButton.classList.remove("disabled")
	destButton.classList.remove("disabled")
}

//methods for buttons
function show_path() {
	bfsManager(source, destination, waypoints) //all methods combined

	resetStates() //need to reset after every bfs call
	//we can't reset universalPath here as it will clear previous paths
	//inturn removing the feature of multiple path and theming of multiple paths
}

destButton.onclick = () => {
	clickAudio.play()
	destSet = false
	destButtonOn = true
	destButton.classList.add("disabled")
	srcButton.classList.add("disabled")
}

srcButton.onclick = () => {
	clickAudio.play()
	sourceSet = false
	srcButtonOn = true
	srcButton.classList.add("disabled")
	destButton.classList.add("disabled")
}

showPathButton.onclick = () => {
	if (sourceSet && destSet) {
		clickAudio.play()
		show_path()
	} else {
		errAudio.play()
		M.toast({
			html: "Add source and destination first",
			classes: "rounded blue-grey",
		})
	}
}

fullScreenButton.onclick = () => {
	clickAudio.play()
	canvas.requestFullscreen()
}

downloadButton.onclick = () => {
	clickAudio.play()
	downloadButton.download = img.src
	downloadButton.href = canvas.toDataURL()
}

// for theatre mode
const zoomButton = document.getElementById("zoom") as HTMLAnchorElement
const zoomIcon = document.getElementById("zoom-icon") as HTMLElement
const bodyRight = document.getElementById("body-right") as HTMLDivElement
const bodyLeft = document.getElementById("body-left") as HTMLDivElement
const mapContainer = document.getElementById("map-container") as HTMLDivElement

let isZoomOn = true
zoomButton.onclick = () => {
	clickAudio.play()
	if (isZoomOn === true) {
		bodyLeft.style.flexGrow = "1"
		bodyLeft.style.transition = "0.8s ease-in-out"
		mapContainer.style.width = "90vw"
		bodyRight.style.display = "none"
		zoomIcon.innerText = "zoom_out"
		isZoomOn = false
	} else {
		bodyLeft.removeAttribute("style")
		bodyRight.removeAttribute("style")
		mapContainer.removeAttribute("style")
		zoomIcon.innerText = "zoom_in"
		isZoomOn = true
	}
}

canvas.addEventListener(
	"click",
	(event) => {
		pick(event)

		if (srcButtonOn || destButtonOn) {
			srcButton.classList.add("disabled")
			destButton.classList.add("disabled")
		} else {
			srcButton.classList.remove("disabled")
			destButton.classList.remove("disabled")
		}
	},
	false
)


//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////complete messed up algorithm code///////////////////////////

//These needs to be global to preseve states within function calls
let predFromSource: Map<number, number> = new Map()
let predFromDest: Map<number, number> = new Map()
let sourceQueue = new Array()
let destQueue = new Array()
let sourceVisited = new Array(vertex).fill(false)
let destVisited = new Array(vertex).fill(false)
let universalPaths = new Array() //not resets until reset button or swap map pressed
let pathColor: string //to support materialYou path color
let copyOfWaypoints = new Array() //copy to manage realtime pathSize update for waypoints

function bfsManager(source: number, destination: number, waypoints: number[]) {
	//handles the case for multiple way points
	//fetching data from map.js

	let BfsSource = source
	let BfsDestination = destination
	let interMediatePoints = new Array()
	interMediatePoints.push(...waypoints)
	copyOfWaypoints = univarsalWaypoints
	pathColor = materialYouPathColor

	if (interMediatePoints.length === 0) {
		//if there's no intermediate points
		BfsSingleRun(BfsSource, BfsDestination)
		return
	}

	//for the first iteration
	let currentSource = BfsSource
	let currDestination = interMediatePoints[0]
	BfsSingleRun(currentSource, currDestination)
	//for all way points in between
	for (let i = 1; i < interMediatePoints.length; i++) {
		//run bfs until all waypoints are visited
		//manage source and dest for each way points
		currentSource = currDestination
		currDestination = interMediatePoints[i]
		resetBfsManagerStates() //clearing states for re-execution
		BfsSingleRun(currentSource, currDestination)
	}
	//for last iteration
	currentSource = currDestination
	currDestination = BfsDestination
	resetBfsManagerStates()
	BfsSingleRun(currentSource, currDestination)
}

function BfsSingleRun(currentSource: number, currDestination: number) {
	//handles bidirection BFS
	//in turn calls SourceBFS() and destBFS()

	sourceVisited[currentSource] = true
	sourceQueue.push(currentSource)

	destVisited[currDestination] = true
	destQueue.push(currDestination)

	let sourceBfsFlag = -1,
		destBfsFlag = -1 //states of each bfs call
	while (sourceBfsFlag === -1 && destBfsFlag === -1) {
		//will return values != -1 if ended somehow (path found/not found)
		sourceBfsFlag = sourceBfs()
		destBfsFlag = destBfs()
	} //these flags will contain the meeting point

	let currentPath = getPath(sourceBfsFlag, destBfsFlag) //reconstruct the shortest path
	if (currentPath.length === 0)
		M.toast({ html: "No path exists in between", classes: "rounded" })
	else {
		universalPaths.push(...currentPath)
		highLightPath() //draw the path on the map
	}
}

function sourceBfs() {
	if (sourceQueue.length === 0) return 0

	let x = sourceQueue.shift() // already popped front
	x = Math.trunc(x)
	let coords = findCoordinateOfVertex(x)
	let boxPixlX = coords[0]
	let boxPixlY = coords[1]
	let queueTemp = getN8Adjacents(x, boxPixlX, boxPixlY) //returns N8 adjacents

	//now all the adjacents of x are in queueTemp and can be used
	//as an alternative of any supporting data structure for bfs.
	for (let k = 0; k < queueTemp.length; k++) {
		let vNum = queueTemp[k]
		if (sourceVisited[vNum] === false) {
			sourceVisited[vNum] = true
			sourceQueue.push(vNum)
			predFromSource.set(vNum, x)
			if (predFromDest.has(vNum) === true) return vNum
		}
	}
	return -1
}

function destBfs() {
	if (destQueue.length === 0) return 0

	let x = destQueue.shift() // already popped front
	x = Math.trunc(x)
	let coords = findCoordinateOfVertex(x)
	let boxPixlX = coords[0]
	let boxPixlY = coords[1]
	let queueTemp = getN8Adjacents(x, boxPixlX, boxPixlY) //returns N8 adjacents

	//now all the adjacents of x are in queueTemp and can be used
	//as an alternative of any supporting data structure for bfs.
	for (let k = 0; k < queueTemp.length; k++) {
		let vNum = queueTemp[k]
		if (destVisited[vNum] === false) {
			destVisited[vNum] = true
			destQueue.push(vNum)
			predFromDest.set(vNum, x)
			if (predFromSource.has(vNum) === true) return vNum
		}
	}
	return -1
}

function getN8Adjacents(currItem: number, boxPixlX: number, boxPixlY: number) {
	let queueTemp = new Array()
	///now determine n8 adjacents of x
	//up
	let upPixlX = boxPixlX
	let upPixlY = boxPixlY - box_dimensions
	if (upPixlY > 0) {
		if (compareColorValues(upPixlX, upPixlY, pathColor)) {
			queueTemp.push(currItem - maxX)
		}
	}
	//left
	let leftPixX = boxPixlX - box_dimensions
	let leftPixY = boxPixlY
	if (leftPixX > 0) {
		if (compareColorValues(leftPixX, leftPixY, pathColor)) {
			queueTemp.push(currItem - 1)
		}
	}
	//right
	let rightPixX = boxPixlX + box_dimensions
	let rightPixY = boxPixlY
	if (rightPixX < canvas.width) {
		if (compareColorValues(rightPixX, rightPixY, pathColor)) {
			queueTemp.push(currItem + 1)
		}
	}
	//bottom
	let bottomPixX = boxPixlX
	let bottomPixY = boxPixlY + box_dimensions
	if (bottomPixY < canvas.height) {
		if (compareColorValues(bottomPixX, bottomPixY, pathColor)) {
			queueTemp.push(currItem + maxX)
		}
	}

	//top left
	let topleftPixX = boxPixlX - box_dimensions
	let topleftPixY = boxPixlY - box_dimensions
	if (topleftPixX > 0 && topleftPixY > 0) {
		if (compareColorValues(topleftPixX, topleftPixY, pathColor)) {
			queueTemp.push(currItem - maxX - 1)
		}
	}
	//top right
	let toprightPixX = boxPixlX + box_dimensions
	let toprightPixY = boxPixlY - box_dimensions
	if (toprightPixX < canvas.width && toprightPixY > 0) {
		if (compareColorValues(toprightPixX, toprightPixY, pathColor)) {
			queueTemp.push(currItem - maxX + 1)
		}
	}
	//bottom left
	let bottomleftPixX = boxPixlX - box_dimensions
	let bottomleftPixY = boxPixlY + box_dimensions
	if (bottomleftPixX > 0 && bottomleftPixY < canvas.height) {
		if (compareColorValues(bottomleftPixX, bottomleftPixY, pathColor)) {
			queueTemp.push(currItem + maxX - 1)
		}
	}
	//bottom right
	let bottomrightPixX = boxPixlX + box_dimensions
	let bottomrightPixY = boxPixlY + box_dimensions
	if (bottomrightPixX < canvas.width && bottomrightPixY < canvas.height) {
		if (compareColorValues(bottomrightPixX, bottomrightPixY, pathColor)) {
			queueTemp.push(currItem + maxX + 1)
		}
	}
	return queueTemp
}

function getPath(sourceFlag: number, destFlag: number) {
	let temp = new Array()

	let index = sourceFlag > destFlag ? sourceFlag : destFlag
	while (predFromSource.has(index) === true) {
		let curr = predFromSource.get(index) as number
		temp.push(curr)
		index = curr
	}

	index = sourceFlag > destFlag ? sourceFlag : destFlag
	while (predFromDest.has(index) === true) {
		let curr = predFromDest.get(index) as number
		temp.push(curr)
		index = curr
	}
	return temp
}

function highLightPath() {
	let pathColor = materialYouPathColor
	const pathWidth = pathSize // removed the parseInt

	//passing context to utils
	set_context(context)

	for (let p = 0; p < universalPaths.length; p++) {
		let coords = findCoordinateOfVertex(universalPaths[p])
		colorImagePixels(
			coords[0],
			coords[1],
			pathWidth,
			hexToRgb(pathColor)?.r as number,
			hexToRgb(pathColor)?.g as number,
			hexToRgb(pathColor)?.b as number
		)
	}
}

// path size
const pathSizeElement = document.getElementById("path-size") as HTMLInputElement
const badgePathSize = document.getElementById("badge-pathSize") as HTMLSpanElement

let pathSize = 1 //default values
pathSizeElement.value = pathSize.toString()
badgePathSize.innerHTML = pathSize.toString()

pathSizeElement.addEventListener("input", (e) => {
	pathSize = (e.target as HTMLInputElement).value as unknown as number
	badgePathSize.innerHTML = pathSize.toString()
	redrawPath() //reloads the image and redraws the path with new pathsize
})

function redrawPath() {
	//handles realtime pathSize updation
	if (isReset == true) return //not the condition for redrawing

	//passing data to utils.ts
	set_universalSources(universalSources)
	set_universalDests(universalDests)
	set_copyOfWaypoints(copyOfWaypoints)


	//clear the image and then in onload redraw the src and dest and.... path
	let img = document.getElementById("map-image") as HTMLImageElement
	let tempCustomImage = document.getElementById("map-image") as HTMLImageElement
	let newImage = document.getElementById("mapSelect") as HTMLSelectElement
	if (customInputEnabled === true) {
		tempCustomImage.src = customImageInput.src
		canvas.width = customImageInput.width
		canvas.height = customImageInput.height
		tempCustomImage.onload = () => {
			context.drawImage(
				tempCustomImage,
				0,
				0,
				customImageInput.width,
				customImageInput.height
			)
			highLightPath()
			reDrawSrcDest()
			reDrawStops()
		}
	} else {
		img.src = newImage.value
		canvas.width = img.width
		canvas.height = img.height
		img.onload = () => {
			context.drawImage(img, 0, 0, img.width, img.height)
			highLightPath()
			reDrawSrcDest()
			reDrawStops()
		}
	}
}

////////////////////////utility functions/////////////////




// custom color (color picker)
const newColor = document.getElementById("custom-color") as HTMLInputElement
let red = hexToRgb(newColor.value)?.r as number
let green = hexToRgb(newColor.value)?.g as number
let blue = hexToRgb(newColor.value)?.b as number
//const settingsIcon = document.getElementById("settings-icon") as HTMLElement

// newColor.addEventListener("input", (e) => {
// 	newColor.value = (e.target as HTMLInputElement).value
// 	red = hexToRgb((e.target as HTMLInputElement).value)?.r as number
// 	green = hexToRgb((e.target as HTMLInputElement).value)?.g as number
// 	blue = hexToRgb((e.target as HTMLInputElement).value)?.b as number
// 	settingsIcon.style.color = (e.target as HTMLInputElement).value
// })

// function saveSettings() {
// 	//console.log("save", red, green, blue)
// }

// function resetDefault() {
// 	if (confirm("Are you sure? All your changes will be lost.")) {
// 		newColor.value = "#fafafa"
// 		red = hexToRgb(newColor.value)?.r as number
// 		green = hexToRgb(newColor.value)?.g as number
// 		blue = hexToRgb(newColor.value)?.b as number
// 		settingsIcon.style.color = newColor.value

// 		pathSize = 1
// 		pathSizeElement.value = pathSize.toString()
// 		badgePathSize.innerText = pathSize.toString()

// 		sensitivity = 5
// 		sensitivityRange.value = sensitivity.toString()
// 		badgeSensitivity.innerText = sensitivity.toString()

// 		M.toast({
// 			html: "Settings reset to default",
// 			classes: "green rounded",
// 			displayLength: 1000,
// 		})
// 	} else {
// 		M.toast({
// 			html: "Your settings are safe.",
// 			classes: "blue rounded",
// 			displayLength: 1000,
// 		})
// 	}
// }

// function resetAll() {
// 	if (
// 		confirm(
// 			"Are you sure? All your changes will be lost. This will reload app."
// 		)
// 	) {
// 		localStorage.clear()
// 		location.reload()
// 	} else {
// 		M.toast({
// 			html: "Your settings are safe.",
// 			classes: "blue rounded",
// 			displayLength: 1000,
// 		})
// 	}
// }

// sensitivity controller
let sensitivity = 5
const sensitivityRange = document.getElementById("sensitivity") as HTMLInputElement
const badgeSensitivity = document.getElementById("badge-sensitivity") as HTMLSpanElement
sensitivityRange.value = sensitivity.toString()
badgeSensitivity.innerText = sensitivity.toString()

sensitivityRange.addEventListener("input", (e) => {
	sensitivity = (e.target as HTMLInputElement).value as unknown as number
	badgeSensitivity.innerText = sensitivity.toString()
})

//to compare two color values
let pixel: ImageData
function compareColorValues(x: number, y: number, currentPathColor: string) {
	pixel = context.getImageData(x, y, 1, 1)
	if (
		//comparing a range of colours
		pixel.data[0] >= red - sensitivity &&
		pixel.data[0] <= red + sensitivity &&
		pixel.data[1] >= green - sensitivity &&
		pixel.data[1] <= green + sensitivity &&
		pixel.data[2] >= blue - sensitivity &&
		pixel.data[2] <= blue + sensitivity
	)
		return true
	//support to ignore previously drawn paths
	else if (
		pixel.data[0] === hexToRgb(currentPathColor)?.r &&
		pixel.data[1] === hexToRgb(currentPathColor)?.g &&
		pixel.data[2] === hexToRgb(currentPathColor)?.b
	)
		return true
	//support for pure blue and pure green for source and dest markers
	else if (pixel.data[0] == 0 && pixel.data[1] >= 250 && pixel.data[2] == 0)
		return true
	else if (pixel.data[0] == 0 && pixel.data[1] == 0 && pixel.data[2] >= 250)
		return true
	//support for pure red for stop markers
	else if (pixel.data[0] >= 255 && pixel.data[1] == 0 && pixel.data[2] == 0)
		return true
	else return false
}



function resetBfsManagerStates() {
	//reseting intermediate states during bfs
	predFromSource.clear()
	predFromDest.clear()
	sourceQueue = new Array()
	destQueue = new Array()
	sourceVisited = new Array(vertex).fill(false)
	destVisited = new Array(vertex).fill(false)
}


//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
////////////////////////complete messed up algorithm code ends here/////////////////
////////////////////////////////////////////////////////////////////////////////////




//////////////////////////////////////////////////////////////////////////////////
// theming starts from here




// Complete themeing (Material You)

// themed buttons
const materialBlueBtn = document.getElementById("m-blue") as HTMLAnchorElement
const materialYellowBtn = document.getElementById("m-yellow") as HTMLAnchorElement
const materialRedBtn = document.getElementById("m-red") as HTMLAnchorElement
const materialGreenBtn = document.getElementById("m-green") as HTMLAnchorElement
const materialPurpleBtn = document.getElementById("m-purple") as HTMLAnchorElement
const materialTealBtn = document.getElementById("m-teal") as HTMLAnchorElement
const materialColorfulBtn = document.getElementById("m-colorful") as HTMLAnchorElement

materialBlueBtn.onclick = materialBlue
materialGreenBtn.onclick = materialGreen
materialRedBtn.onclick = materialRed
materialYellowBtn.onclick = materialYellow
materialPurpleBtn.onclick = materialPurple
materialTealBtn.onclick = materialTeal
materialColorfulBtn.onclick = materialColorful

// dark mode
const switchThemeBtn = document.getElementById("switch-dark") as HTMLInputElement
switchThemeBtn.onclick = switchTheme

// Easter Egg
const easterEggSearch = document.getElementById("easter-egg") as HTMLButtonElement
easterEggSearch.onclick = easterEgg

// Initialization of MaterializeCSS
M.AutoInit()

const carousel = document.querySelector(".carousel") as Element
const carouselInstance = M.Carousel.init(carousel)
setInterval(() => {
	carouselInstance.next()
}, 3900)

// preloader done
const preloader = document.querySelector(".pre-loader") as any
function fadeOut() {
	const fadeEffect = setInterval(() => {
		if (!preloader.style.opacity) {
			preloader.style.opacity = 1
		}
		if (preloader.style.opacity > 0) {
			preloader.style.opacity -= 0.1
		} else {
			clearInterval(fadeEffect)
			preloader.style.display = "none"
		}
	}, 100)
}
setTimeout(() => {
	fadeOut()
}, 2000)
