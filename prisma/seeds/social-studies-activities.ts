import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../lib/generated/prisma/client.js";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * CBC-aligned Social Studies activities for Grades 7-9
 * 4 activities per grade = 12 total
 * Strand names match the actual CBC curriculum seed data
 */

const activities = [
  // ═══════════════════════════════════════════════════
  // GRADE 7 — Social Studies
  // Strands: History, Geography, Citizenship and Governance
  // ═══════════════════════════════════════════════════

  // --- Geography ---
  {
    name: "Mapping Physical Features of Eastern Africa",
    activityType: "map_work",
    grade: "Grade 7",
    learningArea: "Social Studies",
    strand: "Geography",
    aim: "To draw and label a map of East Africa showing major physical features including mountains, lakes, rivers, and the Great Rift Valley.",
    materials: [
      "Blank outline map of East Africa",
      "Atlas or reference map of Eastern Africa",
      "Colored pencils (blue, green, brown, yellow)",
      "Ruler",
      "Pencil and eraser",
      "A4 drawing paper",
      "Map key/legend template"
    ],
    instructions: [
      "1. Study the reference map of Eastern Africa in your atlas, identifying the major physical features including mountains, lakes, rivers, and the Rift Valley.",
      "2. On your blank outline map, lightly sketch the Great Rift Valley running from north to south through the region using a brown pencil.",
      "3. Label and shade the major mountains: Mt. Kenya (5,199m), Mt. Kilimanjaro (5,895m), Mt. Elgon (4,321m), and the Rwenzori Mountains using brown shading.",
      "4. Draw and label the major lakes in blue: Lake Victoria, Lake Turkana, Lake Tanganyika, Lake Malawi, and Lake Nakuru.",
      "5. Trace the major rivers in blue: River Nile, River Tana, River Athi/Galana, and River Zambezi, showing the direction of flow with arrows.",
      "6. Create a comprehensive map key showing symbols for mountains, lakes, rivers, and the Rift Valley, and add a title and compass rose.",
      "7. In pairs, compare your completed maps with a partner and discuss which physical features are most important for human settlement in the region."
    ],
    backgroundInfo: "Eastern Africa is one of the most geographically diverse regions on the continent, shaped over millions of years by tectonic activity, volcanic eruptions, and erosion. The Great Rift Valley, stretching over 6,000 kilometres from Lebanon to Mozambique, is the most prominent feature and has created a chain of lakes and volcanic mountains across Kenya, Tanzania, Uganda, and Ethiopia. Mount Kilimanjaro in Tanzania is Africa's highest peak, while Lake Victoria is the continent's largest lake and the source of the River Nile. In Kenya, these physical features directly influence where people live, what they farm, and how they travel. The highlands around Mt. Kenya receive high rainfall and have fertile volcanic soils ideal for tea and coffee farming. The Rift Valley floor contains lakes like Nakuru and Bogoria, famous for flamingos and geothermal energy. Understanding the geography of Eastern Africa helps students appreciate why certain areas are densely populated while others, like the arid north around Lake Turkana, support only pastoralist communities.",
    expectedOutcome: "Students should produce a clearly drawn and accurately labelled map of Eastern Africa showing at least four mountains, five lakes, four rivers, and the Great Rift Valley. The map should include a proper title, compass rose indicating north, and a colour-coded legend/key. Students should demonstrate understanding of the spatial relationships between features, for example, how the Rift Valley connects several lakes and how mountains influence river flow patterns. During the pair discussion, students should be able to explain how physical features affect human activities such as farming, fishing, tourism, and settlement patterns in the region.",
    discussionPoints: [
      "Why do most people in Eastern Africa live in the highlands rather than the lowlands?",
      "How does the Great Rift Valley influence both the physical landscape and human activities in Kenya?",
      "What would happen to communities around Lake Victoria if the lake's water level dropped significantly?",
      "How do physical features like mountains and rivers serve as natural boundaries between countries in Eastern Africa?"
    ],
    relatedConcepts: [
      "Physical geography",
      "Map reading and interpretation",
      "Tectonic activity and landforms",
      "Human-environment interaction",
      "Settlement patterns"
    ]
  },

  // --- History ---
  {
    name: "Trade Along the East African Coast",
    activityType: "research",
    grade: "Grade 7",
    learningArea: "Social Studies",
    strand: "History",
    aim: "To research and document the historical trade interactions between Arab, Portuguese, and local communities along the East African coast.",
    materials: [
      "History textbook (Grade 7 Social Studies)",
      "Library books on East African coastal history",
      "Printed excerpts about Swahili trade cities",
      "A4 paper for research notes",
      "Colored pens and markers",
      "World map showing Indian Ocean trade routes",
      "Manila paper for group presentation"
    ],
    instructions: [
      "1. Read the provided materials about trade along the East African coast, focusing on the period from the 8th century to the 16th century.",
      "2. In groups of four, research one of the following topics: (a) goods traded by local communities, (b) Arab traders and the monsoon winds, (c) the rise of Swahili city-states, or (d) the arrival of the Portuguese.",
      "3. Create a timeline of major events in East African coastal trade, starting from early Bantu settlement to Portuguese arrival in 1498.",
      "4. List the goods that were exported from East Africa (ivory, gold, slaves, animal skins, mangrove poles) and the goods imported (cloth, beads, porcelain, spices, weapons).",
      "5. On the world map, trace the trade routes connecting East Africa to Arabia, Persia, India, and China across the Indian Ocean.",
      "6. Write a one-page summary explaining how trade transformed the East African coast, including the development of the Swahili language and culture.",
      "7. Present your group findings to the class using the manila paper as a visual aid."
    ],
    backgroundInfo: "The East African coast has been a centre of international trade for over 2,000 years. Arab and Persian traders began visiting the coast as early as the 8th century, using the monsoon winds to sail across the Indian Ocean. They established trading posts that grew into prosperous city-states such as Mombasa, Malindi, Kilwa, Lamu, and Zanzibar. These interactions between Arab traders and local Bantu communities gave birth to the Swahili culture and language, which blends Bantu grammar with Arabic vocabulary. The trade was remarkably diverse: East Africa exported ivory, gold, iron, animal skins, tortoiseshell, and enslaved people, while importing cloth, beads, porcelain from China, glassware, and spices. The Portuguese arrived in 1498 when Vasco da Gama reached Malindi with the help of a local navigator. The Portuguese sought to control the lucrative Indian Ocean trade, building Fort Jesus in Mombasa in 1593. Their arrival disrupted existing trade networks and introduced a period of conflict and colonialism. Understanding this history helps Kenyan students appreciate the cosmopolitan heritage of the coast and how trade has always connected East Africa to the wider world.",
    expectedOutcome: "Students should produce comprehensive research notes covering the major trading communities, goods exchanged, trade routes, and the cultural impacts of trade on the East African coast. Each group should present a clear, well-organized summary that includes a timeline of key events, a list of traded goods with their origins and destinations, and an explanation of how Swahili culture emerged from the interaction between local and foreign communities. Students should demonstrate understanding that trade was not one-directional but involved mutual exchange that benefited and transformed all participating communities. The research should show evidence of multiple sources being consulted and critical thinking about the long-term impacts of trade.",
    discussionPoints: [
      "How did the monsoon wind patterns make trade between East Africa and Asia possible?",
      "In what ways did trade along the coast lead to the creation of a new culture and language (Swahili)?",
      "How did the arrival of the Portuguese change the nature of trade along the East African coast?",
      "What similarities can you see between historical Indian Ocean trade and modern international trade in Kenya?"
    ],
    relatedConcepts: [
      "Indian Ocean trade networks",
      "Swahili civilization",
      "Cultural exchange and diffusion",
      "Colonialism and its origins",
      "Historical research methods"
    ]
  },

  // --- Citizenship and Governance ---
  {
    name: "County Governance in Kenya",
    activityType: "case_study",
    grade: "Grade 7",
    learningArea: "Social Studies",
    strand: "Citizenship and Governance",
    aim: "To analyze the structure and functions of county government in Kenya under the 2010 Constitution.",
    materials: [
      "Copy of Chapter 11 (Devolved Government) of the Kenya Constitution 2010",
      "Organizational chart template for county government",
      "Social Studies textbook",
      "Newspaper clippings about county government activities",
      "A4 paper and colored pens",
      "List of the 47 counties in Kenya"
    ],
    instructions: [
      "1. Read the simplified excerpt from Chapter 11 of the Kenya Constitution 2010 on devolved government, noting the key principles of devolution.",
      "2. Using the organizational chart template, draw the structure of county government showing the Governor, Deputy Governor, County Executive Committee, and County Assembly.",
      "3. In your notebook, list at least five functions of the county government (e.g., healthcare, early childhood education, county roads, agriculture, water services).",
      "4. Research your own county: identify the current Governor, the number of wards, and one major project the county government has completed.",
      "5. Compare the functions of the national government with those of the county government using a two-column table.",
      "6. Write a short case study (200 words) analyzing one success and one challenge of county governance in your county or a county you have studied."
    ],
    backgroundInfo: "Kenya's 2010 Constitution introduced a devolved system of government, creating 47 county governments alongside the national government. This was a historic shift from the highly centralized governance system that had existed since independence in 1963. Devolution aimed to bring services closer to the people, promote equitable distribution of resources, and give communities a greater voice in decision-making. Each county is headed by a Governor elected directly by the people, supported by a Deputy Governor and a County Executive Committee (similar to a cabinet). The County Assembly, made up of elected Members of County Assembly (MCAs) from each ward, makes laws for the county and oversees the executive. County governments are responsible for key services including pre-primary education, county health facilities, local roads, agriculture extension services, water and sanitation, and county planning. The national government retains control over defence, foreign affairs, national security, and monetary policy. Since devolution began in 2013, counties have made significant progress in areas like healthcare (many counties have built new hospitals and upgraded existing ones) but have also faced challenges including corruption, capacity gaps, and disputes between governors and MCAs.",
    expectedOutcome: "Students should produce an accurate organizational chart of county government structure and a comprehensive comparison table of national versus county government functions. The case study should demonstrate understanding of both the achievements and challenges of devolution in Kenya. Students should be able to identify the key offices in county government, explain how county leaders are chosen (through elections), and articulate at least three benefits of devolution such as improved local service delivery, local participation in governance, and equitable resource distribution. Students should also critically evaluate challenges and suggest possible solutions.",
    discussionPoints: [
      "Why did Kenya adopt a devolved system of government in the 2010 Constitution?",
      "What are the advantages of having services managed at the county level rather than from Nairobi?",
      "What challenges has devolution faced in Kenya, and how can they be addressed?",
      "How can citizens hold their county government leaders accountable?"
    ],
    relatedConcepts: [
      "Devolution",
      "Constitutional governance",
      "Democracy and representation",
      "Public service delivery",
      "Civic participation"
    ]
  },

  // --- Citizenship and Governance ---
  {
    name: "Should Youth Participate in Governance?",
    activityType: "debate",
    grade: "Grade 7",
    learningArea: "Social Studies",
    strand: "Citizenship and Governance",
    aim: "To develop critical thinking and communication skills through a structured debate on youth civic participation in governance.",
    materials: [
      "Debate guidelines and rules handout",
      "Articles on youth participation in governance in Kenya",
      "Statistics on youth population in Kenya (over 75% under 35)",
      "Examples of young leaders in Kenya and Africa",
      "Timer or stopwatch",
      "Score sheet for judges",
      "Notebook for preparing arguments"
    ],
    instructions: [
      "1. Divide the class into two teams: the Proposition (supporting youth participation in governance) and the Opposition (arguing against or questioning readiness for youth participation).",
      "2. Each team spends 15 minutes researching and preparing their arguments using the provided materials, noting key points, evidence, and examples.",
      "3. The Proposition opens with a 3-minute speech presenting their main arguments for youth participation in governance.",
      "4. The Opposition responds with a 3-minute speech presenting their counterarguments.",
      "5. Each side then presents 2-minute rebuttals addressing the other team's points directly.",
      "6. Open the floor for 5 minutes of cross-examination where either side can ask questions of the other.",
      "7. Each team delivers a 2-minute closing statement summarizing their strongest arguments, and the class votes on which team presented the more convincing case."
    ],
    backgroundInfo: "Kenya has one of the youngest populations in the world, with over 75% of its citizens under the age of 35. Despite this demographic reality, young people have historically been underrepresented in governance and decision-making processes. The 2010 Constitution includes provisions for youth representation, and the two-thirds gender rule has prompted discussions about broader inclusion. Young Kenyans have shown remarkable civic engagement through social media activism, community organizing, and voter registration drives. However, barriers remain: many young people face unemployment, lack access to political networks and funding, and encounter age-based discrimination from older politicians. The debate around youth participation is not just about holding political office but also about engaging in community development, participating in public forums (like county budget hearings), volunteering in civic organizations, and holding leaders accountable through informed voting. Countries like Rwanda and Ethiopia have demonstrated that young leaders can drive innovation and reform. In Kenya, organizations like the Youth Senate and various civic education programs are working to build a pipeline of young, ethical leaders who can transform governance.",
    expectedOutcome: "Students should demonstrate the ability to construct logical arguments supported by evidence, listen actively to opposing viewpoints, and respond with well-reasoned rebuttals. The Proposition team should present at least three strong arguments for youth participation, such as demographic representation, fresh perspectives, and constitutional rights. The Opposition should raise valid concerns such as experience gaps, vulnerability to manipulation, and the need for mentorship. Both teams should use specific examples from Kenya and Africa. After the debate, students should write a personal reflection (150 words) stating their own position and the strongest argument they heard from either side, showing that they can evaluate arguments critically regardless of which team they were assigned to.",
    discussionPoints: [
      "What does the Kenyan Constitution say about the rights of young people to participate in governance?",
      "Can you name any young leaders in Kenya or Africa who have made a positive impact?",
      "What barriers prevent young people from participating more actively in governance?",
      "How can schools and communities better prepare young people for civic leadership?",
      "Is age a reliable indicator of a person's ability to lead effectively?"
    ],
    relatedConcepts: [
      "Youth empowerment",
      "Democratic participation",
      "Civic responsibility",
      "Public speaking and debate",
      "Constitutional rights"
    ]
  },

  // ═══════════════════════════════════════════════════
  // GRADE 8 — Social Studies
  // Strands: History, Globalisation and Trade, Regional Cooperation
  // ═══════════════════════════════════════════════════

  // --- History ---
  {
    name: "Impact of Colonialism on Africa",
    activityType: "research",
    grade: "Grade 8",
    learningArea: "Social Studies",
    strand: "History",
    aim: "To research and evaluate the political, economic, social, and cultural effects of European colonialism on African societies.",
    materials: [
      "Grade 8 Social Studies textbook",
      "Library reference books on African colonial history",
      "Map of Africa showing colonial boundaries (1914)",
      "Printed primary source excerpts (e.g., Berlin Conference resolutions)",
      "A4 paper and colored pens",
      "Research note-taking template",
      "Manila paper for group poster"
    ],
    instructions: [
      "1. Read the textbook chapter on European colonialism in Africa, paying attention to the Berlin Conference of 1884-1885 and the Scramble for Africa.",
      "2. In groups of four, choose one category to research in depth: (a) political effects, (b) economic effects, (c) social effects, or (d) cultural effects of colonialism.",
      "3. For your chosen category, identify at least four specific effects with examples from different African countries, with particular focus on Kenya.",
      "4. Create a two-column poster: one column for negative effects and one for any changes that some historians consider positive (e.g., infrastructure, education), noting that these came at great human cost.",
      "5. Include at least one primary source quote or historical document reference in your research.",
      "6. Present your group's findings to the class in a 5-minute presentation.",
      "7. After all presentations, individually write a reflective paragraph (150 words) on how colonialism's legacy still affects Kenya today."
    ],
    backgroundInfo: "European colonialism in Africa, which intensified after the Berlin Conference of 1884-1885, fundamentally reshaped the continent's political, economic, and social landscape. European powers including Britain, France, Germany, Belgium, Portugal, and Italy divided Africa among themselves with little regard for existing ethnic boundaries, kingdoms, or trade networks. In Kenya, British colonial rule (1895-1963) introduced a system of racial segregation, displaced communities from their ancestral lands (particularly in the White Highlands), imposed forced labour, and suppressed African political organization. The colonial economy was structured to extract raw materials for European industries while making Africans dependent on imported manufactured goods. Africans were subjected to heavy taxation, pass laws, and cultural suppression, including restrictions on African languages and customs. However, colonialism also introduced formal education systems, modern healthcare, railways, and new administrative structures, though these primarily served colonial interests. The resistance to colonialism, including the Mau Mau uprising in Kenya (1952-1960), ultimately led to independence movements across the continent. Understanding colonialism is essential for comprehending modern Africa's political boundaries, economic challenges, and ongoing efforts at nation-building.",
    expectedOutcome: "Each group should produce a well-researched poster with at least four specific effects of colonialism in their assigned category, supported by concrete examples from Kenya and other African countries. Students should demonstrate the ability to distinguish between different types of effects and present a balanced analysis that acknowledges complexity without minimizing the harm caused. The individual reflective paragraph should connect colonial history to contemporary issues in Kenya such as land disputes, ethnic tensions rooted in colonial divide-and-rule tactics, economic dependence on commodity exports, and the continued use of colonial-era languages in government and education. Students should show evidence of critical thinking rather than simply listing facts.",
    discussionPoints: [
      "Why did European powers decide to colonize Africa, and what role did the Berlin Conference play?",
      "How did colonial boundaries, drawn without regard for ethnic groups, contribute to conflicts that persist today?",
      "In what ways does Kenya's economy today still reflect colonial-era patterns of production and trade?",
      "How did African communities resist colonialism, and what can we learn from their resistance?"
    ],
    relatedConcepts: [
      "Imperialism and colonialism",
      "The Scramble for Africa",
      "Resistance movements",
      "Post-colonial nation building",
      "Historical cause and effect"
    ]
  },

  // --- History ---
  {
    name: "Universal Declaration of Human Rights",
    activityType: "case_study",
    grade: "Grade 8",
    learningArea: "Social Studies",
    strand: "History",
    aim: "To analyze specific articles of the Universal Declaration of Human Rights (UDHR) and evaluate how they are applied and protected in Kenya.",
    materials: [
      "Simplified copy of the Universal Declaration of Human Rights (30 articles)",
      "Kenya Constitution 2010 Bill of Rights (Chapter 4)",
      "Case study handouts on human rights situations in Kenya",
      "Highlighters and colored pens",
      "A4 paper for written analysis",
      "Newspaper clippings about human rights issues in Kenya"
    ],
    instructions: [
      "1. Read through the simplified version of the Universal Declaration of Human Rights, noting the date it was adopted (10 December 1948) and why it was created after World War II.",
      "2. In pairs, select three articles from the UDHR that you consider most important and write a one-sentence explanation of each in your own words.",
      "3. Compare your selected UDHR articles with the corresponding rights in Chapter 4 (Bill of Rights) of the Kenya Constitution 2010, noting similarities and differences.",
      "4. Read the provided case study about a human rights issue in Kenya (e.g., right to education, freedom of expression, right to housing).",
      "5. Analyze the case study: identify which UDHR articles and constitutional rights are relevant, who is affected, and what actions have been taken to address the issue.",
      "6. Write a one-page analysis (250 words) presenting your findings and recommending how the identified rights can be better protected in Kenya."
    ],
    backgroundInfo: "The Universal Declaration of Human Rights (UDHR) was adopted by the United Nations General Assembly on 10 December 1948 in response to the atrocities of World War II, including the Holocaust. It was the first global statement affirming that all human beings are born free and equal in dignity and rights, regardless of race, colour, sex, language, religion, or nationality. The UDHR's 30 articles cover civil and political rights (such as freedom of speech, right to life, and freedom from torture) as well as economic, social, and cultural rights (such as the right to education, work, and healthcare). Kenya, as a member of the United Nations, is committed to upholding these rights. The Kenya Constitution 2010 includes a comprehensive Bill of Rights in Chapter 4 that reflects many UDHR principles and goes further in some areas, such as recognizing economic and social rights as justiciable (enforceable in court). However, challenges remain in practice: issues such as police brutality, gender-based violence, child labour, displacement of communities, and limitations on press freedom continue to affect Kenyans. Human rights organizations like the Kenya National Commission on Human Rights (KNCHR) work to monitor and promote rights protection across the country.",
    expectedOutcome: "Students should produce a written comparison showing clear understanding of at least three UDHR articles and their corresponding provisions in the Kenya Constitution. The case study analysis should demonstrate the ability to identify relevant rights, analyze how they are being upheld or violated, and propose practical recommendations. Students should show understanding that human rights are universal (they apply to all people everywhere), inalienable (they cannot be taken away), and interdependent (civil rights are connected to economic rights). The written analysis should be well-structured, use specific article references, and show evidence of both empathy for affected communities and critical thinking about solutions. Students should recognize that protecting human rights is an ongoing process that requires active citizen participation.",
    discussionPoints: [
      "Why was the Universal Declaration of Human Rights created, and why is it still relevant today?",
      "Which human rights do you think are most frequently challenged in Kenya, and why?",
      "How does the Kenya Constitution protect human rights differently from or similarly to the UDHR?",
      "What role can young people play in promoting and protecting human rights in their communities?"
    ],
    relatedConcepts: [
      "Universal human rights",
      "Constitutional rights",
      "Social justice",
      "International law",
      "Civic responsibility"
    ]
  },

  // --- Globalisation and Trade ---
  {
    name: "Globalisation: Blessing or Curse for Kenya?",
    activityType: "debate",
    grade: "Grade 8",
    learningArea: "Social Studies",
    strand: "Globalisation and Trade",
    aim: "To critically evaluate the positive and negative impacts of globalisation on Kenya's economy, culture, and society through a structured debate.",
    materials: [
      "Articles on globalisation's impact on Kenya",
      "Statistics on Kenya's imports and exports",
      "Examples of multinational companies operating in Kenya",
      "Debate guidelines and scoring rubric",
      "Timer or stopwatch",
      "Notebook for argument preparation",
      "Data on Kenya's GDP growth and trade balance"
    ],
    instructions: [
      "1. As a class, define globalisation and brainstorm examples of how it affects daily life in Kenya (imported goods, social media, international brands, tourism, foreign investment).",
      "2. Divide into two teams: Proposition ('Globalisation is a blessing for Kenya') and Opposition ('Globalisation is a curse for Kenya').",
      "3. Teams spend 15 minutes preparing arguments using the provided materials, organizing points under economic, cultural, and social categories.",
      "4. Proposition presents opening arguments (4 minutes) highlighting benefits such as access to technology, foreign investment, job creation, and cultural exchange.",
      "5. Opposition responds (4 minutes) with arguments about loss of local industries, cultural erosion, economic dependence, and inequality.",
      "6. Both teams engage in 5 minutes of cross-examination, directly questioning each other's evidence and reasoning.",
      "7. Closing statements (2 minutes each), followed by a class vote and a teacher-led debrief emphasizing that the reality involves both benefits and challenges."
    ],
    backgroundInfo: "Globalisation refers to the increasing interconnection of the world's economies, cultures, and populations through trade, technology, migration, and communication. For Kenya, globalisation has brought both significant opportunities and serious challenges. On the positive side, Kenya has become a regional technology hub (often called 'Silicon Savannah'), with innovations like M-Pesa mobile money transforming financial inclusion. Foreign direct investment has created jobs in sectors like manufacturing, services, and horticulture. Kenya's flower industry, which exports to Europe, employs over 500,000 people. Tourism brings in billions of shillings annually. Access to the internet and social media has connected Kenyans to global knowledge and markets. On the negative side, cheap imported goods (particularly clothing and electronics from China) have undermined local manufacturers and artisans. Fast food chains and Western media have influenced dietary habits and cultural practices, raising concerns about cultural erosion. Kenya's trade balance remains negative, meaning the country imports more than it exports, creating economic vulnerability. Additionally, globalisation has widened inequality, with urban areas benefiting more than rural communities. The debate about globalisation is not simply for or against but about how Kenya can maximize benefits while protecting local industries, cultures, and vulnerable populations.",
    expectedOutcome: "Both teams should present well-structured arguments organized under economic, cultural, and social categories, supported by specific examples and data from Kenya. The Proposition should highlight at least three concrete benefits (e.g., M-Pesa, flower exports, tech innovation) with supporting evidence. The Opposition should present at least three specific harms (e.g., collapse of textile industry, cultural homogenization, trade imbalance) with evidence. Students should demonstrate active listening during cross-examination and respond directly to opponents' points rather than repeating their own. After the debate, each student should write a balanced personal position statement (100 words) acknowledging that globalisation has both positive and negative impacts and suggesting one policy that Kenya should adopt to benefit more from globalisation.",
    discussionPoints: [
      "How has technology, particularly M-Pesa, changed the way Kenyans participate in the global economy?",
      "What local industries in Kenya have been negatively affected by cheap imports, and what can be done to protect them?",
      "Is it possible to embrace economic globalisation while preserving Kenyan cultures and traditions?",
      "How can Kenya negotiate better terms in international trade to reduce its trade deficit?",
      "What role does education play in helping Kenyans benefit from globalisation?"
    ],
    relatedConcepts: [
      "Globalisation",
      "International trade",
      "Cultural exchange and erosion",
      "Economic development",
      "Technology and innovation"
    ]
  },

  // --- Globalisation and Trade ---
  {
    name: "Local Market Trade Survey",
    activityType: "field_study",
    grade: "Grade 8",
    learningArea: "Social Studies",
    strand: "Globalisation and Trade",
    aim: "To conduct a field survey of a local market to investigate the origins of products sold and analyze the extent of international trade in everyday Kenyan life.",
    materials: [
      "Survey questionnaire template",
      "Clipboard and pen",
      "Notebook for recording observations",
      "Camera or phone (if allowed) for documentation",
      "Map of the world for marking product origins",
      "Data recording table template",
      "Colored stickers or pins for the map"
    ],
    instructions: [
      "1. Before the field visit, prepare a survey questionnaire with columns for: product name, product type (food, clothing, electronics, household), country of origin, and price range.",
      "2. Visit a local market or shopping area (school tuck shop, nearby kiosk, or supermarket) and survey at least 20 different products.",
      "3. For each product, check the label or packaging to identify the country of origin. Record 'Kenya' for locally produced goods and the specific country for imports.",
      "4. Politely interview 2-3 traders, asking them: where they source their products, what products customers prefer (local or imported), and whether they have noticed changes in trade patterns.",
      "5. Back in class, organize your data by categorizing products as locally produced, regionally imported (from East Africa), or internationally imported.",
      "6. Plot the countries of origin on a world map using colored stickers and calculate the percentage of local versus imported products.",
      "7. Write a field study report (300 words) summarizing your findings, including a data table, the world map, and conclusions about Kenya's trade patterns."
    ],
    backgroundInfo: "Kenya is a trading nation with economic links spanning the globe. A walk through any Kenyan market or supermarket reveals products from dozens of countries: rice from Pakistan and India, electronics from China and Japan, clothing from China and Bangladesh, vehicles from Japan, wheat from Canada, and petroleum from the Middle East. At the same time, Kenya exports significant products including tea (Kenya is the world's largest exporter of black tea), coffee, cut flowers, horticultural products, and increasingly, manufactured goods to the East African Community (EAC) partner states. The balance between imports and exports is crucial for economic health. Kenya's import bill typically exceeds its export earnings, resulting in a trade deficit that puts pressure on the Kenya Shilling. Understanding where everyday products come from helps students grasp abstract economic concepts like international trade, balance of payments, and economic interdependence. The field study approach makes these concepts tangible by connecting classroom learning to the real-world economy that students interact with daily. Local markets in Kenya are microcosms of global trade, where Chinese textiles sit alongside Kenyan-grown vegetables and Tanzanian fish.",
    expectedOutcome: "Students should produce a comprehensive field study report containing a completed survey of at least 20 products with accurate country-of-origin data, a categorized data table showing the breakdown of local versus imported products, and a world map with product origins marked. The report should include quantitative findings (e.g., '60% of products surveyed were imported') and qualitative insights from trader interviews. Students should draw conclusions about Kenya's trade dependencies, identify which product categories are dominated by imports versus local production, and reflect on what this means for Kenya's economy. The report should demonstrate the ability to collect primary data, organize it systematically, and draw evidence-based conclusions about international trade patterns in Kenya.",
    discussionPoints: [
      "What percentage of the products you surveyed were locally produced versus imported? Were you surprised by the result?",
      "Which product categories (food, clothing, electronics) had the highest proportion of imported goods, and why?",
      "What are the consequences for Kenya's economy when the country imports more than it exports?",
      "How could Kenya reduce its dependence on imported goods in specific categories?"
    ],
    relatedConcepts: [
      "International trade",
      "Imports and exports",
      "Trade balance and deficit",
      "Primary data collection",
      "Economic interdependence"
    ]
  },

  // ═══════════════════════════════════════════════════
  // GRADE 9 — Social Studies
  // Strands: Global Issues, International Organisations, Conflict and Peace
  // ═══════════════════════════════════════════════════

  // --- Global Issues ---
  {
    name: "Climate Change Impact in Kenya",
    activityType: "research",
    grade: "Grade 9",
    learningArea: "Social Studies",
    strand: "Global Issues",
    aim: "To research and document the effects of climate change on agriculture, wildlife, and weather patterns in Kenya.",
    materials: [
      "Research articles on climate change in Kenya",
      "Kenya Meteorological Department data summaries",
      "Maps showing rainfall pattern changes in Kenya",
      "Photographs of climate change effects (drought, floods, glacier retreat on Mt. Kenya)",
      "A4 paper and colored pens",
      "Computer or tablet with internet access (if available)",
      "Research report template"
    ],
    instructions: [
      "1. Read the provided materials on climate change, focusing on how global warming affects Kenya specifically.",
      "2. In groups of three, choose one research focus: (a) effects on agriculture and food security, (b) effects on wildlife and ecosystems, or (c) effects on weather patterns and water resources.",
      "3. For your chosen focus, research at least four specific effects with evidence from Kenya. For example, if studying agriculture, investigate drought impacts in Turkana, changing tea-growing zones, maize crop failures, and pastoralist challenges.",
      "4. Create a cause-and-effect diagram showing how global temperature rise leads to specific consequences in your focus area in Kenya.",
      "5. Research and document at least two adaptation strategies that Kenyan communities or the government are implementing to address climate change impacts.",
      "6. Compile your findings into a structured research report with an introduction, findings section, adaptation strategies, and conclusion.",
      "7. Present your group's findings to the class using visual aids (diagrams, maps, photographs)."
    ],
    backgroundInfo: "Climate change is one of the most pressing global challenges, and Kenya is particularly vulnerable despite contributing less than 0.1% of global greenhouse gas emissions. Rising temperatures and changing rainfall patterns are already affecting millions of Kenyans. In agriculture, which employs about 40% of the population and contributes 33% of GDP, unpredictable rainfall has led to crop failures, food insecurity, and rising food prices. The traditionally reliable long rains (March-May) and short rains (October-December) have become erratic, with some regions experiencing devastating droughts while others face unprecedented flooding. Kenya's iconic wildlife is also under threat: shrinking habitats, drying water sources, and changing vegetation patterns affect species from elephants in Amboseli to flamingos in Lake Nakuru, whose numbers have declined as lake chemistry changes. Mt. Kenya's glaciers, which have lost over 80% of their ice since 1900, may disappear entirely within decades, threatening water supplies for millions who depend on rivers fed by glacial melt. The Kenyan government has developed a National Climate Change Action Plan and committed to achieving 100% renewable energy, but implementation challenges remain. Community-based adaptation strategies, such as drought-resistant crops, water harvesting, and conservation agriculture, offer practical solutions.",
    expectedOutcome: "Each group should produce a detailed research report of at least 500 words covering their assigned focus area with specific evidence from Kenya. The report should include a clear cause-and-effect diagram, at least four well-documented impacts, and two adaptation strategies with examples of their implementation. Students should demonstrate understanding that climate change is a global phenomenon with local consequences, and that Kenya bears a disproportionate impact relative to its emissions. The presentation should use visual aids effectively and show the ability to communicate scientific and social information clearly. Students should move beyond simply listing problems to critically evaluating solutions and proposing actions that individuals, communities, and the government can take.",
    discussionPoints: [
      "Why is Kenya particularly vulnerable to climate change despite producing very little of the world's greenhouse gases?",
      "How has climate change affected food production and food prices in Kenya in recent years?",
      "What traditional knowledge do Kenyan communities have that can help in adapting to climate change?",
      "What can young people in Kenya do to contribute to climate change mitigation and adaptation?",
      "Is it fair that countries like Kenya suffer the most from climate change while contributing the least? What should be done about this?"
    ],
    relatedConcepts: [
      "Climate change and global warming",
      "Environmental sustainability",
      "Food security",
      "Adaptation and mitigation",
      "Environmental justice"
    ]
  },

  // --- Global Issues ---
  {
    name: "Rural to Urban Migration in Nairobi",
    activityType: "case_study",
    grade: "Grade 9",
    learningArea: "Social Studies",
    strand: "Global Issues",
    aim: "To analyze the causes and effects of rural-to-urban migration in Kenya, with Nairobi as a case study.",
    materials: [
      "Population data for Nairobi (1960 to present)",
      "Map of Nairobi showing formal and informal settlements",
      "Case study profiles of rural-to-urban migrants",
      "Photographs of Nairobi's growth and informal settlements",
      "Graph paper for plotting population data",
      "Social Studies textbook section on urbanization"
    ],
    instructions: [
      "1. Study the population data for Nairobi from 1960 to the present and plot a line graph showing the city's population growth over time.",
      "2. Read the case study profiles of three different rural-to-urban migrants and identify their reasons for moving to Nairobi (push factors from rural areas and pull factors to the city).",
      "3. Create a two-column table listing at least five push factors (e.g., lack of employment, poor infrastructure, drought, limited education opportunities) and five pull factors (e.g., jobs, better schools, healthcare, entertainment, perceived better life).",
      "4. Using the map of Nairobi, identify the locations of major informal settlements (Kibera, Mathare, Mukuru) and discuss why these settlements have grown.",
      "5. Analyze the effects of rapid urbanization on Nairobi: list at least three positive effects and three negative effects.",
      "6. Write a case study report (300 words) examining the migration phenomenon, its causes, effects, and possible solutions to the challenges it creates."
    ],
    backgroundInfo: "Nairobi, Kenya's capital, has experienced explosive population growth since independence in 1963. From a population of approximately 350,000 in 1963, the city has grown to over 5 million people today, making it one of Africa's largest and fastest-growing cities. Much of this growth has been driven by rural-to-urban migration, as people move from rural areas seeking better employment, education, healthcare, and living standards. Push factors include limited farmland (due to subdivision and population growth), drought and climate change impacts, lack of rural employment, and inadequate rural infrastructure. Pull factors include Nairobi's position as an economic hub with industries, technology companies, and service sector jobs. However, the city's rapid growth has outpaced infrastructure development and planning. Over 60% of Nairobi's population lives in informal settlements that occupy less than 6% of the city's land area. Kibera, one of Africa's largest informal settlements, houses an estimated 250,000-500,000 people in an area of about 2.5 square kilometres, with limited access to clean water, sanitation, and healthcare. Traffic congestion, air pollution, unemployment, and crime are significant urban challenges. Despite these challenges, Nairobi remains a city of opportunity and innovation, home to a thriving tech sector, vibrant arts scene, and resilient communities that have built social networks and informal economies within settlements.",
    expectedOutcome: "Students should produce a population growth graph accurately plotted from the provided data, a comprehensive push-pull factor analysis table, and a 300-word case study report. The report should demonstrate understanding of the complex causes of rural-to-urban migration (avoiding simplistic explanations), analyze both positive and negative effects on the city and its residents, and propose at least two practical solutions such as rural development to reduce push factors, urban planning improvements, and upgrading of informal settlements. Students should show empathy for migrants while maintaining analytical objectivity. The case study should include specific references to Nairobi's geography, settlements, and development challenges. Students should recognize that urbanization is a global phenomenon and compare Nairobi's experience with that of other rapidly growing cities in Africa.",
    discussionPoints: [
      "What are the main reasons people continue to migrate from rural areas to Nairobi despite the challenges of city life?",
      "How can the government improve conditions in rural areas to reduce the push factors driving migration?",
      "What are the advantages and disadvantages of living in an informal settlement like Kibera compared to a rural village?",
      "How can urban planning help Nairobi accommodate its growing population more sustainably?"
    ],
    relatedConcepts: [
      "Urbanization",
      "Rural-urban migration",
      "Push and pull factors",
      "Informal settlements",
      "Urban planning and development"
    ]
  },

  // --- International Organisations ---
  {
    name: "Is the United Nations Effective in Maintaining World Peace?",
    activityType: "debate",
    grade: "Grade 9",
    learningArea: "Social Studies",
    strand: "International Organisations",
    aim: "To evaluate the effectiveness of the United Nations in maintaining international peace and security through a structured classroom debate.",
    materials: [
      "Overview of the United Nations structure and organs (General Assembly, Security Council, etc.)",
      "Case studies of UN peacekeeping missions (successes and failures)",
      "Statistics on UN peacekeeping operations worldwide",
      "List of UN agencies and their functions (UNICEF, WHO, UNHCR, UNESCO)",
      "Debate rules and scoring criteria",
      "Timer or stopwatch",
      "Notebook for preparing arguments"
    ],
    instructions: [
      "1. As a class, review the structure of the United Nations, focusing on the Security Council's role in maintaining international peace and the General Assembly's function.",
      "2. Divide into two teams: Proposition ('The UN is effective in maintaining world peace') and Opposition ('The UN has failed to maintain world peace').",
      "3. Teams spend 20 minutes preparing arguments, with each team member responsible for one area: (a) peacekeeping missions, (b) humanitarian work, (c) diplomatic negotiations, or (d) structural limitations.",
      "4. Proposition presents opening arguments (4 minutes), citing successful interventions, humanitarian achievements, and diplomatic successes.",
      "5. Opposition responds (4 minutes), citing failures such as Rwanda genocide (1994), Syrian civil war, and the veto power problem in the Security Council.",
      "6. Cross-examination round (5 minutes) where teams question each other's evidence and reasoning directly.",
      "7. Closing statements (2 minutes each), followed by class vote and teacher-led discussion on how the UN can be reformed to be more effective."
    ],
    backgroundInfo: "The United Nations (UN) was established on 24 October 1945, after World War II, with the primary goal of maintaining international peace and security. With 193 member states, the UN is the world's largest intergovernmental organization. Its six main organs include the General Assembly (where all nations have a voice), the Security Council (responsible for peace and security, with five permanent members holding veto power: USA, UK, France, Russia, and China), the International Court of Justice, and the Secretariat led by the Secretary-General. The UN has achieved notable successes: it has deployed over 70 peacekeeping operations since 1948, mediated peace agreements in Mozambique, Cambodia, and El Salvador, and its agencies like UNICEF have saved millions of children's lives through vaccination programmes. The UN played a role in ending apartheid in South Africa and decolonisation across Africa. However, the UN has also faced significant failures and criticisms. It failed to prevent the Rwandan genocide in 1994, where approximately 800,000 people were killed in 100 days. The veto power of the five permanent Security Council members has often paralyzed action, as seen in the Syrian conflict. Critics argue that the Security Council's composition reflects post-World War II power dynamics and does not represent the modern world, with no permanent African member. Kenya has contributed troops to UN peacekeeping missions and has served on the Security Council as a non-permanent member, most recently in 2021-2022.",
    expectedOutcome: "Both teams should present well-researched arguments supported by specific historical examples and data. The Proposition should highlight UN successes in peacekeeping, humanitarian work (UNICEF, WHO, UNHCR), standard-setting (UDHR, climate agreements), and diplomacy. The Opposition should present evidence of failures including specific conflicts where the UN was unable to act, the structural problem of the veto power, funding challenges, and slow response times. Both teams should reference Kenya's relationship with the UN. After the debate, students should write a balanced evaluation (200 words) assessing the UN's overall effectiveness and proposing at least one specific reform that would make the organization more effective, demonstrating that they can evaluate complex institutions with nuance rather than absolute judgments.",
    discussionPoints: [
      "Why was the United Nations created, and how does its structure reflect the power dynamics of 1945?",
      "Should the five permanent members of the Security Council continue to hold veto power? Why or why not?",
      "Should Africa have a permanent seat on the Security Council? What difference would it make?",
      "Can you identify a UN peacekeeping mission that was successful and one that failed? What made the difference?",
      "How has Kenya contributed to and benefited from the United Nations?"
    ],
    relatedConcepts: [
      "International organizations",
      "Peacekeeping and conflict resolution",
      "Global governance",
      "Sovereignty and intervention",
      "Reform of international institutions"
    ]
  },

  // --- Conflict and Peace ---
  {
    name: "Conflict Resolution in the Horn of Africa",
    activityType: "case_study",
    grade: "Grade 9",
    learningArea: "Social Studies",
    strand: "Conflict and Peace",
    aim: "To analyze a specific conflict in the Horn of Africa, examining its causes, consequences, and the methods used to pursue resolution and peace.",
    materials: [
      "Map of the Horn of Africa (Kenya, Somalia, Ethiopia, Eritrea, Djibouti, South Sudan, Sudan, Uganda)",
      "Case study materials on the Somalia conflict or South Sudan conflict",
      "Timeline of key events in the selected conflict",
      "Articles on peace-building efforts and regional mediation",
      "Conflict analysis framework template",
      "A4 paper and colored pens"
    ],
    instructions: [
      "1. Study the map of the Horn of Africa and identify the countries in the region. Note the strategic location of the Horn at the intersection of Africa, the Middle East, and the Indian Ocean.",
      "2. Read the provided case study on the selected conflict (Somalia or South Sudan), identifying the key parties involved, the root causes, and the timeline of major events.",
      "3. Using the conflict analysis framework, categorize the causes into: (a) political causes, (b) economic causes, (c) social/ethnic causes, and (d) external influences.",
      "4. Document the consequences of the conflict on civilians, including displacement, food insecurity, loss of education, and human rights violations.",
      "5. Research the peace-building efforts: identify which organizations (African Union, IGAD, UN) and methods (negotiation, mediation, peacekeeping forces) have been used.",
      "6. Evaluate the effectiveness of these peace-building efforts: what has worked, what has not, and what lessons can be learned?",
      "7. Write a comprehensive case study report (400 words) that includes your analysis and at least two recommendations for sustainable peace in the region."
    ],
    backgroundInfo: "The Horn of Africa is one of the most conflict-affected regions in the world. The region encompasses eight countries at the northeastern tip of Africa, occupying a strategically important location at the crossroads of Africa, the Middle East, and Asia. Conflicts in the Horn have complex, interconnected causes including colonial-era boundary disputes, competition for scarce resources (water, pastureland), ethnic and clan tensions, political power struggles, and external intervention by global and regional powers. Somalia has experienced civil conflict since the collapse of the central government in 1991, leading to decades of instability, the rise of Al-Shabaab militant group, and one of the world's worst humanitarian crises, with millions displaced internally and as refugees in neighbouring countries including Kenya (Dadaab refugee camp is one of the world's largest). South Sudan, the world's newest country (independent since 2011), descended into civil war in 2013, causing massive displacement and famine. Kenya has been directly affected by regional conflicts through refugee influxes, cross-border insecurity, and terrorist attacks linked to Al-Shabaab. However, the Horn has also seen positive peace-building efforts: the Intergovernmental Authority on Development (IGAD), based in Djibouti, has mediated peace talks for Somalia and South Sudan. The historic 2018 peace agreement between Ethiopia and Eritrea, which ended 20 years of hostility, demonstrated that reconciliation is possible even after prolonged conflict.",
    expectedOutcome: "Students should produce a comprehensive case study report that demonstrates deep understanding of the selected conflict. The report should include a completed conflict analysis framework identifying at least three political, economic, social, and external causes; a clear documentation of the conflict's humanitarian consequences with specific data (numbers of displaced people, casualties, refugees); an evaluation of at least two peace-building efforts with assessment of their effectiveness; and two or more original recommendations for sustainable peace. Students should demonstrate the ability to analyze conflict objectively without taking sides, show understanding that conflicts usually have multiple interconnected causes rather than a single trigger, and recognize the importance of regional cooperation in peace-building. The case study should reference Kenya's role in and experience with the conflict.",
    discussionPoints: [
      "Why has the Horn of Africa experienced so many conflicts since independence? Are the causes mainly internal or external?",
      "How has the conflict in Somalia affected Kenya, and what has Kenya done in response?",
      "What role should regional organizations like IGAD and the African Union play in resolving conflicts in the Horn of Africa?",
      "What can we learn from the 2018 Ethiopia-Eritrea peace agreement about resolving long-standing conflicts?",
      "How do conflicts affect the education and future prospects of children and young people in the region?"
    ],
    relatedConcepts: [
      "Conflict analysis",
      "Peace-building and reconciliation",
      "Regional cooperation",
      "Humanitarian crises",
      "Causes and consequences of conflict"
    ]
  }
];

