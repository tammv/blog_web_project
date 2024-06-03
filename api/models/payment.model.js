import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: true,
    },
    isStatus: {
      type: Boolean,
      required: true,
    },
    dateOfPayment: {
      type: Date,
    },
    description: {
      type: String,
    },
    price: {
      type: String,
      required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
  }, { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;