class Gene {
	constructor(target, neighbor, neighbordir, effect, effectdir) {
		this.target = target
		this.neighbor = neighbor // -1 = ignore, -2 = any
		this.neighbordir = neighbordir
		this.effect = effect // -1 = delete, -2 = bond
		this.effectdir = effectdir
	}
}

class Cell {
	constructor(value) {
		this.value = value
		this.up = false
		this.down = false
		this.left = false
		this.right = false
	}
}

function letterToHex(letter) {
	if (letter=="A") return 10
	if (letter=="B") return 11
	if (letter=="C") return 12
	if (letter=="D") return 13
	if (letter=="E") return 14
	if (letter=="F") return 15
	return letter
}

function decodeSolution(sol) {
	sol = sol.toUpperCase()
	sol = sol.replace(/[^a-z0-9]/gi, '');
	for (let i=0; i<sol.length; i=i+6) {
		
		targetChar = ""+sol[i+0]+sol[i+1]
		value = Math.floor(nameString.indexOf(targetChar)/2)
		console.log(value)
		up = (sol[i+2] != "X")
		down = (sol[i+3] != "X")
		left = (sol[i+4] != "X")
		right = (sol[i+5] != "X")
		
		data[12][(i/6)%4][Math.floor((i/6)/4)].value = value
		data[12][(i/6)%4][Math.floor((i/6)/4)].up = up
		data[12][(i/6)%4][Math.floor((i/6)/4)].down = down
		data[12][(i/6)%4][Math.floor((i/6)/4)].left = left
		data[12][(i/6)%4][Math.floor((i/6)/4)].right = right
		if (value == 11) {
			data[0][(i/6)%4][Math.floor((i/6)/4)].value = 11
			data[0][(i/6)%4][Math.floor((i/6)/4)].up = false
			data[0][(i/6)%4][Math.floor((i/6)/4)].down = false
			data[0][(i/6)%4][Math.floor((i/6)/4)].left = false
			data[0][(i/6)%4][Math.floor((i/6)/4)].right = false
		} else {
			data[0][(i/6)%4][Math.floor((i/6)/4)].value = 0
			data[0][(i/6)%4][Math.floor((i/6)/4)].up = false
			data[0][(i/6)%4][Math.floor((i/6)/4)].down = false
			data[0][(i/6)%4][Math.floor((i/6)/4)].left = false
			data[0][(i/6)%4][Math.floor((i/6)/4)].right = false
		}
	}
	x = document.getElementById("x").value
	y = document.getElementById("y").value
	if (x=='') x=0
	if (y=='') y=0
	if (data[0][x][y].value == 0) {
		data[0][x][y].value = 1
	}
}

dirTable = [
	[false, false, false, false], // 0
	[false, false, false, true ], // 1 - Right
	[false, false, true , false], // 2 - Left
	[false, false, true , true ], // 3 - Left, Right
	
	[false, true , false, false], // 4 - Down
	[false, true , false, true ], // 5 - Down, Right
	[false, true , true , false], // 6 - Down, Left
	[false, true , true , true ], // 7 - Down, Left, Right
	
	[true , false, false, false], // 8 - Up
	[true , false, false, true ], // 9 - Up, Right
	[true , false, true , false], // A - Up, Left
	[true , false, true , true ], // B - Up, Left, Right
	
	[true , true , false, false], // C - Up, Down
	[true , true , false, true ], // D - Up, Down, Right
	[true , true , true , false], // E - Up, Down, Left
	[true , true , true , true ], // F - Up, Down, Left, Right
]

function get_cell(board, x, y, dir) {
	if (dir=="up") y=y-1
	if (dir=="down") y=y+1
	if (dir=="left") x=x-1
	if (dir=="right") x=x+1
	if (x<0 || y<0 || x>3 || y>4) {
		return 0
	} else {
		return data[board][x][y].value
	}
}

