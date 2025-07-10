Write-Host "Parando y eliminando contenedores..."
docker compose down --volumes --remove-orphans

Write-Host "Borrando imagenes relacionadas..."
docker image prune -af

Write-Host "Borrando volumenes sin uso..."
docker volume prune -f

Write-Host "Reconstruyendo todo desde cero (sin cache)..."
docker compose build --no-cache

Write-Host "Entorno reconstruido desde cero con exito"
docker compose up -d