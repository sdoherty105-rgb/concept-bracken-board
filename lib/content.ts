export const SITE = {
  name: "Bracken & Board",
  slug: "bracken-board",
  conceptUrl: "https://offshiftstudio.com.au/concepts/bracken-board",
  conceptLabel: "An OFF/SHIFT concept — fictional demonstration",
  /** OFF/SHIFT enquiry form, tagged with this concept. */
  studioContactUrl: "https://offshiftstudio.com.au/?concept=bracken-board#contact",
  studioCta: "Want a website like this?",
  disclosure: "Bracken & Board is not a real business. The projects, prices and contact details are invented.",
  email: "hello@bracken-board.example",
  phone: "(08) 5550 0100",
  phoneHref: "tel:+61855500100",
};

export const projectTypes = [
  "Deck or screening",
  "Paving or entry",
  "Retaining walls or terraces",
  "Garden design and planting",
  "Pergola or outdoor room",
  "Full outdoor makeover",
  "Not sure yet",
];

export type Plate = {
  photo: string;
  alt: string;
  width: number;
  height: number;
  widths: number[];
};

const scene = (photo: string, alt: string): Plate => ({
  photo,
  alt,
  width: 1800,
  height: 1200,
  widths: [640, 800, 1200, 1800],
});

const wide = (photo: string, alt: string): Plate => ({
  photo,
  alt,
  width: 1600,
  height: 1067,
  widths: [640, 1100, 1600],
});

export const swatch = (photo: string, alt: string): Plate => ({
  photo,
  alt,
  width: 960,
  height: 960,
  widths: [480, 800, 960],
});

export const heroPlate = wide(
  "hero-wall",
  "Lit plate of the courtyard after the work: a timber deck, built-in bench, planters and glass doors in dappled light. No people.",
);

export const planPlate = wide(
  "plan-path",
  "Lit plate of the finished entry: pale pavers to the front door, planted beds and a low limestone wall. No people.",
);

export type Material = {
  id: string;
  name: string;
  use: string;
  spec: string;
  note: string;
  plate: Plate;
};

export const materials: Material[] = [
  {
    id: "limestone",
    name: "Limestone",
    use: "Walls, edges, steps",
    spec: "Course 200 by 200 by 100 mm",
    note: "Pale, honed, and heavy. It holds a line in the sun and throws light back into a shaded court.",
    plate: swatch("swatch-limestone", "Lit plate detail of the limestone wall at the entry, three courses, with planting above it."),
  },
  {
    id: "jarrah",
    name: "Jarrah",
    use: "Decks, benches, pergolas",
    spec: "Board 86 by 19 mm",
    note: "Dense Western Australian hardwood. Fixed hidden, oiled if you want the red, or left to silver.",
    plate: swatch("swatch-jarrah", "Lit plate detail of the jarrah deck boards with leaf shade across them."),
  },
  {
    id: "gravel",
    name: "Crushed gravel",
    use: "Paths, beds, drainage",
    spec: "10 mm, compacted",
    note: "The quiet layer. It drains, it locks, and it gives the pavers something honest to sit on.",
    plate: swatch("swatch-gravel", "Lit plate detail of the sandy ground beside the old entry path, before the new base."),
  },
  {
    id: "brick",
    name: "Clay pavers",
    use: "Paths, courts, entries",
    spec: "200 by 100 by 40 mm",
    note: "Laid in bond on a compacted base and a sand bed. The joint is the part that keeps the surface true.",
    plate: swatch("swatch-brick", "Lit plate detail of the pale entry pavers running to the front door."),
  },
];

export const trades = [
  {
    id: "decks",
    n: "01",
    title: "Decks",
    body: "Jarrah boards on a steel frame where the timber would meet the ground. Hidden fixings. A bench only if there is a reason to sit.",
    facts: ["Board 86 by 19 mm", "Hidden fixings", "Frame clear of soil"],
  },
  {
    id: "paving",
    n: "02",
    title: "Paving",
    body: "Clay or limestone on a base we compact and check. The surface is the last course, not the first decision.",
    facts: ["Base 100 to 150 mm", "Sand bed 30 mm", "Falls to a drain"],
  },
  {
    id: "retaining",
    n: "03",
    title: "Retaining",
    body: "Limestone courses, drained at the back, stepped to the fall of the block. A wall that holds a level.",
    facts: ["Ag drain at the heel", "No fines against the face", "Capping that sheds"],
  },
  {
    id: "planting",
    n: "04",
    title: "Planting",
    body: "Banksia, lomandra and kangaroo paw. Mulch, a hose point, and water only where a plant earns it.",
    facts: ["Local species", "Mulch 75 mm", "One hose point"],
  },
];

export const layers = [
  { id: "base", name: "Compacted base", mm: "150 mm", detail: "Limestone rubble, compacted in two passes." },
  { id: "sand", name: "Sand bed", mm: "30 mm", detail: "Washed sand, screeded to the falls." },
  { id: "paver", name: "Clay pavers", mm: "40 mm", detail: "200 by 100 mm, bond laid, joints filled." },
  { id: "edge", name: "Edge restraint", mm: "100 mm", detail: "Limestone edge, haunched so the field cannot creep." },
];