function update_next(board,x,y,dir,value) {
	if (value == -2) {
		cell = data[board][x][y]
		if (cell.up && dir == "up") return false
		if (cell.down && dir == "down") return false
		if (cell.left && dir == "left") return false
		if (cell.right && dir == "right") return false
	}
	if (dir=="up") y=y-1
	if (dir=="down") y=y+1
	if (dir=="left") x=x-1
	if (dir=="right") x=x+1
	if (x<0 || y<0 || x>3 || y>4) {
		//console.log("Failed to update due to out of bounds at "+(board+1)+", "+x+", "+y)
		return false
	} else {
		if(get_cell(board+1, x, y, "none") == 0 || dir == "replace" || dir == "firstReplace" || (value == -2 && get_cell(board+1, x, y, "none") != 11)) {
			if (value != -2) {
				data[board+1][x][y].value = value
			}
			if (dir=="up") {
				data[board+1][x][y].down = true
				data[board+1][x][y+1].up = true
			}
			if (dir=="down") {
				data[board+1][x][y].up = true
				data[board+1][x][y-1].down = true
			}
			if (dir=="left") {
				data[board+1][x][y].right = true
				data[board+1][x+1][y].left = true
			}
			if (dir=="right") {
				data[board+1][x][y].left = true
				data[board+1][x-1][y].right = true
			}
			if (dir=="firstReplace") {
				if (value == -1 || value == 0) {
					if (data[board+1][x][y].up) {data[board+1][x][y-1].down = false}
					if (data[board+1][x][y].down) {data[board+1][x][y+1].up = false}
					if (data[board+1][x][y].left) {data[board+1][x-1][y].right = false}
					if (data[board+1][x][y].right) {data[board+1][x+1][y].left = false}
					data[board+1][x][y].up = false
					data[board+1][x][y].down = false
					data[board+1][x][y].left = false
					data[board+1][x][y].right = false
					console.log("Cleared directions")
				} else {
					data[board+1][x][y].up = data[board][x][y].up
					data[board+1][x][y].down = data[board][x][y].down
					data[board+1][x][y].left = data[board][x][y].left
					data[board+1][x][y].right = data[board][x][y].right
				}
			}
			return true
		}
		//console.log("Failed to update due to something at "+(board+1)+", "+x+", "+y)
		return false
	}
}

function run_simulation() {
	for (let i=0; i<11; i++) {
		for (let x=0; x<4; x++) {
			for (let y=0; y<5; y++) {
				if (get_cell(i,x,y,"none") != -1) {
					update_next(i,x,y,"firstReplace",get_cell(i,x,y,"none"))
				} else {
					update_next(i,x,y,"firstReplace",0)
				}
			}
		}
		for (let y=0; y<5; y++) {
			for (let x=0; x<4; x++) {
				for (let ii in genes) {
					gene = genes[ii]
					if (get_cell(i,x,y,"none") == gene.target) {
						neighborval = get_cell(i,x,y,gene.neighbordir)
						if (neighborval == -1) neighborval = 0
						if (neighborval == gene.neighbor || gene.neighbordir == "none" || (neighborval > 0 && gene.neighbor == -2)) {
							success = update_next(i,x,y,gene.effectdir,gene.effect)
							if (success == true) {
								console.log("Utilized gene "+ii+" at "+i+", "+x+", "+y)
								break
							}
						}
					}
				}
			}
		}
	}
}

function display_preview() {
	for (let i=0; i<12; i++) {
		for (let ii=0; ii<4; ii++) {
			for (let iii=0; iii<5; iii++) {
				cell = data[i][ii][iii]
				elem = document.getElementById("tile"+i+"-"+(ii+(iii*4)))
				//elem.setAttribute("src","images/tile"+cell.value+".png")
				elem.innerHTML = ""
				elem.innerHTML += '<img src="images/tile0.png" width="28" height="28" style="position: absolute;">'
				elem.innerHTML += '<img src="images/tile'+cell.value+'.png" width="28" height="28" style="position: absolute;">'
				if (cell.up) elem.innerHTML += '<img src="images/tile'+cell.value+'-up.png" width="28" height="28" style="position: absolute;">'
				if (cell.down) elem.innerHTML += '<img src="images/tile'+cell.value+'-down.png" width="28" height="28" style="position: absolute;">'
				if (cell.left) elem.innerHTML += '<img src="images/tile'+cell.value+'-left.png" width="28" height="28" style="position: absolute;">'
				if (cell.right) elem.innerHTML += '<img src="images/tile'+cell.value+'-right.png" width="28" height="28" style="position: absolute;">'
			}
		}
	}
}

