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