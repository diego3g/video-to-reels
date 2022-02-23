export function calculateCuts(result) {
  const cut = { top: 0, bottom: 0 };

  const reelsWidth = 1080;
  const reelsHeight = 1350;

  const faceResult = result[0];

  const originalHeight = faceResult._imageDims._height;
  const originalWidth = faceResult._imageDims._width;

  const resizedHeight = (reelsWidth * originalHeight) / originalWidth;

  const facePosYCenter = faceResult._box._y + (faceResult._box._height / 2);

  const facePositionYInPercent = Math.round((facePosYCenter * 100) / originalHeight);
  const desiredFacePositionYInPercent = 20;

  const amountToCutFromY = resizedHeight - reelsHeight;

  if (facePositionYInPercent < desiredFacePositionYInPercent) {
    cut.top = 0;
    cut.bottom = amountToCutFromY;
  } else {
    const cutFromTop = facePositionYInPercent - desiredFacePositionYInPercent;
    const cutFromBottom = facePositionYInPercent - cutFromTop;

    cut.top = resizedHeight * (cutFromTop / 100);
    cut.bottom = resizedHeight * (cutFromBottom / 100);
  }

  return cut;
}