export const SITE = {
  name: "Bracken & Board",
  slug: "bracken-board",
  conceptUrl: "https://offshiftstudio.com.au/concepts/bracken-board",
  conceptLabel: "An OFF/SHIFT concept — fictional demonstration",
  email: "hello@bracken-board.example",
  phone: "(08) 5550 0100",
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

export const budgets = [
  "Under $15,000",
  "$15,000 – $30,000",
  "$30,000 – $60,000",
  "$60,000 – $100,000",
  "$100,000 or more",
  "Not sure yet",
];

export type Plate = { photo: string; alt: string };

export type Detail = Plate & { caption: string };

export type Project = {
  id: string;
  no: string;
  title: string;
  site: string;
  completed: string;
  duration: string;
  kind: string;
  /** Which project type the quote form starts on when you begin a project like this one. */
  quoteType: string;
  brief: string;
  notes: string;
  scope: string[];
  materials: string[];
  before: Plate;
  after: Plate;
  details: Detail[];
};

export const projects: Project[] = [
  {
    id: "courtyard-deck",
    no: "001",
    title: "The courtyard deck",
    site: "Wattlebrook",
    completed: "March 2025",
    duration: "Five weeks",
    kind: "Decking and planting",
    quoteType: "Deck or screening",
    brief:
      "A cracked concrete slab and patchy lawn sat between the kitchen and the back wall. Nobody used it, so we gave it a reason to be used.",
    notes:
      "The deck runs at the same level as the kitchen floor, so the sliding doors open straight onto it. The bench hides storage for cushions, and the planter box screens the neighbour's window without blocking the morning light.",
    scope: [
      "Break out and remove the old slab",
      "Frame and lay a spotted gum deck with hidden fixings",
      "Built-in bench with storage beneath",
      "Planter box with low-water natives and grasses",
    ],
    materials: ["Spotted gum", "Powder-coated steel", "Native grasses"],
    before: {
      photo: "deck-before",
      alt: "The courtyard before the work: a cracked concrete slab with weeds in the gaps, patchy dry lawn, a rotary clothesline and a bin against the house wall.",
    },
    after: {
      photo: "deck-after",
      alt: "The same courtyard after the work: a timber deck in dappled shade, a built-in bench with cushions below the sliding doors, a dark planter box with shrubs and grasses, and potted plants.",
    },
    details: [
      { photo: "deck-after-bench", caption: "The bench, with cushion storage beneath the seat", alt: "Close view of the timber bench with sage cushions in front of the glass doors." },
      { photo: "deck-after-boards", caption: "Hidden-fix spotted gum boards in afternoon shade", alt: "Close view of the timber deck boards with leaf shadows falling across them." },
    ],
  },
  {
    id: "entry-path",
    no: "002",
    title: "The entry path",
    site: "Coralvale",
    completed: "August 2025",
    duration: "Three weeks",
    kind: "Paving and garden beds",
    quoteType: "Paving or entry",
    brief:
      "The approach to the front door was bare soil, loose bricks and a broken path. The entry is the first thing anyone sees, so it deserved better.",
    notes:
      "Large pavers mean fewer joints and a calmer line to the door. The beds are planted low at the path edge and taller towards the walls, so the house stays visible from the street while the path feels enclosed.",
    scope: [
      "Excavate and compact a new engineered base",
      "Lay large-format stone pavers with a raised entry step",
      "Plant mulched beds either side with layered grasses and shrubs",
      "Low limestone garden wall and path lighting",
    ],
    materials: ["Limestone-toned pavers", "Limestone walling", "Dark mulch"],
    before: {
      photo: "entry-before",
      alt: "The front entry before the work: bare sandy soil, a cracked concrete path with weeds, a pile of loose bricks and a few scattered pavers.",
    },
    after: {
      photo: "entry-after",
      alt: "The same entry after the work: a path of large pale pavers leading to the front door, mulched beds with grasses and shrubs, small path lights and a low limestone wall.",
    },
    details: [
      { photo: "entry-after-lights", caption: "Path lights set into the bed edge, not the paving", alt: "Close view of the pale pavers with a small black path light at the edge of the planted bed." },
      { photo: "entry-after-wall", caption: "Dry-laid limestone wall, three courses high", alt: "Close view of the low limestone block wall with rounded shrubs planted behind it." },
    ],
  },
  {
    id: "terraced-garden",
    no: "003",
    title: "The terraced garden",
    site: "Marri Heights",
    completed: "February 2026",
    duration: "Seven weeks",
    kind: "Retaining, planting and pergola",
    quoteType: "Retaining walls or terraces",
    brief:
      "A bare, weedy yard with a pile of old sleepers against the fence. We organised it into levels with a place to sit and a path to follow.",
    notes:
      "The terrace takes up the fall of the block, so the lawn below is level enough to use. The stepping stones lead the eye to the pergola, which sits in the one corner that gets shade all afternoon.",
    scope: [
      "Build a raised limestone terrace along the fence line",
      "Plant the beds with a feature tree and layered grasses",
      "Lay stepping stones through new lawn",
      "Timber pergola with built-in seating in the corner",
    ],
    materials: ["Limestone", "Spotted gum pergola", "Turf and natives"],
    before: {
      photo: "garden-before",
      alt: "The backyard before the work: bare dry ground with scattered weeds, a stack of old timber sleepers, a rusty drum and a plain fence.",
    },
    after: {
      photo: "garden-after",
      alt: "The same backyard after the work: a limestone terrace wall along the fence with planted beds and a small tree, stepping stones across green lawn in dappled shade, and a timber pergola with a bench.",
    },
    details: [
      { photo: "garden-after-pergola", caption: "The pergola corner, in shade from two o'clock", alt: "Close view of the timber pergola posts and a small bench, with grasses on the terrace behind." },
      { photo: "garden-after-stones", caption: "Stepping stones set flush with the lawn for the mower", alt: "Close view of pale stepping stones across the lawn, leading up to the terrace wall." },
    ],
  },
];

export const practice = {
  lede: "Bracken & Board is a small team of designers and builders in Perth. We draw a garden, a deck or a path, then build it ourselves, so the drawing and the finished work match.",
  work: "Decks and screening, paving and entries, retaining walls and terraces, planting and reticulation, pergolas and outdoor rooms.",
  how: "Every project starts with a site visit and a plain conversation about budget. You get a scaled plan, a materials board and an itemised quote before anything is dug. One site lead runs the build from the first day to the handover.",
};
