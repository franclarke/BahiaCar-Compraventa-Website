import { supabase, supabaseAdmin } from './supabaseClient'

const BUCKET_NAME = 'car-images'

// Usar cliente admin para operaciones de storage cuando sea necesario
const storageClient = supabaseAdmin || supabase

/**
 * Obtiene URL pública de una imagen con manejo de errores mejorado
 */
export function getImageUrl(imagePath) {
  if (!imagePath) return null
  
  try {
    // Si la imagePath ya es una URL completa, devolverla tal como está
    if (imagePath.startsWith('http')) {
      return imagePath
    }
    
    const { data } = storageClient.storage
      .from(BUCKET_NAME)
      .getPublicUrl(imagePath)
    
    console.log('Generated URL for path:', imagePath, '-> URL:', data.publicUrl)
    return data.publicUrl
  } catch (error) {
    console.error('Error getting image URL for path:', imagePath, error)
    return null
  }
}

/**
 * Sube una imagen al storage de Supabase
 */
export async function uploadCarImage(file, carId) {
  try {
    // Generar nombre único para el archivo
    const fileExt = file.name.split('.').pop()
    const fileName = `car-${carId}-${Date.now()}.${fileExt}`
    const filePath = `cars/${fileName}`

    const { data, error } = await storageClient.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      throw error
    }

    // Obtener URL pública con la función mejorada
    const publicUrl = getImageUrl(filePath)

    return {
      success: true,
      path: filePath,
      url: publicUrl
    }
  } catch (error) {
    console.error('Error subiendo imagen:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Sube múltiples imágenes
 */
export async function uploadMultipleCarImages(files, carId) {
  try {
    const uploadPromises = files.map(file => uploadCarImage(file, carId))
    const results = await Promise.all(uploadPromises)
    
    const successfulUploads = results.filter(result => result.success)
    const failedUploads = results.filter(result => !result.success)

    if (failedUploads.length > 0) {
      console.warn('Some uploads failed:', failedUploads)
    }

    return {
      success: failedUploads.length === 0,
      successfulUploads,
      failedUploads,
      urls: successfulUploads.map(upload => upload.url)
    }
  } catch (error) {
    console.error('Error subiendo múltiples imágenes:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Elimina una imagen del storage
 */
export async function deleteCarImage(imagePath) {
  try {
    // Extraer el path de la URL si es necesario
    let pathToDelete = imagePath
    if (imagePath.includes('/storage/v1/object/public/')) {
      const urlParts = imagePath.split('/storage/v1/object/public/')
      if (urlParts.length > 1) {
        pathToDelete = urlParts[1].replace(`${BUCKET_NAME}/`, '')
      }
    }

    const { error } = await storageClient.storage
      .from(BUCKET_NAME)
      .remove([pathToDelete])

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Error eliminando imagen:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Elimina múltiples imágenes
 */
export async function deleteMultipleCarImages(imagePaths) {
  try {
    const pathsToDelete = imagePaths.map(imagePath => {
      // Extraer el path de la URL si es necesario
      if (imagePath.includes('/storage/v1/object/public/')) {
        const urlParts = imagePath.split('/storage/v1/object/public/')
        if (urlParts.length > 1) {
          return urlParts[1].replace(`${BUCKET_NAME}/`, '')
        }
      }
      return imagePath
    })

    const { error } = await storageClient.storage
      .from(BUCKET_NAME)
      .remove(pathsToDelete)

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Error eliminando múltiples imágenes:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Lista todas las imágenes de un auto
 */
export async function listCarImages(carId) {
  try {
    const { data, error } = await storageClient.storage
      .from(BUCKET_NAME)
      .list(`cars/`, {
        search: `car-${carId}-`
      })

    if (error) {
      throw error
    }

    return {
      success: true,
      images: data.map(file => ({
        name: file.name,
        path: `cars/${file.name}`,
        url: getImageUrl(`cars/${file.name}`)
      }))
    }
  } catch (error) {
    console.error('Error listando imágenes:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Verifica si el bucket existe y es público
 */
export async function verifyBucketConfiguration() {
  try {
    // Intentar listar archivos para verificar acceso
    const { data, error } = await storageClient.storage
      .from(BUCKET_NAME)
      .list('', { limit: 1 })

    if (error) {
      console.error('Bucket verification failed:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error verifying bucket:', error)
    return false
  }
} 