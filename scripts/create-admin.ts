import { createAdminUser } from '../lib/auth'

async function createAdmin() {
  try {
    console.log('Creando usuario administrador...')
    
    const username = process.argv[2] || 'admin'
    const password = process.argv[3] || 'admin123'
    
    const result = await createAdminUser(username, password)
    
    if (result.success && result.user) {
      console.log('✅ Usuario administrador creado exitosamente:')
      console.log(`   Username: ${result.user.username}`)
      console.log(`   Role: ${result.user.role}`)
      console.log(`   ID: ${result.user.id}`)
    } else {
      console.error('❌ Error creando usuario administrador:', result.error)
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message)
  }
}

createAdmin() 