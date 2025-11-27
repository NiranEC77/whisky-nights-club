# Image Upload & Crop Guide

## New Feature: Crop Images Before Upload! 🎨

You can now select, preview, crop, and adjust images directly from the event creation form!

## How It Works

### Step-by-Step Guide

#### 1. **Select Your Image**
- Go to **Create New Event** or **Edit Event** in admin dashboard
- Click the upload area in the "Featured Image" section
- Choose an image from your computer (JPG, PNG, or WebP)

#### 2. **Crop Modal Opens Automatically**
Once you select an image, a cropping modal appears with:
- **Preview** of your image
- **Drag** to reposition the image
- **Zoom slider** at the bottom
- Crop area is set to **2:1 aspect ratio** (perfect for event cards)

#### 3. **Adjust Your Image**
- **Drag the image** to reposition it within the crop area
- **Use the zoom slider** to zoom in/out
- **Zoom buttons** on each side for quick adjustments
- You can also **scroll** to zoom

#### 4. **Apply or Cancel**
- Click **"Apply Crop"** - Image gets cropped and uploaded automatically
- Click **"Cancel"** - Returns to upload screen without saving

#### 5. **Done!**
- See instant preview of your cropped image
- Image is saved to `/images/events/`
- Path is automatically stored in the event
- Click the **X button** to remove and upload a different image

## Features

### ✅ Automatic Cropping
- No need to crop images manually before uploading
- Consistent 2:1 aspect ratio for all event images
- Perfect fit for event cards

### ✅ Visual Controls
- Drag to reposition
- Zoom slider (1x to 3x zoom)
- Real-time preview
- Clean, intuitive interface

### ✅ Validation
- Only accepts: **JPG, PNG, WebP**
- Maximum file size: **5MB**
- Shows helpful error messages

### ✅ Mobile Friendly
- Works on desktop and mobile
- Touch-friendly crop controls
- Responsive design

## Tips for Best Results

1. **Use high-quality images** - The cropper works best with clear, high-resolution photos
2. **Center your subject** - Zoom and drag to position the most important part of your image
3. **Zoom in for details** - If you have a bottle photo, zoom in to show the label clearly
4. **Preview before saving** - The crop area shows exactly what will be displayed

## Technical Details

### Image Specs
- **Aspect Ratio**: 2:1 (width is twice the height)
- **Output Format**: JPEG at 90% quality
- **Storage Location**: `public/images/events/`
- **Filename Pattern**: `event-[timestamp]-[random].jpg`

### Supported Formats
- **Input**: JPG, PNG, WebP
- **Output**: JPG (optimized)
- **Max Size**: 5MB

## Troubleshooting

### "File too large" error
- Your image is over 5MB
- Compress the image before uploading
- Or choose a different image

### "Invalid file type" error
- File must be JPG, PNG, or WebP
- Convert other formats (GIF, BMP, etc.) to JPG first

### Image looks blurry
- Upload a higher resolution source image
- Make sure you're not zooming in too much during cropping

### Crop modal doesn't appear
- Check browser console for errors
- Try refreshing the page
- Make sure JavaScript is enabled

## Example Workflow

```
1. Admin Dashboard → Create New Event
2. Fill in event details (title, date, price, etc.)
3. Scroll to "Featured Image" section
4. Click upload area
5. Select "laphroaig-bottle.jpg" from computer
6. Crop modal opens
7. Drag image to center the bottle
8. Use zoom slider to make bottle fill the frame
9. Click "Apply Crop"
10. See preview of cropped image
11. Click "Create Event"
12. Done! Event has perfect featured image
```

## Benefits

- **No external tools needed** - Crop directly in the app
- **Consistent sizing** - All event images look professional
- **Faster workflow** - Upload and crop in one step
- **Better results** - Preview exactly what will show on site
- **User-friendly** - No technical knowledge required

Enjoy creating beautiful event listings! 🥃✨

