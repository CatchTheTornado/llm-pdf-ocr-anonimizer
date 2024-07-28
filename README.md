# Safely send privacy-critical documents to LLM

This tool uses in-browser **Tesseract OCR** to extract text from images.

Then it anonymizes it by removing or **PII (Personally Identitable Information)** so you can safely send it to ChatGPT. 

In this example we do use ChatGPT to enhance and fix Tesseract issues as well. 
This is a PoC project intended to be used for privacy-critical LLM cases, like health data etc.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

