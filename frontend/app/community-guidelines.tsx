import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';

export default function CommunityGuidelinesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Community Guidelines</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last Updated: February 2025</Text>

        {/* Welcome Message */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Welcome to the MOOD Community</Text>
          <Text style={styles.paragraph}>
            We're building a supportive fitness community where everyone can share their journey, 
            celebrate progress, and motivate each other. These guidelines help keep MOOD a safe 
            and positive space for all members.
          </Text>
        </View>

        {/* Our Core Values */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Core Values</Text>
          
          <View style={styles.valueItem}>
            <Text style={styles.valueTitle}>Respect & Support</Text>
            <Text style={styles.valueText}>
              Treat every member with kindness. Celebrate others' progress regardless of fitness level.
            </Text>
          </View>
          
          <View style={styles.valueItem}>
            <Text style={styles.valueTitle}>Safety First</Text>
            <Text style={styles.valueText}>
              Exercise safely. Don't promote dangerous workouts or extreme behaviors.
            </Text>
          </View>
          
          <View style={styles.valueItem}>
            <Text style={styles.valueTitle}>Authenticity</Text>
            <Text style={styles.valueText}>
              Be yourself. Share your real journey—both the wins and the challenges.
            </Text>
          </View>
        </View>

        {/* What's Encouraged */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's Encouraged</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Share your workout achievements and progress</Text>
            <Text style={styles.bulletItem}>• Post motivational content and fitness tips</Text>
            <Text style={styles.bulletItem}>• Support and encourage other community members</Text>
            <Text style={styles.bulletItem}>• Ask questions and share knowledge</Text>
            <Text style={styles.bulletItem}>• Celebrate milestones—big and small</Text>
            <Text style={styles.bulletItem}>• Give constructive feedback when asked</Text>
            <Text style={styles.bulletItem}>• Report content that violates these guidelines</Text>
          </View>
        </View>

        {/* What's Not Allowed */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's Not Allowed</Text>
          
          <Text style={styles.subTitle}>Harassment & Hate</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Bullying, harassment, or intimidation</Text>
            <Text style={styles.bulletItem}>• Hate speech targeting any group or individual</Text>
            <Text style={styles.bulletItem}>• Threatening or violent language</Text>
            <Text style={styles.bulletItem}>• Body shaming or negative comments about appearance</Text>
            <Text style={styles.bulletItem}>• Discrimination of any kind</Text>
          </View>

          <Text style={styles.subTitle}>Inappropriate Content</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Sexually explicit or suggestive content</Text>
            <Text style={styles.bulletItem}>• Nudity (except appropriate fitness attire)</Text>
            <Text style={styles.bulletItem}>• Violence or graphic content</Text>
            <Text style={styles.bulletItem}>• Content promoting illegal activities</Text>
            <Text style={styles.bulletItem}>• Drug or substance promotion</Text>
          </View>

          <Text style={styles.subTitle}>Dangerous Behavior</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Promoting extreme dieting or eating disorders</Text>
            <Text style={styles.bulletItem}>• Dangerous workout challenges</Text>
            <Text style={styles.bulletItem}>• Unproven supplement promotion</Text>
            <Text style={styles.bulletItem}>• Medical advice without credentials</Text>
          </View>

          <Text style={styles.subTitle}>Spam & Deception</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Spam, scams, or deceptive content</Text>
            <Text style={styles.bulletItem}>• Fake accounts or impersonation</Text>
            <Text style={styles.bulletItem}>• Unauthorized commercial promotion</Text>
            <Text style={styles.bulletItem}>• Misleading transformation photos</Text>
          </View>
        </View>

        {/* Content Ownership */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Ownership</Text>
          <Text style={styles.paragraph}>
            Only post content you own or have permission to use. This includes:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Photos and videos you've taken</Text>
            <Text style={styles.bulletItem}>• Music you have rights to use</Text>
            <Text style={styles.bulletItem}>• Workout routines you've created or have permission to share</Text>
          </View>
          <Text style={styles.paragraph}>
            Using others' content without permission may result in content removal and potential account action.
          </Text>
        </View>

        {/* Reporting */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reporting Violations</Text>
          <Text style={styles.paragraph}>
            If you see content that violates these guidelines, please report it:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Tap the "..." menu on any post or profile</Text>
            <Text style={styles.bulletItem}>• Select "Report"</Text>
            <Text style={styles.bulletItem}>• Choose the reason for reporting</Text>
          </View>
          <Text style={styles.paragraph}>
            All reports are confidential. We review reports within 24 hours and take 
            appropriate action to maintain a safe community.
          </Text>
        </View>

        {/* Enforcement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enforcement</Text>
          <Text style={styles.paragraph}>
            Violations of these guidelines may result in:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Content removal</Text>
            <Text style={styles.bulletItem}>• Warning notification</Text>
            <Text style={styles.bulletItem}>• Temporary account suspension</Text>
            <Text style={styles.bulletItem}>• Permanent account ban</Text>
            <Text style={styles.bulletItem}>• Reporting to law enforcement (for illegal content)</Text>
          </View>
          <Text style={styles.paragraph}>
            Severe violations, especially those involving minors, illegal activity, 
            or threats of violence, will result in immediate permanent ban without warning.
          </Text>
        </View>

        {/* Appeals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appeals</Text>
          <Text style={styles.paragraph}>
            If you believe your content was removed in error or your account was 
            suspended unfairly, you can appeal by contacting us at:
          </Text>
          <Text style={styles.contactEmail}>support@moodfitnessapp.com</Text>
          <Text style={styles.paragraph}>
            Please include your username and a description of the issue. We'll review 
            your appeal within 7 business days.
          </Text>
        </View>

        {/* Closing */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Together, we can build a community that inspires everyone to achieve 
            their fitness goals. Thank you for being part of MOOD.
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ccc',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#999',
    marginBottom: 8,
  },
  valueItem: {
    marginBottom: 16,
  },
  valueTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ccc',
    marginBottom: 4,
  },
  valueText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#888',
  },
  bulletList: {
    marginLeft: 4,
  },
  bulletItem: {
    fontSize: 14,
    lineHeight: 26,
    color: '#888',
  },
  contactEmail: {
    fontSize: 14,
    color: '#fff',
    marginVertical: 8,
  },
  bottomPadding: {
    height: 40,
  },
});
