import Head from 'next/head';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Companies from '../components/Companies';
import SavedList from '../components/SavedList';

export default function Home() {
  return (
    <>
      <Head>
        <title>VentureLens - Smarter Venture Intelligence</title>
        <meta name="description" content="Track, enrich, and evaluate startups faster" />
      </Head>
      <Navbar />
      <Hero />
      <About />
      <Companies />
      <SavedList />
    </>
  );
}
