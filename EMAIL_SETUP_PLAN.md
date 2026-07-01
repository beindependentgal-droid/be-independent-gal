# BIG Email Platform Plan

## Recommended stack
- Auth emails: Supabase Auth
- Welcome / transactional emails: Resend
- Community emails: Resend
- Newsletters: Resend audiences
- Future growth: Brevo if list volume grows beyond Resend's comfort zone

## Recommended sender addresses
- hello@beindependentgal.com
- support@beindependentgal.com
- community@beindependentgal.com
- newsletter@beindependentgal.com
- noreply@beindependentgal.com

## Initial implementation priorities
1. Contact form delivery
2. Password reset emails
3. Verification emails
4. Welcome emails
5. Newsletter and community digests

## Environment variables
RESEND_API_KEY=
RESEND_FROM_EMAIL=
CONTACT_TO_EMAIL=
