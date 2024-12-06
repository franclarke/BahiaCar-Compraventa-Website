# BahiaCar Compraventa 🚗

## Descripción
BahiaCar Compraventa es una plataforma web moderna diseñada para la compra y venta de vehículos en Bahía Blanca y la región. Ofrece una experiencia de usuario intuitiva y herramientas eficientes para la búsqueda y publicación de vehículos.

## Características Principales 🌟

### Para Compradores
- **Catálogo Interactivo**: Exploración fácil de vehículos disponibles
- **Filtros Avanzados**: Búsqueda por:
  - Marca
  - Modelo
  - Tipo de vehículo
  - Estado (Nuevo/Usado)
  - Rango de precios
  - Tipo de combustible
  - Transmisión
- **Visualización Detallada**: Imágenes de alta calidad y especificaciones completas
- **Interfaz Responsiva**: Experiencia optimizada en todos los dispositivos

### Para Vendedores
- **Publicación Simple**: Proceso intuitivo para listar vehículos
- **Gestión de Anuncios**: Control total sobre las publicaciones
- **Formulario de Venta**: Captura detallada de información del vehículo

## Tecnologías Utilizadas 💻

- **Frontend**:
  - Next.js 13
  - React
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui

- **Backend**:
  - Prisma ORM
  - PostgreSQL
  - Next.js API Routes

## Requisitos del Sistema 🔧

- Node.js 18 o superior
- PostgreSQL 12 o superior
- NPM o Yarn

## Instalación 🚀

1. Clonar el repositorio:
\`\`\`bash
git clone [URL_DEL_REPOSITORIO]
\`\`\`

2. Instalar dependencias:
\`\`\`bash
npm install
\`\`\`

3. Configurar variables de entorno:
   - Crear archivo \`.env\` en la raíz del proyecto
   - Agregar las siguientes variables:
\`\`\`env
DATABASE_URL="postgresql://[usuario]:[contraseña]@localhost:5432/bahiacar"
DIRECT_URL="postgresql://[usuario]:[contraseña]@localhost:5432/bahiacar"
\`\`\`

4. Ejecutar migraciones de la base de datos:
\`\`\`bash
npx prisma migrate dev
\`\`\`

5. Poblar la base de datos con datos iniciales:
\`\`\`bash
npm run seed
\`\`\`

6. Iniciar el servidor de desarrollo:
\`\`\`bash
npm run dev
\`\`\`

## Estructura del Proyecto 📁

\`\`\`
├── app/                    # Rutas y componentes de la aplicación
│   ├── api/               # Endpoints de la API
│   ├── catalogo/          # Páginas del catálogo
│   └── components/        # Componentes reutilizables
├── prisma/                # Esquema y migraciones de la base de datos
├── public/                # Archivos estáticos
└── types/                 # Definiciones de tipos TypeScript
\`\`\`

## Características en Desarrollo 🔄

- [ ] Sistema de autenticación de usuarios
- [ ] Panel de administración
- [ ] Sistema de mensajería interna
- [ ] Comparador de vehículos
- [ ] Integración con APIs de tasación

## Contribución 🤝

1. Fork del repositorio
2. Crear una rama para tu feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit de tus cambios (\`git commit -m 'Add some AmazingFeature'\`)
4. Push a la rama (\`git push origin feature/AmazingFeature\`)
5. Abrir un Pull Request

## Soporte 📧

Para soporte y consultas, por favor contactar a través de:
- Email: [correo_de_soporte]
- Issues del repositorio

## Licencia 📄

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

---
Desarrollado con ❤️ para la comunidad de Bahía Blanca 