// ============================================================
// supabase-config.js — Supabase client initialization
// ============================================================

const SUPABASE_URL = 'https://xblsoprouwrdjfdjixia.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhibHNvcHJvdXdyZGpmZGppeGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxOTA0MTcsImV4cCI6MjA4ODc2NjQxN30.4ZHfVUe8a-HcLB8JS1ZNB1ys-DeasMB34wT8WiDHTtg';

// Admin password (change this to your desired password)
const ADMIN_PASSWORD = 'mafitness2026';

// Initialize Supabase client with error protection
let supabaseClient = null;
window.supabaseApp = null; // We'll export it so other scripts can use it
try {
    if (window.supabase && window.supabase.createClient) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        window.supabaseApp = supabaseClient;
        console.log('Supabase client initialized successfully:', !!supabaseClient);
    } else {
        console.error('Supabase JS library not loaded. Check your internet connection.');
    }
} catch (err) {
    console.error('Error initializing Supabase client:', err.message);
}
// ============================================================
// data.js — Shared data layer for M.A. Fitness Gym Management
// Uses Supabase to persist data in the cloud.
// ============================================================

// ── Plan Definitions ──────────────────────────────────────────
const PLANS = {
    estandar: {
        id: 'estandar',
        name: 'Estándar',
        options: [
            { days: 2, fee: 32000, label: '2 días — $32.000' },
            { days: 3, fee: 36000, label: '3 días — $36.000' },
            { days: 4, fee: 40000, label: '4 días — $40.000' },
            { days: 5, fee: 45000, label: '5 días — $45.000' },
            { days: 'libre', fee: 48000, label: 'Pase Libre — $48.000' },
        ]
    },
    personalizado: {
        id: 'personalizado',
        name: 'Personalizado',
        options: [] // Fee set by admin
    },
    online: {
        id: 'online',
        name: 'Online',
        options: [] // Fee set by admin
    }
};

// ── Routines Library ──────────────────────────────────────────
const ROUTINES_LIBRARY = [
    {
        id: 'r1',
        name: 'Hipertrofia Tren Superior',
        level: 'Intermedio',
        days: 'Lunes / Miércoles / Viernes',
        exercises: [
            { name: 'Press de banca plano', sets: 4, reps: '10-12' },
            { name: 'Remo con barra', sets: 4, reps: '10-12' },
            { name: 'Press militar', sets: 3, reps: '10' },
            { name: 'Curl de bíceps', sets: 3, reps: '12' },
            { name: 'Tríceps en polea', sets: 3, reps: '12' },
            { name: 'Elevaciones laterales', sets: 3, reps: '15' },
        ]
    },
    {
        id: 'r2',
        name: 'Hipertrofia Tren Inferior',
        level: 'Intermedio',
        days: 'Martes / Jueves / Sábado',
        exercises: [
            { name: 'Sentadilla con barra', sets: 4, reps: '8-10' },
            { name: 'Prensa de piernas', sets: 4, reps: '12' },
            { name: 'Peso muerto rumano', sets: 3, reps: '10' },
            { name: 'Extensión de cuádriceps', sets: 3, reps: '12' },
            { name: 'Curl femoral', sets: 3, reps: '12' },
            { name: 'Elevación de gemelos', sets: 4, reps: '15' },
        ]
    },
    {
        id: 'r3',
        name: 'Full Body Principiante',
        level: 'Principiante',
        days: 'Lunes / Miércoles / Viernes',
        exercises: [
            { name: 'Sentadilla goblet', sets: 3, reps: '12' },
            { name: 'Press de pecho con mancuernas', sets: 3, reps: '12' },
            { name: 'Remo con mancuerna', sets: 3, reps: '12' },
            { name: 'Zancadas', sets: 3, reps: '10 c/lado' },
            { name: 'Plancha abdominal', sets: 3, reps: '30s' },
            { name: 'Elongación general', sets: 1, reps: '10 min' },
        ]
    },
    {
        id: 'r4',
        name: 'Quema de Grasa HIIT',
        level: 'Avanzado',
        days: 'Martes / Jueves / Sábado',
        exercises: [
            { name: 'Burpees', sets: 4, reps: '15' },
            { name: 'Mountain climbers', sets: 4, reps: '20' },
            { name: 'Kettlebell swings', sets: 4, reps: '15' },
            { name: 'Box jumps', sets: 3, reps: '12' },
            { name: 'Battle ropes', sets: 3, reps: '30s' },
            { name: 'Sprint en cinta', sets: 5, reps: '30s / 30s descanso' },
        ]
    },
    {
        id: 'r5',
        name: 'Funcional General',
        level: 'Intermedio',
        days: 'Lunes a Viernes',
        exercises: [
            { name: 'TRX rows', sets: 3, reps: '12' },
            { name: 'Thrusters', sets: 3, reps: '10' },
            { name: 'Planchas dinámicas', sets: 3, reps: '12' },
            { name: 'Salto al cajón', sets: 3, reps: '10' },
            { name: 'Wall balls', sets: 3, reps: '15' },
            { name: 'Farmer walk', sets: 3, reps: '30m' },
        ]
    },
    {
        id: 'r6',
        name: 'Fuerza Máxima',
        level: 'Avanzado',
        days: 'Lunes / Miércoles / Viernes',
        exercises: [
            { name: 'Sentadilla trasera', sets: 5, reps: '5' },
            { name: 'Press de banca', sets: 5, reps: '5' },
            { name: 'Peso muerto convencional', sets: 5, reps: '3' },
            { name: 'Press militar estricto', sets: 4, reps: '5' },
            { name: 'Dominadas lastradas', sets: 4, reps: '5' },
            { name: 'Remo pendlay', sets: 4, reps: '5' },
        ]
    },
];

