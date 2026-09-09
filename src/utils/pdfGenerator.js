import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Export Student Certificate as PDF
export const exportCertificatePDF = async (elementId, studentName = 'Siswa') => {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('Elemen sertifikat tidak ditemukan!');
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
    const width = imgProps.width * ratio;
    const height = imgProps.height * ratio;
    const x = (pdfWidth - width) / 2;
    const y = (pdfHeight - height) / 2;

    pdf.addImage(imgData, 'PNG', x, y, width, height);
    pdf.save(`Sertifikat_${studentName.replace(/\s+/g, '_')}_FunQuiz.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Gagal mengunduh sertifikat PDF. Menggunakan opsi cetak browser...');
    window.print();
  }
};

// Export Teacher Ranked Results Report as PDF
export const exportTeacherResultsPDF = (results, quizInfo, teacherName) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Header Banner
  doc.setFillColor(37, 99, 235); // Blue #2563eb
  doc.rect(0, 0, 210, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('FUN QUIZ - LAPORAN HASIL NILAI SISWA', 105, 14, { align: 'center' });

  // Metadata Box
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  
  let startY = 32;
  doc.text(`Guru Pengampu  : ${teacherName || 'Guru SMP'}`, 14, startY);
  doc.text(`Mata Pelajaran : ${quizInfo?.subject || 'Semua Subject'}`, 14, startY + 6);
  doc.text(`Materi Pokok    : ${quizInfo?.material || 'Semua Materi'}`, 14, startY + 12);
  doc.text(`Tanggal Unduh   : ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, startY + 18);

  // Table Headers
  let tableTop = startY + 28;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, tableTop, 182, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Rangking', 18, tableTop + 5.5);
  doc.text('Nama Siswa', 42, tableTop + 5.5);
  doc.text('Kelas', 95, tableTop + 5.5);
  doc.text('Jawaban Benar', 122, tableTop + 5.5);
  doc.text('Nilai Akhir', 165, tableTop + 5.5);

  doc.setLineWidth(0.3);
  doc.setDrawColor(203, 213, 225);
  doc.line(14, tableTop + 8, 196, tableTop + 8);

  // Table Body (Sorted by Score Descending)
  const sorted = [...results].sort((a, b) => b.score - a.score);
  let y = tableTop + 14;

  sorted.forEach((item, index) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFont('helvetica', index < 3 ? 'bold' : 'normal');
    if (index === 0) doc.setTextColor(217, 119, 6); // Gold #d97706
    else if (index === 1) doc.setTextColor(71, 85, 105); // Silver
    else if (index === 2) doc.setTextColor(180, 83, 9); // Bronze
    else doc.setTextColor(51, 65, 85);

    doc.text(`#${index + 1}`, 22, y);
    doc.text(item.student_name.substring(0, 24), 42, y);
    doc.text(item.student_class || '-', 95, y);
    doc.text(`${item.correct_count} / ${item.total_questions}`, 130, y);
    
    // Score Badge
    doc.setFont('helvetica', 'bold');
    doc.text(`${item.score}`, 172, y);

    y += 8;
    doc.setDrawColor(241, 245, 249);
    doc.line(14, y - 3, 196, y - 3);
  });

  // Footer Signature
  if (y > 240) {
    doc.addPage();
    y = 30;
  } else {
    y += 15;
  }

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Mengetahui,', 140, y);
  doc.text('Guru Mata Pelajaran', 140, y + 5);
  
  doc.setFont('helvetica', 'bold');
  doc.text(teacherName || 'Guru Pengampu', 140, y + 25);

  doc.save(`Rekap_Nilai_FunQuiz_${(quizInfo?.subject || 'SMP').replace(/\s+/g, '_')}.pdf`);
};
