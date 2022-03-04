# Video to Reels

This project aims to automate the process of converting a video file to a Instagram Reels ready format using FFMpeg, Imagemagick, Tensorflow and more.

![Example](/.github/banner.png)

## Dependencies

To run this script you need to install locally on your machine the following dependencies:

- Node.js;
- FFmpeg;
- Imagemagick;
- ZX (https://github.com/google/zx);

## Running

1. Open `detect-face` folder and run `npm install`;
2. Save a horizontal video inside the `origins` folder;
3. Change the value of `videoFile` variable inside `convert.mjs`;
4. Run `zx convert.mjs` in the root folder to start conversion;
5. Done! The output file will be stored at `/videos` folder;

## Features

- [x] Rotate
- [x] Resize
- [x] Color filter
- [x] Audio normalization
- [x] Remove background noises
- [x] Add Instagram question overlay
- [x] Position video by face
- [ ] Cut video when not talking
- [ ] Subtitles
