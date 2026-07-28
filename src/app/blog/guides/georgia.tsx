import Link from "next/link";

export const gaTocItems = [
  { id: "what-is-cottage-food", label: "What Is Georgia's Cottage Food Law?" },
  { id: "foods-you-can-sell", label: "What Foods Can You Sell?" },
  { id: "foods-you-cannot-sell", label: "What Foods Can't You Sell?" },
  { id: "requirements", label: "What Are the Requirements?" },
  { id: "where-to-sell", label: "Where Can You Sell?" },
  { id: "sales-cap", label: "Sales Cap" },
  { id: "labeling", label: "Labeling Requirements" },
  { id: "how-to-start", label: "Step-by-Step: How to Get Started" },
  { id: "income-potential", label: "Income Potential for GA Home Bakers" },
  { id: "how-freshfinds-helps", label: "How FreshFinds Helps" },
];

export function GeorgiaCottageFoodGuide() {
  return (
    <div className="space-y-10 text-ink-light leading-relaxed">
      {/* Intro */}
      <p className="text-lg font-medium text-ink">
        Georgia is one of the most permissive cottage food states in the entire
        country. With <strong>no sales cap</strong> (unlimited income potential),
        all sales venues permitted — including restaurants and retail stores — and
        only a simple $7–15 food safety course required, Georgia is a dream state
        for home bakers and food makers. Here&apos;s everything you need to know.
      </p>

      {/* Section 1 */}
      <section id="what-is-cottage-food">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🏠 What Is Georgia&apos;s Cottage Food Law?
        </h2>
        <p>
          Georgia passed its cottage food law in 2012, and it&apos;s administered by
          the Georgia Department of Agriculture (GDA). The official name is the
          Georgia Cottage Food Regulation (Ga. Comp. R. &amp; Regs. r. 40-7-19).
        </p>
        <p className="mt-2">
          Here&apos;s what makes Georgia special: <strong>only one requirement stands
          between you and unlimited revenue — a food safety course.</strong> No state
          permit, no kitchen inspection, no registration with the GDA. And unlike most
          states, Georgia explicitly allows sales to restaurants, cafés, and retail
          stores.
        </p>
        <ul className="space-y-2 mt-3">
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span>
              <strong>One requirement: a food safety course</strong> — Complete an
              ANSI-accredited course like ServSafe Food Handler ($7–15, ~2 hours).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span>
              <strong>No state permit or license</strong> — You don&apos;t need to
              register with the GDA.
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
              <strong>No sales cap</strong> — Unlimited revenue potential. Grow as
              big as your kitchen can handle.
            </span>
          </li>
        </ul>
        <p className="mt-3">
          Georgia is also one of the few states that allows cottage food sales at
          <strong> restaurants, cafés, and retail stores</strong>. Your sourdough can
          be served at an Atlanta restaurant, and your jam can sit on a boutique
          shelf. This opens up revenue channels that simply don&apos;t exist in
          most other states.
        </p>
      </section>

      {/* Section 2 */}
      <section id="foods-you-can-sell">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🍞 What Foods Can You Sell?
        </h2>
        <p>
          Georgia allows any <strong>non-potentially hazardous food</strong> —
          meaning it doesn&apos;t require refrigeration to stay safe. Here&apos;s
          what&apos;s allowed:
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
              items: "Fruit jams, pepper jellies, marmalades, fruit butters",
              icon: "🍯",
            },
            {
              title: "Dry Mixes",
              items: "Cookie mixes, brownie mixes, soup mixes, spice blends, hot chocolate mix",
              icon: "📦",
            },
            {
              title: "Snack Foods",
              items: "Popcorn, roasted nuts, crackers, pretzels, granola bars, trail mix",
              icon: "🥨",
            },
            {
              title: "Other Items",
              items: "Honey, vinegars, mustard, dry herbs, roasted coffee, dry tea blends",
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
          Georgia prohibits the sale of any <strong>potentially hazardous food</strong> —
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
          <strong>One requirement: a food safety course.</strong> The Georgia
          Department of Agriculture requires completion of an ANSI-accredited food
          safety course. The most popular option is ServSafe Food Handler (~$15,
          ~2 hours, online). Other accepted courses include those from the National
          Registry of Food Safety Professionals.
        </p>
        <p className="mt-2">
          That&apos;s it. No state permit, no kitchen inspection, no registration
          with the GDA. Keep your course certificate — you may be asked to show it
          at farmers markets or by wholesale accounts.
        </p>
        <p className="mt-2">
          Some cities — Atlanta, Savannah, Athens — may require a general business
          license. Check with your local city or county clerk.
        </p>
      </section>

      {/* Section 5 */}
      <section id="where-to-sell">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          📍 Where Can You Sell?
        </h2>
        <p>Georgia allows cottage food sales through <strong>all</strong> sales venues — one of only a handful of states this permissive:</p>
        <ul className="space-y-3 mt-3">
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">🏪</span>
            <div>
              <strong className="text-ink">Farmers Markets</strong>
              <br />
              <span className="text-sm text-ink-light">
                Atlanta alone has 30+ markets — Peachtree Road, Grant Park, Piedmont
                Park, and many more. Booth fees range from $20–$75 per day.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">🏠</span>
            <div>
              <strong className="text-ink">From Your Home</strong>
              <br />
              <span className="text-sm text-ink-light">
                Porch pickup is common and perfectly legal under Georgia law.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">💻</span>
            <div>
              <strong className="text-ink">Online (Within Georgia Only)</strong>
              <br />
              <span className="text-sm text-ink-light">
                Sell online and through platforms like FreshFinds — but only to
                Georgia residents. Interstate cottage food sales are prohibited.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">🍽️</span>
            <div>
              <strong className="text-ink">Restaurants &amp; Cafés</strong>
              <br />
              <span className="text-sm text-ink-light">
                YES! Your sourdough can be served at an Atlanta restaurant. This
                is rare nationwide and a huge growth lever for Georgia bakers.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">🛍️</span>
            <div>
              <strong className="text-ink">Retail Stores</strong>
              <br />
              <span className="text-sm text-ink-light">
                YES! Your jam or granola can sit on a boutique shelf. Another
                rare privilege that sets Georgia apart.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">🎪</span>
            <div>
              <strong className="text-ink">Events &amp; Festivals</strong>
              <br />
              <span className="text-sm text-ink-light">
                Holiday markets, craft fairs, county fairs, church bazaars —
                all fair game across Georgia.
              </span>
            </div>
          </li>
        </ul>
        <div className="bg-honey-50 rounded-xl p-4 mt-4 border border-honey-200/60">
          <p className="text-sm text-honey-800">
            <strong>🔄 Georgia Grown:</strong> The GDA&apos;s official &quot;Georgia
            Grown&quot; marketing program is very active and promotes local food
            producers statewide. Joining (free) can connect you to additional
            marketing opportunities and wholesale buyers. This is a potential
            partnership channel for FreshFinds as well.
          </p>
        </div>
      </section>

      {/* Section 6 */}
      <section id="sales-cap">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          💰 Sales Cap
        </h2>
        <p>
          <strong>There is no sales cap in Georgia.</strong> You can earn $5,000 or
          $500,000+ — the law accommodates both. Combined with restaurant and retail
          sales, Georgia offers the most unrestricted cottage food environment in
          the country. The only practical limit is your kitchen&apos;s production
          capacity.
        </p>
      </section>

      {/* Section 7 */}
      <section id="labeling">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🏷️ Labeling Requirements
        </h2>
        <p>
          Georgia requires specific labeling on every cottage food product.
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
              '<strong>Cottage food disclaimer</strong> — Exact wording: <em>"Made in a home kitchen that is not subject to state inspection."</em>',
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
          💡 <strong>Pro tip:</strong> If you plan to sell wholesale to retail
          stores, they may have additional labeling requirements (UPC codes,
          specific label sizes). Discuss these with each buyer before printing
          large batches.
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
            { step: "1", title: "Complete Your Food Safety Course", body: "Required — $7–15, ~2 hours. Take ServSafe Food Handler or an equivalent ANSI-accredited course online. You can complete it in an afternoon and get your certificate immediately. Keep a digital copy on your phone." },
            { step: "2", title: "Choose Your Signature Product", body: "Pick 1–3 items to start. The most successful GA cottage food businesses specialize: artisan sourdough, decorated sugar cookies, Southern pralines, or small-batch jams. Master a few things rather than trying to offer everything." },
            { step: "3", title: "Perfect Your Recipe", body: "Document exact measurements and procedures. If you're planning to wholesale to cafés or stores, consistency is non-negotiable — they expect the same product every delivery." },
            { step: "4", title: "Source Packaging", body: "Quality packaging matters — especially for retail shelves. Bread bags, bakery boxes, glass jars, and cellophane bags. Atlanta has excellent restaurant supply stores and packaging wholesalers." },
            { step: "5", title: "Check Local Requirements", body: "While Georgia requires no state permit, some cities (Atlanta, Savannah, Athens) may require a general business license. Check with your city/county clerk." },
            { step: "6", title: "Price for Profit", body: "Don't underprice — especially if you're wholesaling. You need margin for both you and the retailer. Sourdough loaves: $8–14 retail, $5–7 wholesale. Jam jars: $8–12 retail. Decorated cookies: $40–60/dozen." },
            { step: "7", title: "Design Your Labels", body: "Create labels with all 6 GDA-required elements. If you're selling retail, invest in professional-looking labels — they dramatically impact shelf appeal." },
            { step: "8", title: "Choose Your Launch Channel", body: "With Georgia's all-venues policy, you have options: start at a farmers market (lowest risk), reach out to a local café (higher volume), or list online. Many successful GA bakers do all three." },
            { step: "9", title: "Tell Your Network", body: "Post on social media, tell friends, and create your free FreshFinds listing. The Atlanta food scene is highly connected — word travels fast when you make great products." },
            { step: "10", title: "Show Up & Track Everything", body: "Consistency builds trust with customers, markets, and wholesale buyers. Track all sales and expenses — with no sales cap, your growth path is unlimited." },
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
          💰 Income Potential for GA Home Bakers
        </h2>
        <p>
          How much can you actually make? With no sales cap and all venues open,
          Georgia has the highest income potential of any cottage food state:
        </p>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          {[
            { level: "Weekend Baker", range: "$500–$1,500/month", desc: "One market per week. 5–10 hours/week.", icon: "🌱" },
            { level: "Growing Side Business", range: "$1,500–$4,500/month", desc: "2 markets + wholesale account. 15–25 hours/week.", icon: "🌿" },
            { level: "Full-Time Business", range: "$4,500–$10,000+/month", desc: "Multiple markets, wholesale, online. Full-time commitment.", icon: "🌳" },
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
          <strong>Realistic first-year target:</strong> $1,500–$3,500/month working
          15–25 hours per week. Georgia&apos;s combination of no sales cap,
          restaurant/retail sales, and a thriving food scene in Atlanta and beyond
          makes this achievable for dedicated bakers.
        </p>
      </section>

      {/* Section 10 */}
      <section id="how-freshfinds-helps" className="bg-sage-50 rounded-2xl p-6 border border-sage-200/60">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🔍 How FreshFinds Helps GA Vendors Get Discovered
        </h2>
        <p>
          The hardest part of a cottage food business isn&apos;t the baking —
          it&apos;s getting found by customers who don&apos;t already know you.
          FreshFinds solves this:
        </p>
        <ul className="space-y-3 mt-3">
          {[
            "<strong>Free vendor listing</strong> — No fees, no commissions, nothing. Your listing stays up forever at no cost.",
            "<strong>\"Fresh Right Now\" feed</strong> — When you bake something today, post it and local customers browsing the map see it immediately. Think of it like an Instagram story for food.",
            "<strong>Map-based discovery</strong> — Customers browse a map of your city. They see your location, your products, and can message you directly.",
            "<strong>Georgia cities are live</strong> — Atlanta, Savannah, Athens, Macon, and more are active on FreshFinds with local customers browsing daily.",
            "<strong>SEO-optimized</strong> — Your vendor profile gets indexed by Google, so when someone searches \"sourdough bread near me\" in Atlanta, your listing can appear.",
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
        Always verify current requirements with the Georgia Department of
        Agriculture or a qualified professional before starting your business.
        Last updated: July 2026.
      </p>
    </div>
  );
}
