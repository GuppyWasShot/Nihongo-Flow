/**
 * N4 Kanji Data - 167 essential N4 kanji for JLPT preparation
 * Referenced from JLPT Sensei and Genki II textbook materials
 * Building on N5's ~80 kanji with additional N4 kanji
 */

export const n4KanjiData = [
    // Common Kanji
    { character: '会', meanings: ['meet', 'society'], onyomi: ['カイ'], kunyomi: ['あ-う'], strokeCount: 6, mnemonic: 'People meeting under a roof' },
    { character: '同', meanings: ['same', 'agree'], onyomi: ['ドウ'], kunyomi: ['おな-じ'], strokeCount: 6, mnemonic: 'Same mouth speaks together' },
    { character: '事', meanings: ['matter', 'thing'], onyomi: ['ジ'], kunyomi: ['こと'], strokeCount: 8, mnemonic: 'Hand writing matters down' },
    { character: '自', meanings: ['oneself'], onyomi: ['ジ', 'シ'], kunyomi: ['みずか-ら'], strokeCount: 6, mnemonic: 'Eye looking at oneself' },
    { character: '社', meanings: ['company', 'shrine'], onyomi: ['シャ'], kunyomi: ['やしろ'], strokeCount: 7, mnemonic: 'Earth altar for worship' },
    { character: '発', meanings: ['departure', 'emit'], onyomi: ['ハツ', 'ホツ'], kunyomi: [], strokeCount: 9, mnemonic: 'Legs departing on journey' },
    { character: '者', meanings: ['someone', 'person'], onyomi: ['シャ'], kunyomi: ['もの'], strokeCount: 8, mnemonic: 'Person who does things' },
    { character: '地', meanings: ['ground', 'earth'], onyomi: ['チ', 'ジ'], kunyomi: [], strokeCount: 6, mnemonic: 'Earth with a snake on it' },
    { character: '業', meanings: ['business', 'industry'], onyomi: ['ギョウ'], kunyomi: ['わざ'], strokeCount: 13, mnemonic: 'Tree with elaborate work' },
    { character: '方', meanings: ['direction', 'person'], onyomi: ['ホウ'], kunyomi: ['かた'], strokeCount: 4, mnemonic: 'Person pointing direction' },

    // Actions & States
    { character: '新', meanings: ['new'], onyomi: ['シン'], kunyomi: ['あたら-しい', 'あら-た'], strokeCount: 13, mnemonic: 'Tree newly cut with axe' },
    { character: '場', meanings: ['place', 'location'], onyomi: ['ジョウ'], kunyomi: ['ば'], strokeCount: 12, mnemonic: 'Earth where sun shines' },
    { character: '員', meanings: ['member', 'employee'], onyomi: ['イン'], kunyomi: [], strokeCount: 10, mnemonic: 'Person in a circle' },
    { character: '立', meanings: ['stand'], onyomi: ['リツ'], kunyomi: ['た-つ'], strokeCount: 5, mnemonic: 'Person standing on ground' },
    { character: '開', meanings: ['open'], onyomi: ['カイ'], kunyomi: ['ひら-く', 'あ-ける'], strokeCount: 12, mnemonic: 'Gate doors being opened' },
    { character: '手', meanings: ['hand'], onyomi: ['シュ'], kunyomi: ['て'], strokeCount: 4, mnemonic: 'Five fingers of hand' },
    { character: '力', meanings: ['power', 'strength'], onyomi: ['リョク', 'リキ'], kunyomi: ['ちから'], strokeCount: 2, mnemonic: 'Arm showing muscle' },
    { character: '問', meanings: ['question'], onyomi: ['モン'], kunyomi: ['と-う'], strokeCount: 11, mnemonic: 'Mouth at gate asking' },
    { character: '代', meanings: ['substitute', 'era'], onyomi: ['ダイ'], kunyomi: ['か-わり'], strokeCount: 5, mnemonic: 'Person taking another place' },
    { character: '明', meanings: ['bright', 'light'], onyomi: ['メイ', 'ミョウ'], kunyomi: ['あか-るい'], strokeCount: 8, mnemonic: 'Sun and moon together' },

    // Movement & Change
    { character: '動', meanings: ['move'], onyomi: ['ドウ'], kunyomi: ['うご-く'], strokeCount: 11, mnemonic: 'Heavy weight being moved' },
    { character: '京', meanings: ['capital'], onyomi: ['キョウ', 'ケイ', 'キン'], kunyomi: ['みやこ'], strokeCount: 8, mnemonic: 'High building in capital' },
    { character: '目', meanings: ['eye'], onyomi: ['モク', 'ボク'], kunyomi: ['め'], strokeCount: 5, mnemonic: 'Eye shape with pupil' },
    { character: '通', meanings: ['traffic', 'pass'], onyomi: ['ツウ'], kunyomi: ['とお-る', 'かよ-う'], strokeCount: 10, mnemonic: 'Walking through passage' },
    { character: '言', meanings: ['say', 'word'], onyomi: ['ゲン', 'ゴン'], kunyomi: ['い-う', 'こと'], strokeCount: 7, mnemonic: 'Words coming from mouth' },
    { character: '理', meanings: ['logic', 'reason'], onyomi: ['リ'], kunyomi: [], strokeCount: 11, mnemonic: 'King rules with reason' },
    { character: '体', meanings: ['body'], onyomi: ['タイ'], kunyomi: ['からだ'], strokeCount: 7, mnemonic: 'Person with their body' },
    { character: '田', meanings: ['rice field'], onyomi: ['デン'], kunyomi: ['た'], strokeCount: 5, mnemonic: 'Rice paddy with paths' },
    { character: '主', meanings: ['master', 'main'], onyomi: ['シュ'], kunyomi: ['ぬし', 'おも'], strokeCount: 5, mnemonic: 'King with a flame' },
    { character: '題', meanings: ['topic', 'subject'], onyomi: ['ダイ'], kunyomi: [], strokeCount: 18, mnemonic: 'Page with a topic' },

    // Abstract Concepts
    { character: '意', meanings: ['idea', 'mind'], onyomi: ['イ'], kunyomi: [], strokeCount: 13, mnemonic: 'Heart with sound of thoughts' },
    { character: '不', meanings: ['negative', 'non-'], onyomi: ['フ', 'ブ'], kunyomi: [], strokeCount: 4, mnemonic: 'Bird cannot fly' },
    { character: '作', meanings: ['make', 'create'], onyomi: ['サク', 'サ'], kunyomi: ['つく-る'], strokeCount: 7, mnemonic: 'Person making something' },
    { character: '用', meanings: ['use', 'utilize'], onyomi: ['ヨウ'], kunyomi: ['もち-いる'], strokeCount: 5, mnemonic: 'Using a tool' },
    { character: '度', meanings: ['degree', 'time'], onyomi: ['ド', 'タク'], kunyomi: ['たび'], strokeCount: 9, mnemonic: 'Measuring with a hand' },
    { character: '強', meanings: ['strong'], onyomi: ['キョウ', 'ゴウ'], kunyomi: ['つよ-い'], strokeCount: 11, mnemonic: 'Bow and insect are strong' },
    { character: '公', meanings: ['public'], onyomi: ['コウ'], kunyomi: [], strokeCount: 4, mnemonic: 'Open for all people' },
    { character: '持', meanings: ['hold', 'have'], onyomi: ['ジ'], kunyomi: ['も-つ'], strokeCount: 9, mnemonic: 'Hand holding temple' },
    { character: '野', meanings: ['field', 'plains'], onyomi: ['ヤ'], kunyomi: ['の'], strokeCount: 11, mnemonic: 'Village in the fields' },
    { character: '以', meanings: ['by means of'], onyomi: ['イ'], kunyomi: ['もっ-て'], strokeCount: 5, mnemonic: 'Person using something' },

    // Mental Actions
    { character: '思', meanings: ['think'], onyomi: ['シ'], kunyomi: ['おも-う'], strokeCount: 9, mnemonic: 'Heart and field thinking' },
    { character: '家', meanings: ['house', 'family'], onyomi: ['カ'], kunyomi: ['いえ', 'や', 'うち'], strokeCount: 10, mnemonic: 'Roof with pig inside' },
    { character: '世', meanings: ['world', 'generation'], onyomi: ['セイ', 'セ'], kunyomi: ['よ'], strokeCount: 5, mnemonic: 'Thirty years is a generation' },
    { character: '多', meanings: ['many'], onyomi: ['タ'], kunyomi: ['おお-い'], strokeCount: 6, mnemonic: 'Many moons passing' },
    { character: '正', meanings: ['correct', 'right'], onyomi: ['セイ', 'ショウ'], kunyomi: ['ただ-しい'], strokeCount: 5, mnemonic: 'Stopping at one line' },
    { character: '安', meanings: ['cheap', 'peaceful'], onyomi: ['アン'], kunyomi: ['やす-い'], strokeCount: 6, mnemonic: 'Woman under roof is safe' },
    { character: '院', meanings: ['institution'], onyomi: ['イン'], kunyomi: [], strokeCount: 10, mnemonic: 'Building for completion' },
    { character: '心', meanings: ['heart', 'mind'], onyomi: ['シン'], kunyomi: ['こころ'], strokeCount: 4, mnemonic: 'Heart shape' },
    { character: '界', meanings: ['world', 'boundary'], onyomi: ['カイ'], kunyomi: [], strokeCount: 9, mnemonic: 'Field between boundaries' },
    { character: '教', meanings: ['teach'], onyomi: ['キョウ'], kunyomi: ['おし-える', 'おそ-わる'], strokeCount: 11, mnemonic: 'Old person teaching child' },

    // Written & Spoken
    { character: '文', meanings: ['writing', 'sentence'], onyomi: ['ブン', 'モン'], kunyomi: ['ふみ'], strokeCount: 4, mnemonic: 'Cross pattern of writing' },
    { character: '元', meanings: ['origin', 'beginning'], onyomi: ['ゲン', 'ガン'], kunyomi: ['もと'], strokeCount: 4, mnemonic: 'Person with two legs as origin' },
    { character: '重', meanings: ['heavy', 'important'], onyomi: ['ジュウ', 'チョウ'], kunyomi: ['おも-い', 'かさ-ねる'], strokeCount: 9, mnemonic: 'Heavy vehicle wheel' },
    { character: '近', meanings: ['near'], onyomi: ['キン'], kunyomi: ['ちか-い'], strokeCount: 7, mnemonic: 'Walking road nearby' },
    { character: '考', meanings: ['consider', 'think'], onyomi: ['コウ'], kunyomi: ['かんが-える'], strokeCount: 6, mnemonic: 'Old bent back thinking' },
    { character: '画', meanings: ['picture', 'drawing'], onyomi: ['ガ', 'カク'], kunyomi: ['かく-する'], strokeCount: 8, mnemonic: 'Brush painting picture' },
    { character: '海', meanings: ['sea', 'ocean'], onyomi: ['カイ'], kunyomi: ['うみ'], strokeCount: 9, mnemonic: 'Water with every drop' },
    { character: '売', meanings: ['sell'], onyomi: ['バイ'], kunyomi: ['う-る'], strokeCount: 7, mnemonic: 'Gentleman selling things' },
    { character: '知', meanings: ['know'], onyomi: ['チ'], kunyomi: ['し-る'], strokeCount: 8, mnemonic: 'Arrow hits mouth to know' },
    { character: '道', meanings: ['road', 'path'], onyomi: ['ドウ'], kunyomi: ['みち'], strokeCount: 12, mnemonic: 'Walking on the road' },

    // Physical Actions
    { character: '集', meanings: ['gather', 'collect'], onyomi: ['シュウ'], kunyomi: ['あつ-める'], strokeCount: 12, mnemonic: 'Birds gathering on tree' },
    { character: '別', meanings: ['separate', 'different'], onyomi: ['ベツ'], kunyomi: ['わか-れる', 'わ-ける'], strokeCount: 7, mnemonic: 'Knife separating things' },
    { character: '物', meanings: ['thing', 'object'], onyomi: ['ブツ', 'モツ'], kunyomi: ['もの'], strokeCount: 8, mnemonic: 'Cow as a thing' },
    { character: '使', meanings: ['use', 'messenger'], onyomi: ['シ'], kunyomi: ['つか-う'], strokeCount: 8, mnemonic: 'Person using tool' },
    { character: '品', meanings: ['goods', 'article'], onyomi: ['ヒン'], kunyomi: ['しな'], strokeCount: 9, mnemonic: 'Three mouths of products' },
    { character: '計', meanings: ['measure', 'plan'], onyomi: ['ケイ'], kunyomi: ['はか-る'], strokeCount: 9, mnemonic: 'Words used to count' },
    { character: '死', meanings: ['death'], onyomi: ['シ'], kunyomi: ['し-ぬ'], strokeCount: 6, mnemonic: 'Fallen person with spoon' },
    { character: '特', meanings: ['special'], onyomi: ['トク'], kunyomi: [], strokeCount: 10, mnemonic: 'Cow at temple is special' },
    { character: '私', meanings: ['I', 'private'], onyomi: ['シ'], kunyomi: ['わたくし', 'わたし'], strokeCount: 7, mnemonic: 'Grain gathered privately' },
    { character: '始', meanings: ['begin', 'start'], onyomi: ['シ'], kunyomi: ['はじ-める'], strokeCount: 8, mnemonic: 'Woman at platform starts' },

    // Time & Seasons
    { character: '朝', meanings: ['morning'], onyomi: ['チョウ'], kunyomi: ['あさ'], strokeCount: 12, mnemonic: 'Sun and moon in morning' },
    { character: '運', meanings: ['carry', 'luck'], onyomi: ['ウン'], kunyomi: ['はこ-ぶ'], strokeCount: 12, mnemonic: 'Walking carrying army' },
    { character: '終', meanings: ['end', 'finish'], onyomi: ['シュウ'], kunyomi: ['お-わる'], strokeCount: 11, mnemonic: 'Thread to winter end' },
    { character: '台', meanings: ['stand', 'pedestal'], onyomi: ['ダイ', 'タイ'], kunyomi: ['うてな'], strokeCount: 5, mnemonic: 'Mouth on platform' },
    { character: '広', meanings: ['wide'], onyomi: ['コウ'], kunyomi: ['ひろ-い'], strokeCount: 5, mnemonic: 'Building with wide roof' },
    { character: '住', meanings: ['dwell', 'reside'], onyomi: ['ジュウ', 'チュウ'], kunyomi: ['す-む'], strokeCount: 7, mnemonic: 'Person with master lives' },
    { character: '無', meanings: ['nothing', 'none'], onyomi: ['ム', 'ブ'], kunyomi: ['な-い'], strokeCount: 12, mnemonic: 'Fire burns to nothing' },
    { character: '真', meanings: ['true', 'reality'], onyomi: ['シン'], kunyomi: ['ま', 'まこと'], strokeCount: 10, mnemonic: 'Eye seeing true straight' },
    { character: '有', meanings: ['have', 'exist'], onyomi: ['ユウ', 'ウ'], kunyomi: ['あ-る'], strokeCount: 6, mnemonic: 'Hand having meat' },
    { character: '口', meanings: ['mouth'], onyomi: ['コウ'], kunyomi: ['くち'], strokeCount: 3, mnemonic: 'Open mouth shape' },

    // Places & Buildings
    { character: '少', meanings: ['few', 'little'], onyomi: ['ショウ'], kunyomi: ['すく-ない', 'すこ-し'], strokeCount: 4, mnemonic: 'Small amount' },
    { character: '町', meanings: ['town'], onyomi: ['チョウ'], kunyomi: ['まち'], strokeCount: 7, mnemonic: 'Field in town' },
    { character: '料', meanings: ['fee', 'materials'], onyomi: ['リョウ'], kunyomi: [], strokeCount: 10, mnemonic: 'Rice as payment' },
    { character: '工', meanings: ['craft', 'construction'], onyomi: ['コウ', 'ク', 'グ'], kunyomi: [], strokeCount: 3, mnemonic: 'Carpenter square tool' },
    { character: '建', meanings: ['build'], onyomi: ['ケン', 'コン'], kunyomi: ['た-てる'], strokeCount: 9, mnemonic: 'Brush building something' },
    { character: '空', meanings: ['sky', 'empty'], onyomi: ['クウ'], kunyomi: ['そら', 'から', 'あ-く'], strokeCount: 8, mnemonic: 'Hole in roof shows sky' },
    { character: '急', meanings: ['hurry'], onyomi: ['キュウ'], kunyomi: ['いそ-ぐ'], strokeCount: 9, mnemonic: 'Heart in urgent need' },
    { character: '止', meanings: ['stop'], onyomi: ['シ'], kunyomi: ['と-まる', 'や-める'], strokeCount: 4, mnemonic: 'Foot stops walking' },
    { character: '送', meanings: ['send'], onyomi: ['ソウ'], kunyomi: ['おく-る'], strokeCount: 9, mnemonic: 'Walking to send away' },
    { character: '切', meanings: ['cut'], onyomi: ['セツ', 'サイ'], kunyomi: ['き-る'], strokeCount: 4, mnemonic: 'Knife cutting seven' },

    // More Actions
    { character: '転', meanings: ['revolve', 'turn'], onyomi: ['テン'], kunyomi: ['ころ-がる'], strokeCount: 11, mnemonic: 'Vehicle wheel turning' },
    { character: '研', meanings: ['polish', 'study'], onyomi: ['ケン'], kunyomi: ['と-ぐ'], strokeCount: 9, mnemonic: 'Stone being polished' },
    { character: '足', meanings: ['leg', 'sufficient'], onyomi: ['ソク'], kunyomi: ['あし', 'た-りる'], strokeCount: 7, mnemonic: 'Mouth and stop is foot' },
    { character: '究', meanings: ['research'], onyomi: ['キュウ'], kunyomi: [], strokeCount: 7, mnemonic: 'Hole pursued deeply' },
    { character: '楽', meanings: ['music', 'comfort'], onyomi: ['ガク', 'ラク'], kunyomi: ['たの-しい'], strokeCount: 13, mnemonic: 'White music on tree' },
    { character: '起', meanings: ['get up', 'wake'], onyomi: ['キ'], kunyomi: ['お-きる', 'おこ-す'], strokeCount: 10, mnemonic: 'Self running to rise' },
    { character: '着', meanings: ['arrive', 'wear'], onyomi: ['チャク'], kunyomi: ['き-る', 'つ-く'], strokeCount: 12, mnemonic: 'Sheep eye wearing clothes' },
    { character: '店', meanings: ['store', 'shop'], onyomi: ['テン'], kunyomi: ['みせ'], strokeCount: 8, mnemonic: 'Building with spot goods' },
    { character: '病', meanings: ['sick', 'illness'], onyomi: ['ビョウ'], kunyomi: ['や-む'], strokeCount: 10, mnemonic: 'Illness in third person' },
    { character: '質', meanings: ['quality'], onyomi: ['シツ', 'シチ'], kunyomi: ['たち'], strokeCount: 15, mnemonic: 'Axe shell measuring quality' },

    // More Verbs
    { character: '待', meanings: ['wait'], onyomi: ['タイ'], kunyomi: ['ま-つ'], strokeCount: 9, mnemonic: 'Walking temple waiting' },
    { character: '試', meanings: ['test', 'try'], onyomi: ['シ'], kunyomi: ['こころ-みる', 'ため-す'], strokeCount: 13, mnemonic: 'Words to test and try' },
    { character: '族', meanings: ['tribe', 'family'], onyomi: ['ゾク'], kunyomi: [], strokeCount: 11, mnemonic: 'Flag of family clan' },
    { character: '銀', meanings: ['silver'], onyomi: ['ギン'], kunyomi: [], strokeCount: 14, mnemonic: 'Metal that is good silver' },
    { character: '早', meanings: ['early', 'fast'], onyomi: ['ソウ', 'サッ'], kunyomi: ['はや-い'], strokeCount: 6, mnemonic: 'Sun rising early' },
    { character: '映', meanings: ['reflect', 'project'], onyomi: ['エイ'], kunyomi: ['うつ-る', 'は-える'], strokeCount: 9, mnemonic: 'Sun center reflecting' },
    { character: '親', meanings: ['parent'], onyomi: ['シン'], kunyomi: ['おや', 'した-しい'], strokeCount: 16, mnemonic: 'Standing tree seeing parent' },
    { character: '験', meanings: ['test', 'verification'], onyomi: ['ケン'], kunyomi: [], strokeCount: 18, mnemonic: 'Horse tested' },
    { character: '英', meanings: ['English', 'excellent'], onyomi: ['エイ'], kunyomi: [], strokeCount: 8, mnemonic: 'Grass center excellent' },
    { character: '医', meanings: ['doctor', 'medicine'], onyomi: ['イ'], kunyomi: [], strokeCount: 7, mnemonic: 'Arrow in box for medicine' },

    // Work & Service
    { character: '仕', meanings: ['attend', 'serve'], onyomi: ['シ'], kunyomi: [], strokeCount: 5, mnemonic: 'Person with samurai serves' },
    { character: '去', meanings: ['gone', 'leave'], onyomi: ['キョ', 'コ'], kunyomi: ['さ-る'], strokeCount: 5, mnemonic: 'Earth left behind' },
    { character: '味', meanings: ['taste'], onyomi: ['ミ'], kunyomi: ['あじ'], strokeCount: 8, mnemonic: 'Mouth and not yet taste' },
    { character: '写', meanings: ['copy'], onyomi: ['シャ'], kunyomi: ['うつ-る'], strokeCount: 5, mnemonic: 'Cover and pour copy' },
    { character: '字', meanings: ['character', 'letter'], onyomi: ['ジ'], kunyomi: [], strokeCount: 6, mnemonic: 'Child under roof learns characters' },
    { character: '答', meanings: ['answer'], onyomi: ['トウ'], kunyomi: ['こた-える'], strokeCount: 12, mnemonic: 'Bamboo with fit answer' },
    { character: '夜', meanings: ['night'], onyomi: ['ヤ'], kunyomi: ['よ', 'よる'], strokeCount: 8, mnemonic: 'Person under roof at night' },
    { character: '音', meanings: ['sound'], onyomi: ['オン'], kunyomi: ['おと', 'ね'], strokeCount: 9, mnemonic: 'Sun stands for sound' },
    { character: '注', meanings: ['pour', 'concentrate'], onyomi: ['チュウ'], kunyomi: ['そそ-ぐ'], strokeCount: 8, mnemonic: 'Water master pouring' },
    { character: '帰', meanings: ['return home'], onyomi: ['キ'], kunyomi: ['かえ-る', 'かえ-す'], strokeCount: 10, mnemonic: 'Broom returns to stop' },

    // More Nouns
    { character: '古', meanings: ['old'], onyomi: ['コ'], kunyomi: ['ふる-い'], strokeCount: 5, mnemonic: 'Ten mouths old' },
    { character: '歌', meanings: ['song'], onyomi: ['カ'], kunyomi: ['うた', 'うた-う'], strokeCount: 14, mnemonic: 'Can lacking song' },
    { character: '買', meanings: ['buy'], onyomi: ['バイ'], kunyomi: ['か-う'], strokeCount: 12, mnemonic: 'Net shell to buy' },
    { character: '悪', meanings: ['bad', 'evil'], onyomi: ['アク'], kunyomi: ['わる-い'], strokeCount: 11, mnemonic: 'Sub heart is evil' },
    { character: '図', meanings: ['map', 'diagram'], onyomi: ['ズ', 'ト'], kunyomi: ['はか-る'], strokeCount: 7, mnemonic: 'Enclosure with winter map' },
    { character: '週', meanings: ['week'], onyomi: ['シュウ'], kunyomi: [], strokeCount: 11, mnemonic: 'Around each week' },
    { character: '室', meanings: ['room'], onyomi: ['シツ'], kunyomi: ['むろ'], strokeCount: 9, mnemonic: 'Roof reaching to room' },
    { character: '歩', meanings: ['walk', 'step'], onyomi: ['ホ', 'ブ'], kunyomi: ['ある-く', 'あゆ-む'], strokeCount: 8, mnemonic: 'Few stops walking' },
    { character: '風', meanings: ['wind', 'style'], onyomi: ['フウ', 'フ'], kunyomi: ['かぜ'], strokeCount: 9, mnemonic: 'Enclosure with bug wind' },
    { character: '紙', meanings: ['paper'], onyomi: ['シ'], kunyomi: ['かみ'], strokeCount: 10, mnemonic: 'Thread with clan paper' },

    // Colors & Seasons
    { character: '黒', meanings: ['black'], onyomi: ['コク'], kunyomi: ['くろ'], strokeCount: 11, mnemonic: 'Village with fire black' },
    { character: '花', meanings: ['flower'], onyomi: ['カ', 'ケ'], kunyomi: ['はな'], strokeCount: 7, mnemonic: 'Grass person transform flower' },
    { character: '春', meanings: ['spring'], onyomi: ['シュン'], kunyomi: ['はる'], strokeCount: 9, mnemonic: 'Three person sun spring' },
    { character: '赤', meanings: ['red'], onyomi: ['セキ', 'シャク'], kunyomi: ['あか-い'], strokeCount: 7, mnemonic: 'Earth fire red' },
    { character: '青', meanings: ['blue', 'green'], onyomi: ['セイ', 'ショウ'], kunyomi: ['あお-い'], strokeCount: 8, mnemonic: 'Life moon blue' },
    { character: '館', meanings: ['building', 'hall'], onyomi: ['カン'], kunyomi: ['やかた'], strokeCount: 16, mnemonic: 'Food building hall' },
    { character: '屋', meanings: ['roof', 'house'], onyomi: ['オク'], kunyomi: ['や'], strokeCount: 9, mnemonic: 'Corpse reaching house' },
    { character: '色', meanings: ['color'], onyomi: ['ショク', 'シキ'], kunyomi: ['いろ'], strokeCount: 6, mnemonic: 'Bent person color' },
    { character: '走', meanings: ['run'], onyomi: ['ソウ'], kunyomi: ['はし-る'], strokeCount: 7, mnemonic: 'Earth running' },
    { character: '秋', meanings: ['autumn'], onyomi: ['シュウ'], kunyomi: ['あき'], strokeCount: 9, mnemonic: 'Grain fire autumn' },

    // More Seasons & Activities
    { character: '夏', meanings: ['summer'], onyomi: ['カ', 'ゲ'], kunyomi: ['なつ'], strokeCount: 10, mnemonic: 'Head self walk summer' },
    { character: '習', meanings: ['learn'], onyomi: ['シュウ'], kunyomi: ['なら-う'], strokeCount: 11, mnemonic: 'Feather white learning' },
    { character: '駅', meanings: ['station'], onyomi: ['エキ'], kunyomi: [], strokeCount: 14, mnemonic: 'Horse release station' },
    { character: '洋', meanings: ['ocean', 'Western'], onyomi: ['ヨウ'], kunyomi: [], strokeCount: 9, mnemonic: 'Water sheep ocean' },
    { character: '旅', meanings: ['travel'], onyomi: ['リョ'], kunyomi: ['たび'], strokeCount: 10, mnemonic: 'Side clothes travel' },
    { character: '服', meanings: ['clothes'], onyomi: ['フク'], kunyomi: [], strokeCount: 8, mnemonic: 'Moon clothes' },
    { character: '借', meanings: ['borrow'], onyomi: ['シャク'], kunyomi: ['か-りる'], strokeCount: 10, mnemonic: 'Person once borrow' },
    { character: '曜', meanings: ['weekday'], onyomi: ['ヨウ'], kunyomi: [], strokeCount: 18, mnemonic: 'Sun feather bird weekday' },
    { character: '飲', meanings: ['drink'], onyomi: ['イン'], kunyomi: ['の-む'], strokeCount: 12, mnemonic: 'Food lack drinking' },
    { character: '肉', meanings: ['meat'], onyomi: ['ニク'], kunyomi: [], strokeCount: 6, mnemonic: 'Meat inside' },

    // Financial & More
    { character: '貸', meanings: ['lend'], onyomi: ['タイ'], kunyomi: ['か-す'], strokeCount: 12, mnemonic: 'Substitute shell lend' },
    { character: '堂', meanings: ['hall'], onyomi: ['ドウ'], kunyomi: [], strokeCount: 11, mnemonic: 'Soil still hall' },
    { character: '鳥', meanings: ['bird'], onyomi: ['チョウ'], kunyomi: ['とり'], strokeCount: 11, mnemonic: 'Bird shape' },
    { character: '飯', meanings: ['meal', 'rice'], onyomi: ['ハン'], kunyomi: ['めし'], strokeCount: 12, mnemonic: 'Food opposite meal' },
    { character: '勉', meanings: ['effort'], onyomi: ['ベン'], kunyomi: ['つと-める'], strokeCount: 10, mnemonic: 'Avoid strength effort' },
    { character: '冬', meanings: ['winter'], onyomi: ['トウ'], kunyomi: ['ふゆ'], strokeCount: 5, mnemonic: 'Walking ice winter' },
    { character: '昼', meanings: ['daytime', 'noon'], onyomi: ['チュウ'], kunyomi: ['ひる'], strokeCount: 9, mnemonic: 'Measurement sun noon' },
    { character: '茶', meanings: ['tea'], onyomi: ['チャ', 'サ'], kunyomi: [], strokeCount: 9, mnemonic: 'Grass person tree tea' },
    { character: '弟', meanings: ['younger brother'], onyomi: ['テイ', 'ダイ', 'デ'], kunyomi: ['おとうと'], strokeCount: 7, mnemonic: 'Bow tie younger brother' },
    { character: '牛', meanings: ['cow'], onyomi: ['ギュウ'], kunyomi: ['うし'], strokeCount: 4, mnemonic: 'Cow horns shape' },

    // Family & Animals
    { character: '魚', meanings: ['fish'], onyomi: ['ギョ'], kunyomi: ['うお', 'さかな'], strokeCount: 11, mnemonic: 'Fish with field fire' },
    { character: '兄', meanings: ['elder brother'], onyomi: ['キョウ', 'ケイ'], kunyomi: ['あに'], strokeCount: 5, mnemonic: 'Mouth legs elder brother' },
    { character: '犬', meanings: ['dog'], onyomi: ['ケン'], kunyomi: ['いぬ'], strokeCount: 4, mnemonic: 'Big with dot dog' },
    { character: '妹', meanings: ['younger sister'], onyomi: ['マイ'], kunyomi: ['いもうと'], strokeCount: 8, mnemonic: 'Woman not yet younger sister' },
    { character: '姉', meanings: ['elder sister'], onyomi: ['シ'], kunyomi: ['あね'], strokeCount: 8, mnemonic: 'Woman city elder sister' },
    { character: '漢', meanings: ['China', 'Han'], onyomi: ['カン'], kunyomi: [], strokeCount: 13, mnemonic: 'Water grass mouth big China' },
];
