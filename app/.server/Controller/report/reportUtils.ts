import {jsPDF, jsPDFOptions} from "jspdf";

const OPTIONS:jsPDFOptions = {
 orientation: 'p',
 unit: 'mm',
 format: 'a4',
 putOnlyUsedFonts:true,
 floatPrecision: 16
}



function createGeneralReport(){
  console.log("General report function.");
  
  
}

async function createPersonalReport(){
  console.log("Personal report function.");
  const doc = new jsPDF(OPTIONS);
  doc.text("Hello World!",20,20);
  doc.text("This is client-side Javascript, pumping out a PDF.", 20, 30);
  doc.save("js_pdf_test.pdf");
  

}

export {createGeneralReport, createPersonalReport}