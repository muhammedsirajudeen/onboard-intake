import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { withLoggingAndErrorHandling } from '@/app/api/middleware/errorHandler';
import RouteError from '@/app/api/error/routeError';
import User from '@/app/models/user.model';
import connectDB from '@/lib/mongodb';

// GET /api/user/profile - Fetch current user's profile
async function getHandler() {
    const session = await getSession();

    if (!session) {
        throw new RouteError('Not authenticated', 401);
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email }).select(
        'name email picture socialLinks profileCompleted videoUrl videoRecorded videoRecordedAt hireableStatus strengths weaknesses isBeginnerLevel skipGithub'
    );

    if (!user) {
        throw new RouteError('User not found', 404);
    }

    return NextResponse.json({
        success: true,
        user: {
            name: user.name,
            email: user.email,
            picture: user.picture,
            socialLinks: user.socialLinks || {},
            profileCompleted: user.profileCompleted,
            videoUrl: user.videoUrl,
            videoRecorded: user.videoRecorded,
            videoRecordedAt: user.videoRecordedAt,
            hireableStatus: user.hireableStatus,
            strengths: user.strengths,
            weaknesses: user.weaknesses,
            isBeginnerLevel: user.isBeginnerLevel,
            skipGithub: user.skipGithub,
        },
    });
}

// PUT /api/user/profile - Update user's social links
async function putHandler(request: NextRequest) {
    const session = await getSession();

    if (!session) {
        throw new RouteError('Not authenticated', 401);
    }

    const body = await request.json();
    const { socialLinks, skipGithub } = body;

    // If user is skipping GitHub, mark as beginner level
    if (skipGithub) {
        await connectDB();

        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            {
                $set: {
                    isBeginnerLevel: true,
                    skipGithub: true,
                    profileCompleted: true,
                },
            },
            { new: true }
        ).select('name email picture isBeginnerLevel skipGithub profileCompleted');

        if (!user) {
            throw new RouteError('User not found', 404);
        }

        return NextResponse.json({
            success: true,
            message: 'Profile updated as beginner level',
            user: {
                name: user.name,
                email: user.email,
                picture: user.picture,
                isBeginnerLevel: user.isBeginnerLevel,
                skipGithub: user.skipGithub,
                profileCompleted: user.profileCompleted,
            },
        });
    }

    // Validate GitHub is provided for non-beginner flow
    if (!socialLinks?.github || socialLinks.github.trim() === '') {
        throw new RouteError('GitHub profile is required', 400);
    }

    // Basic URL validation helper
    const isValidUrl = (url: string) => {
        if (!url || url.trim() === '') return true; // Optional fields
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    // Validate all provided URLs
    const urlFields = ['github', 'gitlab', 'medium', 'devto', 'twitter', 'linkedin', 'website'];
    for (const field of urlFields) {
        if (socialLinks[field] && !isValidUrl(socialLinks[field])) {
            throw new RouteError(`Invalid URL format for ${field}`, 400);
        }
    }

    await connectDB();

    const user = await User.findOneAndUpdate(
        { email: session.user.email },
        {
            $set: {
                socialLinks: {
                    github: socialLinks.github?.trim(),
                    gitlab: socialLinks.gitlab?.trim() || undefined,
                    medium: socialLinks.medium?.trim() || undefined,
                    devto: socialLinks.devto?.trim() || undefined,
                    twitter: socialLinks.twitter?.trim() || undefined,
                    linkedin: socialLinks.linkedin?.trim() || undefined,
                    website: socialLinks.website?.trim() || undefined,
                },
                profileCompleted: true,
            },
        },
        { new: true }
    ).select('name email picture socialLinks profileCompleted');

    if (!user) {
        throw new RouteError('User not found', 404);
    }

    return NextResponse.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
            name: user.name,
            email: user.email,
            picture: user.picture,
            socialLinks: user.socialLinks,
            profileCompleted: user.profileCompleted,
        },
    });
}

export const GET = withLoggingAndErrorHandling(getHandler);
export const PUT = withLoggingAndErrorHandling(putHandler);
