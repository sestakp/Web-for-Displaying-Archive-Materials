"""
Author: Jan Valušek (xvalus03)
Description: Module with Scrapy settings.

@Modified by Pavel Sestak (xsesta07)
"""

from datetime import datetime
from ArchiveScraper import constants

BOT_NAME = 'ArchiveScraper'
SPIDER_MODULES = ['ArchiveScraper.spiders']
NEWSPIDER_MODULE = 'ArchiveScraper.spiders'

# Obey robots.txt rules
ROBOTSTXT_OBEY = False

# Configure maximum concurrent requests performed by Scrapy (default: 16)
#CONCURRENT_REQUESTS = 1

# Configure a delay for requests for the same website (default: 0)
#DOWNLOAD_DELAY = 5

# Disable cookies (enabled by default)
#COOKIES_ENABLED = False

# Configure item pipelines
ITEM_PIPELINES = {
    #'ArchiveScraper.pipelines.SetDefaultsPipeline': 300,
    'ArchiveScraper.pipelines.LocationPipeline': 400,
    'ArchiveScraper.pipelines.APISenderPipeline': 500,
}

LOG_LEVEL = 'ERROR'

# Playwright settings
DOWNLOAD_HANDLERS = {
    "http": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
    "https": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
}

#PLAYWRIGHT_BROWSER_TYPE_NAME = "firefox"
PLAYWRIGHT_BROWSER_TYPE = "firefox"

PLAYWRIGHT_ABORT_REQUEST = lambda req: req.resource_type == "image" or "fonts.googleapis.com" in req.url
PLAYWRIGHT_LAUNCH_OPTIONS = {
    "headless": True,
}
PLAYWRIGHT_CONTEXTS = {
    "default": {
        "viewport": {
            "width": 1920,
            "height": 720
        }
    }
}


# Set settings whose default value is deprecated to a future-proof value
REQUEST_FINGERPRINTER_IMPLEMENTATION = '2.7'
TWISTED_REACTOR = 'twisted.internet.asyncioreactor.AsyncioSelectorReactor'

# Use user agent spoofing.
DOWNLOADER_MIDDLEWARES = {
    'scrapy.downloadermiddlewares.useragent.UserAgentMiddleware': None,
    'scrapy_user_agents.middlewares.RandomUserAgentMiddleware': 400,
}

# Set output

custom_timestamp = datetime.now().strftime("%d.%m.%Y-%H_%M_%S")

"""
FEEDS = {
    f'{constants.output_directory_name}/%(name)s/%(name)s_{custom_timestamp}.json': {
        'format': 'json',
        'encoding': 'utf8',
        }
}
"""
