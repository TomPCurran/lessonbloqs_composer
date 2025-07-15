# Comments Feature Guide

## Overview

The editor now supports real-time comments using Liveblocks integration with BlockNote. Users can create, view, and reply to comments on specific text selections.

## How to Use Comments

### Creating Comments

1. **Select Text**: Highlight any text in the editor
2. **Open Side Menu**: Click the comment icon (💬) that appears in the side menu
3. **Write Comment**: Type your comment in the composer that appears
4. **Submit**: Click the send button or press Enter to create the comment

### Viewing Comments

- **Anchored Comments**: Comments appear inline with the text they reference
- **Floating Comments**: On larger screens, comments also appear as floating overlays
- **Thread View**: All comments are organized in threads that can be expanded/collapsed

### Replying to Comments

1. Click on any existing comment
2. Type your reply in the composer
3. Submit to add your reply to the thread

### Managing Comments

- **Resolve Threads**: Mark comment threads as resolved when issues are addressed
- **Delete Comments**: Remove comments (if you have permission)
- **Edit Comments**: Modify your own comments

## Technical Implementation

### Components Used

- `Threads.tsx`: Main comment components wrapper
- `AnchoredThreads`: Inline comment display
- `FloatingThreads`: Overlay comment display
- `FloatingComposer`: Comment creation interface

### Liveblocks Integration

- Comments are stored in Liveblocks threads
- Real-time synchronization across all users
- User authentication and permissions handled by Liveblocks

### Styling

- Comments are styled with Tailwind CSS classes
- Responsive design for mobile and desktop
- Dark/light theme support

## Features

- ✅ Real-time collaboration
- ✅ Text selection comments
- ✅ Thread-based organization
- ✅ User avatars and names
- ✅ Mobile responsive
- ✅ Theme support
- ✅ Permission-based access

## Troubleshooting

### Comments not appearing?

- Ensure you're connected to the Liveblocks room
- Check that the side menu is enabled (`sideMenu={true}`)
- Verify user authentication

### Can't create comments?

- Make sure you have edit permissions
- Check that text is properly selected
- Ensure the comment composer is visible

### Comments not syncing?

- Check your internet connection
- Verify Liveblocks room connection
- Refresh the page if needed
