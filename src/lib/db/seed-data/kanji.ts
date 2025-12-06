/**
 * N5 Kanji data - 103 essential kanji
 */

export const n5KanjiData = [
    // Numbers
    { character: '一', meanings: ['one'], onyomi: ['イチ', 'イツ'], kunyomi: ['ひと-'], strokeCount: 1, mnemonic: 'One horizontal line = 1' },
    { character: '二', meanings: ['two'], onyomi: ['ニ'], kunyomi: ['ふた-'], strokeCount: 2, mnemonic: 'Two horizontal lines = 2' },
    { character: '三', meanings: ['three'], onyomi: ['サン'], kunyomi: ['み-', 'みっ-'], strokeCount: 3, mnemonic: 'Three horizontal lines = 3' },
    { character: '四', meanings: ['four'], onyomi: ['シ'], kunyomi: ['よ-', 'よん'], strokeCount: 5, mnemonic: 'Four windows in a box' },
    { character: '五', meanings: ['five'], onyomi: ['ゴ'], kunyomi: ['いつ-'], strokeCount: 4, mnemonic: 'Five-way crossing' },
    { character: '六', meanings: ['six'], onyomi: ['ロク'], kunyomi: ['む-'], strokeCount: 4, mnemonic: 'Roof with two legs' },
    { character: '七', meanings: ['seven'], onyomi: ['シチ'], kunyomi: ['なな-'], strokeCount: 2, mnemonic: 'Lucky seven cross' },
    { character: '八', meanings: ['eight'], onyomi: ['ハチ'], kunyomi: ['や-'], strokeCount: 2, mnemonic: 'Two lines spreading like 8' },
    { character: '九', meanings: ['nine'], onyomi: ['キュウ', 'ク'], kunyomi: ['ここの-'], strokeCount: 2, mnemonic: 'Twisted nine' },
    { character: '十', meanings: ['ten'], onyomi: ['ジュウ'], kunyomi: ['とお'], strokeCount: 2, mnemonic: 'Cross = 10' },
    { character: '百', meanings: ['hundred'], onyomi: ['ヒャク'], kunyomi: [], strokeCount: 6, mnemonic: 'One on top of white' },
    { character: '千', meanings: ['thousand'], onyomi: ['セン'], kunyomi: ['ち'], strokeCount: 3, mnemonic: 'Person with a line' },
    { character: '万', meanings: ['ten thousand'], onyomi: ['マン', 'バン'], kunyomi: [], strokeCount: 3, mnemonic: 'Twisted thousand' },
    { character: '円', meanings: ['yen', 'circle'], onyomi: ['エン'], kunyomi: ['まる-'], strokeCount: 4, mnemonic: 'Circular money' },

    // Time
    { character: '年', meanings: ['year'], onyomi: ['ネン'], kunyomi: ['とし'], strokeCount: 6, mnemonic: 'Grain drying over time' },
    { character: '月', meanings: ['month', 'moon'], onyomi: ['ゲツ', 'ガツ'], kunyomi: ['つき'], strokeCount: 4, mnemonic: 'Moon in the sky' },
    { character: '日', meanings: ['day', 'sun'], onyomi: ['ニチ', 'ジツ'], kunyomi: ['ひ'], strokeCount: 4, mnemonic: 'Sun shining' },
    { character: '時', meanings: ['time', 'hour'], onyomi: ['ジ'], kunyomi: ['とき'], strokeCount: 10, mnemonic: 'Temple with sun = time' },
    { character: '分', meanings: ['minute', 'part'], onyomi: ['ブン', 'フン'], kunyomi: ['わ-ける'], strokeCount: 4, mnemonic: 'Divide with a sword' },
    { character: '半', meanings: ['half'], onyomi: ['ハン'], kunyomi: ['なか-ば'], strokeCount: 5, mnemonic: 'Cow cut in half' },
    { character: '今', meanings: ['now'], onyomi: ['コン', 'キン'], kunyomi: ['いま'], strokeCount: 4, mnemonic: 'Roof over a meeting' },
    { character: '週', meanings: ['week'], onyomi: ['シュウ'], kunyomi: [], strokeCount: 11, mnemonic: 'Path around the week' },
    { character: '毎', meanings: ['every'], onyomi: ['マイ'], kunyomi: ['ごと'], strokeCount: 6, mnemonic: 'Mother every day' },
    { character: '先', meanings: ['before', 'ahead'], onyomi: ['セン'], kunyomi: ['さき'], strokeCount: 6, mnemonic: 'Person walking ahead' },
    { character: '後', meanings: ['after', 'behind'], onyomi: ['ゴ', 'コウ'], kunyomi: ['あと', 'うし-ろ'], strokeCount: 9, mnemonic: 'Walking path behind' },
    { character: '午', meanings: ['noon'], onyomi: ['ゴ'], kunyomi: [], strokeCount: 4, mnemonic: 'Cow at noon' },
    { character: '前', meanings: ['before', 'front'], onyomi: ['ゼン'], kunyomi: ['まえ'], strokeCount: 9, mnemonic: 'Cutting meat in front' },
    { character: '間', meanings: ['between', 'interval'], onyomi: ['カン', 'ケン'], kunyomi: ['あいだ'], strokeCount: 12, mnemonic: 'Sun between doors' },

    // People
    { character: '人', meanings: ['person'], onyomi: ['ジン', 'ニン'], kunyomi: ['ひと'], strokeCount: 2, mnemonic: 'Two legs walking' },
    { character: '男', meanings: ['man', 'male'], onyomi: ['ダン', 'ナン'], kunyomi: ['おとこ'], strokeCount: 7, mnemonic: 'Strength in rice field' },
    { character: '女', meanings: ['woman', 'female'], onyomi: ['ジョ', 'ニョ'], kunyomi: ['おんな'], strokeCount: 3, mnemonic: 'Graceful woman' },
    { character: '子', meanings: ['child'], onyomi: ['シ', 'ス'], kunyomi: ['こ'], strokeCount: 3, mnemonic: 'Baby with arms' },
    { character: '父', meanings: ['father'], onyomi: ['フ'], kunyomi: ['ちち'], strokeCount: 4, mnemonic: 'Father with crossed arms' },
    { character: '母', meanings: ['mother'], onyomi: ['ボ'], kunyomi: ['はは'], strokeCount: 5, mnemonic: 'Mother nurturing' },
    { character: '友', meanings: ['friend'], onyomi: ['ユウ'], kunyomi: ['とも'], strokeCount: 4, mnemonic: 'Two hands joined' },
    { character: '学', meanings: ['study', 'learning'], onyomi: ['ガク'], kunyomi: ['まな-ぶ'], strokeCount: 8, mnemonic: 'Child under a roof learning' },
    { character: '生', meanings: ['life', 'birth'], onyomi: ['セイ', 'ショウ'], kunyomi: ['い-きる', 'う-まれる'], strokeCount: 5, mnemonic: 'Plant growing from earth' },
    { character: '夕', meanings: ['evening'], onyomi: ['セキ'], kunyomi: ['ゆう'], strokeCount: 3, mnemonic: 'Moon at evening time' },

    // Places
    { character: '国', meanings: ['country'], onyomi: ['コク'], kunyomi: ['くに'], strokeCount: 8, mnemonic: 'Enclosed jewel = nation' },
    { character: '外', meanings: ['outside'], onyomi: ['ガイ', 'ゲ'], kunyomi: ['そと', 'はず-す'], strokeCount: 5, mnemonic: 'Moon outside at night' },
    { character: '店', meanings: ['shop', 'store'], onyomi: ['テン'], kunyomi: ['みせ'], strokeCount: 8, mnemonic: 'Building with goods' },
    { character: '駅', meanings: ['station'], onyomi: ['エキ'], kunyomi: [], strokeCount: 14, mnemonic: 'Horse stopping point' },
    { character: '会', meanings: ['meet', 'society'], onyomi: ['カイ', 'エ'], kunyomi: ['あ-う'], strokeCount: 6, mnemonic: 'Roof covering a meeting' },
    { character: '社', meanings: ['company', 'shrine'], onyomi: ['シャ'], kunyomi: ['やしろ'], strokeCount: 7, mnemonic: 'Earth altar' },
    { character: '校', meanings: ['school'], onyomi: ['コウ'], kunyomi: [], strokeCount: 10, mnemonic: 'Wooden school building' },

    // Nature
    { character: '山', meanings: ['mountain'], onyomi: ['サン'], kunyomi: ['やま'], strokeCount: 3, mnemonic: 'Mountain peaks' },
    { character: '川', meanings: ['river'], onyomi: ['セン'], kunyomi: ['かわ'], strokeCount: 3, mnemonic: 'Water flowing down' },
    { character: '天', meanings: ['heaven', 'sky'], onyomi: ['テン'], kunyomi: ['あま', 'あめ'], strokeCount: 4, mnemonic: 'Person under sky' },
    { character: '気', meanings: ['spirit', 'energy'], onyomi: ['キ', 'ケ'], kunyomi: [], strokeCount: 6, mnemonic: 'Steam rising' },
    { character: '雨', meanings: ['rain'], onyomi: ['ウ'], kunyomi: ['あめ', 'あま-'], strokeCount: 8, mnemonic: 'Rain drops from clouds' },
    { character: '木', meanings: ['tree', 'wood'], onyomi: ['ボク', 'モク'], kunyomi: ['き'], strokeCount: 4, mnemonic: 'Tree with branches' },
    { character: '水', meanings: ['water'], onyomi: ['スイ'], kunyomi: ['みず'], strokeCount: 4, mnemonic: 'Water drops' },
    { character: '火', meanings: ['fire'], onyomi: ['カ'], kunyomi: ['ひ'], strokeCount: 4, mnemonic: 'Fire burning' },
    { character: '土', meanings: ['earth', 'soil'], onyomi: ['ド', 'ト'], kunyomi: ['つち'], strokeCount: 3, mnemonic: 'Cross on ground' },
    { character: '金', meanings: ['gold', 'money'], onyomi: ['キン', 'コン'], kunyomi: ['かね'], strokeCount: 8, mnemonic: 'Roof over gold' },
    { character: '花', meanings: ['flower'], onyomi: ['カ'], kunyomi: ['はな'], strokeCount: 7, mnemonic: 'Grass person transforms' },
    { character: '電', meanings: ['electricity'], onyomi: ['デン'], kunyomi: [], strokeCount: 13, mnemonic: 'Rain and lightning' },

    // Objects
    { character: '本', meanings: ['book', 'origin'], onyomi: ['ホン'], kunyomi: ['もと'], strokeCount: 5, mnemonic: 'Tree with roots' },
    { character: '車', meanings: ['car', 'vehicle'], onyomi: ['シャ'], kunyomi: ['くるま'], strokeCount: 7, mnemonic: 'Wheels on axle' },
    { character: '道', meanings: ['road', 'way'], onyomi: ['ドウ', 'トウ'], kunyomi: ['みち'], strokeCount: 12, mnemonic: 'Walking the path' },
    { character: '手', meanings: ['hand'], onyomi: ['シュ'], kunyomi: ['て'], strokeCount: 4, mnemonic: 'Hand with fingers' },
    { character: '足', meanings: ['foot', 'leg'], onyomi: ['ソク'], kunyomi: ['あし'], strokeCount: 7, mnemonic: 'Mouth and stop = foot' },
    { character: '目', meanings: ['eye'], onyomi: ['モク', 'ボク'], kunyomi: ['め'], strokeCount: 5, mnemonic: 'Eye looking' },
    { character: '耳', meanings: ['ear'], onyomi: ['ジ'], kunyomi: ['みみ'], strokeCount: 6, mnemonic: 'Ear shape' },
    { character: '口', meanings: ['mouth'], onyomi: ['コウ', 'ク'], kunyomi: ['くち'], strokeCount: 3, mnemonic: 'Open mouth' },
    { character: '食', meanings: ['eat', 'food'], onyomi: ['ショク'], kunyomi: ['た-べる'], strokeCount: 9, mnemonic: 'Roof over food' },
    { character: '飲', meanings: ['drink'], onyomi: ['イン'], kunyomi: ['の-む'], strokeCount: 12, mnemonic: 'Food and lack = drink' },

    // Actions
    { character: '行', meanings: ['go'], onyomi: ['コウ', 'ギョウ'], kunyomi: ['い-く', 'おこな-う'], strokeCount: 6, mnemonic: 'Person walking on road' },
    { character: '来', meanings: ['come'], onyomi: ['ライ'], kunyomi: ['く-る', 'きた-る'], strokeCount: 7, mnemonic: 'Rice plant arriving' },
    { character: '出', meanings: ['exit', 'leave'], onyomi: ['シュツ'], kunyomi: ['で-る', 'だ-す'], strokeCount: 5, mnemonic: 'Person going out' },
    { character: '入', meanings: ['enter'], onyomi: ['ニュウ'], kunyomi: ['い-る', 'はい-る'], strokeCount: 2, mnemonic: 'Person entering' },
    { character: '言', meanings: ['say', 'speak'], onyomi: ['ゲン', 'ゴン'], kunyomi: ['い-う', 'こと'], strokeCount: 7, mnemonic: 'Mouth speaking' },
    { character: '話', meanings: ['talk', 'story'], onyomi: ['ワ'], kunyomi: ['はな-す', 'はなし'], strokeCount: 13, mnemonic: 'Words and tongue' },
    { character: '聞', meanings: ['hear', 'ask'], onyomi: ['ブン', 'モン'], kunyomi: ['き-く'], strokeCount: 14, mnemonic: 'Ear at gate' },
    { character: '読', meanings: ['read'], onyomi: ['ドク', 'トク'], kunyomi: ['よ-む'], strokeCount: 14, mnemonic: 'Words to sell' },
    { character: '書', meanings: ['write'], onyomi: ['ショ'], kunyomi: ['か-く'], strokeCount: 10, mnemonic: 'Sun writing words' },
    { character: '見', meanings: ['see', 'look'], onyomi: ['ケン'], kunyomi: ['み-る', 'み-える'], strokeCount: 7, mnemonic: 'Eye with legs walking' },
    { character: '買', meanings: ['buy'], onyomi: ['バイ'], kunyomi: ['か-う'], strokeCount: 12, mnemonic: 'Net catching shell' },
    { character: '休', meanings: ['rest'], onyomi: ['キュウ'], kunyomi: ['やす-む'], strokeCount: 6, mnemonic: 'Person by tree' },
    { character: '立', meanings: ['stand'], onyomi: ['リツ'], kunyomi: ['た-つ'], strokeCount: 5, mnemonic: 'Person standing' },
    { character: '待', meanings: ['wait'], onyomi: ['タイ'], kunyomi: ['ま-つ'], strokeCount: 9, mnemonic: 'Temple path waiting' },

    // Directions/Positions  
    { character: '上', meanings: ['up', 'above'], onyomi: ['ジョウ', 'ショウ'], kunyomi: ['うえ', 'あ-がる'], strokeCount: 3, mnemonic: 'Something above' },
    { character: '下', meanings: ['down', 'below'], onyomi: ['カ', 'ゲ'], kunyomi: ['した', 'さ-がる'], strokeCount: 3, mnemonic: 'Something below' },
    { character: '中', meanings: ['middle', 'inside'], onyomi: ['チュウ'], kunyomi: ['なか'], strokeCount: 4, mnemonic: 'Arrow through center' },
    { character: '右', meanings: ['right'], onyomi: ['ウ', 'ユウ'], kunyomi: ['みぎ'], strokeCount: 5, mnemonic: 'Mouth and hand = right' },
    { character: '左', meanings: ['left'], onyomi: ['サ'], kunyomi: ['ひだり'], strokeCount: 5, mnemonic: 'Work and hand = left' },
    { character: '北', meanings: ['north'], onyomi: ['ホク'], kunyomi: ['きた'], strokeCount: 5, mnemonic: 'Two people back to back' },
    { character: '南', meanings: ['south'], onyomi: ['ナン', 'ナ'], kunyomi: ['みなみ'], strokeCount: 9, mnemonic: 'Warm south' },
    { character: '東', meanings: ['east'], onyomi: ['トウ'], kunyomi: ['ひがし'], strokeCount: 8, mnemonic: 'Sun rising through tree' },
    { character: '西', meanings: ['west'], onyomi: ['セイ', 'サイ'], kunyomi: ['にし'], strokeCount: 6, mnemonic: 'Bird going to roost' },

    // Adjectives
    { character: '大', meanings: ['big', 'large'], onyomi: ['ダイ', 'タイ'], kunyomi: ['おお-きい'], strokeCount: 3, mnemonic: 'Person with arms spread' },
    { character: '小', meanings: ['small', 'little'], onyomi: ['ショウ'], kunyomi: ['ちい-さい', 'こ'], strokeCount: 3, mnemonic: 'Small dots' },
    { character: '高', meanings: ['tall', 'expensive'], onyomi: ['コウ'], kunyomi: ['たか-い'], strokeCount: 10, mnemonic: 'Tower reaching high' },
    { character: '安', meanings: ['cheap', 'peaceful'], onyomi: ['アン'], kunyomi: ['やす-い'], strokeCount: 6, mnemonic: 'Woman at home = peace' },
    { character: '新', meanings: ['new'], onyomi: ['シン'], kunyomi: ['あたら-しい'], strokeCount: 13, mnemonic: 'Tree cut with axe = new' },
    { character: '古', meanings: ['old'], onyomi: ['コ'], kunyomi: ['ふる-い'], strokeCount: 5, mnemonic: 'Ten mouths = old stories' },
    { character: '長', meanings: ['long', 'leader'], onyomi: ['チョウ'], kunyomi: ['なが-い'], strokeCount: 8, mnemonic: 'Long hair flowing' },
    { character: '白', meanings: ['white'], onyomi: ['ハク', 'ビャク'], kunyomi: ['しろ-い'], strokeCount: 5, mnemonic: 'Sun ray = white' },
    { character: '多', meanings: ['many', 'much'], onyomi: ['タ'], kunyomi: ['おお-い'], strokeCount: 6, mnemonic: 'Two evenings = many' },
    { character: '少', meanings: ['few', 'little'], onyomi: ['ショウ'], kunyomi: ['すく-ない', 'すこ-し'], strokeCount: 4, mnemonic: 'Small amount' },

    // More essentials
    { character: '名', meanings: ['name'], onyomi: ['メイ', 'ミョウ'], kunyomi: ['な'], strokeCount: 6, mnemonic: 'Evening mouth = name' },
    { character: '何', meanings: ['what'], onyomi: ['カ'], kunyomi: ['なに', 'なん'], strokeCount: 7, mnemonic: 'Person asking what' },
    { character: '語', meanings: ['language', 'word'], onyomi: ['ゴ'], kunyomi: ['かた-る'], strokeCount: 14, mnemonic: 'Words and I = language' },
];
