// frontend/src/components/ImageUpload.jsx
import { useState, useRef } from 'react'

const ImageUpload = ({ apiBase, onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setMessage('❌ Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('❌ File too large. Maximum size is 5MB.')
      return
    }

    setUploading(true)
    setMessage('')

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch(`${apiBase}/upload.php`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setMessage('✅ Image uploaded successfully!')
        onUploadSuccess()
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        setMessage(`❌ ${data.error}`)
      }
    } catch (error) {
      setMessage('❌ Upload failed. Please try again.')
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
          ${dragActive 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-indigo-50'
          }
          ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-4">
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="text-indigo-600 font-medium mt-2">Uploading...</p>
            </div>
          ) : (
            <>
              <div className="text-6xl">📤</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Upload Your Images
                </h3>
                <p className="text-gray-500 mb-4">
                  Drag and drop your images here, or click to browse
                </p>
                <button
                  type="button"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Choose Files
                </button>
              </div>
            </>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-400">
          Supports: JPEG, PNG, GIF, WebP • Max size: 5MB
        </div>
      </div>

      {message && (
        <div className={`
          mt-4 p-3 rounded-lg text-center font-medium
          ${message.includes('❌') 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
          }
        `}>
          {message}
        </div>
      )}
    </div>
  )
}

export default ImageUpload