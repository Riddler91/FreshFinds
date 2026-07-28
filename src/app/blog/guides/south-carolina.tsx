import Link from "next/link";

export const scTocItems = [
  { id: "what-is-cottage-food", label: "What Is South Carolina's Cottage Food Law?" },
  { id: "foods-you-can-sell", label: "What Foods Can You Sell?" },
  { id: "foods-you-cannot-sell", label: "What Foods Can't You Sell?" },
  { id: "requirements", label: "What Are the Requirements?" },
  { id: "where-to-sell", label: "Where Can You Sell?" },
  { id: "sales-cap", label: "Sales Cap" },
  { id: "labeling", label: "Labeling Requirements" },
  { id: "how-to-start", label: "Step-by-Step: How to Get Started" },
  { id: "income-potential", label: "Income Potential for SC Home Bakers" },
  { id: "how-freshfinds-helps", label: "How FreshFinds Helps" },
];

export function SouthCarolinaCottageFoodGuide() {
  return (
    <div className="space-y-10 text-ink-light leading-relaxed">
      <p className="text-lg font-medium text-ink">
        South Carolina has one of the most small-business-friendly cottage food laws
        in the United States. You don&apos;t need a permit, a license, or a
        kitchen inspection to start selling homemade food. And there&apos;s no
        limit on how much you can earn. Here&apos;s everything you need to know.
      </p>

      <section id="what-is-cottage-food">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🏠 What Is South Carolina&apos;s Cottage Food Law?
        </h2>
        <p>
          South Carolina passed its cottage food law in 2015, officially the
          Home-Based Food Production Law (S.C. Code § 44-1-143). Like its neighbor
          NC, SC chose simplicity: <strong>no permit, no license, no kitchen inspection,
          no food safety course required.</strong>
        </p>
        <ul className="space-y-2 mt-3">
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span><strong>No permit or license</strong> — No state registration needed.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span><strong>No kitchen inspection</strong> — The state does not inspect home kitchens.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span><strong>No food safety course</strong> — No training requirements.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span><strong>No sales cap</strong> — Unlimited revenue potential.</span>
          </li>
        </ul>
        <p className="mt-3">SC is a Tier 1 state — one of the most friendly in the country for home bakers.</p>
      </section>

      <section id="foods-you-can-sell">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">🍞 What Foods Can You Sell?</h2>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          {[
            { title: "Baked Goods", items: "Breads, cakes, cookies, pastries, muffins, brownies, fruit pies", icon: "🥖" },
            { title: "Candies & Confections", items: "Fudge, truffles, caramels, toffee, brittle, pralines", icon: "🍬" },
            { title: "Jams & Jellies", items: "Fruit jams, pepper jelly (huge in SC!), marmalades, fruit butters", icon: "🍯" },
            { title: "Dry Mixes", items: "Cookie mixes, soup mixes, spice blends, hot chocolate mix", icon: "📦" },
            { title: "Snack Foods", items: "Popcorn, roasted nuts, crackers, granola, trail mix", icon: "🥨" },
            { title: "Other", items: "Honey, vinegars, mustard, dry herbs, roasted coffee", icon: "☕" },
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
          {[
            "Anything requiring refrigeration (cheesecakes, cream pies)",
            "Meat products (no jerky, sausage, or meat of any kind)",
            "Dairy products as standalone items",
            "Low-acid canned foods (vegetables, soups)",
            "Fermented foods (kombucha, kimchi — gray area)",
            "Pet treats",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm">
              <span className="text-terra-500 font-bold mt-0.5">✕</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="requirements">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">📋 What Are the Requirements?</h2>
        <p><strong>None from the state.</strong> No permit, no license, no kitchen inspection, no food safety course.</p>
        <p className="mt-2">Some cities (Charleston, Greenville, Columbia) may require a local business license ($25–100/year). Most grocery-type foods are exempt from SC sales tax.</p>
      </section>

      <section id="where-to-sell">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">📍 Where Can You Sell?</h2>
        <ul className="space-y-3 mt-3">
          {[
            { icon: "🏪", title: "Farmers Markets", desc: "Charleston, Greenville, Soda City in Columbia, and more year-round." },
            { icon: "🏠", title: "From Your Home", desc: "Porch pickup model works perfectly in SC." },
            { icon: "💻", title: "Online (Within SC Only)", desc: "Interstate sales are prohibited federally." },
            { icon: "🛍️", title: "Retail Stores", desc: "Your pepper jelly can sit on a boutique shelf." },
            { icon: "🛣️", title: "Roadside Stands", desc: "A classic SC tradition." },
            { icon: "🎪", title: "Events & Festivals", desc: "Holiday markets, church bazaars, craft fairs." },
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
        <p className="text-sm text-ink-muted mt-3">Restaurant sales: Not explicitly listed — check with DHEC if interested.</p>
      </section>

      <section id="sales-cap">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">💰 Sales Cap</h2>
        <p><strong>No sales cap in South Carolina.</strong> Unlimited revenue potential from your home kitchen.</p>
      </section>

      <section id="labeling">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">🏷️ Labeling Requirements</h2>
        <div className="bg-card rounded-2xl border border-cream-200/60 p-6 mt-4 shadow-warm">
          <ol className="space-y-3">
            {[
              "<strong>Product name</strong>",
              "<strong>Producer name and address</strong>",
              "<strong>Ingredients list</strong> (descending order by weight)",
              "<strong>Allergen declaration</strong> (top 9 allergens)",
              "<strong>Net weight or count</strong>",
              '<strong>Cottage food disclaimer:</strong> <em>"This product was produced in a home kitchen that is not subject to state inspection."</em>',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" dangerouslySetInnerHTML={{ __html: `<span class="text-sage-500 font-bold text-base mt-0.5 flex-shrink-0">${i + 1}.</span><span>${item}</span>` }} />
            ))}
          </ol>
        </div>
      </section>

      <section id="how-to-start">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">🚀 Step-by-Step: How to Get Started</h2>
        <div className="space-y-6 mt-4">
          {[
            { step: "1", title: "Pick Your Signature Product", body: "What do people beg you to bring to gatherings? Start there with 1-3 items." },
            { step: "2", title: "Nail Your Recipe", body: "Exact measurements. Consistency builds loyal customers." },
            { step: "3", title: "Source Packaging", body: "Bread bags, bakery boxes, jars — make it presentable." },
            { step: "4", title: "Check Local Requirements", body: "Charleston, Greenville, Columbia may need a city business license ($25-100)." },
            { step: "5", title: "Price for Profit", body: "Calculate real costs + your time. Don't underprice." },
            { step: "6", title: "Create Labels", body: "Six required elements on every label. Clean design increases perceived value." },
            { step: "7", title: "Choose Your Launch Venue", body: "Farmers market, home pickup, or online. Many SC bakers start at a weekend market." },
            { step: "8", title: "Tell Everyone", body: "Your network is your first customer base. Post on social media and list on FreshFinds for free." },
            { step: "9", title: "Show Up Consistently", body: "Reliability builds repeat customers and word-of-mouth." },
            { step: "10", title: "Track Everything", body: "Sales, expenses, mileage — tax time will thank you." },
          ].map(({ step, title, body }) => (
            <div key={step} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center text-sage-700 font-bold text-lg shadow-warm">{step}</div>
              <div>
                <h3 className="font-bold font-serif text-ink text-base mb-1">{title}</h3>
                <p className="text-sm text-ink-light">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="income-potential">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">💰 Income Potential for SC Home Bakers</h2>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          {[
            { level: "Weekend Baker", range: "$400–$1,200/mo", desc: "1 market/week", icon: "🌱" },
            { level: "Growing Side Business", range: "$1,200–$3,500/mo", desc: "2 markets/week", icon: "🌿" },
            { level: "Full-Time", range: "$3,500–$7,000+/mo", desc: "Full-time commitment", icon: "🌳" },
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
          <strong>SC advantages:</strong> tourism (Charleston, Hilton Head, Myrtle Beach),
          year-round markets, strong Southern food culture, unlimited revenue cap.
          Realistic first-year target: $800–$2,000/month working 15–25 hours/week.
        </p>
      </section>

      <section id="how-freshfinds-helps" className="bg-sage-50 rounded-2xl p-6 border border-sage-200/60">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">🔍 How FreshFinds Helps</h2>
        <p>FreshFinds is a free, map-based discovery platform. Post what you baked today, and customers nearby find you on the map. No fees, no commissions, no algorithm — just direct discovery of your homemade food.</p>
        <ul className="space-y-3 mt-3">
          {[
            "<strong>Free vendor listing</strong> — No fees, no commissions, ever.",
            "<strong>\"Fresh Right Now\" feed</strong> — Post today's bake and local customers see it instantly.",
            "<strong>Map-based discovery</strong> — Customers browse by location and find your products.",
            "<strong>SEO-optimized profiles</strong> — Get found on Google when people search for local food.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" dangerouslySetInnerHTML={{ __html: `<span class="text-sage-500 font-bold mt-0.5">✅</span><span>${item}</span>` }} />
          ))}
        </ul>
        <Link href="/onboarding" className="inline-flex items-center gap-2 mt-4 bg-terra-500 text-white font-bold px-5 py-3 rounded-2xl hover:bg-terra-400 transition-all shadow-warm active:scale-[0.98] text-sm">
          Create Your Free Listing →
        </Link>
      </section>

      <p className="text-xs text-ink-muted italic pt-4 border-t border-cream-200/60">
        <strong>Disclaimer:</strong> This guide is for informational purposes only and does not constitute legal advice.
        Based on publicly available information about SC's Home-Based Food Production Law as of 2025-2026.
        Verify with SC DHEC before starting. Last updated: July 2026.
      </p>
    </div>
  );
}
