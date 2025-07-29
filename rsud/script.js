// Set tanggal dan waktu saat ini sebagai default
const now = new Date();
const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, 16);
document.getElementById("assessmentDateTime").value = localDateTime;

function calculateTotal() {
  const parameters = [
    "respiratory_rate",
    "oxygen_saturation",
    "temperature",
    "systolic_bp",
    "heart_rate",
    "consciousness",
  ];

  let total = 0;
  parameters.forEach((parameter) => {
    const selected = document.querySelector(
      `input[name="${parameter}"]:checked`
    );
    if (selected) {
      total += parseInt(selected.value);
    }
  });

  document.getElementById("totalScore").textContent = total;
  updateRiskLevel(total);
}

function updateRiskLevel(score) {
  const riskLevelDiv = document.getElementById("riskLevel");

  if (score === 0 && !hasAnySelection()) {
    riskLevelDiv.textContent = "Lengkapi penilaian";
    riskLevelDiv.className = "risk-level";
    riskLevelDiv.style.backgroundColor = "#f8f9fa";
    riskLevelDiv.style.color = "#666";
    return;
  }

  if (score >= 0 && score <= 4) {
    riskLevelDiv.textContent = "RISIKO RENDAH";
    riskLevelDiv.className = "risk-level low-risk";
  } else if (score >= 5 && score <= 6) {
    riskLevelDiv.textContent = "RISIKO SEDANG";
    riskLevelDiv.className = "risk-level medium-risk";
  } else if (score >= 7) {
    riskLevelDiv.textContent = "RISIKO TINGGI";
    riskLevelDiv.className = "risk-level high-risk";
  }
}

function hasAnySelection() {
  const parameters = [
    "respiratory_rate",
    "oxygen_saturation",
    "temperature",
    "systolic_bp",
    "heart_rate",
    "consciousness",
  ];

  return parameters.some((parameter) => {
    return document.querySelector(`input[name="${parameter}"]:checked`);
  });
}

function exportToWord() {
  // Ambil data pasien
  const patientName =
    document.getElementById("patientName").value || "[Nama Pasien]";
  const medicalRecord =
    document.getElementById("medicalRecord").value || "[No. RM]";
  const room = document.getElementById("room").value || "[Ruang/Kelas]";
  const assessmentDateTime =
    document.getElementById("assessmentDateTime").value || "";
  const totalScore = document.getElementById("totalScore").textContent;

  // Format tanggal dan waktu
  const formattedDateTime = assessmentDateTime
    ? new Date(assessmentDateTime).toLocaleString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "[Tanggal/Waktu]";

  // Dapatkan hasil penilaian
  const parameters = [
    { name: "respiratory_rate", label: "Laju Napas" },
    { name: "oxygen_saturation", label: "Saturasi Oksigen" },
    { name: "temperature", label: "Suhu Tubuh" },
    { name: "systolic_bp", label: "Tekanan Darah Sistolik" },
    { name: "heart_rate", label: "Denyut Nadi" },
    { name: "consciousness", label: "Tingkat Kesadaran" },
  ];

  let assessmentResults = "";
  parameters.forEach((param) => {
    const selected = document.querySelector(
      `input[name="${param.name}"]:checked`
    );
    if (selected) {
      const score = selected.value;
      const criteria = selected.closest("td").querySelector("div").textContent;
      assessmentResults += `${param.label}: ${criteria} (Skor: ${score})\\n`;
    }
  });

  // Tentukan tingkat risiko dan tindakan
  const score = parseInt(totalScore);
  let riskLevel = "";
  let actions = "";

  if (score >= 0 && score <= 4) {
    riskLevel = "RISIKO RENDAH";
    actions =
      "• Monitoring rutin setiap 12 jam\\n• Lanjutkan perawatan standar\\n• Dokumentasi dalam rekam medis";
  } else if (score >= 5 && score <= 6) {
    riskLevel = "RISIKO SEDANG";
    actions =
      "• Monitoring setiap 4-6 jam\\n• Informasikan kepada dokter jaga\\n• Pertimbangkan konsultasi ke ICU\\n• Evaluasi kebutuhan oksigen tambahan";
  } else if (score >= 7) {
    riskLevel = "RISIKO TINGGI";
    actions =
      "• Monitoring kontinyu setiap 1-2 jam\\n• SEGERA hubungi dokter jaga\\n• Pertimbangkan transfer ke ICU/HCU\\n• Aktifkan rapid response team\\n• Siapkan resusitasi jika diperlukan";
  }

}


function submitToSheet() {
  const data = {
    nama: document.getElementById("patientName").value,
    no_rm: document.getElementById("medicalRecord").value,
    ruang: document.getElementById("room").value,
    tanggal: document.getElementById("assessmentDateTime").value,
    skor: document.getElementById("totalScore").innerText,
    risiko: document.getElementById("riskLevel").innerText.trim()
  };

  fetch("https://script.google.com/macros/s/AKfycbwodE8nxwdrgWn9UBEMdLfwimXrqD2mNpYr1aBH1SwmW7LUMneFxMH_4hnU1ys00V0Rug/exec", {
    method: "POST",
    mode: "no-cors",
    credentials: "include",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.text())
    .then((res) => {
      alert("✅ Data berhasil dikirim ke Google Sheets!");
    })
    .catch((err) => {
      alert("❌ Gagal mengirim data: " + err);
    });
}
