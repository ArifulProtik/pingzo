import FriendList from './friend-list';
import PendingFriend from './pending-friend';
import SearchUser from './search-user';

interface FriendsPageProps {}

const FriendsPage = ({}: FriendsPageProps) => {
  return (
    <main className="max-h-full h-full w-full">
      <div className="text-center bg-accent py-2 font-medium border-b">
        Friends
      </div>

      <div className="flex text-center h-full">
        <div className="border-r h-full w-2/8">
          <div className="text-muted-foreground py-2 border-b">
            Pending request
          </div>
          <PendingFriend />
        </div>
        <div className="flex-1 border-r h-full">
          <FriendList />
        </div>
        <div className="w-2/8">
          <SearchUser />
        </div>
      </div>
    </main>
  );
};

export default FriendsPage;
