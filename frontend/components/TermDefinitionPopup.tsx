import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';

// Concise term definitions
const TERM_DEFINITIONS: Record<string, string> = {
  RPE: 'Rate of Perceived Exertion (1-10). 5-6 is moderate, 7-8 is hard, 9-10 is max.',
  SPM: 'Strokes Per Minute. 18-22 easy, 26-30 race pace, 30+ sprint.',
  AMRAP: 'As Many Rounds As Possible in the given time.',
  EMOM: 'Every Minute On the Minute. Start reps at each minute mark.',
  HIIT: 'High Intensity Interval Training. Max effort bursts with rest.',
  Tabata: '20 sec work, 10 sec rest × 8 rounds. Total 4 minutes.',
  Superset: 'Two exercises back-to-back with no rest.',
  Circuit: 'Series of exercises done one after another.',
  RPM: 'Revolutions Per Minute. 80-90 optimal, 100+ sprint.',
  'Cluster Sets': 'Mini-sets with 10-30 sec rest for heavier loads.',
  Clusters: 'Mini-sets with 10-30 sec rest for heavier loads.',
};

interface TermDefinitionPopupProps {
  term: string;
  children?: React.ReactNode;
  style?: object;
}

export const TermDefinitionPopup: React.FC<TermDefinitionPopupProps> = ({ term, children, style }) => {
  const [visible, setVisible] = useState(false);
  
  // Normalize term for lookup
  const normalizedTerm = term.toUpperCase();
  const definition = TERM_DEFINITIONS[term] || TERM_DEFINITIONS[normalizedTerm] || 
                     TERM_DEFINITIONS[term.charAt(0).toUpperCase() + term.slice(1).toLowerCase()];

  if (!definition) {
    return <Text style={style}>{term}</Text>;
  }

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)} activeOpacity={0.7}>
        {children || (
          <Text style={[styles.termLink, style]}>{term}</Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <View style={styles.modal}>
            <Text style={styles.title}>{term}</Text>
            <Text style={styles.definition}>{definition}</Text>
            <Text style={styles.hint}>Tap anywhere to close</Text>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

// Helper to parse text and create clickable terms
export const TextWithTermLinks: React.FC<{
  text: string;
  baseStyle?: object;
  linkStyle?: object;
}> = ({ text, baseStyle, linkStyle }) => {
  const termRegex = /\b(RPE|SPM|AMRAP|EMOM|HIIT|Tabata|Superset|Circuit|RPM|cluster\s*sets?|clusters?)\b/gi;
  
  const parts: (string | { term: string; key: number })[] = [];
  let lastIndex = 0;
  let match;
  let keyCounter = 0;

  while ((match = termRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    let normalizedTerm = match[1];
    if (['rpe', 'spm', 'amrap', 'emom', 'hiit', 'rpm'].includes(normalizedTerm.toLowerCase())) {
      normalizedTerm = normalizedTerm.toUpperCase();
    } else if (normalizedTerm.toLowerCase().includes('cluster')) {
      normalizedTerm = 'Cluster Sets';
    } else {
      normalizedTerm = normalizedTerm.charAt(0).toUpperCase() + normalizedTerm.slice(1).toLowerCase();
    }
    parts.push({ term: normalizedTerm, key: keyCounter++ });
    lastIndex = match.index + match[0].length;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return (
    <Text style={baseStyle}>
      {parts.map((part, index) => {
        if (typeof part === 'string') {
          return <Text key={`text-${index}`}>{part}</Text>;
        }
        return (
          <TermDefinitionPopup key={`term-${part.key}`} term={part.term} style={linkStyle} />
        );
      })}
    </Text>
  );
};

const styles = StyleSheet.create({
  termLink: {
    color: '#FFD700',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  modal: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    maxWidth: 320,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 12,
    textAlign: 'center',
  },
  definition: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    textAlign: 'center',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 16,
  },
});

export default TermDefinitionPopup;
