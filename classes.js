class Gene {
	constructor(target, neighbor, neighbordir, effect, effectdir, reaction) {
		this.target = target
		this.neighbor = neighbor // -1 = ignore, -2 = any
		this.neighbordir = neighbordir
		this.effect = effect // -1 = delete, -2 = bond
		this.effectdir = effectdir
		this.reaction = reaction
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