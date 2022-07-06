

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
	
	while(data[0][startX][startY].value != 0) {
		startX += 1
		if (startX > 3) {
			startX = 0
			startY += 1
		}
		if (startY > 4) {
			startY = 0
		}
	}
	console.log("Start: "+startX+" "+startY)
	if (data[0][startX][startY].value == 0) {
		data[0][startX][startY].value = 1
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
			if (value == -2 && get_cell(board+1, x, y, "none") <= 0) {
				return false
			}
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
						if (neighborval == 0) neighborval = -1
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
	for (let i=0; i<13; i++) {
		for (let ii=0; ii<4; ii++) {
			for (let iii=0; iii<5; iii++) {
				cell = data[i][ii][iii]
				elem = document.getElementById("tile"+i+"-"+(ii+(iii*4)))
				//elem.setAttribute("src","images/tile"+cell.value+".png")
				elem.innerHTML = ""
				//elem.innerHTML += '<img src="images/tile0.png" width="28" height="28" style="position: absolute;">'
				elem.innerHTML += '<img src="images/tile'+cell.value+'.png" width="28" height="28" style="position: absolute;">'
				
				if (cell.up) elem.innerHTML += '<img src="images/tile'+cell.value+'-up.png" width="28" height="28" style="position: absolute;">'
				if (cell.down) elem.innerHTML += '<img src="images/tile'+cell.value+'-down.png" width="28" height="28" style="position: absolute;">'
				if (cell.left) elem.innerHTML += '<img src="images/tile'+cell.value+'-left.png" width="28" height="28" style="position: absolute;">'
				if (cell.right) elem.innerHTML += '<img src="images/tile'+cell.value+'-right.png" width="28" height="28" style="position: absolute;">'
				
				if (cell.value == 11) elem.innerHTML += '<img src="images/metalDecalT.png" width="48" height="48" style="position: relative; top: -10px; left: -10px;">'
			}
		}
	}
	formatArrow("arrow-up",0,-1,startY <= 0)
	formatArrow("arrow-down",0,1,startY >= 4)
	formatArrow("arrow-left",-1,0, startX <= 0)
	formatArrow("arrow-right",1,0, startX >= 3)
	
	document.getElementById("geneTarget").innerHTML = ""
	document.getElementById("geneReaction").innerHTML = ""
	document.getElementById("nothing").innerHTML = ""
	for (let i=0; i<16; i++) {
		displayGenePreview(i)
	}
}

