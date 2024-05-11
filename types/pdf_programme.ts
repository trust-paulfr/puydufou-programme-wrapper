interface PDFProgrammeInterface_Heures {
     debut: string;
     debut_timestamp: number;
     fin: string;
     status: number;
}

interface PDFProgrammeInterface {
     wzid: string; 
     pdfid?: string;
     title?: string;
     subject?: string;
     description?: string;
     duree: number;
     heures: PDFProgrammeInterface_Heures[];
     affluence?: number;
     state?: number;
}

export default PDFProgrammeInterface;