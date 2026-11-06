/**
 * Curriculum and Progression Roadmap strictly aligned with Pearson Global Scale of English (GSE).
 * Junior High School (Grades 7–9 / Ages 12–15) | GSE Range: 30 to 58 (CEFR A1+ to B1).
 * Includes both Core Grammar Mechanics and Genre-Based Text Types (Descriptive, Recount, Narrative, Procedure, Report).
 */

export type CEFRLevel = 'A1+' | 'A2' | 'A2+' | 'B1';
export type GameModeType = 'word_train' | 'time_traveler' | 'grammar_detective';
export type TopicCategory = 'grammar' | 'text_genre';

export interface ScrambleQuestion {
  id: string;
  type: 'word_train';
  prompt: string;
  scrambledWords: string[];
  correctSentence: string;
  hint: string;
  explanation: string;
}

export interface TimeTravelerQuestion {
  id: string;
  type: 'time_traveler';
  sentenceWithBlank: string;
  timeSignal: string;
  options: string[];
  correctAnswer: string;
  tenseName: string;
  explanation: string;
}

export interface DetectiveQuestion {
  id: string;
  type: 'grammar_detective';
  sentence: string; // e.g. "She don't like apples."
  words: string[]; // ['She', "don't", 'like', 'apples.']
  errorIndex: number; // index of wrong word
  wrongWord: string; // "don't"
  correctionOptions: string[]; // ["doesn't", "is not", "didn't"]
  correctFix: string; // "doesn't"
  caseTitle: string; // "The Subject-Verb Agreement Mystery"
  ruleExplanation: string;
}

export type TopicQuestion = ScrambleQuestion | TimeTravelerQuestion | DetectiveQuestion;

export interface GenreModelParagraph {
  stage: string; // e.g. "Identification", "Description", "Orientation", "Complication", "Resolution", "Goal", "Materials", "Steps", "General Classification"
  text: string;
}

export interface GenreModelText {
  title: string;
  paragraphs: GenreModelParagraph[];
}

export interface GenreDetails {
  socialFunction: string;
  genericStructure: string[];
  languageFeatures: string[];
  modelText?: GenreModelText;
}

export interface Topic {
  id: string;
  worldId: 1 | 2 | 3;
  grade: 'Grade 7' | 'Grade 8' | 'Grade 9';
  title: string;
  slug: string;
  category: TopicCategory;
  gseRange: [number, number]; // e.g. [32, 38]
  cefr: CEFRLevel;
  canDoDescriptor: string;
  ruleSummary: string;
  genreDetails?: GenreDetails;
  examples: { correct: string; incorrect: string; note: string }[];
  questions: TopicQuestion[];
}

export interface World {
  id: 1 | 2 | 3;
  name: string;
  subtitle: string;
  grade: 'Grade 7' | 'Grade 8' | 'Grade 9';
  gseLabel: string;
  gseMin: number;
  gseMax: number;
  cefrRange: string;
  themeColor: {
    primary: string;
    light: string;
    accent: string;
    border: string;
  };
  topics: Topic[];
}

