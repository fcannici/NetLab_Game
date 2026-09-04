const tickets = [
    // ==========================================
    // FASE 0: PREPARACIÓN DEL DATA CENTER (SANDBOX FÍSICO)
    // ==========================================
    {
        id: '0.1',
        tier: 'FASE 0: INGENIERÍA FÍSICA',
        title: 'Montaje de Hardware Base en Bastidor 19\"',
        desc: '<b>Objetivo:</b> Instalar mecánicamente el equipamiento central de conmutación y enrutamiento en el bastidor de rack.<br><br><b>¿Por qué lo hacemos?:</b> En un centro de datos empresarial, el hardware no puede dejarse sobre superficies improvisadas. Se exige montarlo en racks normalizados de 19 pulgadas para asegurar fijación anti-sismos, canalización ordenada de cableado estructurado y circulación de aire frío de adelante hacia atrás (pasillo frío / pasillo caliente).<br><br><b>¿Para qué sirve?:</b> Permite que los equipos compartan masa eléctrica común a tierra y queden listos para recibir enlaces de fibra y cobre sin tensión mecánica.<br><br><b>Beneficios:</b> Reduce drásticamente fallas por recalentamiento, evita desconexiones accidentales y cumple normativas TIA-942 de disponibilidad.<br><br><b>Instrucción:</b> Arrastra un <b>Switch</b> y un <b>Gateway / Router</b> desde el inventario y colócalos sobre los rieles del <b>Rack</b>.',
        theory: '<b>📘 Fundamentos de <span class=\"concept\" data-term=\"capa1\">Capa 1</span>: El Bastidor Estándar</b><br><br>• <b>Medida U (Rack Unit):</b> 1U equivale exactamente a 1.75 pulgadas (44.45 mm). Los switches de acceso típicos ocupan 1U; los routers de agregación modulares pueden ocupar de 2U a 7U.<br>• <b>Conmutador (Switch de <span class=\"concept\" data-term=\"capa2\">Capa 2</span>):</b> Concentra las conexiones de red local de múltiples dispositivos finales conmutando tramas Ethernet a velocidad de cable (wire-speed) mediante hardware ASIC.<br>• <b>Router / Gateway (<span class=\"concept\" data-term=\"capa3\">Capa 3</span>):</b> Conecta redes lógicas distintas, evalúa métricas en su tabla de rutas y reenvía paquetes hacia la <span class=\"concept\" data-term=\"wan\">WAN</span> o nube.<br>• <b>Flujo Térmico:</b> La refrigeración correcta toma aire a 18-24 °C por el frente y expulsa aire caliente por la parte posterior.',
        tasks: [ { id: 't1', text: 'Montar un Switch y un Gateway en el Rack', done: false } ],
        check: function() {
            let sw = false, gw = false;
            document.querySelectorAll('.placed-item').forEach(el => {
                const label = el.querySelector('.hw-label') ? el.querySelector('.hw-label').innerText.toUpperCase() : '';
                if (label.includes('SWITCH')) sw = true;
                if (label.includes('GATEWAY') || label.includes('ROUTER') || label.includes('FIREWALL')) gw = true;
            });
            if(sw && gw) { this.tasks[0].done = true; return true; }
            return false;
        }
    },
    {
        id: '0.2',
        tier: 'FASE 0: INGENIERÍA FÍSICA',
        title: 'Energización y Circuitos de Alimentación Redundante',
        desc: '<b>Objetivo:</b> Proveer suministro eléctrico continuo a las fuentes de alimentación del hardware.<br><br><b>¿Por qué lo hacemos?:</b> Los microprocesadores, memorias TCAM y puertos ópticos/metálicos no pueden operar sin energía estabilizada. Los cortes imprevistos corrompen la memoria flash y los archivos de configuración en ejecución.<br><br><b>¿Para qué sirve?:</b> Entrega corriente alterna (110V/220V) desde la regleta industrial (PDU) a las fuentes internas conmutadas que transforman la tensión a voltajes continuos (12V, 5V, 3.3V) requeridos por la placa madre.<br><br><b>Beneficios:</b> Garantiza la disponibilidad continua (objetivo de 99.999% de uptime) y previene reinicios intempestivos de la red troncal.<br><br><b>Instrucción:</b> Selecciona el cable <b>Negro (Poder)</b>. Conecta el puerto <b>PWR</b> del Switch a la PDU y repite para el Gateway.',
        theory: '<b>📘 Distribución de Energía y Tolerancia a Fallos en Data Centers</b><br><br>• <b>PDU (Power Distribution Unit):</b> Regleta con protección contra sobretensiones y monitoreo de amperaje por boca.<br>• <b>Alimentación Redundante (Circuito A + Circuito B):</b> Los conmutadores y routers de misión crítica integran dos fuentes (PSU1 y PSU2). En data centers de nivel Tier III/IV, cada fuente se conecta a transformadores, sistemas UPS y grupos generadores diésel completamente independientes.<br>• <b>Conectores IEC C13/C14:</b> Diseñados con trabas mecánicas para impedir que un tirón accidental desenchufe un equipo en producción.',
        tasks: [ { id: 't1', text: 'Encender Switch y Gateway (Luces Verdes)', done: false } ],
        check: function() {
            let sw = false, gw = false;
            document.querySelectorAll('.placed-item.powered-on').forEach(el => {
                const label = el.querySelector('.hw-label') ? el.querySelector('.hw-label').innerText.toUpperCase() : '';
                if (label.includes('SWITCH')) sw = true;
                if (label.includes('GATEWAY') || label.includes('ROUTER') || label.includes('FIREWALL')) gw = true;
            });
            if(sw && gw) { this.tasks[0].done = true; return true; }
            return false;
        }
    },
    {
        id: '0.3',
        tier: 'FASE 0: INGENIERÍA FÍSICA',
        title: 'Interconexión de Capa 1: Enlace Troncal Físico (Uplink UTP)',
        desc: '<b>Objetivo:</b> Tender el cable de par trenzado para comunicar los puertos de datos del Switch con el Gateway.<br><br><b>¿Por qué lo hacemos?:</b> El conmutador concentra el tráfico de los usuarios finales en la LAN, pero carece de salida hacia el exterior sin un medio físico conductor que lo conecte a la interfaz de Capa 3 del router.<br><br><b>¿Para qué sirve?:</b> Permite que los impulsos eléctricos que codifican los bits de datos viajen físicamente entre la interfaz de conmutación y la interfaz de enrutamiento.<br><br><b>Beneficios:</b> Establece el canal troncal (Uplink) de alta velocidad a través del cual fluirán todas las sesiones web, DNS y de correo de la organización hacia Internet.<br><br><b>Instrucción:</b> Selecciona el cable <b>Azul (UTP)</b>. Conecta un puerto de datos del Switch a un puerto de datos del Gateway.',
        theory: '<b>📘 Cableado Estructurado y Señalización Eléctrica</b><br><br>• <b><span class="concept" data-term="utp">Cable UTP (Par Trenzado No Blindado):</span></b> Contiene 8 conductores de cobre macizo entrelazados de a pares. Cada par tiene una cantidad distinta de vueltas por pulgada para que las interferencias electromagnéticas inducidas se cancelen por simetría diferencial.<br>• <b>Categorías:</b> Cat5e (1 Gbps hasta 100m a 100 MHz), Cat6 (1 Gbps a 100m y 10 Gbps hasta 55m a 250 MHz), Cat6A (10 Gbps a 100m a 500 MHz).<br>• <b>Conector <span class="concept" data-term="rj45">RJ45</span> y Norma T568A / T568B:</b> Define el orden exacto de los pines de transmisión (Tx) y recepción (Rx).<br>• <b>Auto-MDIX:</b> Circuito electrónico integrado en los puertos Cisco modernos que detecta automáticamente si el cable conectado es directo o cruzado y conmuta los pines internamente.',
        tasks: [ { id: 't1', text: 'Cablear puerto de datos Switch <-> Gateway', done: false } ],
        check: function() {
            let uplinked = false;
            document.querySelectorAll('.cable-path:not([stroke=\"#222222\"])').forEach(c => {
                if (c.source_port && c.target_port) {
                    let p1_el = c.source_port.closest('.placed-item');
                    let p2_el = c.target_port.closest('.placed-item');
                    if (p1_el && p2_el) {
                        let p1 = p1_el.querySelector('.hw-label') ? p1_el.querySelector('.hw-label').innerText.toUpperCase() : '';
                        let p2 = p2_el.querySelector('.hw-label') ? p2_el.querySelector('.hw-label').innerText.toUpperCase() : '';
                        let hasSwitch = p1.includes('SWITCH') || p2.includes('SWITCH');
                        let hasGateway = p1.includes('GATEWAY') || p2.includes('GATEWAY') || p1.includes('ROUTER') || p2.includes('ROUTER') || p1.includes('FIREWALL') || p2.includes('FIREWALL');
                        if (hasSwitch && hasGateway) {
                            uplinked = true;
                        }
                    }
                }
            });
            if(uplinked) { this.tasks[0].done = true; return true; }
            return false;
        }
    },
    {
        id: '0.4',
        tier: 'FASE 0: MODELOS DE REFERENCIA',
        title: 'Arquitectura del Modelo de Referencia OSI (7 Capas)',
        desc: '<b>Objetivo:</b> Dominar la jerarquía formal de 7 capas del modelo OSI y sus responsabilidades técnicas.<br><br><b>¿Por qué lo hacemos?:</b> En ingeniería de redes, diagnosticar una falla sin un modelo mental estructurado lleva a perder horas cambiando cables cuando el problema es una regla de firewall o viceversa. El modelo OSI permite dividir el problema en capas y aislar la causa raíz con método científico (enfoque bottom-up, top-down o divide-and-conquer).<br><br><b>¿Para qué sirve?:</b> Estandariza la comunicación entre fabricantes distintos; los desarrolladores de aplicaciones no necesitan saber qué marca de tarjeta de red o fibra óptica existe debajo.<br><br><b>Beneficios:</b> Interoperabilidad universal, diseño modular y resolución quirúrgica de incidentes técnicos en producción.<br><br><b>Instrucción:</b> Abre la consola (doble clic en cualquier equipo) y ejecuta <code>acknowledge osi</code>.',
        theory: '<b>📘 El <span class=\"concept\" data-term=\"osi\">Modelo OSI</span> de la ISO (Desglose Exhaustivo de Capas)</b><br><br>• <b><span class=\"concept\" data-term=\"capa1\">Capa 1</span> (Física):</b> Transmisión de bits brutos sobre cables de cobre, luz por fibra óptica o <span class=\"concept\" data-term=\"rf\">radiofrecuencia</span>. Define voltajes, conectores, frecuencias y velocidades de reloj.<br>• <b><span class=\"concept\" data-term=\"capa2\">Capa 2</span> (Enlace de Datos):</b> Empaqueta bits en <b>Tramas (Frames)</b>. Direcciona mediante direcciones físicas <span class=\"concept\" data-term=\"mac\">MAC</span> de 48 bits, controla el acceso al medio (CSMA/CD en Ethernet legado) y detecta errores de transmisión mediante el campo FCS (CRC de 32 bits). Equipos: Switches, Bridges.<br>• <b><span class=\"concept\" data-term=\"capa3\">Capa 3 (Red)</span>:</b> Encapsula tramas en <b>Paquetes</b>. Responsable del direccionamiento lógico universal (IPv4/IPv6) y del enrutamiento óptimo entre redes remotas. Equipos: Routers, Switches Multicapa.<br>• <b>Capa 4 (Transporte):</b> Divide los datos en <b>Segmentos</b> (TCP) o <b>Datagramas</b> (UDP). Administra números de puerto origen y destino (0-65535) para identificar procesos y garantiza control de flujo, multiplexación y retransmisión.<br>• <b>Capa 5 (Sesión):</b> Establece, mantiene, sincroniza y termina las sesiones de diálogo entre aplicaciones cliente-servidor (ej. RPC, NetBIOS).<br>• <b>Capa 6 (Presentación):</b> Traduce formatos de datos (ASCII, Unicode, UTF-8), comprime la información y maneja el cifrado/descifrado criptográfico (TLS/SSL).<br>• <b>Capa 7 (Aplicación):</b> Interfaz directa con los procesos de usuario. Protocolos de servicios: HTTP/HTTPS (Web), DNS (Nombres), <span class=\"concept\" data-term=\"ssh\">SSH</span> (Gestión), SMTP (Correo), <span class=\"concept\" data-term=\"snmp\">SNMP</span> (Monitoreo).',
        tasks: [ { id: 't1', text: 'Comando: acknowledge osi', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('acknowledge osi'); }
    },
    {
        id: '0.5',
        tier: 'FASE 0: MODELOS DE REFERENCIA',
        title: 'Modelo Práctico TCP/IP y Proceso de Encapsulación PDU',
        desc: '<b>Objetivo:</b> Analizar la pila real de Internet (TCP/IP) y el empaquetado progresivo de cabeceras PDU.<br><br><b>¿Por qué lo hacemos?:</b> Aunque OSI es el modelo teórico de estudio, el mundo real funciona 100% sobre la arquitectura TCP/IP (RFC 1122). Comprender qué cabecera se agrega en cada paso es indispensable para capturar tráfico con Wireshark y configurar listas de acceso.<br><br><b>¿Para qué sirve?:</b> Permite que una aplicación envíe un archivo grande cortándolo en pedazos lógicos numerados, añadiendo la IP del destinatario y la MAC del siguiente salto de red.<br><br><b>Beneficios:</b> Transmisión eficiente sobre redes heterogéneas con verificación de integridad paso a paso.<br><br><b>Instrucción:</b> Abre la consola y ejecuta <code>acknowledge tcpip</code>.',
        theory: '<b>📘 Correspondencia TCP/<span class=\"concept\" data-term=\"ip\">IP</span> y Encapsulación PDU (Protocol Data Units)</b><br><br>• <b>Mapeo de Capas:</b><br>  - Capas OSI 7, 6 y 5 -> Capa de Aplicación TCP/IP (Datos).<br>  - Capa OSI 4 -> Capa de Transporte TCP/IP (Segmento con cabecera TCP/UDP).<br>  - Capa OSI 3 -> Capa de Internet TCP/IP (Paquete con cabecera IP).<br>  - Capas OSI 2 y 1 -> Capa de Acceso a la Red TCP/IP (Trama con cabecera Ethernet + bits).<br><br>• <b>Proceso de Encapsulación (Emisor):</b><br>  1. Los <b>Datos</b> del navegador descienden a Transporte.<br>  2. Se agrega la cabecera Capa 4 (puerto destino 443 HTTPS, puerto origen efímero 52140) formando el <b>Segmento</b>.<br>  3. Se agrega la cabecera <span class=\"concept\" data-term=\"capa3\">Capa 3</span> (IP origen 192.168.1.100, IP destino 8.8.8.8) formando el <b>Paquete</b>.<br>  4. Se agrega la cabecera <span class=\"concept\" data-term=\"capa2\">Capa 2</span> (<span class=\"concept\" data-term=\"mac\">MAC</span> origen del PC, MAC destino del Gateway) y el trailer FCS (CRC32) formando la <b>Trama</b>.<br>  5. La placa de red convierte la trama en pulsos de voltaje o fotones sobre el medio.<br><br>• <b>Desencapsulación (Receptor):</b> El switch receptor valida el CRC, quita la cabecera MAC; el router valida la cabecera IP; el servidor procesa el puerto TCP y entrega los datos a la aplicación.',
        tasks: [ { id: 't1', text: 'Comando: acknowledge tcpip', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('acknowledge tcpip'); }
    },

    // ==========================================
    // DOMINIO 1: FUNDAMENTOS DE RED (20%)
    // ==========================================
    {
        id: '1.1',
        tier: 'DOMINIO 1: FUNDAMENTOS',
        title: 'Topologías Físicas y Diseño Jerárquico de Campus Cisco',
        desc: '<b>Objetivo:</b> Asimilar las arquitecturas de red empresariales: Núcleo, Distribución y Acceso.<br><br><b>¿Por qué lo hacemos?:</b> Conectar switches entre sí de forma desordenada en malla plana genera colapsos por tormentas de difusión y cuellos de botella impredecibles. Cisco desarrolló el modelo de 3 capas jerárquicas para aislar fallas, facilitar el crecimiento modular y optimizar el rendimiento.<br><br><b>¿Para qué sirve?:</b> Define la función exacta de cada equipo en la empresa: conmutación de borde para usuarios (Acceso), agregación de rutas y políticas de seguridad (Distribución) y tránsito ultra-veloz de datos (Núcleo / Core).<br><br><b>Beneficios:</b> Escalabilidad limpia sin rediseñar la red al sumar nuevos edificios, facilidad para aplicar QoS y seguridad centralizada.<br><br><b>Instrucción:</b> En la consola ejecuta <code>acknowledge topologies</code>.',
        theory: '<b>📘 Arquitectura Jerárquica de Campus y Datacenter</b><br><br>• <b>Capa de Acceso (Access):</b> Switches donde se conectan los clientes (PCs, laptops, teléfonos VoIP, impresoras, APs). Funciones clave: seguridad de puerto (<span class=\"concept\" data-term=\"port_sec\">Port Security</span>), <span class=\"concept\" data-term=\"vlan\">VLANs</span>, calidad de servicio básica (clasificación/marcado CoS) y <span class=\"concept\" data-term=\"poe\">PoE</span>.<br>• <b>Capa de Distribución (Distribution):</b> Agrega múltiples switches de acceso. Funciones clave: enrutamiento Inter-VLAN de alto desempeño, políticas de control mediante <span class=\"concept\" data-term=\"acl\">ACLs</span>, sumarización de rutas hacia el Core y protocolos de redundancia de primer salto (HSRP/VRRP).<br>• <b>Capa de Núcleo (Core):</b> La autopista principal de alta velocidad. Debe conmutar tráfico a gigabits o terabits por segundo sin aplicar filtros pesados (ACLs o inspección profunda) que provoquen demoras o pérdida de paquetes.<br>• <b>Arquitectura Colapsada (Collapsed Core):</b> Fusión de las capas de Núcleo y Distribución en un solo par de switches multicapa redundantes; solución costo-eficiente estándar para empresas pequeñas y medianas.<br>• <b>Arquitectura <span class=\"concept\" data-term=\"spine_leaf\">Spine-Leaf</span> (Datacenters):</b> Cada conmutador Leaf conecta a todos los Spine; garantiza que cualquier servidor alcance a cualquier otro en exactamente 1 salto (Two-tier flat latency), optimizando el tráfico este-oeste.',
        tasks: [ { id: 't1', text: 'Comando: acknowledge topologies', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('acknowledge topologies'); }
    },
    {
        id: '1.2',
        tier: 'DOMINIO 1: FUNDAMENTOS',
        title: 'Medios de Transmisión (Cobre, Fibra SMF/MMF) y Normas PoE',
        desc: '<b>Objetivo:</b> Comparar el comportamiento de conductores de cobre, fibra óptica monomodo/multimodo y estándares de alimentación remota PoE.<br><br><b>¿Por qué lo hacemos?:</b> Instalar el medio físico equivocado provoca fallas catastróficas: usar cobre más allá de los 100 metros genera atenuación severa, usar fibra multimodo para enlaces interurbanos distorsiona el pulso de luz y no calcular el presupuesto PoE apaga puntos de acceso Wi-Fi 6 en horas pico.<br><br><b>¿Para qué sirve?:</b> Permite al ingeniero seleccionar el cableado y ópticas exactas para cada segmento de la red según distancia, velocidad requerida y ambiente electromagnético.<br><br><b>Beneficios:</b> Cero pérdida de paquetes por atenuación, máxima velocidad de enlace y eliminación de fuentes de alimentación externas para dispositivos remotos.<br><br><b>Instrucción:</b> En la consola ejecuta <code>acknowledge media</code>.',
        theory: '<b>📘 Cobre vs Fibra y Tecnologías Power over Ethernet</b><br><br>• <b>Fibra Monomodo (SMF - Single Mode Fiber):</b> Núcleo microscópico de ~9 micrones por donde viaja un único haz de luz láser coherente (longitudes de onda de 1310 nm o 1550 nm). Atenuación mínima; permite alcances de 10 km hasta 80+ km. Obligatoria para backbones de campus y <span class=\"concept\" data-term=\"wan\">WAN</span>.<br>• <b>Fibra Multimodo (MMF - Multi Mode Fiber):</b> Núcleo ancho de 50 o 62.5 micrones por donde la luz de un LED o VCSEL (850 nm o 1300 nm) rebota en múltiples ángulos. Sufre de dispersión modal que limita su alcance a 300m - 550m. Económica y estándar para salas de servidores locales.<br>• <b>Estándares <span class=\"concept\" data-term=\"poe\">PoE</span> de la IEEE:</b><br>  - <b>802.3af (PoE Tipo 1):</b> Suministra hasta 15.4W en el puerto (12.95W útiles en el dispositivo tras pérdidas en el cable). Ideal para teléfonos <span class=\"concept\" data-term=\"ip\">IP</span> y cámaras fijas.<br>  - <b>802.3at (PoE+ Tipo 2):</b> Suministra hasta 30W (25.5W útiles). Necesario para APs Wi-Fi 5/6 y cámaras de seguridad con zoom motorizado.<br>  - <b>802.3bt (4PPoE / UPOE+):</b> Utiliza los 4 pares de cobre del cable <span class=\"concept\" data-term=\"utp\">UTP</span> simultáneamente para entregar 60W (Tipo 3) y hasta 90W/100W (Tipo 4), energizando computadoras compactas, pantallas y luminarias inteligentes.',
        tasks: [ { id: 't1', text: 'Comando: acknowledge media', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('acknowledge media'); }
    },
    {
        id: '1.3',
        tier: 'DOMINIO 1: FUNDAMENTOS',
        title: 'Capa de Transporte: Negociación TCP (3-Way Handshake) y Flujo UDP',
        desc: '<b>Objetivo:</b> Desglosar minuciosamente el saludo de 3 vías de TCP (SYN, SYN-ACK, ACK) frente a la transmisión sin acuse de recibo de UDP.<br><br><b>¿Por qué lo hacemos?:</b> La Capa 4 define cómo viajan los datos entre programas. Si un ingeniero no comprende los flags de control de TCP ni los números de secuencia y acuse, no puede interpretar capturas de Wireshark ni diagnosticar por qué una aplicación sufre caídas de rendimiento por retransmisiones o saturación de ventana.<br><br><b>¿Para qué sirve?:</b> Permite que la computadora emisora y el servidor acuerden números de secuencia iniciales, sincronicen parámetros de ventana deslizante (Window Size) y garanticen que ningún byte se pierda en el camino.<br><br><b>Beneficios:</b> Conexiones 100% confiables para transferencias críticas (archivos, bases de datos) y velocidad ultra-rápida sin demoras para voz y video en tiempo real.<br><br><b>Instrucción:</b> En la consola ejecuta <code>acknowledge transport</code>.',
        theory: '<b>📘 Anatomía Profunda del Saludo TCP (3-Way Handshake) y UDP</b><br><br>• <b>¿Qué significa exactamente cada flag en el saludo TCP?:</b><br>  1. <b>SYN (Synchronize Sequence Numbers):</b> El cliente envía un segmento con el bit SYN activo y un Número de Secuencia Inicial aleatorio (ej. <code>ISN = 1000</code>). Con esto le dice al servidor: <i>\"Quiero iniciar una conexión confiable contigo; comenzaré a contar mis bytes desde el número 1000\"</i>.<br>  2. <b>SYN-ACK (Synchronize + Acknowledgment):</b> El servidor responde con ambos bits activos. Envía su propio número de secuencia aleatorio (ej. <code>ISN = 5000</code>) para que el cliente cuente los bytes que él enviará (SYN), y confirma la recepción del cliente estableciendo <code>ACK = 1001</code> (el siguiente byte esperado). Con esto dice: <i>\"Recibí tu sincronización 1000, ahora espero el byte 1001; yo comenzaré mis respuestas desde el 5000\"</i>.<br>  3. <b>ACK (Acknowledgment):</b> El cliente responde confirmando con <code>ACK = 5001</code>. En este momento exacto la conexión queda en estado <b>ESTABLISHED</b> y comienza la transmisión de datos reales de la aplicación.<br><br>• <b>Mecanismos de Confiabilidad de TCP:</b><br>  - <b>Ventana Deslizante (Window Size):</b> Control de flujo dinámico. Indica cuántos bytes puede enviar el emisor antes de detenerse a esperar obligatoriamente un ACK del receptor.<br>  - <b>Retransmisión (Timer RTO):</b> Si un segmento no recibe ACK antes de vencer el temporizador, TCP lo reenvía automáticamente.<br>  - <b>Cierre de Conexión (4 Pasos):</b> Emisor envía <code>FIN</code> -> Receptor envía <code>ACK</code> -> Receptor envía su <code>FIN</code> -> Emisor confirma con <code>ACK</code> final.<br><br>• <b>UDP (User Datagram Protocol):</b> Protocolo no orientado a conexión ni con retransmisiones. Cabecera fija de apenas 8 bytes (Puerto Origen, Puerto Destino, Longitud y Checksum) frente a los 20-60 bytes de TCP. Si un paquete se pierde, la aplicación lo descarta. Es el motor de VoIP (SIP/RTP), streaming en vivo, DNS y consultas <span class=\"concept\" data-term=\"dhcp\">DHCP</span>.',
        tasks: [ { id: 't1', text: 'Comando: acknowledge transport', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('acknowledge transport'); }
    },
    {
        id: '1.4',
        tier: 'DOMINIO 1: FUNDAMENTOS',
        title: 'Arquitectura IPv4, Máscaras de Subred y Cálculo de Subnetting VLSM',
        desc: '<b>Objetivo:</b> Dominar la estructura binaria de 32 bits de IPv4, separación de porción de red/host y el cálculo matemático de subredes.<br><br><b>¿Por qué lo hacemos?:</b> Una red sin segmentar es un único y ruidoso dominio de difusión donde cada broadcast interrumpe a todos los procesadores de la empresa. El subnetting permite dividir un bloque de red grande en subredes pequeñas, eficientes y seguras, asignando la cantidad justa de IPs para no agotar el direccionamiento.<br><br><b>¿Para qué sirve?:</b> Permite que los routers evalúen la máscara de subred bit a bit mediante una operación lógica AND binaria para determinar de forma instantánea si el host destino está en la red local o si debe enviarse al Gateway.<br><br><b>Beneficios:</b> Ahorro drástico de direcciones IP públicas y privadas, contención de tormentas de broadcast y aislamiento de departamentos por seguridad.<br><br><b>Instrucción:</b> En la consola ejecuta <code>acknowledge ipv4</code>.',
        theory: '<b>📘 Anatomía de una Dirección IPv4 y Matemáticas de Subredes</b><br><br>• <b>Composición Binaria:</b> Toda dirección IPv4 está formada por exactamente <b>32 bits</b> divididos en 4 octetos (4 grupos de 8 bits) separados por puntos. Ejemplo: <code>192.168.1.10</code> en binario es:<br>  <code>11000000 . 10101000 . 00000001 . 00001010</code>.<br><br>• <b>Porción de Red vs Porción de Host:</b><br>  - Una <span class=\"concept\" data-term=\"ip\">IP</span> no dice nada por sí sola; <b>necesita obligatoriamente una Máscara de Subred</b>.<br>  - Los bits en <b>1</b> de la máscara representan la <b>Red</b> (el vecindario).<br>  - Los bits en <b>0</b> de la máscara representan el <b>Host</b> (el número de casa del usuario).<br>  - Ejemplo: Máscara <code>255.255.255.0</code> equivale a <b>/24</b> (veinticuatro unos seguidos: <code>11111111.11111111.11111111.00000000</code>). Deja 8 bits para hosts.<br><br>• <b>Fórmulas Matemáticas Clave:</b><br>  - Cantidad de subredes creadas al pedir prestados <i>n</i> bits: <b>Subredes = 2^n</b>.<br>  - Cantidad de hosts útiles por subred con <i>h</i> bits restantes: <b>Hosts = (2^h) - 2</b>.<br>  - ¿Por qué se restan 2?: Porque la <b>primera IP</b> (todos los bits de host en 0) es la <i>Dirección de Red</i>, y la <b>última IP</b> (todos los bits de host en 1) es la <i>Dirección de <span class=\"concept\" data-term=\"broadcast\">Broadcast</span></i>.<br><br>• <b>Ejemplo de Cálculo Práctico (Subnetear 192.168.1.0/24 en /26):</b><br>  - Pasamos de /24 a /26: pedimos prestados <b>2 bits</b> (2^2 = <b>4 subredes</b>).<br>  - Quedan <b>6 bits de host</b>: (2^6) - 2 = 64 - 2 = <b>62 hosts útiles</b> por subred.<br>  - Salto de red (Número Mágico): 256 - 192 (valor del último octeto 11000000) = <b>64</b>.<br>  - <b>Subred 1:</b> Red: 192.168.1.0/26 | Hosts útiles: 192.168.1.1 a .62 | Broadcast: 192.168.1.63.<br>  - <b>Subred 2:</b> Red: 192.168.1.64/26 | Hosts útiles: 192.168.1.65 a .126 | Broadcast: 192.168.1.127.<br>  - <b>Subred 3:</b> Red: 192.168.1.128/26 | Hosts útiles: 192.168.1.129 a .190 | Broadcast: 192.168.1.191.<br>  - <b>Subred 4:</b> Red: 192.168.1.192/26 | Hosts útiles: 192.168.1.193 a .254 | Broadcast: 192.168.1.255.<br><br>• <b><span class=\"concept\" data-term=\"vlsm\">VLSM</span> (Variable Length Subnet Masking):</b> Aplicar máscaras de distinto tamaño a la misma red madre. Para enlaces <span class=\"concept\" data-term=\"wan\">WAN</span> punto a punto entre 2 routers se usa prefijo <b>/30</b> (2 hosts útiles) o <b>/31</b> (RFC 3021), ahorrando cientos de direcciones frente a un /24.',
        tasks: [ { id: 't1', text: 'Comando: acknowledge ipv4', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('acknowledge ipv4'); }
    },
    {
        id: '1.5',
        tier: 'DOMINIO 1: FUNDAMENTOS',
        title: 'Asignación de Direccionamiento IPv6 Global Unicast en Interfaces Cisco',
        desc: '<b>Objetivo:</b> Configurar una dirección IPv6 Global Unicast (GUA) en la interfaz lógica del Router/Gateway.<br><br><b>¿Por qué ejecutamos estos comandos?:</b> Las direcciones IPv4 públicas globales se agotaron oficialmente. Las infraestructuras modernas de telecomunicaciones, redes móviles 5G y grandes nubes (AWS, Azure) operan en modo Dual-Stack (IPv4 e IPv6 simultáneamente). Sin una dirección IPv6 configurada en su interfaz, el router no puede enviar paquetes de saludo (Router Advertisements) ni enrutar tráfico de la nueva Internet.<br><br><b>¿Para qué sirve cada comando?:</b><br>1. <code>enable</code>: Escala los privilegios desde el modo usuario básico (<code>></code>) hacia el modo privilegiado (<code>#</code>), permitiendo acceso a comandos administrativos de visualización y configuración profunda.<br>2. <code>configure terminal</code>: Ingresa al modo de configuración global (<code>(config)#</code>), el único nivel donde se pueden modificar parámetros que afectan al sistema operativo del router.<br>3. <code>interface vlan 1</code>: Selecciona la interfaz virtual de administración del equipo para aplicarle configuraciones de Capa 3.<br>4. <code>ipv6 address 2001:db8::1/64</code>: Inyecta una dirección IPv6 Global Unicast con longitud de prefijo estándar /64. El router genera automáticamente en base a esto una dirección complementaria Link-Local (<code>fe80::</code>) para comunicación con sus vecinos directos.<br><br><b>¿Qué beneficios trae?:</b> Espacio de direccionamiento prácticamente infinito (340 sextillones de direcciones), eliminación de la necesidad de NAT, autoconfiguración automática de clientes (SLAAC) y encabezados fijos más rápidos de procesar por el hardware.<br><br><b>Instrucción:</b> En el <b>Router</b> ejecuta los 4 comandos en orden.',
        theory: '<b>📘 Estructura y Formato de Direcciones IPv6</b><br><br>• <b>128 bits expresados en Hexadecimal:</b> Organizados en 8 grupos de 4 dígitos hexadecimales (hextetos) de 16 bits cada uno, separados por dos puntos.<br>  Ejemplo sin abreviar: <code>2001:0db8:0000:0000:0000:0000:0000:0001/64</code>.<br><br>• <b>Reglas Oficiales de Abreviación:</b><br>  1. <b>Supresión de ceros a la izquierda:</b> En cualquier hexteto, los ceros que preceden a otros dígitos se omiten (<code>0db8</code> -> <code>db8</code>; <code>0001</code> -> <code>1</code>; <code>0000</code> -> <code>0</code>).<br>  2. <b>Compresión de ceros consecutivos (::):</b> Una secuencia contigua de uno o más hextetos compuestos exclusivamente por ceros puede reemplazarse por dos puntos dobles (<code>::</code>). <b>Regla estricta:</b> Esta compresión se puede usar <b>UNA SOLA VEZ</b> por dirección, de lo contrario sería matemáticamente imposible deducir cuántos ceros faltan en cada lado.<br>  Resultado comprimido: <code>2001:db8::1/64</code>.<br><br>• <b>Tipos de Direcciones IPv6 Fundamentales:</b><br>  - <b>Global Unicast (2000::/3):</b> Direcciones públicas enrutables en todo el planeta.<br>  - <b>Link-Local (fe80::/10):</b> Direcciones locales de enlace no enrutables. Obligatorias en cada interfaz activa; se utilizan para protocolos de enrutamiento (OSPFv3, EIGRP) y descubrimiento de vecinos (NDP en reemplazo de ARP).<br>  - <b>Unique Local (fc00::/7):</b> Direcciones privadas para comunicación interna en empresas (análogas a RFC 1918 de IPv4).<br>  - <b>Multicast (ff00::/8):</b> Envío a grupos específicos (ej. <code>ff02::1</code> todos los nodos, <code>ff02::2</code> todos los routers). En IPv6 no existe el concepto de <span class=\"concept\" data-term=\"broadcast\">broadcast</span>.',
        tasks: [ { id: 't1', text: 'Comando: ipv6 address 2001:db8::1/64', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('2001:db8::1/64')); }
    },
    {
        id: '1.6',
        tier: 'DOMINIO 1: FUNDAMENTOS',
        title: 'Instalación de Punto de Acceso y Gestión de Frecuencias RF',
        desc: '<b>Objetivo:</b> Integrar un Access Point (AP) y validar la cobertura de radiofrecuencia para estaciones cliente.<br><br><b>¿Por qué lo hacemos?:</b> Los trabajadores corporativos y dispositivos móviles requieren conectividad sin ataduras de cables de cobre. Sin embargo, el espectro radioeléctrico es un medio compartido (Shared Medium) y no guiado; planificar mal las frecuencias provoca colisiones constantes y caídas de rendimiento.<br><br><b>¿Para qué sirve?:</b> Convierte tramas Ethernet 802.3 del cable cableado en tramas inalámbricas 802.11 moduladas sobre ondas electromagnéticas en el aire.<br><br><b>Beneficios:</b> Movilidad total, roaming fluido entre antenas y cobertura uniforme en oficinas y galpones industriales.<br><br><b>Instrucción:</b> Monta el <b>Access Point (WLC)</b> en el Rack. Luego, en la consola del Switch ejecuta <code>acknowledge wireless</code>.',
        theory: '<b>📘 Física de <span class=\"concept\" data-term=\"rf\">Radiofrecuencia</span> (RF) y Estándares IEEE 802.11</b><br><br>• <b>Banda de 2.4 GHz:</b> Mayor propagación física y capacidad para atravesar muros de hormigón. Limitación severa: ancho de banda estrecho y <b>únicamente 3 canales no superpuestos: 1, 6 y 11</b> (con 20 MHz de ancho de canal). Si dos APs adyacentes transmiten en canales que se pisan (ej. canal 1 y canal 2), se produce interferencia co-canal (CCI).<br>• <b>Banda de 5 GHz:</b> Menor alcance y atenuación rápida con obstáculos, pero dispone de 24+ canales no superpuestos que permiten unir canales contiguos (Channel Bonding a 40, 80 o 160 MHz) para alcanzar velocidades de gigabits.<br>• <b>Banda de 6 GHz (Wi-Fi 6E y Wi-Fi 7):</b> Hasta 1200 MHz de espectro totalmente nuevo y limpio, sin presencia de dispositivos legados lentos.<br>• <b>Métricas de Calidad Inalámbrica:</b><br>  - <b>RSSI (Received Signal Strength Indicator):</b> Potencia en dBm (valores entre -30 dBm excelente y -70 dBm límite operativo).<br>  - <b>SNR (Signal-to-Noise Ratio):</b> Margen entre la señal útil y el ruido de fondo (un SNR superior a 25 dB es óptimo para voz).',
        tasks: [ 
            { id: 't1', text: 'Montar un Access Point (WLC) en el Rack', done: false },
            { id: 't2', text: 'Comando: acknowledge wireless', done: false } 
        ],
        check: function() { 
            let ap = false;
            document.querySelectorAll('.hw-item, .placed-item').forEach(el => {
                const label = el.querySelector('.hw-label') ? el.querySelector('.hw-label').innerText.toUpperCase() : '';
                if (label.includes('ACCESS POINT') || el.getAttribute('data-type') === 'ap') ap = true;
            });
            if(ap) { this.tasks[0].done = true; }
            if (window.cmdHistory && window.cmdHistory.some(c => c.includes('acknowledge wireless'))) { this.tasks[1].done = true; }
            return this.tasks[0].done && this.tasks[1].done;
        }
    },
    {
        id: '1.7',
        tier: 'DOMINIO 1: FUNDAMENTOS',
        title: 'Hardening de Dispositivos Cisco: Contraseñas Cifradas en IOS',
        desc: '<b>Objetivo:</b> Proteger el acceso al modo de ejecución privilegiado y encriptar las credenciales en texto claro.<br><br><b>¿Por qué ejecutamos estos comandos?:</b> Un router o conmutador recién sacado de su caja no tiene contraseñas. Cualquier persona que conecte un cable de consola o acceda a la red puede reiniciar el equipo, borrar configuraciones o redirigir el tráfico de la empresa hacia servidores maliciosos.<br><br><b>¿Para qué sirve cada comando?:</b><br>1. <code>enable secret cisco123</code>: Define la contraseña maestra requerida para pasar de modo usuario a modo privilegiado. Utiliza internamente un algoritmo hash criptográfico unidireccional (MD5 / SHA-256) con sal, de modo que la contraseña jamás queda legible en los archivos del sistema.<br>2. <code>service password-encryption</code>: Activa un servicio en segundo plano de Cisco IOS que toma cualquier otra contraseña configurada en texto plano (como las contraseñas de las líneas de consola o terminales virtuales VTY) y las transforma en una cadena hexadecimal cifrada tipo 7.<br><br><b>¿Qué beneficios trae?:</b> Impide que personas que miren la pantalla por encima del hombro (shoulder surfing) o que descarguen respaldos de configuración puedan leer las claves de acceso de los equipos troncales.<br><br><b>Instrucción:</b> En el <b>Switch</b> ingresa a <code>configure terminal</code> y ejecuta ambos comandos.',
        theory: '<b>📘 Seguridad Básica de la Plataforma Cisco IOS</b><br><br>• <b>enable secret vs enable password:</b> El comando legado <code>enable password</code> almacena la clave en texto plano; si ejecutas <code>show running-config</code> la clave se lee directamente. Está totalmente desaconsejado en producción. <code>enable secret</code> tiene precedencia absoluta y guarda un hash seguro.<br>• <b>Limitaciones del Cifrado Tipo 7:</b> Es un cifrado débil de sustitución reversible diseñado únicamente para prevenir la lectura casual de la pantalla. Un atacante con herramientas en línea puede descifrar una clave Tipo 7 en milisegundos. Por ello, para credenciales de usuarios locales se recomienda usar <code>username [usuario] algorithm-type sha256 secret [password]</code>.<br>• <b>Línea de Consola (line con 0):</b> Puerto serie físico en el chasis. Siempre debe configurarse con <code>login</code> y contraseña o vincularse a autenticación AAA centralizada.',
        tasks: [ { id: 't1', text: 'Comandos: enable secret + service password-encryption', done: false } ],
        check: function() { 
            return window.cmdHistory && window.cmdHistory.some(c => c.includes('enable secret')) && window.cmdHistory.some(c => c.includes('service password-encryption')); 
        }
    },
    {
        id: '1.8',
        tier: 'DOMINIO 1: FUNDAMENTOS',
        title: 'Gestión Remota Cifrada: Configuración de SSHv2',
        desc: '<b>Objetivo:</b> Generar pares de claves criptográficas RSA y habilitar el protocolo SSH versión 2 para administración segura.<br><br><b>¿Por qué ejecutamos estos comandos?:</b> Administrar conmutadores y routers mediante el protocolo Telnet es una falla crítica de seguridad: Telnet envía las credenciales y cada comando tipeado en texto completamente claro sobre la red. Cualquier atacante con un analizador de paquetes (como Wireshark) intercepta las claves de administración en segundos.<br><br><b>¿Para qué sirve cada comando?:</b><br>1. <code>ip domain-name lab.local</code>: Define el nombre de dominio corporativo. Cisco IOS lo utiliza como sufijo obligatorio para crear el nombre único del certificado (FQDN del equipo: <code>Switch.lab.local</code>).<br>2. <code>crypto key generate rsa</code>: Invoca el motor criptográfico de hardware para crear un par de claves pública y privada asimétricas de longitud robusta (mínimo 1024 o 2048 bits).<br>3. <code>ip ssh version 2</code>: Fuerza al equipo a utilizar exclusivamente la versión 2 del estándar SSH, bloqueando negociaciones con SSHv1 (el cual posee vulnerabilidades conocidas de inserción de paquetes).<br><br><b>¿Qué beneficios trae?:</b> Canal confidencial y autenticado donde ningún observador en la red puede interceptar ni manipular los comandos que el administrador envía a los equipos.<br><br><b>Instrucción:</b> En el <b>Switch</b> (modo config) ejecuta los tres comandos.',
        theory: '<b>📘 Criptografía Asimétrica y Requisitos de <span class=\"concept\" data-term=\"ssh\">SSH</span> en Cisco</b><br><br>• <b>Mecanismo de Intercambio de Claves:</b> SSH utiliza el algoritmo Diffie-Hellman para negociar una clave secreta simétrica efímera de sesión sobre un canal inseguro. Luego, cifra todo el tráfico con algoritmos robustos como AES-128, AES-256 o ChaCha20.<br>• <b>Prerrequisitos estrictos en Cisco IOS para habilitar SSH:</b><br>  1. Cambiar el nombre de host por defecto (<code>hostname [nombre]</code>; si se llama \"Router\" o \"Switch\" por defecto, RSA fallará).<br>  2. Configurar un nombre de dominio <span class=\"concept\" data-term=\"ip\">IP</span> (<code>ip domain-name [dominio]</code>).<br>  3. Generar el par de claves RSA con al menos 1024 bits (512 bits sólo habilita SSHv1; 1024 o 2048 bits habilita automáticamente SSHv2).<br>  4. Configurar un usuario local con secret (<code>username admin secret cisco123</code>).<br>  5. Entrar a las terminales virtuales (<code>line vty 0 4</code>) y restringir el transporte con <code>transport input ssh</code> y <code>login local</code>.',
        tasks: [ { id: 't1', text: 'Comandos: ip domain-name, crypto key y ip ssh version 2', done: false } ],
        check: function() { 
            return window.cmdHistory && window.cmdHistory.some(c => c.includes('ip domain-name')) && window.cmdHistory.some(c => c.includes('crypto key') || c.includes('ip ssh')); 
        }
    },
    {
        id: '1.9',
        tier: 'DOMINIO 1: FUNDAMENTOS',
        title: 'Mapeo de Topología de Capa 2: Protocolos de Descubrimiento CDP y LLDP',
        desc: '<b>Objetivo:</b> Descubrir equipos vecinos directamente conectados en Capa 2 sin requerir conocer sus direcciones IP de antemano.<br><br><b>¿Por qué ejecutamos este comando?:</b> Cuando un ingeniero llega a una sala de servidores sin documentación, o cuando se sospecha que un cable fue enchufado en el puerto equivocado, no se puede depender de pings (porque las interfaces podrían no tener IP o tener firewalls). Los protocolos de descubrimiento operan directamente sobre la Capa de Enlace.<br><br><b>¿Para qué sirve el comando?:</b><br><code>show cdp neighbors</code>: Consulta la tabla de memoria interna de Cisco Discovery Protocol y muestra un resumen en tiempo real de todos los dispositivos Cisco conectados físicamente al switch.<br><br><b>¿Qué beneficios trae?:</b> Permite documentar la topología física exacta de la red en minutos, verificar qué chasis remoto está enchufado en cada boca física y detectar discrepancias de velocidad o configuración de troncales.<br><br><b>Instrucción:</b> En modo privilegiado (<code>#</code>) del <b>Switch</b> ejecuta <code>show cdp neighbors</code>.',
        theory: '<b>📘 Protocolos de Descubrimiento de <span class=\"concept\" data-term=\"capa2\">Capa 2</span>: CDP vs LLDP</b><br><br>• <b><span class="concept" data-term="cdp">CDP (Cisco Discovery Protocol):</span></b> Protocolo propietario que se ejecuta por defecto en todos los routers, switches y teléfonos <span class=\"concept\" data-term=\"ip\">IP</span> de Cisco. Envía periódicamente tramas multicast a la <span class=\"concept\" data-term=\"mac\">MAC</span> <code>01:00:0C:CC:CC:CC</code> cada 60 segundos con un tiempo de retención (Holdtime) de 180 segundos.<br>• <b><span class="concept" data-term="lldp">LLDP (Link Layer Discovery Protocol - IEEE 802.1AB):</span></b> Estándar abierto multi-proveedor indispensable cuando conviven switches Cisco con servidores Linux, conmutadores HP/Aruba o firewalls Fortinet. En Cisco se activa globalmente con <code>lldp run</code>.<br>• <b>Campos del reporte de vecindad:</b><br>  - <b>Device ID:</b> Nombre de host del equipo vecino.<br>  - <b>Local Interface:</b> El puerto de NUESTRO switch donde está enchufado el cable.<br>  - <b>Capability:</b> Función del vecino (R = Router, S = Switch, H = Host, P = Phone).<br>  - <b>Platform:</b> Modelo de hardware exacto del vecino (ej. WS-C2960-24TT-L).<br>  - <b>Port ID:</b> El puerto del chasis REMOTO donde entra la otra punta del cable.<br>• <b>Consideración de Ciberseguridad:</b> CDP y LLDP anuncian información interna valiosa de la red; deben deshabilitarse en puertos de cara a clientes o Internet con <code>no cdp enable</code> / <code>no lldp transmit</code>.',
        tasks: [ { id: 't1', text: 'Comando: show cdp neighbors (o show lldp)', done: false } ],
        check: function() { 
            return window.cmdHistory && window.cmdHistory.some(c => c.includes('show cdp') || c.includes('sh cdp') || c.includes('show lldp') || c.includes('sh lldp')); 
        }
    },
    {
        id: '1.10',
        tier: 'DOMINIO 1: FUNDAMENTOS',
        title: 'Direccionamiento de Capa 2: Anatomía de la Dirección MAC y Tabla CAM',
        desc: '<b>Objetivo:</b> Inspeccionar la tabla de direcciones MAC (CAM Table) del conmutador y comprender el aprendizaje dinámico de puertos.<br><br><b>¿Por qué ejecutamos este comando?:</b> A diferencia de un HUB ciego del pasado que repetía cualquier señal eléctrica por todas sus bocas inundando la red, un conmutador moderno de Capa 2 es inteligente: aprende qué dispositivo está conectado en cada puerto físico inspeccionando la dirección MAC de origen de cada trama entrante y construye en memoria una tabla de correspondencias puerto-MAC.<br><br><b>¿Para qué sirve el comando?:</b><br><code>show mac address-table</code>: Despliega en pantalla el contenido de la memoria direccionable por contenido (CAM Table), mostrando a qué VLAN y a qué puerto físico está asociada cada tarjeta de red.<br><br><b>¿Qué beneficios trae?:</b> Conmutación punto a punto instantánea a velocidad de hardware sin colisiones, optimización de ancho de banda y diagnóstico de problemas de conectividad física.<br><br><b>Instrucción:</b> En modo privilegiado (<code>#</code>) del <b>Switch</b> ejecuta <code>show mac address-table</code>.',
        theory: '<b>📘 Anatomía de la Dirección <span class=\"concept\" data-term=\"mac\">MAC</span> y la Tabla de Conmutación (CAM)</b><br><br>• <b>Estructura de 48 bits (6 Octetos Hexadecimales):</b><br>  - Ejemplo: <code>00:14:22:34:56:78</code> o en formato Cisco: <code>0014.2234.5678</code>.<br>  - <b>OUI (Organizationally Unique Identifier - Primeros 24 bits / 3 bytes):</b> Asignados por el IEEE para identificar unívocamente al fabricante de la placa de red (ej. Cisco, Intel, Apple).<br>  - <b>NIC Specific / Serial (Últimos 24 bits / 3 bytes):</b> Identificador único asignado por el fabricante a esa placa física específica.<br><br>• <b>El Algoritmo de Aprendizaje y Reenvío de un Switch (3 Pasos):</b><br>  1. <b>Aprender (Learning):</b> Cuando una trama entra por el puerto Fa0/1, el switch lee la <b>Source MAC</b>. Si no está en su tabla, la anota junto al puerto y la <span class=\"concept\" data-term=\"vlan\">VLAN</span> con un temporizador de caducidad (Aging Timer, por defecto 300 segundos).<br>  2. <b>Inundar (Unknown Unicast Flooding):</b> Si la <b>Destination MAC</b> no existe aún en su tabla, el conmutador inunda la trama por <b>todos los puertos de esa VLAN</b> excepto por el que ingresó.<br>  3. <b>Filtrar y Reenviar (Forward / Filter):</b> Cuando la MAC destino ya es conocida en la tabla, el switch conmuta la trama directamente hacia ese puerto exclusivo.',
        tasks: [ { id: 't1', text: 'Comando: show mac address-table', done: false } ],
        check: function() { 
            return window.cmdHistory && window.cmdHistory.some(c => c.includes('show mac') || c.includes('sh mac')); 
        }
    },
    {
        id: '1.11',
        tier: 'DOMINIO 1: FUNDAMENTOS',
        title: 'Transferencia de Archivos en Red: FTP (Confiable) vs TFTP (Ligero)',
        desc: '<b>Objetivo:</b> Ejecutar un respaldo remoto de la configuración activa hacia un servidor TFTP de la red local.<br><br><b>¿Por qué ejecutamos este comando?:</b> Los routers y switches están expuestos a sobretensiones eléctricas, fallas de memoria flash o desastres naturales. Si un equipo se quema físicamente y no existe una copia de seguridad externa de su configuración, reconstruir las VLANs, listas de acceso y rutas puede demandar días enteros de paro corporativo.<br><br><b>¿Para qué sirve el comando?:</b><br><code>copy run tftp</code>: Toma el archivo <code>running-config</code> residente en la memoria RAM y lo transmite en paquetes ligeros sobre el puerto UDP 69 hacia el servidor central en la IP 192.168.1.10.<br><br><b>¿Qué beneficios trae?:</b> Respaldos automáticos de contingencia, recuperación ante desastres en menos de 10 minutos y archivo de versiones de configuración.<br><br><b>Instrucción:</b> En modo privilegiado (<code>#</code>) del <b>Router</b> o <b>Switch</b> ejecuta <code>copy run tftp</code>.',
        theory: '<b>📘 Comparativa Exhaustiva: FTP vs <span class=\"concept\" data-term=\"tftp\">TFTP</span></b><br><br>• <b>FTP (File Transfer Protocol - RFC 959):</b><br>  - Opera sobre <b>TCP</b> utilizando dos puertos separados: <b>TCP 21 para Control</b> (autenticación y comandos) y <b>TCP 20 para Datos</b> (transferencia real del archivo).<br>  - <b>Autenticación obligatoria:</b> Requiere usuario y contraseña válidos.<br>  - Permite navegar por directorios remotos, listar carpetas, borrar archivos y reanudar transferencias interrumpidas.<br><br>• <b>TFTP (Trivial File Transfer Protocol - RFC 1350):</b><br>  - Protocolo minimalista diseñado para implementarse en chips de memoria ROM muy pequeños (bootstrap de arranque de red PXE).<br>  - Opera sobre <b>UDP puerto 69</b> (transporte sin conexión; la confiabilidad la gestiona el propio protocolo TFTP mediante un esquema simple de parada y espera con acuses de bloque de 512 bytes).<br>  - <b>Sin autenticación ni cifrado:</b> No pide contraseñas; cualquiera puede leer o escribir si el servidor lo permite.<br>  - No permite explorar directorios: el emisor debe conocer de antemano el nombre exacto del archivo a transferir.',
        tasks: [ { id: 't1', text: 'Comando: copy run tftp', done: false } ],
        check: function() { 
            return window.cmdHistory && window.cmdHistory.some(c => c.includes('copy run tftp') || c.includes('copy running-config tftp')); 
        }
    },

    // ==========================================
    // DOMINIO 2: ACCESO A LA RED (20%)
    // ==========================================
    {
        id: '2.1',
        tier: 'DOMINIO 2: ACCESO A LA RED',
        title: 'Segmentación Lógica en Capa 2: Creación de VLANs y Puertos de Acceso',
        desc: '<b>Objetivo:</b> Crear una VLAN en la base de datos local del conmutador y asignarle un puerto físico en modo acceso.<br><br><b>¿Por qué ejecutamos estos comandos?:</b> En una empresa sin VLANs, todas las computadoras comparten un único dominio de difusión gigantesco. Si una PC se infecta con un gusano de red o envía una tormenta de broadcast, colapsa a todos los departamentos por igual. Además, cualquier usuario de Ventas podría capturar el tráfico del departamento de Finanzas.<br><br><b>¿Para qué sirve cada comando?:</b><br>1. <code>vlan 10</code>: Crea el identificador de red lógica número 10 en la memoria del switch.<br>2. <code>interface f0/1</code>: Selecciona el puerto físico FastEthernet 0/1 donde está conectada la computadora del usuario.<br>3. <code>switchport mode access</code>: Le ordena al puerto que opere estrictamente en modo de acceso; el switch eliminará cualquier etiqueta 802.1Q antes de entregar la trama al usuario y estampará internamente la etiqueta de la VLAN 10 a todo paquete que ingrese.<br><br><b>¿Qué beneficios trae?:</b> Aislamiento total de tráfico entre departamentos, reducción del ruido de difusión y contención de amenazas de seguridad.<br><br><b>Instrucción:</b> En el <b>Switch</b> ingresa a modo config y ejecuta los comandos.',
        theory: '<b>📘 Teoría y Operación de Virtual LANs (VLANs)</b><br><br>• <b>¿Qué es una <span class="concept" data-term="vlan">VLAN</span>?:</b> Una partición lógica que subdivide un switch físico en múltiples switches virtuales independientes. Los paquetes sólo se conmutan entre puertos que pertenezcan a la misma VLAN; para pasar tráfico de una VLAN a otra es mandatorio usar un dispositivo de <span class=\"concept\" data-term=\"capa3\">Capa 3</span> (Router o Switch L3).<br>• <b>Base de Datos de VLANs (vlan.dat):</b> Las VLANs normales (1 a 1005) se almacenan en el archivo binario <code>flash:vlan.dat</code>, no en la configuración de texto <code>running-config</code>. Las VLANs extendidas (1006 a 4094) se guardan en el archivo de configuración activo.<br>• <b>VLAN 1 por Defecto:</b> Todos los puertos del switch pertenecen a la VLAN 1 de fábrica. No se puede borrar ni renombrar. Por seguridad, el tráfico sensible de usuarios debe moverse a VLANs dedicadas (ej. VLAN 10 Ventas, VLAN 20 Datos, VLAN 99 Gestión).',
        tasks: [ { id: 't1', text: 'Comandos: vlan 10 y switchport mode access', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('switchport mode access') || c.includes('sw mo acc') || c.includes('mode access')); }
    },
    {
        id: '2.2',
        tier: 'DOMINIO 2: ACCESO A LA RED',
        title: 'Enlaces Troncales 802.1Q y Negociación de Modo DTP',
        desc: '<b>Objetivo:</b> Configurar un puerto como enlace troncal (Trunk) para transportar el tráfico de múltiples VLANs sobre un solo cable físico.<br><br><b>¿Por qué ejecutamos este comando?:</b> Si una empresa tiene 20 VLANs distintas y conecta dos switches entre sí, sería financieramente absurdo e insostenible tender 20 cables físicos separados (uno por cada VLAN). Un enlace troncal actúa como una autopista compartida multipistas.<br><br><b>¿Para qué sirve el comando?:</b><br><code>switchport mode trunk</code>: Fuerza al puerto físico a multiplexar tramas de múltiples VLANs, inyectando una cabecera normalizada IEEE 802.1Q que identifica a qué VLAN pertenece cada trama antes de lanzarla por el cable.<br><br><b>¿Qué beneficios trae?:</b> Ahorro masivo de infraestructura física, escalabilidad inmediata para sumar nuevas VLANs entre pisos o edificios sin tender nuevos cables.<br><br><b>Instrucción:</b> En el <b>Switch</b> selecciona <code>interface f0/2</code> y ejecuta <code>switchport mode trunk</code>.',
        theory: '<b>📘 El Estándar IEEE <span class=\"concept\" data-term=\"8021q\">802.1Q</span> y Protocolo DTP</b><br><br>• <b>La Cabecera 802.1Q (Tag de 4 bytes):</b> El switch emisor inserta 4 bytes entre los campos Source <span class=\"concept\" data-term=\"mac\">MAC</span> y EtherType de la trama Ethernet:<br>  - <b>TPID (Tag Protocol Identifier - 2 bytes):</b> Valor fijo <code>0x8100</code> que indica que la trama está etiquetada.<br>  - <b>TCI (Tag Control Information - 2 bytes):</b> Contiene 3 bits de prioridad <span class=\"concept\" data-term=\"qos\">QoS</span> (PCP/CoS), 1 bit de formato canónico (DEI) y <b>12 bits para el VLAN ID (VID)</b>, lo que permite hasta 4096 <span class=\"concept\" data-term=\"vlan\">VLANs</span> distintas.<br>  - El conmutador receptor lee el VID, quita los 4 bytes (Untagging) y reenvía la trama limpia hacia el puerto de destino.<br><br>• <b>VLAN Nativa:</b> Tráfico que viaja por el troncal <b>SIN etiqueta 802.1Q</b>. Por defecto es la VLAN 1. <b>Riesgo crítico de seguridad:</b> Si no se cambia la VLAN nativa, un atacante puede explotar la vulnerabilidad de \"Doble Etiquetado\" (Double Tagging) para saltar de una VLAN a otra. Buenas prácticas: asignar una VLAN nativa ficticia sin uso (ej. VLAN 999).<br>• <b><span class="concept" data-term="dtp">DTP (Dynamic Trunking Protocol):</span></b> Protocolo propietario de Cisco. Modos: <code>dynamic desirable</code> (inicia activamente negociación) y <code>dynamic auto</code> (espera pasivamente). Peligro: Un atacante puede negociar un troncal con su laptop. En entornos endurecidos se apaga con <code>switchport nonegotiate</code>.',
        tasks: [ { id: 't1', text: 'Comando: switchport mode trunk', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('mode trunk') || c.includes('mo tr')); }
    },
    {
        id: '2.3',
        tier: 'DOMINIO 2: ACCESO A LA RED',
        title: 'Prevención de Bucles de Capa 2: Rapid Spanning Tree Protocol (RSTP 802.1w)',
        desc: '<b>Objetivo:</b> Habilitar Rapid Per-VLAN Spanning Tree para garantizar convergencia rápida y prevenir tormentas de difusión.<br><br><b>¿Por qué ejecutamos este comando?:</b> En Capa 2 no existe el campo TTL (Time to Live) que tienen los paquetes IP. Si conectamos dos switches con cables redundantes para que no se corte la red si uno falla, las tramas de difusión (como las peticiones ARP) comenzarán a circular en círculo infinitamente a velocidad física. En menos de 2 segundos la CPU de los conmutadores alcanza el 100%, las tablas de direcciones MAC se corrompen y toda la empresa se queda sin red (Tormenta de Broadcast).<br><br><b>¿Para qué sirve el comando?:</b><br><code>spanning-tree mode rapid-pvst</code>: Activa el protocolo IEEE 802.1w optimizado por Cisco para cada VLAN. El algoritmo calcula el árbol lógico libre de bucles y bloquea selectivamente enlaces redundantes, manteniéndolos como respaldo en tiempo real.<br><br><b>¿Qué beneficios trae?:</b> Redundancia física garantizada con recuperación ante cortes de cable en menos de 1 segundo (frente a los 50 segundos del STP 802.1D clásico).<br><br><b>Instrucción:</b> En el <b>Switch</b> (modo config) ejecuta <code>spanning-tree mode rapid-pvst</code>.',
        theory: '<b>📘 El Algoritmo <span class=\"concept\" data-term=\"stp\">Spanning Tree</span> (STA) y Estados de Puerto</b><br><br>• <b>Elección del Root Bridge (Puente Raíz):</b> Todos los conmutadores intercambian tramas especiales denominadas <b>BPDUs (Bridge Protocol Data Units)</b> cada 2 segundos. El switch con el <b>Bridge ID (BID)</b> más bajo gana la elección.<br>  - <code>BID = Prioridad de Puente (múltiplo de 4096, defecto 32768) + <span class=\"concept\" data-term=\"vlan\">VLAN</span> ID + Dirección <span class=\"concept\" data-term=\"mac\">MAC</span></code>.<br>  - Para forzar a un switch core a ser el raíz: <code>spanning-tree vlan 10 priority 4096</code> o <code>spanning-tree vlan 10 root primary</code>.<br><br>• <b>Roles de Puerto en RSTP:</b><br>  - <b>Root Port (RP):</b> El puerto de cada switch no-raíz que tiene el menor costo de ruta acumulado hacia el Root Bridge.<br>  - <b>Designated Port (DP):</b> El puerto que reenvía tráfico en cada segmento de red individual.<br>  - <b>Alternate Port (AP):</b> Puerto bloqueado que sirve de camino de respaldo inmediato hacia el raíz.<br><br>• <b>Convergencia Rápida en RSTP:</b> Reemplaza los lentos temporizadores Listening (15s) y Learning (15s) por un mecanismo de negociación explícito de <b>Propuesta y Acuerdo (Proposal / Agreement)</b> que conmuta estados en milisegundos.<br>• <b>PortFast y BPDU Guard:</b> En puertos conectados a computadoras finales se configura <code>spanning-tree portfast</code> (pasa a reenvío inmediato saltándose el cálculo STP) y <code>spanning-tree bpduguard enable</code> (apaga el puerto instantáneamente si alguien conecta un switch clandestino).',
        tasks: [ { id: 't1', text: 'Comando: spanning-tree mode rapid-pvst', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('spanning-tree mode rapid-pvst') || c.includes('mode rapid-pvst')); }
    },
    {
        id: '2.4',
        tier: 'DOMINIO 2: ACCESO A LA RED',
        title: 'Agregación de Enlaces EtherChannel (LACP IEEE 802.3ad)',
        desc: '<b>Objetivo:</b> Fusionar múltiples enlaces físicos paralelos en una única interfaz lógica Port-Channel.<br><br><b>¿Por qué ejecutamos estos comandos?:</b> Cuando se necesita aumentar el ancho de banda entre dos switches y se colocan 2, 4 u 8 cables, Spanning Tree detecta el bucle y bloquea todos los enlaces dejando solo uno activo. Todo el dinero gastado en cables adicionales queda desperdiciado como enlaces inactivos.<br><br><b>¿Para qué sirve cada comando?:</b><br>1. <code>interface range f0/1 - 2</code>: Selecciona de forma agrupada los dos puertos físicos involucrados en la unión.<br>2. <code>channel-group 1 mode active</code>: Empaqueta los puertos dentro del canal lógico número 1 utilizando el protocolo estándar LACP (modo activo negociará activamente la unión con el otro extremo).<br><br><b>¿Qué beneficios trae?:</b> Suma el ancho de banda de todos los cables (ej. 2 x 100 Mbps = 200 Mbps full duplex), balancea la carga mediante funciones hash de MAC o IP y provee tolerancia a fallas instantánea sin intervención de Spanning Tree (si un cable se corta, el tráfico sigue fluyendo por el otro sin caída perceptible).<br><br><b>Instrucción:</b> En el <b>Switch</b> ejecuta ambos comandos.',
        theory: '<b>📘 Protocolos y Reglas de Consistencia de <span class=\"concept\" data-term=\"lacp\">EtherChannel</span></b><br><br>• <b>LACP (Link Aggregation Control Protocol - IEEE 802.3ad/802.1ax):</b> Estándar abierto multi-proveedor. Modos:<br>  - <code>active</code>: Envía activamente paquetes LACP para negociar la formación del canal.<br>  - <code>passive</code>: Escucha y sólo forma el canal si el vecino está en modo activo.<br>  (Combinaciones válidas: Active-Active y Active-Passive. Incompatible: Passive-Passive).<br>• <b>PAgP (Port Aggregation Protocol):</b> Protocolo propietario de Cisco. Modos: <code>desirable</code> (activo) y <code>auto</code> (pasivo).<br>• <b>Modo On (Estático):</b> Fuerza la agrupación sin negociación de paquetes de control (desaconsejado porque no valida caídas parciales de cable).<br>• <b>Reglas Estrictas de Consistencia (Si un solo parámetro difiere, el puerto queda en suspensión):</b><br>  1. Misma velocidad y dúplex en todos los miembros del grupo.<br>  2. Mismo modo de conmutación (todos Access en la misma VLAN, o todos Trunk con la misma VLAN nativa y misma lista de <span class=\"concept\" data-term=\"vlan\">VLANs</span> permitidas).',
        tasks: [ { id: 't1', text: 'Comando: channel-group 1 mode active', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('channel-group')); }
    },
    {
        id: '2.5',
        tier: 'DOMINIO 2: ACCESO A LA RED',
        title: 'Arquitectura Inalámbrica Centralizada y Controladores WLC',
        desc: '<b>Objetivo:</b> Comprender la arquitectura de puntos de acceso ligeros (Lightweight APs) gestionados mediante WLC.<br><br><b>¿Por qué lo hacemos?:</b> En un campus con 500 puntos de acceso, configurar cada antena de forma autónoma (entrando equipo por equipo para poner nombres de red, claves y canales) es inmanejable. Si un usuario camina por un pasillo hablando por teléfono Wi-Fi, la llamada se corta porque las antenas autónomas no se comunican entre sí.<br><br><b>¿Para qué sirve?:</b> Centraliza toda la inteligencia de gestión de radiofrecuencia, seguridad corporativa, portal cautivo y roaming sin interrupciones en un controlador de hardware o máquina virtual dedicada.<br><br><b>Beneficios:</b> Configuración global en segundos, balanceo automático de potencia para tapar agujeros de cobertura y roaming instantáneo en Capa 3.<br><br><b>Instrucción:</b> En la consola ejecuta <code>acknowledge wlc</code>.',
        theory: '<b>📘 Arquitectura Split-MAC y Protocolo CAPWAP</b><br><br>• <b>División de Responsabilidades (Split-MAC):</b><br>  - <b>Lightweight AP (Funciones <span class=\"concept\" data-term=\"mac\">MAC</span> en tiempo real):</b> Balizas de señalización (Beacons), respuestas de sondeo (Probe Responses), acuses de <span class=\"concept\" data-term=\"rf\">radiofrecuencia</span> (ACK 802.11) y cifrado/descifrado de tramas en el aire.<br>  - <b><span class="concept" data-term="wlc">WLC (Funciones MAC de gestión):</span></b> Autenticación 802.1X, asignación dinámica de <span class=\"concept\" data-term=\"vlan\">VLANs</span>, traducción de tramas 802.11 a 802.3, terminación de seguridad y optimización de potencia y canales (RRM - Radio Resource Management).<br><br>• <b>Túneles CAPWAP (Control and Provisioning of Wireless Access Points):</b> Toda la comunicación entre el AP y el WLC viaja encapsulada sobre dos túneles UDP protegidos con criptografía DTLS:<br>  - <b>CAPWAP Control (UDP 5246):</b> Mensajes de configuración, estado y estadísticas del AP.<br>  - <b>CAPWAP Data (UDP 5247):</b> Todo el tráfico de los usuarios conectados a la red Wi-Fi se empaqueta en el AP y viaja directamente hasta el WLC antes de salir a la <span class=\"concept\" data-term=\"lan\">LAN</span>.<br>• <b>Modo FlexConnect:</b> Diseñado para sucursales remotas conectadas por enlaces <span class=\"concept\" data-term=\"wan\">WAN</span> lentos. Si el enlace hacia el WLC central se corta, el AP continúa autenticando y conmutando localmente el tráfico de los usuarios locales sin interrupción del servicio.',
        tasks: [ { id: 't1', text: 'Comando: acknowledge wlc', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('acknowledge wlc'); }
    },
    {
        id: '2.6',
        tier: 'DOMINIO 2: ACCESO A LA RED',
        title: 'Enrutamiento Inter-VLAN: Router-on-a-Stick con Subinterfaces 802.1Q',
        desc: '<b>Objetivo:</b> Habilitar el enrutamiento entre distintas VLANs utilizando una sola interfaz física de router dividida en subinterfaces lógicas.<br><br><b>¿Por qué ejecutamos estos comandos?:</b> Por diseño estricto de Capa 2, dos VLANs distintas (ej. VLAN 10 Ventas y VLAN 20 Contabilidad) son mundos completamente aislados. Si un empleado de Ventas necesita consultar un servidor en Contabilidad, el switch por sí solo no puede cruzar el paquete. Se requiere obligatoriamente un dispositivo de Capa 3 que reciba el paquete, reescriba las cabeceras MAC y lo enrute.<br><br><b>¿Para qué sirve cada comando?:</b><br>1. <code>interface g0/1.10</code>: Crea la subinterfaz lógica número 10 sobre el puerto físico GigabitEthernet 0/1.<br>2. <code>encapsulation dot1q 10</code>: Vincula esta subinterfaz con la etiqueta de la VLAN 10. Le indica al router: <i>\"Todo paquete que llegue con la etiqueta 802.1Q número 10 pertenece a esta subinterfaz; quítale la etiqueta y procésalo en Capa 3\"</i>.<br>3. <code>ip address 192.168.10.1 255.255.255.0</code>: Asigna la dirección IP que funcionará como la Puerta de Enlace Predeterminada (Default Gateway) de todas las computadoras de la VLAN 10.<br><br><b>¿Qué beneficios trae?:</b> Permite que docenas de departamentos aislados se comuniquen entre sí a través de un único cable físico conectado al router, sin desperdiciar interfaces de red.<br><br><b>Instrucción:</b> En el <b>Router</b> ingresa a modo config y ejecuta los comandos.',
        theory: '<b>📘 Metodologías de Enrutamiento Inter-VLAN</b><br><br>• <b><span class=\"concept\" data-term=\"roas\">Router-on-a-Stick</span> (ROAS):</b> El switch conecta al router mediante un enlace <b>Trunk</b> que transporta todas las <span class=\"concept\" data-term=\"vlan\">VLANs</span> etiquetadas. El router utiliza subinterfaces lógicas (ej. <code>g0/1.10</code>, <code>g0/1.20</code>), cada una configurada con <code>encapsulation <span class=\"concept\" data-term=\"8021q\">dot1q</span> [vlan-id]</code>.<br>  - <b>Regla de Oro en Cisco:</b> Es mandatorio ejecutar el comando <code>encapsulation dot1q</code> <b>ANTES</b> de intentar poner el comando <code>ip address</code> en la subinterfaz; de lo contrario el sistema operativo IOS rechazará la <span class=\"concept\" data-term=\"ip\">IP</span> con error.<br>  - La interfaz física padre (<code>interface g0/1</code>) debe encenderse con <code>no shutdown</code> y no debe tener ninguna IP asignada.<br><br>• <b>Switches de <span class=\"concept\" data-term=\"capa3\">Capa 3</span> (Multilayer Switches - SVIs):</b> En redes corporativas modernas, ROAS puede convertirse en un cuello de botella (\"stick\"). Se reemplaza por switches multicapa que enrutan internamente a velocidad de hardware utilizando <b>SVIs (Switch Virtual Interfaces)</b>:<br>  <code>interface vlan 10 -> ip address 192.168.10.1 255.255.255.0 -> no shutdown</code>, activando el motor de enrutamiento global con <code>ip routing</code>.',
        tasks: [ { id: 't1', text: 'Comandos: subinterfaz, encapsulation dot1q y IP', done: false } ],
        check: function() { 
            return window.cmdHistory && window.cmdHistory.some(c => c.includes('encapsulation dot1q') || c.includes('encap dot1q')); 
        }
    },

    // ==========================================
    // DOMINIO 3: CONECTIVIDAD IP (25%)
    // ==========================================
    {
        id: '3.1',
        tier: 'DOMINIO 3: CONECTIVIDAD IP',
        title: 'Inspección de la Tabla de Enrutamiento IP de Cisco IOS',
        desc: '<b>Objetivo:</b> Examinar la base de datos de reenvío de paquetes del router, interpretando orígenes, distancias administrativas y métricas.<br><br><b>¿Por qué ejecutamos este comando?:</b> El router es el encargado de interconectar el mundo. Cuando un paquete llega a una interfaz, el router no lo reenvía al azar; consulta su tabla de enrutamiento en memoria RAM. Si la red destino no existe en la tabla, el router descarta el paquete y devuelve un mensaje de error ICMP Destination Unreachable.<br><br><b>¿Para qué sirve el comando?:</b><br><code>show ip route</code>: Despliega en pantalla el mapa completo de caminos conocidos por el router, detallando si fueron aprendidos directamente por cable físico (C), configurados manualmente por un administrador (S) o aprendidos dinámicamente por protocolos (O para OSPF).<br><br><b>¿Qué beneficios trae?:</b> Es la herramienta número 1 de diagnóstico de conectividad: permite verificar instantáneamente si el router sabe hacia dónde enviar los paquetes de los usuarios.<br><br><b>Instrucción:</b> En modo privilegiado (<code>#</code>) del <b>Router</b> ejecuta <code>show ip route</code>.',
        theory: '<b>📘 El Algoritmo de Decisión de Reenvío de Paquetes en Cisco IOS</b><br><br>• <b>1. Coincidencia de Prefijo Más Largo (Longest Prefix Match):</b> Es la regla suprema de enrutamiento. Si existen múltiples rutas hacia un mismo destino, el router <b>siempre</b> elegirá la que tenga la máscara de subred más específica (más bits en 1). Ejemplo: Si llega un paquete para <code>10.1.1.50</code> y en la tabla hay una ruta para <code>10.1.1.0/24</code> y otra para <code>10.1.1.48/28</code>, el router elegirá sin dudar la /28 porque coincide en más bits.<br><br>• <b>2. Distancia Administrativa (AD - Administrative Distance):</b> Si dos orígenes distintos ofrecen una ruta exactamente a la misma red con la misma máscara, el router elige la que tenga la <b>menor Distancia Administrativa</b> (menor número = mayor confiabilidad):<br>  - Interfaz Conectada Directamente: <b>0</b>.<br>  - Ruta Estática: <b>1</b>.<br>  - EIGRP (Ruta Interna): <b>90</b>.<br>  - <span class=\"concept\" data-term=\"ospf\">OSPF</span>: <b>110</b>.<br>  - IS-IS: <b>115</b>.<br>  - RIP: <b>120</b>.<br>  - eBGP (Rutas externas de Internet): <b>20</b>.<br><br>• <b>3. Métrica:</b> Si el mismo protocolo de enrutamiento (ej. OSPF) conoce dos caminos hacia la misma red, utiliza la <b>Métrica</b> (Costo de ancho de banda en OSPF, saltos en RIP) para desempatar y elegir el mejor camino.',
        tasks: [ { id: 't1', text: 'Comando: show ip route', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('show ip route') || c.includes('sh ip ro')); }
    },
    {
        id: '3.2',
        tier: 'DOMINIO 3: CONECTIVIDAD IP',
        title: 'Ruta por Defecto (Gateway of Last Resort) y Rutas Estáticas Flotantes',
        desc: '<b>Objetivo:</b> Configurar una ruta estática comodín con distancia administrativa de respaldo (50) para proveer salida hacia el proveedor de Internet.<br><br><b>¿Por qué ejecutamos este comando?:</b> Existen más de 950,000 redes en la Internet global; un router de sucursal no tiene memoria ni procesador para almacenar todas las rutas del planeta. Se requiere una ruta por defecto que diga: <i>\"Todo lo que no conozcas internamente, envíaselo al router del proveedor de Internet (ISP)\"</i>. Además, si la empresa contrata un enlace de respaldo secundario (4G/Fibra B), se utiliza una ruta flotante para que el respaldo permanezca dormido y solo se active si el enlace principal cae.<br><br><b>¿Para qué sirve cada parte del comando?:</b><br><code>ip route 0.0.0.0 0.0.0.0 10.1.1.1 50</code><br>  - <code>0.0.0.0 0.0.0.0</code>: El comodín supremo. Coincide con cualquier dirección IP destino del mundo.<br>  - <code>10.1.1.1</code>: La IP del siguiente salto (Next-Hop), es decir, la interfaz del router del ISP.<br>  - <code>50</code>: Asigna deliberadamente una Distancia Administrativa de 50. Como la ruta estática estándar tiene AD 1, esta ruta queda oculta (\"flotando\") y se instala automáticamente en la tabla sólo si la ruta primaria se cae.<br><br><b>¿Qué beneficios trae?:</b> Conectividad a toda la Internet global sin sobrecargar la memoria del equipo y tolerancia a fallos automática ante cortes de fibra.<br><br><b>Instrucción:</b> En el <b>Router</b> (modo config) ejecuta el comando completo.',
        theory: '<b>📘 Tipos de Rutas Estáticas en Cisco IOS</b><br><br>• <b>Ruta Estática Estándar:</b> Apunta a una red destino específica: <code>ip route 192.168.20.0 255.255.255.0 10.1.1.2</code>.<br>• <b>Ruta por Defecto (Default Route):</b> Utiliza red 0.0.0.0 y máscara 0.0.0.0. En la tabla de rutas aparece marcada como <code>S*</code> y se denomina <i>Gateway of Last Resort</i>.<br>• <b>Ruta Estática Flotante (Floating Static Route):</b> Se le agrega un valor de Distancia Administrativa al final del comando superior a la del enlace primario. Permite crear enlaces de contingencia económicos (ej. enlace primario por fibra con AD 1 y enlace secundario por módem 5G con AD 50 o superior a 110 de <span class=\"concept\" data-term=\"ospf\">OSPF</span>).<br>• <b>Ruta de Host (/32):</b> Apunta a una sola <span class=\"concept\" data-term=\"ip\">dirección IP</span> específica con máscara <code>255.255.255.255</code> (ej. un servidor de facturación crítico). Al tener la máscara más específica (/32), tiene prioridad absoluta sobre cualquier otra ruta.',
        tasks: [ { id: 't1', text: 'Comando: ip route 0.0.0.0 0.0.0.0 10.1.1.1 50', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('ip route 0.0.0.0 0.0.0.0 10.1.1.1 50')); }
    },
    {
        id: '3.3',
        tier: 'DOMINIO 3: CONECTIVIDAD IP',
        title: 'Enrutamiento Dinámico de Estado de Enlace: OSPFv2 (Área Única)',
        desc: '<b>Objetivo:</b> Habilitar el proceso de enrutamiento dinámico OSPF y publicar subredes locales dentro del Área 0.<br><br><b>¿Por qué ejecutamos estos comandos?:</b> Escribir rutas estáticas a mano en una red con 50 routers es una pesadilla operativa: si un cable interurbano se corta a las 3:00 AM, nadie actualizará las tablas y la red permanecerá caída. Un protocolo dinámico como OSPF descubre vecinos automáticamente, aprende todas las rutas y recalcula caminos alternativos en milisegundos sin intervención humana.<br><br><b>¿Para qué sirve cada comando?:</b><br>1. <code>router ospf 1</code>: Enciende el proceso del protocolo Open Shortest Path First identificándolo con el ID de proceso local número 1 (el Process ID es local al equipo y no necesita coincidir con los vecinos).<br>2. <code>network 192.168.1.0 0.0.0.255 area 0</code>: Le indica al router dos cosas fundamentales: <i>\"1) Busca cualquier interfaz que tenga una IP en el rango 192.168.1.0/24 y comienza a emitir paquetes de saludo (Hello) para buscar vecinos OSPF; 2) Publica esa subred a todos los demás routers conectados al Área 0 (Backbone)\"</i>.<br><br><b>¿Qué beneficios trae?:</b> Convergencia ultra-rápida ante fallas de infraestructura, cálculo automático del camino con mayor ancho de banda y escalabilidad empresarial.<br><br><b>Instrucción:</b> En el <b>Router</b> ingresa a modo config y ejecuta ambos comandos.',
        theory: '<b>📘 Operación Interna del Protocolo <span class=\"concept\" data-term=\"ospf\">OSPFv2</span> (RFC 2328)</b><br><br>• <b>Protocolo de Estado de Enlace (Link-State):</b> A diferencia de protocolos vector distancia como RIP que transmiten toda su tabla de rutas a ciegas por rumor, en OSPF cada router crea un mapa topológico completo e idéntico de toda la red utilizando la base de datos de estado de enlace (LSDB - Link-State Database) y ejecuta de manera local el algoritmo <b>Dijkstra (Shortest Path First - SPF)</b> para colocar a su propio nodo como raíz del árbol de menor costo.<br><br>• <b>Cálculo de Métrica (Costo):</b><br>  <code>Costo = Ancho de Banda de Referencia / Ancho de Banda de la Interfaz</code>.<br>  - Por defecto el ancho de referencia es 100 Mbps (10^8). Por tanto: Enlace FastEthernet (100 Mbps) = Costo 1; Enlace T1 (1.544 Mbps) = Costo 64.<br>  - Para redes Gigabit y 10G se debe ajustar con <code>auto-cost reference-bandwidth 10000</code>.<br><br>• <b>Formación de Adyacencias (Paquetes Hello a multicast 224.0.0.5):</b><br>  Para que dos routers se hagan vecinos en OSPF, <b>deben coincidir estrictamente:</b><br>  1. Mismo temporizador Hello y Dead (por defecto 10s y 40s en multiacceso).<br>  2. Mismo número de Área (ej. Área 0).<br>  3. Misma máscara de subred en la interfaz compartida.<br>  4. Misma contraseña de autenticación (si está habilitada).<br>• <b>Roles en Redes <span class=\"concept\" data-term=\"broadcast\">Broadcast</span> Multi-Access:</b> Para no inundar la red con millones de mensajes cruzados, los routers eligen un <b>DR (Designated Router)</b> y un <b>BDR (Backup Designated Router)</b> mediante la prioridad más alta o el Router ID más alto. Todos los demás routers (DROther) sólo hablan con el DR/BDR a través de la dirección multicast <code>224.0.0.6</code>.',
        tasks: [ { id: 't1', text: 'Comando: router ospf 1', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('router ospf')); }
    },
    {
        id: '3.4',
        tier: 'DOMINIO 3: CONECTIVIDAD IP',
        title: 'Redundancia de Primer Salto (FHRP): Configuración de HSRP',
        desc: '<b>Objetivo:</b> Crear una dirección IP virtual y dirección MAC virtual compartida entre dos routers redundantes.<br><br><b>¿Por qué ejecutamos este comando?:</b> Las computadoras de los usuarios solo admiten una única dirección IP como Puerta de Enlace (Default Gateway). Si una empresa instala dos routers físicos para tener alta disponibilidad pero un router se quema, las computadoras no se enteran y siguen arrojando sus paquetes al equipo muerto, dejando a toda la oficina sin Internet.<br><br><b>¿Para qué sirve el comando?:</b><br><code>standby 1 ip 192.168.1.254</code>: Inicia el grupo HSRP número 1 en la interfaz y crea la IP Virtual <code>192.168.1.254</code>. Dos routers físicos atienden a esta IP: uno estará en estado <b>Active</b> (reenviando tráfico real) y el otro en estado <b>Standby</b> (vigilando en silencio mediante paquetes de saludo). Si el router activo muere, el secundario asume la IP y la MAC virtual en menos de 3 segundos sin que los usuarios noten ninguna desconexión.<br><br><b>¿Qué beneficios trae?:</b> Redundancia transparente de puerta de enlace sin reconfigurar las computadoras de los clientes ni depender de reinicios manuales.<br><br><b>Instrucción:</b> En el <b>Router</b> ingresa a <code>interface f0/1</code> y ejecuta el comando.',
        theory: '<b>📘 Protocolos de Redundancia de Puerta de Enlace (FHRP)</b><br><br>• <b>HSRP (Hot Standby Router Protocol - Propietario Cisco):</b><br>  - Comparte una <span class=\"concept\" data-term=\"ip\">IP</span> virtual y una <b><span class=\"concept\" data-term=\"mac\">MAC</span> Virtual única</b>:<br>    Para HSRPv1: <code>0000.0c07.acXX</code> (donde XX es el número de grupo en hexadecimal).<br>    Para HSRPv2: <code>0000.0c9f.fXXX</code>.<br>  - Cuando los clientes hacen una solicitud ARP preguntando por la MAC del Gateway, el router activo responde con la MAC virtual. Si el router activo falla, el router secundario toma posesión de esa misma MAC virtual, evitando que las tablas ARP de los clientes queden desactualizadas.<br><br>• <b>Prioridad y Preemption:</b><br>  - Por defecto la prioridad es 100. El router con mayor prioridad gana el rol Activo (ej. <code>standby 1 priority 110</code>).<br>  - <b>Preempt (<code>standby 1 preempt</code>):</b> Obliga al router principal a recuperar inmediatamente su rol de Activo una vez que se repare y reinicie, en lugar de quedarse pasivo.<br>• <b>VRRP (Virtual Router Redundancy Protocol - RFC 5798):</b> El estándar abierto multi-proveedor equivalente a HSRP (utiliza términos Master y Backup; MAC virtual <code>0000.5e00.01XX</code>).<br>• <b>GLBP (Gateway Load Balancing Protocol - Cisco):</b> Evolución que permite balanceo activo-activo real distribuyendo tráfico entre hasta 4 routers simultáneos mediante múltiples MACs virtuales (AVFs).',
        tasks: [ { id: 't1', text: 'Comando: standby 1 ip 192.168.1.254', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('standby 1 ip') || c.includes('standby')); }
    },
    {
        id: '3.5',
        tier: 'DOMINIO 3: CONECTIVIDAD IP',
        title: 'Servidor de Asignación Dinámica: DHCP Server en Cisco IOS',
        desc: '<b>Objetivo:</b> Configurar un grupo de concesión automática de parámetros de red IPv4 dentro del Router.<br><br><b>¿Por qué ejecutamos estos comandos?:</b> Configurar direcciones IP estáticas manualmente en 300 computadoras, teléfonos y laptops es inviable, provoca conflictos de IPs duplicadas y exige ir máquina por máquina cada vez que se cambia el servidor DNS corporativo. DHCP automatiza y centraliza la entrega de parámetros.<br><br><b>¿Para qué sirve cada comando?:</b><br>1. <code>ip dhcp pool RED_VENTAS</code>: Crea y nombra el almacén de concesiones lógicas en la base de datos de Cisco IOS.<br>2. <code>network 192.168.10.0 255.255.255.0</code>: Define el bloque de direcciones IP disponibles que el router irá prestando a las computadoras de esa subred.<br>3. <code>default-router 192.168.10.1</code>: Le inyecta automáticamente a cada cliente la dirección de su Puerta de Enlace (Gateway) para que puedan salir a Internet sin configuración manual.<br><br><b>¿Qué beneficios trae?:</b> Conexión instantánea Plug-and-Play para usuarios, eliminación de errores por IPs duplicadas y administración centralizada de red.<br><br><b>Instrucción:</b> En el <b>Router</b> (modo config) ejecuta los tres comandos.',
        theory: '<b>📘 El Proceso de Negociación <span class=\"concept\" data-term=\"dhcp\">DHCP</span>: Las 4 Fases DORA</b><br><br>• <b>1. DISCOVER (Cliente -> <span class=\"concept\" data-term=\"broadcast\">Broadcast</span> 255.255.255.255 en UDP 67):</b> La PC enciende sin IP y grita en toda la red local: <i>\"¿Hay algún servidor DHCP que me preste una <span class=\"concept\" data-term=\"ip\">dirección IP</span>? Mi <span class=\"concept\" data-term=\"mac\">MAC</span> es AAAA.BBBB.CCCC\"</i>.<br>• <b>2. OFFER (Servidor -> Cliente en UDP 68):</b> El router responde con una propuesta formal: <i>\"Tengo disponible la IP 192.168.10.50 con máscara /24, puerta de enlace 192.168.10.1 y DNS 8.8.8.8 por un tiempo de alquiler (Lease) de 24 horas\"</i>.<br>• <b>3. REQUEST (Cliente -> Broadcast en UDP 67):</b> El cliente acepta formalmente la oferta: <i>\"Acepto la IP 192.168.10.50 del servidor DHCP 192.168.10.1\"</i>. Se envía en broadcast para que otros servidores DHCP que hayan hecho ofertas paralelas sepan que fueron rechazados y liberen sus IPs.<br>• <b>4. ACKNOWLEDGE (Servidor -> Cliente en UDP 68):</b> El router confirma la transacción en su base de datos local y el cliente activa oficialmente su interfaz de red.<br><br>• <b>Comando Crítico de Exclusión de IPs:</b><br>  Para evitar que el router le entregue a un usuario la misma IP que ya tiene un servidor, router o impresora fija, <b>siempre se debe configurar antes:</b><br>  <code>ip dhcp excluded-address 192.168.10.1 192.168.10.10</code>.',
        tasks: [ { id: 't1', text: 'Comandos: ip dhcp pool, network y default-router', done: false } ],
        check: function() { 
            return window.cmdHistory && window.cmdHistory.some(c => c.includes('ip dhcp pool')) && window.cmdHistory.some(c => c.includes('network')); 
        }
    },
    {
        id: '3.6',
        tier: 'DOMINIO 3: CONECTIVIDAD IP',
        title: 'Enrutamiento Estático Predeterminado en IPv6 (::/0)',
        desc: '<b>Objetivo:</b> Configurar la ruta estática por defecto en IPv6 hacia la interfaz del siguiente salto del proveedor.<br><br><b>¿Por qué ejecutamos este comando?:</b> Al igual que en IPv4, un router de empresa no puede cargar en memoria la tabla global BGP completa de Internet IPv6. Se necesita una ruta comodín que canalice todo el tráfico hacia destinos externos a través del gateway del ISP.<br><br><b>¿Para qué sirve el comando?:</b><br><code>ipv6 route ::/0 2001:db8::1</code>: Le indica al kernel de enrutamiento del router: <i>\"Cualquier paquete IPv6 con cualquier destino que no esté directamente conectado a tus interfaces, envíaselo al router del proveedor en la IP 2001:db8::1\"</i>.<br><br><b>¿Qué beneficios trae?:</b> Conectividad universal a la red IPv6 global con consumo mínimo de memoria y procesamiento.<br><br><b>Instrucción:</b> En el <b>Router</b> (modo config) ejecuta el comando.',
        theory: '<b>📘 Sintaxis y Particularidades del Enrutamiento IPv6 en Cisco IOS</b><br><br>• <b>Habilitación Global del Motor de Enrutamiento IPv6:</b> En routers Cisco, el reenvío de paquetes IPv6 viene <b>apagado por defecto</b>. Antes de que el router pueda enrutar tráfico IPv6 entre interfaces, es mandatorio ejecutar: <code>ipv6 unicast-routing</code>.<br>• <b>La Ruta por Defecto en IPv6 (::/0):</b><br>  - Representa 128 ceros seguidos con longitud de prefijo 0.<br>  - Es el análogo exacto a la ruta <code>0.0.0.0 0.0.0.0</code> de IPv4.<br><br>• <b>Tipos de Siguiente Salto en IPv6:</b><br>  1. <b>Next-Hop Global Unicast:</b> Como en este ejercicio (<code>2001:db8::1</code>). El router resuelve recursivamente la interfaz de salida.<br>  2. <b>Next-Hop Link-Local (fe80::):</b> Dado que las direcciones Link-Local no son únicas globalmente y se repiten en distintas placas del equipo, si se usa una <span class=\"concept\" data-term=\"ip\">IP</span> <code>fe80::</code> como siguiente salto, <b>Cisco IOS exige obligatoriamente especificar la interfaz física de salida:</b><br>     <code>ipv6 route ::/0 GigabitEthernet0/1 fe80::1</code>.',
        tasks: [ { id: 't1', text: 'Comando: ipv6 route ::/0 2001:db8::1', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('ipv6 route')); }
    },

    // ==========================================
    // DOMINIO 4: SERVICIOS IP (10%)
    // ==========================================
    {
        id: '4.1',
        tier: 'DOMINIO 4: SERVICIOS IP',
        title: 'Traducción de Direcciones: Port Address Translation (PAT / NAT Overload)',
        desc: '<b>Objetivo:</b> Configurar traducción de direcciones con sobrecarga para permitir que cientos de IPs privadas naveguen por Internet con una sola IP pública.<br><br><b>¿Por qué ejecutamos este comando?:</b> Las direcciones IP privadas (RFC 1918, como 192.168.x.x o 10.x.x.x) son ilegales y no enrutables en la Internet pública; si un router de Internet recibe un paquete con IP origen privada, lo destruye de inmediato. Como las empresas no pueden costear una IP pública para cada computadora, se utiliza PAT.<br><br><b>¿Para qué sirve el comando?:</b><br><code>ip nat inside source list 1 interface g0/1 overload</code>: Toma todas las direcciones IP privadas permitidas en la lista de acceso número 1 (inside) y las traduce a la IP pública de la interfaz de salida (g0/1). La palabra clave <b>overload</b> es la que activa PAT: le asigna a cada conexión privada un número de puerto TCP/UDP único en la IP pública.<br><br><b>¿Qué beneficios trae?:</b> Permite que hasta 64,000 conexiones concurrentes salgan a Internet simultáneamente utilizando una única dirección IP pública registrada.<br><br><b>Instrucción:</b> En el <b>Router</b> (modo config) ejecuta el comando.',
        theory: '<b>📘 Diferencias Técnicas entre NAT Estático, NAT Dinámico y PAT</b><br><br>• <b>NAT Estático:</b> Mapeo 1 a 1 permanente entre una <span class=\"concept\" data-term=\"ip\">IP</span> privada interna y una IP pública externa. Se utiliza exclusivamente para servidores locales que deben ser accedidos desde Internet (servidor web, servidor VPN).<br>• <b>NAT Dinámico:</b> Mapeo de muchas IPs privadas a un grupo (Pool) limitado de IPs públicas (ej. 50 computadoras compartiendo un pool de 5 IPs públicas). Si las 5 IPs públicas están en uso, la computadora número 6 no puede salir a Internet hasta que otra se desconecte.<br>• <b><span class="concept" data-term="nat">PAT (Port Address Translation / NAT Overload):</span></b> Mapeo de muchas IPs privadas a <b>una sola IP pública</b> distinguiendo las sesiones mediante puertos de Capa 4 únicos.<br>  - Ejemplo de Funcionamiento Interno en la Tabla NAT:<br>    - PC A (192.168.1.10:4500) -> Router traduce a -> 200.1.1.1:10001 -> Destino Google:443.<br>    - PC B (192.168.1.20:4500) -> Router traduce a -> 200.1.1.1:10002 -> Destino Google:443.<br>    - Cuando Google responde al puerto 10001, el router consulta su tabla en RAM y le reenvía el paquete intacto a la PC A; cuando responde al 10002 se lo entrega a la PC B.<br><br>• <b>Designación de Interfaces Obligatoria en Cisco:</b><br>  Para que NAT funcione, el administrador debe marcar obligatoriamente cuáles puertos miran a la empresa y cuáles a Internet:<br>  - En la interfaz local: <code>interface g0/0 -> ip nat inside</code>.<br>  - En la interfaz del proveedor: <code>interface g0/1 -> ip nat outside</code>.',
        tasks: [ { id: 't1', text: 'Comando de sobrecarga PAT con overload', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('ip nat inside') && c.includes('overload')); }
    },
    {
        id: '4.2',
        tier: 'DOMINIO 4: SERVICIOS IP',
        title: 'Sincronización de Tiempo con Network Time Protocol (NTP)',
        desc: '<b>Objetivo:</b> Sincronizar el reloj interno del router con un servidor atómico de referencia temporal.<br><br><b>¿Por qué ejecutamos este comando?:</b> Los routers y switches no cuentan con baterías de reloj de larga duración. Si ocurre un incidente de seguridad a las 2:15 AM (un ataque de fuerza bruta o una caída de interfaz) y cada equipo tiene una hora diferente, el equipo forense de ciberseguridad no podrá correlacionar los registros de log entre routers, switches y firewalls para descubrir al atacante. Además, los certificados digitales y firmas de autenticación (Kerberos/TLS) fallan si el reloj del equipo difiere por más de 5 minutos.<br><br><b>¿Para qué sirve el comando?:</b><br><code>ntp server 8.8.8.8</code>: Le ordena al router que se comunique mediante el puerto UDP 123 con el servidor de tiempo maestro y sincronice sus milisegundos con precisión atómica.<br><br><b>¿Qué beneficios trae?:</b> Auditorías forenses consistentes, validez de certificados TLS/SSL y marcas de tiempo exactas en los mensajes de Syslog.<br><br><b>Instrucción:</b> En el <b>Router</b> (modo config) ejecuta el comando.',
        theory: '<b>📘 Arquitectura Jerárquica de Estratos en NTP</b><br><br>• <b>Estructura de Estratos (Stratum Levels):</b> La precisión del tiempo se organiza en niveles jerárquicos de distancia al reloj físico original:<br>  - <b>Stratum 0:</b> Relojes atómicos de cesio, máseres de hidrógeno y satélites GPS de máxima precisión física. No están conectados a redes IP directas.<br>  - <b>Stratum 1:</b> Servidores de computación conectados directamente por hardware a un dispositivo Stratum 0. Son los servidores maestros de referencia mundial.<br>  - <b>Stratum 2:</b> Servidores que se sincronizan sobre la red con servidores Stratum 1. Suelen actuar como fuentes de tiempo corporativas para los routers de una empresa.<br>  - <b>Stratum 16:</b> Indica que el dispositivo está completamente desincronizado y su tiempo no es confiable.<br><br>• <b>Comandos Útiles de Monitoreo en Cisco IOS:</b><br>  - <code>show ntp status</code>: Muestra si el router está sincronizado (Clock is synchronized), el estrato actual y la referencia de tiempo.<br>  - <code>show ntp associations</code>: Detalla la <span class=\"concept\" data-term=\"ip\">dirección IP</span> de los servidores de tiempo configurados, el retardo de ida y vuelta (delay) y el jitter.<br>  - <code>ntp master [estrato]</code>: Configura al router local para actuar él mismo como servidor de tiempo para los demás conmutadores de la empresa si se corta la conexión a Internet.',
        tasks: [ { id: 't1', text: 'Comando: ntp server 8.8.8.8', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('ntp server')); }
    },
    {
        id: '4.3',
        tier: 'DOMINIO 4: SERVICIOS IP',
        title: 'Centralización de Auditoría y Monitoreo: Syslog, SNMP y TFTP',
        desc: '<b>Objetivo:</b> Configurar el envío automático de registros de eventos del sistema operativo hacia un servidor Syslog central.<br><br><b>¿Por qué ejecutamos este comando?:</b> La memoria RAM de un router es muy pequeña (el buffer de registro interno suele guardar apenas unos pocos kilobytes de texto). Si un router colapsa por una falla de energía o es reiniciado intencionalmente por un intruso, todos los mensajes de error guardados en memoria se borran para siempre, dejando al administrador completamente a ciegas.<br><br><b>¿Para qué sirve el comando?:</b><br><code>logging 192.168.1.10</code>: Configura al router como un cliente Syslog que despacha de inmediato cada mensaje de notificación, advertencia o error en tiempo real a través del puerto UDP 514 hacia un servidor dedicado de almacenamiento y análisis de logs.<br><br><b>¿Qué beneficios trae?:</b> Registro histórico permanente, cumplimiento de normativas de auditoría de seguridad y alertas tempranas de fallas en interfaces.<br><br><b>Instrucción:</b> En el <b>Router</b> (modo config) ejecuta el comando.',
        theory: '<b>📘 Los 8 Niveles de Severidad de <span class=\"concept\" data-term=\"syslog\">Syslog</span> y Herramientas de Monitoreo</b><br><br>• <b>Escala Numérica de Severidad Syslog (0 es el más grave, 7 el más detallado):</b><br>  - <b>0 - Emergencies (emergencia):</b> El sistema es totalmente inestable o inutilizable.<br>  - <b>1 - Alerts (alerta):</b> Se requiere acción inmediata.<br>  - <b>2 - Critical (crítico):</b> Condición crítica de hardware o software.<br>  - <b>3 - Errors (errores):</b> Condiciones de error en módulos o protocolos.<br>  - <b>4 - Warnings (advertencias):</b> Ocurrencias anómalas que podrían causar fallas futuras.<br>  - <b>5 - Notifications (notificaciones):</b> Eventos normales pero significativos (ej. una interfaz pasó a estado UP o DOWN).<br>  - <b>6 - Informational (informativo):</b> Mensajes operativos de rutina.<br>  - <b>7 - Debugging (depuración):</b> Salida sumamente detallada de análisis de protocolos (consume gran procesamiento de CPU).<br><br>• <b>Formato del Mensaje Syslog en Cisco:</b><br>  <code>%FACILITY-SEVERITY-MNEMONIC: Description</code>.<br>  Ejemplo: <code>%LINK-3-UPDOWN: Interface FastEthernet0/1, changed state to down</code> (Facility: LINK, Severidad: 3, Mnemonic: UPDOWN).<br><br>• <b><span class=\"concept\" data-term=\"snmp\">SNMP</span> (Simple Network Management Protocol):</b> Utiliza puertos UDP 161 (consultas) y UDP 162 (Traps/alertas proactivas). Emplea MIBs y OIDs para medir en tiempo real el consumo de memoria, temperatura de chasis y tráfico en megabits por boca. SNMPv3 es el único recomendado por incorporar autenticación con hash (SHA) y cifrado de paquetes (AES).<br>• <b><span class=\"concept\" data-term=\"tftp\">TFTP</span> / FTP / SCP:</b> Protocolos de transferencia utilizados para realizar copias de respaldo de las imágenes del sistema operativo Cisco IOS (archivos <code>.bin</code>) y de la configuración de arranque (<code>startup-config</code>).',
        tasks: [ { id: 't1', text: 'Comando: logging 192.168.1.10', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('logging')); }
    },
    {
        id: '4.4',
        tier: 'DOMINIO 4: SERVICIOS IP',
        title: 'Mecanismos de Calidad de Servicio (QoS): Priorización y Control de Congestión',
        desc: '<b>Objetivo:</b> Comprender los parámetros de degradación de red y los modelos de priorización para tráfico crítico sensible al retardo.<br><br><b>¿Por qué lo hacemos?:</b> Cuando un enlace de red se satura al 100% de su capacidad (por ejemplo, varios empleados descargando archivos pesados o videos 4K), los paquetes se acumulan en la cola de salida y empiezan a descartarse. Si una llamada telefónica de Voz sobre IP (VoIP) o una videoconferencia sufre pérdida de paquetes o retrasos variables, la voz se entrecorta, se vuelve robótica y la comunicación se corta.<br><br><b>¿Para qué sirve?:</b> Implementa reglas en los conmutadores y routers para clasificar el tráfico, marcar paquetes y colocarlos en colas preferenciales de atención rápida (VIP) antes de atender el tráfico web o de correo.<br><br><b>Beneficios:</b> Llamadas de voz cristalinas, sesiones de telemedicina ininterrumpidas y rendimiento predecible de aplicaciones de negocio en horas pico.<br><br><b>Instrucción:</b> En la consola ejecuta <code>acknowledge qos</code>.',
        theory: '<b>📘 Parámetros de Rendimiento y Modelos Arquitecturales de <span class=\"concept\" data-term=\"qos\">QoS</span></b><br><br>• <b>Factores Críticos de Degradación:</b><br>  - <b>Latencia (Delay):</b> El tiempo que tarda un paquete en viajar de origen a destino. Para telefonía <span class=\"concept\" data-term=\"ip\">IP</span> debe ser estrictamente <b>menor a 150 milisegundos</b>.<br>  - <b>Jitter (Variación del retardo):</b> La fluctuación en el tiempo de llegada entre paquetes consecutivos. Para voz debe mantenerse <b>por debajo de 30 milisegundos</b>.<br>  - <b>Pérdida de Paquetes (Packet Loss):</b> Porcentaje de paquetes descartados por desborde de buffer. Para VoIP la pérdida máxima tolerable no puede superar el <b>1%</b>.<br><br>• <b>Modelos de Implementación de QoS:</b><br>  1. <b>Best Effort (Mejor Esfuerzo):</b> Comportamiento estándar de Internet. Todos los paquetes se tratan por igual según orden de llegada (FIFO - First In, First Out). Sin garantías.<br>  2. <b>IntServ (Servicios Integrados):</b> Reserva estricta de ancho de banda extremo a extremo mediante el protocolo RSVP antes de emitir datos. Altamente ineficiente y no escalable en redes grandes.<br>  3. <b>DiffServ (Servicios Diferenciados):</b> El estándar corporativo moderno. Clasifica y marca los paquetes en el borde de la red:<br>     - En <span class=\"concept\" data-term=\"capa2\">Capa 2</span>: Campo <b>CoS (Class of Service - 3 bits)</b> dentro de la etiqueta <span class=\"concept\" data-term=\"8021q\">802.1Q</span>.<br>     - En <span class=\"concept\" data-term=\"capa3\">Capa 3</span>: Campo <b>DSCP (Differentiated Services Code Point - 6 bits)</b> dentro del byte ToS del encabezado IPv4.<br>     - Los routers leen el código DSCP en cada salto y aplican técnicas de encolado prioritario como <b>LLQ (Low Latency Queuing)</b> para despachar la voz de inmediato sin importar cuánta congestión exista.',
        tasks: [ { id: 't1', text: 'Comando: acknowledge qos', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('acknowledge qos'); }
    },
    {
        id: '4.5',
        tier: 'DOMINIO 4: SERVICIOS IP',
        title: 'Relevo de Difusión: DHCP Relay Agent con IP Helper-Address',
        desc: '<b>Objetivo:</b> Configurar el reenvío de solicitudes DHCP en difusión para que atraviesen interfaces de enrutamiento hacia un servidor centralizado.<br><br><b>¿Por qué ejecutamos estos comandos?:</b> Por diseño fundamental de la arquitectura IP, los routers bloquean y destruyen todas las transmisiones de difusión (Broadcast 255.255.255.255) para evitar que las redes se inunden. Como las computadoras que buscan IP inician el proceso enviando paquetes DHCP Discover en broadcast, si el servidor DHCP de la empresa está ubicado en otra subred o en el data center central, el cliente jamás recibirá una dirección IP y se autoasignará una dirección inservible APIPA (169.254.x.x).<br><br><b>¿Para qué sirve cada comando?:</b><br>1. <code>interface g0/1</code>: Selecciona la interfaz del router conectada a la subred de los usuarios clientes.<br>2. <code>ip helper-address 192.168.1.100</code>: Activa la función de agente de relevo (Relay Agent). Toma los paquetes de difusión DHCP de los clientes en el puerto UDP 67, les coloca una cabecera Unicast dirigida expresamente a la IP del servidor central (192.168.1.100) y registra en el campo <code>giaddr</code> su propia IP para que el servidor sepa de qué rango de subred debe prestar la IP.<br><br><b>¿Qué beneficios trae?:</b> Evita tener que comprar e instalar un servidor DHCP físico en cada piso o sucursal de la empresa, centralizando el control en el centro de datos.<br><br><b>Instrucción:</b> En el <b>Router</b> ingresa a <code>interface g0/1</code> y ejecuta el comando.',
        theory: '<b>📘 Operación del Agente de Relevo y Puertos UDP Interceptados</b><br><br>• <b>Mecanismo de Reenvío (<span class=\"concept\" data-term=\"broadcast\">Broadcast</span> a Unicast):</b><br>  1. Cliente emite <span class=\"concept\" data-term=\"dhcp\">DHCP</span> Discover como broadcast de <span class=\"concept\" data-term=\"capa2\">Capa 2</span> (<code>FFFF.FFFF.FFFF</code>) y <span class=\"concept\" data-term=\"capa3\">Capa 3</span> (<code>255.255.255.255</code>).<br>  2. El router intercepta el paquete en su interfaz local.<br>  3. En lugar de descartarlo, el comando <code>ip helper-address</code> reescribe la <span class=\"concept\" data-term=\"ip\">IP</span> de origen poniendo la IP de la interfaz local del router, pone como IP de destino la IP del servidor DHCP corporativo (<code>192.168.1.100</code>) y enruta el paquete normalmente.<br>  4. El servidor DHCP lee el paquete unicast, revisa el campo <code>giaddr</code> (Gateway IP Address), selecciona el pool correspondiente a esa subred y responde al router de la misma forma.<br><br>• <b>Puertos de Difusión UDP que el Helper Reenvía por Defecto en Cisco:</b><br>  - Puerto 37: Time service.<br>  - Puerto 49: TACACS service.<br>  - Puerto 53: DNS (Domain Name System).<br>  - Puertos 67 y 68: BOOTP / DHCP Server y Client.<br>  - Puerto 69: <span class=\"concept\" data-term=\"tftp\">TFTP</span> (Trivial File Transfer Protocol).<br>  - Puertos 137 y 138: NetBIOS Name y Datagram service.',
        tasks: [ { id: 't1', text: 'Comando: ip helper-address 192.168.1.100', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('ip helper-address') || c.includes('helper-address')); }
    },
    {
        id: '4.6',
        tier: 'DOMINIO 4: SERVICIOS IP',
        title: 'Servicios de Nombres de Dominio (DNS) y Seguridad Web HTTPS/TLS',
        desc: '<b>Objetivo:</b> Analizar el árbol jerárquico de resolución de nombres DNS y el protocolo seguro de transferencia de hipertexto HTTPS.<br><br><b>¿Por qué lo hacemos?:</b> Los seres humanos recordamos nombres de dominio (como cisco.com o portal.empresa.local), mientras que los procesadores de los switches y routers sólo pueden conmutar paquetes basándose en números binarios IP de 32 o 128 bits. Sin un sistema DNS que resuelva nombres en milisegundos, ninguna aplicación web corporativa funcionaría para el usuario común.<br><br><b>¿Para qué sirve?:</b> Permite que el sistema operativo de cualquier computadora consulte a servidores recursivos y autoritativos para descubrir la dirección IP real asociada a un nombre de host.<br><br><b>Beneficios:</b> Navegación amigable, balanceo geográfico de servidores mediante registros DNS y canales de comunicación web 100% cifrados mediante TLS.<br><br><b>Instrucción:</b> En la consola ejecuta <code>acknowledge dns</code>.',
        theory: '<b>📘 Arquitectura Jerárquica DNS y Protocolo Seguro HTTPS</b><br><br>• <b>Estructura Jerárquica de DNS (Puerto UDP y TCP 53):</b><br>  - <b>Servidores Raíz (Root Servers - \".\"):</b> 13 identidades de servidores raíz mundiales (nombrados de la A a la M) coordinados por ICANN que orientan las consultas hacia los TLDs.<br>  - <b>Top-Level Domains (TLDs):</b> Dominios genéricos (<code>.com</code>, <code>.org</code>, <code>.edu</code>) y de código de país (<code>.ar</code>, <code>.es</code>, <code>.mx</code>).<br>  - <b>Servidores Autoritativos:</b> Servidores que poseen los registros oficiales y finales de una zona específica (ej. la zona corporativa de <code>cisco.com</code>).<br><br>• <b>Tipos de Registros DNS Cruciales para el CCNA:</b><br>  - <b>Registro A:</b> Mapea un nombre FQDN a una dirección <b>IPv4</b> (ej. <code>server1.lab.local -> 192.168.1.50</code>).<br>  - <b>Registro AAAA (Quad-A):</b> Mapea un nombre a una dirección <b>IPv6</b> (ej. <code>2001:db8::50</code>).<br>  - <b>Registro CNAME (Canonical Name):</b> Alias que apunta un nombre hacia otro nombre oficial.<br>  - <b>Registro MX (Mail Exchange):</b> Identifica los servidores de correo autorizados para recibir mensajes del dominio.<br>  - <b>Registro PTR:</b> Resolución inversa (mapea una <span class=\"concept\" data-term=\"ip\">dirección IP</span> hacia su nombre FQDN).<br><br>• <b>HTTP vs HTTPS (TLS):</b><br>  - HTTP opera sobre TCP 80 sin seguridad; las contraseñas y datos viajan en texto plano.<br>  - HTTPS opera sobre TCP 443; antes de transferir hipertexto, realiza un saludo criptográfico TLS (Transport Layer Security) donde el servidor entrega un certificado digital X.509 autenticado por una Autoridad Certificadora (CA) y negocia el cifrado simétrico de toda la sesión.',
        tasks: [ { id: 't1', text: 'Comando: acknowledge dns', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('acknowledge dns'); }
    },
    {
        id: '4.7',
        tier: 'DOMINIO 4: SERVICIOS IP',
        title: 'Diagnóstico de Resolución de Nombres: Consultas con Nslookup',
        desc: '<b>Objetivo:</b> Ejecutar consultas directas al servidor DNS para diagnosticar fallas de resolución de nombres de dominio.<br><br><b>¿Por qué ejecutamos este comando?:</b> Cuando los usuarios reclaman que <i>\"se cayó Internet\"</i>, en el 70% de los incidentes de soporte la conectividad IP física está perfecta pero el servidor DNS asignado dejó de responder o no tiene cargado el registro del servidor corporativo. La herramienta Nslookup permite interrogar directamente al servidor DNS aislando la falla.<br><br><b>¿Para qué sirve el comando?:</b><br><code>nslookup cisco.com</code>: Emite una consulta DNS en el puerto UDP 53 preguntando por el Registro A del dominio; el servidor responde informando la IP del servidor que respondió y la dirección IP pública asociada al nombre consultado.<br><br><b>¿Qué beneficios trae?:</b> Detección instantánea de servidores DNS caídos, verificación de propagación de registros de zona y validación de conectividad web.<br><br><b>Instrucción:</b> En la terminal de la <b>Laptop</b> ejecuta <code>nslookup cisco.com</code>.',
        theory: '<b>📘 Diagnóstico Avanzado de DNS con Nslookup</b><br><br>• <b>Comportamiento de Nslookup:</b><br>  - Envía consultas recursivas al servidor DNS primario configurado en la tarjeta de red (o uno especificado manualmente, ej. <code>nslookup cisco.com 8.8.8.8</code>).<br>  - <b>Respuesta No Autoritativa (Non-authoritative answer):</b> Significa que el servidor que nos respondió no es el dueño original del dominio, sino que obtuvo la IP consultando a otros servidores de Internet y guardó el resultado en su memoria caché temporal (TTL).<br><br>• <b>Filtrado por Tipo de Registro (Modo Interactivo):</b><br>  - <code>set type=mx</code>: Consulta exclusivamente servidores de correo corporativo.<br>  - <code>set type=ns</code>: Consulta los servidores de nombres autoritativos del dominio.<br>  - <code>set type=ptr</code>: Realiza resolución inversa (busca qué nombre corresponde a una <span class=\"concept\" data-term=\"ip\">dirección IP</span>).',
        tasks: [ { id: 't1', text: 'Comando: nslookup cisco.com', done: false } ],
        check: function() { 
            return window.cmdHistory && window.cmdHistory.some(c => c.startsWith('nslookup ')); 
        }
    },

    // ==========================================
    // DOMINIO 5: FUNDAMENTOS DE SEGURIDAD (15%)
    // ==========================================
    {
        id: '5.1',
        tier: 'DOMINIO 5: SEGURIDAD',
        title: 'Vectores de Amenazas Cibernéticas y Redes Privadas Virtuales (VPN)',
        desc: '<b>Objetivo:</b> Analizar los ataques más frecuentes en infraestructura y la protección de datos mediante túneles IPsec.<br><br><b>¿Por qué lo hacemos?:</b> Cuando los datos salen del edificio de la empresa hacia la Internet pública, viajan a través de conmutadores y cables submarinos pertenecientes a terceros. Si el tráfico no está blindado criptográficamente, cualquier atacante en la ruta puede realizar ataques de espionaje (Eavesdropping), manipulación de datos o secuestro de sesiones.<br><br><b>¿Para qué sirve?:</b> Crea un canal cifrado virtual seguro sobre una red inherentemente insegura como Internet, de modo que las sucursales remotas o teletrabajadores operen como si estuvieran físicamente dentro de la misma oficina.<br><br><b>Beneficios:</b> Confidencialidad total (AES), integridad de paquetes (HMAC) y autenticación mutua de extremos sin costear carísimas líneas privadas dedicadas.<br><br><b>Instrucción:</b> En la consola ejecuta <code>acknowledge threats</code>.',
        theory: '<b>📘 Vectores de Ataque Modernos y Arquitectura de VPNs IPsec</b><br><br>• <b>Amenazas Más Comunes en Redes Corporativas:</b><br>  - <b>Phishing / Ingeniería Social:</b> Engaño al usuario final para que entregue credenciales o descargue ejecutables maliciosos.<br>  - <b>Man-in-the-Middle (MitM):</b> El atacante intercepta la comunicación entre cliente y servidor haciéndose pasar por el intermediario legítimo.<br>  - <b>DDoS (Ataque de Denegación de Servicio Distribuido):</b> Cientos de computadoras botnet inundan de paquetes el router de entrada hasta agotar su memoria y colapsar el enlace.<br><br>• <b>Arquitectura de Redes Privadas Virtuales (VPN):</b><br>  1. <b>Site-to-Site (Sitio a Sitio):</b> Enlaza de forma permanente dos routers o firewalls perimetrales (ej. Casa Matriz y Fábrica remota). Los usuarios de ambas oficinas se comunican de manera totalmente transparente.<br>  2. <b>Remote Access (Acceso Remoto):</b> Un usuario móvil desde su laptop o teléfono enciende un cliente de software (ej. Cisco AnyConnect / Secure Client) y establece un túnel SSL o IPsec cifrado contra el concentrador VPN corporativo.<br><br>• <b>El Framework Criptográfico de IPsec:</b><br>  - <b>IKE (Internet Key Exchange - UDP 500/4500):</b> Negocia parámetros de seguridad y genera claves compartidas mediante Diffie-Hellman.<br>  - <b>ESP (Encapsulating Security Payload - Protocolo <span class=\"concept\" data-term=\"ip\">IP</span> 50):</b> Cifra el paquete completo garantizando confidencialidad (AES-GCM o AES-256) e integridad (SHA-256).',
        tasks: [ { id: 't1', text: 'Comando: acknowledge threats', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('acknowledge threats'); }
    },
    {
        id: '5.2',
        tier: 'DOMINIO 5: SEGURIDAD',
        title: 'Control de Acceso Centralizado (AAA): Framework RADIUS y TACACS+',
        desc: '<b>Objetivo:</b> Desacoplar las cuentas de usuario locales de los equipos habilitando el modelo de seguridad AAA.<br><br><b>¿Por qué ejecutamos este comando?:</b> Si una organización tiene 400 routers y conmutadores y administra las cuentas de los ingenieros localmente en cada equipo, el día que un empleado de IT renuncia o es despedido habría que ingresar manualmente a los 400 equipos en minutos para borrar su clave; si se olvida uno solo, el ex-empleado puede entrar por la puerta trasera. Además, las cuentas locales no permiten auditar con precisión qué comandos ejecutó cada persona.<br><br><b>¿Para qué sirve el comando?:</b><br><code>aaa new-model</code>: Activa el framework de seguridad avanzada en Cisco IOS. Deshabilita los métodos de login primitivos y le ordena al router: <i>\"A partir de hoy, cuando alguien intente entrar a administrarte, no revises contraseñas locales; comunícate con el Servidor Central de Seguridad (Cisco ISE) para autenticar, autorizar y registrar cada acción\"</i>.<br><br><b>¿Qué beneficios trae?:</b> Revocación de accesos instantánea en toda la empresa con 1 solo clic en el servidor central, políticas de privilegios granulares y trazabilidad legal de cada comando ejecutado.<br><br><b>Instrucción:</b> En el <b>Router</b> ingresa a modo config y ejecuta el comando.',
        theory: '<b>📘 Los 3 Pilares del Framework AAA: Authentication, Authorization & Accounting</b><br><br>• <b>1. Authentication (Autenticación):</b> <i>\"¿Quién eres y demuéstralo?\"</i>. El usuario ingresa usuario y contraseña (o certificado). El router consulta al servidor RADIUS/TACACS+ si las credenciales son válidas.<br>• <b>2. Authorization (Autorización):</b> <i>\"¿Qué tienes permitido hacer exactamente?\"</i>. Una vez dentro, si el usuario intenta tipear <code>reload</code> (reiniciar el equipo), el servidor autoriza o bloquea el comando según su nivel de privilegio asignado.<br>• <b>3. Accounting (Contabilidad / Auditoría):</b> <i>\"¿Qué hiciste, cuándo y qué alteraste?\"</i>. Genera registros de auditoría forense con marca de tiempo exacta de la sesión, comandos tipeados y bytes transferidos.<br><br>• <b>Comparativa de Protocolos de Seguridad Centralizada:</b><br>  - <b>TACACS+ (Terminal Access Controller Access-Control System Plus - Cisco):</b><br>    - Diseñado expresamente para <b>Administración de Dispositivos</b> de red.<br>    - Opera sobre <b>TCP puerto 49</b> (orientado a conexión confiable).<br>    - Separa completamente los procesos de Autenticación, Autorización y Contabilidad.<br>    - <b>Cifra el paquete completo</b> de extremo a extremo, brindando máxima confidencialidad.<br>  - <b>RADIUS (Remote Authentication Dial-In User Service - Estándar IETF RFC 2865):</b><br>    - Diseñado originalmente para <b>Control de Acceso de Usuarios Finales</b> a la red (ej. autenticación Wi-Fi corporativo 802.1X, VPNs).<br>    - Opera sobre <b>UDP puertos 1812 (Auth) y 1813 (Accounting)</b>.<br>    - Combina Autenticación y Autorización en un solo proceso.<br>    - Sólo cifra el campo de la contraseña; el resto del paquete viaja en texto plano.',
        tasks: [ { id: 't1', text: 'Comando: aaa new-model', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('aaa new-model')); }
    },
    {
        id: '5.3',
        tier: 'DOMINIO 5: SEGURIDAD',
        title: 'Filtrado de Tráfico de Capa 3: Listas de Control de Acceso Estándar (ACL)',
        desc: '<b>Objetivo:</b> Crear una regla de control perimetral basada exclusivamente en la dirección IP de origen.<br><br><b>¿Por qué ejecutamos este comando?:</b> Para proteger servidores de misión crítica o aislar computadoras que hayan sido identificadas como infectadas con malware, se requiere un mecanismo de filtrado en el hardware del router que descarte paquetes antes de que alcancen recursos vitales de la empresa.<br><br><b>¿Para qué sirve el comando?:</b><br><code>access-list 10 deny 192.168.1.50</code>: Registra la regla número 10 en la tabla de inspección del router: <i>\"Revisa el encabezado de Capa 3 de cada paquete; si la dirección IP de origen es exactamente 192.168.1.50, descártalo inmediatamente sin procesarlo ni reenviarlo\"</i>.<br><br><b>¿Qué beneficios trae?:</b> Bloqueo inmediato de hosts sospechosos o no autorizados a nivel de hardware con consumo mínimo de procesamiento.<br><br><b>Instrucción:</b> En el <b>Router</b> (modo config) ejecuta el comando.',
        theory: '<b>📘 Arquitectura y Reglas Críticas de Listas de Control de Acceso (<span class=\"concept\" data-term=\"acl\">ACLs</span>)</b><br><br>• <b>Rangos Numéricos en Cisco IOS:</b><br>  - <b>ACLs Estándar:</b> 1 a 99 y rango expandido 1300 a 1999.<br>  - <b>ACLs Extendidas:</b> 100 a 199 y rango expandido 2000 a 2699.<br><br>• <b>Características Estrictas de una ACL Estándar:</b><br>  - Evalúan <b>ÚNICAMENTE la <span class=\"concept\" data-term=\"ip\">dirección IP</span> de origen</b>. No tienen la capacidad de inspeccionar el destino, ni el protocolo, ni los números de puerto de aplicación.<br>  - <b>Máscara Wildcard (Comodín):</b> Representa la inversa matemática de la máscara de subred (un bit en 0 significa que debe coincidir obligatoriamente; un bit en 1 significa que no importa). Si no se especifica wildcard (como en este ejercicio), Cisco IOS asume <code>0.0.0.0</code> (equivalente a <code>host 192.168.1.50</code>).<br><br>• <b>Regla de Oro de Ubicación para el CCNA:</b><br>  - <b>Las ACLs Estándar deben ubicarse lo más cerca posible del DESTINO:</b> Dado que solo filtran por origen, si colocas una ACL estándar cerca del origen de la computadora, le bloquearás no solo el acceso al servidor prohibido, sino también su salida a Internet y a cualquier otra red legítima.<br><br>• <b>Procesamiento Secuencial y el Deny Any Implícito:</b><br>  1. Las reglas se evalúan en estricto orden de arriba hacia abajo (Top-Down). En cuanto un paquete coincide con una regla, se ejecuta la acción (permit o deny) y se detiene la evaluación.<br>  2. <b>Deny Any Implícito al Final:</b> Al final de TODA lista de acceso existe una regla invisible no escrita que dice: <code>deny any</code>. Si creas una ACL que sólo contiene sentencias <code>deny</code> y la aplicas a una interfaz, <b>bloquearás absolutamente todo el tráfico de la empresa</b>. Toda ACL requiere al menos una regla <code>permit</code> para ser funcional.<br><br>• <b>Aplicación a la Interfaz:</b> Una ACL creada no hace nada en memoria hasta que se aplica a una interfaz en dirección de entrada o salida:<br>  <code>interface g0/0 -> ip access-group 10 in</code>.',
        tasks: [ { id: 't1', text: 'Comando: access-list 10 deny 192.168.1.50', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('access-list 10')); }
    },
    {
        id: '5.4',
        tier: 'DOMINIO 5: SEGURIDAD',
        title: 'Protección de Capa 2: Mitigación de Ataques MitM con Dynamic ARP Inspection (DAI)',
        desc: '<b>Objetivo:</b> Habilitar la inspección dinámica de tramas ARP en el conmutador para bloquear ataques de envenenamiento de tablas (ARP Spoofing).<br><br><b>¿Por qué ejecutamos este comando?:</b> El protocolo ARP tradicional es ciego y confía ingenuamente en cualquier mensaje que reciba. Un atacante interno en la oficina puede ejecutar un programa en su laptop (como Ettercap o Cain) y enviar miles de respuestas ARP falsas a todas las computadoras diciendo: <i>\"Yo soy el Gateway 192.168.1.1, asocien mi dirección MAC\"</i>. Todas las PCs de los directivos comenzarán a enviarle sus datos y claves al atacante antes de que salgan a Internet (ataque Man-in-the-Middle).<br><br><b>¿Para qué sirve el comando?:</b><br><code>ip arp inspection vlan 10</code>: Enciende el motor de seguridad de inspección profunda de Capa 2 en el switch para la VLAN 10. Cada vez que una trama ARP ingrese por un puerto, el switch interceptará el paquete y validará si la relación entre la dirección IP y la dirección MAC es legítima, descartando y bloqueando el puerto del atacante si detecta una mentira.<br><br><b>¿Qué beneficios trae?:</b> Inmunidad contra interceptación interna de contraseñas, secuestro de tráfico y ataques Man-in-the-Middle en la red de acceso.<br><br><b>Instrucción:</b> En el <b>Switch</b> (modo config) ejecuta el comando.',
        theory: '<b>📘 El Ecosistema de Seguridad de <span class=\"concept\" data-term=\"capa2\">Capa 2</span>: Snooping + <span class=\"concept\" data-term=\"dai\">DAI</span> + <span class=\"concept\" data-term=\"port_sec\">Port Security</span></b><br><br>• <b>¿Cómo funciona Dynamic ARP Inspection (DAI)?:</b><br>  DAI no puede operar de forma aislada; depende de que previamente esté activado <b><span class=\"concept\" data-term=\"dhcp\">DHCP</span> Snooping</b>.<br>  1. Cuando un usuario legítimo enciende su PC y pide <span class=\"concept\" data-term=\"ip\">IP</span> por DHCP, el switch intercepta la respuesta y anota en su memoria segura (DHCP Snooping Binding Database): <code>IP 192.168.10.50 pertenece a MAC AAAA.BBBB.CCCC en el puerto Fa0/5</code>.<br>  2. Cuando un atacante intenta emitir una respuesta ARP falsa intentando suplantar una IP que no le fue asignada, DAI consulta la base de datos de Snooping.<br>  3. Al descubrir que la MAC del atacante no coincide con la IP reclamada, el switch descarta la trama ARP y genera una alerta <span class=\"concept\" data-term=\"syslog\">Syslog</span>.<br><br>• <b>Puertos Confiables vs No Confiables (Trust vs Untrusted):</b><br>  - Por defecto, todos los puertos del switch son <b>Untrusted</b> (inspeccionados rigurosamente).<br>  - Los enlaces hacia otros switches y routers legítimos deben marcarse explícitamente como confiables para no bloquear tráfico válido:<br>    <code>interface f0/2 -> ip arp inspection trust</code>.<br><br>• <b>Port Security (Seguridad de Puerto):</b><br>  Limita la cantidad de <span class=\"concept\" data-term=\"mac\">direcciones MAC</span> permitidas en un puerto de acceso físico.<br>  - Activar: <code>switchport port-security</code>.<br>  - Cantidad máxima: <code>switchport port-security maximum 1</code>.<br>  - Aprendizaje dinámico persistente: <code>switchport port-security mac-address sticky</code>.<br>  - Modos de violación (<code>switchport port-security violation [protect | restrict | shutdown]</code>):<br>    - <b>Protect:</b> Descarta paquetes de MACs no autorizadas en silencio.<br>    - <b>Restrict:</b> Descarta paquetes de MACs no autorizadas, envía alerta Syslog e incrementa contador de violación.<br>    - <b>Shutdown:</b> Apaga la interfaz de inmediato y la deja en estado <code>err-disabled</code> (requiere intervención manual para rehabilitar).',
        tasks: [ { id: 't1', text: 'Comando: ip arp inspection vlan 10', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('arp inspection')); }
    },
    {
        id: '5.5',
        tier: 'DOMINIO 5: SEGURIDAD',
        title: 'Evolución de la Seguridad Inalámbrica: WPA2, WPA3 y Autenticación 802.1X',
        desc: '<b>Objetivo:</b> Analizar el cifrado Wi-Fi personal (PSK) frente a la seguridad de clase empresarial y la mitigación de ataques de diccionario.<br><br><b>¿Por qué lo hacemos?:</b> Las ondas de radiofrecuencia atraviesan paredes y llegan a la calle o al estacionamiento del edificio. Cualquier persona con una laptop equipada con antena direccional puede capturar el tráfico inalámbrico. Utilizar protocolos obsoletos como WEP o WPA original permite que un hacker penetre la red corporativa en menos de 5 minutos.<br><br><b>¿Para qué sirve?:</b> Define los mecanismos criptográficos de negociación de claves temporales de sesión para que cada dispositivo mantenga un canal inalámbrico blindado.<br><br><b>Beneficios:</b> Protección total contra robo de contraseñas por escucha pasiva y autenticación centralizada de empleados.<br><br><b>Instrucción:</b> En la consola ejecuta <code>acknowledge wpa</code>.',
        theory: '<b>📘 Criptografía Inalámbrica: De WEP a WPA3 y Enterprise</b><br><br>• <b>WPA2-Personal (Pre-Shared Key - PSK):</b><br>  - Emplea cifrado robusto <b>AES con CCMP</b> (Counter Mode Cipher Block Chaining Message Authentication Code Protocol).<br>  - <b>Vulnerabilidad Crítica del 4-Way Handshake:</b> Cuando un cliente se asocia, intercambia 4 paquetes con el AP. Un atacante puede grabar pasivamente ese intercambio con herramientas como Aircrack-ng, llevárselo a su casa y ejecutar ataques de fuerza bruta offline contra diccionarios sin que nadie en la empresa lo detecte.<br><br>• <b>WPA3 (La Revolución Moderna):</b><br>  - <b>SAE (Simultaneous Authentication of Equals):</b> Reemplaza el intercambio PSK por un protocolo de acuerdo de claves basado en criptografía de curvas elípticas (algoritmo Dragonfly).<br>  - <b>Inmunidad ante Ataques Offline:</b> El atacante sólo tiene una oportunidad por intento en línea; no puede calcular hashes en su computadora.<br>  - <b>Forward Secrecy:</b> Aunque alguien logre descifrar la clave de la red Wi-Fi en el futuro, no podrá descifrar las sesiones de tráfico que haya grabado en el pasado.<br>  - <b>Protected Management Frames (PMF):</b> Obligatorio en WPA3; impide ataques de desautenticación donde un atacante envía tramas falsificadas para expulsar a los usuarios de la red Wi-Fi.<br><br>• <b>Modo WPA2/WPA3 Enterprise (IEEE 802.1X):</b><br>  No utiliza contraseñas compartidas. Cada empleado se autentica con su usuario y contraseña corporativa individual (o certificado digital instalado en la máquina) validado por un servidor RADIUS central (Cisco ISE) mediante túneles EAP (EAP-TLS o PEAP). Si un empleado renuncia, se desactiva su cuenta en Active Directory y pierde acceso Wi-Fi al instante.',
        tasks: [ { id: 't1', text: 'Comando: acknowledge wpa', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('acknowledge wpa'); }
    },
    {
        id: '5.6',
        tier: 'DOMINIO 5: SEGURIDAD',
        title: 'Filtrado Granular en Capa 4: Listas de Control de Acceso Extendidas (ACL)',
        desc: '<b>Objetivo:</b> Configurar una regla de firewall en el router para bloquear selectivamente tráfico web HTTP hacia un servidor sin interrumpir otros servicios.<br><br><b>¿Por qué ejecutamos este comando?:</b> Las ACLs estándar son demasiado primitivas: si bloqueas una IP de origen, bloqueas todo (la web, el correo, el acceso remoto SSH, etc.). Las redes corporativas necesitan reglas quirúrgicas: por ejemplo, permitir que los empleados consulten una base de datos o envíen correos electrónicos pero bloqueando exclusivamente la navegación web no productiva.<br><br><b>¿Para qué sirve el comando?:</b><br><code>access-list 100 deny tcp 192.168.1.0 0.0.0.255 any eq 80</code>: Registra la regla número 100 evaluando múltiples capas de la cabecera:<br>  - <code>tcp</code>: Inspecciona la Capa 4 de Transporte.<br>  - <code>192.168.1.0 0.0.0.255</code>: Subred IP de origen con su máscara wildcard correspondiente (/24).<br>  - <code>any</code>: Cualquier dirección IP de destino del mundo.<br>  - <code>eq 80</code>: Coincide exactamente con el puerto TCP de destino número 80 (servicio HTTP web sin cifrar).<br><br><b>¿Qué beneficios trae?:</b> Control granular de aplicaciones, ahorro de ancho de banda corporativo y bloqueo específico de servicios vulnerables.<br><br><b>Instrucción:</b> En el <b>Router</b> (modo config) ejecuta el comando.',
        theory: '<b>📘 Anatomía y Ubicación Óptima de <span class=\"concept\" data-term=\"acl\">ACLs</span> Extendidas</b><br><br>• <b>Rango Numérico:</b> 100 a 199 y 2000 a 2699 (o listas con nombre: <code>ip access-list extended [nombre]</code>).<br>• <b>Capacidades de Inspección Múltiple:</b><br>  Una ACL extendida puede evaluar en una sola línea:<br>  1. Protocolo de <span class=\"concept\" data-term=\"capa3\">Capa 3</span> o 4: <code>ip</code>, <code>tcp</code>, <code>udp</code>, <code>icmp</code>, <code>ospf</code>.<br>  2. Dirección <span class=\"concept\" data-term=\"ip\">IP</span> de origen y máscara wildcard.<br>  3. Puerto de origen (opcional, ej. <code>eq</code>, <code>gt</code>, <code>lt</code>, <code>range</code>).<br>  4. Dirección IP de destino y máscara wildcard.<br>  5. Puerto de destino (ej. <code>eq 80</code> HTTP, <code>eq 443</code> HTTPS, <code>eq 22</code> <span class=\"concept\" data-term=\"ssh\">SSH</span>, <code>eq 23</code> Telnet, <code>eq 53</code> DNS).<br>  6. Estado de conexión: palabra clave <code>established</code> (permite que las respuestas TCP ingresen sólo si fueron originadas previamente desde adentro).<br><br>• <b>Regla de Oro de Ubicación para el CCNA:</b><br>  - <b>Las ACLs Extendidas deben ubicarse lo más cerca posible del ORIGEN del tráfico:</b> Como son sumamente inteligentes y evalúan origen, destino y puerto exacto, deben filtrar el paquete en cuanto entra a la primera interfaz de la red. Si esperas a que el paquete viaje por toda la red empresarial hasta el destino para recién filtrarlo, habrás saturado inútilmente enlaces <span class=\"concept\" data-term=\"wan\">WAN</span> y routers de transporte.',
        tasks: [ { id: 't1', text: 'Comando: access-list 100 deny tcp ... eq 80', done: false } ],
        check: function() { 
            return window.cmdHistory && window.cmdHistory.some(c => c.includes('access-list 100') && c.includes('deny tcp')); 
        }
    },
    {
        id: '5.7',
        tier: 'DOMINIO 5: SEGURIDAD',
        title: 'Hardening de Dispositivos y Advertencia Jurídica: Banner MOTD Legal',
        desc: '<b>Objetivo:</b> Configurar el mensaje formal de advertencia legal (Message of the Day) que se despliega al intentar conectarse al equipo.<br><br><b>¿Por qué ejecutamos este comando?:</b> En auditorías de seguridad (como ISO 27001 o PCI-DSS) y en el código penal de telecomunicaciones, la configuración por defecto de un router que saluda diciendo <i>\"Welcome to Cisco Router\"</i> puede ser utilizada por abogados defensores de ciberdelincuentes como una invitación implícita de bienvenida. Un banner explícito de advertencia es un requisito legal mandatorio para poder presentar cargos penales por intrusión en un tribunal de justicia.<br><br><b>¿Para qué sirve el comando?:</b><br><code>banner motd ^C ACCESO SOLO PERSONAL AUTORIZADO ^C</code>: Guarda en la memoria del sistema el texto delimitado por el carácter de control <code>^C</code>. Este texto se estampa inmediatamente en la terminal de cualquier persona que intente conectarse por cable de consola, SSH o Telnet antes de solicitar credenciales.<br><br><b>¿Qué beneficios trae?:</b> Respaldo jurídico probatorio para acciones judiciales contra atacantes y disuasión psicológica contra intrusos casuales.<br><br><b>Instrucción:</b> En el <b>Router</b> o <b>Switch</b> (modo config) ejecuta el comando.',
        theory: '<b>📘 Buenas Prácticas Fundamentales de Hardening en Cisco IOS</b><br><br>• <b>Reglas de Redacción de un Banner Legal:</b><br>  - Jamás incluir palabras de bienvenida como \"Welcome\" o \"Bienvenido\".<br>  - No revelar detalles del equipo en el banner (evitar poner el modelo, número de serie o versión de IOS que faciliten la búsqueda de exploits en bases de datos CVE).<br>  - Expresar con claridad: <i>\"Acceso restringido exclusivamente a personal autorizado. Toda actividad es monitoreada y registrada. Los infractores serán procesados judicialmente con todo el peso de la ley\"</i>.<br><br>• <b>Otras Medidas Obligatorias de Fortalecimiento (Hardening) en Dispositivos de Red:</b><br>  1. <b>Apagar puertos no utilizados:</b> Seleccionar los puertos sin cablear y ejecutar <code>shutdown</code>, asignándolos a una <span class=\"concept\" data-term=\"vlan\">VLAN</span> de cuarentena aislada sin enrutamiento (VLAN Dead/Blackhole).<br>  2. <b>Desactivar servidores web inseguros:</b> <code>no ip http server</code> (apaga la interfaz web HTTP sin cifrar en puerto 80). Si se requiere interfaz gráfica, usar <code>ip http secure-server</code> (HTTPS).<br>  3. <b>Mitigar ataques de fuerza bruta en logins:</b><br>     <code>login block-for 120 attempts 3 within 30</code>: Si alguien falla 3 intentos de contraseña en un período de 30 segundos, el router bloquea el acceso de todo el mundo durante 2 minutos completos.<br>  4. <b>Temporizador de inactividad en sesiones (Exec-Timeout):</b> En <code>line con 0</code> y <code>line vty 0 4</code> configurar <code>exec-timeout 5 0</code> (si el administrador deja la terminal abierta y se aleja 5 minutos, la sesión se cierra automáticamente por seguridad).',
        tasks: [ { id: 't1', text: 'Comando: banner motd ^C ... ^C', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('banner motd')); }
    },
    {
        id: '5.8',
        tier: 'DOMINIO 5: SEGURIDAD',
        title: 'Auditoría Criptográfica de Sesiones: Verificación con Show SSH',
        desc: '<b>Objetivo:</b> Inspeccionar en tiempo real las sesiones de administración remota cifradas establecidas hacia el equipo.<br><br><b>¿Por qué ejecutamos este comando?:</b> El principio de defensa en profundidad exige verificar no solo que las reglas estén configuradas, sino auditar activamente quién está conectado al switch o router, qué versión del protocolo está utilizando y qué algoritmos de cifrado simétrico protegen la sesión.<br><br><b>¿Para qué sirve el comando?:</b><br><code>show ssh</code>: Consulta el subsistema criptográfico de Cisco IOS y despliega la tabla de sesiones SSH activas, informando la versión de SSH negociada (debe ser estrictamente 2.0), el cifrado en uso (ej. AES256-CBC), el algoritmo hash de integridad (HMAC-SHA1) y el nombre del usuario administrador conectado.<br><br><b>¿Qué beneficios trae?:</b> Detección temprana de conexiones no autorizadas, confirmación de cumplimiento de estándares de cifrado corporativo y control de acceso administrativo.<br><br><b>Instrucción:</b> En modo privilegiado (<code>#</code>) del <b>Switch</b> o <b>Router</b> ejecuta <code>show ssh</code>.',
        theory: '<b>📘 Criptografía de Sesión y Comandos de Auditoría <span class=\"concept\" data-term=\"ssh\">SSH</span></b><br><br>• <b>Análisis de la Salida de \"Show SSH\":</b><br>  - <b>Version 2.0:</b> Confirma que el equipo rechazó negociaciones con SSHv1 (inseguro).<br>  - <b>Encryption AES:</b> Cifrado simétrico de bloque de alto desempeño por hardware.<br>  - <b>Hmac SHA:</b> Código de autenticación de mensajes basado en hash para garantizar que ningún byte fue alterado en tránsito por un intermediario.<br><br>• <b>Comando Complementario:</b><br>  - <code>show ip ssh</code>: Despliega la configuración global del servidor SSH: estado de habilitación, versión, tiempo límite de autenticación (Authentication timeout, por defecto 120s) y cantidad máxima de reintentos de contraseña (Authentication retries, por defecto 3).',
        tasks: [ { id: 't1', text: 'Comando: show ssh', done: false } ],
        check: function() { 
            return window.cmdHistory && window.cmdHistory.some(c => c.includes('show ssh') || c.includes('sh ssh')); 
        }
    },

    // ==========================================
    // DOMINIO 6: AUTOMATIZACIÓN Y PROGRAMABILIDAD (10%)
    // ==========================================
    {
        id: '6.1',
        tier: 'DOMINIO 6: AUTOMATIZACIÓN',
        title: 'Redes Definidas por Software (SDN): Separación de Planos y Controladores',
        desc: '<b>Objetivo:</b> Analizar la evolución desde redes tradicionales hacia la separación de Planos de Datos, Control y Gestión mediante Controladores Centralizados.<br><br><b>¿Por qué lo hacemos?:</b> En una arquitectura de red tradicional de hace 30 años, cada router y conmutador tiene su propio cerebro independiente; si se necesita cambiar una política de calidad de servicio o una VLAN en 2,000 switches, ingenieros humanos deben ingresar equipo por equipo tipear comandos por consola CLI. Esto es lento, extremadamente costoso y propenso a errores humanos de tipeo que causan apagones de servicio.<br><br><b>¿Para qué sirve?:</b> Extrae el plano de control (el cerebro que toma decisiones de enrutamiento) fuera de los chasis físicos y lo centraliza en un software maestro (Controlador SDN como Cisco DNA Center o Cisco ACI).<br><br><b>Beneficios:</b> Aprovisionamiento de miles de equipos en segundos mediante plantillas basadas en intención (Intent-Based Networking), visibilidad global de la red en un solo panel web y reducción del 80% en costos operativos (OPEX).<br><br><b>Instrucción:</b> En la consola ejecuta <code>acknowledge sdn</code>.',
        theory: '<b>📘 Los Tres Planos de Operación de Red y la Arquitectura <span class=\"concept\" data-term=\"sdn\">SDN</span></b><br><br>• <b>1. Plano de Datos (Data Plane / Forwarding Plane):</b><br>  - Responsable de procesar y conmutar las tramas y paquetes reales que envían los usuarios a velocidad de cable.<br>  - Se ejecuta directamente sobre hardware especializado: circuitos integrados de aplicación específica (<b>ASICs</b>) y memorias direccionables por contenido ternario (<b>TCAM</b>).<br>  - Tareas: conmutar tramas <span class=\"concept\" data-term=\"mac\">MAC</span>, decrementar TTL de paquetes <span class=\"concept\" data-term=\"ip\">IP</span>, recalcular checksums y aplicar filtros de hardware.<br><br>• <b>2. Plano de Control (Control Plane):</b><br>  - El cerebro de la red. Ejecuta los algoritmos y protocolos que deciden qué camino deben tomar los paquetes.<br>  - Tareas: procesar paquetes <span class=\"concept\" data-term=\"ospf\">OSPF</span>/BGP, calcular el árbol <span class=\"concept\" data-term=\"stp\">Spanning Tree</span>, mantener tablas de vecinos y armar la tabla de enrutamiento (RIB) que luego se compila en el plano de datos mediante CEF (Cisco Express Forwarding).<br><br>• <b>3. Plano de Gestión (Management Plane):</b><br>  - Los métodos que utilizamos los administradores para interactuar y monitorear el equipo: <span class=\"concept\" data-term=\"ssh\">SSH</span>, Telnet, consola serie, <span class=\"concept\" data-term=\"snmp\">SNMP</span>, <span class=\"concept\" data-term=\"syslog\">Syslog</span> y APIs REST.<br><br>• <b>La Arquitectura SDN y sus Interfaces de Programación (APIs):</b><br>  - <b>Southbound APIs (Hacia el sur):</b> Protocolos mediante los cuales el Controlador Centralizado programa e inyecta configuraciones a los switches y routers físicos (OpenFlow, NETCONF, RESTCONF, gRPC).<br>  - <b>Northbound APIs (Hacia el norte):</b> Interfaces típicamente basadas en <b>APIs RESTful</b> mediante las cuales aplicaciones empresariales externas, sistemas de tickets (ServiceNow, GLPI) o scripts de Python se comunican con el Controlador SDN para solicitar cambios automáticamente.',
        tasks: [ { id: 't1', text: 'Comando: acknowledge sdn', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('acknowledge sdn'); }
    },
    {
        id: '6.2',
        tier: 'DOMINIO 6: AUTOMATIZACIÓN',
        title: 'Automatización basada en APIs RESTful y Formatos de Datos Estructurados (JSON)',
        desc: '<b>Objetivo:</b> Ejecutar una consulta API mediante el verbo HTTP GET para extraer telemetría estructurada en formato JSON desde un controlador de red.<br><br><b>¿Por qué ejecutamos este comando?:</b> El scraping de texto tradicional por consola CLI (hacer SSH y procesar texto con expresiones regulares) es frágil: si Cisco cambia una coma o un espacio en la versión de IOS, el script de Python colapsa. Las APIs modernas comunican máquinas mediante contratos de software predecibles y formatos estructurados estándar que cualquier lenguaje de programación procesa como diccionarios nativos en microsegundos.<br><br><b>¿Para qué sirve el comando?:</b><br><code>curl -X GET http://api/v1/status</code>: Emplea la herramienta cURL para emitir una solicitud HTTP con el método <b>GET</b> hacia la interfaz de programación del controlador; el servidor responde con un código de estado HTTP 200 OK y una carga útil estructurada en JSON con la salud y métricas de los dispositivos administrados.<br><br><b>¿Qué beneficios trae?:</b> Integración fluida entre software y red, consultas masivas de estado sin intervención humana y capacidad de construir tableros web de monitoreo en tiempo real.<br><br><b>Instrucción:</b> En la consola ejecuta el comando <code>curl -X GET http://api/v1/status</code>.',
        theory: '<b>📘 Principios RESTful y Formatos de Serialización de Datos</b><br><br>• <b>Los 4 Verbos Principales de APIs REST (Operaciones CRUD):</b><br>  - <b>GET (Read):</b> Consulta o lee el estado de un recurso sin alterarlo. Es idempotente y seguro (no genera cambios en el equipo).<br>  - <b>POST (Create):</b> Crea un nuevo objeto o recurso en el controlador (ej. crear una nueva <span class=\"concept\" data-term=\"vlan\">VLAN</span>).<br>  - <b>PUT / PATCH (Update):</b> Reemplaza o modifica los parámetros de un recurso existente.<br>  - <b>DELETE (Delete):</b> Elimina un recurso (ej. borrar una subinterfaz).<br><br>• <b>Códigos de Respuesta HTTP Comunes:</b><br>  - <code>200 OK</code>: Solicitud exitosa.<br>  - <code>201 Created</code>: Recurso creado exitosamente tras un POST.<br>  - <code>400 Bad Request</code>: Sintaxis JSON malformada enviada por el cliente.<br>  - <code>401 Unauthorized</code>: Falta token de autenticación o credenciales erróneas.<br>  - <code>403 Forbidden</code>: Autenticado pero sin privilegios suficientes.<br>  - <code>404 Not Found</code>: El recurso o URL no existe en el servidor.<br><br>• <b>Comparativa de Formatos de Datos en Redes:</b><br>  - <b>JSON (JavaScript Object Notation):</b> Pares clave-valor delimitados por llaves <code>{}</code> y listas delimitadas por corchetes <code>[]</code>. El estándar rey en APIs web y controladores <span class=\"concept\" data-term=\"sdn\">SDN</span>.<br>  - <b>YAML:</b> Formato ultra-limpio basado en indentación visual obligatoria sin llaves. Estándar indiscutido en la redacción de Playbooks de <b>Ansible</b>.<br>  - <b>XML:</b> Formato basado en etiquetas <code><tag></tag></code> ampliamente utilizado en protocolos tradicionales de gestión como NETCONF sobre modelos de datos YANG.',
        tasks: [ { id: 't1', text: 'Comando: curl -X GET http://api/v1/status', done: false } ],
        check: function() { 
            return window.cmdHistory && window.cmdHistory.some(c => c.toLowerCase().includes('curl') && c.toLowerCase().includes('status')); 
        }
    },
    {
        id: '6.3',
        tier: 'DOMINIO 6: AUTOMATIZACIÓN',
        title: 'Herramientas de Gestión de Configuración: Ansible, Puppet y Chef',
        desc: '<b>Objetivo:</b> Analizar herramientas de orquestación masiva y diferenciar arquitecturas con agente (Agent-based) frente a sin agente (Agentless).<br><br><b>¿Por qué lo hacemos?:</b> Mantener la coherencia de configuración (evitar el temido desvío de configuración o Configuration Drift) en una empresa con cientos de conmutadores es imposible si se hace de forma manual. Las herramientas de gestión de configuración permiten definir el estado deseado de toda la red en código (Infrastructure as Code - IaC) almacenado en repositorios Git.<br><br><b>¿Para qué sirve?:</b> Permite que un solo comando empuje políticas consistentes, actualizaciones de contraseñas y listas de acceso a miles de routers simultáneamente en segundos.<br><br><b>Beneficios:</b> Aprovisionamiento masivo, versionado de infraestructura con Git y eliminación total de errores de tipeo manual.<br><br><b>Instrucción:</b> En la consola ejecuta <code>acknowledge config-mgmt</code>.',
        theory: '<b>📘 Comparativa Técnica de Motores de Automatización de Infraestructura</b><br><br>• <b>Ansible (Propiedad de Red Hat):</b><br>  - <b>Arquitectura Sin Agente (Agentless):</b> Es el estándar favorito en redes. No requiere instalar ningún software ni demonio en el router; se conecta directamente mediante canales existentes como <b><span class=\"concept\" data-term=\"ssh\">SSH</span></b> o <b>NETCONF</b>.<br>  - <b>Lenguaje:</b> Utiliza archivos de configuración legibles en formato <b>YAML</b> denominados <b>Playbooks</b>.<br>  - <b>Modelo de Operación:</b> Basado en <b>Push</b> (la máquina de control de Ansible empuja los cambios activamente hacia los routers).<br>  - Desarrollado en Python.<br><br>• <b>Puppet:</b><br>  - <b>Arquitectura Con Agente (Agent-based):</b> Requiere tradicionalmente que un software agente se ejecute permanentemente en el sistema operativo del cliente (aunque cuenta con módulos proxy para conmutadores Cisco Nexus).<br>  - <b>Lenguaje:</b> Utiliza un lenguaje declarativo propio (Puppet DSL).<br>  - <b>Modelo de Operación:</b> Basado en <b>Pull</b> (el agente consulta periódicamente al servidor maestro cada 30 minutos y corrige cualquier discrepancia con el estado deseado).<br><br>• <b>Chef:</b><br>  - Basado en agentes (Agent-based) y modelo Pull.<br>  - Utiliza lenguaje Ruby puro para escribir las instrucciones denominadas <b>Cookbooks</b> y <b>Recipes</b>.<br><br>• <b>El Principio Fundamental de la Idempotencia:</b><br>  Una herramienta de automatización es <b>idempotente</b> cuando ejecutar el mismo playbook 1 vez o 1,000 veces produce exactamente el mismo resultado final sin generar cambios innecesarios. Si el router ya tiene la <span class=\"concept\" data-term=\"vlan\">VLAN</span> 10 configurada, Ansible detecta que el estado deseado ya se cumple y no toca la configuración.',
        tasks: [ { id: 't1', text: 'Comando: acknowledge config-mgmt', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('acknowledge config-mgmt'); }
    },
    {
        id: '6.4',
        tier: 'DOMINIO 6: AUTOMATIZACIÓN',
        title: 'Metodología Sistemática de Troubleshooting: Ping (ICMP) y Traceroute',
        desc: '<b>Objetivo:</b> Ejecutar pruebas de conectividad bidireccional y diagnosticar el salto exacto donde se interrumpe la comunicación de red.<br><br><b>¿Por qué ejecutamos este comando?:</b> Cuando un usuario dice <i>\"se cayó el sistema\"</i>, el ingeniero no puede empezar a reiniciar equipos a ciegas. La herramienta Ping permite comprobar en 2 segundos si el camino de ida y vuelta en Capa 3 está operativo, mientras que Traceroute permite descubrir en qué router exacto del trayecto se está perdiendo el tráfico.<br><br><b>¿Para qué sirve el comando?:</b><br><code>ping 8.8.8.8</code>: Envía una secuencia de paquetes de control ICMP Echo Request hacia la IP de destino y mide con un cronómetro de microsegundos el tiempo que tarda en llegar cada respuesta ICMP Echo Reply.<br><br><b>¿Qué beneficios trae?:</b> Confirmación instantánea de alcance en Capa 3, medición del tiempo de ida y vuelta (RTT) y diagnóstico rápido de congestión.<br><br><b>Instrucción:</b> En el <b>Router</b> o en la <b>Laptop</b> ejecuta <code>ping 8.8.8.8</code>.',
        theory: '<b>📘 Protocolo ICMP y Mecánica Interna de <span class=\"concept\" data-term=\"ping\">Ping</span> y <span class=\"concept\" data-term=\"traceroute\">Traceroute</span></b><br><br>• <b>Mapeo de Símbolos en el Ping de Cisco IOS:</b><br>  - <code>!</code> (Signo de exclamación): Éxito total. Se recibió el paquete Echo Reply dentro del tiempo de espera (timeout por defecto de 2 segundos).<br>  - <code>.</code> (Punto): Tiempo de espera agotado (Request timed out). Indica pérdida de paquetes, ruta no encontrada o firewall descartando ICMP.<br>  - <code>U</code>: Mensaje ICMP Unreachable recibido (el router no tiene ruta hacia ese destino o una <span class=\"concept\" data-term=\"acl\">ACL</span> lo bloqueó).<br><br>• <b>Mecánica Oculta de Traceroute (Cómo funciona la manipulación del campo TTL):</b><br>  1. Traceroute envía un primer paquete IP con el campo <b>TTL (Time to Live) establecido deliberadamente en 1</b>.<br>  2. El primer router en el camino recibe el paquete, decrementa el TTL a 0 y, según las normas del protocolo IP, está obligado a descartar el paquete y enviar de vuelta a nuestro equipo un mensaje <b>ICMP Time Exceeded (Tipo 11, Código 0)</b>. Gracias a esto, descubrimos la <span class=\"concept\" data-term=\"ip\">dirección IP</span> del primer router y medimos su latencia.<br>  3. Luego envía otro paquete con <b>TTL = 2</b>; el primer router lo pasa con TTL=1, y el segundo router lo descarta devolviendo su propio mensaje ICMP. Así sucesivamente hasta alcanzar la IP final.<br>  - <b>Diferencia de implementación:</b> Windows (<code>tracert</code>) utiliza paquetes ICMP Echo Requests; los sistemas Cisco y Linux (<code>traceroute</code>) utilizan por defecto datagramas UDP dirigidos a puertos altos no utilizados (puertos 33434+).',
        tasks: [ { id: 't1', text: 'Comando: ping 8.8.8.8', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.startsWith('ping ')); }
    },
    {
        id: '6.5',
        tier: 'DOMINIO 6: AUTOMATIZACIÓN',
        title: 'Inspección Diagnóstica de Operación: Show Interfaces, Version y Running-Config',
        desc: '<b>Objetivo:</b> Auditar contadores de hardware, verificar errores de CRC, discrepancias de dúplex y el estado del sistema operativo.<br><br><b>¿Por qué ejecutamos este comando?:</b> Muchas fallas de red no son caídas totales sino degradaciones intermitentes: aplicaciones lentas o transferencias que se congelan. Consultar los contadores de hardware de las interfaces permite descubrir si un cable de red está defectuoso, si hay interferencia electromagnética o si dos equipos están negociando mal la velocidad.<br><br><b>¿Para qué sirve el comando?:</b><br><code>show interfaces</code>: Despliega el estado de Capa 1 y Capa 2 de cada boca física, estadísticas de bits por segundo y los contadores acumulados de colisiones y errores de verificación por redundancia cíclica (CRC).<br><br><b>¿Qué beneficios trae?:</b> Localización inmediata de cables dañados, resolución de problemas de lentitud y verificación del estado operativo general del equipamiento.<br><br><b>Instrucción:</b> En el <b>Switch</b> (modo privilegiado <code>#</code>) ejecuta <code>show interfaces</code>.',
        theory: '<b>📘 Análisis Forense de la Salida de \"Show Interfaces\" en Cisco IOS</b><br><br>• <b>Interpretación del Estado de las Dos Primeras Líneas:</b><br>  - <b>FastEthernet0/1 is up, line protocol is up:</b> Operación 100% normal (<span class=\"concept\" data-term=\"capa1\">Capa 1</span> y <span class=\"concept\" data-term=\"capa2\">Capa 2</span> sanas).<br>  - <b>FastEthernet0/1 is down, line protocol is down:</b> Falla física de Capa 1 (cable desconectado, cortado o equipo remoto apagado).<br>  - <b>FastEthernet0/1 is up, line protocol is down:</b> Falla de Capa 2 (discrepancia en la encapsulación, clock rate faltante o problema de señalización/keepalive).<br>  - <b>FastEthernet0/1 is administratively down, line protocol is down:</b> El puerto fue apagado deliberadamente por el administrador mediante el comando <code>shutdown</code>.<br><br>• <b>Diagnóstico de Errores Comunes en los Contadores:</b><br>  - <b>CRC Errors:</b> Contador que incrementa cuando los bits recibidos no coinciden con la suma de verificación del trailer FCS. Causas principales: cable <span class=\"concept\" data-term=\"utp\">UTP</span> dañado, ficha <span class=\"concept\" data-term=\"rj45\">RJ45</span> mal crimpada o interferencia electromagnética de un motor cercano.<br>  - <b>Late Collisions (Colisiones Tardías):</b> Ocurren cuando dos equipos transmiten y colisionan después de haber emitido los primeros 64 bytes de la trama. <b>Causa casi universal en el CCNA:</b> Discrepancia de Dúplex (Duplex Mismatch), donde un extremo está forzado en Full-Duplex y el otro en Half-Duplex.<br>  - <b>Runts:</b> Tramas descartadas por medir menos de 64 bytes de tamaño mínimo Ethernet.<br>  - <b>Giants:</b> Tramas descartadas por exceder los 1518 bytes de MTU estándar sin estar habilitado Jumbo Frames.<br><br>• <b>Otros Comandos Esenciales de Inspección:</b><br>  - <code>show version</code>: Revela tiempo de actividad (Uptime), memoria RAM/Flash instalada y el registro de configuración (ej. <code>0x2102</code> para carga normal o <code>0x2142</code> para recuperación de contraseñas saltando la startup-config).<br>  - <code>show running-config</code>: Despliega la configuración completa activa en memoria RAM.',
        tasks: [ { id: 't1', text: 'Comando: show interfaces (o show version)', done: false } ],
        check: function() { 
            return window.cmdHistory && window.cmdHistory.some(c => c.startsWith('show int') || c.startsWith('sh int') || c.startsWith('show ver') || c.startsWith('sh ver')); 
        }
    }
];

let currentTicketIndex = 0;
let isEvaluating = false;
window.hasTriggeredLoop = window.hasTriggeredLoop || false; 
window.cmdHistory = window.cmdHistory || [];

const GLOSSARY = {
    'osi': '<b>Modelo OSI (7 Capas):</b><br>Marco de referencia arquitectural de la ISO que desglosa la comunicación de red en 7 capas funcionales: Física, Enlace, Red, Transporte, Sesión, Presentación y Aplicación.<br><a href=\"https://es.wikipedia.org/wiki/Modelo_OSI\" target=\"_blank\" style=\"color:#0f0;\">[Leer en Wikipedia]</a>',
    'ssh': '<b>SSH (Secure Shell):</b><br>Protocolo seguro de Capa de Aplicación (puerto TCP 22) que reemplaza a Telnet. Provee canales cifrados punto a punto para administrar routers y switches sin exponer credenciales.<br><a href=\"https://es.wikipedia.org/wiki/Secure_Shell\" target=\"_blank\" style=\"color:#0f0;\">[Leer en Wikipedia]</a>',
    'cdp': '<b>CDP (Cisco Discovery Protocol):</b><br>Protocolo propietario de Capa 2 que permite a equipos Cisco descubrir vecinos directamente conectados, obteniendo su nombre, dirección IP, plataforma y puertos sin necesidad de enrutamiento.<br><a href=\"https://es.wikipedia.org/wiki/Cisco_Discovery_Protocol\" target=\"_blank\" style=\"color:#0f0;\">[Leer en Wikipedia]</a>',
    'lldp': '<b>LLDP (Link Layer Discovery Protocol):</b><br>Estándar abierto multi-proveedor (IEEE 802.1AB) equivalente a CDP. Permite mapear topologías físicas en redes heterogéneas.<br><a href=\"https://es.wikipedia.org/wiki/Link_Layer_Discovery_Protocol\" target=\"_blank\" style=\"color:#0f0;\">[Leer en Wikipedia]</a>',
    'roas': '<b>Router-on-a-Stick:</b><br>Método de enrutamiento inter-VLAN que utiliza una sola interfaz física de router con subinterfaces lógicas asociadas a etiquetas 802.1Q individuales.<br><a href=\"https://www.cisco.com/c/es_mx/support/docs/lan-switching/inter-vlan-routing/14976-50.html\" target=\"_blank\" style=\"color:#0f0;\">[Doc Oficial Cisco]</a>',
    'banner': '<b>Banner MOTD:</b><br>Mensaje de bienvenida y advertencia legal presentado al iniciar sesión. Su propósito legal es notificar explícitamente que el acceso no autorizado está prohibido y sujeto a persecución judicial.<br><a href=\"https://es.wikipedia.org/wiki/Message_of_the_day\" target=\"_blank\" style=\"color:#0f0;\">[Leer en Wikipedia]</a>',
    'ping': '<b>Ping (Packet Internet Groper):</b><br>Herramienta de diagnóstico de Capa 3 basada en mensajes ICMP Echo Request y Echo Reply para verificar conectividad y medir latencia de ida y vuelta.<br><a href=\"https://es.wikipedia.org/wiki/Ping\" target=\"_blank\" style=\"color:#0f0;\">[Leer en Wikipedia]</a>',
    'traceroute': '<b>Traceroute:</b><br>Mecanismo que mapea la secuencia exacta de routers atravesados manipulando el campo TTL del paquete IP para forzar respuestas ICMP Time Exceeded en cada salto.<br><a href=\"https://es.wikipedia.org/wiki/Traceroute\" target=\"_blank\" style=\"color:#0f0;\">[Leer en Wikipedia]</a>',
    'snooping': '<b><span class=\"concept\" data-term=\"snooping\">DHCP Snooping:</span></b><br>Técnica de seguridad en conmutadores que bloquea servidores DHCP no autorizados (Rogue) y construye una base de datos segura de direcciones MAC e IPs concedidas.<br><a href=\"https://es.wikipedia.org/wiki/DHCP_snooping\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'dtp': '<b><span class=\"concept\" data-term=\"dtp\">DTP (Dynamic Trunking Protocol):</span></b><br>Protocolo propietario de Cisco que negocia de forma automática el estado de enlace troncal (Trunk) o de acceso entre conmutadores vecinos.<br><a href=\"https://es.wikipedia.org/wiki/Dynamic_Trunking_Protocol\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'port_sec': '<b><span class=\"concept\" data-term=\"port_sec\">Port Security:</span></b><br>Mecanismo de Capa 2 que restringe la entrada a una interfaz basándose en direcciones MAC específicas, mitigando inundaciones de tablas MAC.<br><a href=\"https://es.wikipedia.org/wiki/Seguridad_de_puertos\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'snmp': '<b>SNMP (Simple Network Management Protocol):</b><br>Estándar para monitorear métricas de salud (CPU, memoria, temperatura, errores de paquetes) en routers, conmutadores y servidores.<br><a href=\"https://es.wikipedia.org/wiki/Simple_Network_Management_Protocol\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'tftp': '<b>TFTP (Trivial File Transfer Protocol):</b><br>Protocolo simple de transferencia de archivos sin autenticación sobre UDP 69, ideal para restaurar y respaldar imágenes Cisco IOS.<br><a href=\"https://es.wikipedia.org/wiki/Trivial_File_Transfer_Protocol\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'syslog': '<b><span class=\"concept\" data-term=\"syslog\">Syslog:</span></b><br>Estándar centralizado de registro de eventos con niveles de severidad (0-7) que facilita la auditoría operativa y el análisis forense.<br><a href=\"https://es.wikipedia.org/wiki/Syslog\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'dai': '<b>DAI (Dynamic ARP Inspection):</b><br>Defensa contra ataques Man-in-the-Middle y envenenamiento ARP que intercepta y valida respuestas ARP contra la tabla de DHCP Snooping.<br><a href=\"https://www.cisco.com/c/es_mx/support/docs/switches/catalyst-6500-series-switches/72928-dynamicarp.html\" target=\"_blank\" style=\"color:#0f0;\">[Doc Oficial Cisco]</a>',
    'qos': '<b>QoS (Quality of Service):</b><br>Conjunto de tecnologías para priorizar tráfico sensible (voz sobre IP, video) frente al tráfico convencional en situaciones de congestión.<br><a href=\"https://es.wikipedia.org/wiki/Calidad_de_servicio\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'dna': '<b><span class=\"concept\" data-term=\"dna\">Cisco DNA Center:</span></b><br>Controlador centralizado y plataforma de análisis (Catalyst Center) que habilita redes basadas en intención (IBN).<br><a href=\"https://www.cisco.com/c/es_mx/products/cloud-systems-management/dna-center/index.html\" target=\"_blank\" style=\"color:#0f0;\">[Página de Cisco]</a>',
    'sdaccess': '<b><span class=\"concept\" data-term=\"sdaccess\">SD-Access:</span></b><br>Arquitectura de automatización de campus basada en Cisco DNA Center que implementa segmentación y políticas consistentes extremo a extremo.<br><a href=\"https://www.cisco.com/c/es_mx/solutions/enterprise-networks/software-defined-access/index.html\" target=\"_blank\" style=\"color:#0f0;\">[Página de Cisco]</a>',
    'sdwan': '<b><span class=\"concept\" data-term=\"sdwan\">SD-WAN:</span></b><br>Enrutamiento WAN definido por software que gestiona de manera dinámica y automatizada enlaces MPLS, Internet de banda ancha y 5G.<br><a href=\"https://es.wikipedia.org/wiki/SD-WAN\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'spine_leaf': '<b><span class=\"concept\" data-term=\"spine_leaf\">Spine-Leaf:</span></b><br>Diseño de centro de datos de dos niveles donde cada switch Leaf se conecta a todos los conmutadores Spine, garantizando latencia ultra-baja y predecible.<br><a href=\"https://www.cisco.com/c/es_mx/support/docs/switches/nexus-9000-series-switches/118997-technote-nexus-00.html\" target=\"_blank\" style=\"color:#0f0;\">[Doc Oficial Cisco]</a>',
    'soho': '<b><span class=\"concept\" data-term=\"soho\">SOHO:</span></b><br>Small Office / Home Office. Equipamiento que integra módem, router, conmutador y punto de acceso inalámbrico en un único dispositivo de consumo.<br><a href=\"https://es.wikipedia.org/wiki/SOHO_(inform%C3%A1tica)\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'on_prem': '<b><span class=\"concept\" data-term=\"on_prem\">On-premises:</span></b><br>Modelo donde la infraestructura informática reside físicamente dentro de las instalaciones y centros de datos de la propia organización.<br><a href=\"https://es.wikipedia.org/wiki/On-premises_software\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    '8021q': '<b><span class=\"concept\" data-term=\"8021q\">802.1Q:</span></b><br>Estándar internacional de etiquetado de tramas Ethernet que inserta un campo de 4 bytes con el identificador de VLAN para troncales.<br><a href=\"https://es.wikipedia.org/wiki/IEEE_802.1Q\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'ip': '<b>IP (Internet Protocol):</b><br>Protocolo de Capa 3 que provee direccionamiento lógico no orientado a conexión y selección de mejor ruta entre redes dispares.<br><a href=\"https://es.wikipedia.org/wiki/Direcci%C3%B3n_IP\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'lan': '<b>LAN (Red de Área Local):</b><br>Red que interconecta equipos dentro de un área geográfica restringida (edificio, piso u oficina) a altas velocidades.<br><a href=\"https://es.wikipedia.org/wiki/Red_de_%C3%A1rea_local\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'wan': '<b>WAN (Red de Área Amplia):</b><br>Infraestructura de telecomunicaciones que conecta múltiples redes de área local dispersas geográficamente a nivel regional o mundial.<br><a href=\"https://es.wikipedia.org/wiki/Red_de_%C3%A1rea_amplia\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'mac': '<b>Dirección MAC:</b><br>Identificador físico único de 48 bits grabado por el fabricante en cada controlador de interfaz de red (NIC).<br><a href=\"https://es.wikipedia.org/wiki/Direcci%C3%B3n_MAC\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'broadcast': '<b>Broadcast:</b><br>Transmisión de un paquete o trama a todos los dispositivos receptores ubicados dentro del mismo dominio de difusión.<br><a href=\"https://es.wikipedia.org/wiki/Difusi%C3%B3n_amplia\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'emi': '<b>EMI (Interferencia Electromagnética):</b><br>Distorsión causada por campos magnéticos generados por motores, balastros o cables de alta tensión sobre conductores de cobre.<br><a href=\"https://es.wikipedia.org/wiki/Interferencia_electromagn%C3%A9tica\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'rf': '<b>Radio Frecuencia:</b><br>Ondas electromagnéticas en el espectro inalámbrico utilizadas para propagar señales de datos por el aire.<br><a href=\"https://es.wikipedia.org/wiki/Radiofrecuencia\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'ssid': '<b>SSID (Service Set Identifier):</b><br>Nombre identificador alfanumérico que anuncia una red inalámbrica Wi-Fi a los clientes que buscan asociarse.<br><a href=\"https://es.wikipedia.org/wiki/Service_Set_Identifier\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'vlan': '<b>VLAN (LAN Virtual):</b><br>Segmentación lógica independiente dentro de una misma infraestructura física de conmutación.<br><a href=\"https://www.cisco.com/c/es_mx/support/docs/lan-switching/vlan/13769-9.html\" target=\"_blank\" style=\"color:#0f0;\">[Doc Oficial Cisco]</a>',
    'trunk': '<b>Enlace Troncal:</b><br>Canal de comunicación entre conmutadores o routers configurado para multiplexar tramas de múltiples VLANs mediante 802.1Q.<br><a href=\"https://es.wikipedia.org/wiki/VLAN_Trunking_Protocol\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'poe': '<b>PoE (Power over Ethernet):</b><br>Tecnología que suministra energía eléctrica continua a través de los mismos conductores de cobre que transportan datos Ethernet.<br><a href=\"https://es.wikipedia.org/wiki/Power_over_Ethernet\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'capa1': '<b>Capa 1 (Física):</b><br>Nivel encargado de la transmisión de la corriente de bits brutos sobre el medio material (voltajes, fibra, radio).<br><a href=\"https://es.wikipedia.org/wiki/Capa_f%C3%ADsica\" target=\"_blank\" style=\"color:#0f0;\">[Leer Modelo OSI]</a>',
    'capa2': '<b>Capa 2 (Enlace de Datos):</b><br>Nivel que organiza los bits en tramas, gestiona direccionamiento físico MAC y asegura tránsito libre de bucles.<br><a href=\"https://es.wikipedia.org/wiki/Nivel_de_enlace_de_datos\" target=\"_blank\" style=\"color:#0f0;\">[Leer Modelo OSI]</a>',
    'capa3': '<b>Capa 3 (Red):</b><br>Nivel responsable del direccionamiento lógico global y determinación de la ruta óptima a través de routers.<br><a href=\"https://es.wikipedia.org/wiki/Nivel_de_red\" target=\"_blank\" style=\"color:#0f0;\">[Leer Modelo OSI]</a>',
    'stp': '<b>STP (Spanning Tree Protocol):</b><br>Protocolo de conmutación de Capa 2 que bloquea enlaces redundantes para prevenir bucles catastróficos y tormentas de difusión.<br><a href=\"https://es.wikipedia.org/wiki/Spanning_tree\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'wlc': '<b>WLC (Wireless LAN Controller):</b><br>Dispositivo centralizado que gestiona perfiles de radiofrecuencia, seguridad, roaming y configuraciones de APs ligeros.<br><a href=\"https://www.cisco.com/c/en/us/products/wireless/wireless-lan-controller/index.html\" target=\"_blank\" style=\"color:#0f0;\">[Ver WLCs en Cisco]</a>',
    'lacp': '<b>LACP (EtherChannel):</b><br>Protocolo de control de agregación de enlaces (IEEE 802.3ad) que fusiona múltiples puertos físicos en un solo enlace lógico de alto ancho de banda.<br><a href=\"https://www.cisco.com/c/es_mx/support/docs/lan-switching/etherchannel/12023-4.html\" target=\"_blank\" style=\"color:#0f0;\">[Doc Oficial Cisco]</a>',
    'ospf': '<b>OSPF:</b><br>Protocolo de enrutamiento dinámico de estado de enlace que calcula rutas sin bucles utilizando el algoritmo de Dijkstra.<br><a href=\"https://es.wikipedia.org/wiki/Open_Shortest_Path_First\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'nat': '<b>NAT (Network Address Translation):</b><br>Traducción de direcciones IP privadas en direcciones públicas enrutables para optimizar el direccionamiento IPv4 y brindar seguridad perimetral.<br><a href=\"https://es.wikipedia.org/wiki/Traducci%C3%B3n_de_direcciones_de_red\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'dhcp': '<b>DHCP:</b><br>Protocolo cliente-servidor que asigna de manera dinámica y automática parámetros de red (IP, máscara, gateway, DNS) a los endpoints.<br><a href=\"https://es.wikipedia.org/wiki/Protocolo_de_configuraci%C3%B3n_din%C3%A1mica_de_host\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'acl': '<b>ACL (Listas de Control de Acceso):</b><br>Filtros basados en reglas secuenciales para permitir o denegar el paso de paquetes en interfaces de red.<br><a href=\"https://es.wikipedia.org/wiki/Lista_de_control_de_acceso\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'rack': '<b>Bastidor Rack 19\":</b><br>Estructura metálica normalizada para montaje seguro, distribución de energía y refrigeración de hardware de telecomunicaciones.<br><a href=\"https://es.wikipedia.org/wiki/Rack\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'utp': '<b>UTP (Unshielded Twisted Pair):</b><br>Medio físico estándar de cobre con 8 conductores trenzados en 4 pares para mitigar diafonía e interferencias electromagnéticas.<br><a href=\"https://es.wikipedia.org/wiki/Cable_de_par_trenzado\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'rj45': '<b>Conector RJ45:</b><br>Conector modular de 8 posiciones y 8 contactos (8P8C) empleado para rematar cables de red Ethernet.<br><a href=\"https://es.wikipedia.org/wiki/RJ-45\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'vlsm': '<b>VLSM:</b><br>Máscaras de subred de longitud variable que permiten subdividir un espacio de red de manera eficiente según el requerimiento de hosts de cada segmento.<br><a href=\"https://es.wikipedia.org/wiki/VLSM\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>',
    'sdn': '<b>SDN (Software Defined Networking):</b><br>Paradigma que desvincula el plano de control del plano de datos para centralizar la inteligencia y programabilidad de la red.<br><a href=\"https://es.wikipedia.org/wiki/Redes_definidas_por_software\" target=\"_blank\" style=\"color:#0f0;\">[Leer más en Wikipedia]</a>'
};

window.glossaryHideTimer = null;
window._activeGlossaryEl = null;

function buildGlossaryTooltip() {
    let tt = document.getElementById('concept-tooltip');
    if (!tt) {
        tt = document.createElement('div');
        tt.id = 'concept-tooltip';
        tt.className = 'hidden';
        document.body.appendChild(tt);

        // Cerrar al hacer click dentro del tooltip (en el propio div)
        tt.addEventListener('click', (e) => {
            e.stopPropagation();
            closeGlossaryTooltip();
        });
    }
    return tt;
}

function closeGlossaryTooltip() {
    const tt = document.getElementById('concept-tooltip');
    if (tt) tt.classList.add('hidden');
    if (window._activeGlossaryEl) {
        window._activeGlossaryEl.classList.remove('active-term');
        window._activeGlossaryEl = null;
    }
}

function showGlossaryTooltip(el, term) {
    const tt = buildGlossaryTooltip();

    // Si este mismo elemento ya está activo, cerrarlo (toggle)
    if (window._activeGlossaryEl === el) {
        closeGlossaryTooltip();
        return;
    }

    // Desactivar el anterior
    if (window._activeGlossaryEl) {
        window._activeGlossaryEl.classList.remove('active-term');
    }
    window._activeGlossaryEl = el;
    el.classList.add('active-term');

    const definition = GLOSSARY[term] || '<b>' + term.toUpperCase() + ':</b><br>Concepto técnico de redes. Consulte la documentación CCNA oficial.';
    tt.innerHTML = definition + '<span class="tooltip-close-hint">[ Click para cerrar ]</span>';
    tt.classList.remove('hidden');

    // Posicionamiento inteligente: evitar que salga fuera de pantalla
    const rect = el.getBoundingClientRect();
    const tooltipW = 320;
    const tooltipH = 200; // estimado

    let left = rect.left;
    let top = rect.bottom + 8;

    // Ajustar si sale por la derecha
    if (left + tooltipW > window.innerWidth - 16) {
        left = window.innerWidth - tooltipW - 16;
    }
    // Ajustar si sale por abajo
    if (top + tooltipH > window.innerHeight - 16) {
        top = rect.top - tooltipH - 8;
        if (top < 8) top = 8;
    }
    // Nunca a la izquierda de la pantalla
    if (left < 8) left = 8;

    tt.style.left = left + 'px';
    tt.style.top = top + 'px';
}

function attachGlossary() {
    buildGlossaryTooltip();
    // Solo bindear los elementos que NO tienen listener aún (evita duplicados SIN clonar el DOM)
    document.querySelectorAll('.concept:not([data-glossary-bound])').forEach(el => {
        el.setAttribute('data-glossary-bound', '1');
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const term = el.getAttribute('data-term');
            showGlossaryTooltip(el, term);
        });
    });
}

// Cierre global al hacer click fuera del tooltip
document.addEventListener('click', (e) => {
    const tt = document.getElementById('concept-tooltip');
    if (tt && !tt.classList.contains('hidden') && !e.target.classList.contains('concept')) {
        closeGlossaryTooltip();
    }
});

// Cierre con ESC (se acumula con el listener del modal, ambos conviven)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeGlossaryTooltip();
    }
});

function openTicketModal() {
    const modal = document.getElementById('ticket-modal-overlay');
    if (modal) modal.classList.remove('hidden');
}

function closeTicketModal() {
    const modal = document.getElementById('ticket-modal-overlay');
    if (modal) modal.classList.add('hidden');
}

function openKnowledgeModal() {
    const modal = document.getElementById('knowledge-modal-overlay');
    if (modal) modal.classList.remove('hidden');
}

function closeKnowledgeModal() {
    const modal = document.getElementById('knowledge-modal-overlay');
    if (modal) modal.classList.add('hidden');
}

function renderTicket() {
    const panel = document.getElementById('ticket-panel');
    if(currentTicketIndex >= tickets.length) {
        panel.innerHTML = `
            <div class="ticket-header">
                <span>[+] N.E.X.U.S. NOC</span>
                <span class="status-badge completed">CCNA MASTER</span>
            </div>
            <div class="ticket-body-compact">
                <div class="hud-ticket-row">
                    <span class="hud-tier-text" style="color:#10b981;">CERTIFICACIÓN OBTENIDA</span>
                    <span class="hud-title-text">¡Currículo CCNA 200-301 Dominado!</span>
                </div>
                <div class="hud-actions-row">
                    <button id="btn-open-knowledge" class="action-btn knowledge-btn" style="width:100%;">📘 VER CERTIFICACIÓN</button>
                </div>
            </div>
        `;
        const kbContent = document.getElementById('modal-kb-content');
        if (kbContent) {
            kbContent.innerHTML = `
                <div class="ticket-theory" style="border-left-color: #10b981;">
                    <b style="color:#10b981; font-size:1.1rem;">¡Felicitaciones, Ingeniero de Redes!</b><br><br>
                    Ha dominado con éxito los 6 Dominios oficiales del examen Cisco CCNA 200-301:<br><br>
                    • <b>Fase 0:</b> Montaje Físico de Data Center y Modelos OSI / TCP-IP<br>
                    • <b>Dominio 1:</b> Fundamentos de Red, IPv4/IPv6, SSH, Hardening y Protocolos Vecinos (CDP/LLDP)<br>
                    • <b>Dominio 2:</b> Acceso de Red, VLANs, Troncales 802.1Q, EtherChannel LACP, WLC e Inter-VLAN Routing<br>
                    • <b>Dominio 3:</b> Conectividad IP, Tablas de Enrutamiento, OSPFv2, FHRP/HSRP y DHCP Server Cisco IOS<br>
                    • <b>Dominio 4:</b> Servicios IP (PAT, NTP, Syslog, QoS, DHCP Relay y DNS/HTTPS)<br>
                    • <b>Dominio 5:</b> Seguridad Perimetral, AAA, ACLs Estándar y Extendidas, Port Security, DAI y Banner Legal<br>
                    • <b>Dominio 6:</b> Automatización SDN, APIs REST, JSON, Ansible y Diagnóstico Avanzado (Ping/Traceroute)
                </div>
            `;
        }
        const btnKb = document.getElementById('btn-open-knowledge');
        if (btnKb) btnKb.addEventListener('click', openKnowledgeModal);
        return;
    }
    
    const tkt = tickets[currentTicketIndex];
    
    // 1. Actualizar HUD Compacto
    const tierEl = document.getElementById('ticket-tier');
    const titleEl = document.getElementById('ticket-title');
    const statusBadge = document.getElementById('ticket-status');
    
    if (tierEl) tierEl.innerText = tkt.tier;
    if (titleEl) titleEl.innerText = `${tkt.id}: ${tkt.title}`;
    if (statusBadge) {
        statusBadge.innerText = 'ACTIVO';
        statusBadge.className = 'status-badge';
    }
    if (panel) panel.classList.remove('success');
    
    const ul = document.getElementById('ticket-tasks');
    if (ul) {
        ul.innerHTML = '';
        tkt.tasks.forEach(task => {
            ul.innerHTML += `<li><span class="task-box ${task.done ? 'done' : ''}"></span> ${task.text}</li>`;
        });
    }

    // 2. Actualizar Modal de Ticket Real
    const modalTitle = document.getElementById('modal-ticket-id-title');
    const modalTier = document.getElementById('modal-ticket-tier');
    const modalStatus = document.getElementById('modal-ticket-status');
    const modalDesc = document.getElementById('modal-ticket-desc');
    const modalTasksUl = document.getElementById('modal-ticket-tasks');

    if (modalTitle) modalTitle.innerText = `Ticket ${tkt.id}: ${tkt.title}`;
    if (modalTier) modalTier.innerText = tkt.tier;
    if (modalStatus) {
        modalStatus.innerText = 'EN PROGRESO';
        modalStatus.className = 'status-badge';
    }
    if (modalDesc) modalDesc.innerHTML = tkt.desc;
    if (modalTasksUl) {
        modalTasksUl.innerHTML = '';
        tkt.tasks.forEach(task => {
            modalTasksUl.innerHTML += `<li><span class="task-box ${task.done ? 'done' : ''}"></span> ${task.text}</li>`;
        });
    }

    // 3. Actualizar Modal de Conocimiento Técnico
    const modalKbTitle = document.getElementById('modal-kb-title');
    const modalKbContent = document.getElementById('modal-kb-content');
    if (modalKbTitle) modalKbTitle.innerText = `📘 CCNA ${tkt.id}: ${tkt.title}`;
    if (modalKbContent) {
        modalKbContent.innerHTML = `<div class="ticket-theory">${tkt.theory}</div>`;
    }

    attachGlossary();
}

function evaluateTickets() {
    if(currentTicketIndex >= tickets.length || isEvaluating) return;
    
    const tkt = tickets[currentTicketIndex];
    const isComplete = tkt.check();
    
    renderTicket();

    if (isComplete) {
        isEvaluating = true;
        const statusBadge = document.getElementById('ticket-status');
        const modalStatus = document.getElementById('modal-ticket-status');
        const panel = document.getElementById('ticket-panel');
        
        if (statusBadge) {
            statusBadge.innerText = 'COMPLETADO';
            statusBadge.className = 'status-badge completed';
        }
        if (modalStatus) {
            modalStatus.innerText = 'COMPLETADO';
            modalStatus.className = 'status-badge completed';
        }
        if (panel) panel.classList.add('success');
        
        setTimeout(() => {
            currentTicketIndex++;
            isEvaluating = false;
            renderTicket();
        }, 3500); 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Configurar apertura/cierre de Modales
    const btnOpenTicket = document.getElementById('btn-open-ticket');
    if (btnOpenTicket) btnOpenTicket.addEventListener('click', openTicketModal);
    
    const btnOpenKb = document.getElementById('btn-open-knowledge');
    if (btnOpenKb) btnOpenKb.addEventListener('click', openKnowledgeModal);

    const btnCloseTicket = document.getElementById('ticket-modal-close');
    if (btnCloseTicket) btnCloseTicket.addEventListener('click', closeTicketModal);

    const btnAckTicket = document.getElementById('ticket-modal-ack');
    if (btnAckTicket) btnAckTicket.addEventListener('click', closeTicketModal);

    const btnCloseKb = document.getElementById('knowledge-modal-close');
    if (btnCloseKb) btnCloseKb.addEventListener('click', closeKnowledgeModal);

    const btnAckKb = document.getElementById('knowledge-modal-ack');
    if (btnAckKb) btnAckKb.addEventListener('click', closeKnowledgeModal);

    // Cierre al presionar ESC o hacer clic en backdrop
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeTicketModal();
            closeKnowledgeModal();
        }
    });

    const ticketOverlay = document.getElementById('ticket-modal-overlay');
    if (ticketOverlay) {
        ticketOverlay.addEventListener('click', (e) => {
            if (e.target === ticketOverlay) closeTicketModal();
        });
    }

    const kbOverlay = document.getElementById('knowledge-modal-overlay');
    if (kbOverlay) {
        kbOverlay.addEventListener('click', (e) => {
            if (e.target === kbOverlay) closeKnowledgeModal();
        });
    }

    renderTicket();
    
    const observer = new MutationObserver(() => {
        clearTimeout(window.ticketEvalTimer);
        window.ticketEvalTimer = setTimeout(() => {
            evaluateTickets();
        }, 150);
    });
    
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'data-slot'] });
    
    const cliInput = document.getElementById('cli-input');
    if (cliInput) {
        cliInput.addEventListener('keydown', (e) => {
            if(e.key === 'Enter') { setTimeout(evaluateTickets, 250); }
        });
    }
});

const prevBtn = document.getElementById('debug-prev-btn');
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentTicketIndex > 0) {
            currentTicketIndex--;
            const tkt = tickets[currentTicketIndex];
            tkt.tasks.forEach(t => t.done = false);
            const statusBadge = document.getElementById('ticket-status');
            if (statusBadge) {
                statusBadge.innerText = 'ACTIVO';
                statusBadge.className = 'status-badge';
            }
            isEvaluating = false;
            renderTicket();
        }
    });
}

const skipBtn = document.getElementById('debug-skip-btn');
if (skipBtn) {
    skipBtn.addEventListener('click', () => {
        if (currentTicketIndex >= tickets.length || isEvaluating) return;
        isEvaluating = true;
        
        const tkt = tickets[currentTicketIndex];
        tkt.tasks.forEach(t => t.done = true);
        
        const statusBadge = document.getElementById('ticket-status');
        if (statusBadge) {
            statusBadge.innerText = 'DEBUG-SKIP';
            statusBadge.className = 'status-badge completed';
        }
        renderTicket();
        
        setTimeout(() => {
            currentTicketIndex++;
            isEvaluating = false;
            renderTicket();
        }, 800);
    });
}
