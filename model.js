class Model{
    constructor(){
        this.alphabet = "abcdefghijklmnopqrstuvwxyz";
        this.characters = "0123456789" + this.alphabet.toUpperCase() + this.alphabet;
        tf.loadLayersModel("jsmodel/model.json").then(model => {
            this._model = model;
        })
    }
    preprocessImage(pixelData) {

        const targetDim = 28,
            edgeSize = 2,
            resizeDim = targetDim-edgeSize*2,
            padVertically = pixelData.width > pixelData.height,
            padSize = Math.round((Math.max(pixelData.width, pixelData.height) - Math.min(pixelData.width, pixelData.height))/2),
            padSquare = padVertically ? [[padSize,padSize], [0,0], [0,0]] : [[0,0], [padSize,padSize], [0,0]];
    
        return tf.tidy(() => {
            // convert the pixel data into a tensor with 1 data channel per pixel
            // i.e. from [h, w, 4] to [h, w, 1]
            let tensor = tf.browser.fromPixels(pixelData, 1)
                // pad it until square, such that w = h = max(w, h)
                .pad(padSquare, 255.0)
    
            // scale it down to smaller than target
            tensor = tf.image.resizeBilinear(tensor, [resizeDim, resizeDim])
                // pad it with blank pixels along the edges (to better match the training data)
                .pad([[edgeSize,edgeSize], [edgeSize,edgeSize], [0,0]], 255.0)
    
            // invert and normalize to match training data
            tensor = tf.scalar(1.0).sub(tensor.toFloat().div(tf.scalar(255.0)))
    
            // Reshape again to fit training model [N, 28, 28, 1]
            // where N = 1 in this case
            return tensor.expandDims(0)
        });
    }

    predict(pixelData) {
        let tensor = this.preprocessImage(pixelData);
        this.prediction = this._model.predict(tensor).as1D();
        this.predArray = Array.from(this.prediction.dataSync()).map((val, index) => [val, index, this.characters[index]]).sort((a, b) => b[0] - a[0]).slice(0, 5)
        // get the index of the most probable character
        this.argMax = this.prediction.argMax().dataSync()[0];
        // get the character at that index
        let character = this.characters[this.argMax];

        
        document.getElementById("bar1").style.height = Math.round(this.predArray[0][0] * 10000)/100 + "%";
        document.getElementById("bar1").style.animation = 'none';
        document.getElementById("text1").innerText = this.predArray[0][2];
        setTimeout(function(){document.getElementById("bar1").style.animation = ''}, 10);
        document.getElementById("bar2").style.height = Math.round(this.predArray[1][0] * 10000)/100 + "%";
        document.getElementById("bar2").style.animation = 'none';
        document.getElementById("text2").innerText = this.predArray[1][2];
        setTimeout(function(){document.getElementById("bar2").style.animation = ''}, 10);
        document.getElementById("bar3").style.height = Math.round(this.predArray[2][0] * 10000)/100 + "%";
        document.getElementById("bar3").style.animation = 'none';
        document.getElementById("text3").innerText = this.predArray[2][2];
        setTimeout(function(){document.getElementById("bar3").style.animation = ''}, 10);
        document.getElementById("bar4").style.height = Math.round(this.predArray[3][0] * 10000)/100 + "%";
        document.getElementById("bar4").style.animation = 'none';
        document.getElementById("text4").innerText = this.predArray[3][2];
        setTimeout(function(){document.getElementById("bar4").style.animation = ''}, 10);
        document.getElementById("bar5").style.height = Math.round(this.predArray[4][0] * 10000)/100 + "%";
        document.getElementById("bar5").style.animation = 'none';
        document.getElementById("text5").innerText = this.predArray[4][2];
        setTimeout(function(){document.getElementById("bar5").style.animation = ''}, 10);

        return character;
    }
}