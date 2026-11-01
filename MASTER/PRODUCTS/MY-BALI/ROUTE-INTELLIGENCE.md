# My Bali — Itinerary, Route, and Transport Intelligence

**Status:** Exploratory concept; no algorithm or fare model approved

## 1. Purpose

My Bali should help users create journeys that are feasible in the real world, while allowing custom routes that may differ from common tourist itineraries.

The system should explain the practical implications of a choice rather than simply rejecting an unusual route.

## 2. Inputs that may affect an itinerary

Potential inputs include:
- Arrival and departure dates and times.
- Airport, port, accommodation, and other anchor locations.
- Places and activities selected by the user.
- Preferred visit dates and time windows.
- Estimated duration at each place.
- Operating hours and booking windows.
- Provider-reported availability.
- User preferences, budget, and transport needs.
- Traffic and route estimates where reliable data is available.

## 3. Feasibility and recommendations

The system may evaluate:
- Travel distance and estimated travel time.
- Whether the selected sequence fits the available time.
- Whether a venue is expected to be open.
- Whether a booking or reservation is available through a supported source.
- Whether the user has allowed enough time for an activity.
- Whether a route creates excessive backtracking or additional transport cost.

When a plan is infeasible, explain the conflict and offer alternatives. Recommendations should take account of the user's actual route and context, not only popularity or ratings.

## 4. Custom journeys are valid

Example: a user may choose to travel from Kintamani directly to Uluwatu on the same day. The system should assess travel time, schedule, and transport implications. It should not automatically label the journey wrong merely because it is not a typical route.

The user may still choose the route if they understand the longer journey and associated cost.

## 5. Transport and fare estimates

A future transport calculator may consider:
- Pickup and drop-off locations.
- Distance and expected duration.
- Vehicle category and passenger/luggage needs.
- Waiting time, stops, and custom requests.
- Time-of-day or other disclosed surcharges.
- Provider-specific pricing rules and availability.

A displayed estimate must be distinguished from a confirmed quote or booking. Pricing logic should be transparent and grounded in provider-defined rules; the platform must not invent a fare or imply a provider accepted a trip when they have not.

## 6. Provider availability

Availability may come from different levels of integration:
- Provider manually updates availability.
- Provider confirms a request.
- Availability is synchronized from a provider booking system.
- A supported reservation/booking integration returns live availability.

The interface should identify the reliability and freshness of the information. A listing being present does not mean it is available at the requested time.

## 7. Suggested user-facing states

Potential states include:
- Suggested itinerary.
- Needs user review.
- Time conflict.
- Provider availability not confirmed.
- Request sent to provider.
- Booking pending.
- Booking confirmed.
- Booking cancelled.

These are conceptual examples; final terminology and state transitions remain open.

## 8. Limitations and validation

Travel-time estimates, traffic, venue hours, availability, and prices can change. The product should communicate uncertainty and avoid presenting estimates as guarantees. Data sources, integrations, update frequency, and liability boundaries require further research.
