# Firebase Push Notifications Setup Guide

This guide will help you set up Firebase Cloud Messaging (FCM) for push notifications in your BuddyBurn fitness app.

## Prerequisites
- A Firebase account (create one at https://firebase.google.com)
- Your app deployed and accessible

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Enter project name: "BuddyBurn" (or your preferred name)
4. Follow the setup wizard (you can disable Google Analytics if not needed)

## Step 2: Add Web App to Firebase Project

1. In Firebase Console, click the web icon (</>) to add a web app
2. Register your app with a nickname (e.g., "BuddyBurn Web")
3. Firebase will generate configuration values - save these for later:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

## Step 3: Enable Cloud Messaging

1. In Firebase Console, go to "Project Settings" (gear icon)
2. Navigate to "Cloud Messaging" tab
3. Under "Web configuration", click "Generate key pair"
4. Save the VAPID key (starts with `B...`) - you'll need this

## Step 4: Set Up Service Worker

Create a file `public/firebase-messaging-sw.js`:

```javascript
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

## Step 5: Install Firebase SDK

```bash
npm install firebase
```

## Step 6: Create Firebase Configuration File

Create `src/lib/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY'
      });
      
      console.log('FCM Token:', token);
      // Save this token to your Supabase database
      return token;
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
```

## Step 7: Request Permission in Your App

Add this to your main app component (e.g., `src/App.tsx`):

```typescript
import { useEffect } from 'react';
import { requestNotificationPermission, onMessageListener } from '@/lib/firebase';
import { toast } from 'sonner';

// Inside your component:
useEffect(() => {
  // Request notification permission when user logs in
  requestNotificationPermission().then(token => {
    if (token) {
      // Save token to Supabase profiles table
      // You can create a new column 'fcm_token' in the profiles table
    }
  });

  // Listen for foreground messages
  onMessageListener().then((payload: any) => {
    toast.info(payload.notification.title, {
      description: payload.notification.body
    });
  });
}, []);
```

## Step 8: Create Supabase Edge Function to Send Notifications

Create `supabase/functions/send-notification/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const FIREBASE_SERVER_KEY = Deno.env.get('FIREBASE_SERVER_KEY');

serve(async (req) => {
  try {
    const { token, title, body, data } = await req.json();

    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=${FIREBASE_SERVER_KEY}`
      },
      body: JSON.stringify({
        to: token,
        notification: {
          title,
          body
        },
        data
      })
    });

    const result = await response.json();
    
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
```

## Step 9: Add Firebase Server Key to Supabase Secrets

1. In Firebase Console, go to Project Settings > Cloud Messaging
2. Copy the "Server key" (legacy)
3. In your Lovable project, add it as a Supabase secret named `FIREBASE_SERVER_KEY`

## Step 10: Test Notifications

You can test by calling your edge function:

```typescript
import { supabase } from '@/integrations/supabase/client';

const sendTestNotification = async (fcmToken: string) => {
  const { data, error } = await supabase.functions.invoke('send-notification', {
    body: {
      token: fcmToken,
      title: 'Workout Reminder',
      body: 'Time for your scheduled workout!',
      data: { type: 'workout_reminder' }
    }
  });
  
  if (error) console.error('Error:', error);
  else console.log('Notification sent:', data);
};
```

## Notification Types for BuddyBurn

Once set up, you can send notifications for:

- **Friend Requests**: When someone sends a friend request
- **Workout Reminders**: 30 mins before scheduled workouts
- **Achievement Unlocked**: When user earns a new achievement
- **Friend Activity**: When a friend completes a workout
- **Streak Reminders**: Daily workout streak reminders
- **Goal Progress**: Weekly progress updates

## Troubleshooting

### Notifications not appearing:
- Check browser notification permissions
- Verify service worker is registered (check DevTools > Application > Service Workers)
- Ensure Firebase config is correct
- Check browser console for errors

### Token not generating:
- Make sure your site is served over HTTPS (or localhost)
- Verify VAPID key is correct
- Check Firebase project settings

## Security Notes

- Never commit Firebase config with real keys to public repositories
- Use environment variables for sensitive data
- Implement server-side validation before sending notifications
- Consider rate limiting notification sends

## Next Steps

1. Add `fcm_token` column to profiles table
2. Update token when user logs in/out
3. Create notification preference settings
4. Implement notification scheduling
5. Add analytics to track notification engagement
