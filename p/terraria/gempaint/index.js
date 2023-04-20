let palette, image, lastSelectedPixel = [[], -1];
let paletteInput, imageInput, imageWindow, canvas, ctx, gridCanvas, gridctx, gridSize,
  textPos, textBlock, textPaint, imgBlock, imgPaint;
let imageMode = 0;

function applyPaletteToImage(canvas, palette) {
  const ctx = canvas.getContext('2d');

  // Get the image data from the canvas
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Loop through each pixel and replace its color with a color from the palette
  for (let i = 0; i < imageData.data.length; i += 4) {
    if (imageData.data[i + 3] < 192) {
      imageData.data[i] = 0;
      imageData.data[i + 1] = 0;
      imageData.data[i + 2] = 0;
      imageData.data[i + 3] = 0;
      continue;
    }
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];

    // Find the closest color in the palette to the current pixel color
    let closestColorIndex = 0;
    let closestColorDistance = Number.MAX_VALUE;
    for (let j = 0; j < palette.length; j++) {
      const color = palette[j];
      const distance = Math.sqrt(
        Math.pow(r - color[0], 2) +
        Math.pow(g - color[1], 2) +
        Math.pow(b - color[2], 2)
      );
      if (distance < closestColorDistance) {
        closestColorIndex = j;
        closestColorDistance = distance;
      }
    }

    // Set the pixel color to the closest color in the palette
    const color = palette[closestColorIndex];
    imageData.data[i] = color[0];
    imageData.data[i + 1] = color[1];
    imageData.data[i + 2] = color[2];
    imageData.data[i + 3] = 255;
  }

  // Set the modified image data back onto the canvas
  return imageData;
}

function gplToPalette(gplString) {
  const lines = gplString.trim().split('\n');
  const colors = [];

  for (let i = 3; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line[0] !== '#') {
      const [r, g, b, name] = line.split(/\s+/);
      colors.push([r, g, b]);
    }
  }
  return colors;
}

function updateCanvas(imageData) {
  ctx.putImageData(imageData, 0, 0);
  imageWindow.setAttribute('style', `width:${4 * canvas.width}px;height:${4 * canvas.height}px`);
  imageMode = 1;
  updateGrid();
  canvas.parentElement.parentElement.parentElement.classList.remove('hide');
  textPos.parentElement.classList.remove('hide');
}

function updateGrid() {
  const scale = (parseInt(imageWindow.style.width) * 0.9) / canvas.width;
  if (scale < 3.6) {
    gridctx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
    gridSize = 0;
    return;
  }
  newSize = scale > 12 ? 1 : 8;   // Set the size of the grid squares
  spacing = scale > 12 ? 8 : 4;
  if (newSize == gridSize) return;
  gridSize = newSize;

  gridCanvas.width = canvas.width * spacing;
  gridCanvas.height = canvas.height * spacing;

  for (let x = 0; x <= canvas.width * spacing; x += gridSize * spacing) {
    gridctx.beginPath();
    gridctx.moveTo(x + 0.5, 0);
    gridctx.lineTo(x + 0.5, canvas.height * spacing);
    gridctx.stroke();
  }
  for (let y = 0; y <= canvas.height * spacing; y += gridSize * spacing) {
    gridctx.beginPath();
    gridctx.moveTo(0, y + 0.5);
    gridctx.lineTo(canvas.width * spacing, y + 0.5);
    gridctx.stroke();
  }
}

function rgbToHex(r, g, b) {
  return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}


fetch('blocks.json')
  .then((response) => response.json())
  .then((json) => {
    blockJson = json;
    blockList = Object.keys(blockJson);
  });
fetch('paint.json')
  .then((response) => response.json())
  .then((json) => {
    paintJson = json;
    paintList = Object.keys(paintJson);
  });

function getObjectJSON(jsonObj, color) {
  for (const prop in jsonObj) {
    if (jsonObj[prop].includes(color)) {
      return prop;
    }
  }
}


