/* ── ESTADO GLOBAL DEL LABORATORIO ── */
/* Reemplaza el inicio de tu archivo por este (añadimos historial: []) */
let g = {
  modo: "mostrar", nivel: "2x3", nombre: "", puntos: 0, racha: 0, ejercicios: 0,
  n1: 0, n2: 0, partes1: [], partes2: [], permitirCeros: true,
  historial: [] // ➡️ AQUÍ SE GUARDARÁN LAS CUENTAS COMPLETADAS
};

/* ── SISTEMA DE GUARDADO AUTOMÁTICO INDIVIDUAL (localStorage) ── */
window.onload = function () {
  const nombreInput = document.getElementById("nombre");
  const ultimoNombre = localStorage.getItem("lab_ultimo_nombre");
  
  if (ultimoNombre) {
    nombreInput.value = ultimoNombre;
    // Cargamos el historial del último usuario inmediatamente
    actualizarHistorialEnPantallaInicio(ultimoNombre);
  }
  
  // Escuchamos en tiempo real si escriben un nombre diferente
  nombreInput.addEventListener("input", (e) => {
    const nombreActual = e.target.value.trim();
    actualizarHistorialEnPantallaInicio(nombreActual);
  });
};

function guardarProgreso() {
  const nombreInput = document.getElementById("nombre").value.trim();
  if (!nombreInput) return;

  g.nombre = nombreInput;
  
  // Guardamos TODO el estado actual, incluido el historial
  localStorage.setItem(`lab_progreso_${nombreInput}`, JSON.stringify(g));
  localStorage.setItem("lab_ultimo_nombre", nombreInput);
  
  console.log(`🔬 Progreso e historial de ${nombreInput} guardados.`);
}

function cargarProgreso(nombreEstudiante) {
  const datosGuardados = localStorage.getItem(`lab_progreso_${nombreEstudiante}`);
  
  if (datosGuardados) {
    try {
      const progresoRecuperado = JSON.parse(datosGuardados);
      
      g.puntos = progresoRecuperado.puntos || 0;
      g.racha = progresoRecuperado.racha || 0;
      g.ejercicios = progresoRecuperado.ejercicios || 0;
      g.modo = progresoRecuperado.modo || "mostrar";
      g.nivel = progresoRecuperado.nivel || "2x3";
      g.permitirCeros = progresoRecuperado.permitirCeros !== undefined ? progresoRecuperado.permitirCeros : true;
      
      // ➡️ REGLA DE SEGURIDAD: Recuperar el historial o dejarlo como array vacío si no existe
      g.historial = progresoRecuperado.historial || [];

      console.log(`🎉 Progreso e historial de ${nombreEstudiante} recuperados con éxito.`);
    } catch (e) {
      console.error("Error al leer el progreso, iniciando limpio.", e);
      resetearVariablesGlobales();
    }
  } else {
    resetearVariablesGlobales();
  }
  
  actualizarPanel();
}

function actualizarHistorialEnPantallaInicio(nombreEstudiante) {
  const bloque = document.getElementById("bloque-historial-inicio");
  const lista = document.getElementById("lista-historial-inicio");
  
  if (!nombreEstudiante) {
    bloque.style.display = "none";
    return;
  }

  // Buscamos si este estudiante tiene un registro guardado en el navegador
  const datosGuardados = localStorage.getItem(`lab_progreso_${nombreEstudiante}`);
  
  if (datosGuardados) {
    try {
      const progreso = JSON.parse(datosGuardados);
      
      // Actualizamos las pequeñas métricas del menú
      document.getElementById("ini-puntos").textContent = progreso.puntos || 0;
      document.getElementById("ini-racha").textContent = progreso.racha || 0;
      document.getElementById("ini-ejercicios").textContent = progreso.ejercicios || 0;
      
      // Rellenamos la lista de operaciones
      lista.innerHTML = "";
      if (progreso.historial && progreso.historial.length > 0) {
        progreso.historial.forEach(cuenta => {
          lista.innerHTML += `<li style="margin-bottom: 4px;">✅ ${cuenta}</li>`;
        });
      } else {
        lista.innerHTML = `<li style="color: #6b7280; list-style: none; margin-left: -20px;">Ninguna operación verificada aún.</li>`;
      }
      
      bloque.style.display = "block";
    } catch (e) {
      console.error(e);
      bloque.style.display = "none";
    }
  } else {
    // Si el usuario no existe en la base local, mostramos que es un perfil nuevo
    document.getElementById("ini-puntos").textContent = "0";
    document.getElementById("ini-racha").textContent = "0";
    document.getElementById("ini-ejercicios").textContent = "0";
    lista.innerHTML = `<li style="color: #059669; list-style: none; margin-left: -20px;">🔬 ¡Científico Nuevo detectado! Listo para comenzar.</li>`;
    bloque.style.display = "block";
  }
}

