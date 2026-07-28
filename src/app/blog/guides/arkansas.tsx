import Link from "next/link";

export const arTocItems = [
  { id: "what-is-cottage-food", label: "What Is Arkansas's Cottage Food Law?" },
  { id: "foods-you-can-sell", label: "What Foods Can You Sell?" },
  { id: "foods-you-cannot-sell", label: "What Foods Can't You Sell?" },
  { id: "requirements", label: "What Are the Requirements?" },
  { id: "where-to-sell", label: "Where Can You Sell?" },
  { id: "sales-cap", label: "Sales Cap" },
  { id: "labeling", label: "Labeling Requirements" },
  { id: "income-potential", label: "Income Potential for AR Home Bakers" },
  { id: "how-freshfinds-helps", label: "How FreshFinds Helps" },
];

export function ArkansasCottageFoodGuide() {
  return (
    <div className="space-y-10 text-ink-light leading-relaxed">
      <p className="text-lg font-medium text-ink">
        Arkansas passed one of the newest and most home-baker-friendly cottage food
        laws in the country — the 2021 Arkansas Food Freedom Act. No permit, no license,
        no kitchen inspection, no food safety course required. Here&apos;s everything
        you need to know.
      </p>

      <section id="what-is-cottage-food">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🏠 What Is Arkansas&apos;s Cottage Food Law?
        </h2>
        <p>
          The Arkansas Food Freedom Act (administered by the Arkansas Department of Health)
          was passed in 2021 and intentionally removed barriers so home bakers could start
          selling immediately with zero government interaction.
        </p>
        <ul className="space-y-2 mt-3">
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span><strong>No permit or license</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span><strong>No kitchen inspection</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span><strong>No food safety course</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span><strong>No sales cap</strong> — Unlimited revenue</span>
          </li>
        </ul>
      </section>

      <section id="foods-you-can-sell">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">🍞 What Foods Can You Sell?</h2>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          {[
            { title: "Baked Goods", items: "Breads, cakes, cookies, muffins, scones, pastries, brownies, fruit pies", icon: "🥖" },
            { title: "Candies", items: "Fudge, truffles, caramels, toffee, brittle, pralines, hard candies", icon: "🍬" },
            { title: "Jams & Preserves", items: "Fruit jams, pepper jellies, marmalades, fruit butters", icon: "🍯" },
            { title: "Dry Mixes", items: "Cookie mixes, soup mixes, spice blends, gravy mixes", icon: "📦" },
            { title: "Snacks", items: "Popcorn, roasted nuts, granola, crackers, trail mix, tortilla chips", icon: "🥨" },
            { title: "Other", items: "Honey, vinegars, mustard, dry herbs, roasted coffee, teas", icon: "☕" },
          ].map((cat) => (
            <div key={cat.title} className="bg-card rounded-xl border border-cream-200/60 p-4 shadow-warm">
              <h3 className="font-bold font-serif text-ink text-base mb-1.5">{cat.icon} {cat.title}</h3>
              <p className="text-sm text-ink-light">{cat.items}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="foods-you-cannot-sell" className="bg-terra-50 rounded-2xl p-6 border border-terra-200/60">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">❌ What Foods Can&apos;t You Sell?</h2>
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          {["Refrigerated items", "Meat products", "Dairy as standalone", "Low-acid canned foods", "Fermented foods", "Pet treats"].map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm">
              <span className="text-terra-500 font-bold mt-0.5">✕</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="requirements">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">📋 What Are the Requirements?</h2>
        <p><strong>None from the state.</strong> Some cities (Little Rock, Fayetteville) may require a general business license. Most grocery foods exempt from AR sales tax.</p>
      </section>

      <section id="where-to-sell">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">📍 Where Can You Sell?</h2>
        <ul className="space-y-3 mt-3">
          {[
            { icon: "🏪", title: "Farmers Markets", desc: "Fayetteville Farmers Market is nationally recognized." },
            { icon: "🏠", title: "From Home", desc: "Porch pickup is legal." },
            { icon: "💻", title: "Online (Within AR)", desc: "Interstate sales prohibited." },
            { icon: "🛍️", title: "Retail Stores", desc: "Yes! Rare nationwide." },
            { icon: "🛣️", title: "Roadside Stands", desc: "Perfectly legal." },
            { icon: "🎪", title: "Events & Festivals", desc: "All fair game." },
          ].map((item) => (
            <li key={item.title} className="flex items-start gap-2.5">
              <span className="text-sage-500 font-bold text-lg mt-0.5">{item.icon}</span>
              <div>
                <strong className="text-ink">{item.title}</strong>
                <br /><span className="text-sm text-ink-light">{item.desc}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="sales-cap">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">💰 Sales Cap</h2>
        <p><strong>No sales cap.</strong> Unlimited revenue potential.</p>
      </section>

      <section id="labeling">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">🏷️ Labeling Requirements</h2>
        <div className="bg-card rounded-2xl border border-cream-200/60 p-6 mt-4 shadow-warm">
          <ol className="space-y-3">
            {[
              "Product name",
              "Producer name and physical address",
              "Ingredients list",
              "Allergen declaration",
              "Net weight or count",
              '<em>"This product is home-produced and not subject to state inspection."</em>',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" dangerouslySetInnerHTML={{ __html: `<span class="text-sage-500 font-bold text-base mt-0.5 flex-shrink-0">${i + 1}.</span><span>${item}</span>` }} />
            ))}
          </ol>
        </div>
      </section>

      <section id="income-potential">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">💰 Income Potential for AR Home Bakers</h2>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          {[
            { level: "Weekend Baker", range: "$400–$1,200/mo", desc: "1 market/week", icon: "🌱" },
            { level: "Growing Side Business", range: "$1,200–$3,500/mo", desc: "2 markets/week", icon: "🌿" },
            { level: "Full-Time", range: "$3,500–$7,000+/mo", desc: "Full-time", icon: "🌳" },
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
          <strong>AR advantages:</strong> Low cost of living, booming NW Arkansas corridor
          (Walmart HQ), retail sales allowed, strong market culture. First-year target: $800–$2,000/month.
        </p>
      </section>

      <section id="how-freshfinds-helps" className="bg-sage-50 rounded-2xl p-6 border border-sage-200/60">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">🔍 How FreshFinds Helps</h2>
        <p>Free map-based discovery. Post what you made today, customers in Little Rock, Fayetteville, and beyond find you on the map.</p>
        <Link href="/onboarding" className="inline-flex items-center gap-2 mt-4 bg-terra-500 text-white font-bold px-5 py-3 rounded-2xl hover:bg-terra-400 transition-all shadow-warm active:scale-[0.98] text-sm">
          Create Your Free Listing →
        </Link>
      </section>

      <p className="text-xs text-ink-muted italic pt-4 border-t border-cream-200/60">
        <strong>Disclaimer:</strong> For informational purposes only. Verify with the Arkansas Department of Health before starting. Last updated: July 2026.
      </p>
    </div>
  );
}
