import * as pdfjsLib from "pdfjs-dist";

// SETTING THE WORK-SRC FOR PDFJSLIB
pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL(
  "libs/pdf.worker.min.mjs"
);

// FUNCTION TO READ THE PDF, EXTRACT TEXT AND RETURN
export async function resumeReader(file) {
  if (!(file instanceof Blob) || file.type !== "application/pdf") {
    throw new Error("Invalid file type. Please upload a PDF file.");
  }

  try {
    // INITIALIZING FILE READER
    const fileReader = new FileReader();

    return new Promise((resolve, reject) => {
      fileReader.onload = async function (event) {
        try {
          const typedArray = new Uint8Array(event.target.result);

          // LOADING THE PDF DOCUMENT
          const pdfDocument = await pdfjsLib.getDocument(typedArray).promise;

          let extractedText = "";

          // LOOPING THROUGH PDF EACH PAGE
          for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
            const page = await pdfDocument.getPage(pageNum);
            const textContent = await page.getTextContent();

            // EXTRACTING TEXT FROM THE PAGE
            const pageText = textContent.items
              .map((item) => item.str)
              .join(" ");

            // GATHERING EXTRACTED TEXT
            extractedText += pageText + "\n";
          }

          // RESOLVING PROMISE WITH EXTRACTED TEXT
          resolve(extractedText);
        } catch (error) {
          console.error("Error processing PDF content:", error);
          reject(new Error("Failed to extract text from PDF."));
        }
      };

      fileReader.onerror = (error) => {
        console.error("Error reading file:", error);
        reject(new Error("Failed to read the file."));
      };

      // Read the file as an ArrayBuffer
      fileReader.readAsArrayBuffer(file);
    });
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF.");
  }
}
