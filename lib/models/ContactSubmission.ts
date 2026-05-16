import mongoose, { Schema, model, models, type InferSchemaType } from 'mongoose';

const ContactSubmissionSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    // contactNumber is now optional — the redesigned form treats phone as an
    // optional field. Historical submissions stay valid because Mongoose
    // doesn't re-validate existing documents.
    contactNumber: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    // Optional context captured by the redesigned form
    role: { type: String, enum: ['member', 'company', 'provider', 'general'] },
    memberId: { type: String },
    company: { type: String },
    // Provider-role: Philippine region where the clinic is located. Stored as
    // the same string value as the seeded dentist data so cross-form joins
    // remain consistent.
    region: { type: String },
    // Company-role: rough employee headcount bucket — same options as the
    // partner-with-us employer inquiry form.
    employeeCount: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type ContactSubmission = InferSchemaType<typeof ContactSubmissionSchema> & {
  _id: mongoose.Types.ObjectId;
};

const ContactSubmission =
  models.ContactSubmission ?? model('ContactSubmission', ContactSubmissionSchema);
export default ContactSubmission;
