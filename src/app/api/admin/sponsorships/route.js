import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Sponsorship from '@/models/Sponsorship.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.memberType !== 'Admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    await dbConnect();
    
    const sponsorships = await Sponsorship.find({})
      .populate('sponsor', 'name email phone image')
      .sort({ createdAt: -1 });
    
    return NextResponse.json(sponsorships);
  } catch (error) {
    console.error('Error fetching sponsorships:', error);
    return NextResponse.json(
      { message: 'Failed to fetch sponsorships', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.memberType !== 'Admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    await dbConnect();
    
    const data = await request.json();
    
    if (!data.sponsor || !data.amount) {
      return NextResponse.json(
        { message: 'Sponsor and amount are required' },
        { status: 400 }
      );
    }
    
    if (isNaN(data.amount) || data.amount <= 0) {
      return NextResponse.json(
        { message: 'Amount must be a positive number' },
        { status: 400 }
      );
    }
    
    const newSponsorship = await Sponsorship.create(data);
    
    await newSponsorship.populate('sponsor', 'name email phone image');
    
    return NextResponse.json(
      newSponsorship,
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating sponsorship:', error);
    return NextResponse.json(
      { message: 'Failed to create sponsorship', error: error.message },
      { status: 500 }
    );
  }
}