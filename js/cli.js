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
                cliOutput.innerHTML += `Building configuration...\n\nCurrent configuration : 1243 bytes\n!\nversion 15.0\nhostname ${baseName}\n!\nenable secret 5 $1$mERr$hx5rVt7rPNoS4wqbXKX7m0\nservice password-encryption\n!\nip domain-name lab.local\nip ssh version 2\n!\ninterface FastEthernet0/1\n switchport access vlan 10\n switchport mode access\n!\ninterface Vlan10\n ip address 192.168.10.1 255.255.255.0\n!\nline con 0\n password 7 0822455D0A16\n login\n!\nbanner motd ^C ACCESO SOLO PERSONAL AUTORIZADO ^C\n!\nend\n`;
            } else if (cmd === 'show version' || cmd === 'sh ver') {
                cliOutput.innerHTML += `Cisco IOS Software, C2960 Software (C2960-LANBASEK9-M), Version 15.0(2)SE4\nTechnical Support: http://www.cisco.com/techsupport\nROM: Bootstrap program is C2960 boot loader\nSystem image file is "flash:c2960-lanbasek9-mz.150-2.SE4.bin"\nModel number: WS-C2960-24TT-L\nSystem serial number: FOC12345678\nConfiguration register is 0xF\n`;
            } else if (cmd.startsWith('show interfaces') || cmd.startsWith('sh int')) {
                cliOutput.innerHTML += `FastEthernet0/1 is up, line protocol is up (connected)\n  Hardware is Fast Ethernet, address is 0019.e86b.7a01 (bia 0019.e86b.7a01)\n  MTU 1500 bytes, BW 100000 Kbit/sec, DLY 100 usec,\n     reliability 255/255, txload 1/255, rxload 1/255\n  Encapsulation ARPA, loopback not set\n  Keepalive set (10 sec)\n  Full-duplex, 100Mb/s, media type is 100BaseTX\n  0 input errors, 0 CRC, 0 frame, 0 overrun\n`;
            } else if (cmd.startsWith('show cdp') || cmd.startsWith('sh cdp') || cmd.startsWith('show lldp') || cmd.startsWith('sh lldp')) {
                cliOutput.innerHTML += `Capability Codes: R - Router, T - Trans Bridge, B - Source Route Bridge\n                  S - Switch, H - Host, I - IGMP, r - Repeater, P - Phone\n\nDevice ID        Local Intrfce     Holdtme    Capability  Platform  Port ID\nRouter-NEXUS     Fas 0/2           145              R     C1941     Gig 0/1\nCatalyst-Core    Fas 0/24          160              S     WS-C2960  Fas 0/1\n`;
            } else if (cmd.startsWith('ping ')) {
                const target = cmd.split(' ')[1] || '8.8.8.8';
                cliOutput.innerHTML += `Type escape sequence to abort.\nSending 5, 100-byte ICMP Echos to ${target}, timeout is 2 seconds:\n!!!!!\nSuccess rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms\n`;
            } else if (cmd.startsWith('traceroute ') || cmd.startsWith('trace ')) {
                const target = cmd.split(' ')[1] || '8.8.8.8';
                cliOutput.innerHTML += `Type escape sequence to abort.\nTracing the route to ${target}\n\n  1 192.168.1.1 1 msec 1 msec 1 msec\n  2 10.1.1.1 2 msec 2 msec 3 msec\n  3 ${target} 4 msec 4 msec 5 msec\n`;
            } else if (cmd === 'show ip interface brief' || cmd === 'sh ip int br') {
                cliOutput.innerHTML += `Interface              IP-Address      OK? Method Status                Protocol\nFastEthernet0/1        unassigned      YES unset  up                    up\nFastEthernet0/2        unassigned      YES unset  up                    up\nVlan1                  unassigned      YES unset  administratively down down\nVlan10                 192.168.10.1    YES manual up                    up\n`;
            } else if (cmd.startsWith('show mac address-table') || cmd.startsWith('sh mac')) {
                cliOutput.innerHTML += `          Mac Address Table\n-------------------------------------------\nVlan    Mac Address       Type        Ports\n----    -----------       --------    -----\n   1    0014.2234.5678    DYNAMIC     Fa0/1\n  10    0050.7966.6800    DYNAMIC     Fa0/2\nTotal Mac Addresses for this criterion: 2\n`;
            } else if (cmd.startsWith('show hosts') || cmd.startsWith('sh hosts')) {
                cliOutput.innerHTML += `Default domain is lab.local\nName/address lookup uses domain service\nName servers are 8.8.8.8, 192.168.1.1\n\nHost                      Port  Flags      Age Type   Address(es)\nserver1.lab.local         None  (temp, OK)  0   IP    192.168.10.50\nrouter.lab.local          None  (temp, OK)  0   IP    192.168.1.1\n`;
            } else if (cmd.startsWith('show ssh') || cmd.startsWith('sh ssh')) {
                cliOutput.innerHTML += `Connection Version Mode Encryption  Hmac         State                 Username\n0          2.0     IN   aes256-cbc  hmac-sha1    Session [Session SSH] admin\n%No Unencrypted connections\n`;
            } else if (cmd.startsWith('copy run tftp') || cmd.startsWith('copy running-config tftp')) {
                cliOutput.innerHTML += `Address or name of remote host []? 192.168.1.10\nDestination filename [running-config]? \n!!\n[OK - 1243 bytes]\n1243 bytes copied in 0.052 secs (23903 bytes/sec)\n`;
            } else if (cmd.startsWith('copy run ftp') || cmd.startsWith('copy running-config ftp')) {
                cliOutput.innerHTML += `Address or name of remote host []? 192.168.1.10\nDestination filename [running-config]? \nWriting running-config...\n[OK - 1243 bytes]\n`;
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
                if (baseName.includes('FIREWALL')) {
                    cliOutput.innerHTML += `% Los Firewalls no manejan las VLANs locales de esta forma. Usa el Switch.\n`;
                    return;
                }
                cliMode = 'config-vlan';
                cliPrompt.innerText = baseName + '(config-vlan)#';
            } else if (cmd.startsWith('interface ') || cmd.startsWith('int ')) {
                if (baseName.includes('FIREWALL')) {
                    cliOutput.innerHTML += `% Este comando no debe ejecutarse en el Firewall. Usa el Router o el Switch para las prácticas CCNA.\n`;
                    return;
                }
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
            } else if (cmd.startsWith('enable secret ') || cmd.startsWith('service password-encryption') || cmd.startsWith('ip domain-name ') || cmd.startsWith('crypto key ') || cmd.startsWith('ip ssh ') || cmd.startsWith('ipv6 route ') || cmd.startsWith('banner motd ') || cmd.startsWith('access-list ') || cmd.startsWith('ip nat ') || cmd.startsWith('ip route ') || cmd.startsWith('ntp server ') || cmd.startsWith('ip dhcp snooping') || cmd.startsWith('aaa new-model') || cmd.startsWith('logging ') || cmd.startsWith('ip arp inspection ')) {
                if (cmd.startsWith('crypto key generate rsa')) {
                    cliOutput.innerHTML += `The name for the keys will be: ${baseName}.lab.local\nChoose the size of the key modulus in the range of 360 to 4096 for your\nGeneral Purpose Keys. Providing a key modulus greater than 512 may take\na few minutes.\n\nHow many bits in the modulus [512]: 1024\n% Generating 1024 bit RSA keys, keys will be non-exportable...\n[OK] (rsa key generated)\n`;
                }
                // silencioso para el resto
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
        } else if (cmd.startsWith('nslookup ')) {
            const host = cmd.split(' ')[1] || 'cisco.com';
            cliOutput.innerHTML += `Servidor:  dns.google\nAddress:  8.8.8.8\n\nRespuesta no autoritativa:\nNombre:  ${host}\nAddresses:  198.51.100.1\n          2001:db8::80\n\n`;
        } else if (cmd.startsWith('ftp ')) {
            const host = cmd.split(' ')[1] || '192.168.1.10';
            cliOutput.innerHTML += `Conectado a ${host}.\n220 Cisco FTP Server (Version 1.1) ready.\nUsuario (${host}:(none)): admin\n331 Password required for admin.\nContraseña: \n230 User admin logged in.\nftp> quit\n221 Goodbye.\n`;
        } else if (cmd.startsWith('ssh ')) {
            const target = cmd.split(' ')[1] || '192.168.1.1';
            cliOutput.innerHTML += `Connecting to ${target} on port 22...\nPassword: \n\nCisco IOS Software, Catalyst 2960 Series\nSwitch# \n`;
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
