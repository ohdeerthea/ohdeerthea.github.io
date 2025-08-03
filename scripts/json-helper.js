/**
 * JSON Gallery Helper Script
 * Utility functions to help generate and manage gallery JSON files
 */

class GalleryJSONHelper {
    constructor() {
        this.characters = ['thea', 'darla', 'caelielle', 'misc'];
        this.sections = ['sfw', 'nsfw', 'ref'];
        this.init();
    }

    init() {
        this.createHelperInterface();
    }

    /**
     * Create helper interface for easy JSON generation
     */
    createHelperInterface() {
        // Only create interface if we're on a page that should have it
        if (!document.getElementById('json-helper-container')) {
            return;
        }

        const container = document.getElementById('json-helper-container');
        container.innerHTML = `
            <div class="json-helper">
                <h3>Gallery JSON Helper</h3>
                <p>Use this tool to generate JSON entries for your gallery images.</p>
                
                <form id="json-helper-form">
                    <div class="form-group">
                        <label for="helper-character">Character</label>
                        <select id="helper-character" required>
                            <option value="">Select Character</option>
                            <option value="thea">Thea</option>
                            <option value="darla">Darla</option>
                            <option value="caelielle">Caelielle</option>
                            <option value="misc">Miscellaneous</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="helper-section">Section</label>
                        <select id="helper-section" required>
                            <option value="">Select Section</option>
                            <option value="sfw">SFW</option>
                            <option value="nsfw">NSFW</option>
                            <option value="ref">Reference</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="helper-title">Image Title</label>
                        <input type="text" id="helper-title" placeholder="e.g., Summer Portrait" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="helper-filename">Image Filename</label>
                        <input type="text" id="helper-filename" placeholder="e.g., summer_portrait.jpg" required>
                        <small>File should be in /images/[character]/[section]/ folder</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="helper-description">Description</label>
                        <textarea id="helper-description" placeholder="Brief description of the artwork" rows="3"></textarea>
                    </div>
                    
                    <button type="submit" class="btn">Generate JSON Entry</button>
                </form>
                
                <div id="json-output" class="hidden">
                    <h4>Generated JSON Entry:</h4>
                    <pre id="json-code"></pre>
                    <button type="button" class="btn btn-small" id="copy-json">Copy to Clipboard</button>
                    <button type="button" class="btn btn-small" id="download-json">Download Updated JSON</button>
                </div>
                
                <div id="bulk-helper" style="margin-top: 2rem;">
                    <h4>Bulk Image Processing</h4>
                    <div class="form-group">
                        <label for="bulk-images">Paste image filenames (one per line)</label>
                        <textarea id="bulk-images" rows="5" placeholder="image1.jpg&#10;image2.png&#10;image3.gif"></textarea>
                    </div>
                    <button type="button" class="btn" id="bulk-generate">Generate Bulk JSON</button>
                </div>
            </div>
        `;

        this.setupHelperEventListeners();
    }