function add_gene(target, neighbor, neighbordir, effect, effectdir) {
	genes.push(new Gene(target, neighbor, neighbordir, effect, effectdir))
}

function run_code() {
	genes = []
	code = document.getElementById("code").value
	code = code.toUpperCase()
	code = code.replace(/[^a-z0-9]/gi, '');
	console.log(code)
	
	for (let i=0; i<code.length; i=i+7) {
		targetChar = ""+code[i+0]+code[i+1]
		target = Math.floor(nameString.indexOf(targetChar)/2)
		
		neighborChar = ""+code[i+2]+code[i+3]
		neighbordirChar = code[i+4]
		if (neighborChar == "NI") {
			neighbor = -1
			neighbordir = "none"
		} else if (neighborChar == "AN"){
			neighbor = -2
			neighbordir = get_dir(neighbordirChar)
		} else {
			neighbor = Math.floor(nameString.indexOf(neighborChar)/2)
			neighbordir = get_dir(neighbordirChar)
		}
		
		effectChar = code[i+5]
		effectChar2 = code[i+6]
		effectCharCombined = ""+effectChar+effectChar2
		if (Math.floor(nameString.indexOf(effectCharCombined)/2) != -1 && effectCharCombined != "XX") {
			effect = Math.floor(nameString.indexOf(effectCharCombined)/2)
			effectdir = "replace"
		} else if (effectChar == "D") {
			effect = target
			effectdir = get_dir(effectChar2)
		} else if (effectChar == "F") {
			effect = -2
			effectdir = get_dir(effectChar2)
		} else if (effectChar == "X") {
			effect = -1
			effectdir = "firstReplace"
		}
		add_gene(target, neighbor, neighbordir, effect, effectdir)
	}
	
	run_simulation()
	display_preview()
}

function load_level() {
	level = document.getElementById("level").value
	level = level.toUpperCase()
	level = level.replace(/[^a-z0-9]/gi, '');
	
	decodeSolution(level);
	run_simulation()
	display_preview();
}

function get_dir(cha) {
	if (cha == "U") return "up"
	if (cha == "D") return "down"
	if (cha == "L") return "left"
	if (cha == "R") return "right"
}

function selectGene(num) {
	if (selectedGene != -1) {
		document.getElementById("geneSelector"+selectedGene).classList.remove("geneSelected")
	}
	document.getElementById("geneSelector"+num).classList.add("geneSelected")
	selectedGene = num
}

data = [] 
console.log(data)
for (let i=0; i<13; i++) {
	data[i] = []
	for (let ii=0; ii<4; ii++) {
		data[i][ii] = []
		for (let iii=0; iii<5; iii++) {
			data[i][ii][iii] = new Cell(0)
		}
	}
}
console.log(data)

let elem = document.getElementById("previewer")
for (let i=0; i<12; i++) {
	elem.innerHTML += '<div class="board" id="board'+i+'"></div>'
	let elem2 = document.getElementById("board"+i)
	for (let ii=0; ii<20; ii++) {
		elem2.innerHTML += '<div id="tile'+i+'-'+ii+'"></div>'
	}
}
selX = [12 , 69 , 123, 180, 234, 291, 345, 402, 456, 513, 567, 624, 678, 735, 789, 846]
selY = [355, 484, 355, 484, 355, 484, 355, 484, 355, 484, 355, 484, 355, 484, 355, 484]
for (let i=0; i<16; i++) {
	elem.innerHTML += '<div class="geneSelector" id="geneSelector'+i+'" style="top: '+selY[i]+'px; left: '+selX[i]+'px;" onClick="selectGene('+i+')"></div>'
}

nameString = "XXX0B0B1F0F16677889900MT"
genes = []
selectedGene = -1

