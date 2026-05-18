# WhatsApp Access Plan

## Dashboard Scope

For the next phase, the dashboard should focus on the three active teacher tools:

- Schemes of Work
- Lesson Plans
- Teaching Notes

The remaining dashboard/sidebar items should be hidden for now, while keeping their code and routes available for later reintroduction.

## Product Direction

WhatsApp should become a second access point for MwalimuKit, not a separate product. Teachers should be able to chat with a WhatsApp number and request the same core services available on the website.

The website remains the full workspace for editing, viewing, downloading, and managing documents. WhatsApp should focus on quick creation, guided prompts, recent documents, and document links.

## Proposed Architecture

```text
Teacher WhatsApp message
        ↓
WhatsApp Cloud API webhook
        ↓
/api/whatsapp/webhook
        ↓
Conversation and intent router
        ↓
Existing MwalimuKit generators
        ↓
Saved document in database
        ↓
WhatsApp reply with summary and website link
```

## Teacher Identity

Teachers should link their WhatsApp number from the website first. Incoming WhatsApp messages can then be matched to the teacher account by phone number.

If an unknown number messages the bot, the bot should reply with a link to sign in and connect WhatsApp.

## Conversation Principle

The WhatsApp experience should not feel like filling a long form. The teacher should describe what they need naturally, and the bot should ask only for missing details.

Both menu-style and natural-language starts should work:

```text
1
```

```text
Create a Grade 7 English lesson plan on oral narratives
```

## Main Menu

```text
Hi Teacher Mary. What would you like to create today?

1. Lesson plan
2. Scheme of work
3. Teaching notes
4. My recent documents
```

## Lesson Plan Flow

Example teacher message:

```text
Create a Grade 6 Science lesson plan on separating mixtures
```

The bot should extract:

- Tool: Lesson plan
- Grade
- Learning area
- Topic

Then ask for missing details only, such as:

```text
Which lesson duration should I use?

1. 35 minutes
2. 40 minutes
3. 45 minutes
4. Other
```

Before generation:

```text
I will prepare a CBE-aligned lesson plan for Grade 6 Science on separating mixtures.
Reply YES to generate, or EDIT to change details.
```

After generation:

```text
Your lesson plan is ready.

Title: Separating Mixtures
Grade: 6
Duration: 40 minutes

Open or download it here:
https://mwalimukit.com/lesson-plans/abc123
```

## Scheme Of Work Flow

Example teacher message:

```text
Make a Grade 7 Mathematics scheme for Term 2
```

The bot should ask for missing details such as year, number of teaching weeks, and whether to include holidays or midterm breaks.

Before generation:

```text
I will create a Grade 7 Mathematics Term 2 scheme of work for 10 weeks.
Reply YES to generate, or EDIT to change details.
```

After generation:

```text
Your scheme of work is ready.

Grade 7 Mathematics
Term 2, 2026

Open or download it here:
https://mwalimukit.com/schemes/abc123
```

## Teaching Notes Flow

Example teacher message:

```text
Prepare notes on photosynthesis for Grade 8
```

The bot should ask for missing details such as learning area, note style, and whether to include questions.

Possible note styles:

- Short classroom notes
- Detailed teacher notes
- Learner handout

Before generation:

```text
I will prepare detailed Grade 8 Integrated Science notes on photosynthesis with questions.
Reply YES to generate, or EDIT to change details.
```

After generation:

```text
Your teaching notes are ready.

Topic: Photosynthesis
Grade: 8
Style: Detailed teacher notes

Open or download here:
https://mwalimukit.com/notes/abc123
```

## Correction Flow

Teachers should be able to correct details naturally without restarting.

Examples:

```text
No, make it Grade 5
```

```text
Use Kiswahili instead
```

Bot reply:

```text
Updated: Grade 5.

Current request:
Lesson plan
Grade 5
Science
Topic: Separating mixtures
Duration: 40 minutes

Reply YES to generate, or EDIT to change more.
```

## Recent Documents Flow

Teacher message:

```text
Show my documents
```

Bot reply:

```text
Here are your recent documents:

1. Grade 7 Maths Scheme - Term 2
2. Photosynthesis Notes - Grade 8
3. Fractions Lesson Plan - Grade 6

Reply with a number to open, or DOWNLOAD 2 to get the PDF.
```

## MVP Recommendation

The first WhatsApp version should support:

- Linked teacher accounts by phone number
- Natural-language and menu-based starts
- Lesson plan creation
- Scheme of work creation
- Teaching notes creation
- Recent documents
- Website links for viewing and downloading generated documents

The MVP should avoid sending full long documents inside WhatsApp. It should send a concise confirmation and a link to the website document.
