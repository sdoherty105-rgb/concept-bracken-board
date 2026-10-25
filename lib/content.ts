import type { ArtId } from "@/components/art";

export const SITE = {
  name: "Bracken & Board",
  slug: "bracken-board",
  conceptUrl: "https://offshiftstudio.com.au/concepts/bracken-board",
  conceptLabel: "An OFF/SHIFT concept — fictional demonstration",
  email: "hello@bracken-board.example",
  phone: "(08) 5550 0100",
};

export const services = [
  {
    n: "01",
    title: "Decks and screening",
    body: "Hardwood and composite decks, built-in seating and privacy screens, framed and fixed for hot, salty, sun-baked Australian conditions.",
    tags: ["Spotted gum", "Composite", "Screens"],
  },
  {
    n: "02",
    title: "Paving and hardscape",
    body: "Stone, clay and concrete paving, courtyards, entries and steps, laid on an engineered base so the lines stay true.",
    tags: ["Limestone", "Granite", "Clay brick"],
  },
  {
    n: "03",
    title: "Retaining and levels",
    body: "Limestone and sleeper retaining walls, terraces and stairs that turn a sloping yard into usable, drained, level ground.",
    tags: ["Terraces", "Steps", "Drainage"],
  },
  {
    n: "04",
    title: "Gardens and planting",
    body: "Design-led planting, lawn, mulch and reticulation. Layered, low-water gardens that look composed in every season.",
    tags: ["Natives", "Reticulation", "Lawn"],
  },
  {
    n: "05",
    title: "Outdoor rooms",
    body: "Pergolas, fire pits, outdoor kitchens and lighting that make the garden a place you move into, not just look at.",
    tags: ["Pergolas", "Lighting", "Fire pits"],
  },
];

export const steps = [
  {
    n: "01",
    title: "Consult",
    body: "We walk the site with you, listen to how you want to live outside, and talk plainly about budget before any drawing starts.",
  },
  {
    n: "02",
    title: "Design",
    body: "A scaled concept plan, a materials board and a written, itemised quote, so you know what you are choosing and what it costs.",
  },
  {
    n: "03",
    title: "Build",
    body: "One site lead from first dig to last plant. Clear weekly updates, protected access and a tidy site at the end of every day.",
  },
  {
    n: "04",
    title: "Handover",
    body: "A walk-through of the finished space, a written care guide for timber, stone and planting, and a follow-up visit once it settles in.",
  },
];

export type Material = {
  name: string;
  use: string;
  note: string;
  swatch: string;
};

export const materials: Material[] = [
  {
    name: "Spotted gum",
    use: "Decking, benches, screens",
    note: "Dense Australian hardwood with a warm, variable grain. Oiled to hold its colour, or left to silver.",
    swatch: "spotted-gum",
  },
  {
    name: "Limestone",
    use: "Paving, retaining, steps",
    note: "Pale, honed and slightly textured underfoot, it reflects light into shaded courtyards.",
    swatch: "limestone",
  },
  {
    name: "Granite",
    use: "Entries, edging, stepping stones",
    note: "Fine-grained and very hard-wearing. Flamed finishes give grip where it gets wet.",
    swatch: "granite",
  },
  {
    name: "Clay brick",
    use: "Garden walls, borders, paths",
    note: "Handmade-look clay that ages gracefully and sits well beside both timber and planting.",
    swatch: "clay",
  },
  {
    name: "Crushed gravel",
    use: "Paths, courtyards, dry beds",
    note: "Permeable, quiet underfoot and generous to tree roots. Bound or loose-laid.",
    swatch: "gravel",
  },
  {
    name: "Powder-coated steel",
    use: "Edging, planter boxes, pergola frames",
    note: "Crisp lines and slim profiles in a deep green finish that lets the planting lead.",
    swatch: "steel",
  },
];

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

export type Project = {
  id: string;
  title: string;
  kicker: string;
  brief: string;
  scope: string[];
  materials: string[];
  before: { art: ArtId; alt: string };
  after: { art: ArtId; alt: string };
};

export const projects: Project[] = [
  {
    id: "courtyard-deck",
    title: "The courtyard deck",
    kicker: "Decking and planting",
    brief:
      "A cracked concrete slab and patchy lawn sat between the kitchen and the back wall. Nobody used it, so we gave it a reason to be used.",
    scope: [
      "Break out and remove the old slab",
      "Frame and lay a spotted gum deck with hidden fixings",
      "Built-in bench with storage beneath",
      "Planter box with low-water natives and grasses",
    ],
    materials: ["Spotted gum", "Powder-coated steel", "Native grasses"],
    before: {
      art: "deck-before",
      alt: "Illustration of a courtyard before the work: a cracked concrete slab with weeds in the gaps, patchy dry lawn, a rotary clothesline and a bin against the house wall.",
    },
    after: {
      art: "deck-after",
      alt: "Illustration of the same courtyard after the work: a timber deck with a built-in bench and cushions, a green planter box with shrubs and grasses, and potted plants.",
    },
  },
  {
    id: "entry-path",
    title: "The entry path",
    kicker: "Paving and garden beds",
    brief:
      "The approach to the front door was bare soil, loose bricks and a broken path. The entry is the first thing anyone sees, so it deserved better.",
    scope: [
      "Excavate and compact a new engineered base",
      "Lay large-format stone pavers with a raised entry step",
      "Plant mulched beds either side with layered grasses and shrubs",
      "Low limestone garden wall and path lighting",
    ],
    materials: ["Limestone-toned pavers", "Limestone walling", "Dark mulch"],
    before: {
      art: "entry-before",
      alt: "Illustration of a front entry before the work: bare sandy soil, a cracked concrete path with weeds, a pile of loose bricks and a few scattered pavers.",
    },
    after: {
      art: "entry-after",
      alt: "Illustration of the same entry after the work: a path of large pale pavers leading to the front door, mulched beds with grasses and shrubs, small path lights and a low limestone wall.",
    },
  },
  {
    id: "terraced-garden",
    title: "The terraced garden",
    kicker: "Retaining, planting and pergola",
    brief:
      "A bare, weedy yard with a pile of old sleepers against the fence. We organised it into levels with a place to sit and a path to follow.",
    scope: [
      "Build a raised limestone terrace along the fence line",
      "Plant the beds with a feature tree and layered grasses",
      "Lay stepping stones through new lawn",
      "Timber pergola with built-in seating in the corner",
    ],
    materials: ["Limestone", "Spotted gum pergola", "Turf and natives"],
    before: {
      art: "garden-before",
      alt: "Illustration of a backyard before the work: bare dry ground with scattered weeds, a stack of old timber sleepers, a rusty drum and a plain fence.",
    },
    after: {
      art: "garden-after",
      alt: "Illustration of the same backyard after the work: a limestone terrace wall along the fence with planted beds and a small tree, stepping stones across green lawn, and a timber pergola with a bench.",
    },
  },
];
