import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Donation from "@/models/Donation.model";
import Volunteer from "@/models/Volunteer.model";
import Sponsorship from "@/models/Sponsorship.model";
import Event from "@/models/Event.model";
import Story from "@/models/Story.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.memberType !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const [donations, volunteers, sponsorships, events, stories] =
      await Promise.all([
        Donation.find({})
          .populate("donor", "name email image")
          .sort({ createdAt: -1 })
          .limit(50),

        Volunteer.find({})
          .populate("user", "name email image")
          .sort({ createdAt: -1 })
          .limit(50),
        Sponsorship.find({})
          .populate("sponsor", "name email image")
          .sort({ createdAt: -1 })
          .limit(50),

        Event.find({ date: { $gte: new Date() } })
          .sort({ date: 1 })
          .limit(10),

        Story.find({}).sort({ createdAt: -1 }).limit(20),
      ]);

    const stats = {
      totalDonations: await Donation.countDocuments({}),
      totalDonationAmount: donations
        .filter((d) => d.paymentStatus === "Completed")
        .reduce((sum, donation) => sum + donation.amount, 0),
      totalVolunteers: await Volunteer.countDocuments({}),
      pendingVolunteers: await Volunteer.countDocuments({ status: "Pending" }),
      totalSponsors: await Sponsorship.countDocuments({ status: "Active" }),
      totalEvents: await Event.countDocuments({}),
      totalStories: await Story.countDocuments({}),
    };

    const recentDonations = donations.slice(0, 5);
    const recentVolunteers = volunteers.slice(0, 5);
    const recentSponsors = sponsorships.slice(0, 5);
    const upcomingEvents = events.slice(0, 5);

    return NextResponse.json({
      stats,
      recentDonations,
      recentVolunteers,
      recentSponsors,
      upcomingEvents,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { message: "Failed to fetch dashboard data", error: error.message },
      { status: 500 }
    );
  }
}