// Función auxiliar para limpiar el estado global si el alumno es nuevo
function resetearVariablesGlobales() {
  g.puntos = 0;
  g.racha = 0;
  g.ejercicios = 0;
  g.historial = []; // ➡️ Limpiamos el historial al reiniciar el laboratorio
}

function borrarProgresoLaboratorio() {
  const nombreInput = document.getElementById("nombre").value.trim();
  if (!nombreInput) return;

  if (confirm(`🔬 ¿Seguro que deseas reiniciar a cero el progreso de ${nombreInput}?`)) {
    localStorage.removeItem(`lab_progreso_${nombreInput}`);
    resetearVariablesGlobales();
    actualizarPanel();
    alert(`Progreso de ${nombreInput} reseteado con éxito.`);
  }
}

/* ── CONTROL DE INTERFAZ Y CONFIGURACIÓN ── */
function selModo(el) {
  document.querySelectorAll(".modo-btn").forEach(b => b.classList.remove("sel"));
  el.classList.add("sel");
  g.modo = el.dataset.modo;
}

function selNivel(el) {
  document.querySelectorAll(".niv-btn").forEach(b => b.classList.remove("sel"));
  el.classList.add("sel");
  g.nivel = el.dataset.nivel;
  document.getElementById("panel-manual").style.display = (g.nivel === "manual") ? "block" : "none";
}

/* ── LÓGICA MATEMÁTICA Y DESCOMPOSICIÓN ── */
function numRandomSinCeros(cifras) {
  let numStr = "";
  for(let i=0; i<cifras; i++) {
    let d = Math.floor(Math.random() * 9) + 1;
    numStr += d.toString();
  }
  return parseInt(numStr);
}

