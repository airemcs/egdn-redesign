import mongoose, { Schema, model, models, type InferSchemaType } from 'mongoose';

const AppointmentRequestSchema = new Schema(
  {
    memberName: { type: String, required: true },
    memberId: { type: String, required: true },
    dentistId: { type: Schema.Types.ObjectId, ref: 'Dentist' },
    dentistName: { type: String, required: true },
    clinicName: { type: String, required: true },
    preferredDate: { type: Date, required: true },
    preferredTime: {
      type: String,
      enum: ['Morning', 'Afternoon', 'Evening'],
      required: true,
    },
    contactNumber: { type: String, required: true },
    notes: { type: String },
    source: { type: String, enum: ['profile', 'standalone'], required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type AppointmentRequest = InferSchemaType<typeof AppointmentRequestSchema> & {
  _id: mongoose.Types.ObjectId;
};

const AppointmentRequest =
  models.AppointmentRequest ?? model('AppointmentRequest', AppointmentRequestSchema);
export default AppointmentRequest;
