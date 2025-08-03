/**
 * Gallery Manager - Handles loading and displaying image galleries
 */
class GalleryManager {
    constructor() {
        this.galleries = {};
        this.nsfwBlurred = true;
        this.currentTab = 'sfw';
        this.init();
    }

    init() {
        this.setupNSFWToggle();
        this.setupTabs();
        this.setupDropdowns();
        this.setupMobileMenu();
    }

    /**
     * Load gallery data from JSON file
     * @param {string} character - Character name (matches JSON filename)
     */
    async loadGallery(character) {
        try {
            const response = await fetch(`./data/${character}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load gallery for ${character}`);
            }
            const data = await response.json();
            this.galleries[character] = data;
            return data;
        } catch (error) {
            console.error('Error loading gallery:', error);
            this.showError(`Failed to load ${character} gallery. Please try again later.`);
            return null;
        }
    }

    /**
     * Render gallery for specific character and section
     * @param {string} character - Character name
     * @param {string} section - Gallery section (sfw, nsfw, ref)
     */
    async renderGallery(character, section = 'sfw') {
        const container = document.getElementById('gallery-container');
        if (!container) return;

        // Show loading state
        container.innerHTML = '<div class="loading">Loading gallery...</div>';

        // Load gallery data if not already loaded
        if (!this.galleries[character]) {
            await this.loadGallery(character);
        }

        const galleryData = this.galleries[character];
        if (!galleryData || !galleryData[section]) {
            container.innerHTML = '<div class="error">No images found for this section.</div>';
            return;
        }

        // Create gallery grid
        const galleryGrid = document.createElement('div');
        galleryGrid.className = 'gallery-grid';

        galleryData[section].forEach((item, index) => {
            const galleryItem = this.createGalleryItem(item, section, index);
            galleryGrid.appendChild(galleryItem);
        });

        container.innerHTML = '';
        container.appendChild(galleryGrid);

        // Apply NSFW blur if needed
        if (section === 'nsfw' && this.nsfwBlurred) {
            this.applyNSFWBlur();
        }
    }

    /**
     * Create individual gallery item element
     * @param {Object} item - Gallery item data
     * @param {string} section - Gallery section
     * @param {number} index - Item index
     */
    createGalleryItem(item, section, index) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        if (section === 'nsfw' && this.nsfwBlurred) {
            galleryItem.classList.add('blurred');
        }

        galleryItem.innerHTML = `
            <img src="${item.src}" alt="${item.title}" loading="lazy" 
                 onerror="this.src='https://via.placeholder.com/300x200/667eea/ffffff?text=Image+Not+Found'">
        `;

        // Add click handler for full-size view
        galleryItem.addEventListener('click', () => this.showFullSize(item, section, index));

        return galleryItem;
    }

    /**
     * Show full-size image modal
     * @param {Object} item - Gallery item data
     * @param {string} section - Gallery section
     * @param {number} index - Item index
     */
    showFullSize(item, section, index) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <img src="${item.src}" alt="${item.title}" class="modal-image">
                <div class="modal-info">
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                </div>
            </div>
        `;

        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;

        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
            background: white;
            border-radius: 15px;
            overflow: hidden;
        `;

        const modalImage = modal.querySelector('.modal-image');
        modalImage.style.cssText = `
            width: 100%;
            height: auto;
            max-height: 70vh;
            object-fit: contain;
        `;

        const modalClose = modal.querySelector('.modal-close');
        modalClose.style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const modalInfo = modal.querySelector('.modal-info');
        modalInfo.style.cssText = `
            padding: 1rem;
        `;

        // Close modal handlers
        modalClose.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeOnEscape);
            }
        });

        document.body.appendChild(modal);
    }

    /**
     * Setup NSFW toggle functionality
     */
    setupNSFWToggle() {
        const nsfwToggle = document.getElementById('nsfw-toggle');
        if (nsfwToggle) {
            nsfwToggle.checked = !this.nsfwBlurred;
            nsfwToggle.addEventListener('change', (e) => {
                this.nsfwBlurred = !e.target.checked;
                this.applyNSFWBlur();
            });
        }
    }

    /**
     * Apply or remove NSFW blur effect
     */
    applyNSFWBlur() {
        const nsfwItems = document.querySelectorAll('.gallery-item');
        const currentTab = document.querySelector('.tab-button.active');
        
        if (currentTab && currentTab.dataset.section === 'nsfw') {
            nsfwItems.forEach(item => {
                if (this.nsfwBlurred) {
                    item.classList.add('blurred');
                } else {
                    item.classList.remove('blurred');
                }
            });
        }
    }

    /**
     * Setup tab functionality
     */
    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const section = button.dataset.section;
                this.switchTab(section);
            });
        });
    }

    /**
     * Switch between gallery tabs
     * @param {string} section - Section to switch to
     */
    switchTab(section) {
        // Update active tab button
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Get character name from page
        const characterName = document.body.dataset.character;
        if (characterName) {
            this.renderGallery(characterName, section);
        }

        this.currentTab = section;
    }

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        const container = document.getElementById('gallery-container');
        if (container) {
            container.innerHTML = `<div class="error">${message}</div>`;
        }
    }

    /**
     * Setup dropdown navigation
     */
    setupDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (toggle && menu) {
                // Prevent default link behavior for dropdown toggles
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                });
                
                // Handle mobile touch events
                dropdown.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    menu.style.opacity = menu.style.opacity === '1' ? '0' : '1';
                    menu.style.visibility = menu.style.visibility === 'visible' ? 'hidden' : 'visible';
                });
            }
        });
    }

    /**
     * Setup mobile menu functionality
     */
    setupMobileMenu() {
        // This will be handled by NavigationManager, but keeping for consistency
    }
}

/**
 * Mobile Navigation Handler
 */
class NavigationManager {
    constructor() {
        this.setupMobileNav();
    }

    setupMobileNav() {
        const mobileMenuBtn = document.querySelector('.mobile-menu');
        const navLinks = document.querySelector('.nav-links');

        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                    navLinks.classList.remove('active');
                }
            });
        }
    }
}

/**
 * Utility Functions
 */
const Utils = {
    /**
     * Format date for display
     * @param {string} dateString - Date string to format
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    /**
     * Debounce function to limit function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Show notification message
     * @param {string} message - Message to show
     * @param {string} type - Notification type (success, error, info)
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 3000;
            transition: opacity 0.3s ease;
        `;

        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.background = '#28a745';
                break;
            case 'error':
                notification.style.background = '#dc3545';
                break;
            default:
                notification.style.background = '#667eea';
        }

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Initialize managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.galleryManager = new GalleryManager();
    window.navigationManager = new NavigationManager();
    
    // Auto-load gallery if on character page
    const characterName = document.body.dataset.character;
    if (characterName) {
        window.galleryManager.renderGallery(characterName, 'sfw');
    }
});
