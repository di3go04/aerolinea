/* script.js – AeroVia v6 — Vianca Conversational Engine */

/* ================================================================
   AIRPORT DATABASE
================================================================ */
const AIRPORTS = [
    { code: 'BOG', city: 'Bogotá', airport: 'El Dorado Internacional', country: 'Colombia', flag: '🇨🇴', group: 'Colombia' },
    { code: 'MDE', city: 'Medellín', airport: 'José María Córdova', country: 'Colombia', flag: '🇨🇴', group: 'Colombia' },
    { code: 'CLO', city: 'Cali', airport: 'Alfonso Bonilla Aragón', country: 'Colombia', flag: '🇨🇴', group: 'Colombia' },
    { code: 'BAQ', city: 'Barranquilla', airport: 'Ernesto Cortissoz', country: 'Colombia', flag: '🇨🇴', group: 'Colombia' },
    { code: 'CTG', city: 'Cartagena', airport: 'Rafael Núñez', country: 'Colombia', flag: '🇨🇴', group: 'Colombia' },
    { code: 'CUC', city: 'Cúcuta', airport: 'Camilo Daza', country: 'Colombia', flag: '🇨🇴', group: 'Colombia' },
    { code: 'BGA', city: 'Bucaramanga', airport: 'Palonegro', country: 'Colombia', flag: '🇨🇴', group: 'Colombia' },
    { code: 'PEI', city: 'Pereira', airport: 'Matecaña Internacional', country: 'Colombia', flag: '🇨🇴', group: 'Colombia' },
    { code: 'ADZ', city: 'San Andrés', airport: 'Gustavo Rojas Pinilla', country: 'Colombia', flag: '🇨🇴', group: 'Colombia' },
    { code: 'SMR', city: 'Santa Marta', airport: 'Simón Bolívar', country: 'Colombia', flag: '🇨🇴', group: 'Colombia' },
    { code: 'MIA', city: 'Miami', airport: 'Miami International', country: 'EE.UU.', flag: '🇺🇸', group: 'Internacional' },
    { code: 'JFK', city: 'Nueva York', airport: 'John F. Kennedy', country: 'EE.UU.', flag: '🇺🇸', group: 'Internacional' },
    { code: 'LAX', city: 'Los Ángeles', airport: 'Los Angeles International', country: 'EE.UU.', flag: '🇺🇸', group: 'Internacional' },
    { code: 'CUN', city: 'Cancún', airport: 'Cancún Internacional', country: 'México', flag: '🇲🇽', group: 'Internacional' },
    { code: 'MEX', city: 'Ciudad de México', airport: 'Benito Juárez', country: 'México', flag: '🇲🇽', group: 'Internacional' },
    { code: 'GRU', city: 'São Paulo', airport: 'Guarulhos Internacional', country: 'Brasil', flag: '🇧🇷', group: 'Internacional' },
    { code: 'LIM', city: 'Lima', airport: 'Jorge Chávez Internacional', country: 'Perú', flag: '🇵🇪', group: 'Internacional' },
    { code: 'SCL', city: 'Santiago', airport: 'Comodoro Arturo Merino', country: 'Chile', flag: '🇨🇱', group: 'Internacional' },
    { code: 'EZE', city: 'Buenos Aires', airport: 'Ministro Pistarini', country: 'Argentina', flag: '🇦🇷', group: 'Internacional' },
    { code: 'MAD', city: 'Madrid', airport: 'Adolfo Suárez Barajas', country: 'España', flag: '🇪🇸', group: 'Internacional' },
    { code: 'BCN', city: 'Barcelona', airport: 'Barcelona-El Prat', country: 'España', flag: '🇪🇸', group: 'Internacional' },
    { code: 'LHR', city: 'Londres', airport: 'Heathrow', country: 'R. Unido', flag: '🇬🇧', group: 'Internacional' },
    { code: 'CDG', city: 'París', airport: 'Charles de Gaulle', country: 'Francia', flag: '🇫🇷', group: 'Internacional' },
    { code: 'FCO', city: 'Roma', airport: 'Leonardo da Vinci', country: 'Italia', flag: '🇮🇹', group: 'Internacional' },
];

