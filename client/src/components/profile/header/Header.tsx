import { Card, CardContent } from "@/components/ui/card.tsx";

import { Avatar, Banner, Info, Stats } from "./index";
import { User } from "@/types/profile.ts";

interface ProfileHeaderProps {
  user: User;
}

export const Header = ({ user }: ProfileHeaderProps) => {
  return (
    <section id="profile">
      <Card className="mb-8 overflow-hidden">
        {user.rssRegistered && <Banner lastPosted={user.lastPosted} />}

        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex space-x-6">
              <Avatar user={user} />
              <Info user={user} />
            </div>
          </div>

          <Stats totalPosts={user.totalPosts} totalViews={user.totalViews} topicsCount={user.topics.length} />
        </CardContent>
      </Card>
    </section>
  );
};
