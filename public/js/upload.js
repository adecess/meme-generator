let imgInput
    let img
    let imgW;
    let imgH;
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
}

function draw() {
    background('rgb(247, 234, 196)');
    if (img) {
        imgUpdate();
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
        img = loadImage(file.data, 
            function(){
              imgUpdate();
              resizeCanvas(imgW, imgH);
            });
    } else {
        img = null
    }
}

function imgUpdate() {
    image(img, 0, 0, width, height);
    imgW = img.width;
    imgH = img.height;
}