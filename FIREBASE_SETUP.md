# Firebase Setup Guide

## Setting up Firebase for the Commission Queue

### 1. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `deersona-portfolio`
3. Navigate to **Firestore Database**

### 2. Configure Firestore Security Rules

In the Firebase Console, go to **Firestore Database > Rules** and replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to commissions collection
    match /commissions/{document} {
      allow read, write: if true;
    }
    
    // Allow read/write access to archived commissions
    match /archived_commissions/{document} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ Important:** These rules allow public access for demo purposes. For production, you should implement proper authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Require authentication for write operations
    match /commissions/{document} {
      allow read: if true;  // Public read access
      allow write: if request.auth != null;  // Require auth for writes
    }
    
    match /archived_commissions/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Test the Setup

1. Open the debug tool: `http://localhost:8000/debug-queue.html`
2. Click "Check Queue Manager"
3. Click "Test Add Commission"
4. If successful, you should see the commission added

### 4. Alternative: Demo Mode

If you prefer to test without Firebase, the system will automatically fall back to demo mode when Firebase is not properly configured or accessible.

## Troubleshooting

### Common Issues:

1. **"Missing or insufficient permissions"**
   - Update Firestore security rules as shown above
   - Make sure the rules are published (click "Publish" in Firebase Console)

2. **"Firebase not configured"**
   - Check that `firebase-config.js` has the correct project settings
   - Verify the API key and project ID are correct

3. **"Network error"**
   - Check internet connection
   - Verify Firebase project is active and not suspended

### Demo Mode Features:

- Works offline
- Data persists during the session
- All queue management features available
- No Firebase setup required
