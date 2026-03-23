**Design System — Darija Maroc**

Principes
- Palette: couleurs chaudes (ocre), vert motivant et bleu Majorelle pour accents.
- Typographie: `Inter` pour UI + `Tajawal` pour textes arabes (chargées via `globals.css`).
- Icônes arrondies: wrapper `IconRounded` pour conserver homogénéité.
- Composants: boutons, cartes, barres de progression, etc. utilisent les variables CSS.

Fichiers importants
- `web/globals.css` — tokens CSS, variables, utilitaires (`.ds-card`, `.ds-btn`, `.ds-progress-fill`, `.icon-rounded`).
- `web/design/tokens.ts` — tokens JS exportables (couleurs, radii, spacing, fonts).
- Composants réutilisables: `components/Button.tsx`, `components/Card.tsx`, `components/ProgressBar.tsx`, `components/LessonCard.tsx`, `components/ModuleCard.tsx`, `components/ui/IconRounded.tsx`.

Usage
- Utilisez les classes utilitaires (`ds-card`, `ds-btn`) pour appliquer le style design system au HTML/JSX.
- Pour personnalisations, référez-vous aux variables CSS (`var(--color-primary)`, `var(--color-accent)`, etc.).

Souhaitez-vous:
- que j'expose ces tokens via Tailwind config (`theme.extend.colors`) ?
- que je génère une palette d'accessibilité (contraste) et tests automatisés ?
