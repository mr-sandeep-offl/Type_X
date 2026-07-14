const passages = [
  "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump.",
  "In the beginning was the Word, and the Word was with God, and the Word was God. All things were made through him.",
  "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.",
  "To be or not to be, that is the question. Whether tis nobler in the mind to suffer the slings and arrows of outrageous fortune.",
  "All happy families are alike; each unhappy family is unhappy in its own way. Anna Karenina lay on the tracks.",
  "Call me Ishmael. Some years ago, never mind how long precisely, having little money in my pocket and nothing of interest on shore.",
  "It is a truth universally acknowledged that a single man in possession of a good fortune must be in want of a wife.",
  "Many years later, as he faced the firing squad, Colonel Aureliano Buendía was to remember that distant afternoon when his father took him to discover ice.",
  "The sky above the port was the color of television, tuned to a dead channel. All the neon and chrome of the night city.",
  "Happy families are all alike; every unhappy family is unhappy in its own way. Life is what happens when you are busy making other plans.",
  "The world is a book and those who do not travel read only one page. Travel makes one modest; you see what a tiny place you occupy in the world.",
  "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe. The difference between genius and stupidity is that genius has its limits.",
  "You only live once, but if you do it right, once is enough. Life is not measured by the number of breaths we take.",
  "In three words I can sum up everything I have learned about life: it goes on. The greatest glory in living lies not in never falling.",
  "The future belongs to those who believe in the beauty of their dreams. Do not go where the path may lead; go instead where there is no path.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. The only way to do great work is to love what you do.",
  "Typing fast is not just about speed but about rhythm. Each keystroke should flow naturally from the last, building momentum across the keyboard.",
  "Practice makes perfect, but perfect practice makes champions. Focus on accuracy first and let speed follow naturally over time.",
  "The quick typist finds a flow state where fingers move without conscious thought. The words appear on screen as if by magic.",
  "Keyboards are the instruments of the digital age. Master yours and you master the art of modern communication.",
  "Home row is your anchor. From there your fingers reach up and down in a dance across the keys, returning always to the center.",
  "Touch typing rewires the brain. What begins as a slow conscious effort becomes automatic muscle memory etched into your fingertips.",
  "Speed comes second. Accuracy comes first. A fast typist with poor accuracy wastes more time correcting than a slow typist who gets it right.",
  "Every great programmer was once a slow typist. Every great writer typed one word at a time. Progress is cumulative and inevitable.",
  "The alphabet soup of keys becomes second nature. A B C D E F G through to X Y Z arranged in QWERTY rows.",
  "Rain fell on the rooftop in syncopated rhythms, each drop a note in an improvised percussion piece played for no audience.",
  "Mountains rose from the valley floor like great grey giants frozen mid-step, their peaks lost in clouds that rolled in from the western sea.",
  "She opened the letter and read it three times before she understood what it meant. The world outside continued as if nothing had changed.",
  "Code is poetry written in a language that machines can understand. Every function is a stanza, every class a chapter.",
  "The terminal blinked patiently, awaiting input. He placed his fingers on the home row and began to type the future into existence.",
];

function getPassage(index) {
  if (index !== undefined && index >= 0 && index < passages.length) {
    return passages[index];
  }
  return passages[Math.floor(Math.random() * passages.length)];
}

function getRandomPassageIndex() {
  return Math.floor(Math.random() * passages.length);
}

module.exports = { getPassage, getRandomPassageIndex, passages };
