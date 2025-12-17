import JSZip from 'jszip';
// ✅ FIX: Use 'expo-file-system/legacy'
import { readAsStringAsync } from 'expo-file-system/legacy';

export async function extractTextFromPPTX(fileUri: string): Promise<string> {
  try {
    console.log("Reading PPTX file...");
    
    // 1. Read the file as Base64 string
    const fileContent = await readAsStringAsync(fileUri, {
      encoding: 'base64', 
    });

    // 2. Load Zip
    const zip = await JSZip.loadAsync(fileContent, { base64: true });
    
    let extractedText = "";
    const slideFiles: any[] = [];

    // 3. Find Slides
    zip.forEach((relativePath, file) => {
      if (relativePath.match(/ppt\/slides\/slide\d+\.xml/)) {
        slideFiles.push({ path: relativePath, file });
      }
    });

    // Sort slides 1, 2, 3...
    slideFiles.sort((a, b) => {
      const numA = parseInt(a.path.match(/slide(\d+)\.xml/)?.[1] || "0");
      const numB = parseInt(b.path.match(/slide(\d+)\.xml/)?.[1] || "0");
      return numA - numB;
    });

    console.log(`Found ${slideFiles.length} slides.`);

    // 4. Extract Text
    for (const slide of slideFiles) {
      const xmlContent = await slide.file.async("string");
      // Regex to remove XML tags
      const slideText = xmlContent.match(/<a:t>(.*?)<\/a:t>/g)
        ?.map((t: string) => t.replace(/<\/?a:t>/g, ''))
        .join(' ');

      if (slideText) {
        extractedText += `\n[SLIDE ${slide.path.match(/\d+/)[0]}]\n${slideText}\n`;
      }
    }

    return extractedText || "No text found in slides.";

  } catch (error) {
    console.error("PPTX Parse Error:", error);
    throw new Error("Could not read PowerPoint file. Ensure it is a valid .pptx");
  }
}