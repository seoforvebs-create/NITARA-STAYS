/* ============================================================
   NITARA STAYS — Supabase Configuration
   ============================================================ */

const SUPABASE_URL    = 'YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

/* Initialise Supabase only when real credentials are supplied.
   Pages that reference window.supabase will safely skip DB calls
   and fall back to their static data when supabase is undefined. */
(function () {
  'use strict';
  if (
    SUPABASE_URL === 'YOUR_SUPABASE_PROJECT_URL' ||
    !SUPABASE_URL ||
    !SUPABASE_ANON_KEY
  ) {
    // Credentials not configured — all pages will use static/mock data
    window.supabase = null;
    return;
  }

  try {
    /* The CDN exposes the factory as window.supabase.createClient.
       We reassign window.supabase to the *client instance* so the
       rest of the codebase can simply call: supabase.from(...)     */
    const factory  = window.supabase;
    window.supabase = factory.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.warn('[Nitara] Supabase init failed:', err.message);
    window.supabase = null;
  }
})();

/*
  TABLES REQUIRED IN YOUR SUPABASE PROJECT:
  ─────────────────────────────────────────────────────────────
  1. destinations
     id, name, category, tagline, description, image_url,
     gallery_images (text[]), price_per_night, rating,
     amenities (text[]), created_at

  2. rooms
     id, destination_id, room_name, size_sqft, max_guests,
     price_per_night, image_url, description

  3. bookings
     id, booking_ref, destination_id, room_id, guest_name,
     guest_email, guest_phone, country, checkin_date,
     checkout_date, num_guests, addons (text[]),
     special_requests, total_price, status, created_at

  4. contact_messages
     id, name, email, phone, subject, message, created_at

  5. newsletter_subscribers
     id, email, subscribed_at

  6. itineraries
     id, guest_email, experiences (text[]),
     total_duration, estimated_cost, created_at

  7. admin_settings
     id, key, value
     (Insert row: key='admin_password', value='nitara2024')
  ─────────────────────────────────────────────────────────────
*/
