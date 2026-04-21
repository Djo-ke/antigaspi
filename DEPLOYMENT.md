# 🚀 Anti Gaspi - Guide de Déploiement Complet

## ✨ Qu'est-ce que c'est?

Anti Gaspi est une **application de détection d'aliments par IA** qui:
- 📷 Prend une photo des aliments
- 🧠 Claude Vision détecte ce que tu vois
- 👨‍🍳 Génère 3 recettes réalistes et faciles
- ♻️ Réduit le gaspillage alimentaire

## 📋 Fichiers fournis

```
anti-gaspi/
├── index.html          # Frontend (interface utilisateur)
├── server.js           # Backend Node.js
├── package.json        # Dépendances
├── .env.example        # Variables d'environnement
└── README.md           # Ce fichier
```

## 🔑 Prérequis

1. **Clé API Claude** (gratuite)
   - Va à: https://console.anthropic.com/api/keys
   - Crée une nouvelle clé (commence par `sk-ant-`)
   - La clé reste **en local** dans le navigateur

2. **Compte Render** (déploiement gratuit)
   - Va à: https://render.com
   - Sign up avec GitHub (gratuit)

## 🚀 Déploiement - 3 ÉTAPES

### ÉTAPE 1: Créer un repo GitHub

```bash
# Sur GitHub, crée un nouveau repository: "anti-gaspi"
# Puis sur ton ordinateur:

git clone https://github.com/TonUsername/anti-gaspi.git
cd anti-gaspi

# Copie les fichiers:
# - index.html
# - server.js
# - package.json
# - .env.example

git add .
git commit -m "Initial commit - Anti Gaspi"
git push origin main
```

### ÉTAPE 2: Déployer sur Render

1. **Va à:** https://render.com
2. **Clique:** "New +" → "Web Service"
3. **Connecte GitHub:** Choose Repository → Select "anti-gaspi"
4. **Configure:**
   - Name: `anti-gaspi`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free (gratuit!)
5. **Clique:** "Create Web Service"
6. **Attends:** ~3-5 minutes pour que le service démarre
7. **Copie l'URL** générée (ex: `https://anti-gaspi.onrender.com`)

### ÉTAPE 3: Utiliser l'app

1. **Va à:** `https://anti-gaspi.onrender.com` (ou ton URL Render)
2. **Rentre ta clé API Claude** (`sk-ant-...`)
3. **Clique:** "Confirmer"
4. **Clique:** "Commencer"
5. **Autorise la caméra**
6. **Prends une photo d'aliments**
7. **Vois les recettes générées!**

## 🔐 Sécurité

✅ **Ta clé API est SÉCURISÉE:**
- Reste **en local** dans le navigateur
- **Jamais envoyée** au serveur Render
- Sauvegardée dans `localStorage`
- Seule la photo est envoyée au serveur
- Le serveur l'envoie à Claude et retourne les résultats

## ❓ Dépannage

### "Erreur de caméra"
```
→ Autorise la permission de caméra
→ Sur HTTPS uniquement (Render = HTTPS ✅)
→ Sur localhost, peut nécessiter HTTP
```

### "Clé API invalide"
```
→ Assure-toi qu'elle commence par "sk-ant-"
→ Copie-la correctement (pas d'espaces)
→ Teste sur https://console.anthropic.com
```

### "Pas de réponse du serveur"
```
→ Attend 5 min après déploiement Render
→ Vérifie que le service est "Live" (vert)
→ Regarde les logs: Dashboard → Logs
```

### "Pas d'aliments détectés"
```
→ La photo doit être claire
→ Au minimum 1 aliment visible
→ Bonne lumière
→ Claude Vision reconnaît les vrais aliments
```

## 💰 Coûts

✅ **Complètement GRATUIT:**
- Render Web Service: Free tier (gratuit)
- Claude API: $5 crédits gratuits (5M tokens)
- GitHub: Gratuit
- Domaine gratuit Render

**Note:** Le free tier Render va en sleep après 15 min d'inactivité (normal).

## 🆘 Support

**Si ça ne marche pas:**

1. Vérifie les logs Render:
   - Dashboard → anti-gaspi → Logs
   
2. Teste ta clé API:
   - https://console.anthropic.com/api/keys
   - Crée une nouvelle clé
   
3. Regarde la console du navigateur:
   - F12 → Console → Cherche les erreurs

## 📝 Notes

- L'app fonctionne **offline** pour la caméra (une fois chargée)
- Les recettes **varient** selon les aliments
- Plus d'aliments = plus de recettes différentes
- Chaque photo = 1 appel API Claude (~500 tokens)

## 🎉 C'est fini!

Bravo! Ton app Anti Gaspi est **EN LIGNE et FONCTIONNELLE!** 🚀

Partage l'URL avec tes amis! 

---

Créé avec ❤️
Anti Gaspi v1.0 - Avril 2026
