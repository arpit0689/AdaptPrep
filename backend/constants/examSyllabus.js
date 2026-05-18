export const EXAM_DATABASE = {
  JEE: {
    type: 'Engineering',
    roadmapTemplate: 'concept-practice-revision-mock',
    subjects: [
      {
        name: 'Physics',
        chapters: [
          { name: 'Mechanics', topics: ['Kinematics', 'Newton Laws', 'Work Energy Power', 'Rotational Motion', 'Gravitation'] },
          { name: 'Thermodynamics', topics: ['Laws of Thermodynamics', 'Kinetic Theory', 'Heat Transfer'] },
          { name: 'Optics', topics: ['Ray Optics', 'Wave Optics'] },
          { name: 'Modern Physics', topics: ['Photoelectric Effect', 'Atoms and Nuclei', 'Semiconductors'] }
        ]
      },
      {
        name: 'Chemistry',
        chapters: [
          { name: 'Physical Chemistry', topics: ['Mole Concept', 'Chemical Equilibrium', 'Thermodynamics', 'Electrochemistry'] },
          { name: 'Organic Chemistry', topics: ['GOC', 'Hydrocarbons', 'Alcohols Phenols Ethers', 'Carbonyl Compounds'] },
          { name: 'Inorganic Chemistry', topics: ['Periodic Table', 'Chemical Bonding', 'Coordination Compounds'] }
        ]
      },
      {
        name: 'Mathematics',
        chapters: [
          { name: 'Algebra', topics: ['Quadratic Equations', 'Sequences and Series', 'Complex Numbers', 'Matrices'] },
          { name: 'Calculus', topics: ['Limits', 'Differentiation', 'Indefinite Integration', 'Definite Integration', 'Differential Equations'] },
          { name: 'Coordinate Geometry', topics: ['Straight Lines', 'Circle', 'Parabola', 'Ellipse', 'Hyperbola'] }
        ]
      }
    ]
  },
  NEET: {
    type: 'Medical',
    roadmapTemplate: 'ncert-concept-practice-revision',
    subjects: [
      { name: 'Physics', chapters: [{ name: 'Mechanics', topics: ['Motion', 'Laws of Motion', 'Energy'] }, { name: 'Electricity', topics: ['Current Electricity', 'Electrostatics'] }] },
      { name: 'Chemistry', chapters: [{ name: 'Physical Chemistry', topics: ['Mole Concept', 'Solutions'] }, { name: 'Organic Chemistry', topics: ['Hydrocarbons', 'Biomolecules'] }, { name: 'Inorganic Chemistry', topics: ['Periodic Table', 'Coordination'] }] },
      { name: 'Biology', chapters: [{ name: 'Botany', topics: ['Plant Physiology', 'Genetics', 'Ecology'] }, { name: 'Zoology', topics: ['Human Physiology', 'Reproduction', 'Evolution'] }] }
    ]
  },
  UPSC: {
    type: 'Civil Services',
    roadmapTemplate: 'foundation-current-affairs-answer-writing',
    subjects: [
      { name: 'History', chapters: [{ name: 'Ancient India', topics: ['Indus Valley', 'Vedic Age'] }, { name: 'Modern India', topics: ['1857 Revolt', 'National Movement'] }] },
      { name: 'Polity', chapters: [{ name: 'Constitution', topics: ['Preamble', 'Fundamental Rights', 'DPSP'] }, { name: 'Governance', topics: ['Parliament', 'Judiciary'] }] },
      { name: 'Geography', chapters: [{ name: 'Physical Geography', topics: ['Geomorphology', 'Climatology'] }, { name: 'Indian Geography', topics: ['Resources', 'Agriculture'] }] },
      { name: 'Economy', chapters: [{ name: 'Macro Economy', topics: ['Inflation', 'Fiscal Policy'] }, { name: 'Development', topics: ['Poverty', 'Inclusive Growth'] }] }
    ]
  },
  GATE: {
    type: 'Postgraduate Engineering',
    roadmapTemplate: 'core-subject-problem-solving-mock',
    subjects: [
      { name: 'Engineering Mathematics', chapters: [{ name: 'Linear Algebra', topics: ['Matrices', 'Eigenvalues'] }, { name: 'Calculus', topics: ['Limits', 'Differentiation'] }] },
      { name: 'Core Engineering', chapters: [{ name: 'Aptitude Basics', topics: ['Quantitative Aptitude', 'Verbal Ability'] }, { name: 'Technical Core', topics: ['Networks', 'Algorithms', 'Operating Systems'] }] }
    ]
  },
  SSC: {
    type: 'Government Exams',
    roadmapTemplate: 'speed-accuracy-revision',
    subjects: [
      { name: 'Quantitative Aptitude', chapters: [{ name: 'Arithmetic', topics: ['Percentage', 'Profit and Loss', 'Time and Work'] }, { name: 'Advanced Math', topics: ['Geometry', 'Trigonometry'] }] },
      { name: 'Reasoning', chapters: [{ name: 'Verbal Reasoning', topics: ['Analogy', 'Series'] }, { name: 'Non Verbal', topics: ['Mirror Image', 'Paper Folding'] }] },
      { name: 'English', chapters: [{ name: 'Grammar', topics: ['Tenses', 'Error Spotting'] }, { name: 'Vocabulary', topics: ['Synonyms', 'Idioms'] }] },
      { name: 'General Awareness', chapters: [{ name: 'Static GK', topics: ['History', 'Geography'] }, { name: 'Current Affairs', topics: ['Monthly Current Affairs'] }] }
    ]
  },
  CAT: {
    type: 'Management',
    roadmapTemplate: 'concept-drill-sectional-mock',
    subjects: [
      { name: 'Quantitative Aptitude', chapters: [{ name: 'Arithmetic', topics: ['Percentages', 'Ratio', 'Time Speed Distance'] }, { name: 'Algebra', topics: ['Equations', 'Functions'] }] },
      { name: 'DILR', chapters: [{ name: 'Data Interpretation', topics: ['Tables', 'Graphs', 'Caselets'] }, { name: 'Logical Reasoning', topics: ['Arrangements', 'Games and Tournaments'] }] },
      { name: 'VARC', chapters: [{ name: 'Reading Comprehension', topics: ['Inference', 'Main Idea'] }, { name: 'Verbal Ability', topics: ['Para Jumbles', 'Summary'] }] }
    ]
  },
  CUET: {
    type: 'University Entrance',
    roadmapTemplate: 'domain-language-general-test',
    subjects: [
      { name: 'Language', chapters: [{ name: 'Reading', topics: ['Comprehension', 'Vocabulary'] }] },
      { name: 'General Test', chapters: [{ name: 'Aptitude', topics: ['Numerical Ability', 'Reasoning', 'Current Affairs'] }] },
      { name: 'Domain Subjects', chapters: [{ name: 'Core Concepts', topics: ['NCERT Revision', 'Practice Sets'] }] }
    ]
  },
  BOARDS: {
    type: 'Academic',
    roadmapTemplate: 'chapter-practice-sample-paper',
    subjects: [
      { name: 'Mathematics', chapters: [{ name: 'Core Chapters', topics: ['Algebra', 'Calculus', 'Geometry'] }] },
      { name: 'Science', chapters: [{ name: 'Physics', topics: ['Electricity', 'Light'] }, { name: 'Chemistry', topics: ['Reactions', 'Carbon Compounds'] }, { name: 'Biology', topics: ['Life Processes', 'Heredity'] }] },
      { name: 'English', chapters: [{ name: 'Literature', topics: ['Prose', 'Poetry'] }, { name: 'Writing', topics: ['Letters', 'Essays'] }] }
    ]
  }
};

export const normalizeExamName = (name = '') => {
  const key = name.trim().toUpperCase().replace(/BOARD EXAMS?/, 'BOARDS');
  return EXAM_DATABASE[key] ? key : 'JEE';
};
