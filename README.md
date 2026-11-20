#  Coy-Discover

**Discover meaningful connections, one swipe at a time.**

Coy-Discover is a modern profile discovery and matching web application that allows users to explore profiles, connect through mutual interests, find matches, and start conversations.

##  Features

- **Profile Discovery:** Browse user profiles through interactive cards.
- **Swipe Interaction:** Like or pass on profiles.
- **Matching System:** Discover mutual connections.
- **Chat Interface:** Start conversations with matched profiles.
- **User Authentication:** Register and log in.
- **Dynamic Feed:** Fetch profiles through backend API endpoints.
- **Responsive UI:** Modern interface for different screen sizes.

##  Tech Stack

| Category | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | CSS, Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| Backend | Next.js API Routes |
| Database | SQLite |
| ORM | Prisma |
| Package Manager | npm |

##  Project Structure

```text
coy-discover/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── feed/
│   │   │   ├── matches/
│   │   │   └── swipe/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Chat.tsx
│   │   ├── Discover.tsx
│   │   ├── MatchModal.tsx
│   │   ├── Matches.tsx
│   │   ├── Navbar.tsx
│   │   └── ProfileCard.tsx
│   └── lib/
│       ├── demo-user.ts
│       └── prisma.ts
├── .env.example
├── package.json
├── prisma7.config.ts
└── README.md
```

##  Getting Started

Follow these steps to run Coy-Discover locally.

### Prerequisites

Install the following before starting:

- Node.js (LTS version recommended)
- npm
- Git
- VS Code (recommended)

### 1. Clone the repository

Open your terminal and run:

```bash
git clone https://github.com/kakkaryogitaa/Coy-Discover.git
```

### 2. Navigate to the project directory

```bash
cd Coy-Discover
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root.

Copy the example configuration:

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

Open `.env` and configure the database URL and any other required environment variables.

For a SQLite setup, the database URL may look like:

```env
DATABASE_URL="file:./dev.db"
```

Use the exact configuration expected by your Prisma schema and Prisma config.

**Important:** Never upload your `.env` file or database credentials to GitHub.

### 5. Set up the database

Run Prisma migrations:

```bash
npx prisma migrate dev
```

### 6. Generate Prisma Client

```bash
npx prisma generate
```

### 7. Seed the database (if required)

```bash
npx prisma db seed
```

### 8. Start the development server

```bash
npm run dev
```

### 9. Open the application

Visit:

http://localhost:3000

Coy-Discover should now be running locally!

##  Useful Commands

| Command | Purpose |
|---|---|
| `npm install` | Install project dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build the application |
| `npm start` | Start production server |
| `npx prisma migrate dev` | Run database migrations |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma studio` | Open Prisma Studio |
| `npx prisma db seed` | Seed the database |

##  API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/feed` | Fetch discoverable profiles |
| GET | `/api/matches` | Retrieve matched profiles |
| POST | `/api/swipe` | Process profile swipe actions |

##  Database

Coy-Discover uses Prisma ORM for database operations.

The Prisma schema and migration files are maintained in the `prisma/` directory.

The database manages profile information and matching-related application data.

##  Future Enhancements

- Real-time messaging
- Advanced profile preferences and filters
- Profile photo uploads
- Location-based discovery
- Enhanced privacy and account settings
- Match notifications
- Production deployment

##  Author

**Yogita Kakkar**

- GitHub: [@kakkaryogitaa](https://github.com/kakkaryogitaa)
- Repository: [Coy-Discover](https://github.com/kakkaryogitaa/Coy-Discover)

---

⭐ If you like this project, consider giving it a star!
