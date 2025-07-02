# Image Upload Platform - Setup Guide

## Project Structure
```
image-upload-platform/
├── backend/
│   ├── config/
│   │   └── database.php
│   ├── api/
│   │   ├── upload.php
│   │   ├── get-images.php
│   │   ├── delete-image.php
│   │   └── update-image.php
│   ├── uploads/
│   └── index.php
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageUpload.jsx
│   │   │   ├── ImageGallery.jsx
│   │   │   └── ImageCard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Steps

### 1. Backend Setup (PHP)

1. **Create MySQL Database:**
```sql
CREATE DATABASE image_platform;
USE image_platform;

CREATE TABLE images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

2. **Set up Apache/PHP environment:**
   - Install XAMPP/WAMP/MAMP
   - Place backend folder in htdocs/www directory
   - Start Apache and MySQL services

3. **Set permissions for uploads directory:**
```bash
chmod 755 backend/uploads
chmod 644 backend/uploads/*
```

### 2. Frontend Setup (React + Vite)

1. **Create Vite React project:**
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

2. **Install Tailwind CSS:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3. **Configure Tailwind (tailwind.config.js):**
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

4. **Add Tailwind to CSS (src/index.css):**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

5. **Install additional dependencies:**
```bash
npm install axios
```

### 3. Running the Application

1. **Start backend:**
   - Ensure XAMPP/WAMP is running
   - Access via: `http://localhost/your-project-name/backend`

2. **Start frontend:**
```bash
cd frontend
npm run dev
```

### 4. Configuration Notes

- Update database credentials in `backend/config/database.php`
- Ensure `backend/uploads/` directory has write permissions
- Backend API endpoints will be available at `http://localhost/your-project-name/backend/api/`
- Frontend will run on `http://localhost:5173` (default Vite port)

### 5. Features Included

- ✅ Image upload with drag & drop
- ✅ Image gallery with grid layout
- ✅ Image preview and download
- ✅ Image deletion
- ✅ Image renaming
- ✅ Responsive design
- ✅ File type validation
- ✅ File size validation
- ✅ Error handling

### 6. API Endpoints

- `POST /api/upload.php` - Upload image
- `GET /api/get-images.php` - Retrieve all images
- `DELETE /api/delete-image.php` - Delete image
- `PUT /api/update-image.php` - Update image details