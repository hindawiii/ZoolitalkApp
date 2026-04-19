import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface SurahItem {
  id: string
  number: number
  name: string
  nameAr: string
  ayah: string
  translation: string
  tafsir: string
  audioUrl: string
  ayahCount: number
}

export interface HadithItem {
  id: string
  arabic: string
  translation: string
  explanation: string
  source: string
}

export const SURAH_LIBRARY: SurahItem[] = [
  {
    id: 'fatiha',
    number: 1,
    name: 'Al-Fatiha',
    nameAr: 'الفاتحة',
    ayah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    translation: 'In the name of Allah, the Most Merciful, the Most Compassionate.',
    tafsir: 'This opening verse affirms that every act is undertaken with Allah’s name and mercy.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/001.mp3',
    ayahCount: 7,
  },
  {
    id: 'baqarah',
    number: 2,
    name: 'Al-Baqarah',
    nameAr: 'البقرة',
    ayah: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    translation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.',
    tafsir: 'This verse declares the absolute oneness of Allah and His eternal nature.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/002.mp3',
    ayahCount: 286,
  },
  {
    id: 'fajr',
    number: 89,
    name: 'Al-Fajr',
    nameAr: 'الفجر',
    ayah: 'وَالْفَجْرِ',
    translation: 'By the dawn',
    tafsir: 'An oath by dawn reminds the believer of Allah\'s presence at every new beginning.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/089.mp3',
    ayahCount: 30,
  },
  {
    id: 'yasin',
    number: 36,
    name: 'Ya-Sin',
    nameAr: 'يس',
    ayah: 'يٰسٓ',
    translation: 'Ya, Sin.',
    tafsir: 'This surah is known as the heart of the Quran.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/036.mp3',
    ayahCount: 83,
  },
  {
    id: 'rahman',
    number: 55,
    name: 'Ar-Rahman',
    nameAr: 'الرحمن',
    ayah: 'الرَّحْمَٰنُ',
    translation: 'The Most Merciful',
    tafsir: 'This surah beautifully describes Allah\'s mercy.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/055.mp3',
    ayahCount: 78,
  },
  {
    id: 'waqiah',
    number: 56,
    name: 'Al-Waqiah',
    nameAr: 'الواقعة',
    ayah: 'إِذَا وَقَعَتِ الْوَاقِعَةُ',
    translation: 'When the Occurrence occurs,',
    tafsir: 'This surah describes the Day of Judgment.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/056.mp3',
    ayahCount: 96,
  },
  {
    id: 'mulk',
    number: 67,
    name: 'Al-Mulk',
    nameAr: 'الملك',
    ayah: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ',
    translation: 'Blessed is He in whose hand is dominion',
    tafsir: 'This surah emphasizes Allah\'s absolute sovereignty.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/067.mp3',
    ayahCount: 30,
  }
]

export const HADITH_LIBRARY: HadithItem[] = [
  {
    id: 'hadith-1',
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
    translation: 'Actions are judged by intentions.',
    explanation: 'Sincerity is the condition for the reward of every deed.',
    source: 'Sahih al-Bukhari',
  },
  {
    id: 'hadith-2',
    arabic: 'من سلك طريقًا يلتمس فيه علمًا سهل الله له طريقًا إلى الجنة',
    translation: 'Whoever follows a path in search of knowledge, Allah will make easy for him the path to Paradise.',
    explanation: 'The pursuit of spiritual knowledge is a form of worship.',
    source: 'Sahih Muslim',
  }
]

export interface IslamicState {
  currentSurahId: string | null
  playbackState: 'playing' | 'paused' | 'stopped'
  playbackPosition: number
  isOfflineCacheEnabled: boolean
  cachedSurahs: string[]
  isNightMode: boolean
  ayahOfTheDayId: string
  isPlayerExpanded: boolean
  isSurahListVisible: boolean
  setCurrentSurah: (surahId: string) => void
  playSurah: () => void
  pauseSurah: () => void
  stopSurah: () => void
  setPlaybackPosition: (position: number) => void
  toggleOfflineCache: () => void
  toggleSurahCache: (surahId: string) => void
  setNightMode: (nightMode: boolean) => void
  setAyahOfTheDay: (ayahId: string) => void
  togglePlayerExpanded: () => void
  setSurahListVisible: (visible: boolean) => void
}

export const useIslamicStore = create<IslamicState>()(
  persist(
    (set) => ({
      currentSurahId: SURAH_LIBRARY[0].id,
      playbackState: 'paused',
      playbackPosition: 0,
      isOfflineCacheEnabled: false,
      cachedSurahs: [],
      isNightMode: false,
      ayahOfTheDayId: 'fatiha',
      isPlayerExpanded: false,
      isSurahListVisible: false,
      setCurrentSurah: (surahId) => set({ currentSurahId: surahId, playbackPosition: 0 }),
      playSurah: () => set({ playbackState: 'playing' }),
      pauseSurah: () => set({ playbackState: 'paused' }),
      stopSurah: () => set({ playbackState: 'stopped', playbackPosition: 0 }),
      setPlaybackPosition: (position) => set({ playbackPosition: position }),
      toggleOfflineCache: () => set((state) => ({ isOfflineCacheEnabled: !state.isOfflineCacheEnabled })),
      toggleSurahCache: (surahId) =>
        set((state) => ({
          cachedSurahs: state.cachedSurahs.includes(surahId)
            ? state.cachedSurahs.filter((id) => id !== surahId)
            : [...state.cachedSurahs, surahId],
        })),
      setNightMode: (nightMode) => set({ isNightMode: nightMode }),
      setAyahOfTheDay: (ayahId) => set({ ayahOfTheDayId: ayahId }),
      togglePlayerExpanded: () => set((state) => ({ isPlayerExpanded: !state.isPlayerExpanded })),
      setSurahListVisible: (visible) => set({ isSurahListVisible: visible }),
    }),
    {
      name: 'rakobatna-islamic-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentSurahId: state.currentSurahId,
        playbackState: state.playbackState,
        playbackPosition: state.playbackPosition,
        isOfflineCacheEnabled: state.isOfflineCacheEnabled,
        cachedSurahs: state.cachedSurahs,
        isNightMode: state.isNightMode,
        ayahOfTheDayId: state.ayahOfTheDayId,
        isPlayerExpanded: state.isPlayerExpanded,
      }),
    }
  )
)