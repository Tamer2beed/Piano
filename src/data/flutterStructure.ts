export interface FileSystemNode {
  name: string;
  type: 'file' | 'directory';
  description: string;
  children?: FileSystemNode[];
  codeKey?: string;
}

export const FLUTTER_CLEAN_STRUCTURE: FileSystemNode = {
  name: 'rhythm_paws',
  type: 'directory',
  description: 'The root directory of the Flutter project containing clean architecture layers and Flame pipeline.',
  children: [
    {
      name: 'android',
      type: 'directory',
      description: 'Native Android folder. Includes configuration for audio low-latency (SoundPool configuration in main activity if needed) and custom assets.',
    },
    {
      name: 'ios',
      type: 'directory',
      description: 'Native iOS folder. Includes configurations for low-latency CoreAudio setups.',
    },
    {
      name: 'assets',
      type: 'directory',
      description: 'Game assets including songs, sound effects, images, JSON charts, and fonts.',
      children: [
        {
          name: 'audio',
          type: 'directory',
          description: 'Low-latency Ogg/Wav/Mp3 audio files for pet sounds, background beats, and rhythm stages.',
        },
        {
          name: 'images',
          type: 'directory',
          description: 'Spritesheets for singing pets (idle, sing-left, sing-right, sad/miss animation) and tile designs.',
        },
        {
          name: 'stages',
          type: 'directory',
          description: 'JSON file charts containing level notes, lane indices, types (tap/hold), and perfect millisecond timings.',
          children: [
            { name: 'stage_1.json', type: 'file', description: 'JSON definition for Level 1: BPM 100, simple tap notes on the beat.' },
            { name: 'stage_100.json', type: 'file', description: 'JSON definition for Level 100: BPM 180, triple taps, long hold-tiles, syncopation.' }
          ]
        }
      ]
    },
    {
      name: 'lib',
      type: 'directory',
      description: 'Main Dart application directory structured in high-cohesion layers based on Clean Architecture.',
      children: [
        {
          name: 'core',
          type: 'directory',
          description: 'Shared utilities, base game handlers, audio helpers, themes, and global config parameters.',
          children: [
            {
              name: 'audio',
              type: 'directory',
              description: 'Audio latency managers and low-latency audio wrappers built over flame_audio / audioplayers.'
            },
            {
              name: 'common',
              type: 'file',
              description: 'Global app constants, theme constants, and helper extensions.'
            }
          ]
        },
        {
          name: 'features',
          type: 'directory',
          description: 'High-level business features. Each feature contains Data, Domain, and Presentation layers.',
          children: [
            {
              name: 'rhythm_game',
              type: 'directory',
              description: 'Core game feature containing gameplay logic, level loading, endless procedural generation, and visual canvas elements.',
              children: [
                {
                  name: 'data',
                  type: 'directory',
                  description: 'Information parsing from assets (JSON charts, local storage values for coins and unlocked costumes).',
                  children: [
                    { name: 'models', type: 'directory', description: 'Data models mirroring the stages and tile timelines (e.g., StageModel, NoteModel).' },
                    { name: 'datasources', type: 'directory', description: 'Local storage sources to load/save currency, highscores and level unlocks.' },
                    { name: 'repositories', type: 'directory', description: 'Implementation of the Game repository fetching charts & profiles.' }
                  ]
                },
                {
                  name: 'domain',
                  type: 'directory',
                  description: 'Core game rules, interfaces, use-cases independent of any framework like Flame or Flutter UI.',
                  children: [
                    { name: 'entities', type: 'directory', description: 'Clean entities representing a PlayableNote (tap/hold, time, lane, duration) and a SingingPet with costume states.' },
                    { name: 'usecases', type: 'directory', description: 'Use cases such as CheckStepPrecision, ComputeCoinsReward, and GenerateProceduralBeats.' }
                  ]
                },
                {
                  name: 'presentation',
                  type: 'directory',
                  description: 'User Interface elements: widgets, menus, and the Flame Canvas components.',
                  children: [
                    {
                      name: 'flame',
                      type: 'directory',
                      description: 'The Flame engine pipeline. Houses the visual objects, notes, lanes, and animation components.',
                      children: [
                        { name: 'rhythm_paws_game.dart', type: 'file', description: 'Main FlameGame subclass establishing the system loop.', codeKey: 'rhythm_paws_game' },
                        { name: 'lane_component.dart', type: 'file', description: 'Visual vertical lanes that highlight on touch inputs.' },
                        { name: 'note_component.dart', type: 'file', description: 'Dynamic falling blocks (TapNoteComponent & HoldNoteComponent) managing position updates.', codeKey: 'note_component' },
                        { name: 'pet_sprite_component.dart', type: 'file', description: 'Handles the animated cute pet in the level showing responses to inputs.', codeKey: 'pet_sprite_component' },
                        { name: 'procedural_generator.dart', type: 'file', description: 'Algorithmic procedural spawner producing random and math-based tracks for the post-100 endless runner.', codeKey: 'procedural_generator' }
                      ]
                    },
                    {
                      name: 'blocs',
                      type: 'directory',
                      description: 'State management widgets (e.g., using flutter_bloc, Riverpod, or Cubit) that bridge Flame state back to Flutter layouts (coins, menus).'
                    },
                    {
                      name: 'pages',
                      type: 'directory',
                      description: 'Standard UI pages like MainMenuPage, GamePlayPage, PetStorePage, and LevelSelectPage.'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          name: 'main.dart',
          type: 'file',
          description: 'The startup file of the Flutter app. Inits services, low-latency audio setups, and loads the FlameGame into the widget tree.'
        }
      ]
    },
    {
      name: 'pubspec.yaml',
      type: 'file',
      description: 'Flutter project dependencies file. Declares flutter dependencies, flamed_audio, and font assets.'
    }
  ]
};

export const DART_CODES: Record<string, { title: string; filename: string; code: string }> = {
  rhythm_paws_game: {
    title: 'Main Game Engine Class',
    filename: 'rhythm_paws_game.dart',
    code: `import 'dart:convert';
import 'dart:math';
import 'package:flame/game.dart';
import 'package:flame/input.dart';
import 'package:flame/components.dart';
import 'package:flame_audio/flame_audio.dart';
import 'package:flutter/services.dart';

// Import Clean Architecture layers
import '../domain/entities/playable_note.dart';
import 'lane_component.dart';
import 'note_component.dart';
import 'pet_sprite_component.dart';
import 'procedural_generator.dart';

/// The core class representing our Rhythm Paws game.
/// Managed via Flame Game Loop, handles low-latency input tap detection on 4 Lanes,
/// and assesses the tap precision (Perfect, Great, Good, Miss).
class RhythmPawsGame extends FlameGame with HasTappables {
  // Game Setup
  final int stageNumber;
  final bool isEndless;
  
  RhythmPawsGame({
    required this.stageNumber,
    required this.isEndless,
  });

  // State Management
  int score = 0;
  int multiplier = 1;
  int combo = 0;
  int coinsCollected = 0;
  double accuracy = 100.0;
  int totalNotesCount = 0;
  int hitNotesCount = 0;

  // Level Constants
  double bpm = 120.0;
  double scrollSpeed = 350.0; // pixels per second
  
  // Game Audio synchronization trackers
  double audioTimeSeconds = 0.0;
  bool isSongPlaying = false;
  
  // Clean Architecture Engine Components
  late PetSpriteComponent singingPet;
  late ProceduralGenerator endlessGenerator;
  final List<LaneComponent> lanes = [];
  final List<NoteComponent> activeNotes = [];

  // Hit Timing Windows in seconds (latency-compensated)
  final double timingPerfect = 0.045; // ±45ms
  final double timingGreat = 0.090;   // ±90ms
  final double timingGood = 0.150;    // ±150ms

  // The bottom hit-line vertical position (85% down the screen)
  double get hitLineY => size.y * 0.85;

  @override
  Future<void> onLoad() async {
    super.onLoad();

    // 1. Initialize vertical Lanes (4 Vertical Lanes)
    final double laneWidth = size.x / 4;
    for (int i = 0; i < 4; i++) {
      final lane = LaneComponent(
        laneIndex: i,
        position: Vector2(i * laneWidth, 0),
        size: Vector2(laneWidth, size.y),
      );
      lanes.add(lane);
      add(lane);
    }

    // 2. Load the Cute Pet Singer in top center
    singingPet = PetSpriteComponent(
      position: Vector2(size.x / 2 - 60, size.y * 0.1),
      size: Vector2(120, 120),
    );
    add(singingPet);

    // 3. Select Mode: Static Stage 1-100 vs Procedural Endless Mode
    if (isEndless) {
      endlessGenerator = ProceduralGenerator(
        bpm: bpm,
        initialSpeed: scrollSpeed,
      );
      add(endlessGenerator);
    } else {
      await _loadStageDefinition(stageNumber);
    }

    // 4. Precache game sounds and play corresponding track
    await FlameAudio.audioCache.loadAll([
      'meow_perfect.wav',
      'meow_miss.wav',
      'level_track_\${stageNumber}.mp3'
    ]);
    
    _startPreGameplayCountdown();
  }

  /// Read visual notes definition from assets stage structures in Clean Architecture (Data layer)
  Future<void> _loadStageDefinition(int stageNo) async {
    try {
      final String jsonStr = await rootBundle.loadString('assets/stages/stage_\$stageNo.json');
      final Map<String, dynamic> stageData = json.decode(jsonStr);
      
      bpm = (stageData['bpm'] as num).toDouble();
      scrollSpeed = (stageData['scroll_speed'] as num).toDouble();
      
      final List<dynamic> notesRaw = stageData['notes'];
      for (final rawNote in notesRaw) {
        final double timingInSec = (rawNote['time_ms'] as num) / 1000.0;
        final int laneNo = rawNote['lane'] as int;
        final bool isHold = rawNote['is_hold'] as bool? ?? false;
        final double durationSec = (rawNote['duration_ms'] as num? ?? 0) / 1000.0;

        final noteComp = NoteComponent(
          targetTime: timingInSec,
          laneIndex: laneNo,
          isHold: isHold,
          duration: durationSec,
          scrollSpeed: scrollSpeed,
        );
        add(noteComp);
        activeNotes.add(noteComp);
        totalNotesCount++;
      }
    } catch (e) {
      // Fallback: Generate basic scale of notes if stage config is missing
      _generateFallbackTrack();
    }
  }

  void _generateFallbackTrack() {
    bpm = 120.0;
    scrollSpeed = 400.0;
    for (int i = 0; i < 40; i++) {
      final double targetTime = 2.0 + (i * 1.5);
      final int lane = i % 4;
      final note = NoteComponent(
        targetTime: targetTime,
        laneIndex: lane,
        isHold: i % 5 == 0,
        duration: i % 5 == 0 ? 1.2 : 0,
        scrollSpeed: scrollSpeed,
      );
      add(note);
      activeNotes.add(note);
      totalNotesCount++;
    }
  }

  void _startPreGameplayCountdown() {
    isSongPlaying = true;
    FlameAudio.bgm.play('level_track_\${stageNumber}.mp3', volume: 0.82);
    audioTimeSeconds = 0.0;
  }

  @override
  void update(double dt) {
    super.update(dt);
    if (!isSongPlaying) return;

    // Use absolute soundtrack timing offset to maintain high synchronization (solving Android latency)
    // We increment delta time locally as fallback and resync with FlameAudio's audio duration position
    audioTimeSeconds += dt;

    // Handle endless procedural spawner updates
    if (isEndless) {
      endlessGenerator.updateTimeline(audioTimeSeconds, (rawGeneratedNote) {
        final noteComp = NoteComponent(
          targetTime: rawGeneratedNote.targetTime,
          laneIndex: rawGeneratedNote.laneIndex,
          isHold: rawGeneratedNote.isHold,
          duration: rawGeneratedNote.duration,
          scrollSpeed: endlessGenerator.currentSpeed,
        );
        add(noteComp);
        activeNotes.add(noteComp);
        totalNotesCount++;
      });
    }

    // Process and sweep Missed notes that scrolled past the hit region
    for (int i = activeNotes.length - 1; i >= 0; i--) {
      final note = activeNotes[i];
      final double noteY = note.position.y;
      
      // If note passed hit line by timingGood and is not triggered -> Miss
      if (audioTimeSeconds > note.targetTime + timingGood && !note.isPlayed) {
        _registerAccuracyFeedback(AccuracyRating.miss);
        note.isPlayed = true;
        note.triggerVisualMiss();
        activeNotes.removeAt(i);
      }
    }
  }

  /// Evaluate hit accuracy when user clicks dynamic Canvas Lanes
  void onTapDownInLane(int laneIndex) {
    if (!isSongPlaying) return;

    // Highlight the visual lane pressed
    lanes[laneIndex].triggerTapAnimation();

    // Check closest note in that specific lane
    NoteComponent? targetNote;
    double smallestDiff = double.infinity;

    for (final note in activeNotes) {
      if (note.laneIndex == laneIndex && !note.isPlayed) {
        final double timeDiff = (audioTimeSeconds - note.targetTime).abs();
        if (timeDiff < smallestDiff && timeDiff < timingGood) {
          smallestDiff = timeDiff;
          targetNote = note;
        }
      }
    }

    if (targetNote != null) {
      // Assess tapping rating
      AccuracyRating rating;
      if (smallestDiff < timingPerfect) {
        rating = AccuracyRating.perfect;
      } else if (smallestDiff < timingGreat) {
        rating = AccuracyRating.great;
      } else {
        rating = AccuracyRating.good;
      }

      _registerAccuracyFeedback(rating);
      targetNote.isPlayed = true;
      targetNote.triggerVisualHit(rating);
      activeNotes.remove(targetNote);
    } else {
      // Pressed lane with no falling notes inside the timing tolerance window (Ghost-Tap or Miss)
      // Usually can be ignored or cause score damage depending on difficulty
    }
  }

  void _registerAccuracyFeedback(AccuracyRating rating) {
    switch (rating) {
      case AccuracyRating.perfect:
        score += 100 * multiplier;
        combo++;
        hitNotesCount++;
        singingPet.sing(PetMood.dancing);
        FlameAudio.play('meow_perfect.wav', volume: 0.95);
        break;
      case AccuracyRating.great:
        score += 80 * multiplier;
        combo++;
        hitNotesCount++;
        singingPet.sing(PetMood.bouncing);
        FlameAudio.play('meow_perfect.wav', volume: 0.75);
        break;
      case AccuracyRating.good:
        score += 50 * multiplier;
        combo = 0;
        hitNotesCount++;
        singingPet.sing(PetMood.idle);
        break;
      case AccuracyRating.miss:
        combo = 0;
        singingPet.setSadAndWeep();
        FlameAudio.play('meow_miss.wav', volume: 0.80);
        break;
    }

    // Dynamic Multiplier updates
    if (combo >= 20) {
      multiplier = 4;
    } else if (combo >= 10) {
      multiplier = 2;
    } else {
      multiplier = 1;
    }

    // Recalculate accuracy percentage
    if (totalNotesCount > 0) {
      accuracy = (hitNotesCount / totalNotesCount) * 100.0;
    }
  }
}

enum AccuracyRating { perfect, great, good, miss }
enum PetMood { idle, bouncing, dancing, sad }
`
  },
  note_component: {
    title: 'Note Graphics Component',
    filename: 'note_component.dart',
    code: `import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import 'rhythm_paws_game.dart';

/// Renders a dynamic note falling down the lane. Supports Tap Notes and Hold Notes.
class NoteComponent extends PositionComponent with HasGameRef<RhythmPawsGame> {
  final double targetTime;
  final int laneIndex;
  final bool isHold;
  final double duration;
  final double scrollSpeed;

  bool isPlayed = false;
  late final Paint notePaint;

  NoteComponent({
    required this.targetTime,
    required this.laneIndex,
    required this.isHold,
    required this.duration,
    required this.scrollSpeed,
  }) {
    // Determine note style matching the Stage Theme Config
    notePaint = Paint()
      ..color = isHold ? Colors.cyanAccent : Colors.amberAccent
      ..style = PaintingStyle.fill;
  }

  @override
  void onMount() {
    super.onMount();
    
    // Position notes horizontally based on Lane spacing
    final double laneWidth = gameRef.size.x / 4;
    final double centerX = (laneIndex * laneWidth) + (laneWidth / 2);
    
    // Starting coordinates based on target alignment timing
    position = Vector2(centerX - 24, -100);
    size = Vector2(48, isHold ? (duration * scrollSpeed) : 24);
  }

  @override
  void update(double dt) {
    super.update(dt);
    if (isPlayed) return;

    // Calculate Y distance from hit-line depending on time differential:
    // Y_pos = HitLineY - ((TargetTime - AudioTime) * ScrollSpeed)
    final double timeDiff = targetTime - gameRef.audioTimeSeconds;
    final double newY = gameRef.hitLineY - (timeDiff * scrollSpeed);
    
    position.y = newY - (isHold ? size.y : 12);
  }

  @override
  void render(Canvas canvas) {
    super.render(canvas);
    
    RRect roundedRect = RRect.fromRectAndRadius(
      Rect.fromLTWH(0, 0, size.x, size.y),
      const Radius.circular(8),
    );
    canvas.drawRRect(roundedRect, notePaint);

    if (isHold) {
      // Draw intermediate timeline lines inside Hold elements
      final stripePaint = Paint()
        ..color = Colors.white.withOpacity(0.5)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 3;
      canvas.drawLine(Offset(size.x / 2, 0), Offset(size.x / 2, size.y), stripePaint);
    }
  }

  void triggerVisualHit(AccuracyRating precision) {
    // Add glowing particle burst animations or sound effects around the layout...
    removeFromParent();
  }

  void triggerVisualMiss() {
    // Visual indicator of missed note (fades to red and drops away)
    notePaint.color = Colors.redAccent.withOpacity(0.35);
    add(TimerComponent(
      period: 0.15,
      onTick: removeFromParent,
    ));
  }
}
`
  },
  pet_sprite_component: {
    title: 'Singing Pet Animation Sprite',
    filename: 'pet_sprite_component.dart',
    code: `import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import 'rhythm_paws_game.dart';

/// The reactive virtual pet component. Shows corresponding state
/// animations triggered by tapping feedback metrics.
class PetSpriteComponent extends PositionComponent with HasGameRef<RhythmPawsGame> {
  PetMood currentMood = PetMood.idle;
  double actionTimer = 0.0;
  
  // Custom paint decoration simulating simple physics
  late Paint petPaint;

  PetSpriteComponent({
    required Vector2 position,
    required Vector2 size,
  }) : super(position: position, size: size) {
    petPaint = Paint()..color = Colors.pinkAccent;
  }

  @override
  void update(double dt) {
    super.update(dt);
    if (actionTimer > 0) {
      actionTimer -= dt;
      if (actionTimer <= 0) {
        currentMood = PetMood.idle;
      }
    }
  }

  void sing(PetMood customMood) {
    currentMood = customMood;
    actionTimer = 0.45; // Sing / bounce animation persists for 450 milliseconds
  }

  void setSadAndWeep() {
    currentMood = PetMood.sad;
    actionTimer = 0.8; // Weep is longer
  }

  @override
  void render(Canvas canvas) {
    super.render(canvas);
    
    // Beautiful interactive drawing representing the pet avatar
    final center = Offset(size.x / 2, size.y / 2);
    final double radius = size.x * 0.4;
    
    // Bobbing offset simulation based on mood
    double bobOffsetY = 0.0;
    double scaleX = 1.0;
    
    if (currentMood == PetMood.dancing) {
      bobOffsetY = -15.0 * (actionTimer > 0 ? (actionTimer / 0.45) : 0);
      scaleX = 1.15;
    } else if (currentMood == PetMood.bouncing) {
      bobOffsetY = -8.0 * (actionTimer > 0 ? (actionTimer / 0.45) : 0);
    } else if (currentMood == PetMood.sad) {
      bobOffsetY = 5.0;
      scaleX = 0.9;
    }

    // Head circle representation
    final headPaint = Paint()
      ..color = currentMood == PetMood.sad ? Colors.blueGrey.shade600 : Colors.orangeAccent
      ..style = PaintingStyle.fill;
    
    canvas.drawCircle(Offset(center.dx, center.dy + bobOffsetY), radius * scaleX, headPaint);

    // Draw cute cat ears
    final earPathLeft = Path()
      ..moveTo(center.dx - radius, center.dy - radius * 0.5 + bobOffsetY)
      ..lineTo(center.dx - radius * 1.1, center.dy - radius * 1.5 + bobOffsetY)
      ..lineTo(center.dx - radius * 0.4, center.dy - radius * 0.9 + bobOffsetY)
      ..close();
    
    final earPathRight = Path()
      ..moveTo(center.dx + radius, center.dy - radius * 0.5 + bobOffsetY)
      ..lineTo(center.dx + radius * 1.1, center.dy - radius * 1.5 + bobOffsetY)
      ..lineTo(center.dx + radius * 0.4, center.dy - radius * 0.9 + bobOffsetY)
      ..close();
      
    canvas.drawPath(earPathLeft, headPaint);
    canvas.drawPath(earPathRight, headPaint);

    // Cute facial markers and eyes
    final eyePaint = Paint()..color = Colors.black;
    canvas.drawCircle(Offset(center.dx - 12 * scaleX, center.dy - 6 + bobOffsetY), 4, eyePaint);
    canvas.drawCircle(Offset(center.dx + 12 * scaleX, center.dy - 6 + bobOffsetY), 4, eyePaint);

    // Singing mouth vs crying face mouth
    final mouthPaint = Paint()
      ..color = Colors.pinkAccent.shade700
      ..style = PaintingStyle.fill;

    if (currentMood == PetMood.dancing || currentMood == PetMood.bouncing) {
      // Big singing sound circle mouth
      canvas.drawCircle(Offset(center.dx, center.dy + 12 + bobOffsetY), 10, mouthPaint);
    } else if (currentMood == PetMood.sad) {
      // Small down curved tear line mouth
      final tearPaint = Paint()
        ..color = Colors.lightBlueAccent
        ..strokeWidth = 3
        ..style = PaintingStyle.stroke;
      canvas.drawArc(
        Rect.fromCenter(center: Offset(center.dx, center.dy + 18 + bobOffsetY), width: 14, height: 10),
        3.14,
        3.14,
        false,
        tearPaint,
      );
    } else {
      // Cute kitty smile
      final mouthPaint = Paint()
        ..color = Colors.black
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2;
      canvas.drawArc(
        Rect.fromCenter(center: Offset(center.dx - 4, center.dy + 8 + bobOffsetY), width: 8, height: 6),
        0,
        3.14,
        false,
        mouthPaint,
      );
      canvas.drawArc(
        Rect.fromCenter(center: Offset(center.dx + 4, center.dy + 8 + bobOffsetY), width: 8, height: 6),
        0,
        3.14,
        false,
        mouthPaint,
      );
    }
  }
}
`
  },
  procedural_generator: {
    title: 'Post-100 Endless Algorithm',
    filename: 'procedural_generator.dart',
    code: `import 'dart:math';
import 'package:flame/components.dart';

/// Features-Presentation layer: Procedural generator implementing math sequences
/// to spawn dynamic tiles smoothly as the track goes on.
class ProceduralGenerator extends Component {
  double bpm;
  double currentSpeed;
  
  // Track parameters
  double lastNoteSpawnTime = 0.0;
  double generationThreshold = 1.0; // time offset between notes
  final Random _random = Random();
  
  // Acceleration ratios
  double baseSecondsElapsed = 0.0;

  ProceduralGenerator({
    required this.bpm,
    required this.initialSpeed,
  }) : currentSpeed = initialSpeed;

  final double initialSpeed;

  @override
  void update(double dt) {
    super.update(dt);
    baseSecondsElapsed += dt;

    // Difficulty curve setup:
    // Speed increases procedurally by logarithmic curve: speed = initial + ln(time + 1) * 35;
    currentSpeed = initialSpeed + log(baseSecondsElapsed + 1.0) * 45.0;
    
    // Spawning frequency: Notes become closer on higher times: threshold = 60 / BPM * factor
    // Factor drops from 1.0 down toward 0.35 over 2 minutes
    final double difficultyFactor = max(0.35, 1.0 - (baseSecondsElapsed / 150));
    generationThreshold = (60.0 / bpm) * difficultyFactor;
  }

  /// Evaluates current timeline, checking if we should build a new PlayableNote.
  /// Callback returns raw node data to main system Game class.
  void updateTimeline(double audioTimeSeconds, Function(GeneratedNote) onNoteSpawn) {
    if (audioTimeSeconds - lastNoteSpawnTime > generationThreshold) {
      lastNoteSpawnTime = audioTimeSeconds;

      // Select lane index randomly or in repeating patterns
      final int laneNo = _random.nextInt(4);
      
      // Determine note type (20% for Long hold tiles as intensity boosts)
      final bool isHoldNote = _random.nextDouble() < max(0.12, min(0.35, baseSecondsElapsed / 200.0));
      final double durationSec = isHoldNote ? (0.8 + _random.nextDouble() * 1.5) : 0.0;

      // Ensure notes spawn slightly ahead of timeline
      final double spawnTargetTime = audioTimeSeconds + 2.5;

      onNoteSpawn(
        GeneratedNote(
          targetTime: spawnTargetTime,
          laneIndex: laneNo,
          isHold: isHoldNote,
          duration: durationSec,
        ),
      );
    }
  }
}

class GeneratedNote {
  final double targetTime;
  final int laneIndex;
  final bool isHold;
  final double duration;

  GeneratedNote({
    required this.targetTime,
    required this.laneIndex,
    required this.isHold,
    this.duration = 0.0,
  });
}
`
  }
};
