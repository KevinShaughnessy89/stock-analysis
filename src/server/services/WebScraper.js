import * as cheerio from 'cheerio';
import axios from 'axios';
import puppeteer from 'puppeteer'

export class WebScraper {
    constructor() {
        this.cache = new Map();
    }

    async loadCheerio(url, headers) {
        if (!this.cache.has(url)) {
            try {
                const response = await axios.get(url, {
                    headers: {
                       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Connection': 'keep-alive',
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                        'DNT': '1',
                        'Upgrade-Insecure-Requests': '1'
                  }
                });
                console.log("Response status:", response.status);
                console.log("Response data length:", response.data.length);
                const $ = cheerio.load(response.data);
                this.cache.set(url, $);
                return $;
            } catch (error) {
                console.error(`Error loading ${url}: ${error.message}`);
                throw error;
            }
        } else {
            return this.cache.get(url);
        }
    }

    async getRawHtml(url) {
        let browser = null;
        try {
            browser = await puppeteer.launch({
                headless: "new",
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                    '--disable-web-security',
                    '--disable-features=IsolateOrigins,site-per-process',
                    '--window-size=1920,1080',
                ],
                env: {
                    ...process.env,
                    DISPLAY: ':99',
                }
            });
    
            const page = await browser.newPage();
    
            // Set a realistic user agent
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36');
    
            // Set extra headers
            await page.setExtraHTTPHeaders({
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-User': '?1',
                'Sec-Fetch-Dest': 'document'
            });
    
            // Enable JavaScript
            await page.setJavaScriptEnabled(true);
    
            console.log('Navigating to URL:', url);
    
            // Navigate with custom timeout and wait conditions
            const response = await page.goto(url, {
                waitUntil: ['networkidle0', 'domcontentloaded'],
                timeout: 30000
            });
    
            // Check if we got blocked or redirected
            if (response.status() === 403 || response.status() === 429) {
                throw new Error('Access denied by website');
            }
    
            // Wait for body to be loaded
            await page.waitForSelector('body', { timeout: 5000 });
    
            // Try different selectors that might indicate the main content
            const selectors = ['article', '.article__body', '#article-body', '.container', 'main'];
            
            for (const selector of selectors) {
                try {
                    await page.waitForSelector(selector, { timeout: 5000 });
                    console.log(`Found selector: ${selector}`);
                    break;
                } catch (e) {
                    console.log(`Selector ${selector} not found`);
                }
            }
    
            // Get both the HTML and any text content
            const html = await page.content();
            const textContent = await page.evaluate(() => document.body.innerText);
    
            // Check if we got a CAPTCHA or error page
            if (html.includes('captcha') || html.includes('security check') || 
                html.includes('access denied') || html.includes('rate limited')) {
                throw new Error('Hit CAPTCHA/Security check');
            }
    
            return {
                html,
                text: textContent,
                url: page.url() // Return final URL in case of redirects
            };
    
        } catch (error) {
            console.error('Detailed error:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            throw error;
        } finally {
            if (browser) {
                await browser.close();
                console.log('Browser closed');
            }
        }
    }

    async getAllHTMLElements(url) {
        const $ = await this.loadCheerio(url);

        const allText = $('body').text();

        console.log("HTML content:", $.html()); // Log the entire HTML content

        const createElementArray = (selector) => $(selector).map((_, el) => $.html(el)).get();

        const elements = [
            'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'img', 'div', 'span',
            'ul', 'ol', 'li', 'table', 'form', 'input', 'button'
            ];
        
        const elementArrays = elements  .reduce((acc, element) => {
            acc[element] = createElementArray(element);
            return acc;
        }, {});

        return elementArrays;
    }

    async getAllClassText(url, className) {
        const $ = await this.loadCheerio(url);
        const data = $(className).map((_, el) => $(el).text().trim()).get();
        return data;
    }

    async getAllElementHTML(url, type) {
        const $ = await this.loadCheerio(url);
        return $(type).map((_, el) => ($(el).html().get()));
    }

    async getMultipleElementsHTML(url, selectors) {
        const $ = await this.loadCheerio(url);

        let htmlList = selectors.map(selector => {
            return $(selector).map((_, element) => $(element).html()).get()
        })

        return htmlList;
    }

    async getAllElementText(url, type) {
        const $ = await this.loadCheerio(url);
        return $(type).map((_, el) => ($(el).text().trim().get()));
    }

    async getMultipleElementsText(url, selectors) {
        const $ = await this.loadCheerio(url);

        let textList = [];

        selectors.map(selector => {
            return $(selector).map((_, element) => $(element).text().trim()).get()
        });
        
        return textList;

    }

    async getMetadata(url) {
        const $ = await this.loadCheerio(url);
        return {
            url: url,
            title: $('title').text(),
            description: $('meta[name="description"]').attr('content'),
            keywords: $('meta[name="keywords]"').attr('content'),
            ogTitle: $('meta[name="og:title]"').attr('content'),
            ogDescription: $('meta[property="og:description"]').attr('content'),
            ogImage: $('meta[property="og:image"]').attr('content'),
            canonicalUrl: $('link[rel="canonical"]').attr('href'), // Often different from the accessed URL
        }
    }
}

export default WebScraper;