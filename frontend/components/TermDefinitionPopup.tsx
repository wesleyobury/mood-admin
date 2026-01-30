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
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Term definitions
export const TERM_DEFINITIONS: Record<string, { title: string; definition: string; icon: keyof typeof Ionicons.glyphMap }> = {
  RPE: {
    title: 'RPE - Rate of Perceived Exertion',
    definition: 'A scale from 1-10 measuring how hard you feel your body is working during exercise.\n\n• RPE 1-2: Very light, easy breathing\n• RPE 3-4: Light activity, can hold conversation\n• RPE 5-6: Moderate effort, slightly breathless\n• RPE 7-8: Hard effort, difficult to talk\n• RPE 9-10: Maximum effort, cannot sustain',
    icon: 'fitness',
  },
  SPM: {
    title: 'SPM - Strokes Per Minute',
    definition: 'The number of rowing strokes completed in one minute. It measures your rowing cadence/pace.\n\n• 18-22 SPM: Recovery/easy pace\n• 22-26 SPM: Steady state/moderate\n• 26-30 SPM: Race pace/hard effort\n• 30+ SPM: Sprint/maximum effort\n\nHigher SPM doesn\'t always mean more power - focus on strong, controlled strokes.',
    icon: 'boat',
  },
};

interface TermDefinitionPopupProps {
  term: 'RPE' | 'SPM';
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
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name={definition.icon} size={24} color="#FFD700" />
              </View>
              <Text style={styles.modalTitle}>{definition.title}</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <Text style={styles.modalDefinition}>{definition.definition}</Text>
            <TouchableOpacity 
              style={styles.gotItButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.gotItButtonText}>Got it!</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

// Helper function to parse text and replace RPE/SPM with clickable links
interface ParsedTextProps {
  text: string;
  baseStyle?: object;
  linkStyle?: object;
}

export const TextWithTermLinks: React.FC<ParsedTextProps> = ({ text, baseStyle, linkStyle }) => {
  // Regex to match RPE or SPM (with optional surrounding context like numbers)
  const termRegex = /\b(RPE|SPM)\b/g;
  
  const parts: (string | { term: 'RPE' | 'SPM'; key: number })[] = [];
  let lastIndex = 0;
  let match;
  let keyCounter = 0;

  while ((match = termRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Add the term
    parts.push({ term: match[1] as 'RPE' | 'SPM', key: keyCounter++ });
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 24,
    width: width - 48,
    maxWidth: 400,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    marginBottom: 16,
  },
  modalDefinition: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    marginBottom: 20,
  },
  gotItButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  gotItButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default TermDefinitionPopup;