// ── Field Mapping: JS camelCase ↔ DB snake_case ───────────────
function memberToDb(member) {
    const dbRow = {};
    if (member.name !== undefined) dbRow.name = member.name;
    if (member.dni !== undefined) dbRow.dni = member.dni;
    if (member.phone !== undefined) dbRow.phone = member.phone;
    if (member.plan !== undefined) dbRow.plan = member.plan;
    if (member.daysPerWeek !== undefined) dbRow.days_per_week = member.daysPerWeek;
    if (member.fee !== undefined) dbRow.fee = member.fee;
    if (member.paidMonth !== undefined) dbRow.paid_month = member.paidMonth;
    if (member.routine !== undefined) dbRow.routine = member.routine;
    if (member.registeredAt !== undefined) dbRow.registered_at = member.registeredAt;
    if (member.pathologies !== undefined) dbRow.pathologies = member.pathologies;
    return dbRow;
}

function dbToMember(row) {
    return {
        id: row.id,
        name: row.name,
        dni: row.dni,
        phone: row.phone,
        plan: row.plan,
        daysPerWeek: row.days_per_week,
        fee: row.fee,
        paidMonth: row.paid_month,
        routine: row.routine,
        registeredAt: row.registered_at,
        pathologies: row.pathologies,
    };
}

// ── Supabase Data Helpers (async) ─────────────────────────────
async function loadMembers() {
    const { data, error } = await window.supabaseApp
        .from('members')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error('Error loading members:', error);
        return [];
    }
    return (data || []).map(dbToMember);
}

async function addMember(member) {
    const dbRow = memberToDb(member);
    const { data, error } = await window.supabaseApp
        .from('members')
        .insert([dbRow])
        .select()
        .single();

    if (error) {
        console.error('Error adding member:', error);
        return null;
    }
    return dbToMember(data);
}

async function updateMember(updatedMember) {
    const dbRow = memberToDb(updatedMember);
    const { error } = await window.supabaseApp
        .from('members')
        .update(dbRow)
        .eq('id', updatedMember.id);

    if (error) {
        console.error('Error updating member:', error);
    }
}

async function deleteMember(memberId) {
    const { error } = await window.supabaseApp
        .from('members')
        .delete()
        .eq('id', memberId);

    if (error) {
        console.error('Error deleting member:', error);
    }
}

