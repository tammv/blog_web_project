import Payment from '../models/payment.model.js';
import PayOS from "@payos/node";
import dotenv from "dotenv";
dotenv.config();
const payOS = new PayOS(process.env.PAYOS_CLIENT_ID, process.env.PAYOS_API_KEY, process.env.PAYOS_CHECKSUM_KEY);

// Create a new payment with payment link
export const createPaymentWithLink = async (req, res) => {
    const { userID, orderCode, amount, description, returnUrl, cancelUrl } = req.body;

    // Prepare payment body
    const body = {
        orderCode,
        amount,
        description,
        returnUrl,
        cancelUrl
    };

    try {
        console.log(req.body);
        // Create payment link
        const paymentLinkResponse = await payOS.createPaymentLink(body);
        console.log(paymentLinkResponse);

        // Get current date in YYYY-MM-DD format
        const today = new Date();
        const dateOfPayment = today.toISOString().split('T')[0];
        console.log(dateOfPayment);

        const newPayment = new Payment({ 
            paymentId: paymentLinkResponse.orderCode, 
            isStatus: false,
            dateOfPayment: dateOfPayment,
            description: paymentLinkResponse.description,
            price: paymentLinkResponse.amount,
            userId: userID
        });
        const savedPayment = await newPayment.save();
        console.log(savedPayment);
        res.status(201).json(paymentLinkResponse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Create a new payment
export const createPayment = async (req, res) => {
    try {
        const newPayment = new Payment(req.body);
        const savedPayment = await newPayment.save();
        res.status(201).json(savedPayment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all payments
export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find();
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a payment by ID
export const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a payment by ID
export const updatePaymentById = async (req, res) => {
    try {
        const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(updatedPayment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a payment by ID
export const deletePaymentById = async (req, res) => {
    try {
        const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
        if (!deletedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
