import { Sparkles } from 'lucide-react';
import { parseSummary } from '../utils/parseSummary';

function Item({ item }) {
  return (
    <li>
      {item.label && <strong>{item.label}:</strong>}
      {item.label && item.text ? ' ' : null}
      {item.text}
      {item.children.length > 0 && (
        <ul>
          {item.children.map((child, i) => (
            <li key={i}>{child}</li>
          ))}
        </ul>
      )}
    </li>
  );
}

function AiSummary({ text }) {
  const sections = parseSummary(text);
  if (sections.length === 0) return null;

  return (
    <section className="ai card" aria-labelledby="ai-title">
      <header className="ai-head">
        <span className="ai-icon" aria-hidden="true">
          <Sparkles size={18} />
        </span>
        <div>
          <h2 id="ai-title">AI summary</h2>
          <p className="muted">The findings below, explained in plain language.</p>
        </div>
      </header>

      <div className="ai-body">
        {sections.map((section, i) => {
          const isPriority = section.heading && /priorit/i.test(section.heading);
          return (
            <div key={i} className={`ai-section${isPriority ? ' is-priority' : ''}`}>
              {section.heading && <h3>{section.heading}</h3>}
              {section.nodes.map((node, j) => {
                if (node.type === 'p') return <p key={j}>{node.text}</p>;
                const Tag = node.ordered ? 'ol' : 'ul';
                return (
                  <Tag key={j}>
                    {node.items.map((item, k) => (
                      <Item key={k} item={item} />
                    ))}
                  </Tag>
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default AiSummary;
