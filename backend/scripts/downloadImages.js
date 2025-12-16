const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
    { name: 'inorbit_mall.jpg', page: 'https://commons.wikimedia.org/wiki/File:Inorbit_Mall_in_Vashi.jpg' },
    { name: 'raghuleela_mall.jpg', page: 'https://commons.wikimedia.org/wiki/File:RaghuleelaMallVashiPrd.jpg' },
    { name: 'seawoods_mall.jpg', page: 'https://commons.wikimedia.org/wiki/File:Seawoods_Grand_Central_1.jpg' },
    { name: 'nerul_station.jpg', page: 'https://commons.wikimedia.org/wiki/File:Nerul_Railway_Station_West_Side_View..jpg' },
    { name: 'cbd_belapur.jpg', page: 'https://commons.wikimedia.org/wiki/File:Belapur_Rly_Stn.jpg' }
];

const downloadDir = path.join(__dirname, '../../frontend/public/parking_images');
if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
}

const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(path.join(downloadDir, filename));
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded: ${filename}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(path.join(downloadDir, filename), () => { }); // Delete file async
            console.error(`Error downloading ${filename}: ${err.message}`);
            reject(err);
        });
    });
};

const processed = [];

const processImage = (item) => {
    return new Promise((resolve) => {
        // Fetch the page content to find the real URL
        https.get(item.page, { headers: { 'User-Agent': 'Bot' } }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', async () => {
                // Regex to find the original file URL.
                // Look for: <div class="fullMedia"><a href="//upload.wikimedia.org/wikipedia/commons/..." class="internal"
                // Or simply the og:image or similar property.
                // Wikimedia usually has: "Original file" link

                const match = data.match(/href="([^"]+)" class="internal"/);
                if (match && match[1]) {
                    let imageUrl = match[1];
                    if (imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl;

                    try {
                        await downloadImage(imageUrl, item.name);
                        resolve();
                    } catch (e) {
                        console.error(e);
                        resolve();
                    }
                } else {
                    console.log(`Could not find image URL for ${item.name}`);
                    // Fallback using direct assumptions if regex fails, but regex is fairly standard for MediaWiki
                    resolve();
                }
            });
        }).on('error', (e) => {
            console.error(`Error fetching page for ${item.name}: ${e.message}`);
            resolve();
        });
    });
};

const run = async () => {
    for (const item of images) {
        await processImage(item);
    }
};

run();
