# Accessibility

Kitzy helps households in Luxembourg prepare for 72 hours on their own during an emergency. An app like this has to work for everyone, and most of all for people who already face barriers: an emergency is the worst moment to be locked out of your own plan.

## Our target

Kitzy aims to conform to **[RAWeb 1.1](https://accessibilite.public.lu/fr/raweb1/) at level AA**, the Luxembourg web accessibility framework, based on the European standard **EN 301 549** and **WCAG 2.1 level AA**. Future native apps will follow **RAAM 1.1**, its mobile counterpart.

## Made accessible with CheckFox.eu

Kitzy's accessibility work is carried out with **[CheckFox.eu](https://checkfox.eu)**, an accessibility auditing tool. We use it to review Kitzy screen by screen against the RAWeb criteria, track what still needs fixing, and check colour contrast.

## How we check

- **Audits with [CheckFox.eu](https://checkfox.eu)** against RAWeb 1.1, before releases.
- **Automated checks on every pull request**: the end-to-end test suite runs [axe-core](https://github.com/dequelabs/axe-core) on the app's screens and the home page, in both the light and the dark theme, on mobile and desktop layouts. A pull request that introduces a violation fails.
- **Linting**: [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) catches common mistakes while writing code.
- **Colour contrast is tested in code**: every text and background pair of both themes must reach at least 4.5:1, or the unit tests fail.

Automated tools find only part of the problems, and no audit replaces the people who use Kitzy. If something gets in your way, please tell us (see below).

## What is built in

- Every feature works with the **keyboard**, with a visible focus indicator and a "skip to content" link.
- After each navigation, **focus moves to the page title**, so screen reader users know where they are.
- Changes that happen without a page load (an item saved, a purchase ticked) are **announced to screen readers**.
- Form fields have **visible labels**, and their hints and error messages are linked to them.
- **Light and dark themes**, following the device setting or chosen in the app. Information is never given by colour alone.
- **Motion can be turned off**: Kitzy follows the device's "reduce motion" setting, and you can also switch animations off in the settings.
- **Windows high contrast mode** (forced colours) is taken into account, so controls keep visible outlines.
- The interface is available in **French, English, German, Luxembourgish and Portuguese**, and each page declares its language.
- Kitzy **works offline** once opened, and stores everything on your device.
- The emergency plan can be **printed** as a structured document, with empty lines to fill in by hand.
- Illustrations of Kitzy the hedgehog are decorative: they never carry information on their own, and screen readers skip them.

## Known limitations

- **Translations**: the German, Luxembourgish and Portuguese texts still need a review by native speakers. Some wording may be unclear.
- **Windows and dialogs from your device** (fingerprint or face unlock, the share sheet, the print dialog) belong to your browser or operating system. Their accessibility depends on them, not on Kitzy.
- **The printed plan** comes from your browser's "Print" or "Save as PDF" feature. The resulting PDF is not a tagged, accessible PDF.
- **External websites** linked from Kitzy (shops such as Amazon or Decathlon, official Luxembourg websites) are outside our control.

## Report a problem

If any part of Kitzy is hard or impossible to use for you, please **[open an issue on this repository](https://github.com/geoffreycrofte/survival-kit/issues/new)**. You don't need to know anything about code: describe the problem in your own words, in English or French.

It helps us a lot if you can include:

- the screen or page where it happened;
- your device and its operating system (for example: iPhone with iOS 18, Windows 11 laptop);
- your browser;
- the assistive technology you use, if any (for example: VoiceOver, NVDA, TalkBack, screen magnifier, voice control);
- what you tried to do, what happened, and what you expected.

Please don't put personal information in the issue (your emergency plan, health details, phone numbers): issues are public.

We treat accessibility problems as bugs, not as feature requests.

---

_Last reviewed: October 2026._