/* ================================================================
   AIRPORT SELECTOR COMPONENT
================================================================ */
class AirportSelector {
    constructor(id) {
        this.id = id;
        this.el = document.getElementById('airport-' + id);
        this.searchIn = document.getElementById('ap-search-' + id);
        this.listEl = document.getElementById('ap-list-' + id);
        this.cityEl = this.el && this.el.querySelector('.ap-city');
        this.codeEl = this.el && this.el.querySelector('.ap-code');
        this.selected = AIRPORTS.find(a => a.code === (this.el && this.el.dataset.value)) || AIRPORTS[0];
        if (this.el) this.init();
    }
    init() {
        this.el.querySelector('.ap-selected').addEventListener('click', e => { e.stopPropagation(); this.toggle(); });
        this.searchIn.addEventListener('input', () => this.renderList(this.searchIn.value));
        this.searchIn.addEventListener('click', e => e.stopPropagation());
        this.renderList('');
    }
    toggle() {
        const open = this.el.classList.toggle('open');
        if (open) {
            document.querySelectorAll('.airport-selector.open').forEach(s => { if (s !== this.el) s.classList.remove('open'); });
            this.searchIn.value = '';
            this.renderList('');
            setTimeout(() => this.searchIn.focus(), 60);
        }
    }
    close() { this.el.classList.remove('open'); }
    getValue() { return this.selected.code; }
    setValue(ap) {
        this.selected = ap;
        this.cityEl.textContent = ap.city;
        this.codeEl.textContent = ap.code;
        this.el.dataset.value = ap.code;
        this.renderList('');
    }
    renderList(q) {
        q = q.toLowerCase().trim();
        const filtered = q
            ? AIRPORTS.filter(a => a.city.toLowerCase().includes(q) || a.code.toLowerCase().includes(q) || a.airport.toLowerCase().includes(q) || a.country.toLowerCase().includes(q))
            : AIRPORTS;
        this.listEl.innerHTML = '';
        if (!filtered.length) { this.listEl.innerHTML = '<div class="ap-no-results">No se encontraron aeropuertos</div>'; return; }
        if (!q) {
            [...new Set(filtered.map(a => a.group))].forEach(g => {
                const lbl = document.createElement('div'); lbl.className = 'ap-group-label'; lbl.textContent = g;
                this.listEl.appendChild(lbl);
                filtered.filter(a => a.group === g).forEach(a => this.listEl.appendChild(this.makeItem(a)));
            });
        } else {
            filtered.forEach(a => this.listEl.appendChild(this.makeItem(a)));
        }
    }
    makeItem(ap) {
        const item = document.createElement('div');
        item.className = 'ap-item' + (ap.code === this.selected.code ? ' current' : '');
        item.innerHTML = `<span class="ap-item-code">${ap.code}</span><div class="ap-item-info"><div class="ap-item-city">${ap.city}</div><div class="ap-item-apt">${ap.airport}</div></div><span class="ap-item-flag">${ap.flag}</span>`;
        item.addEventListener('click', e => { e.stopPropagation(); this.setValue(ap); this.close(); });
        return item;
    }
}

/* ================================================================
   VIANCA – CONVERSATIONAL ENGINE
================================================================ */
const FLIGHTS_DB = [
    { id: 1, code: 'AV 9447', dep: '08:00', arr: '09:15', dur: '1h 15m', price: 185000, label: 'Mañana', depCode: 'CUC', arrCode: 'BOG' },
    { id: 2, code: 'AV 9453', dep: '14:30', arr: '15:50', dur: '1h 20m', price: 210000, label: 'Tarde', depCode: 'CUC', arrCode: 'BOG' },
    { id: 3, code: 'AV 9461', dep: '21:00', arr: '22:15', dur: '1h 15m', price: 155000, label: 'Noche', depCode: 'CUC', arrCode: 'BOG' },
];

const ctx = { stage: 'idle', flight: null, name: null, email: null, history: [] };

function fmt(n) { return '$' + n.toLocaleString('es-CO') + ' COP'; }