    /**
     * Setup event listeners for helper interface
     */
    setupHelperEventListeners() {
        const form = document.getElementById('json-helper-form');
        if (form) {
            form.addEventListener('submit', (e) => this.generateJSONEntry(e));
        }

        const copyBtn = document.getElementById('copy-json');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyToClipboard());
        }

        const downloadBtn = document.getElementById('download-json');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadJSON());
        }

        const bulkBtn = document.getElementById('bulk-generate');
        if (bulkBtn) {
            bulkBtn.addEventListener('click', () => this.generateBulkJSON());
        }
    }

    /**
     * Generate JSON entry from form data
     * @param {Event} e - Form submit event
     */
    generateJSONEntry(e) {
        e.preventDefault();

        const character = document.getElementById('helper-character').value;
        const section = document.getElementById('helper-section').value;
        const title = document.getElementById('helper-title').value;
        const filename = document.getElementById('helper-filename').value;
        const description = document.getElementById('helper-description').value;

        const entry = {
            title: title,
            src: `./images/${character}/${section}/${filename}`,
            desc: description || `${title} artwork`
        };

        this.displayJSONEntry(entry, character, section);
    }

    /**
     * Generate bulk JSON entries
     */
    generateBulkJSON() {
        const character = document.getElementById('helper-character').value;
        const section = document.getElementById('helper-section').value;
        const bulkImages = document.getElementById('bulk-images').value;

        if (!character || !section || !bulkImages.trim()) {
            Utils.showNotification('Please fill in character, section, and image list.', 'error');
            return;
        }

        const filenames = bulkImages.split('\n').filter(line => line.trim());
        const entries = filenames.map(filename => {
            const cleanFilename = filename.trim();
            const titleFromFilename = this.generateTitleFromFilename(cleanFilename);
            
            return {
                title: titleFromFilename,
                src: `./images/${character}/${section}/${cleanFilename}`,
                desc: `${titleFromFilename} artwork`
            };
        });

        this.displayBulkJSON(entries, character, section);
    }

    /**
     * Generate title from filename
     * @param {string} filename - Image filename
     */
    generateTitleFromFilename(filename) {
        // Remove extension and convert to title case
        const name = filename.replace(/\.[^/.]+$/, "");
        return name
            .split(/[-_\s]+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    /**
     * Display generated JSON entry
     * @param {Object} entry - JSON entry object
     * @param {string} character - Character name
     * @param {string} section - Gallery section
     */
    displayJSONEntry(entry, character, section) {
        const outputDiv = document.getElementById('json-output');
        const codeElement = document.getElementById('json-code');

        const jsonString = JSON.stringify(entry, null, 2);
        codeElement.textContent = jsonString;

        outputDiv.classList.remove('hidden');

        // Store for copying/downloading
        this.currentEntry = entry;
        this.currentCharacter = character;
        this.currentSection = section;

        Utils.showNotification('JSON entry generated!', 'success');
    }

    /**
     * Display bulk JSON entries
     * @param {Array} entries - Array of JSON entry objects
     * @param {string} character - Character name
     * @param {string} section - Gallery section
     */
    displayBulkJSON(entries, character, section) {
        const outputDiv = document.getElementById('json-output');
        const codeElement = document.getElementById('json-code');

        const jsonString = JSON.stringify(entries, null, 2);
        codeElement.textContent = jsonString;

        outputDiv.classList.remove('hidden');

        // Store for copying/downloading
        this.currentEntries = entries;
        this.currentCharacter = character;
        this.currentSection = section;

        Utils.showNotification(`Generated ${entries.length} JSON entries!`, 'success');
    }

    /**
     * Copy JSON to clipboard
     */
    async copyToClipboard() {
        const jsonCode = document.getElementById('json-code').textContent;
        
        try {
            await navigator.clipboard.writeText(jsonCode);
            Utils.showNotification('JSON copied to clipboard!', 'success');
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = jsonCode;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            Utils.showNotification('JSON copied to clipboard!', 'success');
        }
    }

    /**
     * Download updated JSON file
     */
    async downloadJSON() {
        if (!this.currentCharacter || !this.currentSection) {
            Utils.showNotification('No JSON data to download.', 'error');
            return;
        }

        try {
            // Load existing JSON file
            const response = await fetch(`./data/${this.currentCharacter}.json`);
            let existingData = {};
            
            if (response.ok) {
                existingData = await response.json();
            }

            // Ensure section exists
            if (!existingData[this.currentSection]) {
                existingData[this.currentSection] = [];
            }

            // Add new entries
            if (this.currentEntries) {
                // Bulk entries
                existingData[this.currentSection] = [
                    ...existingData[this.currentSection],
                    ...this.currentEntries
                ];
            } else if (this.currentEntry) {
                // Single entry
                existingData[this.currentSection].push(this.currentEntry);
            }

            // Create and download file
            const jsonString = JSON.stringify(existingData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.currentCharacter}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            Utils.showNotification('JSON file downloaded!', 'success');
            
        } catch (error) {
            console.error('Error downloading JSON:', error);
            Utils.showNotification('Failed to download JSON file.', 'error');
        }
    }

    /**
     * Create empty gallery JSON structure
     * @param {string} character - Character name
     */
    createEmptyGalleryJSON(character) {
        return {
            sfw: [],
            nsfw: [],
            ref: []
        };
    }

    /**
     * Validate image file extension
     * @param {string} filename - Image filename
     */
    validateImageFile(filename) {
        const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
        return validExtensions.includes(extension);
    }

    /**
     * Generate sample JSON for character
     * @param {string} character - Character name
     */
    generateSampleJSON(character) {
        return {
            sfw: [
                {
                    title: `${character.charAt(0).toUpperCase() + character.slice(1)} Portrait`,
                    src: `./images/${character}/sfw/portrait_01.jpg`,
                    desc: `A beautiful portrait of ${character.charAt(0).toUpperCase() + character.slice(1)}`
                }
            ],
            nsfw: [
                {
                    title: `${character.charAt(0).toUpperCase() + character.slice(1)} Art`,
                    src: `./images/${character}/nsfw/nsfw_01.jpg`,
                    desc: `NSFW artwork of ${character.charAt(0).toUpperCase() + character.slice(1)}`
                }
            ],
            ref: [
                {
                    title: `${character.charAt(0).toUpperCase() + character.slice(1)} Reference`,
                    src: `./images/${character}/ref/reference_sheet.jpg`,
                    desc: `Character reference sheet for ${character.charAt(0).toUpperCase() + character.slice(1)}`
                }
            ]
        };
    }
}

// Initialize helper when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.galleryJSONHelper = new GalleryJSONHelper();
});

// Export for console use
window.GalleryJSONHelper = GalleryJSONHelper;
