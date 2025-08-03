# Original Characters Gallery

A responsive GitHub Pages website for showcasing original character artwork with dynamic galleries and commission queue management.

## Features

### 🎨 Character Galleries
- **Individual character pages** for Thea, Darla, Caelielle, and Miscellaneous characters
- **Dynamic image loading** from JSON files for easy content management
- **Three gallery sections** per character: SFW, NSFW, and Reference artwork
- **NSFW blur toggle** with user preference for content filtering
- **Responsive gallery grid** that adapts to different screen sizes
- **Full-size image modal** with navigation and details

### 📋 Commission Queue
- **Public commission queue** showing current and upcoming artwork
- **Real-time updates** via Firebase Firestore integration
- **Status tracking** (Planning, In Progress, Complete, On Hold)
- **Artist and commission details** with dates and types
- **Responsive design** for mobile and desktop viewing

### 🔧 Admin Panel
- **Password-protected admin access** (password: 3272)
- **Add, edit, and delete** commission queue entries
- **Real-time Firebase integration** for instant updates
- **Form validation** and error handling
- **Responsive admin interface**

### 🛠 JSON Helper Tools
- **Gallery JSON generator** for easy artwork addition
- **Bulk image processing** for multiple files at once
- **Download updated JSON files** with new entries
- **Copy to clipboard** functionality
- **Filename-to-title conversion** for quick setup

## File Structure

```
/
├── index.html              # Home page
├── thea.html              # Thea character page
├── darla.html             # Darla character page
├── caelielle.html         # Caelielle character page
├── misc.html              # Miscellaneous characters page
├── queue.html             # Public commission queue
├── admin.html             # Admin panel
├── styles/
│   └── main.css           # Main stylesheet
├── scripts/
│   ├── gallery.js         # Gallery functionality
│   ├── firebase-config.js # Firebase configuration
│   ├── admin.js           # Admin panel functionality
│   └── json-helper.js     # JSON generation tools
├── data/
│   ├── thea.json          # Thea gallery data
│   ├── darla.json         # Darla gallery data
│   ├── caelielle.json     # Caelielle gallery data
│   └── misc.json          # Misc gallery data
└── images/
    ├── thea/
    │   ├── sfw/           # Thea SFW artwork
    │   ├── nsfw/          # Thea NSFW artwork
    │   └── ref/           # Thea reference materials
    ├── darla/
    │   ├── sfw/           # Darla SFW artwork
    │   ├── nsfw/          # Darla NSFW artwork
    │   └── ref/           # Darla reference materials
    ├── caelielle/
    │   ├── sfw/           # Caelielle SFW artwork
    │   ├── nsfw/          # Caelielle NSFW artwork
    │   └── ref/           # Caelielle reference materials
    └── misc/
        ├── sfw/           # Misc SFW artwork
        ├── nsfw/          # Misc NSFW artwork
        └── ref/           # Misc reference materials
```

## Setup Instructions

### 1. Firebase Configuration (Optional)
If you want real-time commission queue functionality:

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Update `scripts/firebase-config.js` with your Firebase configuration
4. Set up Firestore security rules as needed

**Without Firebase:** The site works with demo data for the commission queue.

### 2. Adding Artwork

#### Option A: Automatic Organization (Recommended)
1. **Drop images anywhere** in the `/images/` folder with any naming convention
2. **Run the organization script:**
   - **Windows:** Double-click `gallery-manager.bat` or `organize-images.bat`
   - **PowerShell:** `.\manage-gallery.ps1 -Action organize`
3. **Generate JSON files:** Run `generate-jsons.bat` or use the gallery manager
4. **Done!** The script automatically detects characters and organizes everything

#### Option B: Manual Organization
1. Place image files in the appropriate character and section directory:
   - `/images/thea/sfw/` for Thea's safe-for-work art
   - `/images/thea/nsfw/` for Thea's adult content
   - `/images/thea/ref/` for Thea's reference materials
   - And similarly for other characters
2. Update the corresponding JSON file in `/data/` directory
3. Use the admin panel's JSON helper tool for easy entry generation

