// Centralized mock data for development
export const mockSentimentData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  positive: Math.floor(Math.random() * 40 + 40),
  negative: Math.floor(Math.random() * 30 + 15),
  neutral: Math.floor(Math.random() * 20 + 10),
}))

export const mockViralData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  shares: Math.floor(Math.pow(i + 1, 1.8) * 120 + Math.random() * 5000),
  reach: Math.floor(Math.pow(i + 1, 1.9) * 500 + Math.random() * 20000),
}))

export const mockTopics = [
  { id: '1', name: 'AI Regulation Bill', category: 'Politics', sentiment: 0.32, virality: 94, misinfo: false, posts: 128400, growth: '+340%' },
  { id: '2', name: 'COVID Vaccine Update', category: 'Health', sentiment: -0.18, virality: 76, misinfo: true, posts: 84200, growth: '+210%' },
  { id: '3', name: 'Tesla Autopilot Crash', category: 'Technology', sentiment: -0.65, virality: 88, misinfo: false, posts: 203100, growth: '+520%' },
  { id: '4', name: 'India Moon Mission', category: 'Science', sentiment: 0.82, virality: 71, misinfo: false, posts: 156800, growth: '+280%' },
  { id: '5', name: '5G Health Conspiracy', category: 'Health', sentiment: -0.91, virality: 63, misinfo: true, posts: 42300, growth: '+95%' },
  { id: '6', name: 'Gaza Ceasefire Talks', category: 'Politics', sentiment: -0.44, virality: 97, misinfo: false, posts: 389200, growth: '+780%' },
  { id: '7', name: 'OpenAI GPT-6 Leak', category: 'Technology', sentiment: 0.51, virality: 86, misinfo: true, posts: 67100, growth: '+440%' },
  { id: '8', name: 'Climate Record Broken', category: 'Environment', sentiment: -0.38, virality: 58, misinfo: false, posts: 91400, growth: '+165%' },
]

export const mockHeatmapData = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => ({
    day,
    hour,
    value: Math.floor(Math.random() * 100),
  }))
).flat()

export const mockMisinfoItems = [
  { id: '1', content: 'Vaccines contain microchips activated by 5G towers', category: 'Health', confidence: 0.97, spread: 42800, firstSeen: '2024-01-15', platforms: ['Twitter', 'Facebook', 'WhatsApp'], status: 'confirmed' },
  { id: '2', content: 'Bill Gates admits to depopulation agenda in leaked video', category: 'Politics', confidence: 0.94, spread: 31200, firstSeen: '2024-01-18', platforms: ['YouTube', 'Telegram'], status: 'confirmed' },
  { id: '3', content: 'New COVID strain kills within 24 hours', category: 'Health', confidence: 0.88, spread: 19400, firstSeen: '2024-01-20', platforms: ['Twitter', 'WhatsApp'], status: 'investigating' },
  { id: '4', content: 'Moon landing was filmed in Hollywood studio', category: 'Science', confidence: 0.99, spread: 8900, firstSeen: '2024-01-10', platforms: ['YouTube', 'Reddit'], status: 'confirmed' },
]

export const mockActivityStream = [
  { id: '1', type: 'content_analyzed', user: 'researcher_01', action: 'Analyzed 1.2K tweets on #AIBill', time: '2s ago', severity: 'info' },
  { id: '2', type: 'misinfo_flagged', user: 'system', action: 'High-confidence misinfo detected in Health cluster', time: '18s ago', severity: 'error' },
  { id: '3', type: 'viral_alert', user: 'system', action: 'Topic "Tesla Crash" crossed 200K threshold', time: '1m ago', severity: 'warning' },
  { id: '4', type: 'user_joined', user: 'admin', action: 'New researcher account approved: dr.sharma@iit.ac.in', time: '3m ago', severity: 'success' },
  { id: '5', type: 'dataset_ingested', user: 'pipeline', action: 'Reddit dataset (890K posts) processed', time: '7m ago', severity: 'info' },
  { id: '6', type: 'report_generated', user: 'researcher_02', action: 'Monthly sentiment report exported (PDF)', time: '12m ago', severity: 'info' },
  { id: '7', type: 'scraper_run', user: 'system', action: 'Web scraper completed: 15 sources, 24K articles', time: '22m ago', severity: 'info' },
  { id: '8', type: 'misinfo_flagged', user: 'system', action: 'Coordinated inauthentic behavior detected', time: '35m ago', severity: 'error' },
]

