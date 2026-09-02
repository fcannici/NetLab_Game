document.addEventListener('DOMContentLoaded', () => {
    const workspace = document.getElementById('workspace');
    const cablesLayer = document.getElementById('cables-layer');
    const actionModeText = document.getElementById('action-mode');
    const tooltip = document.getElementById('tooltip');
    
    // Config de Cables
    let currentCableColor = '#3b82f6';
    document.querySelectorAll('.cable-color').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.cable-color').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            currentCableColor = btn.getAttribute('data-color');
        });
    });

    // DRAG AND DROP STATE
    let draggedItemType = null;
    let draggedItemVendor = null;
    let draggedItemName = null;
    let draggedExistingEl = null; // Si estamos moviendo un equipo ya creado
    let ghostEl = document.createElement('div');
    ghostEl.className = 'ghost-preview hidden';

    // CABLES STATE
    let isWiring = false;
    let activePort = null;
    let tempCable = null;
    let startX = 0, startY = 0;

    // INICIAR DRAG DEL INVENTARIO
    document.querySelectorAll('.inv-item').forEach(item => {
        item.addEventListener('dragstart', (e) => {
            draggedItemType = item.getAttribute('data-type');
            draggedItemVendor = item.getAttribute('data-vendor') || 'none';
            draggedItemName = item.innerText.trim();
            draggedExistingEl = null;
        });
    });

    workspace.addEventListener('dragover', (e) => {
        e.preventDefault();
        
        if (draggedItemType !== 'rack') {
            let targetRack = null;
            const elementsUnderMouse = document.elementsFromPoint(e.clientX, e.clientY);
            for(let el of elementsUnderMouse) {
                if(el.classList.contains('placed-item') && el.getAttribute('data-type') === 'rack') {
                    targetRack = el; break;
                }
            }

            if (targetRack) {
                const rackBox = targetRack.getBoundingClientRect();
                const relY = e.clientY - rackBox.top - 15; // 15px es el padding top del rack
                let slot = Math.floor(relY / 40); // 40px por unidad (U)
                
                if (slot < 0) slot = 0;
                if (slot > 18) slot = 18; // Max 19 slots

                // Validar si el slot está ocupado
                let isOccupied = false;
                targetRack.querySelectorAll('.rack-mounted').forEach(child => {
                    if (child !== draggedExistingEl && parseInt(child.getAttribute('data-slot')) === slot) {
                        isOccupied = true;
                    }
                });

                if (!isOccupied) {
                    ghostEl.classList.remove('hidden');
                    ghostEl.style.top = (15 + slot * 40) + 'px';
                    ghostEl.setAttribute('data-slot', slot);
                    targetRack.appendChild(ghostEl);
                } else {
                    ghostEl.classList.add('hidden');
                    ghostEl.remove();
                }
            } else {
                ghostEl.classList.add('hidden');
                ghostEl.remove();
            }
        }
    });
    


    workspace.addEventListener('drop', (e) => {
        e.preventDefault();
        if(!draggedItemType) return;
        ghostEl.classList.add('hidden');
        ghostEl.remove();

        const rect = workspace.getBoundingClientRect();
        const x = e.clientX - rect.left + workspace.scrollLeft;
        const y = e.clientY - rect.top + workspace.scrollTop;

        let targetRack = null;
        const elementsUnderMouse = document.elementsFromPoint(e.clientX, e.clientY);
        for(let el of elementsUnderMouse) {
            if(el.classList.contains('placed-item') && el.getAttribute('data-type') === 'rack') {
                targetRack = el; break;
            }
        }

        let el = draggedExistingEl;

        if (!el) {
            // CREAR NUEVO EQUIPO
            el = document.createElement('div');
            el.className = 'placed-item';
            el.setAttribute('data-type', draggedItemType);
            el.setAttribute('data-vendor', draggedItemVendor);
            el.id = 'dev_' + Date.now();
            
            // Hacer el equipo arrastrable si no es un rack
            if (draggedItemType !== 'rack') {
                el.setAttribute('draggable', 'true');
                el.addEventListener('dragstart', (ev) => {
                    draggedItemType = el.getAttribute('data-type');
                    draggedItemVendor = el.getAttribute('data-vendor');
                    draggedItemName = el.querySelector('.hw-label') ? el.querySelector('.hw-label').innerText : 'Device';
                    draggedExistingEl = el;
                    ev.dataTransfer.effectAllowed = 'move';
                });
            }

            // EVENTO CLICK DERECHO PARA ELIMINAR EL EQUIPO/RACK
            el.addEventListener('contextmenu', (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                if(!isWiring) deleteEquipment(el);
            });

            if (draggedItemType !== 'rack') {
                let hwLabel = document.createElement('div');
                hwLabel.className = 'hw-label';
                // Poner nombre segun tipo
                if(draggedItemType === 'forti-firewall') hwLabel.innerText = 'FIREWALL';
                else if(draggedItemType === 'forti-switch') hwLabel.innerText = 'SWITCH';
                else if(draggedItemType === 'forti-gateway') hwLabel.innerText = 'GATEWAY';
                else if(draggedItemType === 'laptop') hwLabel.innerText = 'LAPTOP (Admin)';
                else if(draggedItemType === 'pdu') hwLabel.innerText = 'PDU 220V (ENERGIA)';
                el.appendChild(hwLabel);
                
                generatePorts(el, draggedItemType);
                
                el.addEventListener('mouseenter', (ev) => showTooltip(ev, draggedItemName, el));
                el.addEventListener('mousemove', moveTooltip);
                el.addEventListener('mouseleave', hideTooltip);
                el.addEventListener('dblclick', (ev) => {
                    if(!ev.target.classList.contains('port')) {
                        // VERIFICACIÓN ELÉCTRICA ESTRICTA (Capa 0)
                        if (el.getAttribute('data-type') !== 'pdu') {
                            let hasPower = false;
                            const powerPort = el.querySelector('.port-power');
                            if (powerPort && powerPort.classList.contains('connected')) {
                                document.querySelectorAll('.cable-path').forEach(c => {
                                    if (c.source_port === powerPort || c.target_port === powerPort) {
                                        const otherPort = (c.source_port === powerPort) ? c.target_port : c.source_port;
                                        const otherDevice = otherPort.closest('.placed-item');
                                        if (otherDevice && otherDevice.getAttribute('data-type') === 'pdu') hasPower = true;
                                    }
                                });
                            }
                            if (!hasPower) {
                                document.getElementById('error-title').innerText = '🔌 FALLA ELÉCTRICA';
                                document.getElementById('error-desc').innerText = 'El equipo físico se encuentra apagado. No recibe tensión eléctrica. Para inicializar el Sistema Operativo, debes conectar su puerto PWR (Cable Negro) hacia una toma de corriente activa (PDU).';
                                document.getElementById('error-modal').classList.remove('hidden');
                                return;
                            }
                        }
                        
                        window.currentCliElement = el;
                        window.openCLI(el.querySelector('.hw-label') ? el.querySelector('.hw-label').innerText : 'Device', el.getAttribute('data-vendor'));
                    }
                });
            }
        }

        if (targetRack && draggedItemType !== 'rack' && draggedItemType !== 'laptop') {
            const rackBox = targetRack.getBoundingClientRect();
            const relY = e.clientY - rackBox.top - 15;
            let slot = Math.floor(relY / 40);
            if (slot < 0) slot = 0;
            if (slot > 18) slot = 18;
            
            let isOccupied = false;
            targetRack.querySelectorAll('.rack-mounted').forEach(child => {
                if (child !== draggedExistingEl && parseInt(child.getAttribute('data-slot')) === slot) {
                    isOccupied = true;
                }
            });
            
            if (!isOccupied) {
                el.classList.add('rack-mounted');
                el.style.top = (15 + slot * 40) + 'px';
                el.style.left = '20px';
                el.setAttribute('data-slot', slot);
                targetRack.appendChild(el);
            } else { if(!draggedExistingEl) { if (el && el.parentNode) el.parentNode.removeChild(el); } }
        } else {
            if (draggedItemType === 'rack') {
                el.style.left = (x - 175) + 'px';
                el.style.top = (y - 50) + 'px';
                workspace.appendChild(el);
            } else {
                el.classList.remove('rack-mounted');
                if(draggedItemType === 'laptop') {
                    el.classList.add('device-laptop');
                    el.style.left = (x - 70) + 'px';
                    el.style.top = (y - 35) + 'px';
                } else {
                    document.getElementById('error-title').innerText = '⚠️ INFRACCIÓN FÍSICA';
                    document.getElementById('error-desc').innerText = 'Los equipos no pueden dejarse tirados en el piso. ¡Usa un Rack!';
                    document.getElementById('error-modal').classList.remove('hidden');
                    if (!draggedExistingEl && el) { if (el.parentNode) el.parentNode.removeChild(el); else el.remove(); }
                    return;
                }
                el.removeAttribute('data-slot');
                workspace.appendChild(el);
            }
        }
        
        // REDIBUJAR CABLES SI SE MOVIÓ UN EQUIPO EXISTENTE
        if (draggedExistingEl) {
            requestAnimationFrame(redrawCables);
        }

        draggedItemType = null;
        draggedExistingEl = null;
    });

    function generatePorts(el, type) {
        let powerBlock = document.createElement('div');
        powerBlock.className = 'port-block port-block-power';
        
        let rjBlock = document.createElement('div');
        rjBlock.className = 'port-block port-block-rj45';
        
        let sfpBlock = document.createElement('div');
        sfpBlock.className = 'port-block port-block-sfp';
        
        function addPort(container, pType, pName) {
            let port = document.createElement('div');
            port.className = `port port-${pType}`;
            port.setAttribute('data-portname', pName);
            port.setAttribute('data-port-type', pType);
            port.addEventListener('click', (ev) => {
                ev.stopPropagation();
                handlePortClick(port);
            });
            container.appendChild(port);
        }

        if (type === 'pdu') {
            for(let i=1; i<=8; i++) addPort(powerBlock, 'power', `AC${i}`);
        } else if (type === 'laptop') {
            addPort(powerBlock, 'power', 'DC-IN');
            addPort(rjBlock, 'rj45', 'NIC');
        } else {
            // Todos los demás equipos tienen 1 PWR por defecto
            addPort(powerBlock, 'power', 'PWR');
            
            if(type === 'forti-switch') {
                for(let i=1; i<=24; i++) addPort(rjBlock, 'rj45', `Eth${i}`);
                for(let i=1; i<=4; i++) addPort(sfpBlock, 'sfp', `SFP${i}`);
            } else if(type === 'forti-firewall') {
                for(let i=1; i<=6; i++) addPort(rjBlock, 'rj45', `Eth${i}`);
                for(let i=1; i<=2; i++) addPort(sfpBlock, 'sfp', `SFP${i}`);
            } else if(type === 'forti-gateway') {
                addPort(rjBlock, 'rj45', 'LAN');
                addPort(sfpBlock, 'sfp', 'WAN');
            }
        }

        el.appendChild(powerBlock);
        el.appendChild(rjBlock);
        el.appendChild(sfpBlock);
    }

    function updateCablePath(cable, x1, y1, x2, y2) {
        const distance = Math.abs(x1 - x2);
        const sag = Math.max(y1, y2) + (distance / 2.5) + 60;
        const d = `M ${x1} ${y1} C ${x1} ${sag}, ${x2} ${sag}, ${x2} ${y2}`;
        cable.setAttribute('d', d);
    }
    
    function redrawCables() {
        document.querySelectorAll('.cable-path').forEach(cable => {
            if (cable.source_port && cable.target_port) {
                const wsRect = workspace.getBoundingClientRect();
                const p1 = cable.source_port.getBoundingClientRect();
                const p2 = cable.target_port.getBoundingClientRect();
                const x1 = p1.left - wsRect.left + workspace.scrollLeft + p1.width/2;
                const y1 = p1.top - wsRect.top + workspace.scrollTop + p1.height/2;
                const x2 = p2.left - wsRect.left + workspace.scrollLeft + p2.width/2;
                const y2 = p2.top - wsRect.top + workspace.scrollTop + p2.height/2;
                updateCablePath(cable, x1, y1, x2, y2);
                if(cable.traffic_overlay) updateCablePath(cable.traffic_overlay, x1, y1, x2, y2);
            }
        });
    }

    function handlePortClick(port) {
        if (port.classList.contains('connected')) {
            if (!isWiring) {
                let foundCable = null; let otherPort = null;
                const cables = document.querySelectorAll('.cable-path');
                for(let c of cables) {
                    if(c.source_port === port) { foundCable = c; otherPort = c.target_port; break; }
                    else if (c.target_port === port) { foundCable = c; otherPort = c.source_port; break; }
                }
                if (foundCable) {
                    port.classList.remove('connected');
                    isWiring = true; activePort = otherPort; tempCable = foundCable;
                    tempCable.setAttribute('class', 'temp-path');
                    const oRect = otherPort.getBoundingClientRect();
                    const wRect = workspace.getBoundingClientRect();
                    startX = oRect.left - wRect.left + workspace.scrollLeft + (oRect.width/2);
                    startY = oRect.top - wRect.top + workspace.scrollTop + (oRect.height/2);
                    actionModeText.innerText = "MOVIENDO CABLE...";
                    actionModeText.style.color = tempCable.getAttribute('stroke');
                }
            }
            return;
        }

        const portRect = port.getBoundingClientRect();
        const wsRect = workspace.getBoundingClientRect();
        const px = portRect.left - wsRect.left + workspace.scrollLeft + (portRect.width/2);
        const py = portRect.top - wsRect.top + workspace.scrollTop + (portRect.height/2);

        if (!isWiring) {
            let cableType = 'rj45';
            if (currentCableColor === '#f97316') cableType = 'sfp';
            else if (currentCableColor === '#222222') cableType = 'power';
            
            const pType = port.getAttribute('data-port-type');
            if (pType !== cableType) {
                document.getElementById('error-title').innerText = '⚠️ ERROR DE INTERFAZ FÍSICA';
                document.getElementById('error-desc').innerText = `Intentas conectar un cable para [${cableType.toUpperCase()}] en un puerto físico [${pType.toUpperCase()}].\n\nEn la vida real, los conectores simplemente no encajan. Los puertos SFP requieren transceptores y fibra, los RJ45 usan UTP, y los PWR usan cables C13 de poder.`;
                document.getElementById('error-modal').classList.remove('hidden');
                return;
            }

            isWiring = true; activePort = port; startX = px; startY = py;
            actionModeText.innerText = "TIRANDO CABLE..."; actionModeText.style.color = currentCableColor;
            tempCable = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            tempCable.setAttribute('class', 'temp-path'); tempCable.setAttribute('stroke', currentCableColor);
            updateCablePath(tempCable, startX, startY, startX, startY);
            cablesLayer.appendChild(tempCable);
        } else {
            let cableType = 'rj45';
            if (currentCableColor === '#f97316') cableType = 'sfp';
            else if (currentCableColor === '#222222') cableType = 'power';
            
            const pType = port.getAttribute('data-port-type');
            if (pType !== cableType) {
                document.getElementById('error-title').innerText = '⚠️ ERROR DE INTERFAZ FÍSICA';
                document.getElementById('error-desc').innerText = `No puedes conectar el otro extremo del cable en un puerto [${pType.toUpperCase()}]. Interfaces incompatibles.`;
                document.getElementById('error-modal').classList.remove('hidden');
                cancelCabling();
                return;
            }

            const srcDevice = activePort.closest('.placed-item');
            const tgtDevice = port.closest('.placed-item');
            
            if (port === activePort) {
                cancelCabling(); return; 
            }
            
            if (srcDevice === tgtDevice) {
                port.classList.add('error');
                activePort.classList.add('error');
                srcDevice.classList.add('broadcast-storm');
                
                document.getElementById('error-title').innerText = '⚠️ COLAPSO: BUCLE DE RED (LOOP)';
                document.getElementById('error-desc').innerText = 'Has conectado un equipo a sí mismo sin protocolos de prevención. Esto genera una "Tormenta de Broadcast": los mensajes empiezan a girar en círculos a la velocidad de la luz, multiplicándose infinitamente hasta colapsar el procesador del equipo.\n\nAcabas de tirar toda la red de la empresa.';
                document.getElementById('error-modal').classList.remove('hidden');
                
                window.hasTriggeredLoop = true; // Para validar misiones
                
                cancelCabling(); 
                
                
                return; 
            }
            port.classList.add('connected'); activePort.classList.add('connected');
            tempCable.setAttribute('class', 'cable-path');
            updateCablePath(tempCable, startX, startY, px, py);
            tempCable.source_port = activePort; tempCable.target_port = port;
            
            let tOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            tOverlay.setAttribute('class', 'traffic-overlay');
            updateCablePath(tOverlay, startX, startY, px, py);
            cablesLayer.appendChild(tOverlay);
            tempCable.traffic_overlay = tOverlay;
            
            tempCable.oncontextmenu = function(ev) {
                ev.preventDefault(); ev.stopPropagation();
                if(this.source_port) this.source_port.classList.remove('connected');
                if(this.target_port) this.target_port.classList.remove('connected');
                if(this.traffic_overlay) this.traffic_overlay.remove();
                this.remove();
            };
            
            tempCable = null; activePort = null; isWiring = false;
            actionModeText.innerText = "ARRASTRAR EQUIPO"; actionModeText.style.color = "#d11241";
        }
    }

    workspace.addEventListener('mousemove', (e) => {
        if (isWiring && tempCable) {
            const wsRect = workspace.getBoundingClientRect();
            const mouseX = e.clientX - wsRect.left + workspace.scrollLeft;
            const mouseY = e.clientY - wsRect.top + workspace.scrollTop;
            updateCablePath(tempCable, startX, startY, mouseX, mouseY);
        }
    });

    workspace.addEventListener('contextmenu', (e) => { if(isWiring) { e.preventDefault(); cancelCabling(); } });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && isWiring) cancelCabling(); });

    function cancelCabling() {
        if(tempCable) {
            if(tempCable.source_port) tempCable.source_port.classList.remove('connected');
            if(tempCable.target_port) tempCable.target_port.classList.remove('connected');
            tempCable.remove();
        }
        if(activePort) activePort.classList.remove('connected');
        isWiring = false; activePort = null; tempCable = null;
        actionModeText.innerText = "ARRASTRAR EQUIPO"; actionModeText.style.color = "#d11241";
    }

    function showTooltip(e, name, el) {
        if(isWiring || draggedExistingEl) return;
        const connectedPorts = el.querySelectorAll('.port.connected').length;
        const totalPorts = el.querySelectorAll('.port').length;
        const pwrLoad = Math.floor(Math.random() * 50) + 20;
        
        const isPowered = el.classList.contains('powered-on');
        tooltip.innerHTML = `
            <h4>${name}</h4>
            <p>Estado: <span class="${isPowered ? 'ok' : 'err'}">${isPowered ? 'ON (Power Good)' : 'OFF (Sin Energía)'}</span></p>
            <p>Enlaces Activos: ${connectedPorts}/${totalPorts}</p>
            <p>Load: ${isPowered ? pwrLoad : 0} W</p>
        `;
        tooltip.classList.remove('hidden');
        moveTooltip(e);
    }
    function moveTooltip(e) {
        tooltip.style.left = (e.clientX + 15) + 'px';
        tooltip.style.top = (e.clientY + 15) + 'px';
    }
    function hideTooltip() { tooltip.classList.add('hidden'); }
    function deleteEquipment(el) {
        if (el.getAttribute('data-type') === 'rack') {
            const children = Array.from(el.querySelectorAll('.rack-mounted'));
            for(let child of children) {
                deleteEquipment(child);
            }
        }
        
        const ports = Array.from(el.querySelectorAll('.port'));
        const cables = document.querySelectorAll('.cable-path');
        for(let c of cables) {
            if (ports.includes(c.source_port) || ports.includes(c.target_port)) {
                if(c.source_port) c.source_port.classList.remove('connected');
                if(c.target_port) c.target_port.classList.remove('connected');
                if(c.traffic_overlay) c.traffic_overlay.remove();
                c.remove();
            }
        }
        
        el.remove();
        hideTooltip();
    }

    // DEBUG: AUTO-RACK
    const autoRackBtn = document.getElementById('debug-autorack-btn');
    if (autoRackBtn) {
        autoRackBtn.addEventListener('click', () => { try {
            // Limpiar workspace
            document.querySelectorAll('.placed-item').forEach(el => el.remove());
            cablesLayer.innerHTML = '';
            
            function spawnItem(type, vendor, isRack, slot, left, top) {
                let el = document.createElement('div');
                el.className = 'placed-item';
                el.setAttribute('data-type', type);
                el.setAttribute('data-vendor', vendor);
                el.id = 'dev_' + Math.floor(Math.random()*100000);
                
                if (type !== 'rack') {
                    let hwLabel = document.createElement('div');
                    hwLabel.className = 'hw-label';
                    if(type === 'forti-firewall') hwLabel.innerText = 'FIREWALL';
                    else if(type === 'forti-switch') hwLabel.innerText = 'SWITCH';
                    else if(type === 'forti-gateway') hwLabel.innerText = 'GATEWAY';
                    else if(type === 'pdu') hwLabel.innerText = 'PDU 220V (ENERGIA)';
                    else if(type === 'laptop') hwLabel.innerText = 'LAPTOP (Admin)';
                    el.appendChild(hwLabel);
                    
                    generatePorts(el, type);
                    
                    el.addEventListener('mouseenter', (ev) => showTooltip(ev, hwLabel.innerText, el));
                    el.addEventListener('mousemove', moveTooltip);
                    el.addEventListener('mouseleave', hideTooltip);
                    el.addEventListener('dblclick', (ev) => {
                        if(!ev.target.classList.contains('port')) {
                            // Validar energia de forma simple
                            if (el.getAttribute('data-type') !== 'pdu') {
                                if(!el.classList.contains('powered-on')) {
                                    document.getElementById('error-title').innerText = '🔌 FALLA ELÉCTRICA';
                                    document.getElementById('error-desc').innerText = 'El equipo físico se encuentra apagado.';
                                    document.getElementById('error-modal').classList.remove('hidden');
                                    return;
                                }
                            }
                            window.currentCliElement = el;
                            window.openCLI(hwLabel.innerText, el.getAttribute('data-vendor'));
                        }
                    });
                }
                
                el.addEventListener('dragstart', (ev) => {
                    draggedItemType = type; draggedItemVendor = vendor; draggedExistingEl = el;
                    draggedItemName = el.querySelector('.hw-label') ? el.querySelector('.hw-label').innerText : 'Device';
                });
                el.addEventListener('contextmenu', (ev) => { ev.preventDefault(); deleteEquipment(el); });
                
                if (isRack) {
                    el.style.left = left + 'px';
                    el.style.top = top + 'px';
                    workspace.appendChild(el);
                } else {
                    if (type === 'laptop') {
                        el.classList.remove('rack-mounted');
                        el.classList.add('device-laptop');
                        el.style.left = left + 'px';
                        el.style.top = top + 'px';
                        workspace.appendChild(el);
                    } else {
                        el.classList.add('rack-mounted');
                        el.style.left = '20px';
                        el.style.top = (15 + slot * 40) + 'px';
                        el.setAttribute('data-slot', slot);
                    }
                }
                return el;
            }

            const rack = spawnItem('rack', 'generic', true, 0, 100, 50);
            const pdu = spawnItem('pdu', 'generic', false, 18, 0, 0);
            rack.appendChild(pdu);
            
            const sw = spawnItem('forti-switch', 'cisco', false, 5, 0, 0);
            rack.appendChild(sw);
            
            const gw = spawnItem('forti-firewall', 'cisco', false, 2, 0, 0);
            rack.appendChild(gw);

            const pc = spawnItem('laptop', 'windows', false, 0, 500, 100);

            // Conectar cables (PWR)
            function drawLine(p1, p2, color) {
                p1.classList.add('connected');
                p2.classList.add('connected');
                let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('class', 'cable-path');
                path.setAttribute('stroke', color);
                path.source_port = p1;
                path.target_port = p2;
                cablesLayer.appendChild(path);
                
                setTimeout(() => {
                    const wR = workspace.getBoundingClientRect();
                    const r1 = p1.getBoundingClientRect();
                    const r2 = p2.getBoundingClientRect();
                    updateCablePath(path, r1.left - wR.left + workspace.scrollLeft + 5, r1.top - wR.top + workspace.scrollTop + 5, r2.left - wR.left + workspace.scrollLeft + 5, r2.top - wR.top + workspace.scrollTop + 5);
                }, 100);
            }

            drawLine(pdu.querySelectorAll('.port-power')[0], sw.querySelector('.port-power'), '#222222');
            drawLine(pdu.querySelectorAll('.port-power')[1], gw.querySelector('.port-power'), '#222222');
            drawLine(pdu.querySelectorAll('.port-power')[2], pc.querySelector('.port-power'), '#222222');
            drawLine(sw.querySelectorAll('.port-rj45')[0], gw.querySelectorAll('.port-rj45')[0], '#3b82f6');
            drawLine(sw.querySelectorAll('.port-rj45')[1], pc.querySelectorAll('.port-rj45')[0], '#3b82f6');
        } catch(e) { alert('Autorack Error: ' + e); console.error(e); }
        });
    }

});


    

