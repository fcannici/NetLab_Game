# N.E.X.U.S. Net-Lab Simulator (CCNA 200-301 Edition)

Un simulador interactivo y pedagógico de redes y hardware de centros de datos (Data Center Sandbox & Network Operations Center) programado en HTML5, CSS3 puro y JavaScript Vainilla. Diseñado bajo la arquitectura y protocolos de alta eficiencia de **N.E.X.U.S.** para preparar ingenieros rumbo a la certificación oficial **Cisco CCNA 200-301**.

---

## 🚀 ¿Qué es N.E.X.U.S. Net-Lab?
Net-Lab combina la experiencia táctil del montaje físico de hardware en rack con la resolución de tickets reales de soporte e ingeniería en un NOC (Network Operations Center). Permite comprender de raíz tanto la Capa 1 física (cableado, patch panels, fuentes redundantes) como las capas lógicas superiores (conmutación, enrutamiento, seguridad y automatización).

---

## 🛠️ Características Principales

### 1. Motor de Físicas y Sandbox de Hardware (Capa 1)
- **Topología Drag & Drop Precisa:** Montaje de equipamiento (Routers, Switches L2/L3, Firewalls, Access Points, Laptops) en ranuras matemáticas exactas (U-slots) de un Rack estándar de 19 pulgadas (42U).
- **Física de Cableado Bézier:** Simulación dinámica de curvatura y gravedad para cables de cobre UTP (Cat6/Cat6A) y alimentación (PWR), conectando dinámicamente puerto a puerto con detección de alineación.
- **Gestión Avanzada de Enlaces:** Reconexión en caliente y recolección de basura automática (Garbage Collection): al retirar un equipo, los cables asociados se desvinculan y los LEDs se actualizan.
- **Tráfico y Telemetría en Tiempo Real:** LEDs arrítmicos de actividad física y pulsos láser para visualizar el tránsito de paquetes sobre los enlaces activos.

### 2. Emulador CLI Cisco IOS & Terminal de Diagnóstico
- Doble clic sobre cualquier dispositivo para abrir la terminal interactiva.
- Soporte para modos de ejecución (Usuario `>`, Privilegiado `#`, Configuración Global `(config)#`, Interfaces y Router OSPF).
- Comandos soportados: `enable`, `configure terminal`, `show mac address-table`, `show cdp neighbors`, `show ip route`, `show ssh`, `copy run tftp`, `ping`, `traceroute`, `nslookup`, etc.

### 3. Sistema Pedagógico de Tickets NOC (CCNA 200-301 Completo)
- **48 Misiones Oficiales** cubriendo el 100% de los dominios del examen:
  - **Fase 0:** Preparación Física de Data Center y Modelos de Referencia (OSI 7 Capas vs TCP/IP).
  - **Dominio 1:** Fundamentos de Red (Topologías de Campus, IPv4/IPv6, TCP 3-Way Handshake, SSHv2, CDP/LLDP, MAC, FTP/TFTP).
  - **Dominio 2:** Acceso a la Red (VLANs, Troncales 802.1Q, RSTP 802.1w, EtherChannel LACP, WLC y Router-on-a-Stick).
  - **Dominio 3:** Conectividad IP (Tablas de Rutas, Rutas Estáticas Flotantes, OSPFv2 Single Area, FHRP/HSRP, DHCP Server en IOS).
  - **Dominio 4:** Servicios IP (NAT/PAT Overload, NTP, Syslog/SNMP, QoS, DHCP Relay e infraestructura DNS/HTTPS).
  - **Dominio 5:** Seguridad Perimetral (AAA/RADIUS, ACLs Estándar y Extendidas, DAI, WPA3, Hardening y Banner MOTD).
  - **Dominio 6:** Automatización y Programabilidad (SDN, APIs REST, JSON, Ansible/Puppet y Diagnóstico Operativo).

### 4. Interfaz HUD & Base de Conocimiento Modular
- **HUD Compacto:** Visualización clara de misión activa y lista de chequeo de tareas sin obstruir el bastidor de trabajo.
- **Modal de Ticket NOC:** Apertura overlay de la orden de trabajo con estructura pedagógica estricta:
  - **¿Qué hacemos?:** Objetivo operacional.
  - **¿Por qué lo hacemos?:** Justificación arquitectónica real en entornos corporativos.
  - **¿Para qué sirve?:** Explicación comando por comando.
  - **Beneficios:** Impacto en estabilidad, disponibilidad y seguridad.
- **Base de Conocimiento Técnica:** Modal independiente con teoría profunda, RFCs y consideraciones de examen.
- **Glosario Interactivo:** Más de 140 términos técnicos destacados en tiempo real (`VLAN`, `OSPF`, `STP`, `NAT`, `SSH`, etc.). Al hacer clic sobre cualquier concepto, despliega una ventana flotante instantánea con la definición y enlaces a documentación oficial.

---

## 📖 Cómo Usar el Simulador

1. **Abrir el simulador:**
   Basta con abrir el archivo `index.html` en cualquier navegador web moderno (Google Chrome, Mozilla Firefox, Microsoft Edge, Brave). No requiere backend ni dependencias externas (`Zero Dependencies`).
2. **Revisar el Ticket Actual:**
   Haz clic en el botón azul `[📋 VER TICKET]` del panel superior para leer la misión, los requerimientos y los comandos necesarios.
3. **Consultar la Base de Conocimiento:**
   Haz clic en el botón verde `[📘 BASE CONOCIMIENTO]` para estudiar los fundamentos teóricos y hacer clic en los términos técnicos del glosario interactivo.
4. **Ejecutar la Solución:**
   - Para misiones físicas: Arrastra el equipamiento desde el inventario al Rack y conéctalo con el cable correspondiente.
   - Para misiones lógicas: Haz doble clic en el dispositivo correspondiente para abrir la consola Cisco IOS e introduce los comandos requeridos.
5. **Avanzar de Misión:**
   El motor valida automáticamente la configuración y avanzará al siguiente ticket tras completar los objetivos. También dispones de los controles `PREV` y `SKIP` para navegación libre o depuración.

---

## 📂 Estructura del Repositorio
```
NetLab_Game/
├── index.html           # Estructura principal, HUD y modales interactivos
├── README.md            # Documentación del proyecto
├── .gitignore           # Exclusiones de control de versiones
├── css/
│   └── style.css        # Estilos, maquetación de rack, cables y animaciones
├── js/
│   ├── game.js          # Motor de física, DND, gestión de puertos y cables
│   ├── cli.js           # Emulador de consola interactiva Cisco IOS
│   └── tickets.js       # Array de misiones CCNA, evaluación y glosario
└── img/
    └── laptop.svg       # Arte vectorial de dispositivos cliente
```

---

*Desarrollado bajo el protocolo N.E.X.U.S.*
