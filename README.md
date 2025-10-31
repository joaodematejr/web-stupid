# Web Stupid - Sistema de Login e Formulário

Este projeto é uma aplicação Next.js com sistema de autenticação Firebase e formulários.

## 🚀 Funcionalidades

- ✅ **Tela de Login/Cadastro**: Autenticação com Firebase Auth
- ✅ **Tela de Boas-vindas**: Interface de boas-vindas após login
- ✅ **Formulário**: Formulário completo com validação
- ✅ **Proteção de Rotas**: Apenas usuários autenticados podem acessar
- ✅ **Responsivo**: Interface adaptável a diferentes dispositivos

## 📦 Instalação

1. Instale as dependências:
```bash
npm install
# ou
yarn install
```

2. Configure o Firebase:
   - Acesse o [Firebase Console](https://console.firebase.google.com/)
   - Crie um novo projeto
   - Ative a autenticação (Authentication) e o Firestore Database
   - Copie as configurações do seu projeto

3. Configure as credenciais do Firebase:
   - Abra o arquivo `lib/firebase.ts`
   - Substitua as configurações pelos dados do seu projeto Firebase

## 🔧 Como usar

1. Execute o servidor de desenvolvimento:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