function numRandom(cifras) {
  const min = Math.pow(10, cifras - 1);
  const max = Math.pow(10, cifras) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function decompose(n) { // Mantenemos el alias si se requiere, o usamos descomponer directamente
  return descomponer(n);
}

function descomponer(n) {
  const txt = n.toString();
  const partes = [];
  for (let i = 0; i < txt.length; i++) {
    const d = parseInt(txt[i]);
    if (d !== 0) partes.push(d * Math.pow(10, txt.length - i - 1));
  }
  return partes;
}

function medalla(r) {
  if (r >= 10) return "🏆🏆"; if (r >= 7) return "🥇"; if (r >= 5) return "🥈"; if (r >= 3) return "🥉"; return "—";
}

function actualizarPanel() {
  document.getElementById("txt-puntos").textContent = g.puntos;
  document.getElementById("txt-racha").textContent = g.racha;
  document.getElementById("txt-medalla").textContent = medalla(g.racha);
  document.getElementById("txt-ejercicios").textContent = g.ejercicios;
}

/* ── FLUJO DEL JUEGO ── */
function iniciar() {
  const nombre = document.getElementById("nombre").value.trim();
  
  if (!nombre) {
    alert("Por favor, ingresa tu nombre de científico para comenzar.");
    return;
  }

  // ➡️ CARGAMOS EL PROGRESO ESPECÍFICO DE ESTE NOMBRE ANTES DE ENTRAR
  cargarProgreso(nombre);
  
  g.nombre = nombre;
  g.modo = document.querySelector(".modo-btn.sel").dataset.modo;
  g.nivel = document.querySelector(".niv-btn.sel").dataset.nivel;
  g.permitirCeros = document.getElementById("chk-ceros").checked;
  
  actualizarPanel();
  document.getElementById("pantalla-inicio").style.display = "none";
  document.getElementById("pantalla-juego").style.display = "block";
  nuevoEjercicio();
}

function volverAlMenu() {
  // Guardamos el estado actual antes de salir de la pantalla de juego
  guardarProgreso();

  document.getElementById("pantalla-juego").style.display = "none";
  document.getElementById("pantalla-inicio").style.display = "block";
  
  // Refrescamos el panel del menú de inicio
  const nombreActual = document.getElementById("nombre").value.trim();
  actualizarHistorialEnPantallaInicio(nombreActual);
}

function nuevoEjercicio() {
  document.getElementById("box-pista-id").style.display = "none";
  document.getElementById("msg").style.display = "none";
  document.getElementById("area-algoritmo").innerHTML = "";

  if (g.nivel === "manual") {
    let v1 = parseInt(document.getElementById("num-manual-1").value);
    let v2 = parseInt(document.getElementById("num-manual-2").value);
    if (isNaN(v1) || v2 < 2 || v1 < 2) {
      alert("Por favor ingresa números válidos mayores a 1.");
      volverAlMenu();
      return;
    }
    g.n1 = v1; g.n2 = v2;
  } else {
    const [c1, c2] = g.nivel === "2x2" ? [2,2] : g.nivel === "2x3" ? [2,3] : [3,3];
    if (g.permitirCeros) {
      g.n1 = numRandom(c1); g.n2 = numRandom(c2);
    } else {
      g.n1 = numRandomSinCeros(c1); g.n2 = numRandomSinCeros(c2);
    }
  }

  g.partes1 = descomponer(g.n1);
  g.partes2 = descomponer(g.n2);
  g.ejercicios++;

  // Guardado automático al avanzar de ejercicio
  guardarProgreso();

  document.getElementById("txt-operacion").textContent = `${g.n1} × ${g.n2}`;
  
  if (g.modo === "descomp") {
    document.getElementById("txt-descomp").innerHTML = `🔬 <b>¡Desafío Científico!</b> Descompón los números guía en los casilleros amarillos con <span style="color:#b45309"><b>?</b></span> para desbloquear la matriz.`;
  } else {
    document.getElementById("txt-descomp").innerHTML =
      `🔬 Descomposición activa: &nbsp;<b>${g.n1}</b> = ${g.partes1.join(" + ")} &nbsp;|&nbsp; <b>${g.n2}</b> = ${g.partes2.join(" + ")}`;
  }

  // ... (dejas intacto el inicio de nuevoEjercicio hasta el cálculo de sumasFila) ...

  // ➡️ CÁLCULOS INVERTIDOS PARA DISEÑO VERTICAL (MÓVIL)
  const sumasFila = g.partes2.map(c => g.partes1.reduce((a, f) => a + f * c, 0));
  const resultado = g.n1 * g.n2;
  const modoMostrar = g.modo === "mostrar";
  const modoDescomp = g.modo === "descomp";

  let filasHtml = "";
  
  // Generamos las filas basándonos en partes2
  g.partes2.forEach((c, ci) => {
    let celdaGuia = "";
    if (modoDescomp) {
      celdaGuia = '<th class="enc-fil"><input class="inp-celda inp-guia" type="number" data-index="' + ci + '" data-tipo="guia-fil" placeholder="?"></th>';
    } else {
      celdaGuia = '<th class="enc-fil">' + c + '</th>';
    }
      
    filasHtml += "<tr>" + celdaGuia;
    
    // Columnas internas basadas en partes1
    g.partes1.forEach(f => {
      const val = f * c;
      if (modoMostrar) {
        filasHtml += "<td>" + val + "</td>";
      } else {
        filasHtml += '<td><input class="inp-celda" type="number" data-correcto="' + val + '" data-f1="' + f + '" data-f2="' + c + '" data-tipo="prod" disabled></td>';
      }
    });
    
    const sv = sumasFila[ci];
    if (modoMostrar) {
      filasHtml += '<td class="col-suma">' + sv + '</td>';
    } else {
      filasHtml += '<td class="col-suma"><input class="inp-celda" type="number" data-correcto="' + sv + '" data-tipo="suma" style="width:90px" disabled></td>';
    }
    filasHtml += "</tr>";
  });

  // Celda final del resultado total
  let celdaResHtml = "";
  if (modoMostrar) {
    celdaResHtml = '<td class="cel-resultado">' + resultado + '</td>';
  } else {
    celdaResHtml = '<td class="cel-resultado"><input class="inp-celda" type="number" data-correcto="' + resultado + '" data-tipo="resultado" style="width:100px" disabled></td>';
  }

  // Cabeceras superiores basadas en partes1
  let cabeceraColumnasHtml = "";
  g.partes1.forEach((f, fi) => {
    if (modoDescomp) {
      cabeceraColumnasHtml += '<th class="enc-col"><input class="inp-celda inp-guia" type="number" data-index="' + fi + '" data-tipo="guia-col" placeholder="?"></th>';
    } else {
      cabeceraColumnasHtml += '<th class="enc-col">' + f + '</th>';
    }
  });

  // Generamos los espacios vacíos exactos de la última fila para no romper las columnas del HTML
  let celdasVaciasHtml = "";
  g.partes1.forEach(() => {
    celdasVaciasHtml += "<td></td>";
  });

  // Ensamblado final del HTML garantizando el cierre estricto de todas las etiquetas
  const tablaHtml = 
    '<table>' +
      '<thead>' +
        '<tr>' +
          '<th></th>' +
          cabeceraColumnasHtml +
          '<th class="enc-col" style="background:#fffdeb;color:#92400e;">Suma fila</th>' +
        '</tr>' +
      '</thead>' +
      '<tbody>' +
        filasHtml +
        '<tr class="fil-total">' +
          '<th>Total</th>' +
          celdasVaciasHtml +
          celdaResHtml +
        '</tr>' +
      '</tbody>' +
    '</table>';

  document.getElementById("area-tabla").innerHTML = tablaHtml;

  // ... (dejas intacto el resto de la función con los botones y listeners de abajo) ...

  document.getElementById("area-tabla").innerHTML = tabla;

  let bots = "";
  if (!modoMostrar) {
    bots += `<button class="btn-juego btn-verificar" onclick="verificar()">✨ Verificar Laboratorio</button>`;
    bots += `<button class="btn-juego btn-pista" onclick="darPista()">💡 Recibir Pista</button>`;
  }
  bots += `<button class="btn-juego btn-nuevo" onclick="nuevoEjercicio()">🔀 Siguiente</button>`;
  bots += `<button class="btn-juego btn-volver" onclick="volverAlMenu()">🏠 Inicio</button>`;
  bots += `<button class="btn-juego btn-exportar" onclick="exportarPDF()" style="background:#059669;color:white;">📄 Exportar Reporte</button>`;  
  document.getElementById("area-botones").innerHTML = bots;
  
  if (!modoMostrar && !modoDescomp) {
    document.querySelectorAll(".inp-celda").forEach(i => i.disabled = false);
  }

  if (modoMostrar) mostrarCuentaEscolar();
  actualizarPanel();

  if (modoDescomp) {
    const guias = document.querySelectorAll(".inp-guia");
    guias.forEach(g => g.addEventListener("input", verificarGuiasAlVuelo));
  }
}

/* ── COMPROBACIONES Y EVALUACIÓN ── */
function verificarGuiasAlVuelo() {
  const inputsFil = Array.from(document.querySelectorAll("[data-tipo='guia-fil']"));
  const inputsCol = Array.from(document.querySelectorAll("[data-tipo='guia-col']"));
  
  const valoresFil = inputsFil.map(i => i.value !== "" ? Number(i.value) : null);
  const valoresCol = inputsCol.map(i => i.value !== "" ? Number(i.value) : null);

  let ordenElegido = null;

  // Ajustado al nuevo orden vertical
  if (valoresFil[0] !== null) {
    if (valoresFil[0] === g.partes2[0]) ordenElegido = "normal";
    else if (valoresFil[0] === g.partes1[0]) ordenElegido = "invertido";
  } else if (valoresCol[0] !== null) {
    if (valoresCol[0] === g.partes1[0]) ordenElegido = "normal";
    else if (valoresCol[0] === g.partes2[0]) ordenElegido = "invertido";
  }

  let metaFil = ordenElegido === "invertido" ? g.partes1 : g.partes2;
  let metaCol = ordenElegido === "invertido" ? g.partes2 : g.partes1;

  if (ordenElegido === "invertido" && (inputsFil.length !== g.partes1.length || inputsCol.length !== g.partes2.length)) {
    ordenElegido = "normal";
    metaFil = g.partes2; metaCol = g.partes1;
  }

  if (g.n1 !== g.n2 && ordenElegido) {
    let todoIgual = valoresFil.length === valoresCol.length && valoresFil.every((v, i) => v !== null && v === valoresCol[i]);
    if (todoIgual) {
      document.getElementById("txt-descomp").innerHTML = `🔬 <span style="color:#b91c1c;"><b>¡Cuidado!</b> Estás duplicando el mismo factor. Usa ambos números.</span>`;
      inputsFil.forEach(i => { i.classList.add("incorrecto"); i.classList.remove("correcto"); });
      inputsCol.forEach(i => { i.classList.add("incorrecto"); i.classList.remove("correcto"); });
      return;
    }
  }

  inputsFil.forEach((inp, idx) => {
    let val = Number(inp.value);
    if (inp.value === "") { inp.classList.remove("correcto", "incorrecto"); return; }
    if (val === metaFil[idx]) { inp.classList.add("correcto"); inp.classList.remove("incorrecto"); }
    else { inp.classList.add("incorrecto"); inp.classList.remove("correcto"); }
  });

  inputsCol.forEach((inp, idx) => {
    let val = Number(inp.value);
    if (inp.value === "") { inp.classList.remove("correcto", "incorrecto"); return; }
    if (val === metaCol[idx]) { inp.classList.add("correcto"); inp.classList.remove("incorrecto"); }
    else { inp.classList.add("incorrecto"); inp.classList.remove("correcto"); }
  });

  let estructuraFilOk = metaFil.every((val, idx) => valoresFil[idx] === val);
  let estructuraColOk = metaCol.every((val, idx) => valoresCol[idx] === val);

  if (estructuraFilOk && estructuraColOk) {
    const prods = document.querySelectorAll("[data-tipo='prod']");
    prods.forEach(p => {
      let fVal = Number(p.closest("tr").querySelector("[data-tipo='guia-fil']").value);
      let cIndex = Array.from(p.closest("tr").querySelectorAll("[data-tipo='prod']")).indexOf(p);
      let cVal = Number(document.querySelectorAll("[data-tipo='guia-col']")[cIndex].value);
      p.dataset.correcto = fVal * cVal;
      p.disabled = false;
    });

    const sumas = document.querySelectorAll("[data-tipo='suma']");
    sumas.forEach(s => {
      let filaProds = Array.from(s.closest("tr").querySelectorAll("[data-tipo='prod']"));
      s.dataset.correcto = filaProds.reduce((acc, curr) => acc + Number(curr.dataset.correcto), 0);
      s.disabled = false;
    });

    document.querySelector("[data-tipo='resultado']").disabled = false;
    document.getElementById("txt-descomp").innerHTML = `🎉 ¡Descomposición posicional perfecta! Celdas desbloqueadas.`;
    inputsFil.forEach(i => i.disabled = true);
    inputsCol.forEach(i => i.disabled = true);
  }
}

  inputsFil.forEach((inp, idx) => {
    let val = Number(inp.value);
    if (inp.value === "") { inp.classList.remove("correcto", "incorrecto"); return; }
    if (val === metaFil[idx]) { inp.classList.add("correcto"); inp.classList.remove("incorrecto"); }
    else { inp.classList.add("incorrecto"); inp.classList.remove("correcto"); }
  });

  inputsCol.forEach((inp, idx) => {
    let val = Number(inp.value);
    if (inp.value === "") { inp.classList.remove("correcto", "incorrecto"); return; }
    if (val === metaCol[idx]) { inp.classList.add("correcto"); inp.classList.remove("incorrecto"); }
    else { inp.classList.add("incorrecto"); inp.classList.remove("correcto"); }
  });

  let estructuraFilOk = metaFil.every((val, idx) => valoresFil[idx] === val);
  let estructuraColOk = metaCol.every((val, idx) => valoresCol[idx] === val);

  if (estructuraFilOk && estructuraColOk) {
    const prods = document.querySelectorAll("[data-tipo='prod']");
    prods.forEach(p => {
      let fVal = Number(p.closest("tr").querySelector("[data-tipo='guia-fil']").value);
      let cIndex = Array.from(p.closest("tr").querySelectorAll("[data-tipo='prod']")).indexOf(p);
      let cVal = Number(document.querySelectorAll("[data-tipo='guia-col']")[cIndex].value);
      p.dataset.correcto = fVal * cVal;
      p.disabled = false;
    });

    const sumas = document.querySelectorAll("[data-tipo='suma']");
    sumas.forEach(s => {
      let filaProds = Array.from(s.closest("tr").querySelectorAll("[data-tipo='prod']"));
      s.dataset.correcto = filaProds.reduce((acc, curr) => acc + Number(curr.dataset.correcto), 0);
      s.disabled = false;
    });

    document.querySelector("[data-tipo='resultado']").disabled = false;
    document.getElementById("txt-descomp").innerHTML = `🎉 ¡Descomposición posicional perfecta! Celdas desbloqueadas.`;
    inputsFil.forEach(i => i.disabled = true);
    inputsCol.forEach(i => i.disabled = true);
  }
}

