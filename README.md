# 🏆 Blue Champ - Educational Quiz Gaming Platform

An interactive, multiplayer quiz gaming platform that transforms classroom learning into an exciting competitive experience. Combines the engagement of games like Kahoot with dynamic gaming aesthetics from Street Fighter, World Cup, and game shows.

![Blue Champ](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

## ✨ Features

### 🎮 Two Game Modes

**Quick Match**
- Fast-paced quiz battle with 2-6 players
- Single game session
- 5-10 questions per match
- Instant results and leaderboard
- Perfect for daily practice

**Tournament Mode**
- Championship bracket competition
- Elimination rounds (Quarter-finals → Semi-finals → Finals)
- Support for 4, 8, or 16 participants
- Team or individual play
- Trophy presentation for champion

### 🎨 Four Exciting Themes

1. **⚔️ Battle Arena** - Street Fighter style with health bars and combat animations
2. **⚽ World Cup Stadium** - Soccer championship with stadium atmosphere
3. **💰 Millionaire Showdown** - Game show style with dramatic lighting
4. **🏎️ Quiz Race** - High-speed racing theme with finish lines

### 📚 Educational Content

- **Subjects**: Math, Science, History, Geography, English
- **Grade Levels**: 1-12
- **30+ Sample Questions** across multiple subjects
- Adaptive difficulty based on grade level
- Easy to add custom questions

### 🎯 Core Functionality

- **Real-time scoring** with streak bonuses and time multipliers
- **Animated transitions** for every interaction
- **Response tracking** - logs every answer with timestamps
- **Leaderboard displays** with live updates
- **Victory screens** with confetti and celebration animations
- **Data export** - CSV, JSON, and printable reports
- **Tournament brackets** with visual progression
- **Student roster management** with avatars

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd blue-champ
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📖 How to Use

### For Teachers - Quick Match

1. **Select Game Mode** - Choose "Quick Match"
2. **Pick a Theme** - Select from 4 exciting themes
3. **Configure Settings** - Choose subject and grade level
4. **Select Players** - Pick 2-6 students from the roster
5. **Start Game** - Let students compete!
6. **Teacher Controls** - Click student buttons to record answers
7. **View Results** - See winner and export data

### For Teachers - Tournament Mode

1. **Select Game Mode** - Choose "Tournament"
2. **Pick a Theme** - Select a tournament-optimized theme
3. **Configure Settings** - Choose subject and grade level
4. **Tournament Setup**:
   - Choose mode: Teams or Individual
   - Select participant count: 4, 8, or 16
   - Create teams (2+ students per team) or select individuals
   - Name your teams
5. **Start Tournament** - Bracket is automatically generated
6. **Play Matches** - Complete each round
7. **Crown the Champion** - Trophy ceremony for the winner!
8. **Export Results** - Download complete tournament results

### Student Interaction

- **No devices needed** - Students shout their answers
- Teacher clicks the corresponding student/team button
- Immediate visual feedback on screen
- Scores update in real-time
- Celebratory animations for correct answers

## 📁 Project Structure

```
blue-champ/
├── app/
│   ├── globals.css          # Global styles and animations
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main app component
├── components/
│   ├── GameModeSelection.tsx    # Mode selection screen
│   ├── ThemeSelection.tsx       # Theme picker
│   ├── PlayerSetup.tsx          # Quick match player selection
│   ├── TeamSetup.tsx            # Tournament team creation
│   ├── GamePlay.tsx             # Core game logic
│   ├── VictoryScreen.tsx        # Results and celebration
│   └── themes/
│       ├── QuickMatchGame.tsx   # Quick match UI
│       └── TournamentGame.tsx   # Tournament UI with bracket
├── data/
│   ├── students.json        # Student roster (16 students)
│   └── questions.json       # Question database (30+ questions)
├── lib/
│   ├── gameUtils.ts         # Game logic utilities
│   └── storage.ts           # LocalStorage and export functions
├── types/
│   └── index.ts             # TypeScript definitions
└── public/
    └── avatars/             # Student avatar images
```

## 🎓 Adding Custom Questions

Edit `data/questions.json` to add your own questions:

```json
{
  "math": [
    {
      "id": "m1",
      "text": "What is 2 + 2?",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": 1,
      "subject": "Math",
      "gradeLevel": 1,
      "points": 100,
      "timeLimit": 15
    }
  ]
}
```

## 👥 Managing Students

Edit `data/students.json` to update the student roster:

```json
[
  {
    "id": "s1",
    "name": "Student Name",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=StudentName"
  }
]
```

**Avatar Options:**
- Use [DiceBear](https://dicebear.com/) for free avatar generation
- Upload custom images to `public/avatars/`
- Use URLs from any image source

## 📊 Data Export Options

### CSV Export
- Player/team names
- Final scores
- Accuracy percentages
- Correct answer counts

### JSON Export
- Complete game data
- Every question and response
- Timestamps and time-to-answer
- Full tournament bracket history

### Printable Report
- Formatted HTML report
- Ready to print or save as PDF
- Complete standings
- Game summary

## 🎯 Scoring System

### Base Points
- Correct answer: 100 points
- Incorrect answer: 0 points

### Bonuses
- **Streak Multiplier**: Up to 3x for consecutive correct answers
- **Speed Bonus**: Up to 50 points for quick answers (when timer enabled)

### Example Calculation
- Base: 100 points
- Streak of 3: 100 × 1.3 = 130 points
- Speed bonus: +30 points
- **Total: 160 points**

## 🎨 Customization

### Themes
Each theme has unique:
- Background gradients
- Color schemes
- Animations
- Visual effects
- Sound effects (coming soon)

### Settings
- Timer: Enable/disable per game
- Question count: 5-20 questions
- Grade levels: Auto-filters appropriate questions
- Subjects: Easily extensible

## 🔧 Technical Details

### Built With
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **LocalStorage** - Data persistence

### Performance Optimizations
- Lazy loading for images
- Optimized animations
- Efficient state management
- Minimal re-renders

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Display Requirements

**Optimal Setup:**
- Large display (55"+ smart screen or projector)
- Resolution: 1920x1080 or higher
- Touch capability recommended but not required

**Minimum Setup:**
- Any screen with browser support
- Laptop/desktop for teacher controls
- Mouse or touchpad for input

## 🤝 Contributing

We welcome contributions! Areas for enhancement:

- [ ] Additional themes (Space, Medieval, Superhero, etc.)
- [ ] Sound effects and music
- [ ] More question subjects (Languages, Art, Music)
- [ ] Multiplayer networking (real student devices)
- [ ] AI question generation
- [ ] Analytics dashboard
- [ ] Custom avatars upload
- [ ] Accessibility improvements

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Avatar generation by [DiceBear](https://dicebear.com/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- Icons and emojis from system fonts

## 📞 Support

For issues, questions, or feature requests:
- Create an issue in the repository
- Check the documentation
- Review existing questions and answers

## 🎉 Fun Facts

- **30+** pre-loaded questions across 3 subjects
- **16** pre-configured students with avatars
- **4** unique game themes
- **2** game modes (Quick Match & Tournament)
- **100%** teacher-controlled (no student devices needed)
- **Infinite** replay value

---

**Made with ❤️ for educators and students worldwide**

Transform your classroom into an exciting quiz arena! 🚀
