const errorMessages: Record<string, string> = {
  "signup-invalid":
    "Merci de vérifier les champs : email valide et mot de passe d'au moins 6 caractères.",
  "signup-email-rate-limit":
    "Trop de demandes d'inscription en peu de temps. Merci de réessayer dans quelques minutes.",
  "signup-email-already-registered":
    "Un compte existe déjà avec cet email. Essayez de vous connecter.",
  "signup-generic":
    "Impossible de créer le compte pour le moment. Merci de réessayer un peu plus tard.",
  "login-failed":
    "Connexion impossible : vérifiez votre email et votre mot de passe.",
  "login-email-not-confirmed":
    "Votre email n'est pas encore confirmé. Vérifiez votre boîte mail puis réessayez.",
  "login-too-many-requests":
    "Trop de tentatives de connexion. Merci d'attendre quelques minutes.",
  "cart-add-failed":
    "Impossible d'ajouter ce produit au panier pour le moment.",
  "cart-update-failed":
    "Impossible de mettre à jour la quantité pour le moment.",
  "cart-remove-failed":
    "Impossible de retirer cet article pour le moment.",
  "checkout-stock":
    "Stock insuffisant pour au moins un article. Mettez votre panier à jour puis réessayez.",
  "checkout-empty": "Votre panier est vide.",
  "checkout-failed":
    "Impossible de valider la commande pour le moment. Merci de réessayer.",
  "forgot-password-invalid": "Merci d'indiquer un e-mail valide.",
  "forgot-password-rate-limit":
    "Trop de demandes de réinitialisation. Merci d'attendre quelques minutes.",
  "forgot-password-failed":
    "Impossible d'envoyer le lien de réinitialisation pour le moment.",
  "forgot-password-redirect":
    "Configuration incomplète : l'URL de redirection du reset n'est pas autorisée dans Supabase.",
  "product-name-required": "Le nom du produit est obligatoire.",
  "product-create-failed":
    "Impossible d'ajouter le produit. Vérifiez les champs puis réessayez.",
  "product-update-invalid":
    "Impossible d'enregistrer ce produit : informations incomplètes.",
  "product-update-failed":
    "Impossible de mettre à jour ce produit pour le moment.",
  "product-delete-invalid": "Impossible de supprimer ce produit.",
  "product-delete-failed":
    "Impossible de supprimer ce produit pour le moment.",
};

const successMessages: Record<string, string> = {
  "signup-success":
    "Compte créé avec succès. Vous pouvez maintenant vous connecter.",
  welcome: "Bienvenue ! Votre compte est créé et vous êtes connecté.",
  "order-created": "Commande créée avec succès.",
  "forgot-password-sent":
    "Si cet e-mail existe, un lien de réinitialisation vient d'être envoyé.",
  "forgot-password-manual":
    "Demande enregistrée. Pour l'instant, la réinitialisation se fait sans e-mail via l'administrateur.",
  "product-created": "Produit ajouté avec succès.",
  "product-updated": "Produit mis à jour avec succès.",
  "product-deleted": "Produit supprimé avec succès.",
};

export function getErrorMessage(code: string | null | undefined): string | null {
  if (!code) return null;
  const normalized = code.trim().toLowerCase();
  return errorMessages[normalized] ?? "Une erreur est survenue. Merci de réessayer.";
}

export function getSuccessMessage(code: string | null | undefined): string | null {
  if (!code) return null;
  const normalized = code.trim().toLowerCase();
  return successMessages[normalized] ?? "Action terminée avec succès.";
}

