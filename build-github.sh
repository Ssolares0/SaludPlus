#!/bin/bash

# Script para construir y probar localmente antes de deploy
echo "🚀 Construyendo SaludPlus para GitHub Pages..."

# Ir al directorio del frontend
cd frontend

# Limpiar build anterior
echo "🧹 Limpiando build anterior..."
rm -rf dist/

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Construir la aplicación
echo "🔨 Construyendo aplicación..."
npm run build:github

# Verificar que el build fue exitoso (Angular 18+ usa subdirectorio browser)
if [ -f "dist/frontend/browser/index.html" ]; then
    echo "✅ Build exitoso!"
    
    # Crear archivo 404.html para GitHub Pages
    echo "📄 Creando 404.html..."
    cp dist/frontend/browser/index.html dist/frontend/browser/404.html
    
    echo "📊 Archivos generados:"
    ls -la dist/frontend/browser/
    
    echo "🎉 ¡Listo para deploy!"
    echo "📍 Los archivos están en: frontend/dist/frontend/browser/"
    
elif [ -f "dist/frontend/index.html" ]; then
    echo "✅ Build exitoso (estructura clásica)!"
    
    # Crear archivo 404.html para GitHub Pages
    echo "📄 Creando 404.html..."
    cp dist/frontend/index.html dist/frontend/404.html
    
    echo "📊 Archivos generados:"
    ls -la dist/frontend/
    
    echo "🎉 ¡Listo para deploy!"
    echo "📍 Los archivos están en: frontend/dist/frontend/"
    
else
    echo "❌ Error en el build. Revisa los errores arriba."
    echo "📁 Estructura encontrada:"
    find dist -name "*.html" -type f || echo "No se encontraron archivos HTML"
    exit 1
fi