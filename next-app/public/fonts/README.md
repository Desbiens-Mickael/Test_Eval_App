# Polices des exports PDF

`Roboto-Regular.ttf` et `Roboto-Bold.ttf` sont intégrées aux relevés de notes PDF
(`src/lib/grade-report-pdf.ts`), pour que tous les accents et caractères des noms
s'affichent correctement. Elles ne sont téléchargées par le navigateur qu'au moment
d'un export.

- Police : Roboto, par Google (Christian Robertson)
- Licence : SIL Open Font License 1.1 — https://openfontlicense.org
- Source : paquet npm `@expo-google-fonts/roboto@0.4.3`
