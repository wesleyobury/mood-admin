import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const openEmail = () => {
    Linking.openURL('mailto:privacy@moodfitnessapp.com');
  };

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
        <Text style={styles.lastUpdated}>Last Updated: January 19, 2025</Text>
        <Text style={styles.effectiveDate}>Effective Date: January 19, 2025</Text>

        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.paragraph}>
            Welcome to MOOD ("we," "our," or "us"). We are committed to protecting your privacy and ensuring 
            you understand how we collect, use, store, and safeguard your personal information. This Privacy 
            Policy explains our practices regarding data collection and usage in compliance with applicable 
            privacy laws, including the California Consumer Privacy Act (CCPA), General Data Protection 
            Regulation (GDPR), and Apple's App Store Guidelines (Section 5.1.1).
          </Text>
          <Text style={styles.paragraph}>
            By using our application, you acknowledge that you have read, understood, and agree to the 
            terms of this Privacy Policy. If you do not agree with our practices, please do not use our services.
          </Text>
        </View>

        {/* Key Privacy Commitments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Our Privacy Commitments</Text>
          <Text style={styles.paragraph}>
            We are committed to the following privacy principles:
          </Text>
          <View style={styles.highlightBox}>
            <Text style={styles.highlightItem}>✓ We do NOT sell your personal data to third parties</Text>
            <Text style={styles.highlightItem}>✓ We do NOT use your data for advertising purposes</Text>
            <Text style={styles.highlightItem}>✓ We do NOT track you across other apps or websites</Text>
            <Text style={styles.highlightItem}>✓ We do NOT share your data with data brokers</Text>
            <Text style={styles.highlightItem}>✓ We do NOT use third-party advertising SDKs</Text>
            <Text style={styles.highlightItem}>✓ We collect only what is necessary to provide our services</Text>
          </View>
        </View>

        {/* Information We Collect */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Information We Collect</Text>
          
          <Text style={styles.subTitle}>3.1 Account Information (Registered Users)</Text>
          <Text style={styles.paragraph}>
            When you create an account, we collect:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Email address</Text> - Used for account verification, login authentication, password recovery, and essential service communications</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Username</Text> - Used for identification within the app and community features</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Password</Text> - Securely encrypted using bcrypt hashing; we cannot see your password</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Profile picture</Text> (optional) - Displayed on your profile and posts</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Bio and display name</Text> (optional) - Information you choose to share publicly</Text>
          </View>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Purpose:</Text> To create and manage your account, authenticate your identity, and enable community features.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Legal basis:</Text> Contract performance (providing our services) and legitimate interest (account security).
          </Text>

          <Text style={styles.subTitle}>3.2 Guest User Data</Text>
          <Text style={styles.paragraph}>
            If you use our app without creating an account (as a guest), we collect:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Device identifier</Text> - A randomly generated unique ID stored locally on your device to maintain session continuity</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Usage analytics</Text> - Screen views, feature interactions, and workout selections (see Section 3.5)</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Device type and OS version</Text> - For app compatibility and crash reporting</Text>
          </View>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Purpose:</Text> To provide app functionality, improve user experience, and enable seamless transition to a registered account.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Note:</Text> If you later create an account, your guest activity may be merged with your registered account to preserve your workout history and preferences.
          </Text>

          <Text style={styles.subTitle}>3.3 User-Generated Content (UGC)</Text>
          <Text style={styles.paragraph}>
            When you upload or create content, we collect and store:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Photos and videos</Text> - Media files you upload for posts or profile pictures</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Post captions and text</Text> - Written content accompanying your posts</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Comments</Text> - Text you post on other users' content</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Workout cards</Text> - Fitness content you create and share</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Direct messages</Text> - Private conversations with other users</Text>
          </View>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Storage:</Text> Media files are securely stored using Cloudinary, a trusted third-party cloud media management service. Text content is stored in our MongoDB database.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Purpose:</Text> To enable community features, content sharing, and social interactions within the app.
          </Text>

          <Text style={styles.subTitle}>3.4 Workout & Fitness Data</Text>
          <Text style={styles.paragraph}>
            To provide personalized fitness experiences, we track:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Workouts started, completed, skipped, or abandoned</Text>
            <Text style={styles.bulletItem}>• Exercise completion and progress</Text>
            <Text style={styles.bulletItem}>• Equipment preferences and selections</Text>
            <Text style={styles.bulletItem}>• Difficulty level preferences (beginner, intermediate, advanced)</Text>
            <Text style={styles.bulletItem}>• Mood and workout category selections</Text>
            <Text style={styles.bulletItem}>• Saved and bookmarked workouts</Text>
            <Text style={styles.bulletItem}>• Workout duration and time spent</Text>
          </View>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Purpose:</Text> To track your fitness progress, provide personalized workout recommendations, and improve our workout content.
          </Text>

          <Text style={styles.subTitle}>3.5 Analytics & Usage Data</Text>
          <Text style={styles.paragraph}>
            We collect analytics data to improve our app. This applies to both registered and guest users:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• App session start, duration, and end times</Text>
            <Text style={styles.bulletItem}>• Screen views and navigation patterns</Text>
            <Text style={styles.bulletItem}>• Tab switches and feature usage frequency</Text>
            <Text style={styles.bulletItem}>• Button clicks and user interactions</Text>
            <Text style={styles.bulletItem}>• App foreground/background state changes</Text>
            <Text style={styles.bulletItem}>• Device type, model, and operating system version</Text>
            <Text style={styles.bulletItem}>• App version</Text>
            <Text style={styles.bulletItem}>• Error logs and crash reports</Text>
            <Text style={styles.bulletItem}>• Search queries within the app</Text>
          </View>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Purpose:</Text> To improve app performance, identify and fix bugs, understand feature popularity, and enhance user experience. Analytics are processed internally and not shared with third-party analytics services.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Important:</Text> This data is NOT used for advertising, tracking across other apps/websites, or building advertising profiles.
          </Text>

          <Text style={styles.subTitle}>3.6 Social & Community Data</Text>
          <Text style={styles.paragraph}>
            When you engage with community features:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Posts you create and their engagement metrics</Text>
            <Text style={styles.bulletItem}>• Likes you give and receive</Text>
            <Text style={styles.bulletItem}>• Comments you make</Text>
            <Text style={styles.bulletItem}>• Users you follow or unfollow</Text>
            <Text style={styles.bulletItem}>• Profile views (who viewed your profile)</Text>
            <Text style={styles.bulletItem}>• Content reports you submit</Text>
            <Text style={styles.bulletItem}>• Users you block</Text>
          </View>

          <Text style={styles.subTitle}>3.7 Device Permissions</Text>
          <Text style={styles.paragraph}>
            Our app may request the following device permissions:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Camera</Text> - To record photos and videos for posts and profile pictures</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Microphone</Text> - To record audio when creating videos</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Photo Library (Read)</Text> - To select existing photos/videos for upload</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Photo Library (Write)</Text> - To save content to your device</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Push Notifications</Text> - To send you relevant updates (optional)</Text>
          </View>
          <Text style={styles.paragraph}>
            You can revoke these permissions at any time through your device settings. Revoking permissions may limit certain app functionality.
          </Text>
        </View>

        {/* How We Use Your Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use your information for the following purposes:
          </Text>
          
          <Text style={styles.subTitle}>4.1 Service Provision</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Authenticate your identity and secure your account</Text>
            <Text style={styles.bulletItem}>• Provide workout content and fitness tracking features</Text>
            <Text style={styles.bulletItem}>• Enable community features (posts, comments, follows)</Text>
            <Text style={styles.bulletItem}>• Process and display user-generated content</Text>
            <Text style={styles.bulletItem}>• Send service-related notifications</Text>
          </View>

          <Text style={styles.subTitle}>4.2 Personalization</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Recommend workouts based on your preferences and history</Text>
            <Text style={styles.bulletItem}>• Track and display your fitness progress</Text>
            <Text style={styles.bulletItem}>• Customize content based on your selected difficulty level</Text>
          </View>

          <Text style={styles.subTitle}>4.3 App Improvement</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Analyze usage patterns to improve features</Text>
            <Text style={styles.bulletItem}>• Identify and fix bugs and performance issues</Text>
            <Text style={styles.bulletItem}>• Develop new features based on user behavior</Text>
          </View>

          <Text style={styles.subTitle}>4.4 Safety & Security</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Prevent fraud and unauthorized access</Text>
            <Text style={styles.bulletItem}>• Enforce our Terms of Service and Community Guidelines</Text>
            <Text style={styles.bulletItem}>• Moderate user-generated content</Text>
            <Text style={styles.bulletItem}>• Respond to content reports and safety concerns</Text>
          </View>

          <Text style={styles.subTitle}>4.5 What We Do NOT Use Your Data For</Text>
          <View style={styles.highlightBox}>
            <Text style={styles.highlightItem}>✗ We do NOT use your data for targeted advertising</Text>
            <Text style={styles.highlightItem}>✗ We do NOT track you across other apps or websites</Text>
            <Text style={styles.highlightItem}>✗ We do NOT sell your data to third parties</Text>
            <Text style={styles.highlightItem}>✗ We do NOT share your data with data brokers</Text>
            <Text style={styles.highlightItem}>✗ We do NOT build advertising profiles about you</Text>
            <Text style={styles.highlightItem}>✗ We do NOT use your data for political profiling</Text>
          </View>
        </View>

        {/* Data Storage & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Data Storage & Security</Text>
          
          <Text style={styles.subTitle}>5.1 Where We Store Your Data</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Account and activity data</Text> - Stored in MongoDB Atlas (cloud database with enterprise-grade security)</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Media files (photos/videos)</Text> - Stored on Cloudinary's secure cloud infrastructure</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Local device data</Text> - Session tokens and preferences stored securely on your device</Text>
          </View>

          <Text style={styles.subTitle}>5.2 Security Measures</Text>
          <Text style={styles.paragraph}>
            We implement robust security measures to protect your data:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Password encryption</Text> - All passwords are hashed using bcrypt with salt</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Authentication tokens</Text> - Secured with JWT encryption and regular expiration</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Data in transit</Text> - All communications use HTTPS/TLS encryption</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Data at rest</Text> - Database encryption for stored data</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Access controls</Text> - Strict access controls for our team members</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Regular audits</Text> - Security practices reviewed regularly</Text>
          </View>

          <Text style={styles.subTitle}>5.3 Data Retention</Text>
          <Text style={styles.paragraph}>
            We retain your data as follows:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Account data</Text> - Retained while your account is active and for 30 days after deletion request</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>User-generated content</Text> - Retained until you delete it or delete your account</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Analytics data</Text> - Retained for up to 24 months for trend analysis, then anonymized or deleted</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Guest user data</Text> - Retained for 12 months of inactivity, then deleted</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Backup data</Text> - Retained for up to 90 days for disaster recovery</Text>
          </View>
        </View>

        {/* Data Sharing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Data Sharing & Third Parties</Text>
          
          <Text style={styles.subTitle}>6.1 Service Providers</Text>
          <Text style={styles.paragraph}>
            We share data with the following service providers who help operate our app:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Cloudinary</Text> - Media storage and delivery (photos and videos you upload)</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>MongoDB Atlas</Text> - Database hosting and management</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Expo/React Native</Text> - App development and push notification infrastructure</Text>
          </View>
          <Text style={styles.paragraph}>
            These providers are contractually obligated to protect your data and use it only for the services they provide to us.
          </Text>

          <Text style={styles.subTitle}>6.2 What We Do NOT Share</Text>
          <View style={styles.highlightBox}>
            <Text style={styles.highlightItem}>✗ We do NOT sell your personal information</Text>
            <Text style={styles.highlightItem}>✗ We do NOT share data with advertisers</Text>
            <Text style={styles.highlightItem}>✗ We do NOT share data with data brokers</Text>
            <Text style={styles.highlightItem}>✗ We do NOT share data for cross-app tracking</Text>
            <Text style={styles.highlightItem}>✗ We do NOT share data with social media platforms for advertising</Text>
          </View>

          <Text style={styles.subTitle}>6.3 Legal Requirements</Text>
          <Text style={styles.paragraph}>
            We may disclose your information if required by law, such as:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• In response to valid legal process (court orders, subpoenas)</Text>
            <Text style={styles.bulletItem}>• To protect our rights, privacy, safety, or property</Text>
            <Text style={styles.bulletItem}>• To protect users from fraud, abuse, or illegal activities</Text>
            <Text style={styles.bulletItem}>• In connection with a merger, acquisition, or sale of assets (with notice to users)</Text>
          </View>

          <Text style={styles.subTitle}>6.4 Public Content</Text>
          <Text style={styles.paragraph}>
            Content you post publicly (posts, comments, profile information) may be visible to other users 
            of the app. Please consider this before sharing personal information in public posts.
          </Text>
        </View>

        {/* User Rights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Your Rights & Choices</Text>
          <Text style={styles.paragraph}>
            You have the following rights regarding your personal data:
          </Text>

          <Text style={styles.subTitle}>7.1 Access & Portability</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Request a copy of your personal data</Text>
            <Text style={styles.bulletItem}>• Export your fitness data and workout history</Text>
            <Text style={styles.bulletItem}>• Download your user-generated content</Text>
          </View>

          <Text style={styles.subTitle}>7.2 Correction & Update</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Update your profile information at any time</Text>
            <Text style={styles.bulletItem}>• Correct inaccurate personal data</Text>
            <Text style={styles.bulletItem}>• Change your email address or password</Text>
          </View>

          <Text style={styles.subTitle}>7.3 Deletion</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Delete individual posts, comments, or content</Text>
            <Text style={styles.bulletItem}>• Request complete deletion of your account and all associated data</Text>
            <Text style={styles.bulletItem}>• Deletion requests are processed within 30 days</Text>
          </View>

          <Text style={styles.subTitle}>7.4 Opt-Out Options</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Disable push notifications in app settings or device settings</Text>
            <Text style={styles.bulletItem}>• Revoke camera, microphone, or photo library permissions</Text>
            <Text style={styles.bulletItem}>• Control profile visibility settings</Text>
            <Text style={styles.bulletItem}>• Block specific users from interacting with you</Text>
          </View>

          <Text style={styles.subTitle}>7.5 How to Exercise Your Rights</Text>
          <Text style={styles.paragraph}>
            To exercise any of these rights, you can:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Use the in-app settings and profile management features</Text>
            <Text style={styles.bulletItem}>• Contact us at privacy@moodfitnessapp.com</Text>
            <Text style={styles.bulletItem}>• Submit a request through the app's Help & Support section</Text>
          </View>
          <Text style={styles.paragraph}>
            We will respond to your request within 30 days. We may need to verify your identity before processing certain requests.
          </Text>
        </View>

        {/* Children's Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Children's Privacy</Text>
          <Text style={styles.paragraph}>
            Our app is not intended for children under 13 years of age (or 16 in certain jurisdictions). 
            We do not knowingly collect personal information from children under these ages.
          </Text>
          <Text style={styles.paragraph}>
            If you are a parent or guardian and believe your child has provided us with personal information, 
            please contact us immediately at privacy@moodfitnessapp.com. We will take steps to delete such 
            information from our systems.
          </Text>
        </View>

        {/* Push Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Push Notifications</Text>
          <Text style={styles.paragraph}>
            With your consent, we may send push notifications for:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Workout reminders and fitness goal updates</Text>
            <Text style={styles.bulletItem}>• Social interactions (new likes, comments, followers)</Text>
            <Text style={styles.bulletItem}>• Direct message notifications</Text>
            <Text style={styles.bulletItem}>• Important account and security alerts</Text>
            <Text style={styles.bulletItem}>• New features and app updates (occasional)</Text>
          </View>
          <Text style={styles.paragraph}>
            You can disable notifications at any time through your device settings (Settings → Notifications → MOOD) 
            or within the app's notification preferences. Disabling notifications will not affect core app functionality.
          </Text>
        </View>

        {/* Content Moderation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Content Moderation & Community Safety</Text>
          <Text style={styles.paragraph}>
            To maintain a safe community, we may:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Review reported content for violations of our Community Guidelines</Text>
            <Text style={styles.bulletItem}>• Remove content that violates our policies</Text>
            <Text style={styles.bulletItem}>• Suspend or terminate accounts for repeated violations</Text>
            <Text style={styles.bulletItem}>• Use automated systems to detect prohibited content</Text>
            <Text style={styles.bulletItem}>• Cooperate with law enforcement for illegal content</Text>
          </View>
          <Text style={styles.paragraph}>
            We process content reports confidentially and will notify you if action is taken on your content.
          </Text>
        </View>

        {/* International Users */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. International Users</Text>
          <Text style={styles.paragraph}>
            Our services are operated from the United States. If you are accessing our app from outside 
            the United States, please be aware that your information may be transferred to, stored, and 
            processed in the United States where our servers are located.
          </Text>
          <Text style={styles.paragraph}>
            By using our services, you consent to this transfer. We take appropriate measures to ensure 
            your data is protected in accordance with this Privacy Policy regardless of where it is processed.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>For EU/EEA users:</Text> We process your data based on: (1) your consent, 
            (2) contract performance, (3) legal obligations, or (4) legitimate interests. You have additional 
            rights under GDPR including the right to lodge a complaint with your local data protection authority.
          </Text>
        </View>

        {/* California Privacy Rights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. California Privacy Rights (CCPA)</Text>
          <Text style={styles.paragraph}>
            California residents have additional rights under the California Consumer Privacy Act:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Right to Know</Text> - Request what personal information we collect and how we use it</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Right to Delete</Text> - Request deletion of your personal information</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Right to Opt-Out</Text> - We do not sell personal information, so this right does not apply</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.bold}>Right to Non-Discrimination</Text> - We will not discriminate against you for exercising your rights</Text>
          </View>
          <Text style={styles.paragraph}>
            To exercise these rights, contact us at privacy@moodfitnessapp.com or use the in-app privacy settings.
          </Text>
        </View>

        {/* Changes to Policy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Changes to This Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. When we make changes:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• We will update the "Last Updated" date at the top of this policy</Text>
            <Text style={styles.bulletItem}>• For material changes, we will notify you via in-app notification or email</Text>
            <Text style={styles.bulletItem}>• Continued use of the app after changes constitutes acceptance of the updated policy</Text>
          </View>
          <Text style={styles.paragraph}>
            We encourage you to review this Privacy Policy periodically for any changes.
          </Text>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>14. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
          </Text>
          <View style={styles.contactBox}>
            <Text style={styles.contactItem}>📧 Email: privacy@moodfitnessapp.com</Text>
            <Text style={styles.contactItem}>📱 In-App: Settings → Help & Support → Privacy Inquiry</Text>
          </View>
          <Text style={styles.paragraph}>
            We aim to respond to all privacy-related inquiries within 30 days.
          </Text>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>15. Privacy at a Glance</Text>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Quick Summary</Text>
            <Text style={styles.summaryItem}>📊 <Text style={styles.bold}>What we collect:</Text> Account info, fitness data, usage analytics, user-generated content</Text>
            <Text style={styles.summaryItem}>🎯 <Text style={styles.bold}>Why:</Text> To provide fitness services, personalize your experience, and improve the app</Text>
            <Text style={styles.summaryItem}>🔒 <Text style={styles.bold}>Security:</Text> Industry-standard encryption, secure cloud storage, regular audits</Text>
            <Text style={styles.summaryItem}>🚫 <Text style={styles.bold}>We don't:</Text> Sell data, use ads, track across apps, share with data brokers</Text>
            <Text style={styles.summaryItem}>✅ <Text style={styles.bold}>Your rights:</Text> Access, correct, delete your data; control notifications; export data</Text>
            <Text style={styles.summaryItem}>👤 <Text style={styles.bold}>Guest users:</Text> We track usage to improve the app; data is deleted after 12 months of inactivity</Text>
          </View>
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
    textAlign: 'center',
  },
  effectiveDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 28,
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
  bold: {
    fontWeight: '600',
    color: '#fff',
  },
  bulletList: {
    marginLeft: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  bulletItem: {
    fontSize: 14,
    lineHeight: 24,
    color: '#aaa',
    marginBottom: 4,
  },
  highlightBox: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  highlightItem: {
    fontSize: 14,
    lineHeight: 26,
    color: '#FFD700',
    fontWeight: '500',
  },
  contactBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  contactItem: {
    fontSize: 14,
    lineHeight: 28,
    color: '#fff',
  },
  summaryBox: {
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.15)',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 12,
  },
  summaryItem: {
    fontSize: 14,
    lineHeight: 26,
    color: '#ccc',
    marginBottom: 4,
  },
  bottomPadding: {
    height: 40,
  },
});
