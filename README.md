# Mentor Market

![Mentor Market logo](https://mentors.atlbitlab.com/mentor-market-poster.jpg)

[![Netlify Status](https://api.netlify.com/api/v1/badges/4ab84b58-884a-4906-86ed-9c953188d619/deploy-status)](https://app.netlify.com/sites/mentor-market/deploys)

## About

### Problem

Digital entrepreneurship can seem like a daunting task that involves creating a product or managing inventory. How can we encourage V4V (Value 4 Value) in a way that feels more accessible and less daunting to first-time entrepreneurs?

### Solution

Everybody knows _something_, and there's likely always somebody who _wants to know what you know_. Mentor Market is a web app where you advertise one-on-one lessons for things you know how to do.

For example, do you know how write code? Design graphics? Do yoga? Cook? You can advertise all these and much more with Mentor Market!

Your posts are tied to your Nostr profile for social proof, and payments happen with Bitcoin.

These thesis is that encouraging people to sell mentoring sessions for topics they are well-versed in creates a more frictionless onboarding to the world of entrepreneurship.

## Technical

### Tech Stack

Here are the current technical limitations of Mentor Market:

- Private relay: Mentor Market web app broadcasts Kind 1 events with where the lesson data is encoded as strigified JSON in the `content` field.
  - This means you shouldn't use the `nostr.mentors.atlbitlab.com` relay for anything other than Lesson posts. 
  - This also means that, at the moment, you can only us MM with this relay (or another relay that is dedicated for MM lessons)
  - This is not a huge blocker. In our opinion, the value of Nostr in this use-case is tying the lesson to an identity that has social proof, and all your social proof will be out their on other relays.
  - However, in the future, perhaps this could be extended to use other relays or to have a special Kind dedicated to lesson posting. TBD.
  - To use the relay, you need to be on the whitelist or [pay a fee of 21 sats](https://nostr.mentors.atlbitlab.com/invoices).
- Damus: currently, this uses the `relay.damus.io` relay for pulling down Kind 0 profile data. In the future, this should be extended to pull profile data from a variety of relays.
- No image uploading at the moment, but that would be an awesome feature

### Development

To run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
