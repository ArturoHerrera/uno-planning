/**
 * Utilitario para generación y renderizado de avatares diversos con Dicebear
 */

export const AVATAR_COLLECTIONS = ['adventurer', 'avataaars', 'bottts', 'lorelei'];

/**
 * Genera una nueva semilla de avatar combinando colección aleatoria y hash
 * @returns {string} Formato "coleccion:semilla"
 */
export const getRandomAvatar = () => {
  const collection = AVATAR_COLLECTIONS[Math.floor(Math.random() * AVATAR_COLLECTIONS.length)];
  const seed = Math.random().toString(36).substring(2, 9);
  return `${collection}:${seed}`;
};

/**
 * Obtiene la URL de Dicebear SVG a partir de una semilla
 * @param {string} avatarSeed - Semilla con o sin prefijo de colección
 * @param {string} fallbackName - Nombre alternativo si no hay semilla
 * @returns {string} URL completa de la imagen SVG
 */
export const getAvatarUrl = (avatarSeed, fallbackName = 'User') => {
  const raw = avatarSeed || fallbackName || 'User';
  let collection = 'adventurer';
  let seed = raw;

  if (raw.includes(':')) {
    const parts = raw.split(':');
    if (parts.length >= 2 && parts[0]) {
      collection = parts[0];
      seed = parts.slice(1).join(':');
    }
  } else {
    // Selección pseudoaleatoria pero determinista para nombres sin colección asignada
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    collection = AVATAR_COLLECTIONS[Math.abs(hash) % AVATAR_COLLECTIONS.length];
    seed = raw;
  }

  return `https://api.dicebear.com/9.x/${encodeURIComponent(collection)}/svg?seed=${encodeURIComponent(seed)}`;
};
