import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../lib/generated/prisma/client.js";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * CBC-aligned Creative Arts activities for Grades 7-10
 * 6 activities per grade = 24 total
 * Distribution: 2 visual_art, 2 music, 1 drama, 1 dance
 */

const activities = [
  // ═══════════════════════════════════════════════════
  // GRADE 7 — Creative Arts and Sports
  // Strands: Visual Arts, Performing Arts
  // ═══════════════════════════════════════════════════

  {
    name: "Still Life Drawing Using Pencil Shading",
    activityType: "visual_art",
    grade: "Grade 7",
    learningArea: "Creative Arts and Sports",
    strand: "Visual Arts",
    aim: "To create an observational still life drawing using pencil shading techniques including hatching, cross-hatching, and blending to represent light, shadow, and form.",
    materials: [
      "Drawing pencils (HB, 2B, 4B, 6B)",
      "A3 drawing paper or cartridge paper",
      "Eraser (soft putty eraser preferred)",
      "Pencil sharpener",
      "Still life objects (fruit, pottery, cloth)",
      "Blending stumps or tissue paper",
      "Ruler for border lines"
    ],
    instructions: [
      "1. Arrange a still life composition on the centre table using at least three objects of different shapes and sizes (e.g., a clay pot, two mangoes, and a folded piece of kitenge cloth).",
      "2. Observe the arrangement carefully from your seat. Notice where the light source is coming from and identify the areas of highlight (brightest), mid-tone, and shadow (darkest) on each object.",
      "3. Using your HB pencil, lightly sketch the basic shapes of each object, paying attention to their proportions and positions relative to each other. Do not press hard — these are guide lines.",
      "4. Begin adding tone using hatching (parallel lines) for lighter areas and cross-hatching (overlapping lines at angles) for darker areas. Use the 2B pencil for medium tones and the 4B or 6B for the darkest shadows.",
      "5. Use a blending stump or tissue paper to smooth out the shading on curved surfaces like the fruit, creating a gradual transition from light to dark (gradient shading).",
      "6. Add the cast shadows beneath each object — these are the shadows cast onto the surface the objects are sitting on. These should be your darkest values.",
      "7. Step back and evaluate your drawing. Add final details, clean up stray marks with your eraser, and sign your name and date in the bottom corner."
    ],
    backgroundInfo: "Still life drawing is one of the foundational skills in visual arts education and has been practised by artists for centuries. In the European tradition, still life painting became a genre in its own right during the 17th century in the Netherlands, where artists like Willem Claeszoon Heda created remarkably realistic depictions of everyday objects. In Kenya, visual arts education draws from both Western academic traditions and rich African artistic heritage, which emphasises pattern, symbolism, and the relationship between art and daily life. Pencil shading is the most accessible entry point into observational drawing because it requires minimal materials but teaches fundamental concepts of light, shadow, form, and composition. The ability to see and represent tonal values — the range from light to dark — is essential for all forms of visual art, from painting to sculpture to graphic design. By drawing from direct observation rather than imagination or copying, students develop their visual perception and hand-eye coordination.",
    expectedOutcome: "Students should produce a completed still life drawing on A3 paper that demonstrates understanding of at least two shading techniques (hatching and blending). The drawing should show a clear light source with consistent highlights and shadows across all objects. Objects should be proportionally accurate and show three-dimensional form through tonal variation. The composition should fill the page appropriately without objects floating or being cramped.",
    performanceCriteria: [
      "Accurate observation and proportional representation of still life objects",
      "Effective use of at least two shading techniques (hatching, cross-hatching, or blending)",
      "Clear representation of light source, mid-tones, and shadows",
      "Composition fills the page with balanced arrangement",
      "Neatness and care in execution"
    ],
    artMedium: "Graphite pencil on paper",
    inspirationNotes: "Look at the pencil drawings of Kenyan artist Michael Soi, known for detailed observational work, and the still life paintings of Paul Cezanne whose compositions of fruit and pottery revolutionised how artists think about form and space. Notice how both artists use light and shadow to create a sense of three-dimensional objects on a flat surface. When arranging your still life, choose objects that are meaningful to your daily life — a calabash, avocados, a sisal basket — as the best art comes from drawing what you know and connect with.",
    relatedConcepts: [
      "Observational drawing",
      "Tonal value and shading",
      "Composition and arrangement",
      "Light and shadow",
      "Elements of art (line, form, value)"
    ]
  },

  {
    name: "Creating a Collage on Kenyan Cultural Themes",
    activityType: "visual_art",
    grade: "Grade 7",
    learningArea: "Creative Arts and Sports",
    strand: "Visual Arts",
    aim: "To design and create a mixed-media collage that celebrates an aspect of Kenyan cultural heritage using found materials, magazine cuttings, and coloured paper.",
    materials: [
      "A3 cardboard or thick paper (base)",
      "Old magazines and newspapers",
      "Coloured paper and tissue paper",
      "Fabric scraps (kitenge, kikoy, or similar)",
      "Scissors and craft knife (teacher supervised)",
      "PVA glue or glue sticks",
      "Pencils and markers for outlines and details"
    ],
    instructions: [
      "1. Choose a theme from Kenyan cultural heritage: this could be traditional ceremonies, market scenes, wildlife, landscapes, traditional attire, or community life. Sketch a rough plan of your collage layout on scrap paper.",
      "2. Collect and sort your materials by colour and texture. Cut out relevant images from magazines, tear coloured paper into shapes, and select fabric scraps that complement your theme.",
      "3. On your A3 base, lightly sketch the main composition in pencil — where will the focal point be? What will be in the background versus the foreground?",
      "4. Begin laying down your background layers first. Overlap pieces of coloured paper and magazine cuttings to create a textured base. Do not glue yet — arrange first.",
      "5. Add your main subject matter in the foreground. If depicting people, use magazine images combined with fabric for clothing and coloured paper for the setting.",
      "6. Once you are satisfied with the arrangement, glue everything down starting from the background layers and working forward. Press firmly and smooth out any bubbles.",
      "7. Add final details using markers or pencils — outlines, patterns, text, or decorative elements. Add a title label to the back of your work."
    ],
    backgroundInfo: "Collage, from the French word 'coller' meaning 'to glue', is an art technique that brings together different materials to create a unified composition. While collage became prominent in Western art through artists like Pablo Picasso and Georges Braque in the early 1900s, the practice of combining different materials in art has deep roots in African creative traditions. Kenyan communities have long practised mixed-media creativity through beadwork that combines patterns and colours, basket weaving that mixes natural and dyed fibres, and the decoration of domestic objects with various materials. Contemporary Kenyan artists like Wangechi Mutu have gained international recognition for powerful collage works that combine magazine imagery, paint, and found materials to explore themes of identity and culture. Creating collages allows students to experiment with composition, colour theory, and texture without needing advanced drawing skills, making it an inclusive art form that values creativity and personal expression.",
    expectedOutcome: "Students should produce a completed A3 collage that clearly communicates a Kenyan cultural theme through thoughtful selection and arrangement of mixed materials. The collage should demonstrate layering of at least three different material types, a clear focal point, and evidence of planning in the composition. The work should be neatly executed with materials firmly adhered.",
    performanceCriteria: [
      "Clear communication of a Kenyan cultural theme",
      "Creative use of at least three different material types",
      "Effective composition with identifiable focal point",
      "Quality of execution — neatness, secure adhesion, layering",
      "Personal expression and originality in approach"
    ],
    artMedium: "Mixed-media collage",
    inspirationNotes: "Study the collage work of Kenyan-born artist Wangechi Mutu, whose large-scale works combine magazine images with watercolour and found objects to create striking compositions. Also look at the vibrant patterns found in Kenyan textiles like kitenge and kikoy — these patterns tell stories of identity and community. Consider how market scenes in Nairobi, Kisumu, or Mombasa are themselves collages of colour, texture, and activity. Your collage can capture this richness by layering materials just as real life layers experiences, colours, and stories.",
    relatedConcepts: [
      "Mixed-media art techniques",
      "Cultural heritage and identity",
      "Composition and design principles",
      "Texture and layering in art",
      "Contemporary African art"
    ]
  },

  {
    name: "Composing a Rhythm Pattern Using Body Percussion",
    activityType: "music",
    grade: "Grade 7",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    aim: "To compose and perform a four-bar rhythm pattern using body percussion sounds including clapping, stomping, snapping, and patting, while reading and writing simple rhythmic notation.",
    materials: [
      "Rhythm notation chart (crotchets, quavers, minims, rests)",
      "Blank staff paper or lined paper for notation",
      "Pencil and eraser",
      "Chalkboard or whiteboard for demonstration",
      "Optional: drum or shaker for keeping steady beat",
      "Audio examples of body percussion performances"
    ],
    instructions: [
      "1. As a class, practise the four basic body percussion sounds: clap (hands together), stomp (foot on floor), snap (fingers), and pat (hands on thighs). Practise each at a steady tempo.",
      "2. Learn the basic rhythm values: crotchet (1 beat), quaver (half beat — usually paired), minim (2 beats), and crotchet rest (1 beat of silence). Write these on the board with their symbols.",
      "3. The teacher demonstrates a simple two-bar rhythm pattern using claps only. Students echo it back. Repeat with increasing complexity.",
      "4. In pairs, compose a four-bar rhythm pattern. Choose which body percussion sounds to use for each bar. Write your pattern using the notation learned — use symbols above the staff to indicate the sound type (C = clap, S = stomp, Sn = snap, P = pat).",
      "5. Practise your pattern at a slow tempo until you can perform it consistently, then gradually increase the speed.",
      "6. Perform your composed pattern to another pair. Listen to their pattern and give constructive feedback on timing and creativity.",
      "7. Optional extension: combine two pairs' patterns to create an eight-bar piece with different body percussion layers happening simultaneously."
    ],
    backgroundInfo: "Body percussion — using the body as a musical instrument — is one of the oldest and most universal forms of music-making. In Kenyan communities, body percussion is integral to many traditional music and dance forms. The Luo community's Ohangla music features intricate clapping patterns, while Maasai ceremonies include rhythmic stomping and chanting. Giriama communities along the coast incorporate complex hand-clapping patterns called 'mapalakano' into their social music. Globally, body percussion has been developed into a sophisticated art form by groups like STOMP and Barbatuques. In music education, body percussion is the ideal starting point because it requires no instruments, is accessible to all students regardless of economic background, and develops fundamental musical skills: steady beat, rhythm accuracy, coordination, and ensemble awareness. Composing with body percussion also introduces students to the creative process of making musical decisions about sound, silence, pattern, and structure.",
    expectedOutcome: "Each pair should produce a written four-bar rhythm pattern using correct notation symbols and body percussion sound indicators. They should perform their pattern with consistent tempo and accurate rhythm. Students should demonstrate understanding of basic note values and how they fit within a bar. The performance should show coordination between partners and musical awareness.",
    performanceCriteria: [
      "Correct use of rhythm notation (crotchets, quavers, minims, rests)",
      "Steady tempo maintained throughout the four-bar pattern",
      "Creative use of at least three different body percussion sounds",
      "Coordination and synchronisation between partners",
      "Clear, confident performance delivery"
    ],
    artMedium: "Body percussion",
    inspirationNotes: "Listen to the traditional Luo Ohangla drumming and clapping patterns from western Kenya, and the Maasai jumping and stomping ceremonies (Adumu). Notice how rhythm in African music is often built in layers, with different patterns interlocking to create complex textures. Watch videos of the Brazilian group Barbatuques who create elaborate compositions using only their bodies. Your rhythm pattern can be inspired by patterns you hear in daily life — the rhythm of a matatu engine, rainfall on a mabati roof, or the steady beat of a pestle pounding maize.",
    relatedConcepts: [
      "Rhythm and beat",
      "Music notation",
      "Composition and arrangement",
      "Ensemble performance",
      "African musical traditions"
    ]
  },

  {
    name: "Learning the Pentatonic Scale on Recorder",
    activityType: "music",
    grade: "Grade 7",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    aim: "To learn the five notes of the pentatonic scale (C, D, E, G, A) on the descant recorder and perform a simple melody using these notes.",
    materials: [
      "Descant (soprano) recorders — one per student",
      "Pentatonic scale fingering chart",
      "Simple melody sheet in pentatonic scale",
      "Music stand or desk for sheet music",
      "Pencil for marking notes",
      "Audio recording of the melody for reference"
    ],
    instructions: [
      "1. Hold the recorder correctly: left hand on top covering the thumb hole and first three holes, right hand below. The mouthpiece should rest gently between your lips — do not bite.",
      "2. Learn proper breath control: blow gently and steadily with warm air (as if saying 'du' or 'tu'). Practise making a clear tone on the note B (left thumb + left index finger only).",
      "3. Following the fingering chart, learn each note of the pentatonic scale one at a time: C (all holes covered), D, E, G, and A (fewest holes covered). Play each note for four steady beats.",
      "4. Practise the ascending scale (C-D-E-G-A) and descending scale (A-G-E-D-C) slowly, ensuring each note sounds clear before moving to the next.",
      "5. Learn the simple melody provided by the teacher, note by note. The melody uses only pentatonic notes and simple rhythm (crotchets and minims).",
      "6. Practise the melody in sections, then put it all together. Play along with the class at a slow, steady tempo.",
      "7. In groups of four, perform the melody for the class. Aim for uniform tone, correct notes, and steady rhythm."
    ],
    backgroundInfo: "The pentatonic scale — a five-note scale found in music cultures worldwide — is particularly significant in African music traditions. Many traditional Kenyan songs from the Kikuyu, Kalenjin, Luhya, and other communities are based on pentatonic patterns. The nyatiti (Luo lyre) and obokano (Gusii lyre) are traditionally tuned to pentatonic scales. This connection makes the pentatonic scale an ideal starting point for Kenyan music students as it bridges traditional heritage with formal music education. The descant recorder is the most widely used classroom instrument globally because it is affordable, portable, and teaches essential skills of breath control, finger coordination, pitch accuracy, and music reading. The pentatonic scale is particularly beginner-friendly because any combination of its five notes sounds harmonious, encouraging experimentation and reducing the fear of playing 'wrong' notes. Learning a melodic instrument opens pathways to understanding melody, harmony, and musical structure that cannot be achieved through rhythm alone.",
    expectedOutcome: "Students should be able to play all five notes of the C pentatonic scale with clear tone and correct fingering. They should perform the simple melody with accurate pitch and steady rhythm. Students should demonstrate proper recorder technique including correct hand position, gentle breath control, and clean note transitions. Group performances should show the ability to play in time with others.",
    performanceCriteria: [
      "Correct fingering for all five pentatonic notes",
      "Clear tone produced through proper breath control",
      "Accurate pitch — notes sound in tune",
      "Steady rhythm maintained during melody performance",
      "Proper instrument handling and playing posture"
    ],
    artMedium: "Descant recorder",
    inspirationNotes: "The pentatonic scale you are learning is the same musical foundation used in traditional Kenyan lyre music, Chinese folk songs, Scottish bagpipe tunes, and even modern pop music. Listen to recordings of the nyatiti lyre from the Luo community and notice how the melodies naturally use five notes. Many beloved songs including 'Amazing Grace' and 'Swing Low, Sweet Chariot' are pentatonic. After mastering these five notes, you will be able to play melodies from cultures around the world, showing how music connects humanity across borders and centuries.",
    relatedConcepts: [
      "Pentatonic scale",
      "Music notation and reading",
      "Instrument technique",
      "Breath control and tone production",
      "Musical traditions across cultures"
    ]
  },

  {
    name: "Improvisation Workshop: Everyday Scenarios",
    activityType: "drama",
    grade: "Grade 7",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    aim: "To develop improvisational acting skills by creating and performing short unscripted scenes based on everyday Kenyan situations, building confidence, creativity, and communication skills.",
    materials: [
      "Open performance space (classroom with desks pushed to sides)",
      "Scenario cards (prepared by teacher)",
      "Simple props: chair, table, broom, book, phone (optional)",
      "Timer or stopwatch",
      "Evaluation rubric for peer feedback",
      "Notebook for reflection writing"
    ],
    instructions: [
      "1. Warm up: Stand in a circle. Play 'Zip Zap Zop' — a focus and energy game where students pass a sound and gesture around the circle quickly. If someone hesitates, they step into the centre and do a funny pose.",
      "2. Learn the three rules of improvisation: (a) Say 'Yes, and...' — accept what your scene partner says and add to it; (b) Listen actively — react to what is actually happening, not what you planned; (c) Be specific — instead of 'I went to the shop', say 'I walked to Mama Njeri's kiosk to buy mandazi.'",
      "3. In pairs, practise 'Yes, and...' for two minutes. Partner A starts with a statement ('We are at the bus stop and the matatu is late'), Partner B must accept and build on it.",
      "4. Draw a scenario card. In groups of three, you have 2 minutes to plan the basic who, where, and what of your scene. Do NOT script dialogue — only decide the situation and characters.",
      "5. Perform your improvised scene for the class (2-3 minutes). Stay in character, listen to your partners, and let the scene develop naturally.",
      "6. After each performance, the audience gives feedback using the 'Star and Wish' method: one thing that was excellent (star) and one suggestion for improvement (wish).",
      "7. Write a short reflection (100 words) on what you learned about improvisation and how it felt to perform without a script."
    ],
    backgroundInfo: "Improvisation is the art of creating performance spontaneously without a written script. While Western improvisation became popular through comedy traditions like Second City in Chicago, unscripted performance has ancient roots in African storytelling traditions. Kenyan communities have long practised improvisational storytelling where a narrator adapts a tale based on audience reactions, changes characters' voices, and incorporates current events. Luo 'Sigendni' (legends) are told with dramatic improvisation, while Kikuyu 'Ngano' (stories) often include call-and-response improvisation between the teller and audience. In drama education, improvisation develops crucial life skills beyond acting: creative thinking, active listening, teamwork, quick decision-making, and confidence in public speaking. Students learn to trust their instincts, support their peers, and find creative solutions in the moment. These skills transfer directly to classroom presentations, job interviews, conflict resolution, and social interactions.",
    expectedOutcome: "Students should participate actively in warm-up exercises and demonstrate understanding of the three improvisation rules. Each group should perform a coherent improvised scene of 2-3 minutes that shows clear characters, a recognisable setting, and a simple story arc. Students should demonstrate active listening to partners, building on others' ideas rather than blocking them, and the ability to stay in character. Written reflections should show understanding of what makes improvisation successful.",
    performanceCriteria: [
      "Active participation in warm-up and exercises",
      "Application of 'Yes, and...' principle — accepting and building on partners' ideas",
      "Character commitment — staying in character throughout the scene",
      "Active listening and responsive interaction with scene partners",
      "Stage presence — clear voice, physical expression, use of space"
    ],
    artMedium: "Improvised drama performance",
    inspirationNotes: "Think of the way market traders in Nairobi use dramatic voices and gestures to sell their goods — that is everyday improvisation! Listen to how Kenyan comedians like Churchill Show performers create humour by improvising with audience members. Traditional storytellers across Kenya — from the Maasai elders sharing legends around the fire to coastal Swahili poets — are master improvisers who read their audience and adapt their performance in real time. Your improvisation does not need to be funny; it can be serious, emotional, or mysterious. The key is to be present in the moment and respond truthfully.",
    relatedConcepts: [
      "Improvisation techniques",
      "Character development",
      "Active listening and communication",
      "Creative thinking",
      "African storytelling traditions"
    ]
  },

  {
    name: "Traditional Kenyan Dance Movements",
    activityType: "dance",
    grade: "Grade 7",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    aim: "To learn and perform basic traditional dance movements from at least two Kenyan communities, understanding the cultural significance and occasion for each dance.",
    materials: [
      "Open space for movement (hall or outdoor area)",
      "Audio player with speakers",
      "Recordings of traditional Kenyan music (Isukuti, Ohangla, Chakacha)",
      "Comfortable clothing and shoes (or bare feet where appropriate)",
      "Reference images or video clips of traditional dances",
      "Notebook for cultural notes"
    ],
    instructions: [
      "1. Begin with a physical warm-up: gentle stretching of arms, legs, and torso, followed by walking in rhythm to a steady drumbeat. Gradually increase the energy with jogging and light jumps.",
      "2. The teacher introduces the first dance tradition — Isukuti from the Luhya community. Learn the basic step: a strong, grounded stomp-step pattern with arms swinging in opposition. Practise in lines, following the teacher.",
      "3. Add the characteristic Isukuti movements: raised knees, energetic arm gestures, and the circular formation used in celebrations. Learn 8 counts of choreography.",
      "4. The teacher introduces the second dance tradition — Chakacha from the coastal Swahili community. Learn the basic step: a subtle hip movement with graceful arm gestures, contrasting with the energetic Isukuti.",
      "5. Practise the Chakacha movements: the gentle side-to-side sway, the hand movements that tell a story, and the footwork. Learn 8 counts of choreography.",
      "6. In groups of six, create a short performance (1 minute) that incorporates movements from both dances, with a clear transition between them. Add a formation change (e.g., line to circle).",
      "7. Perform for the class. After all performances, discuss: How did the two dances feel different? What do the movements tell us about each community's values and celebrations?"
    ],
    backgroundInfo: "Kenya is home to over 40 ethnic communities, each with distinct dance traditions that reflect their way of life, values, and celebrations. Isukuti is a vigorous, joyful dance from the Luhya community of western Kenya, traditionally performed during celebrations such as weddings, harvests, and circumcision ceremonies. The dance is accompanied by Isukuti drums and features energetic stamping, high kicks, and expressive arm movements that demonstrate strength and joy. In contrast, Chakacha is an elegant dance from the Swahili coastal communities, traditionally performed at weddings (particularly the 'kupamba' night). Chakacha features subtle hip movements, graceful hand gestures, and rhythmic footwork, reflecting the coastal culture's emphasis on beauty, storytelling through movement, and communal celebration. In the CBC curriculum, dance is valued not just as physical exercise but as a means of cultural preservation, creative expression, and community building. Through learning dances from different communities, students develop respect for Kenya's cultural diversity while building coordination, rhythm awareness, and performance confidence.",
    expectedOutcome: "Students should be able to perform basic movements from both Isukuti and Chakacha with reasonable accuracy and rhythm. Group performances should show a clear distinction between the two dance styles and a coherent transition. Students should be able to articulate the cultural context of each dance — when it is performed, by whom, and what it expresses. Movement should show energy appropriate to each style and awareness of rhythm.",
    performanceCriteria: [
      "Accurate reproduction of basic movements from both dance traditions",
      "Rhythm awareness — moving in time with the music",
      "Understanding of cultural context and significance of each dance",
      "Coordination and spatial awareness in group formation",
      "Energy and expression appropriate to each dance style"
    ],
    artMedium: "Traditional dance movement",
    inspirationNotes: "Watch videos of authentic Isukuti performances from Kakamega and Bungoma — notice how the dancers use the entire body with explosive energy, and how the drummers and dancers feed off each other's energy. For Chakacha, observe performances from Lamu and Mombasa weddings — notice the elegance, the storytelling through hand gestures, and how the dance brings the community together. Remember that every dance you learn connects you to generations of Kenyans who have expressed joy, love, grief, and celebration through movement. When you perform, you are keeping these traditions alive.",
    relatedConcepts: [
      "Traditional dance and cultural heritage",
      "Rhythm and movement coordination",
      "Cultural diversity in Kenya",
      "Physical expression and body awareness",
      "Community and celebration through dance"
    ]
  },

  // ═══════════════════════════════════════════════════
  // GRADE 8 — Creative Arts and Sports
  // ═══════════════════════════════════════════════════

  {
    name: "Batik Fabric Design with Kenyan Motifs",
    activityType: "visual_art",
    grade: "Grade 8",
    learningArea: "Creative Arts and Sports",
    strand: "Visual Arts",
    aim: "To create a batik fabric piece using wax-resist dyeing technique, incorporating traditional Kenyan patterns and motifs from various communities.",
    materials: [
      "White cotton fabric (30cm x 30cm per student)",
      "Melted paraffin wax or candle wax",
      "Tjanting tools or old paintbrushes for wax application",
      "Cold-water fabric dyes (at least 3 colours)",
      "Plastic buckets for dyeing",
      "Rubber gloves and aprons",
      "Newspaper for work surface protection",
      "Iron and brown paper for wax removal"
    ],
    instructions: [
      "1. Study examples of traditional Kenyan patterns: Maasai beadwork geometric patterns, Kikuyu shield designs, coastal Swahili carved door motifs, and Kamba basket-weaving patterns. Sketch your chosen design on paper first.",
      "2. Stretch your cotton fabric on a flat surface covered with newspaper. Using a pencil, lightly transfer your design onto the fabric.",
      "3. Heat the wax until liquid (teacher supervises). Using the tjanting tool or brush, carefully apply melted wax to the areas of your design that you want to remain the lightest colour. The wax resists the dye.",
      "4. Once the wax has cooled and hardened, dip the fabric into the lightest dye colour (e.g., yellow). Leave for 5-10 minutes, then remove and allow to dry.",
      "5. Apply more wax to areas you want to keep the first dye colour, then dip into the second dye colour (e.g., orange or red). Repeat the wax-and-dye process for the third colour.",
      "6. When all dyeing is complete and the fabric is dry, place it between sheets of brown paper and iron to melt and absorb the wax, revealing your completed batik design.",
      "7. Display your finished batik and write a brief artist's statement (50 words) explaining your design choices and the cultural inspiration behind your motifs."
    ],
    backgroundInfo: "Batik is a wax-resist dyeing technique with origins in Java, Indonesia, but variations of resist-dyeing have been practised across Africa for centuries. In East Africa, adire cloth from the Yoruba people of Nigeria and kanga designs from the Swahili coast share principles with batik. The technique involves applying wax to fabric before dyeing — wherever the wax is applied, the dye cannot penetrate, creating patterns through negative space. This makes batik a unique art form where planning and layering are essential, as you must think in reverse: protecting light areas before adding each colour layer. Kenya's rich visual culture provides endless inspiration for batik designs. The geometric patterns of Maasai beadwork, the interlocking shapes of Kamba basketry, the carved floral motifs of Lamu doors, and the symbolic designs on Kikuyu shields all translate beautifully into batik patterns. Contemporary Kenyan fashion designers increasingly incorporate traditional motifs into modern designs, and batik skills can lead to entrepreneurial opportunities in the growing African fashion industry.",
    expectedOutcome: "Students should produce a completed batik fabric piece that shows clear pattern definition with at least two distinct colour layers. The design should incorporate identifiable Kenyan cultural motifs applied with reasonable skill. The wax-resist technique should be evident with clean boundaries between dyed and resisted areas. An artist's statement should accompany the work.",
    performanceCriteria: [
      "Clear and intentional design incorporating Kenyan cultural motifs",
      "Effective use of wax-resist technique with clean colour separation",
      "At least two colour layers with planned colour relationships",
      "Technical skill in wax application and dye handling",
      "Written artist's statement explaining design inspiration"
    ],
    artMedium: "Batik (wax-resist dyeing on fabric)",
    inspirationNotes: "Visit the Maasai Market in Nairobi or look at images of traditional Kenyan crafts to find geometric patterns that inspire you. Notice how Maasai beadwork uses triangles, diamonds, and parallel lines in bold colours, while Kamba baskets use interlocking circular patterns. The carved wooden doors of Lamu Old Town feature intricate floral and geometric patterns influenced by centuries of Indian Ocean trade. Your batik can combine elements from different traditions to create something uniquely yours — this is how Kenyan art evolves, honouring tradition while embracing creativity.",
    relatedConcepts: [
      "Resist-dyeing techniques",
      "Traditional pattern and motif",
      "Colour theory and layering",
      "Cultural heritage in contemporary design",
      "Textile arts and craftsmanship"
    ]
  },

  {
    name: "Painting a Kenyan Landscape in Watercolour",
    activityType: "visual_art",
    grade: "Grade 8",
    learningArea: "Creative Arts and Sports",
    strand: "Visual Arts",
    aim: "To paint a Kenyan landscape using watercolour techniques including wet-on-wet, wet-on-dry, and colour mixing to represent the natural environment with atmospheric perspective.",
    materials: [
      "Watercolour paint set (at least 12 colours)",
      "Watercolour paper (A3, 200gsm or heavier)",
      "Round watercolour brushes (sizes 4, 8, 12)",
      "Two water containers (one clean, one for rinsing)",
      "Palette or white plate for mixing",
      "Masking tape to secure paper",
      "Pencil for light sketch",
      "Paper towels or cloth for blotting"
    ],
    instructions: [
      "1. Choose a Kenyan landscape to paint: savannah with acacia trees, Mount Kenya with surrounding farmland, the coast with palm trees and ocean, or the Rift Valley with lakes. Reference photographs may be used.",
      "2. Tape your watercolour paper to a board. Using a pencil, lightly sketch the basic composition: horizon line, major shapes (mountains, trees, buildings). Keep it simple — watercolour is about colour and light, not detail.",
      "3. Start with the sky using the wet-on-wet technique: wet the entire sky area with clean water, then drop in diluted blue and let it flow naturally. Add touches of orange or pink near the horizon for a warm Kenyan sky.",
      "4. While the sky dries, mix your background colours. For distant elements (far mountains, distant trees), use cooler, lighter colours — this creates atmospheric perspective, making things look far away.",
      "5. Paint the middle ground using slightly warmer and more saturated colours. For savannah grass, layer yellow ochre and green. For red earth, use burnt sienna and crimson.",
      "6. Paint the foreground with the most detail and strongest colours. Add trees, structures, or figures. Use the wet-on-dry technique for sharper edges and details.",
      "7. Add final details when the painting is mostly dry: tree branches, grass texture, shadows. Step back and assess — watercolour is about knowing when to stop. Sign your painting."
    ],
    backgroundInfo: "Watercolour painting is prized for its ability to capture light, atmosphere, and the transparent quality of natural landscapes. Kenya's diverse geography — from the snow-capped peak of Mount Kenya to the golden savannahs of the Maasai Mara, the turquoise waters of the Indian Ocean coast, and the dramatic escarpments of the Rift Valley — provides extraordinary subjects for landscape painting. The concept of atmospheric perspective, where distant objects appear lighter, bluer, and less detailed, is particularly evident in Kenya's vast landscapes where you can see for kilometres across the plains. Kenyan artists like Joy Adamson (famous for 'Born Free') documented Kenya's people and landscapes through detailed watercolours, while contemporary artists like Shine Tani use watercolour to capture Nairobi's urban landscapes. Watercolour teaches patience and planning because, unlike oil paint, mistakes are difficult to cover. Artists must work from light to dark and leave white areas unpainted for highlights.",
    expectedOutcome: "Students should produce a completed watercolour landscape that demonstrates at least two different watercolour techniques (wet-on-wet and wet-on-dry). The painting should show atmospheric perspective with lighter, cooler colours in the background and stronger, warmer colours in the foreground. Colour mixing should be evident with no colours used straight from the palette. The composition should be recognisably a Kenyan landscape.",
    performanceCriteria: [
      "Effective use of at least two watercolour techniques",
      "Atmospheric perspective demonstrated (light-to-dark, cool-to-warm from background to foreground)",
      "Successful colour mixing showing understanding of colour relationships",
      "Composition captures a recognisable Kenyan landscape",
      "Control of water-to-paint ratio and overall neatness"
    ],
    artMedium: "Watercolour on paper",
    inspirationNotes: "Look at photographs of Kenya's national parks at golden hour — the warm light of sunrise and sunset transforms the landscape into a painter's dream. Study how the sky at the Maasai Mara changes from deep blue overhead to orange and pink at the horizon. Notice how Mount Kenya's peak appears pale blue and hazy from Nairobi, but becomes sharp and detailed when you are close — this is the atmospheric perspective you will paint. Also look at the watercolour landscapes of J.M.W. Turner, whose dramatic skies and transparent light effects revolutionised landscape painting.",
    relatedConcepts: [
      "Watercolour painting techniques",
      "Atmospheric and linear perspective",
      "Colour theory and mixing",
      "Landscape composition",
      "Kenyan geography and natural environment"
    ]
  },

  {
    name: "Playing the Nyatiti: East African String Instrument",
    activityType: "music",
    grade: "Grade 8",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    aim: "To learn the basic playing technique and cultural significance of the nyatiti (Luo lyre), performing simple traditional melodies and understanding the instrument's role in Luo cultural heritage.",
    materials: [
      "Nyatiti instruments (or simplified classroom lyres if nyatiti unavailable)",
      "Tuning reference (audio recording or tuned instrument)",
      "Sheet with traditional melody notation (simplified tablature)",
      "Audio recordings of nyatiti masters (Ayub Ogada, Ochieng Kabaselleh)",
      "Cultural reference materials about Luo music traditions",
      "Notebook for cultural and musical notes"
    ],
    instructions: [
      "1. The teacher introduces the nyatiti: its history as the Luo people's most important traditional instrument, its construction (wooden body, leather soundboard, 5-8 gut or nylon strings), and its role in ceremonies, storytelling, and praise singing.",
      "2. Hold the instrument correctly: seated, the nyatiti rests against your chest with the soundboard facing outward. The right hand plucks the strings while the left hand dampens or alters pitch. A toe ring on the big toe taps a metal plate for rhythmic accompaniment.",
      "3. Learn to pluck individual strings cleanly, starting with the thumb on the lowest (bass) string and the index finger on higher strings. Practise producing clear, sustained tones.",
      "4. Learn a simple three-note pattern on the bass strings that forms the foundation (ostinato) of many nyatiti songs. Repeat until the pattern is automatic.",
      "5. Add the melodic pattern on the higher strings while maintaining the bass ostinato. This layered approach — bass pattern plus melody — is fundamental to nyatiti playing.",
      "6. Learn a simplified version of a traditional nyatiti song provided by the teacher. Focus on getting the basic melody and rhythm correct.",
      "7. Perform in pairs or small groups, with some students playing the bass pattern and others the melody, recreating the layered texture of traditional nyatiti music."
    ],
    backgroundInfo: "The nyatiti is an eight-stringed lyre and the most important traditional instrument of the Luo community of western Kenya. It has been played for centuries to accompany praise singing, storytelling, ceremonial occasions, and social gatherings. Traditionally, the nyatiti was played exclusively by men, often by specialist musicians called 'jathum' who were community historians and praise singers. The instrument produces a rich, resonant sound that combines plucked melody strings with a bass drone and rhythmic tapping. Master nyatiti players like the legendary Ogwang Lelo and contemporary artist Ayub Ogada (whose nyatiti playing was featured in the film 'The Constant Gardener') have demonstrated the instrument's extraordinary musical potential. The nyatiti is currently experiencing a cultural revival as young Kenyan musicians incorporate it into contemporary arrangements. Learning the nyatiti connects students to living musical heritage while developing skills in multi-layered musical thinking — playing melody, bass, and rhythm simultaneously — that are directly transferable to other instruments.",
    expectedOutcome: "Students should demonstrate basic nyatiti playing technique: correct holding position, clean string plucking, and the ability to maintain a simple bass ostinato pattern. They should perform a simplified traditional melody, either individually or in a group arrangement. Students should be able to explain the cultural significance of the nyatiti in Luo tradition and name at least one master nyatiti player.",
    performanceCriteria: [
      "Correct instrument holding and playing posture",
      "Clean tone production through proper plucking technique",
      "Ability to maintain a steady bass ostinato pattern",
      "Performance of the simplified melody with reasonable accuracy",
      "Demonstrated understanding of cultural significance"
    ],
    artMedium: "Nyatiti (Luo lyre)",
    inspirationNotes: "Listen to Ayub Ogada's album 'En Mana Kuoyo' which brought nyatiti music to international audiences. His song 'Kothbiro' (meaning 'Rain is Coming') demonstrates how a single nyatiti can create layers of bass, melody, and rhythm that fill an entire sonic space. Also listen to recordings of traditional nyatiti masters from Siaya and Homa Bay counties. Notice how the instrument accompanies the human voice — in Luo tradition, the nyatiti and voice are inseparable partners in musical storytelling.",
    relatedConcepts: [
      "Traditional African instruments",
      "Luo cultural heritage",
      "Ostinato and layered musical texture",
      "Music and oral tradition",
      "Cultural preservation through performance"
    ]
  },

  {
    name: "Choral Singing: Arranging a Kenyan Folk Song",
    activityType: "music",
    grade: "Grade 8",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    aim: "To learn a traditional Kenyan folk song and create a simple two-part choral arrangement with melody and harmony, developing ensemble singing skills and musical ear training.",
    materials: [
      "Printed lyrics and melody of a Kenyan folk song (e.g., 'Jambo Bwana', 'Malaika', or a traditional lullaby)",
      "Simple melody notation or sol-fa chart",
      "Piano or keyboard for pitch reference (optional)",
      "Audio recording of the original song",
      "Pencil for marking parts",
      "Open space for standing in sections"
    ],
    instructions: [
      "1. Listen to the recording of the folk song twice. First, just listen. Second, follow along with the lyrics and begin to identify the melody line — hum along softly.",
      "2. As a class, learn the melody by rote: the teacher sings each phrase and the class echoes it back. Work through the entire song phrase by phrase until the melody is secure.",
      "3. Divide the class into two groups: Group A (melody) and Group B (harmony). Group A continues singing the melody while the teacher teaches Group B a simple harmony part — either a third below the melody or a drone-style accompaniment on key notes.",
      "4. In your sections, practise your part until you can sing it confidently without the teacher leading. Focus on pitch accuracy, staying in your part, and blending your voice with your section.",
      "5. Bring both groups together. Start slowly — Group A sings the melody, then Group B joins with the harmony. Listen across the room to the other group and adjust your volume to blend.",
      "6. Add dynamics: practise singing some verses softly (piano) and the chorus strongly (forte). Add a gradual crescendo at the climax of the song.",
      "7. Perform the complete two-part arrangement for the class or school assembly. Stand in a semicircle with the two groups interspersed for better sound blending."
    ],
    backgroundInfo: "Choral singing has deep roots in Kenyan culture. Community singing is central to celebrations, worship, work songs, and storytelling across Kenya's diverse ethnic groups. The call-and-response singing of Luo fishing songs, the harmonised choral traditions of Kikuyu and Luhya communities, and the polyphonic singing of the Mijikenda people along the coast all demonstrate sophisticated vocal traditions that predate formal music education. Kenya's music festival tradition, established during the colonial era and continuing through the Kenya Music Festivals held annually, has fostered a strong competitive choral culture that produces ensembles of international standard. Schools like the Nairobi School Choir, Starehe Boys Centre, and Alliance Girls High School are renowned for their choral excellence. Learning to sing in harmony develops crucial musical skills: ear training (the ability to hear and match pitches), blend (adjusting your voice to complement others), balance (between sections), and ensemble awareness.",
    expectedOutcome: "The class should perform a recognisable two-part choral arrangement of a Kenyan folk song with the melody and harmony parts clearly distinguished. Students should demonstrate the ability to stay in their part while hearing the other part. The performance should show dynamic variation (louder and softer sections) and reasonable pitch accuracy. Students should be able to sing their part independently when sections are separated.",
    performanceCriteria: [
      "Pitch accuracy — singing notes correctly in your assigned part",
      "Ability to maintain your part while the other section sings harmony",
      "Vocal blend — matching volume and tone with your section",
      "Dynamic variation — contrast between loud and soft sections",
      "Clear diction and expression of the song's meaning"
    ],
    artMedium: "Choral voice (two-part harmony)",
    inspirationNotes: "Listen to recordings of the Muungano National Choir of Kenya, one of Africa's most acclaimed choral groups, and notice how multiple voices create rich harmonies that are greater than any single voice. The song 'Malaika' (Angel), originally composed by Fadhili William in the 1960s, has been arranged in hundreds of choral versions worldwide — from simple two-part arrangements to complex orchestral settings. Your arrangement is part of this living tradition of taking a beautiful melody and making it richer through shared voices.",
    relatedConcepts: [
      "Choral singing and harmony",
      "Kenyan folk music traditions",
      "Ear training and pitch matching",
      "Ensemble awareness and balance",
      "Musical dynamics and expression"
    ]
  },

  {
    name: "Readers' Theatre: Performing a Kenyan Folk Tale",
    activityType: "drama",
    grade: "Grade 8",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    aim: "To adapt a traditional Kenyan folk tale into a Readers' Theatre script and perform it using vocal expression, minimal movement, and creative staging to bring the story to life.",
    materials: [
      "Collection of Kenyan folk tales (printed)",
      "A4 paper and pens for script writing",
      "Folders or clipboards for holding scripts during performance",
      "Simple costume elements: scarves, hats, or fabric for character distinction",
      "Chairs or stools for staged reading",
      "Audio recorder (optional, for playback and review)"
    ],
    instructions: [
      "1. In groups of five, select a Kenyan folk tale from the collection provided. Popular choices include 'The Hare and the Hyena' (Kikuyu), 'Why the Sun and Moon Live in the Sky' (general East African), or 'The Lost Spear' (Maasai).",
      "2. Read the story aloud as a group. Identify the characters (including a narrator), the key scenes, and the dialogue. Discuss the moral or lesson of the story.",
      "3. Adapt the story into a Readers' Theatre script: assign roles (narrator plus characters), write dialogue for each character, and add stage directions for vocal changes and minimal gestures. The narrator describes settings and actions.",
      "4. Assign roles within your group. Each person should have a substantial speaking part. Practise reading your part with expression — vary your voice for different emotions, use pauses for dramatic effect.",
      "5. Stage your performance: arrange chairs or stools in a line or semicircle facing the audience. Scripts are held in folders. When your character speaks, step slightly forward or stand; when not speaking, freeze in position.",
      "6. Rehearse the full performance twice, focusing on timing, vocal expression, and the transitions between characters. Ensure the narrator's descriptions are vivid and engaging.",
      "7. Perform for the class. After each group performs, the audience discusses: What was the folk tale's message? How did the performance bring it to life?"
    ],
    backgroundInfo: "Readers' Theatre is a performance form where actors read from scripts rather than memorising lines, focusing audience attention on vocal expression, characterisation through voice, and the power of language. This form is perfectly suited to bringing oral traditions to life in the classroom. Kenya has an extraordinarily rich oral literature tradition. Every community has folk tales (ngano, sigendni, hadithi) that were passed down through generations by skilled storytellers who used voice, gesture, and audience interaction to make stories vivid and memorable. These tales often feature clever animals (hare, tortoise), teach moral lessons, explain natural phenomena, or record community history. Adapting these tales for Readers' Theatre serves a dual purpose: it develops dramatic and literacy skills while preserving and celebrating indigenous knowledge. The process of turning a narrative into a script teaches students about dialogue, character voice, dramatic structure, and the difference between showing and telling — skills valuable in both creative writing and performance.",
    expectedOutcome: "Each group should produce a written Readers' Theatre script adapted from their chosen folk tale, with clearly assigned character roles, narrator descriptions, and stage directions. The performance should demonstrate effective vocal characterisation (each character sounds different), dramatic pacing, and engagement with the audience. The folk tale's moral or message should be clearly communicated through the performance.",
    performanceCriteria: [
      "Quality of script adaptation — clear dialogue, effective narration, stage directions",
      "Vocal characterisation — distinct, expressive voices for each character",
      "Dramatic pacing — use of pauses, tempo changes, and building of tension",
      "Teamwork and coordination — smooth transitions, listening to cues",
      "Communication of the folk tale's moral or message"
    ],
    artMedium: "Readers' Theatre (dramatic reading)",
    inspirationNotes: "Think of the great storytellers in your own family and community — the grandmothers and grandfathers who can hold a room spellbound with just their voice and a few gestures. That is the art you are practising. Read collections of Kenyan folk tales by authors like Grace Ogot, Ngugi wa Thiong'o, and Asenath Bole Odaga. Notice how these writers capture the rhythms and patterns of oral storytelling in written form. Your Readers' Theatre performance bridges the oral and written traditions, using script and voice to honour stories that have been told around fires for generations.",
    relatedConcepts: [
      "Readers' Theatre and dramatic reading",
      "Oral literature and storytelling",
      "Script adaptation and dramatic writing",
      "Vocal expression and characterisation",
      "Kenyan folk tales and cultural preservation"
    ]
  },

  {
    name: "Contemporary Dance: Telling a Story Through Movement",
    activityType: "dance",
    grade: "Grade 8",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    aim: "To create and perform a short contemporary dance piece that tells a story or expresses a theme, combining traditional Kenyan dance elements with contemporary movement vocabulary.",
    materials: [
      "Open performance space (hall or outdoor area)",
      "Audio player and speakers",
      "Selection of music tracks (both traditional and contemporary Kenyan music)",
      "Comfortable clothing allowing free movement",
      "Notebook for choreography planning",
      "Video recording device (optional, for review)"
    ],
    instructions: [
      "1. Warm up with a movement exploration exercise: the teacher calls out different qualities of movement — 'sharp', 'flowing', 'heavy', 'light', 'fast', 'slow' — and students explore each quality freely in the space.",
      "2. The teacher introduces three contemporary dance concepts: (a) levels — moving high, medium, and low; (b) pathways — the patterns you trace on the floor (straight, curved, zigzag); (c) dynamics — the energy quality of movement (sustained, percussive, swing, collapse).",
      "3. Choose a theme for your dance piece from the following: 'Journey' (migration, travelling, homecoming), 'Nature' (seasons, animals, weather), or 'Community' (celebration, conflict and resolution, unity).",
      "4. In groups of four, create a 1-2 minute dance piece on your chosen theme. Your choreography must include: at least two level changes, one formation change, a moment of unison (all dancing together), and a moment of individual expression (solo within the group).",
      "5. Incorporate at least one movement element from a traditional Kenyan dance (a Maasai jump, an Isukuti stomp, a Chakacha hip sway, or a Giriama shoulder shake) — blend it into your contemporary movement.",
      "6. Rehearse your piece with chosen music. Focus on transitions between sections, timing with the music, and the overall story arc (beginning, middle, end).",
      "7. Perform for the class. After each performance, the audience discusses what story or theme they perceived and what movements were most effective."
    ],
    backgroundInfo: "Contemporary dance is a broad genre that draws from multiple traditions — ballet, modern dance, jazz, and cultural dance forms — to create expressive movement that is relevant to today's world. In Kenya, contemporary dance is a growing art form, with companies like the Kunja Dance Company, Dance Centre Kenya, and the late Opiyo Okach's company Gàara pushing boundaries by fusing African movement vocabularies with global contemporary techniques. The beauty of contemporary dance is that it values individual expression and storytelling through the body. Unlike highly codified dance forms, contemporary dance encourages dancers to find their own movement language. For Kenyan students, this means drawing on the rich physical vocabularies of their cultural dances and combining them with new ideas about space, time, and energy. The result is dance that is both rooted in identity and open to innovation. Creating dance as a group also develops crucial collaborative skills: negotiation, compromise, shared creative vision, and trust.",
    expectedOutcome: "Each group should perform a coherent 1-2 minute dance piece that communicates a clear theme through movement. The choreography should demonstrate use of levels, pathways, and dynamics, include at least one traditional Kenyan dance element blended with contemporary movement, and show both unison and individual expression. The piece should have a clear structure with a beginning, development, and ending.",
    performanceCriteria: [
      "Clear communication of theme through movement choices",
      "Use of levels, pathways, and dynamics in choreography",
      "Integration of at least one traditional Kenyan dance element",
      "Group coordination — clean unison sections and smooth transitions",
      "Performance quality — confidence, energy, and commitment to movement"
    ],
    artMedium: "Contemporary dance with traditional elements",
    inspirationNotes: "Watch performances by Kenyan contemporary dance artists like the Kunja Dance Company and the work of choreographer Opiyo Okach, who created powerful pieces combining traditional Luo movement with contemporary choreography. Notice how professional contemporary dancers use their whole body — not just legs and arms but the spine, the head, the breath. Think about what movements from your own cultural background feel natural and powerful. The best contemporary dance comes from honesty — moving in a way that is true to what you feel, not trying to imitate what you have seen on television.",
    relatedConcepts: [
      "Contemporary dance principles",
      "Choreography and composition",
      "Fusion of traditional and contemporary styles",
      "Physical expression and storytelling",
      "Collaborative creative process"
    ]
  },

  // ═══════════════════════════════════════════════════
  // GRADE 9 — Creative Arts and Sports
  // ═══════════════════════════════════════════════════

  {
    name: "Printmaking: Lino Cut Prints of Kenyan Wildlife",
    activityType: "visual_art",
    grade: "Grade 9",
    learningArea: "Creative Arts and Sports",
    strand: "Visual Arts",
    aim: "To design and produce a lino cut print depicting Kenyan wildlife, learning the printmaking process from design through carving to pulling multiple prints.",
    materials: [
      "Lino blocks or soft-cut printing blocks (15cm x 15cm)",
      "Lino cutting tools (V-gouge, U-gouge, knife)",
      "Block printing ink (water-based, black and one colour)",
      "Brayer (ink roller)",
      "Printing paper (thin, smooth cartridge or newsprint)",
      "Pencil, tracing paper, and carbon paper",
      "Wooden spoon or baren for burnishing",
      "Inking plate (glass or smooth tile)"
    ],
    instructions: [
      "1. Choose a Kenyan wildlife subject: an elephant, lion, giraffe, rhino, or bird species. Collect reference images and create a detailed pencil drawing at the same size as your lino block.",
      "2. Simplify your drawing into bold areas of black (printed) and white (carved away). Remember that printmaking works in reverse — areas you carve away will not print. Transfer your design to the lino block using tracing and carbon paper.",
      "3. Using the V-gouge for fine lines and the U-gouge for larger areas, carefully carve away the white (non-printing) areas. Always cut away from your fingers. Carve the background first, then work towards the details of your subject.",
      "4. Roll a thin, even layer of black ink onto the inking plate using the brayer. Roll ink evenly onto your carved block until the surface is coated but not flooded.",
      "5. Place a sheet of printing paper carefully on top of the inked block. Using the wooden spoon, firmly and evenly rub the back of the paper, pressing it into the inked surface. This is called 'pulling a print'.",
      "6. Carefully peel the paper from one corner to reveal your print. Evaluate: are there areas that need more carving or better inking? Make adjustments and pull a second print.",
      "7. Pull an edition of at least three prints. Sign each print in pencil below the image with the edition number (e.g., 1/3), the title, and your name. Allow prints to dry flat."
    ],
    backgroundInfo: "Printmaking is the art of creating images by transferring ink from a prepared surface onto paper. Lino cutting (linocut) is a relief printing technique where the artist carves into a linoleum block, leaving raised areas that receive ink. The technique was popularised in the early 20th century and was embraced by many African artists because of its bold graphic quality and the ability to produce multiple copies of an image. In Kenya, printmaking has been developed by artists at the Kuona Trust and the Nairobi National Museum art studios. The medium is particularly suited to depicting Kenya's extraordinary wildlife because the bold black-and-white contrast captures the dramatic silhouettes and patterns of African animals — the spots of a leopard, the stripes of a zebra, the textured skin of an elephant. Kenya's wildlife is not only a source of artistic inspiration but a national treasure and major economic asset through tourism. Depicting wildlife through art raises awareness about conservation and the need to protect endangered species like the black rhino and Grevy's zebra.",
    expectedOutcome: "Students should produce an edition of at least three clean prints from a well-carved lino block. The design should show a recognisable Kenyan wildlife subject with clear contrast between inked and carved areas. Prints should be evenly inked without smudges or blank spots. The edition should be properly signed and numbered following printmaking conventions.",
    performanceCriteria: [
      "Effective design simplification — clear areas of black and white",
      "Clean and controlled carving technique",
      "Even inking and clean print pulling (no smudges or blank areas)",
      "Recognisable wildlife subject with artistic quality",
      "Proper editioning — at least 3 prints, signed and numbered"
    ],
    artMedium: "Linocut relief print",
    inspirationNotes: "Study the powerful wildlife linocuts of South African artist John Muafangejo, whose bold black-and-white prints tell stories of African life. Look at the animal sculptures at the Nairobi National Museum for reference on form and posture. When simplifying your animal for printing, focus on the most distinctive features — what makes a giraffe instantly recognisable even as a silhouette? The long neck and spotted pattern. What defines an elephant? The ears, trunk, and massive body. Great printmaking captures the essence of a subject with economy of detail.",
    relatedConcepts: [
      "Relief printmaking techniques",
      "Design simplification and positive/negative space",
      "Wildlife art and conservation awareness",
      "Editioning and print documentation",
      "African printmaking traditions"
    ]
  },

  {
    name: "Pottery: Coil-Built Vessels Inspired by Traditional Kenyan Forms",
    activityType: "visual_art",
    grade: "Grade 9",
    learningArea: "Creative Arts and Sports",
    strand: "Visual Arts",
    aim: "To create a coil-built clay vessel inspired by traditional Kenyan pottery forms, applying surface decoration techniques and understanding the cultural role of pottery in Kenyan communities.",
    materials: [
      "Clay (earthenware or air-dry clay, approximately 1kg per student)",
      "Clay modelling tools (wooden knife, loop tool, scoring tool)",
      "Small container of water and sponge",
      "Rolling pin or smooth bottle",
      "Turntable or rotating platform (optional)",
      "Reference images of traditional Kenyan pottery",
      "Newspaper to protect work surface",
      "Plastic bag to keep unfinished work moist"
    ],
    instructions: [
      "1. Study examples of traditional Kenyan pottery: Luo cooking pots (agulu), Kamba water vessels, Maasai calabash forms, and the decorated pots of the Tugen and Pokot peoples. Discuss the function, form, and decoration of each.",
      "2. Roll out a circular clay base approximately 8cm in diameter and 1cm thick. Score the edges where coils will be attached.",
      "3. Roll even coils of clay (about 1.5cm in diameter) on a smooth surface. Place the first coil around the edge of the base, scoring and applying slip (watery clay) to join. Smooth the inside join with your finger.",
      "4. Continue building coils, one on top of another, gradually shaping your vessel. To widen the form, place coils slightly to the outside. To narrow it (for a neck), place coils slightly to the inside. Smooth the inside of each join.",
      "5. When your vessel reaches the desired height (at least 15cm), create a rim by smoothing the final coil carefully. You may choose to leave the outside coils visible for texture or smooth them for a clean surface.",
      "6. Apply surface decoration using techniques observed in traditional pottery: incised lines using a stick, impressed patterns using a comb or textured object, or applied clay elements (small coils, balls, or shapes).",
      "7. Allow your vessel to dry slowly (cover loosely with plastic overnight). Once leather-hard, refine the surface and add any final details. If kiln firing is available, the teacher will coordinate; otherwise, air-dry clay will harden at room temperature."
    ],
    backgroundInfo: "Pottery is one of the oldest art forms in Kenya, with archaeological evidence of ceramic vessels dating back thousands of years. Traditional pottery production is still practised in many Kenyan communities, with techniques passed down through generations, often by women who hold specialised knowledge. The Luo community produces distinctive cooking pots (agulu) with rounded bases designed for cooking over open fires. Kamba potters create elegant water vessels with narrow necks to keep water cool. The Tugen and Pokot peoples decorate their pots with intricate geometric patterns that carry symbolic meaning. In many communities, the potter held a respected position, and the pottery-making process was accompanied by rituals and songs. The coil-building technique used in this activity is the most common traditional method worldwide and in Kenya — it does not require a potter's wheel and allows for vessels of any shape and size. Understanding pottery connects students to material culture, sustainability (clay is a natural, renewable resource), and the mathematics of three-dimensional form.",
    expectedOutcome: "Students should produce a coil-built vessel of at least 15cm height with a stable base, consistent wall thickness, and secure joins between coils. The vessel should show intentional form — either inspired by a specific traditional Kenyan pottery style or a personal design. Surface decoration should be applied using at least one traditional technique. Students should demonstrate understanding of why specific forms were used for different functions.",
    performanceCriteria: [
      "Sound construction — stable base, even walls, secure coil joins",
      "Intentional form inspired by traditional Kenyan pottery",
      "Surface decoration using at least one appropriate technique",
      "Craftsmanship — neatness, consistency, and care in execution",
      "Understanding of cultural significance and functional design"
    ],
    artMedium: "Coil-built clay (earthenware or air-dry)",
    inspirationNotes: "Visit a local market and look at traditional clay pots — hold them, feel their weight and texture, notice the subtle variations that show they are handmade. In the Kenya National Museum in Nairobi, the ethnographic collection displays pottery from across Kenya's communities. Notice how form follows function: wide-mouthed pots for cooking, narrow-necked vessels for water storage, flat-bottomed pots for urban use versus rounded bottoms for cooking over fires. Your vessel can honour these traditional forms while adding your personal creative touch through decoration and proportion.",
    relatedConcepts: [
      "Ceramic construction techniques",
      "Traditional Kenyan pottery and material culture",
      "Form and function in design",
      "Surface decoration and pattern",
      "Three-dimensional art and sculptural thinking"
    ]
  },

  {
    name: "Choral Arrangement of a Kenyan Folk Song in Three Parts",
    activityType: "music",
    grade: "Grade 9",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    aim: "To arrange and perform a traditional Kenyan folk song in three-part harmony (soprano, alto, bass/low voices), developing advanced choral skills and understanding of harmonic structure.",
    materials: [
      "Printed lyrics and melody of a Kenyan folk song",
      "Music notation paper",
      "Keyboard or pitch pipe for reference",
      "Audio recording of professional choral arrangements (e.g., Muungano Choir)",
      "Pencil and eraser",
      "Conductor's stand (music stand)"
    ],
    instructions: [
      "1. Listen to the selected folk song and its professional choral arrangement. Identify the melody line (soprano), the harmony parts, and how the bass line moves. Discuss what makes the arrangement effective.",
      "2. As a class, learn the melody thoroughly until everyone can sing it from memory with correct pitch and rhythm.",
      "3. Divide the class into three voice groups based on vocal range: high voices (soprano), middle voices (alto), and low voices (bass). Each group learns their part separately with the teacher's guidance.",
      "4. The alto part typically sings a third below the melody or follows a parallel melodic contour. The bass part provides harmonic foundation, often singing root notes of the implied chords.",
      "5. Bring all three parts together gradually: first soprano and alto, then add bass. Sing slowly, listening carefully across sections. The teacher conducts, cueing entries and adjusting balance.",
      "6. Refine the arrangement: add an introduction (humming or a bass drone), dynamic contrasts between verses, and a building finale. Assign a student conductor to lead rehearsals.",
      "7. Perform the complete three-part arrangement. Record the performance for review and self-assessment."
    ],
    backgroundInfo: "Three-part choral singing represents a significant step in musical sophistication, requiring each singer to maintain an independent melodic line while listening and blending with two other parts. This skill has deep roots in Kenyan musical culture — many traditional songs naturally incorporate multiple voice parts, with community members spontaneously adding harmonies. The Kenya Music Festivals, held annually since the colonial era, have cultivated an exceptionally strong choral tradition. Kenyan school choirs regularly achieve world-class standards, with institutions like Alliance Girls, Starehe Boys, and Moi Girls competing in international choral competitions. The process of arranging a folk song for three voices teaches harmonic thinking — how notes combine to create chords and how chords progress to create musical tension and resolution. It also develops the critical musical skill of singing one part while hearing others, which requires both musical independence and acute listening.",
    expectedOutcome: "The class should perform a three-part choral arrangement that demonstrates clear voice separation with each part maintaining its independent line. The harmony should be recognisably consonant (notes sound good together) with at least three distinct harmonic moments. Dynamic variation should enhance the musical expression. The student conductor should demonstrate basic conducting gestures.",
    performanceCriteria: [
      "Three distinct, independent vocal parts maintained throughout",
      "Harmonic accuracy — parts sound consonant when combined",
      "Dynamic contrast and musical expression",
      "Ensemble blend and balance between sections",
      "Effective conducting by the student conductor"
    ],
    artMedium: "Three-part choral voice",
    inspirationNotes: "Listen to the Muungano National Choir's recordings — their arrangements of Kenyan folk songs demonstrate how simple melodies can be transformed into rich choral works through harmony and creative arrangement. Pay attention to how the bass voice provides the harmonic foundation (like the roots of a tree), the alto fills out the middle (like the trunk), and the soprano carries the melody (like the branches reaching upward). Together, the three parts create something far more beautiful than any single voice alone.",
    relatedConcepts: [
      "Three-part choral harmony",
      "Choral arrangement techniques",
      "Harmonic structure and chord progression",
      "Vocal range and part singing",
      "Kenya Music Festival choral tradition"
    ]
  },

  {
    name: "Devised Theatre: Creating Original Drama on Social Issues",
    activityType: "drama",
    grade: "Grade 9",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    aim: "To create an original short play (devised theatre) addressing a social issue relevant to Kenyan youth, developing skills in collaborative playwriting, directing, and ensemble performance.",
    materials: [
      "Performance space (classroom or hall)",
      "Notebooks and pens for script development",
      "Basic props and costume elements",
      "Chairs, tables for set pieces",
      "Timer for scene length management",
      "Evaluation rubric for peer assessment"
    ],
    instructions: [
      "1. As a class, brainstorm social issues affecting Kenyan youth: cyberbullying, peer pressure, environmental conservation, gender equality, substance abuse, or exam pressure. In groups of five, choose one issue.",
      "2. Research your chosen issue through group discussion: What are the causes? Who is affected? What are possible solutions? Create a mind map of ideas.",
      "3. Develop characters who represent different perspectives on the issue. Each group member takes one character. Write a brief character profile: name, age, personality, relationship to the issue.",
      "4. Create a plot structure with a beginning (introduce characters and situation), middle (conflict develops and reaches a crisis point), and end (resolution or reflection). Write a scene outline — not a full script, but key moments and dialogue ideas.",
      "5. Rehearse through improvisation: act out each scene using your outline, discovering the best dialogue and staging through experimentation. Capture the best lines and refine them.",
      "6. Polish the performance: assign a director from your group to give feedback on staging, blocking (where actors move and stand), and pacing. Run the full piece at least twice.",
      "7. Perform your 5-7 minute devised play for the class. After each performance, conduct a brief audience talkback: What message did you receive? Which moment was most powerful? What would you change?"
    ],
    backgroundInfo: "Devised theatre is a collaborative method of creating plays where the script is generated by the ensemble rather than written by a single playwright. This approach has strong roots in African theatrical traditions, where community performance has always been collective and responsive to social context. In Kenya, theatre has long been a tool for social commentary and change. Ngugi wa Thiong'o and Ngugi wa Mirii created 'Ngaahika Ndeenda' (I Will Marry When I Want) with community members at Kamiriithu in 1977, using devised theatre to address social inequality. Today, Kenyan theatre companies like the Kenya National Theatre, Heartstrings Kenya, and Phoenix Players continue this tradition of using drama to address contemporary issues. Devised theatre empowers students because they create from their own experiences and perspectives, making the work authentic and personally meaningful. The process develops not just performance skills but critical thinking, empathy, teamwork, and the courage to speak about issues that matter.",
    expectedOutcome: "Each group should perform a coherent 5-7 minute devised play with clear characters, a discernible plot structure, and an identifiable social message. The play should demonstrate understanding of the chosen social issue from multiple perspectives. Performances should show intentional staging, audible and expressive dialogue, and ensemble coordination. The audience talkback should confirm that the intended message was communicated.",
    performanceCriteria: [
      "Clear and thoughtful engagement with the chosen social issue",
      "Well-developed characters representing different perspectives",
      "Coherent dramatic structure (beginning, middle, end)",
      "Effective staging, blocking, and use of performance space",
      "Collaborative process — evidence that all group members contributed"
    ],
    artMedium: "Devised theatre (original ensemble drama)",
    inspirationNotes: "Read about or watch clips from Ngugi wa Thiong'o's community theatre work at Kamiriithu, which proved that ordinary people can create powerful theatre about issues that affect their lives. Look at how Kenyan TV dramas like 'Machachari' and 'Tujuane' address social issues through relatable characters and situations. Your devised play does not need to provide perfect answers — the best social theatre asks questions and makes the audience think. As the playwright August Wilson said, 'The purpose of theatre is to hold a mirror up to society.'",
    relatedConcepts: [
      "Devised theatre and collaborative creation",
      "Theatre for social change",
      "Character development and dramatic structure",
      "Directing and staging fundamentals",
      "Kenyan theatre history and practice"
    ]
  },

  {
    name: "Afro-Contemporary Fusion: Creating a Dance Piece",
    activityType: "dance",
    grade: "Grade 9",
    learningArea: "Creative Arts and Sports",
    strand: "Performing Arts",
    aim: "To choreograph and perform a group dance piece that fuses traditional African dance elements with contemporary and urban dance styles, exploring cultural identity through movement.",
    materials: [
      "Open performance space",
      "Audio player with speakers",
      "Selection of Afro-fusion music tracks (Sauti Sol, Nyashinski, Burna Boy, or similar)",
      "Comfortable dance clothing",
      "Choreography notation sheet",
      "Video recording device for review"
    ],
    instructions: [
      "1. Warm up with a combination sequence that includes traditional dance movements (grounded stomps, polyrhythmic hip isolations) and contemporary movements (floor work, release technique, extensions).",
      "2. The teacher demonstrates the concept of fusion: performing the same 8-count phrase first in a purely traditional style, then in a contemporary style, then as a fusion of both. Students identify what elements come from each tradition.",
      "3. In groups of six, select a piece of Afro-fusion music. Listen to it three times, identifying the traditional elements (drumming, call-and-response) and the modern elements (electronic beats, bass lines).",
      "4. Choreograph a 2-3 minute piece in which at least 30% of movements draw from traditional Kenyan or African dance vocabularies and 30% from contemporary or urban dance styles. The remaining 40% should be your original fusion — movements that blend both traditions seamlessly.",
      "5. Structure your piece with an opening formation, at least two different sections with contrasting energy, a featured moment (solo, duet, or small group), and a unison finale.",
      "6. Rehearse with attention to synchronisation, spatial patterns, energy dynamics, and the seamless transitions between traditional and contemporary sections.",
      "7. Perform for the class. Record the performance for self-review. Discuss as a class: How does fusion dance express modern African identity?"
    ],
    backgroundInfo: "Afro-contemporary dance fusion is one of the most exciting developments in global dance, and Kenyan dancers are at the forefront. The concept emerges from the reality that young Kenyans live in a world where traditional cultural practices coexist with global urban culture — a student might attend a traditional ceremony on Saturday and a dance class influenced by hip-hop on Sunday. Rather than seeing these as contradictions, Afro-fusion embraces both as authentic expressions of contemporary African identity. Kenyan dance crews like Dance 411, MDC Company, and H_Art Dancers have gained international recognition by fusing Kenyan traditional movements with hip-hop, contemporary, and Afrobeats choreography. Internationally, choreographers like Serge Aimé Coulibaly (Burkina Faso) and Gregory Maqoma (South Africa) have created acclaimed works that place African movement traditions in dialogue with global contemporary dance. For students, creating fusion choreography is an exercise in identity negotiation — deciding which elements of tradition to honour and how to make them relevant to contemporary expression.",
    expectedOutcome: "Each group should perform a 2-3 minute dance piece that clearly demonstrates fusion of traditional and contemporary elements. The choreography should be well-structured with distinct sections, include at least one featured moment, and conclude with unison movement. Transitions between styles should be smooth rather than abrupt. The piece should demonstrate musicality — movement that responds to the music's rhythm and energy.",
    performanceCriteria: [
      "Clear and authentic integration of traditional African and contemporary dance elements",
      "Well-structured choreography with distinct sections and transitions",
      "Musicality — movement matches the rhythm, dynamics, and mood of the music",
      "Group synchronisation and spatial awareness",
      "Performance quality — energy, confidence, and artistic expression"
    ],
    artMedium: "Afro-contemporary fusion dance",
    inspirationNotes: "Watch videos of Just A Band, Sauti Sol, and Elani music videos — many feature choreography that naturally fuses traditional Kenyan movements with contemporary urban dance. Look at how Beyoncé's 'Spirit' (from The Lion King) features South African and East African dance elements fused with contemporary choreography. Notice that the most powerful fusion happens when traditional movements are not treated as costume or novelty but as equal partners in the creative conversation. Your body already knows multiple dance vocabularies — let them speak to each other.",
    relatedConcepts: [
      "Dance fusion and cultural identity",
      "Choreographic structure and composition",
      "Traditional and contemporary movement vocabularies",
      "Musicality and rhythmic interpretation",
      "African contemporary dance movement"
    ]
  },

  // ═══════════════════════════════════════════════════
  // GRADE 10 — Fine Arts / Music and Dance / Theatre and Film
  // ═══════════════════════════════════════════════════

  {
    name: "Observational Drawing: Human Figure Study",
    activityType: "visual_art",
    grade: "Grade 10",
    learningArea: "Fine Arts",
    strand: "Drawing and Painting",
    aim: "To draw the human figure from observation using proportion, gesture, and tonal rendering, developing skills in capturing the human form with accuracy and artistic expression.",
    materials: [
      "Drawing pencils (HB, 2B, 4B, 6B)",
      "A3 or A2 drawing paper",
      "Charcoal sticks and compressed charcoal (optional)",
      "Kneaded eraser and standard eraser",
      "Drawing board or firm surface",
      "Fixative spray (for charcoal, teacher use only)",
      "Timer for gesture drawing exercises"
    ],
    instructions: [
      "1. Begin with gesture drawing: a volunteer model strikes simple standing poses. Draw the entire figure in 30 seconds, capturing the overall movement and energy — not details. Use flowing lines. Complete 6-8 gesture drawings.",
      "2. Learn the proportional system for the human figure: the body is approximately 7.5 heads tall; shoulders are roughly 2 head-widths across; the halfway point is at the hips. Sketch a proportional diagram as reference.",
      "3. The model holds a sustained pose (15-20 minutes). Begin with a light gesture line capturing the overall pose and weight distribution. Mark the head size and use it to establish proportional landmarks down the figure.",
      "4. Build the figure's volume using simple geometric forms: cylinder for the torso and limbs, sphere for the head, wedge for the feet. Focus on getting the proportions and angles correct before adding detail.",
      "5. Observe and render the light and shadow on the figure. Identify the light source and shade accordingly, using a range of pencil grades from HB (light tones) to 6B (darkest shadows).",
      "6. Add clothing folds, facial features, and hands — these are the most challenging but also the most expressive parts of figure drawing. Observe carefully rather than drawing from memory.",
      "7. Step back and evaluate your drawing. Make final adjustments to proportion, tone, and detail. Add the background environment if time allows."
    ],
    backgroundInfo: "Drawing the human figure is considered the ultimate test of an artist's observational and technical skills. From the ancient cave paintings of Africa to the Renaissance masters of Europe, humans have always been compelled to depict the human form. In the Kenyan context, figurative art has a rich tradition — from the rock art at Hyrax Hill near Nakuru to the vigorous figure paintings of contemporary Kenyan artists like Patrick Mukabi and Richard Kimathi. Learning to draw the figure develops critical skills that apply to all visual arts: proportion, balance, rhythm, light and shadow, and the ability to see and represent complex three-dimensional forms on a two-dimensional surface. Figure drawing also develops empathy — spending time carefully observing another person's form teaches us to see the humanity and individuality in every body. The discipline of sustained observation is valuable far beyond art, training the eye and mind to notice detail, proportion, and relationship.",
    expectedOutcome: "Students should produce a portfolio of gesture drawings (6-8) and at least one sustained figure drawing showing correct proportions, tonal rendering, and attention to the pose's gesture and weight distribution. The sustained drawing should demonstrate a range of tonal values and show understanding of how light defines form. Proportions should be approximately accurate with no major distortions.",
    performanceCriteria: [
      "Proportional accuracy — figure proportions are approximately correct",
      "Effective gesture capture — the pose's energy and weight are conveyed",
      "Tonal range — use of light, mid-tone, and dark values to define form",
      "Quality of observation — details drawn from looking, not from memory",
      "Overall composition and presentation"
    ],
    artMedium: "Graphite pencil and/or charcoal",
    inspirationNotes: "Study the figure drawings of Leonardo da Vinci, who dissected human bodies to understand anatomy, and compare them with the bold figurative paintings of Kenyan artist Patrick Mukabi, whose energetic brushwork captures the dynamism of the human form. Look at how different artists emphasise different aspects of the figure — some focus on anatomical accuracy, others on emotional expression, others on movement and rhythm. Your figure drawings should aim for honest observation: draw what you see, not what you think the figure should look like.",
    relatedConcepts: [
      "Human figure proportions and anatomy",
      "Gesture and contour drawing",
      "Tonal rendering and chiaroscuro",
      "Observational drawing skills",
      "Figurative art in Kenyan and global traditions"
    ]
  },

  {
    name: "Mixed-Media Sculpture: Identity and Environment",
    activityType: "visual_art",
    grade: "Grade 10",
    learningArea: "Fine Arts",
    strand: "Sculpture and 3D Art",
    aim: "To create a mixed-media sculpture that explores themes of personal or cultural identity in relation to environment, using found objects and traditional materials.",
    materials: [
      "Wire (various gauges for armature and detail)",
      "Found objects (bottle caps, fabric scraps, buttons, shells, beads)",
      "Natural materials (wood pieces, sisal, seeds, clay)",
      "Pliers, wire cutters, scissors",
      "Hot glue gun (teacher supervised) and PVA glue",
      "Spray paint or acrylic paint (optional)",
      "Base board (wood or heavy cardboard, 20x20cm)"
    ],
    instructions: [
      "1. Reflect on the theme 'Identity and Environment'. Write a short statement (50 words) about what aspect of your identity or cultural environment you want to explore: your community, your aspirations, the tension between tradition and modernity, your connection to nature.",
      "2. Collect found objects and materials that relate to your theme. Consider objects from daily Kenyan life: chapati rolling pins, shuka fabric, maize husks, soda bottle caps, mobile phone parts, traditional beads.",
      "3. Create a wire armature (skeleton) for your sculpture on the base board. The armature establishes the basic form and structure — it could be a human figure, an abstract shape, or an architectural form.",
      "4. Begin building on the armature by attaching your chosen materials. Layer and combine: wrap wire with sisal, attach bottle caps in patterns, weave fabric through the structure. Think about texture, colour, and symbolic meaning.",
      "5. Step back regularly to view your sculpture from all angles — unlike a painting, sculpture must work in three dimensions. Adjust proportions and add detail where needed.",
      "6. Add finishing touches: paint selected areas if desired, ensure all materials are securely attached, and refine the composition. The sculpture should be stable on its base.",
      "7. Write an artist's statement (100 words) explaining your sculpture's meaning, the materials you chose and why, and how the work connects to your personal or cultural identity."
    ],
    backgroundInfo: "Mixed-media sculpture brings together diverse materials to create three-dimensional art that can carry complex meanings. In Kenya, there is a strong tradition of creative reuse — artisans in Nairobi's Kariobangi area create stunning sculptures from recycled metal, the Kamba people carve detailed figures from wood, and contemporary artists like Cyrus Kabiru create elaborate 'C-Stunners' (wearable sculptures) from found electronic waste and wire. The concept of exploring identity through art is particularly relevant for Grade 10 students who are navigating questions about who they are, where they belong, and what the future holds. Kenya's rapid urbanisation and globalisation mean that young people often inhabit multiple worlds simultaneously — traditional and modern, local and global, rural and urban. Sculpture, with its physical presence and tactile quality, is uniquely suited to expressing these complex, layered identities because it can literally combine materials from different worlds into a single form.",
    expectedOutcome: "Students should produce a stable, well-crafted mixed-media sculpture of at least 25cm in any dimension that communicates a clear theme related to identity or environment. The sculpture should combine at least three different material types thoughtfully — not randomly. An artist's statement should articulate the concept and material choices. The work should show consideration of form, texture, and composition from multiple viewing angles.",
    performanceCriteria: [
      "Clear conceptual connection to the theme of identity and environment",
      "Thoughtful and meaningful selection of materials",
      "Sound construction — stable, secure, well-crafted",
      "Three-dimensional awareness — the work is considered from all angles",
      "Written artist's statement articulates concept effectively"
    ],
    artMedium: "Mixed-media sculpture (wire, found objects, natural materials)",
    inspirationNotes: "Look at the work of Kenyan artist Cyrus Kabiru, who transforms electronic waste into spectacular wearable sculptures that comment on technology, identity, and African futurism. Study the recycled metal animal sculptures sold at craft markets — notice how discarded materials are given new life and meaning. Visit Kuona Trust artists' studios in Nairobi (or view online) to see how contemporary Kenyan sculptors work with mixed media. Your sculpture should be a conversation between materials — what does it mean when a piece of traditional beadwork sits next to a circuit board? When sisal rope wraps around a plastic bottle?",
    relatedConcepts: [
      "Mixed-media sculpture techniques",
      "Conceptual art and identity",
      "Found object art and creative reuse",
      "Contemporary Kenyan sculpture",
      "Three-dimensional composition and form"
    ]
  },

  {
    name: "Composing a Short Instrumental Piece",
    activityType: "music",
    grade: "Grade 10",
    learningArea: "Music and Dance",
    strand: "Music Theory and Practice",
    aim: "To compose an original 16-bar instrumental piece for a small ensemble, applying knowledge of melody, harmony, rhythm, and musical form to create a coherent musical work.",
    materials: [
      "Music notation paper (or music notation software if available)",
      "Keyboard or piano for composing and playback",
      "Available classroom instruments (recorders, percussion, guitars)",
      "Pencils and erasers",
      "Reference recordings of simple instrumental pieces",
      "Audio recorder for documenting compositions"
    ],
    instructions: [
      "1. Choose a key for your composition (C major or A minor recommended for beginners). Review the notes available in your chosen key and the primary chords (I, IV, V for major; i, iv, V for minor).",
      "2. Create a simple chord progression for your piece: 4 bars per section, 4 sections = 16 bars. A common structure: A section (4 bars), A section repeated, B section (contrasting 4 bars), A section return. This is called ternary or AABA form.",
      "3. Write a melody over your chord progression. The melody should: start and end on a note from the chord, move mostly by step (neighbouring notes) with occasional leaps, have a clear high point (climax) in the B section.",
      "4. Add a bass line that supports the harmony — typically the root note of each chord. The bass can use simple whole notes or a more rhythmic pattern.",
      "5. Write a rhythm part for percussion: design a 2-bar pattern that repeats, using a combination of steady beat and syncopation. Write it on a single-line rhythm staff.",
      "6. Score all parts together on your notation paper: melody (top), harmony/chords (middle), bass (bottom), with percussion below. Add dynamics markings (p for soft, f for loud) and tempo indication.",
      "7. Rehearse your composition with classmates playing each part. Listen critically — does the melody sing? Does the harmony support it? Are the rhythms interesting? Revise as needed, then perform for the class."
    ],
    backgroundInfo: "Composition — the art of creating original music — is the pinnacle of music education because it requires applying all musical knowledge simultaneously: melody, harmony, rhythm, form, and instrumentation. In the Kenyan context, composition has a distinguished history. Traditional composers created songs for specific ceremonies and occasions, with music tailored to community needs. In the contemporary scene, Kenyan composers span genres from classical (the late Kenyan composer Washington Omondi) to Afro-pop (Sauti Sol, Nyashinski) to film scoring. The process of composing teaches students to think like musicians — making creative decisions about what sounds good, what creates tension, what provides resolution, and how to organise musical ideas into a coherent whole. Even a simple 16-bar piece requires dozens of creative decisions, making composition a powerful exercise in critical thinking and creative problem-solving.",
    expectedOutcome: "Students should produce a written score for a 16-bar instrumental piece that includes a melody, bass line or harmonic accompaniment, and rhythm part. The piece should follow the AABA (or similar) form with a recognisable structure. The melody should be singable and the harmony functional. The composition should be performed by a small ensemble with reasonable accuracy. Students should be able to explain their compositional choices.",
    performanceCriteria: [
      "Coherent musical form with clear structure (AABA or similar)",
      "Effective melody that is memorable and well-shaped",
      "Functional harmony — chords support the melody appropriately",
      "Correctly notated score with all parts, dynamics, and tempo",
      "Successful ensemble performance of the composition"
    ],
    artMedium: "Instrumental composition (small ensemble)",
    inspirationNotes: "Listen to simple instrumental pieces by Kenyan composers and global masters. Study the structure of songs you love — most popular music uses simple forms (verse-chorus-verse) that you can adapt. Think of your composition as telling a story without words: the A section introduces an idea, the B section provides contrast or tension, and the return to A brings resolution. Great composers from Mozart to Sauti Sol all follow these basic principles of musical storytelling. Start simple — a beautiful four-note melody is better than a complicated one that does not sing.",
    relatedConcepts: [
      "Music composition fundamentals",
      "Musical form and structure",
      "Melody writing and harmonisation",
      "Music notation and scoring",
      "Ensemble arrangement"
    ]
  },

  {
    name: "African Dance Heritage: Choreographing a Cultural Showcase",
    activityType: "dance",
    grade: "Grade 10",
    learningArea: "Music and Dance",
    strand: "Dance",
    aim: "To research, choreograph, and perform a dance piece that showcases the heritage of a specific African dance tradition, demonstrating deep understanding of its cultural context, movement vocabulary, and musical accompaniment.",
    materials: [
      "Performance space (hall or outdoor area)",
      "Audio equipment for music playback",
      "Authentic or recorded traditional music for chosen dance tradition",
      "Costume elements appropriate to the dance tradition",
      "Research materials (books, articles, video references)",
      "Choreography journal for documentation"
    ],
    instructions: [
      "1. In groups of eight, select an African dance tradition to research and present. Options include: Isukuti (Luhya), Ohangla (Luo), Mugithi (Kikuyu), Taarab dance (Coastal Swahili), Adumu/jumping dance (Maasai), or a tradition from outside Kenya such as Kizomba (Angola), Zaouli (Côte d'Ivoire), or Gumboot (South Africa).",
      "2. Research your chosen dance: its origin community, the occasions when it is performed, its cultural significance, the traditional music and instruments that accompany it, and the specific movement vocabulary. Document your findings in your choreography journal.",
      "3. Learn the foundational movements of the dance tradition. If possible, invite a community member or cultural practitioner to teach authentic movements. Otherwise, use video references and written descriptions.",
      "4. Choreograph a 3-4 minute showcase piece that presents the dance authentically but in a staged performance context. Include: an entrance that introduces the dance's cultural context, the core dance vocabulary performed with authenticity, a section showing the dance's social or ceremonial function, and a finale.",
      "5. Add appropriate costume elements: even simple additions like wrapping fabric in a specific way or adding beaded accessories can enhance cultural authenticity and visual impact.",
      "6. Rehearse extensively, focusing on authenticity of movement, musical accuracy, group coordination, and performance energy. The piece should honour the tradition while being engaging for a contemporary audience.",
      "7. Perform for the class or school. Before the performance, one group member gives a 2-minute introduction explaining the dance's cultural context. After the performance, answer questions from the audience."
    ],
    backgroundInfo: "Africa is home to some of the world's richest and most diverse dance traditions, each carrying centuries of cultural knowledge, spiritual practice, and community identity. In Kenya alone, over 40 ethnic communities maintain distinct dance traditions that serve functions from celebration and courtship to healing and storytelling. The preservation and respectful presentation of these traditions is increasingly important as urbanisation and globalisation change how young people engage with their cultural heritage. A cultural dance showcase is not merely entertainment — it is an act of cultural preservation, education, and celebration. When students research and perform a traditional dance with integrity, they become cultural ambassadors who can bridge generations and communities. This activity also develops research skills, collaborative choreography abilities, and the capacity to present complex cultural information through the medium of performance.",
    expectedOutcome: "Each group should present a 3-4 minute dance performance that demonstrates authentic movement vocabulary from their chosen tradition, accompanied by a clear verbal introduction explaining the dance's cultural context. The performance should show evidence of research, careful choreography, and committed execution. Costume elements should enhance cultural representation. The group should be able to answer questions about the dance's history, significance, and cultural role.",
    performanceCriteria: [
      "Authenticity — movement vocabulary is recognisably from the chosen tradition",
      "Research depth — cultural context is accurately communicated",
      "Choreographic quality — the piece is well-structured and engaging",
      "Group coordination and performance energy",
      "Respectful and dignified presentation of cultural heritage"
    ],
    artMedium: "Traditional African dance (cultural showcase)",
    inspirationNotes: "Watch performances by Kenya's premier cultural dance companies: Bomas of Kenya dancers, the Kenya National Theatre dance troupe, and Bombolulu Cultural Centre performers. Notice how professional companies present traditional dances with both authenticity and theatrical awareness. Seek out elders and cultural practitioners in your community who can share first-hand knowledge of dance traditions. Remember that every dance you perform carries the spirit of generations who danced before you — approach this work with respect, curiosity, and pride.",
    relatedConcepts: [
      "African dance traditions and cultural heritage",
      "Dance research and documentation",
      "Cultural choreography and authentic presentation",
      "Performance and cultural education",
      "Intangible cultural heritage preservation"
    ]
  },

  {
    name: "Script Writing and Performance: Short Play on Contemporary Kenya",
    activityType: "drama",
    grade: "Grade 10",
    learningArea: "Theatre and Film",
    strand: "Theatre Arts",
    aim: "To write, rehearse, and perform an original short play (10-15 minutes) set in contemporary Kenya, developing skills in dramatic writing, directing, acting, and theatrical production.",
    materials: [
      "Notebooks and pens for script writing",
      "Printed script copies for each cast member",
      "Performance space (classroom or hall)",
      "Basic set pieces: chairs, tables, fabric for curtain",
      "Simple props relevant to the play's setting",
      "Basic lighting (desk lamps) if available",
      "Programme template for audience handout"
    ],
    instructions: [
      "1. In groups of six, brainstorm a story set in contemporary Kenya. Possible themes: a family navigating generational differences, friends facing a moral dilemma, a community responding to change, or a day in a unique Kenyan setting (matatu stage, jua kali workshop, market, school). Choose a story that all group members connect with.",
      "2. Write the play collaboratively. Assign roles: one playwright/lead writer, one director, four actors (who also contribute to writing). Structure the play with 3-4 scenes, clear character arcs, and a central conflict that builds to a climax and resolution.",
      "3. Write authentic dialogue that sounds like real Kenyans speaking — use appropriate Sheng, Swahili, or English as your characters would naturally speak. Each character should have a distinct voice.",
      "4. The director blocks the play: decides where characters enter, exit, and move on stage. Create a simple ground plan showing the stage layout and key positions. Mark blocking notes on the script.",
      "5. Rehearse scene by scene. Actors should work on developing their characters' physical mannerisms, emotional arcs, and relationships. The director gives notes after each run-through.",
      "6. Add production elements: gather or create necessary props, decide on simple costume pieces that suggest character, arrange basic set pieces. Create a programme listing the title, cast, crew, and a brief synopsis.",
      "7. Perform for the class or a wider audience. After the performance, the group conducts a post-show discussion about the creative process, challenges faced, and lessons learned."
    ],
    backgroundInfo: "Kenya has a vibrant theatre tradition that blends indigenous performance practices with global dramatic forms. From the community theatre movement pioneered by Ngugi wa Thiong'o at Kamiriithu in the 1970s to contemporary productions at the Kenya National Theatre, Alliance Française, and independent spaces like The Arts Centre, Kenyan theatre addresses the questions, conflicts, and celebrations of Kenyan life. Writing plays about contemporary Kenya challenges students to observe their society carefully, understand different perspectives, and craft stories that entertain while illuminating truth. The collaborative nature of theatre — where writers, directors, actors, and designers must work together — mirrors the collaborative nature of Kenyan society itself. Great Kenyan playwrights like Francis Imbuga ('Betrayal in the City'), Micere Mugo ('The Long Illness of Ex-Chief Kiti'), and contemporary writers like Sitawa Namwalie and Cajetan Boy have shown that the best theatre holds a mirror to society while imagining how things might be different.",
    expectedOutcome: "Each group should produce a written script and a polished performance of 10-15 minutes that tells a coherent story set in contemporary Kenya. The play should feature well-developed characters, authentic dialogue, clear conflict, and a meaningful resolution or reflection. The production should show evidence of directorial vision through intentional blocking, pacing, and staging. A printed programme should accompany the performance.",
    performanceCriteria: [
      "Script quality — coherent story, authentic dialogue, clear dramatic structure",
      "Character development — distinct, believable characters with emotional depth",
      "Directorial vision — intentional blocking, pacing, and staging choices",
      "Acting quality — committed performances with vocal clarity and emotional truth",
      "Production values — appropriate props, costumes, and programme"
    ],
    artMedium: "Original scripted theatre",
    inspirationNotes: "Read or watch performances of Kenyan plays that capture the spirit of contemporary life: Francis Imbuga's 'Betrayal in the City' remains relevant decades after it was written because it deals with universal themes of power and integrity. Watch performances at the Kenya National Theatre or online recordings of Kenyan theatre productions. Notice how the best Kenyan plays use humour, recognisable characters, and local language to engage audiences while addressing deeper themes. Your play does not need to be about big political issues — some of the most powerful theatre tells small, personal stories that resonate because they are truthful.",
    relatedConcepts: [
      "Playwriting and dramatic structure",
      "Directing and theatrical production",
      "Acting technique and character development",
      "Contemporary Kenyan theatre",
      "Collaborative creative process"
    ]
  },

  {
    name: "Composing and Performing an Original Song",
    activityType: "music",
    grade: "Grade 10",
    learningArea: "Music and Dance",
    strand: "Music Theory and Practice",
    aim: "To write, arrange, and perform an original song combining lyrics, melody, and accompaniment, integrating knowledge of song structure, lyric writing, and performance presentation.",
    materials: [
      "Notebook for lyric writing",
      "Music notation paper or chord chart template",
      "Guitar, keyboard, or available melodic instrument",
      "Percussion instruments (djembe, shaker, cajon)",
      "Audio recorder for documenting the songwriting process",
      "Microphone and small speaker (if available)"
    ],
    instructions: [
      "1. Choose a theme for your song: love, friendship, hope, social commentary, nature, or personal experience. Write freely for 5 minutes about your theme — this is your raw material for lyrics.",
      "2. Craft your lyrics into a song structure: Verse 1 (sets the scene), Chorus (the main message — catchy and repeatable), Verse 2 (develops the story), Chorus, Bridge (new perspective or musical contrast), Final Chorus. Aim for 12-20 lines total.",
      "3. Create a chord progression for the verses and a contrasting progression for the chorus. In the key of C major, try: Verse: C-Am-F-G, Chorus: F-G-Am-C, Bridge: Dm-F-G-G. Experiment until the chords feel right with your lyrics.",
      "4. Write a melody over the chords. Sing your lyrics and let the natural speech rhythm guide the melody. The chorus melody should be higher and more memorable than the verse melody.",
      "5. In groups of three or four, arrange the song for performance: assign roles — vocalist, accompanist (guitar or keyboard), percussion, and optional harmony vocalist. Write out a simple arrangement chart.",
      "6. Rehearse the song, focusing on: vocal delivery and expression, accompaniment balance (instruments should support, not overpower the voice), dynamic contrast between sections, and the overall groove.",
      "7. Perform the song for the class. Introduce it briefly: the theme, the inspiration, and the creative process. After all performances, the class votes on most memorable melody, best lyrics, and best performance."
    ],
    backgroundInfo: "Songwriting is perhaps the most popular form of musical creativity, combining the literary art of lyric writing with the musical arts of melody, harmony, and arrangement. Kenya has produced internationally recognised songwriters across genres: from the legendary Daudi Kabaka ('Pole Musa') and Fadhili William ('Malaika') to contemporary artists like Sauti Sol, Nyashinski, and Nviiri the Storyteller, who craft songs that resonate with millions. The Kenyan music industry is one of the fastest-growing in Africa, creating career opportunities for songwriters, producers, performers, and music business professionals. Learning to write songs develops multiple skills simultaneously: creative writing (lyrics), music theory (chords and melody), emotional intelligence (expressing feelings through art), and performance skills (presenting your work to an audience). A good song distills complex emotions into simple, memorable forms — and this ability to communicate effectively through creative expression is valuable in any career.",
    expectedOutcome: "Each group should perform an original song of at least 2 minutes with clear verse-chorus structure, meaningful lyrics, a singable melody, and instrumental accompaniment. The lyrics should communicate the chosen theme effectively. The arrangement should demonstrate appropriate balance between vocals and instruments. The performance should show musical competence and genuine artistic expression.",
    performanceCriteria: [
      "Lyric quality — meaningful, well-crafted words that communicate the theme",
      "Melodic quality — memorable, singable melody with appropriate range",
      "Harmonic support — chords complement the melody and lyrics",
      "Arrangement and ensemble balance — instruments support the voice",
      "Performance delivery — confident, expressive, and engaging"
    ],
    artMedium: "Original song (voice with instrumental accompaniment)",
    inspirationNotes: "Study the songwriting of Kenyan artists you admire. Sauti Sol's 'Suzanna' uses a simple chord progression and catchy melody to create a song that millions know by heart. Nyashinski's 'Mungu Pekee' demonstrates how personal lyrics about faith and struggle can connect with a wide audience. Eric Wainaina's 'Daima' is a masterclass in patriotic songwriting. Notice that great songs are rarely complicated — they succeed through honest emotion, memorable melody, and the authenticity of the songwriter's voice. Write about what you know, what you feel, and what matters to you.",
    relatedConcepts: [
      "Songwriting and lyric composition",
      "Song structure (verse, chorus, bridge)",
      "Melody and harmony in popular music",
      "Performance and stagecraft",
      "Kenyan popular music industry"
    ]
  }
];

