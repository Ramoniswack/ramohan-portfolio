import React, { useState, useEffect, useRef } from 'react';
import { 
  Moon, 
  Sun, 
  ExternalLink, 
  Github, 
  Mail, 
  MessageCircle,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Music,
  Code,
  ArrowDown,
  MapPin,
  Calendar,
  Briefcase
} from 'lucide-react';

// Matrix Background Component - ONLY shows in dark mode
const MatrixBackground = ({ isDark }: { isDark: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");

    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    // Ensure canvas resizes correctly at the start
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = isDark ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = isDark ? '#0F4' : '#00AA88';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 35);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDark]); // Re-run the effect when the theme changes

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-20 z-0"
    />
  );
};



// Improved Mouse Tracker Component with better control
const MouseTracker = () => {
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const lastUpdateRef = useRef<number>(0);
  const isMouseDownRef = useRef<boolean>(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle updates to prevent excessive trail points
      const now = Date.now();
      if (now - lastUpdateRef.current < 16) return; // ~60fps limit
      lastUpdateRef.current = now;

      // Only add trail points when mouse is moving (not clicking rapidly)
      if (!isMouseDownRef.current) {
        setTrail(prev => {
          const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: now }];
          // Limit trail length to prevent performance issues
          return newTrail.slice(-8);
        });
      }
    };

    const handleMouseDown = () => {
      isMouseDownRef.current = true;
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
    };

    // Clear trail when mouse leaves window
    const handleMouseLeave = () => {
      setTrail([]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Auto-fade trail points
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail(prev => {
        const now = Date.now();
        return prev.filter(point => now - point.id < 500); // Remove points older than 500ms
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {trail.map((point, index) => {
        const age = Date.now() - point.id;
        const opacity = Math.max(0, 1 - age / 500); // Fade out over 500ms
        const scale = (index + 1) / trail.length;
        
        return (
          <div
            key={point.id}
            className="fixed pointer-events-none z-50 w-2 h-2 bg-blue-400 rounded-full"
            style={{
              left: point.x - 4,
              top: point.y - 4,
              transform: `scale(${scale})`,
              opacity: opacity * 0.6,
              transition: 'opacity 0.1s ease-out',
            }}
          />
        );
      })}
    </>
  );
};

// Scanline Overlay Component - ONLY shows in dark mode
const ScanlineOverlay = ({ isDark }: { isDark: boolean }) => {
  const gradientColor = isDark ? 'via-green-500/5' : 'via-blue-400/5';
  const lineColor = isDark ? 'rgba(0, 255, 0, 0.03)' : 'rgba(0, 0, 255, 0.02)';

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Subtle vertical pulse effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-transparent ${gradientColor} to-transparent animate-pulse`}
      />

      {/* Horizontal scanline pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            ${lineColor} 2px,
            ${lineColor} 4px
          )`
        }}
      />
    </div>
  );
};



// Tech Stack Icons Component
const TechIcon = ({
  name,
  iconUrl,
  isDark,
}: {
  name: string;
  iconUrl: string;
  isDark: boolean;
}) => {
  return (
    <div
      className={`group flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-md ${
        isDark
          ? 'bg-white/5 border-white/10 hover:border-blue-400/50 hover:shadow-blue-400/20'
          : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-blue-300/20'
      }`}
    >
      <img src={iconUrl} alt={name} className="w-10 h-10" />
      <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
        {name}
      </span>
    </div>
  );
};





