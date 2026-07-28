import Link from "next/link";

export const alTocItems = [
  { id: "what-is-cottage-food", label: "What Is Alabama's Cottage Food Law?" },
  { id: "foods-you-can-sell", label: "What Foods Can You Sell?" },
  { id: "foods-you-cannot-sell", label: "What Foods Can't You Sell?" },
  { id: "requirements", label: "What Are the Requirements?" },
  { id: "where-to-sell", label: "Where Can You Sell?" },
  { id: "sales-cap", label: "Sales Cap" },
  { id: "labeling", label: "Labeling Requirements" },
  { id: "how-to-start", label: "Step-by-Step: How to Get Started" },
  { id: "income-potential", label: "Income Potential for AL Home Bakers" },
  { id: "how-freshfinds-helps", label: "How FreshFinds Helps" },
];

export function AlabamaCottageFoodGuide() {
  return (
    <div className="space-y-10 text-ink-light leading-relaxed">
      {/* Intro */}
      <p className="text-lg font-medium text-ink">
        Alabama&apos;s cottage food law was transformed in 2021 with a major
        amendment that removed the previous $20,000 sales cap and expanded allowed
        foods. Now with <strong>no sales cap</strong> and online sales permitted,
        Alabama is one of the most permissive states in the country. It does have
        one unique requirement — county health department approval — but here&apos;s
        everything you need to know to navigate it and start selling.
      </p>

      {/* Section 1 */}
      <section id="what-is-cottage-food">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🏠 What Is Alabama&apos;s Cottage Food Law?
        </h2>
        <p>
          Alabama enacted its cottage food law in 2014 and significantly amended it
          in 2021. It&apos;s administered by the Alabama Department of Public Health
          (ADPH). The 2021 amendment was a game-changer — it removed the $20,000 sales
          cap entirely, expanded allowed foods, and explicitly authorized online sales.
        </p>
        <ul className="space-y-2 mt-3">
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span>
              <strong>No state permit or license</strong> — No ADPH registration needed.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span>
              <strong>No sales cap</strong> — The 2021 amendment removed the
              previous $20,000 limit. Unlimited income potential.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span>
              <strong>Online sales permitted</strong> — Within Alabama only.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">⚠️</span>
            <span>
              <strong>Food safety course + county health department approval</strong> —
              Two steps. The food safety course is straightforward. The county
              approval is unique to Alabama — we&apos;ll walk you through it.
            </span>
          </li>
        </ul>
        <p className="mt-3">
          Before the 2021 amendment, Alabama was a moderate cottage food state.
          After it, Alabama became one of the best places in the country for home
          food businesses — the county approval step is a small hurdle worth clearing
          for unlimited earning potential.
        </p>
      </section>

      {/* Section 2 */}
      <section id="foods-you-can-sell">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🍞 What Foods Can You Sell?
        </h2>
        <p>
          Alabama allows any <strong>non-potentially hazardous food</strong> —
          meaning it doesn&apos;t require refrigeration to stay safe. Here&apos;s
          what&apos;s allowed (expanded by the 2021 amendment):
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          {[
            {
              title: "Baked Goods",
              items: "Breads, cakes, cookies, muffins, scones, pastries, brownies, fruit pies, biscuits",
              icon: "🥖",
            },
            {
              title: "Candies & Confections",
              items: "Fudge, truffles, chocolate bark, caramels, toffee, brittle, pralines, hard candies",
              icon: "🍬",
            },
            {
              title: "Jams & Jellies",
              items: "Fruit jams, pepper jellies, marmalades, fruit butters, mayhaw jelly (Alabama specialty!)",
              icon: "🍯",
            },
            {
              title: "Dry Mixes",
              items: "Cookie mixes, brownie mixes, soup mixes, cornbread mix, spice blends",
              icon: "📦",
            },
            {
              title: "Snack Foods",
              items: "Popcorn, roasted pecans (huge in AL!), crackers, granola",
              icon: "🥨",
            },
            {
              title: "Other Items",
              items: "Honey, vinegars, mustard, dry herbs, roasted coffee, dry tea",
              icon: "☕",
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
        <p className="text-sm text-ink-muted mt-3">
          🥜 <strong>Alabama is pecan country!</strong> Roasted, candied, or spiced
          pecans are a top-selling cottage food item in the state, especially during
          the holiday season. Mayhaw jelly is another beloved Alabama specialty with
          strong market demand.
        </p>
      </section>

      {/* Section 3 */}
      <section id="foods-you-cannot-sell" className="bg-terra-50 rounded-2xl p-6 border border-terra-200/60">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          ❌ What Foods Can&apos;t You Sell?
        </h2>
        <p>
          Alabama prohibits the sale of any <strong>potentially hazardous food</strong> —
          anything that requires time or temperature control to stay safe. This includes:
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          {[
            "Anything requiring refrigeration (cheesecakes, cream pies, custard pies)",
            "Meat products (no jerky, sausage, or meat of any kind)",
            "Dairy products as standalone items",
            "Low-acid canned foods (vegetables, soups, tomato sauce)",
            "Fermented foods (kombucha, kimchi)",
            "Pet treats",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm">
              <span className="text-terra-500 font-bold mt-0.5">✕</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4 */}
      <section id="requirements">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          📋 What Are the Requirements?
        </h2>
        <p>
          Alabama has two requirements. Here&apos;s exactly what you need:
        </p>
        <div className="space-y-4 mt-3">
          <div className="bg-card rounded-xl border border-cream-200/60 p-5 shadow-warm">
            <h3 className="font-bold font-serif text-ink text-base mb-2">
              1. Food Safety Course
            </h3>
            <p className="text-sm">
              Complete an approved food safety course. ServSafe Food Handler (~$15,
              ~2 hours, fully online) is the most common choice. Other ANSI-accredited
              courses are also accepted. This is straightforward — you can complete
              it in an afternoon and get your certificate immediately.
            </p>
          </div>
          <div className="bg-card rounded-xl border border-cream-200/60 p-5 shadow-warm">
            <h3 className="font-bold font-serif text-ink text-base mb-2">
              2. County Health Department Approval
            </h3>
            <p className="text-sm">
              This is Alabama&apos;s unique step. Each county health department must
              approve your cottage food operation. The process varies by county but
              typically involves a simple application and possibly a brief phone call
              or visit. Contact your county health department directly for their
              specific process. Fees range from $0–$50 depending on the county.
            </p>
            <p className="text-sm mt-2 text-ink-muted">
              💡 <strong>Pro tip:</strong> When you call, say: &quot;I&apos;m
              starting a cottage food business under Alabama&apos;s cottage food law
              and I need to know your county&apos;s approval process.&quot; Most
              county health departments have handled these before and can guide you
              quickly.
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm">
          No state-level kitchen inspection is typically required, but county
          requirements may vary. No state permit or ADPH registration is needed
          beyond the county approval step.
        </p>
      </section>

      {/* Section 5 */}
      <section id="where-to-sell">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          📍 Where Can You Sell?
        </h2>
        <p>Alabama allows cottage food sales through multiple channels:</p>
        <ul className="space-y-3 mt-3">
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">🏪</span>
            <div>
              <strong className="text-ink">Farmers Markets</strong>
              <br />
              <span className="text-sm text-ink-light">
                Birmingham&apos;s Pepper Place Market, Montgomery, Huntsville, and
                Mobile all have vibrant farmers market scenes. Booth fees: $15–$40
                per day.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">🏠</span>
            <div>
              <strong className="text-ink">From Your Home</strong>
              <br />
              <span className="text-sm text-ink-light">
                Porch pickup is perfectly legal and common across Alabama.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">💻</span>
            <div>
              <strong className="text-ink">Online (Within Alabama Only)</strong>
              <br />
              <span className="text-sm text-ink-light">
                Sell online and through platforms like FreshFinds — but only to
                Alabama residents. Interstate sales are prohibited.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">🛣️</span>
            <div>
              <strong className="text-ink">Roadside Stands</strong>
              <br />
              <span className="text-sm text-ink-light">
                Popular in Alabama&apos;s rural areas and along highways.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">🎪</span>
            <div>
              <strong className="text-ink">Events &amp; Festivals</strong>
              <br />
              <span className="text-sm text-ink-light">
                Church bazaars, craft fairs, holiday markets — Alabama&apos;s
                community event culture is strong and very cottage-food-friendly.
              </span>
            </div>
          </li>
        </ul>
      </section>

      {/* Section 6 */}
      <section id="sales-cap">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          💰 Sales Cap
        </h2>
        <p>
          <strong>There is no sales cap in Alabama.</strong> The 2021 amendment
          removed the previous $20,000 cap entirely. You can now earn as much as
          your kitchen can produce — a major improvement that makes Alabama
          competitive with the most cottage-food-friendly states in the country.
        </p>
      </section>

      {/* Section 7 */}
      <section id="labeling">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🏷️ Labeling Requirements
        </h2>
        <p>
          Alabama requires specific labeling on every cottage food product. The
          state specifically emphasizes allergen warnings. Here&apos;s what your
          label must include:
        </p>
        <div className="bg-card rounded-2xl border border-cream-200/60 p-6 mt-4 shadow-warm">
          <ol className="space-y-3">
            {[
              "<strong>Product name</strong> — A clear, descriptive name for your food item.",
              "<strong>Producer name and address</strong> — Your full name and physical address.",
              "<strong>Ingredients list</strong> — All ingredients in descending order by weight.",
              "<strong>Allergen declaration</strong> — Call out the top 9 allergens: milk, eggs, fish, shellfish, tree nuts, peanuts, wheat, soybeans, sesame. Alabama specifically emphasizes this requirement.",
              "<strong>Net weight or count</strong> — Net weight in both ounces and grams, or an accurate count.",
              '<strong>Cottage food disclaimer</strong> — Exact wording: <em>"This food is not inspected by the Alabama Department of Public Health."</em>',
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
          💡 <strong>Pro tip:</strong> Alabama&apos;s emphasis on allergen labeling
          means you should be especially careful to list ALL allergens clearly. If
          you use pecans (common in Alabama products), make sure &quot;tree nuts
          (pecans)&quot; is prominent on your label.
        </p>
      </section>

      {/* Section 8 */}
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
            { step: "1", title: "Complete Your Food Safety Course", body: "Required — $7–15, ~2 hours. Take ServSafe Food Handler or an equivalent ANSI-accredited course online. Keep your certificate — the county health department will want to see it." },
            { step: "2", title: "Contact Your County Health Department", body: "Call or visit your county health department and ask about their cottage food approval process. Each county handles this differently. Come prepared with your food safety certificate and a clear description of what you plan to sell. Most counties are helpful and want to see small food businesses succeed." },
            { step: "3", title: "Choose Your Signature Product", body: "Pick 1–3 items to start. Alabama specialties that sell well: candied pecans, mayhaw jelly, Southern pound cakes, biscuits, or artisan breads. Master a few things rather than trying to offer everything." },
            { step: "4", title: "Perfect Your Recipe", body: "Document exact measurements and procedures. Consistency is key — customers expect the same great product every time, whether at Pepper Place Market in Birmingham or a roadside stand in Mobile." },
            { step: "5", title: "Check City/County Business License", body: "Beyond health department approval, some cities may require a general business license. Check with your city clerk — especially in Birmingham, Huntsville, or Mobile." },
            { step: "6", title: "Price for Profit", body: "Calculate ingredient costs, packaging, market fees, AND your time. Candied pecans: $8–14/bag. Jams & jellies: $7–12/jar. Decorated cookies: $35–55/dozen. Don't underprice — your products are handmade with care." },
            { step: "7", title: "Design Your Labels", body: "Create labels with all ADPH-required elements, with special attention to the allergen declaration. A clean, professional label sets you apart at markets and builds customer trust." },
            { step: "8", title: "Choose Your Launch Channel", body: "Farmers markets are the best place to start. Alabama markets are community-oriented and welcoming to new vendors. Pepper Place in Birmingham is a great aspirational market once you've established yourself." },
            { step: "9", title: "Tell Your Network", body: "Your first customers come from your community. Post on social media, tell friends and neighbors, and create your free FreshFinds listing to reach customers searching for local food in your area." },
            { step: "10", title: "Show Up Consistently & Track Everything", body: "Consistency builds trust and repeat customers. Track all sales and expenses — with no sales cap, your business can grow as large as your ambition. Many Alabama bakers start as a weekend side hustle and grow to full-time income." },
          ].map(({ step, title, body }) => (
            <div key={step} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center text-sage-700 font-bold text-lg shadow-warm">
                {step}
              </div>
              <div>
                <h3 className="font-bold font-serif text-ink text-base mb-1">{title}</h3>
                <p className="text-sm text-ink-light">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 9 */}
      <section id="income-potential">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          💰 Income Potential for AL Home Bakers
        </h2>
        <p>
          How much can you actually make? Here are realistic numbers based on
          what Alabama cottage food vendors report:
        </p>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          {[
            { level: "Weekend Baker", range: "$400–$1,200/month", desc: "One market per week. 5–10 hours/week.", icon: "🌱" },
            { level: "Growing Side Business", range: "$1,200–$3,500/month", desc: "2 markets/week, maybe online orders. 15–25 hours/week.", icon: "🌿" },
            { level: "Full-Time Business", range: "$3,500–$7,000+/month", desc: "Multiple markets, online, holiday volume. Full-time commitment.", icon: "🌳" },
          ].map((tier) => (
            <div key={tier.level} className="bg-card rounded-xl border border-cream-200/60 p-4 shadow-warm text-center">
              <div className="text-2xl mb-2">{tier.icon}</div>
              <h3 className="font-bold font-serif text-ink text-sm mb-1">{tier.level}</h3>
              <p className="text-lg font-bold text-sage-600 mb-1.5">{tier.range}</p>
              <p className="text-xs text-ink-light">{tier.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-ink-muted mt-4">
          <strong>Realistic first-year target:</strong> $800–$2,000/month working
          10–20 hours per week. Alabama&apos;s lower cost of living means your
          profit margins can be strong — and with no sales cap post-2021, there
          are no artificial limits on your growth.
        </p>
      </section>

      {/* Section 10 */}
      <section id="how-freshfinds-helps" className="bg-sage-50 rounded-2xl p-6 border border-sage-200/60">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🔍 How FreshFinds Helps AL Vendors Get Discovered
        </h2>
        <p>
          The hardest part of a cottage food business isn&apos;t the baking —
          it&apos;s getting found by customers who don&apos;t already know you.
          FreshFinds solves this:
        </p>
        <ul className="space-y-3 mt-3">
          {[
            "<strong>Free vendor listing</strong> — No fees, no commissions, nothing. Your listing stays up forever at no cost.",
            "<strong>\"Fresh Right Now\" feed</strong> — When you bake something today, post it and local customers browsing the map see it immediately. Like an Instagram story but for local food discovery.",
            "<strong>Map-based discovery</strong> — Customers browse a map of your city. They see your location, your products, and can message you directly.",
            "<strong>Alabama cities are live</strong> — Birmingham, Huntsville, Montgomery, Mobile, and more are active on FreshFinds with local customers browsing daily.",
            "<strong>SEO-optimized</strong> — Your vendor profile gets indexed by Google, so when someone searches \"homemade pecan pralines near me\" in Alabama, your listing can appear.",
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
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 mt-4 bg-terra-500 text-white font-bold px-5 py-3 rounded-2xl hover:bg-terra-400 transition-all shadow-warm active:scale-[0.98] text-sm"
        >
          Create Your Free Listing →
        </Link>
      </section>

      {/* Disclaimer */}
      <p className="text-xs text-ink-muted italic pt-4 border-t border-cream-200/60">
        <strong>Disclaimer:</strong> This guide is for informational purposes
        only and does not constitute legal advice. Cottage food laws can change.
        Always verify current requirements with the Alabama Department of Public
        Health or a qualified professional before starting your business. Last
        updated: July 2026.
      </p>
    </div>
  );
}