function selectPixel(pixel) {
  imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const a = pixel[3];

  if (a != 255 || lastSelectedPixel[1] > 3) {
    lastSelectedPixel = [[],-1];
    imageMode = 1;
    return;
  }
  imageMode = 2;
  
  const r = pixel[0];
  const g = pixel[1];
  const b = pixel[2];
  const pixels = imageData.data;

  if (pixel.toString() == lastSelectedPixel[0].toString()){
    lastSelectedPixel = [[r, g, b, a], lastSelectedPixel[1] +1];
    const opacity = 256 - lastSelectedPixel[1] * 64;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] == 0)
        pixels[i + 3] = 0;
      else if (a < 255)
        pixels[i + 3] = 255;
      else if (r != pixels[i] || g != pixels[i + 1] || b != pixels[i + 2])
        pixels[i + 3] = opacity;
      else
        pixels[i + 3] = 255;
    }
  } else {
    if (lastSelectedPixel[1] > 0) {
      lastSelectedPixel = [[],-1];
      imageMode = 1;
      return;
    }
    for (let i = 0; i < pixels.length; i += 4) {
      lastSelectedPixel = [[r, g, b, a], 0];
      if (r == pixels[i] && g == pixels[i + 1] && b == pixels[i + 2] && a == pixels[i + 3]){
        pixels[i]   = 255 -r;
        pixels[i+1] = 255 -g;
        pixels[i+2] = 255 -b;
        pixels[i+3] = 255;
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}



document.addEventListener('DOMContentLoaded', () => {
  paletteInput = document.getElementById('palette-input');
  imageInput = document.getElementById('image-input');
  imageWindow = document.getElementById('image-window');
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  gridCanvas = document.getElementById('grid');
  gridctx = gridCanvas.getContext('2d');
  imgBlock = document.createElement("span");
  imgPaint = document.createElement("span");
  imgBlock.classList = ["block"];
  imgPaint.classList = ["paint"];


  [textPos, textBlock, textPaint] = document.getElementById('pixel-text').children;

  gridctx.strokeStyle = "#000";    // Set the color of the grid lines

  fetch('terraria_gemstone.gpl')
    .then(response => response.text())
    .then(gplString => {
      palette = gplToPalette(gplString);
    });
  paletteInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      const gplString = event.target.result;
      palette = gplToPalette(gplString);
      if (image && palette)
        updateCanvas(applyPaletteToImage(canvas, palette));
    };
    reader.readAsText(file);
  });

  imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      image = new Image();
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        if (image && palette)
          updateCanvas(applyPaletteToImage(canvas, palette));
      };
      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  });

  imageWindow.addEventListener('wheel', (event) => {
    if (event.ctrlKey) {
      event.preventDefault(); // prevent the default scroll behavior
      const delta = event.deltaY > 0 ? -1 : 1; // determine the scroll direction
      const newWidth = parseInt(imageWindow.style.width) + delta * 64;
      const newHeight = parseInt(imageWindow.style.height) + delta * 64;
      if (newWidth >= canvas.width && newHeight >= canvas.height) {
        imageWindow.setAttribute('style', `width:${newWidth}px;height:${newHeight}px`);
        updateGrid()
      }
    }
  });

  gridCanvas.addEventListener('mousemove', (event) => {
    if (imageMode != 1) return
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / (parseInt(imageWindow.style.width) * 0.9);
    const x = (event.clientX - rect.left) * scale;
    const y = (event.clientY - rect.top) * scale;
    const imageData = ctx.getImageData(x, y, 1, 1);
    const pixel = imageData.data;
    let hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
    if (pixel[3] == 0) hex = "00000000"

    textPos.innerText = `(${Math.floor(x)}, ${Math.floor(y)})`;
    block = getObjectJSON(blockJson, hex);
    paint = getObjectJSON(paintJson, hex);
    textBlock.innerText = block;
    textPaint.innerText = paint;
    if (paint == undefined)
      return textPaint.innerText = '#'+hex;
    if (block != 'none') {
      imgBlock.setAttribute('style', `--i:${blockList.indexOf(block)};width:24px;height:24px`);
      textBlock.prepend(imgBlock);
    }
    if (paint != 'none') {
      imgPaint.setAttribute('style', `--i:${paintList.indexOf(paint)};width:22px;height:20px`);
      textPaint.prepend(imgPaint);
    }
  });

  gridCanvas.addEventListener('click', (event) => {
    if (!imageMode) return;
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / (parseInt(imageWindow.style.width) * 0.9);
    const x = (event.clientX - rect.left) * scale;
    const y = (event.clientY - rect.top) * scale;

    ctx.drawImage(image, 0, 0);
    ctx.putImageData(applyPaletteToImage(canvas, palette), 0, 0);

    const imageData = ctx.getImageData(x, y, 1, 1);
    const pixel = imageData.data;

    selectPixel(pixel);
  });
});