function displayGenePreview(i) {
	if (genes.length > i) {
		gene = genes[i]
		elem = document.getElementById("geneSelector"+i)
		if (selectedGene == i) {
			elemTarget = document.getElementById("geneTarget")
			elemReaction = document.getElementById("geneReaction")
			displayReactionIcons(gene)
		} else {
			elemTarget = document.getElementById("nothing")
			elemReaction = document.getElementById("nothing")
		}
		elem.innerHTML = ""
		gene = genes[i]
		x = 0;
		y = 0;
		if (gene.effectdir == "up") y = -1;
		if (gene.effectdir == "down") y = 1;
		if (gene.effectdir == "left") x = -1;
		if (gene.effectdir == "right") x = 1;
		
		if (gene.target != 0) {
			elem.innerHTML += '<img src="images/tile'+gene.target+'-preview.png" class="imagePreview" style="left: '+17+'px; top: '+16+'px;">'
			elemTarget.innerHTML += '<img src="images/tile'+gene.target+'.png" class="arrow" style="left: '+28+'px; top: '+28+'px;">'
		}
		
		if (gene.neighbordir != "none") {
			nx = 0;
			ny = 0;
			if (gene.neighbordir == "up") ny = -1;
			if (gene.neighbordir == "down") ny = 1;
			if (gene.neighbordir == "left") nx = -1;
			if (gene.neighbordir == "right") nx = 1;
			elem.innerHTML += '<img src="images/tile'+gene.neighbor+'-preview.png" class="imagePreview" style="left: '+(17+(15*nx))+'px; top: '+(16+(15*ny))+'px;">'
			elemTarget.innerHTML += '<img src="images/tile'+gene.neighbor+'.png" class="arrow" style="left: '+(28+(28*nx))+'px; top: '+(28+(28*ny))+'px;">'
			if (gene.neighbor == -1) {
				elemTarget.innerHTML += '<img src="images/tile-1-icon.png" class="arrow" style="left: '+(28+(28*nx))+'px; top: '+(28+(28*ny))+'px;">'
			}
			if (nx != x || ny != y) {
				elem.innerHTML += '<img src="images/tile'+gene.neighbor+'-preview.png" class="imagePreview" style="left: '+(70+(15*nx))+'px; top: '+(16+(15*ny))+'px;">'
				elemReaction.innerHTML += '<img src="images/tile'+gene.neighbor+'.png" class="arrow" style="left: '+(28+(28*nx))+'px; top: '+(28+(28*ny))+'px;">'
				if (gene.neighbor == -1) {
					elemReaction.innerHTML += '<img src="images/tile-1-icon.png" class="arrow" style="left: '+(28+(28*nx))+'px; top: '+(28+(28*ny))+'px;">'
				}
			}
		}
		
		if (gene.effect == 0) {
			
		} else if (gene.effect == gene.target || gene.effect == -2) {
			elem.innerHTML += '<img src="images/tile'+gene.target+'-preview.png" class="imagePreview" style="left: '+70+'px; top: '+16+'px;">'
			elem.innerHTML += '<img src="images/tile'+gene.effect+'-preview.png" class="imagePreview" style="left: '+(70+(15*x))+'px; top: '+(16+(15*y))+'px;">'
			elemReaction.innerHTML += '<img src="images/tile'+gene.target+'.png" class="arrow" style="left: '+28+'px; top: '+28+'px;">'
			elemReaction.innerHTML += '<img src="images/tile'+gene.effect+'.png" class="arrow" style="left: '+(28+(28*x))+'px; top: '+(28+(28*y))+'px;">'
		} else {
			elem.innerHTML += '<img src="images/tile'+gene.effect+'-preview.png" class="imagePreview" style="left: '+70+'px; top: '+16+'px;">'
			elemReaction.innerHTML += '<img src="images/tile'+gene.effect+'.png" class="arrow" style="left: '+28+'px; top: '+28+'px;">'
		}
	}
}