export const CURRICULUM_WORLDS: World[] = [
  {
    id: 1,
    name: "Foundation Explorer",
    subtitle: "Grade 7 · GSE 30–42 (CEFR A1+ to A2)",
    grade: "Grade 7",
    gseLabel: "GSE 30–42",
    gseMin: 30,
    gseMax: 42,
    cefrRange: "A1+ to A2",
    themeColor: {
      primary: "emerald-600",
      light: "emerald-50",
      accent: "emerald-500",
      border: "emerald-400",
    },
    topics: [
      {
        id: "w1-t1",
        worldId: 1,
        grade: "Grade 7",
        title: "Simple Present vs. Present Continuous",
        slug: "present-simple-vs-continuous",
        category: "grammar",
        gseRange: [32, 36],
        cefr: "A1+",
        canDoDescriptor: "Can distinguish between routines/habits and actions happening at the moment of speaking (GSE 34).",
        ruleSummary: "Use Simple Present for daily routines, facts, and habits (e.g., 'I study English every day'). Use Present Continuous (am/is/are + verb-ing) for actions happening right now or temporary situations (e.g., 'I am studying right now').",
        examples: [
          { correct: "Lucas usually walks to school.", incorrect: "Lucas is usually walking to school.", note: "'Usually' indicates a repeated habit (Simple Present)." },
          { correct: "Listen! The birds are singing.", incorrect: "Listen! The birds sing.", note: "'Listen!' signals an action happening right at this moment." },
        ],
        questions: [
          {
            id: "w1-t1-q1",
            type: "word_train",
            prompt: "Arrange the train cars to say what Lucas is doing right now:",
            scrambledWords: ["is", "Lucas", "playing", "guitar", "the", "now"],
            correctSentence: "Lucas is playing the guitar now",
            hint: "Subject + is/are + verb-ing + object + time word.",
            explanation: "In Present Continuous, 'Lucas' takes 'is' followed by the verb-ing 'playing'.",
          },
          {
            id: "w1-t1-q2",
            type: "time_traveler",
            sentenceWithBlank: "Right now, Maya ___ her favorite comic book in the library.",
            timeSignal: "Right now",
            options: ["is reading", "reads", "read", "reading"],
            correctAnswer: "is reading",
            tenseName: "Present Continuous",
            explanation: "'Right now' indicates an action occurring this instant, requiring 'is reading'.",
          },
          {
            id: "w1-t1-q3",
            type: "grammar_detective",
            sentence: "Ethan study science every Monday morning.",
            words: ["Ethan", "study", "science", "every", "Monday", "morning."],
            errorIndex: 1,
            wrongWord: "study",
            correctionOptions: ["studies", "is studying", "studied"],
            correctFix: "studies",
            caseTitle: "Third-Person Singular Glitch",
            ruleExplanation: "For third-person singular (he/she/Ethan) in the Simple Present, add -s or -es: 'Ethan studies'.",
          },
          {
            id: "w1-t1-q4",
            type: "time_traveler",
            sentenceWithBlank: "Cats usually ___ during the daytime to save energy.",
            timeSignal: "usually",
            options: ["sleep", "are sleeping", "sleeps", "is sleeping"],
            correctAnswer: "sleep",
            tenseName: "Simple Present",
            explanation: "'Usually' describes a general truth or habit. Plural subject 'Cats' takes base verb 'sleep'.",
          },
          {
            id: "w1-t1-q5",
            type: "word_train",
            prompt: "Construct a correct question about routines:",
            scrambledWords: ["Do", "you", "breakfast", "eat", "every", "morning?"],
            correctSentence: "Do you eat breakfast every morning?",
            hint: "Questions in Simple Present start with Do/Does.",
            explanation: "Question formula: Do + subject (you) + base verb (eat) + complement.",
          },
        ],
      },
      {
        id: "w1-t2",
        worldId: 1,
        grade: "Grade 7",
        title: "Pronouns (Subject, Object & Possessive)",
        slug: "pronouns-subject-object-possessive",
        category: "grammar",
        gseRange: [30, 35],
        cefr: "A1+",
        canDoDescriptor: "Can accurately use basic personal pronouns (I/me/mine, he/him/his) in short dialogues (GSE 32).",
        ruleSummary: "Subject pronouns (I, you, he, she, it, we, they) do the action. Object pronouns (me, you, him, her, it, us, them) receive the action. Possessive adjectives (my, your, his, her, its, our, their) show ownership before a noun.",
        examples: [
          { correct: "She gave him her notebook.", incorrect: "Her gave he she notebook.", note: "Subject 'She', Object 'him', Possessive 'her notebook'." },
        ],
        questions: [
          {
            id: "w1-t2-q1",
            type: "word_train",
            prompt: "Assemble the sentence with the correct pronoun order:",
            scrambledWords: ["Mr. Harris", "gave", "us", "our", "homework", "yesterday"],
            correctSentence: "Mr. Harris gave us our homework yesterday",
            hint: "Subject (Mr. Harris) + Verb (gave) + Object pronoun (us) + Possessive (our) noun.",
            explanation: "'us' is the indirect object pronoun receiving the homework; 'our' shows ownership.",
          },
          {
            id: "w1-t2-q2",
            type: "grammar_detective",
            sentence: "Can you help he carry those heavy science boxes?",
            words: ["Can", "you", "help", "he", "carry", "those", "boxes?"],
            errorIndex: 3,
            wrongWord: "he",
            correctionOptions: ["him", "his", "himself"],
            correctFix: "him",
            caseTitle: "The Displaced Subject Pronoun",
            ruleExplanation: "After a verb ('help'), use the object pronoun 'him', not the subject pronoun 'he'.",
          },
          {
            id: "w1-t2-q3",
            type: "time_traveler",
            sentenceWithBlank: "Emma left her pencil on the desk, so Liam gave it back to ___.",
            timeSignal: "back to",
            options: ["her", "she", "hers", "herself"],
            correctAnswer: "her",
            tenseName: "Pronoun Case",
            explanation: "Prepositions ('to') are always followed by object pronouns ('her').",
          },
          {
            id: "w1-t2-q4",
            type: "word_train",
            prompt: "Assemble a sentence describing ownership:",
            scrambledWords: ["This", "is", "their", "new", "school", "project"],
            correctSentence: "This is their new school project",
            hint: "Start with 'This is' followed by possessive adjective.",
            explanation: "'their' modifies the noun phrase 'new school project'.",
          },
        ],
      },
      {
        id: "w1-t3",
        worldId: 1,
        grade: "Grade 7",
        title: "Prepositions of Time & Place",
        slug: "prepositions-time-place",
        category: "grammar",
        gseRange: [34, 40],
        cefr: "A2",
        canDoDescriptor: "Can use basic prepositions of time (at, in, on) and place (at, in, on, behind) correctly (GSE 36).",
        ruleSummary: "Time: 'at' for precise times (at 3:00, at noon); 'on' for days and dates (on Friday, on July 4th); 'in' for longer periods (in July, in 2026, in the morning). Place: 'at' for specific points (at the door); 'in' for enclosed spaces (in the room); 'on' for surfaces (on the table).",
        examples: [
          { correct: "The science club meets on Wednesday at 4 PM.", incorrect: "The science club meets in Wednesday in 4 PM.", note: "Use 'on' for days of the week, 'at' for clock times." },
        ],
        questions: [
          {
            id: "w1-t3-q1",
            type: "time_traveler",
            sentenceWithBlank: "Our final English exam will begin ___ 8:30 AM tomorrow.",
            timeSignal: "8:30 AM",
            options: ["at", "in", "on", "to"],
            correctAnswer: "at",
            tenseName: "Preposition of Time",
            explanation: "Exact clock times always require the preposition 'at' (e.g. at 8:30 AM).",
          },
          {
            id: "w1-t3-q2",
            type: "grammar_detective",
            sentence: "We usually visit our grandparents in Sunday afternoons.",
            words: ["We", "usually", "visit", "our", "grandparents", "in", "Sunday", "afternoons."],
            errorIndex: 5,
            wrongWord: "in",
            correctionOptions: ["on", "at", "during"],
            correctFix: "on",
            caseTitle: "Day of the Week Trap",
            ruleExplanation: "Days of the week ('Sunday') require 'on', even when followed by 'afternoons': 'on Sunday afternoons'.",
          },
          {
            id: "w1-t3-q3",
            type: "word_train",
            prompt: "Build a sentence showing where the books are:",
            scrambledWords: ["The", "dictionary", "is", "on", "the", "top", "shelf"],
            correctSentence: "The dictionary is on the top shelf",
            hint: "Subject + verb + preposition + noun phrase.",
            explanation: "Use 'on' for items resting on a surface or shelf.",
          },
          {
            id: "w1-t3-q4",
            type: "time_traveler",
            sentenceWithBlank: "The school sports festival is held ___ October every year.",
            timeSignal: "October",
            options: ["in", "on", "at", "by"],
            correctAnswer: "in",
            tenseName: "Preposition of Time",
            explanation: "Months without a specific calendar date take 'in' (e.g., in October).",
          },
        ],
      },
      {
        id: "w1-t4",
        worldId: 1,
        grade: "Grade 7",
        title: "Adverbs of Frequency",
        slug: "adverbs-of-frequency",
        category: "grammar",
        gseRange: [36, 42],
        cefr: "A2",
        canDoDescriptor: "Can describe frequency of habits and routines using common adverbs (always, often, sometimes, never) (GSE 39).",
        ruleSummary: "Adverbs of frequency go BEFORE the main verb (e.g., 'She often reads'), but AFTER the verb 'to be' (e.g., 'He is always on time'). With auxiliary verbs, place between auxiliary and main verb (e.g., 'They have never seen').",
        examples: [
          { correct: "Leo is always cheerful in class.", incorrect: "Leo always is cheerful in class.", note: "Place frequency adverb AFTER the verb 'to be'." },
          { correct: "We never arrive late for assembly.", incorrect: "We arrive never late for assembly.", note: "Place frequency adverb BEFORE main action verbs." },
        ],
        questions: [
          {
            id: "w1-t4-q1",
            type: "word_train",
            prompt: "Put the frequency adverb in the correct syntactic spot:",
            scrambledWords: ["Sophia", "always", "finishes", "her", "homework", "before", "dinner"],
            correctSentence: "Sophia always finishes her homework before dinner",
            hint: "The adverb 'always' belongs right before the main action verb 'finishes'.",
            explanation: "Adverbs of frequency precede normal action verbs: Subject + always + finishes.",
          },
          {
            id: "w1-t4-q2",
            type: "grammar_detective",
            sentence: "Daniel eats rarely fast food because he prefers healthy vegetables.",
            words: ["Daniel", "eats", "rarely", "fast", "food", "because", "he", "prefers", "vegetables."],
            errorIndex: 2,
            wrongWord: "rarely",
            correctionOptions: ["rarely eats", "is rarely", "rare eats"],
            correctFix: "rarely eats",
            caseTitle: "Misplaced Adverb Position",
            ruleExplanation: "The adverb 'rarely' must come before the main verb 'eats': 'Daniel rarely eats fast food'.",
          },
          {
            id: "w1-t4-q3",
            type: "time_traveler",
            sentenceWithBlank: "Our teacher ___ very patient when students ask questions.",
            timeSignal: "always + is",
            options: ["is always", "always is", "is often", "always"],
            correctAnswer: "is always",
            tenseName: "Adverb Placement with 'To Be'",
            explanation: "With the verb 'to be', the adverb of frequency comes AFTER the verb: 'is always'.",
          },
        ],
      },
      {
        id: "w1-t5",
        worldId: 1,
        grade: "Grade 7",
        title: "Imperative Verbs: Commands & Recipes",
        slug: "imperative-verbs",
        category: "grammar",
        gseRange: [38, 42],
        cefr: "A2",
        canDoDescriptor: "Can understand and give short, direct instructions and procedural steps (GSE 41).",
        ruleSummary: "Imperatives use the base form of the verb without a subject pronoun (e.g., 'Turn off the lights'). For negative commands, put 'Don't' + base verb (e.g., 'Don't run in the corridor!'). Common in recipes, lab safety, and directions.",
        examples: [
          { correct: "Mix the sugar and butter until creamy.", incorrect: "Mixing the sugar and butter until creamy.", note: "Use bare infinitive for commands." },
          { correct: "Don't open the door while the experiment is running.", incorrect: "No open the door...", note: "Negative imperative begins with 'Don't'." },
        ],
        questions: [
          {
            id: "w1-t5-q1",
            type: "word_train",
            prompt: "Arrange the recipe step into a clear command:",
            scrambledWords: ["Add", "two", "eggs", "and", "stir", "well"],
            correctSentence: "Add two eggs and stir well",
            hint: "Start directly with the base verb 'Add'.",
            explanation: "Imperatives start directly with the bare base verb without any subject pronoun.",
          },
          {
            id: "w1-t5-q2",
            type: "grammar_detective",
            sentence: "Please you do not forget your lab safety goggles.",
            words: ["Please", "you", "do", "not", "forget", "your", "safety", "goggles."],
            errorIndex: 1,
            wrongWord: "you",
            correctionOptions: ["(remove 'you')", "he", "they"],
            correctFix: "(remove 'you')",
            caseTitle: "Unwanted Subject Pronoun",
            ruleExplanation: "Imperatives have an implied subject ('you'). Do not write 'you': 'Please do not forget your goggles'.",
          },
          {
            id: "w1-t5-q3",
            type: "time_traveler",
            sentenceWithBlank: "___ right at the corner and walk straight for two blocks.",
            timeSignal: "Direction command",
            options: ["Turn", "Turns", "Turning", "Turned"],
            correctAnswer: "Turn",
            tenseName: "Imperative Form",
            explanation: "Directions use the base infinitive form of the verb: 'Turn right'.",
          },
        ],
      },
      {
        id: "w1-t6",
        worldId: 1,
        grade: "Grade 7",
        title: "Descriptive Text: People, Places & Things",
        slug: "descriptive-text-grade-7",
        category: "text_genre",
        gseRange: [35, 41],
        cefr: "A2",
        canDoDescriptor: "Can identify specific descriptions of appearance, personality, and features of people, animals, and places in simple descriptive texts (GSE 38).",
        ruleSummary: "Descriptive text describes a specific person, animal, place, or object in vivid detail. Its generic structure consists of: 1. Identification (introducing the subject); 2. Description (elaborating physical qualities, traits, habits, or features). Key language features: Simple Present Tense, specific nouns, descriptive adjectives, and sensory verbs.",
        genreDetails: {
          socialFunction: "To describe a particular person, animal, place, or thing by detailing its specific physical attributes, behavior, and unique characteristics.",
          genericStructure: [
            "1. Identification: Introduces the specific person, animal, or object being described.",
            "2. Description: Depicts parts, qualities, physical appearance, personality traits, or routines."
          ],
          languageFeatures: [
            "Focus on specific participants (e.g., 'My cat Mochi', 'Borobudur Temple', NOT cats in general).",
            "Use of the Simple Present Tense to describe enduring qualities.",
            "Rich descriptive adjectives (fluffy, crystalline, energetic, majestic).",
            "Sensory imagery appeal (sight, sound, touch, scent)."
          ],
          modelText: {
            title: "My Playful Persian Cat, Mochi",
            paragraphs: [
              {
                stage: "Identification",
                text: "I have a lovely Persian pet cat named Mochi. My sister and I adopted him from a pet sanctuary last summer, and he has become the heart of our household."
              },
              {
                stage: "Description (Physical)",
                text: "Mochi has a round flat face, sparkling sapphire-blue eyes, and thick, snow-white fur that feels like soft cotton candy. His tiny pink nose and bushy tail make him look adorable whenever he strolls across the living room."
              },
              {
                stage: "Description (Habits & Personality)",
                text: "Mochi is very energetic and affectionate. Every morning, he nudges my cheek to wake me up for breakfast. When he is relaxed, he curls up on my lap and purrs softly until he drifts off to sleep."
              }
            ]
          }
        },
        examples: [
          { correct: "My school library is spacious, clean, and full of fascinating novels.", incorrect: "My school library was spacious, clean, and full...", note: "Descriptive text uses Simple Present because the place continues to exist and possess these attributes." },
          { correct: "She has long curly brown hair and a charming smile.", incorrect: "She has hair long curly brown...", note: "In English, descriptive adjectives precede the noun they modify (Opinion -> Size -> Shape -> Color)." }
        ],
        questions: [
          {
            id: "w1-t6-q1",
            type: "word_train",
            prompt: "Assemble the opening Identification sentence of a descriptive text:",
            scrambledWords: ["My", "Persian", "cat", "Mochi", "has", "soft", "snow-white", "fur"],
            correctSentence: "My Persian cat Mochi has soft snow-white fur",
            hint: "Specific noun phrase + has + adjectives + noun.",
            explanation: "Descriptive texts begin by identifying specific participants with vivid adjectives before nouns."
          },
          {
            id: "w1-t6-q2",
            type: "time_traveler",
            sentenceWithBlank: "Borobudur Temple ___ thousands of international travelers every year due to its majestic stone carvings.",
            timeSignal: "Descriptive Present Fact",
            options: ["attracts", "attracted", "is attracting", "attract"],
            correctAnswer: "attracts",
            tenseName: "Simple Present (Descriptive)",
            explanation: "Descriptive texts use the Simple Present for enduring factual qualities of places: 'Borobudur attracts'."
          },
          {
            id: "w1-t6-q3",
            type: "grammar_detective",
            sentence: "My pet rabbit, Coco, have long fluffy ears and twitchy whiskers.",
            words: ["My", "rabbit,", "Coco,", "have", "long", "fluffy", "ears", "and", "whiskers."],
            errorIndex: 3,
            wrongWord: "have",
            correctionOptions: ["has", "is having", "had"],
            correctFix: "has",
            caseTitle: "Descriptive Subject-Verb Disconnect",
            ruleExplanation: "Singular subject 'My pet rabbit, Coco' requires 'has', not 'have': 'Coco has long fluffy ears'."
          }
        ]
      }
    ],
  },
  {
    id: 2,
    name: "Grammar Adventurer",
    subtitle: "Grade 8 · GSE 40–50 (CEFR A2 to A2+)",
    grade: "Grade 8",
    gseLabel: "GSE 40–50",
    gseMin: 40,
    gseMax: 50,
    cefrRange: "A2 to A2+",
    themeColor: {
      primary: "sky-600",
      light: "sky-50",
      accent: "sky-500",
      border: "sky-400",
    },
    topics: [
      {
        id: "w2-t1",
        worldId: 2,
        grade: "Grade 8",
        title: "Simple Past: Regular & Irregular Verbs",
        slug: "simple-past-verbs",
        category: "grammar",
        gseRange: [40, 45],
        cefr: "A2",
        canDoDescriptor: "Can narrate past events using a mix of common regular and irregular past tense verbs (GSE 43).",
        ruleSummary: "Regular verbs add -ed (play -> played, watch -> watched). Irregular verbs change completely (go -> went, see -> saw, buy -> bought, write -> wrote). Time signals: yesterday, last week, in 2024, two days ago. In negatives and questions, use did/didn't + BASE form!",
        examples: [
          { correct: "She bought a new jacket yesterday.", incorrect: "She buyed a new jacket yesterday.", note: "'Buy' is irregular (bought)." },
          { correct: "Did you see the match last night?", incorrect: "Did you saw the match last night?", note: "After 'did', use the base verb 'see', not 'saw'." },
        ],
        questions: [
          {
            id: "w2-t1-q1",
            type: "time_traveler",
            sentenceWithBlank: "Two days ago, our class ___ the historic natural science museum.",
            timeSignal: "Two days ago",
            options: ["visited", "visits", "is visiting", "visiting"],
            correctAnswer: "visited",
            tenseName: "Simple Past (Regular)",
            explanation: "'Two days ago' signals completed past time, requiring past tense 'visited'.",
          },
          {
            id: "w2-t1-q2",
            type: "grammar_detective",
            sentence: "We didn't went to the park because of the heavy rain.",
            words: ["We", "didn't", "went", "to", "the", "park", "because", "of", "rain."],
            errorIndex: 2,
            wrongWord: "went",
            correctionOptions: ["go", "gone", "going"],
            correctFix: "go",
            caseTitle: "Double Past Tense Collision",
            ruleExplanation: "After the auxiliary 'didn't', the main verb must revert to its base form: 'didn't go', not 'didn't went'.",
          },
          {
            id: "w2-t1-q3",
            type: "word_train",
            prompt: "Sequence the past narrative sentence correctly:",
            scrambledWords: ["Chloe", "wrote", "an", "exciting", "short", "story", "yesterday"],
            correctSentence: "Chloe wrote an exciting short story yesterday",
            hint: "Subject + irregular past verb (wrote) + adjective phrase + time marker.",
            explanation: "'wrote' is the irregular past tense of 'write'.",
          },
          {
            id: "w2-t1-q4",
            type: "time_traveler",
            sentenceWithBlank: "My uncle ___ a fantastic antique bicycle last Saturday.",
            timeSignal: "last Saturday",
            options: ["bought", "buys", "buyed", "is buying"],
            correctAnswer: "bought",
            tenseName: "Simple Past (Irregular)",
            explanation: "'Last Saturday' requires the past tense of 'buy', which is irregularly conjugated as 'bought'.",
          },
        ],
      },
      {
        id: "w2-t2",
        worldId: 2,
        grade: "Grade 8",
        title: "Past Continuous (Interrupted Actions)",
        slug: "past-continuous",
        category: "grammar",
        gseRange: [43, 48],
        cefr: "A2+",
        canDoDescriptor: "Can describe background activities interrupted by a sudden event in the past using 'while' and 'when' (GSE 45).",
        ruleSummary: "Form: was/were + verb-ing. Used for actions in progress in the past. Interrupted actions rule: 'While I was doing homework (long background action), the phone rang (short completed action)'.",
        examples: [
          { correct: "They were playing football when it started to rain.", incorrect: "They played football when it was starting to rain.", note: "Continuous action in progress (were playing) interrupted by sudden event (started)." },
        ],
        questions: [
          {
            id: "w2-t2-q1",
            type: "time_traveler",
            sentenceWithBlank: "While I ___ for the school bus, I saw a bright shooting star.",
            timeSignal: "While I ... (background)",
            options: ["was waiting", "waited", "am waiting", "wait"],
            correctAnswer: "was waiting",
            tenseName: "Past Continuous",
            explanation: "The clause with 'While' describes an action in progress in the past: 'was waiting'.",
          },
          {
            id: "w2-t2-q2",
            type: "grammar_detective",
            sentence: "The students was studying quietly when the fire alarm rang.",
            words: ["The", "students", "was", "studying", "quietly", "when", "alarm", "rang."],
            errorIndex: 2,
            wrongWord: "was",
            correctionOptions: ["were", "are", "been"],
            correctFix: "were",
            caseTitle: "Plural Subject Mismatch",
            ruleExplanation: "Plural subject 'The students' requires 'were studying', not 'was studying'.",
          },
          {
            id: "w2-t2-q3",
            type: "word_train",
            prompt: "Assemble the interrupted action sentence:",
            scrambledWords: ["He", "was", "cooking", "dinner", "when", "the", "lights", "went", "out"],
            correctSentence: "He was cooking dinner when the lights went out",
            hint: "Ongoing past action + 'when' + short interrupted past event.",
            explanation: "He was cooking dinner (Past Continuous) when the lights went out (Simple Past).",
          },
        ],
      },
      {
        id: "w2-t3",
        worldId: 2,
        grade: "Grade 8",
        title: "Degree of Comparison (Adjectives)",
        slug: "comparatives-and-superlatives",
        category: "grammar",
        gseRange: [42, 47],
        cefr: "A2+",
        canDoDescriptor: "Can make comparisons between people, places, and objects using comparative and superlative adjectives (GSE 46).",
        ruleSummary: "Short adjectives: -er / -est (fast -> faster -> fastest). Long adjectives: more / most (interesting -> more interesting -> most interesting). Irregular forms: good -> better -> best, bad -> worse -> worst. Don't double compare ('more faster' is wrong!).",
        examples: [
          { correct: "Jupiter is larger than Earth.", incorrect: "Jupiter is more large than Earth.", note: "One-syllable adjectives take -er, not 'more'." },
          { correct: "Mount Everest is the highest mountain in the world.", incorrect: "Mount Everest is the most high...", note: "Short adjective takes 'the' + -est." },
        ],
        questions: [
          {
            id: "w2-t3-q1",
            type: "grammar_detective",
            sentence: "This new laptop is more faster than my old desktop computer.",
            words: ["This", "laptop", "is", "more", "faster", "than", "my", "old", "computer."],
            errorIndex: 3,
            wrongWord: "more",
            correctionOptions: ["(remove 'more')", "much", "very"],
            correctFix: "(remove 'more')",
            caseTitle: "Double Comparative Infraction",
            ruleExplanation: "'faster' already includes the comparative suffix -er. Saying 'more faster' is redundant.",
          },
          {
            id: "w2-t3-q2",
            type: "time_traveler",
            sentenceWithBlank: "Of all the runners on the track team, Samuel is the ___.",
            timeSignal: "the ___ of all",
            options: ["fastest", "faster", "most fast", "more fast"],
            correctAnswer: "fastest",
            tenseName: "Superlative Adjective",
            explanation: "'The' followed by 'of all' demands the superlative form 'fastest'.",
          },
          {
            id: "w2-t3-q3",
            type: "word_train",
            prompt: "Build the comparative sentence with 'than':",
            scrambledWords: ["History", "is", "more", "interesting", "than", "math", "for", "me"],
            correctSentence: "History is more interesting than math for me",
            hint: "Multi-syllable adjective: 'more interesting than'.",
            explanation: "For three-syllable adjectives like 'interesting', use 'more + adjective + than'.",
          },
        ],
      },
      {
        id: "w2-t4",
        worldId: 2,
        grade: "Grade 8",
        title: "Modals of Ability, Obligation & Advice",
        slug: "modal-verbs-can-must-should",
        category: "grammar",
        gseRange: [44, 49],
        cefr: "A2+",
        canDoDescriptor: "Can express rules, obligations, advice, and capabilities using can, must, should, and have to (GSE 48).",
        ruleSummary: "Can = ability/permission. Must = strict obligation/rule. Should = friendly advice/recommendation. Modals are followed directly by the base verb (bare infinitive) without 'to' (e.g. 'You must wear a helmet', NOT 'must to wear').",
        examples: [
          { correct: "You should drink plenty of water after sports.", incorrect: "You should to drink...", note: "Modals are followed directly by bare infinitive." },
        ],
        questions: [
          {
            id: "w2-t4-q1",
            type: "grammar_detective",
            sentence: "All passengers must to fasten their seatbelts before takeoff.",
            words: ["All", "passengers", "must", "to", "fasten", "their", "seatbelts", "takeoff."],
            errorIndex: 3,
            wrongWord: "to",
            correctionOptions: ["(remove 'to')", "for", "and"],
            correctFix: "(remove 'to')",
            caseTitle: "The Superfluous Infinitive 'To'",
            ruleExplanation: "Modal verbs like 'must' are followed immediately by the base verb without 'to': 'must fasten'.",
          },
          {
            id: "w2-t4-q2",
            type: "time_traveler",
            sentenceWithBlank: "If your tooth hurts so badly, you ___ visit the dentist today.",
            timeSignal: "Friendly Advice",
            options: ["should", "must have", "can to", "ought"],
            correctAnswer: "should",
            tenseName: "Modal for Advice",
            explanation: "'Should' expresses good advice for someone experiencing toothache.",
          },
          {
            id: "w2-t4-q3",
            type: "word_train",
            prompt: "Arrange the laboratory rule statement:",
            scrambledWords: ["You", "must", "wear", "safety", "glasses", "in", "the", "lab"],
            correctSentence: "You must wear safety glasses in the lab",
            hint: "Subject + must + base verb + object + location.",
            explanation: "Subject (You) + modal (must) + base verb (wear) + object (safety glasses).",
          },
        ],
      },
      {
        id: "w2-t5",
        worldId: 2,
        grade: "Grade 8",
        title: "Quantifiers: Countable & Uncountable",
        slug: "quantifiers-much-many-few-little",
        category: "grammar",
        gseRange: [45, 50],
        cefr: "A2+",
        canDoDescriptor: "Can quantify countable nouns (many, a few) and uncountable nouns (much, a little) accurately (GSE 49).",
        ruleSummary: "Countable (books, apples, friends): use 'many', 'a few', 'few'. Uncountable (water, time, money, homework): use 'much', 'a little', 'little'. 'A lot of' works for both in positive statements.",
        examples: [
          { correct: "There isn't much milk left in the fridge.", incorrect: "There isn't many milk left...", note: "'Milk' is an uncountable liquid, requiring 'much'." },
          { correct: "We only have a few minutes before class.", incorrect: "We only have a little minutes...", note: "'Minutes' are countable plural nouns, requiring 'a few'." },
        ],
        questions: [
          {
            id: "w2-t5-q1",
            type: "time_traveler",
            sentenceWithBlank: "Hurry up! We do not have ___ time before the movie begins.",
            timeSignal: "Uncountable 'time'",
            options: ["much", "many", "few", "a few"],
            correctAnswer: "much",
            tenseName: "Quantifier for Uncountable Noun",
            explanation: "'Time' in this context is uncountable; in negative sentences we use 'much time'.",
          },
          {
            id: "w2-t5-q2",
            type: "grammar_detective",
            sentence: "How much students participated in the regional debate tournament?",
            words: ["How", "much", "students", "participated", "in", "the", "debate", "tournament?"],
            errorIndex: 1,
            wrongWord: "much",
            correctionOptions: ["many", "few", "little"],
            correctFix: "many",
            caseTitle: "Countable Plural Confusion",
            ruleExplanation: "'Students' is a plural countable noun, so the question must be 'How many students', not 'How much'.",
          },
          {
            id: "w2-t5-q3",
            type: "word_train",
            prompt: "Assemble a sentence describing ingredients:",
            scrambledWords: ["We", "need", "a", "few", "ripe", "strawberries", "for", "the", "smoothie"],
            correctSentence: "We need a few ripe strawberries for the smoothie",
            hint: "Subject + verb + quantifier 'a few' + countable plural noun.",
            explanation: "'strawberries' is plural countable, correctly quantified with 'a few'.",
          },
        ],
      },
      {
        id: "w2-t6",
        worldId: 2,
        grade: "Grade 8",
        title: "Recount Text: Chronological Memories & Trips",
        slug: "recount-text-grade-8",
        category: "text_genre",
        gseRange: [42, 47],
        cefr: "A2+",
        canDoDescriptor: "Can understand and retell past personal experiences in chronological sequence using past tenses and time connectors (GSE 45).",
        ruleSummary: "Recount text retells past events or personal experiences in chronological order to inform or entertain readers. Generic Structure: 1. Orientation (who was involved, where, and when); 2. Sequence of Events (chronological record of what happened: First, then, after that, next); 3. Reorientation (closing remark or personal feeling). Language features: Simple Past Tense, action verbs, and temporal connectives.",
        genreDetails: {
          socialFunction: "To retell a series of past experiences, journeys, or school holidays in chronological sequence to inform or entertain an audience.",
          genericStructure: [
            "1. Orientation: Sets the background (Who, When, Where, What activity).",
            "2. Events: Chronological record of occurrences (First..., Next..., After that..., Finally...).",
            "3. Reorientation: An optional evaluative conclusion sharing personal feelings or reflections."
          ],
          languageFeatures: [
            "Predominant use of Simple Past Tense (went, built, swam, felt).",
            "Chronological time connectors (First, Then, After that, Later on, In the end).",
            "Action verbs depicting physical movements (hiked, pitched, explored).",
            "Personal pronouns (I, we, our family, my classmates)."
          ],
          modelText: {
            title: "Our Weekend Camping Trip at Pine Forest",
            paragraphs: [
              {
                stage: "Orientation",
                text: "Last Saturday, my scout troop and I went on an unforgettable camping excursion to Pine Forest near Mount Merbabu. We departed from our school yard at 6:00 AM by bus."
              },
              {
                stage: "Events (Chronological)",
                text: "Upon arriving at noon, we immediately pitched our tents on the green grass. Next, we gathered dry firewood and attended a compass navigation workshop led by Mr. Danu. In the evening, we sat around a roaring campfire, roasted marshmallows, and sang traditional folk songs under the starry sky."
              },
              {
                stage: "Reorientation",
                text: "We packed our gear and returned home on Sunday afternoon. Although we were physically exhausted from hiking, I felt thrilled and learned so much about teamwork."
              }
            ]
          }
        },
        examples: [
          { correct: "First, we pitched our tents, and then we gathered dry firewood.", incorrect: "First, we pitch our tents, and then we are gathering...", note: "Recount texts require past tenses throughout the event sequence." },
          { correct: "After that, we visited the historical lighthouse near the coast.", incorrect: "After that, we visit...", note: "Historical recount actions happened in completed past time." }
        ],
        questions: [
          {
            id: "w2-t6-q1",
            type: "word_train",
            prompt: "Arrange the chronological recount event with the time transition:",
            scrambledWords: ["After", "setting", "up", "camp,", "we", "hiked", "along", "the", "river"],
            correctSentence: "After setting up camp, we hiked along the river",
            hint: "Temporal connective phrase + subject + past action verb + prepositional phrase.",
            explanation: "Recount texts use time connectors ('After...') followed by past action clauses ('we hiked...')."
          },
          {
            id: "w2-t6-q2",
            type: "time_traveler",
            sentenceWithBlank: "On the final day of our beach trip, my brother and I ___ colorful seashells along the shoreline.",
            timeSignal: "Past Recount Event",
            options: ["collected", "collect", "are collecting", "collects"],
            correctAnswer: "collected",
            tenseName: "Simple Past (Recount)",
            explanation: "Recount texts consistently use past tense ('collected') to record completed experiences."
          },
          {
            id: "w2-t6-q3",
            type: "grammar_detective",
            sentence: "We arrived at the summit and take many breathtaking photographs.",
            words: ["We", "arrived", "at", "summit", "and", "take", "many", "breathtaking", "photographs."],
            errorIndex: 5,
            wrongWord: "take",
            correctionOptions: ["took", "taken", "taking"],
            correctFix: "took",
            caseTitle: "Tense Inconsistency in Past Recount",
            ruleExplanation: "Parallel verbs in past recounts must maintain past tense agreement: 'arrived... and took', not 'take'."
          }
        ]
      },
      {
        id: "w2-t7",
        worldId: 2,
        grade: "Grade 8",
        title: "Narrative Text: Fables, Legends & Story Arc",
        slug: "narrative-text-grade-8",
        category: "text_genre",
        gseRange: [44, 50],
        cefr: "A2+",
        canDoDescriptor: "Can follow the sequence of events and moral lessons in narrative texts including orientation, complication, and resolution (GSE 48).",
        ruleSummary: "Narrative text amuses, entertains, and imparts a moral lesson through fictional stories (fables, legends, folklore). Generic Structure: 1. Orientation (introduces characters, place, and time); 2. Complication (a central problem or conflict arises); 3. Resolution (the crisis is resolved for better or worse); 4. Coda / Moral (the ethical takeaway). Language features: Past tenses, action verbs, saying verbs (cried, warned), and direct dialogue speech.",
        genreDetails: {
          socialFunction: "To entertain, captivate the imagination, and convey timeless cultural values or moral virtues through storytelling.",
          genericStructure: [
            "1. Orientation: Introduces main characters, temporal setting, and mythical location.",
            "2. Complication: The catalyst event that creates a conflict, danger, or moral test.",
            "3. Resolution: How the characters overcome or succumb to the complication.",
            "4. Coda (Moral): The underlying wisdom or life lesson taught by the narrative."
          ],
          languageFeatures: [
            "Past Tenses (Simple Past, Past Continuous, Past Perfect for back-story).",
            "Story starter phrases (Once upon a time, Long ago in an ancient kingdom).",
            "Direct speech dialogue inside quotation marks (\"Help!\" cried the woodcutter).",
            "Adverbs of manner and emotion (greedily, slyly, bravely, sorrowfully)."
          ],
          modelText: {
            title: "The Clever Fox and the Crow",
            paragraphs: [
              {
                stage: "Orientation",
                text: "Once upon a time, on a bright sunny morning, a glossy black crow perched upon a high oak branch. In her beak, she held a large, savory piece of yellow cheese that she had just found."
              },
              {
                stage: "Complication",
                text: "A hungry fox strolled beneath the tree and caught the irresistible scent of cheese. Wanting the cheese for himself, the fox looked up and flatteringly declared: \"Good day, noble Crow! Your feathers are so radiant, and surely your singing voice is sweeter than any bird in the forest!\""
              },
              {
                stage: "Resolution",
                text: "Blinded by foolish vanity, the crow lifted her head, opened her beak, and gave a loud \"Caw!\" The delicious cheese slipped from her mouth and tumbled directly into the fox's waiting jaws. The sly fox laughed and vanished into the woods."
              },
              {
                stage: "Coda (Moral)",
                text: "Moral: Never trust a flatterer who praises you merely to serve their own selfish desires."
              }
            ]
          }
        },
        examples: [
          { correct: "\"Beware of the enchanted lake!\" warned the elderly wizard.", incorrect: "\"Beware of the enchanted lake!\" warns the elderly wizard.", note: "Narrative reporting verbs generally take the past tense ('warned', 'whispered')." },
          { correct: "Suddenly, a ferocious dragon emerged from the dark cave.", incorrect: "Suddenly, a ferocious dragon emerges...", note: "Complications in traditional tales unfold in past narrative time." }
        ],
        questions: [
          {
            id: "w2-t7-q1",
            type: "word_train",
            prompt: "Assemble the classic narrative complication sentence:",
            scrambledWords: ["Suddenly,", "a", "ferocious", "dragon", "emerged", "from", "the", "dark", "cave"],
            correctSentence: "Suddenly, a ferocious dragon emerged from the dark cave",
            hint: "Adverb of sudden change + subject + past action verb + prepositional phrase.",
            explanation: "Narrative complications introduce unexpected conflicts using time adverbs like 'Suddenly' and past action verbs."
          },
          {
            id: "w2-t7-q2",
            type: "time_traveler",
            sentenceWithBlank: "Once upon a time, an honest fisherman ___ in a humble cottage beside the deep blue sea.",
            timeSignal: "Narrative Orientation Marker",
            options: ["lived", "lives", "is living", "will live"],
            correctAnswer: "lived",
            tenseName: "Simple Past (Narrative)",
            explanation: "'Once upon a time' introduces a narrative tale set in mythical past time, taking 'lived'."
          },
          {
            id: "w2-t7-q3",
            type: "grammar_detective",
            sentence: "The frightened hare ran swiftly and hide beneath a thick thorny bush.",
            words: ["The", "hare", "ran", "swiftly", "and", "hide", "beneath", "a", "bush."],
            errorIndex: 5,
            wrongWord: "hide",
            correctionOptions: ["hid", "hidden", "hiding"],
            correctFix: "hid",
            caseTitle: "Irregular Past Verb Slip in Narrative",
            ruleExplanation: "The past tense of the irregular verb 'hide' is 'hid'. The coordinated verbs must match: 'ran... and hid'."
          }
        ]
      }
    ],
  },
  {
    id: 3,
    name: "Language Master",
    subtitle: "Grade 9 · GSE 48–58 (CEFR A2+ to B1)",
    grade: "Grade 9",
    gseLabel: "GSE 48–58",
    gseMin: 48,
    gseMax: 58,
    cefrRange: "A2+ to B1",
    themeColor: {
      primary: "violet-600",
      light: "violet-50",
      accent: "violet-500",
      border: "violet-400",
    },
    topics: [
      {
        id: "w3-t1",
        worldId: 3,
        grade: "Grade 9",
        title: "Present Perfect Tense",
        slug: "present-perfect-tense",
        category: "grammar",
        gseRange: [48, 54],
        cefr: "B1",
        canDoDescriptor: "Can link past experiences with present relevance using have/has + past participle and key adverbs (just, already, yet, since, for) (GSE 52).",
        ruleSummary: "Form: Subject + have/has + V3 (Past Participle). Used for past actions with present result or life experience. 'Since' + starting point in time ('since 2021'); 'For' + duration of time ('for three years'). 'Already' in positives, 'yet' at end of negatives/questions.",
        examples: [
          { correct: "I have lived in this city since 2020.", incorrect: "I lived in this city since 2020.", note: "Action began in the past and continues into the present: Present Perfect." },
          { correct: "Have you finished your essay yet?", incorrect: "Have you finished your essay already yet?", note: "Use 'yet' at the end of questions." },
        ],
        questions: [
          {
            id: "w3-t1-q1",
            type: "time_traveler",
            sentenceWithBlank: "Our school robotic team ___ three national championships since 2022.",
            timeSignal: "since 2022",
            options: ["has won", "won", "wins", "is winning"],
            correctAnswer: "has won",
            tenseName: "Present Perfect (Since)",
            explanation: "'since 2022' shows an action starting in the past and continuing up to the present, requiring 'has won'.",
          },
          {
            id: "w3-t1-q2",
            type: "grammar_detective",
            sentence: "Noah has worked on his robot for last November.",
            words: ["Noah", "has", "worked", "on", "his", "robot", "for", "last", "November."],
            errorIndex: 6,
            wrongWord: "for",
            correctionOptions: ["since", "during", "at"],
            correctFix: "since",
            caseTitle: "Duration vs Starting Point Conundrum",
            ruleExplanation: "'last November' is a specific starting point in time, so it requires 'since', not 'for' (use 'for' with durations like 'for three months').",
          },
          {
            id: "w3-t1-q3",
            type: "word_train",
            prompt: "Construct a present perfect sentence with 'already':",
            scrambledWords: ["We", "have", "already", "completed", "all", "our", "science", "experiments"],
            correctSentence: "We have already completed all our science experiments",
            hint: "Subject + have + already + past participle (completed).",
            explanation: "'already' typically sits between the auxiliary 'have' and the past participle 'completed'.",
          },
        ],
      },
      {
        id: "w3-t2",
        worldId: 3,
        grade: "Grade 9",
        title: "Future Forms: Will vs. Be Going To",
        slug: "future-forms-will-vs-going-to",
        category: "grammar",
        gseRange: [50, 55],
        cefr: "B1",
        canDoDescriptor: "Can distinguish between spontaneous decisions (will) and prior plans/intentions with evidence (be going to) (GSE 53).",
        ruleSummary: "Use 'will' for spontaneous decisions made at the moment of speaking ('Wait, I will open the door!'), promises, and general predictions. Use 'be going to' for pre-arranged plans/intentions ('I am going to study medicine') or predictions with visible present evidence ('Look at those dark clouds, it is going to rain').",
        examples: [
          { correct: "Look at those dark clouds! It is going to rain.", incorrect: "Look at those dark clouds! It will rain.", note: "There is visible present physical evidence, so use 'is going to'." },
          { correct: "The phone is ringing. I'll get it!", incorrect: "The phone is ringing. I am going to get it.", note: "Spontaneous decision right now requires 'will'." },
        ],
        questions: [
          {
            id: "w3-t2-q1",
            type: "time_traveler",
            sentenceWithBlank: "Look at the dark storm clouds in the sky! It ___ rain very soon.",
            timeSignal: "Visual Evidence (dark clouds)",
            options: ["is going to", "will", "is raining", "rained"],
            correctAnswer: "is going to",
            tenseName: "Future with Visible Evidence",
            explanation: "When there is clear sensory evidence right now (dark clouds), English uses 'is going to' for the impending prediction.",
          },
          {
            id: "w3-t2-q2",
            type: "word_train",
            prompt: "Assemble a spontaneous decision sentence:",
            scrambledWords: ["Don't", "worry,", "I", "will", "help", "you", "with", "that", "heavy", "bag"],
            correctSentence: "Don't worry, I will help you with that heavy bag",
            hint: "Spontaneous offer of help uses 'will' + base verb.",
            explanation: "Spontaneous offers made at the moment use 'will + base verb': 'I will help you'.",
          },
          {
            id: "w3-t2-q3",
            type: "grammar_detective",
            sentence: "Next summer, my family is go to visit Tokyo.",
            words: ["Next", "summer,", "my", "family", "is", "go", "to", "visit", "Tokyo."],
            errorIndex: 5,
            wrongWord: "go",
            correctionOptions: ["going", "will", "gone"],
            correctFix: "going",
            caseTitle: "Broken Future Plan Construct",
            ruleExplanation: "The planned future structure is 'be + going + to + base verb'. It must be 'is going to visit', not 'is go to'.",
          },
        ],
      },
      {
        id: "w3-t3",
        worldId: 3,
        grade: "Grade 9",
        title: "Passive Voice (Simple Present & Past)",
        slug: "passive-voice",
        category: "grammar",
        gseRange: [52, 57],
        cefr: "B1",
        canDoDescriptor: "Can transform and use sentences in the passive voice when the action or object is the focus (GSE 55).",
        ruleSummary: "Formula: Object + Form of 'BE' (am/is/are/was/were) + Past Participle (V3) (+ by Agent). Use when the receiver of the action is more important than the doer, or the doer is unknown. Present: 'English is spoken worldwide'. Past: 'The telephone was invented by Bell'.",
        examples: [
          { correct: "The famous novel was written by George Orwell.", incorrect: "The famous novel was wrote by...", note: "Must use past participle 'written' after 'was'." },
        ],
        questions: [
          {
            id: "w3-t3-q1",
            type: "word_train",
            prompt: "Assemble the passive voice sentence correctly:",
            scrambledWords: ["The", "solar", "panels", "were", "installed", "by", "expert", "engineers"],
            correctSentence: "The solar panels were installed by expert engineers",
            hint: "Patient subject + were + past participle (installed) + by agent.",
            explanation: "In passive voice: Plural subject (The solar panels) + were + V3 (installed) + by agent.",
          },
          {
            id: "w3-t3-q2",
            type: "time_traveler",
            sentenceWithBlank: "Millions of digital emails ___ around the globe every single minute.",
            timeSignal: "every minute (General Present)",
            options: ["are sent", "were sent", "are sending", "sent"],
            correctAnswer: "are sent",
            tenseName: "Passive Voice (Simple Present)",
            explanation: "Regular ongoing passive fact requires present form of be (are) + past participle (sent): 'are sent'.",
          },
          {
            id: "w3-t3-q3",
            type: "grammar_detective",
            sentence: "This beautiful song was compose by a young prodigy in 1782.",
            words: ["This", "song", "was", "compose", "by", "a", "young", "prodigy", "in", "1782."],
            errorIndex: 3,
            wrongWord: "compose",
            correctionOptions: ["composed", "composing", "composition"],
            correctFix: "composed",
            caseTitle: "Unconjugated Passive Participle",
            ruleExplanation: "Passive voice requires the past participle (V3). 'compose' must be 'composed': 'was composed by'.",
          },
        ],
      },
      {
        id: "w3-t4",
        worldId: 3,
        grade: "Grade 9",
        title: "First Conditional (Real Possibility)",
        slug: "first-conditional",
        category: "grammar",
        gseRange: [53, 58],
        cefr: "B1",
        canDoDescriptor: "Can talk about likely future events and conditions using the first conditional (If + Present Simple, will + verb) (GSE 56).",
        ruleSummary: "Structure: If + Simple Present, will + base verb (or will + verb + if + Simple Present). NEVER use 'will' in the 'if' clause! (e.g., 'If it rains, we will stay home' - NOT 'If it will rain').",
        examples: [
          { correct: "If you practice every day, you will improve your fluency.", incorrect: "If you will practice every day, you will improve...", note: "Do NOT use 'will' in the If-clause." },
        ],
        questions: [
          {
            id: "w3-t4-q1",
            type: "grammar_detective",
            sentence: "If you will study hard tonight, you will pass tomorrow's test.",
            words: ["If", "you", "will", "study", "hard,", "you", "will", "pass", "tomorrow's", "test."],
            errorIndex: 2,
            wrongWord: "will",
            correctionOptions: ["(remove 'will')", "would", "shall"],
            correctFix: "(remove 'will')",
            caseTitle: "Forbidden 'Will' in the If-Clause",
            ruleExplanation: "In the first conditional, the condition clause after 'If' takes the Simple Present tense, never 'will': 'If you study hard'.",
          },
          {
            id: "w3-t4-q2",
            type: "time_traveler",
            sentenceWithBlank: "If our team wins the championship game, we ___ an enormous celebration.",
            timeSignal: "If + Simple Present (wins)",
            options: ["will have", "have", "had", "would have"],
            correctAnswer: "will have",
            tenseName: "First Conditional (Main Clause)",
            explanation: "In first conditional, the main result clause takes 'will + base verb': 'will have'.",
          },
          {
            id: "w3-t4-q3",
            type: "word_train",
            prompt: "Assemble the conditional warning sentence:",
            scrambledWords: ["We", "will", "be", "late", "if", "we", "miss", "the", "next", "train"],
            correctSentence: "We will be late if we miss the next train",
            hint: "Result clause (We will be late) + if + condition clause (we miss the next train).",
            explanation: "Main clause (will be late) followed by conditional conjunction 'if' and present simple clause.",
          },
        ],
      },
      {
        id: "w3-t5",
        worldId: 3,
        grade: "Grade 9",
        title: "Connectives & Conjunctions",
        slug: "connectives-and-conjunctions",
        category: "grammar",
        gseRange: [54, 58],
        cefr: "B1",
        canDoDescriptor: "Can link ideas, contrasting points, and causes using although, because, therefore, however, and so (GSE 58).",
        ruleSummary: "Cause: 'because' + clause ('because she trained'). Result: 'so' or 'therefore' ('he practiced, so he won'). Contrast: 'although' / 'even though' + clause ('Although it was freezing, they ran outside'), 'however' (separated by commas/semicolons).",
        examples: [
          { correct: "Although she felt tired, she finished her project.", incorrect: "Although she felt tired, but she finished...", note: "Never use 'although' and 'but' together in the same sentence." },
        ],
        questions: [
          {
            id: "w3-t5-q1",
            type: "grammar_detective",
            sentence: "Although it was raining heavily, but we still played soccer.",
            words: ["Although", "it", "was", "raining,", "but", "we", "still", "played", "soccer."],
            errorIndex: 4,
            wrongWord: "but",
            correctionOptions: ["(remove 'but')", "so", "and"],
            correctFix: "(remove 'but')",
            caseTitle: "Double Conjunction Collision",
            ruleExplanation: "When starting a sentence with 'Although', do not include 'but' in the main clause. They both show contrast, so use only one.",
          },
          {
            id: "w3-t5-q2",
            type: "time_traveler",
            sentenceWithBlank: "He forgot to set his alarm clock; ___, he arrived late to the morning lecture.",
            timeSignal: "Cause & Effect Result",
            options: ["therefore", "although", "because", "despite"],
            correctAnswer: "therefore",
            tenseName: "Conjunctive Adverb (Result)",
            explanation: "'therefore' connects a stated cause to its logical result ('He forgot his alarm; therefore, he arrived late').",
          },
          {
            id: "w3-t5-q3",
            type: "word_train",
            prompt: "Assemble the complex contrast sentence:",
            scrambledWords: ["Although", "the", "puzzle", "was", "difficult,", "Maya", "solved", "it", "quickly"],
            correctSentence: "Although the puzzle was difficult, Maya solved it quickly",
            hint: "Subordinating conjunction 'Although' + dependent clause + comma + main clause.",
            explanation: "'Although' introduces the concession clause, followed by the surprising main clause outcome.",
          },
        ],
      },
      {
        id: "w3-t6",
        worldId: 3,
        grade: "Grade 9",
        title: "Procedure Text: Recipes, Manuals & Guides",
        slug: "procedure-text-grade-9",
        category: "text_genre",
        gseRange: [49, 54],
        cefr: "B1",
        canDoDescriptor: "Can follow and organize sequential instructions, manuals, and recipes to accomplish a goal (GSE 52).",
        ruleSummary: "Procedure text explains how something is created, used, or accomplished through a step-by-step sequence. Generic Structure: 1. Goal / Aim (the objective, usually the title); 2. Materials / Ingredients / Tools (items needed); 3. Steps / Methods (numbered or chronologically linked instructions). Language features: Imperative verbs (Whisk, Measure, Connect), sequence adverbs (First, Second, Then, Next, Finally), and precise adverbials of manner and time.",
        genreDetails: {
          socialFunction: "To describe how something is achieved or created through an orderly series of steps or actions.",
          genericStructure: [
            "1. Goal / Aim: Explicitly stated in the title or introduction (e.g., 'How to Brew Jasmine Tea').",
            "2. Materials / Ingredients: Complete list of items, quantities, and utensils required.",
            "3. Steps / Method: Chronological procedural instructions presented with imperative verbs."
          ],
          languageFeatures: [
            "Imperative sentences starting with bare infinitive verbs (Pour, Slice, Click, Fasten).",
            "Temporal conjunctions and sequence adverbs (First, Then, Next, Afterwards, Finally).",
            "Precise adverbials of manner, time, and measurement (for 10 minutes, gently, 200 ml).",
            "Clear technical or kitchen action verbs (dissolve, stir, insert, preheat)."
          ],
          modelText: {
            title: "How to Make a Refreshing Tropical Mango Smoothie",
            paragraphs: [
              {
                stage: "Goal",
                text: "Goal: To prepare a healthy, chilled tropical mango smoothie in under five minutes using fresh ingredients."
              },
              {
                stage: "Ingredients",
                text: "Ingredients: 1 large ripe mango (peeled and diced), 1 cup of plain yogurt or oat milk, 2 tablespoons of natural honey, 4 ice cubes, and 1 sprig of fresh mint for garnish."
              },
              {
                stage: "Steps",
                text: "First, place the diced mango pieces and ice cubes into the blender pitcher. Second, pour in the plain yogurt and drizzle the honey over the top. Next, secure the blender lid tightly and blend on high speed for 60 seconds until smooth and creamy. Finally, pour the smoothie into a tall chilled glass, garnish with a mint sprig, and serve immediately with a straw."
              }
            ]
          }
        },
        examples: [
          { correct: "First, boil the water for five minutes in a stainless kettle.", incorrect: "First, boiling the water for five minutes...", note: "Procedure steps must start with base imperative verbs ('boil'), never gerunds ('boiling')." },
          { correct: "Carefully insert the memory card into the designated slot.", incorrect: "You carefully insert...", note: "Commands in user manuals omit the subject pronoun 'you'." }
        ],
        questions: [
          {
            id: "w3-t6-q1",
            type: "word_train",
            prompt: "Assemble the procedural step with the sequence connective and manner adverb:",
            scrambledWords: ["First,", "slice", "the", "ripe", "mango", "into", "small", "cubes", "carefully"],
            correctSentence: "First, slice the ripe mango into small cubes carefully",
            hint: "Sequence adverb + base imperative verb + object + manner adverb.",
            explanation: "Procedure texts begin steps with sequence markers ('First,') followed by bare imperative verbs ('slice')."
          },
          {
            id: "w3-t6-q2",
            type: "time_traveler",
            sentenceWithBlank: "Next, ___ the freshly squeezed lemon juice into the mixture and stir thoroughly.",
            timeSignal: "Procedural Command Step",
            options: ["pour", "poured", "pouring", "pours"],
            correctAnswer: "pour",
            tenseName: "Imperative Form (Procedure)",
            explanation: "Steps in procedure texts take the bare infinitive imperative form: 'Next, pour the juice'."
          },
          {
            id: "w3-t6-q3",
            type: "grammar_detective",
            sentence: "Then, you blending the ingredients on high speed for one minute.",
            words: ["Then,", "you", "blending", "the", "ingredients", "on", "high", "speed."],
            errorIndex: 2,
            wrongWord: "blending",
            correctionOptions: ["blend", "blended", "blends"],
            correctFix: "blend",
            caseTitle: "Gerund Contamination in Procedure Step",
            ruleExplanation: "Procedure steps must use bare base verbs ('blend'), not continuous participles ('blending')."
          }
        ]
      },
      {
        id: "w3-t7",
        worldId: 3,
        grade: "Grade 9",
        title: "Report Text: Factual Scientific Classifications",
        slug: "report-text-grade-9",
        category: "text_genre",
        gseRange: [52, 58],
        cefr: "B1",
        canDoDescriptor: "Can understand and construct factual reports presenting scientific information about natural and social phenomena (GSE 55).",
        ruleSummary: "Report text presents factual, scientific, and systematic information about an entire category of things (species of animals, astronomical bodies, natural phenomena, technologies). Generic Structure: 1. General Classification (categorizing what the subject is); 2. Description (systematically reporting parts, habitat, diet, behavior, anatomy, or survival mechanisms). Language features: Simple Present Tense (timeless scientific truths), technical terminology, passive voice, and formal objective third-person perspective.",
        genreDetails: {
          socialFunction: "To document, organize, and present factual scientific information regarding an entire class of living or non-living phenomena.",
          genericStructure: [
            "1. General Classification: States the class, family, scientific group, and general definition of the phenomenon.",
            "2. Description: Methodically details parts, anatomy, habitat, feeding habits, ecological behavior, and adaptations."
          ],
          languageFeatures: [
            "Timeless Simple Present Tense denoting objective scientific realities (e.g., 'Whales belong to...', 'Volcanoes erupt when...').",
            "General nouns representing the whole class (e.g., 'Elephants', NOT 'my pet elephant Dumbo').",
            "Domain-specific technical and scientific terminology (endothermic, carnivore, venomous, nocturnal).",
            "Frequent use of Passive Voice to emphasize scientific processes over individual actors."
          ],
          modelText: {
            title: "Komodo Dragons: The Ancient Giants of Indonesia",
            paragraphs: [
              {
                stage: "General Classification",
                text: "The Komodo dragon (Varanus komodoensis) is the largest living species of lizard on Earth. It belongs to the monitor lizard family Varanidae and is endemic exclusively to the Indonesian islands of Komodo, Rinca, Flores, and Gili Motang."
              },
              {
                stage: "Description (Physical & Anatomy)",
                text: "A mature Komodo dragon can grow up to three meters (10 feet) in total length and weigh more than 70 kilograms. It possesses a rugged armored hide, muscular legs, sharp curved claws, and a long yellow forked tongue that detects microscopic scent molecules in the air."
              },
              {
                stage: "Description (Hunting & Ecology)",
                text: "Komodo dragons are apex carnivores. They ambush prey such as deer, wild boars, and water buffalo using potent venom glands in their lower jaw. The venom accelerates shock and prevents blood coagulation in victims. Due to their restricted geographic habitat and climate threats, they are currently classified as endangered by the IUCN."
              }
            ]
          }
        },
        examples: [
          { correct: "Platypuses are semi-aquatic mammals found in eastern Australia.", incorrect: "Platypuses were semi-aquatic mammals...", note: "Report texts describe living species using Simple Present Tense for timeless scientific classification." },
          { correct: "Solar energy is converted into electricity using photovoltaic cells.", incorrect: "People converts solar energy...", note: "Factual reports frequently employ passive voice to maintain an objective scientific tone." }
        ],
        questions: [
          {
            id: "w3-t7-q1",
            type: "word_train",
            prompt: "Assemble the scientific classification thesis sentence:",
            scrambledWords: ["Komodo", "dragons", "are", "the", "largest", "living", "lizards", "on", "Earth"],
            correctSentence: "Komodo dragons are the largest living lizards on Earth",
            hint: "General noun subject + are + superlative classification + location.",
            explanation: "Report texts open with a General Classification defining the entire species or category."
          },
          {
            id: "w3-t7-q2",
            type: "time_traveler",
            sentenceWithBlank: "Platypuses are unique mammals because they ___ eggs instead of giving birth to live young.",
            timeSignal: "Timeless Scientific Fact",
            options: ["lay", "laid", "are laying", "have laid"],
            correctAnswer: "lay",
            tenseName: "Simple Present (Scientific Fact)",
            explanation: "Scientific biological realities in report texts use timeless Simple Present: 'they lay eggs'."
          },
          {
            id: "w3-t7-q3",
            type: "grammar_detective",
            sentence: "Giant pandas lived in the misty bamboo forests of southwestern China.",
            words: ["Giant", "pandas", "lived", "in", "the", "bamboo", "forests", "of", "China."],
            errorIndex: 2,
            wrongWord: "lived",
            correctionOptions: ["live", "are living", "had lived"],
            correctFix: "live",
            caseTitle: "Past Tense Error in Biological Report",
            ruleExplanation: "Reports about extant species describe current habitat and ecology using the Simple Present: 'Giant pandas live in'."
          }
        ]
      }
    ],
  },
];

// Helper functions for curriculum access
export function getAllTopics(): Topic[] {
  return CURRICULUM_WORLDS.flatMap((w) => w.topics);
}

export function getTopicById(topicId: string): Topic | undefined {
  return getAllTopics().find((t) => t.id === topicId);
}

export function getWorldByTopicId(topicId: string): World | undefined {
  return CURRICULUM_WORLDS.find((w) => w.topics.some((t) => t.id === topicId));
}

export function calculateEstimatedGSE(masteredTopicIds: string[]): number {
  if (masteredTopicIds.length === 0) return 30; // Starting baseline
  const allTopics = getAllTopics();
  const masteredTopics = allTopics.filter((t) => masteredTopicIds.includes(t.id));
  if (masteredTopics.length === 0) return 30;

  // Weighted average of maximum GSE bounds of mastered topics
  const sum = masteredTopics.reduce((acc, t) => acc + (t.gseRange[0] + t.gseRange[1]) / 2, 0);
  const avg = Math.round(sum / masteredTopics.length);
  return Math.min(58, Math.max(30, avg));
}
