# Assistant Thérapie

Assistant Thérapie est une application web complète d'assistance thérapeutique basée sur l'IA, conçue pour accompagner les utilisateurs dans leur parcours de bien-être mental. Elle propose un suivi de l'humeur, des sessions de chat avec un agent thérapeute, la gestion des activités, et bien plus encore.

## Fonctionnalités principales
- Authentification sécurisée (JWT)
- Chat en temps réel avec un agent thérapeute IA
- Suivi de l'humeur et historique des sessions
- Gestion des activités thérapeutiques
- Interface utilisateur moderne avec Next.js et Tailwind CSS
- Backend Node.js/TypeScript avec API RESTful

## Structure du projet

```
backend/   # API, logique métier, gestion des sessions, agents IA
frontend/  # Application Next.js, interface utilisateur
```

## Prérequis
- Node.js >= 18.x
- npm ou yarn
- MongoDB (local ou cloud)

## Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/assistant-therapie.git
   cd assistant-therapie
   ```
2. Configurez les variables d'environnement :
   - Copiez `.env.example` en `.env` dans `backend/` et renseignez les valeurs nécessaires.
3. Installez les dépendances :
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
4. Lancez le backend :
   ```bash
   cd backend
   npm run dev
   ```
5. Lancez le frontend :
   ```bash
   cd frontend
   npm run dev
   ```
6. Accédez à l'application sur [http://localhost:3000](http://localhost:3000)

## Technologies utilisées
- **Frontend** : Next.js, React, Tailwind CSS
- **Backend** : Node.js, Express, TypeScript
- **Base de données** : MongoDB
- **IA** : Google Gemini API

## Contribution
Les contributions sont les bienvenues !
1. Forkez le projet
2. Créez une branche (`git checkout -b feature/ma-nouvelle-fonctionnalite`)
3. Commitez vos modifications (`git commit -am 'Ajout d'une nouvelle fonctionnalité'`)
4. Poussez la branche (`git push origin feature/ma-nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## Licence
Ce projet est sous licence MIT.

## Contact
Pour toute question ou suggestion, ouvrez une issue ou contactez l'équipe via GitHub.
