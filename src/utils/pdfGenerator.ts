import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { CropRecommendation } from '@/services/cropRecommendationService';

export const generateRecommendationsPDF = (
  recommendations: CropRecommendation[],
  formData: { soilType: string; season: string; location: string }
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(34, 139, 34); // Forest Green
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Crop Recommendations Report', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 32, { align: 'center' });
  
  // Farm Details Section
  doc.setTextColor(51, 51, 51);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Farm Details', 14, 55);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Location: ${formData.location}`, 14, 65);
  doc.text(`Soil Type: ${formData.soilType}`, 14, 72);
  doc.text(`Season: ${formData.season}`, 14, 79);
  
  // Recommendations Table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Recommended Crops', 14, 95);
  
  const tableData = recommendations.map((crop, index) => [
    (index + 1).toString(),
    crop.name,
    crop.suitability,
    crop.timing,
    crop.expectedYield
  ]);
  
  autoTable(doc, {
    startY: 100,
    head: [['#', 'Crop Name', 'Suitability', 'Timing', 'Expected Yield']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [34, 139, 34],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [240, 248, 240]
    },
    styles: {
      fontSize: 10,
      cellPadding: 5
    }
  });
  
  // Care Instructions
  let yPosition = (doc as any).lastAutoTable.finalY + 15;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Care Instructions', 14, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  recommendations.forEach((crop) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text(`${crop.name}:`, 14, yPosition);
    yPosition += 6;
    
    doc.setFont('helvetica', 'normal');
    const splitText = doc.splitTextToSize(crop.careInstructions, pageWidth - 28);
    doc.text(splitText, 14, yPosition);
    yPosition += splitText.length * 5 + 8;
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Farmer Advisory App - Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  doc.save(`crop-recommendations-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateAnalyticsPDF = (
  stats: { title: string; value: string | number }[],
  activities: any[],
  recommendations: any[],
  diagnoses: any[]
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(34, 139, 34);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Farm Analytics Report', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 32, { align: 'center' });
  
  // Summary Stats
  doc.setTextColor(51, 51, 51);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary Statistics', 14, 55);
  
  const statsData = stats.map(stat => [stat.title, stat.value.toString()]);
  
  autoTable(doc, {
    startY: 60,
    head: [['Metric', 'Value']],
    body: statsData,
    theme: 'grid',
    headStyles: {
      fillColor: [34, 139, 34],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 11,
      cellPadding: 6
    },
    columnStyles: {
      0: { fontStyle: 'bold' }
    }
  });
  
  // Recent Activities
  let yPosition = (doc as any).lastAutoTable.finalY + 15;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Recent Activities', 14, yPosition);
  
  const activityData = activities.slice(0, 10).map((activity, index) => [
    (index + 1).toString(),
    activity.title,
    activity.activity_type,
    new Date(activity.created_at).toLocaleDateString()
  ]);
  
  autoTable(doc, {
    startY: yPosition + 5,
    head: [['#', 'Activity', 'Type', 'Date']],
    body: activityData,
    theme: 'striped',
    headStyles: {
      fillColor: [139, 69, 19],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [255, 248, 240]
    },
    styles: {
      fontSize: 9,
      cellPadding: 4
    }
  });
  
  // Crop Recommendations Summary
  doc.addPage();
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Crop Recommendations History', 14, 20);
  
  const recData = recommendations.slice(0, 15).map((rec, index) => [
    (index + 1).toString(),
    rec.location || 'N/A',
    rec.soil_type || 'N/A',
    rec.season || 'N/A',
    rec.status || 'pending',
    new Date(rec.created_at).toLocaleDateString()
  ]);
  
  autoTable(doc, {
    startY: 25,
    head: [['#', 'Location', 'Soil Type', 'Season', 'Status', 'Date']],
    body: recData,
    theme: 'striped',
    headStyles: {
      fillColor: [34, 139, 34],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 9,
      cellPadding: 4
    }
  });
  
  // Pest Diagnoses Summary
  yPosition = (doc as any).lastAutoTable.finalY + 15;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Pest Diagnoses History', 14, yPosition);
  
  const diagData = diagnoses.slice(0, 15).map((diag, index) => [
    (index + 1).toString(),
    diag.pest_identified || 'Pending',
    diag.crop_type || 'N/A',
    diag.severity || 'N/A',
    new Date(diag.created_at).toLocaleDateString()
  ]);
  
  autoTable(doc, {
    startY: yPosition + 5,
    head: [['#', 'Pest Identified', 'Crop Type', 'Severity', 'Date']],
    body: diagData,
    theme: 'striped',
    headStyles: {
      fillColor: [139, 69, 19],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 9,
      cellPadding: 4
    }
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Farmer Advisory App - Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  doc.save(`farm-analytics-${new Date().toISOString().split('T')[0]}.pdf`);
};
