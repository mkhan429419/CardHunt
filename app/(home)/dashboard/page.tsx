import Image from "next/image";
import Link from "next/link";
import { PiBell, PiGear } from "react-icons/pi";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // Ensure CardDescription is imported
import { Separator } from "@/components/ui/separator";
import { auth } from "@/auth";
import {
  getOwnerFlashcardCollections,
  getUserTotalComments,
  getUserTotalUpvotes,
  getUserRecentActivity, // Ensure this is imported
} from "@/lib/server-actions";
import OverviewChart from "@/components/overview-chart";
import RecentActivity from "@/components/recent-activity";
import LogoSmall from "@/public/logo/logo-small.png";

const UserDashboard = async () => {
  const authenticatedUser = await auth();

  if (
    !authenticatedUser ||
    !authenticatedUser.user ||
    !authenticatedUser.user.id
  ) {
    return <p>You must be logged in to view this page.</p>;
  }

  const userId = authenticatedUser.user.id;

  const flashcardCollections = await getOwnerFlashcardCollections();
  const totalUpvotes = await getUserTotalUpvotes(userId!); 
  const totalComments = await getUserTotalComments(userId!);
  const recentActivity = await getUserRecentActivity(userId!); 

  const data = {
    totalPosts: flashcardCollections.length,
    totalUpvotes,
    totalComments,
  };

  return (
    <div className="px-8 md:px-20">
      <div>
        <div className="flex justify-between items-center">
          <div className="flex gap-x-6 items-center py-10">
            <Link href={"/"}>
              <Image
                src={authenticatedUser.user.image || LogoSmall} 
                alt="User Profile"
                width={500}
                height={500}
                className="w-20 h-20 md:w-40 md:h-40 border rounded-md cursor-pointer"
              />
            </Link>

            <div className="hidden md:block">
              <h1 className="text-3xl font-bold">
                Welcome back, {authenticatedUser.user.name}
              </h1>
              <p className="text-gray-500">
                Here&apos;s an overview of your activity
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-bold">Total Posts</CardTitle>
              📑
            </CardHeader>
            <CardContent>{flashcardCollections.length}</CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-bold">Total Upvotes</CardTitle>
              🔺
            </CardHeader>
            <CardContent>{totalUpvotes}</CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-bold">
                Total Comments
              </CardTitle>
              💬
            </CardHeader>
            <CardContent>{totalComments}</CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-7 my-4 gap-4">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle className="pb-10">Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <OverviewChart data={data} />
            </CardContent>
          </Card>

          <Card className="w-full col-span-4 md:col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>View recent activity</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivity activity={recentActivity} />
            </CardContent>
          </Card>
        </div>

        <Separator className="my-10" />
      </div>
    </div>
  );
};

export default UserDashboard;

