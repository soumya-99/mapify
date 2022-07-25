
//the data or variables I need
let box_dimensions: number
let maxX: number
let context: CanvasRenderingContext2D
let universalSources: number[] = new Array()
let universalDests: number[] = new Array()
let copyOfWaypoints: number[] = new Array()

//the setter for those 
function set_box_dimensions(value: number) {
    box_dimensions = value 
}
function set_maxX(value: number) {
    maxX = value 
}
function set_context(value:CanvasRenderingContext2D) {
    context = value
}
function set_universalSources(value: number[]) {
    universalSources = value
}
function set_universalDests(value: number[]) {
    universalDests = value
}
function set_copyOfWaypoints(value: number[]) {
    copyOfWaypoints = value
}

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

function findVertexAtCoordinate(x: number, y: number) {
	//find the logical vertex number from the coordinates
	let boxJ = Math.trunc(x / box_dimensions)
	let boxI = Math.trunc(y / box_dimensions)
	let hotCell = Math.trunc(boxI * maxX + boxJ)
	return hotCell
}

function findCoordinateOfVertex(vertexNumber: number) {
	//find the coordinates from the logical vertex number
	let currCell = vertexNumber
	let i = Math.trunc(currCell / maxX)
	let j = Math.trunc(currCell - i * maxX)
	let x = j * box_dimensions + box_dimensions / 2
	let y = i * box_dimensions + box_dimensions / 2
	return [x, y]
}

function hexToRgb(hex: string) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	return result
		? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16),
		}
		: null
}

//creates a colored box to the given coordinate with given boxSize and rgb values
let pixel: ImageData
function colorImagePixels(x: number, y: number, size: number, colorR: number, colorG: number, colorB: number) {
	let xLow = x - size
	let xHigh = x + size
	let yLow = y - size
	let yHigh = y + size

	for (let i = xLow; i <= xHigh; i++) {
		for (let j = yLow; j <= yHigh; j++) {
			pixel = context.getImageData(i, j, 1, 1)
			pixel.data[0] = colorR
			pixel.data[1] = colorG
			pixel.data[2] = colorB
			context.putImageData(pixel, i, j)
		}
	}
}


function reDrawSrcDest() {
	//for sources
	for (let i = 0; i < universalSources.length; i++) {
		let srcCoord = findCoordinateOfVertex(universalSources[i])
		colorImagePixels(srcCoord[0], srcCoord[1], 6, 0, 0, 255)
	}
	//for destinations
	for (let i = 0; i < universalDests.length; i++) {
		let destCoord = findCoordinateOfVertex(universalDests[i])
		colorImagePixels(destCoord[0], destCoord[1], 6, 0, 255, 0)
	}
}

let wayPointCoord: number[]
function reDrawStops() {
	for (let i = 0; i < copyOfWaypoints.length; i++) {
		wayPointCoord = findCoordinateOfVertex(copyOfWaypoints[i])
		colorImagePixels(wayPointCoord[0], wayPointCoord[1], 6, 255, 0, 0)
	}
}




/////////////////////////////////////////
export {
    //methods
    set_box_dimensions,
    set_maxX,
    findVertexAtCoordinate,
    findCoordinateOfVertex,
    hexToRgb,
    /////////////
    set_context,
    colorImagePixels,
    reDrawSrcDest,
    reDrawStops,
    set_universalSources,
    set_universalDests,
    set_copyOfWaypoints,
}