export const mockApiStatus = [
  { name: 'REST API Gateway', status: 'operational', latency: 42, uptime: 99.98 },
  { name: 'AI/ML Service (FastAPI)', status: 'operational', latency: 218, uptime: 99.81 },
  { name: 'WebSocket Server', status: 'operational', latency: 8, uptime: 99.99 },
  { name: 'Redis Cache', status: 'operational', latency: 1, uptime: 100 },
  { name: 'MongoDB Primary', status: 'operational', latency: 12, uptime: 99.97 },
  { name: 'Kafka Message Queue', status: 'degraded', latency: 450, uptime: 98.4 },
  { name: 'Web Scraper Service', status: 'operational', latency: 890, uptime: 97.2 },
  { name: 'Email/Notification Service', status: 'operational', latency: 180, uptime: 99.5 },
]

export const mockSystemMetrics = {
  cpu: Array.from({ length: 20 }, () => Math.floor(Math.random() * 40 + 30)),
  memory: Array.from({ length: 20 }, () => Math.floor(Math.random() * 20 + 55)),
  requests: Array.from({ length: 20 }, () => Math.floor(Math.random() * 500 + 1200)),
  errors: Array.from({ length: 20 }, () => Math.floor(Math.random() * 10 + 2)),
}

export const mockUsers = [
  { id: '1', name: 'Dr. Priya Sharma', email: 'priya@iit.ac.in', role: 'researcher', status: 'active', joined: '2024-01-10', analyses: 142 },
  { id: '2', name: 'Rohit Mehta', email: 'rohit@example.com', role: 'user', status: 'active', joined: '2024-01-15', analyses: 23 },
  { id: '3', name: 'Kavya Nair', email: 'kavya@interndrive.in', role: 'admin', status: 'active', joined: '2023-12-01', analyses: 890 },
  { id: '4', name: 'Arjun Patel', email: 'arjun@media.org', role: 'researcher', status: 'suspended', joined: '2024-01-20', analyses: 67 },
  { id: '5', name: 'Neha Singh', email: 'neha@university.edu', role: 'researcher', status: 'active', joined: '2024-01-08', analyses: 234 },
]

export const mockContentFeed = [
  { id: '1', title: 'New study shows social media exposure increases anxiety by 34%', source: 'Nature.com', category: 'Health', sentiment: -0.42, virality: 67, timestamp: '2h ago', shares: 18400, misinfo: false, image: 'health' },
  { id: '2', title: 'OpenAI announces GPT-5 with 10x reasoning capability', source: 'TechCrunch', category: 'Technology', sentiment: 0.78, virality: 92, timestamp: '4h ago', shares: 94200, misinfo: false, image: 'tech' },
  { id: '3', title: 'Government secretly installing surveillance in 5G towers', source: 'Unknown Blog', category: 'Politics', sentiment: -0.88, virality: 58, timestamp: '6h ago', shares: 31000, misinfo: true, image: 'politics' },
  { id: '4', title: 'India GDP growth outpaces China for third consecutive quarter', source: 'Reuters', category: 'Economy', sentiment: 0.61, virality: 74, timestamp: '8h ago', shares: 42100, misinfo: false, image: 'economy' },
  { id: '5', title: 'Climate scientists warn Arctic ice may vanish by 2027', source: 'BBC', category: 'Environment', sentiment: -0.71, virality: 81, timestamp: '10h ago', shares: 67800, misinfo: false, image: 'environment' },
]

export const mockLogs = [
  { id: '1', level: 'INFO', service: 'api-gateway', message: 'POST /api/content/analyze 200 218ms', timestamp: new Date().toISOString() },
  { id: '2', level: 'WARN', service: 'ml-service', message: 'High latency detected: sentiment model took 1.2s', timestamp: new Date(Date.now() - 5000).toISOString() },
  { id: '3', level: 'ERROR', service: 'kafka', message: 'Consumer lag exceeded threshold: topic=content-ingestion', timestamp: new Date(Date.now() - 12000).toISOString() },
  { id: '4', level: 'INFO', service: 'scraper', message: 'Successfully scraped 892 articles from 15 sources', timestamp: new Date(Date.now() - 25000).toISOString() },
  { id: '5', level: 'INFO', service: 'auth', message: 'JWT token issued for user: priya@iit.ac.in', timestamp: new Date(Date.now() - 45000).toISOString() },
  { id: '6', level: 'ERROR', service: 'mongodb', message: 'Slow query detected: 4.2s on content.aggregate()', timestamp: new Date(Date.now() - 60000).toISOString() },
  { id: '7', level: 'INFO', service: 'redis', message: 'Cache hit ratio: 94.2% | evictions: 23', timestamp: new Date(Date.now() - 90000).toISOString() },
  { id: '8', level: 'WARN', service: 'rate-limiter', message: 'IP 103.45.67.89 exceeded rate limit (200/min)', timestamp: new Date(Date.now() - 120000).toISOString() },
]
