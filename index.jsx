import React, { useState, useEffect, useCallback } from 'react';

// Load Google Font
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

const generateId = () => Math.random().toString(36).substr(2, 9);
const formatDate = (date) => new Date(date).toISOString().split('T')[0];
const getToday = () => formatDate(new Date());

const getGreeting = (name = 'Friend') => {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${name}`;
  if (hour < 17) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
};

const generatePrayerHistory = (frequency, weeksBack = 8) => {
  const history = [];
  const today = new Date();
  for (let i = 0; i < weeksBack * 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    let shouldAdd = false;
    if (frequency === 'daily') shouldAdd = Math.random() > 0.15;
    else if (frequency === 'every-2-3-days') shouldAdd = i % 2 === 0 && Math.random() > 0.2;
    else if (frequency === 'weekly') shouldAdd = i % 7 === 0 && Math.random() > 0.1;
    else if (frequency === 'monthly') shouldAdd = i % 28 === 0;
    if (shouldAdd) history.push(formatDate(date));
  }
  return history;
};

const generateDemoData = () => {
  const today = new Date();
  const demoPeople = [
    // Mitchells family - group, every 2-3 days
    { id: 'p1', firstName: 'Sarah', lastName: 'Mitchell', organisation: '', prayerPoint: 'Healing from surgery\nPeace during recovery', isChild: false, individualCheckbox: true },
    { id: 'p2', firstName: 'James', lastName: 'Mitchell', organisation: '', prayerPoint: 'Job interview this week\nWisdom in career decisions', isChild: false, individualCheckbox: true },
    { id: 'p3', firstName: 'Emma', lastName: 'Mitchell', organisation: '', prayerPoint: '', isChild: true, individualCheckbox: false },
    { id: 'p4', firstName: 'Liam', lastName: 'Mitchell', organisation: '', prayerPoint: '', isChild: true, individualCheckbox: false },
    // Individual - daily
    { id: 'p5', firstName: 'Victoria', lastName: 'Greene', organisation: '', prayerPoint: 'Confidence at school', isChild: false, individualCheckbox: true },
    // Individual - weekly
    { id: 'p6', firstName: 'David', lastName: 'Chen', organisation: 'Christ Central Church', prayerPoint: 'Wisdom for church direction', isChild: false, individualCheckbox: true },
    // Gaming friends - group, every 2-3 days
    { id: 'p7', firstName: 'Scott', lastName: 'Reynolds', organisation: '', prayerPoint: '', isChild: false, individualCheckbox: true },
    { id: 'p8', firstName: 'Craig', lastName: 'Thompson', organisation: '', prayerPoint: 'Marriage restoration', isChild: false, individualCheckbox: true },
    { id: 'p9', firstName: 'Ben', lastName: 'Parker', organisation: '', prayerPoint: '', isChild: false, individualCheckbox: true },
    // Individual - daily
    { id: 'p10', firstName: 'Estelle', lastName: 'Warren', organisation: '', prayerPoint: 'Peace and direction', isChild: false, individualCheckbox: true },
    // Individual - daily
    { id: 'p11', firstName: 'Jessica', lastName: 'Martin', organisation: '', prayerPoint: 'Music ministry growth', isChild: false, individualCheckbox: true },
    // Torres family - group, weekly
    { id: 'p12', firstName: 'Michael', lastName: 'Torres', organisation: '', prayerPoint: 'Financial breakthrough', isChild: false, individualCheckbox: true },
    { id: 'p13', firstName: 'Rachel', lastName: 'Torres', organisation: '', prayerPoint: '', isChild: false, individualCheckbox: true },
    { id: 'p14', firstName: 'Sophie', lastName: 'Torres', organisation: '', prayerPoint: '', isChild: true, individualCheckbox: false },
    // Missionary - monthly
    { id: 'p15', firstName: 'Mark', lastName: 'Stevens', organisation: 'OMF Thailand', prayerPoint: 'Protection and provision', isChild: false, individualCheckbox: true },
    // Ministry only (no person name) - weekly
    { id: 'p16', firstName: '', lastName: '', organisation: 'City Youth Outreach', prayerPoint: 'Volunteer recruitment', isChild: false, individualCheckbox: true },
  ];

  // Generate history that ensures cards are due today
  const generateHistoryForFrequency = (frequency) => {
    const history = [];
    const today = new Date();
    
    // Start from a few days ago based on frequency to ensure due today
    let startDay;
    if (frequency === 'daily') startDay = 1; // Last prayed yesterday
    else if (frequency === 'every-2-3-days') startDay = 3; // Last prayed 3 days ago
    else if (frequency === 'weekly') startDay = 7; // Last prayed a week ago
    else startDay = 30; // Monthly - last prayed a month ago
    
    for (let i = startDay; i < 8 * 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      let shouldAdd = false;
      if (frequency === 'daily') shouldAdd = Math.random() > 0.15;
      else if (frequency === 'every-2-3-days') shouldAdd = i % 2 === 0 && Math.random() > 0.2;
      else if (frequency === 'weekly') shouldAdd = i % 7 === 0 && Math.random() > 0.1;
      else if (frequency === 'monthly') shouldAdd = i % 28 === 0;
      
      if (shouldAdd) history.push(formatDate(date));
    }
    return history;
  };

  const frequencies = { 
    p1: 'every-2-3-days', p2: 'every-2-3-days', p3: 'every-2-3-days', p4: 'every-2-3-days', 
    p5: 'daily', p6: 'weekly', 
    p7: 'every-2-3-days', p8: 'every-2-3-days', p9: 'every-2-3-days', 
    p10: 'daily', p11: 'daily', 
    p12: 'weekly', p13: 'weekly', p14: 'weekly', 
    p15: 'monthly',
    p16: 'weekly'
  };

  const peopleWithHistory = demoPeople.map(p => ({
    ...p,
    prayerHistory: generateHistoryForFrequency(frequencies[p.id]),
    dateAdded: '2024-10-01',
    firstPrayerCompleted: true
  }));

  const demoCards = [
    { id: 'c1', name: 'Mitchells', peopleIds: ['p1', 'p2', 'p3', 'p4'], frequency: 'every-2-3-days', prayerPoint: 'Family unity and health', includeUnnamedChildren: false, isGroup: true, active: true, dateCreated: '2024-10-01', firstPrayerCompleted: true },
    { id: 'c2', name: 'Victoria Greene', peopleIds: ['p5'], frequency: 'daily', prayerPoint: '', includeUnnamedChildren: false, isGroup: false, active: true, dateCreated: '2024-10-01', firstPrayerCompleted: true },
    { id: 'c3', name: 'David Chen', peopleIds: ['p6'], frequency: 'weekly', prayerPoint: '', includeUnnamedChildren: false, isGroup: false, active: true, dateCreated: '2024-10-01', firstPrayerCompleted: true },
    { id: 'c4', name: 'Tuesday Gaming', peopleIds: ['p7', 'p8', 'p9'], frequency: 'every-2-3-days', prayerPoint: '', includeUnnamedChildren: false, isGroup: true, active: true, dateCreated: '2024-10-01', firstPrayerCompleted: true },
    { id: 'c5', name: 'Estelle Warren', peopleIds: ['p10'], frequency: 'daily', prayerPoint: '', includeUnnamedChildren: false, isGroup: false, active: true, dateCreated: '2024-10-01', firstPrayerCompleted: true },
    { id: 'c6', name: 'Jessica Martin', peopleIds: ['p11'], frequency: 'daily', prayerPoint: '', includeUnnamedChildren: false, isGroup: false, active: true, dateCreated: '2024-10-01', firstPrayerCompleted: true },
    { id: 'c7', name: 'Torres Family', peopleIds: ['p12', 'p13', 'p14'], frequency: 'weekly', prayerPoint: '', includeUnnamedChildren: true, isGroup: true, active: true, dateCreated: '2024-10-01', firstPrayerCompleted: true },
    { id: 'c8', name: 'Mark Stevens', peopleIds: ['p15'], frequency: 'monthly', prayerPoint: '', includeUnnamedChildren: false, isGroup: false, active: true, dateCreated: '2024-10-01', firstPrayerCompleted: true },
    { id: 'c9', name: 'City Youth Outreach', peopleIds: ['p16'], frequency: 'weekly', prayerPoint: '', includeUnnamedChildren: false, isGroup: false, active: true, dateCreated: '2024-10-01', firstPrayerCompleted: true },
  ];

  return { people: peopleWithHistory, cards: demoCards };
};

const getStored = (key, fallback) => { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; } };
const getInitialTheme = () => { const s = localStorage.getItem('prayerApp_theme'); if (s) return s; return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; };

export default function PrayerCompanion() {
  const [people, setPeople] = useState(() => getStored('prayerApp_people', []));
  const [cards, setCards] = useState(() => getStored('prayerApp_cards', []));
  const [session, setSession] = useState(() => getStored('prayerApp_session', null));
  const [theme, setTheme] = useState(getInitialTheme);
  const [screen, setScreen] = useState('home');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedPeopleForGroup, setSelectedPeopleForGroup] = useState([]);
  const [editingPerson, setEditingPerson] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [viewingStats, setViewingStats] = useState(null);
  const [statsMonth, setStatsMonth] = useState(new Date());
  const [sortBy, setSortBy] = useState('firstName');
  const [cardSortBy, setCardSortBy] = useState('name');
  const [manageTab, setManageTab] = useState('people');
  const [personForm, setPersonForm] = useState({ firstName: '', lastName: '', organisation: '', prayerPoint: '', frequency: 'daily', isChild: false, individualCheckbox: true });
  const [cardForm, setCardForm] = useState({ name: '', frequency: 'daily', prayerPoint: '', includeUnnamedChildren: false });
  const [groupForm, setGroupForm] = useState({ name: '', frequency: 'weekly', prayerPoint: '', includeUnnamedChildren: false });
  const [groupStep, setGroupStep] = useState(1);
  const [checkboxOverrides, setCheckboxOverrides] = useState({});
  const [modal, setModal] = useState(null); // { type, title, message, onConfirm }

  const isDark = theme === 'dark';
  const colors = isDark ? {
    bg: '#0D0D0F', bgGradient: 'linear-gradient(180deg, #0D0D0F 0%, #1A1A1F 100%)', cardBg: '#1C1C21', text: '#FFFFFF', textSecondary: '#8E8E93', textTertiary: '#636366',
    primary: '#6B9FFF', primaryGradient: 'linear-gradient(135deg, #6B9FFF 0%, #5B7FE5 100%)', primaryText: '#FFFFFF',
    secondary: '#2C2C31', secondaryText: '#E5E5EA', accent: '#34C759', accentGradient: 'linear-gradient(135deg, #34C759 0%, #30B350 100%)',
    danger: '#FF453A', dangerGradient: 'linear-gradient(135deg, #FF453A 0%, #E5392F 100%)', border: '#38383A', checkboxBg: '#3A3A3C', checkboxChecked: '#6B9FFF',
    cardShadow: '0 2px 12px rgba(0,0,0,0.3)', inputBg: '#2C2C2E'
  } : {
    bg: '#F2F2F7', bgGradient: 'linear-gradient(180deg, #F2F2F7 0%, #E5E5EA 100%)', cardBg: '#FFFFFF', text: '#1C1C1E', textSecondary: '#6B6B70', textTertiary: '#8E8E93',
    primary: '#007AFF', primaryGradient: 'linear-gradient(135deg, #007AFF 0%, #0063D1 100%)', primaryText: '#FFFFFF',
    secondary: '#E5E5EA', secondaryText: '#3C3C43', accent: '#34C759', accentGradient: 'linear-gradient(135deg, #34C759 0%, #30B350 100%)',
    danger: '#FF3B30', dangerGradient: 'linear-gradient(135deg, #FF3B30 0%, #E52E24 100%)', border: '#D1D1D6', checkboxBg: '#E5E5EA', checkboxChecked: '#007AFF',
    cardShadow: '0 2px 12px rgba(0,0,0,0.06)', inputBg: '#FFFFFF'
  };

  const baseBtn = { border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit' };
  const styles = {
    container: { fontFamily: "'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif", background: colors.bgGradient, color: colors.text, minHeight: '100vh', padding: '16px', paddingTop: '12px', boxSizing: 'border-box' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', minHeight: '44px' },
    btnPrimary: { ...baseBtn, width: '100%', padding: '18px 24px', fontSize: '17px', background: colors.primaryGradient, color: colors.primaryText, boxShadow: isDark ? '0 4px 16px rgba(107,159,255,0.3)' : '0 4px 16px rgba(0,122,255,0.3)' },
    btnSecondary: { ...baseBtn, padding: '14px 20px', fontSize: '15px', backgroundColor: colors.secondary, color: colors.secondaryText, flex: 1 },
    btnText: { background: 'none', border: 'none', color: colors.primary, fontSize: '17px', fontWeight: '500', cursor: 'pointer', padding: '8px 0', fontFamily: 'inherit' },
    btnDanger: { ...baseBtn, width: '100%', padding: '16px 20px', fontSize: '16px', background: colors.dangerGradient, color: '#FFF', marginTop: '16px' },
    btnSmall: { ...baseBtn, padding: '8px 14px', fontSize: '13px', backgroundColor: colors.secondary, color: colors.textSecondary, borderRadius: '10px' },
    buttonRow: { display: 'flex', gap: '12px', marginBottom: '12px' },
    card: { backgroundColor: colors.cardBg, borderRadius: '20px', padding: '20px', marginBottom: '12px', boxShadow: colors.cardShadow },
    cardFullScreen: { minHeight: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column', marginBottom: '0' },
    listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: colors.cardBg, borderRadius: '14px', marginBottom: '8px', cursor: 'pointer', boxShadow: colors.cardShadow },
    listItemName: { fontSize: '16px', fontWeight: '500' },
    listItemMeta: { fontSize: '15px', color: colors.textSecondary, fontWeight: '500' },
    input: { width: '100%', padding: '16px 18px', fontSize: '17px', backgroundColor: colors.inputBg, border: `1px solid ${colors.border}`, borderRadius: '14px', color: colors.text, marginBottom: '16px', boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: colors.textSecondary, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' },
    select: { width: '100%', padding: '16px 18px', fontSize: '17px', backgroundColor: colors.inputBg, border: `1px solid ${colors.border}`, borderRadius: '14px', color: colors.text, marginBottom: '16px', boxSizing: 'border-box', fontFamily: 'inherit', appearance: 'none' },
    toggle: { display: 'flex', gap: '8px', marginBottom: '16px', backgroundColor: colors.secondary, borderRadius: '12px', padding: '4px' },
    toggleOption: { flex: 1, padding: '12px', textAlign: 'center', borderRadius: '10px', cursor: 'pointer', fontSize: '15px', fontWeight: '500', transition: 'all 0.2s ease' },
    toggleActive: { background: colors.primaryGradient, color: colors.primaryText, boxShadow: isDark ? '0 2px 8px rgba(107,159,255,0.3)' : '0 2px 8px rgba(0,122,255,0.2)' },
    toggleInactive: { backgroundColor: 'transparent', color: colors.textSecondary },
    tabs: { display: 'flex', marginBottom: '16px', backgroundColor: colors.secondary, borderRadius: '12px', padding: '4px' },
    tab: { flex: 1, padding: '12px', textAlign: 'center', borderRadius: '10px', cursor: 'pointer', fontSize: '15px', fontWeight: '500', border: 'none', fontFamily: 'inherit' },
    cardHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
    cardTitle: { fontSize: '15px', fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' },
    cardFrequency: { fontSize: '13px', color: colors.textTertiary, backgroundColor: colors.secondary, padding: '4px 10px', borderRadius: '8px', fontWeight: '500' },
    cardPrayerPoint: { fontSize: '15px', color: colors.textSecondary, marginBottom: '16px', fontStyle: 'italic', lineHeight: '1.5', textAlign: 'center' },
    nameRowContainer: { display: 'flex', flexDirection: 'column', marginBottom: '4px' },
    nameRow: { display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '8px 0' },
    nameCheckbox: { borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#FFF', flexShrink: 0, transition: 'all 0.2s ease' },
    namePrayerPoint: { fontSize: '14px', color: colors.textSecondary, fontStyle: 'italic', marginTop: '2px', lineHeight: '1.4' },
    singlePersonContent: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px 0' },
    singleNameRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '12px' },
    singlePrayerPoint: { fontSize: '16px', color: colors.textSecondary, textAlign: 'center', marginTop: '20px', fontStyle: 'italic', maxWidth: '85%', lineHeight: '1.5' },
    groupNamesContainer: { display: 'flex', flexDirection: 'column', padding: '12px 0' },
    adultsSection: { display: 'flex', flexDirection: 'column', gap: '4px' },
    childrenDivider: { height: '1px', backgroundColor: colors.border, margin: '16px 0' },
    childrenNamesSection: { display: 'flex', flexDirection: 'column', gap: '4px' },
    swipeButtons: { display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px' },
    swipeButton: { width: '56px', height: '56px', borderRadius: '28px', backgroundColor: colors.cardBg, border: 'none', fontSize: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.text, boxShadow: colors.cardShadow },
    swipeHint: { textAlign: 'center', color: colors.textTertiary, fontSize: '14px', marginTop: '12px', fontWeight: '500' },
    calendar: { backgroundColor: colors.cardBg, borderRadius: '20px', padding: '20px', boxShadow: colors.cardShadow },
    calendarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    calendarGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' },
    calendarDay: { padding: '10px 4px', fontSize: '15px', borderRadius: '10px', fontWeight: '500' },
    calendarDayHeader: { fontSize: '12px', color: colors.textTertiary, fontWeight: '600', padding: '8px 4px', textTransform: 'uppercase' },
    prayedDay: { background: colors.accentGradient, color: '#FFF', fontWeight: '600' },
    navButton: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '8px 12px', color: colors.primary, fontWeight: '600' },
    greeting: { fontSize: '28px', fontWeight: '700', textAlign: 'center', marginTop: '32px', marginBottom: '8px', letterSpacing: '-0.5px' },
    subGreeting: { fontSize: '16px', color: colors.textSecondary, textAlign: 'center', marginBottom: '32px' },
    emptyState: { textAlign: 'center', color: colors.textSecondary, padding: '60px 20px', fontSize: '16px', lineHeight: '1.6' },
    sortSelect: { padding: '10px 14px', fontSize: '14px', backgroundColor: colors.secondary, border: 'none', borderRadius: '10px', color: colors.text, marginBottom: '16px', fontWeight: '500', fontFamily: 'inherit' },
    themeToggle: { position: 'absolute', top: '12px', left: '16px', width: '40px', height: '40px', borderRadius: '20px', backgroundColor: colors.secondary, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' },
    demoButton: { position: 'absolute', top: '12px', right: '16px', padding: '8px 14px', fontSize: '13px', fontWeight: '600', backgroundColor: colors.secondary, color: colors.textSecondary, border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', boxSizing: 'border-box' },
    modalContent: { backgroundColor: colors.cardBg, borderRadius: '20px', padding: '24px', maxWidth: '340px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },
    modalTitle: { fontSize: '18px', fontWeight: '700', marginBottom: '12px', textAlign: 'center', color: colors.text },
    modalMessage: { fontSize: '15px', color: colors.textSecondary, lineHeight: '1.5', marginBottom: '24px', textAlign: 'center' },
    modalButtons: { display: 'flex', gap: '12px' }
  };

  useEffect(() => { localStorage.setItem('prayerApp_people', JSON.stringify(people)); }, [people]);
  useEffect(() => { localStorage.setItem('prayerApp_cards', JSON.stringify(cards)); }, [cards]);
  useEffect(() => { if (session) localStorage.setItem('prayerApp_session', JSON.stringify(session)); }, [session]);
  useEffect(() => { localStorage.setItem('prayerApp_theme', theme); }, [theme]);

  const loadDemoData = () => {
    const { people: dp, cards: dc } = generateDemoData();
    setPeople(dp); setCards(dc); setSession(null);
    localStorage.removeItem('prayerApp_session');
  };

  const isNewDay = useCallback(() => !session || session.dateStarted !== getToday(), [session]);
  const getLastPrayedDate = useCallback((card) => {
    const cp = card.peopleIds.map(id => people.find(p => p.id === id)).filter(Boolean);
    if (!cp.length) return null;
    const dates = cp.flatMap(p => p.prayerHistory || []);
    return dates.length ? dates.sort().reverse()[0] : null;
  }, [people]);
  const daysSinceLastPrayer = useCallback((card) => {
    const last = getLastPrayedDate(card);
    if (!last) return Infinity;
    return Math.floor((new Date(getToday()) - new Date(last)) / (1000 * 60 * 60 * 24));
  }, [getLastPrayedDate]);
  const isCardDueToday = useCallback((card) => {
    if (!card.active) return false;
    if (!card.firstPrayerCompleted) return true;
    const days = daysSinceLastPrayer(card);
    if (card.frequency === 'daily') return true;
    if (card.frequency === 'every-2-3-days') return days >= 2;
    if (card.frequency === 'weekly') return days >= 6;
    if (card.frequency === 'monthly') {
      const last = getLastPrayedDate(card);
      if (!last) return true;
      return new Date(last).getMonth() !== new Date().getMonth();
    }
    return true;
  }, [daysSinceLastPrayer, getLastPrayedDate]);
  const isPriorityCard = useCallback((card) => {
    if (!card.firstPrayerCompleted) return true;
    const days = daysSinceLastPrayer(card);
    if (card.frequency === 'daily') return days >= 1;
    if (card.frequency === 'every-2-3-days') return days >= 4;
    if (card.frequency === 'weekly') return days >= 8;
    return false;
  }, [daysSinceLastPrayer]);
  const buildTodaysList = useCallback(() => {
    const due = cards.filter(c => c.active && isCardDueToday(c));
    const shuffle = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    return [...shuffle(due.filter(isPriorityCard)), ...shuffle(due.filter(c => !isPriorityCard(c)))].map(c => c.id);
  }, [cards, isCardDueToday, isPriorityCard]);

  const startPraying = () => {
    if (!cards.filter(c => c.active).length) { alert('Add some people first!'); return; }
    const list = buildTodaysList();
    if (!list.length) { alert('No prayers due today!'); return; }
    const checked = {};
    list.forEach(cid => {
      const card = cards.find(c => c.id === cid);
      if (card) {
        checked[cid] = {};
        card.peopleIds.forEach(pid => { const p = people.find(x => x.id === pid); if (p?.individualCheckbox) checked[cid][pid] = false; });
        checked[cid]['_group'] = false;
      }
    });
    setSession({ dateStarted: getToday(), todaysList: list, checkedStatus: checked, currentView: 'flashcard', cardsInRotation: [...list] });
    setCurrentCardIndex(0);
    setScreen('prayer');
  };

  const toggleCheckbox = (cardId, key) => {
    if (!session) return;
    const newChecked = { ...session.checkedStatus };
    if (!newChecked[cardId]) newChecked[cardId] = {};
    const was = newChecked[cardId][key];
    newChecked[cardId][key] = !was;
    if (!was) {
      const card = cards.find(c => c.id === cardId);
      if (card) {
        const today = getToday();
        const toUpdate = key === '_group' ? card.peopleIds.filter(pid => { const p = people.find(x => x.id === pid); return p && !p.individualCheckbox; }) : [key];
        setPeople(prev => prev.map(p => toUpdate.includes(p.id) && !(p.prayerHistory || []).includes(today) ? { ...p, prayerHistory: [...(p.prayerHistory || []), today] } : p));
        if (!card.firstPrayerCompleted) setCards(prev => prev.map(c => c.id === cardId ? { ...c, firstPrayerCompleted: true } : c));
      }
    }
    const newSession = { ...session, checkedStatus: newChecked };
    // Don't auto-remove from rotation - let user swipe manually
    setSession(newSession);
  };

  const isCardFullyChecked = (cardId, checked = session?.checkedStatus) => {
    if (!checked?.[cardId]) return false;
    const card = cards.find(c => c.id === cardId);
    if (!card) return false;
    
    // Check all individual checkboxes
    for (const pid of card.peopleIds) { 
      const p = people.find(x => x.id === pid); 
      if (p?.individualCheckbox && !checked[cardId][pid]) return false; 
    }
    
    // Check if there are any grouped people (non-individual checkbox)
    const hasGroupedPeople = card.peopleIds.some(pid => { 
      const p = people.find(x => x.id === pid); 
      return p && !p.individualCheckbox; 
    });
    
    // If there are grouped people OR unnamed children, the group checkbox must be checked
    if ((hasGroupedPeople || card.includeUnnamedChildren) && !checked[cardId]['_group']) return false;
    
    return true;
  };

  const getCardsInRotation = () => session?.cardsInRotation || [];
  const getIncompleteCount = () => session?.cardsInRotation.filter(cid => !isCardFullyChecked(cid)).length || 0;
  const swipeNext = () => { const r = getCardsInRotation(); if (r.length) setCurrentCardIndex(i => (i + 1) % r.length); };
  const swipePrev = () => { const r = getCardsInRotation(); if (r.length) setCurrentCardIndex(i => (i - 1 + r.length) % r.length); };

  const addPerson = (data) => {
    const isOrg = !data.firstName && !data.lastName && data.organisation;
    const displayName = isOrg ? data.organisation : `${data.firstName} ${data.lastName}`.trim();
    const np = { id: generateId(), firstName: data.firstName, lastName: data.lastName, organisation: data.organisation || '', prayerPoint: data.prayerPoint || '', isChild: data.isChild || false, individualCheckbox: data.individualCheckbox !== false, prayerHistory: [], dateAdded: getToday(), firstPrayerCompleted: false };
    const nc = { id: generateId(), name: displayName, peopleIds: [np.id], frequency: data.frequency || 'daily', prayerPoint: '', includeUnnamedChildren: false, isGroup: false, active: true, dateCreated: getToday(), firstPrayerCompleted: false };
    setPeople(prev => [...prev, np]); setCards(prev => [...prev, nc]);
  };
  const updatePerson = (pid, data) => {
    setPeople(prev => prev.map(p => p.id === pid ? { ...p, ...data } : p));
    const solo = cards.find(c => c.peopleIds.length === 1 && c.peopleIds[0] === pid && !c.isGroup);
    if (solo) {
      const isOrg = !data.firstName && !data.lastName && data.organisation;
      const displayName = isOrg ? data.organisation : `${data.firstName} ${data.lastName}`.trim();
      setCards(prev => prev.map(c => c.id === solo.id ? { ...c, name: displayName, frequency: data.frequency || c.frequency } : c));
    }
  };
  const deletePerson = (pid) => {
    setCards(prev => prev.map(c => ({ ...c, peopleIds: c.peopleIds.filter(id => id !== pid) })).filter(c => c.peopleIds.length || c.includeUnnamedChildren));
    setPeople(prev => prev.filter(p => p.id !== pid));
  };
  const createGroup = (data) => {
    if (data.checkboxOverrides) setPeople(prev => prev.map(p => data.checkboxOverrides[p.id] !== undefined ? { ...p, individualCheckbox: data.checkboxOverrides[p.id] } : p));
    setCards(prev => prev.filter(c => c.isGroup || !c.peopleIds.some(id => data.peopleIds.includes(id))));
    setCards(prev => [...prev, { id: generateId(), name: data.name, peopleIds: data.peopleIds, frequency: data.frequency, prayerPoint: data.prayerPoint || '', includeUnnamedChildren: data.includeUnnamedChildren || false, isGroup: true, active: true, dateCreated: getToday(), firstPrayerCompleted: false }]);
    setSelectedPeopleForGroup([]);
  };
  const updateCard = (cid, data) => setCards(prev => prev.map(c => c.id === cid ? { ...c, ...data } : c));
  const dissolveGroup = (cid) => {
    const card = cards.find(c => c.id === cid);
    if (!card?.isGroup) return;
    card.peopleIds.forEach(pid => { const p = people.find(x => x.id === pid); if (p) setCards(prev => [...prev, { id: generateId(), name: `${p.firstName} ${p.lastName}`.trim() || p.organisation, peopleIds: [pid], frequency: card.frequency, prayerPoint: '', includeUnnamedChildren: false, isGroup: false, active: true, dateCreated: getToday(), firstPrayerCompleted: true }]); });
    setCards(prev => prev.filter(c => c.id !== cid));
  };
  
  const removeFromGroup = (cardId, personId) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;
    const person = people.find(p => p.id === personId);
    if (!person) return;
    
    // Create individual card for the removed person
    const newCard = {
      id: generateId(),
      name: `${person.firstName} ${person.lastName}`.trim() || person.organisation,
      peopleIds: [personId],
      frequency: card.frequency,
      prayerPoint: '',
      includeUnnamedChildren: false,
      isGroup: false,
      active: true,
      dateCreated: getToday(),
      firstPrayerCompleted: true
    };
    
    // Update the group card to remove this person
    const updatedPeopleIds = card.peopleIds.filter(id => id !== personId);
    
    if (updatedPeopleIds.length <= 1) {
      // If only one person left, convert group to individual card
      setCards(prev => {
        const withoutOld = prev.filter(c => c.id !== cardId);
        const remainingPersonId = updatedPeopleIds[0];
        const remainingPerson = people.find(p => p.id === remainingPersonId);
        if (remainingPerson) {
          return [...withoutOld, newCard, {
            id: generateId(),
            name: `${remainingPerson.firstName} ${remainingPerson.lastName}`.trim() || remainingPerson.organisation,
            peopleIds: [remainingPersonId],
            frequency: card.frequency,
            prayerPoint: card.prayerPoint,
            includeUnnamedChildren: false,
            isGroup: false,
            active: true,
            dateCreated: getToday(),
            firstPrayerCompleted: true
          }];
        }
        return [...withoutOld, newCard];
      });
      setEditingCard(null);
    } else {
      // Update group and add new individual card
      setCards(prev => prev.map(c => c.id === cardId ? { ...c, peopleIds: updatedPeopleIds } : c).concat(newCard));
      // Update editingCard state to reflect the change
      setEditingCard(prev => prev ? { ...prev, peopleIds: updatedPeopleIds } : null);
    }
  };
  const deleteCard = (cid) => {
    const card = cards.find(c => c.id === cid);
    if (!card) return;
    if (!card.isGroup) card.peopleIds.forEach(deletePerson);
    else dissolveGroup(cid);
    setCards(prev => prev.filter(c => c.id !== cid));
  };

  const getSortedPeople = () => [...people].sort((a, b) => { if (sortBy === 'firstName') return a.firstName.localeCompare(b.firstName); if (sortBy === 'lastName') return (a.lastName || '').localeCompare(b.lastName || ''); return 0; });
  const getSortedCards = () => [...cards].filter(c => c.isGroup).sort((a, b) => cardSortBy === 'name' ? a.name.localeCompare(b.name) : 0);
  const getPrayerCountThisMonth = (pid) => { const p = people.find(x => x.id === pid); if (!p) return 0; const m = new Date().getMonth(), y = new Date().getFullYear(); return (p.prayerHistory || []).filter(d => { const x = new Date(d); return x.getMonth() === m && x.getFullYear() === y; }).length; };
  const formatFrequency = (f) => ({ daily: 'Daily', 'every-2-3-days': '2-3 days', weekly: 'Weekly', monthly: 'Monthly' }[f] || f);

  useEffect(() => { if (editingPerson) { const card = editingPerson.id ? cards.find(c => c.peopleIds.includes(editingPerson.id)) : null; setPersonForm({ firstName: editingPerson.firstName || '', lastName: editingPerson.lastName || '', organisation: editingPerson.organisation || '', prayerPoint: editingPerson.prayerPoint || '', frequency: card?.frequency || 'daily', isChild: editingPerson.isChild || false, individualCheckbox: editingPerson.individualCheckbox !== false }); } }, [editingPerson, cards]);
  useEffect(() => { if (editingCard) setCardForm({ name: editingCard.name || '', frequency: editingCard.frequency || 'daily', prayerPoint: editingCard.prayerPoint || '', includeUnnamedChildren: editingCard.includeUnnamedChildren || false }); }, [editingCard]);
  useEffect(() => { if (screen === 'createGroup') { setGroupStep(1); setGroupForm({ name: '', frequency: 'weekly', prayerPoint: '', includeUnnamedChildren: false }); setCheckboxOverrides({}); } }, [screen]);
  useEffect(() => { if (selectedPeopleForGroup.length) { const sel = people.filter(p => selectedPeopleForGroup.includes(p.id)); const surnames = [...new Set(sel.map(p => p.lastName).filter(Boolean))]; setGroupForm(f => ({ ...f, name: surnames.length === 1 && surnames[0] ? surnames[0] + 's' : '' })); } }, [selectedPeopleForGroup, people]);

  const renderPrayerCard = (cardId, isFullScreen = false) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return null;
    const cardPeople = card.peopleIds.map(id => people.find(p => p.id === id)).filter(Boolean);
    const adults = cardPeople.filter(p => !p.isChild), children = cardPeople.filter(p => p.isChild);
    const isSingle = cardPeople.length === 1 && !card.isGroup;
    const freq = formatFrequency(card.frequency);
    const checked = session?.checkedStatus?.[cardId] || {};
    
    // Helper to render prayer points as bullet list
    const renderPrayerPoints = (text, centered = false) => {
      if (!text) return null;
      const points = text.split('\n').filter(p => p.trim());
      if (points.length === 0) return null;
      if (points.length === 1) {
        return <div style={{ fontSize: '14px', color: colors.textSecondary, fontStyle: 'italic', textAlign: centered ? 'center' : 'left', marginTop: '4px' }}>{points[0]}</div>;
      }
      return (
        <div style={{ fontSize: '14px', color: colors.textSecondary, fontStyle: 'italic', textAlign: 'left', marginTop: '4px' }}>
          {points.map((point, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '2px' }}>
              <span style={{ color: colors.textTertiary }}>•</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      );
    };
    
    // Compact list view
    if (!isFullScreen) {
      const allChecked = isCardFullyChecked(cardId);
      
      // Separate people with individual checkboxes vs grouped
      const individualPeople = cardPeople.filter(p => p.individualCheckbox);
      const groupedPeople = cardPeople.filter(p => !p.individualCheckbox);
      const hasGroupedItems = groupedPeople.length > 0 || card.includeUnnamedChildren;
      
      return (
        <div style={{ ...styles.card, padding: '12px 14px', marginBottom: '6px', opacity: allChecked ? 0.5 : 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, flexWrap: 'wrap' }}>
              {/* Individual checkbox people */}
              {individualPeople.map(p => {
                const isChecked = checked[p.id] || false;
                const isOrg = !p.firstName && !p.lastName && p.organisation;
                const displayName = isOrg ? p.organisation : p.firstName;
                return (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }} onClick={() => toggleCheckbox(cardId, p.id)}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#FFF', background: isChecked ? colors.accentGradient : colors.checkboxBg }}>{isChecked && '✓'}</span>
                    <span style={{ fontSize: '15px', fontWeight: '500', fontStyle: isOrg ? 'italic' : 'normal' }}>{displayName}</span>
                  </div>
                );
              })}
              
              {/* Separator between individuals and grouped */}
              {individualPeople.length > 0 && hasGroupedItems && (
                <div style={{ width: '1px', height: '20px', backgroundColor: colors.border, margin: '0 4px' }} />
              )}
              
              {/* Grouped people (children without individual checkboxes) + unnamed children */}
              {hasGroupedItems && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }} onClick={() => toggleCheckbox(cardId, '_group')}>
                  <span style={{ width: '22px', height: '22px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#FFF', background: checked['_group'] ? colors.accentGradient : colors.checkboxBg }}>{checked['_group'] && '✓'}</span>
                  <span style={{ fontSize: '15px', fontWeight: '500', color: colors.textSecondary }}>
                    {groupedPeople.map(p => p.firstName).join(', ')}
                    {groupedPeople.length > 0 && card.includeUnnamedChildren ? ' +' : ''}
                    {card.includeUnnamedChildren ? (groupedPeople.length > 0 ? 'others' : 'Children') : ''}
                  </span>
                </div>
              )}
            </div>
            <div style={{ fontSize: '11px', color: colors.textTertiary, marginLeft: '8px', flexShrink: 0 }}>{freq}</div>
          </div>
        </div>
      );
    }
    
    // Full screen flashcard view
    const fontSize = '7vw';
    const cbSize = '6vw';
    const cardStyle = { ...styles.card, ...styles.cardFullScreen, paddingLeft: '12px', paddingRight: '12px' };

    // For groups: left align. For singles: center align
    const nameAlign = isSingle ? 'center' : 'flex-start';

    const renderName = (person, isChild = false) => {
      const isOrg = !person.firstName && !person.lastName && person.organisation;
      const name = isOrg ? person.organisation : (isChild ? person.firstName : `${person.firstName} ${person.lastName}`.trim());
      const isChecked = person.individualCheckbox ? (checked[person.id] || false) : (checked['_group'] || false);
      return (
        <div key={person.id} style={{ marginBottom: '8px' }}>
          <div style={{ ...styles.nameRow, justifyContent: nameAlign }} onClick={() => toggleCheckbox(cardId, person.individualCheckbox ? person.id : '_group')}>
            <span style={{ ...styles.nameCheckbox, width: cbSize, height: cbSize, minWidth: '36px', minHeight: '36px', fontSize: '5vw', background: isChecked ? colors.accentGradient : colors.checkboxBg, boxShadow: isChecked ? '0 2px 8px rgba(52,199,89,0.3)' : 'none' }}>{isChecked && '✓'}</span>
            <span style={{ fontSize, fontWeight: '600', marginLeft: '16px', fontStyle: isOrg ? 'italic' : 'normal' }}>{name}</span>
          </div>
          {person.organisation && !isOrg && <div style={{ fontSize: '14px', color: colors.textSecondary, fontStyle: 'italic', marginTop: '-4px', marginBottom: '4px', paddingLeft: isSingle ? '0' : 'calc(6vw + 52px)', textAlign: isSingle ? 'center' : 'left' }}>{person.organisation}</div>}
          {person.prayerPoint && <div style={{ paddingLeft: isSingle ? '0' : 'calc(6vw + 52px)' }}>{renderPrayerPoints(person.prayerPoint, isSingle)}</div>}
        </div>
      );
    };

    const renderUnnamed = () => {
      const label = children.length ? 'and others' : 'And children';
      const isChecked = checked['_group'] || false;
      return (
        <div style={{ marginBottom: '8px' }}>
          <div style={{ ...styles.nameRow, justifyContent: nameAlign }} onClick={() => toggleCheckbox(cardId, '_group')}>
            <span style={{ ...styles.nameCheckbox, width: cbSize, height: cbSize, minWidth: '36px', minHeight: '36px', fontSize: '5vw', background: isChecked ? colors.accentGradient : colors.checkboxBg }}>{isChecked && '✓'}</span>
            <span style={{ fontSize, fontWeight: '600', fontStyle: 'italic', marginLeft: '16px', color: colors.textSecondary }}>{label}</span>
          </div>
        </div>
      );
    };

    if (isSingle) {
      const p = cardPeople[0];
      const isOrg = !p.firstName && !p.lastName && p.organisation;
      const name = isOrg ? p.organisation : `${p.firstName} ${p.lastName}`.trim();
      const isChecked = checked[p.id] || checked['_group'] || false;
      const prayerText = card.prayerPoint || p.prayerPoint;
      return (
        <div style={cardStyle}>
          <div style={styles.cardHeaderRow}><div></div><div style={styles.cardFrequency}>{freq}</div></div>
          <div style={styles.singlePersonContent}>
            <div style={styles.singleNameRow} onClick={() => toggleCheckbox(cardId, p.individualCheckbox ? p.id : '_group')}>
              <span style={{ ...styles.nameCheckbox, width: '12vw', height: '12vw', minWidth: '36px', minHeight: '36px', fontSize: '7vw', background: isChecked ? colors.accentGradient : colors.checkboxBg, boxShadow: isChecked ? '0 2px 10px rgba(52,199,89,0.3)' : 'none' }}>{isChecked && '✓'}</span>
              <span style={{ fontSize: '9vw', fontWeight: '600', marginLeft: '18px', fontStyle: isOrg ? 'italic' : 'normal' }}>{name}</span>
            </div>
            {p.organisation && !isOrg && <div style={{ textAlign: 'center', fontSize: '16px', color: colors.textSecondary, fontStyle: 'italic', marginTop: '8px' }}>{p.organisation}</div>}
            {prayerText && <div style={{ marginTop: '16px', maxWidth: '90%' }}>{renderPrayerPoints(prayerText, true)}</div>}
          </div>
        </div>
      );
    }

    return (
      <div style={cardStyle}>
        <div style={styles.cardHeaderRow}><div style={styles.cardTitle}>{card.name}</div><div style={styles.cardFrequency}>{freq}</div></div>
        {card.prayerPoint && <div style={{ marginBottom: '12px' }}>{renderPrayerPoints(card.prayerPoint, false)}</div>}
        <div style={{ ...styles.groupNamesContainer, flex: 1, justifyContent: 'center' }}>
          <div style={styles.adultsSection}>{adults.map(p => renderName(p, false))}</div>
          {(children.length > 0 || card.includeUnnamedChildren) && (
            <><div style={styles.childrenDivider}></div><div style={styles.childrenNamesSection}>{children.map(c => renderName(c, true))}{card.includeUnnamedChildren && renderUnnamed()}</div></>
          )}
        </div>
      </div>
    );
  };

  const renderModal = () => {
    if (!modal) return null;
    return (
      <div style={styles.modalOverlay} onClick={() => setModal(null)}>
        <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
          <div style={styles.modalTitle}>{modal.title}</div>
          <div style={styles.modalMessage}>{modal.message}</div>
          <div style={styles.modalButtons}>
            <button style={{ ...styles.btnSecondary, flex: 1 }} onClick={() => setModal(null)}>Cancel</button>
            <button style={{ ...styles.btnPrimary, flex: 1, background: modal.danger ? colors.dangerGradient : colors.primaryGradient }} onClick={() => { modal.onConfirm(); setModal(null); }}>
              {modal.confirmText || 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderHome = () => {
    const showContinue = session && !isNewDay();
    const count = cards.filter(c => c.active && isCardDueToday(c)).length;
    return (
      <div style={{ ...styles.container, position: 'relative' }}>
        <button style={styles.themeToggle} onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>{isDark ? '○' : '●'}</button>
        <button style={styles.demoButton} onClick={loadDemoData}>Demo</button>
        <div style={styles.greeting}>{showContinue ? 'Welcome back' : getGreeting('Matt')}</div>
        <div style={styles.subGreeting}>{count ? `${count} prayer${count !== 1 ? 's' : ''} for today` : 'No prayers scheduled'}</div>
        <button style={styles.btnPrimary} onClick={showContinue ? () => setScreen('prayer') : startPraying}>{showContinue ? 'Continue Praying' : 'Start Praying'}</button>
        <div style={{ height: '8px' }} />
        <div style={styles.buttonRow}><button style={styles.btnSecondary} onClick={() => setScreen('manage')}>Manage</button><button style={styles.btnSecondary} onClick={() => setScreen('stats')}>Stats</button></div>
        <button style={{ ...styles.btnSecondary, width: '100%' }} onClick={() => setScreen('createGroup')}>Create Group</button>
      </div>
    );
  };

  const renderPrayer = () => {
    const rotation = getCardsInRotation();
    const incompleteCount = getIncompleteCount();
    const allDone = incompleteCount === 0;
    const showList = session?.currentView === 'list' || allDone;
    if (showList) return (
      <div style={styles.container}>
        <div style={styles.header}><button style={styles.btnText} onClick={() => setScreen('home')}>← Home</button>{!allDone && <button style={styles.btnText} onClick={() => setSession(s => ({ ...s, currentView: 'flashcard' }))}>Cards</button>}</div>
        <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>{allDone ? 'All prayers complete' : "Today's Prayers"}</div>
        <div style={{ maxHeight: 'calc(100vh - 140px)', overflowY: 'auto' }}>{session?.todaysList.map(cid => <div key={cid}>{renderPrayerCard(cid, false)}</div>)}</div>
      </div>
    );
    const cid = rotation[currentCardIndex % rotation.length];
    return (
      <div style={styles.container}>
        <div style={styles.header}><button style={styles.btnText} onClick={() => setScreen('home')}>← Home</button><button style={styles.btnText} onClick={() => setSession(s => ({ ...s, currentView: 'list' }))}>List</button></div>
        {renderPrayerCard(cid, true)}
        <div style={styles.swipeButtons}><button style={styles.swipeButton} onClick={swipePrev}>‹</button><button style={styles.swipeButton} onClick={swipeNext}>›</button></div>
        <div style={styles.swipeHint}>{incompleteCount} remaining</div>
      </div>
    );
  };

  const renderManage = () => (
    <div style={styles.container}>
      <div style={styles.header}><button style={styles.btnText} onClick={() => setScreen('home')}>← Back</button>{manageTab === 'people' && <button style={styles.btnText} onClick={() => setEditingPerson({})}>+ Add</button>}</div>
      <div style={styles.tabs}>
        <button style={{ ...styles.tab, ...(manageTab === 'people' ? styles.toggleActive : styles.toggleInactive) }} onClick={() => setManageTab('people')}>People</button>
        <button style={{ ...styles.tab, ...(manageTab === 'cards' ? styles.toggleActive : styles.toggleInactive) }} onClick={() => setManageTab('cards')}>Groups</button>
      </div>
      {manageTab === 'people' && (<>
        <select style={styles.sortSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}><option value="firstName">First Name</option><option value="lastName">Last Name</option></select>
        {!people.length ? <div style={styles.emptyState}>No people yet. Tap + to add.</div> : <div style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>{getSortedPeople().map(p => { const c = cards.find(x => x.peopleIds.includes(p.id)); const isGrouped = c?.isGroup; const isOrg = !p.firstName && !p.lastName && p.organisation; const displayName = isOrg ? p.organisation : `${p.firstName} ${p.lastName}`.trim(); return (<div key={p.id} style={{ ...styles.listItem, display: 'grid', gridTemplateColumns: '1fr 80px 45px', alignItems: 'center' }} onClick={() => setEditingPerson(p)}><div><div style={{ ...styles.listItemName, fontStyle: isOrg ? 'italic' : 'normal' }}>{displayName}{p.isChild && <span style={{ color: colors.textTertiary, fontSize: '12px' }}> (child)</span>}</div>{p.organisation && !isOrg && <div style={{ fontSize: '12px', color: colors.textTertiary, fontStyle: 'italic', marginTop: '1px' }}>{p.organisation}</div>}{isGrouped && <div style={{ fontSize: '12px', color: colors.primary, marginTop: '2px' }}>↳ {c.name}</div>}</div><div style={{ fontSize: '13px', color: colors.textTertiary }}>{formatFrequency(c?.frequency)}</div><div style={{ ...styles.listItemMeta, textAlign: 'right' }}>{getPrayerCountThisMonth(p.id)}×</div></div>); })}</div>}
      </>)}
      {manageTab === 'cards' && (<>
        <select style={styles.sortSelect} value={cardSortBy} onChange={e => setCardSortBy(e.target.value)}><option value="name">Name</option><option value="frequency">Frequency</option></select>
        {!getSortedCards().length ? <div style={styles.emptyState}>No groups yet.<br/>Use "Create Group" to combine people.</div> : <div style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>{getSortedCards().map(c => { const count = c.peopleIds.length; return <div key={c.id} style={{ ...styles.listItem, display: 'grid', gridTemplateColumns: '1fr 80px', alignItems: 'center' }} onClick={() => setEditingCard(c)}><div><div style={styles.listItemName}>{c.name}</div><div style={{ fontSize: '12px', color: colors.textTertiary, marginTop: '2px' }}>{count} {count === 1 ? 'person' : 'people'}</div></div><div style={{ fontSize: '13px', color: colors.textTertiary }}>{formatFrequency(c.frequency)}</div></div>; })}</div>}
      </>)}
    </div>
  );

  const renderEditPerson = () => {
    const isNew = !editingPerson?.id;
    const personCard = isNew ? null : cards.find(c => c.peopleIds.includes(editingPerson.id));
    const save = () => { 
      if (!personForm.firstName.trim() && !personForm.lastName.trim() && !personForm.organisation.trim()) { 
        alert('Enter a name or organisation'); 
        return; 
      } 
      if (isNew) addPerson(personForm); 
      else updatePerson(editingPerson.id, personForm); 
      setEditingPerson(null); 
    };
    const del = () => setModal({
      title: 'Delete person?',
      message: `This will remove ${personForm.firstName || personForm.organisation} and their prayer history permanently.`,
      confirmText: 'Delete',
      danger: true,
      onConfirm: () => { deletePerson(editingPerson.id); setEditingPerson(null); }
    });
    return (
      <div style={styles.container}>
        <div style={styles.header}><button style={styles.btnText} onClick={() => setEditingPerson(null)}>Cancel</button><button style={styles.btnText} onClick={save}>Save</button></div>
        
        {!isNew && personCard && (
          <div 
            style={{ ...styles.card, padding: '14px 16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => { setEditingPerson(null); setEditingCard(personCard); }}
          >
            <div>
              <div style={{ fontSize: '12px', color: colors.textTertiary, marginBottom: '2px' }}>{personCard.isGroup ? 'PART OF GROUP' : 'PRAYER CARD'}</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: colors.primary }}>{personCard.name}</div>
            </div>
            <div style={{ fontSize: '20px', color: colors.textTertiary }}>→</div>
          </div>
        )}
        
        <label style={styles.label}>First Name</label><input style={styles.input} value={personForm.firstName} onChange={e => setPersonForm({ ...personForm, firstName: e.target.value })} placeholder="First name" />
        <label style={styles.label}>Last Name</label><input style={styles.input} value={personForm.lastName} onChange={e => setPersonForm({ ...personForm, lastName: e.target.value })} placeholder="Last name" />
        <label style={styles.label}>Organisation / Ministry</label><input style={styles.input} value={personForm.organisation} onChange={e => setPersonForm({ ...personForm, organisation: e.target.value })} placeholder="Optional - e.g. OMF, City Youth" />
        <label style={styles.label}>Prayer Points</label><textarea style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }} value={personForm.prayerPoint} onChange={e => setPersonForm({ ...personForm, prayerPoint: e.target.value })} placeholder="One per line" />
        <label style={styles.label}>Frequency</label><select style={styles.select} value={personForm.frequency} onChange={e => setPersonForm({ ...personForm, frequency: e.target.value })}><option value="daily">Daily</option><option value="every-2-3-days">Every 2-3 Days</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select>
        <label style={styles.label}>Type</label><div style={styles.toggle}><div style={{ ...styles.toggleOption, ...(!personForm.isChild ? styles.toggleActive : styles.toggleInactive) }} onClick={() => setPersonForm({ ...personForm, isChild: false })}>Adult</div><div style={{ ...styles.toggleOption, ...(personForm.isChild ? styles.toggleActive : styles.toggleInactive) }} onClick={() => setPersonForm({ ...personForm, isChild: true })}>Child</div></div>
        <label style={styles.label}>Individual checkbox</label><div style={styles.toggle}><div style={{ ...styles.toggleOption, ...(personForm.individualCheckbox ? styles.toggleActive : styles.toggleInactive) }} onClick={() => setPersonForm({ ...personForm, individualCheckbox: true })}>Yes</div><div style={{ ...styles.toggleOption, ...(!personForm.individualCheckbox ? styles.toggleActive : styles.toggleInactive) }} onClick={() => setPersonForm({ ...personForm, individualCheckbox: false })}>No</div></div>
        {!isNew && <><button style={{ ...styles.btnSecondary, width: '100%', marginTop: '8px' }} onClick={() => { setViewingStats(editingPerson); setEditingPerson(null); }}>View History</button><button style={styles.btnDanger} onClick={del}>Delete</button></>}
      </div>
    );
  };

  const renderEditCard = () => {
    const cp = editingCard?.peopleIds.map(id => people.find(p => p.id === id)).filter(Boolean) || [];
    const save = () => { if (!cardForm.name.trim()) { alert('Name required'); return; } updateCard(editingCard.id, cardForm); setEditingCard(null); };
    return (
      <div style={styles.container}>
        <div style={styles.header}><button style={styles.btnText} onClick={() => setEditingCard(null)}>Cancel</button><button style={styles.btnText} onClick={save}>Save</button></div>
        <label style={styles.label}>Card Name</label><input style={styles.input} value={cardForm.name} onChange={e => setCardForm({ ...cardForm, name: e.target.value })} />
        <label style={styles.label}>Frequency</label><select style={styles.select} value={cardForm.frequency} onChange={e => setCardForm({ ...cardForm, frequency: e.target.value })}><option value="daily">Daily</option><option value="every-2-3-days">Every 2-3 Days</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select>
        <label style={styles.label}>Prayer Points</label><textarea style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }} value={cardForm.prayerPoint} onChange={e => setCardForm({ ...cardForm, prayerPoint: e.target.value })} placeholder="One per line" />
        {editingCard?.isGroup && <><label style={styles.label}>Unnamed children</label><div style={styles.toggle}><div style={{ ...styles.toggleOption, ...(cardForm.includeUnnamedChildren ? styles.toggleActive : styles.toggleInactive) }} onClick={() => setCardForm({ ...cardForm, includeUnnamedChildren: true })}>Yes</div><div style={{ ...styles.toggleOption, ...(!cardForm.includeUnnamedChildren ? styles.toggleActive : styles.toggleInactive) }} onClick={() => setCardForm({ ...cardForm, includeUnnamedChildren: false })}>No</div></div><label style={styles.label}>People in group</label>{cp.map(p => {
          const isOrg = !p.firstName && !p.lastName && p.organisation;
          const displayName = isOrg ? p.organisation : `${p.firstName} ${p.lastName}`.trim();
          return (
            <div key={p.id} style={{ ...styles.listItem, cursor: 'default', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontStyle: isOrg ? 'italic' : 'normal' }}>{displayName}</span>
                <span style={{ fontSize: '12px', color: colors.textTertiary, marginLeft: '8px' }}>{p.isChild ? 'Child' : 'Adult'}</span>
              </div>
              <button 
                style={{ background: 'none', border: 'none', color: colors.textTertiary, fontSize: '18px', cursor: 'pointer', padding: '4px 8px' }}
                onClick={() => setModal({
                  title: 'Remove from group?',
                  message: `${displayName} will be removed from this group and given their own individual prayer card. Their prayer history will be preserved.`,
                  confirmText: 'Remove',
                  onConfirm: () => removeFromGroup(editingCard.id, p.id)
                })}
              >×</button>
            </div>
          );
        })}<button style={{ ...styles.btnSecondary, width: '100%', marginTop: '16px' }} onClick={() => setModal({
              title: 'Split group?',
              message: 'This will remove the group and create individual prayer cards for each person. Prayer history will be preserved.',
              confirmText: 'Split',
              onConfirm: () => { dissolveGroup(editingCard.id); setEditingCard(null); }
            })}>Split into individuals</button></>}
        {!editingCard?.isGroup && <button style={styles.btnDanger} onClick={() => setModal({
          title: 'Delete person?',
          message: 'This will remove this person and their prayer history permanently.',
          confirmText: 'Delete',
          danger: true,
          onConfirm: () => { deleteCard(editingCard.id); setEditingCard(null); }
        })}>Delete</button>}
      </div>
    );
  };

  const renderCreateGroup = () => {
    const sel = people.filter(p => selectedPeopleForGroup.includes(p.id));
    const create = () => { if (!groupForm.name.trim()) { alert('Name required'); return; } createGroup({ ...groupForm, peopleIds: selectedPeopleForGroup, checkboxOverrides }); setSelectedPeopleForGroup([]); setScreen('home'); };
    if (groupStep === 1) return (
      <div style={styles.container}>
        <div style={styles.header}><button style={styles.btnText} onClick={() => { setSelectedPeopleForGroup([]); setScreen('home'); }}>Cancel</button><button style={{ ...styles.btnText, opacity: selectedPeopleForGroup.length < 2 ? 0.4 : 1 }} onClick={() => selectedPeopleForGroup.length >= 2 && setGroupStep(2)}>Next ({selectedPeopleForGroup.length})</button></div>
        <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Select people</div>
        {!people.length ? <div style={styles.emptyState}>Add people first.</div> : <div style={{ maxHeight: 'calc(100vh - 140px)', overflowY: 'auto' }}>{getSortedPeople().map(p => { const isSel = selectedPeopleForGroup.includes(p.id); const isOrg = !p.firstName && !p.lastName && p.organisation; const displayName = isOrg ? p.organisation : `${p.firstName} ${p.lastName}`.trim(); return <div key={p.id} style={{ ...styles.listItem, background: isSel ? colors.primaryGradient : colors.cardBg, color: isSel ? colors.primaryText : colors.text }} onClick={() => setSelectedPeopleForGroup(prev => isSel ? prev.filter(id => id !== p.id) : [...prev, p.id])}><span style={{ fontStyle: isOrg ? 'italic' : 'normal' }}>{displayName}</span>{p.isChild && <span style={{ fontSize: '12px', opacity: 0.7 }}>(child)</span>}</div>; })}</div>}
      </div>
    );
    return (
      <div style={styles.container}>
        <div style={styles.header}><button style={styles.btnText} onClick={() => setGroupStep(1)}>← Back</button><button style={styles.btnText} onClick={create}>Create</button></div>
        <label style={styles.label}>Group Name</label><input style={styles.input} value={groupForm.name} onChange={e => setGroupForm({ ...groupForm, name: e.target.value })} placeholder="e.g. Smiths" />
        <label style={styles.label}>Frequency</label><select style={styles.select} value={groupForm.frequency} onChange={e => setGroupForm({ ...groupForm, frequency: e.target.value })}><option value="daily">Daily</option><option value="every-2-3-days">Every 2-3 Days</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select>
        <label style={styles.label}>Prayer Points</label><textarea style={{ ...styles.input, minHeight: '60px', resize: 'vertical' }} value={groupForm.prayerPoint} onChange={e => setGroupForm({ ...groupForm, prayerPoint: e.target.value })} placeholder="One per line" />
        <label style={styles.label}>Unnamed children</label><div style={styles.toggle}><div style={{ ...styles.toggleOption, ...(groupForm.includeUnnamedChildren ? styles.toggleActive : styles.toggleInactive) }} onClick={() => setGroupForm({ ...groupForm, includeUnnamedChildren: true })}>Yes</div><div style={{ ...styles.toggleOption, ...(!groupForm.includeUnnamedChildren ? styles.toggleActive : styles.toggleInactive) }} onClick={() => setGroupForm({ ...groupForm, includeUnnamedChildren: false })}>No</div></div>
        <label style={styles.label}>Checkboxes</label><div style={{ maxHeight: '180px', overflowY: 'auto' }}>{sel.map(p => { const isOrg = !p.firstName && !p.lastName && p.organisation; const displayName = isOrg ? p.organisation : `${p.firstName} ${p.lastName}`.trim(); return <div key={p.id} style={{ ...styles.listItem, flexDirection: 'column', alignItems: 'stretch' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ fontWeight: '500', fontStyle: isOrg ? 'italic' : 'normal' }}>{displayName}</span><span style={{ fontSize: '12px', color: colors.textTertiary }}>{p.isChild ? 'Child' : 'Adult'}</span></div><div style={{ ...styles.toggle, marginBottom: 0 }}><div style={{ ...styles.toggleOption, fontSize: '13px', padding: '8px', ...((checkboxOverrides[p.id] ?? p.individualCheckbox) ? styles.toggleActive : styles.toggleInactive) }} onClick={() => setCheckboxOverrides({ ...checkboxOverrides, [p.id]: true })}>Individual</div><div style={{ ...styles.toggleOption, fontSize: '13px', padding: '8px', ...(!(checkboxOverrides[p.id] ?? p.individualCheckbox) ? styles.toggleActive : styles.toggleInactive) }} onClick={() => setCheckboxOverrides({ ...checkboxOverrides, [p.id]: false })}>Grouped</div></div></div>; })}</div>
      </div>
    );
  };

  const renderStats = () => {
    if (viewingStats) {
      const hist = viewingStats.prayerHistory || [], m = statsMonth.getMonth(), y = statsMonth.getFullYear();
      const days = new Date(y, m + 1, 0).getDate(), first = new Date(y, m, 1).getDay();
      const prayed = hist.filter(d => { const x = new Date(d); return x.getMonth() === m && x.getFullYear() === y; }).map(d => new Date(d).getDate());
      const mName = new Date(y, m).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const isOrg = !viewingStats.firstName && !viewingStats.lastName && viewingStats.organisation;
      const displayName = isOrg ? viewingStats.organisation : `${viewingStats.firstName} ${viewingStats.lastName}`.trim();
      return (
        <div style={styles.container}>
          <div style={styles.header}><button style={styles.btnText} onClick={() => setViewingStats(null)}>← Back</button></div>
          <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px', fontStyle: isOrg ? 'italic' : 'normal' }}>{displayName}</div>
          <div style={{ color: colors.textSecondary, marginBottom: '24px', fontSize: '16px' }}>{prayed.length} times in {mName}</div>
          <div style={styles.calendar}>
            <div style={styles.calendarHeader}><button style={styles.navButton} onClick={() => setStatsMonth(new Date(y, m - 1))}>‹</button><span style={{ fontWeight: '600', fontSize: '17px' }}>{mName}</span><button style={styles.navButton} onClick={() => setStatsMonth(new Date(y, m + 1))}>›</button></div>
            <div style={styles.calendarGrid}>{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} style={styles.calendarDayHeader}>{d}</div>)}{Array(first).fill(null).map((_, i) => <div key={`e${i}`} style={styles.calendarDay}></div>)}{Array(days).fill(null).map((_, i) => { const day = i + 1, isPrayed = prayed.includes(day); return <div key={day} style={{ ...styles.calendarDay, ...(isPrayed ? styles.prayedDay : {}) }}>{day}</div>; })}</div>
          </div>
        </div>
      );
    }
    return (
      <div style={styles.container}>
        <div style={styles.header}><button style={styles.btnText} onClick={() => setScreen('home')}>← Back</button></div>
        <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>Prayer Stats</div>
        {!people.length ? <div style={styles.emptyState}>No history yet.</div> : <div style={{ maxHeight: 'calc(100vh - 140px)', overflowY: 'auto' }}>{getSortedPeople().map(p => { const c = cards.find(x => x.peopleIds.includes(p.id)); const isOrg = !p.firstName && !p.lastName && p.organisation; const displayName = isOrg ? p.organisation : `${p.firstName} ${p.lastName}`.trim(); return <div key={p.id} style={{ ...styles.listItem, display: 'grid', gridTemplateColumns: '1fr 80px 45px', alignItems: 'center' }} onClick={() => { setViewingStats(p); setStatsMonth(new Date()); }}><div style={{ ...styles.listItemName, fontStyle: isOrg ? 'italic' : 'normal' }}>{displayName}</div><div style={{ fontSize: '13px', color: colors.textTertiary }}>{formatFrequency(c?.frequency)}</div><div style={{ ...styles.listItemMeta, textAlign: 'right' }}>{getPrayerCountThisMonth(p.id)}×</div></div>; })}</div>}
      </div>
    );
  };

  if (editingPerson) return <>{renderEditPerson()}{renderModal()}</>;
  if (editingCard) return <>{renderEditCard()}{renderModal()}</>;
  if (viewingStats) return renderStats();
  switch (screen) {
    case 'home': return renderHome();
    case 'prayer': return renderPrayer();
    case 'manage': return renderManage();
    case 'stats': return renderStats();
    case 'createGroup': return renderCreateGroup();
    default: return renderHome();
  }
}