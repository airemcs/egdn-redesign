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
    // Source matches the surface that submitted the request:
    //   - profile               — in-person, dentist pre-selected from /dentist/[slug]
    //   - profile-teleconsult   — teleconsult, dentist pre-selected
    //   - standalone            — in-person, picked through /book-appointment wizard
    //   - teleconsult           — teleconsult through /book-appointment wizard
    source: {
      type: String,
      enum: ['profile', 'profile-teleconsult', 'standalone', 'teleconsult'],
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type AppointmentRequest = InferSchemaType<typeof AppointmentRequestSchema> & {
  _id: mongoose.Types.ObjectId;
};

const AppointmentRequest =
  models.AppointmentRequest ?? model('AppointmentRequest', AppointmentRequestSchema);
export default AppointmentRequest;