/*/ The Worm

gene(1, 11, "up", 1, "right")
gene(1, -1, "none", 1, "left")
gene(1, 1, "down", 4, "replace")
gene(1, 0, "right", 1, "up")
gene(1, 0, "left", 1, "down")
gene(1, 0, "left", 1, "up")
gene(1, 4, "right", 4, "replace")
gene(1, 4, "left", 4, "replace")
gene(1, 4, "down", 4, "replace")
gene(1, 11, "right", 4, "replace")
gene(4, 11, "right", 5, "replace")

data[0][3][3].value = 1
data[0][1][4].value = 11
data[0][2][4].value = 11
data[0][3][4].value = 11
data[0][0][0].value = 11
data[0][1][0].value = 11
data[0][2][0].value = 11

decodeSolution("B0B0B0444543434A494343464543434A58B0B0B0")
*/

/*/ The Loop

gene(1, -1, "none", 1, "right")
gene(1, -1, "none", 1, "down")
gene(1, -1, "none", -2, "left")
gene(1, 4, "up", 2, "replace")
gene(1, 11, "down", 2, "replace")
gene(1, 11, "up", 2, "replace")
gene(1, -1, "none", 4, "replace")
gene(2, -1, "none", 3, "replace")
gene(4, -1, "none", 5, "replace")

data[0][0][0].value = 1
data[0][1][1].value = 11
data[0][1][2].value = 11
data[0][1][3].value = 11
data[0][2][1].value = 11
data[0][2][2].value = 11
data[0][2][3].value = 11
*/

/*/ The Rows

gene(1, 11, "right", 2, "replace")
gene(1, -1, "none", 1, "down")
gene(1, -1, "none", 1, "right")
gene(1, 2, "right", -1, "replace")
gene(3, -1, "none", 3, "left")
gene(2, -1, "none", 3, "replace")

data[0][1][0].value = 1
data[0][0][0].value = 11
data[0][0][1].value = 11
data[0][0][2].value = 11
data[0][0][3].value = 11
data[0][0][4].value = 11
data[0][3][0].value = 11
data[0][3][1].value = 11
data[0][3][2].value = 11
data[0][3][3].value = 11
data[0][3][4].value = 11

decodeSolution("B03132B0B03132B0B03132B0B03132B0B03132B0")
*/

/*/ The Delete Test

gene(1, 11, "down", 2, "replace")
gene(1, 2, "down", 2, "replace")
gene(1, 11, "up", 1, "right")
gene(1, -1, "none", 1, "down")
gene(1, 11, "up", -1, "replace")
gene(2, -1, "none", 2, "up")
gene(2, -1, "none", 3, "replace")


data[0][0][1].value = 1
data[0][0][0].value = 11
data[0][1][0].value = 11
data[0][2][0].value = 11
data[0][3][0].value = 11
data[0][0][4].value = 11
data[0][1][4].value = 11
data[0][2][4].value = 11
data[0][3][4].value = 11

decodeSolution("B0B0B0B0343434343C3C3C3C38383838B0B0B0B0")
*/

/*/ The New One

gene(1, -1, "none", 1, "right")
gene(1, 0, "right", 4, "replace")
gene(1, 4, "right", 2, "replace")
gene(1, 2, "right", 4, "replace")
gene(4, -1, "none", 4, "up")
gene(2, -1, "none", 2, "down")
gene(2, -1, "none", 2, "right")
gene(4, -1, "none", -2, "down")
gene(2, -1, "none", -2, "left")
gene(2, -1, "none", 3, "replace")
gene(4, -1, "none", 5, "replace")

data[0][0][3].value = 1
data[0][1][0].value = 11
data[0][1][1].value = 11
data[0][3][0].value = 11

decodeSolution("00B000B000B000540054005C355F375E393B3B3A")
*/

//decodeSolution("MTXXXX-F1XXXR-F1XXLX-MTXXXX-MTXXXX-F1XXXR-F1XXLX-MTXXXX-MTXXXX-F1XXXR-F1XXLX-MTXXXX-MTXXXX-F1XXXR-F1XXLX-MTXXXX-MTXXXX-F1XXXR-F1XXLX-MTXXXX")

decodeSolution("")

run_simulation()
display_preview()