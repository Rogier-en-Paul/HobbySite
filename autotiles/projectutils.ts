function loadImagesCO(urls:string[]):Promise<HTMLImageElement[]>{
    var promises:Promise<HTMLImageElement>[] = []

    for(var url of urls){
        promises.push(new Promise((res,rej) => {
            var image = new Image()
            image.crossOrigin = 'anonymous';
            image.onload = e => {
                res(image)     
            }
            image.src = url
        }))
    }

    return Promise.all(promises)
}


function convertImages2Imagedata(images:HTMLImageElement[]):ImageData[]{
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var result:ImageData[] = []
    for(var img of images){
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0 );
        result.push(context.getImageData(0, 0, img.width, img.height))
    }
    return result
}