function displayReactionIcons(gene) {
	for (let ii=0; ii<19; ii++) {
		reaction = reactSelName[ii]
		reactElem = document.getElementById("reactionSelector-"+reaction)
		reactElem.innerHTML = ""
		if (gene.target != 0) {
			if (gene.neighbordir == "up" && (reaction != "divide-up" || reaction != "fuse-up")) {
				reactElem.innerHTML += '<img src="images/tile'+gene.neighbor+'-preview.png" class="imagePreview" style="left: '+16+'px; top: '+2+'px;">'
			}
			if (gene.neighbordir == "down" && (reaction != "divide-down" || reaction != "fuse-down")) {
				reactElem.innerHTML += '<img src="images/tile'+gene.neighbor+'-preview.png" class="imagePreview" style="left: '+16+'px; top: '+30+'px;">'
			}
			if (gene.neighbordir == "left" && (reaction != "divide-left" || reaction != "fuse-left")) {
				reactElem.innerHTML += '<img src="images/tile'+gene.neighbor+'-preview.png" class="imagePreview" style="left: '+2+'px; top: '+16+'px;">'
			}
			if (gene.neighbordir == "right" && (reaction != "divide-right" || reaction != "fuse-right")) {
				reactElem.innerHTML += '<img src="images/tile'+gene.neighbor+'-preview.png" class="imagePreview" style="left: '+30+'px; top: '+16+'px;">'
			}
			
			if (reaction == "ignore") {
				reactElem.innerHTML += '<img src="images/tile'+gene.target+'-preview.png" class="imagePreview" style="left: '+16+'px; top: '+16+'px;">'
			} else if (reaction == "divide-up") {
				reactElem.innerHTML += '<img src="images/tile'+gene.target+'-preview.png" class="imagePreview" style="left: '+16+'px; top: '+16+'px;">'
				reactElem.innerHTML += '<img src="images/tile'+gene.target+'-preview.png" class="imagePreview" style="left: '+16+'px; top: '+2+'px;">'
			} else if (reaction == "divide-down") {
				reactElem.innerHTML += '<img src="images/tile'+gene.target+'-preview.png" class="imagePreview" style="left: '+16+'px; top: '+16+'px;">'
				reactElem.innerHTML += '<img src="images/tile'+gene.target+'-preview.png" class="imagePreview" style="left: '+16+'px; top: '+30+'px;">'
			} else if (reaction == "divide-left") {
				reactElem.innerHTML += '<img src="images/tile'+gene.target+'-preview.png" class="imagePreview" style="left: '+16+'px; top: '+16+'px;">'
				reactElem.innerHTML += '<img src="images/tile'+gene.target+'-preview.png" class="imagePreview" style="left: '+2+'px; top: '+16+'px;">'
			} else if (reaction == "divide-right") {
				reactElem.innerHTML += '<img src="images/tile'+gene.target+'-preview.png" class="imagePreview" style="left: '+16+'px; top: '+16+'px;">'
				reactElem.innerHTML += '<img src="images/tile'+gene.target+'-preview.png" class="imagePreview" style="left: '+30+'px; top: '+16+'px;">'
			} else if (reaction == "die") {
				// Replace this with full code for the various sprites
				reactElem.innerHTML += '<img src="images/tile-1-preview.png" class="imagePreview" style="left: '+16+'px; top: '+16+'px;">'
			} else if (reaction == "fuse-up") {
				reactElem.innerHTML += '<img src="images/tile'+gene.target+'-preview.png" class="imagePreview" style="left: '+16+'px; top: '+16+'px;">'
				reactElem.innerHTML += '<img src="images/tile-2-preview.png" class="imagePreview" style="left: '+16+'px; top: '+2+'px;">'
			} else if (reaction == "fuse-down") {
				reactElem.innerHTML += '<img src="images/tile'+gene.target+'-preview.png" class="imagePreview" style="left: '+16+'px; top: '+16+'px;">'
				reactElem.innerHTML += '<img src="images/tile-2-preview.png" class="imagePreview" style="left: '+16+'px; top: '+30+'px;">'
			} else if (reaction == "fuse-left") {
				reactElem.innerHTML += '<img src="images/tile'+gene.target+'-preview.png" class="imagePreview" style="left: '+16+'px; top: '+16+'px;">'
				reactElem.innerHTML += '<img src="images/tile-2-preview.png" class="imagePreview" style="left: '+2+'px; top: '+16+'px;">'
			} else if (reaction == "fuse-right") {
				reactElem.innerHTML += '<img src="images/tile'+gene.target+'-preview.png" class="imagePreview" style="left: '+16+'px; top: '+16+'px;">'
				reactElem.innerHTML += '<img src="images/tile-2-preview.png" class="imagePreview" style="left: '+30+'px; top: '+16+'px;">'
			} else {
				reaction = parseInt(reaction)
				reactElem.innerHTML += '<img src="images/tile'+reaction+'-preview.png" class="imagePreview" style="left: '+16+'px; top: '+16+'px;">'
				valid = true
				if (reaction == 2 && gene.target != 1) valid = false
				if (reaction == 3 && gene.target != 2) valid = false
				if (reaction == 4 && gene.target != 1) valid = false
				if (reaction == 5 && gene.target != 4) valid = false
				if (reaction == 6 && gene.target != 4) valid = false
				if (reaction == 7 && gene.target != 4) valid = false
				if (reaction == 8 && gene.target != 1) valid = false
				if (reaction == 9 && gene.target != 8) valid = false
				if (reaction == 10 && gene.target != 8) valid = false
				if (valid == false) {
					reactElem.innerHTML += '<img src="images/selectedCover.png" style="left: 0px; top: 0px; position: absolute">'
				}
			}
		} else if (reaction != "ignore") {
			reactElem.innerHTML += '<img src="images/selectedCover.png" style="left: 0px; top: 0px; position: absolute">'
		}
	}
}

