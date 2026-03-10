import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../lib/generated/prisma/client.js";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const forms = [
  // ═══ GRADE 7 ═══
  // Adjudication
  {
    name: "School Choir Adjudication Form",
    formType: "adjudication",
    grade: "Grade 7",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "choir",
    description: "Scoring sheet for school choir competitions aligned to Kenya Music Festival standards",
    formData: {
      category: "School Choir",
      eventContext: "Kenya Music Festival — Junior Secondary Category",
      judgingCriteria: [
        { criterion: "Tonal Quality & Intonation", description: "Accuracy of pitch, tone colour, vocal blend across all parts", maxScore: 20, ratingScale: "1-20" },
        { criterion: "Diction & Articulation", description: "Clarity of text, proper Kiswahili/English pronunciation", maxScore: 15, ratingScale: "1-15" },
        { criterion: "Rhythm & Tempo", description: "Rhythmic accuracy, consistent tempo, appropriate pacing", maxScore: 15, ratingScale: "1-15" },
        { criterion: "Dynamics & Expression", description: "Musical phrasing, dynamic contrast, emotional interpretation", maxScore: 20, ratingScale: "1-20" },
        { criterion: "Presentation & Deportment", description: "Stage presence, uniform, entry/exit, posture, conductor attention", maxScore: 10, ratingScale: "1-10" },
        { criterion: "Overall Musicality", description: "Artistic interpretation, engagement, communication of meaning", maxScore: 20, ratingScale: "1-20" },
      ],
      commentSections: [
        { label: "Strengths", purpose: "Identify positive aspects of the performance" },
        { label: "Areas for Improvement", purpose: "Constructive feedback for growth" },
        { label: "General Remarks", purpose: "Overall impression and recommendations" },
      ],
      totalPossibleScore: 100,
    },
  },
  {
    name: "Traditional Dance Adjudication Form",
    formType: "adjudication",
    grade: "Grade 7",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "dance",
    description: "Scoring rubric for traditional Kenyan dance performances at school and regional festivals",
    formData: {
      category: "Traditional Dance",
      eventContext: "Kenya Music Festival — Traditional Dance Category",
      judgingCriteria: [
        { criterion: "Authenticity of Movement", description: "Accuracy of traditional dance vocabulary, cultural integrity", maxScore: 25, ratingScale: "1-25" },
        { criterion: "Rhythm & Musicality", description: "Synchronisation with music, rhythmic precision, musical interpretation", maxScore: 20, ratingScale: "1-20" },
        { criterion: "Group Coordination", description: "Unity of movement, spatial formations, transitions", maxScore: 20, ratingScale: "1-20" },
        { criterion: "Costume & Cultural Presentation", description: "Appropriate attire, cultural accessories, visual impact", maxScore: 15, ratingScale: "1-15" },
        { criterion: "Energy & Performance Quality", description: "Engagement, stage presence, confidence, audience connection", maxScore: 20, ratingScale: "1-20" },
      ],
      commentSections: [
        { label: "Cultural Authenticity Notes", purpose: "Comment on accuracy of cultural representation" },
        { label: "Strengths & Areas for Growth", purpose: "Balanced feedback" },
      ],
      totalPossibleScore: 100,
    },
  },
  {
    name: "Drama Skit Adjudication Form",
    formType: "adjudication",
    grade: "Grade 7",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "drama",
    description: "Adjudication sheet for school drama competitions and inter-class drama festivals",
    formData: {
      category: "Drama Skit / Short Play",
      eventContext: "School Drama Festival — Junior Secondary",
      judgingCriteria: [
        { criterion: "Script & Story", description: "Coherent plot, relevant theme, creative storyline, clear message", maxScore: 20, ratingScale: "1-20" },
        { criterion: "Acting & Characterisation", description: "Believable characters, vocal projection, emotional depth", maxScore: 25, ratingScale: "1-25" },
        { criterion: "Staging & Blocking", description: "Effective use of stage space, purposeful movement, audience sightlines", maxScore: 15, ratingScale: "1-15" },
        { criterion: "Props & Costumes", description: "Appropriate, creative use of props and costumes to enhance the story", maxScore: 15, ratingScale: "1-15" },
        { criterion: "Overall Impact", description: "Entertainment value, originality, audience engagement, message delivery", maxScore: 25, ratingScale: "1-25" },
      ],
      commentSections: [
        { label: "Strengths", purpose: "What worked well in the performance" },
        { label: "Recommendations", purpose: "Suggestions for future performances" },
      ],
      totalPossibleScore: 100,
    },
  },
  // Rehearsal Plans
  {
    name: "School Choir Weekly Rehearsal Plan",
    formType: "rehearsal_plan",
    grade: "Grade 7",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "choir",
    description: "Structured weekly choir rehearsal plan for junior secondary school choirs",
    formData: {
      ensembleType: "Grade 7 Junior Choir (25-30 voices)",
      duration: 90,
      rehearsalObjectives: [
        "Master soprano and alto parts for 'Malaika' (bars 1-32)",
        "Improve breath control and sustained notes",
        "Build confidence in two-part harmony sections",
      ],
      warmUpActivities: [
        { activity: "Stretching exercises and posture check", duration: 5 },
        { activity: "Breathing exercises (4-count inhale, 8-count exhale)", duration: 5 },
        { activity: "Vocal sirens (low to high pitch glides)", duration: 5 },
        { activity: "Scale patterns with solfege", duration: 10 },
      ],
      repertoire: [
        { title: "Malaika", composer: "Traditional Kenyan", focus: "Swahili pronunciation and melodic phrasing; soprano/alto harmony in chorus" },
        { title: "Jambo Bwana", composer: "Teddy Kalanda Harrison", focus: "Rhythmic accuracy in call-and-response; dynamic contrast between verses" },
      ],
      sectionFocus: [
        { section: "Soprano", goals: ["Accurate pitching on high notes", "Consistent vowel shapes"], exercises: ["Isolated soprano part (bars 16-24)", "Vowel drills on [a], [e], [i]"] },
        { section: "Alto", goals: ["Confidence in harmony line", "Maintain independence from soprano"], exercises: ["Alto sectional (bars 1-16)", "Sing harmony while soprano hums"] },
      ],
      coolDown: "Gentle humming descending scales, relaxation breathing, announcements",
      notesForNextSession: "Bring printed lyrics for new song. Focus on full run-throughs next week.",
    },
  },
  {
    name: "Dance Troupe Rehearsal Plan",
    formType: "rehearsal_plan",
    grade: "Grade 7",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "dance",
    description: "Practice session plan for school dance troupe preparing traditional Kenyan dance",
    formData: {
      ensembleType: "Grade 7 Dance Troupe (12-16 dancers)",
      duration: 60,
      rehearsalObjectives: [
        "Learn basic Chakacha footwork and hip movement patterns",
        "Master entrance formation and spacing",
        "Practise timing with drum accompaniment",
      ],
      warmUpActivities: [
        { activity: "Light jogging and dynamic stretching", duration: 8 },
        { activity: "Isolation exercises (head, shoulders, hips, knees)", duration: 7 },
        { activity: "Basic rhythm clapping with drum pattern", duration: 5 },
      ],
      repertoire: [
        { title: "Chakacha — Opening Section", focus: "Master the basic step pattern and hip movements in unison" },
        { title: "Chakacha — Formation Changes", focus: "Clean transitions between circle, line, and paired formations" },
      ],
      sectionFocus: [
        { section: "Front Row", goals: ["Lead the formation changes", "Strong confident movements"], exercises: ["Run through entrance 3 times", "Mirror exercises in pairs"] },
        { section: "Back Row", goals: ["Stay in time with front row", "Full extension of movements"], exercises: ["Slow-motion practice of hip movements", "Count-based repetition drill"] },
      ],
      coolDown: "Gentle stretching, breathing exercises, group feedback circle",
      notesForNextSession: "Bring leso/khanga for costume rehearsal. Review video of today's run-through.",
    },
  },
  {
    name: "Drama Club Rehearsal Plan",
    formType: "rehearsal_plan",
    grade: "Grade 7",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "drama",
    description: "Structured drama club rehearsal for preparing a short school play",
    formData: {
      ensembleType: "Grade 7 Drama Club (10-15 members)",
      duration: 75,
      rehearsalObjectives: [
        "Block Act 1 scenes with stage positions and movements",
        "Work on vocal projection and clarity for all actors",
        "Run Act 1 without stopping for timing",
      ],
      warmUpActivities: [
        { activity: "Tongue twisters and vocal warm-ups", duration: 5 },
        { activity: "Physical warm-up and space awareness game", duration: 5 },
        { activity: "Improvisation exercise: freeze and justify", duration: 10 },
      ],
      repertoire: [
        { title: "Act 1, Scene 1 — The Market", focus: "Blocking, entrances/exits, establishing setting through dialogue" },
        { title: "Act 1, Scene 2 — The Discovery", focus: "Building tension, pace of dialogue, emotional reactions" },
      ],
      sectionFocus: [
        { section: "Lead actors", goals: ["Memorise lines for Act 1", "Develop distinct character voices"], exercises: ["Line runs in pairs", "Character hot-seating Q&A"] },
        { section: "Supporting cast", goals: ["React naturally to lead actors", "Use stage space effectively"], exercises: ["Background action improvisation", "Ensemble movement drills"] },
      ],
      coolDown: "Group notes session, highlight successes, assign homework (line memorisation)",
      notesForNextSession: "All actors must be off-book for Act 1. Bring any props you can source from home.",
    },
  },
  // Performance Programs
  {
    name: "End of Term Music Concert Program",
    formType: "performance_program",
    grade: "Grade 7",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "mixed",
    description: "Formal concert program for end-of-term performing arts showcase",
    formData: {
      eventName: "Grade 7 Term 1 Music & Performing Arts Showcase",
      venue: "School Assembly Hall",
      eventDate: "Friday, 28th March 2026",
      eventTime: "2:00 PM - 4:00 PM",
      programItems: [
        { order: 1, title: "Welcome & Opening Prayer", performerOrGroup: "School Chaplain", duration: 5 },
        { order: 2, title: "Kenya National Anthem", performerOrGroup: "All Students and Guests", genre: "Patriotic", duration: 3 },
        { order: 3, title: "Malaika", performerOrGroup: "Grade 7 Junior Choir", composer: "Traditional Kenyan", genre: "Folk Song", duration: 4 },
        { order: 4, title: "Recorder Ensemble: Greensleeves", performerOrGroup: "Grade 7 Recorder Group", genre: "Classical", duration: 3 },
        { order: 5, title: "African Drumming Circle", performerOrGroup: "Percussion Club", genre: "World Music", duration: 6 },
        { order: 6, title: "Short Drama: The Wise Old Man", performerOrGroup: "Grade 7 Drama Club", genre: "Drama", duration: 12 },
        { order: 7, title: "— INTERMISSION —", performerOrGroup: "", duration: 15 },
        { order: 8, title: "Traditional Dance: Chakacha", performerOrGroup: "Grade 7 Dance Troupe", genre: "Traditional", duration: 5 },
        { order: 9, title: "Solo Keyboard: Imagine", performerOrGroup: "Sarah Mwangi", composer: "John Lennon", genre: "Pop", duration: 4 },
        { order: 10, title: "Finale: Kenya Yetu", performerOrGroup: "Combined Choir & Audience", genre: "Patriotic", duration: 3 },
        { order: 11, title: "Closing Remarks & Vote of Thanks", performerOrGroup: "Head Teacher", duration: 5 },
      ],
      intermissions: [{ afterItemNumber: 6, duration: 15 }],
      acknowledgments: "We thank our Music Teacher Mr. Kamau, Drama Coach Ms. Achieng, and all parents for their support. Special thanks to the PTA for providing new instruments.",
      specialNotes: "Photography is permitted. Please silence mobile phones during performances. Light refreshments available during intermission.",
    },
  },
  {
    name: "Art Exhibition Program",
    formType: "performance_program",
    grade: "Grade 7",
    learningArea: "Creative Arts and Sports",
    strand: "Visual Arts",
    artDiscipline: "visual_art",
    description: "Program template for a student visual arts exhibition event",
    formData: {
      eventName: "Grade 7 Visual Arts Exhibition — 'Our World in Colour'",
      venue: "School Library / Art Room",
      eventDate: "Wednesday, 25th March 2026",
      eventTime: "10:00 AM - 1:00 PM",
      programItems: [
        { order: 1, title: "Exhibition Opens — Welcome by Art Teacher", performerOrGroup: "Art Department", duration: 5 },
        { order: 2, title: "Gallery Walk: Still Life Drawings", performerOrGroup: "Grade 7A Students", genre: "Drawing", duration: 15 },
        { order: 3, title: "Gallery Walk: Collage Works", performerOrGroup: "Grade 7B Students", genre: "Mixed Media", duration: 15 },
        { order: 4, title: "Live Art Demonstration: Pencil Shading", performerOrGroup: "Art Club Members", genre: "Demonstration", duration: 20 },
        { order: 5, title: "— TEA BREAK —", performerOrGroup: "", duration: 15 },
        { order: 6, title: "Gallery Walk: Painting & Colour Studies", performerOrGroup: "Grade 7C Students", genre: "Painting", duration: 15 },
        { order: 7, title: "Artist Talk: My Creative Journey", performerOrGroup: "Selected Students (3 speakers)", genre: "Presentation", duration: 15 },
        { order: 8, title: "Awards & Closing", performerOrGroup: "Head of Arts Department", duration: 10 },
      ],
      intermissions: [{ afterItemNumber: 4, duration: 15 }],
      acknowledgments: "Thank you to all student artists, parents who donated materials, and our Art Teacher Mrs. Wanjiru for her guidance and dedication.",
      specialNotes: "Artworks are for display only. Voting slips for 'People's Choice Award' available at the entrance. Photography encouraged!",
    },
  },
  {
    name: "Inter-House Dance & Drama Festival Program",
    formType: "performance_program",
    grade: "Grade 7",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "mixed",
    description: "Running order for inter-house dance and drama competition",
    formData: {
      eventName: "Inter-House Dance & Drama Festival",
      venue: "School Parade Ground / Hall",
      eventDate: "Saturday, 15th March 2026",
      eventTime: "9:00 AM - 1:00 PM",
      programItems: [
        { order: 1, title: "Opening Ceremony & Adjudicator Introduction", performerOrGroup: "Games Master", duration: 10 },
        { order: 2, title: "Traditional Dance — Nile House", performerOrGroup: "Nile House Dance Troupe", genre: "Traditional", duration: 8 },
        { order: 3, title: "Traditional Dance — Athi House", performerOrGroup: "Athi House Dance Troupe", genre: "Traditional", duration: 8 },
        { order: 4, title: "Traditional Dance — Tana House", performerOrGroup: "Tana House Dance Troupe", genre: "Traditional", duration: 8 },
        { order: 5, title: "Traditional Dance — Yala House", performerOrGroup: "Yala House Dance Troupe", genre: "Traditional", duration: 8 },
        { order: 6, title: "— BREAK —", performerOrGroup: "", duration: 20 },
        { order: 7, title: "Drama Skit — Nile House", performerOrGroup: "Nile House Drama Team", genre: "Drama", duration: 12 },
        { order: 8, title: "Drama Skit — Athi House", performerOrGroup: "Athi House Drama Team", genre: "Drama", duration: 12 },
        { order: 9, title: "Drama Skit — Tana House", performerOrGroup: "Tana House Drama Team", genre: "Drama", duration: 12 },
        { order: 10, title: "Drama Skit — Yala House", performerOrGroup: "Yala House Drama Team", genre: "Drama", duration: 12 },
        { order: 11, title: "Adjudication & Results Announcement", performerOrGroup: "Chief Adjudicator", duration: 15 },
      ],
      intermissions: [{ afterItemNumber: 5, duration: 20 }],
      acknowledgments: "Thank you to our adjudicators, house patrons, and all participating students. Special recognition to the PE and Arts departments for coordinating this event.",
      specialNotes: "Houses are reminded to report to the backstage area 10 minutes before their slot. Points contribute to the overall inter-house competition standings.",
    },
  },
  // Portfolio Assessment
  {
    name: "Term 1 Visual Arts Portfolio Assessment",
    formType: "portfolio_assessment",
    grade: "Grade 7",
    learningArea: "Creative Arts and Sports",
    strand: "Visual Arts",
    artDiscipline: "visual_art",
    description: "CBC-aligned portfolio assessment rubric for Grade 7 Visual Arts",
    formData: {
      portfolioType: "Grade 7 Term 1 Visual Arts Portfolio (Drawing & Collage)",
      requiredComponents: [
        { component: "3 Finished Artworks", description: "At least one drawing and one mixed-media piece" },
        { component: "Sketch Studies", description: "Minimum 5 observational sketches showing process" },
        { component: "Artist Statement", description: "Written reflection (150-200 words) on creative journey" },
        { component: "Evidence of Techniques", description: "Demonstration of shading, composition, and collage techniques" },
      ],
      assessmentCriteria: [
        {
          criterion: "Technical Skill & Craftsmanship",
          rubricLevels: [
            { level: "Exceeding (9-10)", description: "Advanced mastery of techniques; exceptional detail and control", pointValue: 10 },
            { level: "Meeting (6-8)", description: "Competent use of techniques; consistent quality", pointValue: 7 },
            { level: "Approaching (3-5)", description: "Developing skills; some inconsistency", pointValue: 4 },
            { level: "Beginning (0-2)", description: "Limited skill; requires significant support", pointValue: 1 },
          ],
        },
        {
          criterion: "Creativity & Originality",
          rubricLevels: [
            { level: "Exceeding (9-10)", description: "Highly original ideas; unique personal voice", pointValue: 10 },
            { level: "Meeting (6-8)", description: "Creative thinking; personal interpretation", pointValue: 7 },
            { level: "Approaching (3-5)", description: "Emerging creativity; relies on examples", pointValue: 4 },
            { level: "Beginning (0-2)", description: "Limited creativity; copies closely", pointValue: 1 },
          ],
        },
        {
          criterion: "Composition & Design",
          rubricLevels: [
            { level: "Exceeding (9-10)", description: "Sophisticated balance, focal point, intentional design", pointValue: 10 },
            { level: "Meeting (6-8)", description: "Awareness of composition; effective use of space", pointValue: 7 },
            { level: "Approaching (3-5)", description: "Basic awareness; some elements lack intent", pointValue: 4 },
            { level: "Beginning (0-2)", description: "Limited understanding of composition", pointValue: 1 },
          ],
        },
        {
          criterion: "Growth & Reflection",
          rubricLevels: [
            { level: "Exceeding (9-10)", description: "Extensive process work; thoughtful reflection; clear improvement", pointValue: 10 },
            { level: "Meeting (6-8)", description: "Adequate documentation; some evidence of reflection", pointValue: 7 },
            { level: "Approaching (3-5)", description: "Minimal process; limited reflection", pointValue: 4 },
            { level: "Beginning (0-2)", description: "Little process work or reflection", pointValue: 1 },
          ],
        },
      ],
      growthIndicators: [
        "Improvement in technical skills from early to late works",
        "Increasing confidence in creative decisions",
        "Development of personal artistic style",
        "Ability to give and receive constructive feedback",
      ],
      reflectionPrompts: [
        "Which piece are you most proud of, and why?",
        "What technique did you find most challenging, and how did you improve?",
        "How does your artwork connect to Kenyan culture or your experiences?",
        "What would you like to explore next term?",
      ],
      totalPoints: 40,
    },
  },
  {
    name: "Performing Arts Portfolio Assessment",
    formType: "portfolio_assessment",
    grade: "Grade 7",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "mixed",
    description: "Assessment sheet for music, dance, and drama portfolio evidence",
    formData: {
      portfolioType: "Grade 7 Term 1 Performing Arts Portfolio",
      requiredComponents: [
        { component: "Performance Recording", description: "Video/audio of at least one performance (solo or group)" },
        { component: "Practice Log", description: "Record of rehearsals attended and skills practised" },
        { component: "Written Reflection", description: "100-150 word reflection on performing arts experience" },
        { component: "Peer Feedback", description: "Feedback received from at least one peer" },
      ],
      assessmentCriteria: [
        {
          criterion: "Performance Skills",
          rubricLevels: [
            { level: "Exceeding (9-10)", description: "Confident, expressive performance with strong technique", pointValue: 10 },
            { level: "Meeting (6-8)", description: "Competent performance with good control", pointValue: 7 },
            { level: "Approaching (3-5)", description: "Developing skills; occasional hesitation", pointValue: 4 },
            { level: "Beginning (0-2)", description: "Limited confidence; significant support needed", pointValue: 1 },
          ],
        },
        {
          criterion: "Commitment & Practice",
          rubricLevels: [
            { level: "Exceeding (9-10)", description: "Excellent attendance; consistent practice; self-motivated", pointValue: 10 },
            { level: "Meeting (6-8)", description: "Good attendance; regular practice", pointValue: 7 },
            { level: "Approaching (3-5)", description: "Inconsistent attendance or practice", pointValue: 4 },
            { level: "Beginning (0-2)", description: "Poor attendance; minimal practice", pointValue: 1 },
          ],
        },
        {
          criterion: "Collaboration & Teamwork",
          rubricLevels: [
            { level: "Exceeding (9-10)", description: "Outstanding team player; supports others; leads positively", pointValue: 10 },
            { level: "Meeting (6-8)", description: "Works well with others; contributes reliably", pointValue: 7 },
            { level: "Approaching (3-5)", description: "Sometimes works with others; needs encouragement", pointValue: 4 },
            { level: "Beginning (0-2)", description: "Difficulty working in groups", pointValue: 1 },
          ],
        },
      ],
      growthIndicators: [
        "Increased confidence in performing before an audience",
        "Improved technical skills (vocal, movement, or dramatic)",
        "Better ability to work collaboratively in ensemble",
        "Growth in self-awareness through reflection",
      ],
      reflectionPrompts: [
        "Describe your favourite moment performing this term.",
        "What skill improved the most during rehearsals?",
        "How did working with your group help your learning?",
      ],
      totalPoints: 30,
    },
  },
  {
    name: "Mixed Arts Term Assessment",
    formType: "portfolio_assessment",
    grade: "Grade 7",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "mixed",
    description: "Combined assessment covering visual and performing arts competencies",
    formData: {
      portfolioType: "Grade 7 Term 1 Combined Creative Arts Assessment",
      requiredComponents: [
        { component: "Visual Art Sample", description: "One finished artwork from the term" },
        { component: "Performance Evidence", description: "Video, photo, or teacher observation notes of a performance" },
        { component: "Creative Journal", description: "Sketches, notes, and reflections from the term" },
      ],
      assessmentCriteria: [
        {
          criterion: "Visual Arts Competency",
          rubricLevels: [
            { level: "Exceeding (9-10)", description: "Strong technique, creativity, and artistic awareness", pointValue: 10 },
            { level: "Meeting (6-8)", description: "Good technique and creative effort", pointValue: 7 },
            { level: "Approaching (3-5)", description: "Developing skills with guidance", pointValue: 4 },
            { level: "Beginning (0-2)", description: "Needs significant support", pointValue: 1 },
          ],
        },
        {
          criterion: "Performing Arts Competency",
          rubricLevels: [
            { level: "Exceeding (9-10)", description: "Confident performer with strong skills and expression", pointValue: 10 },
            { level: "Meeting (6-8)", description: "Competent performer with developing expression", pointValue: 7 },
            { level: "Approaching (3-5)", description: "Participates with encouragement; developing skills", pointValue: 4 },
            { level: "Beginning (0-2)", description: "Reluctant participant; needs much support", pointValue: 1 },
          ],
        },
        {
          criterion: "Creative Thinking & Reflection",
          rubricLevels: [
            { level: "Exceeding (9-10)", description: "Thoughtful, insightful reflection; innovative ideas", pointValue: 10 },
            { level: "Meeting (6-8)", description: "Good reflection; some original thinking", pointValue: 7 },
            { level: "Approaching (3-5)", description: "Surface-level reflection; basic ideas", pointValue: 4 },
            { level: "Beginning (0-2)", description: "Minimal reflection", pointValue: 1 },
          ],
        },
      ],
      growthIndicators: [
        "Shows progress across both visual and performing arts",
        "Demonstrates creative thinking and risk-taking",
        "Engages meaningfully in self-reflection",
      ],
      reflectionPrompts: [
        "Which do you prefer — visual arts or performing arts — and why?",
        "What was the most challenging creative task this term?",
        "How has Creative Arts helped you express yourself?",
      ],
      totalPoints: 30,
    },
  },

  // ═══ GRADE 8 ═══
  {
    name: "Choral Verse Adjudication Form",
    formType: "adjudication",
    grade: "Grade 8",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "choir",
    description: "Scoring sheet for choral verse speaking competitions",
    formData: {
      category: "Choral Verse Speaking",
      eventContext: "Kenya Music Festival — Choral Verse Category",
      judgingCriteria: [
        { criterion: "Clarity & Diction", description: "Clear pronunciation, articulation, audibility throughout", maxScore: 20, ratingScale: "1-20" },
        { criterion: "Interpretation & Meaning", description: "Understanding of poem's meaning conveyed through voice", maxScore: 25, ratingScale: "1-25" },
        { criterion: "Vocal Variety", description: "Use of pace, pitch, volume, pause for dramatic effect", maxScore: 20, ratingScale: "1-20" },
        { criterion: "Unity & Coordination", description: "Group synchronisation, clean starts/stops, breathing together", maxScore: 20, ratingScale: "1-20" },
        { criterion: "Presentation", description: "Stage presence, posture, eye contact, confidence", maxScore: 15, ratingScale: "1-15" },
      ],
      commentSections: [
        { label: "Strengths", purpose: "Highlight effective aspects of the performance" },
        { label: "Areas for Improvement", purpose: "Constructive suggestions" },
        { label: "Overall Comments", purpose: "General remarks and encouragement" },
      ],
      totalPossibleScore: 100,
    },
  },
  {
    name: "Contemporary Dance Adjudication Form",
    formType: "adjudication",
    grade: "Grade 8",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "dance",
    description: "Scoring rubric for contemporary and creative dance performances",
    formData: {
      category: "Contemporary / Creative Dance",
      eventContext: "School Arts Festival — Creative Dance Category",
      judgingCriteria: [
        { criterion: "Choreographic Creativity", description: "Originality of movement, creative use of space and levels", maxScore: 25, ratingScale: "1-25" },
        { criterion: "Technical Execution", description: "Control, balance, flexibility, strength in movement", maxScore: 20, ratingScale: "1-20" },
        { criterion: "Musicality & Interpretation", description: "Response to music, rhythmic accuracy, emotional expression", maxScore: 20, ratingScale: "1-20" },
        { criterion: "Spatial Awareness & Formations", description: "Effective use of stage, varied formations, clean transitions", maxScore: 15, ratingScale: "1-15" },
        { criterion: "Performance Quality", description: "Energy, commitment, audience engagement, stage presence", maxScore: 20, ratingScale: "1-20" },
      ],
      commentSections: [
        { label: "Choreographic Highlights", purpose: "Comment on standout creative choices" },
        { label: "Technical Feedback", purpose: "Specific suggestions for improvement" },
      ],
      totalPossibleScore: 100,
    },
  },
  {
    name: "Visual Art Exhibition Adjudication Form",
    formType: "adjudication",
    grade: "Grade 8",
    learningArea: "Creative Arts and Sports",
    strand: "Visual Arts",
    artDiscipline: "visual_art",
    description: "Assessment form for judging student artwork at exhibitions",
    formData: {
      category: "Visual Art Exhibition Entry",
      eventContext: "School Art Exhibition — Student Work Assessment",
      judgingCriteria: [
        { criterion: "Technical Skill", description: "Mastery of medium, control of tools, craftsmanship", maxScore: 25, ratingScale: "1-25" },
        { criterion: "Creativity & Concept", description: "Originality of idea, personal expression, conceptual depth", maxScore: 25, ratingScale: "1-25" },
        { criterion: "Composition & Design", description: "Use of elements and principles of design, visual balance", maxScore: 20, ratingScale: "1-20" },
        { criterion: "Use of Materials", description: "Appropriate and innovative use of art materials", maxScore: 15, ratingScale: "1-15" },
        { criterion: "Presentation", description: "Neatness, framing/mounting, artist statement quality", maxScore: 15, ratingScale: "1-15" },
      ],
      commentSections: [
        { label: "Artistic Strengths", purpose: "What makes this work stand out" },
        { label: "Suggestions", purpose: "How the artist could develop further" },
      ],
      totalPossibleScore: 100,
    },
  },
  // Grade 8 Rehearsal Plans
  {
    name: "Folk Song Arrangement Rehearsal",
    formType: "rehearsal_plan",
    grade: "Grade 8",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "choir",
    description: "Rehearsal plan for choral arrangement of Kenyan folk songs",
    formData: {
      ensembleType: "Grade 8 Choir (30-35 voices, SAB arrangement)",
      duration: 90,
      rehearsalObjectives: ["Learn three-part harmony for 'Lala Salama'", "Improve blend between soprano, alto, and baritone sections", "Add dynamic shading to verses and chorus"],
      warmUpActivities: [
        { activity: "Lip trills and humming scales", duration: 5 },
        { activity: "Three-part canon: 'Row Row Row Your Boat'", duration: 5 },
        { activity: "Chord-building exercise (root, third, fifth)", duration: 10 },
      ],
      repertoire: [
        { title: "Lala Salama", composer: "Traditional Kenyan Lullaby", focus: "Three-part harmony accuracy; gentle dynamic control; Swahili diction" },
        { title: "Tushangilie Kenya", composer: "Traditional Patriotic", focus: "Energetic delivery; crisp rhythms; powerful unison in chorus" },
      ],
      sectionFocus: [
        { section: "Baritone (new section)", goals: ["Confidence in lower harmony part", "Rhythmic independence"], exercises: ["Baritone part isolated with piano support", "Sing baritone while altos hum their part"] },
      ],
      coolDown: "Soft humming of 'Lala Salama' melody together, breathing exercises",
      notesForNextSession: "Record individual parts for home practice. Begin memorisation of 'Tushangilie Kenya'.",
    },
  },
  {
    name: "Storytelling Dance Rehearsal",
    formType: "rehearsal_plan",
    grade: "Grade 8",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "dance",
    description: "Rehearsal plan for contemporary dance piece that tells a story through movement",
    formData: {
      ensembleType: "Grade 8 Dance Group (10-14 dancers)",
      duration: 75,
      rehearsalObjectives: ["Develop narrative movement sequence for 'The Journey' piece", "Create smooth transitions between solo, duet, and group sections", "Integrate levels (floor, standing, jumping) into choreography"],
      warmUpActivities: [
        { activity: "Cardio warm-up with music", duration: 5 },
        { activity: "Floor stretches focusing on flexibility", duration: 8 },
        { activity: "Movement exploration: travel across the space using 3 different levels", duration: 7 },
      ],
      repertoire: [
        { title: "The Journey — Opening (departure)", focus: "Slow, sustained movements conveying anticipation; unison opening tableau" },
        { title: "The Journey — Middle (challenges)", focus: "Contrasting dynamics; sharp vs. flowing; partner lifts and supports" },
        { title: "The Journey — Ending (arrival)", focus: "Building energy to climax; final group formation; stillness ending" },
      ],
      sectionFocus: [
        { section: "Soloists", goals: ["Strong stage presence during solo moments", "Clear emotional expression"], exercises: ["Solo phrase repetition with different emotions", "Eye contact and spatial projection drills"] },
        { section: "Ensemble", goals: ["Clean unison movement", "Responsive to musical cues"], exercises: ["Mirror exercise in pairs", "Group canon (wave) practice"] },
      ],
      coolDown: "Cool-down stretches, breathing, group discussion about narrative clarity",
      notesForNextSession: "Film a full run-through for self-review. Think about costume ideas that suggest the journey theme.",
    },
  },
  {
    name: "Readers Theatre Rehearsal Plan",
    formType: "rehearsal_plan",
    grade: "Grade 8",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "drama",
    description: "Rehearsal plan for Readers Theatre performance of a Kenyan folk tale",
    formData: {
      ensembleType: "Grade 8 Drama Group (8-12 students)",
      duration: 60,
      rehearsalObjectives: ["Assign and practise character voices for the folk tale", "Work on pacing, pauses, and dramatic emphasis", "Add simple staging and movement to enhance the reading"],
      warmUpActivities: [
        { activity: "Voice projection exercise: count to 10 at increasing volumes", duration: 5 },
        { activity: "Character voice experiment: read a sentence as different characters", duration: 5 },
        { activity: "Freeze-frame: create 3 tableaux from the story", duration: 5 },
      ],
      repertoire: [
        { title: "The Hare and the Hyena (Kenyan folk tale)", focus: "Distinct character voices; comedic timing for Hare; menacing tone for Hyena" },
      ],
      sectionFocus: [
        { section: "Narrators", goals: ["Clear, engaging storytelling voice", "Smooth transitions between scenes"], exercises: ["Read narrator sections aloud with varied pace", "Practice 'painting pictures' with descriptive passages"] },
        { section: "Character voices", goals: ["Distinct, consistent character voices", "React to other characters authentically"], exercises: ["Voice workshopping for each character", "Dialogue exchange drills in pairs"] },
      ],
      coolDown: "Feedback round: what moments felt strongest? Where do we need more energy?",
      notesForNextSession: "Bring ideas for simple props. Practice your character voice at home using the mirror technique.",
    },
  },
  // Grade 8 Performance Programs
  {
    name: "Cultural Day Celebration Program",
    formType: "performance_program",
    grade: "Grade 8",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "mixed",
    description: "Program for school cultural day celebrating Kenya's diverse heritage",
    formData: {
      eventName: "Cultural Heritage Day Celebration",
      venue: "School Grounds / Assembly Hall",
      eventDate: "Friday, 12th June 2026",
      eventTime: "9:00 AM - 12:30 PM",
      programItems: [
        { order: 1, title: "Flag Raising & National Anthem", performerOrGroup: "Student Council", duration: 5 },
        { order: 2, title: "Welcome Address", performerOrGroup: "Head Teacher", duration: 5 },
        { order: 3, title: "Isukuti Dance — Luhya Heritage", performerOrGroup: "Grade 8A Dance Group", genre: "Traditional", duration: 7 },
        { order: 4, title: "Ohangla Performance", performerOrGroup: "Grade 8B Music Group", genre: "Traditional Music", duration: 6 },
        { order: 5, title: "Poetry Recital: My Kenya", performerOrGroup: "Grade 8 Literature Club", genre: "Poetry", duration: 8 },
        { order: 6, title: "Readers Theatre: The Hare & the Hyena", performerOrGroup: "Grade 8 Drama Group", genre: "Folk Tale", duration: 10 },
        { order: 7, title: "— BREAK & CULTURAL FOOD TASTING —", performerOrGroup: "", duration: 25 },
        { order: 8, title: "Maasai Adumu (Jumping Dance)", performerOrGroup: "Grade 8C Cultural Group", genre: "Traditional", duration: 6 },
        { order: 9, title: "Taarab-Inspired Musical Performance", performerOrGroup: "Coastal Culture Club", genre: "Taarab", duration: 8 },
        { order: 10, title: "Fashion Parade: Traditional Attire", performerOrGroup: "All Participating Students", genre: "Fashion", duration: 12 },
        { order: 11, title: "Closing Song & Vote of Thanks", performerOrGroup: "School Choir", duration: 5 },
      ],
      intermissions: [{ afterItemNumber: 6, duration: 25 }],
      acknowledgments: "We celebrate the rich cultural diversity of our school community. Thank you to all parents and community members who shared their traditions, costumes, and recipes.",
      specialNotes: "Students are encouraged to wear traditional attire from their communities. Food tasting tickets available at the entrance (KES 50). All proceeds to the Arts Department fund.",
    },
  },
  {
    name: "Music Recital Evening Program",
    formType: "performance_program",
    grade: "Grade 8",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "instrumental",
    description: "Program for an evening of student instrumental and vocal performances",
    formData: {
      eventName: "Grade 8 Music Recital Evening",
      venue: "School Chapel / Music Room",
      eventDate: "Thursday, 20th November 2026",
      eventTime: "5:00 PM - 7:00 PM",
      programItems: [
        { order: 1, title: "Welcome & Introduction", performerOrGroup: "Music Teacher", duration: 3 },
        { order: 2, title: "Fur Elise (simplified)", performerOrGroup: "James Ochieng — Piano", composer: "Beethoven", genre: "Classical", duration: 4 },
        { order: 3, title: "Lala Salama", performerOrGroup: "Grade 8 Choir (SAB)", composer: "Traditional", genre: "Folk", duration: 4 },
        { order: 4, title: "Recorder Duet: Ode to Joy", performerOrGroup: "Faith Wambui & Peter Mwangi", composer: "Beethoven", genre: "Classical", duration: 3 },
        { order: 5, title: "Guitar Solo: Redemption Song", performerOrGroup: "David Kiprop — Guitar", composer: "Bob Marley", genre: "Reggae", duration: 4 },
        { order: 6, title: "Vocal Solo: Malaika", performerOrGroup: "Grace Akinyi — Voice", composer: "Traditional", genre: "Folk", duration: 3 },
        { order: 7, title: "— INTERVAL —", performerOrGroup: "", duration: 10 },
        { order: 8, title: "Percussion Ensemble: African Rhythms", performerOrGroup: "Percussion Group", genre: "World Music", duration: 5 },
        { order: 9, title: "Piano Duet: Heart and Soul", performerOrGroup: "Amy & Brian — Piano 4 hands", genre: "Jazz Standard", duration: 3 },
        { order: 10, title: "Closing: Tushangilie Kenya", performerOrGroup: "All Performers & Audience", composer: "Traditional", genre: "Patriotic", duration: 4 },
      ],
      intermissions: [{ afterItemNumber: 6, duration: 10 }],
      acknowledgments: "A warm thank you to all our young musicians for their dedication and practice. Thanks to parents for supporting music education and to our accompanist Mrs. Njeri.",
      specialNotes: "Please arrive by 4:45 PM. Recording is permitted but please ensure phones are on silent. Light refreshments served during interval.",
    },
  },
  {
    name: "Batik & Painting Exhibition Program",
    formType: "performance_program",
    grade: "Grade 8",
    learningArea: "Creative Arts and Sports",
    strand: "Visual Arts",
    artDiscipline: "visual_art",
    description: "Program for student batik fabric design and watercolour painting exhibition",
    formData: {
      eventName: "Colours of Kenya — Grade 8 Art Exhibition",
      venue: "School Art Room & Corridor Gallery",
      eventDate: "Wednesday, 18th November 2026",
      eventTime: "11:00 AM - 2:00 PM",
      programItems: [
        { order: 1, title: "Exhibition Opening & Welcome", performerOrGroup: "Art Teacher Mrs. Wanjiru", duration: 5 },
        { order: 2, title: "Gallery Section 1: Batik Designs", performerOrGroup: "Grade 8A & 8B Students", genre: "Textile Art", duration: 20 },
        { order: 3, title: "Live Demonstration: Batik Wax-Resist Technique", performerOrGroup: "Art Club Members", genre: "Demo", duration: 15 },
        { order: 4, title: "Gallery Section 2: Watercolour Landscapes", performerOrGroup: "Grade 8C & 8D Students", genre: "Painting", duration: 20 },
        { order: 5, title: "— REFRESHMENT BREAK —", performerOrGroup: "", duration: 15 },
        { order: 6, title: "Student Artist Talks (3 speakers)", performerOrGroup: "Selected Students", genre: "Presentation", duration: 15 },
        { order: 7, title: "People's Choice Voting & Awards", performerOrGroup: "All Visitors", duration: 10 },
        { order: 8, title: "Closing Remarks", performerOrGroup: "Deputy Head Teacher", duration: 5 },
      ],
      intermissions: [{ afterItemNumber: 4, duration: 15 }],
      acknowledgments: "Thank you to all Grade 8 student artists for their beautiful work. Special thanks to local artist Mr. Otieno who donated batik supplies.",
      specialNotes: "Selected artworks will be displayed permanently in the school corridor. Best artworks eligible for county-level competition entry.",
    },
  },
  // Grade 8 Portfolio Assessment
  {
    name: "Batik & Watercolour Portfolio Assessment",
    formType: "portfolio_assessment",
    grade: "Grade 8",
    learningArea: "Creative Arts and Sports",
    strand: "Visual Arts",
    artDiscipline: "visual_art",
    description: "Portfolio assessment for batik and watercolour painting projects",
    formData: {
      portfolioType: "Grade 8 Visual Arts Portfolio (Batik & Watercolour)",
      requiredComponents: [
        { component: "2 Finished Batik Pieces", description: "Completed batik fabric designs with Kenyan motifs" },
        { component: "2 Watercolour Paintings", description: "Landscape or still life paintings" },
        { component: "Process Sketches", description: "Design sketches and colour studies (at least 4)" },
        { component: "Written Reflection", description: "200-word reflection comparing batik and painting experiences" },
      ],
      assessmentCriteria: [
        {
          criterion: "Technical Mastery of Media",
          rubricLevels: [
            { level: "Exceeding (9-10)", description: "Expert control of both batik wax-resist and watercolour wash techniques", pointValue: 10 },
            { level: "Meeting (6-8)", description: "Good control of techniques with minor inconsistencies", pointValue: 7 },
            { level: "Approaching (3-5)", description: "Developing control; some technical difficulties evident", pointValue: 4 },
            { level: "Beginning (0-2)", description: "Struggles with both media; needs guided practice", pointValue: 1 },
          ],
        },
        {
          criterion: "Design & Cultural Relevance",
          rubricLevels: [
            { level: "Exceeding (9-10)", description: "Sophisticated designs with meaningful cultural references; original interpretation", pointValue: 10 },
            { level: "Meeting (6-8)", description: "Good designs with clear cultural connections", pointValue: 7 },
            { level: "Approaching (3-5)", description: "Basic designs; surface-level cultural reference", pointValue: 4 },
            { level: "Beginning (0-2)", description: "Generic designs with no cultural connection", pointValue: 1 },
          ],
        },
        {
          criterion: "Colour Theory Application",
          rubricLevels: [
            { level: "Exceeding (9-10)", description: "Sophisticated colour choices; excellent harmony and contrast", pointValue: 10 },
            { level: "Meeting (6-8)", description: "Good colour awareness; mostly harmonious palettes", pointValue: 7 },
            { level: "Approaching (3-5)", description: "Basic colour use; some muddy mixing", pointValue: 4 },
            { level: "Beginning (0-2)", description: "Random colour choices; poor mixing", pointValue: 1 },
          ],
        },
      ],
      growthIndicators: [
        "Improvement in control of wet media techniques",
        "Growing confidence in colour mixing and application",
        "Development of personal design aesthetic",
        "Understanding of cultural motifs in art",
      ],
      reflectionPrompts: [
        "Which medium did you enjoy more — batik or watercolour? Why?",
        "How did you use Kenyan cultural motifs in your batik designs?",
        "What colour theory concept was most useful in your paintings?",
        "How would you improve your weakest piece if you could redo it?",
      ],
      totalPoints: 30,
    },
  },
  {
    name: "Grade 8 Performing Arts Assessment",
    formType: "portfolio_assessment",
    grade: "Grade 8",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "mixed",
    description: "End-of-term assessment for music, dance, and drama competencies",
    formData: {
      portfolioType: "Grade 8 Performing Arts Competency Assessment",
      requiredComponents: [
        { component: "Performance Recording", description: "Video evidence of participation in at least one ensemble performance" },
        { component: "Skills Demonstration", description: "Show proficiency in one specific skill (vocal technique, dance step, monologue)" },
        { component: "Reflective Journal Entry", description: "200-word journal entry on performing arts growth this term" },
      ],
      assessmentCriteria: [
        {
          criterion: "Individual Performance Skill",
          rubricLevels: [
            { level: "Exceeding (9-10)", description: "Outstanding individual technique and expressive ability", pointValue: 10 },
            { level: "Meeting (6-8)", description: "Solid technique with good expression", pointValue: 7 },
            { level: "Approaching (3-5)", description: "Basic technique; limited expression", pointValue: 4 },
            { level: "Beginning (0-2)", description: "Needs significant skill development", pointValue: 1 },
          ],
        },
        {
          criterion: "Ensemble Contribution",
          rubricLevels: [
            { level: "Exceeding (9-10)", description: "Exceptional team member; enhances the whole group's performance", pointValue: 10 },
            { level: "Meeting (6-8)", description: "Reliable ensemble member; blends well", pointValue: 7 },
            { level: "Approaching (3-5)", description: "Participates but sometimes disrupts ensemble balance", pointValue: 4 },
            { level: "Beginning (0-2)", description: "Difficulty integrating with the group", pointValue: 1 },
          ],
        },
        {
          criterion: "Artistic Growth & Reflection",
          rubricLevels: [
            { level: "Exceeding (9-10)", description: "Deep reflection; clear evidence of significant growth", pointValue: 10 },
            { level: "Meeting (6-8)", description: "Thoughtful reflection; evidence of growth", pointValue: 7 },
            { level: "Approaching (3-5)", description: "Basic reflection; some growth visible", pointValue: 4 },
            { level: "Beginning (0-2)", description: "Minimal reflection or growth", pointValue: 1 },
          ],
        },
      ],
      growthIndicators: [
        "Can identify and describe their own artistic strengths",
        "Shows improvement in at least one specific skill area",
        "Demonstrates increased confidence when performing",
        "Can give constructive feedback to peers",
      ],
      reflectionPrompts: [
        "What specific performing arts skill improved most this term?",
        "Describe a challenge you overcame during rehearsals.",
        "How did peer feedback help you improve?",
      ],
      totalPoints: 30,
    },
  },
  {
    name: "Creative Arts Cross-Discipline Assessment",
    formType: "portfolio_assessment",
    grade: "Grade 8",
    learningArea: "Creative Arts and Sports",
    strand: "Visual Arts",
    artDiscipline: "mixed",
    description: "Holistic assessment connecting visual and performing arts learning",
    formData: {
      portfolioType: "Grade 8 Cross-Discipline Creative Arts Assessment",
      requiredComponents: [
        { component: "Art-Music Connection Project", description: "Artwork inspired by music, or music inspired by visual art" },
        { component: "Process Documentation", description: "Photos, sketches, or notes showing the creative process" },
        { component: "Presentation", description: "3-minute presentation explaining the cross-discipline connection" },
      ],
      assessmentCriteria: [
        {
          criterion: "Cross-Discipline Integration",
          rubricLevels: [
            { level: "Exceeding (9-10)", description: "Seamless, innovative connection between art forms; deep understanding", pointValue: 10 },
            { level: "Meeting (6-8)", description: "Clear connection between disciplines; good understanding", pointValue: 7 },
            { level: "Approaching (3-5)", description: "Some connection visible; surface-level understanding", pointValue: 4 },
            { level: "Beginning (0-2)", description: "Weak or unclear connection between disciplines", pointValue: 1 },
          ],
        },
        {
          criterion: "Quality of Final Work",
          rubricLevels: [
            { level: "Exceeding (9-10)", description: "Exceptional quality; strong technique in both elements", pointValue: 10 },
            { level: "Meeting (6-8)", description: "Good quality; competent execution", pointValue: 7 },
            { level: "Approaching (3-5)", description: "Acceptable quality with room for improvement", pointValue: 4 },
            { level: "Beginning (0-2)", description: "Poor quality; incomplete work", pointValue: 1 },
          ],
        },
      ],
      growthIndicators: [
        "Ability to see connections between different art forms",
        "Creative thinking in combining disciplines",
        "Effective communication about artistic choices",
      ],
      reflectionPrompts: [
        "How did working across art forms change your creative process?",
        "What surprised you about connecting visual art and music?",
      ],
      totalPoints: 20,
    },
  },

  // ═══ GRADE 9 — same learningArea/strand as 7-8 ═══
  {
    name: "Ensemble Music Adjudication Form",
    formType: "adjudication",
    grade: "Grade 9",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "ensemble",
    description: "Scoring sheet for instrumental and vocal ensemble competitions",
    formData: {
      category: "Instrumental/Vocal Ensemble",
      eventContext: "Kenya Music Festival — Ensemble Category",
      judgingCriteria: [
        { criterion: "Intonation & Accuracy", description: "Pitch accuracy, tuning between parts, correct notes and rhythms", maxScore: 20, ratingScale: "1-20" },
        { criterion: "Balance & Blend", description: "Dynamic balance between parts, tonal blend, ensemble listening", maxScore: 20, ratingScale: "1-20" },
        { criterion: "Musical Interpretation", description: "Stylistic understanding, phrasing, dynamic shaping, tempo choices", maxScore: 25, ratingScale: "1-25" },
        { criterion: "Technical Proficiency", description: "Individual and collective technical skill, articulation, control", maxScore: 20, ratingScale: "1-20" },
        { criterion: "Presentation", description: "Professional appearance, stage deportment, programme choice", maxScore: 15, ratingScale: "1-15" },
      ],
      commentSections: [
        { label: "Musical Highlights", purpose: "Standout moments and musical achievements" },
        { label: "Technical Feedback", purpose: "Specific areas for technical improvement" },
        { label: "General Remarks", purpose: "Overall assessment and encouragement" },
      ],
      totalPossibleScore: 100,
    },
  },
  {
    name: "Dance Choreography Adjudication Form",
    formType: "adjudication",
    grade: "Grade 9",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "dance",
    description: "Adjudication rubric for original student choreography",
    formData: {
      category: "Original Choreography",
      eventContext: "School Arts Festival — Choreography Competition",
      judgingCriteria: [
        { criterion: "Choreographic Structure", description: "Clear beginning, development, and conclusion; effective use of motif and variation", maxScore: 25, ratingScale: "1-25" },
        { criterion: "Movement Vocabulary", description: "Range and quality of movements; appropriate to theme and music", maxScore: 20, ratingScale: "1-20" },
        { criterion: "Use of Space, Time & Dynamics", description: "Varied levels, pathways, tempi; effective dynamic contrast", maxScore: 20, ratingScale: "1-20" },
        { criterion: "Theme & Expression", description: "Clear communication of choreographic intent; emotional engagement", maxScore: 20, ratingScale: "1-20" },
        { criterion: "Performance Execution", description: "Technical ability, confidence, synchronisation, energy", maxScore: 15, ratingScale: "1-15" },
      ],
      commentSections: [
        { label: "Choreographic Strengths", purpose: "What was most effective about the choreography" },
        { label: "Development Suggestions", purpose: "How the choreography could be enhanced" },
      ],
      totalPossibleScore: 100,
    },
  },
  {
    name: "One-Act Play Adjudication Form",
    formType: "adjudication",
    grade: "Grade 9",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "drama",
    description: "Assessment form for one-act play competitions with detailed drama criteria",
    formData: {
      category: "One-Act Play",
      eventContext: "Kenya Schools Drama Festival — One-Act Play",
      judgingCriteria: [
        { criterion: "Script & Direction", description: "Story structure, thematic depth, directorial vision, pace and rhythm", maxScore: 20, ratingScale: "1-20" },
        { criterion: "Acting", description: "Characterisation, vocal delivery, physicality, ensemble work, emotional truth", maxScore: 25, ratingScale: "1-25" },
        { criterion: "Design & Technical", description: "Set, props, costumes, lighting/sound (where applicable)", maxScore: 15, ratingScale: "1-15" },
        { criterion: "Social Relevance", description: "Relevance to contemporary Kenyan society; educational or cultural value", maxScore: 20, ratingScale: "1-20" },
        { criterion: "Overall Impact", description: "Entertainment value, originality, audience engagement, lasting impression", maxScore: 20, ratingScale: "1-20" },
      ],
      commentSections: [
        { label: "Standout Elements", purpose: "Best aspects of the production" },
        { label: "Areas for Development", purpose: "Constructive feedback for the group" },
        { label: "Adjudicator's Note", purpose: "Personal reflections and encouragement" },
      ],
      totalPossibleScore: 100,
    },
  },
  // Grade 9 Rehearsal Plans
  {
    name: "Three-Part Choral Arrangement Rehearsal",
    formType: "rehearsal_plan",
    grade: "Grade 9",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "choir",
    description: "Advanced choral rehearsal for three-part arrangement preparation",
    formData: {
      ensembleType: "Grade 9 Senior Choir (35-40 voices, SAB)",
      duration: 105,
      rehearsalObjectives: ["Polish three-part arrangement of 'Kenya Yetu' for festival", "Achieve dynamic contrast between pp and ff passages", "Memorise entire arrangement (no scores)"],
      warmUpActivities: [
        { activity: "Physical stretches and Alexander Technique posture check", duration: 5 },
        { activity: "Breathing: 4-7-8 breathing exercise for breath support", duration: 5 },
        { activity: "Solfege sight-reading exercise (new 8-bar passage)", duration: 10 },
        { activity: "Three-part chord tuning exercise (I-IV-V-I progression)", duration: 5 },
      ],
      repertoire: [
        { title: "Kenya Yetu (3-part arr.)", composer: "Arr. by Music Teacher", focus: "Memory check without scores; dynamic markings pp-mp-mf-f-ff; cut-offs and releases" },
        { title: "Mungu Ibariki Afrika", composer: "Enoch Sontonga / arr.", focus: "Swahili and English verses; legato phrasing; emotional delivery" },
      ],
      sectionFocus: [
        { section: "Soprano", goals: ["Controlled high notes (up to F5) without strain", "Pure vowels on sustained notes"], exercises: ["Descending scales from F5 with [u] vowel", "Soprano melody alone with dynamic markings"] },
        { section: "Alto", goals: ["Confidence in counter-melody sections", "Match soprano blend on unison passages"], exercises: ["Alto counter-melody isolated with metronome", "Blend exercises: alto and soprano on sustained chords"] },
        { section: "Baritone", goals: ["Solid foundation bass notes", "Rhythmic drive in up-tempo sections"], exercises: ["Bass line with piano left hand only", "Baritone rhythmic accuracy drill on syncopated sections"] },
      ],
      coolDown: "Gentle humming, cool-down scales, detailed notes on memory spots to review",
      notesForNextSession: "Full dress rehearsal next week. All members must have uniform items ready. Individual memory checks for anyone still using scores.",
    },
  },
  {
    name: "Afro-Contemporary Fusion Dance Rehearsal",
    formType: "rehearsal_plan",
    grade: "Grade 9",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "dance",
    description: "Rehearsal plan for fusion dance piece blending African and contemporary styles",
    formData: {
      ensembleType: "Grade 9 Dance Company (14-18 dancers)",
      duration: 90,
      rehearsalObjectives: ["Fuse traditional Isukuti elements with contemporary release technique", "Create seamless transitions between traditional and contemporary sections", "Achieve full-group synchronisation on unison phrases"],
      warmUpActivities: [
        { activity: "Cardio: Afrobeats movement combination", duration: 5 },
        { activity: "Contemporary floor work: rolls, spirals, weight shifts", duration: 10 },
        { activity: "Traditional movement review: Isukuti basic steps", duration: 5 },
        { activity: "Fusion exploration: combine Isukuti footwork with contemporary upper body", duration: 10 },
      ],
      repertoire: [
        { title: "Fusion Piece: 'Roots & Wings' — Section A", focus: "Traditional opening: grounded, percussive, community energy; transition to contemporary" },
        { title: "Fusion Piece: 'Roots & Wings' — Section B", focus: "Contemporary solo and duet moments; floor work; emotion and vulnerability" },
        { title: "Fusion Piece: 'Roots & Wings' — Finale", focus: "Full group fusion climax; traditional and contemporary vocabularies woven together; powerful ending" },
      ],
      sectionFocus: [
        { section: "Traditional movement specialists", goals: ["Authentic Isukuti energy and footwork", "Teaching traditional elements to contemporary dancers"], exercises: ["Isukuti step patterns at increasing speed", "Traditional-contemporary partner exchange"] },
        { section: "Contemporary movers", goals: ["Floor work fluency", "Release technique in jumps and falls"], exercises: ["Floor sequence repetition", "Weight-sharing partner work"] },
      ],
      coolDown: "Deep stretching, breathing, group reflection on fusion quality",
      notesForNextSession: "Bring Isukuti-appropriate costume elements for top and contemporary black bottoms. Video review of today's run-through.",
    },
  },
  {
    name: "Devised Theatre Rehearsal Plan",
    formType: "rehearsal_plan",
    grade: "Grade 9",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "drama",
    description: "Rehearsal plan for student-devised theatre piece on social issues",
    formData: {
      ensembleType: "Grade 9 Theatre Company (10-14 students)",
      duration: 90,
      rehearsalObjectives: ["Develop and refine devised scenes on chosen social theme", "Integrate physical theatre and narration techniques", "Run full piece with transitions for timing"],
      warmUpActivities: [
        { activity: "Energy circle: clap-pass and name games", duration: 5 },
        { activity: "Physical theatre warm-up: levels, slow motion, machine exercise", duration: 10 },
        { activity: "Improvisation: given circumstances exercise", duration: 10 },
      ],
      repertoire: [
        { title: "Scene 1: The Status Quo", focus: "Establish the community/setting; ensemble tableau opening; naturalistic dialogue" },
        { title: "Scene 2: The Disruption", focus: "Introduce the social issue; physical theatre sequence; emotional escalation" },
        { title: "Scene 3: Perspectives", focus: "Multiple viewpoints on the issue; split-stage technique; direct audience address" },
        { title: "Scene 4: Resolution / Question", focus: "Does the community resolve or is the question left open? Final tableau" },
      ],
      sectionFocus: [
        { section: "Ensemble physical sequences", goals: ["Precise timing in group movement", "Smooth transitions between naturalistic and stylised modes"], exercises: ["Machine exercise building to full company", "Slow-motion replay of key moments"] },
        { section: "Monologue/narration moments", goals: ["Powerful direct address", "Vulnerability and emotional truth"], exercises: ["Monologue delivery with different intentions", "Hot-seating characters after monologues"] },
      ],
      coolDown: "Debrief circle: what felt authentic? What needs more work? Emotional check-in after heavy themes.",
      notesForNextSession: "Finalise script/outline document. Each actor to write one additional line for their character. Bring costume suggestions.",
    },
  },
  // Grade 9 Performance Programs
  {
    name: "Arts Festival Evening Program",
    formType: "performance_program",
    grade: "Grade 9",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "mixed",
    description: "Comprehensive arts festival program showcasing music, dance, drama, and visual arts",
    formData: {
      eventName: "Annual Creative Arts Festival",
      venue: "School Auditorium",
      eventDate: "Saturday, 22nd August 2026",
      eventTime: "4:00 PM - 7:30 PM",
      programItems: [
        { order: 1, title: "Welcome & Festival Opening", performerOrGroup: "Master of Ceremonies", duration: 5 },
        { order: 2, title: "Kenya Yetu (3-part arrangement)", performerOrGroup: "Senior Choir", composer: "Traditional / Arr.", genre: "Choral", duration: 5 },
        { order: 3, title: "Percussion Ensemble: Polyrhythmic Journey", performerOrGroup: "Drumming Circle", genre: "World Music", duration: 6 },
        { order: 4, title: "Contemporary Dance: 'Urban Stories'", performerOrGroup: "Grade 9 Dance Company", genre: "Contemporary", duration: 7 },
        { order: 5, title: "One-Act Play: 'The Other Side'", performerOrGroup: "Theatre Company", genre: "Drama", duration: 20 },
        { order: 6, title: "— INTERMISSION & Art Exhibition Viewing —", performerOrGroup: "", duration: 25 },
        { order: 7, title: "Afro-Fusion Dance: 'Roots & Wings'", performerOrGroup: "Fusion Dance Company", genre: "Afro-Contemporary", duration: 8 },
        { order: 8, title: "Solo & Duet Vocal Performances", performerOrGroup: "Selected Vocalists", genre: "Various", duration: 12 },
        { order: 9, title: "Band Performance: Original Compositions", performerOrGroup: "School Band", genre: "Afro-Pop", duration: 10 },
        { order: 10, title: "Art Awards & Recognition", performerOrGroup: "Arts Department Head", duration: 8 },
        { order: 11, title: "Finale: Combined Performance & Audience Sing-Along", performerOrGroup: "All Performers", duration: 5 },
      ],
      intermissions: [{ afterItemNumber: 5, duration: 25 }],
      acknowledgments: "This festival celebrates the creativity and talent of our students. Thank you to the Arts Department, all teachers, parents, sponsors, and the dedicated student performers who make this possible.",
      specialNotes: "Art exhibition open in the foyer throughout the event. Photography and recording permitted. Refreshments and student artwork for sale during intermission. All proceeds support the Arts Scholarship Fund.",
    },
  },
  {
    name: "Printmaking Exhibition Program",
    formType: "performance_program",
    grade: "Grade 9",
    learningArea: "Creative Arts and Sports",
    strand: "Visual Arts",
    artDiscipline: "visual_art",
    description: "Program for lino cut printmaking and pottery exhibition",
    formData: {
      eventName: "Impressions & Forms — Grade 9 Art Exhibition",
      venue: "Art Department Gallery Space",
      eventDate: "Friday, 14th August 2026",
      eventTime: "10:00 AM - 1:00 PM",
      programItems: [
        { order: 1, title: "Exhibition Opening", performerOrGroup: "Art Teacher", duration: 5 },
        { order: 2, title: "Gallery Walk: Lino Cut Prints — Wildlife Series", performerOrGroup: "Grade 9 Students", genre: "Printmaking", duration: 20 },
        { order: 3, title: "Live Printing Demonstration", performerOrGroup: "Art Club", genre: "Demo", duration: 20 },
        { order: 4, title: "Gallery Walk: Coil-Built Pottery", performerOrGroup: "Grade 9 Students", genre: "Ceramics", duration: 15 },
        { order: 5, title: "— BREAK —", performerOrGroup: "", duration: 10 },
        { order: 6, title: "Student Portfolio Presentations", performerOrGroup: "5 Selected Students", genre: "Presentation", duration: 20 },
        { order: 7, title: "Awards & Exhibition Closing", performerOrGroup: "Arts Department", duration: 10 },
      ],
      intermissions: [{ afterItemNumber: 4, duration: 10 }],
      acknowledgments: "Thank you to all student artists and our Art Teacher for their dedication to visual arts education.",
      specialNotes: "Prints available for purchase (KES 200-500). Pottery is for display only. Best entries will represent the school at county arts competition.",
    },
  },
  {
    name: "Drama Festival Showcase Program",
    formType: "performance_program",
    grade: "Grade 9",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "drama",
    description: "Program for school drama festival featuring devised and scripted works",
    formData: {
      eventName: "Spotlight: Grade 9 Drama Festival",
      venue: "School Hall",
      eventDate: "Thursday, 20th August 2026",
      eventTime: "2:00 PM - 5:00 PM",
      programItems: [
        { order: 1, title: "Welcome & Introduction", performerOrGroup: "Drama Teacher", duration: 5 },
        { order: 2, title: "Devised Piece: 'The Other Side' (social issues)", performerOrGroup: "Theatre Company A", genre: "Devised", duration: 15 },
        { order: 3, title: "Monologue Showcase (3 performers)", performerOrGroup: "Selected Students", genre: "Monologue", duration: 10 },
        { order: 4, title: "Physical Theatre: 'The Machine'", performerOrGroup: "Theatre Company B", genre: "Physical Theatre", duration: 10 },
        { order: 5, title: "— INTERVAL —", performerOrGroup: "", duration: 15 },
        { order: 6, title: "One-Act Play: 'Market Day' (comedy)", performerOrGroup: "Theatre Company C", genre: "Comedy", duration: 20 },
        { order: 7, title: "Audience Q&A with Performers", performerOrGroup: "All Companies", genre: "Discussion", duration: 15 },
        { order: 8, title: "Awards & Closing", performerOrGroup: "Drama Teacher & Guest Adjudicator", duration: 10 },
      ],
      intermissions: [{ afterItemNumber: 4, duration: 15 }],
      acknowledgments: "Thank you to all student actors, directors, and crew. Special thanks to our guest adjudicator from the Kenya National Theatre for their expertise and encouragement.",
      specialNotes: "Best production advances to the sub-county drama festival. All performances deal with themes appropriate for a school audience. Programme notes available at the door.",
    },
  },
  // Grade 9 Portfolio Assessment
  {
    name: "Printmaking & Sculpture Portfolio Assessment",
    formType: "portfolio_assessment",
    grade: "Grade 9",
    learningArea: "Creative Arts and Sports",
    strand: "Visual Arts",
    artDiscipline: "visual_art",
    description: "Portfolio assessment for lino printing and coil-built pottery projects",
    formData: {
      portfolioType: "Grade 9 Visual Arts Portfolio (Printmaking & Sculpture)",
      requiredComponents: [
        { component: "3 Lino Cut Prints", description: "Edition of at least 3 prints from original lino block" },
        { component: "1 Coil-Built Vessel", description: "Completed pottery piece inspired by traditional Kenyan forms" },
        { component: "Design Development", description: "Sketches showing design process from concept to final" },
        { component: "Artist Statement", description: "250-word statement on artistic influences and choices" },
      ],
      assessmentCriteria: [
        {
          criterion: "Printmaking Technique",
          rubricLevels: [
            { level: "Exceeding (13-15)", description: "Precise cutting; consistent, clean prints; mastery of registration", pointValue: 15 },
            { level: "Meeting (9-12)", description: "Good cutting; mostly clean prints; adequate registration", pointValue: 10 },
            { level: "Approaching (5-8)", description: "Developing cutting skills; inconsistent print quality", pointValue: 6 },
            { level: "Beginning (0-4)", description: "Rough cutting; poor print quality", pointValue: 2 },
          ],
        },
        {
          criterion: "Ceramic Construction",
          rubricLevels: [
            { level: "Exceeding (13-15)", description: "Well-constructed vessel; smooth joins; effective surface treatment", pointValue: 15 },
            { level: "Meeting (9-12)", description: "Sound construction; adequate joins; some surface treatment", pointValue: 10 },
            { level: "Approaching (5-8)", description: "Basic construction; visible weaknesses in form", pointValue: 6 },
            { level: "Beginning (0-4)", description: "Poor construction; structural problems", pointValue: 2 },
          ],
        },
        {
          criterion: "Creative Vision & Design",
          rubricLevels: [
            { level: "Exceeding (13-15)", description: "Highly original; sophisticated design development; strong cultural references", pointValue: 15 },
            { level: "Meeting (9-12)", description: "Good originality; clear design development", pointValue: 10 },
            { level: "Approaching (5-8)", description: "Some originality; basic design process", pointValue: 6 },
            { level: "Beginning (0-4)", description: "Derivative work; minimal design thought", pointValue: 2 },
          ],
        },
        {
          criterion: "Critical Reflection",
          rubricLevels: [
            { level: "Exceeding (4-5)", description: "Insightful artist statement; sophisticated analysis of own work", pointValue: 5 },
            { level: "Meeting (3)", description: "Thoughtful statement; good self-awareness", pointValue: 3 },
            { level: "Approaching (2)", description: "Basic statement; limited analysis", pointValue: 2 },
            { level: "Beginning (0-1)", description: "Superficial or missing statement", pointValue: 1 },
          ],
        },
      ],
      growthIndicators: [
        "Growing confidence in 3D and print media",
        "Ability to plan and execute multi-step artistic projects",
        "Understanding of cultural influences in contemporary art",
        "Development of critical vocabulary for discussing art",
      ],
      reflectionPrompts: [
        "How did your printmaking skills develop from first attempt to final edition?",
        "What traditional Kenyan pottery forms influenced your vessel design?",
        "Compare your creative process in 2D (print) and 3D (pottery). What was different?",
        "Which artist or tradition most influenced your work this term?",
      ],
      totalPoints: 50,
    },
  },
  {
    name: "Advanced Performing Arts Portfolio",
    formType: "portfolio_assessment",
    grade: "Grade 9",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    artDiscipline: "mixed",
    description: "Comprehensive performing arts portfolio for Grade 9 students",
    formData: {
      portfolioType: "Grade 9 Advanced Performing Arts Portfolio",
      requiredComponents: [
        { component: "2 Performance Recordings", description: "Video evidence of two different performances (different disciplines preferred)" },
        { component: "Choreography/Direction Notes", description: "Documentation of any creative leadership role taken" },
        { component: "Peer Review", description: "Written peer review of another student's performance" },
        { component: "Self-Assessment Essay", description: "300-word essay evaluating own growth in performing arts" },
      ],
      assessmentCriteria: [
        {
          criterion: "Performance Excellence",
          rubricLevels: [
            { level: "Exceeding (13-15)", description: "Outstanding technique, expression, and artistic maturity", pointValue: 15 },
            { level: "Meeting (9-12)", description: "Strong performance with good technical control", pointValue: 10 },
            { level: "Approaching (5-8)", description: "Competent but developing performance skills", pointValue: 6 },
            { level: "Beginning (0-4)", description: "Needs significant development", pointValue: 2 },
          ],
        },
        {
          criterion: "Creative Leadership",
          rubricLevels: [
            { level: "Exceeding (13-15)", description: "Demonstrates choreographic/directorial vision; inspires others", pointValue: 15 },
            { level: "Meeting (9-12)", description: "Shows leadership initiative; contributes creative ideas", pointValue: 10 },
            { level: "Approaching (5-8)", description: "Follows direction well; occasional creative input", pointValue: 6 },
            { level: "Beginning (0-4)", description: "Passive participant; rarely contributes creatively", pointValue: 2 },
          ],
        },
        {
          criterion: "Critical Analysis",
          rubricLevels: [
            { level: "Exceeding (9-10)", description: "Sophisticated peer review and self-analysis; uses arts terminology", pointValue: 10 },
            { level: "Meeting (6-8)", description: "Thoughtful analysis with good observations", pointValue: 7 },
            { level: "Approaching (3-5)", description: "Basic observations; limited use of arts vocabulary", pointValue: 4 },
            { level: "Beginning (0-2)", description: "Superficial or missing critical analysis", pointValue: 1 },
          ],
        },
      ],
      growthIndicators: [
        "Taking on creative leadership roles (choreographer, director, section leader)",
        "Ability to critically analyse own and others' performances",
        "Cross-discipline skill development",
        "Increased artistic risk-taking and experimentation",
      ],
      reflectionPrompts: [
        "How has your performing arts identity developed this year?",
        "Describe a moment of creative leadership you took this term.",
        "What would you change about one of your performances if you could do it again?",
        "How do music, dance, and drama connect in your artistic experience?",
      ],
      totalPoints: 40,
    },
  },
  {
    name: "Integrated Arts Assessment",
    formType: "portfolio_assessment",
    grade: "Grade 9",
    learningArea: "Creative Arts and Sports",
    strand: "Visual Arts",
    artDiscipline: "mixed",
    description: "Assessment connecting visual arts, performing arts, and cultural understanding",
    formData: {
      portfolioType: "Grade 9 Integrated Arts & Culture Assessment",
      requiredComponents: [
        { component: "Cultural Research Project", description: "Research on one Kenyan art tradition (visual or performing)" },
        { component: "Creative Response", description: "Original artwork or performance inspired by the research" },
        { component: "Presentation", description: "5-minute presentation connecting research to creative work" },
      ],
      assessmentCriteria: [
        {
          criterion: "Research Quality",
          rubricLevels: [
            { level: "Exceeding (9-10)", description: "Thorough, accurate research with multiple sources; deep cultural understanding", pointValue: 10 },
            { level: "Meeting (6-8)", description: "Good research with adequate sources", pointValue: 7 },
            { level: "Approaching (3-5)", description: "Basic research; limited sources", pointValue: 4 },
            { level: "Beginning (0-2)", description: "Superficial or inaccurate research", pointValue: 1 },
          ],
        },
        {
          criterion: "Creative Response Quality",
          rubricLevels: [
            { level: "Exceeding (9-10)", description: "Powerful, original creative work that deeply engages with research findings", pointValue: 10 },
            { level: "Meeting (6-8)", description: "Good creative work with clear connection to research", pointValue: 7 },
            { level: "Approaching (3-5)", description: "Adequate creative work; weak connection to research", pointValue: 4 },
            { level: "Beginning (0-2)", description: "Poor quality work with no clear research connection", pointValue: 1 },
          ],
        },
        {
          criterion: "Presentation & Communication",
          rubricLevels: [
            { level: "Exceeding (9-10)", description: "Engaging, clear, well-structured presentation; confident delivery", pointValue: 10 },
            { level: "Meeting (6-8)", description: "Clear presentation with good structure", pointValue: 7 },
            { level: "Approaching (3-5)", description: "Basic presentation; some unclear sections", pointValue: 4 },
            { level: "Beginning (0-2)", description: "Disorganised or incomplete presentation", pointValue: 1 },
          ],
        },
      ],
      growthIndicators: [
        "Ability to connect artistic practice to cultural context",
        "Research and presentation skills development",
        "Understanding of Kenya's diverse artistic traditions",
      ],
      reflectionPrompts: [
        "What did you learn about Kenyan art traditions that surprised you?",
        "How did your research influence your creative choices?",
        "Why is it important to study and preserve traditional art forms?",
      ],
      totalPoints: 30,
    },
  },

  // ═══ GRADE 10 ═══
  {
    name: "Solo Instrumental Adjudication Form",
    formType: "adjudication",
    grade: "Grade 10",
    learningArea: "Fine Arts",
    strand: "Drawing and Painting",
    artDiscipline: "instrumental",
    description: "Advanced adjudication form for solo instrumental performances at festival level",
    formData: {
      category: "Solo Instrument",
      eventContext: "Kenya Music Festival — Solo Instrument Senior Category",
      judgingCriteria: [
        { criterion: "Technical Command", description: "Tone production, intonation, articulation, dynamic range, facility", maxScore: 25, ratingScale: "1-25" },
        { criterion: "Musical Interpretation", description: "Style, phrasing, rubato, dynamic shaping, structural awareness", maxScore: 25, ratingScale: "1-25" },
        { criterion: "Programme Choice & Variety", description: "Appropriate difficulty, contrast between pieces, musical range", maxScore: 15, ratingScale: "1-15" },
        { criterion: "Memorisation & Confidence", description: "Secure memory (if applicable), recovery from errors, self-assurance", maxScore: 15, ratingScale: "1-15" },
        { criterion: "Stage Presence & Communication", description: "Audience engagement, professional demeanour, musical communication", maxScore: 20, ratingScale: "1-20" },
      ],
      commentSections: [
        { label: "Technical Observations", purpose: "Specific feedback on instrumental technique" },
        { label: "Musical Observations", purpose: "Feedback on interpretation and musicianship" },
        { label: "Overall Assessment", purpose: "Summary and encouragement for continued development" },
      ],
      totalPossibleScore: 100,
    },
  },
  {
    name: "Cultural Dance Heritage Adjudication Form",
    formType: "adjudication",
    grade: "Grade 10",
    learningArea: "Music and Dance",
    strand: "Dance",
    artDiscipline: "dance",
    description: "Advanced adjudication for cultural dance heritage showcase performances",
    formData: {
      category: "Cultural Dance Heritage Showcase",
      eventContext: "Kenya Music Festival — Cultural Dance Senior",
      judgingCriteria: [
        { criterion: "Cultural Authenticity & Research", description: "Accuracy of traditional movement, evidence of research, respectful representation", maxScore: 25, ratingScale: "1-25" },
        { criterion: "Choreographic Excellence", description: "Structure, creativity within tradition, spatial design, transitions", maxScore: 20, ratingScale: "1-20" },
        { criterion: "Technical Execution", description: "Movement quality, stamina, control, precision, ensemble unity", maxScore: 20, ratingScale: "1-20" },
        { criterion: "Costume & Production", description: "Authentic costuming, props, musical accompaniment quality", maxScore: 15, ratingScale: "1-15" },
        { criterion: "Performance Impact", description: "Energy, commitment, cultural pride, audience engagement", maxScore: 20, ratingScale: "1-20" },
      ],
      commentSections: [
        { label: "Cultural Authenticity", purpose: "Assessment of cultural accuracy and respect" },
        { label: "Artistic Merit", purpose: "Feedback on choreographic and performance quality" },
        { label: "Recommendations", purpose: "Suggestions for enhancing the presentation" },
      ],
      totalPossibleScore: 100,
    },
  },
  {
    name: "Full-Length Play Adjudication Form",
    formType: "adjudication",
    grade: "Grade 10",
    learningArea: "Theatre and Film",
    strand: "Theatre Arts",
    artDiscipline: "drama",
    description: "Comprehensive adjudication for full-length school drama productions",
    formData: {
      category: "Full-Length Play / Musical",
      eventContext: "Kenya Schools Drama Festival — Senior Category",
      judgingCriteria: [
        { criterion: "Direction & Vision", description: "Coherent directorial concept, effective staging, pace and rhythm, creative choices", maxScore: 20, ratingScale: "1-20" },
        { criterion: "Acting Ensemble", description: "Characterisation, vocal skill, physicality, ensemble cohesion, emotional range", maxScore: 25, ratingScale: "1-25" },
        { criterion: "Script/Adaptation", description: "Quality of writing, thematic depth, dialogue authenticity, dramatic structure", maxScore: 15, ratingScale: "1-15" },
        { criterion: "Design & Technical", description: "Set, costumes, props, lighting, sound — support for the production's vision", maxScore: 15, ratingScale: "1-15" },
        { criterion: "Social Impact & Originality", description: "Relevance to Kenyan society, educational value, originality, lasting impact", maxScore: 25, ratingScale: "1-25" },
      ],
      commentSections: [
        { label: "Production Highlights", purpose: "Most effective elements of the production" },
        { label: "Acting Notes", purpose: "Specific feedback for cast members" },
        { label: "Technical & Design Notes", purpose: "Feedback on production elements" },
        { label: "Adjudicator's Summary", purpose: "Overall assessment and encouragement" },
      ],
      totalPossibleScore: 100,
    },
  },
  // Grade 10 Rehearsal Plans
  {
    name: "Original Composition Ensemble Rehearsal",
    formType: "rehearsal_plan",
    grade: "Grade 10",
    learningArea: "Music and Dance",
    strand: "Music Theory and Practice",
    artDiscipline: "ensemble",
    description: "Rehearsal plan for student-composed ensemble pieces",
    formData: {
      ensembleType: "Grade 10 Composition Ensemble (6-8 musicians)",
      duration: 90,
      rehearsalObjectives: ["Read through and refine student-composed 16-bar pieces", "Work on balance and blend between instruments", "Prepare two compositions for performance"],
      warmUpActivities: [
        { activity: "Individual instrument warm-up and tuning", duration: 10 },
        { activity: "Ensemble listening exercise: sustain a chord and balance", duration: 5 },
        { activity: "Sight-reading a simple 8-bar passage together", duration: 5 },
      ],
      repertoire: [
        { title: "Student Composition 1: 'Dawn Over Nairobi'", composer: "Student Composer A", focus: "Melody-accompaniment balance; dynamic markings pp to f; tempo stability" },
        { title: "Student Composition 2: 'Market Rhythms'", composer: "Student Composer B", focus: "Syncopated rhythms; percussion integration; clean transitions between sections" },
      ],
      sectionFocus: [
        { section: "Melody instruments", goals: ["Expressive phrasing of melodic lines", "Clean articulation"], exercises: ["Melody alone with metronome", "Phrasing practice with dynamics"] },
        { section: "Rhythm section", goals: ["Steady pulse foundation", "Dynamic sensitivity to melody"], exercises: ["Rhythm section groove lockup drill", "Play at different dynamic levels while maintaining groove"] },
      ],
      coolDown: "Composers receive feedback from ensemble. Discuss revisions. Plan recording session.",
      notesForNextSession: "Composers to make any revisions to scores. Full run-through with recording next rehearsal. Dress appropriately for recording.",
    },
  },
  {
    name: "Cultural Dance Showcase Rehearsal",
    formType: "rehearsal_plan",
    grade: "Grade 10",
    learningArea: "Music and Dance",
    strand: "Dance",
    artDiscipline: "dance",
    description: "Advanced rehearsal plan for cultural dance showcase preparation",
    formData: {
      ensembleType: "Grade 10 Cultural Dance Ensemble (16-20 dancers)",
      duration: 120,
      rehearsalObjectives: ["Master all choreographic sections of the cultural showcase", "Achieve authentic movement quality with performance energy", "Full run with costumes and props"],
      warmUpActivities: [
        { activity: "Cardio and dynamic stretching", duration: 10 },
        { activity: "Traditional movement vocabulary review (chosen tradition)", duration: 10 },
        { activity: "Spatial formation walkthrough without music", duration: 5 },
      ],
      repertoire: [
        { title: "Cultural Showcase — Entrance & Introduction", focus: "Dignified entrance; cultural greeting; strong opening formation" },
        { title: "Cultural Showcase — Core Dance", focus: "Authentic traditional vocabulary; musicality; group synchronisation" },
        { title: "Cultural Showcase — Featured Section", focus: "Solo/small group highlights; advanced technique; crowd energy" },
        { title: "Cultural Showcase — Finale & Exit", focus: "Building energy; powerful unison climax; dignified exit" },
      ],
      sectionFocus: [
        { section: "Lead dancers", goals: ["Commanding stage presence", "Flawless execution of featured moments"], exercises: ["Solo phrase repetition x5", "Performance energy drill: 50%, 75%, 100%"] },
        { section: "Ensemble", goals: ["Perfect synchronisation", "Consistent energy throughout"], exercises: ["Slow-motion full run for precision", "Full-speed run with maximum energy"] },
      ],
      coolDown: "Extended cool-down stretches, hydration, detailed notes, costume adjustments",
      notesForNextSession: "Final dress rehearsal. All costumes and accessories must be complete. Performance is in 3 days.",
    },
  },
  {
    name: "School Play Production Rehearsal",
    formType: "rehearsal_plan",
    grade: "Grade 10",
    learningArea: "Theatre and Film",
    strand: "Theatre Arts",
    artDiscipline: "drama",
    description: "Full production rehearsal plan for school play with technical elements",
    formData: {
      ensembleType: "Grade 10 Theatre Production (15-20 cast + 5-8 crew)",
      duration: 120,
      rehearsalObjectives: ["Technical rehearsal: integrate lighting, sound, and set changes", "Run Act 2 with full technical elements", "Work problem transitions and scene changes"],
      warmUpActivities: [
        { activity: "Company warm-up: vocal and physical", duration: 10 },
        { activity: "Crew briefing: technical cue sheet review", duration: 5 },
        { activity: "Quick energy game: zip-zap-zop", duration: 5 },
      ],
      repertoire: [
        { title: "Act 2, Scene 1 — The Confrontation", focus: "Lighting cue 15-18; sound effect timing; stage combat sequence safety" },
        { title: "Act 2, Scene 2 — The Revelation", focus: "Set change during blackout (15 seconds max); spotlight cue for monologue" },
        { title: "Act 2, Scene 3 — Resolution", focus: "Final lighting state; curtain call sequence; music fade-out" },
      ],
      sectionFocus: [
        { section: "Cast", goals: ["Maintain performance quality during tech stops", "Smooth interaction with set and props"], exercises: ["Run each scene once for tech, once for performance", "Problem moment repetitions"] },
        { section: "Crew", goals: ["Clean set changes under 15 seconds", "Accurate cue execution"], exercises: ["Set change drill x3 with stopwatch", "Cue-to-cue run of all lighting/sound cues"] },
      ],
      coolDown: "Full company notes session. Technical crew separate meeting for cue adjustments. Cast reminders for dress rehearsal.",
      notesForNextSession: "Dress rehearsal tomorrow — full make-up, costumes, and technical. Call time: 1 hour before curtain. No stopping.",
    },
  },
  // Grade 10 Performance Programs
  {
    name: "Senior Music & Arts Gala Program",
    formType: "performance_program",
    grade: "Grade 10",
    learningArea: "Fine Arts",
    strand: "Drawing and Painting",
    artDiscipline: "mixed",
    description: "Gala evening program for senior creative arts showcase",
    formData: {
      eventName: "MwalimuKit Senior Creative Arts Gala",
      venue: "School Auditorium & Foyer Gallery",
      eventDate: "Friday, 27th November 2026",
      eventTime: "5:30 PM - 9:00 PM",
      programItems: [
        { order: 1, title: "Foyer Gallery Opening & Welcome Drinks", performerOrGroup: "Art Department", duration: 30 },
        { order: 2, title: "Welcome Address", performerOrGroup: "School Principal", duration: 5 },
        { order: 3, title: "Orchestral Opening: 'Dawn Over Nairobi'", performerOrGroup: "School Ensemble", composer: "Student Composer", genre: "Original", duration: 5 },
        { order: 4, title: "Cultural Dance Heritage Showcase", performerOrGroup: "Senior Dance Ensemble", genre: "Traditional", duration: 10 },
        { order: 5, title: "Vocal Solos & Duets", performerOrGroup: "Senior Vocalists", genre: "Various", duration: 12 },
        { order: 6, title: "One-Act Play: 'Tomorrow's Promise'", performerOrGroup: "Grade 10 Theatre Company", genre: "Drama", duration: 25 },
        { order: 7, title: "— GALA INTERMISSION (Gallery viewing & refreshments) —", performerOrGroup: "", duration: 30 },
        { order: 8, title: "Original Song Performances", performerOrGroup: "Student Songwriters", genre: "Afro-Pop/Contemporary", duration: 15 },
        { order: 9, title: "Dance Showcase: 'Roots & Wings' (Afro-Contemporary)", performerOrGroup: "Fusion Dance Company", genre: "Afro-Contemporary", duration: 8 },
        { order: 10, title: "Creative Arts Awards Ceremony", performerOrGroup: "Arts Department & Guest Speaker", duration: 15 },
        { order: 11, title: "Grand Finale: 'Kenya Yetu' & Audience Sing-Along", performerOrGroup: "All Performers & Audience", genre: "Patriotic", duration: 5 },
      ],
      intermissions: [{ afterItemNumber: 6, duration: 30 }],
      acknowledgments: "This gala celebrates four years of creative arts education. We honour our graduating artists, musicians, dancers, and actors. Thank you to all teachers, parents, sponsors, and the dedicated arts community that makes our programme exceptional.",
      specialNotes: "Formal dress code. Art exhibition and sale in the foyer (proceeds support Arts Scholarship). Photography permitted. Programme booklet includes student artist biographies. Reserved seating for parents of performers.",
    },
  },
  {
    name: "Visual Arts Senior Exhibition Program",
    formType: "performance_program",
    grade: "Grade 10",
    learningArea: "Fine Arts",
    strand: "Drawing and Painting",
    artDiscipline: "visual_art",
    description: "Program for senior visual arts graduation exhibition",
    formData: {
      eventName: "Visions — Grade 10 Visual Arts Graduation Exhibition",
      venue: "School Gallery & Art Department",
      eventDate: "Wednesday, 25th November 2026",
      eventTime: "10:00 AM - 3:00 PM",
      programItems: [
        { order: 1, title: "Exhibition Opening & Curator's Welcome", performerOrGroup: "Art Teacher / Student Curator", duration: 10 },
        { order: 2, title: "Gallery Walk: Figure Studies & Observational Drawing", performerOrGroup: "Grade 10 Fine Arts Students", genre: "Drawing", duration: 20 },
        { order: 3, title: "Gallery Walk: Mixed-Media Sculptures", performerOrGroup: "Grade 10 Sculpture Students", genre: "Sculpture", duration: 20 },
        { order: 4, title: "Artist Talks: 'My Artistic Journey' (5 students)", performerOrGroup: "Selected Student Artists", genre: "Presentation", duration: 25 },
        { order: 5, title: "— LUNCH BREAK —", performerOrGroup: "", duration: 45 },
        { order: 6, title: "Gallery Walk: Paintings & Prints", performerOrGroup: "Grade 10 Students", genre: "Painting/Print", duration: 20 },
        { order: 7, title: "Live Art Session: Figure Drawing Demonstration", performerOrGroup: "Art Club Members", genre: "Demo", duration: 20 },
        { order: 8, title: "Awards, People's Choice, & Closing", performerOrGroup: "Art Department & Guest Artist", duration: 15 },
      ],
      intermissions: [{ afterItemNumber: 4, duration: 45 }],
      acknowledgments: "We celebrate the artistic growth of our Grade 10 visual arts students. Thank you to Art Teacher Mrs. Wanjiru, guest artist Mr. Otieno, and all parents who supported their children's creative development.",
      specialNotes: "Selected works available for purchase. Best portfolio entries will be submitted to the national arts competition. Photography encouraged. Exhibition catalogue available at entrance (KES 100).",
    },
  },
  {
    name: "School Play Production Program",
    formType: "performance_program",
    grade: "Grade 10",
    learningArea: "Theatre and Film",
    strand: "Theatre Arts",
    artDiscipline: "drama",
    description: "Full production program for senior school play",
    formData: {
      eventName: "Grade 10 Theatre Production: 'Tomorrow's Promise'",
      venue: "School Auditorium",
      eventDate: "Thursday-Saturday, 20-22 November 2026",
      eventTime: "7:00 PM (Doors open 6:30 PM)",
      programItems: [
        { order: 1, title: "Doors Open & Seating", performerOrGroup: "Front of House", duration: 15 },
        { order: 2, title: "Welcome & Production Notes", performerOrGroup: "Director (Student)", duration: 3 },
        { order: 3, title: "Act 1 — 'The Beginning'", performerOrGroup: "Full Cast", genre: "Drama", duration: 35 },
        { order: 4, title: "— INTERVAL —", performerOrGroup: "", duration: 15 },
        { order: 5, title: "Act 2 — 'The Journey'", performerOrGroup: "Full Cast", genre: "Drama", duration: 30 },
        { order: 6, title: "Act 3 — 'The Promise'", performerOrGroup: "Full Cast", genre: "Drama", duration: 25 },
        { order: 7, title: "Curtain Call", performerOrGroup: "Full Company", duration: 5 },
        { order: 8, title: "Post-Show Reception", performerOrGroup: "Cast, Crew & Audience", duration: 30 },
      ],
      intermissions: [{ afterItemNumber: 3, duration: 15 }],
      acknowledgments: "Written and directed by Grade 10 students. Thank you to Drama Teacher Ms. Achieng, Technical Director Mr. Omondi, and the entire production team. This production was made possible by the PTA Arts Fund.",
      specialNotes: "Running time approximately 90 minutes plus interval. Suitable for ages 12+. Programmes include cast biographies. Tickets: KES 200 (students), KES 500 (adults). Refreshments available during interval.",
    },
  },
  // Grade 10 Portfolio Assessment
  {
    name: "Senior Visual Arts Portfolio Assessment",
    formType: "portfolio_assessment",
    grade: "Grade 10",
    learningArea: "Fine Arts",
    strand: "Drawing and Painting",
    artDiscipline: "visual_art",
    description: "Comprehensive senior portfolio assessment for fine arts graduation",
    formData: {
      portfolioType: "Grade 10 Fine Arts Graduation Portfolio",
      requiredComponents: [
        { component: "6 Finished Works", description: "At least 3 media types represented (drawing, painting, sculpture, print)" },
        { component: "Sketchbook/Process Work", description: "Development sketches, colour studies, experimental work" },
        { component: "Artist Statement (500 words)", description: "Comprehensive reflection on artistic development and vision" },
        { component: "Exhibition-Ready Presentation", description: "At least 2 works mounted/framed for exhibition" },
      ],
      assessmentCriteria: [
        {
          criterion: "Technical Mastery",
          rubricLevels: [
            { level: "Exceeding (17-20)", description: "Exceptional command across multiple media; professional-level craftsmanship", pointValue: 20 },
            { level: "Meeting (12-16)", description: "Strong technique across media; confident execution", pointValue: 14 },
            { level: "Approaching (7-11)", description: "Competent in some media; developing in others", pointValue: 9 },
            { level: "Beginning (0-6)", description: "Basic skill level; needs significant development", pointValue: 3 },
          ],
        },
        {
          criterion: "Creative Vision & Originality",
          rubricLevels: [
            { level: "Exceeding (17-20)", description: "Distinctive artistic voice; innovative concepts; risk-taking", pointValue: 20 },
            { level: "Meeting (12-16)", description: "Clear personal style; original approaches to subjects", pointValue: 14 },
            { level: "Approaching (7-11)", description: "Emerging personal voice; some original ideas", pointValue: 9 },
            { level: "Beginning (0-6)", description: "Derivative work; little personal voice evident", pointValue: 3 },
          ],
        },
        {
          criterion: "Conceptual Depth & Cultural Awareness",
          rubricLevels: [
            { level: "Exceeding (13-15)", description: "Sophisticated engagement with themes, culture, and art historical context", pointValue: 15 },
            { level: "Meeting (9-12)", description: "Good thematic depth; awareness of cultural and art context", pointValue: 10 },
            { level: "Approaching (5-8)", description: "Surface-level themes; basic cultural awareness", pointValue: 6 },
            { level: "Beginning (0-4)", description: "No clear conceptual framework", pointValue: 2 },
          ],
        },
        {
          criterion: "Portfolio Presentation & Reflection",
          rubricLevels: [
            { level: "Exceeding (9-10)", description: "Exhibition-quality presentation; insightful, articulate artist statement", pointValue: 10 },
            { level: "Meeting (6-8)", description: "Well-presented portfolio; thoughtful reflection", pointValue: 7 },
            { level: "Approaching (3-5)", description: "Adequate presentation; basic reflection", pointValue: 4 },
            { level: "Beginning (0-2)", description: "Poor presentation; superficial reflection", pointValue: 1 },
          ],
        },
        {
          criterion: "Growth & Development",
          rubricLevels: [
            { level: "Exceeding (9-10)", description: "Dramatic growth visible; clear artistic trajectory; self-directed learning", pointValue: 10 },
            { level: "Meeting (6-8)", description: "Steady growth; responsive to feedback; improved skills", pointValue: 7 },
            { level: "Approaching (3-5)", description: "Some growth; inconsistent development", pointValue: 4 },
            { level: "Beginning (0-2)", description: "Little visible growth over the year", pointValue: 1 },
          ],
        },
      ],
      growthIndicators: [
        "Evolution from student artist to emerging independent artist",
        "Ability to sustain a body of work around themes or concepts",
        "Development of critical vocabulary and self-awareness",
        "Readiness for further arts education or creative practice",
        "Understanding of art's role in Kenyan society and culture",
      ],
      reflectionPrompts: [
        "How has your artistic identity evolved over your secondary school years?",
        "Which work in your portfolio best represents who you are as an artist?",
        "How has Kenyan culture and your personal experience influenced your art?",
        "What are your artistic goals for the future?",
        "What advice would you give to a younger student starting their arts journey?",
      ],
      totalPoints: 75,
    },
  },
  {
    name: "Senior Performing Arts Portfolio Assessment",
    formType: "portfolio_assessment",
    grade: "Grade 10",
    learningArea: "Music and Dance",
    strand: "Music Theory and Practice",
    artDiscipline: "mixed",
    description: "Comprehensive graduation portfolio for music, dance, and theatre students",
    formData: {
      portfolioType: "Grade 10 Performing Arts Graduation Portfolio",
      requiredComponents: [
        { component: "3 Performance Recordings", description: "Video evidence of performances across the year" },
        { component: "Original Creative Work", description: "Composition, choreography, or script written by the student" },
        { component: "Programme/Publicity Material", description: "Evidence of event organisation or production involvement" },
        { component: "Reflective Essay (500 words)", description: "Comprehensive reflection on performing arts journey" },
        { component: "Peer & Self Evaluation", description: "Completed peer review and detailed self-assessment" },
      ],
      assessmentCriteria: [
        {
          criterion: "Performance Excellence",
          rubricLevels: [
            { level: "Exceeding (17-20)", description: "Outstanding artistry; mature technique; compelling performance presence", pointValue: 20 },
            { level: "Meeting (12-16)", description: "Strong performance skills; confident and expressive", pointValue: 14 },
            { level: "Approaching (7-11)", description: "Competent performer; developing artistry", pointValue: 9 },
            { level: "Beginning (0-6)", description: "Basic performance skills; needs development", pointValue: 3 },
          ],
        },
        {
          criterion: "Creative Contribution",
          rubricLevels: [
            { level: "Exceeding (13-15)", description: "Exceptional original work; innovative creative vision; leadership", pointValue: 15 },
            { level: "Meeting (9-12)", description: "Good original work; contributes creative ideas", pointValue: 10 },
            { level: "Approaching (5-8)", description: "Some creative contribution; developing originality", pointValue: 6 },
            { level: "Beginning (0-4)", description: "Minimal creative contribution", pointValue: 2 },
          ],
        },
        {
          criterion: "Artistic Growth & Self-Awareness",
          rubricLevels: [
            { level: "Exceeding (13-15)", description: "Profound self-awareness; articulate about artistic development; transformative growth", pointValue: 15 },
            { level: "Meeting (9-12)", description: "Good self-awareness; clear evidence of growth", pointValue: 10 },
            { level: "Approaching (5-8)", description: "Basic self-awareness; some growth visible", pointValue: 6 },
            { level: "Beginning (0-4)", description: "Limited self-awareness or reflection", pointValue: 2 },
          ],
        },
      ],
      growthIndicators: [
        "Transition from student performer to emerging artist",
        "Ability to create original work independently",
        "Leadership in ensemble and production contexts",
        "Critical thinking about art's role in society",
        "Readiness for continued artistic practice",
      ],
      reflectionPrompts: [
        "How has performing arts shaped who you are?",
        "What was your most meaningful performance experience and why?",
        "How has creating original work (composition/choreography/script) changed your understanding of the arts?",
        "What role do the performing arts play in Kenyan society?",
        "Where do you see the arts in your future?",
      ],
      totalPoints: 50,
    },
  },
  {
    name: "Integrated Creative Arts Graduation Assessment",
    formType: "portfolio_assessment",
    grade: "Grade 10",
    learningArea: "Fine Arts",
    strand: "Drawing and Painting",
    artDiscipline: "mixed",
    description: "Holistic graduation assessment across all creative arts disciplines",
    formData: {
      portfolioType: "Grade 10 Integrated Creative Arts Graduation Assessment",
      requiredComponents: [
        { component: "Cross-Discipline Project", description: "Major project connecting at least 2 art disciplines" },
        { component: "Portfolio Documentation", description: "Comprehensive documentation of all creative work this year" },
        { component: "Public Presentation", description: "10-minute presentation of artistic journey and future plans" },
      ],
      assessmentCriteria: [
        {
          criterion: "Cross-Discipline Integration",
          rubricLevels: [
            { level: "Exceeding (17-20)", description: "Seamless, innovative integration; creates new meaning through combination", pointValue: 20 },
            { level: "Meeting (12-16)", description: "Effective integration; clear connections between disciplines", pointValue: 14 },
            { level: "Approaching (7-11)", description: "Some integration; connections not fully developed", pointValue: 9 },
            { level: "Beginning (0-6)", description: "Weak integration; disciplines treated separately", pointValue: 3 },
          ],
        },
        {
          criterion: "Artistic Maturity",
          rubricLevels: [
            { level: "Exceeding (17-20)", description: "Exceptional artistic maturity; clear personal vision; professional approach", pointValue: 20 },
            { level: "Meeting (12-16)", description: "Good artistic development; emerging personal voice", pointValue: 14 },
            { level: "Approaching (7-11)", description: "Developing artistically; needs more experience", pointValue: 9 },
            { level: "Beginning (0-6)", description: "Early stages of artistic development", pointValue: 3 },
          ],
        },
        {
          criterion: "Presentation & Communication",
          rubricLevels: [
            { level: "Exceeding (9-10)", description: "Compelling, articulate presentation; inspires and educates audience", pointValue: 10 },
            { level: "Meeting (6-8)", description: "Clear, well-organised presentation", pointValue: 7 },
            { level: "Approaching (3-5)", description: "Adequate presentation; some unclear elements", pointValue: 4 },
            { level: "Beginning (0-2)", description: "Poor presentation skills", pointValue: 1 },
          ],
        },
      ],
      growthIndicators: [
        "Ability to see and create connections across art forms",
        "Development of a personal artistic identity",
        "Readiness for lifelong creative engagement",
        "Understanding of arts in Kenyan cultural context",
      ],
      reflectionPrompts: [
        "How has studying multiple art forms enriched your creative life?",
        "What connections did you discover between different art disciplines?",
        "How will you continue your creative practice after school?",
        "What legacy do you want to leave in the school's arts community?",
      ],
      totalPoints: 50,
    },
  },
];

