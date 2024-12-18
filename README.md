# Proyecto nuevo de Quasar Framework

<br>

## Guía de instalación y uso para desarrollo

Este documento proporciona instrucciones detalladas para configurar y ejecutar el proyecto en tu entorno local. Asegúrate de seguir estos pasos cuidadosamente para garantizar una instalación exitosa.

<br>

## Detalles del proyecto

Es un proyecto nuevo de [Quasar Framework](https://quasar.dev/) el cual se puede utilizar en un contenedor de Docker previamente ya configurado.

<br>

## Índice

1. [Instalación y uso con NodeJS](#Instalación-y-uso-con-NodeJS)
2. [Instalacion y uso con Docker](#Instalación-y-uso-con-Docker)

<br>

## Instalación y uso con NodeJS

### Requisitos previos

- [NodeJS](https://nodejs.org/) 20.x lts, puedes consultar la versión que tienes instalada con el comando `node -v`.
- Puertos disponibles:
  - **9000**: Puerto para servir la aplicación.
  - **9001**: Puerto para el HMR (Hot Module Replacement).

### Pasos para la instalación

1. Clona el repositorio en tu máquina local.

```bash
git clone <URL_DEL_REPOSITORIO>
```

2. Accede al directorio del proyecto.

```bash
cd <NOMBRE_DEL_PROYECTO>
```

3. Realiza una copia del archivo `.env.example` con el nombre `.env`.

4. Instala las dependencias del proyecto.

```bash
npm install
```

5. Inicia el servidor de desarrollo.

```bash
quasar dev
```

6. Ahora tu app está activa en el puerto especificado en el archivo `.env` en la variable `DEV_APP_HOST_PORT` (por defecto es `9000`), ejemplo `http://localhost:9000`.

<br>
<br>

## Instalación y uso con Docker

### Requisitos previos

- Sistema operativo: MacOS o alguna distribución basada en Linux.
- [Docker](https://www.docker.com/)
- Puertos disponibles:
  - **9000**: Puerto para servir la aplicación.
  - **9001**: Puerto para el HMR (Hot Module Replacement).

### Pasos para la instalación

1. Clona el repositorio en tu máquina local.

```bash
git clone <URL_DEL_REPOSITORIO>
```

2. Accede al directorio del proyecto.

```bash
cd <NOMBRE_DEL_PROYECTO>
```

3. Realiza una copia del archivo `.env.example` con el nombre `.env` y modifica las siguientes variables (Si es necesario):

- **DOCKER_APP_NAME**: Nombre del contenedor de Docker. (Obligatorio)
- **DOCKER_APP_HOST_PORT**: Puerto para servir la aplicación. (Opcional)

4. Construye la imagen de Docker.

```bash
docker compose build
```

5. Inicia el contenedor de Docker.

```bash
docker compose up -d
```

6. Instala las dependencias del proyecto.

```bash
docker compose exec -u devuser app npm install
```

8. Reinicia el contenedor
```bash
docker compose restart
```

9. Ahora tu app está activa en el puerto especificado en el archivo `.env` en la variable `APP_HOST_PORT` (por defecto es `9000`), ejemplo `http://localhost:9000`.

10. En caso de que quieras detener el contenedor de Docker.

```bash
docker compose down
```
