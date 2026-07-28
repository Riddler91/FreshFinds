import Link from "next/link";

export const flTocItems = [
  { id: "what-is-cottage-food", label: "What Is Florida's Cottage Food Law?" },
  { id: "foods-you-can-sell", label: "What Foods Can You Sell?" },
  { id: "foods-you-cannot-sell", label: "What Foods Can't You Sell?" },
  { id: "requirements", label: "What Are the Requirements?" },
  { id: "where-to-sell", label: "Where Can You Sell?" },
  { id: "sales-cap", label: "Sales Cap" },
  { id: "labeling", label: "Labeling Requirements" },
  { id: "how-to-start", label: "Step-by-Step: How to Get Started" },
  { id: "income-potential", label: "Income Potential for FL Home Bakers" },
  { id: "how-freshfinds-helps", label: "How FreshFinds Helps" },
];

export function FloridaCottageFoodGuide() {
  return (
    <div className="space-y-10 text-ink-light leading-relaxed">
      {/* Intro */}
      <p className="text-lg font-medium text-ink">
        Florida has one of the most generous cottage food laws in the United States.
        You don&apos;t need a permit, a license, a kitchen inspection, or even a
        food safety course. And with a <strong>$250,000 annual sales cap</strong>,
        it&apos;s one of the highest in the nation. Here&apos;s everything you need
        to know to get started selling homemade food in the Sunshine State.
      </p>

      {/* Section 1 */}
      <section id="what-is-cottage-food">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🏠 What Is Florida&apos;s Cottage Food Law?
        </h2>
        <p>
          Florida enacted its cottage food law in 2011 (Florida Statutes § 500.80),
          and it&apos;s governed by the Florida Department of Agriculture and Consumer
          Services (FDACS). The law allows anyone to prepare <strong>non-potentially
          hazardous foods</strong> in their home kitchen and sell them directly to
          consumers — with remarkably few barriers.
        </p>
        <ul className="space-y-2 mt-3">
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span>
              <strong>No permit or license</strong> — You don&apos;t need to
              register with FDACS or any state agency.
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
              Florida doesn&apos;t mandate any training.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span>
              <strong>$250,000 sales cap</strong> — The second-highest cap in the
              country, behind only a few states with unlimited caps.
            </span>
          </li>
        </ul>
        <p className="mt-3">
          This makes Florida one of the most accessible states in the country to
          start a home-based food business. You can go from &quot;I should sell my
          cookies&quot; to actually selling them in a single weekend — and scale all
          the way to a quarter-million dollars in annual revenue before needing a
          commercial kitchen.
        </p>
      </section>

      {/* Section 2 */}
      <section id="foods-you-can-sell">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🍞 What Foods Can You Sell?
        </h2>
        <p>
          Florida allows any <strong>non-potentially hazardous food</strong> —
          meaning it doesn&apos;t require refrigeration to stay safe. Here&apos;s
          what&apos;s allowed:
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          {[
            {
              title: "Baked Goods",
              items: "Breads, cakes, cookies, muffins, scones, pastries, brownies, fruit pies (no cream/custard)",
              icon: "🥖",
            },
            {
              title: "Candies & Confections",
              items: "Fudge, truffles, chocolate bark, caramels, toffee, brittle, hard candies",
              icon: "🍬",
            },
            {
              title: "Jams & Jellies",
              items: "Fruit jams, pepper jellies, marmalades, fruit butters",
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
              items: "Honey, vinegars, mustard, dry herbs, roasted coffee, flavored oils",
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
          Florida prohibits the sale of any <strong>potentially hazardous food</strong> —
          anything that requires time or temperature control to stay safe. This includes:
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          {[
            "Anything requiring refrigeration (cheesecakes, cream pies, custard pies, key lime pie!)",
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
        <p className="text-sm mt-4 text-terra-700">
          ⚠️ <strong>Yes, this includes key lime pie!</strong> Since it contains
          eggs and dairy and requires refrigeration, authentic key lime pie falls
          outside Florida&apos;s cottage food law. Many bakers create shelf-stable
          versions or sell key lime cookies and bars instead.
        </p>
      </section>

      {/* Section 4 */}
      <section id="requirements">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          📋 What Are the Requirements?
        </h2>
        <p>
          <strong>None from the state.</strong> No permit, no license, no kitchen
          inspection, no food safety course required. Florida is one of the easiest
          states in the country to start a cottage food business.
        </p>
        <p className="mt-2">
          Some cities and counties — particularly Miami-Dade, Orlando, and Tampa —
          may require a general business license. Check with your local city or
          county clerk. Most cottage food products are exempt from Florida sales tax.
        </p>
      </section>

      {/* Section 5 */}
      <section id="where-to-sell">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          📍 Where Can You Sell?
        </h2>
        <p>Florida allows cottage food sales through multiple channels:</p>
        <ul className="space-y-3 mt-3">
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">🏪</span>
            <div>
              <strong className="text-ink">Farmers Markets</strong>
              <br />
              <span className="text-sm text-ink-light">
                Florida has year-round farmers markets thanks to the climate —
                Miami, Tampa, Orlando, Jacksonville, and dozens of smaller cities
                host weekly markets. Booth fees range from $20–$75 per day.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">🏠</span>
            <div>
              <strong className="text-ink">From Your Home</strong>
              <br />
              <span className="text-sm text-ink-light">
                Porch or driveway pickup is perfectly legal and common across Florida.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">💻</span>
            <div>
              <strong className="text-ink">Online (Within Florida Only)</strong>
              <br />
              <span className="text-sm text-ink-light">
                Sell online and through platforms like FreshFinds — but only to
                Florida residents. Interstate cottage food sales are prohibited.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">🛣️</span>
            <div>
              <strong className="text-ink">Roadside Stands</strong>
              <br />
              <span className="text-sm text-ink-light">
                Perfect for Florida&apos;s high-traffic roads and tourist corridors.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">🎪</span>
            <div>
              <strong className="text-ink">Events &amp; Festivals</strong>
              <br />
              <span className="text-sm text-ink-light">
                Craft fairs, holiday markets, community events — all fair game
                in Florida&apos;s vibrant festival scene.
              </span>
            </div>
          </li>
        </ul>
        <div className="bg-honey-50 rounded-xl p-4 mt-4 border border-honey-200/60">
          <p className="text-sm text-honey-800">
            <strong>🔄 Note:</strong> Restaurant and retail store sales are NOT
            explicitly permitted under Florida&apos;s cottage food law. Sales must
            be direct-to-consumer. Check with FDACS if you&apos;re considering
            wholesale arrangements.
          </p>
        </div>
      </section>

      {/* Section 6 */}
      <section id="sales-cap">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          💰 Sales Cap
        </h2>
        <p>
          <strong>The sales cap is $250,000 per year</strong> — the second-highest
          cap in the country, behind only states with no cap at all. At roughly
          $20,800 per month, this is more than enough for a full-time income and
          gives you tremendous room to grow before needing to transition to a
          commercial kitchen.
        </p>
      </section>

      {/* Section 7 */}
      <section id="labeling">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🏷️ Labeling Requirements
        </h2>
        <p>
          Florida requires specific labeling on every cottage food product you sell.
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
              '<strong>Cottage food disclaimer</strong> — Exact wording: <em>"Made in a cottage food operation that is not subject to Florida\'s food safety regulations."</em>',
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
            { step: "1", title: "Choose Your Signature Product", body: "Pick 1–3 items to start. The most successful FL cottage food businesses specialize: Cuban pastelitos, decorated sugar cookies, artisan sourdough, or tropical fruit jams. Don't try to offer everything — master a few things first." },
            { step: "2", title: "Perfect Your Recipe", body: "Document exact measurements and procedures. Consistency is key — customers expect the same great product every time, whether they buy from you at a Miami market or pick up from your porch in Tampa." },
            { step: "3", title: "Check Local Requirements", body: "While Florida requires no state permits, some cities (Miami-Dade, Orlando, Tampa) may require a general business license. Check with your city/county clerk." },
            { step: "4", title: "Price Your Products", body: "Don't underprice! Calculate ingredient costs, packaging, market fees, and your time. Sourdough loaves: $8–14, decorated cookies: $40–60/dozen, jam jars: $8–12. Florida's higher cost of living means you can charge premium prices." },
            { step: "5", title: "Design Your Labels", body: "Create labels with all 6 required elements. A clean, professional label dramatically increases perceived value and makes your products stand out at busy Florida markets." },
            { step: "6", title: "Set Up Your Sales Channel", body: "Choose your launch venue: farmers market, home pickup, or online. With Florida's year-round market season, many bakers start at a weekend market and add channels as demand grows." },
            { step: "7", title: "Make Your First Batch", body: "Bake your first commercial batch. Take great photos in bright Florida natural light — good photos are the #1 factor in getting first-time customers." },
            { step: "8", title: "Tell Everyone", body: "Your first customers come from your network. Post on social media, tell friends and neighbors, and list on FreshFinds for free to reach customers searching for local food in your area." },
            { step: "9", title: "Show Up Consistently", body: "Success comes from consistency. Whether it's weekly market attendance or regular social posts, reliability builds trust and repeat customers. Florida's tourist traffic means new customers are always discovering you." },
            { step: "10", title: "Track Everything & Scale", body: "Keep records of sales, expenses, and mileage for tax time. With a $250K cap, there's enormous room to grow — add more markets, expand your product line, and build toward full-time income." },
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
          💰 Income Potential for FL Home Bakers
        </h2>
        <p>
          How much can you actually make? Here are realistic numbers based on
          what Florida cottage food vendors report:
        </p>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          {[
            { level: "Weekend Baker", range: "$500–$1,500/month", desc: "One market day per week. 5–10 hours/week.", icon: "🌱" },
            { level: "Growing Side Business", range: "$1,500–$4,000/month", desc: "2–3 baking days/week, maybe two markets. 15–25 hours/week.", icon: "🌿" },
            { level: "Full-Time Business", range: "$4,000–$10,000+/month", desc: "Multiple markets, online orders, holiday rushes. Full-time commitment.", icon: "🌳" },
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
          <strong>Realistic first-year target:</strong> $1,000–$3,000/month working
          15–25 hours per week. Florida&apos;s year-round market season, high tourism
          traffic, and $250K sales cap make it one of the best states in the country
          for cottage food entrepreneurs.
        </p>
      </section>

      {/* Section 10 */}
      <section id="how-freshfinds-helps" className="bg-sage-50 rounded-2xl p-6 border border-sage-200/60">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🔍 How FreshFinds Helps FL Vendors Get Discovered
        </h2>
        <p>
          The hardest part of a cottage food business isn&apos;t the baking —
          it&apos;s getting found by customers who don&apos;t already know you.
          FreshFinds solves this:
        </p>
        <ul className="space-y-3 mt-3">
          {[
            "<strong>Free vendor listing</strong> — No fees, no commissions, nothing. Your listing stays up forever at no cost.",
            "<strong>\"Fresh Right Now\" feed</strong> — When you bake something today, post it and local customers browsing the map see it immediately. Perfect for Florida's spontaneous food culture.",
            "<strong>Map-based discovery</strong> — Customers browse a map of your city. They see your location, your products, and can message you directly.",
            "<strong>Florida cities are live</strong> — Miami, Tampa, Orlando, Jacksonville, and more are active on FreshFinds with local customers browsing daily.",
            "<strong>SEO-optimized</strong> — Your vendor profile gets indexed by Google, so when someone searches \"homemade cookies near me\" in Florida, your listing can appear.",
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
        Always verify current requirements with FDACS or a qualified professional
        before starting your business. Last updated: July 2026.
      </p>
    </div>
  );
}
