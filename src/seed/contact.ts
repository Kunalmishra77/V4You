import type { Faq } from '@/lib/seo'

/**
 * Contact page FAQs — docs/05 §23, "FAQAccordion (about working together)".
 *
 * These are the questions that come up before someone is willing to send a
 * form, which is a different set from the home page's. docs/04 §28 is clear
 * that an FAQ block is for genuine questions rather than a way to bulk out a
 * page — each of these is one a prospect actually asks.
 */
export const contactFaqs: Faq[] = [
  {
    question: 'What happens after I submit the form?',
    answer:
      'A person reads it and replies within one business day. The first call is 30 minutes, and we come with questions rather than slides. You leave with a suggested next step even if that step is not working with us.',
  },
  {
    question: 'Do I need to know what I want built?',
    answer:
      'No. Knowing what is not working is enough to have a useful conversation. If anything, arriving with a fixed solution makes the first call less valuable, because the interesting question is usually whether that solution is the right one.',
  },
  {
    question: 'Will you sign an NDA?',
    answer:
      'Yes. Tick the box on the form and we will bring one to the first conversation. Your details stay confidential either way — the NDA formalises something we already treat as the default.',
  },
  {
    question: 'How much does a project cost?',
    answer:
      'It depends on workflow complexity, integrations, data readiness, model usage, security requirements and support. We do not publish a starting figure, because a price quoted before scope is understood is either padded or about to be revised. After discovery you get a scope and a number attached to it.',
  },
  {
    question: 'Can we start small?',
    answer:
      'Usually that is the better shape. A paid discovery or a fixed-scope pilot proves whether the approach works before anyone commits to a build, and you own everything it produces regardless of what you decide next.',
  },
  {
    question: 'What if we already have an engineering team?',
    answer:
      'Then the question is what would help them most — an architecture review, a discrete workstream, or capacity in a specialism they do not have in-house. We work alongside internal teams regularly. What matters is that ownership of each decision is explicit.',
  },
]
