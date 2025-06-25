import React, { useState, useEffect, useCallback } from ‘react’;
import {
Plus,
Github,
Lightbulb,
Target,
Users,
TrendingUp,
Brain,
FileText,
Settings,
Upload,
Download,
MessageSquare,
Eye,
RotateCw,
CheckCircle,
XCircle,
Archive,
Edit3,
Zap,
DollarSign,
Calendar,
Shield,
Star,
Send,
Loader,
AlertCircle,
ChevronRight,
Filter,
Search,
UserPlus,
ExternalLink,
Presentation,
BarChart3,
Timer,
Trophy,
Sparkles,
RefreshCw,
PlusCircle,
ArrowRight,
Clock,
ThumbsUp,
ThumbsDown,
BookOpen,
Rocket
} from ‘lucide-react’;

const ID8Platform = () => {
const [ideas, setIdeas] = useState([]);
const [selectedIdea, setSelectedIdea] = useState(null);
const [showOnboarding, setShowOnboarding] = useState(false);
const [userProfile, setUserProfile] = useState(null);
const [draggedItem, setDraggedItem] = useState(null);
const [showIdeaModal, setShowIdeaModal] = useState(false);
const [loading, setLoading] = useState(false);
const [aiResponse, setAiResponse] = useState(’’);
const [showResumeUpload, setShowResumeUpload] = useState(false);
const [teamMembers, setTeamMembers] = useState([]);
const [showTeamModal, setShowTeamModal] = useState(false);
const [githubTrends, setGithubTrends] = useState([]);
const [showAnalysisModal, setShowAnalysisModal] = useState(false);
const [currentAnalysis, setCurrentAnalysis] = useState(null);

// Mock Groq API function (in real app, this would call actual Groq API)
const callGroqAPI = async (prompt, structuredOutput = true) => {
setLoading(true);
await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay

```
const mockResponses = {
  idea_generation: {
    title: "AI-Powered Code Review Assistant",
    description: "An intelligent code review tool that uses machine learning to identify bugs, security vulnerabilities, and performance issues before they reach production.",
    market_size: "Large ($2.8B developer tools market)",
    target_audience: "Software development teams at scale-ups and enterprises",
    competitive_advantage: "Advanced ML models trained on millions of code reviews",
    business_model: "SaaS subscription with usage-based pricing",
    technical_feasibility: 8.5,
    market_opportunity: 9.2,
    competitive_moat: 7.8,
    founder_fit: 8.9,
    overall_score: 8.6,
    tags: ["DevTools", "AI/ML", "B2B", "SaaS"],
    next_steps: [
      "Build MVP with basic static analysis",
      "Train ML models on open source repositories",
      "Validate with 10 development teams",
      "Secure seed funding for ML infrastructure"
    ]
  },
  deep_dive_analysis: {
    product_analysis: {
      core_features: ["Real-time code analysis", "Security vulnerability detection", "Performance optimization suggestions", "Integration with popular IDEs"],
      technical_complexity: "High - requires sophisticated ML models and real-time processing",
      development_timeline: "12-18 months to MVP, 24 months to market-ready",
      scalability_challenges: ["Model inference latency", "Code privacy and security", "Multi-language support"]
    },
    market_analysis: {
      market_size: "$2.8B developer tools market, growing 22% annually",
      target_segments: ["Enterprise software teams (primary)", "DevOps teams", "Security teams"],
      pricing_strategy: "$50-200 per developer per month",
      go_to_market: "Product-led growth with freemium model, enterprise sales for large accounts"
    },
    competitive_analysis: {
      direct_competitors: ["SonarQube", "CodeClimate", "Snyk"],
      competitive_advantages: ["AI-powered insights", "Real-time analysis", "Predictive bug detection"],
      market_positioning: "Premium AI-first solution for quality-conscious teams"
    },
    funding_requirements: {
      seed_round: "$2M for team and infrastructure",
      series_a: "$8M for ML development and market expansion",
      total_addressable_market: "$280M within 5 years"
    },
    risk_assessment: {
      technical_risks: ["Model accuracy", "Performance at scale"],
      market_risks: ["Competitive response", "Economic downturn affecting dev tool spending"],
      mitigation_strategies: ["Strong technical team", "Focus on ROI metrics", "Diversified customer base"]
    }
  },
  iteration_feedback: {
    strengths: ["Strong technical team fit", "Large market opportunity", "Clear differentiation"],
    weaknesses: ["High technical complexity", "Long development timeline", "Competitive market"],
    suggestions: [
      "Consider starting with a more focused use case (e.g., just security analysis)",
      "Build strategic partnerships with IDE providers early",
      "Develop a clear data strategy for model training",
      "Create a strong technical advisory board"
    ],
    pivot_opportunities: [
      "Focus solely on security vulnerability detection",
      "Target specific languages or frameworks first",
      "Build as a GitHub/GitLab integration rather than standalone tool"
    ],
    updated_score: 8.8
  }
};

const responseType = prompt.includes('deep dive') ? 'deep_dive_analysis' :
                    prompt.includes('iterate') ? 'iteration_feedback' : 'idea_generation';

setLoading(false);
return mockResponses[responseType];
```

};

// Kanban stages with enhanced metadata
const stages = [
{
id: ‘suggested’,
name: ‘Suggested’,
color: ‘bg-blue-500’,
icon: Lightbulb,
description: ‘AI-generated ideas based on your profile’,
actions: [‘Deep Dive’, ‘Edit’, ‘Discard’]
},
{
id: ‘deep-dive’,
name: ‘Deep Dive’,
color: ‘bg-purple-500’,
icon: Brain,
description: ‘Comprehensive investor-style analysis’,
actions: [‘Iterate’, ‘Move to Considering’, ‘Back to Suggested’]
},
{
id: ‘iterating’,
name: ‘Iterating’,
color: ‘bg-orange-500’,
icon: RotateCw,
description: ‘Refining based on feedback and insights’,
actions: [‘Deep Dive Again’, ‘Move to Considering’, ‘Archive’]
},
{
id: ‘considering’,
name: ‘Considering’,
color: ‘bg-green-500’,
icon: CheckCircle,
description: ‘Ready for go/no-go decision’,
actions: [‘Export Pitch’, ‘Start Building’, ‘Archive’]
},
{
id: ‘closed’,
name: ‘Closed’,
color: ‘bg-gray-500’,
icon: Archive,
description: ‘Parked ideas with full history’,
actions: [‘Reopen’, ‘Export Post-mortem’, ‘Delete’]
}
];

// Initialize with enhanced sample data
useEffect(() => {
const sampleIdeas = [
{
id: 1,
title: “DevOps Monitoring for Kubernetes”,
description: “AI-powered monitoring platform that predicts failures before they happen using advanced anomaly detection”,
stage: “suggested”,
score: 8.5,
tags: [“DevOps”, “AI”, “Kubernetes”, “B2B”],
createdAt: “2024-12-01”,
updatedAt: “2024-12-01”,
analysis: {
market: “Large and growing - $4.2B APM market”,
timing: “Perfect timing with K8s adoption surge”,
moat: “Proprietary ML models and deep K8s integration”,
technical_feasibility: 8.2,
market_opportunity: 9.1,
founder_fit: 8.8
},
history: [],
comments: [],
team_feedback: []
},
{
id: 2,
title: “FinTech for Freelancers”,
description: “Comprehensive banking and financial management platform tailored specifically for gig economy workers and freelancers”,
stage: “deep-dive”,
score: 7.2,
tags: [“FinTech”, “Freelancing”, “Banking”, “B2C”],
createdAt: “2024-11-28”,
updatedAt: “2024-12-02”,
analysis: {
market: “Underserved $1.27T freelancer economy”,
timing: “Great post-pandemic opportunity”,
moat: “Regulatory barriers and network effects”,
technical_feasibility: 7.5,
market_opportunity: 8.9,
founder_fit: 6.8
},
history: [
{ date: “2024-11-30”, action: “Deep dive analysis completed”, score: 7.2 }
],
comments: [
{ author: “AI Assistant”, text: “Consider partnerships with major freelancing platforms”, date: “2024-12-01” }
],
team_feedback: []
},
{
id: 3,
title: “Healthcare Data Compliance”,
description: “Automated HIPAA compliance and data governance platform for healthcare startups and digital health companies”,
stage: “iterating”,
score: 6.8,
tags: [“Healthcare”, “Compliance”, “B2B”, “RegTech”],
createdAt: “2024-11-25”,
updatedAt: “2024-12-03”,
analysis: {
market: “Niche but growing $13.8B healthcare IT compliance”,
timing: “Regulatory pressure increasing post-pandemic”,
moat: “High switching costs and domain expertise”,
technical_feasibility: 6.9,
market_opportunity: 7.8,
founder_fit: 6.2
},
history: [
{ date: “2024-11-28”, action: “Initial analysis”, score: 6.5 },
{ date: “2024-12-01”, action: “Iteration based on market feedback”, score: 6.8 }
],
comments: [],
team_feedback: [
{ member: “Sarah Chen”, feedback: “Need stronger healthcare industry connections”, vote: “concern” }
]
}
];

```
setIdeas(sampleIdeas);

// Enhanced user profile
setUserProfile({
  name: "Alex Chen",
  email: "alex@example.com",
  skills: ["TypeScript", "React", "Node.js", "Python", "DevOps", "Machine Learning"],
  experience: ["Software Engineering (5 years)", "Startup Founder (2 years)", "Product Management (3 years)"],
  industries: ["Developer Tools", "FinTech", "Healthcare Tech"],
  interests: ["AI/ML", "Developer Productivity", "FinTech Innovation"],
  preferredTypes: ["B2B SaaS", "Developer Tools", "AI-Powered Solutions"],
  investmentRange: "$50K - $2M",
  timeCommitment: "Full-time",
  riskTolerance: "Medium-High",
  previousExits: ["Sold dev tool startup to GitLab (2022)"]
});

// Mock GitHub trends
setGithubTrends([
  { name: "AI Code Assistant", stars: 15420, language: "Python", growth: "+245%" },
  { name: "Kubernetes Operator", stars: 8930, language: "Go", growth: "+189%" },
  { name: "React DevTools", stars: 12100, language: "TypeScript", growth: "+156%" }
]);

// Sample team members
setTeamMembers([
  { name: "Sarah Chen", role: "CTO", email: "sarah@example.com", skills: ["React", "Python", "ML"] },
  { name: "Mike Johnson", role: "Designer", email: "mike@example.com", skills: ["UI/UX", "Figma", "Branding"] }
]);
```

}, []);

// Enhanced drag and drop handlers
const handleDragStart = (e, idea) => {
setDraggedItem(idea);
e.dataTransfer.effectAllowed = ‘move’;
e.currentTarget.style.opacity = ‘0.5’;
};

const handleDragEnd = (e) => {
e.currentTarget.style.opacity = ‘1’;
setDraggedItem(null);
};

const handleDragOver = (e) => {
e.preventDefault();
e.dataTransfer.dropEffect = ‘move’;
};

const handleDrop = async (e, newStage) => {
e.preventDefault();
if (draggedItem && draggedItem.stage !== newStage) {
// Update idea stage with history tracking
const updatedIdea = {
…draggedItem,
stage: newStage,
updatedAt: new Date().toISOString().split(‘T’)[0],
history: [
…draggedItem.history,
{
date: new Date().toISOString().split(‘T’)[0],
action: `Moved to ${stages.find(s => s.id === newStage)?.name}`,
score: draggedItem.score
}
]
};

```
  setIdeas(ideas.map(idea => 
    idea.id === draggedItem.id ? updatedIdea : idea
  ));

  // Trigger AI analysis for certain stage transitions
  if (newStage === 'deep-dive' && draggedItem.stage === 'suggested') {
    await runDeepDiveAnalysis(updatedIdea);
  }
}
setDraggedItem(null);
```

};

// AI-powered analysis functions
const runDeepDiveAnalysis = async (idea) => {
const prompt = `Perform a deep dive investor analysis on this startup idea:
Title: ${idea.title}
Description: ${idea.description}
Founder Profile: ${JSON.stringify(userProfile)}

```
Provide structured analysis covering product, market, competition, funding, and risks.`;

const analysis = await callGroqAPI(prompt);
setCurrentAnalysis(analysis);
setShowAnalysisModal(true);

// Update idea with analysis
const updatedIdea = {
  ...idea,
  analysis: {
    ...idea.analysis,
    ...analysis,
    lastAnalyzed: new Date().toISOString()
  },
  score: analysis.overall_score || idea.score
};

setIdeas(ideas.map(i => i.id === idea.id ? updatedIdea : i));
```

};

const iterateIdea = async (idea, feedback) => {
const prompt = `Iterate on this startup idea based on feedback:
Original Idea: ${JSON.stringify(idea)}
Feedback: ${feedback}
Founder Profile: ${JSON.stringify(userProfile)}

```
Provide suggestions for improvements, pivot opportunities, and updated assessment.`;

const iteration = await callGroqAPI(prompt);

const updatedIdea = {
  ...idea,
  analysis: { ...idea.analysis, ...iteration },
  score: iteration.updated_score || idea.score,
  history: [
    ...idea.history,
    { 
      date: new Date().toISOString().split('T')[0], 
      action: "AI iteration completed",
      score: iteration.updated_score || idea.score 
    }
  ]
};

setIdeas(ideas.map(i => i.id === idea.id ? updatedIdea : i));
```

};

const generateIdeaFromType = async (type, input = ‘’) => {
let prompt = ‘’;

```
switch (type) {
  case 'github':
    prompt = `Based on trending GitHub repositories and the founder profile, generate a startup idea:
    Trends: ${JSON.stringify(githubTrends)}
    Founder Profile: ${JSON.stringify(userProfile)}`;
    break;
  case 'custom':
    prompt = `Analyze and structure this startup idea: ${input}
    Founder Profile: ${JSON.stringify(userProfile)}`;
    break;
  case 'vertical':
    prompt = `Generate a fundable startup idea in the ${input} vertical:
    Founder Profile: ${JSON.stringify(userProfile)}`;
    break;
}

const newIdeaData = await callGroqAPI(prompt);

const newIdea = {
  id: Date.now(),
  ...newIdeaData,
  stage: "suggested",
  createdAt: new Date().toISOString().split('T')[0],
  updatedAt: new Date().toISOString().split('T')[0],
  history: [],
  comments: [],
  team_feedback: [],
  source: type
};

setIdeas([...ideas, newIdea]);
setShowIdeaModal(false);
```

};

// Resume parsing function
const parseResume = async (file) => {
setLoading(true);
// Mock resume parsing - in real app would use AI to extract data
await new Promise(resolve => setTimeout(resolve, 3000));

```
const mockProfile = {
  name: "Jordan Smith",
  email: "jordan@example.com",
  skills: ["Python", "Machine Learning", "Data Science", "AWS", "Docker"],
  experience: ["Data Scientist at Tech Corp (3 years)", "ML Engineer at AI Startup (2 years)"],
  industries: ["AI/ML", "Data Analytics", "Healthcare"],
  interests: ["Computer Vision", "NLP", "AI Ethics"],
  preferredTypes: ["AI-First Products", "B2B SaaS", "Healthcare AI"],
  education: ["MS Computer Science - Stanford", "BS Mathematics - MIT"]
};

setUserProfile(mockProfile);
setLoading(false);
setShowResumeUpload(false);
```

};

// Enhanced UI Components
const IdeaCard = ({ idea }) => (
<div
className=“bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-3 cursor-move hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1”
draggable
onDragStart={(e) => handleDragStart(e, idea)}
onDragEnd={handleDragEnd}
onClick={() => setSelectedIdea(idea)}
>
<div className="flex justify-between items-start mb-3">
<h3 className="font-semibold text-gray-800 text-sm leading-tight">{idea.title}</h3>
<div className="flex items-center space-x-2">
<div className="flex items-center space-x-1">
<Star className="w-3 h-3 text-yellow-500 fill-current" />
<span className="text-xs text-gray-600 font-medium">{idea.score}</span>
</div>
{idea.team_feedback.length > 0 && (
<MessageSquare className="w-3 h-3 text-blue-500" />
)}
</div>
</div>

```
  <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">{idea.description}</p>
  
  <div className="flex flex-wrap gap-1 mb-3">
    {idea.tags.slice(0, 3).map((tag, index) => (
      <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200">
        {tag}
      </span>
    ))}
    {idea.tags.length > 3 && (
      <span className="text-xs text-gray-500">+{idea.tags.length - 3} more</span>
    )}
  </div>
  
  <div className="flex justify-between items-center text-xs text-gray-500">
    <span>Updated {idea.updatedAt}</span>
    {idea.history.length > 0 && (
      <span className="flex items-center space-x-1">
        <Clock className="w-3 h-3" />
        <span>{idea.history.length} updates</span>
      </span>
    )}
  </div>
</div>
```

);

const IdeaDetailModal = ({ idea, onClose }) => (
<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
<div className="p-6 border-b border-gray-200">
<div className="flex justify-between items-start">
<div className="flex-1">
<div className="flex items-center space-x-3 mb-2">
<h2 className="text-2xl font-bold text-gray-800">{idea.title}</h2>
<span className={`px-3 py-1 rounded-full text-sm font-medium ${ stages.find(s => s.id === idea.stage)?.color.replace('bg-', 'bg-') + ' text-white' }`}>
{stages.find(s => s.id === idea.stage)?.name}
</span>
</div>
<div className="flex items-center space-x-4 text-sm text-gray-600">
<div className="flex items-center space-x-1">
<Star className="w-4 h-4 text-yellow-500 fill-current" />
<span className="font-medium">{idea.score}/10</span>
</div>
<div className="flex items-center space-x-1">
<Calendar className="w-4 h-4" />
<span>Created {idea.createdAt}</span>
</div>
<div className="flex items-center space-x-1">
<RotateCw className="w-4 h-4" />
<span>{idea.history.length} iterations</span>
</div>
</div>
</div>
<button
onClick={onClose}
className="text-gray-400 hover:text-gray-600 transition-colors"
>
<XCircle className="w-6 h-6" />
</button>
</div>
</div>

```
    <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <span>Description</span>
              </h3>
              <p className="text-gray-700 leading-relaxed">{idea.description}</p>
            </div>

            {idea.analysis && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  <span>AI Analysis</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Market Opportunity</span>
                    </div>
                    <p className="text-sm text-blue-700">{idea.analysis.market}</p>
                    <div className="mt-2 bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(idea.analysis.market_opportunity || 5) * 10}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Timer className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800">Market Timing</span>
                    </div>
                    <p className="text-sm text-green-700">{idea.analysis.timing}</p>
                    <div className="mt-2 bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(idea.analysis.technical_feasibility || 5) * 10}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-purple-800">Competitive Moat</span>
                    </div>
                    <p className="text-sm text-purple-700">{idea.analysis.moat}</p>
                    <div className="mt-2 bg-purple-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${(idea.analysis.founder_fit || 5) * 10}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Trophy className="w-4 h-4 text-orange-600" />
                      <span className="font-medium text-orange-800">Founder Fit</span>
                    </div>
                    <p className="text-sm text-orange-700">Based on your profile and experience</p>
                    <div className="mt-2 bg-orange-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${(idea.analysis.founder_fit || 5) * 10}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {idea.history.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span>Evolution History</span>
                </h3>
                <div className="space-y-2">
                  {idea.history.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{entry.action}</span>
                      <span className="text-xs text-gray-500">{entry.date}</span>
                      {entry.score && (
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">Score: {entry.score}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {idea.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => runDeepDiveAnalysis(idea)}
                  className="w-full flex items-center space-x-2 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  disabled={loading}
                >
                  {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                  <span>Run Deep Analysis</span>
                </button>
                
                <button 
                  onClick={() => iterateIdea(idea, "General iteration request")}
                  className="w-full flex items-center space-x-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Iterate Idea</span>
                </button>
                
                <button className="w-full flex items-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  <Presentation className="w-4 h-4" />
                  <span>Generate Pitch</span>
                </button>
                
                <button className="w-full flex items-center space-x-2 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export Summary</span>
```