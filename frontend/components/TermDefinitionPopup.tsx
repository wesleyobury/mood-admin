import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import Popover, { PopoverPlacement, PopoverMode } from 'react-native-popover-view';

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
  'Cluster Sets': 'Mini-sets with 10-30 sec rest between. Allows heavier loads.',
  Clusters: 'Mini-sets with 10-30 sec rest between. Allows heavier loads.',
};

interface TermDefinitionPopupProps {
  term: string;
  children?: React.ReactNode;
  style?: object;
}

export const TermDefinitionPopup: React.FC<TermDefinitionPopupProps> = ({ term, children, style }) => {
  const [visible, setVisible] = useState(false);
  const touchableRef = useRef<TouchableOpacity>(null);
  
  // Normalize term for lookup
  const definition = TERM_DEFINITIONS[term] || 
                     TERM_DEFINITIONS[term.toUpperCase()] || 
                     TERM_DEFINITIONS[term.charAt(0).toUpperCase() + term.slice(1).toLowerCase()];

  if (!definition) {
    return <Text style={style}>{term}</Text>;
  }

  return (
    <>
      <TouchableOpacity 
        ref={touchableRef}
        onPress={() => setVisible(true)} 
        activeOpacity={0.7}
        style={styles.termTouchable}
        hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
      >
        {children || (
          <Text style={[styles.termLink, style]}>{term}</Text>
        )}
      </TouchableOpacity>

      <Popover
        isVisible={visible}
        from={touchableRef}
        onRequestClose={() => setVisible(false)}
        placement={PopoverPlacement.TOP}
        popoverStyle={styles.popover}
        backgroundStyle={styles.popoverBackground}
        arrowSize={{ width: 12, height: 8 }}
        verticalOffset={Platform.OS === 'ios' ? -8 : 0}
        mode={PopoverMode.RN_MODAL}
      >
        <View style={styles.popoverContent}>
          <Text style={styles.popoverTitle}>{term}</Text>
          <Text style={styles.popoverText}>{definition}</Text>
          <TouchableOpacity 
            style={styles.popoverButton} 
            onPress={() => setVisible(false)}
            activeOpacity={0.7}
          >
            <Text style={styles.popoverButtonText}>Got it</Text>
          </TouchableOpacity>
        </View>
      </Popover>
    </>
  );
};

// Helper to parse text and create clickable terms - fixed inline rendering
export const TextWithTermLinks: React.FC<{
  text: string;
  baseStyle?: object;
  linkStyle?: object;
}> = ({ text, baseStyle, linkStyle }) => {
  // Match terms but preserve surrounding text structure
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
    
    // Normalize the term
    let normalizedTerm = match[1];
    if (['rpe', 'spm', 'amrap', 'emom', 'hiit', 'rpm'].includes(normalizedTerm.toLowerCase())) {
      normalizedTerm = normalizedTerm.toUpperCase();
    } else if (normalizedTerm.toLowerCase().includes('cluster')) {
      normalizedTerm = 'Cluster Sets';
    } else {
      normalizedTerm = normalizedTerm.charAt(0).toUpperCase() + normalizedTerm.slice(1).toLowerCase();
    }
    
    // Add the term link inline
    elements.push(
      <TermDefinitionPopup 
        key={`p-${keyIndex++}`} 
        term={normalizedTerm}
        style={[styles.inlineTermLink, linkStyle]}
      />
    );
    
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

  return (
    <Text style={[baseStyle, styles.textContainer]}>
      {elements}
    </Text>
  );
};

const styles = StyleSheet.create({
  termTouchable: {
    // No extra styling to keep inline
  },
  termLink: {
    color: '#FFD700',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  inlineTermLink: {
    color: '#FFD700',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  popover: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 0,
    maxWidth: 280,
  },
  popoverBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popoverContent: {
    padding: 16,
  },
  popoverTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 8,
  },
  popoverText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    marginBottom: 16,
  },
  popoverButton: {
    backgroundColor: '#444',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  popoverButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default TermDefinitionPopup;
