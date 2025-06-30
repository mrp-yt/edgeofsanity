const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const mountsFilePath = path.join(__dirname, 'data', 'mounts.json');

let mounts = [];

// Load mounts from file on startup
function loadMounts() {
    if (fs.existsSync(mountsFilePath)) {
        const data = fs.readFileSync(mountsFilePath, 'utf8');
        mounts = JSON.parse(data);
    } else {
        fs.writeFileSync(mountsFilePath, JSON.stringify([]), 'utf8');
    }
}

// Save mounts to file
function saveMounts() {
    fs.writeFileSync(mountsFilePath, JSON.stringify(mounts, null, 2), 'utf8');
}

loadMounts();

app.use(cors());
app.use(express.json());

// API to get all mounts
app.get('/api/mounts', (req, res) => {
    res.json(mounts);
});

// API to add a new mount
app.post('/api/mounts', (req, res) => {
    const newMount = { id: Date.now(), ...req.body };
    mounts.push(newMount);
    saveMounts();
    res.status(201).json(newMount);
});

// API to update a mount
app.put('/api/mounts/:id', (req, res) => {
    const { id } = req.params;
    const mountIndex = mounts.findIndex(m => m.id == id);

    if (mountIndex > -1) {
        mounts[mountIndex] = { ...mounts[mountIndex], ...req.body };
        saveMounts();
        res.json(mounts[mountIndex]);
    } else {
        res.status(404).json({ message: 'Mount not found' });
    }
});

// API to delete a mount
app.delete('/api/mounts/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = mounts.length;
    mounts = mounts.filter(m => m.id != id);

    if (mounts.length < initialLength) {
        saveMounts();
        res.status(204).send(); // No Content
    } else {
        res.status(404).json({ message: 'Mount not found' });
    }
});

app.post('/api/mount-image', async (req, res) => {
    const { mountName } = req.body;
    if (!mountName) {
        return res.status(400).json({ error: 'Mount name is required.' });
    }

    try {
        // Step 1: Search for the mount on Wowhead
        const searchUrl = `https://www.wowhead.com/search?q=${encodeURIComponent(mountName)}`;
        const { data: searchData } = await axios.get(searchUrl);
        const $search = cheerio.load(searchData);

        // Find the first relevant mount link
        const mountLink = $search('a.listview-cleartext[href*="/item="], a.listview-cleartext[href*="/spell="], a.listview-cleartext[href*="/achievement="]').first().attr('href');

        if (!mountLink) {
            return res.status(404).json({ error: 'Mount not found on Wowhead.' });
        }

        const fullMountUrl = `https://www.wowhead.com${mountLink}`;

        // Step 2: Go to the mount's page and scrape the image
        const { data: mountPageData } = await axios.get(fullMountUrl);
        const $mountPage = cheerio.load(mountPageData);

        // Wowhead mount images are often in a specific meta tag or a div with a background image
        let imageUrl = $mountPage('meta[property="og:image"]').attr('content');

        if (!imageUrl) {
            // Fallback for cases where og:image might not be present or is not the desired image
            // This might need adjustment based on Wowhead's HTML structure
            imageUrl = $mountPage('div.iconborder img').attr('src');
        }

        if (imageUrl) {
            res.json({ imageUrl });
        } else {
            res.status(404).json({ error: 'Image not found for this mount.' });
        }

    } catch (error) {
        console.error('Error scraping Wowhead:', error.message);
        res.status(500).json({ error: 'Failed to retrieve mount image.' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
});