"""
Author: Jan Valušek (xvalus03)
Description: Module with functions for downloading scans from MZA.
"""

import base64
from scrapy import Request


async def parse_mza_scans_url(response):
    dont_continue = False
    if response.status == 403:
        yield Request(url=response.url,
                      callback=parse_mza_scans_url,
                      dont_filter=True)
        dont_continue = True

    if not dont_continue:
        page_nr = 1

        page = response.meta['playwright_page']
        await page.wait_for_timeout(500)
        width = await page.evaluate("viewer.world.getItemAt(0).source.dimensions.x;")
        height = await page.evaluate("viewer.world.getItemAt(0).source.dimensions.y;")
        await page.evaluate(f"$('#openseadragon').css({{'width': {width / 2} + 'px', 'height': {height / 2} + 'px'}});")

        while True:
            loaded_method = """
            function areAllFullyLoaded() {
              var tile;
              for (var i = 0; i < viewer.world.getItemCount(); i++) {
                tile = viewer.world.getItemAt(i);
                if (!tile.getFullyLoaded()) {
                  return false;
                }
              }
              return true;
            }
            """
            loaded = False
            while not loaded:
                await page.wait_for_timeout(500)
                loaded = await page.evaluate(loaded_method)

            filename = f"{page_nr}.jpg"
            img_base64 = await page.evaluate("viewer.drawer.canvas.toDataURL('image/jpeg');")
            with open(f"{response.meta['item_directory']}/{filename}", 'wb') as file:
                file.write(base64.b64decode(img_base64.replace("data:image/jpeg;base64", '')))
            page_nr += 1

            await page.wait_for_selector("xpath=//button[@id='next-image']", state="attached")

            if await page.locator("//button[@id='next-image' and contains(@style, 'opacity')]").count() == 1:
                break

            next_page_button = page.locator("//button[@id='next-image']").first
            await next_page_button.click()
