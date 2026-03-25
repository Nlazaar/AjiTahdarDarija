/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
export interface BotStep {
  type: 'bot' | 'end';
  darija: string;
  translit: string;
  fr: string;
  note?: string; // astuce vocabulaire / culture
}

export interface ChoiceStep {
  type: 'choice';
  choices: Array<{ darija: string; translit: string; fr: string }>;
}

export type Step = BotStep | ChoiceStep;

export interface ScenarioData {
  id: string;
  title: string;
  emoji: string;
  character: string;
  role: string;
  description: string;
  level: 'Débutant' | 'Intermédiaire';
  accent: string;
  bg: string;
  xp: number;
  steps: Step[];
}

/* ─────────────────────────────────────────────
   HELPERS  (rendent les données plus lisibles)
───────────────────────────────────────────── */
const b = (darija: string, translit: string, fr: string, note?: string): BotStep =>
  ({ type: 'bot', darija, translit, fr, ...(note ? { note } : {}) });

const e = (darija: string, translit: string, fr: string, note?: string): BotStep =>
  ({ type: 'end', darija, translit, fr, ...(note ? { note } : {}) });

const c = (...choices: [string, string, string][]): ChoiceStep => ({
  type: 'choice',
  choices: choices.map(([darija, translit, fr]) => ({ darija, translit, fr })),
});

/* ─────────────────────────────────────────────
   SCÉNARIO 1 — AU CAFÉ  (Youssef, serveur)
───────────────────────────────────────────── */
const cafe: ScenarioData = {
  id: 'cafe', title: 'Au café', emoji: '☕',
  character: 'Youssef', role: 'Serveur', level: 'Débutant',
  description: 'Commande, discute, apprends à négocier', accent: '#b45309', bg: '#fef3c7', xp: 30,
  steps: [
    b('أهلاً وسهلاً! مرحبا بيك فكافيه أطلس. واش ندير ليك؟',
      'Ahlan wa sahlan! Mrhba bik f Café Atlas. Wash nddir lik?',
      'Bienvenue au Café Atlas ! Qu\'est-ce que je peux faire pour toi ?'),
    c(
      ['بغيت اتاي بالنعناع عافاك', 'Bghit atay b naânâ afak', 'Je voudrais un thé à la menthe s\'il te plaît'],
      ['عطيني قهوة بالحليب عافاك', 'Atini qhwa b lḥlib afak', 'Donne-moi un café au lait s\'il te plaît'],
      ['شنو كاين عندكم؟', 'Shnu kayn andkum?', 'Qu\'est-ce que vous avez ?'],
    ),
    b('مزيان! واش بغيتي بالسكر؟',
      'Mzyan! Wash bghiti b ssukar?',
      'Super ! Tu le veux avec du sucre ?',
      '"مزيان" = bien/bon — mot très courant en Darija !'),
    c(
      ['إيه، شوية سكر عافاك', 'Ih, shwiya sukar afak', 'Oui, un peu de sucre s\'il te plaît'],
      ['لا، بلا سكر عافاك', 'La, bla sukar afak', 'Non, sans sucre s\'il te plaît'],
      ['شوية فقط', 'Shwiya fqat', 'Un tout petit peu'],
    ),
    b('واخا! دابا جيبلك. واش راك من هنا ولا زائر؟',
      'Wakha! Daba jiblik. Wash rak men hna wla zayir?',
      'D\'accord ! Je te l\'amène. Tu es d\'ici ou tu visites ?',
      '"واخا" = d\'accord — s\'utilise tout le temps en Darija !'),
    c(
      ['أنا من فرنسا، جيت نتفرج', 'Ana men fransa, jit netferrj', 'Je suis de France, je suis venu visiter'],
      ['ساكن هنا منذ شهر', 'Sakin hna men shhr', 'J\'habite ici depuis un mois'],
      ['كنتعلم الدارجة', 'Kanteallam ddarja', 'J\'apprends le Darija'],
    ),
    b('واو! كيفاش كتعلم الدارجة؟ بالتطبيق؟',
      'Waw! Kifash katallam ddarja? b ttṭbiq?',
      'Wow ! Comment tu apprends le Darija ? Avec une application ?'),
    c(
      ['إيه، بالتطبيق', 'Ih, b ttṭbiq', 'Oui, avec une appli'],
      ['مع صاحب مغربي', 'Maa ṣaḥib mghribi', 'Avec un ami marocain'],
      ['كنشوف يوتيوب', 'Kanshuf YouTube', 'Je regarde YouTube'],
    ),
    b('هاك! هادا اتايك. تشرب بالراحة! واش تعرف تقول "c\'est délicieux" بالدارجة؟',
      'Hak! Hada atayak. Teshreb b rraḥa! Wash taâref tgul "c\'est délicieux" b ddarja?',
      'Voilà ton thé ! Prends ton temps. Tu sais dire "c\'est délicieux" en Darija ?'),
    c(
      ['لا، شنو هي؟', 'La, shnu hiya?', 'Non, c\'est quoi ?'],
      ['بنين؟', 'Bnin?', 'Bni ? (délicieux ?)'],
      ['مش عارف', 'Mash arif', 'Je sais pas'],
    ),
    b('كتقول "بنين بزاف!" — يعني très délicieux. جرب دابا!',
      'Ktgul "bnin bzaf!" — yaâni très délicieux. Jarreb daba!',
      'On dit "بنين بزاف !" — ça veut dire très délicieux. Essaie maintenant !',
      '"بزاف" = beaucoup/très — mot ultra-fréquent !'),
    c(
      ['بنين بزاف! شكرا يوسف', 'Bnin bzaf! Shukran Yussuf', 'Très délicieux ! Merci Youssef'],
      ['واو، بنين بزاف!', 'Waw, bnin bzaf!', 'Wow, très délicieux !'],
    ),
    b('برافو! الدارجة ديالك مزيانة! 👏 واش بغيتي والو خور؟',
      'Bravo! Ddarja dyalik mzyana! Wash bghiti walu khor?',
      'Bravo ! Ton Darija est bien ! Tu veux autre chose ?'),
    c(
      ['لا شكرا. بشحال؟', 'La shukran. Bshhal?', 'Non merci. C\'est combien ?'],
      ['عطيني كروا عافاك', 'Atini krwa afak', 'Donne-moi un croissant s\'il te plaît'],
    ),
    b('بخمستاش درهم عافاك. مرسي على المجيء!',
      'B khemstash dirham afak. Mersi ala lmjiy!',
      '15 dirhams s\'il te plaît. Merci d\'être venu !',
      '"درهم" (dirham) = monnaie marocaine. 15 MAD ≈ 1,50 €'),
    c(
      ['تفضل. شكرا بزاف!', 'Tfeddel. Shukran bzaf!', 'Voilà. Merci beaucoup !'],
      ['عندك الصرف ديال خمسين؟', 'Andak ṣṣarf dyal khemsin?', 'T\'as la monnaie pour 50 ?'],
    ),
    e('شكرا! بسلامة، وعاود زورنا 🌿',
      'Shukran! Bslama, w awed zurna!',
      'Merci ! Au revoir, et reviens nous voir !'),
  ],
};

