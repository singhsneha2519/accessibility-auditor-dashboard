// Turns the AI teammate's plain-text summary into a simple structure the UI can render.
//
// Expected shape of the text (what the AI service returns today):
//
//   Executive Health Summary          <- short line = section heading
//   - first point                     <- "-" lines = bullets
//   - second point
//
//   Screen Readers
//   - Broken:                         <- a label with nothing after it groups the lines below it
//     - Missing language declaration
//   - Impact: Users cannot ...        <- "Label: text" gets a bold label
//
//   Top 3 Prioritized Actions
//   1. First action                   <- "1." lines = numbered list
//
// If the format changes, nothing breaks: unknown lines simply render as paragraphs.

const BULLET = /^\s*[-•*]\s+/;
const NUMBERED = /^\s*\d+[.)]\s+/;
const LABEL = /^([A-Za-z][A-Za-z /&-]{1,30}):\s*(.*)$/;

export function parseSummary(raw) {
  if (!raw) return [];

  const cleaned = String(raw)
    .replace(/\r/g, '')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/^#+\s*/gm, '');

  const blocks = cleaned
    .split(/\n\s*\n/)
    .map((b) => b.split('\n').filter((l) => l.trim()))
    .filter((lines) => lines.length > 0);

  return blocks.map((lines) => {
    const first = lines[0].trim();
    const firstIsList = BULLET.test(lines[0]) || NUMBERED.test(lines[0]);
    const isHeading = !firstIsList && first.length <= 60 && !/[.!?]$/.test(first);

    const heading = isHeading ? first : null;
    const body = isHeading ? lines.slice(1) : lines;

    const nodes = [];
    let list = null;

    body.forEach((line) => {
      const indent = line.match(/^\s*/)[0].length;
      const isBullet = BULLET.test(line);
      const isNumbered = NUMBERED.test(line);

      if (!isBullet && !isNumbered) {
        list = null;
        nodes.push({ type: 'p', text: line.trim() });
        return;
      }

      const ordered = isNumbered;
      const text = line.replace(ordered ? NUMBERED : BULLET, '').trim();

      if (!list || list.ordered !== ordered) {
        list = { type: 'list', ordered, items: [] };
        nodes.push(list);
      }

      const match = text.match(LABEL);
      const last = list.items[list.items.length - 1];

      // A line belongs under the previous item if it is indented further,
      // or if the previous item was a bare label like "Broken:".
      if (last && (indent > last.indent || (last.labelOnly && !match))) {
        last.children.push(text);
        return;
      }

      list.items.push({
        indent,
        label: match ? match[1] : null,
        text: match ? match[2] : text,
        labelOnly: Boolean(match) && match[2] === '',
        children: [],
      });
    });

    return { heading, nodes };
  });
}
