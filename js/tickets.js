const tickets = [
    // ==========================================
    // FASE 0: PREPARACIÓN DEL DATA CENTER (SANDBOX FÍSICO)
    // ==========================================
    {
        id: '0.1',
        tier: 'FASE 0: INGENIERÍA FÍSICA',
        title: 'Montaje de Hardware',
        desc: '<b>Objetivo:</b> Instalar el hardware base.<br><br><b>¿Por qué lo hacemos?:</b> Un centro de datos requiere un Rack (armario metálico) para organizar y ventilar el equipamiento.<br><b>Instrucción:</b> Arrastra un Switch y un Gateway desde el menú inferior y colócalos en los rieles del Rack.',
        theory: '<b>Fase 0.1: El mundo tangible (<span class="concept" data-term="capa1">Capa 1 OSI</span>)</b><br><br>Antes de programar nada, el hardware debe existir físicamente.<br><br><b>¿Qué es un <span class="concept" data-term="rack">Rack</span>?</b><br>Imagina una enorme estantería metálica de 19 pulgadas de ancho. Los equipos de red no se dejan tirados en el piso ni en un escritorio; se "atornillan" uno encima del otro en este armario. Su altura se mide en "Unidades de Rack" (U). Un equipo normal mide 1U (4.4 cm de alto).<br><br><b>Tus primeros equipos:</b><br>• <b>Switch:</b> Es la "zapatilla múltiple" pero de datos. Permite enchufar 24 o 48 computadoras juntas para que armen una <span class="concept" data-term="lan">LAN</span>.<br>• <b>Gateway / Router:</b> Es el "Cartero" de la escuela. Él sabe cómo sacar los mensajes del Switch hacia la calle (Internet / <span class="concept" data-term="wan">WAN</span>).<br>• <b>Firewall:</b> El guardia de seguridad. Revisa las mochilas (paquetes) de todos los que entran y salen del edificio.',
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
        title: 'Energización (Capa 1 OSI)',
        desc: '<b>Objetivo:</b> Dar energía (Tensión).<br><br><b>¿Por qué lo hacemos?:</b> Las placas base no arrancan sin corriente eléctrica (Capa Física 1).<br><b>Instrucción:</b> Selecciona el cable Negro (Poder). Haz clic en el puerto PWR del Switch y conéctalo a la PDU (zapatilla eléctrica). Repite con el Gateway.',
        theory: '<b>Fase 0.2: Electricidad (La sangre de la <span class="concept" data-term="capa1">Capa 1</span>)</b><br><br>Sin electrones, tu red es solo chatarra cara. En la Capa Física (Capa 1 del modelo OSI) lidiamos con el voltaje, los enchufes y la corriente.<br><br><b>¿Qué es una PDU?</b><br>PDU significa "Unidad de Distribución de Energía". Es, literalmente, una súper zapatilla eléctrica industrial atornillada al Rack.<br><br><b>¿Por qué importa?</b><br>En un Centro de Datos real, si se corta la luz, la empresa pierde millones. Por eso, los equipos profesionales (como servidores y switches grandes) tienen <b>DOS cables de poder</b> conectados a dos PDUs diferentes. Así, si una zapatilla se quema, el equipo sigue vivo alimentándose de la otra.',
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
        title: 'Uplink de Red (Cableado UTP)',
        desc: '<b>Objetivo:</b> Enlace físico de datos.<br><br><b>¿Por qué lo hacemos?:</b> Para que los electrones lleven los bits entre los equipos.<br><b>Instrucción:</b> Selecciona el cable Azul (UTP). Une un puerto de datos del Switch con uno del Gateway.',
        theory: '<b>Fase 0.3: El sistema nervioso (<span class="concept" data-term="utp">Cables UTP</span>)</b><br><br>Ahora que tienen corriente, hay que unirlos para que hablen.<br><br><b>¿Qué es el cable UTP?</b><br>Ese cable azul, naranja o gris que usas para el internet. Adentro no tiene 1, sino <b>8 cablecitos de cobre</b> entrelazados de a pares. Se trenzan así porque los giros anulan mágicamente la interferencia magnética externa (<span class="concept" data-term="emi">EMI</span>).<br><br><b>¿Qué es el conector <span class="concept" data-term="rj45">RJ45</span>?</b><br>Es la ficha de plástico transparente en las puntas del cable que hace "click".<br><br><b>¿Qué estás haciendo aquí?</b><br>Al conectar un puerto de datos del Switch hacia el Gateway, estás creando un "Uplink" o puente principal. Toda la escuela enviará sus mensajes por este único tubo hacia Internet.',
        tasks: [ { id: 't1', text: 'Cablear puerto de datos Switch <-> Gateway', done: false } ],
        check: function() {
            let uplinked = false;
            document.querySelectorAll('.cable-path:not([stroke="#222222"])').forEach(c => {
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
    
    // ==========================================
    // DOMINIO 1: FUNDAMENTOS DE RED (20%)
    // ==========================================
    {
        id: '1.1',
        tier: 'DOMINIO 1: FUNDAMENTOS',
        title: 'Componentes y Topologías',
        desc: '<b>Instrucción:</b> Abre la consola (doble clic) de cualquier equipo y tipea <code>acknowledge topologies</code> para confirmar que entendiste qué es una red.',
        theory: '<b>📘 CCNA 1.1: El Mapa de la Red</b><br><br><b>Routers</b> dominan la <span class="concept" data-term="capa3">Capa 3</span> y conectan ciudades. <b>Switches</b> dominan la <span class="concept" data-term="capa2">Capa 2</span> conectando PCs.<br><br>• <b><span class="concept" data-term="spine_leaf">Spine-Leaf:</span></b> Topología de Data Centers modernos donde todos están a "1 salto".<br>• <b><span class="concept" data-term="soho">SOHO:</span></b> Redes pequeñas de casa/oficina con un router todo-en-uno.<br>• <b><span class="concept" data-term="on_prem">On-premises</span> vs Cloud:</b> Tus servidores pueden estar físicamente en tu edificio (On-prem) o alquilados en internet (Nube Pública/AWS).',
        tasks: [ { id: 't1', text: 'Comando: acknowledge topologies', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('acknowledge topologies'); }
    },
    {
        id: '1.2',
        tier: 'DOMINIO 1: FUNDAMENTOS',
        title: 'Medios Físicos y PoE',
        desc: '<b>Instrucción:</b> Tipea <code>acknowledge media</code> para confirmar que asimilaste los medios físicos de transmisión (Cobre, Fibra, Aire).',
        theory: '<b>Fase 1.2: Cables Mágicos (Medios de transmisión)</b><br><br>Tienes 3 formas de enviar información en el mundo físico:<br><br>• <b>Cobre (<span class="concept" data-term="utp">UTP</span>):</b> Envía electricidad. Es barato, como una calle normal de ciudad. Pero si hay una tormenta eléctrica o pasa por un motor, la electricidad se corrompe (<span class="concept" data-term="emi">EMI</span>).<br>• <b>Fibra Óptica:</b> Es un tubo de vidrio al vacío por donde viaja Luz (Láser o LED). Es un tren bala. Inmune a las tormentas y llega a kilómetros sin perder velocidad.<br>• <b><span class="concept" data-term="poe">PoE (Power over Ethernet)</span>:</b> Magia pura de Cobre. El cable es tan bueno que, además de llevar la "carta" (datos), lleva "comida" (electricidad). Sirve para encender cámaras de seguridad o teléfonos sin tener que enchufarlos a la pared, ¡el switch los alimenta!',
        tasks: [ { id: 't1', text: 'Comando: acknowledge media', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('acknowledge media'); }
    },
    {
        id: '1.3',
        tier: 'DOMINIO 1: FUNDAMENTOS',
        title: 'Protocolos Base: TCP vs UDP',
        desc: '<b>Instrucción:</b> Tipea <code>acknowledge transport</code> para confirmar que comprendes cómo viajan los paquetes en TCP y UDP.',
        theory: '<b>📘 CCNA 1.3: El Cartero y el Helicóptero</b><br><br>• <b>TCP (Transmission Control Protocol):</b> Es enviar una carta por correo certificado. El cartero (TCP) hace firmar un acuse de recibo. Si el paquete se pierde, lo reenvía. Es lento pero 100% seguro. Ej: Entrar a una web o bajar un archivo.<br>• <b>UDP (User Datagram Protocol):</b> Es tirar volantes publicitarios desde un helicóptero. Es rapidísimo, pero no sabes si la gente los leyó o si el viento se los llevó. Es ideal para cosas en vivo, donde un segundo de retraso arruina todo. Ej: Llamadas de voz o Partidas de Videojuegos Online.',
        tasks: [ { id: 't1', text: 'Comando: acknowledge transport', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('acknowledge transport'); }
    },
    {
        id: '1.4',
        tier: 'DOMINIO 1: FUNDAMENTOS',
        title: 'Direccionamiento IPv4',
        desc: '<b>Instrucción:</b> Tipea <code>acknowledge ipv4</code> tras comprender cómo funciona el direccionamiento IP de 32 bits.',
        theory: '<b>📘 CCNA 1.4: Entendiendo IPv4</b><br><br>Imagina que estás en clase y quieres pasarle una nota al asiento de al lado. Tu PC (<span class="concept" data-term="ip">IP</span>: 192.168.1.10) debe saber: <i>&quot;¿Esta persona está en mi salón, o en otro edificio?&quot;</i><br>Para averiguarlo usa la <b>Máscara de Subred</b> (ej. 255.255.255.0 o simplemente <b>/24</b>).<br>El 255 dice: <i>&quot;Este es el número del salón, tiene que ser idéntico&quot;</i>. El 0 dice: <i>&quot;Este es el número de asiento del alumno&quot;</i>. Si el salón de la IP destino coincide con el tuyo, tu PC le pasa la nota directo. Si no, se la da al Router.<br><br><b>Subnetting</b> es levantar paredes dentro de un auditorio de 200 alumnos ruidosos para crear 4 salones silenciosos de 50 alumnos, para evitar el ruido de <span class="concept" data-term="broadcast">Broadcast</span>.<br><span class="concept" data-term="vlsm">VLSM</span> es hacer salones a medida en vez de iguales: un auditorio para 100, un salón para 50, y un cuarto privado exacto para 2.',
        tasks: [ { id: 't1', text: 'Comando: acknowledge ipv4', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('acknowledge ipv4'); }
    },
    {
        id: '1.5',
        tier: 'DOMINIO 1: FUNDAMENTOS',
        title: 'Direccionamiento IPv6',
        desc: '<b>Objetivo Práctico (¿Qué estamos logrando?):</b><br>Imagina que el Router es el "Director" de la escuela. Para que los alumnos (PCs) puedan entregarle sus tareas, el Director necesita un número de oficina oficial. Al asignarle la <code>2001:db8::1/64</code>, le estamos clavando un cartel en la puerta para que toda la red sepa que él es la Puerta de Enlace (Gateway). Sin este paso, nadie en tu empresa podrá navegar por la red moderna IPv6.<br><br><b>Instrucción:</b> Haz doble clic en el <b>Router / Gateway</b> para abrir su consola (CLI), y tipea:<br>1. <code>enable</code><br>2. <code>configure terminal</code><br>3. <code>interface vlan 1</code><br>4. <code>ipv6 address 2001:db8::1/64</code>',
        theory: '<b>📘 CCNA 1.5: IPv6 (El futuro ilimitado)</b><br><br>Se nos acabaron las IPs de versión 4 en el mundo. Así que creamos IPv6. Son larguísimas y usan letras (Hexadecimal). Existen 4 tipos clave:<br>• <b>Global Unicast (Empiezan con 2001:):</b> Tienen pasaporte. Pueden navegar libremente por Internet.<br>• <b>Link-Local (Empiezan con fe80:):</b> IPs de supervivencia. El equipo se la inventa solo para hablar con su compañero de banco. No pueden salir de la clase.<br>• <b>Multicast (ff00:):</b> El altavoz. Lo que envías aquí lo escuchan varios equipos a la vez.<br>• <b>Anycast:</b> Magia. Muchos servidores alrededor del mundo tienen la misma IP. El Router te conectará al servidor que esté geográficamente más cerca de ti.',
        tasks: [ { id: 't1', text: 'Comando: ipv6 address 2001:db8::1/64', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('2001:db8::1/64')); }
    },
    {
        id: '1.6',
        tier: 'DOMINIO 1: FUNDAMENTOS',
        title: 'Principios Inalámbricos (RF)',
        desc: '<b>Objetivo Práctico (¿Qué estamos logrando?):</b><br>Las PCs móviles no usan cables UTP. Para conectarlas a la red de tu empresa, instalas un <b>Access Point (AP)</b>, que convierte los datos del cable de red en ondas electromagnéticas invisibles.<br><br><b>Instrucción:</b> Arrastra el <b>Access Point (WLC)</b> desde el menú lateral y móntalo en el Rack. Luego, abre la consola del Router (o el Switch) y tipea <code>acknowledge wireless</code>.',
        theory: '<b>📘 CCNA 1.6: Wi-Fi y Access Points</b><br><br>El Wi-Fi transmite datos por el aire usando <span class="concept" data-term="rf">Radio Frecuencia (RF)</span>. Existen dos bandas de trabajo principales:<br><br>• <b>Banda 2.4 GHz:</b> Es como un sonido grave. Llega muy lejos y atraviesa paredes gruesas, pero es muy lento y se satura fácilmente. Solo existen 3 canales (carriles) que no se pisan entre sí: <b>el 1, el 6 y el 11</b>. Si dos APs cercanos usan el mismo canal, colapsan.<br><br>• <b>Banda 5 GHz:</b> Es como un sonido agudo. Es rapidísimo y tiene docenas de canales limpios sin interferencia. Su única debilidad es que si hay una pared enfrente, la señal muere casi de inmediato.<br><br><b>¿Cómo funciona el AP?</b><br>El Access Point que acabas de montar recibe la energía y los datos por un solo cable (PoE). Todo lo que tus laptops envíen por el aire (al SSID de la empresa), el AP lo convierte en pulsos eléctricos hacia el Switch.',
        tasks: [ 
            { id: 't1', text: 'Montar un Access Point (WLC) en el Rack', done: false },
            { id: 't2', text: 'Comando: acknowledge wireless', done: false } 
        ],
        check: function() { 
            let ap = false;
            document.querySelectorAll('.hw-item').forEach(el => {
                const label = el.querySelector('.hw-label') ? el.querySelector('.hw-label').innerText.toUpperCase() : '';
                if (label.includes('ACCESS POINT') || el.getAttribute('data-type') === 'ap') ap = true;
            });
            if(ap) { this.tasks[0].done = true; }
            if (window.cmdHistory && window.cmdHistory.some(c => c.includes('acknowledge wireless'))) { this.tasks[1].done = true; }
            return this.tasks[0].done && this.tasks[1].done;
        }
    },

    // ==========================================
    // DOMINIO 2: ACCESO A LA RED (20%)
    // ==========================================
    {
        id: '2.1',
        tier: 'DOMINIO 2: ACCESO A LA RED',
        title: 'VLANs y Access Ports',
        desc: '<b>Objetivo:</b> Crear una VLAN y asignarle un puerto.<br><br><b>Objetivo Práctico (¿Qué estamos logrando?):</b><br>Imagina que todos en la oficina están en una gran sala gritando a la vez (Broadcast). Las PCs de Contabilidad escuchan a las de Ventas, y es un caos. Al crear la <b>VLAN 10</b>, estamos construyendo una pared de insonorización virtual. Al aplicar <code>switchport mode access</code> al puerto físico de la pared, le decimos al Switch: 'A partir de hoy, quien conecte su PC en este enchufe, pertenecerá exclusivamente a esa sala blindada'.<br><br><b>Instrucción:</b> Haz doble clic en el <b>Switch</b> para abrir su CLI y ejecuta:<br>1. <code>enable</code> <i>(Escala tus privilegios de Usuario a Administrador).</i><br>2. <code>configure terminal</code> <i>(Entra al modo donde puedes alterar el sistema).</i><br>3. <code>vlan 10</code> <i>(Crea la VLAN 10 "el departamento" en la base de datos).</i><br>4. <code>exit</code> <i>(Sales de la edición de la VLAN).</i><br>5. <code>interface f0/1</code> <i>(Seleccionas el enchufe físico número 1).</i><br>6. <code>switchport mode access</code> <i>(Fuerzas a que este enchufe sea EXCLUSIVO para una sola PC final, no para conectar a otros switches).</i>',
        theory: '<b>📘 Misión 2.1: VLANs y Puertos</b><br><br>Una <span class="concept" data-term="vlan">VLAN</span> es como construir paredes de ladrillo dentro de un switch para separar a Recursos Humanos de Ventas. Un <b>Puerto de Acceso</b> es el enchufe final de la pared: le dices estrictamente al switch "<i>El cable conectado aquí pertenece SÓLO a la VLAN 10</i>". Nadie de otra VLAN podrá ver su tráfico.',
        tasks: [ { id: 't1', text: 'Comandos: vlan 10 y switchport mode access', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('switchport mode access') || c.includes('sw mo acc') || c.includes('mode access')); }
    },
    {
        id: '2.2',
        tier: 'DOMINIO 2: ACCESO A LA RED',
        title: 'Trunking (Enlaces Troncales)',
        desc: '<b>Objetivo:</b> Crear un Troncal para pasar múltiples VLANs.<br><br><b>Objetivo Práctico (¿Qué estamos logrando?):</b><br>Un <b>Trunk</b> es una autopista de múltiples carriles. En lugar de tirar un cable físico distinto por cada departamento (VLAN) que quieras conectar, configuras un solo cable para que lleve el tráfico de todos los departamentos a la vez, etiquetando cada paquete (802.1Q) para que no se mezclen.<br><br><b>Instrucción:</b> Haz doble clic en el <b>Switch</b> para abrir su CLI y ejecuta:<br>1. <code>interface f0/2</code> <i>(Selecciona el puerto que va al router).</i><br>2. <code>switchport mode trunk</code> <i>(Le dices: "Deja de ser exclusivo. Conviértete en una autopista de múltiples carriles para pasar TODAS las VLANs mezcladas").</i>',
        theory: '<b>📘 CCNA 2.2: Trunking (El Súper Cable)</b><br><br>Un <b>Enlace Troncal</b> (<span class="concept" data-term="trunk">Trunk</span>) es una autopista de múltiples carriles donde el tráfico de todas las VLANs viaja mezclado. Para no confundirse, usa <b><span class="concept" data-term="8021q">802.1Q</span></b> (una etiqueta de color).<br>Además, los switches tienen <b><span class="concept" data-term="dtp">DTP (Dynamic Trunking Protocol)</span></b>, que intenta negociar troncales automáticamente si no los configuras manualmente.',
        tasks: [ { id: 't1', text: 'Comando: switchport mode trunk', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('mode trunk') || c.includes('mo tr')); }
    },
    {
        id: '2.3',
        tier: 'DOMINIO 2: ACCESO A LA RED',
        title: 'Prevención de Bucles: RSTP',
        desc: '<b>Instrucción:</b> Tipea <code>acknowledge spanning-tree</code> en la consola, confirmando que sabes cómo este protocolo evita bucles infinitos en cables redundantes.',
        theory: '<b>📘 Misión 2.3: El Guardián de los Bucles</b><br><br>Si conectas dos switches entre sí con 2 cables para tener redundancia, creas un bucle. Los mensajes darán vueltas infinitas hasta derretir los switches (Tormenta de Broadcast). <span class="concept" data-term="stp">STP</span> es un algoritmo que apaga lógicamente un cable, dejándolo de repuesto, y lo enciende solo si el cable principal se corta.',
        tasks: [ { id: 't1', text: 'Comando: spanning-tree mode rapid-pvst', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('spanning-tree mode rapid-pvst'); }
    },
    {
        id: '2.4',
        tier: 'DOMINIO 2: ACCESO A LA RED',
        title: 'EtherChannel (LACP)',
        desc: '<b>Objetivo:</b> Agrupar enlaces físicos.<br><br><b>Objetivo Práctico (¿Qué estamos logrando?):</b><br>Si conectas dos cables entre dos switches, el protocolo STP apagará uno para evitar bucles. Al crear un <b>EtherChannel</b>, engañamos al sistema 'trenzando' ambos cables en un solo súper-cable lógico. Sumas la velocidad de ambos y si uno se rompe físicamente, la red no se cae.<br><br><b>Instrucción:</b> Haz doble clic en el <b>Switch</b> para abrir su CLI y ejecuta:<br>1. <code>interface range f0/1 - 2</code><br>2. <code>channel-group 1 mode active</code> <i>(Agrupa estos cables usando el protocolo LACP para que funcionen como un solo súper-cable y no sean bloqueados por STP).</i>',
        theory: '<b>📘 CCNA 2.4: EtherChannel (LACP)</b><br><br>Si conectas 4 cables entre dos switches para sumar velocidad, STP bloqueará 3 para evitar bucles. Usando <span class="concept" data-term="lacp">LACP (EtherChannel)</span> engañas a STP: pegas lógicamente los 4 cables con cinta adhesiva para que parezcan 1 solo enlace gigantesco.',
        tasks: [ { id: 't1', text: 'Comando: channel-group 1 mode active', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('channel-group')); }
    },
    {
        id: '2.5',
        tier: 'DOMINIO 2: ACCESO A LA RED',
        title: 'Arquitectura Inalámbrica y WLC',
        desc: '<b>Instrucción:</b> Tipea <code>acknowledge wlc</code>. (Nota: esta misión fue duplicada en la base, usa el mismo comando).',
        theory: '<b>📘 CCNA 2.6 a 2.9:</b><br><br><b>WLC (Wireless LAN Controller):</b> En grandes redes, los Access Points son "Ligeros" (Lightweight APs). No tienen cerebro. Todo el cerebro (seguridad, roaming, SSIDs) reside en el WLC central. Se administran mediante una GUI web (HTTPS), no por CLI.',
        tasks: [ { id: 't1', text: 'Comando: acknowledge wlc', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('acknowledge wlc'); }
    },

    // ==========================================
    // DOMINIO 3: CONECTIVIDAD IP (25%)
    // ==========================================
    {
        id: '3.1',
        tier: 'DOMINIO 3: CONECTIVIDAD IP',
        title: 'La Tabla de Enrutamiento',
        desc: '<b>Objetivo:</b> Ver la tabla de rutas del Router.<br><br><b>¿Qué hace el comando?:</b><br>1. <code>enable</code> <i>(Modo Administrador).</i><br>2. <code>show ip route</code> <i>(Le pide al router que muestre en pantalla su mapa interno de caminos. La letra "C" significa "Conectado Directamente").</i>',
        theory: '<b>📘 Misión 3.1: Rutas Estáticas</b><br><br>Un Router es como un cartero en una intersección de carreteras. Si le llega un paquete para un país que no está en su mapa mental, tira el paquete a la basura.<br>Con <b>ip route</b> le estás enseñando a mano: "<i>Oye, para ir a la red 10.0.0.0, entrégale el paquete a tu vecino en la IP 192.168.1.254, él sabe el camino</i>".',
        tasks: [ { id: 't1', text: 'Comando: show ip route', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('show ip route') || c.includes('sh ip ro')); }
    },
    {
        id: '3.2',
        tier: 'DOMINIO 3: CONECTIVIDAD IP',
        title: 'Rutas Estáticas Flotantes',
        desc: '<b>Objetivo:</b> Ruta Estática y Ruta por Defecto.<br><br><b>Objetivo Práctico (¿Qué estamos logrando?):</b><br>Imagina que tu Router es un taxista en una ciudad gigante, pero está ciego y solo conoce la calle donde nació. Al encender <b>OSPF</b>, le estamos dando una radio GPS. Inmediatamente empezará a hablar (intercambiar paquetes Hello) con todos los demás taxistas (Routers vecinos) para que, de forma autónoma, dibujen juntos el mapa completo de la ciudad y descubran el camino más corto hacia cualquier destino.<br><br><b>Instrucción:</b> Haz doble clic en el <b>Router</b> para abrir su CLI y ejecuta:<br>1. <code>configure terminal</code> <i>(Modo configuración).</i><br>2. <code>ip route 0.0.0.0 0.0.0.0 10.1.1.1</code> <i>(Le enseña a mano: "Cualquier paquete para cualquier red desconocida [0.0.0.0], tíraselo a la IP 10.1.1.1").</i>',
        theory: '<b>📘 Misión 3.2: Ruta por Defecto (El Comodín)</b><br><br>Internet tiene millones de redes. El pobre Router no tiene memoria para aprendérselas todas. Así que usamos el comodín supremo <b>0.0.0.0 0.0.0.0</b>, que significa: "<i>Si no sabes a dónde va este paquete, tíraselo al Router de nuestro proveedor de Internet (10.1.1.1), que él se arregle</i>".',
        tasks: [ { id: 't1', text: 'Comando: ip route ... 50', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('ip route 0.0.0.0 0.0.0.0 10.1.1.1 50'); }
    },
    {
        id: '3.3',
        tier: 'DOMINIO 3: CONECTIVIDAD IP',
        title: 'Enrutamiento Dinámico: OSPFv2',
        desc: '<b>Objetivo:</b> Activar el enrutamiento inteligente (OSPF).<br><br><b>Objetivo Práctico (¿Qué estamos logrando?):</b><br>Si tu único Router se quema, toda la empresa pierde Internet. <b>FHRP (HSRP)</b> crea un Router 'Fantasma' (Virtual). Dos routers físicos comparten una misma IP Fantasma; si el router titular muere, el router suplente asume la IP Fantasma en milisegundos, salvando la red automáticamente.<br><br><b>Instrucción:</b> Haz doble clic en el <b>Router</b> para abrir su CLI y ejecuta:<br>1. <code>configure terminal</code><br>2. <code>router ospf 1</code> <i>(Enciende el proceso del protocolo OSPF número 1. Esto hace que el router empiece a hablar automáticamente con sus vecinos para dibujar un mapa GPS de la red).</i>',
        theory: '<b>📘 Misión 3.3: Enrutamiento Dinámico</b><br><br>Escribir rutas a mano es agotador. <span class="concept" data-term="ospf">OSPF</span> es un protocolo donde activas a los routers para que formen un grupo de WhatsApp y se compartan todos sus mapas. Si un cable de la ciudad se corta, el grupo se avisa en segundos y todos recalcular el mejor camino automáticamente usando un algoritmo GPS (Dijkstra).',
        tasks: [ { id: 't1', text: 'Comando: router ospf 1', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('standby 1 ip') || c.includes('standby')); }
    },
    {
        id: '3.4',
        tier: 'DOMINIO 3: CONECTIVIDAD IP',
        title: 'Redundancia FHRP (HSRP)',
        desc: '<b>Objetivo:</b> Redundancia de Puerta de Enlace (FHRP).<br><br><b>Instrucción:</b> Haz doble clic en el <b>Router</b> para abrir su CLI y ejecuta:<br>1. <code>interface f0/1</code> <i>(Entra a la interfaz local).</i><br>2. <code>standby 1 ip 192.168.1.254</code> <i>(Crea una IP "Fantasma" virtual. Si este router físico muere, otro tomará la IP 192.168.1.254 al instante sin que la red se caiga).</i>',
        theory: '<b>📘 Misión 3.4: Redundancia de Puerta</b><br><br>Si las PCs de una oficina apuntan al Router A para salir a internet, y el Router A se quema, la oficina se queda sin red. FHRP (ej. HSRP) clona la mente de 2 routers físicos bajo una sola "IP Fantasma". Las PCs apuntan al fantasma, y si el router físico principal muere, el secundario asume el fantasma en 1 segundo.',
        tasks: [ { id: 't1', text: 'Comando: standby 1 ip 192.168.1.254', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('standby 1 ip 192.168.1.254'); }
    },

    // ==========================================
    // DOMINIO 4: SERVICIOS IP (10%)
    // ==========================================
    {
        id: '4.1',
        tier: 'DOMINIO 4: SERVICIOS IP',
        title: 'NAT y PAT',
        desc: '<b>Objetivo:</b> Ocultar las IPs privadas detrás de una IP pública (NAT).<br><br><b>Objetivo Práctico (¿Qué estamos logrando?):</b><br>Las direcciones IP de tu casa (192.168.x.x) son ilegales en Internet. Si salen a la calle tal cual, los routers mundiales las destruyen. <b>NAT (Network Address Translation)</b> actúa como una oficina de pasaportes. Toma las IPs privadas de todos tus empleados (inside source list) y las disfraza bajo una única IP pública oficial antes de sacarlas por el puerto hacia la calle (interface g0/1). Así, 500 personas pueden navegar a la vez pagando una sola IP de internet (overload).<br><br><b>Instrucción:</b> Haz doble clic en el <b>Router</b> para abrir su CLI y ejecuta:<br>1. <code>configure terminal</code><br>2. <code>ip nat inside source list 1 interface g0/1 overload</code> <i>(Traduce TODAS las IPs de tu empresa [list 1] para que salgan a internet disfrazadas bajo la IP pública única de la salida [interface g0/1] usando puertos [overload]).</i>',
        theory: '<b>📘 Misión 4.1: NAT (El truco de magia)</b><br><br>En tu casa tienes 10 dispositivos, pero tu proveedor solo te da 1 IP Pública real. <span class="concept" data-term="nat">NAT</span> (Sobrecarga) es el traductor en la puerta de tu Router. Agarra la IP privada de tu teléfono, la esconde, le pega la IP Pública de la casa, manda la petición a Google, y cuando vuelve, sabe exactamente devolverle la respuesta a tu teléfono.',
        tasks: [ { id: 't1', text: 'Comando de sobrecarga PAT', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('ip nat inside source list 1 interface g0/1 overload'); }
    },
    {
        id: '4.2',
        tier: 'DOMINIO 4: SERVICIOS IP',
        title: 'NTP (Network Time Protocol)',
        desc: '<b>Objetivo:</b> Sincronizar el reloj atómico del Router.<br><br><b>Objetivo Práctico (¿Qué estamos logrando?):</b><br>Si a las 3:00 AM ocurre un hackeo, pero cada router tiene una hora distinta configurada, será imposible rastrear al culpable cruzando los logs de seguridad. <b>NTP</b> sincroniza todos tus equipos contra un reloj atómico mundial (como el de Google) para tener un tiempo forense exacto y unificado.<br><br><b>Instrucción:</b> Haz doble clic en el <b>Router</b> para abrir su CLI y ejecuta:<br>1. <code>configure terminal</code><br>2. <code>ntp server 8.8.8.8</code> <i>(Le dice al equipo: "Conéctate al servidor de Google [8.8.8.8] y sincroniza tus milisegundos exactos para que los registros de errores tengan fecha real").</i>',
        theory: '<b>📘 Misión 4.2: Relojes Exactos (NTP)</b><br><br>Si hay un hackeo a las 3:15 AM, pero el Router de Ventas cree que es el año 1993, el FBI nunca resolverá el caso. NTP (Network Time Protocol) obliga a toda la escuela de routers a sincronizar sus relojes al milisegundo contra un servidor maestro (ej. Google 8.8.8.8).',
        tasks: [ { id: 't1', text: 'Comando: ntp server 8.8.8.8', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('ntp server')); }
    },
    {
        id: '4.3',
        tier: 'DOMINIO 4: SERVICIOS IP',
        title: 'Gestión: Syslog, SNMP y TFTP',
        desc: '<b>Objetivo:</b> Centralizar el registro de errores.<br><br><b>Objetivo Práctico (¿Qué estamos logrando?):</b><br>Los routers tienen poca memoria interna. Si hay un error crítico y el equipo se reinicia, los logs se borran y te quedas ciego. <b>Syslog</b> hace que los equipos disparen cada registro de error inmediatamente hacia un servidor centralizado (como un disco duro externo de seguridad de la red), para auditorías futuras.<br><br><b>Instrucción:</b> Haz doble clic en el <b>Router</b> para abrir su CLI y ejecuta:<br>1. <code>configure terminal</code><br>2. <code>logging 192.168.1.10</code> <i>(Le dice al Router: "Si ocurre algún fallo, no lo guardes en tu memoria interna. Envíalo de inmediato al Servidor Syslog en la IP 192.168.1.10").</i>',
        theory: '<b>📘 CCNA 4.3: Monitorización y Gestión</b><br><br>• <b><span class="concept" data-term="syslog">Syslog:</span></b> Envía un reporte de texto al servidor central cada vez que hay un fallo.<br>• <b><span class="concept" data-term="snmp">SNMP:</span></b> Protocolo para monitorear el estado del equipo en tiempo real (ej. % de CPU, uso del cable).<br>• <b><span class="concept" data-term="tftp">TFTP/FTP/SCP:</span></b> Protocolos usados para hacer backups de la configuración del Router hacia un servidor externo.',
        tasks: [ { id: 't1', text: 'Comando: logging 192.168.1.10', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('logging')); }
    },
    {
        id: '4.4',
        tier: 'DOMINIO 4: SERVICIOS IP',
        title: 'Servicios DHCP y QoS',
        desc: '<b>Instrucción:</b> Tipea <code>acknowledge qos</code>, comprendiendo que el policía de tráfico prioriza la voz, y que DHCP reparte IPs.',
        theory: '<b>📘 CCNA 4.4: QoS y DHCP</b><br><br>• <b><span class="concept" data-term="dhcp">DHCP</span>:</b> El servidor automático que le alquila IPs, Máscaras y Puertas de enlace a los endpoints al instante.<br>• <b><span class="concept" data-term="qos">QoS:</span></b> El policía de tráfico. Frenará los paquetes de Netflix si se satura la red para garantizar que las llamadas de VozIP (que no toleran retrasos) pasen por la fila VIP.',
        tasks: [ { id: 't1', text: 'Comando: acknowledge qos', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('acknowledge qos'); }
    },

    // ==========================================
    // DOMINIO 5: FUNDAMENTOS DE SEGURIDAD (15%)
    // ==========================================
    {
        id: '5.1',
        tier: 'DOMINIO 5: SEGURIDAD',
        title: 'Amenazas y VPNs',
        desc: '<b>Instrucción:</b> Tipea <code>acknowledge threats</code>, entendiendo cómo las VPNs meten tu tráfico dentro de una "Caja Fuerte" cifrada al viajar por internet.',
        theory: '<b>📘 Misión 5.1: VPNs y Cifrado</b><br><br>Enviar datos por Internet es como mandar una postal sin sobre: el cartero puede leerla. Una <b>VPN</b> (Red Privada Virtual) mete tu carta en una caja fuerte de acero, y la manda por un túnel secreto subterráneo a través de internet. Nadie en el medio puede leer ni alterar la información.',
        tasks: [ { id: 't1', text: 'Comando: acknowledge threats', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('acknowledge threats'); }
    },
    {
        id: '5.2',
        tier: 'DOMINIO 5: SEGURIDAD',
        title: 'Modelo de Acceso (AAA)',
        desc: '<b>Objetivo:</b> Autenticación externa (Radius/Tacacs).<br><br><b>Objetivo Práctico (¿Qué estamos logrando?):</b><br>En una empresa con 500 routers, cambiar la contraseña de un administrador que renunció tomaría semanas si entras equipo por equipo. Con <b>AAA (Radius/Tacacs)</b>, el router ya no guarda contraseñas; le pregunta a un servidor de seguridad central. Cambias la clave en ese servidor, y el ex-empleado pierde acceso a los 500 equipos al instante.<br><br><b>Instrucción:</b> Haz doble clic en el <b>Router</b> para abrir su CLI y ejecuta:<br>1. <code>configure terminal</code><br>2. <code>aaa new-model</code> <i>(Enciende el modelo de seguridad Avanzada. El router ya no validará las contraseñas localmente, sino que le preguntará a un Servidor de Seguridad central si el empleado tiene acceso).</i>',
        theory: '<b>📘 Misión 5.2: Autenticación (AAA)</b><br><br>Si tienes 500 routers, crear cuentas de usuario en cada uno para los ingenieros toma semanas. <b>AAA</b> hace que el router no guarde las contraseñas. Cuando intentas entrar, el router "llama por teléfono" a un Servidor de Seguridad Central (RADIUS o TACACS) y le pregunta: <i>"¿El ingeniero Juan tiene permiso de apagar mis puertos?"</i>.',
        tasks: [ { id: 't1', text: 'Comando: aaa new-model', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('aaa new-model')); }
    },
    {
        id: '5.3',
        tier: 'DOMINIO 5: SEGURIDAD',
        title: 'Listas de Control de Acceso (ACL)',
        desc: '<b>Objetivo:</b> Poner un Patovica/Guardia a filtrar IPs.<br><br><b>Objetivo Práctico (¿Qué estamos logrando?):</b><br>Una <b>ACL (Lista de Control de Acceso)</b> es el guardia de seguridad (Patovica) en la puerta del router. Le das una lista de quién puede entrar y quién no. Si una IP sospechosa intenta pasar, el router destruye ese paquete en la puerta antes de que contamine el resto de la red.<br><br><b>Instrucción:</b> Haz doble clic en el <b>Router</b> para abrir su CLI y ejecuta:<br>1. <code>configure terminal</code><br>2. <code>access-list 10 deny 192.168.1.50</code> <i>(Le das la orden al guardia número 10: "Bloquea absolutamente todo el tráfico que venga desde la PC sospechosa 192.168.1.50").</i>',
        theory: '<b>📘 Misión 5.3: El Patovica (ACL)</b><br><br>Una <span class="concept" data-term="acl">ACL</span> es la lista de invitados del club. Puedes decirle al Router: <i>"Deja pasar a todos, excepto a la IP de ese alumno rebelde"</i> (ACL Estándar). O mejor aún: <i>"Deja pasar al alumno a la web, pero prohíbele que acceda al servidor FTP a descargar películas"</i> (ACL Extendida).',
        tasks: [ { id: 't1', text: 'Comando: access-list 10 deny ...', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('access-list')); }
    },
    {
        id: '5.4',
        tier: 'DOMINIO 5: SEGURIDAD',
        title: 'Seguridad Capa 2: Port Security y DAI',
        desc: '<b>Objetivo:</b> Bloquear suplantación de identidad interna.<br><br><b>Objetivo Práctico (¿Qué estamos logrando?):</b><br>Un hacker interno podría enviarle mensajes falsos a todas las PCs diciendo '¡Hola, yo soy el Router, envíenme su tráfico a mí!' (Ataque MitM/ARP Spoofing). <b>ARP Inspection</b> hace que el Switch analice esos mensajes y bloquee el puerto del hacker instantáneamente al detectar la mentira.<br><br><b>Instrucción:</b> Haz doble clic en el <b>Switch</b> para abrir su CLI y ejecuta:<br>1. <code>configure terminal</code><br>2. <code>ip arp inspection vlan 10</code> <i>(Protege el departamento 10. Si un empleado hacker intenta decir "¡Oigan, envíenme sus contraseñas, yo soy el Router!", el Switch interceptará su mentira ARP y la bloqueará).</i>',
        theory: '<b>📘 CCNA 5.4: Amenazas Internas en Capa 2</b><br><br>Los ataques más comunes desde adentro:<br>• <b><span class="concept" data-term="port_sec">Port Security:</span></b> Apaga el puerto si se conecta una Dirección MAC desconocida.<br>• <b><span class="concept" data-term="snooping">DHCP Snooping:</span></b> Evita que un hacker conecte un servidor DHCP falso para robar tráfico.<br>• <b><span class="concept" data-term="dai">Dynamic ARP Inspection (DAI):</span></b> Bloquea la suplantación de identidad ARP (Man-In-The-Middle).',
        tasks: [ { id: 't1', text: 'Comando: ip arp inspection vlan 10', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.some(c => c.includes('arp inspection')); }
    },
    {
        id: '5.5',
        tier: 'DOMINIO 5: SEGURIDAD',
        title: 'Seguridad Inalámbrica',
        desc: '<b>Instrucción:</b> Tipea <code>acknowledge wpa</code>, entendiendo por qué el protocolo WPA3 destruye los ataques de diccionario offline.',
        theory: '<b>📘 Misión 5.5: Seguridad Wi-Fi</b><br><br>El aire es de todos, así que en Wi-Fi cifrar es vital. <b>WPA2</b> era el rey, pero se descubrió que los hackers podían grabar cómo te conectabas y luego irse a su casa a adivinar la contraseña offline con fuerza bruta. <b>WPA3</b> arregló esto bloqueando matemáticamente que alguien adivine la clave estando offline. Si no estás ahí, no entras.',
        tasks: [ { id: 't1', text: 'Comando: acknowledge wpa', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('acknowledge wpa'); }
    },

    // ==========================================
    // DOMINIO 6: AUTOMATIZACIÓN (10%)
    // ==========================================
    {
        id: '6.1',
        tier: 'DOMINIO 6: AUTOMATIZACIÓN',
        title: 'Redes Definidas por Software (SDN)',
        desc: '<b>Instrucción:</b> Tipea <code>acknowledge sdn</code> tras entender que ya no se configura equipo por equipo, sino que un solo panel web inyecta código a toda la red.',
        theory: '<b>📘 CCNA 6.1: Redes del Futuro (SDN)</b><br><br><span class="concept" data-term="sdn">SDN</span> separa el "Cerebro" (Control Plane) del equipo y lo mueve a un Controlador Centralizado.<br>Ecosistema Cisco:<br>• <b><span class="concept" data-term="dna">Cisco DNA Center:</span></b> El panel web maestro para administrar switches.<br>• <b><span class="concept" data-term="sdaccess">SD-Access:</span></b> Crea redes LAN empresariales automatizadas usando DNA Center.<br>• <b><span class="concept" data-term="sdwan">SD-WAN:</span></b> Controla las conexiones WAN mundiales por software, decidiendo en milisegundos si enviar tráfico por Fibra o por 4G.',
        tasks: [ { id: 't1', text: 'Comando: acknowledge sdn', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('acknowledge sdn'); }
    },
    {
        id: '6.2',
        tier: 'DOMINIO 6: AUTOMATIZACIÓN',
        title: 'APIs REST y Formato JSON',
        desc: '<b>Instrucción:</b> Tipea <code>acknowledge api</code> tras comprender que las máquinas hablan entre sí enviando texto estructurado en formato JSON a través de URLs.',
        theory: '<b>📘 CCNA 6.2: APIs REST y JSON</b><br><br><b>APIs REST:</b> Las máquinas usan verbos HTTP para pedirse cosas (GET=Leer, POST=Crear, PUT/PATCH=Modificar, DELETE=Borrar).<br><b>JSON:</b> El formato de texto universal que agrupa la información con llaves y corchetes para que el router y el programa externo se entiendan en milisegundos.',
        tasks: [ { id: 't1', text: 'Comando: curl -X GET http://api/v1/status', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('curl -x get http://api/v1/status'); }
    },
    {
        id: '6.3',
        tier: 'DOMINIO 6: AUTOMATIZACIÓN',
        title: 'Herramientas de Configuración',
        desc: '<b>Instrucción:</b> Tipea <code>acknowledge ansible</code>, asimilando que es una herramienta para ejecutar tareas repetitivas en 500 equipos con 1 solo clic.',
        theory: '<b>📘 Misión 6.3: Chef, Ansible y Puppet</b><br><br>Son herramientas mágicas de automatización. Tú escribes un "Libro de Recetas" (Script) diciendo: <i>"Quiero que todos los routers de la empresa cambien su clave a 1234"</i>. <b>Ansible</b> toma esa receta, se conecta automáticamente a todos tus routers usando un agente SSH y hace el trabajo por ti en 15 segundos.',
        tasks: [ { id: 't1', text: 'Comando: acknowledge config-mgmt', done: false } ],
        check: function() { return window.cmdHistory && window.cmdHistory.includes('acknowledge config-mgmt'); }
    }
];

let currentTicketIndex = 0;
let isEvaluating = false;
window.hasTriggeredLoop = window.hasTriggeredLoop || false; 
window.cmdHistory = window.cmdHistory || [];


const GLOSSARY = {

    'snooping': '<b><span class="concept" data-term="snooping">DHCP Snooping:</span></b><br>Técnica de seguridad que bloquea servidores DHCP falsos (rogue) que intentan dar IPs maliciosas a los usuarios.<br><a href="https://es.wikipedia.org/wiki/DHCP_snooping" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'dtp': '<b><span class="concept" data-term="dtp">DTP (Dynamic Trunking Protocol)</span>:</b><br>Protocolo propietario de Cisco que negocia automáticamente si un cable debe ser un Enlace Troncal (Trunk) o de Acceso.<br><a href="https://es.wikipedia.org/wiki/Dynamic_Trunking_Protocol" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'port_sec': '<b><span class="concept" data-term="port_sec">Port Security:</span></b><br>Función de Capa 2 que apaga el puerto del switch si alguien desconecta la PC oficial y conecta una laptop no autorizada (reconocida por su MAC).<br><a href="https://es.wikipedia.org/wiki/Seguridad_de_puertos" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'snmp': '<b>SNMP (Simple Network Management Protocol):</b><br>El estándar universal para monitorear la "salud" (CPU, RAM, Temperatura, Tráfico) de los equipos de red.<br><a href="https://es.wikipedia.org/wiki/Simple_Network_Management_Protocol" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'tftp': '<b>TFTP (Trivial File Transfer Protocol):</b><br>Un protocolo ultra-ligero usado por los routers para guardar o descargar copias de seguridad de sus configuraciones.<br><a href="https://es.wikipedia.org/wiki/Trivial_File_Transfer_Protocol" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'syslog': '<b><span class="concept" data-term="syslog">Syslog:</span></b><br>Un sistema que recolecta los mensajes de error y eventos críticos de cientos de routers en un solo servidor para facilitar la auditoría.<br><a href="https://es.wikipedia.org/wiki/Syslog" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'dai': '<b>DAI (Dynamic ARP Inspection):</b><br>Escudo protector que intercepta mensajes ARP falsos, previniendo los ataques "Man-in-the-Middle".<br><a href="https://www.cisco.com/c/es_mx/support/docs/switches/catalyst-6500-series-switches/72928-dynamicarp.html" target="_blank" style="color:#0f0;">[Doc Oficial Cisco]</a>',
    'qos': '<b>QoS (Quality of Service):</b><br>Mecanismo que clasifica el tráfico para darle trato VIP (prioridad) a cosas sensibles al lag como llamadas o videollamadas.<br><a href="https://es.wikipedia.org/wiki/Calidad_de_servicio" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'dna': '<b><span class="concept" data-term="dna">Cisco DNA Center:</span></b><br>Una plataforma de control (SDN) gráfica. El panel de mando supremo para manejar una red empresarial completa de Cisco.<br><a href="https://www.cisco.com/c/es_mx/products/cloud-systems-management/dna-center/index.html" target="_blank" style="color:#0f0;">[Página de Cisco]</a>',
    'sdaccess': '<b><span class="concept" data-term="sdaccess">SD-Access:</span></b><br>Evolución de las VLANs. Permite aplicar políticas de seguridad a nivel mundial para que el acceso de un usuario sea igual en cualquier sucursal.<br><a href="https://www.cisco.com/c/es_mx/solutions/enterprise-networks/software-defined-access/index.html" target="_blank" style="color:#0f0;">[Página de Cisco]</a>',
    'sdwan': '<b><span class="concept" data-term="sdwan">SD-WAN:</span></b><br>Reducir costos combinando líneas caras dedicadas con Internet barato, dejando que el software elija el mejor camino en tiempo real.<br><a href="https://es.wikipedia.org/wiki/SD-WAN" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'spine_leaf': '<b><span class="concept" data-term="spine_leaf">Spine-Leaf:</span></b><br>Topología de centro de datos parecida a una telaraña. Todos los switches hoja (Leaf) se conectan a todos los espina (Spine), reduciendo cuellos de botella.<br><a href="https://www.cisco.com/c/es_mx/support/docs/switches/nexus-9000-series-switches/118997-technote-nexus-00.html" target="_blank" style="color:#0f0;">[Doc Oficial Cisco]</a>',
    'soho': '<b><span class="concept" data-term="soho">SOHO:</span></b><br>Small Office / Home Office. Un router todo-en-uno que tienes en casa. Actúa como modem, switch, firewall y punto de acceso Wi-Fi a la vez.<br><a href="https://es.wikipedia.org/wiki/SOHO_(inform%C3%A1tica)" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'on_prem': '<b><span class="concept" data-term="on_prem">On-premises</span> (Local):</b><br>Cuando la empresa compra, instala y mantiene sus propios servidores de chapa y silicio en sus propios sótanos.<br><a href="https://es.wikipedia.org/wiki/<span class="concept" data-term="on_prem">On-premises</span>_software" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    '8021q': '<b><span class="concept" data-term="8021q">802.1Q</span> (Dot1Q):</b><br>El estándar universal que le inyecta una etiqueta a un paquete para indicar a qué VLAN pertenece antes de enviarlo por un tronco.<br><a href="https://es.wikipedia.org/wiki/IEEE_<span class="concept" data-term="8021q">802.1Q</span>" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',

    'ip': '<b>IP (Internet Protocol):</b><br>Es el "número de asiento" o identificador único de un equipo en la red.<br><a href="https://es.wikipedia.org/wiki/Direcci%C3%B3n_IP" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'lan': '<b>LAN (Red de Área Local):</b><br>Red privada pequeña, como tu casa o escuela. Los equipos hablan directo entre sí sin salir a Internet.<br><a href="https://es.wikipedia.org/wiki/Red_de_%C3%A1rea_local" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'wan': '<b>WAN (Red de Área Amplia):</b><br>Red gigante que une múltiples LANs. Internet es la WAN más grande del mundo.<br><a href="https://es.wikipedia.org/wiki/Red_de_%C3%A1rea_amplia" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'mac': '<b>Dirección MAC:</b><br>El "número de serie" de fábrica de tu tarjeta de red. Nunca cambia.<br><a href="https://es.wikipedia.org/wiki/Direcci%C3%B3n_MAC" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'broadcast': '<b>Broadcast:</b><br>Gritar un mensaje para que TODOS los equipos del salón (red) lo escuchen al mismo tiempo.<br><a href="https://es.wikipedia.org/wiki/Difusi%C3%B3n_amplia" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'emi': '<b>EMI (Interferencia Electromagnética):</b><br>Ruido eléctrico (motores, microondas, tormentas) que corrompe los datos en cables de cobre.<br><a href="https://es.wikipedia.org/wiki/Interferencia_electromagn%C3%A9tica" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'rf': '<b>Radio Frecuencia:</b><br>Ondas invisibles en el aire que transportan datos (Wi-Fi).<br><a href="https://es.wikipedia.org/wiki/Radiofrecuencia" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'ssid': '<b>SSID (Service Set IDentifier):</b><br>El nombre público de la red Wi-Fi que ves en tu teléfono.<br><a href="https://es.wikipedia.org/wiki/Service_Set_Identifier" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'vlan': '<b>VLAN (LAN Virtual):</b><br>Paredes invisibles que separan un mismo Switch en varios grupos distintos por seguridad.<br><a href="https://www.cisco.com/c/es_mx/support/docs/lan-switching/vlan/13769-9.html" target="_blank" style="color:#0f0;">[Doc Oficial Cisco]</a>',
    'trunk': '<b>Enlace Troncal:</b><br>Un "super-cable" que permite que múltiples VLANs viajen por el mismo tubo sin mezclarse.<br><a href="https://es.wikipedia.org/wiki/VLAN_Trunking_Protocol" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'poe': '<b>PoE (Power over Ethernet):</b><br>Magia que envía corriente eléctrica por el mismo cable de datos de red, evitando usar enchufes de pared.<br><a href="https://es.wikipedia.org/wiki/Power_over_Ethernet" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'capa2': '<b>Capa 2 (Enlace de Datos):</b><br>Mundo de los Switches. Se entregan paquetes localmente usando direcciones MAC.<br><a href="https://es.wikipedia.org/wiki/Nivel_de_enlace_de_datos" target="_blank" style="color:#0f0;">[Leer Modelo OSI]</a>',
    'capa3': '<b>Capa 3 (Red):</b><br>Mundo de los Routers. Buscan el mejor camino hacia redes lejanas usando IPs.<br><a href="https://es.wikipedia.org/wiki/Nivel_de_red" target="_blank" style="color:#0f0;">[Leer Modelo OSI]</a>',
    'stp': '<b>STP (Spanning Tree Protocol):</b><br>Un guardián automático que bloquea cables de red redundantes para evitar que los mensajes den vueltas infinitamente.<br><a href="https://es.wikipedia.org/wiki/Spanning_tree" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'wlc': '<b>WLC (Wireless LAN Controller):</b><br>El "Cerebro Central" que controla docenas de antenas Wi-Fi tontas al mismo tiempo.<br><a href="https://www.cisco.com/c/en/us/products/wireless/wireless-lan-controller/index.html" target="_blank" style="color:#0f0;">[Ver WLCs en Cisco]</a>',
    'lacp': '<b>LACP (EtherChannel):</b><br>Agarrar 4 cables físicos y pegarlos con cinta adhesiva lógica para que funcionen como 1 solo cable cuádruplemente rápido.<br><a href="https://www.cisco.com/c/es_mx/support/docs/lan-switching/etherchannel/12023-4.html" target="_blank" style="color:#0f0;">[Doc Oficial Cisco]</a>',
    'ospf': '<b>OSPF:</b><br>Protocolo donde los Routers se cuentan chismes sobre qué caminos conocen, creando un mapa GPS de todo el mundo.<br><a href="https://es.wikipedia.org/wiki/Open_Shortest_Path_First" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'nat': '<b>NAT (Network Address Translation):</b><br>El truco de magia que permite que 500 PCs de tu casa salgan a Internet usando 1 sola IP pública.<br><a href="https://es.wikipedia.org/wiki/Traducci%C3%B3n_de_direcciones_de_red" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'dhcp': '<b>DHCP:</b><br>El secretario automático que le reparte IPs, Máscaras y Puertas de enlace a las PCs apenas se conectan.<br><a href="https://es.wikipedia.org/wiki/Protocolo_de_configuraci%C3%B3n_din%C3%A1mica_de_host" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'acl': '<b>ACL (Listas de Control de Acceso):</b><br>El "Patovica / Guardia" en la puerta del Router. Tú defines una lista de quién entra y quién se queda afuera.<br><a href="https://es.wikipedia.org/wiki/Lista_de_control_de_acceso" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    
    'capa1': '<b>Capa 1 (Física):</b><br>El mundo tangible. Cables, electricidad, ondas de radio y fierros físicos. Todo lo que puedes tocar.<br><a href="https://es.wikipedia.org/wiki/Capa_f%C3%ADsica" target="_blank" style="color:#0f0;">[Leer Modelo OSI]</a>',
    'rack': '<b>Bastidor (Rack 19"):</b><br>Armario metálico estandarizado para atornillar equipos. Permite apilar hardware verticalmente ahorrando espacio.<br><a href="https://es.wikipedia.org/wiki/Rack" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'utp': '<b>UTP (Par Trenzado No Blindado):</b><br>El clásico cable de red (azul o gris). Tiene 8 hilos de cobre trenzados por dentro para anular interferencias.<br><a href="https://es.wikipedia.org/wiki/Cable_de_par_trenzado" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'rj45': '<b>Conector RJ45:</b><br>La ficha de plástico transparente en las puntas del cable UTP que hace "click" al enchufarse.<br><a href="https://es.wikipedia.org/wiki/RJ-45" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'vlsm': '<b>VLSM (Máscara de Subred de Longitud Variable):</b><br>Técnica matemática avanzada para cortar un bloque de IPs en pedazos de tamaños irregulares, sin desperdiciar direcciones.<br><a href="https://es.wikipedia.org/wiki/VLSM" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>',
    'sdn': '<b>SDN (Software Defined Networking):</b><br>Separar el "Cerebro" del equipo de sus "Músculos". Programas la red entera desde una app central.<br><a href="https://es.wikipedia.org/wiki/Redes_definidas_por_software" target="_blank" style="color:#0f0;">[Leer más en Wikipedia]</a>'
};


window.glossaryHideTimer = null;
function attachGlossary() {
    let tt = document.getElementById('concept-tooltip');
    if(!tt) {
        tt = document.createElement('div');
        tt.id = 'concept-tooltip';
        document.body.appendChild(tt);
        
        // Keep alive when hovering tooltip
        tt.addEventListener('mouseenter', () => {
            clearTimeout(window.glossaryHideTimer);
        });
        tt.addEventListener('mouseleave', () => {
            tt.classList.add('hidden');
        });
    }

    document.querySelectorAll('.concept').forEach(el => {
        el.addEventListener('mouseenter', (e) => {
            clearTimeout(window.glossaryHideTimer);
            const term = el.getAttribute('data-term');
            tt.innerHTML = GLOSSARY[term] || 'Concepto no definido.';
            tt.classList.remove('hidden');
            
            // Positioning below the word
            const rect = el.getBoundingClientRect();
            tt.style.left = rect.left + 'px';
            tt.style.top = (rect.bottom + 5) + 'px';
        });
        el.addEventListener('mouseleave', () => {
            window.glossaryHideTimer = setTimeout(() => {
                tt.classList.add('hidden');
            }, 300); // 300ms grace period to move mouse to tooltip
        });
    });
}

function renderTicket() {
    const panel = document.getElementById('ticket-panel');
    if(currentTicketIndex >= tickets.length) {
        panel.innerHTML = `
            <div class="ticket-header">
                <span>[+] N.E.X.U.S. HELPDESK</span>
                <span class="status-badge completed">CERTIFICACIÓN CCNA OBTENIDA</span>
            </div>
            <div class="ticket-body">
                <h3 style="color:#0f0">¡Currículo CCNA Oficial (6 Dominios) Completado!</h3>
                <p>Ha dominado el 100% de los temas teóricos y prácticos del CCNA 200-301.</p>
                <div class="ticket-theory" style="border-left-color: #0f0;">
                    <b>Experiencia Comprobada:</b><br>
                    1. Fundamentos y Arquitecturas Físicas<br>
                    2. Acceso (VLANs, STP, WLC, LACP)<br>
                    3. Conectividad IP (Rutas Estáticas, OSPF, FHRP)<br>
                    4. Servicios (NAT, DHCP, NTP, Syslog, QoS)<br>
                    5. Seguridad (ACLs, Snooping, DAI, AAA, WPA3)<br>
                    6. SDN, APIs REST, JSON, Ansible
                </div>
            </div>
        `;
        return;
    }
    
    const tkt = tickets[currentTicketIndex];
    document.getElementById('ticket-tier').innerText = tkt.tier;
    document.getElementById('ticket-title').innerText = `${tkt.id}: ${tkt.title}`;
    document.getElementById('ticket-desc').innerHTML = tkt.desc;
    
    let theoryBlock = document.getElementById('ticket-theory-block');
    if(!theoryBlock) {
        theoryBlock = document.createElement('div');
        theoryBlock.id = 'ticket-theory-block';
        theoryBlock.className = 'ticket-theory';
        const progressDiv = document.querySelector('.ticket-progress');
        progressDiv.parentNode.insertBefore(theoryBlock, progressDiv);
    }
    theoryBlock.innerHTML = tkt.theory;
    
    const statusBadge = document.getElementById('ticket-status');
    statusBadge.innerText = 'ACTIVO';
    statusBadge.className = 'status-badge';
    panel.classList.remove('success');
    
    const ul = document.getElementById('ticket-tasks');
    ul.innerHTML = '';
    tkt.tasks.forEach(task => {
        ul.innerHTML += `<li><span class="task-box ${task.done ? 'done' : ''}"></span> ${task.text}</li>`;
    });
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
        const panel = document.getElementById('ticket-panel');
        
        statusBadge.innerText = 'COMPLETADO';
        statusBadge.className = 'status-badge completed';
        panel.classList.add('success');
        
        setTimeout(() => {
            currentTicketIndex++;
            isEvaluating = false;
            // No reseteamos cmdHistory para misiones dependientes
            renderTicket();
        }, 6000); 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderTicket();
    
    const observer = new MutationObserver(() => {
        clearTimeout(window.ticketEvalTimer);
        window.ticketEvalTimer = setTimeout(() => {
            evaluateTickets();
        }, 150);
    });
    
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'data-slot'] });
    document.getElementById('cli-input').addEventListener('keydown', (e) => {
        if(e.key === 'Enter') { setTimeout(evaluateTickets, 250); }
    });
});

// DEBUG: Botón Skip

// DEBUG: Botón Prev
const prevBtn = document.getElementById('debug-prev-btn');
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentTicketIndex > 0) {
            currentTicketIndex--;
            const tkt = tickets[currentTicketIndex];
            tkt.tasks.forEach(t => t.done = false); // Reset the tasks so it's fresh
            
            // Si tiene comandos a comprobar, borramos el history para obligarlo a repetirlo si quiere
            // window.cmdHistory = []; 
            
            document.getElementById('ticket-status').innerText = 'ACTIVO';
            document.getElementById('ticket-status').className = 'status-badge';
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
        
        document.getElementById('ticket-status').innerText = 'DEBUG-SKIP';
        document.getElementById('ticket-status').className = 'status-badge completed';
        renderTicket();
        
        setTimeout(() => {
            currentTicketIndex++;
            isEvaluating = false;
            
            if(currentTicketIndex < tickets.length) {
                document.getElementById('ticket-status').innerText = 'ACTIVO';
                document.getElementById('ticket-status').className = 'status-badge';
                renderTicket();
            } else {
                renderTicket();
            }
        }, 800);
    });
}