/* ─────────────────────────────────────────────
   SCÉNARIO 2 — AU MARCHÉ  (Fatima, marchande)
───────────────────────────────────────────── */
const marche: ScenarioData = {
  id: 'marche', title: 'Au marché', emoji: '🥦',
  character: 'Fatima', role: 'Marchande', level: 'Débutant',
  description: 'Achète des légumes, négocie les prix', accent: '#065f46', bg: '#d1fae5', xp: 30,
  steps: [
    b('صباح النور! تفضل تفضل 🌿 عندي خضرة طازجة من عند الفلاح. شنو بغيتي اليوم؟',
      'Sbah nnur! Tfeddel tfeddel. Andi khodra tazja men and lfellaḥ. Shnu bghiti lyum?',
      'Bonjour ! Entre entre ! J\'ai des légumes frais du paysan. Tu veux quoi aujourd\'hui ?'),
    c(
      ['بشحال كيلو ديال الطماطم؟', 'Bshhal kilu d tṭmaṭem?', 'C\'est combien le kilo de tomates ?'],
      ['عندك بصل طازج؟', 'Andak bṣel tazj?', 'T\'as des oignons frais ?'],
      ['شنو كاين اليوم؟', 'Shnu kayn lyum?', 'T\'as quoi aujourd\'hui ?'],
    ),
    b('الطماطم بخمسة دراهم الكيلو. طازجة جات من الفلاح صباح اليوم!',
      'Tṭmaṭem b khmsa drham lkilu. Tazja jat men lfellaḥ ṣbaḥ lyum!',
      'Les tomates sont à 5 dirhams le kilo. Fraîches du paysan ce matin !'),
    c(
      ['غالي بزاف! قلل شوية', 'Ghali bzaf! Qllel shwiya', 'C\'est trop cher ! Baisse un peu'],
      ['واخا، عطيني كيلوين', 'Wakha, atini kilwayn', 'D\'accord, donne-m\'en deux kilos'],
      ['عطيني نصف كيلو', 'Atini nṣṣf kilu', 'Donne-moi un demi-kilo'],
    ),
    b('ها أنت! أنت تنقص كثير 😂 على خاطرك، بأربعة دراهم. هذا آخر ثمن!',
      'Ha nta! Nta tneqqeṣ bzzaf. Ala khaṭrek, b rbâa drham. Hada akhir taman!',
      'Eh toi ! Tu baisses trop 😂 Pour toi, 4 dirhams. C\'est mon dernier prix !',
      'La négociation au souk est normale et attendue — c\'est une tradition !'),
    c(
      ['واخا، مقبول!', 'Wakha, maqbul!', 'D\'accord, c\'est bon !'],
      ['ثلاثة ونص؟', 'Tlata w nṣṣ?', '3,5 dirhams ?'],
      ['واخا هبيبتي، خد الكيلو', 'Wakha ḥbibti, khod lkilu', 'Allez ma chérie, prends le kilo'],
    ),
    b('يزي! كاملة. عندي جزر وبطاطس وفلفل اليوم. شنو خور بغيتي؟',
      'Yzi! Kamla. Andi zzer w bṭaṭa w felfla lyum. Shnu khor bghiti?',
      'Allez, marché conclu ! J\'ai des carottes, pommes de terre et poivrons. Tu veux autre chose ?'),
    c(
      ['عطيني كيلو ديال الجزر', 'Atini kilu d lzzer', 'Donne-moi un kilo de carottes'],
      ['كيفاش كيتصنى الطاجين بالخضرة؟', 'Kifash kaytssna ttajin b lkhodra?', 'Comment on fait la tajine aux légumes ?'],
      ['لا، هادا يكفيني', 'La, hada ykffini', 'Non, ça me suffit'],
    ),
    b('الطاجين سهل! تحتاج بصل، طماطم، زيت، وكمون. وعصفور صغير من الزعفران!',
      'Ttajin shl! Tḥtaj bṣel, ṭṭmaṭem, zit, w kammun. W ṣṣfur ṣghir men zzaafarane!',
      'La tajine c\'est facile ! Il faut des oignons, tomates, huile, cumin. Et une pincée de safran !',
      '"كمون" = cumin, épice essentielle. Le safran marocain de Taliouine est le meilleur au monde !'),
    c(
      ['شكرا على الوصفة فاطمة!', 'Shukran ala lwaṣfa Fatima!', 'Merci pour la recette Fatima !'],
      ['وينتا كتكوني هنا كل يوم؟', 'Wiynta ktkunin hna kull nhar?', 'Tu es là tous les jours ?'],
      ['مزيان، غادي نجرب!', 'Mzyan, ghadi njrreb!', 'Super, je vais essayer !'],
    ),
    b('كنجي كل يوم من الصباح حتى الظهر. جيبي معاك ساكو المرة الجاية!',
      'Knji kull nhar men ṣṣbaḥ ḥtta ḍḍohr. Jibi mâak saku lmarra jjaya!',
      'Je suis là tous les jours du matin jusqu\'à midi. Ramène ton sac la prochaine fois !',
      'Les marchés marocains sont zéro déchet — on apporte toujours son cabas !'),
    c(
      ['إنشالله، شكرا فاطمة! بشحال الكل؟', 'Inshallah, shukran Fatima! Bshhal lkull?', 'Inshallah, merci ! C\'est combien en tout ?'],
      ['واخا، نجيب ساكو المرة الجاية', 'Wakha, njib saku lmarra jjaya', 'Ok, je ramènerai mon sac la prochaine fois'],
    ),
    b('الكل بثلاثة وعشرين درهم. شكرا حبيبتي!',
      'Lkull b tlata w âeshrin dirham. Shukran ḥbibti!',
      'En tout 23 dirhams. Merci ma chérie !'),
    c(
      ['تفضلي. بسلامة فاطمة!', 'Tfeddli. Bslama Fatima!', 'Voilà. Au revoir Fatima !'],
      ['شكرا بزاف، كنجي كل يوم!', 'Shukran bzaf, knji kull nhar!', 'Merci beaucoup, je viens tous les jours !'],
    ),
    e('بسلامة! وصافي، الدارجة ديالك مزيانة بزاف! 🌿',
      'Bslama! W ṣafi, ddarja dyalik mzyana bzaf!',
      'Au revoir ! Et franchement ton Darija est vraiment bien !'),
  ],
};

