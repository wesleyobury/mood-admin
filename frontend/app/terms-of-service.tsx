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

export default function TermsOfServiceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last Updated: January 2025</Text>

        {/* Zero Tolerance Policy - CRITICAL FOR APP STORE */}
        <View style={[styles.section, styles.zeroToleranceSection]}>
          <View style={styles.warningHeader}>
            <Ionicons name="shield-checkmark" size={24} color="#FF3B30" />
            <Text style={styles.zeroToleranceTitle}>Zero Tolerance Policy</Text>
          </View>
          <Text style={styles.zeroToleranceParagraph}>
            WE HAVE ZERO TOLERANCE FOR OBJECTIONABLE CONTENT OR ABUSIVE USERS.
          </Text>
          <Text style={styles.paragraph}>
            By using this app, you agree that you will NOT post, share, or engage in any of the following:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Content that is offensive, abusive, or promotes violence</Text>
            <Text style={styles.bulletItem}>• Harassment, bullying, or threatening behavior towards any user</Text>
            <Text style={styles.bulletItem}>• Hate speech, discrimination, or content targeting any group</Text>
            <Text style={styles.bulletItem}>• Sexually explicit or pornographic material</Text>
            <Text style={styles.bulletItem}>• Content promoting illegal activities or substances</Text>
            <Text style={styles.bulletItem}>• Spam, scams, or deceptive content</Text>
            <Text style={styles.bulletItem}>• Content that infringes on others' rights or privacy</Text>
          </View>
          <Text style={styles.zeroToleranceWarning}>
            Violation of this policy will result in immediate account suspension or permanent ban. 
            We actively monitor content and investigate all reports. Severe violations may be reported 
            to law enforcement authorities.
          </Text>
        </View>

        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.paragraph}>
            Welcome to our fitness application. By using this app, you agree to these Terms of Service. 
            Please read them carefully before using our services.
          </Text>
        </View>

        {/* Health Disclaimer - IMPORTANT */}
        <View style={[styles.section, styles.warningSection]}>
          <View style={styles.warningHeader}>
            <Ionicons name="warning" size={24} color="#FF9500" />
            <Text style={styles.warningSectionTitle}>Health & Fitness Disclaimer</Text>
          </View>
          <Text style={styles.warningParagraph}>
            IMPORTANT: Users should consult a physician or other qualified healthcare professional 
            before beginning any fitness program, exercise routine, or dietary changes.
          </Text>
          <Text style={styles.paragraph}>
            The fitness content, workouts, and health information provided in this app are for 
            general informational purposes only and are not intended as medical advice. This app 
            does not provide medical diagnoses, treatment recommendations, or professional health advice.
          </Text>
          <Text style={styles.paragraph}>
            By using this app, you acknowledge and agree that:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• You should consult with a qualified healthcare provider before starting any new exercise program</Text>
            <Text style={styles.bulletItem}>• You are responsible for determining whether any exercise or workout is appropriate for your physical condition</Text>
            <Text style={styles.bulletItem}>• You should immediately stop exercising if you experience pain, dizziness, or discomfort</Text>
            <Text style={styles.bulletItem}>• The app creators are not responsible for any injuries that may occur from following the workouts</Text>
            <Text style={styles.bulletItem}>• Results may vary and are not guaranteed</Text>
          </View>
        </View>

        {/* Acceptance of Terms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing or using our application, you confirm that you:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Are at least 13 years of age</Text>
            <Text style={styles.bulletItem}>• Have read and understood these Terms of Service</Text>
            <Text style={styles.bulletItem}>• Agree to be bound by these terms</Text>
            <Text style={styles.bulletItem}>• Have consulted or will consult a healthcare professional before beginning any fitness program</Text>
          </View>
        </View>

        {/* User Accounts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Accounts</Text>
          <Text style={styles.paragraph}>
            When you create an account, you agree to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Provide accurate and complete information</Text>
            <Text style={styles.bulletItem}>• Maintain the security of your account credentials</Text>
            <Text style={styles.bulletItem}>• Accept responsibility for all activities under your account</Text>
            <Text style={styles.bulletItem}>• Notify us immediately of any unauthorized access</Text>
          </View>
        </View>

        {/* User Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User-Generated Content</Text>
          <Text style={styles.paragraph}>
            You may post content including photos, videos, comments, and workout data. By posting content, you:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Grant us a non-exclusive license to use, display, and distribute your content</Text>
            <Text style={styles.bulletItem}>• Confirm you own or have rights to the content you post</Text>
            <Text style={styles.bulletItem}>• Agree not to post illegal, harmful, or objectionable content</Text>
            <Text style={styles.bulletItem}>• Accept that we may remove content that violates these terms</Text>
          </View>
        </View>

        {/* Prohibited Conduct */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prohibited Conduct</Text>
          <Text style={styles.paragraph}>
            You agree not to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Harass, bully, or intimidate other users</Text>
            <Text style={styles.bulletItem}>• Post spam, advertisements, or malicious content</Text>
            <Text style={styles.bulletItem}>• Impersonate others or provide false information</Text>
            <Text style={styles.bulletItem}>• Attempt to hack or disrupt the app's functionality</Text>
            <Text style={styles.bulletItem}>• Use the app for any illegal purposes</Text>
            <Text style={styles.bulletItem}>• Share content that is violent, hateful, or sexually explicit</Text>
          </View>
        </View>

        {/* Explicit Content Prohibition */}
        <View style={[styles.section, styles.zeroToleranceSection]}>
          <View style={styles.warningHeader}>
            <Ionicons name="ban" size={24} color="#FF3B30" />
            <Text style={styles.zeroToleranceTitle}>Prohibited Sexual Content</Text>
          </View>
          <Text style={styles.paragraph}>
            The following content is STRICTLY PROHIBITED and will result in immediate account termination:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Pornographic or sexually explicit images, videos, or text</Text>
            <Text style={styles.bulletItem}>• Nudity or partial nudity intended to be sexual</Text>
            <Text style={styles.bulletItem}>• Sexual solicitation or offers of sexual services</Text>
            <Text style={styles.bulletItem}>• Content depicting sexual acts or fetishes</Text>
            <Text style={styles.bulletItem}>• Sexually suggestive content involving minors (ZERO TOLERANCE - reported to authorities)</Text>
            <Text style={styles.bulletItem}>• Links to pornographic websites or adult content</Text>
            <Text style={styles.bulletItem}>• Sexual harassment or unsolicited sexual messages</Text>
            <Text style={styles.bulletItem}>• Content promoting or glorifying non-consensual sexual activity</Text>
          </View>
          <Text style={styles.zeroToleranceWarning}>
            We use automated filtering and human moderation to detect and remove prohibited content. 
            Attempting to bypass our filters will result in permanent account suspension.
          </Text>
        </View>

        {/* Content Moderation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Moderation</Text>
          <Text style={styles.paragraph}>
            We reserve the right to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Review and moderate user-generated content</Text>
            <Text style={styles.bulletItem}>• Remove content that violates these terms</Text>
            <Text style={styles.bulletItem}>• Suspend or terminate accounts for violations</Text>
            <Text style={styles.bulletItem}>• Report illegal content to appropriate authorities</Text>
          </View>
          <Text style={styles.paragraph}>
            We aim to review reported content within 24 hours and take appropriate action to maintain 
            a safe and positive community.
          </Text>
        </View>

        {/* Intellectual Property */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Intellectual Property</Text>
          <Text style={styles.paragraph}>
            The app, including its design, features, and content (excluding user-generated content), 
            is owned by us and protected by intellectual property laws. You may not copy, modify, 
            distribute, or create derivative works without our permission.
          </Text>
        </View>

        {/* Disclaimer of Warranties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disclaimer of Warranties</Text>
          <Text style={styles.paragraph}>
            THE APP IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE THAT 
            THE APP WILL BE ERROR-FREE, SECURE, OR CONTINUOUSLY AVAILABLE. FITNESS RESULTS ARE 
            NOT GUARANTEED AND DEPEND ON INDIVIDUAL EFFORT AND CIRCUMSTANCES.
          </Text>
        </View>

        {/* Limitation of Liability */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, 
            INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE APP, 
            INCLUDING BUT NOT LIMITED TO PHYSICAL INJURIES RESULTING FROM EXERCISE.
          </Text>
        </View>

        {/* Termination */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Termination</Text>
          <Text style={styles.paragraph}>
            We may terminate or suspend your account at any time for violations of these terms. 
            You may also delete your account at any time through the app settings.
          </Text>
        </View>

        {/* Changes to Terms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We may update these Terms of Service from time to time. We will notify you of significant 
            changes by posting a notice in the app. Continued use of the app after changes constitutes 
            acceptance of the new terms.
          </Text>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have questions about these Terms of Service, please contact us through the app's 
            support feature in settings.
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
    borderBottomColor: 'rgba(255, 215, 0, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
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
    color: '#888',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  warningSection: {
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.25)',
  },
  zeroToleranceSection: {
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.25)',
  },
  zeroToleranceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700',
  },
  zeroToleranceParagraph: {
    fontSize: 15,
    lineHeight: 22,
    color: '#FF3B30',
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  zeroToleranceWarning: {
    fontSize: 13,
    lineHeight: 20,
    color: '#FF3B30',
    fontWeight: '600',
    marginTop: 12,
    fontStyle: 'italic',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  warningSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700',
  },
  warningParagraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#ccc',
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#ccc',
    marginBottom: 8,
  },
  bulletList: {
    marginLeft: 8,
    marginTop: 4,
  },
  bulletItem: {
    fontSize: 14,
    lineHeight: 24,
    color: '#aaa',
  },
  bottomPadding: {
    height: 40,
  },
});
