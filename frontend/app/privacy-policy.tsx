import React, { useState } from 'react';
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

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last Updated: January 2025</Text>

        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.paragraph}>
            Welcome to our fitness application. We are committed to protecting your privacy and ensuring 
            you understand how we collect, use, and safeguard your personal information. This Privacy 
            Policy explains our practices regarding data collection and usage.
          </Text>
        </View>

        {/* Information We Collect */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information We Collect</Text>
          
          <Text style={styles.subTitle}>Account Information & Login</Text>
          <Text style={styles.paragraph}>
            When you create an account or log in, we collect and use the following information for authentication and account management:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Email address (used for account verification, login, and password recovery)</Text>
            <Text style={styles.bulletItem}>• Username (used for identification within the app)</Text>
            <Text style={styles.bulletItem}>• Password (securely encrypted and stored)</Text>
            <Text style={styles.bulletItem}>• Profile picture (optional)</Text>
            <Text style={styles.bulletItem}>• Bio and personal information you choose to share</Text>
          </View>
          <Text style={styles.paragraph}>
            Your email address is used solely for authentication purposes, account recovery, and important 
            service-related communications. We do not share your email with third parties for marketing purposes.
          </Text>

          <Text style={styles.subTitle}>User-Generated Content (UGC)</Text>
          <Text style={styles.paragraph}>
            When you upload content to our platform, including photos, videos, and posts:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Images and videos you upload are stored securely using Cloudinary, a trusted cloud media management service</Text>
            <Text style={styles.bulletItem}>• Post captions, comments, and text content</Text>
            <Text style={styles.bulletItem}>• Workout cards and fitness content you create</Text>
          </View>
          <Text style={styles.paragraph}>
            Cloudinary processes and stores your media files securely. By uploading content, you acknowledge 
            that your media will be stored on Cloudinary's servers. For more information about Cloudinary's 
            data practices, please visit their privacy policy.
          </Text>

          <Text style={styles.subTitle}>Workout & Fitness Data</Text>
          <Text style={styles.paragraph}>
            To provide personalized fitness experiences, we track:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Workouts started, completed, skipped, or abandoned</Text>
            <Text style={styles.bulletItem}>• Exercise completion and progress</Text>
            <Text style={styles.bulletItem}>• Equipment preferences and selections</Text>
            <Text style={styles.bulletItem}>• Difficulty level preferences</Text>
            <Text style={styles.bulletItem}>• Mood and workout category selections</Text>
          </View>

          <Text style={styles.subTitle}>Analytics & Usage Tracking</Text>
          <Text style={styles.paragraph}>
            We collect analytics data to improve our app experience and understand how users interact with our services. This includes:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• App session start, duration, and end times</Text>
            <Text style={styles.bulletItem}>• Screen views and navigation patterns</Text>
            <Text style={styles.bulletItem}>• Tab switches and feature usage frequency</Text>
            <Text style={styles.bulletItem}>• App foreground/background state changes</Text>
            <Text style={styles.bulletItem}>• Button clicks and user interactions</Text>
            <Text style={styles.bulletItem}>• Device type and operating system (for compatibility)</Text>
            <Text style={styles.bulletItem}>• Error logs and crash reports (to improve stability)</Text>
          </View>
          <Text style={styles.paragraph}>
            Analytics data is collected in aggregate form and is used to improve app performance, identify 
            popular features, and enhance user experience. This data helps us make informed decisions about 
            future updates and features.
          </Text>

          <Text style={styles.subTitle}>Social Activity</Text>
          <Text style={styles.paragraph}>
            When you engage with our community features:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Posts you create and share</Text>
            <Text style={styles.bulletItem}>• Likes and comments on posts</Text>
            <Text style={styles.bulletItem}>• Users you follow or unfollow</Text>
            <Text style={styles.bulletItem}>• Profile views</Text>
            <Text style={styles.bulletItem}>• Content reports and blocks</Text>
          </View>
        </View>

        {/* How We Use Your Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use the collected information to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Authenticate your identity and secure your account</Text>
            <Text style={styles.bulletItem}>• Provide and improve our fitness services</Text>
            <Text style={styles.bulletItem}>• Personalize workout recommendations</Text>
            <Text style={styles.bulletItem}>• Track your fitness progress and achievements</Text>
            <Text style={styles.bulletItem}>• Analyze app performance and user experience through analytics</Text>
            <Text style={styles.bulletItem}>• Enable social features and community interactions</Text>
            <Text style={styles.bulletItem}>• Send relevant notifications (with your consent)</Text>
            <Text style={styles.bulletItem}>• Ensure platform security and prevent abuse</Text>
            <Text style={styles.bulletItem}>• Process and moderate user-generated content</Text>
          </View>
        </View>

        {/* Push Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Push Notifications</Text>
          <Text style={styles.paragraph}>
            We may send push notifications related to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Workout reminders and fitness goals</Text>
            <Text style={styles.bulletItem}>• Social interactions (likes, comments, new followers)</Text>
            <Text style={styles.bulletItem}>• New features and app updates</Text>
            <Text style={styles.bulletItem}>• Account security alerts</Text>
          </View>
          <Text style={styles.paragraph}>
            You can disable notifications at any time in your device settings or within the app's 
            notification preferences. Disabling notifications will not affect other app functionality.
          </Text>
        </View>

        {/* Third-Party Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Third-Party Services</Text>
          <Text style={styles.paragraph}>
            We use the following third-party services to operate our app:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Cloudinary - For secure storage and delivery of images and videos you upload</Text>
            <Text style={styles.bulletItem}>• MongoDB - For secure database storage of your account and activity data</Text>
          </View>
          <Text style={styles.paragraph}>
            These services have their own privacy policies governing how they handle data. We encourage 
            you to review their policies for more information.
          </Text>
        </View>

        {/* Data Storage & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Storage & Security</Text>
          <Text style={styles.paragraph}>
            Your data is stored securely using industry-standard encryption and security measures. 
            We implement appropriate technical and organizational safeguards to protect your personal 
            information against unauthorized access, alteration, or destruction.
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Passwords are encrypted using bcrypt hashing</Text>
            <Text style={styles.bulletItem}>• Authentication tokens are secured with JWT encryption</Text>
            <Text style={styles.bulletItem}>• Media files are stored on Cloudinary's secure cloud infrastructure</Text>
            <Text style={styles.bulletItem}>• All data transfers use HTTPS encryption</Text>
          </View>
        </View>

        {/* Data Sharing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Sharing</Text>
          <Text style={styles.paragraph}>
            We do not sell your personal information. We may share data with:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Service providers who assist in app operations (Cloudinary for media storage)</Text>
            <Text style={styles.bulletItem}>• Analytics processing for app improvement (aggregated, non-personal data)</Text>
            <Text style={styles.bulletItem}>• Legal authorities when required by law</Text>
          </View>
        </View>

        {/* Your Rights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Rights</Text>
          <Text style={styles.paragraph}>
            You have the right to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Access your personal data</Text>
            <Text style={styles.bulletItem}>• Request correction of inaccurate data</Text>
            <Text style={styles.bulletItem}>• Request deletion of your account and data</Text>
            <Text style={styles.bulletItem}>• Opt-out of non-essential data collection</Text>
            <Text style={styles.bulletItem}>• Export your fitness data</Text>
            <Text style={styles.bulletItem}>• Control your content filter preferences</Text>
          </View>
        </View>

        {/* Children's Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Children's Privacy</Text>
          <Text style={styles.paragraph}>
            Our app is not intended for children under 13 years of age. We do not knowingly collect 
            personal information from children under 13.
          </Text>
        </View>

        {/* Changes to Policy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Changes to This Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of any changes 
            by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </Text>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about this Privacy Policy or our data practices, please 
            contact us through the app's support feature or settings menu.
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
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
