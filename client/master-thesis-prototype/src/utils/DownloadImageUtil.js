import logger from './loggerUtil';

/**
 * Utility function to download an image from the provided URL.
 *
 * @async
 * @function
 * @param {string} imageUrl - The URL of the image to download.
 * @return {Promise<void>} A promise that resolves when the download is completed.
 * @throws {Error} If there is an error while downloading the image.
 */
export default async function downloadImageUtil(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Create a blob URL for the image
    const blobUrl = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'downloaded-image.jpg'; // Specify the download file name

    // Trigger the click event to start the download
    link.click();

    // Revoke the blob URL to free up resources
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    logger.error('Error while downloading image:', error);
  }
};
