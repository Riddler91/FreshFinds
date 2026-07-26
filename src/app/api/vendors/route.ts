import { NextRequest, NextResponse } from "next/server";

const MOCK_VENDORS = [
  { id: 1, businessName: "ATX Sourdough", lat: 30.2615, lng: -97.732, address: "1200 E 6th St, Austin, TX 78702", photoUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400" },
  { id: 2, businessName: "Eastside Eggs", lat: 30.2548, lng: -97.7089, address: "2400 Webberville Rd, Austin, TX 78702", photoUrl: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400" },
  { id: 3, businessName: "Hill Country Honey", lat: 30.2477, lng: -97.9284, address: "8901 TX-71, Austin, TX 78735", photoUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400" },
  { id: 4, businessName: "Texas Pie Company", lat: 30.2351, lng: -97.7892, address: "4200 S Lamar Blvd, Austin, TX 78704", photoUrl: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400" },
  { id: 5, businessName: "Sunset Farms Produce", lat: 30.4015, lng: -97.7207, address: "11501 Rock Rose Ave, Austin, TX 78758", photoUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400" },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const vendorId = searchParams.get("id");

  if (vendorId) {
    const vendors: Record<string, any> = {
      "1": {
        vendor: { id: 1, name: "Maria Rodriguez", businessName: "ATX Sourdough", bio: "Hand-crafted sourdough bread using a 100-year-old starter. Baked fresh daily in East Austin.", address: "1200 E 6th St, Austin, TX 78702", photoUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", verified: true },
        listings: [
          { id: 1, title: "Classic Country Loaf", description: "Our signature sourdough — tangy, chewy, with a crackling crust. 800g loaf.", price: 8.5, photoUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", dietaryTags: '["vegetarian","vegan"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: "Organic flour, water, sourdough starter, sea salt", allergenWarning: null },
          { id: 2, title: "Cinnamon Raisin Swirl", description: "Sourdough with organic cinnamon and plump California raisins.", price: 10.0, photoUrl: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400", dietaryTags: '["vegetarian"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: "Organic flour, water, sourdough starter, cinnamon, raisins, sea salt", allergenWarning: null },
          { id: 3, title: "Everything Bagel Sourdough", description: "Limited batch — sourdough rolled in house-made everything seasoning.", price: 9.5, photoUrl: "https://images.unsplash.com/photo-1549931319-a545799f7b09?w=400", dietaryTags: '["vegetarian"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: "Organic flour, water, sourdough starter, sesame seeds, poppy seeds, garlic, onion, sea salt", allergenWarning: null },
        ],
      },
      "2": {
        vendor: { id: 2, name: "James & Lisa Chen", businessName: "Eastside Eggs", bio: "Free-range eggs from happy hens raised right here in East Austin.", address: "2400 Webberville Rd, Austin, TX 78702", photoUrl: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400", verified: true },
        listings: [
          { id: 4, title: "Farm Fresh Dozen", description: "One dozen free-range eggs from pastured hens. Rich orange yolks.", price: 7.0, photoUrl: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400", dietaryTags: '["vegetarian","gluten-free"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: null, allergenWarning: null },
          { id: 5, title: "Half Dozen + Herbs", description: "6 eggs plus a bundle of fresh kitchen herbs.", price: 6.0, photoUrl: "https://images.unsplash.com/photo-1598965675045-8e1e099edc5c?w=400", dietaryTags: '["vegetarian","gluten-free"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: null, allergenWarning: null },
        ],
      },
      "3": {
        vendor: { id: 3, name: "Robert Hill", businessName: "Hill Country Honey", bio: "Raw, unfiltered honey from our hives in the Texas Hill Country.", address: "8901 TX-71, Austin, TX 78735", photoUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400", verified: false },
        listings: [
          { id: 6, title: "Wildflower Honey — 16oz", description: "Raw, unfiltered wildflower honey from spring blooms.", price: 14.0, photoUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400", dietaryTags: '["gluten-free"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: null, allergenWarning: null },
          { id: 7, title: "Mesquite Honey — 8oz", description: "Dark, bold honey from mesquite blossoms.", price: 10.0, photoUrl: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400", dietaryTags: '["gluten-free"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: null, allergenWarning: null },
        ],
      },
      "4": {
        vendor: { id: 4, name: "Patricia Johnson", businessName: "Texas Pie Company", bio: "Award-winning pies made from scratch with Texas pecans, seasonal fruits, and lots of love.", address: "4200 S Lamar Blvd, Austin, TX 78704", photoUrl: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400", verified: true },
        listings: [
          { id: 9, title: "Texas Pecan Pie", description: "Our blue-ribbon pecan pie with Texas pecans. 9-inch.", price: 28.0, photoUrl: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400", dietaryTags: '["vegetarian"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: "Pecans, eggs, butter, brown sugar, vanilla, flour, corn syrup", allergenWarning: "Contains nuts, eggs, dairy, wheat" },
          { id: 10, title: "Seasonal Fruit Pie", description: "Summer peach and berry pie with a lattice top.", price: 26.0, photoUrl: "https://images.unsplash.com/photo-1568571780765-9276ac2c48c9?w=400", dietaryTags: '["vegetarian"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: "Peaches, mixed berries, sugar, butter, flour, lemon juice", allergenWarning: "Contains dairy, wheat" },
        ],
      },
      "5": {
        vendor: { id: 5, name: "David & Sarah Martinez", businessName: "Sunset Farms Produce", bio: "Family-run organic vegetable farm in North Austin.", address: "11501 Rock Rose Ave, Austin, TX 78758", photoUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400", verified: true },
        listings: [
          { id: 11, title: "Weekly Veggie Box", description: "A curated box of seasonal organic vegetables.", price: 25.0, photoUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400", dietaryTags: '["vegan","gluten-free"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: null, allergenWarning: null },
          { id: 12, title: "Heirloom Tomato Basket", description: "5 lbs of mixed heirloom tomatoes.", price: 15.0, photoUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400", dietaryTags: '["vegan","gluten-free"]', pickupWindowStart: new Date(Date.now() + 86400000).toISOString(), pickupWindowEnd: new Date(Date.now() + 100800000).toISOString(), ingredients: null, allergenWarning: null },
        ],
      },
    };

    const data = vendors[vendorId];
    if (!data) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  }

  return NextResponse.json({ vendors: MOCK_VENDORS });
}
