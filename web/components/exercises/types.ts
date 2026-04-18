export interface DarijaLetter {
  letter:    string   // caractère arabe, ex: "خ"
  latin:     string   // romanisation, ex: "kh"
  fr:        string   // description française, ex: "kh"
  imageUrl?: string   // image optionnelle pour les noms concrets
}

/** Harakat (voyelles courtes) pour une lettre arabe */
export interface Haraka {
  label:   string   // "Fatha" | "Kasra" | "Damma"
  symbol:  string   // "◌َ" | "◌ِ" | "◌ُ"
  letter:  string   // lettre + diacritique: "بَ"
  sound:   string   // son: "ba" | "bi" | "bu"
  desc:    string   // "son 'a' ouvert"
  ttsText: string   // texte envoyé au TTS pour prononciation claire
}

export interface AlphabetLetter extends DarijaLetter {
  name:     string     // nom de la lettre: "Alif", "Ba", "Ta"...
  harakat:  Haraka[]   // fatha, kasra, damma
}
