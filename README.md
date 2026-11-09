# Cimentar México — paquete inicial

**Lema:** Pon tu primera piedra.

## Archivos
- `index.html`: estructura y contenido.
- `styles.css`: identidad visual y diseño adaptable.
- `app.js`: navegación móvil, dado cívico, compromisos, guardado local y compartir.
- `README.md`: estas instrucciones.

## Publicar en GitHub Pages
1. Descarga y descomprime `Cimentar_Mexico_v2.zip`.
2. Abre tu repositorio de GitHub.
3. Sube los cuatro archivos a la raíz del repositorio (donde actualmente está el `index.html`).
4. Si GitHub pregunta si deseas reemplazar archivos existentes, confirma después de conservar una copia del proyecto anterior.
5. En Settings → Pages, confirma que la fuente sea `Deploy from a branch`, rama `main` y carpeta `/ (root)`.
6. Guarda y espera a que termine la publicación.
7. Abre el sitio y recarga con Ctrl+F5 (o prueba en una ventana privada).

## Pruebas recomendadas
- Navegación del menú en computadora y celular.
- Botón “Dame una acción” y “Compartir esta acción”.
- Seleccionar compromisos, recargar y comprobar que sigan seleccionados.
- Compartir compromisos y borrar selecciones.
- Compartir el sitio y copiar el enlace.
- Revisar que no aparezcan errores en la consola del navegador.

## Datos y privacidad
Los compromisos se guardan en `localStorage` del navegador del visitante. No se envían a un servidor ni se sincronizan entre dispositivos. Si el visitante borra los datos del navegador, esos compromisos se pierden.

El botón de compartir usa WhatsApp Web/app cuando está disponible. El botón de compartir el sitio utiliza el menú nativo del dispositivo si el navegador lo admite.

## Personalización pendiente antes de una difusión pública
- Si se desea invitar a un grupo de WhatsApp, agregar un enlace de invitación real y autorizado. No se ha inventado uno.
- Revisar el texto institucional, responsables editoriales y canales de contacto si la iniciativa decide publicarlos.
- Incorporar fuentes y enlaces oficiales locales cuando se desarrollen fichas específicas por estado o municipio.

## Alcance
Esta es una primera versión completa y autónoma del sitio estático. No incluye registro de usuarios, base de datos, envío de formularios, publicación de propuestas ni panel administrativo. Esas funciones requieren definir privacidad, moderación y una infraestructura adicional.