function darPista() {
  reproducirSonido('pista');
  const inputs = document.querySelectorAll(".inp-celda");
  let vacio = null;
  for (let inp of inputs) { if (inp.value === "" && !inp.disabled) { vacio = inp; break; } }
  if (!vacio) vacio = document.querySelector(".inp-guia[value='']");
  
  const boxPista = document.getElementById("box-pista-id");
  if (!vacio) {
    boxPista.textContent = "¡Todas las celdas están completas! Haz clic en Verificar.";
    boxPista.style.display = "block"; return;
  }

  const tipo = vacio.dataset.tipo;
  if (tipo === "guia-fil" || tipo === "guia-col") {
    boxPista.innerHTML = `💡 <b>Pista:</b> Escribe las descomposiciones en estricto orden de valor posicional (centenas, decenas, unidades).`;
  } else if (tipo === "prod") {
    boxPista.innerHTML = `💡 <b>Pista:</b> Multiplica la guía de su fila por la guía de su columna.`;
  } else if (tipo === "suma") {
    boxPista.innerHTML = `💡 <b>Pista:</b> Suma los números de los casilleros blancos de esta línea horizontal.`;
  } else {
    boxPista.innerHTML = `💡 <b>Pista Final:</b> Suma verticalmente toda la columna de "Suma fila".`;
  }
  boxPista.style.display = "block";
}

