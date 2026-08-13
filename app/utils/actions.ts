"use server";

import prisma from "@/lib/db";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { inngest } from "@/lib/inngest";

export async function syncUserToDatabase(user: KindeUser) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email || "",
          name: user.given_name + " " + user.family_name,
        },
      });
    }
  } catch (error) {
    console.error("Error syncing user:", error);
  }
}

/**
 * Cancels any pending tests for a specific domain.
 * Scoped to a single domain to avoid corrupting other users' data.
 */
async function cancelPendingTestsForDomain(domainId: number) {
  await prisma.test.updateMany({
    where: {
      domainId: domainId,
      status: "pending",
    },
    data: {
      status: "cancelled",
    },
  });
}

interface Domain {
  url: string;
  device: string;
  network: string;
  userID: string;
}

export async function submitDomain(data: Domain) {
  let test;
  try {
    const existingDomain = await prisma.domain.findFirst({
      where: {
        url: data.url,
        ownerId: data.userID,
      },
    });

    if (existingDomain) {
      // Only cancel pending tests for THIS specific domain
      await cancelPendingTestsForDomain(existingDomain.id);
      test = await prisma.test.create({
        data: {
          domainId: existingDomain.id,
          status: "pending",
        },
      });
    } else {
      const domain = await prisma.domain.create({
        data: {
          url: data.url,
          device: data.device,
          network: data.network,
          ownerId: data.userID,
        },
      });

      // New domain — no pending tests to cancel
      test = await prisma.test.create({
        data: {
          domainId: domain.id,
          status: "pending",
        },
      });
    }

    // Trigger Inngest function
    await inngest.send({
      name: "test/run-audit",
      data: {
        testId: test.id,
        url: data.url,
        device: data.device,
        network: data.network,
      },
    });

    return {
      success: true,
      message: "Test queued successfully",
      testId: test.id,
    };
  } catch (error) {
    console.error("❌ Error submitting domain:", error);

    if (error instanceof Error) {
      throw new Error(`Failed to submit domain: ${error.message}`);
    }
    throw new Error("Failed to submit domain");
  }
}

export async function getTestStatus(id: number) {
  try {
    const test = await prisma.test.findUnique({
      where: {
        id: id,
      },
    });
    return test;
  } catch (error) {
    console.error("Error getting test status:", error);
    throw new Error("Failed to get test status");
  }
}

export async function getRecentTests(userID: string) {
  try {
    const tests = await prisma.test.findMany({
      where: {
        domain: {
          ownerId: userID,
        },
      },
      include: {
        domain: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return tests;
  } catch (error) {
    console.error("Error getting recent tests:", error);
    throw new Error("Failed to get recent tests");
  }
}