async function getMemberByDni(dni) {
    const { data, error } = await window.supabaseApp
        .from('members')
        .select('*')
        .eq('dni', dni)
        .maybeSingle();

    if (error) {
        console.error('Error finding member:', error);
        return null;
    }
    return data ? dbToMember(data) : null;
}

function getRoutineById(id) {
    return ROUTINES_LIBRARY.find(r => r.id === id) || null;
}

async function resetDatabase() {
    const { error } = await window.supabaseApp
        .from('members')
        .delete()
        .neq('id', 0); // Delete all rows

    if (error) {
        console.error('Error resetting database:', error);
    }
}

async function togglePayment(memberId) {
    const members = await loadMembers();
    const member = members.find(m => m.id === memberId);
    if (!member) return;
    const month = getCurrentMonth();
    member.paidMonth = (member.paidMonth === month) ? null : month;
    await updateMember(member);
}

// ── Formatting Helpers ────────────────────────────────────────
function formatDate(dateString) {
    if (!dateString) return '—';
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString + 'T12:00:00').toLocaleDateString('es-AR', options);
}

function formatCurrency(amount) {
    if (amount === null || amount === undefined || amount === 0) return 'Pendiente';
    return '$' + amount.toLocaleString('es-AR');
}

// ── Payment / Month Helpers ───────────────────────────────────
function getCurrentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function isPaidThisMonth(member) {
    return member.paidMonth === getCurrentMonth();
}

function getDueDateDisplay() {
    // Dues always on the 10th of the current month
    const now = new Date();
    const dueDay = 10;
    let dueMonth = now.getMonth();
    let dueYear = now.getFullYear();
    // If we're past the 10th, show next month's due date
    if (now.getDate() > 10) {
        dueMonth += 1;
        if (dueMonth > 11) { dueMonth = 0; dueYear += 1; }
    }
    const dueDate = new Date(dueYear, dueMonth, dueDay);
    return formatDate(dueDate.toISOString().split('T')[0]);
}

function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function getPlanDisplayName(member) {
    const plan = PLANS[member.plan];
    if (!plan) return member.plan;
    let label = plan.name;
    if (member.plan === 'estandar' && member.daysPerWeek) {
        label += member.daysPerWeek === 'libre' ? ' (Pase Libre)' : ` (${member.daysPerWeek} días)`;
    }
    return label;
}

function getFeeDisplay(member) {
    if (member.plan === 'personalizado' || member.plan === 'online') {
        if (!member.fee || member.fee === 0) {
            return 'A confirmar por la profe';
        }
    }
    return formatCurrency(member.fee);
}
// ============================================================
// public.js — Public page logic for M.A. Fitness (Supabase)
// Handles DNI lookup, registration, profile editing, and panel
// ============================================================

let registrationDni = '';
let selectedPlan = '';
let selectedDays = '';
let currentMemberDni = ''; // Track logged-in member

function initPublicApp() {
    console.log('[public.js] Initializing app...');
    try {
        bindPublicEvents();

        // Smooth scroll (skip links that have specific IDs we handle ourselves)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            if (anchor.id === 'link-register') return;
            anchor.addEventListener('click', e => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            document.querySelector('.public-nav').classList.toggle('scrolled', window.scrollY > 60);
        });
        console.log('[public.js] App initialized correctly.');
    } catch (err) {
        console.error('[public.js] Error during initialization:', err);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPublicApp);
} else {
    initPublicApp();
}