/* ─────────────────────────────────────────────
   SCÉNARIO 3 — DANS LE TAXI  (Hassan, chauffeur)
───────────────────────────────────────────── */
const taxi: ScenarioData = {
  id: 'taxi', title: 'Dans le taxi', emoji: '🚕',
  character: 'Hassan', role: 'Chauffeur', level: 'Débutant',
  description: 'Indique ta destination, découvre la ville', accent: '#1e40af', bg: '#dbeafe', xp: 30,
  steps: [
    b('السلام عليكم! أهلاً، فين بغيتي تمشي؟',
      'Ssalamu alaykum! Ahlan, fin bghiti temshi?',
      'Bonjour ! Où tu veux aller ?'),
    c(
      ['بغيت نمشي للمدينة القديمة عافاك', 'Bghit nemshi llmdina lqdima afak', 'Je veux aller à la médina s\'il te plaît'],
      ['للمطار عافاك', 'Llmtar afak', 'À l\'aéroport s\'il te plaît'],
      ['للمركز التجاري', 'Llmarkaz ttijari', 'Au centre commercial'],
    ),
    b('واخا! حوالي عشرين دقيقة. الزطاط مزيان اليوم. كيفاش جاء رأيك فالمغرب؟',
      'Wakha! Ḥwali âeshrin dqiqa. Zzṭaṭ mzyan lyum. Kifash ja rayik f lMghrib?',
      'D\'accord ! Environ 20 minutes. La circulation est bonne aujourd\'hui. Tu trouves comment le Maroc ?',
      '"الزطاط" = la circulation/le trafic — mot familier très utilisé'),
    c(
      ['زوين بزاف! الناس لطاف بزاف', 'Zwin bzaf! Nnas lṭaf bzaf', 'C\'est très beau ! Les gens sont très sympas'],
      ['البلاد مزيانة بزاف', 'Lblad mzyana bzaf', 'Ce pays est très beau'],
      ['كل شي غريب وزوين بالنسبة ليا', 'Kull shi ghrib w zwin b nnisba liya', 'Tout est nouveau et beau pour moi'],
    ),
    b('الله يعطيك الصحة! وينت جاي؟ من أوروبا؟',
      'Llah yaâtik ṣṣḥḥa! Winta jay? Men Uruba?',
      'Dieu te bénisse ! Tu viens d\'où ? D\'Europe ?',
      '"الله يعطيك الصحة" = expression de politesse pour remercier, littéralement "que Dieu te donne la santé"'),
    c(
      ['إيه، جاي من فرنسا', 'Ih, jay men fransa', 'Oui, je viens de France'],
      ['من إسبانيا', 'Men isbanya', 'D\'Espagne'],
      ['من كندا', 'Men knada', 'Du Canada'],
    ),
    b('مزيان! وش هاد المرة الأولى ديالك فالمغرب؟',
      'Mzyan! Wash hadi lmarra lawwla dyalik f lMghrib?',
      'Super ! C\'est ta première fois au Maroc ?'),
    c(
      ['إيه، أول مرة وكانحب بزاف', 'Ih, awwel marra w kanḥbb bzaf', 'Oui, première fois et j\'adore'],
      ['لا، جيت مرتين من قبل', 'La, jit mratayn men qbel', 'Non, je suis venu deux fois avant'],
      ['كل سنة كنجي للمغرب', 'Kull sana knji l lMghrib', 'Je viens au Maroc chaque année'],
    ),
    b('برافو! خاصك تشوف جامع الكتبية، وتاكل الطاجين فالمدينة القديمة. شنو بغيتي تزور؟',
      'Bravo! Khaṣṣek tshuf Jmaâ lFna, w takul ttajin f lmdina lqdima. Shnu bghiti tzur?',
      'Bravo ! Tu dois voir Jemaa El-Fna et manger la tajine dans la médina. Tu veux visiter quoi ?',
      'Jemaa El-Fna est la place principale de Marrakech, classée UNESCO depuis 2001 !'),
    c(
      ['بغيت نشري هدايا للعيلة', 'Bghit neshri hdaya l laâyla', 'Je veux acheter des cadeaux pour la famille'],
      ['بغيت ناكل الطاجين الأصلي', 'Bghit nakul ttajin lasli', 'Je veux manger la vraie tajine'],
      ['بغيت نشوف كامل شي', 'Bghit nshuf kamel shi', 'Je veux tout voir'],
    ),
    b('مزيان! المدينة القديمة عندها كل شي. لكن حذر من الدلالة! 😄',
      'Mzyan! Lmdina lqdima andha kull shi. Lakn ḥder men ddellala!',
      'Super ! La médina a tout. Mais méfie-toi des guides non-officiels ! 😄',
      '"الدلالة" (dellala) = guide non-officiel au souk — ils proposent de t\'aider mais demandent de l\'argent après'),
    c(
      ['شكرا على النصيحة حسان!', 'Shukran ala nnṣiḥa Hassan!', 'Merci pour le conseil Hassan !'],
      ['حسن، فين كاين أحسن مطعم؟', 'Ḥsen, fin kayn aḥsen maṭâam?', 'Hassan, où est le meilleur restaurant ?'],
    ),
    b('واصلنا! هاد هو المكان. تسعة وعشرون درهم عافاك.',
      'Wṣelna! Hada huwa lmkan. Tsâa w âeshrin dirham afak.',
      'On est arrivés ! Voilà l\'endroit. 29 dirhams s\'il te plaît.'),
    c(
      ['تفضل. شكرا على الحديث المزيان!', 'Tfeddel. Shukran ala lḥdit lmzyan!', 'Voilà. Merci pour la conversation !'],
      ['عندك الصرف ديال مية درهم؟', 'Andak ṣṣarf dyal miya dirham?', 'T\'as la monnaie pour 100 dirhams ?'],
    ),
    b('عندي الصرف. تفضل! وتمتع بإقامتك فالمغرب!',
      'Andi ṣṣarf. Tfeddel! W tmtaâ b liqama dyalik f lMghrib!',
      'J\'ai la monnaie. Voilà ! Et profite bien de ton séjour au Maroc !'),
    c(
      ['شكرا حسان، بسلامة!', 'Shukran Hassan, bslama!', 'Merci Hassan, au revoir !'],
      ['ممكن ناخد رقمك للمرة الجاية؟', 'Mumkin nakhud rqmk llmarra jjaya?', 'Je peux avoir ton numéro pour la prochaine fois ?'],
    ),
    e('بسلامة! وإلا بغيتي تاكسي، انا هنا كل يوم! 🚕',
      'Bslama! W ila bghiti taxi, ana hna kull nhar!',
      'Au revoir ! Et si tu as besoin d\'un taxi, je suis là tous les jours !'),
  ],
};

