import Link from "next/link";

export const msTocItems = [
  { id: "what-is-cottage-food", label: "What Is Mississippi's Cottage Food Law?" },
  { id: "foods-you-can-sell", label: "What Foods Can You Sell?" },
  { id: "foods-you-cannot-sell", label: "What Foods Can't You Sell?" },
  { id: "requirements", label: "What Are the Requirements?" },
  { id: "where-to-sell", label: "Where Can You Sell?" },
  { id: "sales-cap", label: "Sales Cap" },
  { id: "labeling", label: "Labeling Requirements" },
  { id: "how-to-start", label: "Step-by-Step: How to Get Started" },
  { id: "income-potential", label: "Income Potential for MS Home Bakers" },
  { id: "how-freshfinds-helps", label: "How FreshFinds Helps" },
];

export function MississippiCottageFoodGuide() {
  return (
    <div className="space-y-10 text-ink-light leading-relaxed">
      {/* Intro */}
      <p className="text-lg font-medium text-ink">
        Let&apos;s be honest upfront: Mississippi&apos;s cottage food law has some
        of the tightest restrictions in the country — a <strong>$35,000 annual sales
        cap</strong> and <strong>no online sales</strong>. But it also has zero
        bureaucratic barriers: no permit, no license, no inspection, no food safety
        course. If you want to earn a solid side income selling at farmers markets
        and local events, Mississippi makes it incredibly easy to get started.
        Here&apos;s exactly what you need to know.
      </p>

      {/* Section 1 */}
      <section id="what-is-cottage-food">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🏠 What Is Mississippi&apos;s Cottage Food Law?
        </h2>
        <p>
          Mississippi enacted its cottage food law in 2013, and it&apos;s
          administered by the Mississippi State Department of Health (MSDH). The
          law allows anyone to prepare <strong>non-potentially hazardous foods</strong>
          in their home kitchen and sell them directly to consumers face-to-face.
        </p>
        <p className="mt-2">
          Here&apos;s the deal: Mississippi requires <strong>absolutely nothing from
          the state</strong> — no permit, no license, no kitchen inspection, no food
          safety course. But the trade-off is real: a $35,000 sales cap and a strict
          prohibition on online sales. For a side hustle or weekend farmers market
          business, the $35K cap is plenty. If you&apos;re aiming for full-time
          income beyond that, you&apos;ll eventually need a commercial kitchen.
        </p>
        <ul className="space-y-2 mt-3">
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span>
              <strong>No permit or license</strong> — Zero paperwork with the MSDH.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span>
              <strong>No kitchen inspection</strong> — The state does not inspect
              home kitchens.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span>
              <strong>No food safety course required</strong> — No training mandate.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span>
              <strong>$0 to start</strong> — Truly zero. No fees, no registration
              costs.
            </span>
          </li>
        </ul>
        <div className="bg-honey-50 rounded-xl p-4 mt-4 border border-honey-200/60">
          <p className="text-sm text-honey-800">
            <strong>⚡ The bottom line:</strong> Mississippi is ideal for a side
            hustle or part-time income. You can start selling this weekend with zero
            government interaction. Just keep your annual sales under $35,000 and
            sell face-to-face — no online transactions.
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section id="foods-you-can-sell">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🍞 What Foods Can You Sell?
        </h2>
        <p>
          Mississippi allows any <strong>non-potentially hazardous food</strong> —
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
              items: "Fudge, truffles, chocolate bark, caramels, toffee, brittle, hard candies, pralines",
              icon: "🍬",
            },
            {
              title: "Jams & Jellies",
              items: "Fruit jams, pepper jellies, marmalades, fruit butters, mayhaw jelly",
              icon: "🍯",
            },
            {
              title: "Dry Mixes",
              items: "Cookie mixes, brownie mixes, soup mixes, cornbread mix, spice blends",
              icon: "📦",
            },
            {
              title: "Snack Foods",
              items: "Popcorn, roasted nuts, crackers, granola",
              icon: "🥨",
            },
            {
              title: "Other Items",
              items: "Honey, dry herbs, roasted coffee",
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
          Mississippi prohibits the sale of any <strong>potentially hazardous food</strong> —
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
          <strong>No state license, permit, food safety course, or kitchen inspection
          is required.</strong> Mississippi has zero bureaucratic barriers to entry.
          You can start selling this weekend with no government interaction at all.
        </p>
        <p className="mt-2">
          Some cities — Jackson, Gulfport, Oxford — may require a local business
          license. Check with your city clerk. Otherwise, you&apos;re free to start
          selling immediately.
        </p>
        <p className="mt-2">
          While no food safety course is required, taking one voluntarily (ServSafe
          Food Handler, ~$15, ~2 hours) is a smart move. It builds customer confidence
          and helps you avoid mistakes — especially important since Mississippi
          doesn&apos;t require any formal food safety training.
        </p>
      </section>

      {/* Section 5 */}
      <section id="where-to-sell">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          📍 Where Can You Sell?
        </h2>
        <p>
          Mississippi restricts cottage food sales to <strong>face-to-face, in-person
          transactions only</strong>. Here&apos;s where you can sell:
        </p>
        <ul className="space-y-3 mt-3">
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">🏪</span>
            <div>
              <strong className="text-ink">Farmers Markets</strong>
              <br />
              <span className="text-sm text-ink-light">
                Your best bet. Jackson, Oxford, Hattiesburg, and the Gulf Coast
                all have active farmers markets. Booth fees: $10–$30 per day.
                Markets are the most reliable way to build a customer base in
                Mississippi.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">🏠</span>
            <div>
              <strong className="text-ink">From Your Home</strong>
              <br />
              <span className="text-sm text-ink-light">
                Porch pickup is legal — customers come to you and pay in person.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">🛣️</span>
            <div>
              <strong className="text-ink">Roadside Stands</strong>
              <br />
              <span className="text-sm text-ink-light">
                A Mississippi tradition! Set up a stand on your property or at
                an approved location. Cash sales, face-to-face.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-sage-500 font-bold text-lg mt-0.5">🎪</span>
            <div>
              <strong className="text-ink">Events &amp; Festivals</strong>
              <br />
              <span className="text-sm text-ink-light">
                Holiday markets, church bazaars, county fairs, and community
                events are all permitted. Mississippi&apos;s strong community
                culture makes these reliable sales channels.
              </span>
            </div>
          </li>
        </ul>
        <div className="bg-terra-50 rounded-xl p-4 mt-4 border border-terra-200/60">
          <p className="text-sm text-terra-800">
            <strong>🚫 NO Online Sales:</strong> Mississippi is one of only 2 states
            that does NOT permit online cottage food sales. All transactions must be
            in-person, face-to-face. You CAN market your products on social media
            and FreshFinds — just arrange for in-person pickup and payment. You
            cannot accept payment online or ship products, even within Mississippi.
          </p>
        </div>
      </section>

      {/* Section 6 */}
      <section id="sales-cap">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          💰 Sales Cap
        </h2>
        <p>
          <strong>The sales cap is $35,000 per year</strong> — roughly $2,900 per
          month. This is one of the lowest caps in the country. It&apos;s absolutely
          achievable as a side hustle or part-time income, but it does limit full-time
          potential.
        </p>
        <p className="mt-2">
          If you hit the $35K cap, congratulations — you&apos;ve outgrown your home
          kitchen! The next step is transitioning to a commercial kitchen or shared-use
          kitchen, which removes the sales cap entirely and opens up online sales and
          shipping.
        </p>
        <div className="bg-card rounded-xl border border-cream-200/60 p-4 mt-3 shadow-warm">
          <p className="text-sm">
            <strong>📊 Perspective:</strong> At an average price of $8–12 per item,
            you&apos;d need to sell roughly 3,000–4,400 items per year to hit the
            cap. That&apos;s about 60–85 items per week. At a busy farmers market,
            many vendors sell 30–50 items in a single Saturday — so the cap is
            reachable but not immediately constraining for most home bakers.
          </p>
        </div>
      </section>

      {/* Section 7 */}
      <section id="labeling">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🏷️ Labeling Requirements
        </h2>
        <p>
          Mississippi requires specific labeling on every cottage food product you sell.
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
              '<strong>Cottage food disclaimer</strong> — Exact wording: <em>"Made in a home kitchen that is not subject to inspection by the Mississippi State Department of Health."</em>',
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
          💡 <strong>Pro tip:</strong> Since all your sales are face-to-face in
          Mississippi, you can use simpler packaging and labels than online sellers
          in other states. A clean, handwritten label on a bakery bag is perfectly
          acceptable — just make sure all required information is there.
        </p>
      </section>

      {/* Section 8 */}
      <section id="how-to-start">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🚀 Step-by-Step: How to Get Started
        </h2>
        <p>
          Here&apos;s the exact path from &quot;I want to sell&quot; to your first
          farmers market Saturday:
        </p>
        <div className="space-y-6 mt-4">
          {[
            { step: "1", title: "Choose Your Signature Product", body: "Pick 1–3 items to start. Mississippi specialties that sell well: Southern pound cakes, pecan pralines, mayhaw jelly, cornbread mix, and artisan biscuits. Master a few things rather than trying to offer everything." },
            { step: "2", title: "Perfect Your Recipe", body: "Document exact measurements and procedures. Consistency builds reputation — especially important since all your sales are face-to-face and your customers will know you personally." },
            { step: "3", title: "Check Local Requirements", body: "While Mississippi requires no state permits, some cities (Jackson, Gulfport, Oxford) may require a local business license. Check with your city clerk." },
            { step: "4", title: "Price Your Products", body: "Don't underprice! Mississippi's lower cost of living is an advantage — your ingredient costs are lower, so your margins can be healthy. Sourdough: $7–12, decorated cookies: $30–50/dozen, jams: $7–10/jar, pralines: $8–14/box." },
            { step: "5", title: "Design Your Labels", body: "Create labels with all MSDH-required elements. Since all sales are in-person, you can start with clean handwritten or simple printed labels and upgrade as you grow." },
            { step: "6", title: "Pick Your Market", body: "Farmers markets are your primary channel in Mississippi. Visit a few as a customer first — observe which vendors are busy, what products sell well, and what booth fees are. Introduce yourself to the market manager." },
            { step: "7", title: "Plan for In-Person Sales Only", body: "Set up a system for face-to-face transactions. This can include farmers market sales, porch pickup with cash/Venmo payment at pickup, or a roadside stand. Remind yourself: no online payments, no shipping." },
            { step: "8", title: "Tell Your Network", body: "Word of mouth is crucial in Mississippi. Tell friends, family, neighbors, church members, and coworkers. Post on community Facebook groups and NextDoor. List on FreshFinds (your profile still gets seen — just arrange in-person pickup)." },
            { step: "9", title: "Show Up Consistently", body: "Success comes from consistency. Commit to your market schedule. Mississippi customers value reliability — when they know you'll be at the Saturday market with fresh sourdough, they'll plan their shopping around you." },
            { step: "10", title: "Track Sales (Stay Under $35K)", body: "Keep careful records of all sales. With a $35K cap, you need to know where you stand. A simple spreadsheet tracking weekly sales is perfect. If you approach the cap, start planning your commercial kitchen transition." },
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
          💰 Income Potential for MS Home Bakers
        </h2>
        <p>
          How much can you actually make within Mississippi&apos;s $35K cap?
          Here are realistic numbers:
        </p>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          {[
            { level: "Weekend Baker", range: "$400–$1,200/month", desc: "One market per week. 5–10 hours/week. Well within the cap.", icon: "🌱" },
            { level: "Growing Side Business", range: "$1,200–$2,500/month", desc: "2 markets/week + porch pickup. 15–25 hours/week.", icon: "🌿" },
            { level: "Full-Time (Capped)", range: "$2,500–$2,900/month", desc: "Full-time effort, approaching the $35K cap. Time to consider a commercial kitchen.", icon: "🌳" },
          ].map((tier) => (
            <div key={tier.level} className="bg-card rounded-xl border border-cream-200/60 p-4 shadow-warm text-center">
              <div className="text-2xl mb-2">{tier.icon}</div>
              <h3 className="font-bold font-serif text-ink text-sm mb-1">{tier.level}</h3>
              <p className="text-lg font-bold text-sage-600 mb-1.5">{tier.range}</p>
              <p className="text-xs text-ink-light">{tier.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-honey-50 rounded-xl p-4 mt-4 border border-honey-200/60">
          <p className="text-sm text-honey-800">
            <strong>📈 Growth path beyond $35K:</strong> When you hit the cap,
            transitioning to a commercial kitchen opens everything up — unlimited
            revenue, online sales, shipping, and wholesale accounts. Many Mississippi
            bakers use cottage food as a 1–2 year proof-of-concept, then move to a
            shared-use kitchen when demand exceeds the cap.
          </p>
        </div>
      </section>

      {/* Section 10 */}
      <section id="how-freshfinds-helps" className="bg-sage-50 rounded-2xl p-6 border border-sage-200/60">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🔍 How FreshFinds Helps MS Vendors Get Discovered
        </h2>
        <p>
          Even with Mississippi&apos;s in-person-only rule, getting found by new
          customers is the hardest part. FreshFinds helps — even within the
          constraints:
        </p>
        <ul className="space-y-3 mt-3">
          {[
            "<strong>Free vendor listing</strong> — No fees, no commissions. Your listing acts as your online storefront that directs customers to find you in person.",
            "<strong>Map-based discovery</strong> — Customers browsing Jackson, Oxford, Hattiesburg, or the Gulf Coast see your location and products on the map. They can message you to arrange porch pickup.",
            "<strong>\"Fresh Right Now\" feed</strong> — Post what you baked today. Local customers see it and can message you to arrange in-person pickup — you handle payment face-to-face.",
            "<strong>Mississippi cities are live</strong> — Jackson, Oxford, Hattiesburg, Gulfport, and more are active on FreshFinds with local food lovers browsing daily.",
            "<strong>SEO-optimized</strong> — Your vendor profile gets indexed by Google, so when someone searches \"farmers market baker near me\" in Mississippi, your listing can appear and lead them to your next market appearance.",
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
          <strong>Important:</strong> Remember that Mississippi law requires all
          cottage food transactions to be in-person. FreshFinds helps customers
          discover you — you handle payment and handoff face-to-face at your
          market booth, porch, or roadside stand.
        </p>
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
        Always verify current requirements with the Mississippi State Department
        of Health or a qualified professional before starting your business.
        Last updated: July 2026.
      </p>
    </div>
  );
}