function flightCard(f, cheapest) {
    const badge = cheapest ? `<span style="background:#E1251B;color:#fff;font-size:.62rem;font-weight:800;padding:2px 8px;border-radius:99px;margin-left:6px;">⭐ Mejor precio</span>` : '';
    return `<div style="border:1.5px solid ${cheapest ? '#E1251B' : '#E2E2E2'};border-radius:10px;padding:11px 14px;margin:6px 0;background:#fff;font-size:.84rem;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
      <strong>${f.code}</strong>${badge}
      <span style="font-size:1.05rem;font-weight:900;color:#E1251B;">${fmt(f.price)}</span>
    </div>
    <div style="display:flex;align-items:center;gap:8px;color:#555;margin-bottom:8px;">
      <span><b style="color:#1A1A1A;">${f.dep}</b> ${f.depCode}</span>
      <span style="color:#9E9E9E;">→</span>
      <span><b style="color:#1A1A1A;">${f.arr}</b> ${f.arrCode}</span>
      <span style="margin-left:auto;color:#388E3C;font-weight:700;">Directo</span>
      <span style="color:#9E9E9E;">${f.dur}</span>
    </div>
    <button onclick="window._chatSelectFlight(${f.id})" style="background:#E1251B;color:#fff;border:none;border-radius:99px;padding:6px 16px;font-size:.76rem;font-weight:700;cursor:pointer;font-family:inherit;transition:opacity .18s;" onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">Seleccionar este vuelo</button>
  </div>`;
}

window._chatSelectFlight = function (id) {
    const f = FLIGHTS_DB.find(x => x.id === id);
    if (!f) return;
    ctx.flight = f;
    ctx.stage = 'selected';
    if (window.selectFlight) selectFlight(id);
    addBotMsg(`✅ Has seleccionado el vuelo <strong>${f.code}</strong> — ${f.label}.<br><br>
    📋 <strong>Resumen:</strong><br>
    • Ruta: <strong>${f.depCode} → ${f.arrCode}</strong><br>
    • Horario: <strong>${f.dep} – ${f.arr}</strong> (${f.dur})<br>
    • Precio: <strong style="color:#E1251B;">${fmt(f.price)}</strong><br><br>
    ¿Deseas <strong>proceder con el pago</strong>? También puedo informarte sobre <em>equipaje</em>, <em>asientos</em> o <em>política de cambios</em>.`);
};

