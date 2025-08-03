Fitness Tracker Privacy Policy
Last Updated: August 3, 2025
Fitness Tracker is committed to protecting the privacy and security of our users’ personal information. This Privacy Policy outlines how we collect, store, use, and protect your data in the Fitness Tracker application, a web-based platform for tracking workouts, managing fitness goals, and engaging in social interactions. By using Fitness Tracker, you consent to the practices described below.
1. Information We Collect
1.1. User-Provided Information
We collect the following data when you interact with the Fitness Tracker app:

Account Information: Username, email address, and hashed password provided during registration (/api/users/register).
Profile Information: Optional details such as name, age, and fitness goals, submitted via the User Profile component (/api/users/profile).
Workout Data: Workout details including title, description, exercises, duration, calories burned, and date, submitted via the Workout Planner (/api/workouts/create).
Exercise Data: Exercise information (name, muscle group, equipment, difficulty, media URLs) created or updated via the Exercise Library (/api/exercises/*).
Social Interactions: Posts, comments, likes, and challenge participation data submitted via the Social Feed (/api/social/*).

1.2. Automatically Collected Information

Usage Data: We may collect anonymized data on app usage, such as page views and interactions, to improve functionality.
Device Information: Basic device information (e.g., browser type, IP address) for security and analytics purposes.

2. How We Use Your Data

Account Management: Username, email, and password are used to authenticate users and secure access to the app.
Personalized Experience: Profile data (name, age, fitness goals) and workout data are used to display personalized dashboards, workout plans, and statistics.
Social Features: Social interaction data (posts, comments, likes, challenges) enables community engagement and leaderboards.
Analytics and Improvement: Anonymized usage data helps us optimize app performance and user experience.

3. Data Storage and Security

Storage: 
All user data is stored in a MongoDB database, hosted locally or via a cloud provider (e.g., MongoDB Atlas) as configured in backend/index.js.
Passwords are hashed using bcrypt before storage (backend/models/User.js).
Static assets (e.g., exercise images/videos) may be stored in AWS S3 (deploy/aws_config.yml).


Security Measures:
JWT authentication protects API endpoints (backend/middleware/auth.js).
Data is transmitted over HTTPS to ensure encryption.
Regular security audits and updates are performed to protect against vulnerabilities.


Retention: Data is retained as long as your account is active or as needed to comply with legal obligations. You may request data deletion by contacting the administrator.

4. User Consent
By using Fitness Tracker, you consent to:

The collection and processing of your personal data as described above.
The storage of your data in MongoDB and AWS S3 (if deployed to AWS).
The use of your data for personalized features and analytics.

You may withdraw consent by deleting your account, which will remove your personal data from our database. Contact the administrator for assistance.
5. Data Sharing and Third Parties

No Third-Party Sharing: We do not share your personal data with third parties, except as required by law or to provide services (e.g., MongoDB Atlas, AWS).
Third-Party Services:
MongoDB Atlas: For cloud database hosting.
AWS S3: For storing static assets (images/videos).
These services comply with data protection standards (e.g., GDPR, CCPA).


Social Features: Your posts, comments, and challenge participation are visible to other users within the app’s Social Feed.

6. User Rights
You have the right to:

Access: View your data via the User Profile component (/profile).
Update: Modify your profile and workout data via the app’s UI.
Delete: Request account deletion by contacting the administrator.
Opt-Out: Disable social features by not engaging with the Social Feed.

To exercise these rights, contact the administrator at GitHub Issues.
7. Data Protection
We implement the following measures to protect your data:

Encryption: Passwords are hashed with bcrypt, and API requests use JWT for secure authentication.
Access Control: Only authenticated users can access their own data via protected routes (backend/routes/*).
Backups: Regular database backups are maintained to prevent data loss.
Audits: Code is tested with Mocha/Chai and Jest (tests/) to ensure security and reliability.

8. Contact Information
For questions, concerns, or requests regarding your data, contact:

Maintainer: Joseph Jilovec
GitHub: github.com/josephjilovec
Issues: Fitness Tracker Issues

9. Changes to This Policy
We may update this Privacy Policy to reflect changes in our practices or legal requirements. Updates will be posted in this document (docs/privacy_policy.md), and significant changes will be communicated via the app or GitHub repository.
By continuing to use Fitness Tracker, you agree to the updated terms of this Privacy Policy.
