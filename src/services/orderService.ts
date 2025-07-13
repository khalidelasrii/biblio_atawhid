import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    query,
    orderBy,
    serverTimestamp,
    where
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { ShippingAddress, PaymentMethod, Product } from '../types';
import { EmailService } from './emailService';
import jsPDF from 'jspdf';

// Interface pour les items de commande
interface OrderItem {
    id: string;
    product: Product;
    quantity: number;
    price: number; // Prix au moment de la commande
}

// Interface pour les informations client
interface CustomerInfo {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

// Interface complète pour une commande
interface OrderData {
    id?: string;
    orderNumber: string;
    customerInfo: CustomerInfo;
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: PaymentMethod;
    totalAmount: number;
    currentStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
    notes?: string;
}

export class OrderService {
    private static ORDER_COLLECTION = 'orders';
    private static ADMIN_EMAIL = 'khalidelasri534@gmail.com';

    // Générer un numéro de commande unique
    private static generateOrderNumber(): string {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `ORD${year}${month}${day}${random}`;
    }

    // Créer une nouvelle commande
    static async createOrder(
        items: Array<{ product: Product; quantity: number }>,
        shippingAddress: ShippingAddress,
        paymentMethod: PaymentMethod,
        notes?: string
    ): Promise<OrderData> {
        try {
            // Calculer le total
            const totalAmount = items.reduce((total, item) =>
                total + (item.product.price * item.quantity), 0
            );

            // Préparer les items de commande
            const orderItems: OrderItem[] = items.map(item => ({
                id: item.product.id,
                product: item.product,
                quantity: item.quantity,
                price: item.product.price // Prix au moment de la commande
            }));

            // Préparer les informations client
            const customerInfo: CustomerInfo = {
                name: shippingAddress.fullName,
                email: shippingAddress.email,
                phone: shippingAddress.phone,
                address: shippingAddress.address,
                city: shippingAddress.city,
                postalCode: shippingAddress.postalCode,
                country: shippingAddress.country
            };

            // Créer l'objet commande
            const orderData: Omit<OrderData, 'id'> = {
                orderNumber: this.generateOrderNumber(),
                customerInfo,
                items: orderItems,
                shippingAddress,
                paymentMethod,
                totalAmount,
                currentStatus: 'pending',
                createdAt: new Date(),
                updatedAt: new Date(),
                notes: notes || ''
            };

            // Sauvegarder dans Firestore
            const ordersRef = collection(db, this.ORDER_COLLECTION);
            const docRef = await addDoc(ordersRef, {
                ...orderData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            const createdOrder: OrderData = {
                id: docRef.id,
                ...orderData
            };

            // Envoyer email de notification (simulation)
            await this.sendEmailNotification(createdOrder);

            return createdOrder;
        } catch (error) {
            console.error('Erreur lors de la création de la commande:', error);
            throw error;
        }
    }

    // Récupérer toutes les commandes (pour l'admin)
    static async getAllOrders(): Promise<OrderData[]> {
        try {
            const ordersRef = collection(db, this.ORDER_COLLECTION);
            const q = query(ordersRef, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date()
            })) as OrderData[];
        } catch (error) {
            console.error('Erreur lors de la récupération des commandes:', error);
            throw error;
        }
    }