function viancaReply(msg) {
    const m = msg.toLowerCase().trim();
    ctx.history.push(msg);

    // ── Greetings
    if ((m.includes('hola') || m.includes('buenas') || m.includes('buenos') || m.includes('hello')) && ctx.history.length <= 4) {
        return `¡Hola! 👋 Soy <strong>Vianca</strong>, tu asistente de AeroVia. Puedo ayudarte a:<br>
      • 🔍 Buscar vuelos y <strong>comparar precios</strong><br>
      • 💳 Guiarte hasta el <strong>pago paso a paso</strong><br>
      • 🧳 Resolver dudas de <strong>equipaje y check-in</strong><br><br>
      ¿A qué destino quieres volar hoy?`;
    }

    // ── Price queries (any stage)
    if (m.includes('precio') || m.includes('cuánto') || m.includes('cuanto') || m.includes('vale') || m.includes('cuesta') || m.includes('costo') || m.includes('tarifa') || m.includes('tarifas')) {
        if (ctx.flight) {
            const tax = Math.round(ctx.flight.price * 0.19);
            const total = ctx.flight.price + tax;
            return `El vuelo <strong>${ctx.flight.code}</strong> (${ctx.flight.label}) tiene:<br>
        • Tarifa base: <strong style="color:#E1251B;">${fmt(ctx.flight.price)}</strong><br>
        • IVA (19%): <strong>${fmt(tax)}</strong><br>
        • <span style="font-size:1rem;">💳 <strong>Total: ${fmt(total)}</strong></span><br><br>
        ¿Quieres agregar equipaje en bodega (<strong>+$85.000</strong>) o proceder al pago?`;
        }
        const lines = FLIGHTS_DB.map(f => `• <strong>${f.code}</strong> (${f.label} ${f.dep}): <strong style="color:#E1251B;">${fmt(f.price)}</strong>`).join('<br>');
        ctx.stage = 'show_flights';
        return `Estos son los precios disponibles para <strong>CUC → BOG</strong> el 15 Mar 2026:<br><br>${lines}<br><br>¿Cuál te interesa? Di <em>"mañana"</em>, <em>"tarde"</em>, <em>"noche"</em> o el número de vuelo.`;
    }

    // ── Pick flight by keyword / time / price hint
    const byLabel = [
        { keys: ['mañana', '8:00', '08:00', '9447', 'temprano', 'primero'], id: 1 },
        { keys: ['tarde', '14:30', '15:50', '9453', 'mediodia', 'mediodía', 'segundo'], id: 2 },
        { keys: ['noche', '21:00', '22:15', '9461', 'barato', 'económico', 'economico', 'nocturno', 'tercero'], id: 3 },
    ];
    for (const opt of byLabel) {
        if (opt.keys.some(k => m.includes(k))) { window._chatSelectFlight(opt.id); return null; }
    }
    // match by price digits (e.g. "155", "210")
    const nums = (msg.match(/\d[\d.,]*/g) || []).map(n => parseInt(n.replace(/[.,]/g, '')));
    for (const f of FLIGHTS_DB) {
        if (nums.some(n => Math.abs(n - f.price) < 10000 || String(f.price).startsWith(String(n).substring(0, 3)))) {
            window._chatSelectFlight(f.id); return null;
        }
    }

    // ── Show all flights
    if (m.includes('vuelos') || m.includes('volar') || m.includes('disponible') || m.includes('opciones') || m.includes('itinerarios') || m.includes('ver vuelos') || m.includes('mostrar')) {
        ctx.stage = 'show_flights';
        const minPrice = Math.min(...FLIGHTS_DB.map(f => f.price));
        return `Tengo <strong>${FLIGHTS_DB.length} vuelos disponibles</strong> para hoy:<br>` + FLIGHTS_DB.map(f => flightCard(f, f.price === minPrice)).join('');
    }

    // ── PAYMENT FLOW
    if (m.includes('pago') || m.includes('pagar') || m.includes('comprar') || m.includes('proceder') || m.includes('confirmar') || m.includes('reservar')) {
        if (!ctx.flight) {
            return `Primero selecciona un vuelo 👆 Di <strong>"mañana"</strong>, <strong>"tarde"</strong> o <strong>"noche"</strong>, o escribe el número de vuelo.`;
        }
        if (ctx.stage === 'ask_name') return null; // already asked
        ctx.stage = 'ask_name';
        const tax = Math.round(ctx.flight.price * 0.19);
        return `¡Perfecto! Para pagar el vuelo <strong>${ctx.flight.code}</strong> por <strong style="color:#E1251B;">${fmt(ctx.flight.price + tax)}</strong> (impuestos incluidos).<br><br>¿Cuál es tu <strong>nombre completo</strong>?`;
    }

    // ── Collect name
    if (ctx.stage === 'ask_name' && !ctx.name) {
        if (m.length < 3) return '¿Puedes indicarme tu nombre completo por favor?';
        ctx.name = msg.trim();
        ctx.stage = 'ask_email';
        return `Perfecto, <strong>${ctx.name}</strong> 😊 ¿Cuál es tu <strong>correo electrónico</strong> para enviarte la confirmación?`;
    }

    // ── Collect email
    if (ctx.stage === 'ask_email' && !ctx.email) {
        if (!msg.includes('@')) return '¿Puedes ingresar un correo válido? Ejemplo: <em>nombre@correo.com</em>';
        ctx.email = msg.trim();
        ctx.stage = 'ask_payment_method';
        const f = ctx.flight;
        const tax = Math.round(f.price * 0.19);
        const total = f.price + tax;
        return `✅ <strong>¡Casi listo!</strong> Aquí está tu resumen de compra:<br><br>
      📋 Vuelo: <strong>${f.code}</strong> · ${f.dep} → ${f.arr} (${f.dur})<br>
      👤 Pasajero: <strong>${ctx.name}</strong><br>
      📧 Confirmación a: <strong>${ctx.email}</strong><br>
      • Tarifa base: <strong>${fmt(f.price)}</strong><br>
      • Impuestos IVA 19%: <strong>${fmt(tax)}</strong><br>
      • <span style="font-size:1rem;">💳 <strong style="color:#E1251B;">TOTAL: ${fmt(total)}</strong></span><br><br>
      ¿Cómo deseas pagar?<br>
      <strong>1. Tarjeta de crédito/débito</strong> · <strong>2. PSE</strong> · <strong>3. Nequi / Daviplata</strong>`;
    }

    // ── Payment method selection
    if (ctx.stage === 'ask_payment_method') {
        if (m.includes('tarjeta') || m.includes('credito') || m.includes('débito') || m.includes('debito') || m === '1') {
            ctx.stage = 'processing';
            return `💳 Procesando pago con <strong>tarjeta</strong>...<br><br>🔒 Conexión SSL activa. Ingresa tu tarjeta:<br>• Número de tarjeta<br>• Fecha de vencimiento<br>• CVV<br><br>¿El titular es <strong>${ctx.name}</strong>? Responde <em>"sí"</em> para confirmar.`;
        }
        if (m.includes('pse') || m.includes('banco') || m === '2') {
            ctx.stage = 'processing';
            return `🏦 Con <strong>PSE</strong> serás redirigido al portal de tu banco.<br>El proceso tarda ~2 min.<br><br>¿Confirmas el pago con PSE?`;
        }
        if (m.includes('nequi') || m.includes('daviplata') || m.includes('billetera') || m === '3') {
            ctx.stage = 'processing';
            return `📱 <strong>Nequi / Daviplata</strong> — Te enviaremos la solicitud de cobro a tu número registrado.<br><br>¿Confirmas el número de celular asociado a tu cuenta?`;
        }
        return `Por favor elige un método de pago:<br><strong>1. Tarjeta</strong> · <strong>2. PSE</strong> · <strong>3. Nequi/Daviplata</strong>`;
    }

    // ── Final confirmation
    if (ctx.stage === 'processing') {
        if (m.includes('sí') || m.includes('si') || m.includes('confirmo') || m.includes('correcto') || m.includes('listo') || m.includes('ok') || m === 'yes') {
            ctx.stage = 'done';
            const code = 'AV-' + Math.floor(100000 + Math.random() * 900000);
            return `🎉 <strong>¡Pago exitoso!</strong><br><br>
        Tu código de reserva es: <strong style="color:#E1251B;font-size:1.1rem;">${code}</strong><br><br>
        Recibirás el tiquete electrónico en <strong>${ctx.email}</strong> en los próximos 5 minutos.<br><br>
        ¡Buen viaje, <strong>${ctx.name}</strong>! ✈️ Recuerda llegar al aeropuerto <strong>2 horas antes</strong>.`;
        }
        return `Para confirmar, responde <strong>"sí"</strong>. Si quieres cambiar el método de pago, dímelo.`;
    }

    // ── Post-payment help
    if (ctx.stage === 'done') {
        return `¡Hola de nuevo, <strong>${ctx.name}</strong>! 😊 Tu vuelo ya está reservado. ¿Necesitas ayuda con <em>equipaje</em>, <em>check-in</em> o tienes otra consulta?`;
    }

    // ── Luggage
    if (m.includes('equipaje') || m.includes('maleta') || m.includes('bolsa')) {
        const base = 85000, extra = 140000;
        return `🧳 <strong>Política de equipaje AeroVia:</strong><br>
      • Maleta de mano (10 kg): <strong>incluida</strong><br>
      • Bodega 23 kg: <strong>+${fmt(base)}</strong><br>
      • Bodega 32 kg: <strong>+${fmt(extra)}</strong><br><br>
      ${ctx.flight ? `Con equipaje (23 kg) tu total sería: <strong style="color:#E1251B;">${fmt(ctx.flight.price + base)}</strong>.` : '¿Ya tienes un vuelo seleccionado?'}`;
    }

    // ── Seat
    if (m.includes('silla') || m.includes('asiento') || m.includes('seat') || m.includes('ventana') || m.includes('pasillo')) {
        return `💺 <strong>Selección de asientos:</strong><br>
      • Estándar: <strong>incluido</strong><br>
      • Extra legroom: <strong>+$35.000 COP</strong><br>
      • Salida emergencia: <strong>+$50.000 COP</strong><br><br>
      ¿Prefieres ventana o pasillo? Te recomendaré el asiento disponible más cercano a tu preferencia.`;
    }

    // ── Check-in
    if (m.includes('check-in') || m.includes('checkin') || m.includes('registrar')) {
        return `✈️ El <strong>check-in online</strong> abre <strong>24 horas antes</strong> del vuelo y cierra 3h antes.<br><br>
      Canales disponibles:<br>
      • Sección <strong>"Check-in"</strong> del menú superior<br>
      • App móvil AeroVia<br>
      • Kioscos en el aeropuerto<br><br>
      ¿Tienes tu código de reserva listo?`;
    }

    // ── Cancellation
    if (m.includes('cancelar') || m.includes('cambio') || m.includes('anular') || m.includes('devolu')) {
        return `📋 <strong>Política de cambios y cancelaciones:</strong><br>
      • Cambio de fecha: <strong>$50.000</strong> + diferencia tarifaria<br>
      • Cambio de nombre: <strong>$80.000</strong><br>
      • Cancelación +24h antes: <strong>reembolso 80%</strong><br>
      • Cancelación −24h antes: <strong>sin reembolso</strong><br><br>
      ¿Necesitas gestionar algún cambio?`;
    }

    // ── Thanks
    if (m.includes('gracias') || m.includes('thank')) {
        return `¡Con mucho gusto${ctx.name ? ', <strong>' + ctx.name + '</strong>' : ''}! 😊 Estoy aquí para lo que necesites.`;
    }

    // ── Reset
    if (m.includes('nueva busqueda') || m.includes('nueva búsqueda') || m.includes('reset') || m.includes('empezar de nuevo')) {
        Object.assign(ctx, { stage: 'idle', flight: null, name: null, email: null });
        return '🔄 ¡Listo! Empecemos de nuevo. ¿A qué destino quieres volar?';
    }

    // ── Dynamic default hints based on state
    if (!ctx.flight) {
        const hints = [
            '¿Quieres que te muestre los <strong>vuelos disponibles</strong> con precios?',
            'Puedo mostrarte opciones de vuelo. ¿A qué ciudad viajas?',
            '¿Buscas vuelos para hoy o para otra fecha?',
        ];
        return hints[ctx.history.length % hints.length];
    }
    return `Tienes seleccionado el vuelo <strong>${ctx.flight.code}</strong> (${fmt(ctx.flight.price)}). ¿Quieres <strong>pagar</strong>, agregar <strong>equipaje</strong> o tienes otra pregunta?`;
}