/* ─────────────────────────────────────────────
   SCÉNARIO 4 — CHEZ UN AMI  (Amine, ami branché)
───────────────────────────────────────────── */
const ami: ScenarioData = {
  id: 'ami', title: 'Chez un ami', emoji: '🏠',
  character: 'Amine', role: 'Ami marocain', level: 'Intermédiaire',
  description: 'Discute librement, expressions de jeunes', accent: '#6d28d9', bg: '#ede9fe', xp: 40,
  steps: [
    b('يآه! كيداير؟ وقتاش وصلتي لكازا؟',
      'Ya! Kidayer? Wqtash wsslti l Kaza?',
      'Hé ! Ça va ? Quand t\'es arrivé(e) à Casablanca ?',
      '"كيداير؟" = comment tu vas ? — salutation informelle entre jeunes'),
    c(
      ['لاباس الحمد لله! وصلت امبارح', 'Labas lḥamdu llah! Wsslat ambarḥ', 'Ça va Dieu merci ! Je suis arrivé hier'],
      ['توا وصلت، تاعبان من السفر', 'Twa wsslat, taabn men ssfer', 'Je viens d\'arriver, fatigué du voyage'],
      ['وصلت من الصباح، كازا كبيرة بزاف!', 'Wsslat men ṣṣbaḥ, Kaza kbira bzaf!', 'Je suis arrivé ce matin, Casablanca est très grande !'],
    ),
    b('مرحبا! دخل دخل. واش تشرب شي حاجة؟ عندي عصير وكولا وقهوة.',
      'Mrhba! Dkhel dkhel. Wash teshreb shi haja? Andi aṣir w kula w qhwa.',
      'Bienvenue ! Entre entre. Tu veux boire quelque chose ? J\'ai du jus, du coca et du café.'),
    c(
      ['عطيني عصير بالتفاح عافاك', 'Atini aṣir b ttuffaḥ afak', 'Donne-moi un jus de pomme s\'il te plaît'],
      ['الماء يكفيني شكرا', 'Lma ykffini shukran', 'L\'eau ça suffit merci'],
      ['قهوة إلا عندك', 'Qhwa ila andak', 'Un café si t\'en as'],
    ),
    b('واش شفتي منطقة عين الذياب هنا فكازا؟ زوينة بزاف للمشي والكافيهات!',
      'Wash shefti manṭiqa Ain Ddyab hna f Kaza? Zwina bzaf llmshi w lkafyhat!',
      'T\'as vu le quartier Aïn Diab ici à Casablanca ? C\'est super beau pour se promener et les cafés !',
      '"عين الذياب" = Aïn Diab — quartier balnéaire branché de Casablanca, sur la Corniche'),
    c(
      ['مزال ما شفتهاش، بغيت نمشي', 'Mzal ma shefthash, bghit nemshi', 'Je ne l\'ai pas encore vue, je veux y aller'],
      ['إيه، كنت هناك البارح، زوينة بزاف!', 'Ih, knt hnak lbarḥ, zwina bzaf!', 'Oui, j\'y étais hier, c\'est très beau !'],
      ['رأيك نمشيو مع بعض؟', 'Rayik nemshiw maa baâḍ?', 'T\'es partant pour qu\'on y aille ensemble ?'],
    ),
    b('واش كتحب الموسيقى المغربية؟ أنا كنموت على الجيلالة وكنزة موريسلي!',
      'Wash ktḥbb lmusiqar lmghribiya? Ana kanmut ala Jilala w Kenza Morsli!',
      'T\'aimes la musique marocaine ? Moi je suis fan de Gnawa et de Kenza Morsli !',
      '"كنموت عليه" = j\'adore ça — expression très utilisée par les jeunes marocains'),
    c(
      ['كنسمع الموسيقى المغربية بزاف', 'Kansmaâ lmusiqar lmghribiya bzaf', 'J\'écoute beaucoup la musique marocaine'],
      ['ماعرفتش كنزة، شكون هي؟', 'Maaraftsh Kenza, shkun hiya?', 'Je connais pas Kenza, c\'est qui ?'],
      ['كنحب الجيلالة بزاف!', 'Kanḥbb Jilala bzaf!', 'J\'adore le Gnawa !'],
    ),
    b('كنزة مغنية جزائرية كتغني بالدارجة، ماشي مصدق! خاصك تسمعها. شنو كتاكل فالمغرب؟',
      'Kenza mghanniya jzairiya katghanni b ddarja, mashi mṣaddq! Khaṣṣek tsemâaha. Shnu katakul f lMghrib?',
      'Kenza est une chanteuse algérienne qui chante en Darija, incroyable ! Tu dois l\'écouter. Tu manges quoi au Maroc ?'),
    c(
      ['كليت الطاجين، بنين بزاف!', 'Klit ttajin, bnin bzaf!', 'J\'ai mangé la tajine, délicieux !'],
      ['كليت الكسكس يوم الجمعة', 'Klit lkuskus yum ljjemâa', 'J\'ai mangé le couscous vendredi'],
      ['بغيت نجرب البسطيلة', 'Bghit njrreb lbsṭila', 'Je veux goûter la pastilla'],
    ),
    b('البسطيلة؟ واو مزيانة بزاف! ورقة هشيشة ودجاج ولوز... الليلة نوكلوها!',
      'Lbsṭila? Waw mzyana bzaf! Warqa hshisha w djaj w luz... llila nwekluha!',
      'La pastilla ? Wow super ! Pâte feuilletée, poulet et amandes... Ce soir on en mange !',
      '"البسطيلة" = pastilla — plat traditionnel sucré-salé, spécialité de Fès'),
    c(
      ['يآه! واش تجي معايا للمطعم؟', 'Ya! Wash tji mâaya llmaṭâam?', 'Super ! Tu viens avec moi au restaurant ?'],
      ['مزيان، كنحب ناكل مع بعض', 'Mzyan, kanḥbb nakul maa baâḍ', 'Super, j\'aime manger ensemble'],
    ),
    b('واخا! ولكن بكري شوية، خاصنا نشريو من السوق. أنا نعلمك الدارجة ديال السوق!',
      'Wakha! Walkin bkri shwiya, khaṣṣna nshriw men ssuq. Ana naâllmek ddarja dyal ssuq!',
      'D\'accord ! Mais d\'abord, on doit acheter au souk. Je vais t\'apprendre le Darija du souk !'),
    c(
      ['واخا! أنا حاضر/حاضرة', 'Wakha! Ana ḥaḍer/ḥaḍra', 'D\'accord ! Je suis prêt(e)'],
      ['مزيان، غادي نتعلم بزاف اليوم!', 'Mzyan, ghadi nteallam bzaf lyum!', 'Super, je vais apprendre plein de choses aujourd\'hui !'],
    ),
    b('برافو! الدارجة ديالك مزيانة بزاف لمبتدئ. تكمل تتعلم هكذا وغادي تهضر بحال المغاربة!',
      'Bravo! Ddarja dyalik mzyana bzaf lmubtadi. Tkmel tatallam hakka w ghadi thedder bḥal lmghharba!',
      'Bravo ! Ton Darija est vraiment bien pour un débutant. Continue comme ça et tu parleras comme un Marocain !'),
    c(
      ['شكرا أمين، كنتعلم بزاف معاك!', 'Shukran Amine, kanteallam bzaf mâak!', 'Merci Amine, j\'apprends beaucoup avec toi !'],
      ['إنشالله، بغيت نهضر بحال المغاربة!', 'Inshallah, bghit nhedder bḥal lmghharba!', 'Inshallah, je veux parler comme les Marocains !'],
    ),
    e('ولا كان! يلا نمشيو للسوق! 🛍️ واليوم أنا كنعلمك كيفاش تنقص!',
      'Wla kan! Yalla nemshiw lssuq! W lyum ana kanâallmek kifash tneqqeṣ!',
      'Bien sûr ! Allez on va au souk ! Et aujourd\'hui je t\'apprends comment négocier !'),
  ],
};