    // Mettre à jour le statut d'une commande
    static async updateOrderStatus(
        orderId: string,
        newStatus: OrderData['currentStatus']
    ): Promise<void> {
        try {
            const orderRef = doc(db, this.ORDER_COLLECTION, orderId);
            await updateDoc(orderRef, {
                currentStatus: newStatus,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut:', error);
            throw error;
        }
    }

    // Envoyer une notification email (simulation)
    private static async sendEmailNotification(order: OrderData): Promise<void> {
        try {
            // Utiliser EmailService pour envoyer l'email
            const emailSent = await EmailService.sendOrderNotification({
                orderNumber: order.orderNumber,
                customerName: order.customerInfo.name,
                customerEmail: order.customerInfo.email,
                customerPhone: order.customerInfo.phone,
                totalAmount: order.totalAmount,
                items: order.items,
                shippingAddress: order.shippingAddress,
                paymentMethod: order.paymentMethod.type === 'cash_on_delivery' ? 'Paiement à la livraison' : order.paymentMethod.type,
                notes: order.notes
            });

            if (emailSent) {
                console.log('✅ Email de notification envoyé avec succès à l\'admin');
            } else {
                console.log('⚠️ Échec de l\'envoi de l\'email de notification');
            }

            // Envoyer aussi une confirmation au client
            await EmailService.sendOrderConfirmation(order.customerInfo.email, order);

        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
            // Ne pas faire échouer la commande si l'email ne peut pas être envoyé
        }
    }

    // Générer PDF de commande
    static async generateOrderPDF(orderId: string): Promise<Blob> {
        try {
            const orders = await this.getAllOrders();
            const order = orders.find(o => o.id === orderId);

            if (!order) {
                throw new Error('Commande non trouvée');
            }

            // Créer un nouveau document PDF
            const pdf = new jsPDF();

            // Configuration des polices et couleurs
            pdf.setFont('helvetica');

            // En-tête
            pdf.setFontSize(20);
            pdf.setTextColor(255, 87, 34); // Orange
            pdf.text('BIBLIO AL-TAWHID', 20, 30);

            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);
            pdf.text('Librairie & Services d\'impression', 20, 40);
            pdf.text('Témara, Maroc', 20, 48);

            // Ligne de séparation
            pdf.setLineWidth(0.5);
            pdf.line(20, 55, 190, 55);

            // Titre de la facture
            pdf.setFontSize(16);
            pdf.text(`COMMANDE #${order.orderNumber}`, 20, 70);

            pdf.setFontSize(10);
            pdf.text(`Date: ${order.createdAt.toLocaleDateString('fr-FR')}`, 20, 80);
            pdf.text(`Statut: ${order.currentStatus.toUpperCase()}`, 20, 88);

            // Informations client
            pdf.setFontSize(12);
            pdf.text('INFORMATIONS CLIENT', 20, 105);
            pdf.setFontSize(10);

            let yPos = 115;
            pdf.text(`Nom: ${order.customerInfo.name}`, 20, yPos);
            pdf.text(`Email: ${order.customerInfo.email}`, 20, yPos + 8);
            pdf.text(`Téléphone: ${order.customerInfo.phone}`, 20, yPos + 16);

            // Adresse de livraison
            yPos += 30;
            pdf.setFontSize(12);
            pdf.text('ADRESSE DE LIVRAISON', 20, yPos);
            pdf.setFontSize(10);
            yPos += 10;
            pdf.text(order.shippingAddress.address, 20, yPos);
            pdf.text(`${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`, 20, yPos + 8);
            pdf.text(order.shippingAddress.country, 20, yPos + 16);

            // Articles commandés
            yPos += 35;
            pdf.setFontSize(12);
            pdf.text('ARTICLES COMMANDÉS', 20, yPos);

            // En-têtes du tableau
            yPos += 15;
            pdf.setFontSize(10);
            pdf.text('Article', 20, yPos);
            pdf.text('Qté', 120, yPos);
            pdf.text('Prix unit.', 140, yPos);
            pdf.text('Total', 170, yPos);

            // Ligne sous les en-têtes
            pdf.line(20, yPos + 3, 190, yPos + 3);

            // Articles
            yPos += 10;
            let totalGeneral = 0;

            order.items.forEach((item) => {
                const itemTotal = item.quantity * item.price;
                totalGeneral += itemTotal;

                // Nom de l'article (tronqué si trop long)
                const itemName = item.product.name.length > 40 ?
                    item.product.name.substring(0, 37) + '...' :
                    item.product.name;

                pdf.text(itemName, 20, yPos);
                pdf.text(item.quantity.toString(), 120, yPos);
                pdf.text(`${item.price.toFixed(2)} DH`, 140, yPos);
                pdf.text(`${itemTotal.toFixed(2)} DH`, 170, yPos);

                yPos += 8;

                // Nouvelle page si nécessaire
                if (yPos > 260) {
                    pdf.addPage();
                    yPos = 30;
                }
            });

            // Ligne de séparation avant le total
            pdf.line(120, yPos + 2, 190, yPos + 2);

            // Total
            yPos += 10;
            pdf.setFontSize(12);
            pdf.text(`TOTAL: ${totalGeneral.toFixed(2)} DH`, 140, yPos);

            // Méthode de paiement
            yPos += 20;
            pdf.setFontSize(10);
            pdf.text('Méthode de paiement:', 20, yPos);
            const paymentMethodText = order.paymentMethod.type === 'cash_on_delivery' ?
                'Paiement à la livraison' : order.paymentMethod.type;
            pdf.text(paymentMethodText, 20, yPos + 8);

            // Notes (si présentes)
            if (order.notes) {
                yPos += 25;
                pdf.text('Notes:', 20, yPos);
                // Diviser les notes en lignes si trop longues
                const noteLines = pdf.splitTextToSize(order.notes, 170);
                pdf.text(noteLines, 20, yPos + 8);
            }

            // Pied de page
            const pageHeight = pdf.internal.pageSize.height;
            pdf.setFontSize(8);
            pdf.setTextColor(128, 128, 128);
            pdf.text('Merci de votre confiance - Biblio Al-Tawhid', 20, pageHeight - 20);
            pdf.text(`Document généré le ${new Date().toLocaleDateString('fr-FR')}`, 20, pageHeight - 12);

            // Convertir en blob
            const pdfBlob = pdf.output('blob');
            return pdfBlob;

        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            throw error;
        }
    }

    // Télécharger PDF de commande
    static async downloadOrderPDF(orderId: string, orderNumber: string): Promise<void> {
        try {
            const pdfBlob = await this.generateOrderPDF(orderId);

            // Créer un lien de téléchargement
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `commande-${orderNumber}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erreur lors du téléchargement du PDF:', error);
            throw error;
        }
    }

    // Récupérer les commandes d'un client
    static async getOrdersByCustomer(email: string): Promise<OrderData[]> {
        try {
            const ordersRef = collection(db, this.ORDER_COLLECTION);
            const q = query(
                ordersRef,
                where('customerInfo.email', '==', email),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date()
            })) as OrderData[];
        } catch (error) {
            console.error('Erreur lors de la récupération des commandes client:', error);
            throw error;
        }
    }
}

// Type export pour l'utilisation dans d'autres fichiers
export type { OrderData, OrderItem, CustomerInfo };
