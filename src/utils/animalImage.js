const asUri = (image) => {
  if (typeof image === 'string') return image.trim() || null;
  if (image && typeof image === 'object') {
    const uri = image.url ?? image.uri ?? image.imagen ?? image.path;
    return typeof uri === 'string' ? uri.trim() || null : null;
  }
  return null;
};

export const getAnimalImageUri = (animal = {}) => {
  const gallery = animal.galeria;
  const galleryImages = Array.isArray(gallery)
    ? gallery
    : Array.isArray(gallery?.fotos)
      ? gallery.fotos
      : [];

  return (
    asUri(animal.imagen) ||
    asUri(animal.image) ||
    asUri(animal.foto) ||
    galleryImages.map(asUri).find(Boolean) ||
    null
  );
};
