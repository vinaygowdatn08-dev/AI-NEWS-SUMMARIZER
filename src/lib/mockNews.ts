export interface GNewsArticle {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

const MOCK_NEWS_DATA: Record<string, Array<{ title: string; description: string; url: string; image: string; source: string }>> = {
  technology: [
    {
      title: "OpenAI Announces GPT-5 with Human-Like Reasoning Capabilities",
      description: "OpenAI has officially launched its next-generation artificial intelligence model, GPT-5, claiming it exhibits human-level performance on various professional and academic benchmarks.",
      url: "https://example.com/tech/gpt-5-release",
      image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
      source: "TechCrunch"
    },
    {
      title: "Quantum Computing Reaches Crucial Milestone in Error Correction",
      description: "Researchers at leading quantum computing facilities have demonstrated a major reduction in logical error rates, paving the way for commercial-grade fault-tolerant systems.",
      url: "https://example.com/tech/quantum-milestone",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
      source: "Nature Physics"
    },
    {
      title: "Next-Gen Solid-State Battery Promises 1000-Mile Electric Vehicle Range",
      description: "A breakthrough in solid-electrolyte technology has cleared safety hurdles, bringing ultra-fast charging solid-state batteries closer to production.",
      url: "https://example.com/tech/solid-state-battery",
      image: "https://images.unsplash.com/photo-1558441719-ff34b0524a24?auto=format&fit=crop&w=800&q=80",
      source: "Wired"
    }
  ],
  business: [
    {
      title: "Global Markets Rally as Inflation Tumbles Below Target",
      description: "Stocks reached record highs today as central banks hinted at rate cuts following a faster-than-expected decline in consumer price indices.",
      url: "https://example.com/business/markets-rally",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
      source: "Bloomberg"
    },
    {
      title: "Major Tech Companies Announce Coalition to Standardize Remote Work Rights",
      description: "A coalition of tech giants has committed to a unified framework for employee choice, flexibility, and equipment subsidies for hybrid environments.",
      url: "https://example.com/business/remote-work-coalition",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      source: "Forbes"
    }
  ],
  science: [
    {
      title: "Webb Telescope Detects Atmosphere on Earth-Sized Exoplanet",
      description: "Astronomers have detected signs of carbon dioxide and water vapor in the atmosphere of a planet orbiting a nearby M-dwarf star, a key step in the search for habitable worlds.",
      url: "https://example.com/science/webb-exoplanet",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
      source: "NASA SpaceFlight"
    },
    {
      title: "Gene Therapy Successfully Reverses Age-Related Vision Loss in Mice",
      description: "Scientists at Harvard Medical School have restored the sight of aging mice using a combination of cellular reprogramming factors.",
      url: "https://example.com/science/gene-therapy-vision",
      image: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=800&q=80",
      source: "Science Daily"
    }
  ],
  health: [
    {
      title: "New Universal Influenza Vaccine Enters Final Phase of Clinical Trials",
      description: "A highly anticipated mRNA-based universal flu vaccine that targets stable regions of the virus has begun Phase 3 trials, promising multi-season protection.",
      url: "https://example.com/health/universal-flu-vaccine",
      image: "https://images.unsplash.com/photo-1584036561566-baf241830990?auto=format&fit=crop&w=800&q=80",
      source: "The Lancet"
    },
    {
      title: "Deep Sleep Found to Act as a Natural Shield Against Alzheimer's",
      description: "A new neuroimaging study reveals that deep, slow-wave sleep helps clear beta-amyloid plaques from the brain, potentially slowing cognitive decline.",
      url: "https://example.com/health/sleep-alzheimers",
      image: "https://images.unsplash.com/photo-1511295742364-5a6bfa9e390c?auto=format&fit=crop&w=800&q=80",
      source: "Harvard Health"
    }
  ],
  sports: [
    {
      title: "Underdog Team Triumphs in Historic World Cup Final",
      description: "In one of the most thrilling matches in tournament history, the underdogs secured the trophy after a dramatic penalty shootout.",
      url: "https://example.com/sports/world-cup-final",
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
      source: "ESPN"
    },
    {
      title: "Tennis Legend Announces Retirement After Record-Breaking Career",
      description: "The 24-time Grand Slam champion has announced that the upcoming US Open will be their final professional tournament.",
      url: "https://example.com/sports/tennis-retirement",
      image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80",
      source: "Sports Illustrated"
    }
  ],
  entertainment: [
    {
      title: "Highly Anticipated Sci-Fi Sequel Smashes Box Office Records",
      description: "Opening weekend sales have surpassed projections, securing the film's spot as the biggest cinematic event of the year.",
      url: "https://example.com/entertainment/box-office-record",
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
      source: "Variety"
    },
    {
      title: "Indie Game Developer Wins Game of the Year at Annual Awards",
      description: "An emotionally driven, hand-drawn puzzle adventure created by a small team has taken the top honor, beating several triple-A blockbusters.",
      url: "https://example.com/entertainment/indie-game-award",
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80",
      source: "IGN"
    }
  ],
  politics: [
    {
      title: "Historic Climate Accord Signed by 150 Countries at Global Summit",
      description: "The new agreement establishes legally binding targets for carbon emissions reductions and a trillion-dollar green infrastructure fund.",
      url: "https://example.com/politics/climate-accord",
      image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
      source: "Reuters"
    }
  ],
  world: [
    {
      title: "Renewable Energy Infrastructure Expands Across Developing Nations",
      description: "A joint initiative by international development banks has completed the installation of mega solar grids, bringing electricity to millions.",
      url: "https://example.com/world/solar-grids",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
      source: "BBC News"
    }
  ],
  finance: [
    {
      title: "DeFi Protocol Reaches Record Total Value Locked of $150 Billion",
      description: "Decentralized finance systems continue to gain institutional trust, with massive inflows into automated yield generation pools.",
      url: "https://example.com/finance/defi-record",
      image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=800&q=80",
      source: "Financial Times"
    }
  ],
  education: [
    {
      title: "Interactive AI Tutors Show 40% Improvement in Student Test Scores",
      description: "A nationwide study across primary schools shows that adaptive AI tutoring companions help close the learning gap in mathematics.",
      url: "https://example.com/education/ai-tutors",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
      source: "EdTech Magazine"
    }
  ],
  environment: [
    {
      title: "Great Barrier Reef Shows Promising Coral Recovery Following Seeding Effort",
      description: "Marine biologists report record levels of new coral growth after deploying high-tech heat-tolerant coral larvae seeding techniques.",
      url: "https://example.com/environment/coral-recovery",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      source: "National Geographic"
    }
  ],
  travel: [
    {
      title: "Top 10 Eco-Friendly Destinations for Your Next Adventure",
      description: "From carbon-neutral rainforest lodges in Costa Rica to electric-vehicle-only alpine villages in Switzerland, discover sustainable travel options.",
      url: "https://example.com/travel/eco-destinations",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
      source: "Lonely Planet"
    }
  ],
  food: [
    {
      title: "Culinary Fusion: How Chefs are Adapting to Climate-Resilient Ingredients",
      description: "A new wave of Michelin-starred restaurants is building menus around drought-resistant crops like millet and local regeneratively farmed seaweeds.",
      url: "https://example.com/food/resilient-menus",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      source: "Bon Appétit"
    }
  ],
  lifestyle: [
    {
      title: "The Rise of Micro-Habits: Why Small Changes Lead to Lasting Well-Being",
      description: "Behavioral psychologists explain why focusing on two-minute daily rituals is more effective than setting ambitious, overwhelming resolutions.",
      url: "https://example.com/lifestyle/micro-habits",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
      source: "Psychology Today"
    }
  ],
  gaming: [
    {
      title: "Next-Gen Virtual Reality Headset Unveiled with Neural Interface Support",
      description: "A major hardware developer has announced a lightweight VR headset that translates subtle user brainwaves into in-game actions.",
      url: "https://example.com/gaming/neural-vr",
      image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80",
      source: "Polygon"
    }
  ]
};

export function getMockNewsForTopics(topics: string[]): GNewsArticle[] {
  const articles: GNewsArticle[] = [];
  const hoursOffset = 1;

  topics.forEach((topic) => {
    const key = topic.trim().toLowerCase();
    const mockData = MOCK_NEWS_DATA[key] || MOCK_NEWS_DATA["technology"];
    
    mockData.forEach((item, index) => {
      // Create a unique time offset so they are sorted nicely
      const date = new Date();
      date.setHours(date.getHours() - (index * 2 + hoursOffset));

      articles.push({
        title: `[AI Curated] ${item.title}`,
        description: item.description,
        url: `${item.url}?topic=${key}&id=${index}`,
        image: item.image,
        publishedAt: date.toISOString(),
        source: {
          name: item.source,
          url: "https://example.com"
        }
      });
    });
  });

  return articles;
}

export function getMockNewsForExplore(query: string): GNewsArticle[] {
  // Return some matching categories or fallback to general tech/business mock news
  const normalizedQuery = query.toLowerCase();
  const matchedTopics = Object.keys(MOCK_NEWS_DATA).filter(
    (key) => normalizedQuery.includes(key) || key.includes(normalizedQuery)
  );

  const topicsToUse = matchedTopics.length > 0 ? matchedTopics : ["technology", "business"];
  return getMockNewsForTopics(topicsToUse);
}
