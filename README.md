# TrendSpot (React + Firebase + Cloudinary)
1. `npm install`, copy `.env.example` to `.env`, fill in the values.
2. **Firebase**: create a project, add a Web app (copy config into `.env`), enable **Firestore** and **Authentication > Email/Password**.
3. Paste `firestore.rules` into Firestore > Rules and publish.
4. Authentication > Users > add your admin email/password. Copy its UID.
5. Firestore > create collection `admins`, document ID = that UID (any field).
6. **Cloudinary**: Settings > Upload > Add upload preset, signing mode **Unsigned**. Put the preset and your cloud name in `.env`.
7. `npm run dev`, open `/admin`, sign in, and click **Load sample stories** (or publish your own).
8. Deploy: `npm run build && firebase deploy` (hosting rewrites are in `firebase.json`).
Collections: `articles`, `subscribers`, `tips` (readable only by admins in the Firebase console), `admins`.
Firestore may ask you to create a composite index the first time; follow the link in the console error.
