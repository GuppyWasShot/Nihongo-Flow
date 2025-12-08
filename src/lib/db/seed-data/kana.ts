/**
 * Hiragana and Katakana character data
 * Includes basic characters, dakuten (゛) voiced, and handakuten (゜) semi-voiced
 */

export const hiraganaData = [
    // Vowels (a-row)
    { character: 'あ', romaji: 'a', row: 'a', column: 'a', strokeCount: 3 },
    { character: 'い', romaji: 'i', row: 'a', column: 'i', strokeCount: 2 },
    { character: 'う', romaji: 'u', row: 'a', column: 'u', strokeCount: 2 },
    { character: 'え', romaji: 'e', row: 'a', column: 'e', strokeCount: 2 },
    { character: 'お', romaji: 'o', row: 'a', column: 'o', strokeCount: 3 },
    // K-row
    { character: 'か', romaji: 'ka', row: 'ka', column: 'a', strokeCount: 3 },
    { character: 'き', romaji: 'ki', row: 'ka', column: 'i', strokeCount: 4 },
    { character: 'く', romaji: 'ku', row: 'ka', column: 'u', strokeCount: 1 },
    { character: 'け', romaji: 'ke', row: 'ka', column: 'e', strokeCount: 3 },
    { character: 'こ', romaji: 'ko', row: 'ka', column: 'o', strokeCount: 2 },
    // S-row
    { character: 'さ', romaji: 'sa', row: 'sa', column: 'a', strokeCount: 3 },
    { character: 'し', romaji: 'shi', row: 'sa', column: 'i', strokeCount: 1 },
    { character: 'す', romaji: 'su', row: 'sa', column: 'u', strokeCount: 2 },
    { character: 'せ', romaji: 'se', row: 'sa', column: 'e', strokeCount: 3 },
    { character: 'そ', romaji: 'so', row: 'sa', column: 'o', strokeCount: 1 },
    // T-row
    { character: 'た', romaji: 'ta', row: 'ta', column: 'a', strokeCount: 4 },
    { character: 'ち', romaji: 'chi', row: 'ta', column: 'i', strokeCount: 2 },
    { character: 'つ', romaji: 'tsu', row: 'ta', column: 'u', strokeCount: 1 },
    { character: 'て', romaji: 'te', row: 'ta', column: 'e', strokeCount: 1 },
    { character: 'と', romaji: 'to', row: 'ta', column: 'o', strokeCount: 2 },
    // N-row
    { character: 'な', romaji: 'na', row: 'na', column: 'a', strokeCount: 4 },
    { character: 'に', romaji: 'ni', row: 'na', column: 'i', strokeCount: 3 },
    { character: 'ぬ', romaji: 'nu', row: 'na', column: 'u', strokeCount: 2 },
    { character: 'ね', romaji: 'ne', row: 'na', column: 'e', strokeCount: 2 },
    { character: 'の', romaji: 'no', row: 'na', column: 'o', strokeCount: 1 },
    // H-row
    { character: 'は', romaji: 'ha', row: 'ha', column: 'a', strokeCount: 3 },
    { character: 'ひ', romaji: 'hi', row: 'ha', column: 'i', strokeCount: 1 },
    { character: 'ふ', romaji: 'fu', row: 'ha', column: 'u', strokeCount: 4 },
    { character: 'へ', romaji: 'he', row: 'ha', column: 'e', strokeCount: 1 },
    { character: 'ほ', romaji: 'ho', row: 'ha', column: 'o', strokeCount: 4 },
    // M-row
    { character: 'ま', romaji: 'ma', row: 'ma', column: 'a', strokeCount: 3 },
    { character: 'み', romaji: 'mi', row: 'ma', column: 'i', strokeCount: 2 },
    { character: 'む', romaji: 'mu', row: 'ma', column: 'u', strokeCount: 3 },
    { character: 'め', romaji: 'me', row: 'ma', column: 'e', strokeCount: 2 },
    { character: 'も', romaji: 'mo', row: 'ma', column: 'o', strokeCount: 3 },
    // Y-row
    { character: 'や', romaji: 'ya', row: 'ya', column: 'a', strokeCount: 3 },
    { character: 'ゆ', romaji: 'yu', row: 'ya', column: 'u', strokeCount: 2 },
    { character: 'よ', romaji: 'yo', row: 'ya', column: 'o', strokeCount: 2 },
    // R-row
    { character: 'ら', romaji: 'ra', row: 'ra', column: 'a', strokeCount: 2 },
    { character: 'り', romaji: 'ri', row: 'ra', column: 'i', strokeCount: 2 },
    { character: 'る', romaji: 'ru', row: 'ra', column: 'u', strokeCount: 1 },
    { character: 'れ', romaji: 're', row: 'ra', column: 'e', strokeCount: 2 },
    { character: 'ろ', romaji: 'ro', row: 'ra', column: 'o', strokeCount: 1 },
    // W-row
    { character: 'わ', romaji: 'wa', row: 'wa', column: 'a', strokeCount: 2 },
    { character: 'を', romaji: 'wo', row: 'wa', column: 'o', strokeCount: 3 },
    // N
    { character: 'ん', romaji: 'n', row: 'n', column: 'n', strokeCount: 1 },
    // Dakuten (゛) - Voiced consonants (tenten)
    { character: 'が', romaji: 'ga', row: 'ga', column: 'a', strokeCount: 4 },
    { character: 'ぎ', romaji: 'gi', row: 'ga', column: 'i', strokeCount: 5 },
    { character: 'ぐ', romaji: 'gu', row: 'ga', column: 'u', strokeCount: 2 },
    { character: 'げ', romaji: 'ge', row: 'ga', column: 'e', strokeCount: 4 },
    { character: 'ご', romaji: 'go', row: 'ga', column: 'o', strokeCount: 3 },
    { character: 'ざ', romaji: 'za', row: 'za', column: 'a', strokeCount: 4 },
    { character: 'じ', romaji: 'ji', row: 'za', column: 'i', strokeCount: 2 },
    { character: 'ず', romaji: 'zu', row: 'za', column: 'u', strokeCount: 3 },
    { character: 'ぜ', romaji: 'ze', row: 'za', column: 'e', strokeCount: 4 },
    { character: 'ぞ', romaji: 'zo', row: 'za', column: 'o', strokeCount: 2 },
    { character: 'だ', romaji: 'da', row: 'da', column: 'a', strokeCount: 5 },
    { character: 'ぢ', romaji: 'di', row: 'da', column: 'i', strokeCount: 3 },
    { character: 'づ', romaji: 'du', row: 'da', column: 'u', strokeCount: 2 },
    { character: 'で', romaji: 'de', row: 'da', column: 'e', strokeCount: 2 },
    { character: 'ど', romaji: 'do', row: 'da', column: 'o', strokeCount: 3 },
    { character: 'ば', romaji: 'ba', row: 'ba', column: 'a', strokeCount: 4 },
    { character: 'び', romaji: 'bi', row: 'ba', column: 'i', strokeCount: 2 },
    { character: 'ぶ', romaji: 'bu', row: 'ba', column: 'u', strokeCount: 5 },
    { character: 'べ', romaji: 'be', row: 'ba', column: 'e', strokeCount: 2 },
    { character: 'ぼ', romaji: 'bo', row: 'ba', column: 'o', strokeCount: 5 },
    // Handakuten (゜) - Semi-voiced consonants (maru)
    { character: 'ぱ', romaji: 'pa', row: 'pa', column: 'a', strokeCount: 4 },
    { character: 'ぴ', romaji: 'pi', row: 'pa', column: 'i', strokeCount: 2 },
    { character: 'ぷ', romaji: 'pu', row: 'pa', column: 'u', strokeCount: 5 },
    { character: 'ぺ', romaji: 'pe', row: 'pa', column: 'e', strokeCount: 2 },
    { character: 'ぽ', romaji: 'po', row: 'pa', column: 'o', strokeCount: 5 },
];

