# N.E.X.U.S. Net-Lab Simulator (Fortinet Edition)

Un simulador visual avanzado de hardware de red (Data Center Sandbox) programado en HTML5, CSS3 puro y JavaScript Vainilla, diseñado bajo los protocolos estéticos y de alta eficiencia de J.A.R.V.I.S.

## Características Principales (Motor de Físicas y Hardware)
- **Topología Drag & Drop Absoluta:** Motor gravitatorio personalizado para insertar hardware (Firewalls, Switches, Gateways) en ranuras (U-slots) matemáticas precisas de un Rack 42U.
- **Física de Cableado Bézier:** Algoritmo matemático para simular la curvatura real (sag/gravedad) del cableado UTP y Fibra Óptica, calculando el peso en el eje Y en tiempo real, conectando dinámicamente puerto a puerto.
- **Gestión Avanzada de Enlaces:**
  - **Re-conexión dinámica:** Permite arrancar la punta de un cable de un puerto y moverla en tiempo real sin cortar el enlace del origen (Drag point).
  - **Auto-corte (Garbage Collection):** Si se elimina un equipo o un rack, todos los cables vinculados se desvanecen automáticamente y los puertos afectados apagan sus LEDs.
- **Tráfico de Red Simulado:**
  - **LEDs de Actividad:** Animación asimétrica y arrítmica de LEDs de estado (Verde) en los puertos conectados.
  - **Transferencia de Paquetes:** Overlay láser blanco intermitente sobre los cables que visualiza el flujo de datos.
- **Doble Interfaz de Consola (CLI Híbrida):** Emulador de terminal tipo Cisco/FortiOS al hacer doble clic sobre un dispositivo.

## Stack Tecnológico
- Núcleo Visual: `index.html` (DOM/SVG Híbrido)
- Estilos: `style.css` (Motor de Gradientes y Animaciones CSS3)
- Lógica Gravitacional y DND: `game.js`
- Lógica de Emulación de SO: `cli.js`

## Fases del Proyecto
1. [x] **Motor Visual Básico y Sandbox Drag & Drop.**
2. [x] **Motor Gravitacional de Cables y DND Absoluto en Rack.**
3. [ ] **Gestor de Misiones / Tickets CCNA (Próxima Fase).**

*Autor: J.A.R.V.I.S. / N.E.X.U.S. Protocol*
