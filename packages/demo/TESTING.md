# Journal de tests et Validation - Moteur Tkz-Tab

## 🎯 Stratégie
Suivi centralisé des anomalies, cas limites (edge cases) et décisions techniques.

## 🐞 Backlog des anomalies (Priorité haute)
| ID | Description | Statut |
|:---|:---|:---|
| #01 | Crash: Mismatch lignes Init vs contenu (ex: #58, #61) |  Done |
| #02 | Décalage flèches: Syntaxe double (ex: `+CD-`, `D+/`) |  To Do |
| #03 | Rendu: Flèches horizontales "top" (ex: `+/` puis `+/`) |  To Do |
| #04 | Rendu: Zone hachurée et labels (#35, #46) | To Do |
| #05 | Support: Supporter `R`, `R/` et `R / ` dans le parser et dans le renderer | Working |

## 🧪 Matrice des Edge Cases (Batterie de tests)
*Référence: `tkztab_tests.pdf`*

- [ ] **Initialisation:** Validation du nombre de colonnes/lignes.
- [ ] **Variations:** Gestion des `R/` (Remplissage vide) et `D+/` complexes.

## 💡 Notes techniques & Décisions
- **Parser:** Migration vers `Zod` pour validation stricte de l'AST post-Peggy.
- **Renderer:** Isolation via `ErrorBoundary` fonctionnelle pour éviter les crashs globaux.