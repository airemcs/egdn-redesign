import mongoose, { Schema, model, models, type InferSchemaType } from 'mongoose';

const DentistClinicSchema = new Schema(
  {
    clinicName: { type: String, required: true },
    address: { type: String, required: true },
    region: { type: String, required: true },
    city: { type: String, required: true },
    schedule: { type: String, required: true },
    contactNumber: { type: String, required: true },
    nearestLandmark: { type: String, required: true },
    googleMapsUrl: { type: String, required: true },
  },
  { _id: false }
);

const DentistSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    specializations: [{ type: String }],
    clinics: { type: [DentistClinicSchema], required: true },
    headshotUrl: { type: String },
  },
  { timestamps: true }
);

DentistSchema.index({ 'clinics.region': 1 });
DentistSchema.index({ 'clinics.region': 1, 'clinics.city': 1 });

export type DentistClinic = InferSchemaType<typeof DentistClinicSchema>;
export type Dentist = InferSchemaType<typeof DentistSchema> & { _id: mongoose.Types.ObjectId };

const Dentist = models.Dentist ?? model('Dentist', DentistSchema);
export default Dentist;
