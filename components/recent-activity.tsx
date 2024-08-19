import Image from "next/image";

interface RecentActivityProps {
  activity: any[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activity }) => {
  return (
    <div className="space-y-4">
      {activity.map((act: any) => (
        <div key={act.id} className="flex items-center gap-x-6 w-full">
          <Image
            src={act.user.image}
            width={50}
            height={50}
            alt="user"
            className="rounded-full h-8 w-8"
          />
          <div className="text-gray-500">
            {act.type === "UPVOTE" &&
              `${act.user.name} upvoted your flashcard.`}
            {act.type === "COMMENT" &&
              `${act.user.name} commented on your flashcard.`}
          </div>
          <div className="text-xs text-gray-800">
            {new Date(act.createdAt).toDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;
