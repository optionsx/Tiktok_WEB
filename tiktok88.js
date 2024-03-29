import fs from "fs";
import makeFetchCookie from "fetch-cookie";
const fejch = makeFetchCookie(fetch);
import { unraw } from "unraw";
import process from "process";
process.removeAllListeners("warning");
export async function tiktok88(link = process.argv[2]) {
  if (process.argv.length < 3) {
    console.log("Usage: node tiktok88.js <tiktok-url>");
    process.exit(1);
  }
  const getSource = await fejch(
    link,
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
  const cleanURL = getSource.url.split("?")[0];
  if (fs.existsSync(cleanURL.split("/").pop() + ".mp4")) {
    console.log("File already exists");
    process.exit(1);
  }
  const mediaType = cleanURL.includes("/photo/") ? "image" : "video";
  if (mediaType === "image") {
    console.log(
      "This is an image, not a video, only videos supported currently",
    );
    // process.exit(1);
  }
  const source = await getSource.text();
  let videoUrl = decodeURIComponent(unraw(
    [...source.matchAll(/,"playAddr":"(.*?)"/g)].map((x) => x[1])[0],
  ));
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
  console.log(fejch.toughCookie);
  const stramit = fs.createWriteStream(
    cleanURL.split("/").pop() + ".mp4",
  );
  for await (const chunk of result.body) {
    // fs.appendFileSync(cleanURL.split("/").pop() + ".mp4", chunk); // this works too but the video can't be played while recieving the data
    process.stdout.write(
      "\r[Downloading Video] " +
        ((stramit.bytesWritten / result.headers.get("content-length")) * 100)
          .toFixed(
            2,
          ) +
        "%",
    );
    stramit.write(chunk);
  }
  console.log("\n[Video Downloaded Successfully]");
}
tiktok88();
