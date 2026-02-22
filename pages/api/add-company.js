import fs from 'fs';
import path from 'path';
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
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `Analyze this company website and extract information:

Title: ${scrapedData.title}
Description: ${scrapedData.metaDescription}
Content: ${scrapedData.content.substring(0, 5000)}

Extract the following information and provide as JSON:
- companyName: The actual company name (from title or content)
- domain: Industry/sector (e.g., "Fintech", "SaaS", "E-commerce", "Travel", "AI", "Healthcare")
- description: 1 concise sentence about what they do
- summary: 2-3 sentences detailed summary
- whatTheyDo: Array of 3-6 bullet points about their products/services
- keywords: Array of 5-10 relevant keywords
- signals: Array of 2-4 business signals (e.g., "Hiring actively", "Recent funding", "Global presence", "Mobile app available")
- founded: Founding year as a 4-digit number (e.g., "2008") - look for "Founded", "Since", "Established" in content. If not found, estimate based on company maturity or use "2015" as default
- stage: Funding stage - choose from: "Seed", "Series A", "Series B", "Series C", "Series D+", "Public", "Acquired", or "Private". For well-known companies, use "Public" or "Private". Default to "Series B" if unknown.

IMPORTANT: 
- For founded year, search the content carefully for founding information
- For stage, if it's a well-known large company, use "Public" or "Private"
- Make educated guesses based on company size and presence rather than leaving as "Unknown"

Return ONLY valid JSON with all fields filled.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const parsed = JSON.parse(cleanText);
      return {
        companyName: parsed.companyName || scrapedData.title.split('|')[0].trim(),
        domain: parsed.domain || 'Technology',
        description: parsed.description || scrapedData.metaDescription || 'No description available',
        summary: parsed.summary || scrapedData.metaDescription || 'No summary available',
        whatTheyDo: Array.isArray(parsed.whatTheyDo) ? parsed.whatTheyDo : ['Information not available'],
        keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
        signals: Array.isArray(parsed.signals) ? parsed.signals : ['Website accessible'],
        founded: parsed.founded || '2015',
        stage: parsed.stage || 'Series B'
      };
    } catch (parseError) {
      return {
        companyName: scrapedData.title.split('|')[0].trim(),
        domain: 'Technology',
        description: scrapedData.metaDescription || 'No description available',
        summary: scrapedData.metaDescription || 'No summary available',
        whatTheyDo: ['Information not available'],
        keywords: [],
        signals: ['Website accessible'],
        founded: '2015',
        stage: 'Series B'
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

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    // Read existing companies from the static file
    const filePath = path.join(process.cwd(), 'data', 'companies.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const companies = JSON.parse(fileData);

    // Check if URL already exists
    const existingCompany = companies.find(c => c.website === url);
    if (existingCompany) {
      // Return existing company data with enrichment
      const scrapedData = await scrapeWebsite(url);
      if (!scrapedData) {
        return res.status(500).json({ error: 'Failed to scrape website' });
      }

      const enrichedData = await enrichWithAI(scrapedData);

      return res.status(200).json({
        alreadyExists: true,
        company: existingCompany,
        enrichment: {
          ...enrichedData,
          sources: [{
            url: url,
            timestamp: new Date().toISOString(),
            title: scrapedData.title
          }]
        }
      });
    }

    // Scrape and enrich new company
    const scrapedData = await scrapeWebsite(url);
    if (!scrapedData) {
      return res.status(500).json({ error: 'Failed to scrape website' });
    }

    const enrichedData = await enrichWithAI(scrapedData);

    // Create new company entry (but don't save to file in production)
    const newCompany = {
      id: enrichedData.companyName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      name: enrichedData.companyName,
      domain: enrichedData.domain,
      website: url,
      description: enrichedData.description,
      founded: enrichedData.founded,
      stage: enrichedData.stage,
      addedAt: new Date().toISOString()
    };

    // In production (Vercel), we can't write to files
    // The client will handle saving to localStorage
    // Only try to write in development
    if (process.env.NODE_ENV === 'development') {
      try {
        companies.push(newCompany);
        fs.writeFileSync(filePath, JSON.stringify(companies, null, 2));
      } catch (writeError) {
        console.log('Could not write to file (expected in production):', writeError.message);
      }
    }

    return res.status(200).json({
      alreadyExists: false,
      company: newCompany,
      enrichment: {
        summary: enrichedData.summary,
        whatTheyDo: enrichedData.whatTheyDo,
        keywords: enrichedData.keywords,
        signals: enrichedData.signals,
        sources: [{
          url: url,
          timestamp: new Date().toISOString(),
          title: scrapedData.title
        }]
      }
    });
  } catch (error) {
    console.error('Add company error:', error);
    return res.status(500).json({ 
      error: 'Failed to add company', 
      details: error.message 
    });
  }
}
