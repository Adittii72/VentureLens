# VentureLens - VC Intelligence Platform

A modern venture capital discovery interface with live AI-powered company enrichment.

## Features

- 🏢 Company discovery with search and filters
- 🤖 Live AI enrichment using Google Gemini API
- 📝 Company profiles with notes and signals
- 💾 Save companies to watchlists
- 📊 Export saved lists (CSV/JSON)
- 🎨 Clean, professional UI with responsive design

## Tech Stack

- Next.js 14
- React 18
- Google Gemini AI
- Cheerio (web scraping)
- CSS Modules

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

To get a Gemini API key:
1. Visit https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy and paste it into your `.env.local` file

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add `GEMINI_API_KEY` environment variable in Vercel dashboard
4. Deploy

### Netlify

1. Build the project: `npm run build`
2. Deploy the `.next` folder
3. Add environment variables in Netlify dashboard

## Project Structure

```
├── components/          # React components
│   ├── Navbar.js
│   ├── Hero.js
│   └── About.js
├── pages/
│   ├── index.js        # Home page
│   ├── companies/
│   │   ├── index.js    # Companies list
│   │   └── [id].js     # Company profile
│   ├── saved.js        # Saved companies
│   └── api/
│       └── enrich.js   # AI enrichment endpoint
├── data/
│   └── companies.json  # Mock company data
└── styles/             # CSS modules

```

## Features Breakdown

### Company Discovery
- Search by name or domain
- Filter by industry
- Sortable company cards
- Quick access to company websites

### AI Enrichment
- Click "Enrich" on any company profile
- Fetches and analyzes company website
- Extracts:
  - Summary (1-2 sentences)
  - What they do (3-6 bullets)
  - Keywords (5-10)
  - Signals (hiring, blog activity, etc.)
- Shows sources with timestamps
- Caches results in localStorage

### Company Profiles
- Overview with basic info
- AI enrichment section
- Notes (persisted in localStorage)
- Save/unsave functionality

### Saved Lists
- View all saved companies
- Export as JSON or CSV
- Remove companies from list

## Security

- API keys are stored server-side only
- Enrichment runs through `/api/enrich` endpoint
- No client-side exposure of sensitive data
- Only public web pages are scraped

## Data Storage

- Company data: `data/companies.json`
- Enrichment cache: localStorage
- Notes: localStorage
- Saved lists: localStorage

## Future Enhancements

- [ ] User authentication
- [ ] Database integration
- [ ] Multiple watchlists
- [ ] Advanced search filters
- [ ] Signal scoring
- [ ] Email notifications
- [ ] CRM integrations

## License

MIT

## Author

Built for VC intelligence workflows
