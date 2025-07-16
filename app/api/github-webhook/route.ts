import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Load secret from env
const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET!;

function verifySignature(body: string, signature: string | undefined) {
  if (!signature) return false;

  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = `sha256=${hmac.update(body).digest('hex')}`;

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-hub-signature-256') || '';
    const body = await request.text(); // must use text(), not json(), for signature verification

    if (!verifySignature(body, signature)) {
      console.warn('🚨 Invalid GitHub signature!');
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);

    if (payload.ref !== 'refs/heads/main') {
      console.log('⏭️ Push not to main branch. Ignoring.');
      return NextResponse.json({ message: 'Not main branch' }, { status: 200 });
    }

    console.log('✅ Valid webhook received. Deploying...');
    const { stdout, stderr } = await execAsync('bash ~/webconcoctionP3/deploy.sh');

    if (stderr) console.error('Deploy stderr:', stderr);
    console.log('Deploy stdout:', stdout);

    return NextResponse.json({ message: 'Deployment triggered' }, { status: 200 });
  } catch (err: any) {
    console.error('🔥 Webhook error:', err);
    return NextResponse.json({ message: 'Webhook error', error: err.message }, { status: 500 });
  }
}