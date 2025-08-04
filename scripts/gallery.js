/**
 * Enhanced Gallery System with Click-to-Enlarge
 * Completely rebuilt for better functionality
 */

class GalleryManager {
    constructor() {
        this.currentGallery = null;
        this.modal = null;
        this.init();
    }

    init() {
        console.log('Initializing Gallery Manager...');
        this.createModal();
        this.setupEventListeners();
        this.loadGalleries();
    }

    createModal() {
        // Remove existing modal if any
        const existingModal = document.querySelector('.modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        // Create new modal
        this.modal = document.createElement('div');
        this.modal.className = 'modal-overlay';
        this.modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="window.galleryManager.closeModal()">&times;</button>
                <img src="" alt="Enlarged image">
            </div>
        `;

        document.body.appendChild(this.modal);

        // Close modal when clicking overlay
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    setupEventListeners() {
        // Handle gallery tab clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('gallery-tab')) {
                e.preventDefault();
                const galleryType = e.target.dataset.gallery;
                const characterName = e.target.dataset.character;
                this.switchGallery(characterName, galleryType);
            }
        });

        // Handle image clicks for enlargement
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('gallery-image') || 
                e.target.closest('.gallery-item')) {
                e.preventDefault();
                
                let img = e.target;
                if (!img.src && e.target.closest('.gallery-item')) {
                    img = e.target.closest('.gallery-item').querySelector('img');
                }
                
                if (img && img.src) {
                    this.openModal(img.src, img.alt);
                }
            }
        });

        // Handle NSFW toggle changes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('nsfw-toggle-input')) {
                const container = e.target.closest('[id$="-gallery-container"]');
                if (container) {
                    const characterName = container.id.replace('-gallery-container', '');
                    const shouldBlur = !e.target.checked;
                    this.toggleNSFWBlur(characterName, shouldBlur);
                    localStorage.setItem(`${characterName}-nsfw-blurred`, shouldBlur.toString());
                }
            }
        });

        // Setup dropdown menus
        this.setupDropdowns();
        
        // Setup mobile menu
        this.setupMobileMenu();

        // Initialize NSFW toggle states
        this.initializeNSFWToggles();
    }

    initializeNSFWToggles() {
        // Get all gallery containers and initialize their NSFW toggle states
        const galleryContainers = document.querySelectorAll('[id$="-gallery-container"]');
        
        galleryContainers.forEach(container => {
            const characterName = container.id.replace('-gallery-container', '');
            const nsfwToggle = container.querySelector('.nsfw-toggle-input');
            
            if (nsfwToggle) {
                // Get stored blur state (default to true - blurred)
                const isBlurred = localStorage.getItem(`${characterName}-nsfw-blurred`) !== 'false';
                
                // Set toggle state (checked = not blurred)
                nsfwToggle.checked = !isBlurred;
                
                // Apply the blur state
                this.toggleNSFWBlur(characterName, isBlurred);
                
                console.log(`Initialized NSFW toggle for ${characterName}: blurred=${isBlurred}, checked=${nsfwToggle.checked}`);
            }
        });
    }

    setupDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (toggle) {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                });
            }
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }
    }

    async loadGalleries() {
        console.log('Loading galleries...');
        
        // Get all gallery containers
        const galleryContainers = document.querySelectorAll('[id$="-gallery-container"]');
        
        for (const container of galleryContainers) {
            const characterName = container.id.replace('-gallery-container', '');
            console.log(`Loading gallery for character: ${characterName}`);
            
            try {
                await this.loadCharacterGallery(characterName, container);
            } catch (error) {
                console.error(`Failed to load gallery for ${characterName}:`, error);
                container.innerHTML = `<div class="loading">Failed to load gallery for ${characterName}</div>`;
            }
        }
    }

    async loadCharacterGallery(characterName, container) {
        try {
            // Load character data
            const response = await fetch(`./data/${characterName}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${characterName}.json`);
            }
            
            const data = await response.json();
            console.log(`Loaded data for ${characterName}:`, data);
            
            // Create gallery tabs
            const tabsHtml = `
                <div class="gallery-tabs">
                    <button class="gallery-tab active" data-character="${characterName}" data-gallery="sfw">
                        🌸 SFW (${data.sfw ? data.sfw.length : 0})
                    </button>
                    <button class="gallery-tab" data-character="${characterName}" data-gallery="nsfw">
                        🔞 NSFW (${data.nsfw ? data.nsfw.length : 0})
                    </button>
                    <button class="gallery-tab" data-character="${characterName}" data-gallery="ref">
                        📋 Reference (${data.ref ? data.ref.length : 0})
                    </button>
                </div>
                <div class="gallery-content">
                    <div class="gallery-grid" id="${characterName}-gallery-grid">
                        <div class="loading">Loading images...</div>
                    </div>
                </div>
            `;
            
            container.innerHTML = tabsHtml;
            
            // Load initial gallery (SFW)
            this.switchGallery(characterName, 'sfw');
            
        } catch (error) {
            console.error(`Error loading gallery for ${characterName}:`, error);
            container.innerHTML = `<div class="loading">Error loading gallery: ${error.message}</div>`;
        }
    }

    async switchGallery(characterName, galleryType) {
        console.log(`Switching to ${galleryType} gallery for ${characterName}`);
        
        // Update active tab
        const tabs = document.querySelectorAll(`[data-character="${characterName}"].gallery-tab`);
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.gallery === galleryType);
        });
        
        const galleryGrid = document.getElementById(`${characterName}-gallery-grid`);
        if (!galleryGrid) {
            console.error(`Gallery grid not found for ${characterName}`);
            return;
        }
        
        galleryGrid.innerHTML = '<div class="loading">Loading images...</div>';
        
        try {
            // Load character data
            const response = await fetch(`./data/${characterName}.json`);
            const data = await response.json();
            
            const images = data[galleryType] || [];
            
            if (images.length === 0) {
                galleryGrid.innerHTML = `<div class="loading">No ${galleryType.toUpperCase()} images available</div>`;
                return;
            }
            
            // Create image grid
            const imageItems = images.map((imageData, index) => {
                // Handle both old format (string) and new format (object)
                let imagePath, imageTitle;
                if (typeof imageData === 'string') {
                    // Old format: just filename
                    imagePath = `./images/${characterName}/${galleryType}/${imageData}`;
                    imageTitle = `${characterName} ${galleryType} ${index + 1}`;
                } else {
                    // New format: object with src, title, desc
                    imagePath = imageData.src;
                    imageTitle = imageData.title || `${characterName} ${galleryType} ${index + 1}`;
                }
                
                const nsfwClass = galleryType === 'nsfw' ? 'nsfw' : '';
                return `
                    <div class="gallery-item ${nsfwClass}" data-index="${index}">
                        <img src="${imagePath}" 
                             alt="${imageTitle}" 
                             class="gallery-image"
                             loading="lazy"
                             onerror="this.parentElement.style.display='none'">
                    </div>
                `;
            }).join('');
            
            galleryGrid.innerHTML = imageItems;
            
            // Apply NSFW blur state if we're showing NSFW content
            if (galleryType === 'nsfw') {
                const isBlurred = localStorage.getItem(`${characterName}-nsfw-blurred`) !== 'false';
                this.toggleNSFWBlur(characterName, isBlurred);
                
                // Update toggle state
                const nsfwToggle = document.querySelector(`#${characterName}-gallery-container .nsfw-toggle-input`);
                if (nsfwToggle) {
                    nsfwToggle.checked = !isBlurred;
                }
            }
            
            console.log(`Loaded ${images.length} images for ${characterName} ${galleryType}`);
            
        } catch (error) {
            console.error(`Error switching gallery:`, error);
            galleryGrid.innerHTML = `<div class="loading">Error loading ${galleryType} images</div>`;
        }
    }

    toggleNSFWBlur(characterName, shouldBlur) {
        console.log(`Toggling NSFW blur for ${characterName}: ${shouldBlur}`);
        const container = document.getElementById(`${characterName}-gallery-container`);
        if (!container) return;

        const nsfwItems = container.querySelectorAll('.gallery-item.nsfw');
        nsfwItems.forEach(item => {
            if (shouldBlur) {
                item.classList.add('blurred');
            } else {
                item.classList.remove('blurred');
            }
        });

        // Update toggle state to match current blur state
        const nsfwToggle = document.querySelector(`#${characterName}-gallery-container .nsfw-toggle-input`);
        if (nsfwToggle) {
            nsfwToggle.checked = !shouldBlur;
        }
    }

    openModal(imageSrc, imageAlt) {
        console.log('Opening modal for image:', imageSrc);
        
        if (!this.modal) {
            console.error('Modal not initialized');
            return;
        }
        
        const modalImg = this.modal.querySelector('img');
        modalImg.src = imageSrc;
        modalImg.alt = imageAlt || 'Enlarged image';
        
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    closeModal() {
        console.log('Closing modal');
        
        if (!this.modal) {
            return;
        }
        
        this.modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Clear image source to free memory
        setTimeout(() => {
            const modalImg = this.modal.querySelector('img');
            if (modalImg) {
                modalImg.src = '';
            }
        }, 300);
    }

    // Legacy method for backward compatibility
    async renderGallery(character, section = 'sfw') {
        console.log(`Legacy renderGallery called for ${character} ${section}`);
        const container = document.getElementById(`${character}-gallery-container`);
        if (container) {
            await this.loadCharacterGallery(character, container);
            this.switchGallery(character, section);
        }
    }

    // Error display method
    showError(message) {
        console.error('Gallery Error:', message);
        const container = document.getElementById('gallery-container');
        if (container) {
            container.innerHTML = `<div class="loading error">${message}</div>`;
        }
    }
}

// Initialize gallery manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing gallery...');
    window.galleryManager = new GalleryManager();
});

// Export for use in other scripts
window.GalleryManager = GalleryManager;
