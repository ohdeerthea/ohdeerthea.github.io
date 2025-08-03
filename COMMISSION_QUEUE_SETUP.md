# Commission Queue Setup Guide

## Overview
The commission queue system has been enhanced with the following features:
- **Auto-sorting**: Commissions are automatically sorted by commission date (oldest first)
- **Auto-deletion**: When a commission status is set to "complete", it's automatically archived and removed from the active queue
- **Prepopulation**: Easy way to bulk-add commissions from your Google Sheets data

## Setting Up Your Commission Data

### Step 1: Extract Data from Google Sheets
Since the Google Sheets link requires authentication, you'll need to manually copy your commission data. Here's the format the system expects:

```javascript
{
    artist: 'Artist Name',
    title: 'Commission Title',
    description: 'Detailed description of the commission',
    date: 'YYYY-MM-DD', // Commission date in ISO format
    type: 'bust|full|reference|scene|chibi', // Commission type
    status: 'planning|in-progress|on-hold|complete',
    commissioner: 'Commissioner Name', // Optional
    price: '$XX', // Optional
    notes: 'Any additional notes' // Optional
}
```

### Step 2: Update the Prepopulation Script
1. Open `scripts/queue-prepopulation.js`
2. Replace the `COMMISSION_DATA` array with your actual commission data
3. Make sure dates are in YYYY-MM-DD format
4. Ensure status values match the expected options

### Step 3: Using the Admin Panel
1. Go to your site's `/admin.html` page
2. Login with the admin password
3. Click the "📥 Prepopulate Queue" button to load all your commissions
4. Use "🗑️ Clear Queue" if you need to start over
5. Use "✅ View Completed" to see archived completed commissions

## Features Explained

### Auto-Sorting
- Commissions are sorted by the `date` field (oldest commission first)
- This happens automatically when:
  - Loading data from Firebase
  - Adding new commissions
  - Updating existing commissions

### Auto-Deletion/Archiving
When a commission status is changed to "complete":
- **Firebase mode**: Commission is moved to a `completed_commissions` collection
- **Demo mode**: Commission is removed from the active queue
- The completed commission is archived with a completion timestamp
- It no longer appears in the public queue view

### Queue Management
- **Active Queue**: Shows only commissions with status: planning, in-progress, on-hold
- **Completed Archive**: Stores all completed commissions with completion dates
- **Real-time Updates**: Changes sync automatically across all views

## Example Commission Data Structure

Based on typical commission tracking, here's an example of how to structure your data:

```javascript
const COMMISSION_DATA = [
    {
        artist: 'TealwingArt',
        title: 'Thea Reference Sheet',
        description: 'Complete reference sheet with front, back, and side views plus expressions',
        date: '2024-11-15',
        type: 'reference',
        status: 'complete',
        commissioner: 'Self',
        price: '$180',
        notes: 'Primary character reference'
    },
    {
        artist: 'DigitalDreams',
        title: 'Thea Portrait',
        description: 'Bust portrait in casual forest outfit',
        date: '2025-01-10',
        type: 'bust',
        status: 'in-progress',
        commissioner: 'Self',
        price: '$85',
        notes: 'For social media avatar'
    },
    {
        artist: 'FeralFelines',
        title: 'Darla Full Body',
        description: 'Full body illustration in naturalistic setting',
        date: '2025-02-01',
        type: 'full',
        status: 'planning',
        commissioner: 'Self',
        price: '$150',
        notes: 'Nature/forest theme'
    }
    // Add more commissions here...
];
```

## Status Options
- `planning`: Commission details being finalized
- `in-progress`: Artist actively working
- `on-hold`: Temporarily paused
- `complete`: Finished (will be auto-archived)

## Type Options
- `bust`: Portrait/headshot
- `full`: Full body illustration
- `reference`: Reference sheet
- `scene`: Multi-character or complex scene
- `chibi`: Chibi/cute style
- Custom types are also supported

## Tips
1. **Backup First**: Before clearing the queue, make sure you have your data backed up
2. **Date Format**: Always use YYYY-MM-DD format for dates
3. **Status Updates**: When you mark something complete in the admin panel, it will automatically be archived
4. **Regular Updates**: The queue updates in real-time, so changes are immediately visible

## Troubleshooting
- If prepopulation fails, check the browser console for error messages
- Ensure all required fields (artist, title, description, date, type, status) are present
- Verify date formats are correct
- Make sure Firebase is properly configured if using the production version
