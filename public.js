// ============================================================
// supabase-config.js â€” Supabase client initialization
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
// data.js â€” Shared data layer for M.A. Fitness Gym Management
// Uses Supabase to persist data in the cloud.
// ============================================================

// â”€â”€ Plan Definitions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PLANS = {
    estandar: {
        id: 'estandar',
        name: 'EstÃ¡ndar',
        options: [
            { days: 2, fee: 32000, label: '2 dÃ­as â€” $32.000' },
            { days: 3, fee: 36000, label: '3 dÃ­as â€” $36.000' },
            { days: 4, fee: 40000, label: '4 dÃ­as â€” $40.000' },
            { days: 5, fee: 45000, label: '5 dÃ­as â€” $45.000' },
            { days: 'libre', fee: 48000, label: 'Pase Libre â€” $48.000' },
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

// â”€â”€ Routines Library â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ROUTINES_LIBRARY = [
    {
        id: 'r1',
        name: 'Hipertrofia Tren Superior',
        level: 'Intermedio',
        days: 'Lunes / MiÃ©rcoles / Viernes',
        exercises: [
            { name: 'Press de banca plano', sets: 4, reps: '10-12' },
            { name: 'Remo con barra', sets: 4, reps: '10-12' },
            { name: 'Press militar', sets: 3, reps: '10' },
            { name: 'Curl de bÃ­ceps', sets: 3, reps: '12' },
            { name: 'TrÃ­ceps en polea', sets: 3, reps: '12' },
            { name: 'Elevaciones laterales', sets: 3, reps: '15' },
        ]
    },
    {
        id: 'r2',
        name: 'Hipertrofia Tren Inferior',
        level: 'Intermedio',
        days: 'Martes / Jueves / SÃ¡bado',
        exercises: [
            { name: 'Sentadilla con barra', sets: 4, reps: '8-10' },
            { name: 'Prensa de piernas', sets: 4, reps: '12' },
            { name: 'Peso muerto rumano', sets: 3, reps: '10' },
            { name: 'ExtensiÃ³n de cuÃ¡driceps', sets: 3, reps: '12' },
            { name: 'Curl femoral', sets: 3, reps: '12' },
            { name: 'ElevaciÃ³n de gemelos', sets: 4, reps: '15' },
        ]
    },
    {
        id: 'r3',
        name: 'Full Body Principiante',
        level: 'Principiante',
        days: 'Lunes / MiÃ©rcoles / Viernes',
        exercises: [
            { name: 'Sentadilla goblet', sets: 3, reps: '12' },
            { name: 'Press de pecho con mancuernas', sets: 3, reps: '12' },
            { name: 'Remo con mancuerna', sets: 3, reps: '12' },
            { name: 'Zancadas', sets: 3, reps: '10 c/lado' },
            { name: 'Plancha abdominal', sets: 3, reps: '30s' },
            { name: 'ElongaciÃ³n general', sets: 1, reps: '10 min' },
        ]
    },
    {
        id: 'r4',
        name: 'Quema de Grasa HIIT',
        level: 'Avanzado',
        days: 'Martes / Jueves / SÃ¡bado',
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
            { name: 'Planchas dinÃ¡micas', sets: 3, reps: '12' },
            { name: 'Salto al cajÃ³n', sets: 3, reps: '10' },
            { name: 'Wall balls', sets: 3, reps: '15' },
            { name: 'Farmer walk', sets: 3, reps: '30m' },
        ]
    },
    {
        id: 'r6',
        name: 'Fuerza MÃ¡xima',
        level: 'Avanzado',
        days: 'Lunes / MiÃ©rcoles / Viernes',
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

// â”€â”€ Field Mapping: JS camelCase â†” DB snake_case â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    };
}

// â”€â”€ Supabase Data Helpers (async) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€ Formatting Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function formatDate(dateString) {
    if (!dateString) return 'â€”';
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString + 'T12:00:00').toLocaleDateString('es-AR', options);
}

function formatCurrency(amount) {
    if (amount === null || amount === undefined || amount === 0) return 'Pendiente';
    return '$' + amount.toLocaleString('es-AR');
}

// â”€â”€ Payment / Month Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        label += member.daysPerWeek === 'libre' ? ' (Pase Libre)' : ` (${member.daysPerWeek} dÃ­as)`;
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
// public.js â€” Public page logic for M.A. Fitness (Supabase)
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

    // "Registrate acÃ¡" link
    document.getElementById('link-register').addEventListener('click', e => {
        e.preventDefault();
        showRegistrationForm();
    });

    // Registration: plan selector â€” show days for ALL plans
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

