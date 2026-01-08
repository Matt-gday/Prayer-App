# Prayer Companion App - Handover Document

## Project Overview

A React-based prayer tracking application designed for personal use. The app helps users maintain a consistent prayer life by organizing people/organisations into prayer cards with customizable frequencies, tracking prayer history, and providing a flashcard-style interface for daily prayer sessions.

**Primary User:** Matt, a Christian teacher aide and graphic designer who wants to systematically pray for people in his life.

---

## Tech Stack

- **Framework:** React (single component, hooks-based)
- **Styling:** Inline styles with JavaScript objects (no CSS files)
- **Storage:** localStorage for persistence
- **Font:** Google Fonts - Open Sans
- **Deployment Target:** Web/mobile responsive

---

## File Structure

Currently a single-file React component: `prayer-app.jsx`

The file is structured in this order:
1. Imports and Google Font loading
2. Utility functions (generateId, formatDate, getGreeting, etc.)
3. Demo data generator
4. localStorage helpers
5. Main component (`PrayerCompanion`)
   - State declarations
   - Theme/color definitions
   - Styles object
   - useEffect hooks
   - Business logic functions
   - Render functions
   - Main render switch

---

## Data Models

### Person
```javascript
{
  id: string,              // Unique identifier
  firstName: string,       // Can be empty for org-only entries
  lastName: string,        // Can be empty for org-only entries
  organisation: string,    // Ministry/organisation (e.g., "OMF Thailand")
  prayerPoint: string,     // Multi-line, newline-separated prayer points
  isChild: boolean,        // Affects display grouping
  individualCheckbox: boolean, // If false, grouped with others in same card
  prayerHistory: string[], // Array of ISO date strings (YYYY-MM-DD)
  dateAdded: string,       // ISO date
  firstPrayerCompleted: boolean
}
```

### Card
```javascript
{
  id: string,
  name: string,            // Display name for the card
  peopleIds: string[],     // References to Person.id
  frequency: 'daily' | 'every-2-3-days' | 'weekly' | 'monthly',
  prayerPoint: string,     // Card-level prayer points (multi-line)
  includeUnnamedChildren: boolean, // Generic "and children" checkbox
  isGroup: boolean,        // true = multiple people, false = solo card
  active: boolean,
  dateCreated: string,
  firstPrayerCompleted: boolean
}
```

### Session (prayer session state)
```javascript
{
  dateStarted: string,     // ISO date
  todaysList: string[],    // Card IDs for today
  checkedStatus: {         // Nested object tracking checkboxes
    [cardId]: {
      [personId]: boolean,
      '_group': boolean    // For grouped/unnamed children
    }
  },
  currentView: 'flashcard' | 'list',
  cardsInRotation: string[] // Cards still being cycled through
}
```

---

## Key Features

### 1. Prayer Scheduling
- **Daily:** Due every day
- **Every 2-3 days:** Due after 2+ days since last prayer
- **Weekly:** Due after 6+ days
- **Monthly:** Due in a new month

Priority cards (overdue) are shown first, shuffled randomly.

### 2. Two Prayer Views
- **Flashcard View:** Full-screen cards, swipe/arrow navigation, centered layout for singles, left-aligned for groups
- **List View:** Compact rows showing all today's prayers with inline checkboxes

### 3. People vs Groups
- **People tab:** All individuals, shows which group they belong to (if any)
- **Groups tab:** Only cards with `isGroup: true` (2+ people)
- Solo cards are managed through the People tab

### 4. Organisation Support
- Entries can be person (first/last name) OR organisation-only
- Organisation-only entries display in *italic* throughout the app
- People can have an organisation field (shows below their name)

### 5. Checkbox Behaviour
- `individualCheckbox: true` = person gets their own checkbox
- `individualCheckbox: false` = person grouped with others under `_group` checkbox
- Children typically have `individualCheckbox: false`
- In list view, grouped people show as: `☐ Emma, Liam` (single checkbox, comma-separated names)

### 6. Prayer Points
- Support multi-line input (textarea)
- Stored as newline-separated string
- Rendered as bullet list if multiple lines
- Single line renders without bullet

---

## Theme System

Two themes: `dark` and `light`

