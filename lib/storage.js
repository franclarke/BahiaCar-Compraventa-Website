import { supabase, supabaseAdmin } from './supabaseClient'

const BUCKET_NAME = 'car-images'

// Usar cliente admin para operaciones de storage cuando sea necesario
const storageClient = supabaseAdmin || supabase

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
      throw error
    }

    // Obtener URL pública
    const { data: urlData } = storageClient.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    return {
      success: true,
      path: filePath,
      url: urlData.publicUrl
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
    const { error } = await storageClient.storage
      .from(BUCKET_NAME)
      .remove([imagePath])

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
    const { error } = await storageClient.storage
      .from(BUCKET_NAME)
      .remove(imagePaths)

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
 * Obtiene URL pública de una imagen
 */
export function getImageUrl(imagePath) {
  if (!imagePath) return null
  
  const { data } = storageClient.storage
    .from(BUCKET_NAME)
    .getPublicUrl(imagePath)
    
  return data.publicUrl
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