function formatArrow(name,x,y,cond) {
	arrow = document.getElementById(name)
	arrow.style.top = (28*(startY+y))+8
	arrow.style.left = (28*(startX+x))+11
	if (cond || data[0][startX+x][startY+y].value == 11) {arrow.style.display = "none"}
	else {arrow.style.display = "block"}
}

function add_gene(target, neighbor, neighbordir, effect, effectdir, reaction) {
	genes.push(new Gene(target, neighbor, neighbordir, effect, effectdir, reaction))
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
		setNeighborDir("none")
		document.getElementById("geneSelector"+selectedGene).classList.remove("geneSelected")
		gene = genes[selectedGene]
		document.getElementById("cellSelector"+gene.target).classList.remove("cellSelected")
		document.getElementById("reactionSelector-"+gene.reaction).classList.remove("reactionSelected")
	}
	document.getElementById("geneSelector"+num).classList.add("geneSelected")
	selectedGene = num
	
	gene = genes[num]
	document.getElementById("cellSelector"+gene.target).classList.add("cellSelected")
	console.log(gene.reaction)
	document.getElementById("reactionSelector-"+gene.reaction).classList.add("reactionSelected")
	
	display_preview();
}

function selectTargetCell(num) {
	gene = genes[selectedGene]
	
	if (selectedNeighborDir == "none") {
		document.getElementById("cellSelector"+gene.target).classList.remove("cellSelected")
		if (gene.target == gene.effect && gene.effect != -1) {
			gene.effect = num;
		}
		gene.target = num;
		document.getElementById("cellSelector"+gene.target).classList.add("cellSelected")
		
		if (gene.target == 0) {
			gene.neighbor = 0
			gene.neighbordir = "none"
			selectReaction("ignore")
		}
	} else if(gene.target != 0) {
		document.getElementById("cellSelector0").classList.remove("cellSelected")
		document.getElementById("cellSelector"+gene.neighbor).classList.remove("cellSelected")
		gene.neighbor = num
		gene.neighbordir = selectedNeighborDir
		if (num == 0) {
			gene.neighbordir = "none"
		}
		document.getElementById("cellSelector"+gene.neighbor).classList.add("cellSelected")
	}
	
	run_simulation()
	display_preview()
}

function selectReaction(reaction) {
	gene = genes[selectedGene]
	document.getElementById("reactionSelector-"+gene.reaction).classList.remove("reactionSelected")
	pastReaction = gene.reaction
	gene.reaction = reaction
	if (reaction == "ignore" || gene.target == 0) {
		gene.effect = gene.target
		gene.effectdir = "none"
		gene.reaction = "ignore"
	} else if (reaction == "divide-up") {
		gene.effect = gene.target
		gene.effectdir = "up"
	} else if (reaction == "divide-down") {
		gene.effect = gene.target
		gene.effectdir = "down"
	} else if (reaction == "divide-left") {
		gene.effect = gene.target
		gene.effectdir = "left"
	} else if (reaction == "divide-right") {
		gene.effect = gene.target
		gene.effectdir = "right"
	} else if (reaction == "die") {
		gene.effect = -1
		gene.effectdir = "firstReplace"
	} else if (reaction == "fuse-up") {
		gene.effect = -2
		gene.effectdir = "up"
	} else if (reaction == "fuse-down") {
		gene.effect = -2
		gene.effectdir = "down"
	} else if (reaction == "fuse-left") {
		gene.effect = -2
		gene.effectdir = "left"
	} else if (reaction == "fuse-right") {
		gene.effect = -2
		gene.effectdir = "right"
	} else {
		valid = true
		if (reaction == 2 && gene.target != 1) valid = false
		if (reaction == 3 && gene.target != 2) valid = false
		if (reaction == 4 && gene.target != 1) valid = false
		if (reaction == 5 && gene.target != 4) valid = false
		if (reaction == 6 && gene.target != 4) valid = false
		if (reaction == 7 && gene.target != 4) valid = false
		if (reaction == 8 && gene.target != 1) valid = false
		if (reaction == 9 && gene.target != 8) valid = false
		if (reaction == 10 && gene.target != 8) valid = false
		if (valid == true) {
			gene.effect = parseInt(reaction)
			gene.effectdir = "replace"
		} else {
			gene.reaction = pastReaction
		}
	}
	
	document.getElementById("reactionSelector-"+gene.reaction).classList.add("reactionSelected")
	
	run_simulation()
	display_preview()
}

