/**
 * Preload images from an array of image URLs.
 *
 * @param {string[]} imageUrls - An array of image URLs to preload.
 * @return {Promise<void[]>} A Promise that resolves when all images are successfully preloaded.
 */
export default function preloadImages(imageUrls) {
  const imagePromises = [];

  for (const imageUrl of imageUrls) {
    const img = new Image();
    img.src = imageUrl;

    const imagePromise = new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    imagePromises.push(imagePromise);
  }

  return Promise.all(imagePromises);
}
