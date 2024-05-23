


export default function updateUrlParamScanIndex(url: string,  newValue: number) {
    // Split the URL by '/'
  const urlParts = url.split('/');

  // Replace the last segment with the new value
  urlParts[urlParts.length - 1] = newValue.toString();

  // Join the URL parts back together
  const newUrl = urlParts.join('/');

  return newUrl;
  }