import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import * as cheerio from 'cheerio';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function scrapeWebsite(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    $('script').remove();
    $('style').remove();
    $('nav').remove();
    $('footer').remove();
    
    const text = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 8000);
    const title = $('title').text();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    
    return {
      title,
      metaDescription,
      content: text,
      url
    };
  } catch (error) {
    console.error('Scrape error:', error.message);
    return null;
  }
}

async function enrichWithAI(scrapedData) {
  try {
    if (!genAI) {
      throw new Error('Gemini AI not initialized');
    }

    // Use gemini-2.5-flash which is available in the v1 API
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `Analyze this company website content and extract structured information:

Title: ${scrapedData.title}
Description: ${scrapedData.metaDescription}
Content: ${scrapedData.content.substring(0, 5000)}

Please provide a JSON response with these exact keys:
- summary: A 1-2 sentence summary of what the company does
- whatTheyDo: An array of 3-6 bullet points describing their main products/services
- keywords: An array of 5-10 relevant keywords
- signals: An array of 2-4 signals (e.g., "Has careers page", "Recent blog posts", "Active development")

Return ONLY valid JSON, no markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Remove markdown code blocks if present
    let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const parsed = JSON.parse(cleanText);
      return {
        summary: parsed.summary || 'No summary available',
        whatTheyDo: Array.isArray(parsed.whatTheyDo) ? parsed.whatTheyDo : ['No data available'],
        keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
        signals: Array.isArray(parsed.signals) ? parsed.signals : []
      };
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        summary: cleanText.substring(0, 200),
        whatTheyDo: ['AI analysis completed but structured data unavailable'],
        keywords: ['technology', 'innovation'],
        signals: ['Website accessible']
      };
    }
  } catch (error) {
    console.error('AI enrichment error:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, companyId } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const scrapedData = await scrapeWebsite(url);
    
    if (!scrapedData) {
      return res.status(500).json({ error: 'Failed to scrape website' });
    }

    const enrichedData = await enrichWithAI(scrapedData);

    const result = {
      ...enrichedData,
      sources: [
        {
          url: url,
          timestamp: new Date().toISOString(),
          title: scrapedData.title
        }
      ],
      enrichedAt: new Date().toISOString(),
      companyId
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error('Enrichment error:', error);
    return res.status(500).json({ 
      error: 'Enrichment failed', 
      details: error.message 
    });
  }
}
