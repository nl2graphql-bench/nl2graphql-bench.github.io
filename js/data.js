/* AutoGraphQL paper results and corpus statistics (Tables 1–5 and Figure 3). */

const CATEGORY_KEYS = [
  "aliases",
  "directives",
  "extFragments",
  "inlineFragments",
  "filters",
  "pagination",
  "mutations",
];

const CATEGORY_LABELS = {
  aliases: "Aliases",
  directives: "Directives",
  extFragments: "Ext. Fragments",
  inlineFragments: "Inline Fragments",
  filters: "Filters",
  pagination: "Pagination",
  mutations: "Mutations",
};

/*
 * Public-benchmark runs reported in Tables 3–5.
 * These are paper results, not hidden-set scores or community submissions.
 * sizeBucket: "small" (<20B params) or "large" (>=20B, or undisclosed/closed-weight frontier).
 */
const LEADERBOARD_ENTRIES = [
  {
    id: "claude-sonnet-4-5",
    model: "Claude Sonnet 4.5",
    setting: "Frontier reference · Table 5",
    params: "undisclosed",
    paramsB: null,
    sizeBucket: "large",
    weightClass: "closed",
    aliases: 53.66, directives: 11.88, extFragments: 42.80, inlineFragments: 40.73,
    filters: 62.37, pagination: 42.05, mutations: 69.46, overall: 44.23,
  },
  {
    id: "llama-3.1-8b-a",
    model: "Llama-3.1-8B-Instruct",
    setting: "Fine-tuned · LoRA A (lr 1e-4)",
    params: "8B",
    paramsB: 8,
    sizeBucket: "small",
    weightClass: "open",
    aliases: 31.97, directives: 20.08, extFragments: 28.50, inlineFragments: 28.65,
    filters: 67.60, pagination: 71.75, mutations: 87.45, overall: 42.57,
  },
  {
    id: "ministral-8b-a",
    model: "Ministral-8B-Instruct-2410",
    setting: "Fine-tuned · LoRA A (lr 1e-4)",
    params: "8B",
    paramsB: 8,
    sizeBucket: "small",
    weightClass: "open",
    aliases: 29.38, directives: 22.15, extFragments: 27.94, inlineFragments: 29.03,
    filters: 66.44, pagination: 71.92, mutations: 87.66, overall: 42.29,
  },
  {
    id: "ministral-8b-b",
    model: "Ministral-8B-Instruct-2410",
    setting: "Fine-tuned · LoRA B (lr 5e-5)",
    params: "8B",
    paramsB: 8,
    sizeBucket: "small",
    weightClass: "open",
    aliases: 33.83, directives: 20.17, extFragments: 27.76, inlineFragments: 27.53,
    filters: 59.65, pagination: 71.43, mutations: 86.82, overall: 41.23,
  },
  {
    id: "granite-3.1-8b-b",
    model: "Granite-3.1-8B-Instruct",
    setting: "Fine-tuned · LoRA B (lr 5e-5)",
    params: "8B",
    paramsB: 8,
    sizeBucket: "small",
    weightClass: "open",
    aliases: 25.95, directives: 14.89, extFragments: 24.02, inlineFragments: 22.85,
    filters: 68.48, pagination: 70.94, mutations: 88.70, overall: 39.14,
  },
  {
    id: "granite-3.1-8b-a",
    model: "Granite-3.1-8B-Instruct",
    setting: "Fine-tuned · LoRA A (lr 1e-4)",
    params: "8B",
    paramsB: 8,
    sizeBucket: "small",
    weightClass: "open",
    aliases: 24.28, directives: 15.46, extFragments: 20.75, inlineFragments: 23.60,
    filters: 71.68, pagination: 71.43, mutations: 86.19, overall: 38.90,
  },
  {
    id: "llama-3.1-8b-b",
    model: "Llama-3.1-8B-Instruct",
    setting: "Fine-tuned · LoRA B (lr 5e-5)",
    params: "8B",
    paramsB: 8,
    sizeBucket: "small",
    weightClass: "open",
    aliases: 31.88, directives: 15.55, extFragments: 24.30, inlineFragments: 24.72,
    filters: 54.80, pagination: 68.99, mutations: 88.28, overall: 38.19,
  },
  {
    id: "llama-3.1-8b-base",
    model: "Llama-3.1-8B-Instruct",
    setting: "2-shot, no fine-tuning",
    params: "8B",
    paramsB: 8,
    sizeBucket: "small",
    weightClass: "open",
    aliases: 22.34, directives: 12.91, extFragments: 24.67, inlineFragments: 25.94,
    filters: 41.90, pagination: 48.54, mutations: 46.23, overall: 29.22,
  },
  {
    id: "ministral-8b-base",
    model: "Ministral-8B-Instruct-2410",
    setting: "2-shot, no fine-tuning",
    params: "8B",
    paramsB: 8,
    sizeBucket: "small",
    weightClass: "open",
    aliases: 17.15, directives: 6.79, extFragments: 27.57, inlineFragments: 23.22,
    filters: 35.40, pagination: 50.65, mutations: 47.91, overall: 26.64,
  },
  {
    id: "granite-3.1-8b-base",
    model: "Granite-3.1-8B-Instruct",
    setting: "2-shot, no fine-tuning",
    params: "8B",
    paramsB: 8,
    sizeBucket: "small",
    weightClass: "open",
    aliases: 9.36, directives: 4.71, extFragments: 16.92, inlineFragments: 16.29,
    filters: 17.94, pagination: 33.93, mutations: 33.68, overall: 16.57,
  },
];

