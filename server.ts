import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// Fallback citizen knowledge engine
function getFallbackResponse(query: string, language: string): string {
  const q = query.toLowerCase();
  const isBn = language === 'bn' || /[\u0980-\u09FF]/.test(query) || q.includes('kibhabe') || q.includes('lagbe') || q.includes('ache');

  if (q.includes('pan') || q.includes('প্যান')) {
    return isBn
      ? "নতুন প্যান কার্ড বা সংশোধনের জন্য প্রয়োজন: ১) আধার কার্ড (বয়স ও ঠিকানার প্রমাণ), ২) পাসপোর্ট সাইজ ফটো (২ কপি), ৩) সই বা টিপসই। সরকারি ফি ₹১০৭। অনলাইনে আবেদন করার পর ৭-১০ কার্যদিবসে ই-প্যান ও ১৫ দিনে ফিজিক্যাল কার্ড স্পিড পোস্টে পৌঁছে যাবে।"
      : "For PAN Card (New or Correction): 1) Aadhaar Card (for Identity, DOB & Address proof), 2) Two passport-sized photographs, 3) Signature/Thumb impression. Official fee is ₹107. e-PAN is generated within 3-7 days and physical card is delivered via Speed Post within 15 working days.";
  }

  if (q.includes('voter') || q.includes('ভোটার') || q.includes('epic')) {
    return isBn
      ? "ভোটার কার্ডের নতুন আবেদন (Form 6), সংশোধন (Form 8) বা শিফটিংয়ের জন্য আধার কার্ড, বয়সের প্রমাণপত্র এবং ঠিকানার প্রমাণ দরকার। আবেদন জমা হওয়ার পর BLO ভেরিফিকেশন হবে এবং ২০-২৫ দিনের মধ্যে নতুন কার্ড প্রস্তুত হয়।"
      : "For Voter ID (New EPIC Form 6, Correction Form 8): Required documents are Aadhaar, Age proof (10th admit/Birth cert), and Address proof. After online submission, BLO verification takes place and new EPIC card is issued within 2-3 weeks.";
  }

  if (q.includes('ration') || q.includes('রেশন') || q.includes('khadya') || q.includes('e-kyc')) {
    return isBn
      ? "রেশন কার্ডে আধার লিঙ্কিং (e-KYC) এবং নতুন সদস্য যোগের জন্য খাদ্য সাথী পোর্টালে ফর্ম ৪ বা আধার OTP দ্বারা যাচাই করা যায়। কোনো ফি লাগে না। ইজি সেবা কেন্দ্রে বায়োমেট্রিক বা ওটিপি দিয়ে মাত্র ২ মিনিটে ই-কেওয়াইসি সম্পন্ন করা হয়।"
      : "For Ration Card Aadhaar linking (e-KYC) or adding family members: Use Form 4 with family Aadhaar cards. e-KYC is 100% free and can be done at any EzySeva kiosk in 2 minutes via fingerprint biometric or OTP.";
  }

  if (q.includes('birth') || q.includes('জন্ম') || q.includes('certificate')) {
    return isBn
      ? "জন্ম সনদের জন্য: হাসপাতালের ডিসচার্জ সার্টিফিকেট / জন্ম রিপোর্ট, মা-বাবার আধার ও ভোটার কার্ড। ২১ দিনের মধ্যে আবেদন করলে কোনো বিলম্ব ফি নেই। ১ বছরের বেশি বিলম্ব হলে মহকুমা শাসকের (SDO) অর্ডার প্রয়োজন।"
      : "For Birth Certificate: Hospital Discharge summary/Birth slip, parents' Aadhaar and address proofs. Within 21 days it is processed without late fee. Beyond 1 year, SDO/Executive Magistrate delayed registration approval is required.";
  }

  if (q.includes('caste') || q.includes('জাতি') || q.includes('obc') || q.includes('sc') || q.includes('st')) {
    return isBn
      ? "জাতিগত শংসাপত্র (SC/ST/OBC): পারিবারিক বংশলতিকা (Blood relation certificate), ১৯৫০/১৯৭১ এর পূর্বপুরুষের বসবাস সংক্রান্ত নথিপত্র, স্থানীয় পঞ্চায়েত/কাউন্সিলর সার্টিফিকেট এবং আধার কার্ড প্রয়োজন।"
      : "For Caste Certificate (SC/ST/OBC): Requires ancestral lineage evidence (prior to 1950 for SC/ST, prior to 1993 for OBC), Blood relation certificate, local body recommendation, and Aadhaar card.";
  }

  if (q.includes('electric') || q.includes('বিদ্যুৎ') || q.includes('wbsedcl') || q.includes('bill')) {
    return isBn
      ? "বিদ্যুৎ বিল পেমেন্ট: আপনার ৯ সংখ্যার Consumer ID দিন। বিল দেখার সাথে সাথে UPI, ডেবিট কার্ড বা ক্যাশে বিল পরিশোধ করুন এবং তাৎক্ষণিক সরকারি ডিজিটাল মানি রসিদ ডাউনলোড করুন।"
      : "For Electricity Bill: Enter your 9-digit Consumer ID. You can instantly fetch outstanding dues, pay via UPI/Cards/Netbanking, and download the authenticated payment receipt with transaction ID.";
  }

  return isBn
    ? "ইজি সেবা নাগরিক সহায়তা কেন্দ্রে আপনাকে স্বাগতম। আপনি প্যান কার্ড, ভোটার কার্ড, আধার সংক্রান্ত সহায়তা, রেশন কার্ড e-KYC, জন্ম সনদ, বিদ্যুৎ বিল বা সরকারি ভাতা সংক্রান্ত যেকোনো তথ্যের জন্য নির্দিষ্ট পরিষেবার 'Apply Now' বাটনে ক্লিক করতে পারেন অথবা আপনার প্রশ্নটি বিস্তারিত লিখুন।"
    : "Welcome to EzySeva Citizen Helpdesk. You can apply directly for PAN, Voter ID, Aadhaar assistance, Ration card, Birth certificate, WBSEDCL bills, or pensions. Click 'Apply Now' on the service card or ask me any query regarding required documents, fees, and government procedures!";
}

