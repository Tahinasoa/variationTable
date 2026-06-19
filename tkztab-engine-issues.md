# Bugs moteur Tkz-Tab — synthèse pour debug

Source : revue manuelle des 65 cas de test (`tkztab_tests.pdf`).
25 anomalies relevées, regroupées ici par cause probable plutôt que par
numéro de cas, pour faciliter le diagnostic (plusieurs cas pointent
souvent vers le même bug sous-jacent).

---

## 1. Crashs — gestion du nombre de lignes ✅:fixed

Le moteur ne valide pas que le nombre de lignes déclarées dans
`tkzTabInit` correspond au nombre de lignes réellement utilisées par les
appels `tkzTabLine` / `tkzTabVar` qui suivent. Quand ça ne correspond pas
(trop ou trop peu), l'app crash au lieu de gérer l'erreur proprement.

| Cas | Description | Détail |
|---|---|---|
| #58 | `tkzTabInit` déclare 3 lignes ($x$, $f(x)$ avec hauteur **/3**) mais le code n'a en réalité que 2 lignes utiles (1 `tkzTabLine` + 1 `tkzTabVar`) | Le moteur doit détecter le décalage entre lignes déclarées et lignes fournies, et échouer proprement (message d'erreur) plutôt que crasher |
| #61 (1er) | `tkzTabInit` déclare 2 lignes, mais 1 `tkzTabLine` + 1 `tkzTabVar` sont fournies pour 5 antécédents — trop de contenu par rapport à la structure | "Too much line" — dépassement non géré |
| #65 | Même famille que #58 : `tkzTabInit` déclare 3 lignes, mais seulement `tkzTabLine` + `tkzTabVar` (2 lignes de contenu) sont fournies | Crash, "to much line, must handle the number of row correctly" |

**Action de dev suggérée :** ajouter une validation explicite au moment du
parsing — compter les lignes déclarées dans `tkzTabInit` (liste 1) vs le
nombre cumulé de lignes remplies par les appels `tkzTabLine`/`tkzTabVar`
suivants, et lever une erreur utilisateur lisible si ça ne correspond
pas, au lieu de laisser planter le moteur.

---

## 2. Non rendu (silencieux, sans crash)

| Cas | Description | Détail |
|---|---|---|
| #52 | Tableau à 4 lignes avec 2 appels `tkzTabVar` successifs (signe de f'' implicite via `tkzTabLine`, puis variations de f', puis variations de f) | Rien n'est rendu — pas de message d'erreur non plus, à investiguer en premier (silencieux = pire qu'un crash) |
| #57 | `tkzTabLine` avec valeurs numériques zéro brutes (`z` répété), puis `tkzTabVar` avec arguments à 3 parties (`s(i)/eg(i)/ed(i)`) mais slots vides + `R/ /` | Rien n'est rendu |

**Point commun possible :** les deux cas combinent `tkzTabLine` *et*
`tkzTabVar` sur un tableau à plusieurs lignes, avec des arguments à 3
parties contenant des emplacements vides (`/ /`). Vérifier si le parsing
de la forme `s(i)/eg(i)/ed(i)` échoue silencieusement quand un des deux
emplacements est vide alors que l'autre est rempli.

---

## 3. Symbole `R` (palier, "rien — passe à l'expression suivante")

| Cas | Description | Détail |
|---|---|---|
| #33 | `R/` (avec slash) utilisé deux fois de suite entre un début `D-/` et une fin `+/` | À vérifier visuellement — pas signalé comme buggé directement mais lié à #34 |
| #34 | `R` (sans slash, juste le symbole nu) utilisé 3 fois de suite | Cas listé comme test, comportement à confirmer |
| #64 | Deux lignes `tkzTabVar` consécutives utilisant chacune `R/` (avec slash) | **"R/ et R modifier not supported"** — confirmé non géré |

**Action de dev suggérée :** le moteur doit supporter `R` aussi bien sous
la forme nue (`R`) que sous la forme avec séparateur vide (`R/` ou
`R/ /`) — les trois sont équivalentes selon la doc Tkz-Tab et doivent
toutes "sauter" l'antécédent sans dessiner de flèche ni de valeur.

---

## 4. Positionnement incorrect de la première flèche (groupe 2 signes)