function setNeighborDir(dir) {
	gene = genes[selectedGene]
	document.getElementById("cellSelector0").classList.remove("cellSelected")
	if (selectedNeighborDir == "none") {
		document.getElementById("cellSelector"+gene.target).classList.remove("cellSelected")
	} else {
		document.getElementById("cellSelector"+gene.neighbor).classList.remove("cellSelected")
	}
	document.getElementById("neighbor-"+selectedNeighborDir).style.opacity = 0;
	
	selectedNeighborDir = dir
	if (selectedNeighborDir == "none") {
		document.getElementById("cellSelector"+gene.target).classList.add("cellSelected")
		document.getElementById("cellSelector-1").style.display = "none"
		document.getElementById("cellSelector-2").style.display = "none"
		document.getElementById("cellSelector11").style.display = "none"
		document.getElementById("neighborMask").style.display = "block"
	} else {
		document.getElementById("cellSelector-1").style.display = "block"
		document.getElementById("cellSelector-2").style.display = "block"
		document.getElementById("cellSelector11").style.display = "block"
		document.getElementById("neighborMask").style.display = "none"
		if (selectedNeighborDir == gene.neighbordir) {
			document.getElementById("cellSelector"+gene.neighbor).classList.add("cellSelected")
		} else {
			document.getElementById("cellSelector0").classList.add("cellSelected")
		}
	}
	document.getElementById("neighbor-"+selectedNeighborDir).style.opacity = 1;
	
	display_preview()
}

function moveRight(num) {
	selectGene(selectedGene)
	temp = genes[num]
	genes[num] = genes[num+1]
	genes[num+1] = temp
	for (let i=0; i<11; i++) {
		document.getElementById("cellSelector"+i).classList.remove("cellSelected")
	}
	for (let i=0; i<19; i++) {
		document.getElementById("reactionSelector-"+reactSelName[i]).classList.remove("reactionSelected")
	}
	selectGene(selectedGene)
	run_simulation()
	display_preview()
}

function moveLeft(num) {
	selectGene(selectedGene)
	temp = genes[num]
	genes[num] = genes[num-1]
	genes[num-1] = temp
	for (let i=0; i<11; i++) {
		document.getElementById("cellSelector"+i).classList.remove("cellSelected")
	}
	for (let i=0; i<19; i++) {
		document.getElementById("reactionSelector-"+reactSelName[i]).classList.remove("reactionSelected")
	}
	selectGene(selectedGene)
	run_simulation()
	display_preview()
}

function moveStart(y,x) {
	startX += x
	startY += y
	decodeSolution(levelCode)
	run_simulation()
	display_preview()
}

function importLevel() {
	levelCode = prompt("Enter a level code here: ", "")
	if (levelCode != null && levelCode != "") {
		decodeSolution(levelCode)
	}
	run_simulation()
	display_preview()
}