// Project Card Component
const ProjectCard = ({ 
  title, 
  description, 
  tech, 
  liveUrl, 
  githubUrl, 
  image, 
  delay,
  isDark 
}: { 
  title: string;
  description: string;
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
  image: string;
  delay: number;
  isDark: boolean;
}) => {
  return (
    <div 
      className={`group relative backdrop-blur-sm rounded-2xl border transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden animate-fade-in-up ${
        isDark 
          ? 'bg-white/5 border-white/20 hover:border-blue-400/50 hover:shadow-blue-400/20' 
          : 'bg-white/90 border-gray-200/50 hover:border-blue-400/50 hover:shadow-blue-400/20 shadow-lg'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative p-6">
        {/* Project Image/Logo */}
        <div className={`w-16 h-16 mb-4 rounded-xl overflow-hidden flex items-center justify-center ${
          isDark ? 'bg-white/10' : 'bg-gray-100'
        }`}>
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        <h3 className={`text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </h3>
        
        <p className={`mb-4 text-sm leading-relaxed ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tech.map((t, index) => (
            <span 
              key={index}
              className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full border border-blue-400/30"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 hover:scale-105 text-sm font-medium"
            >
              <ExternalLink size={16} />
              Live
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 hover:scale-105 text-sm font-medium"
            >
              <Github size={16} />
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [isDark, setIsDark] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'experience', 'projects', 'tech', 'more', 'social'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const projects = [
    {
      title: "MovieFlix",
      description: "React app using TMDB API with debounced search functionality and smooth loading states for optimal user experience.",
      tech: ["React", "TMDB API", "JavaScript", "CSS3"],
      image: "/MovieFlix-Logo.png",
      liveUrl: "https://moviee-flix.vercel.app",
      githubUrl: "https://github.com/Ramoniswack/MovieFlix"
    },
    {
      title: "Attendify+",
      description: "PHP and MySQL-based attendance management system with real-time tracking and comprehensive reporting features.",
      tech: ["PHP", "MySQL", "JavaScript", "Bootstrap"],
      image: "/logo-bg.png",
      githubUrl: "#"
    },
    {
      title: "Aaja Ta Sure",
      description: "TypeScript-powered To-Do application with Zod validation, ensuring type safety and robust data handling.",
      tech: ["React", "TypeScript", "Zod", "TailwindCSS"],
      image: "/aajatasure.png",
      liveUrl: "https://aajatasure.vercel.app",
      githubUrl: "https://github.com/Ramoniswack/aaja-ta-suree"
    }
  ];

  const techStack = [
  { name: 'HTML5', iconUrl: '/html-5.png' },
  { name: 'CSS3', iconUrl: '/css-3.png' },
  { name: 'JavaScript', iconUrl: '/js.png' },
  { name: 'TypeScript', iconUrl: '/typescript.png' },
  { name: 'PHP', iconUrl: '/php.png' },
  { name: 'MySQL', iconUrl: '/mysql-database.png' },
  { name: 'MongoDB', iconUrl: '/mongodb.png' },
  { name: 'React', iconUrl: '/react.png' },
  { name: 'TailwindCSS', iconUrl: '/Tailwindcss.png' },
  { name: 'Zod', iconUrl: '/zod.png' },
  { name: 'Java', iconUrl: '/java.png' },
  { name: 'C++', iconUrl: '/c-.png' },
  { name: 'SQL Server', iconUrl: '/sql-server.png' }
];

  const socialLinks = [
    { name: 'Discord', url: 'https://discord.gg/72n6NAwK', icon: MessageCircle },
    { name: 'Facebook', url: 'https://facebook.com/profile.php?id=100090829328516', icon: Facebook },
    { name: 'Instagram', url: 'https://instagram.com/r.a.mon_', icon: Instagram },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/r-a-mohan', icon: Linkedin },
    { name: 'X', url: 'https://x.com/RamonTiwari', icon: Twitter },
    { name: 'Email', url: 'mailto:ramontiwari086@gmail.com', icon: Mail }
  ];

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDark ? 'dark bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Background Effects */}
      <MatrixBackground isDark={isDark} />
      <ScanlineOverlay isDark={isDark} />
      <MouseTracker />

      {/*  Navigation */}
<nav
  className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
    isDark
      ? 'bg-black/20 border-white/10'
      : 'bg-white/80 border-gray-200/50 shadow-sm'
  }`}
>
  <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between relative">
    {/* Left: R.a.mohan */}
    <div className="text-xl font-bold tracking-tight">
      <span className={isDark ? 'text-white' : 'text-gray-900'}>R.a.mohan</span>
    </div>

    {/* Center: Nav Links */}
    <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex gap-8">
      {['About', 'Experience', 'Projects', 'Tech', 'Contact'].map((item) => (
        <button
          key={item}
          onClick={() => scrollToSection(item.toLowerCase())}
          className={`text-sm font-medium transition-colors hover:text-blue-500 ${
            activeSection === item.toLowerCase()
              ? 'text-blue-500'
              : isDark
              ? 'text-gray-300'
              : 'text-gray-700'
          }`}
        >
          {item}
        </button>
      ))}
    </div>

    {/* Right: Theme Toggle */}
    <div>
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-full transition duration-300 hover:scale-110 ${
          isDark
            ? 'bg-white/10 hover:bg-white/20 text-white'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
        }`}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  </div>
</nav>

{/* Hero Section */}
<section id="hero" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6">
  <div className="max-w-3xl mx-auto text-center relative z-20">
    {/* Profile Image */}
    <div className="mb-6 animate-fade-in">
      <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden border-4 border-blue-400/50 shadow-2xl shadow-blue-400/20">
        <img
          src="/MyPhoto.png"
          alt="R.a.mohan Tiwari"
          className="w-full h-full object-cover"
        />
      </div>
    </div>

    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      R.a.mohan <span className="text-blue-400">Tiwari</span>
    </h1>

    <div
      className={`text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 animate-fade-in-up ${
        isDark ? 'text-gray-400' : 'text-gray-600'
      }`}
      style={{ animationDelay: '400ms' }}
    >
      <span className="inline-block animate-typing">
        Transforming ideas into interactive experiences
      </span>
    </div>

    <p
      className={`text-base sm:text-lg mb-6 sm:mb-8 animate-fade-in-up ${
        isDark ? 'text-gray-500' : 'text-gray-500'
      }`}
      style={{ animationDelay: '600ms' }}
    >
      Experimenting and exploring my rapid interests in tech
    </p>

    <button
      onClick={() => scrollToSection('projects')}
      className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-400/30 animate-fade-in-up"
      style={{ animationDelay: '800ms' }}
    >
      View Projects
      <ArrowDown size={20} />
    </button>
  </div>
</section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 relative z-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center animate-fade-in-up">About Me</h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="w-64 h-64 mx-auto rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/MyPhoto.png" 
                  alt="R.a.mohan Tiwari"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <p className={`text-lg leading-relaxed mb-6 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Currently working on React, learning full-stack practices by building real-world applications. 
                Passionate about clean UI, functionality, and continuous learning.
              </p>
              
              <p className={`text-lg leading-relaxed ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                I believe in the power of technology to solve real problems and create meaningful experiences. 
                Every project is an opportunity to learn something new and push the boundaries of what's possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-6 relative z-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center animate-fade-in-up">Experience</h2>
          
          <div className={`backdrop-blur-sm rounded-2xl border p-8 animate-fade-in-up transition-all duration-300 ${
            isDark 
              ? 'bg-white/5 border-white/20' 
              : 'bg-white/90 border-gray-200/50 shadow-lg'
          }`} style={{ animationDelay: '200ms' }}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                isDark ? 'bg-blue-500/20' : 'bg-blue-100'
              }`}>
                <Briefcase className="text-blue-400" size={24} />
              </div>
              
              <div className="flex-1">
                <h3 className={`text-xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Web Development Intern
                </h3>
                <p className="text-blue-400 font-medium mb-2">XAV Technologies</p>
                
                <div className={`flex items-center gap-4 text-sm mb-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    April 2025 – Present (Ongoing)
                  </div>
                </div>
                
                <p className={`leading-relaxed ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Focused on React UI development and real-world product workflows. 
                  Contributing to production applications while learning industry best practices 
                  and collaborative development processes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 relative z-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center animate-fade-in-up">Featured Projects</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.title}
                {...project}
                delay={index * 200}
                isDark={isDark}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
 <section id="tech" className="py-20 px-6 relative z-20">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-4xl font-bold mb-12 text-center animate-fade-in-up">Tech Stack</h2>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {techStack.map((tech, index) => (
        <TechIcon
          key={tech.name}
          name={tech.name}
          iconUrl={tech.iconUrl}
          isDark={isDark}
        />
      ))}
    </div>
  </div>
</section>


      {/* More About Me Section */}
      <section id="more" className="py-20 px-6 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 animate-fade-in-up">More About Me</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className={`backdrop-blur-sm rounded-2xl border p-8 animate-fade-in-up transition-all duration-300 ${
              isDark 
                ? 'bg-white/5 border-white/20' 
                : 'bg-white/90 border-gray-200/50 shadow-lg'
            }`} style={{ animationDelay: '200ms' }}>
              <Code className="text-blue-400 mx-auto mb-4" size={48} />
              <h3 className={`text-xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Developer & Creator</h3>
              <p className={`leading-relaxed ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                I love learning new things and enjoy juggling code, ideas, and music. 
                I'm passionate about deep focus and curiosity, always exploring the intersection of technology and creativity.
              </p>
            </div>
            
            <div className={`backdrop-blur-sm rounded-2xl border p-8 animate-fade-in-up transition-all duration-300 ${
              isDark 
                ? 'bg-white/5 border-white/20' 
                : 'bg-white/90 border-gray-200/50 shadow-lg'
            }`} style={{ animationDelay: '400ms' }}>
              <Music className="text-blue-400 mx-auto mb-4" size={48} />
              <h3 className={`text-xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Writer & Musician</h3>
              <p className={`leading-relaxed ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                I write — syntax and lyrics alike. My fingers switch between keyboard and guitar strings, 
                finding rhythm in both code and music, creating harmony between logic and art.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 animate-fade-in-up">Let's Connect</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {socialLinks.map((social, index) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group p-6 backdrop-blur-sm rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in-up ${
                    isDark 
                      ? 'bg-white/5 border-white/20 hover:border-blue-400/50 hover:shadow-blue-400/20' 
                      : 'bg-white/90 border-gray-200/50 hover:border-blue-400/50 hover:shadow-blue-400/20 shadow-lg'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <IconComponent className="text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" size={32} />
                  <p className={`font-medium group-hover:text-blue-400 transition-colors ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {social.name}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
<footer
  className={`py-12 px-4 sm:px-6 border-t relative z-20 overflow-hidden ${
    isDark ? 'border-white/10' : 'border-gray-200'
  }`}
>
  <div className="max-w-4xl mx-auto text-center">
    <p className={`mb-4 ${
      isDark ? 'text-gray-400' : 'text-gray-600'
    }`}>
      R.a.mohan Tiwari
    </p>
    <p className={`text-sm ${
      isDark ? 'text-gray-500' : 'text-gray-500'
    }`}>
      © 2025 All rights reserved
    </p>
  </div>
</footer>
      {/* Background Overlay */}
      {/* <div className={`fixed inset-0 z-0 ${isDark ? 'bg-black/50' : 'bg-white/90'}`} /> */}

      {/* Mouse Trail */}
      <MouseTracker />
    </div>
  );
}

export default App;

