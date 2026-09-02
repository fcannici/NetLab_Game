const cliOverlay = document.getElementById('cli-overlay');
const cliClose = document.getElementById('cli-close');
const cliTitle = document.getElementById('cli-title');
const cliOutput = document.getElementById('cli-output');
const cliInput = document.getElementById('cli-input');
const cliPrompt = document.getElementById('cli-prompt');

let currentVendor = 'cisco';
let cliMode = 'user'; // user, priv, config para Cisco

window.openCLI = function(deviceName, vendor) {
    currentVendor = vendor;
    cliTitle.innerText = `Consola: ${deviceName}`;
    cliOutput.innerHTML = `Conectado a ${deviceName} via consola...\n\n`;
    
    if (vendor === 'windows') {
        cliMode = 'cmd';
        cliPrompt.innerText = 'C:\\Users\\Admin>';
    } else if (vendor === 'cisco') {
        cliMode = 'user';
        cliPrompt.innerText = 'Switch>';
    } else if (vendor === 'fortinet') {
        cliMode = 'user';
        cliPrompt.innerText = 'FortiGate #';
    }
    
    cliOverlay.classList.remove('hidden');
    cliInput.focus();
};

cliClose.addEventListener('click', () => {
    cliOverlay.classList.add('hidden');
    cliInput.value = '';
});

// Parse commands
cliInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const cmd = cliInput.value.trim().toLowerCase();
        if (!window.cmdHistory) window.cmdHistory = [];
        window.cmdHistory.push(cmd);
        cliInput.value = '';
        
        // Print the command
        cliOutput.innerHTML += `${cliPrompt.innerText} ${cmd}\n`;
        
        // Process
        processCommand(cmd);
        
        // Auto scroll to bottom
        const terminal = document.getElementById('cli-terminal');
        terminal.scrollTop = terminal.scrollHeight;
    }
});

