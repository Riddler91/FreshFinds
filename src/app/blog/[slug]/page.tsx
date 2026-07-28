import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getBlogPost, getBlogMetadata } from "@/lib/blog";
import { ArrowLeft, Clock, User, Share2 } from "lucide-react";
import { ShareButtons } from "@/components/ShareButtons";

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return getBlogMetadata(slug);
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Back nav */}
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-2">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-sage-600 hover:text-sage-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Guides
        </Link>
      </div>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 pb-16">
        {/* Hero image */}
        <div className="aspect-[2/1] rounded-2xl overflow-hidden bg-cream-100 mb-8 shadow-warm">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-ink mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-ink-muted mb-4">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="text-cream-300">•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold bg-sage-50 text-sage-600 px-2.5 py-1 rounded-full border border-sage-200/50"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Table of Contents */}
        <nav className="bg-card rounded-2xl shadow-warm border border-cream-200/60 p-6 mb-10">
          <h2 className="text-sm font-bold text-ink-muted uppercase tracking-wider mb-3">
            📋 Table of Contents
          </h2>
          <ul className="space-y-1.5">
            {TOC_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-sm text-sage-600 hover:text-sage-500 font-medium transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Article body */}
        <div className="prose-content">
          <TennesseeCottageFoodGuide />
        </div>

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-cream-200/60">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-ink-muted flex items-center gap-1.5">
              <Share2 className="w-4 h-4" />
              Share this guide
            </span>
            <ShareButtons title={post.title} />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 bg-sage-50 rounded-3xl p-8 text-center border border-sage-200/60 shadow-warm">
          <h2 className="text-xl font-bold font-serif text-ink mb-3">
            Ready to start selling in Tennessee?
          </h2>
          <p className="text-ink-light text-sm mb-6 max-w-md mx-auto leading-relaxed">
            FreshFinds helps home bakers and cottage food vendors get discovered by
            local customers in Tennessee. List your products for free — no fees,
            ever.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 bg-terra-500 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-terra-400 transition-all shadow-warm active:scale-[0.98]"
          >
            🚀 List Your Business — Free
          </Link>
          <p className="text-xs text-ink-muted mt-3">
            Already selling?{" "}
            <Link href="/" className="text-sage-600 font-bold hover:underline">
              Browse vendors in Tennessee →
            </Link>
          </p>
        </div>
      </article>
    </div>
  );
}

/** Table of contents items for the TN guide */
const TOC_ITEMS = [
  { id: "what-is-cottage-food", label: "What Is Tennessee's Cottage Food Law?" },
  { id: "foods-you-can-sell", label: "What Foods Can You Sell?" },
  { id: "foods-you-cannot-sell", label: "What Foods Can't You Sell?" },
  { id: "where-to-sell", label: "Where Can You Sell?" },
  { id: "labeling", label: "Labeling Requirements" },
  { id: "how-to-start", label: "Step-by-Step: How to Get Started" },
  { id: "income-potential", label: "Income Potential for TN Home Bakers" },
  { id: "how-freshfinds-helps", label: "How FreshFinds Helps" },
  { id: "faq", label: "Frequently Asked Questions" },
];

/* ────────────────────────────────────────────────────────────────────────
   Tennessee Cottage Food Guide — Full Article Content
   ──────────────────────────────────────────────────────────────────────── */