function verificar() {
  const inputs = document.querySelectorAll(".inp-celda");
  let errores = 0; let puntosGanados = 0;

  inputs.forEach(inp => {
    if (inp.dataset.tipo.startsWith("guia") && inp.disabled) { puntosGanados += 5; return; }
    const correcto = Number(inp.dataset.correcto);
    const val = Number(inp.value);
    
    inp.classList.remove("correcto","incorrecto");
    void inp.offsetWidth; 

    if (inp.value === "" || val !== correcto) {
      inp.classList.add("incorrecto"); errores++;
    } else {
      inp.classList.add("correcto"); puntosGanados += 10;
    }
  });

  const msg = document.getElementById("msg");
  if (errores === 0) {
    reproducirSonido('exito');
    let bonusModo = g.modo === "descomp" ? 80 : 50; 
    g.puntos += puntosGanados + bonusModo; g.racha++;
    actualizarPanel();

    const el = document.getElementById("txt-puntos");
    el.classList.add("pop-score");
    el.addEventListener("animationend", () => el.classList.remove("pop-score"), {once:true});

    msg.className = "mensaje ok";
    msg.textContent = `🎉 ¡Excelente Experimento! Todo correcto. Recibiste +${puntosGanados + bonusModo} puntos.`;
    msg.style.display = "block";
    inputs.forEach(i => i.disabled = true);
    
    mostrarCuentaEscolar();
    lanzarConfeti(); 
    
    // ➡️ REGISTRAR EN EL HISTORIAL (Añade estas líneas aquí)
  const operacionActual = `${g.n1} × ${g.n2} = ${g.n1 * g.n2}`;
  g.historial.push(operacionActual);

  // Guardado automático al resolver con éxito
  guardarProgreso();
  } else {
    reproducirSonido('error');
    g.racha = 0; 
    actualizarPanel();
    
    // Guardado automático tras perder la racha
    guardarProgreso();

    msg.className = "mensaje err";
    msg.textContent = `🔬 Se encontraron ${errores} anomalías (en rojo). ¡A revisarlas!`;
    msg.style.display = "block";
  }
}

