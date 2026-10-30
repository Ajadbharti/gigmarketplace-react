const p = (seed) => `https://picsum.photos/seed/${seed}/600/400`;

export const seedFreelancers = [
  {
    id: "f1", name: "Riya Sharma", headline: "Full-Stack React & Next.js Developer",
    bio: "I build fast, accessible web apps for startups and agencies. 6+ years turning ideas into polished products with React, Next.js and Node.",
    avatar: "https://i.pravatar.cc/200?img=32", location: "Pune, India", experience: "6 years",
    skills: ["React", "Next.js", "Tailwind CSS", "Node.js", "REST APIs"], languages: ["English", "Hindi"],
    website: "https://example.com/riya", baseCompletedOrders: 42,
    portfolio: [
      { id: "p1", title: "SaaS Analytics Dashboard", image: p("riya1") },
      { id: "p2", title: "E-commerce Storefront", image: p("riya2") },
    ],
  },
  {
    id: "f2", name: "Daniel Carter", headline: "Brand & Logo Designer",
    bio: "Brand strategist and designer helping small businesses look like industry leaders. I focus on simple, memorable identities.",
    avatar: "https://i.pravatar.cc/200?img=15", location: "Manchester, UK", experience: "8 years",
    skills: ["Logo Design", "Brand Identity", "Illustrator", "Typography"], languages: ["English"],
    website: "https://example.com/daniel", baseCompletedOrders: 87,
    portfolio: [
      { id: "p1", title: "Coffee Brand Identity", image: p("daniel1") },
      { id: "p2", title: "Fintech Logo System", image: p("daniel2") },
    ],
  },
  {
    id: "f3", name: "Sofia Alvarez", headline: "SEO Strategist & Content Writer",
    bio: "I help websites earn organic traffic through technical SEO, smart keyword strategy and content that actually reads well.",
    avatar: "https://i.pravatar.cc/200?img=45", location: "Madrid, Spain", experience: "7 years",
    skills: ["Technical SEO", "Keyword Research", "Copywriting", "Link Building"], languages: ["English", "Spanish"],
    website: "https://example.com/sofia", baseCompletedOrders: 65,
    portfolio: [
      { id: "p1", title: "Traffic +240% for a SaaS blog", image: p("sofia1") },
      { id: "p2", title: "Local SEO for a dental chain", image: p("sofia2") },
    ],
  },
  {
    id: "f4", name: "Kabir Singh", headline: "Video Editor & Social Media Manager",
    bio: "Storytelling-first editor for YouTubers and brands. I also run social channels so your content stays consistent.",
    avatar: "https://i.pravatar.cc/200?img=53", location: "Delhi, India", experience: "5 years",
    skills: ["Premiere Pro", "After Effects", "Reels & Shorts", "Content Calendar"], languages: ["English", "Hindi", "Punjabi"],
    website: "https://example.com/kabir", baseCompletedOrders: 58,
    portfolio: [
      { id: "p1", title: "Travel Vlog Series", image: p("kabir1") },
      { id: "p2", title: "Product Launch Reel", image: p("kabir2") },
    ],
  },
  {
    id: "f5", name: "Emily Zhang", headline: "Product Designer (UI/UX)",
    bio: "I design clear, user-tested interfaces for web and mobile products, from research and wireframes to final Figma handoff.",
    avatar: "https://i.pravatar.cc/200?img=25", location: "Toronto, Canada", experience: "9 years",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"], languages: ["English", "Mandarin"],
    website: "https://example.com/emily", baseCompletedOrders: 73,
    portfolio: [
      { id: "p1", title: "Banking App Redesign", image: p("emily1") },
      { id: "p2", title: "Healthcare Portal UX", image: p("emily2") },
    ],
  },
  {
    id: "f6", name: "Arjun Patel", headline: "Mobile App Developer (React Native & Flutter)",
    bio: "I ship cross-platform mobile apps from MVP to store release. Clean architecture, smooth animations, reliable builds.",
    avatar: "https://i.pravatar.cc/200?img=60", location: "Ahmedabad, India", experience: "6 years",
    skills: ["React Native", "Flutter", "Firebase", "App Store Release"], languages: ["English", "Hindi", "Gujarati"],
    website: "https://example.com/arjun", baseCompletedOrders: 39,
    portfolio: [
      { id: "p1", title: "Fitness Tracking App", image: p("arjun1") },
      { id: "p2", title: "Food Delivery MVP", image: p("arjun2") },
    ],
  },
];