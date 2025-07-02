// frontend/src/App.jsx
import { useState, useEffect } from 'react'
import ImageUpload from './components/ImageUpload'
import ImageGallery from './components/ImageGallery'
import './App.css'

function App() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const API_BASE = 'http://localhost/image-upload-platform/backend/api'

  const fetchImages = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/get-images.php`)
      const data = await response.json()
      if (data.success) {
        setImages(data.images)
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleDelete = async (imageId) => {
    try {
      const response = await fetch(`${API_BASE}/delete-image.php`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: imageId })
      })
      
      if (response.ok) {
        setRefreshTrigger(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  const handleUpdate = async (imageId, newName) => {
    try {
      const response = await fetch(`${API_BASE}/update-image.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: imageId, 
          original_name: newName 
        })
      })
      
      if (response.ok) {
        setRefreshTrigger(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error updating image:', error)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [refreshTrigger])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📸 Image Gallery
          </h1>
          <p className="text-gray-600">
            Upload and manage your photos seamlessly
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <ImageUpload 
            apiBase={API_BASE} 
            onUploadSuccess={handleUploadSuccess}
          />
        </div>

        {/* Stats */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-md">
            <span className="text-sm text-gray-600">
              Total Images: <span className="font-semibold text-indigo-600">{images.length}</span>
            </span>
          </div>
        </div>

        {/* Gallery */}
        <ImageGallery 
          images={images}
          loading={loading}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  )
}

export default App