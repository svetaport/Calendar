export async function ensureAnonymousSession(supabaseClient) {
  const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
  if (sessionError) throw sessionError;
  if (sessionData.session) return sessionData.session;

  const { data, error } = await supabaseClient.auth.signInAnonymously();
  if (error) throw error;
  if (!data.session) throw new Error('Could not create a private browser session.');
  return data.session;
}

export async function ensureCalendarAccess({ supabaseClient, calendarId, location, history }) {
  await ensureAnonymousSession(supabaseClient);
  const url = new URL(location.href);
  const inviteToken = url.searchParams.get('invite');

  if (inviteToken) {
    const { data, error } = await supabaseClient.rpc('redeem_calendar_invite', {
      invite_token: inviteToken,
      target_calendar_id: calendarId,
    });
    if (error || !data) throw new Error('This invite link is invalid or expired.');

    url.searchParams.delete('invite');
    history.replaceState({}, '', url.toString());
  }

  const { data, error } = await supabaseClient.rpc('is_calendar_member', {
    target_calendar_id: calendarId,
  });
  if (error || !data) throw new Error('This browser does not have access to this calendar.');
}