function mostrarCuentaEscolar() {
  const arriba = Math.max(g.n1, g.n2); const abajo = Math.min(g.n1, g.n2);
  const total = arriba * abajo; const strAbajo = abajo.toString();
  const escalones = [];
  
  for (let i = strAbajo.length - 1; i >= 0; i--) {
    const cifra = parseInt(strAbajo[i]);
    const valorEscalon = cifra * arriba * Math.pow(10, strAbajo.length - 1 - i);
    if (valorEscalon !== 0 || strAbajo.length === 1) escalones.push(valorEscalon);
  }

  let htmlPasos = "";
  escalones.forEach(es => { htmlPasos += `<div>${es}</div>`; });

  const html = `
    <div class="algoritmo">
      <h3>✏️ Cuaderno Científico (Algoritmo Tradicional)</h3>
      <div class="flex-centro">
        <div class="cuenta-vertical">
          <div>&nbsp;&nbsp;${arriba}</div>
          <div>×&nbsp;${abajo}</div>
          <span class="linea-cuenta"></span>
          ${htmlPasos}
          <span class="linea-cuenta"></span>
          <div style="color: #b91c1c;">${total}</div>
        </div>
      </div>
    </div>`;
  document.getElementById("area-algoritmo").innerHTML = html;
}

/* ── MOTOR DE PARTÍCULAS DE CONFETI NATIVO ── */
let confetiParticulas = [];
let confetiCtx = null;
let confetiCanvas = null;
let confetiAnimacionFrame = null;

