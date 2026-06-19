import { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Settings, 
  ShoppingBag, 
  Layers, 
  FileCode, 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  Copy, 
  Check, 
  Award, 
  Sparkles, 
  Coins, 
  Info, 
  Sliders, 
  Cpu, 
  Smartphone, 
  Music, 
  VolumeX,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FLUTTER_CLEAN_STRUCTURE, DART_CODES, FileSystemNode } from './data/flutterStructure';

// Web Audio API Synthesizer to simulate meows and piano keys
class SynthManager {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playMeow(isPerfect: boolean) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    if (isPerfect) {
      // High pitch cute "Meow" sweep sound
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.28);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else {
      // Miss: lower pitch flat wobbly sound
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(75, now + 0.2);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  }

  playMelodyMeow(baseFreq: number) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // High fidelity feline tone synthesized to mirror specific melodic intervals
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.55, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + 0.22);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  playTapTone(lane: number) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // C, E, G, B beautiful pentatonic scale mapping to 4 lanes
    const notes = [261.63, 329.63, 392.00, 493.88];
    const freq = notes[lane] || 440;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }
}

const synth = new SynthManager();

interface SimulatedNote {
  id: number;
  lane: number;
  type: 'tap' | 'hold';
  y: number; // 0 (top) to 100 (bottom hitline position is around 85%)
  duration: number; // height length for hold elements
  played: boolean;
  missed: boolean;
}

// Suggested music for play audits and temporary testing
interface SuggestedSong {
  id: string;
  name_ar: string;
  name_en: string;
  bpm: number;
  difficulty: number; // 1-5 paw rating
  emoji: string;
  melody: number[];
}

const SUGGESTED_SONGS: SuggestedSong[] = [
  {
    id: 'twinkle',
    name_ar: 'لمعان النجم الصغير ⭐️ (مواء كلاسيكي)',
    name_en: 'Twinkle Twinkle Little Paw ⭐️',
    bpm: 95,
    difficulty: 2,
    emoji: '⭐',
    melody: [
      261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00,
      349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63,
      392.00, 392.00, 349.23, 349.23, 329.63, 329.63, 293.66,
      392.00, 392.00, 349.23, 349.23, 329.63, 329.63, 293.66,
      261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00,
      349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63
    ]
  },
  {
    id: 'elise',
    name_ar: 'من أجل إليز 🎹 (رميكس بيانو وجبن)',
    name_en: 'Für Elise Cat-Nip Edit 🎹',
    bpm: 130,
    difficulty: 4,
    emoji: '🎹',
    melody: [
      659.25, 622.25, 659.25, 622.25, 659.25, 493.88, 587.33, 523.25, 440.00,
      261.63, 329.63, 440.00, 493.88,
      329.63, 415.30, 493.88, 523.25,
      329.63, 659.25, 622.25, 659.25, 622.25, 659.25, 493.88, 587.33, 523.25, 440.00,
      261.63, 329.63, 440.00, 493.88,
      329.63, 523.25, 493.88, 440.00
    ]
  },
  {
    id: 'jingle',
    name_ar: 'أجراس المواء للميلاد 🎄 (إيقاع دافئ)',
    name_en: 'Meow Meow Jingle Bells 🎄',
    bpm: 115,
    difficulty: 3,
    emoji: '🎄',
    melody: [
      329.63, 329.63, 329.63, 329.63, 329.63, 329.63, 329.63, 392.00, 261.63, 293.66, 329.63,
      349.23, 349.23, 349.23, 349.23, 349.23, 329.63, 329.63, 329.63, 329.63, 293.66, 293.66, 329.63, 293.66, 392.00,
      329.63, 329.63, 329.63, 329.63, 329.63, 329.63, 329.63, 392.00, 261.63, 293.66, 329.63,
      349.23, 349.23, 349.23, 349.23, 349.23, 329.63, 329.63, 329.63, 392.00, 392.00, 349.23, 293.66, 261.63
    ]
  },
  {
    id: 'canon',
    name_ar: 'كانون باخيلبل للقطط 🐾 (بريق ناعم)',
    name_en: "Pachelbel's Paws Canon 🐾",
    bpm: 85,
    difficulty: 3,
    emoji: '🎻',
    melody: [
      587.33, 523.25, 493.88, 440.00, 392.00, 349.23, 392.00, 440.00,
      587.33, 659.25, 739.99, 783.99, 698.46, 587.33, 659.25, 523.25,
      392.00, 440.00, 493.88, 523.25, 587.33, 349.23, 392.00, 440.00,
      493.88, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33
    ]
  },
  {
    id: 'baker',
    name_ar: 'مارش القطط السعيدة 😸 (سريع وممتع)',
    name_en: 'Happy Cats March 😸',
    bpm: 150,
    difficulty: 5,
    emoji: '😸',
    melody: [
      523.25, 587.33, 659.25, 698.46, 783.99, 783.99, 880.00, 783.99, 698.46, 659.25, 587.33, 523.25,
      392.00, 392.00, 523.25, 523.25, 587.33, 587.33, 659.25, 523.25, 587.33, 392.00,
      523.25, 587.33, 659.25, 698.46, 783.99, 783.99, 880.00, 783.99, 698.46, 659.25, 587.33, 523.25
    ]
  }
];

// In-store elements
interface ShopItem {
  id: string;
  name_ar: string;
  name_en: string;
  price: number;
  type: 'outfit' | 'skin';
  color?: string; // for skins
  previewEmoji?: string; // for outfits
}

const SHOP_ITEMS: ShopItem[] = [
  { id: 'crown', name_ar: 'التاج الذهبي الملكي', name_en: 'King Golden Crown', price: 150, type: 'outfit', previewEmoji: '👑' },
  { id: 'headphones', name_ar: 'سماعات دي جي مجسمة', name_en: 'DJ Headphones', price: 90, type: 'outfit', previewEmoji: '🎧' },
  { id: 'glasses', name_ar: 'النظارة السوداء الذكية', name_en: 'Cyber Glasses', price: 50, type: 'outfit', previewEmoji: '😎' },
  { id: 'party_hat', name_ar: 'قبعة الحفلات الملونة', name_en: 'Party Cone Hat', price: 70, type: 'outfit', previewEmoji: '🥳' },
  { id: 'cowboy_hat', name_ar: 'قبعة الكاوبوي الكلاسيكية', name_en: 'Cowboy Hat', price: 120, type: 'outfit', previewEmoji: '🤠' },
  
  { id: 'skin_cyan', name_ar: 'مظهر النيون المبرم', name_en: 'Cyber Cyan Neon', price: 60, type: 'skin', color: '#06b6d4' },
  { id: 'skin_pink', name_ar: 'مظهر الوردي البراق', name_en: 'Candy Pink Spark', price: 60, type: 'skin', color: '#ec4899' },
  { id: 'skin_emerald', name_ar: 'مظهر ليزر الزمرد', name_en: 'Emerald Laser Green', price: 80, type: 'skin', color: '#10b981' },
  { id: 'skin_gold', name_ar: 'مظهر الذهب الملكي', name_en: 'Imperial Gold Glow', price: 120, type: 'skin', color: '#eab308' },
];