/* ================================================================
   MAIN INIT
================================================================ */
document.addEventListener('DOMContentLoaded', () => {

    /* ── Airport Selectors ── */
    const selOrigen = new AirportSelector('origen');
    const selDestino = new AirportSelector('destino');
    document.addEventListener('click', () => { selOrigen.close(); selDestino.close(); });

    /* ── Swap ── */
    document.getElementById('swap-btn')?.addEventListener('click', () => {
        const a = { ...selOrigen.selected }, b = { ...selDestino.selected };
        selOrigen.setValue(b); selDestino.setValue(a);
    });

    /* ── Nav ── */
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    /* ── Hamburger ── */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    hamburger?.addEventListener('click', () => {
        const open = navMenu.classList.toggle('mob-open');
        if (open) Object.assign(navMenu.style, { display: 'flex', flexDirection: 'column', position: 'absolute', top: '66px', left: '0', width: '100%', background: '#E1251B', padding: '8px 0 18px', boxShadow: '0 8px 24px rgba(0,0,0,.22)', zIndex: '899' });
        else navMenu.removeAttribute('style');
    });

    /* ── Widget Tabs ── */
    document.querySelectorAll('.wtab').forEach(tab => {
        tab.addEventListener('click', () => { document.querySelectorAll('.wtab').forEach(t => t.classList.remove('active')); tab.classList.add('active'); });
    });

    /* ── Calendar ── */
    const calPopup = document.getElementById('cal-popup');
    const fechasField = document.getElementById('field-fechas');
    let selStart = 15, selEnd = 22;

    fechasField?.addEventListener('click', e => { if (!calPopup.contains(e.target)) calPopup.classList.toggle('active'); });
    document.querySelectorAll('.cal-day:not(.past)').forEach(day => {
        day.addEventListener('click', () => {
            const n = parseInt(day.textContent); if (isNaN(n)) return;
            if (!selStart || (selStart && selEnd)) { selStart = n; selEnd = null; }
            else if (n > selStart) selEnd = n;
            else { selEnd = selStart; selStart = n; }
            renderCal(); updateDates();
        });
    });
    function renderCal() {
        document.querySelectorAll('.cal-day').forEach(d => {
            const n = parseInt(d.textContent); d.classList.remove('sel-start', 'sel-end', 'in-range');
            if (isNaN(n)) return;
            if (n === selStart) d.classList.add('sel-start');
            else if (n === selEnd) d.classList.add('sel-end');
            else if (selStart && selEnd && n > selStart && n < selEnd) d.classList.add('in-range');
        });
    }
    function updateDates() {
        const dv = document.getElementById('dates-val'); if (!dv) return;
        const a = selStart ? `<span class="sel-date">${selStart} MAR.</span>` : '<span class="sel-date">--</span>';
        const b = selEnd ? `<span class="sel-date">${selEnd} MAR.</span>` : '<span style="color:#9E9E9E">Vuelta</span>';
        dv.innerHTML = `${a}<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#9E9E9E" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>${b}`;
    }
    document.getElementById('cal-confirm')?.addEventListener('click', e => { e.stopPropagation(); calPopup.classList.remove('active'); });
    document.addEventListener('click', e => { if (fechasField && !fechasField.contains(e.target)) calPopup?.classList.remove('active'); });

    /* ── Pasajeros ── */
    const paxField = document.getElementById('field-pax');
    const paxDropdown = document.getElementById('pax-dropdown');
    const paxVal = document.getElementById('pax-val');
    const counts = { adults: 1, children: 0, infants: 0 };
    paxField?.addEventListener('click', e => {
        if (!e.target.closest('.pax-dropdown')) { paxDropdown.classList.toggle('active'); calPopup?.classList.remove('active'); }
    });
    document.querySelectorAll('.pax-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation(); const t = btn.dataset.t, plus = btn.classList.contains('plus');
            if (plus) counts[t] = Math.min(counts[t] + 1, 9);
            else counts[t] = Math.max(counts[t] - 1, t === 'adults' ? 1 : 0);
            document.getElementById('cnt-' + t).textContent = counts[t];
            const p = []; if (counts.adults) p.push(counts.adults + (counts.adults === 1 ? ' Adulto' : ' Adultos')); if (counts.children) p.push(counts.children + (counts.children === 1 ? ' Niño' : ' Niños')); if (counts.infants) p.push(counts.infants + (counts.infants === 1 ? ' Bebé' : ' Bebés'));
            if (paxVal) paxVal.textContent = p.join(', ');
        });
    });
    document.getElementById('pax-confirm')?.addEventListener('click', e => { e.stopPropagation(); paxDropdown.classList.remove('active'); });
    document.addEventListener('click', e => { if (paxField && !paxField.contains(e.target)) paxDropdown?.classList.remove('active'); });

    /* ── Search Form ── */
    document.getElementById('search-form')?.addEventListener('submit', e => {
        e.preventDefault();
        const o = selOrigen.getValue(), d = selDestino.getValue();
        if (o === d) { const w = document.querySelector('.booking-widget'); if (w) { w.style.animation = 'none'; void w.offsetWidth; w.style.animation = 'shakeW .4s ease'; } return; }
        const btn = document.getElementById('btn-buscar');
        btn.classList.add('pressed');
        btn.innerHTML = `<svg class="spin-ico" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-4.22-7.67"/></svg> Buscando...`;
        btn.disabled = true;
        setTimeout(() => {
            btn.classList.remove('pressed');
            btn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> BUSCAR VUELOS`;
            btn.disabled = false;
            document.getElementById('resultados')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 1800);
    });

    /* ── Sort Flights ── */
    function sortFlights(criterion) {
        const container = document.getElementById('flight-results'); if (!container) return;
        const cards = [...container.querySelectorAll('.result-card')];
        cards.sort((a, b) => {
            if (criterion === 'price-desc') return parseInt(b.dataset.price) - parseInt(a.dataset.price);
            if (criterion === 'price-asc') return parseInt(a.dataset.price) - parseInt(b.dataset.price);
            if (criterion === 'time-asc') return parseInt(a.dataset.dep) - parseInt(b.dataset.dep);
            if (criterion === 'duration') return parseInt(a.dataset.dur) - parseInt(b.dataset.dur);
            return 0;
        });
        cards.forEach((c, i) => { c.style.opacity = '0'; c.style.transform = 'translateY(8px)'; container.appendChild(c); setTimeout(() => { c.style.transition = 'opacity .3s,transform .3s'; c.style.opacity = '1'; c.style.transform = 'translateY(0)'; }, i * 60); });
    }
    sortFlights('price-desc');
    document.getElementById('sort-select')?.addEventListener('change', function () { sortFlights(this.value); });

    /* ── Flight Selection (from cards) ── */
    window.selectFlight = function (id) {
        document.querySelectorAll('.result-card').forEach(c => {
            c.classList.remove('selected');
            const b = c.querySelector('.rc-select-btn'); if (b) { b.textContent = 'Seleccionar'; b.classList.remove('selected-btn'); }
            c.querySelector('.selected-badge')?.remove();
        });
        const card = document.getElementById('card-' + id); if (!card) return;
        card.classList.add('selected');
        const b = card.querySelector('.rc-select-btn'); if (b) { b.textContent = '✓ Seleccionado'; b.classList.add('selected-btn'); }
        const badge = document.createElement('div'); badge.className = 'rc-badge selected-badge'; badge.textContent = '✓ Seleccionado'; card.appendChild(badge);
    };

    /* ── Flight card select buttons ── */
    document.querySelectorAll('.rc-select-btn').forEach((btn, idx) => {
        btn.addEventListener('click', () => window._chatSelectFlight(idx + 1));
    });

    /* ── Time Pills ── */
    document.querySelectorAll('.time-pill').forEach((pill, idx) => {
        pill.addEventListener('click', () => { window._chatSelectFlight(idx + 1); document.getElementById('resultados')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    });

    /* ── QR Pills ── */
    document.querySelectorAll('.qr-pill').forEach((pill, idx) => {
        const replies = [
            'La tarifa Classic incluye 1 maleta de mano (10 kg). Puedes agregar bodega (23 kg) por $85.000 COP adicionales.',
            '¿A qué destino quieres cambiar? Dime y busco opciones disponibles.',
            'Conectando con un asesor humano... ⏳ Tiempo estimado: 2 minutos.',
        ];
        pill.addEventListener('click', () => { addUserMsg(pill.textContent.trim()); const ind = addTyping(); setTimeout(() => { ind.remove(); addBotMsg(replies[idx] ?? '¿En qué más puedo ayudarte?'); }, 900); });
    });

    /* ── CHATBOT ── */
    const chatWin = document.getElementById('chat-win');
    const chatFab = document.getElementById('chat-fab');
    const closeBtn = document.getElementById('close-btn');
    const minBtn = document.getElementById('min-btn');
    const chatBody = document.getElementById('chat-body');
    const chatIn = document.getElementById('chat-text');
    const sendBtn = document.getElementById('chat-send');
    const chatAv = document.getElementById('chat-av');

    chatFab?.addEventListener('click', () => { chatWin.classList.remove('hidden'); chatFab.style.display = 'none'; chatIn?.focus(); chatBody.scrollTop = chatBody.scrollHeight; });
    closeBtn?.addEventListener('click', () => { chatWin.classList.add('hidden'); chatFab.style.display = ''; });
    minBtn?.addEventListener('click', () => { chatWin.classList.add('hidden'); chatFab.style.display = ''; });

    function handleSend() {
        const txt = chatIn?.value.trim(); if (!txt) return;
        addUserMsg(txt); chatIn.value = '';
        const ind = addTyping();
        setTimeout(() => {
            ind.remove();
            const reply = viancaReply(txt);
            if (reply) addBotMsg(reply);
        }, 900 + Math.random() * 400); // slight variation for realism
    }
    sendBtn?.addEventListener('click', handleSend);
    chatIn?.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });

    const avSrc = () => chatAv?.src || 'assets/avatar.png';

    function addUserMsg(text) {
        const r = document.createElement('div'); r.className = 'msg-wrap user-wrap';
        r.innerHTML = `<div class="bubble user-bubble">${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`;
        chatBody.appendChild(r); chatBody.scrollTop = chatBody.scrollHeight;
    }
    function addBotMsg(html) {
        const r = document.createElement('div'); r.className = 'msg-wrap bot-wrap';
        r.innerHTML = `<img src="${avSrc()}" alt="" class="msg-av"><div class="bubble bot-bubble">${html}</div>`;
        chatBody.appendChild(r); chatBody.scrollTop = chatBody.scrollHeight;
    }
    function addTyping() {
        const r = document.createElement('div'); r.className = 'msg-wrap bot-wrap';
        r.innerHTML = `<img src="${avSrc()}" alt="" class="msg-av"><div class="bubble bot-bubble" style="display:flex;gap:5px;padding:10px 13px;"><span style="width:6px;height:6px;border-radius:50%;background:#9E9E9E;animation:td .9s ease infinite"></span><span style="width:6px;height:6px;border-radius:50%;background:#9E9E9E;animation:td .9s .3s ease infinite"></span><span style="width:6px;height:6px;border-radius:50%;background:#9E9E9E;animation:td .9s .6s ease infinite"></span></div>`;
        chatBody.appendChild(r); chatBody.scrollTop = chatBody.scrollHeight;
        if (!document.getElementById('td-anim')) { const s = document.createElement('style'); s.id = 'td-anim'; s.textContent = '@keyframes td{0%,80%,100%{opacity:.25;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}'; document.head.appendChild(s); }
        return r;
    }

    // Inject keyframes
    const kf = document.createElement('style');
    kf.textContent = `@keyframes shakeW{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}@keyframes spinIco{to{transform:rotate(360deg)}}.spin-ico{animation:spinIco .8s linear infinite;}`;
    document.head.appendChild(kf);

    chatBody.scrollTop = chatBody.scrollHeight;
});