export const katakanaData = [
    // Vowels
    { character: 'ア', romaji: 'a', row: 'a', column: 'a', strokeCount: 2 },
    { character: 'イ', romaji: 'i', row: 'a', column: 'i', strokeCount: 2 },
    { character: 'ウ', romaji: 'u', row: 'a', column: 'u', strokeCount: 3 },
    { character: 'エ', romaji: 'e', row: 'a', column: 'e', strokeCount: 3 },
    { character: 'オ', romaji: 'o', row: 'a', column: 'o', strokeCount: 3 },
    // K-row
    { character: 'カ', romaji: 'ka', row: 'ka', column: 'a', strokeCount: 2 },
    { character: 'キ', romaji: 'ki', row: 'ka', column: 'i', strokeCount: 3 },
    { character: 'ク', romaji: 'ku', row: 'ka', column: 'u', strokeCount: 2 },
    { character: 'ケ', romaji: 'ke', row: 'ka', column: 'e', strokeCount: 3 },
    { character: 'コ', romaji: 'ko', row: 'ka', column: 'o', strokeCount: 2 },
    // S-row
    { character: 'サ', romaji: 'sa', row: 'sa', column: 'a', strokeCount: 3 },
    { character: 'シ', romaji: 'shi', row: 'sa', column: 'i', strokeCount: 3 },
    { character: 'ス', romaji: 'su', row: 'sa', column: 'u', strokeCount: 2 },
    { character: 'セ', romaji: 'se', row: 'sa', column: 'e', strokeCount: 2 },
    { character: 'ソ', romaji: 'so', row: 'sa', column: 'o', strokeCount: 2 },
    // T-row
    { character: 'タ', romaji: 'ta', row: 'ta', column: 'a', strokeCount: 3 },
    { character: 'チ', romaji: 'chi', row: 'ta', column: 'i', strokeCount: 3 },
    { character: 'ツ', romaji: 'tsu', row: 'ta', column: 'u', strokeCount: 3 },
    { character: 'テ', romaji: 'te', row: 'ta', column: 'e', strokeCount: 3 },
    { character: 'ト', romaji: 'to', row: 'ta', column: 'o', strokeCount: 2 },
    // N-row
    { character: 'ナ', romaji: 'na', row: 'na', column: 'a', strokeCount: 2 },
    { character: 'ニ', romaji: 'ni', row: 'na', column: 'i', strokeCount: 2 },
    { character: 'ヌ', romaji: 'nu', row: 'na', column: 'u', strokeCount: 2 },
    { character: 'ネ', romaji: 'ne', row: 'na', column: 'e', strokeCount: 4 },
    { character: 'ノ', romaji: 'no', row: 'na', column: 'o', strokeCount: 1 },
    // H-row
    { character: 'ハ', romaji: 'ha', row: 'ha', column: 'a', strokeCount: 2 },
    { character: 'ヒ', romaji: 'hi', row: 'ha', column: 'i', strokeCount: 2 },
    { character: 'フ', romaji: 'fu', row: 'ha', column: 'u', strokeCount: 1 },
    { character: 'ヘ', romaji: 'he', row: 'ha', column: 'e', strokeCount: 1 },
    { character: 'ホ', romaji: 'ho', row: 'ha', column: 'o', strokeCount: 4 },
    // M-row
    { character: 'マ', romaji: 'ma', row: 'ma', column: 'a', strokeCount: 2 },
    { character: 'ミ', romaji: 'mi', row: 'ma', column: 'i', strokeCount: 3 },
    { character: 'ム', romaji: 'mu', row: 'ma', column: 'u', strokeCount: 2 },
    { character: 'メ', romaji: 'me', row: 'ma', column: 'e', strokeCount: 2 },
    { character: 'モ', romaji: 'mo', row: 'ma', column: 'o', strokeCount: 3 },
    // Y-row
    { character: 'ヤ', romaji: 'ya', row: 'ya', column: 'a', strokeCount: 2 },
    { character: 'ユ', romaji: 'yu', row: 'ya', column: 'u', strokeCount: 2 },
    { character: 'ヨ', romaji: 'yo', row: 'ya', column: 'o', strokeCount: 3 },
    // R-row
    { character: 'ラ', romaji: 'ra', row: 'ra', column: 'a', strokeCount: 2 },
    { character: 'リ', romaji: 'ri', row: 'ra', column: 'i', strokeCount: 2 },
    { character: 'ル', romaji: 'ru', row: 'ra', column: 'u', strokeCount: 2 },
    { character: 'レ', romaji: 're', row: 'ra', column: 'e', strokeCount: 1 },
    { character: 'ロ', romaji: 'ro', row: 'ra', column: 'o', strokeCount: 3 },
    // W-row
    { character: 'ワ', romaji: 'wa', row: 'wa', column: 'a', strokeCount: 2 },
    { character: 'ヲ', romaji: 'wo', row: 'wa', column: 'o', strokeCount: 3 },
    // N
    { character: 'ン', romaji: 'n', row: 'n', column: 'n', strokeCount: 2 },
    // Dakuten (゛) - Voiced consonants (tenten)
    { character: 'ガ', romaji: 'ga', row: 'ga', column: 'a', strokeCount: 3 },
    { character: 'ギ', romaji: 'gi', row: 'ga', column: 'i', strokeCount: 4 },
    { character: 'グ', romaji: 'gu', row: 'ga', column: 'u', strokeCount: 3 },
    { character: 'ゲ', romaji: 'ge', row: 'ga', column: 'e', strokeCount: 4 },
    { character: 'ゴ', romaji: 'go', row: 'ga', column: 'o', strokeCount: 3 },
    { character: 'ザ', romaji: 'za', row: 'za', column: 'a', strokeCount: 4 },
    { character: 'ジ', romaji: 'ji', row: 'za', column: 'i', strokeCount: 4 },
    { character: 'ズ', romaji: 'zu', row: 'za', column: 'u', strokeCount: 3 },
    { character: 'ゼ', romaji: 'ze', row: 'za', column: 'e', strokeCount: 3 },
    { character: 'ゾ', romaji: 'zo', row: 'za', column: 'o', strokeCount: 3 },
    { character: 'ダ', romaji: 'da', row: 'da', column: 'a', strokeCount: 4 },
    { character: 'ヂ', romaji: 'di', row: 'da', column: 'i', strokeCount: 4 },
    { character: 'ヅ', romaji: 'du', row: 'da', column: 'u', strokeCount: 4 },
    { character: 'デ', romaji: 'de', row: 'da', column: 'e', strokeCount: 4 },
    { character: 'ド', romaji: 'do', row: 'da', column: 'o', strokeCount: 3 },
    { character: 'バ', romaji: 'ba', row: 'ba', column: 'a', strokeCount: 3 },
    { character: 'ビ', romaji: 'bi', row: 'ba', column: 'i', strokeCount: 3 },
    { character: 'ブ', romaji: 'bu', row: 'ba', column: 'u', strokeCount: 2 },
    { character: 'ベ', romaji: 'be', row: 'ba', column: 'e', strokeCount: 2 },
    { character: 'ボ', romaji: 'bo', row: 'ba', column: 'o', strokeCount: 5 },
    // Handakuten (゜) - Semi-voiced consonants (maru)
    { character: 'パ', romaji: 'pa', row: 'pa', column: 'a', strokeCount: 3 },
    { character: 'ピ', romaji: 'pi', row: 'pa', column: 'i', strokeCount: 3 },
    { character: 'プ', romaji: 'pu', row: 'pa', column: 'u', strokeCount: 2 },
    { character: 'ペ', romaji: 'pe', row: 'pa', column: 'e', strokeCount: 2 },
    { character: 'ポ', romaji: 'po', row: 'pa', column: 'o', strokeCount: 5 },
];
