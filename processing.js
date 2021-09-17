var model;
async function loadModel() {
    model = await tf.loadGraphModel('TFJS/model.json');
}

function predictImage() {
    // console.log('processing...');
    let image = cv.imread(canvas);
    cv.cvtColor(image, image, cv.COLOR_RGB2GRAY, 0)

    cv.threshold(image, image, 175, 255, cv.THRESH_BINARY)    

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE)
    let cnt = contours.get(0);
    // You can try more different parameters
    let rect = cv.boundingRect(cnt);
    image = image.roi(rect);
    
    var height = image.rows;
    var width = image.cols;
    if (height > width) {
        height = 20;
        const scaleFactor = image.rows / height;
        width = Math.round(image.cols/scaleFactor);
    } else{
        width = 20;
        const scaleFactor = image.cols / width;
        height = Math.round(image.rows/scaleFactor);
    }
    let newSize = new cv.Size(width, height);
    cv.resize(image,image, newSize, 0, 0, cv.INTER_AREA);

    const LEFT = Math.ceil(4 + (20 - width)/2)
    const TOP = Math.floor(4 + (20 - height)/2)
    const RIGHT = Math.floor(4 + (20 - width)/2)
    const BOTTOM = Math.ceil(4 + (20 - height)/2)
    
    // console.log(`top: ${TOP}, bottom: ${BOTTOM}, right: ${RIGHT}, left: ${LEFT}`)
    cv.copyMakeBorder(image,image, TOP, BOTTOM, LEFT, RIGHT, cv.BORDER_CONSTANT);
    
    // Center of Mass
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    cnt = contours.get(0);
    const Moments = cv.moments(cnt, false);
    
    const cx = Moments.m10 / Moments.m00;
    const cy = Moments.m01 / Moments.m00;

    const X_SHIFT = Math.round(image.cols/2 - cx);
    const Y_SHIFT = Math.round(image.rows/2 - cy);
    // console.log(cx, cy);
    const trans_mat = cv.matFromArray(2,3, cv.CV_64FC1, [1, 0, X_SHIFT, 0, 1, Y_SHIFT]);
    cv.warpAffine(image,image,trans_mat,image.size(), cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
    
    let pixelValues = image.data;
    pixelValues = Float32Array.from(pixelValues);
    pixelValues = pixelValues.map((e) => {return e/255;});
    // console.log(pixelValues);

    const X = tf.tensor([pixelValues]);
    // console.log('shape of tensor is ', X.shape);
    // console.log('data type of tensor is ', X.dtype);
    let result = model.execute(
      {'X': X}, 
      ['accuracy_calculation/prediction']);
    var output = result.dataSync()[0];
    
    // // Testing only (creating canvas for checking if loaded or not)

    // const outputCanvas = document.createElement('CANVAS');
    // cv.imshow(outputCanvas, image);
    // document.body.appendChild(outputCanvas);
    // Cleanup
    image.delete();
    contours.delete();
    cnt.delete();
    hierarchy.delete();
    trans_mat.delete();

    return output;

}