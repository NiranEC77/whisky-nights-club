# Featured Images Guide

## Overview

Each event can now have its own custom featured image (like a bottle photo, tasting room image, etc.). These images will display on:
- Event cards on the homepage
- Event detail pages
- Event listings

## How to Add Featured Images to Events

### Step 1: Upload Your Image

Copy your image file to the events directory:

```bash
cp ~/path/to/your-image.jpg /Users/niranevenchen/Documents/code/whisky_club/public/images/events/
```

**Recommended specs:**
- Size: 1200x600px or larger
- Format: JPG, PNG, or WebP
- Optimize before uploading for better performance

### Step 2: Run the Database Migration

Before using featured images, run the migration in Supabase:

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/004_add_event_featured_image.sql`
4. Run the SQL query

Or use the Supabase CLI:
```bash
supabase db push
```

### Step 3: Add the Image Path to Your Event

When creating or editing an event in the admin dashboard:

1. Go to `/admin/events/new` (new event) or edit an existing event
2. Find the **Featured Image** field
3. Enter the path to your image: `/images/events/your-image.jpg`
4. Save the event

## Examples

### Example Image Paths
```
/images/events/laphroaig-bottle.jpg
/images/events/bourbon-tasting.png
/images/events/scotch-night.jpg
```

### Example Workflow

```bash
# 1. Copy your bottle image
cp ~/Downloads/highland-whisky.jpg public/images/events/

# 2. In the admin dashboard, create a new event and set:
# Featured Image: /images/events/highland-whisky.jpg

# 3. The image will now display on the event card!
```

## Fallback Behavior

If no featured image is specified:
- Events will display a default whisky-themed gradient with a stock image
- The site will continue to work normally

## Tips

- Use descriptive filenames: `whiskey-bottle-name.jpg` instead of `img123.jpg`
- Keep file sizes reasonable (under 500KB ideally)
- Use consistent aspect ratios (16:9 or 2:1 works well)
- Consider using WebP format for better compression

## Deployment Note

When deploying to Vercel, your images in `public/images/events/` will be automatically deployed with your site. No additional configuration needed!

