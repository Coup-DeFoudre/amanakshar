'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageUploadFieldProps {
  label: string
  value?: string | null
  onChange: (value: string | null, file?: File) => void
  preview?: string | null
  accept?: string
  maxSize?: number // in MB
  helperText?: string
  className?: string
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'video'
}

/**
 * ImageUploadField - Reusable image upload component for admin forms
 * Supports drag-and-drop, file selection, and URL input
 */
export function ImageUploadField({
  label,
  value,
  onChange,
  preview: externalPreview,
  accept = '.jpg,.jpeg,.png,.webp',
  maxSize = 5,
  helperText,
  className,
  aspectRatio = 'portrait',
}: ImageUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file')
  const [urlInput, setUrlInput] = useState(value || '')
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Use external preview or local preview
  const preview = externalPreview || localPreview || value

  // Aspect ratio classes
  const aspectClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-video',
    video: 'aspect-video',
  }

  // Reset local preview when value changes externally
  useEffect(() => {
    if (!value) {
      setLocalPreview(null)
    }
    setUrlInput(value || '')
  }, [value])

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return 'केवल JPEG, PNG, WebP, या SVG फाइलें स्वीकार्य हैं'
    }

    // Check file size
    const maxSizeBytes = maxSize * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return `फाइल का आकार ${maxSize}MB से कम होना चाहिए`
    }

    return null
  }, [maxSize])

  const handleFile = useCallback((file: File) => {
    setError(null)
    
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    // Generate preview
    const reader = new FileReader()
    reader.onloadstart = () => setUploadProgress(0)
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        setUploadProgress(Math.round((e.loaded / e.total) * 100))
      }
    }
    reader.onloadend = () => {
      setUploadProgress(null)
      setLocalPreview(reader.result as string)
      onChange(reader.result as string, file)
    }
    reader.onerror = () => {
      setError('फाइल पढ़ने में त्रुटि हुई')
      setUploadProgress(null)
    }
    reader.readAsDataURL(file)
  }, [validateFile, onChange])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setUrlInput(url)
    onChange(url || null)
  }, [onChange])

  const handleRemove = useCallback(() => {
    setLocalPreview(null)
    setUrlInput('')
    setError(null)
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onChange])

  const openFileSelector = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div className={cn('space-y-3', className)}>
      <label className="block font-ui text-text-secondary text-sm">
        {label}
      </label>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setUploadMode('file')}
          className={cn(
            'px-3 py-1 text-sm font-ui rounded-sm transition-colors',
            uploadMode === 'file'
              ? 'bg-accent-gold text-bg-primary'
              : 'border border-divider-strong text-text-secondary hover:border-accent-gold'
          )}
        >
          फाइल अपलोड
        </button>
        <button
          type="button"
          onClick={() => setUploadMode('url')}
          className={cn(
            'px-3 py-1 text-sm font-ui rounded-sm transition-colors',
            uploadMode === 'url'
              ? 'bg-accent-gold text-bg-primary'
              : 'border border-divider-strong text-text-secondary hover:border-accent-gold'
          )}
        >
          URL से
        </button>
      </div>

      {uploadMode === 'file' ? (
        <>
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileSelector}
            className={cn(
              'relative cursor-pointer rounded-sm border-2 border-dashed transition-all duration-200',
              'flex items-center justify-center',
              aspectClasses[aspectRatio],
              'max-w-xs',
              isDragging
                ? 'border-accent-gold bg-accent-gold/10'
                : 'border-divider-strong hover:border-accent-gold/50 bg-bg-secondary',
              preview && 'border-solid border-accent-gold/30'
            )}
          >
            {preview ? (
              // Image Preview
              <div className="relative w-full h-full">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-sm"
                  unoptimized={preview.startsWith('data:')}
                />
                <div className="absolute inset-0 bg-bg-primary/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="font-ui text-sm text-text-primary">
                    बदलने के लिए क्लिक करें
                  </span>
                </div>
              </div>
            ) : (
              // Upload Prompt
              <div className="text-center p-6">
                <svg 
                  className="w-10 h-10 mx-auto mb-3 text-text-muted"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
                <p className="font-ui text-text-muted text-sm mb-1">
                  छवि यहाँ खींचें या क्लिक करें
                </p>
                <p className="font-ui text-text-muted text-xs">
                  JPEG, PNG, WebP (अधिकतम {maxSize}MB)
                </p>
              </div>
            )}

            {/* Upload Progress */}
            {uploadProgress !== null && (
              <div className="absolute inset-x-0 bottom-0 h-1 bg-bg-primary">
                <div 
                  className="h-full bg-accent-gold transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
        </>
      ) : (
        // URL Input Mode
        <input
          type="url"
          value={urlInput}
          onChange={handleUrlChange}
          placeholder="https://example.com/image.jpg"
          className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
        />
      )}

      {/* Error Message */}
      {error && (
        <p className="font-ui text-red-400 text-sm">{error}</p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="font-ui text-text-muted text-xs">{helperText}</p>
      )}

      {/* Remove Button */}
      {(preview || urlInput) && (
        <button
          type="button"
          onClick={handleRemove}
          className="flex items-center gap-1 font-ui text-red-400 text-sm hover:text-red-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          छवि हटाएं
        </button>
      )}
    </div>
  )
}
