import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

/**
 * Hashea una contraseña usando bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

/**
 * Verifica una contraseña contra su hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

/**
 * Autentica un usuario con username y password
 */
export async function authenticateUser(username: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' }
    }

    const isValidPassword = await verifyPassword(password, user.password)
    
    if (!isValidPassword) {
      return { success: false, error: 'Contraseña incorrea' }
    }

    // Generar JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    return { 
      success: true, 
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      },
      token 
    }
  } catch (error) {
    console.error('Error en authenticateUser:', error)
    return { success: false, error: 'Error interno del servidor' }
  }
}

/**
 * Verifica un JWT token
 */
export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return { success: true, user: decoded }
  } catch (error) {
    return { success: false, error: 'Token inválido' }
  }
}

/**
 * Crea un usuario administrador (solo para inicialización)
 */
export async function createAdminUser(username: string, password: string) {
  try {
    const hashedPassword = await hashPassword(password)
    
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    return { success: true, user: { id: user.id, username: user.username, role: user.role } }
  } catch (error) {
    console.error('Error creando usuario admin:', error)
    return { success: false, error: 'Error creando usuario' }
  }
} 