"""
Author: Jan Valušek (xvalus03)
Description: Module with functions for downloading scans
from archives using VadeMeCum app (Archives, PragaPublica, and Vademecum).
"""

import re
from scrapy import Request, Selector


def parse_archives_item_url(response):
    href = response.xpath("//div[@class='imageBlock' or @class='oneThumbBloc imageArea']/a/@href").get()
    if not href:
        return

    scans_url = re.search(".*(?<=.cz)", response.url).group() + href

    yield Request(url=scans_url,
                  callback=parse_archives_scans_page,
                  meta=dict(
                      playwright=True,
                      playwright_include_page=True,
                      playwright_context=response.meta['playwright_context'],
                      delay=response.meta['delay'],
                      item_directory=response.meta['item_directory'],
                      img_nr=1,
                  ))


async def parse_archives_scans_page(response):
    img_nr = response.meta['img_nr']
    page = response.meta['playwright_page']
    await page.wait_for_selector("xpath=//ul[@class='pictures']", state="attached")

    while True:
        await page.wait_for_selector("xpath=//ul[@class='pictures']", state="attached")

        locator = page.locator("xpath=//ul[@class='pictures']/li/descendant::img")
        for i in range(0, await locator.count()):
            jpg_url = await locator.nth(i).get_attribute("src")
            jpg_url = jpg_url.replace("/image/", "/proxy/").replace("/nahled_maly.jpg", '')
            yield Request(url=jpg_url,
                          callback=download_archives_jpeg,
                          meta=dict(
                              img_nr=img_nr,
                              item_directory=response.meta['item_directory']
                          ))
            img_nr += 1

        if await page.locator("xpath=//i[@class='icon-forward3 icon nolink']").count() == 1:
            break

        # We have to access the permalink so we can access the next page
        # (it has something to do with temporary urls)
        content_as_selector = await archives_get_content_as_selector(page)
        await page.goto(content_as_selector.xpath("//textarea[@id='permalinkUri']/text()").get())

        await page.wait_for_selector("xpath=//i[@class='icon-forward3 icon link']", state="attached")
        content_as_selector = await archives_get_content_as_selector(page)
        next_page_url = re.search(".*(?<=.cz)", response.url).group() + content_as_selector.xpath(
            "//i[@class='icon-forward3 icon link']/parent::a/@href").get()
        await page.goto(next_page_url)
        await page.wait_for_timeout(response.meta['delay'] * 1000)

    await page.close()


def download_archives_jpeg(response):
    filename = f"{response.meta['img_nr']}.jpg"
    with open(f"{response.meta['item_directory']}/{filename}", 'wb') as file:
        file.write(response.body)


async def archives_get_content_as_selector(page):
    content = await page.content()
    return Selector(text=content)