async function main() {
  console.log("📚 Seeding Social Studies activities...");

  // Delete existing social studies activities
  const deleted = await prisma.socialStudiesActivity.deleteMany({});
  console.log(`🗑️  Deleted ${deleted.count} existing social studies activities`);

  // Get grade and learning area IDs
  const grades = await prisma.grade.findMany();
  const learningAreas = await prisma.learningArea.findMany({
    include: { grade: true, strands: true }
  });

  let seededCount = 0;

  for (const activity of activities) {
    // Find matching grade
    const grade = grades.find(g => g.name === activity.grade);
    if (!grade) {
      console.log(`⚠️  Grade not found: ${activity.grade} - skipping activity: ${activity.name}`);
      continue;
    }

    // Find matching learning area
    const learningArea = learningAreas.find(
      la => la.name === activity.learningArea && la.gradeId === grade.id
    );
    if (!learningArea) {
      console.log(`⚠️  Learning area not found: ${activity.learningArea} for ${activity.grade} - skipping: ${activity.name}`);
      continue;
    }

    // Find matching strand (optional)
    const strand = learningArea.strands.find(s => s.name === activity.strand);

    // Create activity
    await prisma.socialStudiesActivity.create({
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
        discussionPoints: activity.discussionPoints,
        relatedConcepts: activity.relatedConcepts,
        sloIds: []
      }
    });

    seededCount++;
    console.log(`✅ Seeded: ${activity.name} (${activity.activityType} - ${activity.grade})`);
  }

  console.log(`\n🎉 Successfully seeded ${seededCount} Social Studies activities!`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding Social Studies activities:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
