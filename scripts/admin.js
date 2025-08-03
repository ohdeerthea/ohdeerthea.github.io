/**
 * Admin Panel Manager
 */
class AdminManager {
    constructor() {
        this.isAuthenticated = false;
        this.adminPassword = '3272';
        this.editingCommissionId = null;
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.setupEventListeners();
    }

    /**
     * Check if user is already authenticated
     */
    checkAuthentication() {
        const isAuth = sessionStorage.getItem('admin_authenticated');
        if (isAuth === 'true') {
            this.isAuthenticated = true;
            this.showAdminPanel();
        } else {
            this.showLoginForm();
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Commission form
        const commissionForm = document.getElementById('commission-form');
        if (commissionForm) {
            commissionForm.addEventListener('submit', (e) => this.handleCommissionSubmit(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Cancel edit button
        const cancelEditBtn = document.getElementById('cancel-edit-btn');
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', () => this.cancelEdit());
        }
    }

    /**
     * Handle login form submission
     * @param {Event} e - Form submit event
     */
    handleLogin(e) {
        e.preventDefault();
        const password = document.getElementById('admin-password').value;
        
        if (password === this.adminPassword) {
            this.isAuthenticated = true;
            sessionStorage.setItem('admin_authenticated', 'true');
            this.showAdminPanel();
            Utils.showNotification('Successfully logged in!', 'success');
        } else {
            Utils.showNotification('Invalid password. Please try again.', 'error');
            document.getElementById('admin-password').value = '';
        }
    }

    /**
     * Handle commission form submission
     * @param {Event} e - Form submit event
     */
    async handleCommissionSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const commission = {
            artist: formData.get('artist'),
            title: formData.get('title'),
            description: formData.get('description'),
            date: formData.get('date'),
            type: formData.get('type'),
            status: formData.get('status')
        };

        // Validate form data
        if (!this.validateCommissionData(commission)) {
            return;
        }

        try {
            // Wait for queueManager to be available
            if (!window.queueManager) {
                // Wait for queueManager to initialize
                let attempts = 0;
                while (!window.queueManager && attempts < 50) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    attempts++;
                }
                
                if (!window.queueManager) {
                    throw new Error('Queue manager not available');
                }
            }

            if (this.editingCommissionId) {
                // Update existing commission
                await window.queueManager.updateCommission(this.editingCommissionId, commission);
                this.cancelEdit();
            } else {
                // Add new commission
                await window.queueManager.addCommission(commission);
            }
            
            // Reset form
            e.target.reset();
            
            // Refresh admin queue display
            this.refreshAdminQueue();
            
        } catch (error) {
            console.error('Error submitting commission:', error);
            Utils.showNotification('Failed to save commission. Please try again.', 'error');
        }
    }

    /**
     * Validate commission data
     * @param {Object} commission - Commission data to validate
     */
    validateCommissionData(commission) {
        if (!commission.artist || !commission.title || !commission.date) {
            Utils.showNotification('Please fill in all required fields.', 'error');
            return false;
        }

        // Validate date
        const commissionDate = new Date(commission.date);
        if (isNaN(commissionDate.getTime())) {
            Utils.showNotification('Please enter a valid date.', 'error');
            return false;
        }

        return true;
    }

    /**
     * Show login form
     */
    showLoginForm() {
        const adminContainer = document.querySelector('.admin-container');
        if (!adminContainer) return;

        adminContainer.innerHTML = `
            <div class="admin-login">
                <h2>Admin Access</h2>
                <p>Enter the admin password to manage commission queue:</p>
                <form id="login-form">
                    <div class="form-group">
                        <input type="password" id="admin-password" placeholder="Enter password" required>
                    </div>
                    <button type="submit" class="btn">Login</button>
                </form>
            </div>
        `;

        // Re-setup event listeners
        this.setupEventListeners();
    }

    /**
     * Show admin panel
     */
    showAdminPanel() {
        const adminContainer = document.querySelector('.admin-container');
        if (!adminContainer) return;

        adminContainer.innerHTML = `
            <div class="admin-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2>Commission Queue Admin</h2>
                <button id="logout-btn" class="btn btn-small">Logout</button>
            </div>

            <div class="admin-form">
                <h3 id="form-title">Add New Commission</h3>
                <form id="commission-form">
                    <div class="form-group">
                        <label for="artist">Artist *</label>
                        <input type="text" id="artist" name="artist" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="title">Title *</label>
                        <input type="text" id="title" name="title" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea id="description" name="description" rows="3"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="date">Date of Commission *</label>
                        <input type="date" id="date" name="date" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="type">Type</label>
                        <select id="type" name="type">
                            <option value="half">Half Body</option>
                            <option value="full">Full Body</option>
                            <option value="ref">Reference Sheet</option>
                            <option value="bust">Bust/Portrait</option>
                            <option value="multi-char">Multi-Character</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="status">Status</label>
                        <select id="status" name="status">
                            <option value="planning">Planning</option>
                            <option value="in-progress">In Progress</option>
                            <option value="complete">Complete</option>
                            <option value="on-hold">On Hold</option>
                        </select>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn" id="submit-btn">Add Commission</button>
                        <button type="button" class="btn btn-danger hidden" id="cancel-edit-btn">Cancel Edit</button>
                    </div>
                </form>
            </div>

            <div class="admin-queue">
                <h3>Current Queue</h3>
                <div id="admin-queue-container">
                    <div class="loading">Loading queue...</div>
                </div>
            </div>
        `;

        // Re-setup event listeners
        this.setupEventListeners();

        // Setup queue manager listener and load queue
        this.waitForQueueManager().then(() => {
            if (window.queueManager) {
                window.queueManager.addListener(() => this.refreshAdminQueue());
                this.refreshAdminQueue();
            }
        });
    }

    /**
     * Wait for queue manager to be available
     */
    async waitForQueueManager() {
        let attempts = 0;
        while (!window.queueManager && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        return window.queueManager;
    }

    /**
     * Refresh admin queue display
     */
    refreshAdminQueue() {
        if (window.queueManager) {
            window.queueManager.renderAdminQueue('admin-queue-container');
        }
    }

    /**
     * Edit commission
     * @param {string} id - Commission ID
     */
    editCommission(id) {
        const commission = window.queueManager.getQueue().find(item => item.id === id);
        if (!commission) return;

        this.editingCommissionId = id;

        // Populate form with commission data
        document.getElementById('artist').value = commission.artist;
        document.getElementById('title').value = commission.title;
        document.getElementById('description').value = commission.description || '';
        document.getElementById('date').value = commission.date;
        document.getElementById('type').value = commission.type;
        document.getElementById('status').value = commission.status;

        // Update form UI
        document.getElementById('form-title').textContent = 'Edit Commission';
        document.getElementById('submit-btn').textContent = 'Update Commission';
        document.getElementById('cancel-edit-btn').classList.remove('hidden');

        // Scroll to form
        document.getElementById('commission-form').scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Cancel edit mode
     */
    cancelEdit() {
        this.editingCommissionId = null;

        // Reset form
        document.getElementById('commission-form').reset();

        // Update form UI
        document.getElementById('form-title').textContent = 'Add New Commission';
        document.getElementById('submit-btn').textContent = 'Add Commission';
        document.getElementById('cancel-edit-btn').classList.add('hidden');
    }

    /**
     * Delete commission with confirmation
     * @param {string} id - Commission ID
     */
    deleteCommissionConfirm(id) {
        const commission = window.queueManager.getQueue().find(item => item.id === id);
        if (!commission) return;

        if (confirm(`Are you sure you want to delete "${commission.title}" by ${commission.artist}?`)) {
            this.deleteCommission(id);
        }
    }

    /**
     * Delete commission
     * @param {string} id - Commission ID
     */
    async deleteCommission(id) {
        try {
            await window.queueManager.deleteCommission(id);
            
            // If we were editing this commission, cancel edit mode
            if (this.editingCommissionId === id) {
                this.cancelEdit();
            }
            
        } catch (error) {
            console.error('Error deleting commission:', error);
        }
    }

    /**
     * Logout admin
     */
    logout() {
        this.isAuthenticated = false;
        sessionStorage.removeItem('admin_authenticated');
        this.showLoginForm();
        Utils.showNotification('Logged out successfully.', 'success');
    }
}

// Global functions for button clicks
window.editCommission = (id) => {
    if (window.adminManager) {
        window.adminManager.editCommission(id);
    }
};

window.deleteCommissionConfirm = (id) => {
    if (window.adminManager) {
        window.adminManager.deleteCommissionConfirm(id);
    }
};

/**
 * Utility functions
 */
class Utils {
    /**
     * Show notification message
     * @param {string} message - Message to display
     * @param {string} type - Type of notification (success, error, info)
     */
    static showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize admin manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminManager = new AdminManager();
});
