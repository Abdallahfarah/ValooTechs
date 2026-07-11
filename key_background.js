import { Jimp } from 'jimp';

async function main() {
  const img = await Jimp.read('d:/Valo-portfolio/public/hero.png');
  const width = img.bitmap.width;
  const height = img.bitmap.height;
  const data = img.bitmap.data;
  
  const visited = new Uint8Array(width * height);
  const queue = [];
  
  // Helper to get pixel index
  const getIdx = (x, y) => (y * width + x) * 4;
  
  // Helper to check if pixel is near-white (background threshold)
  const isNearWhite = (x, y) => {
    const idx = getIdx(x, y);
    const r = data[idx];
    const g = data[idx+1];
    const b = data[idx+2];
    // The background is extremely white/clean, usually > 240
    return r > 240 && g > 240 && b > 240;
  };
  
  // Initialize queue with all border pixels
  for (let x = 0; x < width; x++) {
    if (isNearWhite(x, 0)) { queue.push([x, 0]); visited[0 * width + x] = 1; }
    if (isNearWhite(x, height - 1)) { queue.push([x, height - 1]); visited[(height - 1) * width + x] = 1; }
  }
  for (let y = 0; y < height; y++) {
    if (isNearWhite(0, y)) { queue.push([0, y]); visited[y * width + 0] = 1; }
    if (isNearWhite(width - 1, y)) { queue.push([width - 1, y]); visited[y * width + (width - 1)] = 1; }
  }
  
  let count = 0;
  while (queue.length > 0) {
    const [cx, cy] = queue.shift();
    
    // Set alpha to 0 for this background pixel
    const idx = getIdx(cx, cy);
    data[idx+3] = 0;
    count++;
    
    // Check 4-neighbors
    const neighbors = [
      [cx+1, cy],
      [cx-1, cy],
      [cx, cy+1],
      [cx, cy-1]
    ];
    
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const vIdx = ny * width + nx;
        if (!visited[vIdx] && isNearWhite(nx, ny)) {
          visited[vIdx] = 1;
          queue.push([nx, ny]);
        }
      }
    }
  }
  
  // Anti-aliasing pass: find edge pixels and smooth their alphas
  // to avoid white halos around the laptop and glass platform
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = getIdx(x, y);
      const vIdx = y * width + x;
      
      // If this pixel is NOT a background pixel itself
      if (!visited[vIdx]) {
        // Check if it's adjacent to a background pixel
        const hasBgNeighbor = 
          visited[y * width + (x + 1)] ||
          visited[y * width + (x - 1)] ||
          visited[(y + 1) * width + x] ||
          visited[(y - 1) * width + x];
          
        if (hasBgNeighbor) {
          const r = data[idx];
          const g = data[idx+1];
          const b = data[idx+2];
          const brightness = (r + g + b) / 3;
          
          // If it's quite light, make it semi-transparent relative to its brightness
          if (brightness > 210) {
            const alphaFactor = (255 - brightness) / (255 - 210);
            data[idx+3] = Math.max(0, Math.min(255, Math.floor(alphaFactor * 255)));
          }
        }
      }
    }
  }
  
  console.log(`Keyed out ${count} pixels as transparent background.`);
  await img.write('d:/Valo-portfolio/public/hero.png');
  console.log('Saved transparent image to d:/Valo-portfolio/public/hero.png');
}

main().catch(console.error);
