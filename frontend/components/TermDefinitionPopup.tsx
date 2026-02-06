import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
  'Cluster Sets': 'Mini-sets with 10-30 sec rest between. Allows heavier loads with quality reps.',
  Clusters: 'Mini-sets with 10-30 sec rest between. Allows heavier loads with quality reps.',
};

interface TermDefinitionPopupProps {
  term: string;
  children?: React.ReactNode;
  style?: object;
}

export const TermDefinitionPopup: React.FC<TermDefinitionPopupProps> = ({ term, children, style }) => {
  const [visible, setVisible] = useState(false);
  
  // Normalize term for lookup
  const definition = TERM_DEFINITIONS[term] || 
                     TERM_DEFINITIONS[term.toUpperCase()] || 
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
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.backdropTouchable} 
            activeOpacity={1} 
            onPress={() => setVisible(false)}
          />
          <View style={styles.modalContent}>
            <Text style={styles.termTitle}>{term}</Text>
            <Text style={styles.termDefinition}>{definition}</Text>
            <TouchableOpacity 
              style={styles.dismissButton} 
              onPress={() => setVisible(false)}
            >
              <Text style={styles.dismissButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    color: '#888',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 28,
    marginHorizontal: 40,
    width: SCREEN_WIDTH - 80,
    maxWidth: 320,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  termTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  termDefinition: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  dismissButton: {
    backgroundColor: '#444',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  dismissButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default TermDefinitionPopup;