function lanzarConfeti() {
  confetiCanvas = document.getElementById("canvas-confeti");
  confetiCtx = confetiCanvas.getContext("2d");
  confetiCanvas.width = window.innerWidth;
  confetiCanvas.height = window.innerHeight;
  confetiCanvas.style.display = "block";
  
  confetiParticulas = [];
  const colores = ["#ff3366", "#33ccff", "#33ff99", "#ffcc33", "#ae33ff", "#ff6633"];
  
  for (let i = 0; i < 120; i++) {
    confetiParticulas.push({
      x: confetiCanvas.width / 2 + (Math.random() * 100 - 50),
      y: confetiCanvas.height + 20,
      radio: Math.random() * 6 + 4,
      color: colores[Math.floor(Math.random() * colores.length)],
      vx: Math.random() * 14 - 7,
      vy: -(Math.random() * 12 + 10),
      gravedad: 0.3,
      rotacion: Math.random() * 360,
      vRotacion: Math.random() * 4 - 2
    });
  }
  
  if (confetiAnimacionFrame) cancelAnimationFrame(confetiAnimacionFrame);
  animarConfeti();
  
  setTimeout(() => {
    confetiCanvas.style.display = "none";
    cancelAnimationFrame(confetiAnimacionFrame);
  }, 4000);
}

