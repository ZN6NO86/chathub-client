export async function compressImage(file, quality = 0.6){
    return new Promise(resolve => {
        const img = new Image;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            const scale = Math.min(1, 800/img.width);
            canvas.width = img.width*scale;
            canvas.height = img.height*scale;
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(
                blob => resolve(blob),
                "image/jpeg",
                quality
            );
        };
        img.src = URL.createObjectURL(file);
    })
}