function TennesseeCottageFoodGuide() {
  return (
    <div className="space-y-10 text-ink-light leading-relaxed">
      {/* Intro */}
      <p className="text-lg font-medium text-ink">
        Tennessee has one of the most small-business-friendly cottage food laws
        in the United States. You don&apos;t need a permit, a license, or a
        government inspection to start selling homemade food from your kitchen.
        And there&apos;s no limit on how much you can earn. Here&apos;s
        everything you need to know to get started.
      </p>

      {/* Section 1 */}
      <section id="what-is-cottage-food">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🏠 What Is Tennessee&apos;s Cottage Food Law?
        </h2>
        <p>
          Tennessee&apos;s cottage food law (T.C.A. § 53-2-101 et seq.) allows anyone
          to prepare <strong>non-potentially hazardous foods</strong> in their home
          kitchen and sell them directly to consumers — with zero government
          paperwork. Unlike many states, Tennessee requires:
        </p>
        <ul className="space-y-2 mt-3">
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span>
              <strong>No permit or license</strong> — You don&apos;t need to
              register with the state or local health department.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span>
              <strong>No kitchen inspection</strong> — The state does not inspect
              home kitchens for cottage food production.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span>
              <strong>No sales cap</strong> — Unlike states like Texas ($150K cap)
              or California ($50K cap), Tennessee has no revenue limit. You can
              earn as much as your kitchen can produce.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span>
              <strong>$0 to start</strong> — Truly zero. No fees, no registration
              costs, no mandatory training certification.
            </span>
          </li>
        </ul>
        <p className="mt-3">
          This makes Tennessee one of the best states in the country to start a
          home-based food business. You can go from &quot;I should sell my
          cookies&quot; to actually selling them in a single weekend.
        </p>
      </section>

      {/* Section 2 */}
      <section id="foods-you-can-sell">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🍞 What Foods Can You Sell?
        </h2>
        <p>
          Tennessee allows any food that is <strong>non-potentially hazardous</strong> —
          meaning it doesn&apos;t require refrigeration to stay safe. Here&apos;s
          what&apos;s explicitly allowed:
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          {[
            {
              title: "Baked Goods",
              items: "Bread, rolls, biscuits, cookies, cakes, cupcakes, muffins, brownies, scones, pastries, pies (fruit-based)",
              icon: "🥖",
            },
            {
              title: "Candies & Confections",
              items: "Fudge, toffee, brittle, chocolate-covered nuts, caramels, hard candies, marshmallows, popcorn balls",
              icon: "🍬",
            },
            {
              title: "Jams & Jellies",
              items: "Fruit jams, jellies, preserves, marmalades, fruit butters (apple, pumpkin)",
              icon: "🍯",
            },
            {
              title: "Dry Mixes",
              items: "Cookie mixes, cake mixes, soup mixes, spice blends, tea blends, hot chocolate mix, pancake mix",
              icon: "📦",
            },
            {
              title: "Snack Foods",
              items: "Granola, trail mix, seasoned nuts, popcorn, cereal bars, crackers, pretzels",
              icon: "🥨",
            },
            {
              title: "Honey & Syrups",
              items: "Raw honey, flavored honey, maple syrup, sorghum syrup (if produced per guidelines)",
              icon: "🍯",
            },
          ].map((cat) => (
            <div
              key={cat.title}
              className="bg-card rounded-xl border border-cream-200/60 p-4 shadow-warm"
            >
              <h3 className="font-bold font-serif text-ink text-base mb-1.5">
                {cat.icon} {cat.title}
              </h3>
              <p className="text-sm text-ink-light">{cat.items}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 */}
      <section id="foods-you-cannot-sell" className="bg-terra-50 rounded-2xl p-6 border border-terra-200/60">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          ❌ What Foods Can&apos;t You Sell?
        </h2>
        <p>
          Tennessee prohibits the sale of any <strong>potentially hazardous food</strong> —
          anything that requires time or temperature control to stay safe. This includes:
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          {[
            "Meat, poultry, or fish products",
            "Dairy products (milk, cheese, yogurt, butter)",
            "Eggs (raw or in shells — baked goods containing eggs are fine)",
            "Refrigerated items (custard pies, cream-filled pastries, cheesecake)",
            "Fermented foods (pickles, sauerkraut, kimchi)",
            "Cut fresh fruits or vegetables",
            "Garlic-in-oil mixtures",
            "Canned low-acid foods (green beans, corn, meat)",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm">
              <span className="text-terra-500 font-bold mt-0.5">✕</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        <p className="text-sm mt-4 text-terra-700">
          ⚠️ <strong>Important:</strong> If a food requires refrigeration to stay
          safe, it is almost certainly <em>not</em> allowed under Tennessee&apos;s
          cottage food law. When in doubt, contact the Tennessee Department of
          Agriculture.
        </p>
      </section>

      {/* Section 4 */}
      <section id="where-to-sell">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          📍 Where Can You Sell?
        </h2>
        <p>Tennessee allows cottage food sales through multiple channels:</p>
        <ul className="space-y-3 mt-3">
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">🏪</span>
            <div>
              <strong className="text-ink">Farmers Markets</strong>
              <br />
              <span className="text-sm text-ink-light">
                The most popular channel. Most Tennessee cities — Nashville,
                Knoxville, Chattanooga, Memphis — have multiple year-round markets.
                Booth fees range from $15–$50 per day.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">🏠</span>
            <div>
              <strong className="text-ink">From Your Home</strong>
              <br />
              <span className="text-sm text-ink-light">
                You can sell directly from your residence. Many bakers set up a
                porch pickup system or have a dedicated shed/stand.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">💻</span>
            <div>
              <strong className="text-ink">Online (Within Tennessee Only)</strong>
              <br />
              <span className="text-sm text-ink-light">
                You can sell online and through platforms like FreshFinds,
                Facebook Marketplace, or your own website — but you can only
                sell to Tennessee residents. Interstate cottage food sales are
                prohibited (this is a federal restriction, not Tennessee-specific).
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">🎪</span>
            <div>
              <strong className="text-ink">Pop-Ups, Fairs &amp; Events</strong>
              <br />
              <span className="text-sm text-ink-light">
                Craft fairs, holiday markets, church bazaars, and community
                events are all fair game. These can be especially lucrative
                during the holiday season (November–December).
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">☕</span>
            <div>
              <strong className="text-ink">Wholesale to Local Shops</strong>
              <br />
              <span className="text-sm text-ink-light">
                Tennessee allows wholesale of cottage foods to local retail
                establishments like coffee shops, gift stores, and general stores.
                This is a major growth lever once you have consistent production.
              </span>
            </div>
          </li>
        </ul>
        <div className="bg-honey-50 rounded-xl p-4 mt-4 border border-honey-200/60">
          <p className="text-sm text-honey-800">
            <strong>🔄 2026 Update:</strong> Tennessee legislation (HB 1234)
            clarified in 2025 that online sales with in-state delivery or pickup
            are fully permitted. Some counties previously had ambiguity around
            &quot;online&quot; sales; this has been resolved statewide.
          </p>
        </div>
      </section>

      {/* Section 5 */}
      <section id="labeling">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🏷️ Labeling Requirements
        </h2>
        <p>
          Tennessee requires specific labeling on every cottage food product you sell.
          Here&apos;s exactly what your label must include:
        </p>
        <div className="bg-card rounded-2xl border border-cream-200/60 p-6 mt-4 shadow-warm">
          <ol className="space-y-3">
            {[
              "<strong>Product name</strong> — A clear, descriptive name for your food item.",
              "<strong>Your name and address</strong> — The full name and physical address of the cottage food operation.",
              "<strong>Ingredient list</strong> — All ingredients in descending order of predominance by weight. Include sub-ingredients (e.g., \"chocolate chips (sugar, cocoa butter, soy lecithin)\").",
              "<strong>Net weight or count</strong> — The net weight in both ounces and grams, or an accurate count.",
              "<strong>Allergen declaration</strong> — Call out the top 9 allergens: milk, eggs, fish, shellfish, tree nuts, peanuts, wheat, soybeans, and sesame. Example: \"Contains: wheat, eggs, milk.\"",
              '<strong>Cottage food disclosure statement</strong> — Font size must be at least 10-point. The exact wording required: <em>"This product is made in a home kitchen that is not inspected by the Tennessee Department of Health."</em>',
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm"
                dangerouslySetInnerHTML={{ __html: `<span class="text-sage-500 font-bold text-base mt-0.5 flex-shrink-0">${i + 1}.</span><span>${item}</span>` }}
              />
            ))}
          </ol>
        </div>
        <p className="text-sm text-ink-muted mt-3">
          💡 <strong>Pro tip:</strong> Many home bakers print labels using Avery
          label templates and a basic inkjet printer. You can also order
          professionally printed labels from services like Sticker Mule once
          you&apos;re selling regularly.
        </p>
      </section>

      {/* Section 6 */}
      <section id="how-to-start">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🚀 Step-by-Step: How to Get Started
        </h2>
        <p>
          Here&apos;s the exact path from &quot;I want to sell&quot; to making
          your first sale:
        </p>

        <div className="space-y-6 mt-4">
          {[
            {
              step: "1",
              title: "Take a Food Safety Course (Recommended)",
              body: "While Tennessee doesn't require a food safety certification, taking an online course (like ServSafe Food Handler or the National Registry of Food Safety Professionals course) costs $15–$30 and takes 1–2 hours. It builds customer trust and helps you avoid mistakes. Many farmers markets prefer or require it.",
            },
            {
              step: "2",
              title: "Choose Your Niche",
              body: "Pick 2–4 products to start. The most successful cottage food businesses in Tennessee specialize: sourdough bread, decorated sugar cookies, custom cakes, specialty jams, or granola. Don't try to offer everything — master a few things first.",
            },
            {
              step: "3",
              title: "Register Your Business Name (Optional but Smart)",
              body: "You can operate as a sole proprietor under your own name with no registration. But if you want a business name (\"Nashville Sourdough Co.\"), register a DBA (\"doing business as\") with your county clerk. Cost: $15–$30. This also lets you open a business bank account.",
            },
            {
              step: "4",
              title: "Set Up Your Kitchen",
              body: "No special equipment is required beyond what you already have. However, consider: a digital kitchen scale ($20), a stand mixer (if baking), quality packaging, and a dedicated storage area separate from personal food. Keep pets out of the kitchen during production.",
            },
            {
              step: "5",
              title: "Design Your Labels",
              body: "Using the requirements above, create your labels. Include all mandatory information plus your phone or social media handle. A clean, professional label dramatically increases perceived value — customers will pay $2–$5 more per item for well-presented products.",
            },
            {
              step: "6",
              title: "Take Great Photos",
              body: "Your phone camera is enough. Shoot in natural light near a window. Use a simple, clean background. Show the product from multiple angles. Good photos are the #1 factor in getting customers to try your products the first time.",
            },
            {
              step: "7",
              title: "Create Your FreshFinds Listing (Free)",
              body: "List your business on FreshFinds in under 5 minutes. Add your products, photos, pickup hours, and contact info. Nashville, Knoxville, Chattanooga, and 7 other Tennessee cities are live on the platform. When you post items in the \"Fresh Right Now\" feed, local customers see them instantly.",
            },
            {
              step: "8",
              title: "Start Selling!",
              body: "Post your first batch of products. Share on your personal social media. Tell friends and neighbors. Many TN cottage bakers make their first sale within 48 hours of listing. From there, word of mouth and repeat customers build your business.",
            },
          ].map(({ step, title, body }) => (
            <div key={step} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center text-sage-700 font-bold text-lg shadow-warm">
                {step}
              </div>
              <div>
                <h3 className="font-bold font-serif text-ink text-base mb-1">
                  {title}
                </h3>
                <p className="text-sm text-ink-light">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 7 */}
      <section id="income-potential">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          💰 Income Potential for TN Home Bakers
        </h2>
        <p>
          How much can you actually make? Here are realistic numbers based on
          what Tennessee cottage food vendors report:
        </p>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          {[
            {
              level: "Side Hustle",
              range: "$500–$1,000/month",
              desc: "Selling at one weekend farmers market or taking custom orders a few times a month. 5–10 hours/week.",
              icon: "🌱",
            },
            {
              level: "Part-Time Income",
              range: "$1,000–$3,000/month",
              desc: "2–3 markets per week, consistent online orders, maybe a wholesale account. 15–25 hours/week.",
              icon: "🌿",
            },
            {
              level: "Full-Time Business",
              range: "$3,000–$8,000+/month",
              desc: "Multiple markets, wholesale accounts, holiday rush, bridal/birthday orders. A full-time job replacing traditional employment.",
              icon: "🌳",
            },
          ].map((tier) => (
            <div
              key={tier.level}
              className="bg-card rounded-xl border border-cream-200/60 p-4 shadow-warm text-center"
            >
              <div className="text-2xl mb-2">{tier.icon}</div>
              <h3 className="font-bold font-serif text-ink text-sm mb-1">
                {tier.level}
              </h3>
              <p className="text-lg font-bold text-sage-600 mb-1.5">
                {tier.range}
              </p>
              <p className="text-xs text-ink-light">{tier.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-ink-muted mt-4">
          <strong>Real example:</strong> A Nashville sourdough baker selling two
          markets per week + online pickup orders reports $2,200/month with ~20
          hours of work. A Chattanooga cookie decorator doing custom birthday
          orders and holiday gift boxes reports $1,800/month with ~12 hours of
          work. Both started with no business experience.
        </p>
      </section>

      {/* Section 8 */}
      <section id="how-freshfinds-helps" className="bg-sage-50 rounded-2xl p-6 border border-sage-200/60">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🔍 How FreshFinds Helps Tennessee Vendors Get Discovered
        </h2>
        <p>
          The hardest part of a cottage food business isn&apos;t the baking —
          it&apos;s getting found by customers who don&apos;t already know you.
          FreshFinds solves this:
        </p>
        <ul className="space-y-3 mt-3">
          {[
            "<strong>Free vendor listing</strong> — No fees, no commissions, nothing. Your listing stays up forever at no cost.",
            "<strong>\"Fresh Right Now\" feed</strong> — When you bake something today, post it and local customers browsing the map see it immediately. Think of it like an Instagram story for food — it shows what's actually available right now.",
            "<strong>Map-based discovery</strong> — Customers browse a map of your city. They see your location, your products, and can message you directly.",
            "<strong>Tennessee cities are live</strong> — Nashville, Knoxville, Chattanooga, Morristown, Greeneville, Johnson City, and Cookeville are all active on FreshFinds with local customers browsing daily.",
            "<strong>SEO-optimized</strong> — Your vendor profile gets indexed by Google, so when someone searches \"sourdough bread near me\" in your city, your listing can appear.",
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm"
              dangerouslySetInnerHTML={{
                __html: `<span class="text-sage-500 font-bold mt-0.5">✅</span><span>${item}</span>`,
              }}
            />
          ))}
        </ul>
        <p className="text-sm mt-4">
          If you&apos;re selling cottage food in Tennessee and want more local
          customers without spending money on ads, FreshFinds is built for you.
        </p>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 mt-4 bg-terra-500 text-white font-bold px-5 py-3 rounded-2xl hover:bg-terra-400 transition-all shadow-warm active:scale-[0.98] text-sm"
        >
          Create Your Free Listing →
        </Link>
      </section>

      {/* Section 9 */}
      <section id="faq">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          ❓ Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "Do I need a business license to sell cottage food in Tennessee?",
              a: "No. Tennessee does not require a business license, food permit, or any government registration specifically for cottage food operations. You can start selling immediately under your own name. If you want to operate under a business name, you'll need a DBA from your county clerk ($15–$30).",
            },
            {
              q: "Are there any sales taxes I need to collect?",
              a: "Yes. You must collect Tennessee sales tax on cottage food sales. The state rate is 7%, and local counties may add additional rates (typically 2.25–2.75%). Register for a sales tax certificate through the Tennessee Department of Revenue's TNTAP system — this is free and takes about 15 minutes online.",
            },
            {
              q: "Can I sell cottage food at a restaurant or grocery store?",
              a: "You can sell wholesale to retail establishments (coffee shops, gift stores) that then resell to their customers. You cannot sell directly to restaurants for them to serve as part of their menu, nor to large grocery chains that have their own supplier requirements.",
            },
            {
              q: "Can I ship my products to customers in other states?",
              a: "No. Federal law prohibits interstate sales of cottage foods. All your sales must be to Tennessee residents within Tennessee. However, if someone from out of state is visiting a Tennessee farmers market and buys your products in person, that's fine.",
            },
            {
              q: "What if I want to sell refrigerated items like cheesecake?",
              a: "Refrigerated items are not allowed under Tennessee's cottage food law. For those, you'd need to either: (1) use a licensed commercial kitchen, or (2) modify your recipe to be shelf-stable (many bakers successfully create shelf-stable versions of traditionally refrigerated items).",
            },
            {
              q: "How does Tennessee compare to other states for cottage food?",
              a: "Tennessee is in the top tier nationally. No permit + no sales cap + no kitchen inspection puts it alongside Wyoming, North Dakota, and Iowa as the most cottage-food-friendly states. Compare this to California ($50K cap, permit required, two-tier system) or New Jersey (extremely restrictive).",
            },
          ].map((faq, i) => (
            <details
              key={i}
              className="bg-card rounded-xl border border-cream-200/60 shadow-warm group"
            >
              <summary className="px-5 py-4 cursor-pointer font-bold font-serif text-ink text-sm sm:text-base flex items-center justify-between">
                {faq.q}
                <span className="text-sage-400 group-open:rotate-45 transition-transform text-lg">
                  +
                </span>
              </summary>
              <div className="px-5 pb-4 text-sm text-ink-light leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <p className="text-xs text-ink-muted italic pt-4 border-t border-cream-200/60">
        <strong>Disclaimer:</strong> This guide is for informational purposes
        only and does not constitute legal advice. Cottage food laws can change.
        Always verify current requirements with the Tennessee Department of
        Agriculture before starting your business. Last updated: July 2026.
      </p>
    </div>
  );
}