#### Batch Scripts Available:
- `gallery-manager.bat` - Interactive menu for all operations
- `organize-images.bat` - Quick image organization
- `generate-jsons.bat` - Generate JSON files from organized images
- `preview-organization.bat` - Preview what organization would do

**The scripts handle ANY naming convention** and automatically:
- Detect character names from filenames or content
- Determine if images are SFW, NSFW, or Reference material
- Rename files to follow conventions (spaces→underscores, lowercase, etc.)
- Generate properly formatted JSON entries with titles and descriptions

**JSON Format for gallery entries:**
```json
{
  "title": "Artwork Title",
  "src": "./images/character/section/filename.jpg", 
  "desc": "Description of the artwork"
}
```

### 3. Customization
- **Colors:** Modify the CSS custom properties in `styles/main.css`
- **Characters:** Add new character pages following the existing template
- **Admin Password:** Change the password in `scripts/admin.js`
- **Branding:** Update the logo and site title in the HTML files

## Usage

### For Visitors
1. **Browse Characters:** Navigate to individual character pages
2. **View Galleries:** Use tabs to switch between SFW, NSFW, and Reference sections
3. **NSFW Content:** Toggle the blur filter as desired
4. **Commission Queue:** Check current commission status and progress
5. **Full-Size Viewing:** Click any image to view in full-size modal

### For Administrators
1. **Access Admin Panel:** Go to `/admin.html` and enter password (3272)
2. **Manage Queue:** Add, edit, or delete commission entries
3. **Generate JSON:** Use the JSON helper to create gallery entries
4. **Bulk Processing:** Add multiple images at once with auto-generated titles

### Adding New Artwork

#### Quick Method (Any File Names):
1. **Drop images** in the `/images/` folder (any naming convention works!)
2. **Run:** `gallery-manager.bat` or `organize-images.bat`
3. **Generate:** `generate-jsons.bat` 
4. **Done!** Files are organized and JSON is generated automatically

#### Manual Method:
1. **Upload Images:** Place files in the appropriate character and section folder:
   - `images/character/sfw/` for safe-for-work content
   - `images/character/nsfw/` for adult content  
   - `images/character/ref/` for reference materials
2. **Update JSON:** Either manually edit JSON files or use the admin helper
3. **File Naming:** Use descriptive names like `summer_portrait.jpg`, `battle_stance.jpg`
4. **Optimize Images:** Keep files under 2MB for good performance

#### Script Features:
- **Smart Detection:** Automatically detects character from filename keywords
- **Content Classification:** Determines SFW/NSFW/Reference from filename context
- **File Renaming:** Converts any naming convention to clean, web-friendly names
- **JSON Generation:** Creates properly formatted gallery entries with auto-generated titles
- **Preview Mode:** See what changes will be made before executing

## Technical Details

### Dependencies
- **Firebase:** Optional, for real-time commission queue
- **Modern Browser:** ES6+ support required
- **No Build Process:** Plain HTML/CSS/JS for GitHub Pages compatibility

### Browser Support
- Chrome/Edge 60+
- Firefox 60+
- Safari 12+
- Mobile browsers with ES6 support

### Performance
- **Lazy Loading:** Images load as needed
- **Responsive Images:** Automatic sizing based on screen
- **Efficient JavaScript:** Minimal overhead with vanilla JS
- **CDN Ready:** Works great with GitHub Pages

## Development

### Local Development
1. Clone the repository
2. Open `index.html` in a web browser
3. Use a local server for best results (e.g., `python -m http.server`)

### Deployment
1. Push changes to your GitHub repository
2. Enable GitHub Pages in repository settings
3. Site will be available at `https://yourusername.github.io/repository-name`

## Security Notes

- Admin password is client-side only (not secure for sensitive data)
- Firebase rules should be configured for your security needs
- NSFW content is filtered but not restricted server-side

## License

This project is provided as-is for personal use. Modify and adapt as needed for your own character galleries.

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify file paths and JSON structure
3. Ensure Firebase configuration is correct (if using)
4. Test with demo data first before adding custom content
