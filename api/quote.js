cat /mnt/user-data/outputs/api/quote.js
Output

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, phone, coverage } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Rotko Insurance <onboarding@resend.dev>',
        to: 'rotkoinsuranceagency@gmail.com',
        subject: `New Quote Request — ${firstName} ${lastName}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;background:#0d1f2d;color:#f0eee8;padding:40px;border-radius:8px;">
            <div style="border-bottom:1px solid rgba(201,168,76,0.3);padding-bottom:24px;margin-bottom:24px;">
              <h1 style="font-size:22px;color:#c9a84c;margin:0 0 4px;">New Quote Request</h1>
              <p style="color:#9eaab5;font-size:13px;margin:0;">Rotko Insurance Agency</p>
            </div>
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:10px 0;color:#9eaab5;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;width:140px;">Name</td>
                <td style="padding:10px 0;color:#f0eee8;font-size:15px;">${firstName} ${lastName}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#9eaab5;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;">Email</td>
                <td style="padding:10px 0;color:#f0eee8;font-size:15px;"><a href="mailto:${email}" style="color:#c9a84c;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#9eaab5;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;">Phone</td>
                <td style="padding:10px 0;color:#f0eee8;font-size:15px;">${phone || '—'}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#9eaab5;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;">Coverage</td>
                <td style="padding:10px 0;color:#f0eee8;font-size:15px;">${coverage || '—'}</td>
              </tr>
            </table>
            <div style="margin-top:32px;padding-top:24px;border-top:1px solid rgba(201,168,76,0.3);">
              <a href="mailto:${email}" style="background:#c9a84c;color:#0d1f2d;padding:12px 28px;text-decoration:none;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;font-family:sans-serif;">Reply to ${firstName}</a>
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Resend error:', err);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
Done
