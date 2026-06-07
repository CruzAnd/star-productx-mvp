document.addEventListener("DOMContentLoaded", () => {

    // Variable global para controlar si estamos editando o registrando un usuario
    let usuarioEditandoId = null;

    // ===================================================
    // 1. INYECTAR MODALES DE CONTROL AL BODY
    // ===================================================
    if (!document.getElementById("modal-logout-confirm")) {
        const modalHtml = `
            <div id="modal-logout-confirm" style="display: none; position: fixed; z-index: 2000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); justify-content: center; align-items: center;">
                <div class="bg-white p-4 rounded shadow-lg text-center" style="width: 100%; max-width: 400px;">
                    <i class="bi bi-box-arrow-left text-danger mb-2" style="font-size: 3rem;"></i>
                    <h5 class="fw-bold" style="color: #1F3A5F;">¿Cerrar Sesión?</h5>
                    <p class="text-muted small">¿Está seguro de que desea salir de la plataforma de STARPRODUTX LLC?</p>
                    <div class="d-flex gap-2 mt-4">
                        <button type="button" class="btn btn-sm btn-secondary w-50" id="btn-logout-cancelar">Cancelar</button>
                        <button type="button" class="btn btn-sm text-white fw-bold w-50" id="btn-logout-confirmar" style="background-color: #F57C00;">Salir de una vez</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    if (!document.getElementById("modal-usuario-delete-confirm")) {
        const modalDeleteHtml = `
            <div id="modal-usuario-delete-confirm" style="display: none; position: fixed; z-index: 2000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); justify-content: center; align-items: center;">
                <div class="bg-white p-4 rounded shadow-lg text-center" style="width: 100%; max-width: 400px;">
                    <i class="bi bi-exclamation-triangle-fill text-danger mb-2" style="font-size: 3rem;"></i>
                    <h5 class="fw-bold" style="color: #1F3A5F;">¿Eliminar Usuario?</h5>
                    <p class="text-muted small">Esta acción removerá el registro permanentemente</p>
                    <div class="d-flex gap-2 mt-4">
                        <button type="button" class="btn btn-sm btn-secondary w-50" id="btn-delete-user-cancelar">Cancelar</button>
                        <button type="button" class="btn btn-sm btn-danger fw-bold w-50" id="btn-delete-user-confirmar">Eliminar Registro</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalDeleteHtml);
    }

    // ===================================================
    // 2. CONTROL DEL MODAL DE LOGOUT
    // ===================================================
    const btnLogout = document.getElementById("btn-logout");
    const modalLogout = document.getElementById("modal-logout-confirm");
    const btnLogoutCancelar = document.getElementById("btn-logout-cancelar");
    const btnLogoutConfirmar = document.getElementById("btn-logout-confirmar");

    if (btnLogout && modalLogout) {
        btnLogout.addEventListener("click", (e) => { e.preventDefault(); modalLogout.style.display = "flex"; });
    }
    if (btnLogoutCancelar && modalLogout) {
        btnLogoutCancelar.addEventListener("click", () => { modalLogout.style.display = "none"; });
    }
    if (btnLogoutConfirmar) {
        btnLogoutConfirmar.addEventListener("click", () => { localStorage.clear(); window.location.href = "index.html"; });
    }

    // ===================================================
    // 3. DESPLIEGUE MENÚS LATERALES (SUBMENÚS ACCORDION)
    // ===================================================
    const triggerClientes = document.getElementById("trigger-clientes");
    const boxClientes = document.getElementById("box-clientes");
    const iconClientes = document.getElementById("icon-clientes");
    if (triggerClientes && boxClientes) {
        triggerClientes.addEventListener("click", () => {
            const active = boxClientes.style.display === "block";
            boxClientes.style.display = active ? "none" : "block";
            if (iconClientes) iconClientes.className = active ? "bi bi-chevron-down small text-muted" : "bi bi-chevron-up small text-muted";
        });
    }

    const triggerMarcas = document.getElementById("trigger-marcas");
    const boxMarcas = document.getElementById("box-marcas");
    const iconMarcas = document.getElementById("icon-marcas");
    if (triggerMarcas && boxMarcas) {
        triggerMarcas.addEventListener("click", () => {
            const active = boxMarcas.style.display === "block";
            boxMarcas.style.display = active ? "none" : "block";
            if (iconMarcas) iconMarcas.className = active ? "bi bi-chevron-down small text-muted" : "bi bi-chevron-up small text-muted";
        });
    }

    // ===================================================
    // 4. MANEJO DE NAVEGACIÓN Y VISTAS ASÍNCRONAS
    // ===================================================
    const btnInicio = document.getElementById("btn-nav-inicio");
    const btnCrearUsuario = document.getElementById("btn-sub-crear-usuario");
    const btnCrearCliente = document.getElementById("btn-sub-crear-cliente");
    const btnCrearMarca = document.getElementById("btn-sub-crear-marca");
    const btnSeguimiento = document.getElementById("btn-sub-seguimiento");
    const mainContent = document.getElementById("main-content-area");

    function desmarcarEnlaces() {
        document.querySelectorAll(".sidebar-link").forEach(link => link.classList.remove("active"));
    }

    if (btnInicio && mainContent) {
        btnInicio.addEventListener("click", (e) => {
            e.preventDefault(); desmarcarEnlaces(); btnInicio.classList.add("active");
            mainContent.innerHTML = `
                <div class="text-center" style="opacity: 0.85;">
                    <i class="bi bi-building-gear d-block mb-3" style="font-size: 6rem; color: #1F3A5F;"></i>
                    <h3 class="fw-light text-secondary">STARPRODUTX LLC</h3>
                    <p class="text-muted small">Plataforma de Gestión y Visualización del Ciclo de Comercialización</p>
                </div>
            `;
        });
    }

    // ===================================================
    // 5. MÓDULO CONTROL DE USUARIOS (VISTA DINÁMICA)
    // ===================================================
    if (btnCrearUsuario && mainContent) {
        btnCrearUsuario.addEventListener("click", async (e) => {
            e.preventDefault(); desmarcarEnlaces(); btnCrearUsuario.classList.add("active");

            // Inyección de la estructura limpia de la interfaz de usuario en el contenedor central;
            mainContent.innerHTML = `
                <div class="w-100 align-self-start bg-white p-4 rounded shadow-sm">
                    <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                        <h4 style="color: #1F3A5F; margin: 0;"><i class="bi bi-people-fill me-2"></i> Control de Usuarios del Sistema</h4>
                        <button class="btn btn-sm text-white fw-bold" id="btn-abrir-modal-usuario" style="background-color: #F57C00;">
                            <i class="bi bi-person-plus-fill me-1"></i> + Registrar Nuevo Usuario
                        </button>
                    </div>

                    <div class="row g-2 mb-3">
                        <div class="col-md-6 col-lg-4">
                            <div class="input-group input-group-sm">
                                <span class="input-group-text bg-light text-muted"><i class="bi bi-search"></i></span>
                                <input type="text" id="input-buscar-usuario" class="form-control" placeholder="Filtrar por ID, Nombre o Correo...">
                            </div>
                        </div>
                    </div>
                    
                    <div id="crud-alert-container"></div>

                    <div class="table-responsive">
                        <table class="table table-hover table-sm align-middle" style="font-size: 0.9rem;" id="tabla-usuarios">
                            <thead style="background-color: #1F3A5F; color: white;">
                                <tr>
                                    <th class="p-2">ID</th>
                                    <th class="p-2">Nombre Completo</th>
                                    <th class="p-2">Correo Electrónico</th>
                                    <th class="p-2">Rol asignado</th>
                                    <th class="p-2">Estado</th>
                                    <th class="p-2 text-center" style="width: 120px;">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tabla-usuarios-body">
                                <tr><td colspan="6" class="text-center p-3 text-muted">Conectando a PostgreSQL...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="modal-usuario" style="display: none; position: fixed; z-index: 1050; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); justify-content: center; align-items: center;">
                    <div class="bg-white p-4 rounded shadow-lg" style="width: 100%; max-width: 500px; position: relative;">
                        <h5 style="color: #1F3A5F;" class="border-bottom pb-2 mb-3" id="modal-usuario-titulo">
                            <i class="bi bi-person-plus-fill me-2"></i> Registrar Nuevo Usuario
                        </h5>
                        <div id="modal-alert-container"></div>
                        <form id="form-modal-usuario">
                            <div class="mb-2">
                                <label class="form-label fw-semibold text-secondary small mb-1">Nombre Completo *</label>
                                <input type="text" class="form-control form-control-sm" id="user-fullname" required>
                            </div>
                            <div class="mb-2">
                                <label class="form-label fw-semibold text-secondary small mb-1">Correo Electrónico *</label>
                                <input type="email" class="form-control form-control-sm" id="user-email" required>
                            </div>
                            <div class="mb-2">
                                <label class="form-label fw-semibold text-secondary small mb-1" id="label-user-password">Contraseña de Ingreso *</label>
                                <input type="text" class="form-control form-control-sm" id="user-password" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small mb-1">Rol asignado *</label>
                                <select class="form-select form-select-sm" id="user-role" required>
                                    <option value="cliente" selected>Cliente (Corporativo)</option>
                                    <option value="admin">Administrador (STARPRODUTX)</option>
                                </select>
                            </div>
                            <div class="d-flex gap-2 mt-4">
                                <button type="button" class="btn btn-sm btn-secondary w-50" id="btn-cerrar-modal-usuario">Cancelar</button>
                                <button type="submit" class="btn btn-sm text-white fw-bold w-50" id="btn-guardar-modal-usuario" style="background-color: #F57C00;">Guardar en Postgres</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;

            usuarioEditandoId = null;
            inicializarEventosModuloUsuarios();
            await cargarTablaUsuarios(); // Agregado await;
        });
    }

    // ===================================================
    // READ: TRAER USUARIOS REALES DE FASTAPI + POSTGRES
    // ===================================================
    async function cargarTablaUsuarios() {
        const tbody = document.getElementById("tabla-usuarios-body");
        if (!tbody) return;

        try {
            const tokenActual = localStorage.getItem("token");
            const response = await fetch("http://127.0.0.1:8000/users/", {
                method: "GET",
                headers: { "Authorization": `Bearer ${tokenActual}` }
            });

            // Eliminación del 'throw' local para evitar advertencias de WebStorm;
            if (!response.ok) {
                tbody.innerHTML = `<tr><td colspan="6" class="text-center p-3 text-danger"><i class="bi bi-exclamation-octagon-fill"></i> Error en la respuesta del servidor HTTP.</td></tr>`;
                return;
            }

            const usuarios = await response.json();
            tbody.innerHTML = ""; // Limpia el mensaje de espera;

            if (usuarios.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" class="text-center p-3 text-muted">No existen usuarios creados en la base de datos.</td></tr>`;
                return;
            }

            usuarios.forEach(user => {
                tbody.innerHTML += `
                    <tr class="fila-usuario">
                        <td class="p-2 text-muted target-id">${user.id}</td>
                        <td class="p-2 fw-semibold target-name">${user.full_name}</td>
                        <td class="p-2 target-email">${user.email}</td>
                        <td class="p-2"><span class="badge bg-secondary">${user.role}</span></td>
                        <td class="p-2"><span class="badge ${user.is_active ? 'bg-success' : 'bg-danger'}">${user.is_active ? 'Activo' : 'Inactivo'}</span></td>
                        <td class="p-2 text-center">
                            <button class="btn btn-link btn-sm p-0 me-2 text-primary btn-editar-user-trigger" data-id="${user.id}" data-fullname="${user.full_name}" data-email="${user.email}" data-role="${user.role}"><i class="bi bi-pencil-square fs-5"></i></button>
                            <button class="btn btn-link btn-sm p-0 text-danger btn-eliminar-user-trigger" data-id="${user.id}" data-fullname="${user.full_name}"><i class="bi bi-trash3-fill fs-5"></i></button>
                        </td>
                    </tr>
                `;
            });

            mapearEventosBotonesDinamicos();

        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center p-3 text-danger"><i class="bi bi-exclamation-octagon-fill"></i> Error de conexión con el Backend: ${error.message}</td></tr>`;
        }
    }

    // ===================================================
    // ACCIONES: MAPEO DINÁMICO (EDITAR Y ELIMINAR)
    // ===================================================
    function mapearEventosBotonesDinamicos() {
        // ACCIÓN: ABRIR EDICIÓN
        document.querySelectorAll(".btn-editar-user-trigger").forEach(btn => {
            btn.addEventListener("click", () => {
                usuarioEditandoId = btn.getAttribute("data-id");
                document.getElementById("modal-usuario-titulo").innerHTML = `<i class="bi bi-pencil-square me-2"></i> Modificar Datos de Usuario`;
                document.getElementById("btn-guardar-modal-usuario").innerText = "Actualizar Cambios";
                document.getElementById("label-user-password").innerText = "Nueva Contraseña (Dejar en blanco para mantener)";
                document.getElementById("user-password").required = false;

                document.getElementById("user-fullname").value = btn.getAttribute("data-fullname");
                document.getElementById("user-email").value = btn.getAttribute("data-email");
                document.getElementById("user-role").value = btn.getAttribute("data-role");

                document.getElementById("modal-alert-container").innerHTML = "";
                document.getElementById("modal-usuario").style.display = "flex";
            });
        });

        // ACCIÓN: CONFIRMAR ELIMINACIÓN
        document.querySelectorAll(".btn-eliminar-user-trigger").forEach(btn => {
            btn.addEventListener("click", () => {
                const idEliminar = btn.getAttribute("data-id");
                const modalDel = document.getElementById("modal-usuario-delete-confirm");

                if (modalDel) {
                    modalDel.style.display = "flex";
                    document.getElementById("btn-delete-user-cancelar").onclick = () => modalDel.style.display = "none";
                    document.getElementById("btn-delete-user-confirmar").onclick = async () => {
                        modalDel.style.display = "none";
                        const crudAlert = document.getElementById("crud-alert-container");
                        try {
                            const tokenActual = localStorage.getItem("token");
                            const delResponse = await fetch(`http://127.0.0.1:8000/users/${idEliminar}`, {
                                method: "DELETE",
                                headers: { "Authorization": `Bearer ${tokenActual}` }
                            });


                            if (!delResponse.ok) {
                                if (crudAlert) crudAlert.innerHTML = `<div class="alert alert-danger small py-2">Error: No se pudo eliminar el registro en la API.</div>`;
                                return;
                            }

                            await cargarTablaUsuarios(); //Agregado await;
                            if (crudAlert) crudAlert.innerHTML = `<div class="alert alert-success small py-2">Usuario removido con éxito.</div>`;
                        } catch (err) {
                            if (crudAlert) crudAlert.innerHTML = `<div class="alert alert-danger small py-2">Error: ${err.message}</div>`;
                        }
                    };
                }
            });
        });
    }

    // ===================================================
    // BUSCADOR Y MANEJO INTERNO DE EVENTOS FORMULARIO
    // ===================================================
    function inicializarEventosModuloUsuarios() {
        const modal = document.getElementById("modal-usuario");
        const btnAbrir = document.getElementById("btn-abrir-modal-usuario");
        const btnCerrar = document.getElementById("btn-cerrar-modal-usuario");
        const form = document.getElementById("form-modal-usuario");
        const inputBuscar = document.getElementById("input-buscar-usuario");

        // FILTRO DE BÚSQUEDA EN TIEMPO REAL
        if (inputBuscar) {
            inputBuscar.addEventListener("input", () => {
                const val = inputBuscar.value.toLowerCase().trim();
                document.querySelectorAll(".fila-usuario").forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(val) ? "" : "none";
                });
            });
        }

        if (btnAbrir) {
            btnAbrir.addEventListener("click", () => {
                usuarioEditandoId = null;
                document.getElementById("modal-usuario-titulo").innerHTML = `<i class="bi bi-person-plus-fill me-2"></i> Registrar Nuevo Usuario`;
                document.getElementById("btn-guardar-modal-usuario").innerText = "Guardar en Postgres";
                document.getElementById("label-user-password").innerText = "Contraseña de Ingreso *";
                document.getElementById("user-password").required = true;
                form.reset();
                modal.style.display = "flex";
            });
        }
        if (btnCerrar) { btnCerrar.addEventListener("click", () => { modal.style.display = "none"; }); }

        // PROCESAR GUARDADO (CREATE & UPDATE)
        if (form) {
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                const btnSubmit = document.getElementById("btn-guardar-modal-usuario");
                btnSubmit.disabled = true;

                try {
                    const tokenActual = localStorage.getItem("token");
                    let url = "http://127.0.0.1:8000/users/";
                    let method = "POST";

                    if (usuarioEditandoId !== null) {
                        url = `http://127.0.0.1:8000/users/${usuarioEditandoId}`;
                        method = "PUT";
                    }

                    const response = await fetch(url, {
                        method: method,
                        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenActual}` },
                        body: JSON.stringify({
                            full_name: document.getElementById("user-fullname").value.trim(),
                            email: document.getElementById("user-email").value.trim(),
                            password: document.getElementById("user-password").value,
                            role: document.getElementById("user-role").value
                        })
                    });


                    if (!response.ok) {
                        alert("Error: El servidor de FastAPI rechazó los datos.");
                        btnSubmit.disabled = false;
                        return;
                    }

                    modal.style.display = "none";
                    await cargarTablaUsuarios(); // 🔄 Agregado await aquí para WebStorm

                } catch (error) {
                    alert("Error en el formulario: " + error.message);
                } finally {
                    btnSubmit.disabled = false;
                }
            });
        }
    }

    // ===================================================
    // 6. MÓDULOS DE RESERVA
    // ===================================================
    if (btnCrearCliente && mainContent) {
        btnCrearCliente.addEventListener("click", (e) => {
            e.preventDefault(); desmarcarEnlaces(); btnCrearCliente.classList.add("active");
            mainContent.innerHTML = `<div class="bg-white p-4 rounded shadow-sm"><h4><i class="bi bi-buildings"></i> Módulo de Clientes Activo</h4><p class="text-muted small">Área de desarrollo asignada a la base de datos.</p></div>`;
        });
    }

    if (btnCrearMarca && mainContent) {
        btnCrearMarca.addEventListener("click", (e) => {
            e.preventDefault(); desmarcarEnlaces(); btnCrearMarca.classList.add("active");
            mainContent.innerHTML = `<div class="bg-white p-4 rounded shadow-sm"><h4><i class="bi bi-tags"></i> Creación de Marcas</h4><p class="text-muted small">Módulo en proceso de integración.</p></div>`;
        });
    }

    if (btnSeguimiento && mainContent) {
        btnSeguimiento.addEventListener("click", (e) => {
            e.preventDefault(); desmarcarEnlaces(); btnSeguimiento.classList.add("active");
            mainContent.innerHTML = `<div class="bg-white p-4 rounded shadow-sm"><h4><i class="bi bi-layout-text-sidebar-reverse"></i> Seguimiento General</h4><p class="text-muted small">Visualización del ciclo comercial.</p></div>`;
        });
    }

    // ===================================================
    // 7. MÓDULO GESTIÓN DE CLIENTES (CORREGIDO Y COMPLETO)
    // ===================================================
    if (btnCrearCliente && mainContent) {
        btnCrearCliente.addEventListener("click", async (e) => {
            e.preventDefault();
            desmarcarEnlaces();
            btnCrearCliente.classList.add("active");

            // 1. Inyección de la interfaz gráfica y modales internos;
            mainContent.innerHTML = `
                <div class="w-100 align-self-start bg-white p-4 rounded shadow-sm">
                    <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                        <h4 style="color: #1F3A5F; margin: 0;"><i class="bi bi-buildings-fill me-2"></i> Gestión de Clientes Corporativos</h4>
                        <button class="btn btn-sm text-white fw-bold" id="btn-abrir-modal-cliente" style="background-color: #F57C00;">
                            <i class="bi bi-plus-circle-fill me-1"></i> + Registrar Nuevo Cliente
                        </button>
                    </div>

                    <div class="row g-2 mb-3">
                        <div class="col-md-6 col-lg-4">
                            <div class="input-group input-group-sm">
                                <span class="input-group-text bg-light text-muted"><i class="bi bi-search"></i></span>
                                <input type="text" id="input-buscar-cliente" class="form-control" placeholder="Filtrar por Empresa, Ciudad, etc...">
                            </div>
                        </div>
                    </div>
                    
                    <div id="cliente-alert-container"></div>

                    <div class="table-responsive">
                        <table class="table table-hover table-sm align-middle" style="font-size: 0.9rem;" id="tabla-clientes">
                            <thead style="background-color: #1F3A5F; color: white;">
                                <tr>
                                    <th class="p-2">ID</th>
                                    <th class="p-2">Nombre Empresa</th>
                                    <th class="p-2">Teléfono</th>
                                    <th class="p-2">Correo Corporativo</th>
                                    <th class="p-2">Tipología</th>
                                    <th class="p-2 text-center" style="width: 150px;">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tabla-clientes-body">
                                <tr><td colspan="6" class="text-center p-3 text-muted">Conectando a PostgreSQL...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="modal-cliente-ver" style="display: none; position: fixed; z-index: 1050; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); justify-content: center; align-items: center;">
                    <div class="bg-white p-4 rounded shadow-lg" style="width: 100%; max-width: 550px;">
                        <h5 style="color: #1F3A5F;" class="border-bottom pb-2 mb-3">
                            <i class="bi bi-eye-fill me-2 text-primary"></i> Ficha Técnica del Cliente
                        </h5>
                        <div class="row g-2 text-start small" id="ficha-cliente-contenido"></div>
                        <div class="text-end mt-4 border-top pt-2">
                            <button type="button" class="btn btn-sm btn-secondary" id="btn-cerrar-modal-ver">Cerrar Ficha</button>
                        </div>
                    </div>
                </div>

                <div id="modal-cliente-form" style="display: none; position: fixed; z-index: 1050; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); justify-content: center; align-items: center;">
                    <div class="bg-white p-4 rounded shadow-lg" style="width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto;">
                        <h5 style="color: #1F3A5F;" class="border-bottom pb-2 mb-3" id="modal-cliente-titulo">
                            <i class="bi bi-plus-circle-fill me-2"></i> Registrar Nuevo Cliente
                        </h5>
                        <form id="form-modal-cliente">
                            <div class="row g-2">
                                <div class="col-md-6 mb-2">
                                    <label class="form-label fw-semibold text-secondary small mb-1">Nombre / Razón Social *</label>
                                    <input type="text" class="form-control form-control-sm" id="cli-nombre" required>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label class="form-label fw-semibold text-secondary small mb-1">Correo Empresa *</label>
                                    <input type="email" class="form-control form-control-sm" id="cli-correo" required>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label class="form-label fw-semibold text-secondary small mb-1">Teléfono</label>
                                    <input type="text" class="form-control form-control-sm" id="cli-telefono">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label class="form-label fw-semibold text-secondary small mb-1">Ciudad</label>
                                    <input type="text" class="form-control form-control-sm" id="cli-ciudad">
                                </div>
                                <div class="col-12 mb-2">
                                    <label class="form-label fw-semibold text-secondary small mb-1">Tipología de Cliente *</label>
                                    <select class="form-select form-select-sm" id="cli-tipologia" required>
                                        <option value="Cliente Fabricante" selected>Cliente Fabricante</option>
                                        <option value="Cliente Emprendedor">Cliente Emprendedor</option>
                                    </select>
                                </div>
                                <div class="col-12 mb-2">
                                    <label class="form-label fw-semibold text-secondary small mb-1">Dirección Física</label>
                                    <textarea class="form-control form-control-sm" id="cli-direccion" rows="2"></textarea>
                                </div>
                                <div class="col-md-6 mb-2 bg-light p-2 rounded border">
                                    <label class="form-label fw-semibold text-dark small mb-1"><i class="bi bi-amazon"></i> Usuario Amazon Vendor</label>
                                    <input type="text" class="form-control form-control-sm" id="cli-amz-user">
                                </div>
                                <div class="col-md-6 mb-2 bg-light p-2 rounded border">
                                    <label class="form-label fw-semibold text-dark small mb-1"><i class="bi bi-key-fill"></i> Contraseña Amazon</label>
                                    <input type="text" class="form-control form-control-sm" id="cli-amz-pass">
                                </div>
                            </div>
                            <div class="d-flex gap-2 mt-4">
                                <button type="button" class="btn btn-sm btn-secondary w-50" id="btn-cerrar-modal-cliente">Cancelar</button>
                                <button type="submit" class="btn btn-sm text-white fw-bold w-50" id="btn-guardar-cliente" style="background-color: #F57C00;">Guardar en Postgres</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;

            // Identificador de control local para saber si editamos o guardamos nuevo;
            let clienteEditandoId = null;

            // ===================================================
            // READ: CONSUMIR API PARA LLENAR LA TABLA
            // ===================================================
            const cargarTablaClientes = async () => {
                const tbody = document.getElementById("tabla-clientes-body");
                if (!tbody) return;

                try {
                    const tokenActual = localStorage.getItem("token");
                    const response = await fetch("http://127.0.0.1:8000/clients/", {
                        method: "GET",
                        headers: { "Authorization": `Bearer ${tokenActual}` }
                    });

                    if (!response.ok) {
                        tbody.innerHTML = `<tr><td colspan="6" class="text-center p-3 text-danger"><i class="bi bi-exclamation-octagon-fill"></i> Error al recuperar registros de clientes.</td></tr>`;
                        return;
                    }

                    const clientes = await response.json();
                    tbody.innerHTML = "";

                    if (clientes.length === 0) {
                        tbody.innerHTML = `<tr><td colspan="6" class="text-center p-3 text-muted">No existen clientes registrados en la base de datos.</td></tr>`;
                        return;
                    }

                    clientes.forEach(cli => {
                        tbody.innerHTML += `
                            <tr class="fila-cliente">
                                <td class="p-2 text-muted fw-bold">${cli.id_empresa}</td>
                                <td class="p-2 fw-semibold">${cli.nombre_empresa}</td>
                                <td class="p-2">${cli.telefono || 'N/A'}</td>
                                <td class="p-2">${cli.correo_empresa || 'N/A'}</td>
                                <td class="p-2"><span class="badge bg-dark">${cli.tipologia || 'Cliente Fabricante'}</span></td>
                                <td class="p-2 text-center">
                                    <button class="btn btn-link btn-sm p-0 me-2 text-success btn-ver-cliente" 
                                        data-nombre="${cli.nombre_empresa}" data-telefono="${cli.telefono}" 
                                        data-direccion="${cli.direccion}" data-ciudad="${cli.ciudad}" 
                                        data-correo="${cli.correo_empresa}" data-tipologia="${cli.tipologia}" 
                                        data-amazonuser="${cli.usuario_amazon || ''}" data-amazonpass="${cli.contrasena_amazon || ''}">
                                        <i class="bi bi-eye-fill fs-5"></i>
                                    </button>
                                    <button class="btn btn-link btn-sm p-0 me-2 text-primary btn-editar-cliente" 
                                        data-id="${cli.id_empresa}" data-nombre="${cli.nombre_empresa}" 
                                        data-telefono="${cli.telefono}" data-direccion="${cli.direccion}" 
                                        data-ciudad="${cli.ciudad}" data-correo="${cli.correo_empresa}" 
                                        data-tipologia="${cli.tipologia}" data-amazonuser="${cli.usuario_amazon || ''}" 
                                        data-amazonpass="${cli.contrasena_amazon || ''}">
                                        <i class="bi bi-pencil-square fs-5"></i>
                                    </button>
                                    <button class="btn btn-link btn-sm p-0 text-danger btn-eliminar-cliente" data-id="${cli.id_empresa}">
                                        <i class="bi bi-trash3-fill fs-5"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                    });

                    mapearEventosClientes();

                } catch (error) {
                    tbody.innerHTML = `<tr><td colspan="6" class="text-center p-3 text-danger"><i class="bi bi-exclamation-octagon-fill"></i> Error de red: ${error.message}</td></tr>`;
                }
            };

            // ===================================================
            // MAPEO DINÁMICO DE ACCIONES (VER, EDITAR, ELIMINAR)
            // ===================================================
            const mapearEventosClientes = () => {

                // ACCIÓN: VER DETALLES COMPLETOS (ICONO EL OJO FRONT)
                document.querySelectorAll(".btn-ver-cliente").forEach(btn => {
                    btn.addEventListener("click", () => {
                        const modalVer = document.getElementById("modal-cliente-ver");
                        const contenedor = document.getElementById("ficha-cliente-contenido");

                        contenedor.innerHTML = `
                            <div class="col-6"><strong>Empresa:</strong><br>${btn.getAttribute("data-nombre")}</div>
                            <div class="col-6"><strong>Correo:</strong><br>${btn.getAttribute("data-correo")}</div>
                            <div class="col-6"><strong>Teléfono:</strong><br>${btn.getAttribute("data-telefono") || 'N/A'}</div>
                            <div class="col-6"><strong>Ciudad:</strong><br>${btn.getAttribute("data-ciudad") || 'N/A'}</div>
                            <div class="col-12"><strong>Dirección:</strong><br>${btn.getAttribute("data-direccion") || 'N/A'}</div>
                            <div class="col-12"><strong>Tipología:</strong><br><span class="badge bg-info text-dark">${btn.getAttribute("data-tipologia")}</span></div>
                            <div class="col-12 mt-2 p-2 rounded border bg-light">
                                <span class="fw-bold text-dark"><i class="bi bi-amazon"></i> Conexión Amazon Market:</span>
                                <div class="mt-1"><strong>Usuario Vendor:</strong> ${btn.getAttribute("data-amazonuser") || 'No configurado'}</div>
                                <div><strong>Contraseña Access:</strong> ${btn.getAttribute("data-amazonpass") || 'No configurado'}</div>
                            </div>
                        `;
                        if (modalVer) modalVer.style.display = "flex";
                    });
                });

                // ACCIÓN: MONTAR DATOS EN EL FORMULARIO PARA EDITAR
                document.querySelectorAll(".btn-editar-cliente").forEach(btn => {
                    btn.addEventListener("click", () => {
                        clienteEditandoId = btn.getAttribute("data-id");
                        document.getElementById("modal-cliente-titulo").innerHTML = `<i class="bi bi-pencil-square me-2"></i> Actualizar Registro de Cliente`;
                        document.getElementById("btn-guardar-cliente").innerText = "Actualizar Cliente";

                        document.getElementById("cli-nombre").value = btn.getAttribute("data-nombre");
                        document.getElementById("cli-correo").value = btn.getAttribute("data-correo");
                        document.getElementById("cli-telefono").value = btn.getAttribute("data-telefono");
                        document.getElementById("cli-ciudad").value = btn.getAttribute("data-ciudad");
                        document.getElementById("cli-tipologia").value = btn.getAttribute("data-tipologia");
                        document.getElementById("cli-direccion").value = btn.getAttribute("data-direccion");
                        document.getElementById("cli-amz-user").value = btn.getAttribute("data-amazonuser");
                        document.getElementById("cli-amz-pass").value = btn.getAttribute("data-amazonpass");

                        document.getElementById("modal-cliente-form").style.display = "flex";
                    });
                });

                // ACCIÓN: REUTILIZAR EL MODAL ESTILO STANDAR DE ELIMINACIÓN
                document.querySelectorAll(".btn-eliminar-cliente").forEach(btn => {
                    btn.addEventListener("click", () => {
                        const idDel = btn.getAttribute("data-id");
                        const modalDelGlobal = document.getElementById("modal-usuario-delete-confirm");

                        if (modalDelGlobal) {
                            modalDelGlobal.style.display = "flex";
                            document.getElementById("btn-delete-user-cancelar").onclick = () => modalDelGlobal.style.display = "none";
                            document.getElementById("btn-delete-user-confirmar").onclick = async () => {
                                modalDelGlobal.style.display = "none";
                                const alertBox = document.getElementById("cliente-alert-container");
                                try {
                                    const tokenActual = localStorage.getItem("token");
                                    const delResponse = await fetch(`http://127.0.0.1:8000/clients/${idDel}`, {
                                        method: "DELETE",
                                        headers: { "Authorization": `Bearer ${tokenActual}` }
                                    });

                                    if (!delResponse.ok) {
                                        if (alertBox) alertBox.innerHTML = `<div class="alert alert-danger small py-2">Error: No se pudo eliminar de la base de datos.</div>`;
                                        return;
                                    }

                                    await cargarTablaClientes();
                                    if (alertBox) alertBox.innerHTML = `<div class="alert alert-success small py-2">Empresa eliminada del sistema con éxito.</div>`;
                                } catch (err) {
                                    if (alertBox) alertBox.innerHTML = `<div class="alert alert-danger small py-2">Error: ${err.message}</div>`;
                                }
                            };
                        }
                    });
                });
            };

            // ===================================================
            // CONTROL DE MODALES Y COMPORTAMIENTO INTERNO
            // ===================================================
            const modalForm = document.getElementById("modal-cliente-form");
            const modalVerFicha = document.getElementById("modal-cliente-ver");
            const btnAbrir = document.getElementById("btn-abrir-modal-cliente");
            const btnCerrarForm = document.getElementById("btn-cerrar-modal-cliente");
            const btnCerrarVer = document.getElementById("btn-cerrar-modal-ver");
            const formCliente = document.getElementById("form-modal-cliente");
            const inputBuscarCli = document.getElementById("input-buscar-cliente");

            // Buscador dinámico de Clientes en caliente;
            if (inputBuscarCli) {
                inputBuscarCli.addEventListener("input", () => {
                    const val = inputBuscarCli.value.toLowerCase().trim();
                    document.querySelectorAll(".fila-cliente").forEach(row => {
                        row.style.display = row.textContent.toLowerCase().includes(val) ? "" : "none";
                    });
                });
            }

            if (btnAbrir) {
                btnAbrir.addEventListener("click", () => {
                    clienteEditandoId = null;
                    document.getElementById("modal-cliente-titulo").innerHTML = `<i class="bi bi-plus-circle-fill me-2"></i> Registrar Nuevo Cliente`;
                    document.getElementById("btn-guardar-cliente").innerText = "Guardar en Postgres";
                    if (formCliente) formCliente.reset();
                    if (modalForm) modalForm.style.display = "flex";
                });
            }

            if (btnCerrarForm) btnCerrarForm.addEventListener("click", () => { modalForm.style.display = "none"; });
            if (btnCerrarVer) btnCerrarVer.addEventListener("click", () => { modalVerFicha.style.display = "none"; });

            // ===================================================
            // ESCUCHADOR SUBMIT: ENVIAR TRANSACCIÓN (CREATE / UPDATE)
            // ===================================================
            if (formCliente) {
                formCliente.addEventListener("submit", async (eventSubmit) => {
                    eventSubmit.preventDefault();
                    const btnSubmit = document.getElementById("btn-guardar-cliente");
                    btnSubmit.disabled = true;

                    try {
                        const tokenActual = localStorage.getItem("token");
                        let url = "http://127.0.0.1:8000/clients/";
                        let method = "POST";

                        // Si tenemos un ID cargado, conmutamos automáticamente a actualizar (PUT)
                        if (clienteEditandoId !== null) {
                            url = `http://127.0.0.1:8000/clients/${clienteEditandoId}`;
                            method = "PUT";
                        }

                        const response = await fetch(url, {
                            method: method,
                            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenActual}` },
                            body: JSON.stringify({
                                nombre_empresa: document.getElementById("cli-nombre").value.trim(),
                                correo_empresa: document.getElementById("cli-correo").value.trim(),
                                telefono: document.getElementById("cli-telefono").value.trim(),
                                ciudad: document.getElementById("cli-ciudad").value.trim(),
                                tipologia: document.getElementById("cli-tipologia").value,
                                direccion: document.getElementById("cli-direccion").value.trim(),
                                usuario_amazon: document.getElementById("cli-amz-user").value.trim(),
                                contrasena_amazon: document.getElementById("cli-amz-pass").value.trim()
                            })
                        });

                        if (!response.ok) {
                            alert("Error: Transacción rechazada por el servidor.");
                            btnSubmit.disabled = false;
                            return;
                        }

                        if (modalForm) modalForm.style.display = "none";
                        await cargarTablaClientes();

                    } catch (error) {
                        alert("Error en la conexión: " + error.message);
                    } finally {
                        btnSubmit.disabled = false;
                    }
                });
            }

            // Ejecución inicial automática al entrar a la sección;
            await cargarTablaClientes();
        });
    }

    // ===================================================
    // 8. MÓDULO GESTIÓN DE MARCAS (CON AVISO Y DELETE OK)
    // ===================================================
    if (btnCrearMarca && mainContent) {
        btnCrearMarca.addEventListener("click", async (e) => {
            e.preventDefault();
            desmarcarEnlaces();
            btnCrearMarca.classList.add("active");

            mainContent.innerHTML = `
                <div class="w-100 align-self-start bg-white p-4 rounded shadow-sm">
                    <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                        <h4 style="color: #1F3A5F; margin: 0;"><i class="bi bi-tags-fill me-2"></i> Control y Registro de Marcas</h4>
                        <button class="btn btn-sm text-white fw-bold" id="btn-abrir-modal-marca" style="background-color: #F57C00;">
                            <i class="bi bi-plus-circle-fill me-1"></i> + Registrar Nueva Marca
                        </button>
                    </div>

                    <div class="row g-2 mb-3">
                        <div class="col-md-6 col-lg-4">
                            <div class="input-group input-group-sm">
                                <span class="input-group-text bg-light text-muted"><i class="bi bi-search"></i></span>
                                <input type="text" id="input-buscar-marca" class="form-control" placeholder="Filtrar por Marca o Empresa...">
                            </div>
                        </div>
                    </div>
                    
                    <div id="marca-alert-container"></div>

                    <div class="table-responsive">
                        <table class="table table-hover table-sm align-middle" style="font-size: 0.9rem;" id="tabla-marcas">
                            <thead style="background-color: #1F3A5F; color: white;">
                                <tr>
                                    <th class="p-2">ID</th>
                                    <th class="p-2">Nombre de la Marca</th>
                                    <th class="p-2">Cliente / Empresa Propietaria</th>
                                    <th class="p-2 text-center" style="width: 150px;">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tabla-marcas-body">
                                <tr><td colspan="4" class="text-center p-3 text-muted">Conectando a PostgreSQL...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="modal-marca-form" style="display: none; position: fixed; z-index: 1050; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); justify-content: center; align-items: center;">
                    <div class="bg-white p-4 rounded shadow-lg" style="width: 100%; max-width: 450px;">
                        <h5 style="color: #1F3A5F;" class="border-bottom pb-2 mb-3" id="modal-marca-titulo">
                            <i class="bi bi-tag-fill me-2 text-warning"></i> Registrar Nueva Marca
                        </h5>
                        <form id="form-modal-marca">
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small mb-1">Nombre de la Marca *</label>
                                <input type="text" class="form-control form-control-sm" id="mrc-nombre" required placeholder="Ej. StarProdutx Premium">
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small mb-1">Cliente Propietario (Empresa) *</label>
                                <select class="form-select form-select-sm" id="mrc-id-empresa" required>
                                    <option value="" disabled selected>Cargando empresas asociadas...</option>
                                </select>
                            </div>
                            <div class="d-flex gap-2 mt-4">
                                <button type="button" class="btn btn-sm btn-secondary w-50" id="btn-cerrar-modal-marca">Cancelar</button>
                                <button type="submit" class="btn btn-sm text-white fw-bold w-50" id="btn-guardar-marca" style="background-color: #F57C00;">Guardar Marca</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;

            let marcaEditandoId = null;

            const cargarSelectClientes = async (idSeleccionado = null) => {
                const selectCliente = document.getElementById("mrc-id-empresa");
                if (!selectCliente) return;

                try {
                    const tokenActual = localStorage.getItem("token");
                    const response = await fetch("http://127.0.0.1:8000/clients/", {
                        method: "GET",
                        headers: { "Authorization": `Bearer ${tokenActual}` }
                    });

                    if (response.ok) {
                        const clientes = await response.json();
                        selectCliente.innerHTML = '<option value="" disabled selected>-- Seleccione la Empresa Owner --</option>';

                        clientes.forEach(cli => {
                            selectCliente.innerHTML += `<option value="${cli.id_empresa}">${cli.nombre_empresa}</option>`;
                        });

                        if (idSeleccionado) {
                            selectCliente.value = idSeleccionado;
                        }
                    }
                } catch (error) {
                    selectCliente.innerHTML = '<option value="" disabled>Error de red al conectar con clientes</option>';
                }
            };

            const cargarTablaMarcas = async () => {
                const tbody = document.getElementById("tabla-marcas-body");
                if (!tbody) return;

                try {
                    const tokenActual = localStorage.getItem("token");
                    const response = await fetch("http://127.0.0.1:8000/brands/", {
                        method: "GET",
                        headers: { "Authorization": `Bearer ${tokenActual}` }
                    });

                    if (!response.ok) {
                        tbody.innerHTML = `<tr><td colspan="4" class="text-center p-3 text-danger"><i class="bi bi-exclamation-octagon-fill"></i> Error al recuperar registros de marcas.</td></tr>`;
                        return;
                    }

                    const marcas = await response.json();
                    tbody.innerHTML = "";

                    if (marcas.length === 0) {
                        tbody.innerHTML = `<tr><td colspan="4" class="text-center p-3 text-muted">No existen marcas registradas en el sistema.</td></tr>`;
                        return;
                    }

                    marcas.forEach(m => {
                        tbody.innerHTML += `
                            <tr class="fila-marca">
                                <td class="p-2 text-muted fw-bold">${m.id_marca}</td>
                                <td class="p-2 fw-semibold">${m.nombre_marca}</td>
                                <td class="p-2"><span class="badge bg-dark">${m.nombre_empresa}</span></td>
                                <td class="p-2 text-center">
                                    <button class="btn btn-link btn-sm p-0 me-2 text-primary btn-editar-marca" 
                                        data-id="${m.id_marca}" data-nombre="${m.nombre_marca}" data-idempresa="${m.id_empresa}">
                                        <i class="bi bi-pencil-square fs-5"></i>
                                    </button>
                                    <button class="btn btn-link btn-sm p-0 text-danger btn-eliminar-marca" data-id="${m.id_marca}">
                                        <i class="bi bi-trash3-fill fs-5"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                    });

                    mapearEventosMarcas();

                } catch (error) {
                    tbody.innerHTML = `<tr><td colspan="4" class="text-center p-3 text-danger"><i class="bi bi-exclamation-octagon-fill"></i> Error de red: ${error.message}</td></tr>`;
                }
            };

            const mapearEventosMarcas = () => {
                //  EDITAR MARCA
                document.querySelectorAll(".btn-editar-marca").forEach(btn => {
                    btn.addEventListener("click", async () => {
                        marcaEditandoId = btn.getAttribute("data-id");
                        document.getElementById("modal-marca-titulo").innerHTML = `<i class="bi bi-pencil-square me-2"></i> Actualizar Registro de Marca`;
                        document.getElementById("btn-guardar-marca").innerText = "Actualizar Marca";

                        document.getElementById("mrc-nombre").value = btn.getAttribute("data-nombre");

                        if (modalFormMarca) modalFormMarca.style.display = "flex";
                        await cargarSelectClientes(btn.getAttribute("data-idempresa"));
                    });
                });

                // ELIMINAR MARCA
                document.querySelectorAll(".btn-eliminar-marca").forEach(btn => {
                    btn.addEventListener("click", () => {
                        const idDel = btn.getAttribute("data-id");
                        const modalDelGlobal = document.getElementById("modal-usuario-delete-confirm");

                        if (modalDelGlobal) {
                            modalDelGlobal.style.display = "flex";
                            document.getElementById("btn-delete-user-cancelar").onclick = () => modalDelGlobal.style.display = "none";
                            document.getElementById("btn-delete-user-confirmar").onclick = async () => {
                                modalDelGlobal.style.display = "none";
                                const alertBox = document.getElementById("marca-alert-container");
                                try {
                                    const tokenActual = localStorage.getItem("token");
                                    const delResponse = await fetch(`http://127.0.0.1:8000/brands/${idDel}`, {
                                        method: "DELETE",
                                        headers: { "Authorization": `Bearer ${tokenActual}` }
                                    });

                                    if (!delResponse.ok) {
                                        if (alertBox) alertBox.innerHTML = `<div class="alert alert-danger small py-2">Error: No se pudo eliminar de la base de datos.</div>`;
                                        return;
                                    }

                                    await cargarTablaMarcas();
                                    if (alertBox) alertBox.innerHTML = `<div class="alert alert-success small py-2">Marca eliminada del catálogo con éxito.</div>`;

                                } catch (err) {
                                    if (alertBox) alertBox.innerHTML = `<div class="alert alert-danger small py-2">Error de red.</div>`;
                                }
                            };
                        }
                    });
                });
            };

            const modalFormMarca = document.getElementById("modal-marca-form");
            const btnAbrirMarca = document.getElementById("btn-abrir-modal-marca");
            const btnCerrarFormMarca = document.getElementById("btn-cerrar-modal-marca");
            const formMarca = document.getElementById("form-modal-marca");
            const inputBuscarMrc = document.getElementById("input-buscar-marca");

            if (inputBuscarMrc) {
                inputBuscarMrc.addEventListener("input", () => {
                    const val = inputBuscarMrc.value.toLowerCase().trim();
                    document.querySelectorAll(".fila-marca").forEach(row => {
                        row.style.display = row.textContent.toLowerCase().includes(val) ? "" : "none";
                    });
                });
            }

            if (btnAbrirMarca) {
                btnAbrirMarca.addEventListener("click", async () => {
                    marcaEditandoId = null;
                    document.getElementById("modal-marca-titulo").innerHTML = `<i class="bi bi-plus-circle-fill me-2"></i> Registrar Nueva Marca`;
                    document.getElementById("btn-guardar-marca").innerText = "Guardar Marca";
                    if (formMarca) formMarca.reset();
                    if (modalFormMarca) modalFormMarca.style.display = "flex";
                    await cargarSelectClientes();
                });
            }

            if (btnCerrarFormMarca) btnCerrarFormMarca.addEventListener("click", () => { modalFormMarca.style.display = "none"; });

            if (formMarca) {
                formMarca.addEventListener("submit", async (eventSubmit) => {
                    eventSubmit.preventDefault();
                    const btnSubmit = document.getElementById("btn-guardar-marca");
                    btnSubmit.disabled = true;

                    try {
                        const tokenActual = localStorage.getItem("token");
                        let url = "http://127.0.0.1:8000/brands/";
                        let method = "POST";
                        let mensajeAlerta = "Nueva marca registrada con éxito en el catálogo.";

                        if (marcaEditandoId !== null) {
                            url = `http://127.0.0.1:8000/brands/${marcaEditandoId}`;
                            method = "PUT";
                            mensajeAlerta = "Registro de marca actualizado correctamente.";
                        }

                        const response = await fetch(url, {
                            method: method,
                            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenActual}` },
                            body: JSON.stringify({
                                nombre_marca: document.getElementById("mrc-nombre").value.trim(),
                                id_empresa: parseInt(document.getElementById("mrc-id-empresa").value)
                            })
                        });

                        if (!response.ok) {
                            alert("Error: Transacción denegada por el servidor.");
                            btnSubmit.disabled = false;
                            return;
                        }

                        if (modalFormMarca) modalFormMarca.style.display = "none";
                        await cargarTablaMarcas();

                        const alertBox = document.getElementById("marca-alert-container");
                        if (alertBox) {
                            alertBox.innerHTML = `<div class="alert alert-success small py-2">${mensajeAlerta}</div>`;
                        }

                    } catch (error) {
                        alert("Error de conexión: " + error.message);
                    } finally {
                        btnSubmit.disabled = false;
                    }
                });
            }

            await cargarTablaMarcas();
        });
    }

    // ============================================================================
// 9. MÓDULO GESTIÓN DE PRODUCTOS (COMPLETO - ADAPTADO SIN ROMPER DEPENDENCIAS)
// ============================================================================
    (function() {
        // 1. Blindaje de dependencias globales (Se adaptan automáticamente a tus variables existentes)
        const btnCrearProducto = document.getElementById("btn-crear-producto");
        const mainContent = document.getElementById("main-content-area") || window.mainContent;
        const desmarcarEnlaces = typeof window.desmarcarEnlaces === "function" ? window.desmarcarEnlaces : function() {
            document.querySelectorAll(".sidebar-link").forEach(link => link.classList.remove("active"));
        };

        if (btnCrearProducto && mainContent) {
            btnCrearProducto.addEventListener("click", async (e) => {
                e.preventDefault();
                desmarcarEnlaces();
                btnCrearProducto.classList.add("active");

                // 1. Inyección de la interfaz principal y los modales integrados
                mainContent.innerHTML = `
                <div class="w-100 align-self-start bg-white p-4 rounded shadow-sm">
                    <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                        <h4 style="color: #1F3A5F; margin: 0;"><i class="bi bi-box-seam-fill me-2"></i> Catálogo y Registro de Productos</h4>
                        <button class="btn btn-sm text-white fw-bold" id="btn-abrir-modal-producto" style="background-color: #F57C00;">
                            <i class="bi bi-plus-circle-fill me-1"></i> + Registrar Nuevo Producto
                        </button>
                    </div>

                    <div class="row g-2 mb-3">
                        <div class="col-md-6 col-lg-4">
                            <div class="input-group input-group-sm">
                                <span class="input-group-text bg-light text-muted"><i class="bi bi-search"></i></span>
                                <input type="text" id="input-buscar-producto" class="form-control" placeholder="Buscar por Nombre, ID o Marca...">
                            </div>
                        </div>
                    </div>
                    
                    <div id="producto-alert-container"></div>

                    <div class="table-responsive">
                        <table class="table table-hover table-sm align-middle" style="font-size: 0.9rem;" id="tabla-productos">
                            <thead style="background-color: #1F3A5F; color: white;">
                                <tr>
                                    <th class="p-2">ID</th>
                                    <th class="p-2">Nombre del Producto</th>
                                    <th class="p-2">Costo ($)</th>
                                    <th class="p-2">Marca Vinculada</th>
                                    <th class="p-2 text-center" style="width: 150px;">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tabla-productos-body">
                                <tr><td colspan="5" class="text-center p-3 text-muted">Conectando a PostgreSQL...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="modal-producto-ver" style="display: none; position: fixed; z-index: 1050; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); justify-content: center; align-items: center;">
                    <div class="bg-white p-4 rounded shadow-lg" style="width: 100%; max-width: 550px;">
                        <h5 style="color: #1F3A5F;" class="border-bottom pb-2 mb-3">
                            <i class="bi bi-eye-fill me-2 text-success"></i> Detalle Técnico del Producto
                        </h5>
                        <div class="row g-3 text-start small" id="ficha-producto-contenido"></div>
                        <div class="text-end mt-4 border-top pt-2">
                            <button type="button" class="btn btn-sm btn-secondary" id="btn-cerrar-modal-prod-ver">Cerrar Ficha</button>
                        </div>
                    </div>
                </div>

                <div id="modal-producto-form" style="display: none; position: fixed; z-index: 1050; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); justify-content: center; align-items: center;">
                    <div class="bg-white p-4 rounded shadow-lg" style="width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto;">
                        <h5 style="color: #1F3A5F;" class="border-bottom pb-2 mb-3" id="modal-producto-titulo">
                            <i class="bi bi-box-seam-fill me-2 text-warning"></i> Registrar Nuevo Producto
                        </h5>
                        <form id="form-modal-producto">
                            <div class="row g-2">
                                <div class="col-md-12 mb-2">
                                    <label class="form-label fw-semibold text-secondary small mb-1">Nombre del Producto *</label>
                                    <input type="text" class="form-control form-control-sm" id="prod-nombre" required placeholder="Ej. Amazon Echo Dot 5th Gen">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label class="form-label fw-semibold text-secondary small mb-1">Costo Base ($) *</label>
                                    <input type="number" step="0.01" class="form-control form-control-sm" id="prod-costo" required placeholder="0.00">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label class="form-label fw-semibold text-secondary small mb-1 font-monospace">Marca Asociada *</label>
                                    <select class="form-select form-select-sm" id="prod-id-marca" required>
                                        <option value="" disabled selected>Cargando marcas del sistema...</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label class="form-label fw-semibold text-secondary small mb-1">Tipo de Envío</label>
                                    <input type="text" class="form-control form-control-sm" id="prod-envio" placeholder="Ej. FBA / Terrestre">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label class="form-label fw-semibold text-secondary small mb-1">Costo de Envío ($)</label>
                                    <input type="number" step="0.01" class="form-control form-control-sm" id="prod-costo-envio" placeholder="0.00">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label class="form-label fw-semibold text-secondary small mb-1">Calificación Inicial (Rating)</label>
                                    <input type="number" step="0.1" min="0" max="5" class="form-control form-control-sm" id="prod-calificacion" placeholder="Ej. 4.5">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label class="form-label fw-semibold text-secondary small mb-1">Fecha de Lanzamiento</label>
                                    <input type="date" class="form-control form-control-sm" id="prod-lanzamiento">
                                </div>
                                <div class="col-12 mb-2">
                                    <label class="form-label fw-semibold text-secondary small mb-1">URL de la Imagen del Producto</label>
                                    <input type="url" class="form-control form-control-sm" id="prod-imagen" placeholder="https://ejemplo.com/imagen.jpg">
                                </div>
                                <div class="col-12 mb-2">
                                    <label class="form-label fw-semibold text-secondary small mb-1">Descripción Comercial</label>
                                    <textarea class="form-control form-control-sm" id="prod-descripcion" rows="3" placeholder="Detalles técnicos y especificaciones para STARPRODUTX..."></textarea>
                                </div>
                            </div>
                            <div class="d-flex gap-2 mt-4">
                                <button type="button" class="btn btn-sm btn-secondary w-50" id="btn-cerrar-modal-producto">Cancelar</button>
                                <button type="submit" class="btn btn-sm text-white fw-bold w-50" id="btn-guardar-producto" style="background-color: #F57C00;">Guardar Producto</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;

                let productoEditandoId = null;

                // ===================================================
                // SELECT DINÁMICO: CARGAR MARCAS DESDE POSTGRES
                // ===================================================
                const cargarSelectMarcas = async (idSeleccionado = null) => {
                    const selectMarca = document.getElementById("prod-id-marca");
                    if (!selectMarca) return;

                    try {
                        const tokenActual = localStorage.getItem("token");
                        const response = await fetch("http://127.0.0.1:8000/brands/", {
                            method: "GET",
                            headers: { "Authorization": `Bearer ${tokenActual}` }
                        });

                        if (response.ok) {
                            const marcas = await response.json();
                            selectMarca.innerHTML = '<option value="" disabled selected>-- Seleccione la Marca --</option>';

                            marcas.forEach(m => {
                                selectMarca.innerHTML += `<option value="${m.id_marca}">${m.nombre_marca} (${m.nombre_empresa})</option>`;
                            });

                            if (idSeleccionado) {
                                selectMarca.value = idSeleccionado;
                            }
                        }
                    } catch (error) {
                        selectMarca.innerHTML = '<option value="" disabled>Error al enlazar catálogo de marcas</option>';
                    }
                };

                // ===================================================
                // READ: CONSUMIR API PARA LLENAR LA TABLA DE PRODUCTOS
                // ===================================================
                const cargarTablaProductos = async () => {
                    const tbody = document.getElementById("tabla-productos-body");
                    if (!tbody) return;

                    try {
                        const tokenActual = localStorage.getItem("token");
                        const response = await fetch("http://127.0.0.1:8000/products/", {
                            method: "GET",
                            headers: { "Authorization": `Bearer ${tokenActual}` }
                        });

                        if (!response.ok) {
                            tbody.innerHTML = `<tr><td colspan="5" class="text-center p-3 text-danger"><i class="bi bi-exclamation-octagon-fill"></i> Error al recuperar registros de productos.</td></tr>`;
                            return;
                        }

                        const productos = await response.json();
                        tbody.innerHTML = "";

                        if (productos.length === 0) {
                            tbody.innerHTML = `<tr><td colspan="5" class="text-center p-3 text-muted">No existen productos registrados en el sistema.</td></tr>`;
                            return;
                        }

                        productos.forEach(p => {
                            tbody.innerHTML += `
                            <tr class="fila-producto">
                                <td class="p-2 text-muted fw-bold">${p.id_producto}</td>
                                <td class="p-2 fw-semibold">${p.nombre_producto}</td>
                                <td class="p-2 text-success fw-bold">$ ${p.costo_producto !== null ? p.costo_producto.toFixed(2) : '0.00'}</td>
                                <td class="p-2"><span class="badge bg-primary">${p.nombre_marca}</span></td>
                                <td class="p-2 text-center">
                                    <button class="btn btn-link btn-sm p-0 me-2 text-success btn-ver-producto" 
                                        data-nombre="${p.nombre_producto}" data-costo="${p.costo_producto || '0'}"
                                        data-marca="${p.nombre_marca}" data-envio="${p.envio_producto || 'N/A'}"
                                        data-costoenvio="${p.costo_envio || '0'}" data-rating="${p.calificacion || 'Sin calificar'}"
                                        data-lanzamiento="${p.lanzamiento || 'N/A'}" data-img="${p.imagen_url || ''}"
                                        data-desc="${p.descripcion_producto || 'Sin descripción comercial.'}">
                                        <i class="bi bi-eye-fill fs-5"></i>
                                    </button>
                                    <button class="btn btn-link btn-sm p-0 me-2 text-primary btn-editar-producto" 
                                        data-id="${p.id_producto}" data-nombre="${p.nombre_producto}" data-costo="${p.costo_producto || ''}"
                                        data-marca="${p.id_marca}" data-envio="${p.envio_producto || ''}" data-costoenvio="${p.costo_envio || ''}"
                                        data-rating="${p.calificacion || ''}" data-lanzamiento="${p.lanzamiento || ''}" 
                                        data-img="${p.imagen_url || ''}" data-desc="${p.descripcion_producto || ''}">
                                        <i class="bi bi-pencil-square fs-5"></i>
                                    </button>
                                    <button class="btn btn-link btn-sm p-0 text-danger btn-eliminar-producto" data-id="${p.id_producto}">
                                        <i class="bi bi-trash3-fill fs-5"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                        });

                        mapearEventosProductos();

                    } catch (error) {
                        tbody.innerHTML = `<tr><td colspan="5" class="text-center p-3 text-danger"><i class="bi bi-exclamation-octagon-fill"></i> Error de red: ${error.message}</td></tr>`;
                    }
                };

                // ===================================================
                // MAPEO DE ACCIONES: ACCIÓN ICONO OJO -> EDITAR Y ELIMINAR
                // ===================================================
                const mapearEventosProductos = () => {

                    // 👁️ VER DETALLE COMPLETO (EL OJO)
                    document.querySelectorAll(".btn-ver-producto").forEach(btn => {
                        btn.addEventListener("click", () => {
                            const modalVer = document.getElementById("modal-producto-ver");
                            const contenedor = document.getElementById("ficha-producto-contenido");
                            const imgUrl = btn.getAttribute("data-img");

                            let imagenHTML = `<div class="text-center p-2 border rounded bg-light text-muted small"><i class="bi bi-image me-1"></i> Sin imagen cargada</div>`;
                            if (imgUrl && imgUrl.trim() !== "") {
                                imagenHTML = `<img src="${imgUrl}" class="img-fluid rounded border shadow-sm mx-auto d-block" style="max-height: 140px; object-fit: contain;" onerror="this.src='https://placehold.co/150?text=Error+Link'">`;
                            }

                            contenedor.innerHTML = `
                            <div class="col-md-4 text-center border-end d-flex align-items-center justify-content-center">
                                ${imagenHTML}
                            </div>
                            <div class="col-md-8 row g-2">
                                <div class="col-12"><strong>Producto:</strong> ${btn.getAttribute("data-nombre")}</div>
                                <div class="col-6"><strong>Marca:</strong> <span class="badge bg-primary">${btn.getAttribute("data-marca")}</span></div>
                                <div class="col-6"><strong>Precio Base:</strong> <span class="text-success fw-bold">$${parseFloat(btn.getAttribute("data-costo")).toFixed(2)}</span></div>
                                <div class="col-6"><strong>Tipo Envío:</strong> ${btn.getAttribute("data-envio")}</div>
                                <div class="col-6"><strong>Costo Envío:</strong> $${parseFloat(btn.getAttribute("data-costoenvio")).toFixed(2)}</div>
                                <div class="col-6"><strong>Rating:</strong> <i class="bi bi-star-fill text-warning"></i> ${btn.getAttribute("data-rating")}</div>
                                <div class="col-6"><strong>Lanzamiento:</strong> ${btn.getAttribute("data-lanzamiento")}</div>
                            </div>
                            <div class="col-12 mt-2 p-2 bg-light rounded border">
                                <strong>Descripción Comercial:</strong><br>
                                <span class="text-secondary">${btn.getAttribute("data-desc")}</span>
                            </div>
                        `;
                            if (modalVer) modalVer.style.display = "flex";
                        });
                    });

                    // ABRIR MODAL PARA EDITAR PRODUCTO
                    document.querySelectorAll(".btn-editar-producto").forEach(btn => {
                        btn.addEventListener("click", async () => {
                            productoEditandoId = btn.getAttribute("data-id");
                            document.getElementById("modal-producto-titulo").innerHTML = `<i class="bi bi-pencil-square me-2"></i> Actualizar Ficha de Producto`;
                            document.getElementById("btn-guardar-producto").innerText = "Actualizar Producto";

                            document.getElementById("prod-nombre").value = btn.getAttribute("data-nombre");
                            document.getElementById("prod-costo").value = btn.getAttribute("data-costo");
                            document.getElementById("prod-envio").value = btn.getAttribute("data-envio");
                            document.getElementById("prod-costo-envio").value = btn.getAttribute("data-costoenvio");
                            document.getElementById("prod-calificacion").value = btn.getAttribute("data-rating");
                            document.getElementById("prod-lanzamiento").value = btn.getAttribute("data-lanzamiento");
                            document.getElementById("prod-imagen").value = btn.getAttribute("data-img");
                            document.getElementById("prod-descripcion").value = btn.getAttribute("data-desc");

                            if (modalFormProd) modalFormProd.style.display = "flex";
                            await cargarSelectMarcas(btn.getAttribute("data-marca"));
                        });
                    });

                    // ELIMINAR PRODUCTO PERMANENTEMENTE
                    document.querySelectorAll(".btn-eliminar-producto").forEach(btn => {
                        btn.addEventListener("click", () => {
                            const idDel = btn.getAttribute("data-id");
                            // Usa tu modal global de borrado o un confirm por si acaso
                            const modalDelGlobal = document.getElementById("modal-usuario-delete-confirm");

                            if (modalDelGlobal) {
                                modalDelGlobal.style.display = "flex";
                                document.getElementById("btn-delete-user-cancelar").onclick = () => modalDelGlobal.style.display = "none";
                                document.getElementById("btn-delete-user-confirmar").onclick = async () => {
                                    modalDelGlobal.style.display = "none";
                                    const alertBox = document.getElementById("producto-alert-container");
                                    try {
                                        const tokenActual = localStorage.getItem("token");
                                        const delResponse = await fetch(`http://127.0.0.1:8000/products/${idDel}`, {
                                            method: "DELETE",
                                            headers: { "Authorization": `Bearer ${tokenActual}` }
                                        });

                                        if (!delResponse.ok) {
                                            if (alertBox) alertBox.innerHTML = `<div class="alert alert-danger small py-2">Error: No se pudo procesar la baja en Postgres.</div>`;
                                            return;
                                        }

                                        await cargarTablaProductos();
                                        if (alertBox) alertBox.innerHTML = `<div class="alert alert-success small py-2">Producto eliminado del inventario con éxito.</div>`;
                                    } catch (err) {
                                        if (alertBox) alertBox.innerHTML = `<div class="alert alert-danger small py-2">Error de red.</div>`;
                                    }
                                };
                            } else {
                                // Fallback de seguridad por si el modal global no se encuentra inyectado
                                if (confirm("¿Está seguro de eliminar este producto de forma permanente del inventario?")) {
                                    executeDeleteDirect(idDel);
                                }
                            }
                        });
                    });
                };

                // Función auxiliar por si no encuentra el modal global en vista actual;
                const executeDeleteDirect = async (idDel) => {
                    const alertBox = document.getElementById("producto-alert-container");
                    try {
                        const tokenActual = localStorage.getItem("token");
                        const delResponse = await fetch(`http://127.0.0.1:8000/products/${idDel}`, {
                            method: "DELETE",
                            headers: { "Authorization": `Bearer ${tokenActual}` }
                        });
                        if (delResponse.ok) {
                            await cargarTablaProductos();
                            if (alertBox) alertBox.innerHTML = `<div class="alert alert-success small py-2">Producto eliminado con éxito.</div>`;
                        }
                    } catch (e) { console.error(e); }
                };

                const modalFormProd = document.getElementById("modal-producto-form");
                const modalVerProd = document.getElementById("modal-producto-ver");
                const btnAbrirProd = document.getElementById("btn-abrir-modal-producto");
                const btnCerrarFormProd = document.getElementById("btn-cerrar-modal-producto");
                const btnCerrarVerProd = document.getElementById("btn-cerrar-modal-prod-ver");
                const formProducto = document.getElementById("form-modal-producto");
                const inputBuscarProd = document.getElementById("input-buscar-producto");

                if (inputBuscarProd) {
                    inputBuscarProd.addEventListener("input", () => {
                        const val = inputBuscarProd.value.toLowerCase().trim();
                        document.querySelectorAll(".fila-producto").forEach(row => {
                            row.style.display = row.textContent.toLowerCase().includes(val) ? "" : "none";
                        });
                    });
                }

                if (btnAbrirProd) {
                    btnAbrirProd.addEventListener("click", async () => {
                        productoEditandoId = null;
                        document.getElementById("modal-producto-titulo").innerHTML = `<i class="bi bi-plus-circle-fill me-2"></i> Registrar Nuevo Producto`;
                        document.getElementById("btn-guardar-producto").innerText = "Guardar Producto";
                        if (formProducto) formProducto.reset();
                        if (modalFormProd) modalFormProd.style.display = "flex";
                        await cargarSelectMarcas();
                    });
                }

                if (btnCerrarFormProd) btnCerrarFormProd.addEventListener("click", () => { modalFormProd.style.display = "none"; });
                if (btnCerrarVerProd) btnCerrarVerProd.addEventListener("click", () => { modalVerProd.style.display = "none"; });

                // ===================================================
                // ENVIAR FORMULARIO: POST (CREATE) / PUT (UPDATE)
                // ===================================================
                if (formProducto) {
                    formProducto.addEventListener("submit", async (eventSubmit) => {
                        eventSubmit.preventDefault();
                        const btnSubmit = document.getElementById("btn-guardar-producto");
                        btnSubmit.disabled = true;

                        try {
                            const tokenActual = localStorage.getItem("token");
                            let url = "http://127.0.0.1:8000/products/";
                            let method = "POST";
                            let mensajeAlerta = "Nuevo producto incorporado al catálogo con éxito.";

                            if (productoEditandoId !== null) {
                                url = `http://127.0.0.1:8000/products/${productoEditandoId}`;
                                method = "PUT";
                                mensajeAlerta = "Ficha técnica del producto actualizada correctamente.";
                            }

                            const costoInput = document.getElementById("prod-costo").value;
                            const costoEnvioInput = document.getElementById("prod-costo-envio").value;
                            const ratingInput = document.getElementById("prod-calificacion").value;
                            const lanzamientoInput = document.getElementById("prod-lanzamiento").value;

                            const payload = {
                                nombre_producto: document.getElementById("prod-nombre").value.trim(),
                                descripcion_producto: document.getElementById("prod-descripcion").value.trim() || null,
                                costo_producto: costoInput ? parseFloat(costoInput) : null,
                                envio_producto: document.getElementById("prod-envio").value.trim() || null,
                                costo_envio: costoEnvioInput ? parseFloat(costoEnvioInput) : null,
                                calificacion: ratingInput ? parseFloat(ratingInput) : null,
                                lanzamiento: lanzamientoInput || null,
                                imagen_url: document.getElementById("prod-imagen").value.trim() || null,
                                id_marca: parseInt(document.getElementById("prod-id-marca").value)
                            };

                            const response = await fetch(url, {
                                method: method,
                                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenActual}` },
                                body: JSON.stringify(payload)
                            });

                            if (!response.ok) {
                                alert("Error: Operación denegada por el servidor PostgreSQL.");
                                btnSubmit.disabled = false;
                                return;
                            }

                            if (modalFormProd) modalFormProd.style.display = "none";
                            await cargarTablaProductos();

                            const alertBox = document.getElementById("producto-alert-container");
                            if (alertBox) {
                                alertBox.innerHTML = `<div class="alert alert-success small py-2">${mensajeAlerta}</div>`;
                            }

                        } catch (error) {
                            alert("Error de conexión: " + error.message);
                        } finally {
                            btnSubmit.disabled = false;
                        }
                    });
                }

                await cargarTablaProductos();
            });
        }
    })();

    // ============================================================================
    // ============================================================================
// 10. MÓDULO SEGUIMIENTO DE MARCAS (VERSIÓN ROBUSTA DE EMERGENCIA - SIN DEPENDENCIAS)
// ============================================================================
    (function() {
        const btnSeguimiento = document.getElementById("btn-sub-seguimiento");
        const mainContent = document.getElementById("main-content-area");

        const desmarcarEnlaces = typeof window.desmarcarEnlaces === "function" ? window.desmarcarEnlaces : function() {
            document.querySelectorAll(".sidebar-link").forEach(link => link.classList.remove("active"));
        };

        let idMarcaSeleccionadaActual = null;

        if (btnSeguimiento && mainContent) {
            btnSeguimiento.addEventListener("click", async (e) => {
                e.preventDefault();
                desmarcarEnlaces();
                btnSeguimiento.classList.add("active");

                // 1. Inyección de Interfaz (Tabla + Modal)
                mainContent.innerHTML = `
                <div class="w-100 align-self-start bg-white p-4 rounded shadow-sm">
                    <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                        <h4 style="color: var(--azul-principal); margin: 0;">
                            <i class="bi bi-layout-text-sidebar-reverse me-2"></i> Seguimiento y Control de Marcas
                        </h4>
                        <span class="badge bg-secondary p-2">Rol: Administrador</span>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-hover align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th style="width: 10%">ID Marca</th>
                                    <th style="width: 25%">Nombre de la Marca</th>
                                    <th style="width: 15%">Tipología</th>
                                    <th style="width: 15%">% Progreso</th>
                                    <th style="width: 25%">Estado Actual</th>
                                    <th style="width: 10%" class="text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody id="tabla-tracking-body">
                                <tr><td colspan="6" class="text-center text-muted">Cargando flujos de marcas...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="modal fade" id="modalTracking" tabindex="-1" style="display: none;" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-scrollable">
                        <div class="modal-content">
                            <div class="modal-header text-white" style="background-color: var(--azul-principal);">
                                <h5 class="modal-title">
                                    <i class="bi bi-sliders me-2"></i>Hitos: <span id="modal-tracking-nombre-marca" class="fw-bold"></span>
                                </h5>
                                <button type="button" class="btn-close btn-close-white btn-cerrar-modal-track" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <span class="text-muted small">Tipología de Cliente:</span>
                                    <span id="modal-tracking-tipologia" class="badge text-white fw-bold" style="background-color: var(--azul-secundario);"></span>
                                </div>
                                <form id="form-tracking-hitos">
                                    <div id="lista-hitos-checkboxes" class="list-group list-group-flush">
                                        </div>
                                </form>
                            </div>
                            <div class="modal-footer bg-light">
                                <button type="button" class="btn btn-secondary btn-sm btn-cerrar-modal-track">Cancelar</button>
                                <button type="button" id="btn-guardar-tracking" class="btn btn-sm text-white" style="background-color: var(--naranja-principal);">
                                    <i class="bi bi-save me-1"></i>Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

                await ejecutarCargaDatos();
                configurarBotonGuardar();
                configurarBotonesCerrar();
            });
        }

        // Funciones de Control de UI Manual
        function abrirModalManual() {
            const modal = document.getElementById('modalTracking');
            if (!modal) return;
            modal.style.display = 'block';
            modal.classList.add('show');
            document.body.classList.add('modal-open');

            if (!document.getElementById('modal-backdrop-tracking')) {
                const backdrop = document.createElement('div');
                backdrop.className = 'modal-backdrop fade show';
                backdrop.id = 'modal-backdrop-tracking';
                document.body.appendChild(backdrop);
            }
        }

        function cerrarModalManual() {
            const modal = document.getElementById('modalTracking');
            if (modal) {
                modal.style.display = 'none';
                modal.classList.remove('show');
            }
            document.body.classList.remove('modal-open');
            const backdrop = document.getElementById('modal-backdrop-tracking');
            if (backdrop) backdrop.remove();
        }

        function configurarBotonesCerrar() {
            document.querySelectorAll('.btn-cerrar-modal-track').forEach(btn => {
                btn.addEventListener('click', cerrarModalManual);
            });
        }

        // 10.1 Render de la Tabla Principal
        async function ejecutarCargaDatos() {
            try {
                const tokenSeguro = localStorage.getItem("token");
                const response = await fetch("http://127.0.0.1:8000/tracking", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${tokenSeguro}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) throw new Error("Error en respuesta de servidor");
                const data = await response.json();

                const tbody = document.getElementById("tabla-tracking-body");
                if (!tbody) return;
                tbody.innerHTML = "";

                if (data.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No existen registros de seguimiento activos.</td></tr>`;
                    return;
                }

                data.forEach(item => {
                    let badgeColor = "bg-danger";
                    if (item.porcentaje_progreso >= 46 && item.porcentaje_progreso <= 80) {
                        badgeColor = "bg-warning text-dark";
                    } else if (item.porcentaje_progreso >= 81) {
                        badgeColor = "bg-success";
                    }

                    const fila = document.createElement("tr");
                    fila.innerHTML = `
                    <td><span class="fw-bold">#${item.id_marca}</span></td>
                    <td><span class="text-dark fw-semibold">${item.nombre_marca}</span></td>
                    <td><span class="badge bg-light text-dark border">${item.tipologia}</span></td>
                    <td><span class="badge ${badgeColor} px-2 py-1 fw-bold">${item.porcentaje_progreso}%</span></td>
                    <td>
                        <small class="text-secondary text-truncate d-inline-block" style="max-width: 250px;" title="${item.estado_actual}">
                            <i class="bi bi-arrow-right-circle-fill text-primary me-1"></i> ${item.estado_actual}
                        </small>
                    </td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-outline-primary py-0 px-2 btn-gestionar-track" data-id="${item.id_marca}">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                    </td>
                `;
                    tbody.appendChild(fila);
                });

                // Evento click manual para obtener datos e invocar modal;
                document.querySelectorAll(".btn-gestionar-track").forEach(btn => {
                    btn.addEventListener("click", () => {
                        const idBrand = btn.getAttribute("data-id");
                        abrirModalChecklist(idBrand);
                    });
                });

            } catch (err) {
                console.error(err);
                const tbody = document.getElementById("tabla-tracking-body");
                if (tbody) tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error de comunicación con el servidor.</td></tr>`;
            }
        }

        // 10.2 Cargar Datos de la Marca en el Modal;
        async function abrirModalChecklist(idMarca) {
            idMarcaSeleccionadaActual = idMarca;
            try {
                const tokenSeguro = localStorage.getItem("token");
                const response = await fetch(`http://127.0.0.1:8000/tracking/${idMarca}`, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${tokenSeguro}` }
                });

                if (!response.ok) throw new Error("No se pudo obtener la hoja de ruta");
                const data = await response.json();

                document.getElementById("modal-tracking-nombre-marca").textContent = data.nombre_marca;
                document.getElementById("modal-tracking-tipologia").textContent = data.tipologia;

                const boxCheckboxes = document.getElementById("lista-hitos-checkboxes");
                boxCheckboxes.innerHTML = "";

                data.hitos.forEach(hito => {
                    const itemDiv = document.createElement("div");
                    itemDiv.className = "list-group-item d-flex align-items-center py-2";
                    itemDiv.innerHTML = `
                    <input class="form-check-input me-3 tracking-cb" type="checkbox" 
                           id="cb_hito_${hito.id_hito}" 
                           data-hito-id="${hito.id_hito}"
                           ${hito.estado_completado ? 'checked' : ''}>
                    <label class="form-check-label w-100" for="cb_hito_${hito.id_hito}" style="cursor: pointer;">
                        <span class="text-muted small me-2">Fase ${hito.orden}</span>
                        <span class="${hito.estado_completado ? 'text-decoration-line-through text-muted' : 'text-dark fw-medium'}">
                            ${hito.nombre_hito}
                        </span>
                    </label>
                `;
                    boxCheckboxes.appendChild(itemDiv);
                });

                // Apertura del modal con la función segura por CSS;
                abrirModalManual();

            } catch (err) {
                console.error(err);
                alert("No se pudo cargar la hoja de ruta de la marca.");
            }
        }

        // 10.3 Guardar Cambios;
        function configurarBotonGuardar() {
            const btnGuardar = document.getElementById("btn-guardar-tracking");
            if (!btnGuardar) return;

            btnGuardar.addEventListener("click", async () => {
                if (!idMarcaSeleccionadaActual) return;

                const cbs = document.querySelectorAll(".tracking-cb");
                const payload = [];

                cbs.forEach(cb => {
                    payload.push({
                        id_hito: parseInt(cb.getAttribute("data-hito-id")),
                        estado_completado: cb.checked
                    });
                });

                try {
                    const tokenSeguro = localStorage.getItem("token");
                    const response = await fetch(`http://127.0.0.1:8000/tracking/${idMarcaSeleccionadaActual}/hitos`, {
                        method: "PATCH",
                        headers: {
                            "Authorization": `Bearer ${tokenSeguro}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) throw new Error("Error al guardar hitos");

                    cerrarModalManual();
                    await ejecutarCargaDatos();

                } catch (err) {
                    console.error(err);
                    alert("Error al actualizar los hitos del servidor.");
                }
            });
        }
    })();

    // =========================================================================
// CONTROL DE SESIÓN INACTIVA - ROL ADMINISTRADOR (45 SEGUNDOS)
// =========================================================================
    let temporizadorInactividadAdmin;

    function resetearTemporizadorAdmin() {
        clearTimeout(temporizadorInactividadAdmin);

        // 45 segundos para demostración del Admin
        temporizadorInactividadAdmin = setTimeout(() => {
            const modalElement = document.getElementById('modal-logout-corporativo');

            if (modalElement) {
                const titulo = modalElement.querySelector('#modal-logout-titulo');
                if (titulo) titulo.innerHTML = `<i class="bi bi-shield-lock-fill me-2"></i>Sesión Admin Expirada`;

                const cuerpoModal = modalElement.querySelector('#modal-logout-body');
                if (cuerpoModal) {
                    cuerpoModal.innerHTML = `
                    <i class="bi bi-exclamation-octagon text-danger d-block mb-3" style="font-size: 3rem;"></i>
                    <p class="mb-0 text-secondary fw-medium">🔒 <strong>Seguridad de Infraestructura:</strong> La sesión de administración ha sido suspendida automáticamente por acumular 45 segundos de inactividad.</p>
                `;
                }

                const footerModal = modalElement.querySelector('#modal-logout-footer');
                if (footerModal) {
                    footerModal.innerHTML = `<span class="text-muted small"><div class="spinner-border spinner-border-sm me-2"></div>Destruyendo entorno seguro...</span>`;
                }

                const modalCorporativo = new bootstrap.Modal(modalElement);
                modalCorporativo.show();
            }

            // 4 segundos de aviso antes de redirigir
            setTimeout(() => {
                localStorage.clear();
                window.location.href = "index.html";
            }, 4000);

        }, 45000);
    }

// Oyentes de eventos globales para reiniciar el conteo;
    window.onload = resetearTemporizadorAdmin;
    document.onmousemove = resetearTemporizadorAdmin;
    document.onkeypress = resetearTemporizadorAdmin;
    document.onclick = resetearTemporizadorAdmin;

// Lógica para que el botón "Cerrar Sesión" manual dentro del modal funcione;
    document.addEventListener("DOMContentLoaded", () => {
        const btnManual = document.getElementById("btn-confirmar-logout-admin-modal");
        if (btnManual) {
            btnManual.addEventListener("click", () => {
                localStorage.clear();
                window.location.href = "index.html";
            });
        }
    });

});