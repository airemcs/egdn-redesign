import mongoose, { Schema, model, models, type InferSchemaType } from 'mongoose';

const ContactSubmissionSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type ContactSubmission = InferSchemaType<typeof ContactSubmissionSchema> & {
  _id: mongoose.Types.ObjectId;
};

const ContactSubmission =
  models.ContactSubmission ?? model('ContactSubmission', ContactSubmissionSchema);
export default ContactSubmission;
