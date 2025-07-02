// frontend/src/components/ImageGallery.jsx
import ImageCard from './ImageCard'

const ImageGallery = ({ images, loading, onDelete, onUpdate }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading images...</span>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🖼️</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No images yet
        </h3>
        <p className="text-gray-500">
          Upload your first image to get started!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Your Gallery ({images.length} images)
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  )
}

export default ImageGallery