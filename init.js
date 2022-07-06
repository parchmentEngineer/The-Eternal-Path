data = [] 
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
for (let i=0; i<13; i++) {
	if (i==12) {
		elem.innerHTML += '<div class="board" id="board'+i+'" style="position: absolute; left: 829px; top: 188px;"></div>'
	} else {
		elem.innerHTML += '<div class="board" id="board'+i+'"></div>'
	}
	let elem2 = document.getElementById("board"+i)
	for (let ii=0; ii<20; ii++) {
		elem2.innerHTML += '<div id="tile'+i+'-'+ii+'"></div>'
	}
}
geneSelX = [12 , 69 , 123, 180, 234, 291, 345, 402, 456, 513, 567, 624, 678, 735, 789, 846]
geneSelY = [355, 484, 355, 484, 355, 484, 355, 484, 355, 484, 355, 484, 355, 484, 355, 484]
for (let i=0; i<16; i++) {
	elem.innerHTML += '<div class="geneSelector" id="geneSelector'+i+'" style="top: '+geneSelY[i]+'px; left: '+geneSelX[i]+'px;" onClick="selectGene('+i+')"></div>'
}
elem.innerHTML += '<div class="arrow" id="arrow-up" style="top: -20px; left: 11px; background-image: url(\'images/arrow-up.png\');" onClick="moveStart(-1,0)"></div>'
elem.innerHTML += '<div class="arrow" id="arrow-down" style="top: 36px; left: 11px; background-image: url(\'images/arrow-down.png\');" onClick="moveStart(1,0)"></div>'
elem.innerHTML += '<div class="arrow" id="arrow-left" style="top: 8px; left: -17px; background-image: url(\'images/arrow-left.png\');" onClick="moveStart(0,-1)"></div>'
elem.innerHTML += '<div class="arrow" id="arrow-right" style="top: 8px; left: 39px; background-image: url(\'images/arrow-right.png\');" onClick="moveStart(0,1)"></div>'

elem.innerHTML += '<div id="geneTarget", style="top: 575; left: 19; position: absolute;"></div>'
elem.innerHTML += '<div id="geneReaction", style="top: 556; left: 755; position: absolute;"></div>'
elem.innerHTML += '<div id="nothing", style="display: none;"></div>'

cellSelX = [274, 136, 136, 168, 189, 221, 253, 285, 221, 253, 285]
cellSelY = [677, 569, 623, 623, 569, 569, 569, 569, 623, 623, 623]
for (let i=0; i<11; i++) {
	elem.innerHTML += '<div class="cellSelector" id="cellSelector'+i+'" style="top: '+cellSelY[i]+'px; left: '+cellSelX[i]+'px;" onClick="selectTargetCell('+i+')"></div>'
}
elem.innerHTML += '<img id="neighborMask" src="images/neighborMask.png" style="left: 134px; top: 664px; position: absolute;">'
elem.innerHTML += '<div class="cellSelector" id="cellSelector-1" style="top: 677px; left: 221px;" onClick="selectTargetCell(-1)"></div>'
elem.innerHTML += '<div class="cellSelector" id="cellSelector-2" style="top: 677px; left: 189px;" onClick="selectTargetCell(-2)"></div>'
elem.innerHTML += '<div class="cellSelector" id="cellSelector11" style="top: 677px; left: 136px;" onClick="selectTargetCell(11)"></div>'


reactSelX = [415, 537, 631, 490, 584, 415, 537, 631, 490, 584, 603, 650, 415, 462, 509, 556, 697, 744, 791]
reactSelY = [552, 552, 552, 552, 552, 612, 612, 612, 612, 612, 672, 672, 672, 672, 672, 672, 672, 672, 672]
reactSelName = ['ignore', 'divide-up', 'divide-down', 'divide-left', 'divide-right', 'die', 'fuse-up', 'fuse-left', 'fuse-down', 'fuse-right', '2', '3', '4', '5', '6', '7', '8', '9', '10']
for (let i=0; i<19; i++) {
	elem.innerHTML += '<div class="reactionSelector" id="reactionSelector-'+reactSelName[i]+'" style="top: '+reactSelY[i]+'; left: '+reactSelX[i]+';" onClick="selectReaction(\''+reactSelName[i]+'\')"></div>'
}

elem.innerHTML += '<div id="neighbor"></div>'
neighborElem = document.getElementById("neighbor")
nArrX = [14,0,14,28,14]
nArrY = [0,14,14,14,28]
nArrName = ['up','left','none','right','down']
for (let i=0; i<5; i++) {
	neighborElem.innerHTML += '<div class="neighborArr" id="neighbor-'+nArrName[i]+'" style="top: '+nArrY[i]+'px; left: '+nArrX[i]+'px; background-image: url(\'images/neighbor-'+nArrName[i]+'.png\');" onClick="setNeighborDir(\''+nArrName[i]+'\')"></div>'
}

for (let i=0; i<8; i++) {
	elem.innerHTML += '<div class="moveArrowRight" style="top: 407px; left: '+(73+(111*i))+'px;" onClick="moveRight('+(i*2)+')"></div>'
	elem.innerHTML += '<div class="moveArrowLeft" style="top: 468px; left: '+(98+(111*i))+'px;" onClick="moveLeft('+((i*2)+1)+')"></div>'
}

for (let i=0; i<7; i++) {
	elem.innerHTML += '<div class="moveArrowRight" style="top: 468px; left: '+(130+(111*i))+'px;" onClick="moveRight('+((i*2)+1)+')"></div>'
	elem.innerHTML += '<div class="moveArrowLeft" style="top: 407px; left: '+(152+(111*i))+'px;" onClick=" moveLeft('+((i*2)+2)+')"></div>'
}

elem.innerHTML += '<div class="import" style="top: 357px; left: 911px; position: absolute; width: 20px; height: 41px;" onClick="importLevel()"></div>'

nameString = "XXX0B0B1F0F1F2F3S0S1S2MT"
genes = []
for (let i=0; i<16; i++) {
	add_gene(0,0,"none",0,"none","ignore")
}
startX = 0
startY = 0
selectedGene = -1
selectedNeighborDir = "none"
selectGene(0)
setNeighborDir("none")
//levelCode = 'MTXXXX-XXXXXX-XXXXXX-XXXXXX-F1XXXR-F1XXLR-F1XXLR-B1XXLX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-F1XXXR-F1XXLR-F1XXLR-B1XXLX-MTXXXX-XXXXXX-XXXXXX-XXXXXX'
levelCode = "MTXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-MTXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-MTXXXX"
levelCode = "F0XDXR-F0XXLX-MTXXXX-MTXXXX-F0UDXX-MTXXXX-MTXXXX-MTXXXX-F0UXXR-F0XXLR-F0XDLX-MTXXXX-MTXXXX-MTXXXX-F0UDXR-F0XXLX-MTXXXX-F0XXXR-F0UXLX-MTXXXX"


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

decodeSolution(levelCode)

run_simulation()
display_preview()