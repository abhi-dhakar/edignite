import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog.model";

export async function GET() {
    try {
        await dbConnect();

        const mockBlogs = [
            {
                title: "Sustainability in the Modern Urban Landscape",
                excerpt: "Discover how urban communities are redesigning their spaces to foster biodiversity and reduce carbon footprints through intentional architectural shifts.",
                content: `
          <p>The transition toward sustainable urban environments is no longer a luxury—it is an existential necessity. As we look at the growing density of our cities, we must ask: how can we coexist with nature in a way that is mutually restorative?</p>
          <h3>The Vertial Forest Initiative</h3>
          <p>One of the most promising developments in urban planning is the integration of high-density greenery into residential structures. These "vertical forests" not only provide natural insulation but also act as massive air filters for the city's inhabitants.</p>
          <blockquote>"Architecture should be an extension of the natural world, not a replacement for it."</blockquote>
          <p>By using drought-resistant native plant species, these buildings manage their own microclimates, significantly reducing the energy required for cooling during extreme heatwaves.</p>
          <h3>Water Conservation and Greywater Recycling</h3>
          <p>Modern initiatives are now focusing on the circularity of resources. Closed-loop water systems within apartment complexes allow for the reuse of greywater for irrigation and sanitation, cutting municipal demand by up to 40%.</p>
        `,
                image: "https://images.unsplash.com/photo-1518005020250-6e50495121c0?q=80&w=2000&auto=format&fit=crop",
                category: "Sustainability",
                author: {
                    name: "Elias Thorne",
                    image: null
                },
                readTime: "8 min read",
                tags: ["Urban", "GreenEnergy", "Architecture"],
                isFeatured: true
            },
            {
                title: "Empowering Educators in Remote Regions",
                excerpt: "A deep dive into how mobile technology and satellite internet are breaking the barriers of traditional education for children in the Himalayas.",
                content: `
          <p>Access to quality education has historically been a privilege of geography. However, the digital revolution is finally reaching the most remote peaks of our planet.</p>
          <h3>Satellite Connectivity as a Human Right</h3>
          <p>With the deployment of low-earth orbit satellite constellations, schools that once lacked even basic electricity are now connecting to global knowledge repositories.</p>
          <p>Our recent initiative in the Ladakh region has provided tablet-based learning modules to over 500 students, allowing them to follow STEM curriculums in real-time alongside peers in major metropolitan areas.</p>
        `,
                image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2000&auto=format&fit=crop",
                category: "Education",
                author: {
                    name: "Sarah Jenkins",
                    image: null
                },
                readTime: "6 min read",
                tags: ["DigitalDivide", "STEM", "Inclusion"],
                isFeatured: false
            },
            {
                title: "The Silent Strength of Community Gardens",
                excerpt: "How small-scale community gardening is transforming neighborhood dynamics and fostering deep mental health resilience among residents.",
                content: `
          <p>In the noise of modern life, the simple act of planting a seed can be a radical form of therapy. Community gardens are becoming the focal points of neighborhood revitalization.</p>
          <p>Beyond the fresh produce, these spaces offer a venue for intergenerational interaction. Elders share traditional wisdom with the youth, while everyone benefits from the restorative effects of manual labor in a natural setting.</p>
        `,
                image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2000&auto=format&fit=crop",
                category: "Community",
                author: {
                    name: "Marcus Aurelius",
                    image: null
                },
                readTime: "5 min read",
                tags: ["MentalHealth", "Gardening", "SocialCohesion"],
                isFeatured: false
            }
        ];

        // Clear existing blogs for setting up a clean demo
        await Blog.deleteMany({});

        // Insert mock data
        await Blog.insertMany(mockBlogs);

        return NextResponse.json({ message: "Seed successful", count: mockBlogs.length }, { status: 200 });
    } catch (error) {
        console.error("Seed Error:", error);
        return NextResponse.json({ message: "Seed failed" }, { status: 500 });
    }
}
