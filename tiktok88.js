import fs from "fs";
import makeFetchCookie from "fetch-cookie";
const fejch = makeFetchCookie(fetch);
import { unraw } from "unraw";
if (process.argv.length < 3) {
  console.log("Usage: node tiktok88.js <tiktok-url>");
  process.exit(1);
}
const getSource = await fejch(
  process.argv[2],
  {
    "headers": {
      "accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "sec-ch-ua":
        '"(Not(A:Brand";v="99", "Chromium";v="115", "Google Chrome";v="115"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "sec-gpc": "1",
      "upgrade-insecure-requests": "1",
    },
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
  },
);
const source = await getSource.text();
let videoUrl = decodeURIComponent(unraw(
  [...source.matchAll(/,"playAddr":"(.*?)"/g)].map((x) => x[1])[0],
));
console.log("[Extracted Video Link Successfully]");
const result = await fejch(
  videoUrl,
  {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "range": "bytes=0-",
      "sec-ch-ua":
        '"(Not(A:Brand";v="99", "Chromium";v="115", "Google Chrome";v="115"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "video",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "sec-gpc": "1",
      // "cookie": "tt_chain_token=B9VtdCkRjDLKHYRx2XowKw==;",
      "Referer": "https://www.tiktok.com/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    "body": null,
    "method": "GET",
  },
);
const stramit = fs.createWriteStream(process.argv[2].split("/").pop() + ".mp4");
for await (const chunk of result.body) {
  // fs.appendFileSync(process.argv[2].split("/").pop() + ".mp4", chunk); // this works too but the video can't be played while recieving the data
  stramit.write(chunk);
  // progress bar
  process.stdout.write(
    "\r[Downloading Video] " +
      ((stramit.bytesWritten / result.headers.get("content-length")) * 100)
        .toFixed(
          2,
        ) +
      "%",
  );
}

// this buffers the whole video into RAM/Memory and then writes it to the file, inefficient for large files

// const videoBuffer = await result.arrayBuffer();
// fs.writeFileSync(
//   process.argv[2].split("/").pop() + ".mp4",
//   Buffer.from(videoBuffer),
// );

console.log("[Video Downloaded Successfully]");