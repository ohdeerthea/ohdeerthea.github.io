/**
 * Commission Queue Prepopulation Script
 * 
 * This script contains the commission data from the Google Sheets
 * Run this through the admin panel to populate the queue
 */

// Sample commission data based on typical commission tracking structure
// Replace this with your actual data from the Google Sheets
const COMMISSION_DATA = [
    {
        artist: 'Tealwing',
        title: 'Thea Reference Sheet',
        description: 'Complete reference sheet with multiple poses and expressions',
        date: '2024-12-15',
        type: 'reference',
        status: 'complete',
        commissioner: 'Self',
        price: '$180',
        notes: 'Main character reference'
    },
    {
        artist: 'CyberneticCutie',
        title: 'Thea Portrait',
        description: 'Detailed portrait of Thea in casual outfit',
        date: '2025-01-10',
        type: 'bust',
        status: 'in-progress',
        commissioner: 'Self',
        price: '$85',
        notes: 'For social media profile'
    },
    {
        artist: 'FeralFelines',
        title: 'Darla Full Body',
        description: 'Full body illustration of Darla in nature setting',
        date: '2025-01-20',
        type: 'full',
        status: 'planning',
        commissioner: 'Self',
        price: '$150',
        notes: 'Fantasy theme requested'
    },
    {
        artist: 'DigitalDreams',
        title: 'Caelielle Chibi',
        description: 'Cute chibi version of Caelielle for stickers',
        date: '2025-02-01',
        type: 'chibi',
        status: 'planning',
        commissioner: 'Self',
        price: '$45',
        notes: 'Merchandise design'
    },
    {
        artist: 'ArtisticSoul',
        title: 'Group Commission',
        description: 'All three characters together in a scene',
        date: '2025-02-15',
        type: 'scene',
        status: 'planning',
        commissioner: 'Self',
        price: '$300',
        notes: 'Special anniversary piece'
    }
];

/**
 * Prepopulate the commission queue
 * This function should be called from the admin panel
 */
async function prepopulateQueue() {
    if (!window.queueManager) {
        console.error('Queue manager not available');
        return false;
    }

    try {
        console.log('Starting queue prepopulation...');
        
        for (const commission of COMMISSION_DATA) {
            // Convert date to proper format if needed
            const formattedCommission = {
                ...commission,
                date: commission.date, // Ensure date is in YYYY-MM-DD format
                id: `prep-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            };
            
            console.log(`Adding commission: ${commission.title}`);
            await window.queueManager.addCommission(formattedCommission);
            
            // Small delay to prevent overwhelming the system
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log('Queue prepopulation completed successfully!');
        return true;
        
    } catch (error) {
        console.error('Error during prepopulation:', error);
        return false;
    }
}

/**
 * Clear all commissions from the queue
 * Use with caution!
 */
async function clearQueue() {
    if (!window.queueManager) {
        console.error('Queue manager not available');
        return false;
    }

    const queue = window.queueManager.getQueue();
    const confirmClear = confirm(`Are you sure you want to delete all ${queue.length} commissions?`);
    
    if (!confirmClear) {
        return false;
    }

    try {
        for (const commission of queue) {
            await window.queueManager.deleteCommission(commission.id);
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        console.log('Queue cleared successfully!');
        return true;
        
    } catch (error) {
        console.error('Error clearing queue:', error);
        return false;
    }
}

// Export functions for use in admin panel
window.prepopulateQueue = prepopulateQueue;
window.clearQueue = clearQueue;
window.COMMISSION_DATA = COMMISSION_DATA;

console.log('Queue prepopulation script loaded. Use prepopulateQueue() to populate the queue.');
