import Link from "next/link";

export const vaTocItems = [
  { id: "what-is-cottage-food", label: "What Is Virginia's Cottage Food Law?" },
  { id: "foods-you-can-sell", label: "What Foods Can You Sell?" },
  { id: "foods-you-cannot-sell", label: "What Foods Can't You Sell?" },
  { id: "requirements", label: "What Are the Requirements?" },
  { id: "where-to-sell", label: "Where Can You Sell?" },
  { id: "sales-cap", label: "Sales Cap" },
  { id: "labeling", label: "Labeling Requirements" },
  { id: "income-potential", label: "Income Potential for VA Home Bakers" },
  { id: "how-freshfinds-helps", label: "How FreshFinds Helps" },
];

export function VirginiaCottageFoodGuide() {
  return (
    <div className="space-y-10 text-ink-light leading-relaxed">
      <p className="text-lg font-medium text-ink">
        Virginia passed its cottage food law in 2019 with a unique two-tier system
        that lets you start with zero paperwork and upgrade when ready to sell through
        restaurants and retail stores. Here&apos;s everything you need to know.
      </p>

      <section id="what-is-cottage-food">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🏠 What Is Virginia&apos;s Cottage Food Law?
        </h2>
        <p>
          The Virginia Food Freedom Act (administered by VDACS) created a unique
          two-tier cottage food system. The basic tier requires zero government
          interaction — no permit, no license, no inspection. The Home Food Processing
          Operation (HFPO) tier unlocks restaurant and retail sales with a VDACS permit.
        </p>
        <ul className="space-y-2 mt-3">
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span><strong>Basic tier: Zero paperwork</strong> — No permit, no license, no kitchen inspection.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span><strong>HFPO tier: Restaurant/retail sales</strong> — Upgrade path when you're ready to grow.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span><strong>No sales cap</strong> — Unlimited revenue at either tier.</span>
          </li>
        </ul>
      </section>

      <section id="foods-you-can-sell">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">🍞 What Foods Can You Sell?</h2>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          {[
            { title: "Baked Goods", items: "Breads, cakes, cookies, muffins, scones, pastries, brownies, fruit pies", icon: "🥖" },
            { title: "Candies", items: "Fudge, truffles, caramels, toffee, brittle, hard candies", icon: "🍬" },
            { title: "Jams & Preserves", items: "Fruit jams, pepper jellies, marmalades, fruit butters", icon: "🍯" },
            { title: "Dry Mixes", items: "Cookie mixes, soup mixes, spice blends, hot chocolate mix", icon: "📦" },
            { title: "Snacks", items: "Popcorn, roasted nuts, granola, crackers, trail mix", icon: "🥨" },
          ].map((cat) => (
            <div key={cat.title} className="bg-card rounded-xl border border-cream-200/60 p-4 shadow-warm">
              <h3 className="font-bold font-serif text-ink text-base mb-1.5">{cat.icon} {cat.title}</h3>
              <p className="text-sm text-ink-light">{cat.items}</p>
            </div>
          ))}
        </div>
        <p className="text-sm mt-3"><strong>HFPO tier adds:</strong> acidified foods (pickles, salsas with verified pH), fermented foods, and broader sales channels.</p>
      </section>

      <section id="foods-you-cannot-sell" className="bg-terra-50 rounded-2xl p-6 border border-terra-200/60">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">❌ What Foods Can&apos;t You Sell?</h2>
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          {["Anything requiring refrigeration", "Meat products", "Dairy as standalone items", "Low-acid canned foods (without HFPO permit)", "Pet treats"].map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm">
              <span className="text-terra-500 font-bold mt-0.5">✕</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="requirements">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">📋 What Are the Requirements?</h2>
        <p><strong>Basic tier: None.</strong> No permit, no license, no kitchen inspection, no food safety course.</p>
        <p className="mt-2"><strong>HFPO tier:</strong> VDACS permit, kitchen inspection, water test (if on well water), pH testing for acidified foods.</p>
        <p className="mt-2">Some counties (Fairfax, Arlington, Richmond) may require a local business license.</p>
      </section>

      <section id="where-to-sell">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">📍 Where Can You Sell?</h2>
        <ul className="space-y-3 mt-3">
          {[
            { icon: "🏪", title: "Farmers Markets", desc: "Yes — at the basic tier." },
            { icon: "🏠", title: "From Your Home", desc: "Porch pickup is legal." },
            { icon: "💻", title: "Online (Within VA)", desc: "Yes — within Virginia only." },
            { icon: "🛣️", title: "Roadside Stands", desc: "Yes — at the basic tier." },
            { icon: "🎪", title: "Events & Festivals", desc: "Yes — holiday markets, craft fairs." },
            { icon: "🍽️", title: "Restaurants & Retail (HFPO)", desc: "Only with HFPO permit — a great upgrade path." },
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
        <p><strong>No sales cap at either tier.</strong> Unlimited revenue potential from your home kitchen.</p>
      </section>

      <section id="labeling">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">🏷️ Labeling Requirements</h2>
        <div className="bg-card rounded-2xl border border-cream-200/60 p-6 mt-4 shadow-warm">
          <ol className="space-y-3">
            {[
              "<strong>Product name</strong>",
              "<strong>Producer name and physical address</strong>",
              "<strong>Ingredients list</strong> (descending order by weight)",
              "<strong>Allergen declaration</strong> (top 9 allergens)",
              "<strong>Net weight or count</strong>",
              '<strong>Disclaimer:</strong> <em>"Not prepared in a restaurant or state-inspected kitchen."</em>',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" dangerouslySetInnerHTML={{ __html: `<span class="text-sage-500 font-bold text-base mt-0.5 flex-shrink-0">${i + 1}.</span><span>${item}</span>` }} />
            ))}
          </ol>
        </div>
      </section>

      <section id="income-potential">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">💰 Income Potential for VA Home Bakers</h2>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          {[
            { level: "Weekend Side Hustle", range: "$500–$1,500/mo", desc: "1 market/week", icon: "🌱" },
            { level: "Serious Part-Time", range: "$1,500–$4,000/mo", desc: "Multiple channels", icon: "🌿" },
            { level: "Full-Time (HFPO)", range: "$4,000–$8,000+/mo", desc: "Restaurants + retail", icon: "🌳" },
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
          <strong>VA advantages:</strong> NoVA/DC suburbs (3M+ affluent consumers),
          Richmond food scene, year-round markets, two-tier upgrade path for growth.
          First-year target: $1,000–$2,500/month.
        </p>
      </section>

      <section id="how-freshfinds-helps" className="bg-sage-50 rounded-2xl p-6 border border-sage-200/60">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">🔍 How FreshFinds Helps</h2>
        <p>Free map-based discovery. Post what you made today, customers nearby find you. No fees, no commissions.</p>
        <Link href="/onboarding" className="inline-flex items-center gap-2 mt-4 bg-terra-500 text-white font-bold px-5 py-3 rounded-2xl hover:bg-terra-400 transition-all shadow-warm active:scale-[0.98] text-sm">
          Create Your Free Listing →
        </Link>
      </section>

      <p className="text-xs text-ink-muted italic pt-4 border-t border-cream-200/60">
        <strong>Disclaimer:</strong> For informational purposes only. Verify with VDACS before starting. Last updated: July 2026.
      </p>
    </div>
  );
}