function processCommand(cmd) {
    if (cmd === '') return;
    
    if (currentVendor === 'cisco') {
        let baseName = cliPrompt.innerText.split('>')[0].split('#')[0].split('(')[0] || 'Switch';
        
        if (cliMode === 'user') {
            if (cmd === 'enable' || cmd === 'en') {
                cliMode = 'priv';
                cliPrompt.innerText = baseName + '#';
            } else if (cmd.startsWith('curl ') || cmd.startsWith('curl -x get ')) {
            cliOutput.innerHTML += `HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "active",
  "controller_version": "2.2.3.4",
  "health_score": 98,
  "managed_devices": 42
}
`;
        } else if (cmd.startsWith('acknowledge ')) {
            cliOutput.innerHTML += `[OK] Concepto de red asimilado.
`;
        } else if (cmd === 'exit') {
                cliOutput.innerHTML += 'Desconectando...\n';
                setTimeout(() => cliClose.click(), 500);
            } else {
                cliOutput.innerHTML += `Translating "${cmd}"... domain server (255.255.255.255)\n% Unknown command or computer name, or unable to find computer address\n`;
            }
        } 
        else if (cliMode === 'priv') {
            if (cmd === 'configure terminal' || cmd === 'conf t') {
                cliMode = 'config';
                cliPrompt.innerText = baseName + '(config)#';
            } else if (cmd === 'show vlan' || cmd === 'sh vlan') {
                cliOutput.innerHTML += `VLAN Name                             Status    Ports\n---- -------------------------------- --------- -------------------------------\n1    default                          active    Fa0/1, Fa0/2\n10   VENTAS                           active    Fa0/3\n`;
            } else if (cmd === 'show running-config' || cmd === 'sh run') {
                cliOutput.innerHTML += `Building configuration...\n\nCurrent configuration : 1243 bytes\n!\nversion 15.0\nhostname ${baseName}\n!\nenable secret 5 $1$mERr$hx5rVt7rPNoS4wqbXKX7m0\n!\ninterface FastEthernet0/1\n switchport access vlan 10\n switchport mode access\n!\ninterface Vlan10\n ip address 192.168.10.1 255.255.255.0\n!\nline con 0\n password 7 0822455D0A16\n login\n!\nend\n`;
            } else if (cmd === 'show ip interface brief' || cmd === 'sh ip int br') {
                cliOutput.innerHTML += `Interface              IP-Address      OK? Method Status                Protocol\nFastEthernet0/1        unassigned      YES unset  up                    up\nFastEthernet0/2        unassigned      YES unset  up                    up\nVlan1                  unassigned      YES unset  administratively down down\nVlan10                 192.168.10.1    YES manual up                    up\n`;
            } else if (cmd === 'copy running-config startup-config' || cmd === 'write' || cmd === 'wr') {
                cliOutput.innerHTML += `Destination filename [startup-config]? \nBuilding configuration...\n[OK]\n`;
            } else if (cmd === 'show ip route' || cmd === 'sh ip ro') {
                cliOutput.innerHTML += `Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP\n       O - OSPF, IA - OSPF inter area \n\nGateway of last resort is 10.0.0.1 to network 0.0.0.0\n\nS*    0.0.0.0/0 [1/0] via 10.0.0.1\n      192.168.1.0/24 is variably subnetted, 2 subnets, 2 masks\nC        192.168.1.0/24 is directly connected, Vlan1\nL        192.168.1.1/32 is directly connected, Vlan1\n`;
            } else if (cmd === 'exit' || cmd === 'disable') {
                cliMode = 'user';
                cliPrompt.innerText = baseName + '>';
            } else {
                cliOutput.innerHTML += `% Invalid input detected at '^' marker.\n`;
            }
        }
        else if (cliMode === 'config') {
            if (cmd.startsWith('hostname ')) {
                let newName = cmd.split(' ')[1] || 'Switch';
                baseName = newName.toUpperCase();
                cliPrompt.innerText = baseName + '(config)#';
            } else if (cmd.startsWith('vlan ')) {
                cliMode = 'config-vlan';
                cliPrompt.innerText = baseName + '(config-vlan)#';
            } else if (cmd.startsWith('interface ') || cmd.startsWith('int ')) {
                cliMode = 'config-if';
                cliPrompt.innerText = baseName + '(config-if)#';
            } else if (cmd.startsWith('router ospf ')) {
                cliMode = 'config-router';
                cliPrompt.innerText = baseName + '(config-router)#';
            } else if (cmd.startsWith('ip dhcp pool ')) {
                cliMode = 'dhcp-config';
                cliPrompt.innerText = baseName + '(dhcp-config)#';
            } else if (cmd.startsWith('line ')) {
                cliMode = 'config-line';
                cliPrompt.innerText = baseName + '(config-line)#';
            } else if (cmd.startsWith('acknowledge ')) {
                cliOutput.innerHTML += `[OK] Concepto teórico asimilado en la base de datos neuronal.\n`;
            } else if (cmd.startsWith('enable secret ') || cmd.startsWith('access-list ') || cmd.startsWith('ip nat ') || cmd.startsWith('ip route ') || cmd.startsWith('ntp server ') || cmd.startsWith('ip dhcp snooping') || cmd.startsWith('aaa new-model') || cmd.startsWith('logging ') || cmd.startsWith('ip arp inspection ')) {
                // silencioso
            } else if (cmd.startsWith('curl ') || cmd.startsWith('curl -x get ')) {
            cliOutput.innerHTML += `HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "active",
  "controller_version": "2.2.3.4",
  "health_score": 98,
  "managed_devices": 42
}
`;
        } else if (cmd.startsWith('acknowledge ')) {
            cliOutput.innerHTML += `[OK] Concepto de red asimilado.
`;
        } else if (cmd === 'exit') {
                cliMode = 'priv';
                cliPrompt.innerText = baseName + '#';
            } else {
                cliOutput.innerHTML += `% Invalid input detected at '^' marker.\n`;
            }
        }
        else if (cliMode === 'config-vlan') {
            if (cmd.startsWith('name ')) {
                // silencioso
            } else if (cmd.startsWith('curl ') || cmd.startsWith('curl -x get ')) {
            cliOutput.innerHTML += `HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "active",
  "controller_version": "2.2.3.4",
  "health_score": 98,
  "managed_devices": 42
}
`;
        } else if (cmd.startsWith('acknowledge ')) {
            cliOutput.innerHTML += `[OK] Concepto de red asimilado.
`;
        } else if (cmd === 'exit') {
                cliMode = 'config';
                cliPrompt.innerText = baseName + '(config)#';
            } else {
                cliOutput.innerHTML += `% Invalid input detected at '^' marker.\n`;
            }
        }
        else if (cliMode === 'config-if') {
            if (cmd.startsWith('switchport ') || cmd.startsWith('ip address ') || cmd.startsWith('ip add ') || cmd.startsWith('encapsulation ') || cmd.startsWith('ip nat ') || cmd.startsWith('ipv6 address ') || cmd.startsWith('spanning-tree ') || cmd.startsWith('channel-group ') || cmd.startsWith('standby ')) {
                // silencioso
            } else if (cmd === 'no shutdown' || cmd === 'no shut') {
                cliOutput.innerHTML += `\n%LINK-5-CHANGED: Interface configured, changed state to up\n%LINEPROTO-5-UPDOWN: Line protocol on interface, changed state to up\n`;
            } else if (cmd.startsWith('curl ') || cmd.startsWith('curl -x get ')) {
            cliOutput.innerHTML += `HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "active",
  "controller_version": "2.2.3.4",
  "health_score": 98,
  "managed_devices": 42
}
`;
        } else if (cmd.startsWith('acknowledge ')) {
            cliOutput.innerHTML += `[OK] Concepto de red asimilado.
`;
        } else if (cmd === 'exit') {
                cliMode = 'config';
                cliPrompt.innerText = baseName + '(config)#';
            } else {
                cliOutput.innerHTML += `% Invalid input detected at '^' marker.\n`;
            }
        }
        else if (cliMode === 'config-router') {
            if (cmd.startsWith('network ')) {
                // silencioso
            } else if (cmd.startsWith('curl ') || cmd.startsWith('curl -x get ')) {
            cliOutput.innerHTML += `HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "active",
  "controller_version": "2.2.3.4",
  "health_score": 98,
  "managed_devices": 42
}
`;
        } else if (cmd.startsWith('acknowledge ')) {
            cliOutput.innerHTML += `[OK] Concepto de red asimilado.
`;
        } else if (cmd === 'exit') {
                cliMode = 'config';
                cliPrompt.innerText = baseName + '(config)#';
            } else {
                cliOutput.innerHTML += `% Invalid input detected at '^' marker.\n`;
            }
        }
        else if (cliMode === 'dhcp-config') {
            if (cmd.startsWith('network ') || cmd.startsWith('default-router ') || cmd.startsWith('dns-server ')) {
                // silencioso
            } else if (cmd.startsWith('curl ') || cmd.startsWith('curl -x get ')) {
            cliOutput.innerHTML += `HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "active",
  "controller_version": "2.2.3.4",
  "health_score": 98,
  "managed_devices": 42
}
`;
        } else if (cmd.startsWith('acknowledge ')) {
            cliOutput.innerHTML += `[OK] Concepto de red asimilado.
`;
        } else if (cmd === 'exit') {
                cliMode = 'config';
                cliPrompt.innerText = baseName + '(config)#';
            } else {
                cliOutput.innerHTML += `% Invalid input detected at '^' marker.\n`;
            }
        }
        else if (cliMode === 'config-line') {
            if (cmd.startsWith('password ') || cmd === 'login') {
                // silencioso
            } else if (cmd.startsWith('curl ') || cmd.startsWith('curl -x get ')) {
            cliOutput.innerHTML += `HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "active",
  "controller_version": "2.2.3.4",
  "health_score": 98,
  "managed_devices": 42
}
`;
        } else if (cmd.startsWith('acknowledge ')) {
            cliOutput.innerHTML += `[OK] Concepto de red asimilado.
`;
        } else if (cmd === 'exit') {
                cliMode = 'config';
                cliPrompt.innerText = baseName + '(config)#';
            } else {
                cliOutput.innerHTML += `% Invalid input detected at '^' marker.\n`;
            }
        }
    } 
    else if (currentVendor === 'fortinet') {
        if (cmd === 'get system status') {
            cliOutput.innerHTML += `Version: FortiOS v6.4.1\nSerial-Number: FG60F-000000001\nLicense Status: Valid\n`;
        } else if (cmd === 'config system interface') {
            cliPrompt.innerText = 'FortiGate (interface) #';
        } else if (cmd.startsWith('curl ') || cmd.startsWith('curl -x get ')) {
            cliOutput.innerHTML += `HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "active",
  "controller_version": "2.2.3.4",
  "health_score": 98,
  "managed_devices": 42
}
`;
        } else if (cmd.startsWith('acknowledge ')) {
            cliOutput.innerHTML += `[OK] Concepto de red asimilado.
`;
        } else if (cmd === 'exit') {
            cliPrompt.innerText = 'FortiGate #';
        } else {
            cliOutput.innerHTML += `Command fail. Return code -61\n`;
        }
    }
    else if (currentVendor === 'windows') {
        if (cmd.startsWith('ping ')) {
            const ip = cmd.split(' ')[1] || '127.0.0.1';
            
            // PATHFINDING: CAPA 2 y CAPA 3
            // Validamos físicamente la red desde el nodo actual
            let isConnected = false;
            let destFound = false;
            let stormDetected = false;
            window.pingSuccess = false; // Bandera global para misiones
            
            if (window.currentCliElement && window.currentCliElement.classList.contains('powered-on')) {
                // BFS para buscar la IP destino
                let queue = [window.currentCliElement];
                let visited = new Set();
                visited.add(window.currentCliElement);
                
                while(queue.length > 0) {
                    let curr = queue.shift();
                    
                    if (curr.classList.contains('broadcast-storm')) {
                        stormDetected = true;
                        break; // La red colapsa, no hay tráfico posible
                    }
                    
                    // Comprobar si el nodo actual es el destino (hardcoded IPs)
                    let lbl = curr.querySelector('.hw-label') ? curr.querySelector('.hw-label').innerText.toUpperCase() : '';
                    if (ip === '192.168.1.1' && lbl.includes('FIREWALL')) destFound = true;
                    if ((ip === '8.8.8.8' || ip === '200.0.0.1') && lbl.includes('GATEWAY')) destFound = true;
                    
                    if (destFound) break;
                    
                    // Buscar vecinos a través de cables de datos (NO negros/power)
                    let ports = Array.from(curr.querySelectorAll('.port'));
                    let dataCables = document.querySelectorAll('.cable-path:not([stroke="#222222"])');
                    
                    dataCables.forEach(c => {
                        let isSrcHere = ports.includes(c.source_port);
                        let isTgtHere = ports.includes(c.target_port);
                        
                        if (isSrcHere || isTgtHere) {
                            isConnected = true; // Al menos tiene un cable de red
                            let otherPort = isSrcHere ? c.target_port : c.source_port;
                            let neighbor = otherPort ? otherPort.closest('.placed-item') : null;
                            
                            if (neighbor && neighbor.classList.contains('powered-on') && !visited.has(neighbor)) {
                                visited.add(neighbor);
                                queue.push(neighbor);
                            }
                        }
                    });
                }
            }
            
            if (stormDetected) {
                cliOutput.innerHTML += `Haciendo ping a ${ip} con 32 bytes de datos:

Respuesta desde 192.168.1.100: Host de destino inaccesible.
Tiempo de espera agotado para esta solicitud.
Respuesta desde 192.168.1.100: Host de destino inaccesible.
Tiempo de espera agotado para esta solicitud.

Estadísticas de ping para ${ip}:
    Paquetes: enviados = 4, recibidos = 0, perdidos = 4 (100% perdidos)
FALLA FÍSICA: Colapso de red detectado (Tormenta de Broadcast).
`;
            } else if (!destFound) {
                cliOutput.innerHTML += `Haciendo ping a ${ip} con 32 bytes de datos:

PING: error en la transmisión. Falla general.
Respuesta desde 127.0.0.1: Host de destino inaccesible.
Respuesta desde 127.0.0.1: Host de destino inaccesible.
Respuesta desde 127.0.0.1: Host de destino inaccesible.

Estadísticas de ping para ${ip}:
    Paquetes: enviados = 4, recibidos = 0, perdidos = 4 (100% perdidos)
`;
            } else {
                window.pingSuccess = true;
                cliOutput.innerHTML += `Haciendo ping a ${ip} con 32 bytes de datos:
Respuesta desde ${ip}: bytes=32 tiempo<1m TTL=128
Respuesta desde ${ip}: bytes=32 tiempo<1m TTL=128
Respuesta desde ${ip}: bytes=32 tiempo<1m TTL=128
Respuesta desde ${ip}: bytes=32 tiempo<1m TTL=128

Estadísticas de ping para ${ip}:
    Paquetes: enviados = 4, recibidos = 4, perdidos = 0 (0% perdidos)
`;
            }
        } else if (cmd === 'ipconfig') {
            cliOutput.innerHTML += `Configuración IP de Windows

Adaptador de Ethernet Ethernet0:

   Sufijo DNS específico para la conexión. . : nexus.local
   Vínculo: dirección IPv6 local. . . : fe80::a1b2:c3d4:e5f6:7890%12
   Dirección IPv4. . . . . . . . . . . . . . : 192.168.1.100
   Máscara de subred . . . . . . . . . . . . : 255.255.255.0
   Puerta de enlace predeterminada . . . . . : 192.168.1.1
`;
        } else if (cmd === 'hostname') {
            cliOutput.innerHTML += `Laptop-Admin
`;
        } else if (cmd.startsWith('curl ') || cmd.startsWith('curl -x get ')) {
            cliOutput.innerHTML += `HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "active",
  "controller_version": "2.2.3.4",
  "health_score": 98,
  "managed_devices": 42
}
`;
        } else if (cmd.startsWith('acknowledge ')) {
            cliOutput.innerHTML += `[OK] Concepto de red asimilado.
`;
        } else if (cmd === 'exit') {
            document.getElementById('cli-overlay').classList.add('hidden');
            cliInput.value = '';
        } else if (cmd.startsWith('tracert ')) {
            const tr_ip = cmd.split(' ')[1] || '127.0.0.1';
            
            // Simple trace validation matching ping
            if (window.pingSuccess) {
                cliOutput.innerHTML += `Traza a la dirección ${tr_ip} sobre un máximo de 30 saltos:
  1    <1 ms    <1 ms    <1 ms  192.168.1.1
  2     2 ms     1 ms     1 ms  ${tr_ip}

Traza completa.
`;
            } else {
                cliOutput.innerHTML += `Traza a la dirección ${tr_ip} sobre un máximo de 30 saltos:
  1     *        *        *     Tiempo de espera agotado para esta solicitud.
  2     *        *        *     Tiempo de espera agotado para esta solicitud.
  3     *        *        *     Tiempo de espera agotado para esta solicitud.

Traza completa.
`;
            }
        } else if (cmd === 'arp -a') {
            if (window.pingSuccess) {
                cliOutput.innerHTML += `Interfaz: 192.168.1.100 --- 0x12
  Dirección de Internet      Dirección física      Tipo
  192.168.1.1           00-14-22-34-56-78     dinámico
  192.168.1.255         ff-ff-ff-ff-ff-ff     estático
`;
            } else {
                cliOutput.innerHTML += `No se encontraron entradas ARP. La interfaz física puede estar desconectada.
`;
            }
        } else if (cmd === 'cls' || cmd === 'clear') {
            cliOutput.innerHTML = '';
        } else if (cmd !== '') {
            cliOutput.innerHTML += `'${cmd}' no se reconoce como un comando interno o externo, programa o archivo por lotes ejecutable.
`;
        }
    }

// Focus CLI on click
const cliTerminalNode = document.getElementById('cli-terminal');
if (cliTerminalNode) {
    cliTerminalNode.addEventListener('click', () => { 
        const inputNode = document.getElementById('cli-input');
        if (inputNode) inputNode.focus(); 
    });
}

}
