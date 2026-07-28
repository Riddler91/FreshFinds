import Link from "next/link";

export const ksTocItems = [
  { id: "what-is-cottage-food", label: "What Is Kansas's Cottage Food Law?" },
  { id: "foods-you-can-sell", label: "What Foods Can You Sell?" },
  { id: "foods-you-cannot-sell", label: "What Foods Can't You Sell?" },
  { id: "requirements", label: "What Are the Requirements?" },
  { id: "where-to-sell", label: "Where Can You Sell?" },
  { id: "sales-cap", label: "Sales Cap" },
  { id: "labeling", label: "Labeling Requirements" },
  { id: "income-potential", label: "Income Potential for KS Home Bakers" },
  { id: "how-freshfinds-helps", label: "How FreshFinds Helps" },
];

export function KansasCottageFoodGuide() {
  return (
    <div className="space-y-10 text-ink-light leading-relaxed">
      <p className="text-lg font-medium text-ink">
        Kansas passed its cottage food law in 2018, and it&apos;s refreshingly simple.
        No license, no permit, no kitchen inspection required. Just follow the rules
        for what you can sell, label correctly, and you&apos;re in business.
      </p>

      <section id="what-is-cottage-food">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🏠 What Is Kansas&apos;s Cottage Food Law?
        </h2>
        <p>
          Administered by the Kansas Department of Agriculture (KDA), the Kansas
          cottage food law (passed 2018) is a straightforward, zero-barrier law.
        </p>
        <ul className="space-y-2 mt-3">
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span><strong>No license or permit</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span><strong>No kitchen inspection</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span><strong>No food safety course required</strong></span>
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
            { title: "Baked Goods", items: "Breads, cakes, cookies, muffins, scones, pastries, brownies, fruit pies, cinnamon rolls", icon: "🥖" },
            { title: "Candies", items: "Fudge, truffles, caramels, toffee, brittle, hard candies", icon: "🍬" },
            { title: "Jams & Preserves", items: "Fruit jams, pepper jellies, marmalades, fruit butters, apple butter", icon: "🍯" },
            { title: "Dry Mixes", items: "Cookie mixes, soup mixes, spice blends, pancake mix, hot chocolate mix", icon: "📦" },
            { title: "Snacks", items: "Popcorn, roasted nuts, granola, crackers, trail mix, seasoned pretzels", icon: "🥨" },
            { title: "Other", items: "Honey, vinegars, mustard, dry herbs, roasted coffee, teas, spice rubs", icon: "☕" },
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
        <p><strong>None from the state for food safety.</strong> But Kansas requires cottage food sellers to register for a sales tax ID (ksrevenue.gov) — most prepared foods are taxable in KS.</p>
        <p className="mt-2">Some cities (Wichita, Overland Park, KC) may require a local business license ($25–75/year).</p>
      </section>

      <section id="where-to-sell">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">📍 Where Can You Sell?</h2>
        <ul className="space-y-3 mt-3">
          {[
            { icon: "🏪", title: "Farmers Markets", desc: "Kansas Grown in Wichita, Lawrence Farmers Market, and more." },
            { icon: "🏠", title: "From Home", desc: "Porch pickup is legal." },
            { icon: "💻", title: "Online (Within KS)", desc: "Interstate sales prohibited." },
            { icon: "🛣️", title: "Roadside Stands", desc: "Perfectly legal." },
            { icon: "🎪", title: "Events & Festivals", desc: "County fairs, holiday markets." },
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
        <p className="text-sm text-ink-muted mt-3">Restaurant/retail sales not explicitly covered — check with KDA.</p>
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
              '<em>"This product is produced in a private home kitchen that is not subject to state licensure or inspection."</em>',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" dangerouslySetInnerHTML={{ __html: `<span class="text-sage-500 font-bold text-base mt-0.5 flex-shrink-0">${i + 1}.</span><span>${item}</span>` }} />
            ))}
          </ol>
        </div>
      </section>

      <section id="income-potential">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">💰 Income Potential for KS Home Bakers</h2>
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
          <strong>KS advantages:</strong> Low cost of living, KC metro/Johnson County
          (affluent), tight-knit communities, zero state barriers. First-year target: $800–$2,000/month.
        </p>
      </section>

      <section id="how-freshfinds-helps" className="bg-sage-50 rounded-2xl p-6 border border-sage-200/60">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">🔍 How FreshFinds Helps</h2>
        <p>Free map-based discovery. Post what you made today, customers in Wichita, KC, Lawrence, and across Kansas find you on the map.</p>
        <Link href="/onboarding" className="inline-flex items-center gap-2 mt-4 bg-terra-500 text-white font-bold px-5 py-3 rounded-2xl hover:bg-terra-400 transition-all shadow-warm active:scale-[0.98] text-sm">
          Create Your Free Listing →
        </Link>
      </section>

      <p className="text-xs text-ink-muted italic pt-4 border-t border-cream-200/60">
        <strong>Disclaimer:</strong> For informational purposes only. Verify with the Kansas Department of Agriculture before starting. Last updated: July 2026.
      </p>
    </div>
  );
}
