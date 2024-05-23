/**
 * Preloads an image from an array of image URLs at a specified index.
 *
 * @function
 * @param {string[]} imageUrls - An array of image URLs.
 * @param {number} index - The index of the image URL to preload.
 * @return {Promise<void>} A promise that resolves when the image is successfully preloaded.
 * @throws {Error} If there is an error while preloading the image.
 */
export default function preloadImage(imageUrls, index) {
  const img = new Image();
  img.src = imageUrls[index + 1];

  const imagePromise = new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  return Promise.resolve(imagePromise);
}