```javascript
const isDark = theme === 'dark';
const colors = isDark ? {
  bg: '#0D0D0F',
  cardBg: '#1C1C21',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#636366',
  primary: '#6B9FFF',
  accent: '#34C759',  // Green for checkmarks
  danger: '#FF453A',
  // ... etc
} : {
  // Light theme colors
};
```

Theme persists in localStorage and defaults to system preference.

---

## UI Components

### Buttons (via `baseBtn` + variants)
- `btnPrimary`: Blue gradient, full-width (Start Praying, Save)
- `btnSecondary`: Neutral background (Manage, Stats)
- `btnText`: Link-style (Back, Cancel)
- `btnDanger`: Red gradient (Delete)

### Modal System
Custom modal component (no `window.confirm` - doesn't work in artifact sandbox):
```javascript
const [modal, setModal] = useState(null);
// Modal shape: { title, message, confirmText, danger, onConfirm }
```

### Lists
- Grid-based with consistent columns
- Tap to edit
- Shows frequency, prayer count, group membership

---

## Important Business Logic

### Card Due Calculation (`isCardDueToday`)
```javascript
const isCardDueToday = (card) => {
  if (!card.active) return false;
  if (!card.firstPrayerCompleted) return true;
  const days = daysSinceLastPrayer(card);
  // Check against frequency thresholds
};
```

### Checkbox Toggle (`toggleCheckbox`)
- Records prayer history on the Person object
- Updates session checked status
- Does NOT auto-advance cards (user swipes manually)

### Group Management
- `createGroup`: Combines existing people into a group, removes their solo cards
- `dissolveGroup`: Splits group back into individual cards
- `removeFromGroup`: Removes one person from group (creates their solo card)
- If group drops to 1 person, auto-converts to solo card

---

## Known Design Decisions

1. **No emojis:** User specifically requested removal of all coloured emojis. Use monochrome symbols (○, ●, ✓, ←, →, ×, etc.)

2. **No auto-progress:** After checking all boxes on a card, it stays visible until user swipes

3. **Confirmation modals:** All destructive actions (delete, split, remove from group) show custom modal

4. **Organisation italic:** All organisation-only entries render in italic for visual distinction

5. **List view separator:** Vertical line between individual checkbox people and grouped people

6. **Prayer points left-aligned:** Multi-line prayer points always left-align with bullets, even on centered single-person cards

---

## Screens / Navigation

```
Home
├── Start Praying → Prayer (flashcard or list view)
├── Manage → Manage Screen
│   ├── People tab → Edit Person
│   └── Groups tab → Edit Card (group)
├── Stats → Stats Screen → Individual Stats (calendar)
└── Create Group → Step 1 (select) → Step 2 (configure)
```

---

## localStorage Keys

- `prayerApp_people` - Array of Person objects
- `prayerApp_cards` - Array of Card objects
- `prayerApp_session` - Current prayer session
- `prayerApp_theme` - 'dark' or 'light'

---

## Demo Data

The `generateDemoData()` function creates realistic test data:
- 16 people (mix of individuals, families, organisations)
- 9 cards (mix of solo and group)
- 8 weeks of generated prayer history

Families: Mitchells (4), Torres (3)
Groups: Tuesday Gaming (3)
Organisations: Christ Central Church, OMF Thailand, City Youth Outreach

---

## Potential Future Enhancements

These were not implemented but may be requested:
- Add people to existing groups
- Reorder people within groups
- Archive/restore cards
- Export/import data
- Cloud sync
- Notifications/reminders
- Notes per prayer session
- Swipe gestures (currently only buttons)

---

## Code Style Notes

- Single-file component (could be split later)
- Inline styles throughout (no CSS modules)
- Heavy use of ternary operators and short-circuit evaluation
- Functions defined inside component (could be extracted)
- No TypeScript (plain JavaScript)

---

## Testing the App

1. Click "Demo" button to load sample data
2. Click "Start Praying" to enter prayer mode
3. Test flashcard view (arrows to navigate)
4. Test list view (click "List" button)
5. Check off names, verify history updates
6. Go to Stats to see calendar
7. Test group management (edit group, remove person, split)
8. Toggle theme (circle button top-left)
9. Add new person via Manage → People → + Add

---

## Contact/Context

This app was built conversationally with the user Matt over an extended session. Key user preferences:
- iOS-quality design aesthetic
- Open Sans font
- No emojis (strong preference)
- Clean, minimal UI
- Practical UX over flashy features
