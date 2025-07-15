# Quiz Fisica

[![GitHub stars](https://img.shields.io/github/stars/sekiganou/quiz-fisica)](https://github.com/sekiganou/quiz-fisica/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/sekiganou/quiz-fisica)](https://github.com/sekiganou/quiz-fisica/network)
[![GitHub issues](https://img.shields.io/github/issues/sekiganou/quiz-fisica)](https://github.com/sekiganou/quiz-fisica/issues)
[![Website](https://img.shields.io/website?url=https://quiz-fisica-web.vercel.app)](https://quiz-fisica-web.vercel.app)

Una webapp per quiz di fisica con domande reali d'esame. Testa le tue conoscenze e monitora i tuoi progressi!

🌐 **Live App**: [quiz-fisica-web.vercel.app](https://quiz-fisica-web.vercel.app)

## ✨ Features

- **Quiz Casuali**: Affronta domande random per testare la tua preparazione generale
- **Quiz per Argomento**: Scegli un argomento specifico per concentrarti su aree particolari
- **Tutti i Quiz**: Affronta tutte le domande disponibili in un'unica sessione
- **Statistiche**: Monitora i tuoi progressi con statistiche dettagliate per argomento
- **Domande Follow-up**: Alcune domande hanno domande di approfondimento collegate
- **Immagini**: Supporto per domande con diagrammi e immagini esplicative
- **Design Responsive**: Ottimizzato per desktop e mobile
- **Persistenza Locale**: I progressi vengono salvati nel browser

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 con React 19
- **Styling**: Tailwind CSS + shadcn/ui components
- **Form Management**: React Hook Form + Zod validation
- **Monorepo**: Turborepo per gestione multi-package
- **Deployment**: Vercel
- **Package Manager**: pnpm

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

1. Clone the repository

```bash
git clone https://github.com/sekiganou/quiz-fisica
cd quiz-fisica
```

2. Install dependencies

```bash
pnpm install
```

3. Start the development server

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
quiz-fisica/
├── apps/
│   └── web/                # Main Next.js application
│       ├── app/            # App router pages and API routes
│       ├── components/     # React components
│       ├── public/         # Static assets and questions data
│       └── lib/            # Utility functions
├── packages/
│   ├── ui/                 # Shared UI components (shadcn/ui)
│   ├── eslint-config/      # Shared ESLint configuration
│   └── typescript-config/  # Shared TypeScript configuration
└── turbo.json              # Turborepo configuration
```

## 📝 Question Format

Le domande sono memorizzate in formato testo strutturato in `apps/web/public/questions.txt`:

```
Q: Testo della domanda
N: Nome dell'argomento
I: nome_immagine.png (opzionale)
T: Risposta corretta
F: Risposta sbagliata
F: Altra risposta sbagliata
U: Domanda di follow-up (opzionale)
T: Risposta corretta per follow-up
F: Risposta sbagliata per follow-up
```

## 🎯 Available Commands

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Linting & Type checking
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors
pnpm typecheck        # Run TypeScript checks

# Adding UI components
pnpm dlx shadcn@latest add button -c apps/web
```

## 🏗️ Architecture

### Components

- **Quiz**: Componente principale per gestire i quiz
- **ChooseTopics**: Permette di selezionare argomenti specifici
- **Stats**: Visualizza statistiche dettagliate sui progressi
- **ReviewQuiz**: Mostra la revisione delle risposte

### State Management

- **Local Storage**: Per persistenza di statistiche e progressi
- **React State**: Per gestione dello stato dell'applicazione
- **React Hook Form**: Per gestione form con validazione Zod

### Data Flow

1. Le domande vengono caricate da `questions.txt`
2. L'utente seleziona il tipo di quiz
3. Le domande vengono randomizzate e presentate
4. Le risposte vengono validate e le statistiche aggiornate
5. I risultati vengono salvati nel localStorage

## 🚀 Deployment

L'applicazione è deployata automaticamente su Vercel tramite GitHub integration.

### Manual Deployment

```bash
pnpm build
# Deploy to Vercel or your preferred platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and distributed under the MIT License.

## 👨‍💻 Author

Made by [sekiganou](https://github.com/sekiganou) per gli studenti di Informatica di UNITO

---

## 🌟 Ispirato da

Questo progetto prende ispirazione da [egid_web](https://github.com/MrDionesalvi/egid_web) realizzato da [dione](https://github.com/MrDionesalvi).  
Un sentito grazie per aver reso il proprio lavoro open source!