function bindPublicEvents() {
    console.log('[public.js] binding events...');
    // Login
    document.getElementById('btn-login').addEventListener('click', handleLogin);
    document.getElementById('dni-input').addEventListener('keypress', e => { if (e.key === 'Enter') handleLogin(); });
    document.getElementById('btn-logout').addEventListener('click', handleLogout);

    // "Registrate acá" link
    document.getElementById('link-register').addEventListener('click', e => {
        e.preventDefault();
        showRegistrationForm();
    });

    // Registration: plan selector — show days for ALL plans
    document.querySelectorAll('.plan-option').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.plan-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedPlan = btn.dataset.plan;
            selectedDays = '';

            // Show days selector for every plan
            document.getElementById('days-group').style.display = 'block';
            document.querySelectorAll('.day-option').forEach(d => d.classList.remove('active'));
        });
    });

    // Registration: days selector (no prices shown)
    document.querySelectorAll('.day-option').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.day-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedDays = btn.dataset.days;
        });
    });

    // Registration buttons
    document.getElementById('btn-back-login').addEventListener('click', showLoginBox);
    document.getElementById('btn-register').addEventListener('click', handleRegister);
    document.getElementById('btn-go-panel').addEventListener('click', async () => {
        const member = await getMemberByDni(registrationDni);
        if (member) showMemberPanel(member);
    });

    // Profile editing
    document.getElementById('btn-edit-profile').addEventListener('click', showEditProfile);
    document.getElementById('btn-cancel-edit').addEventListener('click', hideEditProfile);
    document.getElementById('btn-save-profile').addEventListener('click', saveProfile);
}

// ── Login Flow ────────────────────────────────────────────────
async function handleLogin() {
    console.log('[public.js] handleLogin triggered');
    const dniInput = document.getElementById('dni-input');
    const errorEl = document.getElementById('login-error');
    const dni = dniInput.value.trim();
    console.log('[public.js] DNI:', dni);

    if (!dni || dni.length < 7) {
        showError(errorEl, 'Ingresá un DNI válido (7-8 dígitos).');
        return;
    }

    try {
        if (!window.supabaseApp) {
            throw new Error('La base de datos (Supabase) no se cargó correctamente. Revisá tu conexión.');
        }

        const member = await getMemberByDni(dni);
        if (member) {
            errorEl.textContent = '';
            showMemberPanel(member);
        } else {
            showError(errorEl, 'DNI no encontrado. Si sos nuevo, hacé clic en "Registrate acá".');
        }
    } catch (err) {
        console.error('[public.js] Error in handleLogin:', err);
        showError(errorEl, 'Error del sistema: ' + err.message);
    }
}

function handleLogout() {
    currentMemberDni = '';
    hideAll();
    document.getElementById('login-box').style.display = 'block';
    document.getElementById('dni-input').value = '';
}

function showLoginBox() {
    hideAll();
    document.getElementById('login-box').style.display = 'block';
}

// ── Registration Flow ─────────────────────────────────────────
function showRegistrationForm() {
    hideAll();
    document.getElementById('register-box').style.display = 'block';
    registrationDni = '';
    document.getElementById('reg-dni-display').textContent = '';

    // Reset form
    document.getElementById('reg-dni').value = '';
    document.getElementById('reg-name').value = '';
    document.getElementById('reg-phone').value = '';
    document.getElementById('register-error').textContent = '';
    document.querySelectorAll('.plan-option').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.day-option').forEach(b => b.classList.remove('active'));
    document.getElementById('days-group').style.display = 'none';
    selectedPlan = '';
    selectedDays = '';
}

async function handleRegister() {
    const errorEl = document.getElementById('register-error');
    const dni = document.getElementById('reg-dni').value.trim();
    const name = document.getElementById('reg-name').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const pathologies = document.getElementById('reg-pathology').value.trim();

    // Validation
    if (!dni || dni.length < 7) { showError(errorEl, 'Ingresá un DNI válido (7-8 dígitos).'); return; }
    if (!name) { showError(errorEl, 'Ingresá tu nombre completo.'); return; }
    if (!phone) { showError(errorEl, 'Ingresá tu número de teléfono.'); return; }
    if (!selectedPlan) { showError(errorEl, 'Seleccioná un plan.'); return; }
    if (!selectedDays) { showError(errorEl, 'Seleccioná la cantidad de días.'); return; }

    registrationDni = dni;

    // Check DNI not already registered
    const existing = await getMemberByDni(registrationDni);
    if (existing) {
        showError(errorEl, 'Este DNI ya está registrado. Volvé al inicio e ingresá tu DNI para acceder.');
        return;
    }

    // Resolve fee: only Estándar has auto-fee based on days
    let fee = 0;
    if (selectedPlan === 'estandar') {
        const opt = PLANS.estandar.options.find(o => String(o.days) === String(selectedDays));
        fee = opt ? opt.fee : 0;
    }

    const today = new Date();

    const newMember = {
        name: name,
        dni: registrationDni,
        phone: phone,
        plan: selectedPlan,
        daysPerWeek: selectedDays,
        fee: fee,
        paidMonth: null,
        routine: null,
        registeredAt: today.toISOString(),
        pathologies: pathologies || null,
    };

    await addMember(newMember);
    errorEl.textContent = '';

    // Show success
    hideAll();
    document.getElementById('register-success').style.display = 'block';
}

