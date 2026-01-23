# 📖 Diccionario Maestro para el Software Engineer (Ore Pizzeria)

¡Esta es tu enciclopedia técnica! Como estudiante de primer año, estos términos te llevarán de "hacer código" a "construir sistemas profesionales".

---

## 🏛️ 1. Arquitectura y Diseño de Software

*Cómo se organiza la estructura de un edificio digital.*

- **Interfaz (Interface/UI):** El punto de contacto. En software, es lo que permite que una persona o sistema se comunique con otro (ej: botones en pantalla o puertos en código).
- **Framework:** Un conjunto de herramientas y "esqueleto" de código que te obliga a trabajar de forma ordenada (ej: React, Next.js).
- **Modularidad:** Dividir el código en piezas pequeñas e independientes (módulos). Si una pieza se rompe, el resto sigue funcionando.
- **Patrón MVC (Modelo-Vista-Controlador):** Una forma clásica de organizar apps:
  - **Modelo:** Los datos (la base de datos).
  - **Vista:** Lo que el usuario ve (la interfaz).
  - **Controlador:** El intermediario que decide qué mostrar según lo que el usuario pida.
- **Clean Architecture (Arquitectura Limpia):** Una filosofía que dice que el código debe estar separado por **Capas**. La lógica de tu negocio debe estar en el centro y no depender de si usas una base de datos u otra.
- **Código Entendible (Clean Code):** Escribir código que parezca literatura. Que cualquier otra persona (o tú en 6 meses) lo lea y entienda qué hace sin esfuerzo.

---

## � 2. Bases de Datos (El Almacén)

*Fundamentos para guardar información de forma profesional.*

- **Bases de Datos Relacionales (SQL):** Datos organizados en tablas conectadas entre sí (ej: una tabla de `Pedidos` se "relaciona" con una de `Clientes`).
- **Diagramas ER (Entidad-Relación):** El "plano" de tu base de datos antes de crearla. Muestra cómo se conectan las tablas.
- **Normalizar Relaciones:** El arte de organizar las tablas para no repetir datos innecesariamente y evitar errores.
- **ACID:** Las 4 reglas de oro para que una base de datos sea confiable:
  - **Atomicidad:** O se hace todo el cambio o no se hace nada.
  - **Consistencia:** Los datos siempre deben ser válidos.
  - **Aislamiento:** Un cambio no debe estorbar a otro.
  - **Durabilidad:** Una vez guardado, el dato no se pierde aunque se apague el servidor.
- **Query (Consulta):** La orden o pregunta que le haces a la base de datos (ej: "Tráeme todas las pizzas vendidas hoy").

---

## 🌐 3. APIs y Comunicación

*Cómo hablan los sistemas entre sí.*

- **Consumir APIs:** Cuando tu app le pide datos a otro servicio (ej: pedir el clima a Google).
- **Restful APIs (REST):** Un estilo estándar de crear APIs que usa el protocolo HTTP de forma simple y predecible.
- **Protocolo HTTP/HTTPS:** Las reglas de envío de datos. HTTPS es la versión segura (la "S" es de *Secure*).

---

## ☁️ 4. Infraestructura e "IAAS / PAAS / SAAS"

*¿Dónde y cómo corre tu software?*

- **Servidor:** Una computadora potente encendida 24/7 conectada a internet. Existen varios tipos:
  - **Web Server:** Despacha páginas web.
  - **Database Server:** Solo guarda datos.
- **IaaS (Infrastructure as a Service):** Te alquilan el "hardware" virtual (ej: AWS EC2). Tú instalas todo.
- **PaaS (Platform as a Service):** Te dan la plataforma lista (ej: **Vercel**, **Railway**). Tú solo subes el código.
- **SaaS (Software as a Service):** Usas el software terminado (ej: **Supabase**, Gmail).
- **Dominio Seguro & Certificados (SSL/TLS):** El "candado" verde. El certificado asegura que la conexión entre el usuario y tu servidor es privada.
- **VPS (Virtual Private Server):** Tu propia "parcela" de servidor privada.
- **SSH:** La forma segura de entrar a tu servidor desde tu computadora mediante la terminal (línea de comandos). Es como un túnel privado.

---

## 🚀 5. DevOps y "Llevar a Producción"

*El camino del código hasta el usuario real.*

- **Entorno Productivo (Producción):** Donde vive la app real que usan los clientes. Es el escenario final.
- **Despliegue (Deployment):** El proceso de enviar tu código al entorno de producción.
- **Escalar (Scaling):** Hacer que tu app soporte más usuarios. Puede ser hacia arriba (más potencia) o hacia los lados (más servidores).
- **Load Balancer (Balanceador de Carga):** Un "tráfico" que reparte a los usuarios entre varios servidores para que ninguno se sature.
- **Colas de Trabajo (Queues):** Tareas que se hacen "en segundo plano" para no trabar la app (ej: enviar 100 emails de una vez).
- **Backups:** Copias de seguridad automáticas para no perder nada si el servidor falla.
- **Logs:** El "diario de vida" del servidor. Registra todo lo que pasa para que puedas investigar si algo falla.

---

## 🔐 6. Seguridad y Gestión

- **Autenticación (AuthN) vs Autorización (AuthZ):**
  - **AuthN:** ¿Quién eres? (Login).
  - **AuthZ:** ¿Qué puedes hacer? (Permisos).
- **Lista de Permisos (ACL):** Una lista detallada de qué puede hacer cada rol (ej: "Cajero - Borrar Pedido: NO").

---

## �️ 7. Control de Versiones (Git)

- **Git:** Tu máquina del tiempo para el código.
- **Push:** Subir tus cambios.
- **Pull:** Bajar cambios ajenos.
- **Ticket:** Una ficha que describe un error a corregir o una función a crear. Se gestionan en herramientas como **Plane** o Jira.

---

## 📈 8. Conceptos de Negocio

- **MVP (Minimum Viable Product):** Lo mínimo que puedes lanzar para que sea útil.
- **Términos y Condiciones:** El contrato legal de tu aplicación.

---

### 💡 Un consejo final

No te agobies. En primer año, enfócate en entender **Bases de Datos Relacionales**, **APIs** y **Git**. El resto (Escalar, Load Balancers, etc.) vendrá cuando tus aplicaciones tengan miles de usuarios. ¡Vas por muy buen camino!
