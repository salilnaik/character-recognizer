class Handwriting{
    constructor() {
        this.model = new Model
        this.canvas = new fabric.Canvas('handwriting', {
            backgroundColor: "#fff",
            isDrawingMode: true
        })
        this.canvas.getContext("2d", {willReadFrequently: true})
        this.resetCanvas()
        this.resizeCanvas()
        this.canvas.freeDrawingBrush.color = "#000"
        this.canvas.freeDrawingBrush.width = this.canvas.width*this.canvas.height*0.00004
        this.bindEvents()
    }

    captureDrawing() {

        let group = new fabric.Group(this.canvas.getObjects()),
            { left, top, width, height } = group,
            scale = window.devicePixelRatio,
            image = this.canvas.contextContainer.getImageData(left*scale, top*scale, width*scale, height*scale);
        
        this.resetCanvas()
        return image;
    }
    bindEvents() {
        let hasTimedOut = false,
            timerId = null,
            isTouchDevice = 'ontouchstart' in window,
            timeOutDuration = isTouchDevice ? 400 : 800;
    
        this.canvas.on("mouse:down", (options) => {
                // reset the canvas in case something was drawn previously
                if(hasTimedOut) this.resetCanvas();
                hasTimedOut = false;
                // clear any timer currently active
                if(timerId) {
                    clearTimeout(timerId);
                    timerId = null;
                }
            })
            .on("mouse:up", () => {
                // set a new timer
                timerId = setTimeout(() => {
                    // once timer is triggered, flag it and run prediction
                    hasTimedOut = true;
                    let prediction = this.model.predict(this.captureDrawing());
                    console.log("prediction", prediction)
                }, timeOutDuration);
            })
    }
    
    resetCanvas() {
        this.canvas.clear();
        this.canvas.backgroundColor = "#fff";
    }

    resizeCanvas() {
		this.canvas.setDimensions({
			width: window.innerWidth,
			height: window.innerHeight*0.74
		})
		this.canvas.calcOffset()
		this.canvas.renderAll()
	}
}
let handwriting = new Handwriting;