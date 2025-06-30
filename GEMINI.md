## Instructions

We always start with planning. Do not start work on anything. first you give me plan. explain what will be done and wait for my instructions to start work.
If code needs to be pushed to GIT. always push to "dev" unless i will instruct you to update "main"

## Project 
Create a webserver that runs in docker
all data should be persistant.
website title "Edge of Sanity"
website to have multiple menu options at the top: Home page, Mounts, Pets
Website to support dark mode / light mode switch

## Work Completed
- Initial web server setup with Docker and Nginx.
- Created `index.html`, `mounts.html`, and `pets.html`.
- Implemented dark mode/light mode switch.
- Created `style.css` and `script.js` for better code organization.
- Added a table to `mounts.html` with:
    - Mount Name
    - Location
    - NPC (X, Y coordinates with copy button)
    - Difficulty (dropdown with options: "eeaassyy", "will take some time", "3+ months if you lucky", "no chance bro!")
    - Old Drop Rate
    - New Drop Rate
    - Added by....
- Implemented add, edit, and delete functionality for mount table rows.
- Added a placeholder favicon and linked it to all HTML pages.
- Configured Docker to serve all project files and ensure data persistence.
- Initialized Git repository, committed all changes, and pushed to `main` and `dev` branches on GitHub.

## Future Enhancements
- **Mount Image Integration (from wowhead.com):**
    - Introduce a backend server (e.g., Node.js, Python) to act as a proxy for `wowhead.com` to bypass CORS.
    - Implement web scraping on the backend to search for mount images on `wowhead.com` based on mount name.
    - Display a "View image" button next to the mount name if an image is found, allowing users to view the mount's picture.