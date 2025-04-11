function generarQR() {
    let nombre = document.getElementById("nombre").value.trim();
    if (nombre === "") {
        alert("Por favor, ingresa un nombre.");
        return;
    }

    let qrContainer = document.getElementById("qrContainer");
    qrContainer.innerHTML = ""; // Limpiar antes de generar nuevo QR

    let qr = new QRCode(qrContainer, {
        text: nombre,
        width: 128,
        height: 128
    });

    registrarAsistencia(nombre);
}

function registrarAsistencia(nombre) {
    let table = document.getElementById("asistenciaTable");
    let row = table.insertRow(-1);
    let cellNombre = row.insertCell(0);
    let cellFecha = row.insertCell(1);

    let fecha = new Date().toLocaleString();
    cellNombre.innerHTML = nombre;
    cellFecha.innerHTML = fecha;
}

function exportarExcel() {
    let table = document.getElementById("asistenciaTable");
    let wb = XLSX.utils.table_to_book(table, {sheet: "Asistencia"});
    XLSX.writeFile(wb, "asistencia.xlsx");
}
let scannedCodes = []; // Lista para guardar los códigos escaneados

// Función que se ejecuta cuando se escanea un código
function onScanSuccess(decodedText, decodedResult) {
    if (!scannedCodes.includes(decodedText)) { // Evitar duplicados
        scannedCodes.push(decodedText);

        // Mostrar en pantalla (opcional)
        let list = document.getElementById("scannedList");
        let listItem = document.createElement("li");
        listItem.textContent = decodedText;
        list.appendChild(listItem);
    }
}

// Función para descargar como Excel
function downloadExcel() {
    let wb = XLSX.utils.book_new(); 
    let ws = XLSX.utils.aoa_to_sheet([["Código Escaneado"], ...scannedCodes.map(code => [code])]);

    XLSX.utils.book_append_sheet(wb, ws, "Asistencias");
    XLSX.writeFile(wb, "Asistencia_QR.xlsx");
}

// Botón para descargar
document.getElementById("downloadBtn").addEventListener("click", downloadExcel);