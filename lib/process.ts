/**
 * The Process essay.
 *
 * Copy lives here, apart from layout, so the artist can rewrite a caption
 * without opening a component. Register is exhibition wall text: concrete
 * nouns, short declaratives, no instructional voice. Nothing in here explains
 * "how to" do anything — it describes what happened to the paintings.
 */

export type ProcessMedia = {
  /** Written as if the photograph already exists. Becomes the real alt text. */
  alt: string;
  ratio?: "portrait" | "square" | "landscape" | "wide" | "cinema" | "panorama";
  image?: { src: string; width: number; height: number; blurDataURL?: string };
  /** Slot for the hand-weaving loop. Silent, autoplaying, no chrome. */
  clip?: { src: string; poster?: string; type?: string };
  /** Renders a generated weave instead of an empty plate. */
  weave?: [string, string];
  strip?: number;
  /** Shown while the slot is empty. */
  label?: string;
  note?: string;
};

export type ProcessBeat = {
  n: string;
  /** Short name, set small above the line. */
  name: string;
  /** The line. Display serif, the thing you read from across the room. */
  line: string;
  /** Two or three sentences. Never more. */
  body: string;
  media: ProcessMedia[];
  /** Layout treatment. Each beat gets the shape its content needs. */
  layout: "diptych" | "solo" | "pair" | "hero" | "grid";
};

export const processIntro = {
  eyebrow: "Process",
  title: ["Cut first.", "Then reweave."],
  wallText:
    "Every surface here began as two finished paintings. Both were resolved — brushwork closed, colour settled, nothing left to add — before either was touched. What happens next cannot be taken back.",
};

export const processBeats: ProcessBeat[] = [
  {
    n: "01",
    name: "The Source",
    line: "Two paintings, finished.",
    body: "Nothing is cut that was not first completed. José Rizal and Andrés Bonifacio, each resolved on its own terms, each signed in effect — hours before they stopped being separate.",
    layout: "diptych",
    media: [
      {
        alt: "Completed oil portrait of José Rizal, before the cut.",
        ratio: "portrait",
        label: "The first painting",
        note: "José Rizal, oil on canvas, intact.",
      },
      {
        alt: "Completed oil portrait of Andrés Bonifacio, before the cut.",
        ratio: "portrait",
        label: "The second painting",
        note: "Andrés Bonifacio, oil on canvas, intact.",
      },
    ],
  },
  {
    n: "02",
    name: "The Cut",
    line: "The point of no return.",
    body: "One pass, then another, then thirty more. Strips sometimes as narrow as a centimetre. There is no undo here, no second print, no saved file. What the blade opens stays open.",
    layout: "hero",
    media: [
      {
        alt: "A blade drawn through a finished canvas, opening the first strip.",
        ratio: "cinema",
        label: "The blade",
        note: "The single most important photograph in this sequence.",
      },
    ],
  },
  {
    n: "03",
    name: "Mid-Weave",
    line: "Over, under. Over, under.",
    body: "The strips are clipped and held in tension while the interlace is built entirely by hand. The image returns slowly and then all at once — a face surfacing through a grid nobody drew.",
    layout: "pair",
    media: [
      {
        alt: "Hands weaving canvas strips, one over, one under.",
        ratio: "landscape",
        label: "Hand-weaving loop",
        note: "Short silent clip. Twenty to forty seconds, no cuts.",
      },
      {
        alt: "A painting mid-weave, strips clipped and held in tension.",
        ratio: "landscape",
        weave: ["var(--achuete-500)", "var(--tayum-500)"],
        strip: 15,
      },
    ],
  },
  {
    n: "04",
    name: "The Surface",
    line: "A third thing.",
    body: "Neither the first painting nor the second. Two histories, two palettes, two moments in time, holding each other in place. The gaps between strips are left visible — the silence between notes that makes music possible.",
    layout: "solo",
    media: [
      {
        alt: "The finished woven surface, two portraits interlaced into one image.",
        ratio: "wide",
        weave: ["var(--achuete-500)", "var(--dagat-500)"],
        strip: 18,
      },
    ],
  },
  {
    n: "05",
    name: "Tigbauan",
    line: "Where it happens.",
    body: "A small home studio on Panay Island. A stack of finished weaves against the wall. A green canvas tent in the daylight, and a barangay crowd walking past the work on their way somewhere else.",
    layout: "grid",
    media: [
      {
        alt: "Finished woven canvases stacked in the studio.",
        ratio: "square",
        label: "The stack",
        note: "Finished weaves, awaiting framing.",
      },
      {
        alt: "The work table: blades, clips, and cut strips.",
        ratio: "square",
        label: "The table",
        note: "Blades, clips, cut strips.",
      },
      {
        alt: "Works on view under a green canvas tent at an open-air fair in Iloilo.",
        ratio: "square",
        label: "The green tent",
        note: "Open-air fair, Iloilo.",
      },
      {
        alt: "The artist presenting the woven-canvas process during a talk.",
        ratio: "square",
        label: "The talk",
        note: "Walking through the weave, piece in hand.",
      },
    ],
  },
];

export const processClosing =
  "Two paintings entered the studio. One surface left it.";
