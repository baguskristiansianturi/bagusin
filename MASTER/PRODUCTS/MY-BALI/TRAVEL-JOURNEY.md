# My Bali — Travel Journey, Evidence, and Sharing

**Status:** Exploratory product concept

## 1. Purpose

My Bali is envisioned as a place where a user can plan a Bali trip, keep a record of what they do, and optionally turn selected parts of that record into a public travel story.

The record should be useful as a personal memory and, when the user chooses, as an honest source of inspiration for other people.

## 2. Personal travel record

A travel record may contain:
- Date and time.
- Place or service.
- Itinerary position and route.
- Booking or transaction reference, where applicable.
- Photos, notes, and personal observations.
- User-entered activities or locations.
- Relevant status, such as planned, booked, completed, or cancelled.

The precise data model and evidence requirements are not yet decided.

## 3. Evidence levels must be explicit

The product should not label every entry as verified. Potential evidence categories include:

| Record type | What it can support |
|---|---|
| Confirmed transaction | Evidence that a supported transaction occurred |
| Confirmed booking | Evidence that a booking was made or confirmed |
| Provider-confirmed service | Evidence that the provider marked a service as delivered |
| User-recorded visit | A location/activity the user entered or recorded |
| User story | The user's own description, opinion, or memory |

A payment does not automatically prove attendance. A booking does not automatically prove completion. A GPS location does not automatically prove a purchase or a particular experience. Labels must reflect what the evidence actually establishes.

## 4. Privacy and publication control

Users should be able to:
- Keep their travel records private.
- Publish selected stories or itinerary segments.
- Share a public trip or profile.
- Change or revoke public visibility where technically and legally possible.
- Avoid exposing sensitive details such as exact accommodation room information, personal contact data, or private real-time whereabouts.

The default privacy settings, audience controls, retention rules, and deletion behavior require dedicated design.

## 5. Public travel stories

Public stories may help others discover:
- Places visited.
- The sequence of a trip.
- What the user enjoyed or would do differently.
- Approximate timing and travel considerations.
- Providers or activities involved, with evidence labels where applicable.

Public stories should not be treated as universally suitable itineraries. Conditions, prices, traffic, opening hours, and availability can change.

## 6. Social discovery without content pollution

The social layer is intended to support useful travel knowledge rather than become an unmoderated stream of spam. Potential content types may include trip stories, itinerary collections, experience notes, and provider announcements.

A future content policy should address:
- Spam and repetitive promotional posts.
- Fake experiences and fabricated evidence.
- Paid endorsements and commercial disclosures.
- Harassment, impersonation, and unsafe content.
- Reviews and conflicts of interest.
- Reporting, moderation, appeals, and account restrictions.

## 7. Reputation and levels

The founder has described a possible profile/level concept based on users' accumulated Bali experiences. This remains an idea, not an approved scoring system.

If developed, levels should reward trustworthy and useful participation rather than simply posting volume, spending, or popularity. The design must avoid exposing private travel history or creating incentives to fabricate visits.

## 8. Open questions

See OPEN-QUESTIONS.md for decisions about proof, publication, location tracking, privacy defaults, user levels, and moderation.
