import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { createWorker } from 'tesseract.js';
import type { QuizQuestion } from '../interfaces/componentProps';

GlobalWorkerOptions.workerSrc = pdfWorker;

const cleanText = (value: string) => value.replace(/\s+/g, ' ').trim();
const toNumber = (value: string) => Number(value.replace(/[០-៩]/g, (digit) => String('០១២៣៤៥៦៧៨៩'.indexOf(digit))));
const normalizeLabel = (value: string) => value.toLocaleUpperCase();

function parseQuestions(source: string): QuizQuestion[] {
  const text = source.replace(/\r/g, '\n').replace(/[“”]/g, '"');
  const keyHeader = text.match(/(?:answer\s*key|answers|correct\s*answers)\s*[:\n]/i);
  const answerKey = new Map<number, string>();
  if (keyHeader?.index !== undefined) {
    const keyText = text.slice(keyHeader.index + keyHeader[0].length);
    for (const match of keyText.matchAll(/(?:^|\n|\s)(?:Q\s*)?([0-9០-៩]{1,6})\s*[.)\]:-]\s*\(?([A-Dកខគឃ១២៣៤])\)?(?=\s|$|[,;])/gim)) {
      answerKey.set(toNumber(match[1]), normalizeLabel(match[2]));
    }
  }
  const starts = [...text.matchAll(/(?:^|\n)\s*(?:Q(?:uestion)?\s*)?([0-9០-៩]{1,6})\s*(?:[.)\]/:-]|\/)?\s+(?=\S)/gi)];
  const blocks: Array<{ number?: number; text: string }> = [];
  if (starts.length) {
    starts.forEach((match, index) => {
      const begin = (match.index ?? 0) + match[0].length;
      const end = index + 1 < starts.length ? starts[index + 1].index ?? text.length : text.length;
      blocks.push({ number: toNumber(match[1]), text: text.slice(begin, end) });
    });
  } else {
    // PDFs often put each question and option on separate lines without numbering.
    const lines = text.split('\n').map(cleanText).filter(Boolean);
    let current: string[] = [];
    for (const line of lines) {
      if (/^(?:Q(?:uestion)?\s*)?[0-9០-៩]{1,6}\s*(?:[.)\]/:-]|\/)?\s+\S/i.test(line) && current.length) {
        blocks.push({ text: current.join('\n') });
        current = [];
      }
      current.push(line);
    }
    if (current.length) blocks.push({ text: current.join('\n') });
  }

  const result: QuizQuestion[] = [];
  for (const { number, text: block } of blocks) {
    // Handle labels such as A), (B), C., a: and OCR's common I/l-for-1 confusion.
    const optionMatches = [...block.matchAll(/(?:^|\n|\s{1,})(?:[-•*]\s*)?(?:\(?([A-Dកខគឃ១២៣៤])\)?\s*[/).:]|([A-D])\s*[-–])\s*/gim)];
    if (optionMatches.length < 2) continue;
    const question = cleanText(block.slice(0, optionMatches[0].index));
    if (question.length < 4) continue;
    const choices = optionMatches.map((match, index) => {
      const start = (match.index ?? 0) + match[0].length;
      const end = index + 1 < optionMatches.length ? optionMatches[index + 1].index ?? block.length : block.length;
      return { label: normalizeLabel(match[1] ?? match[2]), text: cleanText(block.slice(start, end)) };
    }).filter((choice) => choice.text);
    if (choices.length < 2) continue;
    const answerMatch = block.match(/(?:answer|correct(?:\s+answer)?|ans|ចម្លើយ)\s*[:.;)-]?\s*\(?([A-Dកខគឃ១២៣៤])\)?/i);
    const answerLabel = normalizeLabel(answerMatch?.[1] ?? '') || (number ? answerKey.get(number) : undefined);
    const marked = choices.map((choice) => ({ ...choice, text: choice.text.replace(/\s*(?:\*|✓|✔|\[correct\])\s*$/i, ''), isCorrect: answerLabel ? choice.label === answerLabel : /(?:\*|✓|✔|\[correct\])\s*$/i.test(choice.text) }));
    // Avoid inventing an answer when the PDF does not provide a key.
    if (!marked.some((choice) => choice.isCorrect)) continue;
    result.push({
      id: result.length + 1,
      question,
      answers: marked.map((choice, index) => ({ id: index + 1, text: choice.text, isCorrect: choice.isCorrect })),
    });
  }
  return result;
}

