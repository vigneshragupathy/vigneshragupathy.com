export const THEMES = {
  paper:     { label: 'Paper',     blurb: 'Minimal, system font, indigo accent. Closest to current PaperMod.' },
  terminal:  { label: 'Terminal',  blurb: 'Dark only, monospace, green accent. Sysadmin / devops vibe.' },
  editorial: { label: 'Editorial', blurb: 'Cream paper, serif type, drop caps. Magazine / book feel.' },
  brutal:    { label: 'Brutal',    blurb: 'Thick black borders, hard shadows, yellow highlights. Loud.' },
} as const;
export type Theme = keyof typeof THEMES;
export const THEME_IDS = Object.keys(THEMES) as Theme[];
