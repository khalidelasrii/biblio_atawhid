import React, { useState } from 'react';
import { X, Eye, EyeOff, User, Lock, Mail, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import toast from 'react-hot-toast';

interface LoginPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ isOpen, onClose }) => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        displayName: ''
    });

    const { signIn, signUp } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error('Veuillez remplir tous les champs obligatoires');
            return;
        }

        if (mode === 'register' && !formData.displayName) {
            toast.error('Veuillez entrer votre nom complet');
            return;
        }

        setLoading(true);
        try {
            if (mode === 'login') {
                await signIn(formData.email, formData.password);
                toast.success('Connexion réussie !');
            } else {
                await signUp(formData.email, formData.password, formData.displayName);
                toast.success('Compte créé avec succès !');
            }
            onClose();
            resetForm();
        } catch (error: any) {
            console.error('Erreur d\'authentification:', error);
            toast.error(error.message || 'Erreur lors de l\'authentification');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            email: '',
            password: '',
            displayName: ''
        });
        setMode('login');
        setShowPassword(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center space-x-3">
                        <div className="bg-orange-500 rounded-full p-2">
                            {mode === 'login' ? (
                                <LogIn className="w-5 h-5 text-white" />
                            ) : (
                                <UserPlus className="w-5 h-5 text-white" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {mode === 'login' ? 'Connexion' : 'Créer un compte'}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {mode === 'login'
                                    ? 'Accédez à votre espace personnel'
                                    : 'Rejoignez Biblio Al-Tawhid'
                                }
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {mode === 'register' && (
                        <div>
                            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                                Nom complet
                            </label>
                            <div className="relative">
                                <Input
                                    id="displayName"
                                    name="displayName"
                                    type="text"
                                    required={mode === 'register'}
                                    value={formData.displayName}
                                    onChange={handleChange}
                                    placeholder="Votre nom complet"
                                    className="pl-10"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Adresse email
                        </label>
                        <div className="relative">
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="votre@email.com"
                                className="pl-10"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Mot de passe
                        </label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="pl-10 pr-10"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        {mode === 'register' && (
                            <p className="text-xs text-gray-500 mt-1">
                                Minimum 6 caractères, incluez majuscules, minuscules et chiffres
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                {mode === 'login' ? 'Connexion...' : 'Création...'}
                            </div>
                        ) : (
                            mode === 'login' ? 'Se connecter' : 'Créer le compte'
                        )}
                    </Button>

                    {/* Mode Toggle */}
                    <div className="text-center pt-4 border-t">
                        <p className="text-sm text-gray-600">
                            {mode === 'login' ? (
                                <>
                                    Pas encore de compte ?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setMode('register')}
                                        className="text-orange-500 hover:text-orange-600 font-medium"
                                    >
                                        Créer un compte
                                    </button>
                                </>
                            ) : (
                                <>
                                    Déjà un compte ?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setMode('login')}
                                        className="text-orange-500 hover:text-orange-600 font-medium"
                                    >
                                        Se connecter
                                    </button>
                                </>
                            )}
                        </p>
                    </div>

                    {/* Admin Note */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <p className="text-xs text-orange-700 text-center">
                            <strong>Note :</strong> Les comptes administrateurs sont gérés séparément.
                            Le système détecte automatiquement votre type de compte lors de la connexion.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPopup;
