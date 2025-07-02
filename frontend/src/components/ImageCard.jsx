// frontend/src/components/ImageCard.jsx
import { useState } from 'react'

const ImageCard = ({ image, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState(image.original_name)
  const [showFullImage, setShowFullImage] = useState(false)

  const handleSave = () => {
    if (newName.trim() && newName !== image.original_name) {
      onUpdate(image.id, newName.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setNewName(image.original_name)
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      onDelete(image.id)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        {/* Image */}
        <div className="relative group">
          <img
            src={image.url}
            alt={image.original_name}
            className="w-full h-48 object-cover cursor-pointer"
            onClick={() => setShowFullImage(true)}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => setShowFullImage(true)}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-3 py-1 rounded-lg text-sm font-medium"
              >
                🔍 View
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Name */}
          <div>
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                  >
                    ✓ Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs"
                  >
                    ✕ Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-800 truncate flex-1">
                  {image.original_name}
                </h3>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-indigo-600 ml-2"
                  title="Edit name"
                >
                  ✏️
                </button>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="text-xs text-gray-500 space-y-1">
            <div>Size: {formatFileSize(image.file_size)}</div>
            <div>Type: {image.mime_type}</div>
            <div>Uploaded: {formatDate(image.uploaded_at)}</div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <a
              href={image.url}
              download={image.original_name}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded text-sm text-center transition-colors duration-200"
            >
              📥 Download
            </a>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-sm transition-colors duration-200"
              title="Delete image"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      {/* Full Image Modal */}
      {showFullImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute -top-10 right-0 text-white text-xl hover:text-gray-300"
            >
              ✕ Close
            </button>
            <img
              src={image.url}
              alt={image.original_name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3 rounded-b-lg">
              <h4 className="font-medium">{image.original_name}</h4>
              <p className="text-sm opacity-75">
                {formatFileSize(image.file_size)} • {formatDate(image.uploaded_at)}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ImageCard