C'est le bug le plus répandu : pour tous les symboles à **deux signes**
(`+D-`, `-D+`, `+D+`, `-D-`, `+CD-`, `+DC-`, `+V-`, `-V+`, etc.), c'est
systématiquement la **première flèche** (celle qui arrive sur
l'antécédent à double signe, venant de l'antécédent précédent) qui est
mal positionnée. La flèche suivante (qui repart vers l'antécédent
d'après) semble correcte dans la plupart des cas.

| Cas | Symbole en cause | Détail |
|---|---|---|
| #35 | `-D+` | Flèche de la 1ère ligne incorrecte |
| #36 | `+D-` | Flèche de la **dernière** ligne incorrecte (variante : ici c'est la flèche sortante qui bug, pas l'entrante — à vérifier si c'est le même bug ou son symétrique) |
| #46 | `-D+` | Doublon de #35 (même code) — première flèche mal positionnée |
| #47 | `+D-` | Doublon de #36 (même code) — première flèche mal positionnée |
| #48 | `+CD-` | Première flèche mal positionnée |
| #49 | `+DC-` | Première flèche mal positionnée |
| #50 | `-V+` | Première flèche mal positionnée |
| #51 | `+V-` | **Les deux flèches** sont mal positionnées (cas aggravé) |
| #53 | aucun symbole à 2 signes ici (`D-`, `-`, `+`) | Signalé "first arrow is not correctly positioned" — à vérifier si c'est un bug différent (peut-être lié à `D-` seul plutôt qu'aux symboles à 2 signes) |
| #61 (2e) | `+CD-` puis `D+` | Première flèche non gérée correctement |
| #63 | `+D-` | Première flèche non gérée correctement |

**Action de dev suggérée :** isoler le code de calcul de la position de
flèche pour les symboles à deux signes (`groupe 2` dans la doc :
`+D-`, `-D+`, `+D+`, `-D-`, `+CD±`, `±DC±`, `±V±`). Le bug semble
systématique sur la flèche "entrante" (celle qui part de l'antécédent
précédent vers l'antécédent courant à double signe). Cas #36 à
re-vérifier séparément : il pourrait s'agir du même bug observé côté
sortie plutôt qu'entrée, ou d'un bug distinct sur la dernière ligne du
tableau spécifiquement. Cas #53 à reclasser après investigation : peut
ne pas appartenir à ce groupe.

**Remarque :** #35/#46 et #36/#47 sont des doublons exacts dans la
batterie de test (même code, même symptôme) — confirme la
reproductibilité du bug plutôt que de compter comme 2 bugs distincts.

---

## 5. Zone interdite (`H`) — la flèche traverse la zone hachurée

| Cas | Symbole en cause | Détail |
|---|---|---|
| #41 | `-H` | La flèche continue d'être dessinée par-dessus la zone hachurée au lieu de s'arrêter avant |
| #42 | `+H` | Idem |
| #43 | `-DH` | Idem, + bug séparé sur `D+` (voir section 6) |
| #44 | `-DH` (x2) | Idem |

**Action de dev suggérée :** quand un symbole `H` (seul ou combiné en
`DH`/`CH`) est rencontré, le moteur doit couper le tracé de la flèche de
variation à la limite de la zone interdite, et ne pas continuer le trait
au-delà. À vérifier si le bug vient d'un calcul de coordonnées qui ignore
la largeur de la zone hachurée lors du clipping de la flèche.

---

## 6. Symbole `D+` / `D-` (discontinuité avec barre, signe collé devant)

| Cas | Détail |
|---|---|
| #43 | `D+/ / $+\infty$` : le `+\infty$` n'est pas positionné du tout (positionnement manquant, pas juste incorrect) |
| #45 | `D+/ / $+\infty$` : le label n'est pas positionné correctement (variante du même symbole, résultat différent — incorrect plutôt qu'absent) |

**Action de dev suggérée :** vérifier spécifiquement le traitement de la
forme `D+/ /e(i)` (un seul signe collé contre le `D`, sans signe après —
cf. doc section "Groupe 1 avec un seul signe", lignes `D+ /e` et `D- /e`).
Semble distinct du bug de la section 4 (qui concerne les symboles à
**deux** signes type `+D-`). Ici c'est un symbole à un seul signe mais en
position préfixe (`D+` plutôt que `+D`), ce qui pourrait suivre un chemin
de code différent et insuffisamment testé.

---

## 7. Texte / valeur vide rendu littéralement au lieu d'être vide

| Cas | Détail |
|---|---|
| #55 | `+/ {}` : les accolades vides `{}` sont affichées telles quelles (`{}`) au lieu de produire un champ vide |

**Action de dev suggérée :** le parsing doit reconnaître `{}` comme
équivalent à une chaîne vide (comme un argument LaTeX vide), pas comme du
texte littéral à afficher. À comparer avec le comportement correct déjà
observé pour `+/` seul (sans accolades) ou `+/ ` (espace), qui eux
fonctionnent.

---

## 8. Saut de ligne `\\` dans un label de ligne hors `$...$`

| Cas | Détail |
|---|---|
| (signalé hors liste numérotée, cas générique `tkzTabInit` avec labels `Signe de\\ $f'(x)$`) | Le `\\` est rendu comme texte brut (`\\` littéral) au lieu d'être interprété comme un saut de ligne |

**Statut :** signalé par l'utilisateur comme **non prioritaire** —
acceptable que seul le texte à l'intérieur de `$...$` soit traité comme
du LaTeX ; le texte hors `$...$` (mode texte normal du label de ligne)
peut rester en mode "texte simple" sans interprétation des commandes
LaTeX comme `\\`. À garder en tête si on décide plus tard d'élargir le
support LaTeX du moteur en dehors des zones mathématiques, mais pas
bloquant pour l'instant.

---

## Récapitulatif quantitatif

| Catégorie | Nb cas concernés |
|---|---|
| 1. Crash — nombre de lignes incohérent | 3 (#58, #61-1er, #65) |
| 2. Non rendu silencieusement | 2 (#52, #57) |
| 3. Symbole `R` non supporté | 1 confirmé (#64) + 2 à confirmer (#33, #34) |
| 4. Première flèche mal positionnée (symboles 2 signes) | 10 (#35, #36, #46, #47, #48, #49, #50, #51, #61-2e, #63) — dont #35/#46 et #36/#47 sont des doublons de code |
| 5. Flèche traverse la zone hachurée (`H`) | 4 (#41, #42, #43, #44) |
| 6. `D+`/`D-` positionnement de label | 2 (#43, #45) |
| 7. `{}` rendu littéralement | 1 (#55) |
| 8. `\\` hors `$...$` (non prioritaire) | 1 (générique) |

**Total brut listé par l'utilisateur : 25 situations.**
(Le compte par catégorie ci-dessus dépasse légèrement 25 car certains cas
comme #43 apparaissent dans deux catégories à la fois — zone hachurée
*et* positionnement de label — et #35/#46, #36/#47 sont des doublons
exacts de code conservés tels quels dans la liste originale.)

---

## Priorisation suggérée pour le debug

1. **Crashs (section 1)** — bloquants, à corriger en premier : un crash
   empêche de tester quoi que ce soit d'autre derrière dans une UI.
2. **Non rendu silencieux (section 2)** — presque aussi grave qu'un
   crash car aucun signal d'erreur n'aide au diagnostic.
3. **Section 4 (flèches à 2 signes)** — le bug le plus fréquent (10
   occurrences), donc le plus rentable à corriger : un seul fix dans le
   calcul de position de flèche du "groupe 2" devrait résoudre la
   majorité des cas d'un coup.
4. **Section 5 (zone hachurée)** — bug visuel clair et isolé, fix
   probablement localisé dans le clipping de la flèche.
5. **Sections 3, 6, 7** — bugs plus spécifiques/isolés, à traiter une
   fois les gros chantiers ci-dessus réglés.
6. **Section 8** — non prioritaire, décision produit plutôt que bug.

---

## Notes méthodologiques

- Plusieurs cas de test contenaient eux-mêmes des erreurs de code LaTeX
  (volontaires ou non) — utile pour vérifier que le moteur gère les
  erreurs d'entrée proprement (messages clairs) plutôt que de planter
  silencieusement. Les crashs de la section 1 sont justement de bons
  exemples de ce type d'entrée invalide à gérer avec grâce.
- Les cas non listés ici (#1–#32, #37–#40, #54, #56, #59, #60, #62)
  ont été vérifiés visuellement comme corrects au moment de la revue.