export const windows = ["Monday to Thursday, 7:30 to 11:00", "Friday, 7:30 to 9:30"];

export type Project = {
  id: string;
  no: string;
  title: string;
  year: string;
  area: string;
  crew: string;
  site: string;
  completed: string;
  duration: string;
  kind: string;
  quoteType: string;
  brief: string;
  notes: string;
  scope: string[];
  materials: string[];
  before: Plate;
  after: Plate;
};

export const projects: Project[] = [
  {
    id: "courtyard-deck",
    no: "001",
    title: "The courtyard deck",
    year: "2025",
    area: "38 m²",
    crew: "4",
    site: "Wattlebrook",
    completed: "March 2025",
    duration: "Five weeks",
    kind: "Decking and planting",
    quoteType: "Deck or screening",
    brief: "A cracked slab and a clothesline sat between the kitchen and the back wall. The deck is now level with the kitchen floor.",
    notes: "The bench holds the cushions. The planter screens the neighbour window and keeps the morning light. Boards are jarrah, hidden-fixed, running away from the house.",
    scope: [
      "Break out the slab and cart it off",
      "Steel frame, clear of the soil",
      "Jarrah deck with hidden fixings",
      "Bench and a planter of lomandra",
    ],
    materials: ["Jarrah", "Steel frame", "Lomandra"],
    before: scene(
      "deck-before",
      "The courtyard before the work: a cracked concrete slab, weeds in the joints, a bin and a clothesline against a plain wall.",
    ),
    after: scene(
      "deck-after",
      "The same courtyard after the work: a timber deck, built-in bench, planters and glass doors in dappled light.",
    ),
  },
  {
    id: "entry-path",
    no: "002",
    title: "The entry path",
    year: "2025",
    area: "46 m²",
    crew: "3",
    site: "Coralvale",
    completed: "August 2025",
    duration: "Three weeks",
    kind: "Paving and garden beds",
    quoteType: "Paving or entry",
    brief: "Bare soil, loose bricks and a broken strip of concrete. The door needed a straight approach.",
    notes: "Large pavers, fewer joints, a low limestone edge either side. The beds stay low at the path and rise toward the walls.",
    scope: [
      "Excavate and compact a new base",
      "Lay the paver field in bond",
      "Limestone edge, three courses",
      "Mulched beds with grasses",
    ],
    materials: ["Clay pavers", "Limestone", "Mulch"],
    before: scene(
      "entry-before",
      "The entry before the work: bare soil, a cracked concrete path with weeds, and loose pavers.",
    ),
    after: scene(
      "entry-after",
      "The same entry after the work: pale pavers to the door, planted beds and a low limestone wall.",
    ),
  },
  {
    id: "terraced-garden",
    no: "003",
    title: "The terraced garden",
    year: "2026",
    area: "92 m²",
    crew: "5",
    site: "Marri Heights",
    completed: "February 2026",
    duration: "Seven weeks",
    kind: "Retaining, planting and pergola",
    quoteType: "Retaining walls or terraces",
    brief: "A slope, a stack of old sleepers and a drum. We cut a level, kept the fall in the wall, and put the shade where the afternoon lands.",
    notes: "The terrace takes the fall so the lawn below is flat enough to use. Stepping stones sit flush for the mower. The pergola is three posts and a beam.",
    scope: [
      "Limestone terrace, drained at the heel",
      "Lawn and flush stepping stones",
      "Jarrah pergola on the shaded corner",
      "Banksia and lomandra on the top course",
    ],
    materials: ["Limestone", "Jarrah", "Turf"],
    before: scene(
      "garden-before",
      "The yard before the work: a bare slope, a timber fence, a stack of old sleepers and a drum, in low sun.",
    ),
    after: scene(
      "garden-after",
      "The same yard after the work: a limestone terrace, lawn with stepping stones, and a jarrah pergola casting a long hard shadow.",
    ),
  },
];

export function projectBySlug(slug: string) {
  return projects.find((p) => p.id === slug);
}

export const guarantee = [
  {
    title: "Workmanship",
    term: "Ten years",
    body: "Set-out, levels and fixings. If a course moves because we laid it wrong, we relay it.",
  },
  {
    title: "Paving and walls",
    term: "Ten years",
    body: "Settlement past 10 mm on a level we set is ours to correct. Ground changed later by someone else is not.",
  },
  {
    title: "Timber",
    term: "Five years",
    body: "The fixing, not the oil. Sun will silver jarrah. Silver is not a defect.",
  },
  {
    title: "Planting",
    term: "One season",
    body: "We replace a plant that dies in the first growing season if it was watered. An unwatered plant is not our failure.",
  },
  {
    title: "Not covered",
    term: "Excluded",
    body: "Vehicles on a path, later work by others, and movement we wrote down at the site visit.",
  },
];
