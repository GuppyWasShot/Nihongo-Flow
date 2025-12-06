/**
 * N5 Grammar patterns data
 */

export const n5GrammarData = [
    // Basic Particles
    {
        pattern: 'は (wa)',
        meaning: 'Topic marker - indicates what the sentence is about',
        formation: 'Noun + は',
        explanation: 'The particle は marks the topic of the sentence. It tells the listener what you are talking about.',
        examples: [
            { japanese: '私は学生です。', reading: 'わたしはがくせいです。', english: 'I am a student.' },
            { japanese: '田中さんは先生です。', reading: 'たなかさんはせんせいです。', english: 'Mr. Tanaka is a teacher.' },
        ],
    },
    {
        pattern: 'が (ga)',
        meaning: 'Subject marker - emphasizes the subject or introduces new information',
        formation: 'Noun + が',
        explanation: 'The particle が marks the grammatical subject, especially for new information or when emphasizing who/what.',
        examples: [
            { japanese: '誰が来ましたか？', reading: 'だれがきましたか？', english: 'Who came?' },
            { japanese: '猫がいます。', reading: 'ねこがいます。', english: 'There is a cat.' },
        ],
    },
    {
        pattern: 'を (wo/o)',
        meaning: 'Direct object marker - marks the object of an action',
        formation: 'Noun + を + Verb',
        explanation: 'The particle を marks the direct object of a transitive verb - what the action is done to.',
        examples: [
            { japanese: 'パンを食べます。', reading: 'パンをたべます。', english: 'I eat bread.' },
            { japanese: '本を読みます。', reading: 'ほんをよみます。', english: 'I read a book.' },
        ],
    },
    {
        pattern: 'に (ni)',
        meaning: 'Direction/time/location marker',
        formation: 'Noun + に',
        explanation: 'The particle に indicates direction of movement, specific time, or location of existence.',
        examples: [
            { japanese: '学校に行きます。', reading: 'がっこうにいきます。', english: 'I go to school.' },
            { japanese: '七時に起きます。', reading: 'しちじにおきます。', english: 'I wake up at 7 o\'clock.' },
        ],
    },
    {
        pattern: 'で (de)',
        meaning: 'Location of action / means / method',
        formation: 'Noun + で',
        explanation: 'The particle で indicates where an action takes place, or the means/method by which something is done.',
        examples: [
            { japanese: '図書館で勉強します。', reading: 'としょかんでべんきょうします。', english: 'I study at the library.' },
            { japanese: 'バスで行きます。', reading: 'バスでいきます。', english: 'I go by bus.' },
        ],
    },
    {
        pattern: 'と (to)',
        meaning: 'And / with (companion)',
        formation: 'Noun + と + Noun / Noun + と',
        explanation: 'The particle と connects nouns (and) or indicates accompaniment (with someone).',
        examples: [
            { japanese: 'コーヒーとケーキ', reading: 'コーヒーとケーキ', english: 'Coffee and cake' },
            { japanese: '友だちと映画を見ます。', reading: 'ともだちとえいがをみます。', english: 'I watch a movie with a friend.' },
        ],
    },
    {
        pattern: 'も (mo)',
        meaning: 'Also / too / even',
        formation: 'Noun + も',
        explanation: 'The particle も means "also" or "too", replacing は or が.',
        examples: [
            { japanese: '私も学生です。', reading: 'わたしもがくせいです。', english: 'I am also a student.' },
            { japanese: '田中さんも来ます。', reading: 'たなかさんもきます。', english: 'Mr. Tanaka is also coming.' },
        ],
    },
    {
        pattern: 'から (kara)',
        meaning: 'From (time/place) / because',
        formation: 'Noun + から',
        explanation: 'The particle から indicates the starting point (from) or reason (because).',
        examples: [
            { japanese: '九時から働きます。', reading: 'くじからはたらきます。', english: 'I work from 9 o\'clock.' },
            { japanese: '暑いから、窓を開けます。', reading: 'あついから、まどをあけます。', english: 'Because it\'s hot, I open the window.' },
        ],
    },
    {
        pattern: 'まで (made)',
        meaning: 'Until / as far as',
        formation: 'Noun + まで',
        explanation: 'The particle まで indicates the end point of time or distance.',
        examples: [
            { japanese: '五時まで働きます。', reading: 'ごじまではたらきます。', english: 'I work until 5 o\'clock.' },
            { japanese: '東京まで行きます。', reading: 'とうきょうまでいきます。', english: 'I will go as far as Tokyo.' },
        ],
    },
    {
        pattern: 'の (no)',
        meaning: 'Possessive / descriptive particle',
        formation: 'Noun + の + Noun',
        explanation: 'The particle の shows possession or connects two nouns to describe something.',
        examples: [
            { japanese: '私の本', reading: 'わたしのほん', english: 'My book' },
            { japanese: '日本の食べ物', reading: 'にほんのたべもの', english: 'Japanese food' },
        ],
    },

    // Copula and Basic Conjugation
    {
        pattern: 'です (desu)',
        meaning: 'Polite copula - "to be"',
        formation: 'Noun/Adjective + です',
        explanation: 'です is the polite form of the copula, used to end sentences politely.',
        examples: [
            { japanese: '学生です。', reading: 'がくせいです。', english: 'I am a student.' },
            { japanese: '高いです。', reading: 'たかいです。', english: 'It is expensive.' },
        ],
    },
    {
        pattern: 'じゃありません / ではありません',
        meaning: 'Negative copula - "is not"',
        formation: 'Noun + じゃありません',
        explanation: 'The negative form of です, used to say something is not.',
        examples: [
            { japanese: '学生じゃありません。', reading: 'がくせいじゃありません。', english: 'I am not a student.' },
            { japanese: 'これは本じゃありません。', reading: 'これはほんじゃありません。', english: 'This is not a book.' },
        ],
    },
    {
        pattern: 'でした',
        meaning: 'Past copula - "was"',
        formation: 'Noun + でした',
        explanation: 'The past tense form of です.',
        examples: [
            { japanese: '学生でした。', reading: 'がくせいでした。', english: 'I was a student.' },
            { japanese: '天気がよかったです。', reading: 'てんきがよかったです。', english: 'The weather was good.' },
        ],
    },

    // Verb Forms
    {
        pattern: 'ます form',
        meaning: 'Polite present/future verb form',
        formation: 'Verb stem + ます',
        explanation: 'The polite non-past form of verbs, used for present and future actions.',
        examples: [
            { japanese: '食べます。', reading: 'たべます。', english: 'I eat / I will eat.' },
            { japanese: '行きます。', reading: 'いきます。', english: 'I go / I will go.' },
        ],
    },
    {
        pattern: 'ません',
        meaning: 'Polite negative verb form',
        formation: 'Verb stem + ません',
        explanation: 'The polite negative form of verbs.',
        examples: [
            { japanese: '食べません。', reading: 'たべません。', english: 'I do not eat.' },
            { japanese: '行きません。', reading: 'いきません。', english: 'I do not go.' },
        ],
    },
    {
        pattern: 'ました',
        meaning: 'Polite past verb form',
        formation: 'Verb stem + ました',
        explanation: 'The polite past tense form of verbs.',
        examples: [
            { japanese: '食べました。', reading: 'たべました。', english: 'I ate.' },
            { japanese: '行きました。', reading: 'いきました。', english: 'I went.' },
        ],
    },
    {
        pattern: 'ませんでした',
        meaning: 'Polite negative past verb form',
        formation: 'Verb stem + ませんでした',
        explanation: 'The polite negative past tense form of verbs.',
        examples: [
            { japanese: '食べませんでした。', reading: 'たべませんでした。', english: 'I did not eat.' },
            { japanese: '行きませんでした。', reading: 'いきませんでした。', english: 'I did not go.' },
        ],
    },
    {
        pattern: 'て form (てform)',
        meaning: 'Connective form - and, then, please',
        formation: 'Verb て-form (varies by verb type)',
        explanation: 'The て-form connects actions, forms requests, and is used with many grammar patterns.',
        examples: [
            { japanese: '食べて、寝ます。', reading: 'たべて、ねます。', english: 'I eat and then sleep.' },
            { japanese: '待ってください。', reading: 'まってください。', english: 'Please wait.' },
        ],
    },
    {
        pattern: 'ている / ています',
        meaning: 'Progressive / result state',
        formation: 'Verb て-form + いる/います',
        explanation: 'Indicates an ongoing action or a resulting state.',
        examples: [
            { japanese: '食べています。', reading: 'たべています。', english: 'I am eating.' },
            { japanese: '結婚しています。', reading: 'けっこんしています。', english: 'I am married.' },
        ],
    },
    {
        pattern: 'たい',
        meaning: 'Want to do',
        formation: 'Verb stem + たい',
        explanation: 'Expresses the speaker\'s desire to do something.',
        examples: [
            { japanese: '日本に行きたい。', reading: 'にほんにいきたい。', english: 'I want to go to Japan.' },
            { japanese: '寿司が食べたいです。', reading: 'すしがたべたいです。', english: 'I want to eat sushi.' },
        ],
    },

    // Questions
    {
        pattern: 'か (ka)',
        meaning: 'Question marker',
        formation: 'Sentence + か',
        explanation: 'The particle か turns a statement into a question.',
        examples: [
            { japanese: '学生ですか？', reading: 'がくせいですか？', english: 'Are you a student?' },
            { japanese: '何を食べますか？', reading: 'なにをたべますか？', english: 'What will you eat?' },
        ],
    },
    {
        pattern: '何 (nani/nan)',
        meaning: 'What',
        formation: 'Question word',
        explanation: 'Used to ask "what". Pronunciation varies based on following sound.',
        examples: [
            { japanese: 'これは何ですか？', reading: 'これはなんですか？', english: 'What is this?' },
            { japanese: '何時ですか？', reading: 'なんじですか？', english: 'What time is it?' },
        ],
    },
    {
        pattern: 'どこ (doko)',
        meaning: 'Where',
        formation: 'Question word',
        explanation: 'Used to ask "where".',
        examples: [
            { japanese: 'トイレはどこですか？', reading: 'トイレはどこですか？', english: 'Where is the toilet?' },
            { japanese: 'どこに行きますか？', reading: 'どこにいきますか？', english: 'Where are you going?' },
        ],
    },
    {
        pattern: 'いつ (itsu)',
        meaning: 'When',
        formation: 'Question word',
        explanation: 'Used to ask "when".',
        examples: [
            { japanese: 'いつ来ますか？', reading: 'いつきますか？', english: 'When will you come?' },
            { japanese: '誕生日はいつですか？', reading: 'たんじょうびはいつですか？', english: 'When is your birthday?' },
        ],
    },
    {
        pattern: 'だれ / どなた (dare / donata)',
        meaning: 'Who (informal / polite)',
        formation: 'Question word',
        explanation: 'Used to ask "who". どなた is more polite.',
        examples: [
            { japanese: 'あの人はだれですか？', reading: 'あのひとはだれですか？', english: 'Who is that person?' },
            { japanese: 'どなたですか？', reading: 'どなたですか？', english: 'Who is it? (polite)' },
        ],
    },

    // Demonstratives
    {
        pattern: 'これ / それ / あれ',
        meaning: 'This / that (near you) / that (over there)',
        formation: 'Demonstrative pronoun',
        explanation: 'Demonstrative pronouns for things at different distances.',
        examples: [
            { japanese: 'これは本です。', reading: 'これはほんです。', english: 'This is a book.' },
            { japanese: 'それは何ですか？', reading: 'それはなんですか？', english: 'What is that?' },
            { japanese: 'あれは山です。', reading: 'あれはやまです。', english: 'That (over there) is a mountain.' },
        ],
    },
    {
        pattern: 'この / その / あの',
        meaning: 'This X / that X / that X (over there)',
        formation: 'Demonstrative + Noun',
        explanation: 'Demonstrative adjectives that modify nouns.',
        examples: [
            { japanese: 'この本', reading: 'このほん', english: 'This book' },
            { japanese: 'その人', reading: 'そのひと', english: 'That person' },
            { japanese: 'あの車', reading: 'あのくるま', english: 'That car (over there)' },
        ],
    },
    {
        pattern: 'ここ / そこ / あそこ',
        meaning: 'Here / there / over there',
        formation: 'Demonstrative place word',
        explanation: 'Demonstrative words for locations.',
        examples: [
            { japanese: 'ここに座ってください。', reading: 'ここにすわってください。', english: 'Please sit here.' },
            { japanese: 'そこに本があります。', reading: 'そこにほんがあります。', english: 'There is a book there.' },
        ],
    },

    // Existence
    {
        pattern: 'あります',
        meaning: 'To exist (inanimate objects)',
        formation: 'Noun + が + あります',
        explanation: 'Used to express the existence of inanimate objects.',
        examples: [
            { japanese: '本があります。', reading: 'ほんがあります。', english: 'There is a book.' },
            { japanese: 'お金がありません。', reading: 'おかねがありません。', english: 'There is no money.' },
        ],
    },
    {
        pattern: 'います',
        meaning: 'To exist (animate beings)',
        formation: 'Noun + が + います',
        explanation: 'Used to express the existence of people and animals.',
        examples: [
            { japanese: '猫がいます。', reading: 'ねこがいます。', english: 'There is a cat.' },
            { japanese: '誰もいません。', reading: 'だれもいません。', english: 'There is nobody.' },
        ],
    },

    // Adjectives
    {
        pattern: 'い-adjectives',
        meaning: 'Adjectives ending in い',
        formation: 'い-adjective + Noun',
        explanation: 'Adjectives that end in い and conjugate directly.',
        examples: [
            { japanese: '高い山', reading: 'たかいやま', english: 'Tall mountain' },
            { japanese: '寒くないです。', reading: 'さむくないです。', english: 'It is not cold.' },
        ],
    },
    {
        pattern: 'な-adjectives',
        meaning: 'Adjectives requiring な before nouns',
        formation: 'な-adjective + な + Noun',
        explanation: 'Adjectives that require な when modifying nouns.',
        examples: [
            { japanese: '静かな部屋', reading: 'しずかなへや', english: 'Quiet room' },
            { japanese: '元気です。', reading: 'げんきです。', english: 'I am well/healthy.' },
        ],
    },

    // Requests and Permission
    {
        pattern: 'てください',
        meaning: 'Please do',
        formation: 'Verb て-form + ください',
        explanation: 'Used to make polite requests.',
        examples: [
            { japanese: '見てください。', reading: 'みてください。', english: 'Please look.' },
            { japanese: 'ゆっくり話してください。', reading: 'ゆっくりはなしてください。', english: 'Please speak slowly.' },
        ],
    },
    {
        pattern: 'てもいいです',
        meaning: 'May I / It is okay to',
        formation: 'Verb て-form + もいいです',
        explanation: 'Used to ask for or give permission.',
        examples: [
            { japanese: '写真を撮ってもいいですか？', reading: 'しゃしんをとってもいいですか？', english: 'May I take a photo?' },
            { japanese: 'ここに座ってもいいです。', reading: 'ここにすわってもいいです。', english: 'You may sit here.' },
        ],
    },
    {
        pattern: 'てはいけません',
        meaning: 'Must not / not allowed to',
        formation: 'Verb て-form + はいけません',
        explanation: 'Used to express prohibition.',
        examples: [
            { japanese: 'ここで写真を撮ってはいけません。', reading: 'ここでしゃしんをとってはいけません。', english: 'You must not take photos here.' },
            { japanese: 'タバコを吸ってはいけません。', reading: 'タバコをすってはいけません。', english: 'Smoking is not allowed.' },
        ],
    },

    // Comparison
    {
        pattern: 'より',
        meaning: 'More than / compared to',
        formation: 'A は B より Adjective',
        explanation: 'Used for making comparisons - A is more X than B.',
        examples: [
            { japanese: '東京は大阪より大きいです。', reading: 'とうきょうはおおさかよりおおきいです。', english: 'Tokyo is bigger than Osaka.' },
            { japanese: '今日は昨日より暑いです。', reading: 'きょうはきのうよりあついです。', english: 'Today is hotter than yesterday.' },
        ],
    },
    {
        pattern: '一番 (いちばん)',
        meaning: 'The most / number one',
        formation: 'の中で一番 + Adjective',
        explanation: 'Used for superlatives - the most X.',
        examples: [
            { japanese: '日本で一番高い山は富士山です。', reading: 'にほんでいちばんたかいやまはふじさんです。', english: 'The tallest mountain in Japan is Mt. Fuji.' },
        ],
    },

    // Giving and Receiving
    {
        pattern: 'あげます',
        meaning: 'To give (outward)',
        formation: 'Person に Thing を あげます',
        explanation: 'Used when the speaker gives something to someone else.',
        examples: [
            { japanese: '友だちにプレゼントをあげます。', reading: 'ともだちにプレゼントをあげます。', english: 'I give a present to my friend.' },
        ],
    },
    {
        pattern: 'もらいます',
        meaning: 'To receive',
        formation: 'Person に/から Thing を もらいます',
        explanation: 'Used when the speaker receives something.',
        examples: [
            { japanese: '友だちにプレゼントをもらいました。', reading: 'ともだちにプレゼントをもらいました。', english: 'I received a present from my friend.' },
        ],
    },
    {
        pattern: 'くれます',
        meaning: 'To give (to me/us)',
        formation: 'Person が Thing を くれます',
        explanation: 'Used when someone gives something to the speaker.',
        examples: [
            { japanese: '母が本をくれました。', reading: 'ははがほんをくれました。', english: 'My mother gave me a book.' },
        ],
    },

    // Additional N5 Grammar Patterns
    {
        pattern: 'なければなりません / ないといけません',
        meaning: 'Must / have to',
        formation: 'Verb ない-form (remove ない) + なければなりません',
        explanation: 'Expresses obligation or necessity.',
        examples: [
            { japanese: '宿題をしなければなりません。', reading: 'しゅくだいをしなければなりません。', english: 'I have to do my homework.' },
            { japanese: '明日早く起きないといけません。', reading: 'あしたはやくおきないといけません。', english: 'I have to wake up early tomorrow.' },
        ],
    },
    {
        pattern: 'なくてもいいです',
        meaning: 'Do not have to',
        formation: 'Verb ない-form (remove ない) + なくてもいいです',
        explanation: 'Expresses that something is not necessary.',
        examples: [
            { japanese: '今日は来なくてもいいです。', reading: 'きょうはこなくてもいいです。', english: 'You do not have to come today.' },
        ],
    },
    {
        pattern: 'ことができます',
        meaning: 'Can / able to',
        formation: 'Verb dictionary form + ことができます',
        explanation: 'Expresses ability or possibility to do something.',
        examples: [
            { japanese: '日本語を話すことができます。', reading: 'にほんごをはなすことができます。', english: 'I can speak Japanese.' },
            { japanese: 'ピアノを弾くことができますか？', reading: 'ピアノをひくことができますか？', english: 'Can you play the piano?' },
        ],
    },
    {
        pattern: 'ことがあります',
        meaning: 'Have done / have experienced',
        formation: 'Verb た-form + ことがあります',
        explanation: 'Expresses past experience.',
        examples: [
            { japanese: '富士山に登ったことがあります。', reading: 'ふじさんにのぼったことがあります。', english: 'I have climbed Mt. Fuji.' },
            { japanese: '日本に行ったことがありますか？', reading: 'にほんにいったことがありますか？', english: 'Have you ever been to Japan?' },
        ],
    },
    {
        pattern: 'つもりです',
        meaning: 'Plan to / intend to',
        formation: 'Verb dictionary form + つもりです',
        explanation: 'Expresses intention or a plan to do something.',
        examples: [
            { japanese: '来年日本に行くつもりです。', reading: 'らいねんにほんにいくつもりです。', english: 'I plan to go to Japan next year.' },
        ],
    },
    {
        pattern: 'ましょう',
        meaning: "Let's / shall we",
        formation: 'Verb stem + ましょう',
        explanation: 'Used to make suggestions or proposals.',
        examples: [
            { japanese: '映画を見ましょう。', reading: 'えいがをみましょう。', english: "Let's watch a movie." },
            { japanese: '一緒に行きましょうか？', reading: 'いっしょにいきましょうか？', english: 'Shall we go together?' },
        ],
    },
    {
        pattern: 'ましょうか',
        meaning: 'Shall I...? (offering help)',
        formation: 'Verb stem + ましょうか',
        explanation: 'Used to offer to do something for someone.',
        examples: [
            { japanese: '窓を開けましょうか？', reading: 'まどをあけましょうか？', english: 'Shall I open the window?' },
            { japanese: '手伝いましょうか？', reading: 'てつだいましょうか？', english: 'Shall I help you?' },
        ],
    },
    {
        pattern: 'ながら',
        meaning: 'While doing',
        formation: 'Verb stem + ながら',
        explanation: 'Indicates two actions happening simultaneously.',
        examples: [
            { japanese: '音楽を聞きながら勉強します。', reading: 'おんがくをききながらべんきょうします。', english: 'I study while listening to music.' },
        ],
    },
    {
        pattern: 'たり...たりする',
        meaning: 'Do things like...and...',
        formation: 'Verb た-form + り + Verb た-form + り + する',
        explanation: 'Lists representative examples of actions.',
        examples: [
            { japanese: '週末は映画を見たり、買い物をしたりします。', reading: 'しゅうまつはえいがをみたり、かいものをしたりします。', english: 'On weekends, I do things like watch movies and go shopping.' },
        ],
    },
    {
        pattern: 'とき',
        meaning: 'When / at the time of',
        formation: 'Verb/Adjective + とき',
        explanation: 'Indicates the time when something happens.',
        examples: [
            { japanese: '日本に行くとき、パスポートが必要です。', reading: 'にほんにいくとき、パスポートがひつようです。', english: 'When you go to Japan, you need a passport.' },
            { japanese: '子供のとき、よく公園で遊びました。', reading: 'こどものとき、よくこうえんであそびました。', english: 'When I was a child, I often played in the park.' },
        ],
    },
    {
        pattern: 'すぎます',
        meaning: 'Too much / excessively',
        formation: 'Verb stem / Adj stem + すぎます',
        explanation: 'Indicates excess or doing something too much.',
        examples: [
            { japanese: '昨日食べすぎました。', reading: 'きのうたべすぎました。', english: 'I ate too much yesterday.' },
            { japanese: 'このかばんは高すぎます。', reading: 'このかばんはたかすぎます。', english: 'This bag is too expensive.' },
        ],
    },
    {
        pattern: 'やすい / にくい',
        meaning: 'Easy to / hard to',
        formation: 'Verb stem + やすい/にくい',
        explanation: 'やすい means easy to do; にくい means hard to do.',
        examples: [
            { japanese: 'この本は読みやすいです。', reading: 'このほんはよみやすいです。', english: 'This book is easy to read.' },
            { japanese: 'この漢字は書きにくいです。', reading: 'このかんじはかきにくいです。', english: 'This kanji is hard to write.' },
        ],
    },
];
