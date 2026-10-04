/**
 * Catalogue of common adhkar used with a tasbih.
 * `target` is the traditional number of repetitions for one round.
 */
export interface Zikr {
	id: string;
	ar: string;
	translit: string;
	en: string;
	target: number;
}

export const ADHKAR: readonly Zikr[] = [
	{ id: 'subhanallah', ar: 'سُبْحَانَ اللَّهِ', translit: 'SubhanAllah', en: 'Glory be to Allah', target: 33 },
	{ id: 'alhamdulillah', ar: 'الْحَمْدُ لِلَّهِ', translit: 'Alhamdulillah', en: 'All praise is due to Allah', target: 33 },
	{ id: 'allahuakbar', ar: 'اللَّهُ أَكْبَرُ', translit: 'Allahu Akbar', en: 'Allah is the Greatest', target: 34 },
	{ id: 'tahlil', ar: 'لَا إِلَٰهَ إِلَّا اللَّهُ', translit: 'La ilaha illa Allah', en: 'There is no god but Allah', target: 100 },
	{ id: 'astaghfirullah', ar: 'أَسْتَغْفِرُ اللَّهَ', translit: 'Astaghfirullah', en: 'I seek forgiveness from Allah', target: 100 },
	{ id: 'astaghfirullah-atub', ar: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', translit: 'Astaghfirullaha wa atubu ilayh', en: 'I seek Allah\'s forgiveness and repent to Him', target: 100 },
	{ id: 'subhanallah-wabihamdihi', ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', translit: 'SubhanAllahi wa bihamdihi', en: 'Glory be to Allah and praise be to Him', target: 100 },
	{ id: 'subhanallah-azim', ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ', translit: 'SubhanAllahi wa bihamdihi, SubhanAllahil-Azim', en: 'Glory be to Allah and praise be to Him, Glory be to Allah the Magnificent', target: 100 },
	{ id: 'baqiyat', ar: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ', translit: 'SubhanAllah wal-hamdulillah wa la ilaha illa Allah wa Allahu Akbar', en: 'Glory be to Allah, praise be to Allah, there is no god but Allah, Allah is the Greatest', target: 100 },
	{ id: 'tahlil-full', ar: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', translit: 'La ilaha illa Allahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa \'ala kulli shay\'in qadir', en: 'There is no god but Allah alone, without partner. His is the dominion and His is the praise, and He is over all things capable', target: 100 },
	{ id: 'hawqala', ar: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', translit: 'La hawla wa la quwwata illa billah', en: 'There is no might nor power except with Allah', target: 100 },
	{ id: 'salawat', ar: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَىٰ نَبِيِّنَا مُحَمَّدٍ', translit: 'Allahumma salli wa sallim \'ala nabiyyina Muhammad', en: 'O Allah, send prayers and peace upon our Prophet Muhammad', target: 100 },
	{ id: 'salawat-ibrahimiyya', ar: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ', translit: 'Allahumma salli \'ala Muhammad wa \'ala ali Muhammad, kama sallayta \'ala Ibrahim wa \'ala ali Ibrahim, innaka Hamidun Majid', en: 'O Allah, send prayers upon Muhammad and the family of Muhammad, as You sent prayers upon Ibrahim and the family of Ibrahim; You are Praiseworthy, Glorious', target: 10 },
	{ id: 'hasbiyallah', ar: 'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ', translit: 'Hasbiyallahu la ilaha illa huwa, \'alayhi tawakkaltu wa huwa Rabbul-\'Arshil-\'Azim', en: 'Allah is sufficient for me; there is no god but Him. In Him I trust, and He is Lord of the Mighty Throne', target: 7 },
	{ id: 'hasbunallah', ar: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', translit: 'Hasbunallahu wa ni\'mal-wakil', en: 'Allah is sufficient for us, and He is the best Disposer of affairs', target: 100 },
	{ id: 'yunus', ar: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ', translit: 'La ilaha illa anta subhanaka inni kuntu minaz-zalimin', en: 'There is no god but You, glory be to You; indeed I have been of the wrongdoers', target: 100 },
	{ id: 'sayyid-istighfar', ar: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ', translit: 'Sayyid al-Istighfar', en: 'The master supplication for forgiveness', target: 1 },
	{ id: 'bismillah-ladhi', ar: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ', translit: 'Bismillahil-ladhi la yadurru ma\'asmihi shay\'un fil-ardi wa la fis-sama\', wa huwas-Sami\'ul-\'Alim', en: 'In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, All-Knowing', target: 3 },
	{ id: 'radhitu', ar: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا', translit: 'Raditu billahi Rabba, wa bil-Islami dina, wa bi-Muhammadin nabiyya', en: 'I am pleased with Allah as Lord, Islam as religion and Muhammad ﷺ as Prophet', target: 3 },
	{ id: 'subhanallah-adada', ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ', translit: 'SubhanAllahi wa bihamdihi \'adada khalqihi wa rida nafsihi wa zinata \'arshihi wa midada kalimatih', en: 'Glory and praise be to Allah, as many as His creation, as pleases Him, as heavy as His Throne and as abundant as His words', target: 3 },
	{ id: 'kaffarat-majlis', ar: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ', translit: 'Subhanakallahumma wa bihamdika, ashhadu an la ilaha illa anta, astaghfiruka wa atubu ilayk', en: 'Glory be to You O Allah and praise; I bear witness there is no god but You, I seek Your forgiveness and repent to You', target: 1 },
	{ id: 'ya-hayyu', ar: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ', translit: 'Ya Hayyu ya Qayyum, bi-rahmatika astaghith', en: 'O Ever-Living, O Sustainer, in Your mercy I seek relief', target: 100 },
	{ id: 'rabbighfirli', ar: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ', translit: 'Rabbighfir li wa tub \'alayya innaka antat-Tawwabur-Rahim', en: 'My Lord, forgive me and accept my repentance; You are the Accepting of repentance, the Merciful', target: 100 },
];

export const DEFAULT_ZIKR_ID = ADHKAR[0].id;

export function getZikr(id: string | undefined): Zikr {
	return ADHKAR.find(z => z.id === id) ?? ADHKAR[0];
}