async function main() {
  console.log("🎨 Seeding Creative Arts activities...");

  // Delete existing creative arts activities
  const deleted = await prisma.creativeArtsActivity.deleteMany({});
  console.log(
    `🗑️  Deleted ${deleted.count} existing creative arts activities`
  );

  // Get grade and learning area IDs
  const grades = await prisma.grade.findMany();
  const learningAreas = await prisma.learningArea.findMany({
    include: { grade: true, strands: true },
  });

  let seededCount = 0;

  for (const activity of activities) {
    // Find matching grade
    const grade = grades.find((g) => g.name === activity.grade);
    if (!grade) {
      console.log(
        `⚠️  Grade not found: ${activity.grade} - skipping activity: ${activity.name}`
      );
      continue;
    }

    // Find matching learning area
    const learningArea = learningAreas.find(
      (la) => la.name === activity.learningArea && la.gradeId === grade.id
    );
    if (!learningArea) {
      console.log(
        `⚠️  Learning area not found: ${activity.learningArea} for ${activity.grade} - skipping: ${activity.name}`
      );
      continue;
    }

    // Find matching strand (optional)
    const strand = learningArea.strands.find(
      (s) => s.name === activity.strand
    );

    // Create activity
    await prisma.creativeArtsActivity.create({
      data: {
        name: activity.name,
        activityType: activity.activityType,
        gradeId: grade.id,
        learningAreaId: learningArea.id,
        strandId: strand?.id,
        aim: activity.aim,
        materials: activity.materials,
        instructions: activity.instructions,
        backgroundInfo: activity.backgroundInfo,
        expectedOutcome: activity.expectedOutcome,
        performanceCriteria: activity.performanceCriteria,
        artMedium: activity.artMedium,
        inspirationNotes: activity.inspirationNotes,
        relatedConcepts: activity.relatedConcepts,
        sloIds: [],
      },
    });

    seededCount++;
    console.log(
      `✅ Seeded: ${activity.name} (${activity.activityType} - ${activity.grade})`
    );
  }

  console.log(
    `\n🎉 Successfully seeded ${seededCount} Creative Arts activities!`
  );
}

main()
  .catch((e) => {
    console.error("❌ Error seeding Creative Arts activities:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
