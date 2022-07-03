const request = require('request');
const {JSDOM} = require('jsdom');
const { Worker, isMainThread} = require('worker_threads');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')


const argv = yargs(hideBin(process.argv)).default('n', () => 1).argv;
const baseURL = argv._[0];
const linksVisited = [baseURL];

const getLinksFromURL = (URL) => {
    request(URL, (err, res, body) => {
        if (err) return;
        if (!res || res.statusCode !== 200) {
            return;
        };
        const {document} = new JSDOM(body).window;

        const links = document.querySelectorAll('a');
        if (!links.length) {
            return;
        }

        links.forEach(link => {
            if (link.href.startsWith(baseURL) && !linksVisited.includes(link.href)) {
                console.log(link.href);
                linksVisited.push(link.href);
                getLinksFromURL(link.href);
            } 
            return;
        })
    });
}

const crawl = () => getLinksFromURL(baseURL);
crawl();