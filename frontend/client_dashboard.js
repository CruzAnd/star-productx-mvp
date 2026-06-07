// =========================================================================
// CONFIGURACIÓN GLOBAL DEL ECOSISTEMA STARPRODUTX LLC
// =========================================================================
const API_URL = "http://127.0.0.1:8000";
let cacheProductos = [];

// COLOCA AQUÍ TU ENLACE REAL DE GOOGLE DRIVE (Punto 6)
const URL_DRIVE_REAL = "https://drive.google.com/drive/u/0/folders/1wwVmwooswJhSi4stWgIMeLPBJEM86OBQ";

// Esperar a que el árbol DOM esté listo para interactuar
document.addEventListener("DOMContentLoaded", () => {
    // Cargar la pestaña de inicio por defecto (Estado de mi Proyecto)
    cargarTrackingCliente();

    // Configurar el enrutador dinámico del menú lateral izquierdo
    configurarMenuLateral();
});

/**
 * Controla el enrutamiento interno de la aplicación (SPA) sin recargar página
 */
function configurarMenuLateral() {
    const btnTracking = document.getElementById("btn-nav-tracking");
    const btnProductos = document.getElementById("btn-nav-productos");
    const btnDocumentacion = document.getElementById("btn-nav-documentacion");
    const btnConfirmarLogout = document.getElementById("btn-confirmar-logout");

    if (btnTracking) {
        btnTracking.addEventListener("click", (e) => {
            e.preventDefault();
            cambiarPestañaActiva(btnTracking);
            cargarTrackingCliente();
        });
    }

    if (btnProductos) {
        btnProductos.addEventListener("click", (e) => {
            e.preventDefault();
            cambiarPestañaActiva(btnProductos);
            renderizarVistaProductos();
        });
    }

    if (btnDocumentacion) {
        btnDocumentacion.addEventListener("click", (e) => {
            e.preventDefault();
            cambiarPestañaActiva(btnDocumentacion);
            renderizarVistaDocumentacion();
        });
    }

    // Acción definitiva del botón del modal corporativo de logout (Punto 7)
    if (btnConfirmarLogout) {
        btnConfirmarLogout.addEventListener("click", () => {
            localStorage.clear();
            window.location.href = "index.html";
        });
    }
}

/**
 * Maneja el estado visual activo (borde naranja/azul) en el menú lateral
 */
function cambiarPestañaActiva(elementoSeleccionado) {
    const links = document.querySelectorAll(".sidebar-link");
    links.forEach(l => l.classList.remove("active"));
    elementoSeleccionado.classList.add("active");
}

// =========================================================================
// =========================================================================
// VISTA 1: TRACKING DE PROYECTOS (ESTADO DE MI PROYECTO - CON FILTRO GLOBAL)
// =========================================================================
let cacheMarcas = []; // Almacén en memoria para el filtrado reactivo

