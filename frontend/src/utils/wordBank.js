// 500+ word pool for solo random passages
export const WORDS = [
  'the','be','to','of','and','a','in','that','have','it','for','not','on','with',
  'he','as','you','do','at','this','but','his','by','from','they','we','say','her',
  'she','or','an','will','my','one','all','would','there','their','what','so','up',
  'out','if','about','who','get','which','go','me','when','make','can','like','time',
  'no','just','him','know','take','people','into','year','your','good','some','could',
  'them','see','other','than','then','now','look','only','come','its','over','think',
  'also','back','after','use','two','how','our','work','first','well','way','even',
  'new','want','because','any','these','give','day','most','us','between','need',
  'large','often','hand','high','place','hold','turn','feel','fact','best','create',
  'great','little','world','very','still','national','public','old','write','system',
  'long','every','found','study','should','different','home','light','around','again',
  'small','early','name','school','called','off','point','form','black','short','help',
  'show','land','set','put','end','does','another','large','big','going','where',
  'same','right','tell','too','follow','act','why','ask','men','change','went','light',
  'play','spell','air','away','animal','house','point','page','letter','mother','answer',
  'found','study','still','learn','plant','cover','food','sun','four','thought','let',
  'keep','children','feet','land','side','mile','night','walk','white','sea','began',
  'grow','took','river','four','carry','state','once','book','hear','stop','without',
  'second','later','miss','idea','enough','eat','face','watch','far','indian','real',
  'almost','let','above','girl','sometimes','mountain','cut','young','talk','soon',
  'list','song','leave','family','body','music','color','stand','question','fish','area',
  'mark','dog','horse','birds','problem','complete','room','knew','since','ever','piece',
  'told','usually','friends','line','city','measure','story','notice','quite','certain',
  'field','travel','wood','fire','upon','done','dark','machine','base','ago','became',
  'lived','whole','hear','example','behind','toward','life','love','voice','power',
  'town','fine','drive','ran','plan','figure','star','across','herself','himself',
  'spring','observe','child','floor','wonder','laugh','thousand','ago','ran','check',
  'game','shape','surface','busy','heart','since','past','ball','ready','held','already',
  'beside','along','might','able','live','open','seem','together','next','white','children',
  'begin','got','walk','example','ease','paper','often','always','music','those','both',
  'mark','book','letter','until','mile','rivers','car','feet','care','second','enough',
  'plain','girl','usual','young','ready','above','ever','red','list','though','feel',
  'talk','bird','soon','body','dog','family','direct','pose','leave','song','measure',
  'door','product','black','short','numeral','class','wind','question','happen','complete',
  'ship','area','half','rock','fire','south','problem','piece','told','knew','pass',
  'since','top','whole','king','street','inch','multiply','nothing','course','stay',
  'wheel','full','force','blue','object','decide','surface','deep','moon','island',
  'foot','system','busy','test','record','boat','common','gold','possible','plane',
  'stead','dry','wonder','laugh','thousand','ago','ran','check','game','shape','guess',
];

export const SOLO_PASSAGES = [
  "the quick brown fox jumps over the lazy dog while the sun sets behind the mountains casting long shadows across the valley floor",
  "practice makes perfect and every keystroke brings you closer to mastery focus on rhythm rather than speed and accuracy will follow",
  "technology shapes the world we live in every line of code every keystroke contributes to the digital landscape we all inhabit",
  "the art of typing is like playing the piano your fingers must know where to go without you having to think about it",
  "speed comes naturally when your fingers trust the keyboard build that trust through consistent practice and deliberate repetition",
  "words are the building blocks of thought and typing is how we give those thoughts permanence in the digital age",
  "the home row is your foundation from which all other keys are reached return to it always and your speed will multiply",
  "great typists are made not born every hour of practice compounds into an effortless flow that feels like second nature",
  "accuracy is the cornerstone of fast typing one mistake can cost more time than typing slowly and correctly from the start",
  "the keyboard is an extension of the mind train yours to translate thought into text without friction or hesitation",
];

export function getRandomPassage() {
  return SOLO_PASSAGES[Math.floor(Math.random() * SOLO_PASSAGES.length)];
}

export function getRandomWords(count = 40) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  return arr.join(' ');
}
