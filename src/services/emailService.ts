import emailjs from '@emailjs/browser';

// Configuration EmailJS
// Ces valeurs devront être remplacées par vos vraies clés EmailJS
const EMAILJS_SERVICE_ID = 'your_service_id';
const EMAILJS_TEMPLATE_ID = 'your_template_id';
const EMAILJS_PUBLIC_KEY = 'your_public_key';

// Interface pour les données d'email
interface EmailData {
    to_email: string;
    subject: string;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    total_amount: number;
    items_list: string;
    shipping_address: string;
    payment_method: string;
    notes?: string;
    [key: string]: unknown; // Index signature pour EmailJS
}

export class EmailService {
    // Initialiser EmailJS (à appeler une fois au démarrage de l'app)
    static init(): void {
        try {
            emailjs.init(EMAILJS_PUBLIC_KEY);
        } catch (error) {
            console.error('Erreur initialisation EmailJS:', error);
        }
    }

    // Envoyer un email de notification de commande
    static async sendOrderNotification(orderData: {
        orderNumber: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        totalAmount: number;
        items: Array<{ product: any; quantity: number; price: number }>;
        shippingAddress: {
            address: string;
            city: string;
            postalCode: string;
            country: string;
        };
        paymentMethod: string;
        notes?: string;
    }): Promise<boolean> {
        try {
            // Préparer la liste des articles
            const itemsList = orderData.items
                .map(item => `${item.product.name} - Qté: ${item.quantity} - Prix: ${item.price} DH`)
                .join('\n');

            // Préparer l'adresse complète
            const fullAddress = `${orderData.shippingAddress.address}, ${orderData.shippingAddress.city}, ${orderData.shippingAddress.postalCode}, ${orderData.shippingAddress.country}`;

            // Données pour le template EmailJS
            const emailData: EmailData = {
                to_email: 'khalidelasri534@gmail.com',
                subject: `Nouvelle commande - ${orderData.orderNumber}`,
                order_number: orderData.orderNumber,
                customer_name: orderData.customerName,
                customer_email: orderData.customerEmail,
                customer_phone: orderData.customerPhone,
                total_amount: orderData.totalAmount,
                items_list: itemsList,
                shipping_address: fullAddress,
                payment_method: orderData.paymentMethod,
                notes: orderData.notes || 'Aucune note'
            };

            // Si EmailJS n'est pas configuré, on simule l'envoi
            if (EMAILJS_SERVICE_ID === 'your_service_id') {
                console.log('📧 SIMULATION - Email envoyé à l\'admin:', {
                    destinataire: 'khalidelasri534@gmail.com',
                    sujet: emailData.subject,
                    contenu: {
                        commande: emailData.order_number,
                        client: emailData.customer_name,
                        email: emailData.customer_email,
                        telephone: emailData.customer_phone,
                        montant: `${emailData.total_amount} DH`,
                        articles: emailData.items_list,
                        adresse: emailData.shipping_address,
                        paiement: emailData.payment_method,
                        notes: emailData.notes
                    }
                });
                return true;
            }

            // Envoyer l'email via EmailJS
            const response = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                emailData
            );

            if (response.status === 200) {
                console.log('✅ Email envoyé avec succès à l\'admin');
                return true;
            } else {
                console.error('❌ Erreur envoi email:', response);
                return false;
            }
        } catch (error) {
            console.error('❌ Erreur lors de l\'envoi de l\'email:', error);

            // En cas d'erreur, on log les détails pour debugging
            console.log('📧 FALLBACK - Détails de la commande à envoyer manuellement:', {
                destinataire: 'khalidelasri534@gmail.com',
                commande: orderData.orderNumber,
                client: orderData.customerName,
                montant: `${orderData.totalAmount} DH`,
                email_client: orderData.customerEmail,
                telephone: orderData.customerPhone
            });

            return false;
        }
    }

    // Envoyer un email de confirmation au client
    static async sendOrderConfirmation(customerEmail: string, orderData: any): Promise<boolean> {
        try {
            // Pour l'instant, on simule l'envoi de confirmation au client
            console.log('📧 SIMULATION - Email de confirmation envoyé au client:', {
                destinataire: customerEmail,
                sujet: `Confirmation de commande - ${orderData.orderNumber}`,
                message: 'Votre commande a été reçue et est en cours de traitement.'
            });
            return true;
        } catch (error) {
            console.error('Erreur envoi email de confirmation:', error);
            return false;
        }
    }
}

// Instructions pour configurer EmailJS:
/* 
1. Créez un compte sur https://www.emailjs.com/
2. Créez un service email (Gmail, Outlook, etc.)
3. Créez un template d'email avec les variables suivantes:
   - {{to_email}}
   - {{subject}}
   - {{order_number}}
   - {{customer_name}}
   - {{customer_email}}
   - {{customer_phone}}
   - {{total_amount}}
   - {{items_list}}
   - {{shipping_address}}
   - {{payment_method}}
   - {{notes}}
4. Remplacez les valeurs EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID et EMAILJS_PUBLIC_KEY
5. Appelez EmailService.init() au démarrage de l'application
*/
