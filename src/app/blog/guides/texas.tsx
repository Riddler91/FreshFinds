import Link from "next/link";

export const txTocItems = [
  { id: "what-is-cottage-food", label: "What Is Texas's Cottage Food Law?" },
  { id: "foods-you-can-sell", label: "What Foods Can You Sell?" },
  { id: "foods-you-cannot-sell", label: "What Foods Can't You Sell?" },
  { id: "requirements", label: "What Are the Requirements?" },
  { id: "where-to-sell", label: "Where Can You Sell?" },
  { id: "sales-cap", label: "Sales Cap" },
  { id: "labeling", label: "Labeling Requirements" },
  { id: "how-to-start", label: "Step-by-Step: How to Get Started" },
  { id: "income-potential", label: "Income Potential for TX Home Bakers" },
  { id: "how-freshfinds-helps", label: "How FreshFinds Helps" },
];

export function TexasCottageFoodGuide() {
  return (
    <div className="space-y-10 text-ink-light leading-relaxed">
      <p className="text-lg font-medium text-ink">
        Texas passed its first cottage food law in 2011 and dramatically expanded it
        in 2019 with the &quot;Texas Baker&apos;s Bill.&quot; The 2019 expansion raised
        the sales cap to $150,000, expanded allowed foods, and explicitly confirmed
        online sales and restaurant/retail sales. Here&apos;s everything you need to know.
      </p>

      <section id="what-is-cottage-food">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">
          🏠 What Is Texas&apos;s Cottage Food Law?
        </h2>
        <p>
          The Texas Cottage Food Production Law (Texas Health and Safety Code,
          Chapter 437) was first passed in 2011 with House Bill 81 and dramatically
          expanded in 2019 with House Bill 970.
        </p>
        <ul className="space-y-2 mt-3">
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span><strong>One simple requirement:</strong> A Texas DSHS-accredited food handler course ($7–15, ~2 hours).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span><strong>No state permit or license</strong> — No DSHS registration.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span><strong>No kitchen inspection</strong> — The state does not inspect home kitchens.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-500 font-bold mt-0.5">✅</span>
            <span><strong>$150,000 sales cap</strong> — One of the highest caps in the country.</span>
          </li>
        </ul>
        <p className="mt-3">
          Texas is now one of the most cottage-food-friendly states in the U.S.
          The 2019 &quot;Baker&apos;s Bill&quot; was a game-changer for home food businesses.
        </p>
      </section>

      <section id="foods-you-can-sell">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">🍞 What Foods Can You Sell?</h2>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          {[
            { title: "Baked Goods", items: "Breads, cakes, cookies, pastries, tortillas, kolaches (fruit-filled), fruit pies, pecan pie", icon: "🥖" },
            { title: "Candies & Confections", items: "Fudge, pralines, caramels, toffee, pecan brittle, hard candies", icon: "🍬" },
            { title: "Jams & Jellies", items: "Fruit jams, pepper jellies (jalapeño!), marmalades, fruit butters", icon: "🍯" },
            { title: "Dry Mixes", items: "Cookie mixes, chili seasoning, fajita seasoning, spice blends, hot chocolate mix", icon: "📦" },
            { title: "Snack Foods", items: "Popcorn, roasted nuts, candied pecans, crackers, tortilla chips, trail mix", icon: "🥨" },
            { title: "Other", items: "Honey (Texas produces some of the best!), vinegars, mustard, dry herbs, roasted coffee", icon: "☕" },
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
            "Anything requiring refrigeration (cheesecakes, cream pies, key lime pie)",
            "Meat products (no jerky, sausage, brisket, tamales, meat kolaches)",
            "Dairy products as standalone items",
            "Low-acid canned foods (vegetables, soups, salsas without pH verification)",
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

      <section id="requirements">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">📋 What Are the Requirements?</h2>
        <p><strong>One requirement: a Texas DSHS-accredited food handler course.</strong></p>
        <p className="mt-2">This is a short online course ($7–15) that takes about 2 hours. Accepted providers: ServSafe Food Handler, Learn2Serve, StateFoodSafety. Complete the course, pass the quiz, keep your certificate.</p>
        <p className="mt-2">No state permit, no kitchen inspection, no registration with DSHS. Some cities (Austin, Houston) may require a home occupation permit or business license.</p>
        <p className="mt-2">Most grocery-type foods are exempt from Texas sales tax. Candies and snack items may require a Sales and Use Tax Permit (free from the Texas Comptroller).</p>
      </section>

      <section id="where-to-sell">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">📍 Where Can You Sell?</h2>
        <ul className="space-y-3 mt-3">
          {[
            { icon: "🏪", title: "Farmers Markets", desc: "From Dallas to Austin to small-town Texas — year-round markets statewide." },
            { icon: "🏠", title: "From Your Home", desc: "Porch pickup is common and fully legal." },
            { icon: "💻", title: "Online (Within Texas)", desc: "The 2019 law explicitly confirmed online sales. Interstate sales prohibited." },
            { icon: "🍽️", title: "Restaurants", desc: "Yes! A café can serve your sourdough — confirmed by HB 970." },
            { icon: "🛍️", title: "Retail Stores", desc: "Your pepper jelly can be in a Fredericksburg boutique." },
            { icon: "🎪", title: "Events & Festivals", desc: "From county fairs to Austin festivals — all fair game." },
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
        <p className="text-sm text-ink-muted mt-3">
          Direct delivery is fine. Third-party delivery (Uber Eats, DoorDash) is not allowed.
        </p>
      </section>

      <section id="sales-cap">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">💰 Sales Cap</h2>
        <p><strong>$150,000 per year.</strong> One of the highest caps in the country. Most home kitchens hit physical capacity long before $150,000. If you exceed it, you transition to a commercial kitchen.</p>
      </section>

      <section id="labeling">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">🏷️ Labeling Requirements</h2>
        <p>Texas requires specific labeling on every cottage food product:</p>
        <div className="bg-card rounded-2xl border border-cream-200/60 p-6 mt-4 shadow-warm">
          <ol className="space-y-3">
            {[
              "<strong>Product name</strong> — A clear, descriptive name.",
              "<strong>Producer name and physical address</strong> — PO box is not sufficient in Texas.",
              "<strong>Ingredients list</strong> — Descending order by weight.",
              "<strong>Allergen declaration</strong> — Top 9 allergens: milk, eggs, fish, shellfish, tree nuts, peanuts, wheat, soybeans, sesame.",
              "<strong>Net weight or count</strong>",
              '<strong>Exact required disclaimer:</strong> <em>"This food is made in a home kitchen and is not inspected by the Department of State Health Services or a local health department."</em>',
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
            { step: "1", title: "Take Your Food Handler Course", body: "Required — $7–15, ~2 hours. ServSafe, Learn2Serve, or StateFoodSafety. Keep your certificate." },
            { step: "2", title: "Choose Your Product(s)", body: "Start with 1–3 items. Sourdough, decorated cookies, pecan pie, or specialty jams work great in Texas." },
            { step: "3", title: "Perfect and Document Your Recipe", body: "Exact measurements and procedures. Consistency is everything." },
            { step: "4", title: "Design Labels", body: "All 6 Texas-required elements. The exact disclaimer wording is mandatory." },
            { step: "5", title: "Check Local Requirements", body: "Austin, Houston, and other cities may require a home occupation permit." },
            { step: "6", title: "Determine Sales Tax Obligations", body: "Check comptroller.texas.gov — you may need a free Sales and Use Tax Permit." },
            { step: "7", title: "Price for Profit", body: "Sourdough: $8–12, sugar cookies: $40–60/dozen, pecan pie: $25–35. Don't underprice." },
            { step: "8", title: "Choose Your Launch Channel", body: "Farmers market, home pickup, or online. Texas has incredible markets in every major city." },
            { step: "9", title: "Tell Everyone", body: "Your network is your first customer base. List on FreshFinds for free." },
            { step: "10", title: "Show Up Consistently", body: "Reliability builds trust. Track everything for tax time." },
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
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">💰 Income Potential for TX Home Bakers</h2>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          {[
            { level: "Weekend Baker", range: "$500–$1,800/mo", desc: "1 market/week", icon: "🌱" },
            { level: "Growing Side Business", range: "$1,800–$4,500/mo", desc: "2 markets + wholesale", icon: "🌿" },
            { level: "Full-Time", range: "$4,500–$10,000+/mo", desc: "Full-time + multiple channels", icon: "🌳" },
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
          <strong>Texas advantages:</strong> Huge metro markets (Houston 7.1M, DFW 7.6M,
          SA 2.6M, Austin 2.4M), restaurant/retail sales allowed, year-round markets,
          strong &quot;buy local&quot; culture, $150K high cap. Realistic first-year
          target in a Texas metro: $1,200–$3,000/month working 15–30 hours/week.
        </p>
      </section>

      <section id="how-freshfinds-helps" className="bg-sage-50 rounded-2xl p-6 border border-sage-200/60">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink mb-4">🔍 How FreshFinds Helps Texas Vendors</h2>
        <p>The hardest part isn&apos;t the baking — it&apos;s getting found. FreshFinds solves this:</p>
        <ul className="space-y-3 mt-3">
          {[
            "<strong>Free vendor listing</strong> — No fees, no commissions, ever.",
            "<strong>\"Fresh Right Now\" feed</strong> — Post today's bake and local customers see it instantly.",
            "<strong>Map-based discovery</strong> — Customers browse by location across Texas cities.",
            "<strong>Rolling out across Texas</strong> — Starting in Austin and expanding statewide.",
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
        Based on publicly available information about the Texas Cottage Food Production Law as of 2025-2026.
        Verify with Texas DSHS before starting. Last updated: July 2026.
      </p>
    </div>
  );
}
