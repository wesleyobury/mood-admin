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
  AMRAP: {
    title: 'AMRAP - As Many Rounds As Possible',
    definition: 'A workout format where you complete as many rounds of a set of exercises as possible within a time limit.\n\n• Set a timer (e.g., 10, 15, or 20 minutes)\n• Perform the prescribed exercises in order\n• Once you finish all exercises, that\'s 1 round\n• Repeat until time runs out\n\nGreat for building endurance and tracking progress over time!',
    icon: 'repeat',
  },
  EMOM: {
    title: 'EMOM - Every Minute On the Minute',
    definition: 'A workout format where you perform a specific exercise at the start of every minute, then rest for the remainder.\n\n• At 0:00 - Do prescribed reps\n• Rest until 1:00\n• At 1:00 - Do prescribed reps again\n• Continue for set duration\n\nThe faster you finish, the more rest you get. Keeps intensity high and workouts efficient!',
    icon: 'timer',
  },
  HIIT: {
    title: 'HIIT - High Intensity Interval Training',
    definition: 'A training method alternating between intense bursts of activity and fixed periods of less-intense activity or rest.\n\n• Work intervals: 20-60 seconds at 80-95% max effort\n• Rest intervals: Equal or longer than work time\n• Total duration: Usually 15-30 minutes\n\nBurns more calories in less time and keeps your metabolism elevated for hours after!',
    icon: 'flash',
  },
  Tabata: {
    title: 'Tabata - 20/10 Interval Protocol',
    definition: 'A specific high-intensity interval training format developed by Dr. Izumi Tabata.\n\n• 20 seconds: Maximum effort work\n• 10 seconds: Complete rest\n• Repeat: 8 rounds (4 minutes total)\n\nOne of the most efficient workout protocols - just 4 minutes can significantly improve both aerobic and anaerobic fitness!',
    icon: 'stopwatch',
  },
  Superset: {
    title: 'Superset - Back-to-Back Exercises',
    definition: 'Performing two exercises back-to-back with no rest in between.\n\n• Antagonist superset: Opposite muscles (biceps + triceps)\n• Compound superset: Same muscle group\n• Upper/Lower superset: Alternating body parts\n\nSaves time and increases workout intensity. Rest after completing both exercises.',
    icon: 'swap-horizontal',
  },
  Circuit: {
    title: 'Circuit - Exercise Rotation',
    definition: 'A series of exercises performed one after another with minimal rest between them.\n\n• 5-10 different exercises\n• Perform each for time or reps\n• Move to next exercise immediately\n• Rest after completing full circuit\n• Repeat 2-4 rounds\n\nGreat for full-body conditioning and keeping heart rate elevated!',
    icon: 'sync',
  },
  RPM: {
    title: 'RPM - Revolutions Per Minute',
    definition: 'The number of complete pedal rotations per minute on a bike or elliptical.\n\n• 60-70 RPM: Heavy resistance/climbing\n• 80-90 RPM: Optimal efficiency zone\n• 90-100 RPM: High cadence/speed work\n• 100+ RPM: Sprint cadence\n\nHigher RPM with lower resistance = cardio focus. Lower RPM with higher resistance = strength focus.',
    icon: 'speedometer',
  },
};

// All supported term types
export type TermType = 'RPE' | 'SPM' | 'AMRAP' | 'EMOM' | 'HIIT' | 'Tabata' | 'Superset' | 'Circuit' | 'RPM';

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
  // Regex to match all supported fitness terms (case-sensitive for acronyms, case-insensitive for Tabata/Superset/Circuit)
  const termRegex = /\b(RPE|SPM|AMRAP|EMOM|HIIT|Tabata|Superset|Circuit|RPM)\b/gi;
  
  const parts: (string | { term: TermType; key: number })[] = [];
  let lastIndex = 0;
  let match;
  let keyCounter = 0;

  while ((match = termRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Normalize term to match dictionary keys (handle case variations)
    let normalizedTerm = match[1];
    // Uppercase acronyms stay uppercase, others get proper casing
    if (['rpe', 'spm', 'amrap', 'emom', 'hiit', 'rpm'].includes(normalizedTerm.toLowerCase())) {
      normalizedTerm = normalizedTerm.toUpperCase();
    } else {
      // Capitalize first letter for Tabata, Superset, Circuit
      normalizedTerm = normalizedTerm.charAt(0).toUpperCase() + normalizedTerm.slice(1).toLowerCase();
    }
    // Add the term
    parts.push({ term: normalizedTerm as TermType, key: keyCounter++ });
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