/* Table 1 — corpus composition. */
const CORPUS_SPLITS = [
  { split: "Training", instances: 9118, note: "used for fine-tuning" },
  { split: "Public Benchmark", instances: 6403, note: "reported eval split · release pending" },
  { split: "Hidden Benchmark", instances: 2100, note: "withheld · future evaluation" },
];

/* Table 2 — category-wise distribution. */
const CATEGORY_DISTRIBUTION = [
  { name: "Aliases", train: 1542, test: 1079 },
  { name: "Directives", train: 1545, test: 1061 },
  { name: "External Fragments", train: 1498, test: 1070 },
  { name: "Filters", train: 1474, test: 1031 },
  { name: "Inline Fragments", train: 1530, test: 1068 },
  { name: "Pagination", train: 861, test: 616 },
  { name: "Mutations", train: 668, test: 478 },
];

/* Figure 3 — domain distribution across the 173 source schemas. */
const DOMAIN_DISTRIBUTION = [
  { name: "Business & Enterprise", pct: 27.7 },
  { name: "Sports & Recreation", pct: 17.9 },
  { name: "Entertainment & Media", pct: 14.5 },
  { name: "Government & Public Services", pct: 11.6 },
  { name: "Technology & Infrastructure", pct: 10.4 },
  { name: "Healthcare & Life Sciences", pct: 9.8 },
  { name: "Education & Research", pct: 8.1 },
];

/* Figure 1 — illustrative NL2GraphQL example. */
const TASK_EXAMPLE = {
  schema: `type Student {
  id: ID!
  name: String!
  email: String
  major: String!
  year: Int
  advisor: Faculty
  enrollments: [Enrollment]
}

type Enrollment {
  semester: String!
  grade: String
  course: Course!
}

type Course {
  code: String!
  title: String!
  credits: Int!
  level: String
  department: String
  instructor: Faculty
}

type Faculty {
  id: ID!
  name: String!
  department: String!
  courses: [Course]
}

input StudentFilter {
  major: String
  year: Int
  minGpa: Float
}

type Query {
  students(
    filter: StudentFilter
    first: Int
    after: String
  ): [Student]

  instructor(id: ID!): Faculty
}`,
  nl: `List the first 10 third-year Computer Science students. Include their names, email (optionally), course details, grades, and instructor details.`,
  query: `query CourseEnrollment(
  $showEmail: Boolean!
) {
  csStudents: students(
    filter: { major: "CS", year: 3 }
    first: 10
  ) {
    name
    email @include(if: $showEmail)
    enrollments {
      semester
      grade
      course {
        ...CourseFields
        instructor {
          name
          department
        }
      }
    }
  }
}

fragment CourseFields on Course {
  code
  title
  credits
  department
}`,
};
