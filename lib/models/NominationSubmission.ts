import mongoose, { Schema, model, models, type InferSchemaType } from 'mongoose';

const NominationSubmissionSchema = new Schema(
  {
    nominatorName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    dentistName: { type: String, required: true },
    clinicName: { type: String, required: true },
    clinicAddress: { type: String, required: true },
    reason: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type NominationSubmission = InferSchemaType<typeof NominationSubmissionSchema> & {
  _id: mongoose.Types.ObjectId;
};

const NominationSubmission =
  models.NominationSubmission ?? model('NominationSubmission', NominationSubmissionSchema);
export default NominationSubmission;
