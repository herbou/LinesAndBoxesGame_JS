class Edge {

   constructor(box, position) {
      this.box = box
      this.filled = false
      this.position = position

      this.ui = this.createUI()
   }

   get inverseEdge() {
      return this.box.inverseEdges[this.position]
   }

   fill() {
      if (!this.filled) {
         this.filled = true
         this.ui.classList.add("filled")

         Game.instance.invokeEvent("edgeFill", this)
      }
   }

   createUI() {
      const ui = document.createElement("button")
      ui.setAttribute("data-position", this.position)
      ui.classList.add("edge")
      ui.classList.add(this.position)
      return ui
   }
   
}