// ── Member Panel ──────────────────────────────────────────────
function showMemberPanel(member) {
    hideAll();
    const panel = document.getElementById('member-panel');
    panel.style.display = 'block';
    currentMemberDni = member.dni;

    // Hide edit form
    document.getElementById('profile-edit-section').style.display = 'none';

    document.getElementById('panel-avatar').textContent = getInitials(member.name);
    document.getElementById('panel-name').textContent = member.name;
    document.getElementById('panel-dni-display').textContent = `DNI: ${member.dni}`;
    document.getElementById('panel-plan').textContent = getPlanDisplayName(member);
    document.getElementById('panel-fee').textContent = getFeeDisplay(member);
    document.getElementById('panel-due').textContent = getDueDateDisplay();

    const paid = isPaidThisMonth(member);
    const badge = document.getElementById('panel-status-badge');
    badge.textContent = paid ? 'Pagado' : 'No pagado';
    badge.className = `badge ${paid ? 'success' : 'danger'}`;

    const statusIcon = document.getElementById('panel-status-icon');
    statusIcon.className = `panel-card-icon ${paid ? 'success' : 'danger'}`;

    // Routine — display dynamic table
    const routineContainer = document.getElementById('panel-routine');
    const hasRoutine = member.routine && Array.isArray(member.routine) &&
        member.routine.some(row => row.some(day => day.ejercicio || day.series || day.rep || day.peso));

    if (hasRoutine) {
        // Find active days
        const activeDays = [];
        for (let d = 0; d < 6; d++) {
            const hasData = member.routine.some(row => row[d] && (row[d].ejercicio || row[d].series || row[d].rep || row[d].peso));
            if (hasData) activeDays.push(d);
        }

        let theadHtml = '<tr class="routine-day-header">';
        activeDays.forEach(d => {
            theadHtml += `<th colspan="4">Día ${d + 1}</th>`;
        });
        theadHtml += '</tr><tr class="routine-sub-header">';
        activeDays.forEach(d => {
            theadHtml += '<th>Ejercicio</th><th>Series</th><th>Rep</th><th>Peso</th>';
        });
        theadHtml += '</tr>';

        let tbodyHtml = '';
        member.routine.forEach((row, rowIndex) => {
            // Check if this row has content in ANY of the active days
            const hasContentInRow = activeDays.some(d => row[d] && (row[d].ejercicio || row[d].series || row[d].rep || row[d].peso));
            if (!hasContentInRow) return;

            tbodyHtml += '<tr>';
            activeDays.forEach(d => {
                const day = row[d] || {};
                tbodyHtml += `<td>${day.ejercicio || '—'}</td>`;
                tbodyHtml += `<td class="rt-center">${day.series || '—'}</td>`;
                tbodyHtml += `<td class="rt-center">${day.rep || '—'}</td>`;
                
                // For peso, make it an editable input
                const currentPeso = day.peso || '';
                tbodyHtml += `<td class="rt-center"><input type="text" class="peso-edit-input" data-row="${rowIndex}" data-day="${d}" value="${currentPeso}" placeholder="-"></td>`;
            });
            tbodyHtml += '</tr>';
        });

        routineContainer.innerHTML = `
            <div class="routine-detail-card">
                <div class="routine-detail-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                    <h3><i class="fas fa-dumbbell"></i> Tu Rutina</h3>
                    <button class="btn-primary btn-sm" id="btn-save-weights"><i class="fas fa-save"></i> Guardar Pesos</button>
                </div>
                <div class="routine-table-scroll">
                    <table class="routine-display-table">
                        <thead>${theadHtml}</thead>
                        <tbody>${tbodyHtml}</tbody>
                    </table>
                </div>
                <p id="weights-msg" style="text-align:right; margin-top:10px; font-size:0.9rem; font-weight:600;"></p>
            </div>`;
            
        // Bind the save weights button
        document.getElementById('btn-save-weights').addEventListener('click', async () => {
            const msgEl = document.getElementById('weights-msg');
            msgEl.textContent = 'Guardando...';
            msgEl.style.color = '#fff';
            
            const inputs = document.querySelectorAll('.peso-edit-input');
            let hasChanges = false;
            
            inputs.forEach(input => {
                const r = parseInt(input.dataset.row);
                const d = parseInt(input.dataset.day);
                const newVal = input.value.trim();
                
                // Ensure the day object exists if they are adding a weight to an empty cell
                if (!member.routine[r][d]) member.routine[r][d] = {};
                
                if (member.routine[r][d].peso !== newVal) {
                    member.routine[r][d].peso = newVal;
                    hasChanges = true;
                }
            });
            
            if (hasChanges) {
                await updateMember(member);
                msgEl.textContent = '¡Pesos guardados con éxito!';
                msgEl.style.color = 'var(--accent-primary)';
                setTimeout(() => msgEl.textContent = '', 3000);
            } else {
                msgEl.textContent = 'No hay cambios para guardar.';
                msgEl.style.color = '#aaa';
                setTimeout(() => msgEl.textContent = '', 3000);
            }
        });
    } else {
        routineContainer.innerHTML = `
            <div class="no-routine-msg">
                <i class="fas fa-info-circle"></i>
                <p>Todavía no tenés una rutina asignada. Consultá en recepción para que te asignen una.</p>
            </div>`;
    }
}

