"""
Author: Jan Valušek (xvalus03)
Description: Module with functions for downloading scans from CeskeArchivy.
"""

def get_ceskearchivy_scans_urls(signature, numberOfScans):
    urls = []

    for page in range(1, int(numberOfScans) + 1):
        urls.append(f"https://digi.ceskearchivy.cz/pages/open.php?id={signature}&page={page}&menu=3")

    return urls


async def ceskearchivy_yield_requests(response):
    page = response.meta["playwright_page"]

    urls = get_ceskearchivy_scans_urls(response.meta['signature'], response.meta['numberOfScans'])
    for url in urls:
        await page.goto(url)
        await download_ceskearchivy_jpeg(page, response.meta['item_directory'])
        await page.wait_for_timeout(response.meta['delay'] * 1000)


async def download_ceskearchivy_jpeg(page, item_directory):
    """Downloads a scan associated with current page.url."""
    new_page = await page.context.new_page()

    async with new_page.expect_download() as download_info:
        try:
            await new_page.goto("https://digi.ceskearchivy.cz/export.php?rot=0&l=&r=&t=&b=&p=0&q=1&f=0&jq=75")
        except:
            pass

    download = await download_info.value

    await download.save_as(item_directory + "/" + download.suggested_filename)
    await new_page.close()


async def errback(failure):
    page = failure.request.meta["playwright_page"]
    await page.close()
