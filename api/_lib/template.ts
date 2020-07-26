
import { readFileSync } from 'fs';
import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(`${__dirname}/../_fonts/DrukWideMedium.woff2`).toString('base64');
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64');
// const pattern = require(`${__dirname}/../_images/og-pattern.svg`);

function getCss(theme: string, fontSize: string) {
    let background = 'white';
    let foreground = 'black';

    if (theme === 'dark') {
        background = 'black';
        foreground = '#eb3d3e';
    }
    return `
    @font-face {
        font-family: 'Druk Wide Medium';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        background-image: url(https://suckmychic.com/wp-content/uploads/2020/07/og-pattern.svg);
        background-size: cover;
        background-position: right center;
        background-color: ${background};
        height: 100vh;
        text-align: left;
        padding: 60px;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: max-content;
        gap: 55px;
    }

    .logo {
        object-fit: contain;
    }
    .logo:first-child {
        width: 300px;
        height: 133px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        margin-top: 40px;
        max-width: 760px;
        font-family: 'Druk Wide Medium', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 1.1;
        text-align: left;
    }
    .heading.colored {
        color: #f79bc1;
    }
    .heading.colored > span {
        color: ${foreground};
    }
    `;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, fontSize, images, widths, heights } = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div>
            <div class="logo-wrapper">
                ${images.map((img, i) =>
                    getPlusSign(i) + getImage(img, widths[i], heights[i])
                ).join('')}
            </div>
            <div class="heading ${!md && 'colored'}">${emojify(
                md
                ? (
                    `<span>${marked(text).split(' ')[0]}</span> ${marked(text).split(' ').slice(1).join(' ')}`
                ) : (
                    `<span>${sanitizeHtml(text).split(' ')[0]}</span> ${sanitizeHtml(text).split(' ').slice(1).join(' ')}`
                )
            )}
            </div>
        </div>
    </body>
</html>`;
}

function getImage(src: string, width ='auto', height = '225') {
    return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}

function getPlusSign(i: number) {
    return i === 0 ? '' : '<div class="plus">+</div>';
}
