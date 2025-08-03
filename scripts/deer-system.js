/**
 * Floating Deer Animation and Easter Egg System
 */

// Generate a random collaboration code
function generateCollabCode() {
    const prefix = "DEER";
    const numbers = Math.floor(Math.random() * 9000) + 1000;
    const suffix = ["FOREST", "MAGIC", "NATURE", "WILD", "FREE"][Math.floor(Math.random() * 5)];
    return `${prefix}${numbers}${suffix}`;
}

// Create floating deer
function createFloatingDeer() {
    const deerEmojis = ['🦌', '🦌', '🦌', '🍃', '🌿', '🌱'];
    const deer = document.createElement('div');
    deer.className = 'floating-deer';
    deer.textContent = deerEmojis[Math.floor(Math.random() * deerEmojis.length)];
    
    // Random starting position
    deer.style.top = Math.random() * 100 + '%';
    deer.style.left = '-50px';
    
    document.body.appendChild(deer);
    
    // Remove after animation
    setTimeout(() => {
        if (deer.parentElement) {
            deer.remove();
        }
    }, 20000);
}

// Create easter egg deer
function createEasterEggDeer() {
    const easterEggDeer = document.createElement('div');
    easterEggDeer.className = 'easter-egg-deer';
    easterEggDeer.textContent = '🦌';
    easterEggDeer.title = 'Something special might be here...';
    
    easterEggDeer.addEventListener('click', showEasterEggModal);
    
    document.body.appendChild(easterEggDeer);
}

// Show easter egg modal
function showEasterEggModal() {
    // Check if modal already exists
    if (document.querySelector('.easter-egg-modal')) return;
    
    const collabCode = generateCollabCode();
    
    const modal = document.createElement('div');
    modal.className = 'easter-egg-modal';
    
    modal.innerHTML = `
        <div class="easter-egg-content">
            <button class="easter-egg-close" onclick="this.closest('.easter-egg-modal').remove()">&times;</button>
            <h2>🦌 Secret Forest Discovery! 🦌</h2>
            <p>Congratulations! You found the hidden deer! 🎉</p>
            <p>You've discovered a <strong>FREE COLLABORATION OPPORTUNITY</strong>!</p>
            <p>Send me this secret code and if you're the first one to message me with it, you can get a free collaborative artwork from an artist of my choice within my budget!</p>
            
            <div class="collab-code" id="collab-code-display">
                ${collabCode}
            </div>
            
            <p><strong>How to claim:</strong></p>
            <ul style="text-align: left; display: inline-block; margin: 1rem 0;">
                <li>Copy the code above</li>
                <li>Message me on Discord, FurAffinity, or Bluesky</li>
                <li>Include the code in your message</li>
                <li>First come, first served!</li>
            </ul>
            
            <p style="font-size: 0.9rem; opacity: 0.8;">
                This is a one-time opportunity per code. Good luck! 🍀
            </p>
            
            <button class="btn btn-primary" onclick="copyCollabCode()" style="margin: 1rem 0.5rem;">
                📋 Copy Code
            </button>
            <button class="btn btn-secondary" onclick="this.closest('.easter-egg-modal').remove()">
                Close
            </button>
        </div>
    `;
    
    // Add click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    document.body.appendChild(modal);
    
    // Celebrate with extra deer!
    for (let i = 0; i < 5; i++) {
        setTimeout(() => createFloatingDeer(), i * 200);
    }
}

// Copy collaboration code to clipboard
function copyCollabCode() {
    const codeElement = document.getElementById('collab-code-display');
    const code = codeElement.textContent;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
            showNotification('Collaboration code copied to clipboard! 🎉', 'success');
        }).catch(() => {
            fallbackCopyCode(code);
        });
    } else {
        fallbackCopyCode(code);
    }
}

// Fallback copy method
function fallbackCopyCode(code) {
    const textArea = document.createElement('textarea');
    textArea.value = code;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Collaboration code copied to clipboard! 🎉', 'success');
    } catch (err) {
        showNotification('Could not copy code. Please manually copy: ' + code, 'error');
    }
    
    document.body.removeChild(textArea);
}

// Simple notification function (fallback if not available)
function showNotification(message, type = 'info') {
    // Try to use existing notification system first
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    // Fallback notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Initialize the deer system
function initializeDeerSystem() {
    // Create easter egg deer
    createEasterEggDeer();
    
    // Create floating deer periodically
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance every interval
            createFloatingDeer();
        }
    }, 8000); // Every 8 seconds
    
    // Create initial floating deer
    setTimeout(() => createFloatingDeer(), 2000);
    setTimeout(() => createFloatingDeer(), 5000);
}

// Start the system when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for page to settle
    setTimeout(initializeDeerSystem, 1000);
});

// Export functions for global use
window.createFloatingDeer = createFloatingDeer;
window.showEasterEggModal = showEasterEggModal;
window.copyCollabCode = copyCollabCode;