async function main() {
  console.log("📝 Seeding Creative Arts forms...");

  const deleted = await prisma.creativeArtsForm.deleteMany({});
  console.log(`🗑️  Deleted ${deleted.count} existing creative arts forms`);

  const grades = await prisma.grade.findMany();
  const learningAreas = await prisma.learningArea.findMany({
    include: { grade: true, strands: true },
  });

  let seededCount = 0;

  for (const form of forms) {
    const grade = grades.find((g) => g.name === form.grade);
    if (!grade) {
      console.log(`⚠️  Grade not found: ${form.grade} — skipping: ${form.name}`);
      continue;
    }

    const learningArea = learningAreas.find(
      (la) => la.name === form.learningArea && la.gradeId === grade.id
    );
    if (!learningArea) {
      console.log(`⚠️  Learning area not found: ${form.learningArea} for ${form.grade} — skipping: ${form.name}`);
      continue;
    }

    const strand = form.strand
      ? learningArea.strands.find((s) => s.name === form.strand)
      : undefined;

    await prisma.creativeArtsForm.create({
      data: {
        name: form.name,
        formType: form.formType,
        gradeId: grade.id,
        learningAreaId: learningArea.id,
        strandId: strand?.id,
        artDiscipline: form.artDiscipline,
        description: form.description,
        formData: form.formData,
      },
    });

    seededCount++;
    console.log(`✅ Seeded: ${form.name} (${form.formType} — ${form.grade})`);
  }

  console.log(`\n🎉 Successfully seeded ${seededCount} Creative Arts forms!`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding Creative Arts forms:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