async function cargarTrackingCliente() {
    const container = document.getElementById("main-content-area");
    const token = localStorage.getItem("token");

    // Inyectamos la estructura incluyendo el Buscador Dinámico que solicitaste
    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h3 class="fw-bold text-secondary">Estado de Mi Proyecto</h3>
                <p class="text-muted small mb-0">Consulte el progreso y maduración comercial de las marcas en tiempo real.</p>
            </div>
            <div style="max-width: 250px;">
                <input type="text" id="buscar-marca" oninput="filtrarMarcas()" class="form-control form-control-sm" placeholder="Buscar por Marca o Tipología...">
            </div>
        </div>
        <div class="bg-white p-4 rounded shadow-sm border">
            <table class="table table-hover align-middle">
                <thead class="table-light">
                    <tr>
                        <th><i class="bi bi-tag-fill me-2"></i>Marca / Proyecto</th>
                        <th><i class="bi bi-info-circle-fill me-2"></i>Tipología Comercial</th>
                        <th><i class="bi bi-bar-chart-fill me-2"></i>Progreso General</th>
                        <th class="text-center"><i class="bi bi-eye-fill me-2"></i>Hitos</th>
                    </tr>
                </thead>
                <tbody id="tabla-tracking-body">
                    <tr>
                        <td colspan="4" class="text-center text-muted py-4">
                            <div class="spinner-border spinner-border-sm text-primary me-2"></div> Sincronizando flujo de proyectos...
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;

    try {
        // Consumimos el endpoint de tu FastAPI sin filtros restrictivos de tipología
        const response = await fetch(`http://127.0.0.1:8000/tracking`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("No se pudo conectar con el servicio de tracking.");

        // Guardamos todas las marcas en el caché global para que funcione el filtro
        cacheMarcas = await response.json();

        // Pintamos el listado completo en la tabla
        pintarMarcas(cacheMarcas);

    } catch (e) {
        document.getElementById("tabla-tracking-body").innerHTML = `
            <tr><td colspan="4" class="text-center text-danger py-3"><i class="bi bi-exclamation-triangle-fill me-2"></i>${e.message}</td></tr>
        `;
    }
}

/**
 * Renderiza las filas de las marcas basándose en la lista proveída (Filtro o General)
 */
function pintarMarcas(lista) {
    const tbody = document.getElementById("tabla-tracking-body");
    tbody.innerHTML = "";

    if (lista.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-3">No se encontraron marcas o proyectos que coincidan con la búsqueda.</td></tr>`;
        return;
    }

    lista.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="fw-bold text-dark">${item.nombre_marca}</td>
            <td>
                <span class="badge text-uppercase bg-secondary text-white">
                    ${item.tipologia || 'CLIENTE EMPRENDEDOR'}
                </span>
            </td>
            <td>
                <div class="d-flex align-items-center gap-2">
                    <div class="progress flex-grow-1" style="height: 10px;">
                        <div class="progress-bar bg-success" style="width: ${item.porcentaje_progreso}%;"></div>
                    </div>
                    <span class="fw-bold small text-muted">${item.porcentaje_progreso}%</span>
                </div>
            </td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-primary" onclick="verDetalleHitos(${item.id_marca})">
                    <i class="bi bi-list-check me-1"></i> Consultar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Ejecuta el filtrado reactivo en tiempo real al escribir en el input
 */
function filtrarMarcas() {
    const query = document.getElementById("buscar-marca").value.toLowerCase().trim();

    const filtradas = cacheMarcas.filter(m =>
        (m.nombre_marca || "").toLowerCase().includes(query) ||
        (m.tipologia || "").toLowerCase().includes(query)
    );

    pintarMarcas(filtradas);
}

/**
 * Consulta y despliega la línea de tiempo vertical de hitos para la marca seleccionada
 */
async function verDetalleHitos(idMarca) {
    const token = localStorage.getItem("token");
    const modalBody = document.getElementById("modal-hitos-body");

    modalBody.innerHTML = `<div class="text-center text-muted p-3"><div class="spinner-border spinner-border-sm text-primary me-2"></div>Leyendo hitos de la marca...</div>`;

    const m = new bootstrap.Modal(document.getElementById('modal-hitos-cliente'));
    m.show();

    try {
        const response = await fetch(`http://127.0.0.1:8000/tracking/${idMarca}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();

        document.getElementById("modal-hitos-titulo").innerHTML = `<i class="bi bi-shield-check text-success me-2"></i>Seguimiento: ${data.nombre_marca}`;
        modalBody.innerHTML = `<div class="py-2">`;

        data.hitos.forEach((h, i) => {
            const ok = h.estado_completado === true || h.estado_completado === 1;
            modalBody.innerHTML += `
                <div class="timeline-item mb-3 ${ok ? 'completed' : ''}">
                    <div class="timeline-badge"></div>
                    <div class="ms-3 bg-white p-3 rounded border shadow-sm d-flex justify-content-between align-items-center">
                        <h6 class="mb-0 fw-medium ${ok ? 'text-success text-decoration-line-through' : 'text-dark'}">${i + 1}. ${h.nombre_hito}</h6>
                        <span class="badge ${ok ? 'bg-success-subtle text-success' : 'bg-light text-muted'} border small">${ok ? 'Completado' : 'Pendiente'}</span>
                    </div>
                </div>`;
        });
    } catch (err) {
        modalBody.innerHTML = `<div class="alert alert-danger small">${err.message}</div>`;
    }
}

// =========================================================================
// VISTA 2: CATÁLOGO DE PRODUCTOS (CORRELACIÓN DIRECTA CON PRODUCTS.PY)
// =========================================================================
async function renderizarVistaProductos() {
    const container = document.getElementById("main-content-area");
    const token = localStorage.getItem("token");

    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h3 class="fw-bold text-secondary">Catálogo de Productos</h3>
                <p class="text-muted small mb-0">Fichas técnicas y especificaciones logísticas autorizadas por STARPRODUTX.</p>
            </div>
            <div style="max-width: 250px;">
                <input type="text" id="buscar-p" oninput="filtrarP()" class="form-control form-control-sm" placeholder="Buscar por Nombre o Marca...">
            </div>
        </div>
        <div class="bg-white p-4 rounded shadow-sm border">
            <table class="table table-hover align-middle">
                <thead class="table-light">
                    <tr>
                        <th>ID Producto</th>
                        <th>Nombre Comercial</th>
                        <th>Marca Asociada</th>
                        <th class="text-center">Métricas e Historial</th>
                    </tr>
                </thead>
                <tbody id="tabla-productos-body">
                    <tr><td colspan="4" class="text-center text-muted py-4"><div class="spinner-border spinner-border-sm text-primary me-2"></div>Sincronizando inventario de FastAPI...</td></tr>
                </tbody>
            </table>
        </div>
    `;

    try {
        // Apunta directamente a la ruta mapeada /api/products/ de tu Backend en Python
        const response = await fetch(`${API_URL}/products`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error(`Error de comunicación. Código de estado: ${response.status}`);
        const datos = await response.json();

        // Control y protección estructural de variables
        if (Array.isArray(datos)) {
            cacheProductos = datos;
            pintarProductos(cacheProductos);
        } else {
            throw new Error("La respuesta recibida no posee una estructura de lista válida.");
        }
    } catch (e) {
        document.getElementById("tabla-productos-body").innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-danger py-3">
                    <i class="bi bi-exclamation-octagon-fill me-2"></i>Error al mapear catálogo: ${e.message}
                </td>
            </tr>
        `;
    }
}

/**
 * Renderiza iterativamente las filas de la tabla leyendo las llaves exactas de Python
 */
function pintarProductos(lista) {
    const tbody = document.getElementById("tabla-productos-body");
    tbody.innerHTML = "";

    if (lista.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-3">No se encontraron productos registrados.</td></tr>`;
        return;
    }

    lista.forEach(p => {
        // Inyectamos las llaves exactas devueltas en el response de products.py (id_producto, nombre_producto, nombre_marca)
        tbody.innerHTML += `
            <tr>
                <td><code class="text-secondary">#PROD-${p.id_producto}</code></td>
                <td class="fw-bold text-dark">${p.nombre_producto || 'N/A'}</td>
                <td><span class="badge bg-light text-dark border"><i class="bi bi-bookmark-fill me-1 text-primary"></i>${p.nombre_marca}</span></td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-secondary" onclick="verFichaProducto(${p.id_producto})">
                        <i class="bi bi-zoom-in me-1"></i> Ver Ficha
                    </button>
                </td>
            </tr>`;
    });
}

/**
 * Filtro de búsqueda en tiempo real (memoria caché) para no estresar la base de datos PostgreSQL
 */
function filtrarP() {
    const query = document.getElementById("buscar-p").value.toLowerCase().trim();
    const filtrados = cacheProductos.filter(p =>
        (p.nombre_producto || "").toLowerCase().includes(query) ||
        (p.nombre_marca || "").toLowerCase().includes(query)
    );
    pintarProductos(filtrados);
}

/**
 * Abre el Modal y renderiza la información extendida del producto
 */
function verFichaProducto(id) {
    const prod = cacheProductos.find(p => p.id_producto === id);
    if (!prod) return;

    // Asignación de variables mapeadas directamente desde tu backend
    document.getElementById("view-prod-nombre").innerText = prod.nombre_producto || "N/A";
    document.getElementById("view-prod-descripcion").innerText = prod.descripcion_producto || "Sin especificaciones comerciales cargadas.";
    document.getElementById("view-prod-sku").innerText = `MARCA-ID: ${prod.id_marca}`;
    document.getElementById("view-prod-costo").innerText = prod.costo_envio ? `$${prod.costo_envio}` : "No aplica / Exento";

    const m = new bootstrap.Modal(document.getElementById('modal-detalle-producto-cliente'));
    m.show();
}

// =========================================================================
// VISTA 3: REPOSITORIO DE DOCUMENTACIÓN (GOOGLE DRIVE)
// =========================================================================
function renderizarVistaDocumentacion() {
    document.getElementById("main-content-area").innerHTML = `
        <div class="mb-4">
            <h3 class="fw-bold text-secondary">Repositorio de Entregables</h3>
            <p class="text-muted small">Acceso seguro a las carpetas oficiales de documentación del proyecto.</p>
        </div>
        <div class="card shadow-sm border p-4 bg-white" style="max-width: 650px;">
            <div class="card-body d-flex gap-4 align-items-start">
                <div class="bg-warning bg-opacity-10 p-3 rounded text-warning flex-shrink-0" style="font-size: 2.5rem; line-height: 1;">
                    <i class="bi bi-folder-fill"></i>
                </div>
                <div>
                    <h5 class="fw-bold text-dark mb-2">Ecosistema Compartido en Google Drive</h5>
                    <p class="card-text text-secondary small leading-relaxed mb-3">
                        A través de este canal centralizado, usted podrá auditar, descargar y revisar en tiempo real todo el material confidencial procesado por los consultores de STARPRODUTX LLC para su marca.
                    </p>
                    <a href="${URL_DRIVE_REAL}" target="_blank" class="btn btn-sm text-white font-semibold px-4 py-2" style="background-color: var(--naranja-principal); border: none;">
                        <i class="bi bi-box-arrow-up-right me-2"></i>Ir a mi Carpeta Corporativa
                    </a>
                </div>
            </div>
        </div>
    `;
}
// =========================================================================
// CONTROL DE SESIÓN INACTIVA (INTEGRADO AL MODAL CORPORATIVO REAL)
// =========================================================================
let temporizadorInactividad;

function resetearTemporizador() {
    clearTimeout(temporizadorInactividad);

    // 15 segundos exactos para la sustentación del MVP
    temporizadorInactividad = setTimeout(() => {

        // 1. Apuntamos al ID real de tu HTML corporativo
        const modalElement = document.getElementById('modal-logout-corporativo');

        if (modalElement) {
            // Modificamos el título para advertir la infracción de seguridad
            const titulo = modalElement.querySelector('.modal-title');
            if (titulo) titulo.innerHTML = `<i class="bi bi-shield-lock-fill me-2"></i>Sesión Expirada`;

            // Reemplazamos el icono de la puerta por un candado de alerta en color rojo/naranja
            const cuerpoModal = modalElement.querySelector('.modal-body');
            if (cuerpoModal) {
                cuerpoModal.innerHTML = `
                    <i class="bi bi-exclamation-triangle text-danger d-block mb-3" style="font-size: 3rem;"></i>
                    <p class="mb-0 text-secondary fw-medium">🔒 <strong>Control de Auditoría:</strong> Su sesión ha sido suspendida automáticamente por acumular 15 segundos de inactividad.</p>
                `;
            }

            // Ocultamos los botones normales de decisión para que el usuario solo pueda ver el cierre inminente
            const footerModal = modalElement.querySelector('.modal-footer');
            if (footerModal) {
                footerModal.innerHTML = `<span class="text-muted small"><div class="spinner-border spinner-border-sm me-2"></div>Redirigiendo de forma segura...</span>`;
            }

            // 2. Disparamos el Modal usando la instancia nativa de Bootstrap 5
            const modalCorporativo = new bootstrap.Modal(modalElement);
            modalCorporativo.show();
        }

        // 3. Damos un margen de 4 segundos para que el profesor lea la alerta estilizada antes del redireccionamiento
        setTimeout(() => {
            localStorage.clear();
            window.location.href = "index.html";
        }, 4000);

    }, 15000);
}

// Oyentes de eventos globales para reiniciar el conteo automático
window.onload = resetearTemporizador;
document.onmousemove = resetearTemporizador;
document.onkeypress = resetearTemporizador;
document.onclick = resetearTemporizador;