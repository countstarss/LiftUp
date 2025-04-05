export const dynamic = 'force-dynamic';
import { ChatRoom } from "./_components/chat/chat-room";

export default function Square() {
  //MARK: 获取频道信息

  return (
    <div className="w-full flex flex-col h-[calc(100vh-24px)]">
      <ChatRoom channelId="public" type="public"/>
    </div>
  );
}