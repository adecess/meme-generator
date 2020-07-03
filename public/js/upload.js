let imgInput
    let img
    let cnv
    let topTxtInput
    let bottomTxtInput
    let slider
    let color

function setup() {
    imgInput = createFileInput(handleFile)
    imgInput.parent(document.querySelector('.canvas-wrapper'))

    cnv = createCanvas(300, 300)
    cnv.parent(document.querySelector('.canvas-wrapper'))

    topTxtInput = createInput('').attribute('placeholder', 'Top Text')
    topTxtInput.parent(document.querySelector('.top-text'))

    bottomTxtInput = createInput('').attribute('placeholder', 'Bottom Text')
    bottomTxtInput.parent(document.querySelector('.bottom-text'))
    
    slider = createSlider(0, 50, 20)
    slider.parent(document.querySelector('.slider'))

    color = createColorPicker('white')
    color.parent(document.querySelector('.color-picker'))

    document.querySelector('.save-btn').addEventListener('click', (e) => {
        e.preventDefault()
        saveCanvas(cnv, 'myCanvas', 'jpg')
    })

    document.querySelector('.save-portfolio-btn').addEventListener('click', (e) => {
        e.preventDefault()

        let serverUrl = '/upload/meme'; //we've made a POST endpoint on the server at /upload/meme
        let formdata = new FormData() ; //create a from to of data to upload to the server
        formdata.append('meme', cnv.canvas.toBlob(), 'bigMeme.png') ; 
        //build a HTTP POST request
        let httpRequestOptions = {
            method: 'POST',
            body: formdata, // with our form data packaged above
            headers: new Headers({
            'enctype': 'multipart/form-data' // the enctype is important to work with multer on the server
            })
        };
        // console.log(httpRequestOptions);
        // use p5 to make the POST request at our URL and with our options
        httpDo(
            serverUrl,
            httpRequestOptions,
            (successStatusCode)=>{ //if we were successful...
            console.log("uploaded recording successfully: " + successStatusCode)
            },
            (error) => {console.error(error);}
        )
    })
}

function draw() {
    background('rgb(247, 234, 196)');
    if (img) {
        image(img, 0, 0, width, height)
    }

    let valSlider = slider.value()
    let valColor = color.value()

    fill(valColor)
    textSize(valSlider)
    textAlign(CENTER, CENTER);
    text(topTxtInput.value(), width/2, height * 0.10)

    fill(valColor)
    textSize(valSlider)
    textAlign(CENTER, CENTER);
    text(bottomTxtInput.value(), width/2, height * 0.90)
}

function handleFile(file) {
    print(file)
    if (file.type === 'image') {
        img = createImg(file.data, '')
        img.hide()
    } else {
        img = null
    }
}