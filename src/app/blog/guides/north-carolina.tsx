import Link from "next/link";

export const ncTocItems = [
  { id: "what-is-cottage-food", label: "What Is North Carolina's Cottage Food Law?" },
  { id: "foods-you-can-sell", label: "What Foods Can You Sell?" },
  { id: "foods-you-cannot-sell", label: "What Foods Can't You Sell?" },
  { id: "requirements", label: "What Are the Requirements?" },
  { id: "where-to-sell", label: "Where Can You Sell?" },
  { id: "sales-cap", label: "Sales Cap" },
  { id: "labeling", label: "Labeling Requirements" },
  { id: "how-to-start", label: "Step-by-Step: How to Get Started" },
  { id: "income-potential", label: "Income Potential for NC Home Bakers" },
  { id: "how-freshfinds-helps", label: "How FreshFinds Helps" },
];

export function NorthCarolinaCottageFoodGuide() {
  return (
    <div className="space-y-10 text-ink-light leading-relaxed">
      {/* Intro */}
      <p className="text-lg font-medium text-ink">
        North Carolina has one of the most home-baker-friendly cottage food laws
        in the United States. You don&apos;t need a permit, a license, or a
        kitchen inspection to start selling homemade food from your kitchen.
        And there&apos;s no limit on how much you can earn. Here&apos;s
        everything you need to know to get started.
      </p>

      {/* Section 1 */}
      <section id="what-is-cottage-food">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🏠 What Is North Carolina&apos;s Cottage Food Law?
        </h2>
        <p>
          North Carolina passed its cottage food law in 2013, and it&apos;s one of the
          most home-baker-friendly laws in the country. The official name is the
          North Carolina Cottage Food Law (N.C. General Statutes § 130A-250 through 130A-252).
        </p>
        <p className="mt-2">
          Here&apos;s what makes North Carolina special: <strong>you do not need a permit,
          a license, a kitchen inspection, or even a food safety course.</strong> You simply
          follow the rules for what you can sell, label your products correctly, and
          you&apos;re in business.
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
              <strong>No food safety course required</strong> — Unlike some states,
              NC doesn&apos;t mandate any training.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span>
              <strong>No sales cap</strong> — You can earn $5,000 or $200,000+.
              The law accommodates both.
            </span>
          </li>
        </ul>
        <p className="mt-3">
          North Carolina also allows cottage food sales at <strong>restaurants and retail
          stores</strong>, which is rare — only a handful of states are this permissive.
          This makes NC one of the best states in the country to start a home-based
          food business.
        </p>
      </section>

      {/* Section 2 */}
      <section id="foods-you-can-sell">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🍞 What Foods Can You Sell?
        </h2>
        <p>
          North Carolina allows any <strong>non-potentially hazardous food</strong> —
          meaning it doesn&apos;t require refrigeration to stay safe. Here&apos;s
          what&apos;s allowed:
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          {[
            {
              title: "Baked Goods",
              items: "Breads, cakes, cookies, muffins, scones, pastries, brownies, fruit pies (no custard/cream pies)",
              icon: "🥖",
            },
            {
              title: "Candies & Confections",
              items: "Fudge, truffles, chocolate bark, caramels, toffee, brittle, hard candies",
              icon: "🍬",
            },
            {
              title: "Jams & Jellies",
              items: "Fruit jams, jellies, marmalades, fruit butters",
              icon: "🍯",
            },
            {
              title: "Dry Mixes",
              items: "Cookie mixes, brownie mixes, soup mixes, spice blends, granola",
              icon: "📦",
            },
            {
              title: "Snack Foods",
              items: "Popcorn, roasted nuts, crackers, pretzels, granola bars",
              icon: "🥨",
            },
            {
              title: "Other Items",
              items: "Honey, vinegars, mustard, dry herbs, roasted coffee",
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
      </section>

      {/* Section 3 */}
      <section id="foods-you-cannot-sell" className="bg-terra-50 rounded-2xl p-6 border border-terra-200/60">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          ❌ What Foods Can&apos;t You Sell?
        </h2>
        <p>
          North Carolina prohibits the sale of any <strong>potentially hazardous food</strong> —
          anything that requires time or temperature control to stay safe. This includes:
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          {[
            "Anything requiring refrigeration (cheesecakes, cream pies, custard pies)",
            "Meat products (no jerky, sausage, or meat of any kind)",
            "Dairy products as standalone items",
            "Low-acid canned foods (green beans, soups, tomato sauce)",
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
          <strong>None from the state.</strong> No permit, no license, no kitchen inspection,
          no food safety course required. North Carolina is one of the easiest states
          in the country to start a cottage food business.
        </p>
        <p className="mt-2">
          Some cities (Charlotte, Raleigh) may require a general business license —
          check with your local clerk. Most grocery-type foods are exempt from NC sales tax.
        </p>
      </section>

      {/* Section 5 */}
      <section id="where-to-sell">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          📍 Where Can You Sell?
        </h2>
        <p>North Carolina allows cottage food sales through multiple channels:</p>
        <ul className="space-y-3 mt-3">
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">🏪</span>
            <div>
              <strong className="text-ink">Farmers Markets</strong>
              <br />
              <span className="text-sm text-ink-light">
                NC has vibrant markets statewide — Asheville, Raleigh, Charlotte,
                Durham, and more. Booth fees range from $15–$50 per day.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">🏠</span>
            <div>
              <strong className="text-ink">From Your Home</strong>
              <br />
              <span className="text-sm text-ink-light">
                Porch pickup is common and perfectly legal under NC law.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">💻</span>
            <div>
              <strong className="text-ink">Online (Within NC Only)</strong>
              <br />
              <span className="text-sm text-ink-light">
                Sell online and through platforms like FreshFinds — but only to
                NC residents. Interstate cottage food sales are prohibited.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">🏪</span>
            <div>
              <strong className="text-ink">Restaurants &amp; Cafés</strong>
              <br />
              <span className="text-sm text-ink-light">
                Yes! This is rare nationwide. A café can serve your sourdough.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">🛍️</span>
            <div>
              <strong className="text-ink">Retail Stores</strong>
              <br />
              <span className="text-sm text-ink-light">
                Your jam can sit on a boutique shelf. Another rare privilege.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">🎪</span>
            <div>
              <strong className="text-ink">Events &amp; Festivals</strong>
              <br />
              <span className="text-sm text-ink-light">
                Holiday markets, fairs, fundraisers — all fair game.
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
          <strong>There is no sales cap in North Carolina.</strong> You can earn
          $5,000 or $200,000+ — the law accommodates both. This is a major advantage
          over states like Texas ($150K cap) or California ($50K cap).
        </p>
      </section>

      {/* Section 7 */}
      <section id="labeling">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🏷️ Labeling Requirements
        </h2>
        <p>
          North Carolina requires specific labeling on every cottage food product.
          Here&apos;s exactly what your label must include:
        </p>
        <div className="bg-card rounded-2xl border border-cream-200/60 p-6 mt-4 shadow-warm">
          <ol className="space-y-3">
            {[
              "<strong>Product name</strong> — A clear, descriptive name for your food item.",
              "<strong>Producer name and address</strong> — Your full name and physical address.",
              "<strong>Ingredients list</strong> — All ingredients in descending order by weight.",
              "<strong>Allergen declaration</strong> — Call out the top 9 allergens: milk, eggs, fish, shellfish, tree nuts, peanuts, wheat, soybeans, sesame.",
              "<strong>Net weight or count</strong> — Net weight in both ounces and grams, or an accurate count.",
              '<strong>Cottage food disclaimer</strong> — Exact wording: <em>"Made in a home kitchen that is not subject to inspection."</em>',
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
          professionally printed labels once you&apos;re selling regularly.
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
            { step: "1", title: "Choose Your Signature Product", body: "Pick 1–3 items to start. The most successful NC cottage food businesses specialize: sourdough bread, decorated sugar cookies, custom cakes, or specialty jams. Don't try to offer everything — master a few things first." },
            { step: "2", title: "Perfect Your Recipe", body: "Document exact measurements and procedures. Consistency is key — customers expect the same great product every time." },
            { step: "3", title: "Check Local Requirements", body: "While NC requires no state permits, some cities (Charlotte, Raleigh, Asheville) may require a general business license. Check with your city/county clerk." },
            { step: "4", title: "Price Your Products", body: "Don't underprice! Calculate ingredient costs, packaging, market fees, and your time. Sourdough loaves: $8–14, decorated cookies: $40–60/dozen, jam jars: $8–12." },
            { step: "5", title: "Design Your Labels", body: "Create labels with all 6 required elements. A clean, professional label dramatically increases perceived value." },
            { step: "6", title: "Set Up Your Sales Channel", body: "Choose your launch venue: farmers market, home pickup, or online. Many NC bakers start at a weekend market and add channels as demand grows." },
            { step: "7", title: "Make Your First Batch", body: "Bake your first commercial batch. Take great photos in natural light — good photos are the #1 factor in getting first-time customers." },
            { step: "8", title: "Tell Everyone", body: "Your first customers come from your network. Post on social media, tell friends and neighbors, and list on FreshFinds for free." },
            { step: "9", title: "Show Up Consistently", body: "Success comes from consistency. Whether it's weekly market attendance or regular social posts, reliability builds trust and repeat customers." },
            { step: "10", title: "Track Everything", body: "Keep records of sales, expenses, and mileage for tax time. A simple spreadsheet works to start." },
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
          💰 Income Potential for NC Home Bakers
        </h2>
        <p>
          How much can you actually make? Here are realistic numbers based on
          what NC cottage food vendors report:
        </p>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          {[
            { level: "Side Hustle", range: "$500–$1,500/month", desc: "One market day per week. 5–10 hours/week.", icon: "🌱" },
            { level: "Part-Time Income", range: "$1,500–$4,000/month", desc: "3–4 baking days/week, maybe wholesale. 15–25 hours/week.", icon: "🌿" },
            { level: "Full-Time Business", range: "$4,000–$8,000+/month", desc: "Multiple markets, wholesale, online orders. Full-time commitment.", icon: "🌳" },
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
          <strong>Realistic first-year target:</strong> $1,000–$2,500/month working
          15–25 hours per week. NC&apos;s combination of no sales cap, restaurant/retail
          sales, and strong farmers market culture makes this achievable.
        </p>
      </section>

      {/* Section 10 */}
      <section id="how-freshfinds-helps" className="bg-sage-50 rounded-2xl p-6 border border-sage-200/60">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🔍 How FreshFinds Helps NC Vendors Get Discovered
        </h2>
        <p>
          The hardest part of a cottage food business isn&apos;t the baking —
          it&apos;s getting found by customers who don&apos;t already know you.
          FreshFinds solves this:
        </p>
        <ul className="space-y-3 mt-3">
          {[
            "<strong>Free vendor listing</strong> — No fees, no commissions, nothing. Your listing stays up forever at no cost.",
            "<strong>\"Fresh Right Now\" feed</strong> — When you bake something today, post it and local customers browsing the map see it immediately.",
            "<strong>Map-based discovery</strong> — Customers browse a map of your city. They see your location, your products, and can message you directly.",
            "<strong>NC cities are live</strong> — Charlotte, Raleigh, Asheville, Durham, and more are active on FreshFinds with local customers browsing daily.",
            "<strong>SEO-optimized</strong> — Your vendor profile gets indexed by Google, so when someone searches \"sourdough near me\" in NC, your listing can appear.",
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
        Always verify current requirements with NC DHHS or a qualified professional
        before starting your business. Last updated: July 2026.
      </p>
    </div>
  );
}
