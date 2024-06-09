# Heurly

# Description du projet
Heurly est une application comprenant un emploi du temps, une prise de notes, une gestion des documents, et une gestion des événements. Elle facilite la vie des étudiants. L'application inclut également une page de gestion de rôles pour les utilisateurs, permettant aux administrateurs de gérer facilement les droits des utilisateurs.

## Sécurité
Cette archive ne contient ni ressources sensibles, ni vulnérabilités.

## Structure de Heurly
Vous trouverez dans cette archive les dossiers suivants :
- **Heurly AI** : Contient tous les projets d'IA, bien que ces fonctionnalités ne soient pas présentes sur le site Heurly.
- **Heurly Main** : Contient toutes les ressources qui composent le site Heurly.

## Installation du projet
**Note :** Cette partie ne peut pas être réalisée sans le fichier `.env` et le fichier `.npmrc`.
Vous devez installer les logiciels suivants :
- [Docker](https://docs.docker.com/engine/install/)
- [Node.js](https://nodejs.org/en)
- [PNPM](https://pnpm.io/installation) (recommandé : `npm i -g pnpm`)
- [WSL](https://learn.microsoft.com/en-us/windows/wsl/install)

Ensuite procédez comme suit :
- Installez les bibliothèques avec `pnpm i`.
- Ajoutez `.env` et `.env.development.local` à la racine du projet (changez le type de "end-of-line" à LF).
- Si vous êtes sur Windows, utilisez WSL pour exécuter `./start-database.sh` (changez le type de "end-of-line" à LF).
- Exécutez `pnpm db:push` (changez le type de "end-of-line" à LF).
- Exécutez `pnpm db:seed`.
- Exécutez `pnpm dev`.
- Le site est maintenant accessible à l'adresse [http://localhost:3000](http://localhost:3000).

## Licence
La licence se trouve à la racine des projets Heurly Main et Heurly AI.


## Authors
- Adam Ait Hamid
- Angelo Giornano
- Raphaël Bouchez
- Mathieu Andriamiraho
- Qiaoqiao XIA
