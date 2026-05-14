import bcrypt from "bcryptjs";
import Property from "./models/Property.js";
import User from "./models/User.js";

const SEED = [
  {
    title: "NeoGlass Sky Estate",
    location: "DHA Phase 6, Lahore",
    price: "PKR 4,85,00,000",
    priceShort: "4.85 Cr",
    type: "House",
    beds: 5,
    baths: 4,
    area: "1 Kanal",
    tag: "Featured",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    agent: "Ali Hassan",
    agentImg: "https://randomuser.me/api/portraits/men/32.jpg",
    description: "Futuristic glass facade, smart home, infinity pool.",
  },
  {
    title: "Pulse Tower Penthouse",
    location: "Gulberg III, Lahore",
    price: "PKR 2,20,00,000",
    priceShort: "2.20 Cr",
    type: "Apartment",
    beds: 3,
    baths: 2,
    area: "2,400 sqft",
    tag: "New",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    agent: "Sara Malik",
    agentImg: "https://randomuser.me/api/portraits/women/44.jpg",
    description: "Corner unit, 270° skyline, private elevator lobby.",
  },
  {
    title: "Crimson Ridge Farmhouse",
    location: "Bahria Town, Islamabad",
    price: "PKR 9,50,00,000",
    priceShort: "9.50 Cr",
    type: "Farmhouse",
    beds: 7,
    baths: 6,
    area: "4 Kanal",
    tag: "Exclusive",
    img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    agent: "Kamran Shah",
    agentImg: "https://randomuser.me/api/portraits/men/55.jpg",
    description: "Resort-style courtyards, chef kitchen, cinema room.",
  },
  {
    title: "Harborline Penthouse",
    location: "Clifton Block 5, Karachi",
    price: "PKR 6,75,00,000",
    priceShort: "6.75 Cr",
    type: "Penthouse",
    beds: 4,
    baths: 3,
    area: "3,800 sqft",
    tag: "Hot Deal",
    img: "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&q=80",
    agent: "Nadia Rauf",
    agentImg: "https://randomuser.me/api/portraits/women/68.jpg",
    description: "Sea-facing terraces, marble spa, wine wall.",
  },
  {
    title: "Monolith Villa",
    location: "Model Town, Lahore",
    price: "PKR 3,10,00,000",
    priceShort: "3.10 Cr",
    type: "House",
    beds: 4,
    baths: 3,
    area: "10 Marla",
    tag: "Featured",
    img: "https://images.unsplash.com/photo-1600573472550-8090b5e07410?w=800&q=80",
    agent: "Usman Tariq",
    agentImg: "https://randomuser.me/api/portraits/men/22.jpg",
    description: "Brutalist-modern blend, triple-height atrium.",
  },
  {
    title: "Altitude Executive Suites",
    location: "F-7 Markaz, Islamabad",
    price: "PKR 1,80,00,000",
    priceShort: "1.80 Cr",
    type: "Apartment",
    beds: 2,
    baths: 2,
    area: "1,600 sqft",
    tag: "New",
    img: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80",
    agent: "Fatima Zahra",
    agentImg: "https://randomuser.me/api/portraits/women/12.jpg",
    description: "Floor-to-ceiling glass, concierge, EV charging.",
  },
  {
    title: "Obsidian Bungalow",
    location: "DHA Phase 2, Karachi",
    price: "PKR 5,60,00,000",
    priceShort: "5.60 Cr",
    type: "House",
    beds: 6,
    baths: 5,
    area: "500 sqyd",
    tag: "Hot Deal",
    img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
    agent: "Bilal Chaudhry",
    agentImg: "https://randomuser.me/api/portraits/men/41.jpg",
    description: "Indoor-outdoor living, rooftop deck, smart climate.",
  },
  {
    title: "Vertex Plot",
    location: "Johar Town, Lahore",
    price: "PKR 1,25,00,000",
    priceShort: "1.25 Cr",
    type: "Plot",
    beds: 0,
    baths: 0,
    area: "1 Kanal",
    tag: "Featured",
    img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
    agent: "Hina Baig",
    agentImg: "https://randomuser.me/api/portraits/women/33.jpg",
    description: "Corner plot, utilities marked, ready for bespoke build.",
  },
];

export async function seedPropertiesIfEmpty() {
  const count = await Property.countDocuments();
  if (count === 0) {
    await Property.insertMany(SEED);
    console.log("Seeded properties");
  }
}

/** In-app routing for “message agent” flows when agents are not real users */
export async function seedSupportUser() {
  let u = await User.findOne({ email: "support@zexan.pk" });
  if (!u) {
    const passwordHash = await bcrypt.hash("support-demo-99", 10);
    u = await User.create({
      name: "Zexan Concierge",
      email: "support@zexan.pk",
      passwordHash,
    });
    console.log("Seeded support user for chat routing");
  }
  return u._id.toString();
}
