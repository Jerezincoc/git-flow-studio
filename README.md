🚀 Git Flow Studio
<p align="center"> <strong>Interactive Git Command Documentation</strong><br/> A modern, structured and practical reference for everyday Git usage. </p> <p align="center"> <img src="https://img.shields.io/badge/React-18-blue?logo=react" /> <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" /> <img src="https://img.shields.io/badge/Vite-Build-purple?logo=vite" /> <img src="https://img.shields.io/badge/Status-Active-success" /> <img src="https://img.shields.io/badge/License-MIT-green" /> </p>
✨ About The Project

Git Flow Studio is a modern, interactive Git documentation platform built to provide:

📘 Clear command explanations

🔎 Real-world usage examples

🧠 Practical “when not to use” guidance

🏷 Organized categories for fast filtering

⚡ Instant search functionality

Designed to be both a learning tool and a professional day-to-day reference.

🖥️ Features

Organized by categories (Basics, Branching, Remote, Info, Undoing)

Advanced commands included (rebase, bisect, worktree, submodule, etc.)

Syntax + examples + variations

Related commands cross-linking

Clean UI

Fast search dialog

🛠 Tech Stack
Technology	Purpose
React	UI rendering
TypeScript	Type safety
Vite	Build tool
TailwindCSS	Styling
Component Architecture	Scalability
📦 Installation
Clone the repository
git clone https://github.com/Jerezincoc/git-flow-studio.git
cd git-flow-studio
Install dependencies
npm install
Run development server
npm run dev

Open in browser:

http://localhost:5173
🏗 Production Build
npm run build
npm run preview
📁 Project Structure
src/
 ├── components/       # Reusable UI components
 ├── data/             # Git commands source file
 ├── pages/            # Main application pages
 ├── App.tsx
 └── main.tsx
➕ Adding New Commands

All commands are defined in:

src/data/commands.ts

Simply add a new object inside the commands array:

{
  id: "example",
  name: "git example",
  description: "Description here",
  syntax: "git example",
  category: "basics",
  uses: [],
  variations: [],
  examples: [],
  whenNotToUse: [],
  relatedCommands: []
}
🎯 Vision

The goal is to evolve Git Flow Studio into:

A complete Git reference hub

A learning companion for developers

A fast lookup tool for professionals

A structured Git knowledge base

🚀 Future Improvements

Multi-tag system

Difficulty levels (Beginner / Intermediate / Advanced)

Command comparison mode

Deployment pipeline

Internationalization (EN / PT)

📜 License

MIT License — free to use, modify and distribute.

👤 Author

Developed by Jerezincoc

If you like the project, consider ⭐ starring the repository.