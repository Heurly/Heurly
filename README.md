# Heurly

## Description de projet
Heurly a un application contiens l'emploi du temps, prise de note, gestion des documents, gestions des évenements.
Heurly facilite la vie d'étudiant. (Pour le moment, pour les étudiant esiee paris)
Il existe aussi une page de gestion de rôle sur les utilisateurs, qui permet les admins de gérer facilement sur les droits de l'utilisateur.

## Installation 
**_Prérequis_**
Pour contribuer sur ce projet, il faut installer ces logiciels ci-dessous:
- [docker](https://docs.docker.com/engine/install/)
- [nodejs](https://nodejs.org/en)
- [pnpm](https://pnpm.io/installation) (I recommend `npm i -g pnpm`)
- [wsl](https://learn.microsoft.com/en-us/windows/wsl/install)

Ensuite, pour cloner et utiliser ce repos, merci de suivre les étapes suivants:
- git clone the `git@github.com:Heurly/Heurly.git` repo
- install the `pnpm i` dependencies
- add .env and .env.development.local to the project root (change the end-of-line sequence type to "LF")
- if you're on Windows, use wsl to make `./start-database.sh` (change the end-of-line type to "LF")
- `pnpm db:push` (change the end-of-line type to "LF")
- `pnpm db:seed`
- `pnpm dev`

Une fois le set up est fait, l'application sur localhost http://localhost:3000.

Sur ce, le team Heurly vous souhaite un bon advanture avec notre produit. 

## Sécurité
Dans cet archive, 


#Heurly version anglais

## Installation

**_Prerequisites_**

To contribute to this project, you need to install a few items:

- [docker](https://docs.docker.com/engine/install/)
- [nodejs](https://nodejs.org/en)
- [pnpm](https://pnpm.io/installation) (recommende `npm i -g pnpm`)
- [wsl](https://learn.microsoft.com/en-us/windows/wsl/install)

To install the project and contribute, you need to take a few steps:

- git clone the `git@github.com:Heurly/Heurly.git` repo
- install the `pnpm i` dependencies
- add .env and .env.development.local to the project root (change the end-of-line sequence type to "LF")
- if you're on Windows, use wsl to make `./start-database.sh` (change the end-of-line type to "LF")
- `pnpm db:push` (change the end-of-line type to "LF")
- `pnpm db:seed`
- `pnpm dev`
- 🤌🏽 Now the application is running on http://localhost:3000
- you can checkout the dev beta name branch and create your branch from it

## Deploy to preprod

To deploy to production, you need to update the prod database schema.

- Copy the contents of the .env.production.local prod file into .env and run the command `pnpm run db:push` (⚠️ be careful if prisma says "... delete data" make a copy of the data to migrate the data)
- PR to `beta` to deploy your code on https://beta.heurly.fr (don't forget to add a reviewer)
