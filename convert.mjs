#!/usr/bin/env zx

import { fold } from './utils/fold-text.mjs'
import { calculateCuts } from './utils/calculate-cuts.mjs'

const q = await question('Qual a pergunta? \n')

const videoFile = 'origins/03.mp4';

const textArray = fold(q, 30, true);
const lineBreakedText = textArray
  .map(line => line.trim())
  .join('\n');

await fs.writeFile('./tmp/text.txt', lineBreakedText)

const fontSizes = {
  1: '48',
  2: '48',
  3: '48',
  4: '42',
  5: '36'
} 

const fontSizeByAmountOfLines = fontSizes[Math.min(textArray.length, 5)]

await $`
  convert \
    -font assets/roboto.ttf \
    -fill black \
    -pointsize ${fontSizeByAmountOfLines} \
    -gravity center \
    -annotate +10+95 @tmp/text.txt \
    assets/overlay.png \
    tmp/question.png`

await $`
  ffmpeg -y \
    -i ${videoFile} \
    -vf "transpose=1" \
    -frames:v 1 \
    tmp/frame.png`

await $`node detect-face/face-detection.js`

const faceResult = await fs.readJsonSync('./tmp/face.json');
const cut = calculateCuts(faceResult);

await $`
  ffmpeg -y \
    -i ${videoFile} \
    -i tmp/question.png \
    -c:v h264_videotoolbox \
    -b:v 5000k \
    -filter_complex "
      transpose=1, \
      scale=w=1080:h=1920, \
      crop=1080:1350:0:${cut.top}, \
      overlay=(main_w/2)-375:main_h-overlay_h-40, \
      lut3d=assets/filters/02.CUBE
    " \
    -af "
      arnndn=m=assets/bd.rnnn:mix=0.9, \ 
      loudnorm=I=-16:LRA=11:TP=-1.5 \
    " \
    output.mp4`