function animarConfeti() {
  confetiCtx.clearRect(0, 0, confetiCanvas.width, confetiCanvas.height);
  
  let vivas = false;
  confetiParticulas.forEach(p => {
    p.vy += p.gravedad;
    p.x += p.vx;
    p.y += p.vy;
    p.rotacion += p.vRotacion;
    
    if (p.y < confetiCanvas.height + 20) vivas = true;
    
    confetiCtx.save();
    confetiCtx.translate(p.x, p.y);
    confetiCtx.rotate((p.rotacion * Math.PI) / 180);
    confetiCtx.fillStyle = p.color;
    confetiCtx.fillRect(-p.radio, -p.radio, p.radio * 2, p.radio * 2);
    confetiCtx.restore();
  });
  
  if (vivas) {
    confetiAnimacionFrame = requestAnimationFrame(animarConfeti);
  }
}

window.addEventListener("resize", () => {
  if (confetiCanvas && confetiCanvas.style.display === "block") {
    confetiCanvas.width = window.innerWidth;
    confetiCanvas.height = window.innerHeight;
  }
});

/* ── MOTOR DE AUDIO CIENTÍFICO NATIVO (SINTETIZADOR WEB) ── */
function reproducirSonido(tipo) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  
  if (tipo === 'exito') {
    const notas = [523.25, 659.25, 783.99, 1046.50];
    notas.forEach((frecuencia, i) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(frecuencia, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }, i * 80);
    });
  } 
  else if (tipo === 'error') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } 
  else if (tipo === 'pista') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }
}

/* ── EXPORTACIÓN CIENTÍFICA A PDF NATIVO ── */
/* Reemplaza tu función exportarPDF() por esta versión actualizada */
function exportarPDF() {
  const nombreCientifico = g.nombre || document.getElementById("nombre").value.trim() || "Científico Anónimo";
  
  document.getElementById("rep-nombre").textContent = nombreCientifico;
  document.getElementById("rep-puntos").textContent = g.puntos;
  document.getElementById("rep-racha").textContent = g.racha;
  document.getElementById("rep-ejercicios").textContent = g.ejercicios;
  
  // ➡️ INYECTAR EL HISTORIAL DE CUENTAS EN EL REPORTE (Sin número de experimento)
  const listaHistorial = document.getElementById("rep-historial-lista");
  listaHistorial.innerHTML = ""; 
  
  if (g.historial && g.historial.length > 0) {
    g.historial.forEach((cuenta) => {
      // Ahora solo creamos una celda por fila con la cuenta limpia
      listaHistorial.innerHTML += `<tr><td>${cuenta}</td></tr>`;
    });
  } else {
    // Si no hay cuentas, se avisa ocupando la única columna existente
    listaHistorial.innerHTML = `<tr><td style="text-align:center; color: #666;">No se registraron experimentos en esta sesión.</td></tr>`;
  }
  
  const hoy = new Date();
  const fechaFormateada = hoy.toLocaleDateString('es-ES', { 
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  document.getElementById("rep-fecha").textContent = fechaFormateada;

  window.print();
}