function generateDefinitionQuiz(source: string): QuizQuestion[] {
  const definitions: Array<{ term: string; meaning: string }> = [];
  const add = (term: string, meaning: string) => {
    const cleanTerm = cleanText(term).replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
    const cleanMeaning = cleanText(meaning).replace(/^[\s:–-]+|[\s.;]+$/g, '');
    if (cleanTerm.length < 3 || cleanTerm.length > 70 || cleanMeaning.length < 18 || cleanMeaning.length > 280) return;
    if (/^(it|this|that|there|they|we|he|she|these|those)\b/i.test(cleanTerm)) return;
    if (!definitions.some((item) => item.term.toLowerCase() === cleanTerm.toLowerCase())) definitions.push({ term: cleanTerm, meaning: cleanMeaning });
  };

  // Recognize common prose definitions and glossary-style entries. PDF line
  // wrapping and OCR whitespace are normalized before matching.
  const prose = cleanText(source).replace(/\s*([.!?])\s*/g, '$1 ');
  for (const match of prose.matchAll(/\b([A-Z][A-Za-z][A-Za-z0-9'’()\-/ ]{1,58}?)\s+(?:is defined as|can be defined as|refers to|is known as|is called|denotes|means|is an?|are)\s+(.{18,260}?)(?=[.!?](?:\s|$)|;|$)/g)) {
    add(match[1], match[2]);
  }
  for (const match of source.matchAll(/^\s*([^:\n]{2,65})\s*:\s*(.{18,260})\s*$/gm)) add(match[1], match[2]);
  for (const match of source.matchAll(/^\s*([^\n–-]{2,65})\s+[–-]\s+(.{18,260})\s*$/gm)) add(match[1], match[2]);
  for (const sentence of source.split(/[\n។.!?]+/u)) {
    const relation = sentence.match(/(?:គឺជា|គឺ|មានន័យថា|សំដៅលើ)\s*(.{18,260})/u);
    if (!relation) continue;
    const before = sentence.slice(0, relation.index).trim();
    const term = before.match(/([\p{L}\p{N}][\p{L}\p{N}\p{M}()/-]*(?:\s+[\p{L}\p{N}][\p{L}\p{N}\p{M}()/-]*){0,3})\s*$/u)?.[1];
    if (term) add(term, relation[1]);
  }

  if (definitions.length < 2) return [];
  return definitions.map((definition, index) => {
    const distractors = definitions.filter((_, otherIndex) => otherIndex !== index).slice(0, 3);
    const answerItems = [definition.term, ...distractors.map((item) => item.term)];
    // Rotate choices so the correct answer does not always appear first.
    const shift = index % answerItems.length;
    const choices = [...answerItems.slice(shift), ...answerItems.slice(0, shift)];
    return {
      id: index + 1,
      question: /[\u1780-\u17ff]/u.test(`${definition.term} ${definition.meaning}`)
        ? `Which term is described as / តើពាក្យណាដែលមានន័យថា: “${definition.meaning}”?`
        : `Which term is described as: “${definition.meaning}”?`,
      answers: choices.map((term, answerIndex) => ({ id: answerIndex + 1, text: term, isCorrect: term === definition.term })),
    };
  });
}

export async function extractQuizFromPdf(file: File, report: (message: string) => void): Promise<QuizQuestion[]> {
  if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') throw new Error('Choose a PDF file.');
  const pdf = await getDocument({ data: await file.arrayBuffer() }).promise;
  const worker = await createWorker(['eng', 'khm']);
  const pages: string[] = [];
  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      report(`Reading page ${pageNumber} of ${pdf.numPages}…`);
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      let previousY: number | null = null;
      const nativeText = content.items.map((item) => {
        if (!('str' in item)) return '';
        const y = item.transform[5];
        const lineBreak = previousY !== null && Math.abs(previousY - y) > 2;
        previousY = y;
        return `${lineBreak ? '\n' : ' '}${item.str}`;
      }).join('');
      if (nativeText.replace(/\s/g, '').length > 35) {
        pages.push(nativeText);
      } else {
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext('2d');
        if (!context) continue;
        await page.render({ canvas, canvasContext: context, viewport }).promise;
        const { data: { text } } = await worker.recognize(canvas);
        pages.push(text);
        canvas.width = 0;
        canvas.height = 0;
      }
    }
  } finally {
    await worker.terminate();
  }
  report('Finding questions and answer keys…');
  const extractedText = pages.join('\n');
  const existingQuestions = parseQuestions(extractedText);
  return existingQuestions.length ? existingQuestions : generateDefinitionQuiz(extractedText);
}
