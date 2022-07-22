import M from "materialize-css";
import "@lottiefiles/lottie-player";
import "materialize-css/dist/css/materialize.min.css";
import "./css/material-icons.css";
import "./css/style.css";
import { easterEgg, materialBlue, materialColorful, materialGreen, materialPurple, materialRed, materialTeal, materialYellow, switchTheme } from "./api/theme";

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

// work for removing jquery
const dropdown = document.querySelector(".dropdown-trigger")
const modal = document.querySelectorAll(".modal")
const formSelect = document.querySelectorAll("select")
const tooltip = document.querySelectorAll(".tooltipped")
const floatingActionButton = document.querySelector(".fixed-action-btn") as HTMLDivElement
const sideNav = document.querySelector(".sidenav")
const carousel = document.querySelector(".carousel")
const tabs = document.querySelector(".tabs")

// Don't change the order of the following elements
const instanceActions: any[] = [
	dropdown,
	modal,
	formSelect,
	tooltip,
	floatingActionButton,
	sideNav,
	carousel,
	tabs,
]

for (let i = 0; i < instanceActions.length; i++) {
	M.Dropdown.init(instanceActions[0])
	M.Modal.init(instanceActions[1])
	M.FormSelect.init(instanceActions[2])
	M.Tooltip.init(instanceActions[3])
	M.FloatingActionButton.init(instanceActions[4])
	M.Sidenav.init(instanceActions[5])
	M.Tabs.init(instanceActions[7])

	const carouselInstance = M.Carousel.init(instanceActions[6])
	setInterval(() => {
		carouselInstance.next()
	}, 3700)
}

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
