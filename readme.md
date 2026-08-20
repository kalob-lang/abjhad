# Kalob Abjhad

The Kalob Abjhad script is an attempt to create a featural, x-height-restricted abjad. To prevent visual collisions and maintain a dense, uniform horizontal ribbon of text, most base consonants lack ascenders and descenders (the consonants that do not have aspirated versions have descenders). Vowels are represented by combining diacritics placed _above_ the consonants, while the aspirated `+h` modifier is represented by a macron diacritic placed _below_.

## Orthography Guide

### The Consonant Skeleton

The script relies on 17 specific Latin Extended and IPA characters. They are grouped phonologically, utilizing crisp geometric shapes for stops and open curves for affricates/fricatives.

#### Stops & Fricatives

The aspirated (`+h`) versions of each consonant are formed by adding a combining macron below the base glyph (`̱`).

| Group                 | Base (Unvoiced) | +h (Unvoiced) | Voiced    | +h (Voiced) |
| --------------------- | --------------- | ------------- | --------- | ----------- |
| **Labials (p, b)**    | **e** (p)       | **e̱** (ph)    | **ɘ** (b) | **ɘ̱** (bh)  |
| **Alveolars (t, d)**  | **ʌ** (t)       | **ʌ̱** (th)    | **v** (d) | **v̱** (dh)  |
| **Velars (k, g)**     | **c** (k)       | **c̱** (kh)    | **ↄ** (g) | **ↄ̱** (gh)  |
| **Uvulars (q)**       | **ʊ** (q)       | **ʊ̱** (qh)    | —         | —           |
| **Sibilants (s, z)**  | **s** (s)       | **s̱** (sh)    | **ƨ** (z) | **ƨ̱** (zh)  |
| **Affricates (c, j)** | **ɛ** (c)       | **ɛ̱** (ch)    | **ɜ** (j) | **ɜ̱** (jh)  |

#### Nasals, Liquids, & Glides

These characters act as standard consonants and take vowel diacritics exactly like the stops.

| Latin | Character |
| ----- | --------- |
| **m** | **ƞ**     |
| **n** | **ʜ**     |
| **l** | **ꞁ**     |
| **r** | **ɽ**     |
| **y** | **ɥ**     |

---

### The Vowel System (Diacritics)

Kalob operates natively as an **impure** abjad (C[V]). Consonants are inherently vowelless. To indicate a vowel, a specific combining mark is added directly above the consonant of that syllable.

| Latin | Vowel Diacritic  | Example on 'p' (e) |
| ----- | ---------------- | ------------------ |
| **a** | Grave (`◌̀`)      | **è**              |
| **e** | Acute (`◌́`)      | **é**              |
| **i** | Circumflex (`◌̂`) | **ê**              |
| **o** | Dot (`◌̇`)        | **ė**              |
| **u** | Diaeresis (`◌̈`)  | **ë**              |
| **v** | Caron (`◌̌`)      | **ě**              |
| **w** | Tilde (`◌̃`)      | **ẽ**              |

---

### The Null Consonant & Hiatus (`ı`)

Because vowels must attach to a consonant, any word that begins with a vowel (or any syllable featuring vowel hiatus) requires a structural anchor.

Kalob uses the dotless **ı** (mapped to optional Latin `x` which is automatically inserted where needed) as its null consonant.

- **Word-Initial Vowel:** _ag_ → **ı̀ↄ**
- **Vowel Hiatus:** _phajhua_ → **è̱ɜ̱ı̈ı̀**

---

### Syllable Boundaries & The Dash (`-`)

Because Kalob vowels attach directly to the preceding consonant, words with complex syllable structures (like CVCVCVC) can sometimes cause a vowel to incorrectly attach to a coda consonant rather than acting as the onset of a new syllable.

To force a syllable boundary and ensure a vowel separates from a prior consonant, use a hyphen (`-`). This tells the converter to break the sequence, allowing the vowel to attach to a null consonant (`ı`) if necessary, or simply preventing unwanted consonant-vowel combinations.

---

### The "Tool U" Shortcut

To reduce diacritic clutter above the x-height for high-frequency grammatical particles, Kalob features a specific punctuation shortcut.

When the vowel **u** (`◌̈`) attaches to the null consonant **ı** to form the independent syllable **ı̈** (representing "Tool U" in the grammar), it can be entirely replaced by a standard colon:

- **ı̈** → **:**
