# Heurly

## Description de projet
Heurly a un application contiens l'emploi du temps, prise de note, gestion des documents, gestions des évenements.
Heurly facilite la vie d'étudiant. (Pour le moment, pour les étudiant esiee paris)
Il existe aussi une page de gestion de rôle sur les utilisateurs, qui permet les admins de gérer facilement sur les droits de l'utilisateur.

## Sécurité
Dans cet archive, il n'y a pas les sources sensibles et les vulnerabilité.

## Le structure de Heurly
Dans ce archive, vous allez trouver les dossier suivants:
Les deux dossiers sont complile différentement, ils sont de deux bases de données différentes. 
- Heurly AI: dans ce dossiers, vous trouverez tous les projets d'IA, qui fonctionne en locale, mais pas déployé sur le site Heurly.
- Heurly main: vous trouvez ici tous les programmes qui fait fonctionner le Heurly que vous voyez sur le site.


## Installation du projet
*Cette partie ne pourrais pas réalisé sans le fichier .env et le fichier .npmrc.* 
Il faut installer les logiciels suivants:
- [docker](https://docs.docker.com/engine/install/)
- [nodejs](https://nodejs.org/en)
- [pnpm](https://pnpm.io/installation) (recommende `npm i -g pnpm`)
- [wsl](https://learn.microsoft.com/en-us/windows/wsl/install)

Puis 
- Installer les bibliothèques avec `pnpm i` 
- Ajouter .env and .env.development.local dans le racine du projet (changer le type de "end-of-line" à LF")
- Si vous êtes sur Windows, utiliser wsl pour lancer `./start-database.sh` (changer le type de "end-of-line" à LF")
- `pnpm db:push` (changer le type de "end-of-line" à LF")
- `pnpm db:seed`
- `pnpm dev`
- 🤌🏽Maintenant le site est lancé sur  http://localhost:3000

## Licence
Licence se trouve sur la racine de projet Heurly main et Heurly AI.
