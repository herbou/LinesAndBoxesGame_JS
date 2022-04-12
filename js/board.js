class Board {

    static ROWS
    static COLUMNS
	static BOXES_COUNT


	constructor(rows, columns) {
		Board.ROWS = rows
		Board.COLUMNS = columns
		Board.BOXES_COUNT = rows*columns

		this.uiRoot = document.querySelector(".board")
		this.setEdgeThikness()

		this.boxes = new Array(rows).fill(null).map(()=>new Array(columns).fill(null))

		this.adjacentBoxesToFill = []
		this.isFillingAdjacentBoxes = false
		this.filledBoxes = 0

        this.generate()

		this.addEdgeClickEventListener()
		
		Game.instance.addEventListener("edgeFill", edge=>this.onEdgeFill(edge))
		Game.instance.addEventListener("boxFill", box=>this.onBoxFill(box))
	}
	
    setEdgeThikness(){
        let thikness = (Board.BOXES_COUNT<=25) ? 10 :
					   (Board.BOXES_COUNT<=100) ? 8 :
					   (Board.BOXES_COUNT<=200) ? 5 : 3
        document.querySelector(':root').style.setProperty('--edge-thikness', `${thikness}px`)
    }

	addEdgeClickEventListener() {
		this.uiRoot.addEventListener("click", e=>{
			if (!this.isFillingAdjacentBoxes){
				if (e.target.classList.contains("edge")){
					let edgePosition = e.target.getAttribute("data-position")
					let r = e.target.parentElement.getAttribute("data-row")
					let c = e.target.parentElement.getAttribute("data-column")
					let box = this.boxes[r][c]
					let edge = box.getEdge(edgePosition)
					this.onEdgeClick(box, edge)
				}
			}
		})
	}

	onEdgeClick(box, edge){
		box.fillEdge(edge)
		
		const adjacentBox = box.getAdjacentBox(edge.position)
		if (adjacentBox != null)
			adjacentBox.fillEdge(edge.inverseEdge)

		setTimeout(() => {
			if(this.adjacentBoxesToFill.length == 0)
				Game.instance.switchPlayer()
		}, 100)
			
	}

	onEdgeFill (edge){
		const box = edge.box
		box.remainingEdges--
		
		if (box.remainingEdges == 0){
			this.fillBox(box)
		}
	}

	fillBox(box){
		this.adjacentBoxesToFill.push(box)
		
		setTimeout(() => this.checkAdjacentadjacentBoxesToFill(box), 100)

		if(!this.isFillingAdjacentBoxes){
			this.isFillingAdjacentBoxes = true
			this.fillBoxes()
		}
	}

	onBoxFill(box){
		this.filledBoxes++

		if (this.filledBoxes == Board.BOXES_COUNT)
			Game.instance.invokeEvent("playerWin")
	}

	generateBoardBoxes(){
		for (let r = 0; r < Board.ROWS; r++)
			for (let c = 0; c < Board.COLUMNS; c++) {
				const box = new Box(r, c)
				this.boxes[r][c] = box
				this.uiRoot.appendChild(box.ui)
			}

		//set each box adjacents and inverses
		for (let r = 0; r < Board.ROWS; r++)
			for (let c = 0; c < Board.COLUMNS; c++){
				let box = this.boxes[r][c]
				box.adjacentBoxes = this.getBoxAdjacents(box)
				box.inverseEdges = this.getBoxInverseEdges(box)
				this.boxes[r][c] = box
			}
	}

	generate(){
		this.uiRoot.style.gridTemplate = `repeat(${Board.ROWS}, 1fr) / repeat(${Board.COLUMNS}, 1fr)`
		this.generateBoardBoxes()
	}

	getBoxAdjacents(box){
		return {
			top    : (box.row>0) ? this.boxes[box.row-1][box.column] : null,
			right  : (box.column<Board.COLUMNS-1) ? this.boxes[box.row][box.column+1] : null,
			bottom : (box.row<Board.ROWS-1) ? this.boxes[box.row+1][box.column] : null,
			left   : (box.column>0) ? this.boxes[box.row][box.column-1] : null
		}
	}

	getBoxInverseEdges(box){
		const inverseEdgePositions = {
			top    : "bottom", 
			right  : "left", 
			bottom : "top", 
			left   : "right"
		}
		for (const [position, edge] of Object.entries(box.edges)){
			const inversePosition = inverseEdgePositions[position]
			const adjacentBox = box.getAdjacentBox(position)
			if(adjacentBox != null)
				box.inverseEdges[position] = adjacentBox.edges[inversePosition]
		}
		return box.inverseEdges
	}
	
	checkAdjacentadjacentBoxesToFill(box){
		for (const [position, adjacentBox] of Object.entries(box.adjacentBoxes)){
			if (adjacentBox != null){
				if (!adjacentBox.filled && adjacentBox.remainingEdges == 1){
					const edge = adjacentBox.getLastRemainingEdge()
					if (edge!=null){
						this.onEdgeClick(adjacentBox, edge)
					}
					
				}
			}
		}
	}

	fillBoxes(){
		if (this.adjacentBoxesToFill.length != 0){
			setTimeout(()=>{
				const box = this.adjacentBoxesToFill.shift()
				box.fill(Game.instance.currentPlayer.color)
				this.fillBoxes()
			}, 150)

		}else{
			setTimeout(() => {
				this.isFillingAdjacentBoxes = false
				this.adjacentBoxesToFill = []
				
				Game.instance.switchPlayer()
			}, 600)
		}
	}

}
