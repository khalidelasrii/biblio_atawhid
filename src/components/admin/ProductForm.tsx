import React, { useState, useEffect } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { Product, PRODUCT_CATEGORIES } from '../../types';
import { ProductService } from '../../services/dataService';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import toast from 'react-hot-toast';

interface ProductFormProps {
    product?: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
    product,
    isOpen,
    onClose,
    onSave
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        images: ['', '', ''], // 3 URLs d'images
        category: '',
        subcategory: '',
        stock: 0,
        isActive: true,
        tags: [] as string[],
        weight: 0,
        dimensions: { length: 0, width: 0, height: 0 }
    });
    const [loading, setLoading] = useState(false);
    const [tagInput, setTagInput] = useState('');

    // Remplir le formulaire si on modifie un produit existant
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                images: [...product.images, ...Array(3 - product.images.length).fill('')].slice(0, 3),
                category: product.category,
                subcategory: product.subcategory || '',
                stock: product.stock,
                isActive: product.isActive,
                tags: product.tags || [],
                weight: product.weight || 0,
                dimensions: product.dimensions || { length: 0, width: 0, height: 0 }
            });
        } else {
            // Réinitialiser pour nouveau produit
            setFormData({
                name: '',
                description: '',
                price: 0,
                images: ['', '', ''],
                category: '',
                subcategory: '',
                stock: 0,
                isActive: true,
                tags: [],
                weight: 0,
                dimensions: { length: 0, width: 0, height: 0 }
            });
        }
    }, [product, isOpen]);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageChange = (index: number, url: string) => {
        const newImages = [...formData.images];
        newImages[index] = url;
        setFormData(prev => ({
            ...prev,
            images: newImages
        }));
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.category) {
            toast.error('Veuillez remplir les champs obligatoires');
            return;
        }

        setLoading(true);
        try {            // Filtrer les images vides
            const validImages = formData.images.filter(img => img.trim() !== '');

            const productData: any = {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                subcategory: formData.subcategory || undefined,
                images: validImages,
                price: Number(formData.price),
                stock: Number(formData.stock),
                isActive: formData.isActive,
                tags: formData.tags
            };

            // Ajouter weight seulement s'il est défini et > 0
            if (formData.weight && Number(formData.weight) > 0) {
                productData.weight = Number(formData.weight);
            }

            // Ajouter dimensions seulement si au moins une dimension est définie
            if (formData.dimensions && (
                Number(formData.dimensions.length) > 0 ||
                Number(formData.dimensions.width) > 0 ||
                Number(formData.dimensions.height) > 0
            )) {
                productData.dimensions = {
                    length: Number(formData.dimensions.length) || 0,
                    width: Number(formData.dimensions.width) || 0,
                    height: Number(formData.dimensions.height) || 0
                };
            }

            if (product) {
                // Modifier produit existant
                await ProductService.updateProduct(product.id, productData);
                toast.success('Produit modifié avec succès');
            } else {
                // Ajouter nouveau produit
                await ProductService.addProduct(productData);
                toast.success('Produit ajouté avec succès');
            }

            onSave();
            onClose();
        } catch (error: any) {
            console.error('Erreur sauvegarde produit:', error);
            toast.error(error.message || 'Erreur lors de la sauvegarde');
        } finally {
            setLoading(false);
        }
    };

    const selectedCategory = PRODUCT_CATEGORIES.find(cat => cat.id === formData.category);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold">
                        {product ? 'Modifier le produit' : 'Ajouter un produit'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Informations de base */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nom du produit *
                            </label>
                            <Input
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Nom du produit"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Prix (DH) *
                            </label>
                            <Input
                                type="number"
                                value={formData.price}
                                onChange={(e) => handleInputChange('price', e.target.value)}
                                placeholder="Prix en DH"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Description du produit"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    {/* Catégories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Catégorie *
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => {
                                    handleInputChange('category', e.target.value);
                                    handleInputChange('subcategory', ''); // Reset subcategory
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            >
                                <option value="">Sélectionner une catégorie</option>
                                {PRODUCT_CATEGORIES.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sous-catégorie
                            </label>
                            <select
                                value={formData.subcategory}
                                onChange={(e) => handleInputChange('subcategory', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                disabled={!selectedCategory}
                            >
                                <option value="">Sélectionner une sous-catégorie</option>
                                {selectedCategory?.subcategories.map(subcategory => (
                                    <option key={subcategory} value={subcategory}>
                                        {subcategory.replace('-', ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Images (URLs) - Maximum 3
                        </label>
                        <div className="space-y-3">
                            {formData.images.map((image, index) => (
                                <div key={index} className="flex gap-3">
                                    <div className="flex-1">
                                        <Input
                                            value={image}
                                            onChange={(e) => handleImageChange(index, e.target.value)}
                                            placeholder={`URL de l'image ${index + 1}`}
                                        />
                                    </div>
                                    {image && (
                                        <div className="w-20 h-20 border rounded-md overflow-hidden bg-gray-100">
                                            <img
                                                src={image}
                                                alt={`Aperçu ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="%23f3f4f6"/><text x="40" y="40" text-anchor="middle" dy=".3em" fill="%236b7280">Erreur</text></svg>';
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Ajoutez des URLs d'images depuis Google Images, Unsplash, ou tout autre service d'hébergement d'images
                        </p>
                    </div>

                    {/* Stock et statut */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stock
                            </label>
                            <Input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => handleInputChange('stock', e.target.value)}
                                placeholder="Quantité en stock"
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Poids (kg)
                            </label>
                            <Input
                                type="number"
                                value={formData.weight}
                                onChange={(e) => handleInputChange('weight', e.target.value)}
                                placeholder="Poids en kg"
                                min="0"
                                step="0.1"
                            />
                        </div>

                        <div className="flex items-center mt-8">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                                Produit actif
                            </label>
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mots-clés (Tags)
                        </label>
                        <div className="flex gap-2 mb-2">
                            <Input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                placeholder="Ajouter un mot-clé"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            />
                            <Button type="button" onClick={addTag} variant="outline">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="ml-1 text-orange-600 hover:text-orange-800"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 pt-6 border-t">
                        <Button type="button" onClick={onClose} variant="outline">
                            Annuler
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    {product ? 'Modifier' : 'Ajouter'}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
