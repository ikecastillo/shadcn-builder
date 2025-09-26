# Subscription-Based History Limits Setup

This document explains how to set up subscription-based history limits using Clerk user metadata.

## Overview

The form builder now supports different history size limits based on user subscription tiers:
- **Free**: 5 history snapshots
- **Advanced**: 20 history snapshots  
- **Pro**: Unlimited history snapshots

## How It Works

The system reads subscription information from Clerk's user `publicMetadata` and automatically adjusts the history size limit accordingly.

## Setting Up Subscription Metadata in Clerk

### 1. Using Clerk Dashboard

1. Go to your Clerk Dashboard
2. Navigate to **Users** section
3. Select a user
4. Go to **Metadata** tab
5. Add the following to **Public metadata**:

```json
{
  "subscriptionTier": "free"
}
```

Valid values for `subscriptionTier`:
- `"free"` - 5 history snapshots
- `"advanced"` - 20 history snapshots
- `"pro"` - Unlimited history snapshots

### 2. Using Clerk API

You can also set subscription metadata programmatically using Clerk's API:

```javascript
// Update user's subscription tier
await clerkClient.users.updateUserMetadata(userId, {
  publicMetadata: {
    subscriptionTier: "advanced"
  }
});
```

### 3. Using Webhooks (Recommended for Production)

For production applications, it's recommended to use Clerk webhooks to automatically update subscription metadata when users upgrade/downgrade their plans.

1. Set up a webhook endpoint in your application
2. Configure the webhook in Clerk Dashboard to trigger on user updates
3. Update the user's `publicMetadata` when subscription changes

Example webhook handler:

```javascript
// pages/api/webhooks/clerk.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { type, data } = req.body;
    
    if (type === 'user.updated') {
      const userId = data.id;
      const subscriptionTier = data.public_metadata?.subscriptionTier || 'free';
      
      // Update your database or perform other actions
      // The form builder will automatically pick up the new subscription info
    }
  }
  
  res.status(200).json({ received: true });
}
```

## Testing Different Subscription Tiers

### Free Tier (5 snapshots)
```json
{
  "subscriptionTier": "free"
}
```

### Advanced Tier (20 snapshots)
```json
{
  "subscriptionTier": "advanced"
}
```

### Pro Tier (Unlimited)
```json
{
  "subscriptionTier": "pro"
}
```

## Features

### Visual Indicators
- History dropdown shows current subscription tier with color-coded badges
- Pro users see a crown icon
- Usage information displays current usage vs. limit

### Warning Messages
- Users approaching their limit see warning messages
- Clear upgrade prompts when limits are reached

### Automatic History Management
- When users reach their limit, oldest snapshots are automatically removed
- History size adjusts immediately when subscription changes

## Implementation Details

The subscription system consists of:

1. **Types** (`src/types/subscription.types.ts`) - Defines subscription tiers and limits
2. **Utilities** (`src/lib/subscription.ts`) - Functions to read and process subscription info
3. **History Utils** (`src/lib/history-utils.ts`) - History-specific utility functions
4. **Auth Hook** (`src/hooks/use-auth.ts`) - Enhanced to include subscription info
5. **Store Integration** - Form builder store automatically uses subscription limits
6. **UI Components** - History buttons show subscription status and warnings

## Troubleshooting

### Subscription Not Updating
- Ensure the user is properly authenticated
- Check that `publicMetadata` is correctly set in Clerk
- Verify the `SubscriptionProvider` is wrapping your app

### History Not Respecting Limits
- Check that the subscription info is being passed to the store
- Ensure the `updateSubscriptionInfo` method is being called
- Verify the history size calculation in the store

### UI Not Showing Subscription Info
- Make sure the `SubscriptionProvider` is in your component tree
- Check that the history hook is returning subscription data
- Verify the undo-redo buttons component is using the updated hook
