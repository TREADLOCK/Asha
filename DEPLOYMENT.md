# 🚀 Permanent Deployment Guide

Your site is currently live via a temporary tunnel for immediate viewing, but for a permanent public link, I recommend **Vercel** or **Netlify**.

## Option 1: Vercel (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign up.
2. Run this command in your terminal:
   ```bash
   npx vercel
   ```
3. Follow the prompts (Login, Link Project). It will automatically detect **Vite** and deploy it in seconds.

## Option 2: Netlify

1. Go to [netlify.com](https://netlify.com) and sign up.
2. Run this command in your terminal:
   ```bash
   npx netlify deploy --prod --dir=dist
   ```

## Option 3: GitHub Pages

Since you aren't currently using Git, you would first need to:

1. `git init`
2. `git add .`
3. `git commit -m "initial commit"`
4. Push to a GitHub repo.
5. In GitHub Settings > Pages, set the source to **GitHub Actions** and use the **Static HTML** or **Vite** template.

---

### Current Preview Link (Temporary)

🔗 [https://big-crabs-film.loca.lt](https://big-crabs-film.loca.lt)

> [!NOTE]
> This link is tied to your local machine. If you stop the `localtunnel` process or close your computer, this link will expire.
