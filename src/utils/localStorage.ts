const PDF_META_KEY = 'biobased_pdf_meta';

export type PdfMetaStorage = {
  name: string;
  projectName: string;
  projectNumber: string;
  timestamp: number;
};

export const savePdfMetaToStorage = (meta: Omit<PdfMetaStorage, 'timestamp'>) => {
  try {
    const dataToStore: PdfMetaStorage = {
      ...meta,
      timestamp: Date.now(),
    };
    localStorage.setItem(PDF_META_KEY, JSON.stringify(dataToStore));
  } catch (error) {
    console.error('Failed to save PDF meta to localStorage:', error);
  }
};

export const getPdfMetaFromStorage = (): PdfMetaStorage | null => {
  try {
    const stored = localStorage.getItem(PDF_META_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as PdfMetaStorage;
  } catch (error) {
    console.error('Failed to load PDF meta from localStorage:', error);
    return null;
  }
};

export const clearPdfMetaFromStorage = () => {
  try {
    localStorage.removeItem(PDF_META_KEY);
  } catch (error) {
    console.error('Failed to clear PDF meta from localStorage:', error);
  }
};