export default function App() {
  const [activeTab, setActiveTab ] = useState<'simulator' | 'architecture' | 'code'>('simulator');
  const [selectedLanguage, setSelectedLanguage] = useState<'ar' | 'en'>('ar');

  // --- GAME STATES ---
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [stageMode, setStageMode] = useState<number | 'endless'>(1); // Stage 1, Stage 50, Stage 100, or endless
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [coins, setCoins] = useState<number>(180); // Default budget for players to test the shop immediately
  const [accuracy, setAccuracy] = useState<number>(100);
  const [notesSpawnedCount, setNotesSpawnedCount] = useState<number>(0);
  const [notesHitCount, setNotesHitCount] = useState<number>(0);
  const [bpm, setBpm] = useState<number>(90);
  const [scrollSpeed, setScrollSpeed] = useState<number>(4); // speed factor (percent change per frame)
  const [petAnim, setPetAnim] = useState<'idle' | 'dancing' | 'bouncing' | 'sad'>('idle');
  const [hitFeedback, setHitFeedback] = useState<'Perfect' | 'Great' | 'Good' | 'Miss' | null>(null);
  
  // Customization States
  const [unlockedItems, setUnlockedItems] = useState<string[]>(['glasses']); // starts with glasses unlocked
  const [equippedOutfit, setEquippedOutfit] = useState<string>('glasses');
  const [equippedSkin, setEquippedSkin] = useState<string>('skin_cyan');

  // Keyboard controls status tracking (to show visual taps on lanes)
  const [lanePressed, setLanePressed] = useState<boolean[]>([false, false, false, false]);

  // Active simulated notes list
  const [notes, setNotes] = useState<SimulatedNote[]>([]);
  
  // Latency & Tolerance parameters
  const [audioLatencyMs, setAudioLatencyMs] = useState<number>(45); // customizable visual offset
  const [triggerTolerances, setTriggerTolerances] = useState({
    perfect: 2.5, // percent vertical difference
    great: 5.5,
    good: 9.0
  });

  // Endless Mode Tracker
  const [endlessTimeElapsed, setEndlessTimeElapsed] = useState<number>(0);

  // Suggested Song & Auto-Play simulation state
  const [selectedSongId, setSelectedSongId] = useState<string>('twinkle');
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const melodyIndexRef = useRef<number>(0);

  // References
  const gameLoopRef = useRef<number | null>(null);
  const lastSpawnTimeRef = useRef<number>(0);
  const noteIdCounterRef = useRef<number>(0);
  const scoreRef = useRef<number>(score);
  const comboRef = useRef<number>(combo);
  const coinsRef = useRef<number>(coins);
  const accuracyRef = useRef<number>(accuracy);

  // Synchronize refs for closure access in requestAnimationFrame
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { comboRef.current = combo; }, [combo]);
  useEffect(() => { coinsRef.current = coins; }, [coins]);
  useEffect(() => { accuracyRef.current = accuracy; }, [accuracy]);

  // Adjust parameters when song or stage selection shifts
  useEffect(() => {
    resetGame();
    melodyIndexRef.current = 0;
    
    if (stageMode === 'endless') {
      setBpm(120);
      setScrollSpeed(5.0);
    } else {
      const activeSong = SUGGESTED_SONGS.find(s => s.id === selectedSongId) || SUGGESTED_SONGS[0];
      setBpm(activeSong.bpm);
      const computedSpeed = 3.6 + (activeSong.difficulty * 0.65);
      setScrollSpeed(computedSpeed);
    }
  }, [stageMode, selectedSongId]);

  // Handle Mute changes
  useEffect(() => {
    synth.isMuted = isMuted;
  }, [isMuted]);

  // --- DART CODE VIEWER STATES ---
  const [selectedCodeKey, setSelectedCodeKey] = useState<string>('rhythm_paws_game');
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);
  const [searchCodeQuery, setSearchCodeQuery] = useState<string>('');

  // --- ARCHITECTURE EXPLORER STATES ---
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'rhythm_paws': true,
    'assets': true,
    'lib': true,
    'lib/features': true,
    'lib/features/rhythm_game': true,
    'lib/features/rhythm_game/presentation': true,
    'lib/features/rhythm_game/presentation/flame': true,
  });
  const [selectedNode, setSelectedNode] = useState<FileSystemNode>(FLUTTER_CLEAN_STRUCTURE);

  const toggleNodeExpand = (path: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // Pre-load description mapping for clean architecture concepts
  const getArchitectureLayerDetails = (node: FileSystemNode) => {
    if (node.name === 'lib') {
      return {
        title_ar: "نواة التطبيقات (Main Codebase)",
        title_en: "Core Application Codebase",
        desc_ar: "هنا يكمن بيت برمجيات اللعبة بالكامل. نطبق هنا Clean Architecture لنعزل منطق اللعبة (Engine) عن تفاصيل العرض والمسارات الجانبية.",
        desc_en: "This represents the main source of the application coding. Using Clean Architecture permits full business decoupling from display or native configurations."
      };
    }
    if (node.name.includes('data')) {
      return {
        title_ar: "طبقة البيانات (Data Layer)",
        title_en: "Data Infrastructure Layer",
        desc_ar: "تتحمل هذه الطبقة مسؤولية تنزيل النوتات الموسيقية والمراحل من ملفات الـ JSON (Asset Data Source)، وحفظ النقاط والعملات في الذاكرة المحلية (SharedPreferences Database). تتكون من نماذج البيانات (Models) ومصادر البيانات (DataSources).",
        desc_en: "This layer manages fetching note parameters from static JSON charts (Asset Data Sources) and persisting earned gold credits in local local storage models."
      };
    }
    if (node.name.includes('domain')) {
      return {
        title_ar: "طبقة المنطق والقواعد (Domain Layer - Pure Dart)",
        title_en: "Core Enterprise Domain Layer",
        desc_ar: "أهم طبقة في المشروع. خالية بالكامل من أي حزم أو تبعيات من Flutter أو Flame. تحتوي على كينونات اللعبة (Entities) مثل النوتة الموسيقية (NoteEntity) وحالات الحيوان (HeroPetState) والعمليات الحسابية (UseCases) لتقييم الدقة وحساب الجوائز.",
        desc_en: "The structural heart of the system. Fully independent of Flame or Flutter. Contains basic entities (PlayableNote, SingingPet) and mathematical UseCases calculations."
      };
    }
    if (node.name.includes('presentation')) {
      return {
        title_ar: "طبقة العرض والواجهات (Presentation Layer)",
        title_en: "Visual & Interface Presentation Layer",
        desc_ar: "تدمج هذه الطبقة بين واجهات Flutter المعهودة (القوائم الرئيسية، المتجر، إحصائيات الخسارة والفوز) وبين محرك الألعاب Flame Canvas الممتد عبر الفئات الرسومية. نستخدم BLoC أو Riverpod لربط أحداث اللعب القادمة من Flame بالـ Widgets.",
        desc_en: "Integrates Flutter native layouts (Menus, Custom Shop widgets) alongside the high-performance rendering Flame Canvas classes."
      };
    }
    if (node.name.includes('flame')) {
      return {
        title_ar: "محرك اللعبة (Flame Engine Subsystem)",
        title_en: "Flame Subsystem Engine Architecture",
        desc_ar: "المكان المخصص لبناء الأشكال والتحركات ثنائية الأبعاد. يدير دورة حياة اللعب (onLoad، update، render). يولد البلاطات ويعرض تفاعل الحي الصغير عند النقر بفضل دورة التحديث التلقائي (60FPS Game Loop).",
        desc_en: "Houses the 2D Game components. Extends lifecycle workflows (Loads, Updates, and Paints) rendering characters and falling tiles in constant time frames."
      };
    }
    if (node.name.includes('audio')) {
      return {
        title_ar: "التحكم بالصوت ومنع التأخير (Low Latency Audio Core)",
        title_en: "Low-Latency Audio Synchronization Module",
        desc_ar: "يتتبع مشاكل تأخير الصوت القاتلة خاصة في هواتف الأندرويد. يشغل المقاطع الصوتية بالتزامن الدقيق مع الـ update loop باستخدام ترميز OGG سريعة الرنين وحزم الاندرويد المنخفضة التأخير SoundPool.",
        desc_en: "Traces structural lagging latency across OS pipelines. Configures responsive audio caches employing fast OGG files and the Dart SoundPool engine."
      };
    }
    return {
      title_ar: node.name,
      title_en: node.name,
      desc_ar: node.description,
      desc_en: node.description
    };
  };

  // --- KEYBOARD LISTENER FOR LIVE SIMULATOR ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      let laneIdx = -1;
      if (key === 'd') laneIdx = 0;
      else if (key === 'f') laneIdx = 1;
      else if (key === 'j') laneIdx = 2;
      else if (key === 'k') laneIdx = 3;

      if (laneIdx !== -1) {
        e.preventDefault();
        triggerLaneTap(laneIdx);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      let laneIdx = -1;
      if (key === 'd') laneIdx = 0;
      else if (key === 'f') laneIdx = 1;
      else if (key === 'j') laneIdx = 2;
      else if (key === 'k') laneIdx = 3;

      if (laneIdx !== -1) {
        setLanePressed(prev => {
          const next = [...prev];
          next[laneIdx] = false;
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying, notes, stageMode, bpm, score, combo]);

  // --- GAME SYSTEM ANIMATION LOOP ---
  useEffect(() => {
    if (isPlaying && !isGameOver) {
      lastSpawnTimeRef.current = performance.now();
      const tick = (now: number) => {
        updateGamePhysics(now);
        gameLoopRef.current = requestAnimationFrame(tick);
      };
      gameLoopRef.current = requestAnimationFrame(tick);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isPlaying, isGameOver, notes, stageMode, bpm, scrollSpeed]);

  // Reset the statistics
  const resetGame = () => {
    setNotes([]);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setAccuracy(100);
    setNotesSpawnedCount(0);
    setNotesHitCount(0);
    setIsGameOver(false);
    setPetAnim('idle');
    setHitFeedback(null);
    setEndlessTimeElapsed(0);
  };

  const startGame = () => {
    resetGame();
    setIsPlaying(true);
  };

  const stopGame = () => {
    setIsPlaying(false);
  };

  // PHYSICS UPDATE & SPAWNER LOOP
  const updateGamePhysics = (now: number) => {
    let currentBpm = bpm;
    let speed = scrollSpeed;

    // Endless density calculation
    if (stageMode === 'endless') {
      const elapsedSec = endlessTimeElapsed + 0.016; // estimating ~60fps frame increments
      setEndlessTimeElapsed(elapsedSec);
      
      // mathematical curve representing increasing speed and BPM
      speed = scrollSpeed + Math.log2(elapsedSec + 1) * 0.75;
      currentBpm = bpm + Math.min(60, elapsedSec * 0.25);
    }

    // Dynamic node generator
    const spawnThresholdMs = (60 / currentBpm) * 1000; // interval in milliseconds
    const timeSinceLastSpawn = now - lastSpawnTimeRef.current;

    setNotes(prevNotes => {
      // 1. Slither tile nodes down the vertical vector and apply auto-play hit triggers
      let updatedNotes = prevNotes.map(n => {
        let isNotePlayed = n.played;
        
        // If auto-play is enabled and the note crosses the visual hitbar height threshold (83% - 86.5%)
        if (isAutoPlay && !n.played && !n.missed && n.y >= 83 && n.y <= 86.5) {
          isNotePlayed = true;
          // Trigger visual feedback and synthesized melody sound instantly
          setTimeout(() => {
            setLanePressed(prev => {
              const next = [...prev];
              next[n.lane] = true;
              return next;
            });
            setTimeout(() => {
              setLanePressed(prev => {
                const next = [...prev];
                next[n.lane] = false;
                return next;
              });
            }, 80);
            handleTileHit('Perfect', n.id);
          }, 0);
        }

        return {
          ...n,
          played: isNotePlayed,
          y: n.y + speed
        };
      });

      // 2. Identify and trigger missed tiles that passed our hit-line (85% down)
      updatedNotes = updatedNotes.map(n => {
        // If note passes beyond 93.5% line with NO trigger -> missed!
        if (n.y > 93.5 && !n.played && !n.missed) {
          handleTileMiss();
          return { ...n, missed: true };
        }
        return n;
      });

      // Sweep old notes out of state to bypass memory leak
      updatedNotes = updatedNotes.filter(n => n.y < 120);

      const notesToSpawn: SimulatedNote[] = [];
      if (timeSinceLastSpawn >= spawnThresholdMs) {
        lastSpawnTimeRef.current = now;
        
        // Endless vs Stage spawning distribution
        const numNotesToSpawn = stageMode === 'endless' && Math.random() < 0.25 ? 2 : 1;
        const usedLanes = new Set<number>();
        
        for (let idx = 0; idx < numNotesToSpawn; idx++) {
          let targetLane = Math.floor(Math.random() * 4);
          let attempts = 0;
          while (usedLanes.has(targetLane) && attempts < 10) {
            targetLane = Math.floor(Math.random() * 4);
            attempts++;
          }
          usedLanes.add(targetLane);

          // Tap vs Long tiles ratios (e.g. 25% holds in difficult phases)
          const isHoldType = Math.random() < (stageMode === 'endless' ? Math.min(0.35, 0.1 + endlessTimeElapsed / 200) : (stageMode === 100 ? 0.25 : 0.08));

          const newId = noteIdCounterRef.current++;
          notesToSpawn.push({
            id: newId,
            lane: targetLane,
            type: isHoldType ? 'hold' : 'tap',
            y: 0,
            duration: isHoldType ? 24 + Math.random() * 32 : 0,
            played: false,
            missed: false
          });
        }
        setNotesSpawnedCount(prev => prev + notesToSpawn.length);
        return [...updatedNotes, ...notesToSpawn];
      }
      return updatedNotes;
    });
  };

  const handleTileMiss = () => {
    synth.playMeow(false);
    setCombo(0);
    setPetAnim('sad');
    setHitFeedback('Miss');
    
    // Auto-timeout rating feedback
    setTimeout(() => {
      setHitFeedback(prev => prev === 'Miss' ? null : prev);
    }, 450);

    // Recalculate accuracy ratio
    setNotesHitCount(hitCount => {
      setNotesSpawnedCount(spawnCount => {
        if (spawnCount > 0) {
          const accVal = Math.round((hitCount / spawnCount) * 1000) / 10;
          setAccuracy(accVal);
        }
        return spawnCount;
      });
      return hitCount;
    });
  };

  // TAP LANE MECHANISM
  const triggerLaneTap = (laneIdx: number) => {
    // Keep visualization glowing for a moment
    setLanePressed(prev => {
      const next = [...prev];
      next[laneIdx] = true;
      return next;
    });

    synth.playTapTone(laneIdx);

    if (!isPlaying || isGameOver) return;

    // Filter notes on this lane that are close to the hit-bar (85%)
    setNotes(prevNotes => {
      // Find closest unplayed note on this specific lane
      const laneNotes = prevNotes.filter(n => n.lane === laneIdx && !n.played && !n.missed);
      if (laneNotes.length === 0) return prevNotes;

      // Find the one closest to the ideal trigger position (85%)
      let closestNote: SimulatedNote | null = null;
      let minDistance = 1000;
      
      for (const note of laneNotes) {
        const dist = Math.abs(note.y - 85);
        if (dist < minDistance) {
          minDistance = dist;
          closestNote = note;
        }
      }

      if (closestNote) {
        // Evaluate hit assessment depending on tolerance offsets
        if (minDistance <= triggerTolerances.perfect) {
          // PERFECT
          handleTileHit('Perfect', closestNote.id);
          return prevNotes.map(n => n.id === closestNote!.id ? { ...n, played: true } : n);
        } else if (minDistance <= triggerTolerances.great) {
          // GREAT
          handleTileHit('Great', closestNote.id);
          return prevNotes.map(n => n.id === closestNote!.id ? { ...n, played: true } : n);
        } else if (minDistance <= triggerTolerances.good) {
          // GOOD
          handleTileHit('Good', closestNote.id);
          return prevNotes.map(n => n.id === closestNote!.id ? { ...n, played: true } : n);
        }
      }
      return prevNotes;
    });
  };

  const handleTileHit = (rating: 'Perfect' | 'Great' | 'Good', noteId: number) => {
    // Dynamically retrieve the frequency matching our current position in the selected melody
    const activeSong = SUGGESTED_SONGS.find(s => s.id === selectedSongId) || SUGGESTED_SONGS[0];
    const notesMelody = activeSong.melody;
    const currentFreq = notesMelody[melodyIndexRef.current % notesMelody.length];
    
    synth.playMelodyMeow(currentFreq);
    melodyIndexRef.current = melodyIndexRef.current + 1;

    setHitFeedback(rating);
    
    // Set pet dance state
    if (rating === 'Perfect') {
      setPetAnim('dancing');
    } else if (rating === 'Great') {
      setPetAnim('bouncing');
    } else {
      setPetAnim('idle');
    }

    setTimeout(() => {
      setHitFeedback(prev => prev === rating ? null : prev);
    }, 450);

    // Compute metrics
    setCombo(prev => {
      const next = prev + 1;
      if (next > maxCombo) setMaxCombo(next);
      return next;
    });

    // Multiplier bonus scale
    let addition = 50;
    if (rating === 'Perfect') addition = 100;
    else if (rating === 'Great') addition = 80;

    let localMultiplier = 1;
    if (comboRef.current >= 20) localMultiplier = 4;
    else if (comboRef.current >= 10) localMultiplier = 2;

    setScore(prev => prev + (addition * localMultiplier));

    // Grant stage completion coins rewards
    const coinChance = rating === 'Perfect' ? 0.35 : (rating === 'Great' ? 0.20 : 0.08);
    if (Math.random() < coinChance) {
      setCoins(prev => prev + 1);
    }

    // Reset accuracy values
    setNotesHitCount(prevHit => {
      const nextHit = prevHit + 1;
      setNotesSpawnedCount(spawnCount => {
        if (spawnCount > 0) {
          const accVal = Math.round((nextHit / spawnCount) * 1000) / 10;
          setAccuracy(accVal);
        }
        return spawnCount;
      });
      return nextHit;
    });
  };

  // SHOPPING PURCHASE TRIGGER
  const buyShopItem = (item: ShopItem) => {
    if (unlockedItems.includes(item.id)) return;
    if (coins < item.price) {
      alert(selectedLanguage === 'ar' ? "رصيد عملاتك غير كافي لفتح هذا العنصر!" : "Insufficient gold Paw Coins!");
      return;
    }

    setCoins(prev => prev - item.price);
    setUnlockedItems(prev => [...prev, item.id]);

    if (item.type === 'outfit') setEquippedOutfit(item.id);
    else setEquippedSkin(item.id);
  };

  const selectShopItem = (item: ShopItem) => {
    if (item.type === 'outfit') setEquippedOutfit(item.id);
    else setEquippedSkin(item.id);
  };

  // Get matching hex for fallback skin colors
  const getSkinHexColor = () => {
    const active = SHOP_ITEMS.find(i => i.id === equippedSkin);
    return active?.color || '#38bdf8'; // light sky blue default
  };

  // Copy code implementation helper
  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  // Render file system recursively
  const renderFileSystemTree = (node: FileSystemNode, depth = 0, currentPath = '') => {
    const relativePath = currentPath ? `${currentPath}/${node.name}` : node.name;
    const isExpanded = expandedNodes[relativePath];
    const isSelected = selectedNode.name === node.name;

    return (
      <div key={relativePath} className="select-none">
        <div 
          onClick={() => {
            setSelectedNode(node);
            if (node.type === 'directory') toggleNodeExpand(relativePath);
            if (node.codeKey) setSelectedCodeKey(node.codeKey);
          }}
          style={{ paddingLeft: `${depth * 14}px` }}
          className={`flex items-center py-2 px-3 rounded-md cursor-pointer transition-colors duration-150 ${
            isSelected 
              ? 'bg-amber-500/10 border-l-2 border-amber-500 text-amber-200 font-medium' 
              : 'hover:bg-slate-800/60 text-slate-300'
          }`}
        >
          <div className="mr-2 text-slate-400">
            {node.type === 'directory' ? (
              <ChevronRight className={`h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            ) : <span className="w-4 h-4 block" />}
          </div>

          <div className="mr-2">
            {node.type === 'directory' ? (
              isExpanded ? <FolderOpen className="h-4.5 w-4.5 text-amber-400" /> : <Folder className="h-4.5 w-4.5 text-amber-500" />
            ) : (
              <FileCode className="h-4.5 w-4.5 text-cyan-400" />
            )}
          </div>

          <span className="font-mono text-sm leading-none">{node.name}</span>
          {node.codeKey && (
            <span className="ml-auto bg-cyan-950/40 border border-cyan-800/60 text-[10px] text-cyan-400 px-1.5 py-0.5 rounded uppercase font-mono tracking-wider font-semibold">
              Dart
            </span>
          )}
        </div>

        {node.type === 'directory' && isExpanded && node.children && (
          <div className="border-l border-slate-800/60 ml-3.5 pl-1.5 mt-0.5 space-y-0.5">
            {node.children.map(child => renderFileSystemTree(child, depth + 1, relativePath))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      
      {/* HEADER SECTION */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & title */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-amber-500 text-slate-950 rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg border border-amber-400 shadow-amber-500/10">
              🐾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-black tracking-tight text-white">Rhythm Paws</h1>
                <span className="bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs px-2 py-0.5 rounded-full font-semibold font-mono">
                  v1.2 Beta
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {selectedLanguage === 'ar' 
                  ? "محاكي لعبة إيقاعية ومطبخ المطور لبنزين Flutter & Flame Engine"
                  : "Rhythm game simulation and workbench for high-performance Flutter/Flame setups"
                }
              </p>
            </div>
          </div>

          {/* Controls bar */}
          <div className="flex items-center gap-3">
            
            {/* Language Flag Switcher */}
            <button
              onClick={() => setSelectedLanguage(l => l === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 font-medium px-3 py-2 rounded-lg border border-slate-800 cursor-pointer transition-colors"
            >
              🌐 {selectedLanguage === 'ar' ? 'English (EN)' : 'العربية (AR)'}
            </button>

            {/* Paw Coin status indicator */}
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 px-3.5 py-1.5 rounded-lg text-sm font-bold animate-float">
              <Coins className="h-4.5 w-4.5 text-amber-400 fill-amber-400/20" />
              <span className="font-mono">{coins}</span>
              <span className="text-[10px] text-amber-400 font-light ml-0.5">C</span>
            </div>

            {/* Mute button */}
            <button 
              onClick={() => setIsMuted(m => !m)}
              className="p-2.5 bg-slate-900 text-slate-400 hover:text-white rounded-lg border border-slate-800 transition-colors cursor-pointer"
              title={isMuted ? "Unmute sound" : "Mute sound"}
            >
              {isMuted ? <VolumeX className="h-4.5 w-4.5 text-red-400" /> : <Volume2 className="h-4.5 w-4.5 text-amber-400" />}
            </button>
          </div>

        </div>
      </header>

      {/* TABS SWITCHER */}
      <nav className="bg-slate-900 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 flex gap-1">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-6 py-4.5 font-semibold text-sm transition-all focus:outline-none cursor-pointer border-b-2 ${
              activeTab === 'simulator' 
                ? 'border-amber-500 text-white bg-slate-950/40 font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Smartphone className="h-4 w-4" />
            <span>{selectedLanguage === 'ar' ? '🎮 محاكي اللعبة والملابس' : '🎮 Game & Customization'}</span>
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 px-6 py-4.5 font-semibold text-sm transition-all focus:outline-none cursor-pointer border-b-2 ${
              activeTab === 'architecture' 
                ? 'border-amber-500 text-white bg-slate-950/40 font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>{selectedLanguage === 'ar' ? '📂 المعمارية وهيكلة المجلدات' : '📂 Clean Architecture Explorer'}</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-6 py-4.5 font-semibold text-sm transition-all focus:outline-none cursor-pointer border-b-2 ${
              activeTab === 'code' 
                ? 'border-amber-500 text-white bg-slate-950/40 font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <FileCode className="h-4 w-4" />
            <span>{selectedLanguage === 'ar' ? '💻 كود البداية Flame / Dart' : '💻 Starter Flame Codes'}</span>
          </button>
        </div>
      </nav>

      {/* CORE CONTENT LAYOUT */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 pb-20">
        
        {/* TAB 1: SCREEN SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* left column: controllers */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Level options card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <Sliders className="h-5 w-5 text-amber-500" />
                  <h3 className="font-bold text-white text-lg">
                    {selectedLanguage === 'ar' ? 'تعديل المرحلة والسرعة' : 'Configure Stage Settings'}
                  </h3>
                </div>

                <div className="space-y-4">
                  
                  {/* SUGGESTED SONG LIST SELECTOR */}
                  <div>
                    <label className="text-xs text-amber-400 font-extrabold uppercase tracking-wider block mb-2.5 flex items-center gap-1">
                      <Music className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                      <span>{selectedLanguage === 'ar' ? 'اختر الأغنية لتشغيل المحاكي:' : 'Select Temporary Suggested Song:'}</span>
                    </label>
                    
                    <div className="space-y-1.5 max-h-[195px] overflow-y-auto pr-1 bg-slate-950/40 p-2 rounded-lg border border-slate-850">
                      {SUGGESTED_SONGS.map(song => {
                        const isSelected = selectedSongId === song.id && stageMode !== 'endless';
                        return (
                          <button
                            key={song.id}
                            onClick={() => {
                              setStageMode(1); // exit endless mode
                              setSelectedSongId(song.id);
                            }}
                            className={`w-full py-2 px-3 rounded-lg text-xs font-bold text-left border flex items-center justify-between cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-amber-500/15 border-amber-500 text-amber-200' 
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-850'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm shrink-0">{song.emoji}</span>
                              <div className="text-left">
                                <span className={`block font-semibold ${isSelected ? 'text-amber-300' : 'text-slate-300 font-normal'}`}>
                                  {selectedLanguage === 'ar' ? song.name_ar : song.name_en}
                                </span>
                                <span className="text-[9px] font-mono text-slate-500 font-normal">
                                  BPM: {song.bpm} • {selectedLanguage === 'ar' ? 'لحن دائم' : 'Continuous melody'}
                                </span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-[10px] text-amber-400 font-mono tracking-wide">
                                {'🐾'.repeat(song.difficulty)}
                              </div>
                            </div>
                          </button>
                        );
                      })}

                      {/* Endless Mode Button inside target options */}
                      <button
                        onClick={() => setStageMode('endless')}
                        className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold text-left border flex items-center justify-between cursor-pointer transition-all ${
                          stageMode === 'endless'
                            ? 'bg-gradient-to-r from-red-500/20 to-amber-500/20 border-amber-400 text-white font-black animate-pulse-ring' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-850'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">🔥</span>
                          <div>
                            <span className="block">{selectedLanguage === 'ar' ? 'الطور اللانهائي التوليدي (Endless)' : 'Endless Mashup Mode'}</span>
                            <span className="text-[9px] font-normal font-mono text-red-400">
                              BPM: 120 → 180 (Speed escalates)
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] bg-red-500 text-white font-black px-1.5 py-0.5 rounded uppercase">PRO</span>
                      </button>
                    </div>
                  </div>

                  {/* AUTOMATED SIMULATOR CHANNELS AUTO-PLAY TOGGLE */}
                  <div className="bg-slate-950/80 border border-slate-850 p-3.5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <span className="text-xs font-black text-white block">
                          {selectedLanguage === 'ar' ? 'تفعيل العزف التلقائي (Auto-Play) 🤖' : 'Activate Auto-Play (Bot) 🤖'}
                        </span>
                        <span className="text-[10px] text-slate-400 leading-normal block max-w-[210px] mt-0.5">
                          {selectedLanguage === 'ar' 
                            ? "يقوم بالضغط التلقائي بدقة Perfect لمشاهدة واختبار اللعبة كفيديو توضيحي."
                            : "Triggers perfect hits programmatically to audit feline synthesis notes sync."
                          }
                        </span>
                      </div>
                      <button
                        onClick={() => setIsAutoPlay(prev => !prev)}
                        className={`w-12 h-6.5 rounded-full p-1 transition-colors shrink-0 cursor-pointer ${
                          isAutoPlay ? 'bg-amber-500' : 'bg-slate-800'
                        }`}
                      >
                        <div className={`bg-slate-950 w-4.5 h-4.5 rounded-full shadow-md transform transition-transform ${
                          isAutoPlay ? 'translate-x-5.5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* Level characteristics panel */}
                  <div className="bg-slate-950 border border-slate-850 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>{selectedLanguage === 'ar' ? 'سرعة النوتة (BPM)' : 'Tempo (BPM)'}</span>
                      <span className="font-mono text-white text-sm font-semibold">{bpm.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>{selectedLanguage === 'ar' ? 'سرعة انزلاق البلاطات' : 'Tile Scroll Speed'}</span>
                      <span className="font-mono text-cyan-400 text-sm font-semibold">{scrollSpeed.toFixed(1)}x</span>
                    </div>
                    {stageMode === 'endless' && (
                      <div className="border-t border-slate-900 pt-2 mt-1">
                        <div className="flex justify-between items-center text-xs text-red-400">
                          <span>Endless Elapsed Time</span>
                          <span className="font-mono text-red-300 font-bold">{endlessTimeElapsed.toFixed(1)}s</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          * Speed scales dynamically over logarithmic difficulty curve.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Controls help text */}
                  <div className="bg-amber-950/20 border border-amber-500/10 rounded-lg p-3 text-xs text-amber-300/90 leading-relaxed">
                    <div className="flex items-center gap-1.5 font-semibold text-amber-300 mb-1">
                      <Cpu className="h-3.5 w-3.5" />
                      <span>{selectedLanguage === 'ar' ? 'طريقة التحكم من الكيبورد:' : 'Desktop Keyboard Controls:'}</span>
                    </div>
                    <span>
                      {selectedLanguage === 'ar' 
                        ? "استخدم مفاتيح [ D ، F ، J ، K ] من اليسار إلى اليمين لتفعيل النقر على المسارات الأربعة!"
                        : "Press [ D , F , J , K ] keys on your physical keyboard from Left to Right to trigger exact lane hits!"
                      }
                    </span>
                  </div>

                </div>
              </div>

              {/* Shopping Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-amber-500" />
                    <h3 className="font-bold text-white text-lg">
                      {selectedLanguage === 'ar' ? 'متجر القط والأشكال' : 'Customize & Cats Shop'}
                    </h3>
                  </div>
                  <span className="bg-amber-500/10 text-amber-400 text-xs px-2 py-0.5 rounded font-bold font-mono">
                    Paw Store
                  </span>
                </div>

                <div className="space-y-4">
                  
                  {/* Outfit section */}
                  <div>
                    <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                      {selectedLanguage === 'ar' ? 'ملابس الحيوان الأليف (Outfits):' : 'Pet Accessories & Hats:'}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {SHOP_ITEMS.filter(it => it.type === 'outfit').map(item => {
                        const isUnlocked = unlockedItems.includes(item.id);
                        const isEquipped = equippedOutfit === item.id;
                        return (
                          <div 
                            key={item.id}
                            className={`p-2.5 rounded-lg border flex flex-col justify-between gap-1.5 transition-all relative ${
                              isEquipped 
                                ? 'bg-amber-950/20 border-amber-500 shadow-md' 
                                : isUnlocked 
                                  ? 'bg-slate-950 border-slate-800 hover:border-slate-700' 
                                  : 'bg-slate-950/40 border-slate-900/60 opacity-80'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-xl leading-none">{item.previewEmoji}</span>
                              {isEquipped && (
                                <span className="text-[9px] bg-amber-500 text-slate-950 px-1 py-0.5 rounded font-black uppercase">
                                  {selectedLanguage === 'ar' ? 'مجهز' : 'Active'}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-200">
                                {selectedLanguage === 'ar' ? item.name_ar : item.name_en}
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                                {!isUnlocked ? `${item.price} Coins` : (selectedLanguage === 'ar' ? 'مفتوح (تجهيز)' : 'Unlocked')}
                              </div>
                            </div>
                            
                            {!isUnlocked ? (
                              <button
                                onClick={() => buyShopItem(item)}
                                className="w-[84%] self-center mt-1 py-1 px-2 text-[10px] font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded cursor-pointer transition-colors"
                              >
                                {selectedLanguage === 'ar' ? 'شراء 🔓' : 'Unlock 🔓'}
                              </button>
                            ) : (
                              !isEquipped && (
                                <button
                                  onClick={() => selectShopItem(item)}
                                  className="w-[84%] self-center mt-1 py-1 px-2 text-[10px] font-bold bg-slate-800 hover:bg-slate-750 text-slate-200 rounded cursor-pointer transition-colors"
                                >
                                  {selectedLanguage === 'ar' ? 'ارتداء' : 'Equip'}
                                </button>
                              )
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tile skins section */}
                  <div>
                    <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                      {selectedLanguage === 'ar' ? 'ألوان نوتات البلاطات (Tiles):' : 'Vandal Tile Glows:'}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {SHOP_ITEMS.filter(it => it.type === 'skin').map(item => {
                        const isUnlocked = unlockedItems.includes(item.id);
                        const isEquipped = equippedSkin === item.id;
                        return (
                          <div 
                            key={item.id}
                            className={`p-2.5 rounded-lg border flex flex-col gap-1.5 transition-all ${
                              isEquipped 
                                ? 'bg-slate-950 border-slate-200 shadow shadow-white/5' 
                                : isUnlocked 
                                  ? 'bg-slate-950 border-slate-800 hover:border-slate-700' 
                                  : 'bg-slate-950/40 border-slate-900/60 opacity-80'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span 
                                className="h-4 w-4 rounded-full border border-white/20" 
                                style={{ backgroundColor: item.color }} 
                              />
                              <span className="text-xs font-bold text-slate-300">
                                {selectedLanguage === 'ar' ? item.name_ar : item.name_en}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {!isUnlocked ? `${item.price} Coins` : (selectedLanguage === 'ar' ? 'معتمد' : 'Owned')}
                            </div>

                            {!isUnlocked ? (
                              <button
                                onClick={() => buyShopItem(item)}
                                className="mt-1 py-1 text-[10px] font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded cursor-pointer transition-colors"
                              >
                                {selectedLanguage === 'ar' ? 'شراء 🔓' : 'Unlock 🔓'}
                              </button>
                            ) : (
                              !isEquipped && (
                                <button
                                  onClick={() => selectShopItem(item)}
                                  className="mt-1 py-1 text-[10px] font-bold bg-slate-800 hover:bg-slate-750 text-slate-200 rounded cursor-pointer transition-colors"
                                >
                                  {selectedLanguage === 'ar' ? 'تحديد' : 'Activate'}
                                </button>
                              )
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* center column (High fidelity phone layout simulator) */}
            <div className="lg:col-span-8 flex flex-col items-center">
              
              {/* Simulator screen container */}
              <div className="w-full max-w-[370px] bg-slate-950 rounded-[44px] border-[12px] border-slate-900 p-5 shadow-2xl relative overflow-hidden flex flex-col h-[670px]">
                
                {/* Phone Notch */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-4.5 bg-slate-900 rounded-full z-40 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800/80 mr-2" />
                  <div className="w-8 h-1 rounded-full bg-slate-800/60" />
                </div>

                {/* GAME STAGE HEADER / STATS */}
                <div className="mt-4 flex justify-between items-center z-30">
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400 font-semibold truncate max-w-[150px]">
                      {stageMode === 'endless' 
                        ? (selectedLanguage === 'ar' ? 'نمط لانهائي ♾️' : 'Endless Mashup ♾️') 
                        : (selectedLanguage === 'ar' 
                            ? SUGGESTED_SONGS.find(s => s.id === selectedSongId)?.name_ar 
                            : SUGGESTED_SONGS.find(s => s.id === selectedSongId)?.name_en)
                      }
                    </div>
                    <div className="text-lg font-bold font-mono text-white leading-tight">
                      {score.toLocaleString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {selectedLanguage === 'ar' ? 'الدقة' : 'Accuracy'}
                    </div>
                    <div className="text-sm font-bold font-mono text-cyan-400 leading-tight">
                      {accuracy}%
                    </div>
                  </div>
                </div>

                {/* VISUAL CUTE SINGING PET */}
                <div className="flex-1 flex flex-col items-center justify-center relative z-20 mt-2">
                  <div className="w-full max-w-[170px] h-[175px] bg-slate-900/40 rounded-3xl border border-slate-800/60 backdrop-blur-sm flex flex-col items-center justify-center p-3 relative">
                    
                    {/* Accessorized Crown / Hats atop pet */}
                    <div className="absolute -top-6 text-3xl animate-float">
                      {equippedOutfit === 'crown' && '👑'}
                      {equippedOutfit === 'party_hat' && '🥳'}
                      {equippedOutfit === 'cowboy_hat' && '🤠'}
                    </div>

                    {/* Cute responsive Cat Face (SVG) */}
                    <div className="relative">
                      {/* Glasses asset overlay */}
                      {equippedOutfit === 'glasses' && (
                        <span className="absolute top-[28px] left-[15px] z-30 text-2xl drop-shadow select-none">😎</span>
                      )}
                      
                      {/* Headphones overlay */}
                      {equippedOutfit === 'headphones' && (
                        <span className="absolute -top-3 -left-3.5 z-30 text-4xl drop-shadow pointer-events-none select-none">🎧</span>
                      )}

                      <svg 
                        width="110" 
                        height="100" 
                        viewBox="0 0 110 100" 
                        className={`transition-transform duration-100 ${
                          petAnim === 'dancing' ? 'scale-110 -translate-y-2' : 
                          petAnim === 'bouncing' ? 'scale-105 -translate-y-1' : 
                          petAnim === 'sad' ? 'translate-y-1 scale-95' : 'scale-100'
                        }`}
                      >
                        {/* Ears */}
                        <polygon 
                          points="15,25 35,5 45,35" 
                          fill={petAnim === 'sad' ? '#475569' : '#f97316'} 
                          className="origin-bottom-right"
                        />
                        <polygon 
                          points="95,25 75,5 65,35" 
                          fill={petAnim === 'sad' ? '#475569' : '#f97316'} 
                          className="origin-bottom-left"
                        />
                        
                        {/* Inner Ears */}
                        <polygon points="20,22 32,9 39,28" fill="#fda4af" />
                        <polygon points="90,22 78,9 71,28" fill="#fda4af" />

                        {/* Cat Head Circle */}
                        <circle 
                          cx="55" 
                          cy="50" 
                          r="40" 
                          fill={petAnim === 'sad' ? '#64748b' : '#fb923c'} 
                        />
                        
                        {/* Cheeks blush */}
                        {petAnim !== 'sad' && (
                          <>
                            <circle cx="28" cy="58" r="6" fill="#f87171" opacity="0.4" />
                            <circle cx="82" cy="58" r="6" fill="#f87171" opacity="0.4" />
                          </>
                        )}

                        {/* Eyes */}
                        {petAnim === 'sad' ? (
                          // Squeezed crying eyes
                          <>
                            <path d="M 28 48 Q 33 43 38 48" stroke="#000" strokeWidth="3.5" fill="none" />
                            <path d="M 72 48 Q 77 43 82 48" stroke="#000" strokeWidth="3.5" fill="none" />
                          </>
                        ) : petAnim === 'dancing' ? (
                          // Happy curved eyes
                          <>
                            <path d="M 26 50 Q 32 56 38 50" stroke="#000" strokeWidth="3.5" fill="none" />
                            <path d="M 72 50 Q 78 56 84 50" stroke="#000" strokeWidth="3.5" fill="none" />
                          </>
                        ) : (
                          // Normal blinking eyes
                          <>
                            <circle cx="33" cy="48" r="4.5" fill="#000" />
                            <circle cx="77" cy="48" r="4.5" fill="#000" />
                          </>
                        )}

                        {/* Nose */}
                        <polygon points="52,56 58,56 55,59" fill="#fda4af" />

                        {/* Mouth */}
                        {petAnim === 'sad' ? (
                          // Crying down wobbly mouth
                          <path d="M 50 66 Q 55 60 60 66" stroke="#f43f5e" strokeWidth="3.5" fill="none" />
                        ) : petAnim === 'dancing' || petAnim === 'bouncing' ? (
                          // Singing open heart mouth
                          <ellipse cx="55" cy="67" rx="9.5" ry="12.5" fill="#e11d48" />
                        ) : (
                          // Cat cute simple smile
                          <path d="M 47 62 Q 51 66 55 62 Q 59 66 63 62" stroke="#000" strokeWidth="2.5" fill="none" />
                        )}
                        
                        {/* Whiskers */}
                        {petAnim !== 'sad' && (
                          <>
                            <line x1="12" y1="52" x2="24" y2="54" stroke="#000" strokeWidth="1.5" />
                            <line x1="10" y1="60" x2="22" y2="60" stroke="#000" strokeWidth="1.5" />
                            <line x1="98" y1="52" x2="86" y2="54" stroke="#000" strokeWidth="1.5" />
                            <line x1="100" y1="60" x2="88" y2="60" stroke="#000" strokeWidth="1.5" />
                          </>
                        )}
                      </svg>

                      {/* Weeping Teardrops overlay */}
                      {petAnim === 'sad' && (
                        <>
                          <span className="absolute bottom-[20px] left-[20px] text-lg animate-bounce select-none">💧</span>
                          <span className="absolute bottom-[20px] right-[20px] text-lg animate-bounce select-none">💧</span>
                        </>
                      )}
                    </div>

                    {/* Pet Status Text */}
                    <div className="text-center mt-2.5">
                      <div className="text-xs font-bold text-amber-200">
                        {petAnim === 'sad' ? (selectedLanguage === 'ar' ? 'ساد الحزن! 💔' : 'Oh No! Miss!') : (selectedLanguage === 'ar' ? 'مواء نشط! 🎶' : 'Sings Happy! 🎤')}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        COMBO: <span className="text-cyan-400 font-black">{combo}</span>
                      </div>
                    </div>

                  </div>

                  {/* Rating Feedback Text Overlay */}
                  <AnimatePresence>
                    {hitFeedback && (
                      <motion.div
                        initial={{ scale: 0.3, opacity: 0, y: 15 }}
                        animate={{ scale: 1.15, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: -20 }}
                        className={`absolute z-30 font-display text-xl px-4 py-1.5 rounded-full font-black tracking-widest uppercase shadow-2xl ${
                          hitFeedback === 'Perfect' ? 'bg-amber-500 text-slate-950 shadow-amber-500/20' :
                          hitFeedback === 'Great' ? 'bg-cyan-500 text-slate-950 shadow-cyan-500/20' :
                          hitFeedback === 'Good' ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20' :
                          'bg-rose-500 text-white shadow-rose-500/20'
                        }`}
                      >
                        {hitFeedback === 'Miss' && (selectedLanguage === 'ar' ? 'خسارة!' : 'MISS!')}
                        {hitFeedback === 'Good' && (selectedLanguage === 'ar' ? 'جيد!' : 'GOOD!')}
                        {hitFeedback === 'Great' && (selectedLanguage === 'ar' ? 'رائع!' : 'GREAT!')}
                        {hitFeedback === 'Perfect' && (selectedLanguage === 'ar' ? 'مكتمل!' : 'PERFECT!')}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* --- CHANNELS / LANES MAIN BOARD --- */}
                <div className="h-[280px] w-full bg-slate-900/60 rounded-3xl border border-slate-800/80 relative flex overflow-hidden">
                  
                  {/* Vertical dividers representing lanes */}
                  <div className="absolute inset-y-0 left-1/4 border-l border-slate-800/50 pointer-events-none z-10" />
                  <div className="absolute inset-y-0 left-2/4 border-l border-slate-800/50 pointer-events-none z-10" />
                  <div className="absolute inset-y-0 left-3/4 border-l border-slate-800/50 pointer-events-none z-10" />

                  {/* The Target Line / Hitbar (Y=85%) */}
                  <div className="absolute top-[85%] left-0 right-0 h-1.5 bg-gradient-to-r from-slate-450 via-slate-650 to-slate-450 opacity-90 border-y border-white/10 z-20 flex items-center justify-between" />

                  {/* Glowing touch markers beneath hit line to visualize active taps */}
                  {[0, 1, 2, 3].map(idx => (
                    <div
                      key={idx}
                      className={`absolute top-[85%] h-5 w-[25%] pointer-events-none z-10 transition-all duration-100 ${
                        lanePressed[idx] ? 'bg-gradient-to-t from-transparent to-amber-500/40 opacity-100 scale-x-105' : 'opacity-0'
                      }`}
                      style={{ left: `${idx * 25}%` }}
                    />
                  ))}

                  {/* Falling Notes */}
                  {notes.map(note => (
                    <div
                      key={note.id}
                      className={`absolute w-[22%] rounded-md z-15 shadow-md flex items-center justify-center border-l-2 border-r-2 ${
                        note.played 
                          ? 'opacity-0 scale-75' 
                          : note.missed 
                            ? 'bg-rose-500/20 border-rose-600' 
                            : 'transition-all'
                      }`}
                      style={{
                        left: `${note.lane * 25 + 1.5}%`,
                        top: `${note.y}%`,
                        height: note.type === 'hold' ? `${note.duration}px` : '18px',
                        backgroundColor: note.missed ? 'rgba(239, 68, 68, 0.2)' : getSkinHexColor(),
                        borderColor: note.missed ? '#e11d48' : '#ffffff',
                        opacity: note.played ? 0 : 1
                      }}
                    >
                      {/* Visual pattern for hold connectors */}
                      {note.type === 'hold' && (
                        <div className="w-1 h-full bg-white/40 border-dashed border-r border-white/20" />
                      )}
                    </div>
                  ))}

                </div>

                {/* BOTTOM TAP SENSOR PENS */}
                <div className="grid grid-cols-4 gap-2 mt-3 z-30">
                  {[0, 1, 2, 3].map(idx => (
                    <button
                      key={idx}
                      onMouseDown={() => triggerLaneTap(idx)}
                      onMouseUp={() => setLanePressed(p => { const n = [...p]; n[idx] = false; return n; })}
                      onTouchStart={() => triggerLaneTap(idx)}
                      onTouchEnd={() => setLanePressed(p => { const n = [...p]; n[idx] = false; return n; })}
                      className={`py-6.5 rounded-2xl font-black font-mono transition-all text-sm flex flex-col items-center justify-center cursor-pointer select-none active:scale-95 ${
                        lanePressed[idx] 
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold scale-105' 
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                      style={{
                        borderColor: lanePressed[idx] ? getSkinHexColor() : 'rgba(51, 65, 85, 0.4)'
                      }}
                    >
                      <span className="text-sm font-semibold">
                        {idx === 0 && 'D'}
                        {idx === 1 && 'F'}
                        {idx === 2 && 'J'}
                        {idx === 3 && 'K'}
                      </span>
                    </button>
                  ))}
                </div>

                {/* GAME CONTROL HOVER FRAME */}
                <div className="absolute inset-x-0 bottom-1 flex items-center justify-center z-35 bg-slate-950/90 py-3.5 backdrop-blur-md rounded-t-3xl border-t border-slate-900">
                  <div className="flex items-center gap-3">
                    {!isPlaying ? (
                      <button
                        onClick={startGame}
                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-7 py-2.5 rounded-full text-xs uppercase cursor-pointer transition-colors shadow-lg shadow-amber-500/20"
                      >
                        <Play className="h-3.5 w-3.5 fill-slate-950" />
                        <span>{selectedLanguage === 'ar' ? 'تشغيل اللعب' : 'Start Play'}</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={stopGame}
                          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-full text-xs cursor-pointer transition-colors"
                        >
                          <Pause className="h-3.5 w-3.5 fill-white" />
                          <span>{selectedLanguage === 'ar' ? 'إيقاف مؤقت' : 'Pause'}</span>
                        </button>
                        <button
                          onClick={resetGame}
                          className="flex items-center justify-center p-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-full cursor-pointer transition-colors"
                          title="Reset Level"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>

              {/* Developer Real-time latency graph */}
              <div className="w-full max-w-[370px] mt-4 bg-slate-900 border border-slate-850 rounded-2xl p-4 leading-relaxed">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Info className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">
                      {selectedLanguage === 'ar' ? 'تعويض زمن استجابة التزامن' : 'Audio Sync Calibration'}
                    </span>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    Flame-Audio Sync
                  </span>
                </div>
                
                <div className="space-y-3">
                  <p className="text-[11px] text-slate-400">
                    {selectedLanguage === 'ar' 
                      ? "يدمج محاكي الويب زمن تأخر صوت قدره 45ms لضبط وصول البلاطات مع النطق. يمكنك تغيير العيار:"
                      : "Adjust timing delay tolerances configured in Flame notes processing algorithms for low-spec devices."
                    }
                  </p>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] text-slate-300">
                      <span>{selectedLanguage === 'ar' ? 'تأخير التعويض (Delay):' : 'Visual Offset Delay:'}</span>
                      <span className="font-mono text-cyan-300 font-bold">{audioLatencyMs} ms</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="150" 
                      value={audioLatencyMs}
                      onChange={(e) => setAudioLatencyMs(Number(e.target.value))}
                      className="w-full accent-cyan-400 h-1 bg-slate-950 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: ARCHITECTURE EXPLORER */}
        {activeTab === 'architecture' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Folder directory left tree */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl h-[600px] overflow-y-auto">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800">
                <Layers className="h-5 w-5 text-amber-500" />
                <h3 className="font-bold text-white text-base">
                  {selectedLanguage === 'ar' ? 'هيكلية مجلدات Flutter Clean Architecture' : 'Flutter Project Directories Tree'}
                </h3>
              </div>

              <div className="space-y-1">
                {renderFileSystemTree(FLUTTER_CLEAN_STRUCTURE)}
              </div>
            </div>

            {/* Details panel about selected layer */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Layer Explanation card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl leading-relaxed">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs px-2.5 py-1 rounded font-mono font-bold uppercase">
                    {selectedNode.type === 'directory' ? 'مجلد (Directory)' : 'ملف (File)'}
                  </span>
                  <h4 className="font-mono text-amber-150 text-sm font-bold truncate">
                    {selectedNode.name}
                  </h4>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {selectedLanguage === 'ar' ? getArchitectureLayerDetails(selectedNode).title_ar : getArchitectureLayerDetails(selectedNode).title_en}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {selectedLanguage === 'ar' ? getArchitectureLayerDetails(selectedNode).desc_ar : getArchitectureLayerDetails(selectedNode).desc_en}
                  </p>
                </div>

                {/* Additional engineering recommendations */}
                <div className="border-t border-slate-800 pt-5 mt-5 space-y-4">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Award className="h-4.5 w-4.5 text-amber-500" />
                    <span>
                      {selectedLanguage === 'ar' ? 'توصيات معمارية للألعاب الإيقاعية:' : 'Mobile Rhythm Game Architectures Guidelines:'}
                    </span>
                  </div>

                  <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
                    <li>
                      <strong>عزل كلي لمنطق الرنين (Separation of Controls)</strong>: 
                      {selectedLanguage === 'ar' 
                        ? " يجب ألا يعرف كود الـ FlameGame أي تفاصيل عن قواعد البيانات أو الـ API. يتم تبادل رصيد العملات والتحقق من التوافقية عبر البنية الكلاسيكية UseCases."
                        : " Flame game loops must never query databases or networks directly. Coins and scores should flow back into Widgets via BLoC streams."
                      }
                    </li>
                    <li>
                      <strong>ملفات الصوت وتلافي الفجوات (Latency Mitigation)</strong>:
                      {selectedLanguage === 'ar'
                        ? " استخدم صيغ Ogg سريعة الاستجابة ذات الترددات الخفيفة على نظام Android و CoreAudio WAV على iOS لضمان استجابة نقرات Perfect خالية من التأخير."
                        : " Employ lightweight encoded .ogg assets on Android and uncompressed AIFF/WAV files for iOS low-latency execution."
                      }
                    </li>
                    <li>
                      <strong>تزامن الفيديو مع رنين النغمة (Clock Synchronization)</strong>:
                      {selectedLanguage === 'ar'
                        ? " لا تعتمد على delta-time فقط، بل قم بمواءمة موضع البلاطات الفعلي بالاعتماد على التوقيت الكلي للأغنية بشكل دوري لتلافي تباعد البلاطة عن النغمة."
                        : " Sync positions referencing the absolute Audio Playback marker in seconds rather than just calculating cumulative loop frame durations."
                      }
                    </li>
                  </ul>
                </div>

              </div>

              {/* Endless formula overview */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl leading-relaxed">
                <div className="flex items-center gap-2 mb-3">
                  <Plus className="h-5 w-5 text-cyan-400" />
                  <h4 className="font-bold text-white text-base">
                    {selectedLanguage === 'ar' ? 'معادلات التوليد بعد المرحلة 100 (Post-100 Mathematical Curves)' : 'Post-100 Procedural Formulas'}
                  </h4>
                </div>
                
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  {selectedLanguage === 'ar'
                    ? "بمجرد تخطي الـ 100 مرحلة، تفعل خوارزمية التوليد التلقائي لضمان تجربة لعب لانهائية وتصاعدية الصعوبة:"
                    : "After completing the initial static stages, the Flame spawner initiates procedural routines to spawn notes using logarithmic formulas:"
                  }
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-lg">
                    <div className="text-[10px] text-cyan-400 font-mono font-black mb-1 uppercase">Notes Velocity formula</div>
                    <code className="text-sm font-mono text-cyan-200">Speed = Base + ln(t + 1) * 35</code>
                    <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">
                      {selectedLanguage === 'ar' ? 'تزداد سرعة هبوط البلاطات بشكل لوغاريتمي آمن لتفادي التسارع الفاصل القاتل.' : 'Accelerates falling tile speed safely avoiding extreme speeds.'}
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-lg">
                    <div className="text-[10px] text-amber-400 font-mono font-black mb-1 uppercase">Notes Timing Gap</div>
                    <code className="text-sm font-mono text-amber-200">Threshold = (60 / BPM) * Max(0.35, F(t))</code>
                    <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">
                      {selectedLanguage === 'ar' ? 'تتقارب المسافات البينوية بين النوتات تدريجياً لزيادة كثافة البلاطات على المدى اللولبي.' : 'Increases note density and syncopation step-triggers proportional to time elapsed.'}
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: STARTER DART/FLAME CODES */}
        {activeTab === 'code' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left sidebar: File selector */}
            <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-xl space-y-1">
              <div className="px-3 py-2 border-b border-slate-800 mb-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block">
                  {selectedLanguage === 'ar' ? 'اختر ملف برمجيات Flame' : 'Select Dart Code File'}
                </span>
              </div>
              
              {Object.entries(DART_CODES).map(([key, item]) => {
                const isSelected = selectedCodeKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCodeKey(key)}
                    className={`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-2 font-mono text-xs cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-amber-500/10 text-amber-200 border-l-2 border-amber-500 font-bold' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <FileCode className="h-4 w-4 text-cyan-400 shrink-0" />
                    <span className="truncate">{item.filename}</span>
                  </button>
                );
              })}
            </div>

            {/* Right side: Code view & text */}
            <div className="lg:col-span-9 space-y-5">
              
              {/* Main Code Viewer */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                
                {/* code header */}
                <div className="bg-slate-950 px-5 py-3 border-b border-slate-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                    <span className="text-xs font-mono text-slate-400 ml-2">
                      {DART_CODES[selectedCodeKey].filename}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyCode(DART_CODES[selectedCodeKey].code)}
                    className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-300 font-bold px-3 py-1.5 rounded border border-slate-800 cursor-pointer transition-all"
                  >
                    {copyFeedback ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">{selectedLanguage === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>{selectedLanguage === 'ar' ? 'نسخ الكود' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* code core block */}
                <div className="p-4 overflow-x-auto bg-slate-950 font-mono text-xs md:text-sm text-slate-300 leading-relaxed max-h-[500px] overflow-y-auto">
                  <pre className="text-left select-all whitespace-pre">
                    <code>{DART_CODES[selectedCodeKey].code}</code>
                  </pre>
                </div>

              </div>

              {/* Structural walkthroughs */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg leading-relaxed">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="h-5 w-5 text-amber-500" />
                  <h4 className="font-bold text-white text-base">
                    {selectedLanguage === 'ar' ? 'شرح كود البداية والتفاعل' : 'Starter Code Pipeline Explanation'}
                  </h4>
                </div>

                <div className="text-sm text-slate-300 space-y-3">
                  <p>
                    {selectedLanguage === 'ar'
                      ? "يتضمن ملفات البداية التي برمجناها لك هيكلية FlameGame كاملة متوافقة تماماً مع Clean Architecture:"
                      : "These initial FlameEngine classes are constructed carefully conforming with production Clean Architecture principles:"
                    }
                  </p>

                  <ul className="list-disc pl-5 text-xs text-slate-400 space-y-2 leading-relaxed">
                    <li>
                      <strong>RhythmPawsGame Class</strong>: 
                      {selectedLanguage === 'ar'
                        ? " كود اللعبة الأساسي المتجاوب مع اللمس وإدارة الـ update ticks وحقن النوتات وقياس تباعد النقر للحصول على perfect/great بدقة المللي ثانية."
                        : " Establishes system canvas viewport, parses stage charts configurations files, manages active timers, and monitors accuracy levels."
                      }
                    </li>
                    <li>
                      <strong>NoteComponent Class</strong>: 
                      {selectedLanguage === 'ar'
                        ? " المكون المسؤول عن هبوط البلاطات عمودياً، ينزل باستمرار ويتناسب لأسفل شريط التوقيت طبقاً لمعادلات المسافات والسرعة المعتمدة ومستوى الـ BPM."
                        : " Governs positions changes of Tap/Hold notes sliding on lanes vertically proportionate to elapsed target milliseconds and scroll velocity parameters."
                      }
                    </li>
                    <li>
                      <strong>PetSpriteComponent Class</strong>: 
                      {selectedLanguage === 'ar'
                        ? " يدير تحريك الحيوان الأليف ورسم الـ SVG أو الإطارات المتحركة على الـ Canvas بشكل مستقل مع تفعيل الرقص، الرد والتأفف عند الأخطاء المتكررة."
                        : " Tracks cat hero animations. Responds instantly with animated coordinates modifications reflecting perfect, great bounds or misses triggers."
                      }
                    </li>
                  </ul>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}
