import React from 'react';
import { Text, StyleSheet } from 'react-native';

// Concise inline definitions for fitness terms
const TERM_DEFINITIONS: Record<string, string> = {
  RPE: 'effort 1-10',
  SPM: 'strokes/min',
  AMRAP: 'as many rounds as possible',
  EMOM: 'every min on the min',
  HIIT: 'high intensity intervals',
  Tabata: '20s work/10s rest x8',
  Superset: 'back-to-back exercises',
  Circuit: 'exercises in sequence',
  RPM: 'revolutions/min',
  'Cluster Sets': 'mini-sets with brief rest',
  Clusters: 'mini-sets with brief rest',
};

// Helper to get definition for a term (case-insensitive)
const getDefinition = (term: string): string | null => {
  // Direct match
  if (TERM_DEFINITIONS[term]) return TERM_DEFINITIONS[term];
  
  // Uppercase match (RPE, SPM, etc.)
  if (TERM_DEFINITIONS[term.toUpperCase()]) return TERM_DEFINITIONS[term.toUpperCase()];
  
  // Title case match
  const titleCase = term.charAt(0).toUpperCase() + term.slice(1).toLowerCase();
  if (TERM_DEFINITIONS[titleCase]) return TERM_DEFINITIONS[titleCase];
  
  // Cluster variations
  if (term.toLowerCase().includes('cluster')) return TERM_DEFINITIONS['Cluster Sets'];
  
  return null;
};

// Component that renders text with inline definitions for fitness terms
// No popups - just adds (definition) after each term
export const TextWithTermLinks: React.FC<{
  text: string;
  baseStyle?: object;
  linkStyle?: object;
}> = ({ text, baseStyle }) => {
  // Pattern to match fitness terms
  const termPattern = /\b(RPE|SPM|AMRAP|EMOM|HIIT|Tabata|Superset|Circuit|RPM|[Cc]luster\s*[Ss]ets?|[Cc]lusters?)\b/g;
  
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let keyIndex = 0;

  while ((match = termPattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      elements.push(
        <Text key={`t-${keyIndex++}`} style={baseStyle}>
          {text.slice(lastIndex, match.index)}
        </Text>
      );
    }
    
    const term = match[1];
    const definition = getDefinition(term);
    
    if (definition) {
      // Add term with inline definition in parentheses
      elements.push(
        <Text key={`term-${keyIndex++}`} style={baseStyle}>
          <Text style={styles.term}>{term}</Text>
          <Text style={styles.definition}> ({definition})</Text>
        </Text>
      );
    } else {
      // No definition found, just add the term as-is
      elements.push(
        <Text key={`term-${keyIndex++}`} style={baseStyle}>
          {term}
        </Text>
      );
    }
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    elements.push(
      <Text key={`t-${keyIndex++}`} style={baseStyle}>
        {text.slice(lastIndex)}
      </Text>
    );
  }

  // If no terms found, just return the text as-is
  if (elements.length === 0) {
    return <Text style={baseStyle}>{text}</Text>;
  }

  return (
    <Text style={baseStyle}>
      {elements}
    </Text>
  );
};

// Legacy export for backwards compatibility (now does nothing special)
export const TermDefinitionPopup: React.FC<{
  term: string;
  children?: React.ReactNode;
  style?: object;
}> = ({ term, children, style }) => {
  const definition = getDefinition(term);
  
  if (children) {
    return <>{children}</>;
  }
  
  if (definition) {
    return (
      <Text style={style}>
        <Text style={styles.term}>{term}</Text>
        <Text style={styles.definition}> ({definition})</Text>
      </Text>
    );
  }
  
  return <Text style={style}>{term}</Text>;
};

const styles = StyleSheet.create({
  term: {
    color: '#FFD700',
    fontWeight: '600',
  },
  definition: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
    fontSize: 12,
  },
});

export default TermDefinitionPopup;
