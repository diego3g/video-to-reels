#!/usr/bin/env zx

import { fold } from "./utils/fold-text.mjs";
import { calculateCuts } from "./utils/calculate-cuts.mjs";

const videoFile = argv["i"] || argv["input"];

if (!videoFile) {
  console.log(`
    ${chalk.bold("No input file specified")}

    ${chalk.bold("Usage:")}
    ${chalk.bold("zx convert.mjs -i video.mp4 [options]")}
  `);

  process.exit(0);
}

if (argv["h"] || argv["help"]) {
  console.log(`
  ${chalk.bold("Video to Reels")}

  ${chalk.bold("Usage:")}
  zx convert.mjs [options]

  ${chalk.bold("Options:")}
    -h | --help - Show help message
    -i | --input - Path of the video to be converted
`);
}

const q = await question("Qual a pergunta? \n");

export async function QFilter() {
  const listFilters = await $`ls ./assets/filters/`;
  const filter = await question(
    "\nEscolha um dos filtros acima e digite o nome abaixo (sem a extensão .CUBE): \n"
  );

  return {
    filter,
    listFilters,
  };
}

const { filter } = await QFilter();

const video = await question("\nDigite o nome do arquivo a ser salvo: \n");

const videoOutput = "videos/";

const textArray = fold(q, 30, true);
const lineBreakedText = textArray.map(line => line.trim()).join("\n");

await fs.writeFile("./tmp/text.txt", lineBreakedText);

const fontSizes = {
  1: "48",
  2: "48",
  3: "48",
  4: "42",
  5: "36",
};

const fontSizeByAmountOfLines = fontSizes[Math.min(textArray.length, 5)];

await $`
convert \
  -font assets/roboto.ttf \
  -fill black \
  -pointsize ${fontSizeByAmountOfLines} \
  -gravity center \
  -annotate +10+95 @tmp/text.txt \
  assets/overlay.png \
  tmp/question.png`;

await $`
ffmpeg -y \
  -i ${videoFile} \
  -vf "transpose=1" \
  -frames:v 1 \
  tmp/frame.png`;

await $`node detect-face/face-detection.js`;

const faceResult = await fs.readJsonSync("./tmp/face.json");
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

      lut3d=assets/filters/${filter}.CUBE
    " \
    -af "
      arnndn=m=assets/bd.rnnn:mix=0.9, \ 
      loudnorm=I=-16:LRA=11:TP=-1.5 \
    " \
    "${videoOutput + video}.mp4"`;
