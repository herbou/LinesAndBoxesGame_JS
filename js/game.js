class Game {

    static instance


    constructor(rows, columns) {
        if (Game.instance == null) 
            Game.instance = this

        this.playersUI = document.querySelector(".players")
        this.playerNameUI = document.querySelector(".player-turn .name")
        this.playerTurnBgUI = document.querySelector(".player-turn .bg")

        this.events = {
            edgeFill : [],
            boxFill : [],
            playerSwitch : [],
            playerWin : [],
        }

        this.players = [
            { name:"Alex", color:"#ff50e5", filledBoxes:0 },
            { name:"John", color:"#32ecff", filledBoxes:0 }
        ]
        this.currentPlayerIndex = 0
        this.currentPlayer =this.players[this.currentPlayerIndex]
        

        this.board = new Board(rows, columns)

        this.isGameover = false

        this.addPlayersUI()
        this.updatePlayerNameUI()

        this.addEventListener("boxFill", ()=>this.onBoxFill())
        this.addEventListener("playerSwitch", ()=>this.onPlayerSwitch())
		this.addEventListener("playerWin", ()=>this.onPlayerWin())
    }


    onPlayerWin(){
        this.isGameover = true

        const player = this.players.reduce((prev, current) => {
            return (prev.filledBoxes > current.filledBoxes) ? prev : current
        })
        
        setTimeout(() => {
	    if (this.players[0].filledBoxes == this.players[1].filledBoxes{
            	this.playerNameUI.parentElement.textContent = "Nobody wins"
            	this.playerTurnBgUI.classList.add("no-win")
            	this.playerTurnBgUI.style.background = "#eaeaea"
	    }else{
            	this.playerNameUI.parentElement.textContent = `${player.name} wins`
            	this.playerTurnBgUI.classList.add("win")
            	this.playerTurnBgUI.style.background = player.color
	    }
        }, 500)
    }

    onPlayerSwitch(){
        this.updatePlayerNameUI()
    }

    onBoxFill(){
        this.currentPlayer.filledBoxes++
        this.updatePlayerScoreUI()
    }

    addPlayersUI(){
       this.players.forEach((player, index)=>{
            const div = document.createElement("div")
            div.classList.add("player")

            const b = document.createElement("b")
            b.classList.add("filled-boxes")
            b.textContent = player.filledBoxes
            b.style.background = player.color
            this.players[index]["filledBoxesUI"] = b

            const span = document.createElement("span")
            span.textContent = player.name

            div.appendChild(b)
            div.appendChild(span)

            this.playersUI.appendChild(div)
        })
    }

    updatePlayerScoreUI(){
        this.currentPlayer.filledBoxesUI.innerText = this.currentPlayer.filledBoxes
    }

    updatePlayerNameUI(){
        this.playerNameUI.innerText = this.currentPlayer.name
        this.playerTurnBgUI.style.background= this.currentPlayer.color
    }

    eventExist(event){
        return this.events.hasOwnProperty(event)
    }

    addEventListener(event, callback){
        if (!this.eventExist(event)){
            console.error(`${event} event is not defined`)
            return
        }

        this.events[event].push(callback)
    }

    removeEventListener(event, callback){
        if (!this.eventExist(event)){
            console.error(`${event} event is not defined`)
            return
        }
        this.events[event].splice(this.events[event].indexOf(callback),1)
    }

    invokeEvent(event, args){
        if (!this.eventExist(event)){
            console.error(`${event} event is not defined`)
            return
        }
        this.events[event].forEach(callback => callback(args))
    }

    switchPlayer(){
        if (!this.isGameover){
            this.currentPlayerIndex = (++this.currentPlayerIndex)%this.players.length ;
            this.currentPlayer =this.players[this.currentPlayerIndex]
            this.invokeEvent("playerSwitch")
        }
    }

    /*
	fillEdgesDefault(){
		// fill some edges by default:
		const boardData = [
			{ targetBox:[0,0], edgesToFill:"left,top,bottom" }, 
			{ targetBox:[0,1], edgesToFill:"top,bottom" }, 
			{ targetBox:[1,0], edgesToFill:"left,bottom" }, 
			{ targetBox:[1,1], edgesToFill:"bottom,right" }
		]

		boardData.forEach(data=>{
			let box = this.board.boxes[data.targetBox[0]][data.targetBox[1]]
			let edgePositions = data.edgesToFill.split(",")

			edgePositions.forEach(pos=>{
				let edge = box.getEdge(pos)
				this.board.onEdgeClick(box, edge)
			})
		})
	}
    */
}


///////////////////////////////////////////////////////////////////////

const rows = prompt("Enter Board Rows :", 5) || 5
const cols = prompt("Enter Board Columns :", 5) || 5


const game = new Game(Number(rows), Number(cols))
//game.fillEdgesDefault()

