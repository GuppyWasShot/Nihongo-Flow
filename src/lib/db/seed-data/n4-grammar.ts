/**
 * N4 Grammar Patterns - Essential grammar for JLPT N4
 * Covers intermediate constructions: potential, passive, causative, conditionals, etc.
 */

export const n4GrammarData = [
    // ==================== Potential Form ====================
    {
        pattern: '〜れる / 〜られる (Potential)',
        meaning: 'Can do / able to do',
        formation: 'Group 1: う→える | Group 2: る→られる | する→できる, くる→こられる',
        explanation: 'The potential form expresses ability or possibility to do something. It conjugates like a る-verb.',
        examples: [
            { japanese: '日本語が話せます。', reading: 'にほんごがはなせます。', english: 'I can speak Japanese.' },
            { japanese: 'この漢字が読めますか？', reading: 'このかんじがよめますか？', english: 'Can you read this kanji?' },
            { japanese: '明日来られますか？', reading: 'あしたこられますか？', english: 'Can you come tomorrow?' },
        ],
    },

    // ==================== Passive Form ====================
    {
        pattern: '〜れる / 〜られる (Passive)',
        meaning: 'To be done (by someone/something)',
        formation: 'Group 1: う→あれる | Group 2: る→られる | する→される, くる→こられる',
        explanation: 'The passive form expresses that the subject is affected by an action. Often used for suffering or inconvenience in Japanese.',
        examples: [
            { japanese: '電車で足を踏まれました。', reading: 'でんしゃであしをふまれました。', english: 'I had my foot stepped on in the train.' },
            { japanese: '彼に名前を呼ばれた。', reading: 'かれになまえをよばれた。', english: 'I was called by name by him.' },
            { japanese: 'この本は多くの人に読まれています。', reading: 'このほんはおおくのひとによまれています。', english: 'This book is read by many people.' },
        ],
    },

    // ==================== Causative Form ====================
    {
        pattern: '〜せる / 〜させる (Causative)',
        meaning: 'To make/let someone do',
        formation: 'Group 1: う→あせる | Group 2: る→させる | する→させる, くる→こさせる',
        explanation: 'The causative form expresses making or letting someone do something.',
        examples: [
            { japanese: '母は私に野菜を食べさせました。', reading: 'はははわたしにやさいをたべさせました。', english: 'My mother made me eat vegetables.' },
            { japanese: '先生は学生を帰らせました。', reading: 'せんせいはがくせいをかえらせました。', english: 'The teacher let the students go home.' },
            { japanese: '子供を遊ばせています。', reading: 'こどもをあそばせています。', english: 'I am letting the children play.' },
        ],
    },

    // ==================== Causative-Passive ====================
    {
        pattern: '〜される / 〜させられる',
        meaning: 'To be made to do',
        formation: 'Causative form + passive ending',
        explanation: 'Combines causative and passive to express being forced to do something against one\'s will.',
        examples: [
            { japanese: '嫌いな野菜を食べさせられました。', reading: 'きらいなやさいをたべさせられました。', english: 'I was made to eat vegetables I don\'t like.' },
            { japanese: '毎日残業させられています。', reading: 'まいにちざんぎょうさせられています。', english: 'I am made to work overtime every day.' },
        ],
    },

    // ==================== Conditionals ====================
    {
        pattern: '〜たら',
        meaning: 'If/when (after doing)',
        formation: 'Verb た-form + ら | い-adj → かったら | な-adj/noun + だったら',
        explanation: 'Expresses a conditional "if" or temporal "when." Often used for specific, one-time situations.',
        examples: [
            { japanese: '駅に着いたら、電話してください。', reading: 'えきについたら、でんわしてください。', english: 'When you arrive at the station, please call me.' },
            { japanese: '安かったら、買います。', reading: 'やすかったら、かいます。', english: 'If it\'s cheap, I\'ll buy it.' },
            { japanese: '雨だったら、家にいます。', reading: 'あめだったら、いえにいます。', english: 'If it rains, I\'ll stay home.' },
        ],
    },
    {
        pattern: '〜ば',
        meaning: 'If (conditional)',
        formation: 'Verb: う→えば | い-adj: い→ければ | な-adj/noun + であれば',
        explanation: 'A conditional form emphasizing the condition. Often used for general truths or hypotheticals.',
        examples: [
            { japanese: '早く起きれば、電車に間に合います。', reading: 'はやくおきれば、でんしゃにまにあいます。', english: 'If you wake up early, you\'ll make the train.' },
            { japanese: '高ければ、買いません。', reading: 'たかければ、かいません。', english: 'If it\'s expensive, I won\'t buy it.' },
            { japanese: '練習すれば、上手になる。', reading: 'れんしゅうすれば、じょうずになる。', english: 'If you practice, you\'ll get better.' },
        ],
    },
    {
        pattern: '〜なら',
        meaning: 'If (topic-specific conditional)',
        formation: 'Noun/Verb plain form + なら',
        explanation: 'Used when giving advice or speaking about a specific topic. Implies "if you\'re talking about X..."',
        examples: [
            { japanese: '日本に行くなら、京都がおすすめです。', reading: 'にほんにいくなら、きょうとがおすすめです。', english: 'If you\'re going to Japan, I recommend Kyoto.' },
            { japanese: '寿司なら、あの店がいいですよ。', reading: 'すしなら、あのみせがいいですよ。', english: 'If it\'s sushi you want, that restaurant is good.' },
        ],
    },
    {
        pattern: '〜と (conditional)',
        meaning: 'When/if (natural consequence)',
        formation: 'Verb dictionary form + と',
        explanation: 'Expresses natural, automatic consequences. Similar to "whenever" in English.',
        examples: [
            { japanese: 'このボタンを押すと、ドアが開きます。', reading: 'このボタンをおすと、ドアがあきます。', english: 'When you press this button, the door opens.' },
            { japanese: '春になると、桜が咲きます。', reading: 'はるになると、さくらがさきます。', english: 'When spring comes, the cherry blossoms bloom.' },
        ],
    },

    // ==================== Appearance/Hearsay ====================
    {
        pattern: '〜そうだ (appearance)',
        meaning: 'Looks like / seems like',
        formation: 'Verb stem + そうだ | い-adj (remove い) + そうだ | な-adj + そうだ',
        explanation: 'Expresses appearance based on direct observation. "It looks like..."',
        examples: [
            { japanese: 'このケーキはおいしそうです。', reading: 'このケーキはおいしそうです。', english: 'This cake looks delicious.' },
            { japanese: '雨が降りそうです。', reading: 'あめがふりそうです。', english: 'It looks like it\'s going to rain.' },
            { japanese: '彼は元気そうですね。', reading: 'かれはげんきそうですね。', english: 'He looks healthy, doesn\'t he?' },
        ],
    },
    {
        pattern: '〜そうだ (hearsay)',
        meaning: 'I heard that / they say that',
        formation: 'Plain form + そうだ',
        explanation: 'Reports information heard from others. Different from appearance そう.',
        examples: [
            { japanese: '明日は雨だそうです。', reading: 'あしたはあめだそうです。', english: 'I heard it will rain tomorrow.' },
            { japanese: 'あの映画は面白いそうです。', reading: 'あのえいがはおもしろいそうです。', english: 'I heard that movie is interesting.' },
        ],
    },
    {
        pattern: '〜ようだ / 〜みたいだ',
        meaning: 'It seems like / it appears that',
        formation: 'Plain form + ようだ/みたいだ | Noun + のようだ/みたいだ',
        explanation: 'Expresses conjecture based on evidence or observation. みたいだ is more casual.',
        examples: [
            { japanese: '誰もいないようです。', reading: 'だれもいないようです。', english: 'It seems like no one is here.' },
            { japanese: '彼は忙しいみたいだ。', reading: 'かれはいそがしいみたいだ。', english: 'He seems to be busy.' },
            { japanese: '夢のようだ。', reading: 'ゆめのようだ。', english: 'It\'s like a dream.' },
        ],
    },
    {
        pattern: '〜らしい',
        meaning: 'I heard / apparently / -like',
        formation: 'Plain form + らしい | Noun + らしい',
        explanation: 'Expresses hearsay or typical characteristics. Can mean "I heard" or "typical of."',
        examples: [
            { japanese: '彼は来週結婚するらしい。', reading: 'かれはらいしゅうけっこんするらしい。', english: 'Apparently, he\'s getting married next week.' },
            { japanese: '男らしい人だ。', reading: 'おとこらしいひとだ。', english: 'He\'s a manly person.' },
        ],
    },

    // ==================== て-form Extensions ====================
    {
        pattern: '〜てある',
        meaning: 'Something has been done (and remains)',
        formation: 'Transitive verb て-form + ある',
        explanation: 'Indicates that something was done intentionally and the result remains.',
        examples: [
            { japanese: '窓が開けてあります。', reading: 'まどがあけてあります。', english: 'The window has been opened (and is still open).' },
            { japanese: '予約してあります。', reading: 'よやくしてあります。', english: 'A reservation has been made.' },
        ],
    },
    {
        pattern: '〜ておく',
        meaning: 'To do in advance / to leave as is',
        formation: 'Verb て-form + おく',
        explanation: 'Expresses doing something in preparation or leaving something in a certain state.',
        examples: [
            { japanese: 'パーティーの前に掃除しておきます。', reading: 'パーティーのまえにそうじしておきます。', english: 'I\'ll clean before the party (in advance).' },
            { japanese: 'そのままにしておいてください。', reading: 'そのままにしておいてください。', english: 'Please leave it as it is.' },
        ],
    },
    {
        pattern: '〜てしまう',
        meaning: 'To finish completely / to do unfortunately',
        formation: 'Verb て-form + しまう',
        explanation: 'Expresses completion of an action or regret about an unintended result.',
        examples: [
            { japanese: '本を全部読んでしまいました。', reading: 'ほんをぜんぶよんでしまいました。', english: 'I finished reading the entire book.' },
            { japanese: '電車に乗り遅れてしまった。', reading: 'でんしゃにのりおくれてしまった。', english: 'I (unfortunately) missed the train.' },
            { japanese: '財布を忘れてしまいました。', reading: 'さいふをわすれてしまいました。', english: 'I (accidentally) forgot my wallet.' },
        ],
    },
    {
        pattern: '〜てみる',
        meaning: 'To try doing',
        formation: 'Verb て-form + みる',
        explanation: 'Expresses trying something to see what happens or how it is.',
        examples: [
            { japanese: '食べてみてください。', reading: 'たべてみてください。', english: 'Please try eating it.' },
            { japanese: '一度日本に行ってみたいです。', reading: 'いちどにほんにいってみたいです。', english: 'I want to try going to Japan once.' },
        ],
    },
    {
        pattern: '〜ていく / 〜てくる',
        meaning: 'To go/come doing / gradual change',
        formation: 'Verb て-form + いく/くる',
        explanation: 'Expresses direction of action or gradual change over time.',
        examples: [
            { japanese: 'お弁当を持っていきます。', reading: 'おべんとうをもっていきます。', english: 'I\'ll take a lunch box (with me).' },
            { japanese: '雨が降ってきた。', reading: 'あめがふってきた。', english: 'It has started raining.' },
            { japanese: 'これから暖かくなっていきます。', reading: 'これからあたたかくなっていきます。', english: 'It will gradually get warmer from now.' },
        ],
    },

    // ==================== Purpose and Reason ====================
    {
        pattern: '〜ために',
        meaning: 'In order to / for the purpose of',
        formation: 'Verb dictionary form + ために | Noun + のために',
        explanation: 'Expresses purpose or goal of an action.',
        examples: [
            { japanese: '日本語を勉強するために日本に来ました。', reading: 'にほんごをべんきょうするためににほんにきました。', english: 'I came to Japan to study Japanese.' },
            { japanese: '健康のために毎日運動しています。', reading: 'けんこうのためにまいにちうんどうしています。', english: 'I exercise every day for my health.' },
        ],
    },
    {
        pattern: '〜ように',
        meaning: 'So that / in order that',
        formation: 'Verb dictionary/ない form + ように',
        explanation: 'Expresses purpose with focus on achieving a state or avoiding something.',
        examples: [
            { japanese: '忘れないように、メモを書きました。', reading: 'わすれないように、メモをかきました。', english: 'I wrote a memo so I wouldn\'t forget.' },
            { japanese: '日本語が話せるようになりたいです。', reading: 'にほんごがはなせるようになりたいです。', english: 'I want to become able to speak Japanese.' },
        ],
    },
    {
        pattern: '〜ようにする',
        meaning: 'To try to / to make sure to',
        formation: 'Verb dictionary/ない form + ようにする',
        explanation: 'Expresses making an effort to do or not do something habitually.',
        examples: [
            { japanese: '毎日野菜を食べるようにしています。', reading: 'まいにちやさいをたべるようにしています。', english: 'I try to eat vegetables every day.' },
            { japanese: '遅刻しないようにしてください。', reading: 'ちこくしないようにしてください。', english: 'Please try not to be late.' },
        ],
    },
    {
        pattern: '〜ようになる',
        meaning: 'To come to / to become able to',
        formation: 'Verb dictionary/ない form + ようになる',
        explanation: 'Expresses a change in state or ability over time.',
        examples: [
            { japanese: '漢字が読めるようになりました。', reading: 'かんじがよめるようになりました。', english: 'I became able to read kanji.' },
            { japanese: '最近、早起きするようになった。', reading: 'さいきん、はやおきするようになった。', english: 'Recently, I\'ve started waking up early.' },
        ],
    },
    {
        pattern: '〜のに',
        meaning: 'Although / despite / for (purpose)',
        formation: 'Plain form + のに | Noun + なのに | な-adj + なのに',
        explanation: 'Expresses contrast with disappointment or unexpected result.',
        examples: [
            { japanese: '約束したのに、来なかった。', reading: 'やくそくしたのに、こなかった。', english: 'Although we promised, he didn\'t come.' },
            { japanese: 'この本は読むのに時間がかかる。', reading: 'このほんはよむのにじかんがかかる。', english: 'This book takes time to read.' },
        ],
    },

    // ==================== Imperative and Volitional ====================
    {
        pattern: '命令形 (Imperative)',
        meaning: 'Command form (do!)',
        formation: 'Group 1: う→え | Group 2: る→ろ | する→しろ, くる→こい',
        explanation: 'Direct command form. Considered rough/rude except in certain contexts.',
        examples: [
            { japanese: '早く行け！', reading: 'はやくいけ！', english: 'Go quickly!' },
            { japanese: '黙れ！', reading: 'だまれ！', english: 'Be quiet!' },
            { japanese: 'ここに来い！', reading: 'ここにこい！', english: 'Come here!' },
        ],
    },
    {
        pattern: '禁止形 (Negative imperative)',
        meaning: 'Don\'t do! (prohibition)',
        formation: 'Verb dictionary form + な',
        explanation: 'Strong prohibition command. Considered rough.',
        examples: [
            { japanese: '触るな！', reading: 'さわるな！', english: 'Don\'t touch!' },
            { japanese: '心配するな。', reading: 'しんぱいするな。', english: 'Don\'t worry.' },
        ],
    },
    {
        pattern: '意向形 (Volitional)',
        meaning: 'Let\'s / I shall',
        formation: 'Group 1: う→おう | Group 2: る→よう | する→しよう, くる→こよう',
        explanation: 'Expresses intention or suggestion. Plain form of 〜ましょう.',
        examples: [
            { japanese: '映画を見よう。', reading: 'えいがをみよう。', english: 'Let\'s watch a movie.' },
            { japanese: '明日は早く起きよう。', reading: 'あしたははやくおきよう。', english: 'I\'ll wake up early tomorrow.' },
        ],
    },
    {
        pattern: '〜（よ）うと思う',
        meaning: 'I think I will / I\'m thinking of',
        formation: 'Volitional form + と思う',
        explanation: 'Expresses intention or plan.',
        examples: [
            { japanese: '来年日本に行こうと思っています。', reading: 'らいねんにほんにいこうとおもっています。', english: 'I\'m thinking of going to Japan next year.' },
            { japanese: 'もっと勉強しようと思います。', reading: 'もっとべんきょうしようとおもいます。', english: 'I think I\'ll study more.' },
        ],
    },

    // ==================== Expressions with なる/する ====================
    {
        pattern: '〜くなる / 〜になる',
        meaning: 'To become',
        formation: 'い-adj (remove い) + くなる | な-adj/Noun + になる',
        explanation: 'Expresses change of state - becoming something.',
        examples: [
            { japanese: '暖かくなりました。', reading: 'あたたかくなりました。', english: 'It has become warm.' },
            { japanese: '彼女は医者になった。', reading: 'かのじょはいしゃになった。', english: 'She became a doctor.' },
            { japanese: '部屋がきれいになりました。', reading: 'へやがきれいになりました。', english: 'The room has become clean.' },
        ],
    },
    {
        pattern: '〜くする / 〜にする',
        meaning: 'To make (something become)',
        formation: 'い-adj (remove い) + くする | な-adj/Noun + にする',
        explanation: 'Expresses causing a change - making something a certain way.',
        examples: [
            { japanese: '部屋を暖かくしてください。', reading: 'へやをあたたかくしてください。', english: 'Please make the room warm.' },
            { japanese: 'テレビの音を小さくした。', reading: 'テレビのおとをちいさくした。', english: 'I turned down the TV volume.' },
            { japanese: '部屋をきれいにしました。', reading: 'へやをきれいにしました。', english: 'I made the room clean.' },
        ],
    },

    // ==================== Time Expressions ====================
    {
        pattern: '〜前に',
        meaning: 'Before doing',
        formation: 'Verb dictionary form + 前に | Noun + の前に',
        explanation: 'Expresses an action done before another.',
        examples: [
            { japanese: '寝る前に歯を磨きます。', reading: 'ねるまえにはをみがきます。', english: 'I brush my teeth before sleeping.' },
            { japanese: '食事の前に手を洗ってください。', reading: 'しょくじのまえにてをあらってください。', english: 'Please wash your hands before eating.' },
        ],
    },
    {
        pattern: '〜後で / 〜てから',
        meaning: 'After doing',
        formation: 'Verb た-form + 後で | Verb て-form + から',
        explanation: 'Expresses an action done after another.',
        examples: [
            { japanese: '食べた後で、散歩しました。', reading: 'たべたあとで、さんぽしました。', english: 'After eating, I took a walk.' },
            { japanese: '宿題をしてから、遊びます。', reading: 'しゅくだいをしてから、あそびます。', english: 'After doing homework, I\'ll play.' },
        ],
    },
    {
        pattern: '〜間 / 〜間に',
        meaning: 'During / while',
        formation: 'Verb ている + 間(に) | Noun + の間(に)',
        explanation: '間 for throughout the duration, 間に for sometime during.',
        examples: [
            { japanese: '待っている間、本を読んでいました。', reading: 'まっているあいだ、ほんをよんでいました。', english: 'While waiting, I was reading a book.' },
            { japanese: '夏休みの間に、日本に行きました。', reading: 'なつやすみのあいだに、にほんにいきました。', english: 'During summer vacation, I went to Japan.' },
        ],
    },
    {
        pattern: '〜ところ',
        meaning: 'About to / just did / in the middle of',
        formation: 'Verb dictionary/ている/た form + ところ',
        explanation: 'Expresses timing - about to do, doing, or just finished.',
        examples: [
            { japanese: '今から出かけるところです。', reading: 'いまからでかけるところです。', english: 'I\'m about to go out now.' },
            { japanese: '今、ご飯を食べているところです。', reading: 'いま、ごはんをたべているところです。', english: 'I\'m in the middle of eating now.' },
            { japanese: '今、帰ってきたところです。', reading: 'いま、かえってきたところです。', english: 'I just got home now.' },
        ],
    },

    // ==================== Giving/Receiving Actions ====================
    {
        pattern: '〜てあげる',
        meaning: 'To do for someone (favor outward)',
        formation: 'Verb て-form + あげる',
        explanation: 'Expresses doing something as a favor for someone else.',
        examples: [
            { japanese: '友だちに日本語を教えてあげました。', reading: 'ともだちににほんごをおしえてあげました。', english: 'I taught Japanese to my friend (as a favor).' },
            { japanese: '荷物を持ってあげましょうか？', reading: 'にもつをもってあげましょうか？', english: 'Shall I carry your luggage for you?' },
        ],
    },
    {
        pattern: '〜てもらう',
        meaning: 'To have someone do / to receive the favor of',
        formation: 'Verb て-form + もらう',
        explanation: 'Expresses receiving the favor of someone\'s action.',
        examples: [
            { japanese: '友だちに手伝ってもらいました。', reading: 'ともだちにてつだってもらいました。', english: 'I had my friend help me.' },
            { japanese: '先生に説明してもらいました。', reading: 'せんせいにせつめいしてもらいました。', english: 'I had the teacher explain it to me.' },
        ],
    },
    {
        pattern: '〜てくれる',
        meaning: 'Someone does for me (favor received)',
        formation: 'Verb て-form + くれる',
        explanation: 'Expresses someone doing something for the speaker as a favor.',
        examples: [
            { japanese: '母が朝ご飯を作ってくれました。', reading: 'ははがあさごはんをつくってくれました。', english: 'My mother made breakfast for me.' },
            { japanese: '道を教えてくれてありがとう。', reading: 'みちをおしえてくれてありがとう。', english: 'Thank you for telling me the way.' },
        ],
    },

    // ==================== Quotation and Speech ====================
    {
        pattern: '〜と言う',
        meaning: 'To say that',
        formation: 'Quote + と言う',
        explanation: 'Direct or indirect quotation of speech.',
        examples: [
            { japanese: '彼は「行く」と言いました。', reading: 'かれは「いく」といいました。', english: 'He said "I\'m going."' },
            { japanese: '明日来ると言っていました。', reading: 'あしたくるといっていました。', english: 'He said he would come tomorrow.' },
        ],
    },
    {
        pattern: '〜と思う',
        meaning: 'To think that',
        formation: 'Plain form + と思う',
        explanation: 'Expresses the speaker\'s thoughts or opinions.',
        examples: [
            { japanese: '日本語は難しいと思います。', reading: 'にほんごはむずかしいとおもいます。', english: 'I think Japanese is difficult.' },
            { japanese: '彼は来ないと思う。', reading: 'かれはこないとおもう。', english: 'I think he won\'t come.' },
        ],
    },
    {
        pattern: '〜かどうか',
        meaning: 'Whether or not',
        formation: 'Plain form + かどうか',
        explanation: 'Expresses uncertainty about whether something is true.',
        examples: [
            { japanese: '明日雨が降るかどうかわかりません。', reading: 'あしたあめがふるかどうかわかりません。', english: 'I don\'t know whether it will rain tomorrow or not.' },
            { japanese: '彼が来るかどうか聞いてください。', reading: 'かれがくるかどうかきいてください。', english: 'Please ask whether he\'s coming or not.' },
        ],
    },

    // ==================== Other Essential Patterns ====================
    {
        pattern: '〜てほしい',
        meaning: 'Want someone to do',
        formation: 'Verb て-form + ほしい',
        explanation: 'Expresses the speaker\'s desire for someone else to do something.',
        examples: [
            { japanese: '早く来てほしいです。', reading: 'はやくきてほしいです。', english: 'I want you to come quickly.' },
            { japanese: '静かにしてほしい。', reading: 'しずかにしてほしい。', english: 'I want you to be quiet.' },
        ],
    },
    {
        pattern: '〜はずだ',
        meaning: 'Should be / supposed to be',
        formation: 'Plain form + はずだ',
        explanation: 'Expresses expectation or assumption based on logic or evidence.',
        examples: [
            { japanese: '彼はもう来ているはずです。', reading: 'かれはもうきているはずです。', english: 'He should already be here.' },
            { japanese: '電車は9時に着くはずです。', reading: 'でんしゃはくじにつくはずです。', english: 'The train is supposed to arrive at 9.' },
        ],
    },
    {
        pattern: '〜ことにする',
        meaning: 'To decide to',
        formation: 'Verb dictionary/ない form + ことにする',
        explanation: 'Expresses a decision made by the speaker.',
        examples: [
            { japanese: '来年日本に行くことにしました。', reading: 'らいねんにほんにいくことにしました。', english: 'I decided to go to Japan next year.' },
            { japanese: 'タバコをやめることにした。', reading: 'タバコをやめることにした。', english: 'I decided to quit smoking.' },
        ],
    },
    {
        pattern: '〜ことになる',
        meaning: 'It has been decided that',
        formation: 'Verb dictionary/ない form + ことになる',
        explanation: 'Expresses a decision made externally or by circumstances.',
        examples: [
            { japanese: '来月から東京で働くことになりました。', reading: 'らいげつからとうきょうではたらくことになりました。', english: 'It has been decided that I will work in Tokyo from next month.' },
            { japanese: '会議は中止することになった。', reading: 'かいぎはちゅうしすることになった。', english: 'It was decided to cancel the meeting.' },
        ],
    },
    {
        pattern: '〜かもしれない',
        meaning: 'Might / maybe',
        formation: 'Plain form + かもしれない',
        explanation: 'Expresses possibility or uncertainty.',
        examples: [
            { japanese: '明日は雨かもしれません。', reading: 'あしたはあめかもしれません。', english: 'It might rain tomorrow.' },
            { japanese: '彼は知らないかもしれない。', reading: 'かれはしらないかもしれない。', english: 'He might not know.' },
        ],
    },
    {
        pattern: '〜し',
        meaning: 'And also / moreover',
        formation: 'Plain form + し',
        explanation: 'Lists reasons or characteristics. Often used to give multiple reasons.',
        examples: [
            { japanese: '彼は頭もいいし、優しいし、かっこいい。', reading: 'かれはあたまもいいし、やさしいし、かっこいい。', english: 'He\'s smart, kind, and handsome.' },
            { japanese: '今日は天気もいいし、散歩しよう。', reading: 'きょうはてんきもいいし、さんぽしよう。', english: 'The weather is nice today, so let\'s take a walk.' },
        ],
    },
    {
        pattern: '〜ばかり',
        meaning: 'Just did / only / nothing but',
        formation: 'Verb た-form + ばかり | Noun + ばかり',
        explanation: 'Expresses that something just happened or that there\'s only one thing.',
        examples: [
            { japanese: '日本に来たばかりです。', reading: 'にほんにきたばかりです。', english: 'I just came to Japan.' },
            { japanese: '彼はゲームばかりしている。', reading: 'かれはゲームばかりしている。', english: 'He does nothing but play games.' },
        ],
    },
    {
        pattern: '〜ても',
        meaning: 'Even if / even though',
        formation: 'Verb て-form + も | い-adj → くても | な-adj/Noun + でも',
        explanation: 'Expresses that something is true regardless of the condition.',
        examples: [
            { japanese: '雨が降っても、行きます。', reading: 'あめがふっても、いきます。', english: 'Even if it rains, I\'ll go.' },
            { japanese: '高くても、買います。', reading: 'たかくても、かいます。', english: 'Even if it\'s expensive, I\'ll buy it.' },
        ],
    },
    {
        pattern: '〜ないで',
        meaning: 'Without doing',
        formation: 'Verb ない-form (remove い) + ないで',
        explanation: 'Expresses doing something without doing something else.',
        examples: [
            { japanese: '朝ご飯を食べないで、学校に行きました。', reading: 'あさごはんをたべないで、がっこうにいきました。', english: 'I went to school without eating breakfast.' },
            { japanese: '傘を持たないで出かけた。', reading: 'かさをもたないででかけた。', english: 'I went out without bringing an umbrella.' },
        ],
    },
    {
        pattern: '〜ずに',
        meaning: 'Without doing (formal)',
        formation: 'Verb ない-form (remove ない) + ずに | する→せずに',
        explanation: 'More formal version of ないで. Common in written Japanese.',
        examples: [
            { japanese: '何も言わずに帰った。', reading: 'なにもいわずにかえった。', english: 'He left without saying anything.' },
            { japanese: '諦めずに頑張ってください。', reading: 'あきらめずにがんばってください。', english: 'Please do your best without giving up.' },
        ],
    },
    {
        pattern: '〜ほど',
        meaning: 'To the extent that / the more... the more',
        formation: 'Verb dictionary/ない form + ほど | Noun + ほど',
        explanation: 'Expresses degree or extent.',
        examples: [
            { japanese: '死ぬほど疲れた。', reading: 'しぬほどつかれた。', english: 'I\'m dead tired (tired to the point of dying).' },
            { japanese: '練習すればするほど上手になる。', reading: 'れんしゅうすればするほどじょうずになる。', english: 'The more you practice, the better you get.' },
        ],
    },
    {
        pattern: '〜ながら',
        meaning: 'While doing',
        formation: 'Verb stem + ながら',
        explanation: 'Expresses two actions happening simultaneously by the same person.',
        examples: [
            { japanese: '音楽を聴きながら勉強します。', reading: 'おんがくをききながらべんきょうします。', english: 'I study while listening to music.' },
            { japanese: 'コーヒーを飲みながら話しましょう。', reading: 'コーヒーをのみながらはなしましょう。', english: 'Let\'s talk while drinking coffee.' },
        ],
    },
];
