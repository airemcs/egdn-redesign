import mongoose, { Schema, model, models, type InferSchemaType } from 'mongoose';

const PartnerInquirySchema = new Schema(
  {
    type: { type: String, enum: ['employer', 'clinic'], required: true },
    organizationName: { type: String, required: true },
    contactName: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    employeeCount: { type: String }, // employer only: "1–50" | "51–200" | "201–500" | "500+"
    region: { type: String },        // clinic only
    message: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type PartnerInquiry = InferSchemaType<typeof PartnerInquirySchema> & {
  _id: mongoose.Types.ObjectId;
};

const PartnerInquiry = models.PartnerInquiry ?? model('PartnerInquiry', PartnerInquirySchema);
export default PartnerInquiry;