// ==========================================
    // MOTOR DE ENERGÍA EN TIEMPO REAL (CAPA 0)
    // ==========================================
    setInterval(() => {
        document.querySelectorAll('.placed-item').forEach(el => {
            if (el.getAttribute('data-type') === 'pdu') {
                el.classList.add('powered-on');
                return;
            }
            
            let hasPower = false;
            const powerPort = el.querySelector('.port-power');
            if (powerPort && powerPort.classList.contains('connected')) {
                document.querySelectorAll('.cable-path').forEach(c => {
                    if (c.source_port === powerPort || c.target_port === powerPort) {
                        const otherPort = (c.source_port === powerPort) ? c.target_port : c.source_port;
                        const otherDevice = otherPort.closest('.placed-item');
                        if (otherDevice && otherDevice.getAttribute('data-type') === 'pdu') hasPower = true;
                    }
                });
            }
            
            if (hasPower) {
                el.classList.add('powered-on');
            } else {
                el.classList.remove('powered-on');
                // Si pierde energía, se "reinicia" y limpia la tormenta de broadcast
                el.classList.remove('broadcast-storm');
                // También limpiamos los puertos en error de este equipo
                el.querySelectorAll('.port.error').forEach(p => p.classList.remove('error'));
            }
        });
        
        // CORTAR ANIMACIONES DE DATOS SI NO HAY ENERGÍA
        document.querySelectorAll('.cable-path').forEach(c => {
            if (c.traffic_overlay) {
                if (c.getAttribute('stroke') === '#222222') {
                    c.traffic_overlay.style.display = 'none'; // Cable de poder nunca tiene tráfico web
                } else {
                    let p1 = c.source_port ? c.source_port.closest('.placed-item') : null;
                    let p2 = c.target_port ? c.target_port.closest('.placed-item') : null;
                    let p1On = p1 ? p1.classList.contains('powered-on') : false;
                    let p2On = p2 ? p2.classList.contains('powered-on') : false;
                    
                    if (p1On && p2On) {
                        c.traffic_overlay.style.display = 'block';
                    } else {
                        c.traffic_overlay.style.display = 'none';
                    }
                }
            }
        });
    }, 500);
