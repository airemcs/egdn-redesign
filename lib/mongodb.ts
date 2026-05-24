import mongoose from 'mongoose';

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const cached = global._mongooseCache ?? (global._mongooseCache = { conn: null, promise: null });

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  // Lazy-read so an import of this module never throws at evaluation time
  // (which would crash the entire route module before any handler runs).
  // We still surface a clear error if a DB call is attempted without the
  // env var configured.
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      'MONGODB_URI is not defined in environment variables. ' +
        'On Vercel: Project → Settings → Environment Variables → add MONGODB_URI ' +
        '(plus RESEND_API_KEY and EGDN_NOTIFY_EMAIL) for Production + Preview + Development, ' +
        'then redeploy.'
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { bufferCommands: false });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
