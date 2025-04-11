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