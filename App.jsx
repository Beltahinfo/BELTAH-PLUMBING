import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  Droplets, 
  Wrench, 
  Clock, 
  Menu, 
  X, 
  MapPin, 
  Mail, 
  Star,
  ChevronRight,
  ArrowRight,
  MessageCircle,
  Sparkles,
  Camera,
  AlertTriangle,
  Send,
  Loader2,
  Settings,
  Shield
} from 'lucide-react';

// Modern Premium SVG Logo Component
const BeltahLogo = ({ className = "h-16 w-16" }) => (
  <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#1e3a8a" />
      </linearGradient>
      <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#f97316" />
      </linearGradient>
    </defs>
    
    {/* Outer Glow/Ring */}
    <circle cx="60" cy="60" r="58" fill="white" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
    <circle cx="60" cy="60" r="54" fill="none" stroke="url(#blueGrad)" strokeWidth="1.5" />
    
    {/* Central Icon: Water Drop with Integrated Wrench */}
    <path 
      d="M60 25 C60 25 78 45 78 62 C78 75 69 82 60 82 C51 82 42 75 42 62 C42 45 60 25 60 25Z" 
      fill="url(#blueGrad)" 
    />
    <path 
      d="M52 65 L68 65 M54 60 L66 60" 
      stroke="white" 
      strokeWidth="3" 
      strokeLinecap="round" 
    />
    <circle cx="60" cy="52" r="6" fill="url(#orangeGrad)" />
    
    {/* Circular Text */}
    <path id="curve" d="M 20, 60 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="none" />
    <text className="font-bold uppercase" style={{ fontSize: '10px', letterSpacing: '2px' }} fill="#1e3a8a">
      <textPath href="#curve" startOffset="50%" textAnchor="middle">
        BELTAH PLUMBING • NAIROBI •
      </textPath>
    </text>
  </svg>
);

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showCallDropdown, setShowCallDropdown] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiImage, setAiImage] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const phoneNumber = "254114141192";
  const apiKey = ""; 

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowCallDropdown(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAiImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const analyzeWithGemini = async () => {
    if (!aiPrompt && !aiImage) return;
    setIsAiLoading(true);
    setAiError(null);
    setAiResponse(null);

    const systemPrompt = "Expert plumber analysis. 1. Severity. 2. 3 Safety steps. 3. Cause. 4. Fix.";
    const payload = {
      contents: [{
        parts: [
          { text: aiPrompt || "Analyze this issue." },
          ...(aiImage ? [{ inlineData: { mimeType: "image/png", data: aiImage.split(',')[1] } }] : [])
        ]
      }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };

    let retries = 0;
    const callApi = async () => {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error();
        const data = await response.json();
        setAiResponse(data.candidates?.[0]?.content?.parts?.[0]?.text || "Error.");
      } catch (err) {
        if (retries < 3) { retries++; await new Promise(r => setTimeout(r, 1000)); return callApi(); }
        setAiError("AI error. Please call.");
      } finally { setIsAiLoading(false); }
    };
    await callApi();
  };

  const services = [
    { title: "Pipe Installation", desc: "Expert copper and PEX piping solutions.", icon: <Wrench className="w-8 h-8 text-orange-500" /> },
    { title: "Leak Repair", desc: "Advanced acoustic detection and fast fixing.", icon: <Droplets className="w-8 h-8 text-orange-500" /> },
    { title: "24/7 Emergency", desc: "Rapid response for bursts and failures.", icon: <Clock className="w-8 h-8 text-orange-500" /> },
    { title: "Drainage Systems", desc: "Professional clearing of industrial clogs.", icon: <Settings className="w-8 h-8 text-orange-500" /> }
  ];

  const NavLink = ({ href, children }) => (
    <a href={href} className="relative group text-gray-700 hover:text-blue-600 font-bold py-2 text-sm tracking-widest uppercase">
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span>
    </a>
  );

  const CallActionDropdown = ({ mobile = false }) => (
    <div className={`relative ${mobile ? 'w-full' : ''}`} ref={dropdownRef}>
      <button 
        onClick={() => setShowCallDropdown(!showCallDropdown)}
        className={`bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-md ${mobile ? 'w-full py-4' : ''}`}
      >
        <Phone size={18} /> {mobile ? 'CONTACT US' : 'CALL NOW'}
      </button>
      
      {showCallDropdown && (
        <div className={`absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border z-[60] py-2 ${mobile ? 'left-0 right-0 bottom-full mb-2' : ''}`}>
          <a href={`tel:${phoneNumber}`} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b">
            <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Phone size={16} /></div>
            <div className="text-left"><p className="font-bold text-sm">Direct Call</p><p className="text-xs text-gray-500">Pick a SIM</p></div>
          </a>
          <a href={`https://wa.me/${phoneNumber}`} target="_blank" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
            <div className="bg-green-100 p-2 rounded-full text-green-600"><MessageCircle size={16} /></div>
            <div className="text-left"><p className="font-bold text-sm">WhatsApp</p><p className="text-xs text-gray-500">Fast chat</p></div>
          </a>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <nav className={`fixed w-full z-50 transition-all ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'} py-4`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BeltahLogo className="h-14 w-14" />
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black text-blue-900 tracking-tighter">BELTAH</span>
              <span className="text-xs font-bold text-orange-500 tracking-[0.2em]">PLUMBING</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="#home">HOME</NavLink>
            <NavLink href="#services">SERVICE</NavLink>
            <NavLink href="#contact">CONTACT</NavLink>
            <button onClick={() => setIsAiModalOpen(true)} className="flex items-center gap-2 text-blue-600 font-bold px-4 py-2 rounded-full border-2 border-blue-600 hover:bg-blue-50">
              <Sparkles size={16} /> BELTAH AI ASSISTANT
            </button>
            <CallActionDropdown />
          </div>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}><Menu /></button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white p-6 flex flex-col gap-4 shadow-xl border-t">
            <a href="#home" className="font-bold" onClick={() => setIsMenuOpen(false)}>HOME</a>
            <a href="#services" className="font-bold" onClick={() => setIsMenuOpen(false)}>SERVICE</a>
            <button onClick={() => {setIsAiModalOpen(true); setIsMenuOpen(false)}} className="bg-blue-50 p-3 rounded-lg font-bold flex gap-2"><Sparkles /> AI ASSISTANT</button>
            <CallActionDropdown mobile={true} />
          </div>
        )}
      </nav>

      <section id="home" className="pt-48 pb-24 bg-gradient-to-br from-blue-900 to-blue-700 text-white overflow-hidden">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-3/5 text-center md:text-left">
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-[0.9] tracking-tighter">Expert Plumbing. <br/><span className="text-orange-400">Pure Solutions.</span></h1>
            <p className="text-xl mb-10 text-blue-100 font-medium">Trusted across Nairobi for 24/7 rapid response and professional installations.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button onClick={() => setShowCallDropdown(true)} className="bg-orange-500 hover:bg-orange-600 p-5 px-10 rounded-2xl font-black text-lg shadow-2xl transform hover:scale-105 transition-all">GET SERVICE NOW</button>
              <button onClick={() => setIsAiModalOpen(true)} className="bg-white/10 backdrop-blur-md p-5 px-10 rounded-2xl font-bold flex items-center justify-center gap-2 border border-white/20 hover:bg-white/20 transition-all"><Sparkles /> DIAGNOSE WITH AI</button>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
            <BeltahLogo className="relative w-72 h-72 md:w-96 md:h-96 shadow-2xl rounded-full transform hover:rotate-2 transition-all duration-700" />
          </div>
        </div>
      </section>

      <section id="services" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-blue-900 uppercase tracking-tight">Our Expertise</h2>
            <div className="w-16 h-2 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((s, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-3 transition-all group">
                <div className="mb-6 bg-blue-50 w-20 h-20 rounded-[1.5rem] flex items-center justify-center group-hover:bg-blue-600 transition-all group-hover:text-white">
                  {s.icon}
                </div>
                <h3 className="text-xl font-black mb-3 text-blue-900 uppercase">{s.title}</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed font-medium">{s.desc}</p>
                <a href="#contact" className="text-blue-600 font-bold flex items-center gap-1 text-sm group-hover:gap-3 transition-all">Book Now <ArrowRight size={16} /></a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-blue-900 rounded-[3rem] shadow-3xl overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-1/2 p-12 lg:p-20 bg-white">
              <h2 className="text-4xl font-black text-blue-900 mb-8 uppercase">Let's Fix It</h2>
              <form className="space-y-6">
                <input type="text" placeholder="Full Name" className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium" />
                <input type="tel" placeholder="Phone (e.g. 07...)" className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium" />
                <textarea placeholder="Describe the problem..." className="w-full bg-gray-50 border-none rounded-2xl p-5 h-40 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium resize-none"></textarea>
                <button type="button" className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-blue-700 transition-all text-lg">SEND REQUEST</button>
              </form>
            </div>
            <div className="lg:w-1/2 p-12 lg:p-20 text-white flex flex-col justify-center gap-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-20 bg-blue-800 rounded-full -mr-20 -mt-20 opacity-50"></div>
                <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-6 group cursor-pointer">
                        <div className="bg-blue-800 p-4 rounded-2xl group-hover:bg-orange-500 transition-colors"><Phone /></div>
                        <div><p className="text-blue-300 text-sm font-bold uppercase">Call Us</p><p className="text-2xl font-black">+{phoneNumber}</p></div>
                    </div>
                    <div className="flex items-center gap-6 group cursor-pointer">
                        <div className="bg-blue-800 p-4 rounded-2xl group-hover:bg-orange-500 transition-colors"><Mail /></div>
                        <div><p className="text-blue-300 text-sm font-bold uppercase">Email</p><p className="text-2xl font-black">beltahplumbing@gmail.com</p></div>
                    </div>
                    <div className="flex items-center gap-6 group cursor-pointer">
                        <div className="bg-blue-800 p-4 rounded-2xl group-hover:bg-orange-500 transition-colors"><MapPin /></div>
                        <div><p className="text-blue-300 text-sm font-bold uppercase">Location</p><p className="text-2xl font-black">Ronald Ngala St, Nairobi</p></div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {isAiModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-blue-900/90 backdrop-blur-xl" onClick={() => setIsAiModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] p-8 overflow-y-auto max-h-[90vh] shadow-3xl">
            <div className="flex justify-between mb-8 border-b pb-6">
              <h3 className="text-2xl font-black text-blue-900 flex gap-3 items-center"><Sparkles className="text-blue-600" /> AI Diagnostic</h3>
              <button onClick={() => setIsAiModalOpen(false)} className="hover:bg-gray-100 p-2 rounded-full transition-colors"><X /></button>
            </div>
            {!aiResponse ? (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-2xl flex gap-4 text-sm text-blue-900 border border-blue-100 font-medium">
                  <AlertTriangle className="text-orange-500 shrink-0" size={20} />
                  Submit a photo or text for an instant safety assessment and DIY advice.
                </div>
                <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="E.g., I have a burst pipe in my backyard..." className="w-full p-6 bg-gray-50 border-none rounded-2xl min-h-[140px] focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium" />
                <button onClick={() => fileInputRef.current.click()} className="w-full border-2 border-dashed border-gray-200 p-6 rounded-2xl text-gray-500 flex flex-col items-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition-all">
                  <Camera size={32} /> <span className="font-bold">{aiImage ? "Photo Ready" : "Upload Visual"}</span>
                </button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
                <button onClick={analyzeWithGemini} disabled={isAiLoading || (!aiPrompt && !aiImage)} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black disabled:bg-gray-200 shadow-xl hover:bg-blue-700 transition-all flex justify-center items-center gap-3">
                  {isAiLoading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                  {isAiLoading ? "Processing..." : "START DIAGNOSIS"}
                </button>
              </div>
            ) : (
              <div className="space-y-6 animate-in zoom-in-95 duration-300">
                <div className="p-8 bg-gray-50 rounded-3xl whitespace-pre-wrap text-gray-700 border border-gray-100 leading-relaxed font-medium shadow-inner">{aiResponse}</div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => setAiResponse(null)} className="flex-1 py-5 bg-gray-100 rounded-2xl font-black hover:bg-gray-200 transition-all uppercase">Try Another</button>
                  <a href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent("Beltah AI Diagnosis: " + aiResponse.substring(0, 500))}`} target="_blank" className="flex-1 bg-green-500 text-white py-5 rounded-2xl font-black hover:bg-green-600 transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-200">
                    <MessageCircle size={24} /> CHAT NOW
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="bg-blue-950 text-white py-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
        <BeltahLogo className="h-20 w-20 mx-auto mb-6 bg-white p-1 rounded-full shadow-2xl" />
        <h2 className="text-3xl font-black tracking-tighter uppercase mb-2">BELTAH PLUMBING</h2>
        <p className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-10">Quality You Can Trust</p>
        <div className="flex justify-center gap-8 mb-12">
          <div className="bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer"><Wrench size={24} /></div>
          <div className="bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer"><Shield size={24} /></div>
          <div className="bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer"><Star size={24} /></div>
        </div>
        <p className="text-blue-500 text-sm font-medium">© 2026 Beltah Plumbing Solutions. Nairobi, Kenya.</p>
      </footer>
    </div>
  );
};

export default App;
