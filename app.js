const scanBtn = document.getElementById("scanBtn");
const video = document.getElementById("video");
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
const scannedList = document.getElementById("scannedList");
const downloadBtn = document.getElementById("downloadBtn");

let scannedCodes = []; // Lista de asistencias

// Función para activar la cámara y escanear
async function startScanner() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = stream;
        video.style.display = "block";
        scanQRCode();
    } catch (error) {
        alert("Error al acceder a la cámara");
    }
}

// Función para escanear QR
function scanQRCode() {
    const scanInterval = setInterval(() => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });

            if (code) {
                clearInterval(scanInterval);
                video.style.display = "none";
                video.srcObject.getTracks().forEach(track => track.stop()); // Detener la cámara
                registerAttendance(code.data);
            }
        }
    }, 500);
}

// Función para registrar asistencia
function registerAttendance(code) {
    if (!scannedCodes.includes(code)) {
        scannedCodes.push(code);
        const listItem = document.createElement("li");
        listItem.textContent = `Alumno: ${code}`;
        scannedList.appendChild(listItem);
    } else {
        alert("Este código ya ha sido registrado.");
    }
}

// Función para descargar asistencia en Excel
function downloadExcel() {
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet([["Código de Alumno"], ...scannedCodes.map(code => [code])]);

    XLSX.utils.book_append_sheet(wb, ws, "Asistencia");
    XLSX.writeFile(wb, "Asistencia_QR.xlsx");
}

// Eventos
scanBtn.addEventListener("click", startScanner);
downloadBtn.addEventListener("click", downloadExcel);