# Práctica: despliegue manual en GitHub Pages

## Objetivo

Preparar una aplicación web estática y publicarla en GitHub Pages configurando manualmente el origen de publicación desde la interfaz de GitHub.

Como aplicación de prueba se ha desarrollado **Lemon Orbit**: un fondo espacial interactivo con un cohete que se controla mediante el ratón, el dedo, las flechas del teclado o WASD. Mantener pulsado el ratón o la barra espaciadora permite acelerar mientras se mueve.

## 1. Preparación del proyecto

Se ha creado la aplicación con HTML, CSS y JavaScript, sin frameworks ni dependencias externas:

| Archivo | Función |
| --- | --- |
| `index.html` | Documento de entrada y elemento `canvas` donde se dibuja la escena. |
| `styles.css` | Estilos para mostrar la escena a pantalla completa. |
| `script.js` | Dibujo, animación y controles del cohete. |
| `.nojekyll` | Archivo vacío que desactiva el procesamiento de Jekyll en la publicación desde una rama. |

Los enlaces al CSS y al JavaScript utilizan rutas relativas (`./styles.css` y `./script.js`). Esto permite que los recursos se carguen cuando la aplicación se publica bajo la ruta del repositorio en GitHub Pages.

## 2. Archivos que se publican

En este proyecto, los archivos de desarrollo ya son los archivos estáticos que necesita el navegador. Por ello, no se requiere instalar paquetes, ejecutar un build ni generar una carpeta `dist`.

Se mantienen el HTML, el CSS y el JavaScript legibles, sin minificación, para facilitar la revisión de la práctica. La minificación es una optimización opcional y no es necesaria para este despliegue.

## 3. Comprobaciones realizadas antes del despliegue

Durante la preparación se han realizado las siguientes comprobaciones:

- Verificación de las referencias a los recursos locales del HTML.
- Comprobación de la sintaxis de JavaScript con `node --check`.
- Comprobaciones de la lógica de renderizado, movimiento con teclado y puntero, aceleración y reinicio de controles al perder el foco mediante un entorno simulado.

La aplicación también se puede abrir directamente desde `index.html` para revisar su aspecto y probar los controles en el navegador. Node.js se ha utilizado como herramienta de comprobación; no es una dependencia necesaria para ejecutar o publicar la aplicación.

## 4. Procedimiento de despliegue manual

Los siguientes pasos describen el procedimiento de publicación. Su ejecución y la comprobación de la URL pública quedan pendientes de realizar en GitHub.

1. Subir los archivos del proyecto al repositorio de GitHub en la rama `main`, incluyendo el archivo `.nojekyll`.
2. Acceder al repositorio y abrir **Settings → Pages**.
3. En **Build and deployment**, seleccionar **Deploy from a branch** como **Source**.
4. Seleccionar la rama **main** y la carpeta **/ (root)** como origen de publicación.
5. Pulsar **Save** para guardar la configuración.
6. Esperar a que GitHub complete la publicación. El estado se puede consultar en **Actions** y la dirección del sitio en **Settings → Pages**.
7. Abrir la URL pública y comprobar que se muestra la escena, se cargan los recursos y funcionan los controles del cohete.

La configuración del origen de publicación se realiza manualmente. GitHub ejecuta después su proceso de publicación; para esta práctica no se ha creado un workflow propio de GitHub Actions.

## 5. Resultado esperado

Con el nombre actual del repositorio y sin configurar un dominio personalizado, la dirección esperada es:

[https://jcmiriam-front-lemoncode-xviii-labs.github.io/module-8_cloud-manual-deploy/](https://jcmiriam-front-lemoncode-xviii-labs.github.io/module-8_cloud-manual-deploy/)

Esta dirección es la URL prevista, no una confirmación de que el sitio ya esté publicado. La validación final consiste en acceder a ella después del despliegue y repetir las comprobaciones de la aplicación en el entorno público.

Una vez configurado GitHub Pages, los cambios que se suban a la rama `main` volverán a publicarse desde el mismo origen.

## Referencias

- [Crear un sitio de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).
- [Configurar el origen de publicación](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