// â”€â”€ Login Flow â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function handleLogin() {
    console.log('[public.js] handleLogin triggered');
    const dniInput = document.getElementById('dni-input');
    const errorEl = document.getElementById('login-error');
    const dni = dniInput.value.trim();
    console.log('[public.js] DNI:', dni);

    if (!dni || dni.length < 7) {
        showError(errorEl, 'IngresÃ¡ un DNI vÃ¡lido (7-8 dÃ­gitos).');
        return;
    }

    try {
        if (!window.supabaseApp) {
            throw new Error('La base de datos (Supabase) no se cargÃ³ correctamente. RevisÃ¡ tu conexiÃ³n.');
        }

        const member = await getMemberByDni(dni);
        if (member) {
            errorEl.textContent = '';
            showMemberPanel(member);
        } else {
            showError(errorEl, 'DNI no encontrado. Si sos nuevo, hacÃ© clic en "Registrate acÃ¡".');
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

// â”€â”€ Registration Flow â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

    // Validation
    if (!dni || dni.length < 7) { showError(errorEl, 'IngresÃ¡ un DNI vÃ¡lido (7-8 dÃ­gitos).'); return; }
    if (!name) { showError(errorEl, 'IngresÃ¡ tu nombre completo.'); return; }
    if (!phone) { showError(errorEl, 'IngresÃ¡ tu nÃºmero de telÃ©fono.'); return; }
    if (!selectedPlan) { showError(errorEl, 'SeleccionÃ¡ un plan.'); return; }
    if (!selectedDays) { showError(errorEl, 'SeleccionÃ¡ la cantidad de dÃ­as.'); return; }

    registrationDni = dni;

    // Check DNI not already registered
    const existing = await getMemberByDni(registrationDni);
    if (existing) {
        showError(errorEl, 'Este DNI ya estÃ¡ registrado. VolvÃ© al inicio e ingresÃ¡ tu DNI para acceder.');
        return;
    }

    // Resolve fee: only EstÃ¡ndar has auto-fee based on days
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
    };

    await addMember(newMember);
    errorEl.textContent = '';

    // Show success
    hideAll();
    document.getElementById('register-success').style.display = 'block';
}

// â”€â”€ Member Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

    // Routine â€” display as read-only table with 6 days Ã— 4 sub-columns
    const routineContainer = document.getElementById('panel-routine');
    const hasRoutine = member.routine && Array.isArray(member.routine) &&
        member.routine.some(row => row.some(day => day.ejercicio || day.series || day.rep || day.peso));

    if (hasRoutine) {
        let theadHtml = '<tr class="routine-day-header">';
        for (let d = 0; d < 6; d++) {
            theadHtml += `<th colspan="4">DÃ­a ${d + 1}</th>`;
        }
        theadHtml += '</tr><tr class="routine-sub-header">';
        for (let d = 0; d < 6; d++) {
            theadHtml += '<th>Ejercicio</th><th>Series</th><th>Rep</th><th>Peso</th>';
        }
        theadHtml += '</tr>';

        let tbodyHtml = '';
        member.routine.forEach(row => {
            const hasContent = row.some(day => day.ejercicio || day.series || day.rep || day.peso);
            if (!hasContent) return;
            tbodyHtml += '<tr>';
            row.forEach(day => {
                tbodyHtml += `<td>${day.ejercicio || 'â€”'}</td>`;
                tbodyHtml += `<td class="rt-center">${day.series || 'â€”'}</td>`;
                tbodyHtml += `<td class="rt-center">${day.rep || 'â€”'}</td>`;
                tbodyHtml += `<td class="rt-center">${day.peso || 'â€”'}</td>`;
            });
            tbodyHtml += '</tr>';
        });

        routineContainer.innerHTML = `
            <div class="routine-detail-card">
                <div class="routine-detail-header">
                    <h3><i class="fas fa-dumbbell"></i> Tu Rutina</h3>
                </div>
                <div class="routine-table-scroll">
                    <table class="routine-display-table">
                        <thead>${theadHtml}</thead>
                        <tbody>${tbodyHtml}</tbody>
                    </table>
                </div>
            </div>`;
    } else {
        routineContainer.innerHTML = `
            <div class="no-routine-msg">
                <i class="fas fa-info-circle"></i>
                <p>TodavÃ­a no tenÃ©s una rutina asignada. ConsultÃ¡ en recepciÃ³n para que te asignen una.</p>
            </div>`;
    }
}

// â”€â”€ Profile Editing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

    if (!name) { showProfileMsg('IngresÃ¡ tu nombre.', 'error'); return; }
    if (!phone) { showProfileMsg('IngresÃ¡ tu telÃ©fono.', 'error'); return; }

    member.name = name;
    member.phone = phone;
    member.plan = plan;
    member.daysPerWeek = days;

    // Auto-update fee for estÃ¡ndar
    if (plan === 'estandar') {
        const opt = PLANS.estandar.options.find(o => String(o.days) === String(days));
        member.fee = opt ? opt.fee : member.fee;
    }
    // For personalizado/online, keep existing fee

    await updateMember(member);
    showProfileMsg('Â¡Datos actualizados!', 'success');

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

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
