"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './tesseract-anonymizer.module.css'
import { convert } from '@/lib/pdf2js'
import { pdfjs  } from "react-pdf"
import ZoomableImage from "./zoomable-image"
import { createWorker } from 'tesseract.js';
import { SyncRedactor  } from '@/lib/redactor';
const redactor = new SyncRedactor();

export type ImageData = {
  base64Content: string;
  displayName: string;
};


export function TesseractAnonymizer() {
  const languages = [
    { name: "English", code: "eng" },
    { name: "Polish", code: "pol" },
    { name: "Portuguese", code: "por" },
    { name: "Afrikaans", code: "afr" },
    { name: "Albanian", code: "sqi" },
    { name: "Amharic", code: "amh" },
    { name: "Arabic", code: "ara" },
    { name: "Assamese", code: "asm" },
    { name: "Azerbaijani", code: "aze" },
    { name: "Azerbaijani - Cyrillic", code: "aze_cyrl" },
    { name: "Basque", code: "eus" },
    { name: "Belarusian", code: "bel" },
    { name: "Bengali", code: "ben" },
    { name: "Bosnian", code: "bos" },
    { name: "Bulgarian", code: "bul" },
    { name: "Burmese", code: "mya" },
    { name: "Catalan; Valencian", code: "cat" },
    { name: "Cebuano", code: "ceb" },
    { name: "Central Khmer", code: "khm" },
    { name: "Cherokee", code: "chr" },
    { name: "Chinese - Simplified", code: "chi_sim" },
    { name: "Chinese - Traditional", code: "chi_tra" },
    { name: "Croatian", code: "hrv" },
    { name: "Czech", code: "ces" },
    { name: "Danish", code: "dan" },
    { name: "Dutch; Flemish", code: "nld" },
    { name: "Dzongkha", code: "dzo" },
    { name: "English, Middle (1100-1500)", code: "enm" },
    { name: "Esperanto", code: "epo" },
    { name: "Estonian", code: "est" },
    { name: "Finnish", code: "fin" },
    { name: "French", code: "fra" },
    { name: "French, Middle (ca. 1400-1600)", code: "frm" },
    { name: "Galician", code: "glg" },
    { name: "Georgian", code: "kat" },
    { name: "German", code: "deu" },
    { name: "German Fraktur", code: "frk" },
    { name: "Greek, Modern (1453-)", code: "ell" },
    { name: "Greek, Ancient (-1453)", code: "grc" },
    { name: "Gujarati", code: "guj" },
    { name: "Haitian; Haitian Creole", code: "hat" },
    { name: "Hebrew", code: "heb" },
    { name: "Hindi", code: "hin" },
    { name: "Hungarian", code: "hun" },
    { name: "Icelandic", code: "isl" },
    { name: "Indonesian", code: "ind" },
    { name: "Inuktitut", code: "iku" },
    { name: "Irish", code: "gle" },
    { name: "Italian", code: "ita" },
    { name: "Japanese", code: "jpn" },
    { name: "Javanese", code: "jav" },
    { name: "Kannada", code: "kan" },
    { name: "Kazakh", code: "kaz" },
    { name: "Kirghiz; Kyrgyz", code: "kir" },
    { name: "Korean", code: "kor" },
    { name: "Kurdish", code: "kur" },
    { name: "Lao", code: "lao" },
    { name: "Latin", code: "lat" },
    { name: "Latvian", code: "lav" },
    { name: "Lithuanian", code: "lit" },
    { name: "Macedonian", code: "mkd" },
    { name: "Malay", code: "msa" },
    { name: "Malayalam", code: "mal" },
    { name: "Maltese", code: "mlt" },
    { name: "Marathi", code: "mar" },
    { name: "Nepali", code: "nep" },
    { name: "Norwegian", code: "nor" },
    { name: "Oriya", code: "ori" },
    { name: "Panjabi; Punjabi", code: "pan" },
    { name: "Persian", code: "fas" },
    { name: "Pushto; Pashto", code: "pus" },
    { name: "Romanian; Moldavian; Moldovan", code: "ron" },
    { name: "Russian", code: "rus" },
    { name: "Sanskrit", code: "san" },
    { name: "Serbian", code: "srp" },
    { name: "Serbian - Latin", code: "srp_latn" },
    { name: "Sinhala; Sinhalese", code: "sin" },
    { name: "Slovak", code: "slk" },
    { name: "Slovenian", code: "slv" },
    { name: "Spanish; Castilian", code: "spa" },
    { name: "Swahili", code: "swa" },
    { name: "Swedish", code: "swe" },
    { name: "Syriac", code: "syr" },
    { name: "Tagalog", code: "tgl" },
    { name: "Tajik", code: "tgk" },
    { name: "Tamil", code: "tam" },
    { name: "Telugu", code: "tel" },
    { name: "Thai", code: "tha" },
    { name: "Tibetan", code: "bod" },
    { name: "Tigrinya", code: "tir" },
    { name: "Turkish", code: "tur" },
    { name: "Uighur; Uyghur", code: "uig" },
    { name: "Ukrainian", code: "ukr" },
    { name: "Urdu", code: "urd" },
    { name: "Uzbek", code: "uzb" },
    { name: "Uzbek - Cyrillic", code: "uzb_cyrl" },
    { name: "Vietnamese", code: "vie" },
    { name: "Welsh", code: "cym" },
    { name: "Yiddish", code: "yid" },
  ];
  const  [documentText, setDocumentText] = useState<string>("This tool uses in-browser **Tesseract OCR** to extract text from images. \r\n\r\nThen it anonymizes it by removing or **PII (Personally Identitable Information)** so you can safely send it to ChatGPT. \r\n\r\n\r In this example we do use ChatGPT to enhance and fix Tesseract issues as well. This is a PoC project intended to be used for privacy-critical LLM cases, like health data etc.");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("eng");
  const [images, setImages] = useState<ImageData[]>([]);

  const processFile = async (file: File, base64Content: string) => {

    (async () => {
      const worker = await createWorker(selectedLanguage, 1, {
        logger: m => console.log(m),
        errorHandler: e => console.error(e),
        workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@v5.0.0/dist/worker.min.js',
        langPath: 'https://tessdata.projectnaptha.com/4.0.0',
        corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v5.0.0',
      });
      let imagesArray: ImageData[] = []
            
      if (file.type.startsWith("image")) {
        imagesArray = [{
          displayName: file.name,
          base64Content: base64Content
        }]
        setImages(imagesArray)

      } else if(file.type === "application/pdf") {
        const pagesArray = await convert(base64Content,{ base64: true }, pdfjs);
        let page = 1;
        for(const image of pagesArray) {
          imagesArray.push({
            displayName: file.name + '-' + page,
            base64Content: image
          })
          page ++;
        }
        setImages(imagesArray);
      }
      
        setDocumentText('');
        for(const image of imagesArray) {
          const ret = await worker.recognize(image.base64Content);
          setDocumentText(documentText + ret.data.text);
        }
        await worker.terminate();
    })();    

  }

  const anonymizeText = () => {
    const redactor = new SyncRedactor();
    setDocumentText(redactor.redact(documentText));
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentText('Processing files ...');
    const file = event.target.files?.[0];
    if (file) {     
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const base64Content = event.target.result.toString();
          processFile(file, base64Content);
        };
      }
      reader.readAsDataURL(file);

      // Process the selected file here
      console.log("Selected file:", file);
    }
  };  

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">LLM Pre Anonymizer</h1>
        <div className="flex items-center gap-4">
          <select
            value={selectedLanguage}
            onChange={(event) => setSelectedLanguage(event.target.value)}
            className="bg-primary-foreground text-primary px-4 py-2 rounded-md transition-colors"
          >
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.name}
              </option>
            ))}
          </select>
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="bg-primary-foreground text-primary px-4 py-2 rounded-md transition-colors">
              Upload Image
            </div>
            <input
              id="image-upload"
              type="file"
              accept="image/*;application/pdf"
              className="sr-only"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </header>
      <main className="flex-1 bg-background text-foreground p-8 overflow-auto">
        <div className="prose max-w-3xl mx-auto">
           <div className="flex-wrap flex items-center justify-left min-h-100">
                {images
                  .map((image, index) => (
                    <ZoomableImage
                      className='w-100 p-2 bg-white'
                      width={100}
                      height={100}
                      key={`${index}`}
                      src={image.base64Content}
                      alt={image.displayName}
                    />
                  ))}            
              </div>                    
              <Markdown className={styles.markdown} remarkPlugins={[remarkGfm]}>
                {documentText}
              </Markdown>
        </div>
      </main>
      <footer className="bg-muted text-muted-foreground py-4 px-6 flex justify-end gap-4">
        <Button onClick={anonymizeText}>1. Anonymize</Button>
        <Button>2. Enhance via ChatGPT</Button>
      </footer>
    </div>
  );
}