/* ─────────────────────────────────────────────
   SCÉNARIO 5 — AU RIAD  (Khadija, propriétaire)
───────────────────────────────────────────── */
const riad: ScenarioData = {
  id: 'riad', title: 'Au riad', emoji: '🌴',
  character: 'Khadija', role: 'Propriétaire', level: 'Intermédiaire',
  description: 'Réserve une chambre, découvre la médina', accent: '#9d174d', bg: '#fce7f3', xp: 40,
  steps: [
    b('مرحبا وأهلاً! بيك وصلتي لرياض الزيتون ✨ أنا خديجة. كيف نخدمك؟',
      'Mrhba w ahlan! Bik wsselti l Riad Zitoun. Ana Khadija. Kif nkhddmek?',
      'Bienvenue au Riad Zitoun ! Je suis Khadija. Comment puis-je vous aider ?',
      '"رياض" (riad) = maison traditionnelle marocaine avec jardin intérieur — patrimoine architectural du Maroc'),
    c(
      ['بغيت نشوف الغرف عافاك', 'Bghit nshuf lghrraf afak', 'Je voudrais voir les chambres s\'il vous plaît'],
      ['عندكم بيت فاضي الليلة؟', 'Andkum bit faddi llila?', 'Vous avez une chambre libre ce soir ?'],
      ['شحال كيكلف الليلة؟', 'Shḥal kaykilef llila?', 'Combien coûte la nuit ?'],
    ),
    b('عندنا بيت مزيان بسبعمية وثلاثين درهم الليلة. فيه حمام خاص وتراس مطل على المدينة.',
      'Andna bit mzyan b sbaâmiya w tlatin dirham llila. Fih ḥmmam khaṣṣ w tirras mṭell ala lmdina.',
      'Nous avons une belle chambre à 730 dirhams la nuit. Elle a une salle de bain privée et une terrasse vue sur la médina.',
      '730 MAD ≈ 73€ — les riads sont souvent plus abordables que les hôtels pour leur cachet'),
    c(
      ['ممكن نشوفها؟', 'Mumkin nshufha?', 'Je peux la voir ?'],
      ['غالية شوية. عندكم والو أرخص؟', 'Ghalya shwiya. Andkum walu arkhaṣ?', 'C\'est un peu cher. Vous avez moins cher ?'],
      ['مزيان! كنأخذها', 'Mzyan! Kanakhudha', 'Parfait ! Je la prends'],
    ),
    b('تبعيني عافاك 🌿 الرياض ديالنا بناه جدي منذ مائة عام. الزليج والنقش كلها يدوية.',
      'Tbaâni afak. Rriad dyalna banah jeddi men miya âam. Zzlij w nnqsh kullha ydawiya.',
      'Suivez-moi s\'il vous plaît. Notre riad a été construit par mon grand-père il y a 100 ans. Les zelliges et les sculptures sont entièrement faits à la main.'),
    c(
      ['واو! الزليج مزيان بزاف', 'Waw! Zzlij mzyan bzaf', 'Wow ! Les zelliges sont magnifiques'],
      ['واش كاين حمام تقليدي فالرياض؟', 'Wash kayn ḥmmam tqliddi f rriad?', 'Il y a un hammam traditionnel dans le riad ?'],
      ['منين جات هاد الزخرفة الجميلة؟', 'Mnin jat had zzakhrafa jmila?', 'D\'où vient cette belle décoration ?'],
    ),
    b('إيه! عندنا حمام تقليدي كامل. غسول وصابون البلدي وكيس كير. تجربة أصيلة!',
      'Ih! Andna ḥmmam tqlidi kamel. Ghassul w ṣṣabun lbeldi w kis kir. Tjriba aṣila!',
      'Oui ! Nous avons un hammam traditionnel complet. Rhassoul, savon beldi et kessa. Une expérience authentique !',
      '"صابون البلدي" = savon noir traditionnel. "كيس الكير" = gant exfoliant — essentiels du hammam marocain !'),
    c(
      ['واش الحمام داخل في الثمن؟', 'Wash lḥmmam dakhil f ttaman?', 'Le hammam est inclus dans le prix ?'],
      ['بغيت نجرب الحمام التقليدي!', 'Bghit njrreb lḥmmam ttqlidi!', 'Je veux essayer le hammam traditionnel !'],
      ['الغرفة مزيانة بزاف', 'Lghrfa mzyana bzaf', 'La chambre est très belle'],
    ),
    b('الحمام بخمسة وأربعين درهم الجلسة. وفالصباح عندنا فطور مغربي أصيل مشمول فالثمن!',
      'Lḥmmam b khmsa w rebâin dirham ljlsa. W f ṣṣbaḥ andna fṭur mghribi aṣil mshmul f ttaman!',
      'Le hammam est à 45 dirhams la session. Et le matin, un vrai petit-déjeuner marocain est inclus dans le prix !'),
    c(
      ['واش الفطور فيه مسمن؟', 'Wash lfṭur fih msemmen?', 'Le petit-déjeuner a du msemmen ?'],
      ['ممتاز! متى كيبدأ الفطور؟', 'Mumtaz! Mta kaybda lfṭur?', 'Excellent ! Le petit-déjeuner commence à quelle heure ?'],
      ['مزيان بزاف! كنأخذ الغرفة', 'Mzyan bzaf! Kanakhud lghrfa', 'Très bien ! Je prends la chambre'],
    ),
    b('إيه! مسمن وبغرير وزيت وعسل وشاي بالنعناع. كيبدأ من الثامنة حتى العاشرة.',
      'Ih! Msemmen w bghrir w zit w âasel w atay b naânâ. Kaybda men ttamnya ḥtta lâashra.',
      'Oui ! Msemmen, baghrir, huile, miel et thé à la menthe. Il commence de 8h à 10h.',
      '"بغرير" = crêpe marocaine à mille trous — spécialité du petit-déjeuner marocain !'),
    c(
      ['رائع! غادي نوض فالثامنة', 'Raiaâ! Ghadi nuwwed f ttamnya', 'Super ! Je me lèverai à 8h'],
      ['ممتاز، شكرا خديجة!', 'Mumtaz, shukran Khadija!', 'Excellent, merci Khadija !'],
    ),
    b('مزيان! خاصك تكمل الورقة. اسمك الكامل وجنسيتك عافاك.',
      'Mzyan! Khaṣṣek tkmel lwaraqa. Smitk lkamel w jinsiyytek afak.',
      'Très bien ! Il faut remplir la fiche. Votre nom complet et nationalité s\'il vous plaît.'),
    c(
      ['اسمي... وأنا فرنسي/فرنسية', 'Ssmi... w ana fransi/fransiya', 'Je m\'appelle... et je suis français(e)'],
      ['ها الباسبور ديالي', 'Ha lbaspur dyali', 'Voilà mon passeport'],
    ),
    b('شكرا! هانت الكارطة ديال الغرفة 🗝️ تقدر تدخل من دابا. محتاج والو خور؟',
      'Shukran! Hanat lkarta dyal lghrfa. Tqder tdkhel men daba. Mḥtaj walu khor?',
      'Merci ! Voici la clé de la chambre. Tu peux entrer dès maintenant. Tu as besoin d\'autre chose ?'),
    c(
      ['شنو كاين مزيان نزور قريب من هنا؟', 'Shnu kayn mzyan nzur qrib men hna?', 'Qu\'est-ce qu\'il y a de bien à visiter près d\'ici ?'],
      ['فين كاين مطعم مزيان للعشاء؟', 'Fin kayn maṭâam mzyan llâsha?', 'Où il y a un bon restaurant pour le dîner ?'],
      ['لا، شكرا بزاف خديجة!', 'La, shukran bzaf Khadija!', 'Non, merci beaucoup Khadija !'],
    ),
    b('جامع ابن يوسف وسوق الصباغين وكيساريا... كلها قريبة! ولا احتجتي والو، أنا هنا دايما.',
      'Jemaâ Ibn Yussuf w ssuq ṣṣṣbbaghhin w lqaysariya... kullha qriba! W ila ḥtajti walu, ana hna dayma.',
      'La mosquée Ben Youssef, le souk des teinturiers et la kissaria... tout est proche ! Et si tu as besoin de quoi que ce soit, je suis toujours là.'),
    c(
      ['شكرا خديجة، الرياض رائع!', 'Shukran Khadija, rriad raiaâ!', 'Merci Khadija, le riad est magnifique !'],
      ['تمتعت بزاف بالحديث معاك!', 'Tmetteât bzaf b lḥdit mâak!', 'J\'ai adoré notre conversation !'],
    ),
    e('يسعد وقتك! الرياض ديالنا هو دارك فمراكش ✨ تمتع بإقامتك!',
      'Ysaâd wqtek! Rriad dyalna huwa dark f Mrakesh. Tmettaâ b liqama dyalik!',
      'Bonne journée ! Notre riad est ta maison à Marrakech. Profite bien de ton séjour !'),
  ],
};

/* ─────────────────────────────────────────────
   EXPORT
───────────────────────────────────────────── */
export const SCENARIOS: ScenarioData[] = [cafe, marche, taxi, ami, riad];
