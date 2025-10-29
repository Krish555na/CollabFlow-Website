import { Zap, Users, TrendingUp, Sparkles, ArrowRight, Play, Eye, Heart, MousePointer, DollarSign, BarChart3 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function App() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    const targetPosition = { x: 0, y: 0 };

    const updateMousePosition = (e: MouseEvent) => {
      targetPosition.x = e.clientX;
      targetPosition.y = e.clientY;
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animateCursor = () => {
      setCursorPosition(prev => ({
        x: lerp(prev.x, targetPosition.x, 0.15),
        y: lerp(prev.y, targetPosition.y, 0.15)
      }));
      animationFrameId = requestAnimationFrame(animateCursor);
    };

    animationFrameId = requestAnimationFrame(animateCursor);
    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const interactiveElements = document.querySelectorAll('button, a, .interactive, input');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className={`fixed pointer-events-none z-50 transition-all duration-300 ease-out ${
          isHovering ? 'scale-150' : 'scale-100'
        } ${
          isClicking ? 'scale-75' : ''
        }`}
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1}) scale(${isClicking ? 0.75 : 1})`,
        }}
      >
        <div className="w-8 h-8 border-2 border-blue-400 rounded-full"></div>
        <div className="absolute inset-0 w-8 h-8 bg-blue-500/20 rounded-full blur-md"></div>
      </div>
      <div
        ref={cursorDotRef}
        className="fixed pointer-events-none z-50"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className={`w-1.5 h-1.5 bg-blue-400 rounded-full transition-all duration-150 ${
          isClicking ? 'scale-150' : 'scale-100'
        }`}></div>
      </div>

      {/* Background Grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-40 border-b border-gray-800/50 backdrop-blur-xl bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div className="relative">
                  <Zap className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                  <div className="absolute inset-0 bg-blue-400 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  CollabFlow
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-1">
                {['Discover', 'Campaigns', 'Analytics'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 interactive"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search influencers, brands..."
                  className="bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-gray-900/70 transition-all duration-300 w-48 focus:w-64"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <button className="relative p-2 rounded-lg hover:bg-white/10 transition-all duration-300 interactive">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7H4l5-5v5z" />
                </svg>
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 cursor-pointer interactive"></div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-30 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">AI-Powered Collaboration Platform</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Connect.
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Collaborate.
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                Create Impact.
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              The ultimate platform for brands and influencers to discover, connect, and manage 
              successful promotional campaigns across all digital platforms.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white overflow-hidden interactive shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <div className="relative flex items-center space-x-2">
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>
              <button className="group flex items-center space-x-2 px-8 py-4 border border-gray-600 rounded-xl font-semibold text-gray-300 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 interactive">
                <div className="relative">
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
                <span>Watch Demo</span>
              </button>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { number: '10K+', label: 'Active Influencers', icon: Users },
                { number: '5K+', label: 'Trusted Brands', icon: TrendingUp },
                { number: '50M+', label: 'Campaign Reach', icon: Eye }
              ].map((stat, index) => (
                <div key={index} className="group text-center interactive">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Preview Section */}
      <section className="relative z-30 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                See It In Action
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the power of AI-driven collaboration matching
            </p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Brand Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 group-hover:border-blue-500/50 transition-all duration-500 interactive">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-xl">TB</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">TechBrand</h3>
                      <div className="inline-flex items-center space-x-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">
                        <span>Tier A</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6">Looking for tech influencers for product launch</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span>$5K-10K</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>100K+ reach</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Connection Animation */}
              <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                  {/* Only one animation class per element */}
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce absolute -top-1 left-0"></div>
                </div>
              </div>
              {/* Influencer Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 group-hover:border-purple-500/50 transition-all duration-500 interactive">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 rounded-xl overflow-hidden">
                      <img 
                        src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face" 
                        alt="Sarah Tech" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Sarah Tech</h3>
                      <div className="inline-flex items-center space-x-1 bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                        <span>Tier B</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6">Tech reviewer with 250K followers</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>4.9 rating</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>2M views/month</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="relative z-30 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Your Dashboard
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Track performance and manage campaigns with real-time analytics
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: TrendingUp, title: 'Active Campaigns', value: '12', change: '+3 this week', color: 'from-blue-500 to-cyan-500' },
              { icon: Eye, title: 'Total Impressions', value: '2.4M', change: '+18% this month', color: 'from-purple-500 to-pink-500' },
              { icon: MousePointer, title: 'Click-through Rate', value: '3.2%', change: '+0.4% this month', color: 'from-green-500 to-emerald-500' },
              { icon: DollarSign, title: 'Revenue', value: '$127K', change: '+25% this month', color: 'from-yellow-500 to-orange-500' }
            ].map((metric, index) => (
              <div key={index} className="group relative interactive">
                <div className={`absolute inset-0 bg-gradient-to-r ${metric.color} opacity-20 rounded-2xl blur-xl group-hover:opacity-30 transition-all duration-500`}></div>
                <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 group-hover:border-gray-600 transition-all duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center`}>
                      <metric.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">{metric.value}</div>
                  <div className="text-sm text-gray-400 mb-2">{metric.title}</div>
                  <div className="text-xs text-green-400 flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{metric.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Performance Chart */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
            <div className="relative bg-gray-900/60 backdrop-blur-xl border border-gray-700 rounded-3xl p-8 group-hover:border-gray-600 transition-all duration-500">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white">Campaign Performance</h3>
                <div className="flex items-center space-x-2">
                  {['7D', '30D', '90D'].map((period, index) => (
                    <button
                      key={period}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 interactive ${
                        index === 1
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-64 bg-gray-800/50 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Interactive Chart Visualization</p>
                  <p className="text-sm text-gray-500">Real-time performance metrics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-30 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Smart Matching',
                description: 'AI-powered algorithm matches brands with perfect influencers based on audience, engagement, and niche compatibility.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: BarChart3,
                title: 'Real-time Analytics',
                description: 'Track campaign performance with detailed metrics, ROI analysis, and audience insights in real-time.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: Zap,
                title: 'Automated Workflows',
                description: 'Streamline your collaboration process with automated contracts, payments, and content approval workflows.',
                color: 'from-green-500 to-emerald-500'
              }
            ].map((feature, index) => (
              <div key={index} className="group relative interactive">
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-10 rounded-2xl blur-xl group-hover:opacity-20 transition-all duration-500`}></div>
                <div className="relative bg-gray-900/60 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 group-hover:border-gray-600 group-hover:transform group-hover:scale-105 transition-all duration-500">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-500`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-30 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700 rounded-3xl p-12 group-hover:border-gray-600 transition-all duration-500">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Ready to Transform
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Your Collaborations?
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of brands and influencers already using CollabFlow to create impactful campaigns.
              </p>
              <button className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-lg text-white overflow-hidden interactive shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
                <div className="relative flex items-center space-x-3">
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
      </div>

      {/* Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>
    </div>
  );
}

export default App;