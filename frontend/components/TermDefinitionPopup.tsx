import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Concise term definitions
export const TERM_DEFINITIONS: Record<string, { title: string; definition: string }> = {
  RPE: {
    title: 'RPE',
    definition: 'Rate of Perceived Exertion (1-10 scale). 5-6 is moderate, 7-8 is hard, 9-10 is max effort.',
  },
  SPM: {
    title: 'SPM',
    definition: 'Strokes Per Minute. 18-22 is easy pace, 26-30 is race pace, 30+ is sprint.',
  },
  AMRAP: {
    title: 'AMRAP',
    definition: 'As Many Rounds As Possible. Complete the circuit repeatedly until time expires.',
  },
  EMOM: {
    title: 'EMOM',
    definition: 'Every Minute On the Minute. Start the prescribed reps at the top of each minute.',
  },
  HIIT: {
    title: 'HIIT',
    definition: 'High Intensity Interval Training. Short bursts of max effort with rest periods.',
  },
  Tabata: {
    title: 'Tabata',
    definition: '20 seconds work, 10 seconds rest, repeated 8 times. Total: 4 minutes.',
  },
  Superset: {
    title: 'Superset',
    definition: 'Two exercises performed back-to-back with no rest between them.',
  },
  Circuit: {
    title: 'Circuit',
    definition: 'A series of exercises done one after another with minimal rest.',
  },
  RPM: {
    title: 'RPM',
    definition: 'Revolutions Per Minute. 80-90 is optimal, 100+ is sprint cadence.',
  },
  'Cluster Sets': {
    title: 'Cluster Sets',
    definition: 'Mini-sets with 10-30 second rest between. Allows heavier loads with quality reps.',
  },
  Clusters: {
    title: 'Clusters',
    definition: 'Mini-sets with 10-30 second rest between. Allows heavier loads with quality reps.',
  },
};

// All supported term types
export type TermType = 'RPE' | 'SPM' | 'AMRAP' | 'EMOM' | 'HIIT' | 'Tabata' | 'Superset' | 'Circuit' | 'RPM' | 'Cluster Sets' | 'Clusters';

interface TermDefinitionPopupProps {
  term: TermType;
  children?: React.ReactNode;
  style?: object;
}

export const TermDefinitionPopup: React.FC<TermDefinitionPopupProps> = ({ term, children, style }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const definition = TERM_DEFINITIONS[term];

  if (!definition) return <Text style={style}>{term}</Text>;

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.7}>
        {children || (
          <Text style={[styles.termLink, style]}>
            {term}
          </Text>
        )}
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        statusBarTranslucent={true}
      >
        <Pressable 
          style={styles.overlay} 
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.termTitle}>{definition.title}</Text>
            <Text style={styles.termDefinition}>{definition.definition}</Text>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

// Helper function to parse text and replace terms with clickable links
interface ParsedTextProps {
  text: string;
  baseStyle?: object;
  linkStyle?: object;
}

export const TextWithTermLinks: React.FC<ParsedTextProps> = ({ text, baseStyle, linkStyle }) => {
  // Regex to match all supported fitness terms
  const termRegex = /\b(RPE|SPM|AMRAP|EMOM|HIIT|Tabata|Superset|Circuit|RPM|cluster\s+sets?|clusters?)\b/gi;
  
  const parts: (string | { term: TermType; key: number })[] = [];
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
      normalizedTerm = normalizedTerm.toLowerCase().includes('set') ? 'Cluster Sets' : 'Clusters';
    } else {
      normalizedTerm = normalizedTerm.charAt(0).toUpperCase() + normalizedTerm.slice(1).toLowerCase();
    }
    parts.push({ term: normalizedTerm as TermType, key: keyCounter++ });
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
          <TermDefinitionPopup 
            key={`term-${part.key}`} 
            term={part.term}
            style={[styles.termLink, linkStyle]}
          />
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  contentContainer: {
    alignItems: 'center',
    maxWidth: 300,
  },
  termTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 1,
  },
  termDefinition: {
    fontSize: 17,
    color: '#ffffff',
    lineHeight: 26,
    textAlign: 'center',
    fontWeight: '400',
  },
});

export default TermDefinitionPopup;
