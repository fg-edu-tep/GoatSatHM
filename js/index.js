/* ═══════════════════════════════════════════
   GOATSat · INDEX PAGE
   js/index.js
═══════════════════════════════════════════ */

const DRAWER_DATA = {
  mech: {
    title: 'Mechanical Layer — M-Layer',
    content: `
      <p>The mechanical interface governs everything before any electrical contact is made.
         Reliable physical capture is the precondition for safe docking.</p>

      <h4>Docking Geometry</h4>
      <ul>
        <li>Funnel-guided blind-mate geometry with autocorrective surfaces to tolerate autonomous docking misalignment</li>
        <li>Keying features (angular rotation stops) prevent inverted or 180° misaligned coupling</li>
        <li>Defined capture zone radius and angular tolerance envelope per GOAT-Sat v0.1</li>
        <li>Passive or active retention latch — selectable per mission profile</li>
      </ul>

      <h4>Structural Specs</h4>
      <ul>
        <li>Minimum retention force specified against micro-gravity and attitude-control structural loads</li>
        <li>Designed for microsatellite class: 10–100 kg host buses</li>
        <li>Optional thermal contact pads at interface with bounded conductance values</li>
      </ul>

      <div class="drawer__spec-block">
        <strong>Abandoned module principle:</strong> Failed modules remain passively docked.
        No mechanical removal protocol is required. New modules restore mission capability
        additively — eliminating active debris generation risk during servicing.
      </div>
    `
  },
  elec: {
    title: 'Electrical Layer — E-Layer',
    content: `
      <p>Hot-plug capable 6-group pin sequencing with a deterministic finite state machine
         and hardware fault isolation at every transition stage.</p>

      <h4>Pin Groups — Make Order</h4>
      <ul>
        <li><strong style="color:var(--blue-300)">Group 1 — GND:</strong> Multi-pin earth reference, make-first, ESD discharge path</li>
        <li><strong style="color:var(--blue-300)">Group 2 — PRESENT:</strong> Open-drain module presence detection, debounced by host</li>
        <li><strong style="color:var(--blue-300)">Group 3 — VCC_IL:</strong> Current-limited initialisation rail — boots MCU/FPGA only, ≤ 50mA</li>
        <li><strong style="color:var(--blue-300)">Group 4 — CAN_H/L:</strong> CAN-FD negotiation bus — ID, type, power consumption profile</li>
        <li><strong style="color:var(--blue-300)">Group 5 — POWER:</strong> Main power rail — enabled via hot-swap/eFuse only after negotiation</li>
        <li><strong style="color:var(--blue-300)">Group 6 — SpaceFibre:</strong> High-speed differential TX/RX pairs — last to activate post power-stable</li>
      </ul>

      <h4>Protection Requirements</h4>
      <ul>
        <li>Inrush current control on POWER rail (di/dt limited)</li>
        <li>Overvoltage, undervoltage, reverse polarity, and latch-up detection</li>
        <li>Any anomaly (F0/F1/F2 states) → immediate return to S0 (safe/decoupled)</li>
        <li>No main rail energisation possible from partial or intermittent contact</li>
      </ul>

      <div class="drawer__spec-block">
        <strong>SpaceFibre PHY:</strong> Controlled impedance differential pairs with adjacent
        GND return pins guarantee signal integrity for ESA SpaceFibre protocol, maintaining
        link reliability in the high-EMI orbital environment.
      </div>
    `
  },
  soft: {
    title: 'Software / Data Layer — S-Layer',
    content: `
      <p>Vendor-agnostic module discovery and telemetry protocol over CAN-FD, SpaceWire,
         or Ethernet-TSN — physical bus is profile-selectable at integration time.</p>

      <h4>Module Discovery Protocol</h4>
      <ul>
        <li>Module broadcasts a Module Descriptor on enumeration containing: ID, type, version, capabilities, power profile</li>
        <li>Host validates version compatibility without requiring bespoke firmware modification</li>
        <li>Capability negotiation covers: data rates, power draw, command set, telemetry schema version</li>
      </ul>

      <h4>Standard Telemetry Schema</h4>
      <ul>
        <li>Normalised fields: health state, temperature, power draw, operational status</li>
        <li>Uniform across all module types — new modules extend host telemetry without re-programming</li>
        <li>Supports incremental, multi-stage mission capability restoration</li>
      </ul>

      <h4>FSM State Sequence</h4>
      <ul>
        <li>S0 Decoupled/Safe → S1 Presence Detected → S2 VCC_IL On → S3 CAN Discovery</li>
        <li>S4 Power Negotiation → S5 POWER Enabled → S6 SpaceFibre Active → S7 Nominal</li>
        <li>Fault states F0 (presence loss), F1 (overcurrent), F2 (negotiation fail) → all return to S0</li>
      </ul>

      <div class="drawer__spec-block">
        <strong>Firmware management:</strong> Version tracking and compatibility checks at
        enumeration time. Rollback support is defined for mission-critical configurations.
        Abandoned modules stay silent — zero interference with new module operations.
      </div>
    `
  }
};

document.addEventListener('DOMContentLoaded', () => {

  /* ── Bento Drawers ── */
  const overlay = document.getElementById('drawerOverlay');
  const drawerTitle = document.getElementById('drawerTitle');
  const drawerBody  = document.getElementById('drawerBody');
  const drawerClose = document.getElementById('drawerClose');

  function openDrawer(key) {
    const d = DRAWER_DATA[key];
    if (!d || !overlay) return;
    drawerTitle.textContent = d.title;
    drawerBody.innerHTML = d.content;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    drawerClose.focus();
  }

  function closeDrawer() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-drawer]').forEach(card => {
    card.addEventListener('click', () => openDrawer(card.dataset.drawer));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDrawer(card.dataset.drawer);
      }
    });
  });

  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) closeDrawer(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

});