// ── Profile Editing ───────────────────────────────────────────
async function showEditProfile() {
    const member = await getMemberByDni(currentMemberDni);
    if (!member) return;

    document.getElementById('profile-name').value = member.name;
    document.getElementById('profile-phone').value = member.phone || '';
    document.getElementById('profile-plan').value = member.plan;
    document.getElementById('profile-days').value = member.daysPerWeek || '2';
    document.getElementById('profile-edit-msg').textContent = '';
    document.getElementById('profile-edit-section').style.display = 'block';
}

function hideEditProfile() {
    document.getElementById('profile-edit-section').style.display = 'none';
}

async function saveProfile() {
    const member = await getMemberByDni(currentMemberDni);
    if (!member) return;

    const name = document.getElementById('profile-name').value.trim();
    const phone = document.getElementById('profile-phone').value.trim();
    const plan = document.getElementById('profile-plan').value;
    const days = document.getElementById('profile-days').value;

    if (!name) { showProfileMsg('Ingresá tu nombre.', 'error'); return; }
    if (!phone) { showProfileMsg('Ingresá tu teléfono.', 'error'); return; }

    member.name = name;
    member.phone = phone;
    member.plan = plan;
    member.daysPerWeek = days;

    // Auto-update fee for estándar
    if (plan === 'estandar') {
        const opt = PLANS.estandar.options.find(o => String(o.days) === String(days));
        member.fee = opt ? opt.fee : member.fee;
    }
    // For personalizado/online, keep existing fee

    await updateMember(member);
    showProfileMsg('¡Datos actualizados!', 'success');

    // Refresh panel display
    setTimeout(async () => {
        const updated = await getMemberByDni(currentMemberDni);
        if (updated) showMemberPanel(updated);
    }, 1200);
}

function showProfileMsg(msg, type) {
    const el = document.getElementById('profile-edit-msg');
    el.textContent = msg;
    el.className = `profile-edit-msg ${type}`;
}

// ── Helpers ───────────────────────────────────────────────────
function hideAll() {
    document.getElementById('login-box').style.display = 'none';
    document.getElementById('register-box').style.display = 'none';
    document.getElementById('member-panel').style.display = 'none';
    document.getElementById('register-success').style.display = 'none';
}

function showError(el, msg) {
    el.textContent = msg;
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 500);
}
