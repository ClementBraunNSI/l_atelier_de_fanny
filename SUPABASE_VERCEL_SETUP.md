# Supabase + Vercel setup

## 1) Variables d'environnement

Configurer ces variables en local (`.env.local`) et sur Vercel (Preview + Production):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Compatibilité legacy (facultatif): `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2) SQL à exécuter dans Supabase

1. Ouvrir l'éditeur SQL Supabase.
2. Exécuter le fichier:
   - `supabase/migrations/20260430131800_init_auth_shop.sql`

## 3) Admin unique

Le trigger de création de profil lit `app.admin_email`.

Après migration, exécuter dans Supabase:

```sql
alter database postgres set app.admin_email = 'votre-email-admin@exemple.com';
select pg_reload_conf();
```

Les futurs comptes créés avec cet email auront automatiquement le rôle `admin`.

Pour promouvoir un compte existant:

```sql
update public.profiles
set role = 'admin'
where lower(email) = lower('votre-email-admin@exemple.com');
```

## 4) Vérification Vercel

- Déployer l'application.
- Créer un compte client (`/compte`) puis vérifier:
  - accès `/catalogue` + ajout panier,
  - page `/panier` + validation commande,
  - `admin` inaccessible au client.
- Se connecter avec l'email admin et vérifier:
  - accès `/admin`,
  - CRUD produits,
  - liste commandes.