// Health route
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'EzySeva Portal API' });
});

// AI Seva Sahayak (Citizen Assistant)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language = 'en', history = [] } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getAi();
    if (!ai) {
      const fallback = getFallbackResponse(message, language);
      return res.json({ reply: fallback, source: 'knowledge-base' });
    }

    const systemPrompt = `You are 'EzySeva Sahayak' (ইজি সেবা সহায়ক), an empathetic, highly knowledgeable, and friendly citizen service assistant for India (specifically West Bengal and national citizen services).
You assist citizens with government documents (Aadhaar, PAN, Voter EPIC, Ration card/Khadya Sathi, Birth/Death certificate, Caste SC/ST/OBC, Income/Domicile), social welfare schemes (Lakshmir Bhandar, Kanyashree, Student Credit Card, PM Kisan, Old Age Pension), and utility bill payments (WBSEDCL, CESC, FASTag).

Guidelines:
- If user speaks Bengali or English, respond in the corresponding language with natural, polite, and helpful tone.
- Give concrete, actionable answers: list exact required documents, official fees, expected timeline, and step-by-step guidance.
- Keep answers concise, clear, and structured with bullet points.
- Never invent misleading government laws. Emphasize that EzySeva kiosks help them submit official verified applications easily.`;

    const promptText = `User Query: ${message}\nPreferred language: ${language}`;
    const result = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.4,
      },
    });

    const reply = result.text || getFallbackResponse(message, language);
    return res.json({ reply, source: 'gemini' });
  } catch (error) {
    console.error('Gemini chat error:', error);
    const fallback = getFallbackResponse(req.body.message || '', req.body.language || 'en');
    return res.json({ reply: fallback, source: 'fallback' });
  }
});

// Announcements & News Bulletins
app.get('/api/announcements', (_req, res) => {
  res.json([
    {
      id: 'ann-1',
      title: 'Aadhaar-Ration Card e-KYC deadline extended',
      titleBn: 'আধার-রেশন কার্ড ই-কেওয়াইসি করার সময়সীমা বৃদ্ধি করা হয়েছে',
      tag: 'Urgent',
      date: 'Latest Notice',
    },
    {
      id: 'ann-2',
      title: 'West Bengal Student Credit Card scheme portal active for 2026',
      titleBn: 'স্টুডেন্ট ক্রেডিট কার্ড পোর্টাল ২০২৬ শিক্ষাবর্ষের জন্য সক্রিয়',
      tag: 'Education',
      date: 'New Update',
    },
    {
      id: 'ann-3',
      title: 'New Voter Card (Form 6) special registration camp this Saturday',
      titleBn: 'নতুন ভোটার কার্ড (ফর্ম ৬) আবেদন ক্যাম্প এই শনিবার সমস্ত কেন্দ্রে',
      tag: 'Election Commission',
      date: 'Camp Alert',
    },
  ]);
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EzySeva server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
